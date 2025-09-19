<template>
  <div class="design-control-holder ewebeditor" :style="{height: (controlData.height || 260) + 'px'}" >{{controlData.emptyText || name}}</div>
</template>

<script>
export default {
  name: 'placeholder-ewebeditor',
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
