<template>
  <label class="label" :class="{ 'design-form-label': asControl, 'design-control-holder': !asControl, colons: autoColons, required: controlData.showStar }" :style="styleText" :title="controlData.labelText || ''" v-html="contentHtml"></label>
</template>

<script>
import lineFeed from '@/mixins/lineFeed.js';
export default {
  name: 'placeholder-label',
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
  mixins: [lineFeed],
  computed: {
    contentHtml() {
      const text = this.controlData.labelText || this.controlData.name;

      const hideColon = this.controlData.hideColon;

      return this.lineFeed(text) + (this.autoColons && !hideColon ? '：' : '');
    },
    autoColons() {
      return this.$store.state.globalStyle.autoColons;
    },
    styleText() {
      const {
        fontSize,
        fontFamily,
        fontColor,
        fontBolder,
        fontItalic,
        fontUnderline,
        textAlign,
        verticalAlign
      } = this.controlData;
      const styleArr = [];
      styleArr.push(`font-size:${fontSize}px`);
      styleArr.push(`font-family:${fontFamily}`);
      styleArr.push(`color:${fontColor}`);
      styleArr.push(`font-weight:${fontBolder ? 'bold' : 'normal'}`);
      styleArr.push(`font-style:${fontItalic ? 'italic' : 'normal'}`);
      styleArr.push(`text-decoration:${fontUnderline ? 'underline' : 'none'}`);
      styleArr.push(`text-align:${textAlign || ''}`);
      styleArr.push(`vertical-align:${verticalAlign || ''}`);

      return styleArr.join(';');
    }
  },
  data() {
    return {};
  }
};
</script>

<style></style>
