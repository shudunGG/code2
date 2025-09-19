<template>
  <el-checkbox :value="value" @change="change" >{{config.text}}</el-checkbox>
</template>

<script>
export default {
  name: 'control-checkbox',
  props: {
    // 此控件的值
    value: {
      type: Boolean,
      require: true
    },
    // 此控件的配置
    config: {
      type: Object,
      require: true
    }
  },
  methods: {
    change(v) {
      this.$emit('change', v, this.config);
    }
  }
};
</script>
