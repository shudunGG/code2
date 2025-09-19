<template>
  <input class="design-control-holder textbox" type="text" :value="controlData.value" :placeholder="controlData.emptyText || name" readonly />
</template>

<script>
export default {
  name: 'placeholder-textbox',
  props: ['controlData'],
  computed: {
    name() {
      const { name, namePrefix, autoIndex } = this.controlData;
      if (name) return name;
      if (namePrefix && autoIndex) return `${namePrefix}_${autoIndex}`;
      return '';
    }
  }
  // computed: {
  //   styleText() {
  //     const { fontSize, fontFamily, fontColor, fontBolder, fontItalic, fontUnderline, textAlign, verticalAlign } = this.controlData;
  //     return `
  //       font-size: ${fontSize}px;
  //       font-family: ${fontFamily};
  //       color: ${fontColor};
  //       font-weight: ${fontBolder ? 'bold' : 'normal'};
  //       font-style: ${fontItalic ? 'italic' : 'normal'};
  //       text-decoration: ${fontUnderline ? 'underline' : 'none'};
  //       text-align: ${textAlign};
  //       vertical-align: ${verticalAlign};
  //     `;
  //   }
  // },
  // data() {
  //   return {};
  // }
};
</script>

<style></style>
