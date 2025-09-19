<template>
  <ColorPicker v-model="currentValue">
    <span class="font-color-button design-button">
      <span class="font-color-holder design-button-icon"></span>
      <span class="font-current-color" :style="'background:' + currentValue"></span>
    </span>
  </ColorPicker>
</template>

<script>
import ColorPicker from '../ColorPicker';
export default {
  name: 'control-font-color',
  props: ['value'],
  components: {
    ColorPicker
  },
  data() {
    return {
      currentValue: this.value || '#000'
    };
  },
  watch: {
    value(v) {
      this.currentValue = v;
    },
    currentValue(v) {
      this.$emit('input', v);
    }
  }
};
</script>

<style>

</style>
