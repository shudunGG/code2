<template>
  <div class="preset-font">
    <div class="form-item">
      <label class="form-label">字体</label><el-select v-model="fontFamily" size="small" class="font-set-select"> <el-option v-for="item in fontFamilyList" :key="item.id" :label="item.text" :value="item.id"></el-option> </el-select><el-input-number v-model="fontSize" size="small" class="font-set-input" :controls="!!0" :min="12" :max="100"></el-input-number><span class="form-control-suffix">px</span>
    </div>
    <div class="form-item">
      <label class="form-label">样式</label><FontColor style="margin-right:10px" v-model="fontColor"></FontColor>
      
      <!-- <ColorPicker style="margin-right:10px" v-model="fontColor"></ColorPicker> -->
      <div class="design-button-group font-group">
        <el-tooltip :open-delay="500" content="加粗"><MyButton icon="font-bold" :class="{ active: fontBolder }" @click.native="fontBolder = !fontBolder"> </MyButton></el-tooltip><el-tooltip :open-delay="500" content="倾斜"><MyButton icon="font-italic" :class="{ active: fontItalic }" @click.native="fontItalic = !fontItalic"> </MyButton></el-tooltip><el-tooltip :open-delay="500" content="下划线"><MyButton icon="font-underline" :class="{ active: fontUnderline }" @click.native="fontUnderline = !fontUnderline"></MyButton></el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
const globalFontFamilyList = window.FORM_DESIGN_CONFIG.preset.fontFamilyList;
import FontColor from './Control-FontColor';
import Button from './Button';
export default {
  name: 'extend-font-config',
  props: ['controlData'],
  components: {
    FontColor,
    MyButton: Button
  },
  data() {
    return {
      fontFamilyList: JSON.parse(JSON.stringify(globalFontFamilyList)),

      fontFamily: this.controlData.fontFamily,
      fontSize: this.controlData.fontSize,

      fontColor: this.controlData.fontColor,

      fontBolder: this.controlData.fontBolder,
      fontItalic: this.controlData.fontItalic,
      fontUnderline: this.controlData.fontUnderline
    };
  },
  methods: {
    handleChange(v, prop) {
      if (this.controlData[prop] == v) return;
      console.log('字体配置更改', v, prop);
      this.$emit('change', v, prop);
    }
  },
  watch: {
    controlData: {
      deep: true,
      handler() {
        const { fontFamily, fontSize, fontColor, fontBolder, fontItalic, fontUnderline } = this.controlData;

        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.fontBolder = fontBolder;
        this.fontItalic = fontItalic;
        this.fontUnderline = fontUnderline;
      }
    },
    fontFamily(v) {
      this.handleChange(v, 'fontFamily');
    },
    fontSize(v) {
      this.handleChange(v, 'fontSize');
    },
    fontColor(v) {
      this.handleChange(v, 'fontColor');
    },
    fontBolder(v) {
      this.handleChange(v, 'fontBolder');
    },
    fontItalic(v) {
      this.handleChange(v, 'fontItalic');
    },
    fontUnderline(v) {
      this.handleChange(v, 'fontUnderline');
    }
  }
};
</script>

<style></style>
