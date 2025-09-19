<template>
  <div class="extend-sub-table-fields">
    <div class="form-item">
      <el-button :disabled="!tableId" size="mini" @click="showDialog = true">点击配置</el-button>
    </div>

    <el-dialog append-to-body class="column-config-dialog" title="表格字段配置" :visible.sync="showDialog" :before-close="handleClose" :width="showEditor ? '80%' : '50%'">
      <div v-if="showDialog">
        <div class="column-config-header">
          <div class="span display">显示</div>
          <div class="span move">排序</div>
          <div class="span name">名称</div>
          <div class="span editor" v-if="showEditor">编辑类型</div>
          <div class="span required" v-if="showEditor">必填</div>
          <div class="span align">对齐方式</div>
          <div class="span width">列宽(px)</div>
          <div class="span vtype" v-if="showEditor">格式校验</div>
        </div>
        <div class="column-config-list">
          <draggable :list="columns" :handle="'.move'" @start="drag = true" @end="drag = false" @change="change" direction="vertical">
            <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
            <column-config @change="change" class="" v-for="item in columns" :key="item.field" :field="item" :showEditor="showEditor" />
            <!-- </transition-group> -->
          </draggable>
        </div>
      </div>

      <span slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="save" size="mini">确 定</el-button>
        <el-button @click="beforeClose()" size="mini">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ColumnConfig from './ColumnConfig.vue';
import merge from 'lodash.merge';
import { copy } from '../../util/index.js';
import getDataWithCache from '@/util/getDataWithCache.js';

const baseColumnData = {
  width: 100,
  align: 'center',
  required: false,
  controlType: '',
  vtype: ''
};

export default {
  name: 'extend-sub-table-fields',
  components: { ColumnConfig, draggable },
  props: ['controlData'],
  computed: {
    tableId() {
      return this.controlData.sourceTable;
    },
    // 记录表里的所有字段
    fieldMap() {
      const map = {};
      this.fieldList.forEach(item => {
        map[item.field] = item;
      });

      return map;
    },
    showEditor() {
      return this.controlData.editType != 'dialog';
    }
  },
  mounted() {
    this.getFields();
  },
  data() {
    return {
      // 数据表的所有字段
      fieldList: [],
      // 用于列配置的数组 将合并控件已经配置的列 并加上数据表里的字段
      columns: [],
      showDialog: false,
      loading: false,
      drag: false,
      dataChanged: false
    };
  },
  methods: {
    /**
     * 获取用于配置的列
     */
    getConfigColumns() {
      if (!this.fieldList.length) {
        this.columns = [];
        return;
      }
      const controlColumns = this.controlData.columns || [];

      // 控件上没有配置过列 那么直接取所有字段 并默认勾选
      if (!controlColumns.length) {
        this.columns = this.fieldList.map(field => {
          const c = merge({}, baseColumnData, field);
          c.display = true;
          return c;
        });
      } else {
        // 配置过之后 先展示控件上已经配置好的列 再展示其他可选字段生成的列
        const columns = [];
        const existed = {};
        controlColumns.forEach(c => {
          // 需确认配置的列 是在对应数据表中字段中的 防止出现无效列
          if (this.fieldMap[c.field]) {
            existed[c.field] = true;
            columns.push(merge({}, baseColumnData, c));
          }
        });

        this.fieldList.forEach(item => {
          if (!existed[item.field]) {
            columns.push(merge({}, baseColumnData, item));
          }
        });
        this.columns = columns;
      }
    },
    /**
     * 获取用配置好的列
     */
    getRealColumns() {
      if (!this.columns.length) return [];

      // 过滤出勾选的
      const showColumns = copy(this.columns).filter(c => c.display);

      // 处理数据
      showColumns.forEach(c => {
        // 仅文本框才具有 vtype
        if (c.controlType && c.controlType != 'textbox') {
          c.vtype = '';
        }
      });

      return showColumns;
    },
    change() {
      console.log('change');
      this.dataChanged = true;
    },
    beforeClose(done) {
      if (this.dataChanged) {
        this.$confirm('确认不保存直接关闭？')
          .then(() => {
            if (done) {
              done();
            } else {
              this.showDialog = false;
            }
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        this.showDialog = false;
      }
    },
    handleClose(done) {
      this.beforeClose(done);
    },
    getFields() {
      if (!this.tableId) {
        return (this.fieldList = []);
      }
      this.loading = true;
      // this.$httpPost(window.formDesignerActions.getSubTableInfoUrl, { tableId: this.tableId })
      getDataWithCache(window.formDesignerActions.getSubTableInfoUrl, { tableId: this.tableId }, 'subTableData-' + this.tableId)
        .then(res => {
          const data = res.SubTableStruct;
          if (Array.isArray(data)) {
            // 转化字符串的 0 1
            data.forEach(item => {
              item.required = parseInt(item.required, 10) == 1 ? true : false;
            });
            this.fieldList = data;
          } else {
            throw new Error('获取子表字段失败');
          }
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
        });
    },
    save() {
      const columns = this.getRealColumns();
      this.$emit('change', columns, 'columns');
      this.showDialog = false;
    }
  },
  watch: {
    tableId() {
      this.getFields();
    },
    fieldList() {
      this.getConfigColumns();
    },
    showDialog(v) {
      if (!v) {
        this.dataChanged = false;
      }
    }
  }
};
</script>

<style lang="scss">
.column-config-header {
  font-weight: bold;
}
.column-config-header,
.column-config-item {
  line-height: 28px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  text-align: center;
  justify-content: space-between;
  .span {
    flex-grow: 1;
  }
  .display,
  .move,
  .required {
    width: 30px;
  }
  .name,
  .editor {
    width: 140px;
  }
  .align {
    width: 110px;
  }
  .width {
    width: 60px;
  }
  .vtype {
    width: 120px;
  }

  .editor,
  .vtype {
    margin-left: 10px;
  }
  .el-input-number--mini {
    width: 100%;
  }
  .align-group .design-button {
    line-height: 26px;
    padding-left: 6px;
    padding-right: 6px;
    .design-button-icon {
      margin-top: 6px;
    }
  }
}
.column-config-item {
  // margin-bottom: 4px;

  &:nth-child(2n + 1) {
    background: #fafafa;
  }
  &:hover {
    // background: rgba(#51a6ef, 0.3);
    background: #f5f7fa;
  }
  &.sortable-ghost {
    opacity: 0.5;
    background: rgba(#51a6ef, 0.3);
  }
}
.column-config-dialog {
  .el-dialog {
    margin-bottom: 0;
  }
  .el-dialog__body {
    padding-top: 40px;
    padding-bottom: 10px;
    // padding-right: 10px;
    // max-height: 75vh;
    position: relative;
  }
}
.column-config-header {
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
}
.column-config-list {
  max-height: calc(60vh);
  overflow: auto;
  box-sizing: border-box;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
