<template>
  <div class="preset-align">
    <div class="form-item">
      <label class="form-label">对齐</label>
      <AlignButton v-model="textAlign" type="horizontal" />
    </div>
  </div>
</template>

<script>
import AlignButton from './AlignButton';
export default {
  name: 'extend-font-align',
  components: {
    AlignButton
  },
  props: ['controlData'],
  data() {
    return {
      textAlign: this.controlData.textAlign
    };
  },
  watch: {
    'controlData.textAlign'(v) {
      this.textAlign = v;
    },
    textAlign(v) {
      if (v == this.controlData.textAlign) return;
      this.$emit('change', v, 'textAlign');
    }
  }
};
</script>

<style></style>
