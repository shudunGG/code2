<template>
  <div class="helper-line" :class="{ 'line-v': type === 'v', 'line-h': type === 'h' }" :style="styleText"></div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'v'
    }
  },
  computed: {
    left() {
      return this.$store.state.helper.left;
    },
    top() {
      return this.$store.state.helper.top;
    },
    styleText() {
      if (this.type == 'v') {
        return `left: ${this.left}px;`;
      }
      if (this.type == 'h') {
        return `top: ${this.top}px;`;
      }
      return '';
    }
  }
};
</script>

<style lang="scss">
.helper-line {
  display: block;
  position: absolute;
  font-size: 0;
  line-height: 0;
  z-index: 100;
  &.line-h {
    border-top: 1px dashed #0971a0;
    left: 0;
    right: 0;
  }
  &.line-v {
    border-left: 1px dashed #0971a0;
    top: 0;
    bottom: 0;
  }
}
</style>
