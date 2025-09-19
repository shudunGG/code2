<template>
  <div class="">
    <el-select v-model="type" @change="typeChange" size="small" style="display:block">
      <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
    </el-select>
    <el-date-picker popper-class="default-date-popper" v-model="selectDate" @change="dateChange" style="margin-top:8px" type="datetime" placeholder="请选择一个日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-if="type == TYPE_MAP.date" :editable="false" size="small"></el-date-picker>
  </div>
</template>

<script>
const CURRDATE_VALUE = '[currDate]';
const DATE_REG = /^\d{4}-\d{2}-\d{2}/;
const TYPE_MAP = {
  empty: 'empty',
  currDate: 'currDate',
  date: 'date'
};
// 日期默认值配置格式
// '[currDate]' 特殊值 标识取当前访问表单的日期
// ''   为空标识不配置
// '2019-06-20' 普通的日期 即用用户选的的默认值

export default {
  name: 'control-default-date',
  props: ['config', 'value'],
  data() {
    return {
      // selectDate: '',
      // type: 'empty',
      ...this.getDataFromValue(this.value),
      TYPE_MAP: TYPE_MAP,
      typeList: [
        {
          id: TYPE_MAP.empty,
          text: '留空'
        },
        {
          id: TYPE_MAP.currDate,
          text: '填报日期'
        },
        {
          id: TYPE_MAP.date,
          text: '指定日期'
        }
      ]
    };
  },
  methods: {
    // 根据控件的上 值 获取正确的展示值
    getDataFromValue(value) {
      // 空
      if (!value) {
        return {
          selectDate: '',
          type: TYPE_MAP.empty
        };
      }
      // 特殊值
      if (/^\[.+\]$/.test(value)) {
        return {
          selectDate: '',
          type: TYPE_MAP.currDate
        };
      }
      // 日期值
      return {
        selectDate: this.getValidDate(value),
        type: TYPE_MAP.date
      };
    },
    getValidDate(value) {
      return DATE_REG.test(value) ? value : '';
    },
    typeChange(v) {
      if (v == 'empty') {
        return this.change('');
      }
      if (v == 'currDate') {
        return this.change(CURRDATE_VALUE);
      }
      if (v == 'date' && this.selectDate) {
        return this.change(this.selectDate);
      }
    },
    dateChange() {
      if (this.type == 'date') {
        this.change(this.selectDate);
      }
    },
    change(v) {
      this.$emit('change', v, this.config);
    }
  },
  watch: {
    value(v) {
      const data = this.getDataFromValue(v);
      if (data.type != this.type) {
        this.type = data.type;
      }
      if (data.selectDate != this.selectDate) {
        this.selectDate = data.selectDate;
      }
    }
  }
};
</script>

<style>
/* 调整样式 保证时间选择可见 */
.default-date-popper .el-time-panel {
  left: auto;
  right: 0;
}
.default-date-popper .el-time-spinner__wrapper {
  max-height: 192px;
}
</style>
