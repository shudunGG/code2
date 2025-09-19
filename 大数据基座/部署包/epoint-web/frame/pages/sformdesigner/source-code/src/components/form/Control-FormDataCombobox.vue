<template>
  <div class="control-form-bind">
    <div class="form-control-item">
      <el-select :value="value" @change="change" size="small" :style="styleText" clearable placeholder="请选择关联字段" filterable>
        <el-option-group v-for="(table, i) in tables" :key="table.sqltablename || i" :label="table.name">
          <el-option v-for="(item, j) in table.fields" :key="item.actualId || (i + '_' + j)" :disabled="selectedFieldMap[item.actualId]" :value="item.actualId" :label="item.name + '(' + table.name + ')'"></el-option>
        </el-option-group>
      </el-select>
      <el-tooltip :open-delay="500" content="新增字段">
        <el-button icon="el-icon-plus" size="small" @click="handleAddField" style="margin-left: 10px; display: none"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { copy } from '../../util/index.js';
import { mapGetters, mapState } from 'vuex';
// import { mapMutations } from 'vuex';
export default {
  name: 'control-form-data-combobox',
  props: {
    // 此控件的值
    value: {
      type: String,
      require: true
    },
    // 此控件的配置
    config: {
      type: Object,
      require: true
    },
    styleText: {
      type: String,
      default: ''
    }
  },
  computed: {
    controlType() {
      const sid = this.$store.state.selectedControlId;

      if (sid) {
        const data = this.$store.getters.controlDataMap[sid];
        if (data && data.control) {
          return data.control.type;
        }
      }

      return null;
    },
    ...mapState(['fieldList']),
    ...mapGetters(['selectedFieldMap']),
    tables() {
      const type = this.controlType;
      const tables = copy(this.fieldList);

      // 新创建的字段
      const newFieldList = copy(this.$store.state.newFieldList);

      const isNewType = !this.value || /#/.test(this.value);

      // 根据控件类型 过滤置顶推荐字段
      const relatedFields = [];
      tables.forEach((table, i) => {
        // 第一张表为主表 新创建的字段将插入在这
        if (i == 0 && newFieldList.length) {
          table.fields = newFieldList.concat(table.fields);
        }
        table.fields.forEach(item => {
          // 拼接id 为 表 id ; 字段id
          // item.field = table.id + ';' + item.field;
          // if (isNewType) {
          //   // 新模式并兼容老数据，格式为 表id#表name;字段id#字段name
          //   item.actualId = `${table.id || ''}#${table.sqltablename || ''};${item.field || ''}#${item.fieldname || ''}`;
          // } else {
          //   // 老的模式，格式为： 表id;字段id
          //   item.actualId = table.id + ';' + item.field;
          // }
          item.actualId = this.joinId(table, item, isNewType);
          if (type && item.fielddisplaytype == type) {
            relatedFields.push(copy(item));
          }
        });
      });
      if (relatedFields.length) {
        const adjusts = {
          name: '相关字段',
          id: 'adapts',
          fields: relatedFields
        };
        tables.unshift(adjusts);
      }

      return tables;
    }
  },
  methods: {
    /**
     * 拼接 实际的 id
     * @param {Object} table 表信息
     * @param {Object} item  字段信息
     * @param {boolean} isNewType  是否是新格式
     * @return {string} 拼接后的字段信息
     *
     * 新模式并兼容老数据，格式为 表id#表name;字段id#字段name
     * 老的模式，格式为： 表id;字段id
     */
    joinId(table, item, isNewType) {
      if (isNewType) {
        // 新模式并兼容老数据，格式为 表id#表name;字段id#字段name
        // return `${table.id || ''}#${table.sqltablename || ''};${item.field || ''}#${item.fieldname || ''}`;
        // 新模式并兼容老数据，格式为 #表name;#字段name
        return `#${table.sqltablename || ''};#${item.fieldname || ''}`;
      } else {
        // 老的模式，格式为： 表id;字段id
        return table.id + ';' + item.field;
      }
    },
    change(value) {
      let v = value;
      if (value && !/#/.test(value)) {
        // 保存时候更新为新模式
        v = this.getNewBindValue(value);
      }
      this.$emit('change', v, this.config);
    },
    /**
     * 根据老格式的bind获取新格式的bind
     * @param {string} oldValue 老格式： 表id;字段id
     * @returns {string}  新格式： 表id#表name;字段id#字段name
     */
    getNewBindValue(oldValue) {
      const [tid, fid] = oldValue.split(';');
      if (!tid || !fid) return oldValue;

      // 根据旧值在列表中匹配目标字段 拿到全部信息拼接新格式
      const tables = this.$store.state.fieldList;
      let targetTable, targetField;
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].id == tid) {
          targetTable = tables[i];

          for (let j = 0; j < targetTable.fields.length; j++) {
            if (fid == targetTable.fields[j].field) {
              targetField = targetTable.fields[j];
              break;
            }
          }
          break;
        }
      }
      // 如果能命中 替换为新模式
      if (targetTable && targetField) {
        // return `${targetTable.id || ''}#${targetTable.sqltablename || ''};${targetField.field ||
        //   ''}#${targetField.fieldname || ''}`;
        return this.joinId(targetTable, targetField, true);
      }
      return oldValue;
    },
    /**
     * 在创建后并自动绑定
     * @param {object} fieldInfo 刚创建好的字段信息
     */
    doBindAfterCreate(fieldInfo) {
      const mainTable = this.fieldList[0];
      if (mainTable) {
        const fieldId = this.joinId(mainTable, fieldInfo, true);
        fieldId && this.change(fieldId);
      }
    },
    old2new() {
      if (this.value && /#/.test(this.value)) {
        const [t, f] = this.value.split(';');
        if (!t || !f) return;
        const tInfo = t.split('#');
        const fInfo = f.split('#');
        if (tInfo[1] && fInfo[1]) {
          const newBind = `#${tInfo[1]};#${fInfo[1]}`;
          if (this.value !== newBind) {
            console.log('minx to new', this.value, newBind);
            this.change(newBind);
          }
        }
      }
    },
    handleAddField() {
      // 派发时间 触发显示创建对话框 并传递绑定函数 供给创建并绑定按钮使用
      this.$bus.$emit('createBindField', fieldInfo => {
        this.doBindAfterCreate(fieldInfo);
      });
    }
  },
  mounted() {
    this.old2new();
  }
};
</script>

<style></style>
