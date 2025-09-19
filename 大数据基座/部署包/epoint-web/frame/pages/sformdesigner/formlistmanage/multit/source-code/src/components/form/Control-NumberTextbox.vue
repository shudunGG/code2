<template>
  <div :class="{ suffix: config.suffix }">
    <el-input-number v-model="currentValue" :placeholder="config.placeholder || '请输入' + (config.label || '')" size="small" @change="change" :style="styleText" controls-position="right" :controls="false" style="text-align:left" />
    <span class="form-control-suffix" v-if="config.suffix">{{ config.suffix }}</span>
  </div>
</template>

<script>
export default {
  name: 'control-number-textbox',
  props: {
    // 此控件的值
    value: {
      type: [Number, String],
      default: () => ''
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
      currentValue: parseInt(this.value, 10) || 0
    };
  },
  watch: {
    value(v) {
      this.currentValue = parseInt(v, 10) || 0;
    }
  },
  methods: {
    change(value) {
      this.$emit('change', value, this.config);
    }
  }
};
</script>
