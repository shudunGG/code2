<template>
  <div class="row" :row-id="row.id" :class="className" :style="style" :data-name="row.name" :data-level="level">
    <ColLayout v-for="(col, colIndex) in row.cols" :key="col.id" :is-last-row="isLastRow" :index="colIndex" :col="col" :row="row" :level="level" :row-index="index" @on-context-menu="
          onContextmenu($event, {
            row: row, // 当前行
            rowIndex: index, // 行索引
            parentCol: parentCol, // 所在父列

            col: col, // 当前列
            colIndex: colIndex, // 列索引
            colDeletable: !!row.cols.length // 此列是否可删除
          })
        "></ColLayout>
    <!-- 行的功能按钮 -->
    <div class="row-helper">
      <el-tooltip placement="top" :enterable="false" :open-delay="300" content="移除行">
        <span @click.stop="handleRowRemove(row, index)" class="row-helper-btn remove el-icon-delete"></span>
      </el-tooltip>
      <el-tooltip placement="top" :enterable="false" :open-delay="300" content="复制行">
        <span @click="handleRowCopy(row, index, parentCol)" class="row-helper-btn copy el-icon-copy-document"></span>
      </el-tooltip>
      <el-tooltip placement="top" :enterable="false" :open-delay="300" content="选择">
        <span @click.stop="handleRowSelect(row.id)" class="row-helper-btn selected el-icon-top-left"></span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Col from './Col.vue';
import { copy, uid, colAutoIndex, controlAutoIndex, rowAutoIndex } from '../../util/index.js';
import assign from 'lodash.assign';

import contextmenu from './contextmenu.js';

export default {
  name: 'Row',
  components: {
    ColLayout: Col
  },
  inject: {
    showCtxMenu: 'showCtxMenu'
  },
  props: {
    row: {
      type: Object
    },
    index: {
      type: Number
    },
    level: {
      type: Number
    },
    parentCol: {
      type: Object,
      default: null
    },
    isLastRow: {
      type: Boolean
    },
    // 前一行
    prevRow: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState(['selectedRowId']),
    // 组件类型
    type() {
      const row = this.row;
      return row && row.type ? row.type : 'row-layout';
    },
    style() {
      const h = this.row.height;
      const height = h + '' === h ? h : h + 'px';
      const s = {};
      if (this.type == 'acc-layout') {
        s.marginTop = '16px';
        s.marginBottom = '16px';
      }
      if (this.type == 'row-layout') {
        s['min-height'] = height;
      }
      return s;
    },
    className() {
      const type = this.type;
      const s = {
        [type]: true,
        isTop: this.level == 0,
        selected: this.selectedRowId == this.row.id
      };
      if (type == 'acc-layout') {
        return s;
      }
      if (this.index === 0 || (this.prevRow && this.prevRow.type && this.prevRow.type != 'row-layout')) {
        s.first = true;
      } else {
        s.mid = true;
      }
      return s;
    }
  },
  mixins: [contextmenu],
  data() {
    return {
      // 用于ctxmenu的数据 无须响应式
      // eslint-disable-next-line vue/no-reserved-keys
      _ctxMenuData: null
    };
  },
  methods: {
    ...mapMutations(['copyRow', 'splitCol']),
    ...mapActions(['setSelectedLayout', 'deleteRow', 'activeRightTab', 'deleteControl']),
    // 行选择
    handleRowSelect(id) {
      this.setSelectedLayout({ id });
      // 行也被当做一个控件处理
      this.activeRightTab('control');
    },
    // 行复制
    handleRowCopy(row, currIndex, parentCol) {
      const newRow = this.getRowCopyData(row);
      this.copyRow({ aimIndex: currIndex + 1, parentCol, newRow, shuttle: true });
    },
    getRowCopyData(rowData, removeControl) {
      const rowCopy = copy(rowData);

      dealRow(rowCopy);

      return rowCopy;

      function dealRow(row) {
        const rowId = uid();
        const name = row.namePrefix || row.name;
        row.id = rowId;
        row.autoIndex = rowAutoIndex.getIndex(name);
        if (row.name) {
          row.name = `${row.name}_${row.autoIndex}`;
        }

        row.cols.forEach(col => {
          col.id = `col-${rowId}-${colAutoIndex.getIndex(rowId)}`;

          // 内部子行
          if (col.subs) {
            col.subs.forEach(dealRow);
          }
          // 内部控件
          if (removeControl) {
            col.controls = [];
          } else {
            col.controls.forEach(resetControl);
          }
        });
      }

      /**
       * 将控件从设为默认值
       *
       * @param {controlData} control 已有控件的数据
       */
      function resetControl(control) {
        const type = control.type;
        // const name = control.namePrefix || control.name;
        const controlConfig = window.FORM_DESIGN_CONFIG.controls[type];
        if (!controlConfig) {
          throw new Error(`控件的 ${type} 配置信息不存在，无法创建`);
        }
        const defaultControl = copy(controlConfig);
        delete defaultControl.configItems;
        delete defaultControl.name;
        delete defaultControl.width;
        delete defaultControl.id;
        delete defaultControl.type;

        // 读取 控件初始值 进行覆盖
        if (type != 'label' && type != 'title') {
          assign(control, defaultControl);
        }

        // 重设 id 和名称
        const idx = controlAutoIndex.getIndex(type);
        control.id = type + '-' + idx;
        control.autoIndex = idx;
        if (control.name) {
          control.name = `${control.name}_${idx}`;
        }
      }
    },

    // 行删除
    handleRowRemove(row, currIndex) {
      // 空行时列则不提醒
      if (this.isEmptyRow(row)) {
        return this.doRowRemove(row, currIndex);
      }
      this.$confirm('此操作将移除此行，以及此行内的所有内容，是否确认？', ' 删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.list.splice(currIndex, 1);
          this.doRowRemove(row, currIndex);
        })
        .catch(() => {
          console.log('cancel');
        });
    },
    doRowRemove(row, currIndex) {
      console.log("-----------------this.parentCol--------------");
      console.log(this.parentCol);
      this.deleteRow({
        parentCol: this.parentCol,
        row: row,
        index: currIndex
      });
    },
    /**
     * 判断某行是否wi空行 即内部不含子布局或控件
     * @param {rowData} row  行数据对象
     * @returns {Boolean} 是否为空行
     */
    isEmptyRow(row) {
      for (let col of row.cols) {
        if (col.subs.length || col.controls.length) {
          return false;
        }
      }
      return true;
    },

    // 列删除
    removeCol(data) {
      const { col, parentRow, colIndex } = data;
      // 空列则不提醒
      if (this.isEmptyCol(col)) {
        return this.doColRemove(col, parentRow, colIndex);
      }
      this.$confirm('删除后此单元格内的所有内容将一并删除，是否继续？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.doColRemove(col, parentRow, colIndex);
        })
        .catch(err => {
          if (err) {
            console.error(err);
          }
          console.log('cancel');
        });
    },
    doColRemove(col, parentRow, colIndex) {
      this.$store.dispatch('removeCol', { col, parentRow, colIndex, shuttle: true });
    },
    isEmptyCol(col) {
      return !(col.subs.length || col.controls.length);
    }
  }
};
</script>

<style lang="scss">
.row-helper {
  height: 22px;
  overflow: hidden;
  line-height: 20px;
}
</style>