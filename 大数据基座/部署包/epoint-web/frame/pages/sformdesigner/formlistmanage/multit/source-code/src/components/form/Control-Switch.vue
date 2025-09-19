<template>
  <!-- <el-input v-model="currentValue" :placeholder="config.placeholder || '请输入' + (config.label || '')" size="small" @change="change" :style="styleText" /> -->
  <el-switch v-model="currentValue"  @change="change"></el-switch>
</template>

<script>
export default {
  name: 'control-switch',
  props: {
    // 此控件的值
    value: {
      type: Boolean,
      default: false
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
      currentValue: this.value || false
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
