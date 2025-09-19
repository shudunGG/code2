import { uid, copy, controlAutoIndex } from '../util/index.js';
export default {
  methods: {
    createControl(tpl) {
      const { type, icon, name } = tpl;
      const controlConfig = window.FORM_DESIGN_CONFIG.controls[type];
      if (!controlConfig) {
        throw new Error(`控件的 ${type} 配置信息不存在，无法创建`);
      }
      const control = copy(controlConfig);
      delete control.configItems;

      const idx = controlAutoIndex.getIndex(type);
      const id = uid();

      control.id = type + '-' + id;
      control.namePrefix = name;
      control.autoIndex = idx;
      control.name = '';
      control.icon = icon;

      if (!control.width) {
        control.width = '100%';
      }

      // 文字类控件需要应用全局样式
      if (['title', 'label', 'output'].indexOf(type) != -1) {
        this.copyGlobalStyleToControl(control);
      }

      return control;
    },
    copyGlobalStyleToControl(ctr) {
      const {
        fontSize,
        fontFamily,
        fontColor,
        fontBolder,
        fontItalic,
        fontUnderline,
        textAlign,
        verticalAlign
      } = this.$store.state.globalStyle;
      if (ctr.type == 'label') {
        ctr.fontSize = fontSize;
      }
      ctr.fontFamily = fontFamily;
      ctr.fontColor = fontColor;
      ctr.fontBolder = fontBolder;
      ctr.fontItalic = fontItalic;
      ctr.fontUnderline = fontUnderline;
      // ctr.textAlign = textAlign;
      // ctr.verticalAlign = verticalAlign;
    }
  }
};
