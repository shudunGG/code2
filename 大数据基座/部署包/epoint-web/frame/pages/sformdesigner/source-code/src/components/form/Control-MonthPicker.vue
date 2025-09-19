<template>
  <!-- <el-input v-model="currentValue" :placeholder="config.placeholder || '请输入' + (config.label || '')" size="small" @change="change" :style="styleText" /> -->
  <!-- <el-switch v-model="currentValue"  @change="change"></el-switch> -->
  <el-date-picker v-model="currentValue" @change="change" type="month" placeholder="请选择月份" format="yyyy-MM" value-format="yyyy-MM" :editable="false" size="small"></el-date-picker>
</template>

<script>
export default {
  name: 'control-monthpicker',
  props: {
    // 此控件的值
    value: {
      type: String,
      default: ''
    },
    // 此控件的配置
    config: {
      type: Object,
      require: true
    },
    styleText: {
      type: String,
      default: 'width:200px'
    }
  },
  data() {
    return {
      currentValue: this.value || ''
    };
  },
  watch: {
    value(v) {
      this.currentValue = v;
    }
  },
  methods: {
    change(value) {
      this.$emit('change', value, this.config);
    }
  }
};
</script>
