<template>
  <div :class="{ suffix: config.suffix }">
    <el-input ref="input" v-model="currentValue" :placeholder="config.placeholder || '请输入' + (config.label || '')" size="small" @change="change" :style="styleText" />
    <span class="form-control-suffix" v-if="config.suffix">{{ config.suffix }}</span>
  </div>
</template>

<script>
export default {
  name: 'control-textbox',
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
      default: ''
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
    focus() {
      // this.$refs.input.focus();
      this.$refs.input.select();
    },
    change(value) {
      this.$emit('change', value, this.config);
    }
  }
};
</script>
