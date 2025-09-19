<template>
  <h1 class="title" :class="asControl ? 'design-form-title ' : 'design-control-holder'" :style="styleText">{{ controlData.textContent || controlData.name }}</h1>
</template>

<script>
export default {
  name: 'placeholder-title',
  props: {
    controlData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    asControl: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    styleText() {
      const { fontSize, fontFamily, fontColor, fontBolder, fontItalic, fontUnderline, textAlign, verticalAlign } = this.controlData;
      const styleArr = [];
      styleArr.push(`font-size:${fontSize}px`);
      styleArr.push(`font-family:${fontFamily}`);
      styleArr.push(`color:${fontColor}`);
      styleArr.push(`font-weight:${fontBolder ? 'bold' : 'normal'}`);
      styleArr.push(`font-style:${fontItalic ? 'italic' : 'normal'}`);
      styleArr.push(`text-decoration:${fontUnderline ? 'underline' : 'none'}`);
      styleArr.push(`text-align:${textAlign}`);
      styleArr.push(`vertical-align:${verticalAlign}`);

      return styleArr.join(';');
    }
  },
  data() {
    return {};
  }
};
</script>

<style></style>
