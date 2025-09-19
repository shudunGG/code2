<template>
  <span class="output" :class="{ 'design-form-output': asControl, 'design-control-holder': !asControl }" :style="styleText">{{ controlData.name || controlData.namePrefix + '_' + controlData.autoIndex }}</span>
</template>

<script>
export default {
  name: 'placeholder-output',
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
    controlWidth() {
      const width = this.controlData.width;
      if (!width) {
        return '';
      }
      if (width + '' === width) {
        return width;
      }

      return `${width}px`;
    },
    styleText() {
      const { fontSize, fontFamily, fontColor, fontBolder, fontItalic, fontUnderline, textAlign, width } = this.controlData;
      const styleArr = [];
      styleArr.push(`display:inline-block`);
      styleArr.push('-webkit-box-sizing:border-box;box-sizing:border-box;');
      styleArr.push(`font-size:${fontSize}px`);
      styleArr.push(`font-family:${fontFamily}`);
      styleArr.push(`color:${fontColor}`);
      styleArr.push(`font-weight:${fontBolder ? 'bold' : 'normal'}`);
      styleArr.push(`font-style:${fontItalic ? 'italic' : 'normal'}`);
      styleArr.push(`text-decoration:${fontUnderline ? 'underline' : 'none'}`);
      styleArr.push(`text-align:${textAlign}`);
      if (this.controlWidth) {
        styleArr.push(`width:${this.controlWidth}`);
      }

      return styleArr.join(';');
    }
  },
  data() {
    return {};
  }
};
</script>

<style></style>
