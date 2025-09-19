<template>
  <div class="design-control" :data-id="controlData.id" :class="extCls" :style="'width:' + controlWidth">
    <slot></slot>
    <component :is="getControlComponent(controlData.type)" :control-data="controlData"></component>
    <span v-show="controlData.icon" class="design-control-icon" :class="controlIconMap[controlData.type]"></span>
    <span class="design-control-remove" @click.stop="removeControl"></span>
    <ToolTip :control-data="controlData" />
  </div>
</template>

<script>
import PlaceholderLabel from './control-placeholder/Label';
import PlaceholderTextbox from './control-placeholder/Textbox';
import PlaceholderEwebeditor from './control-placeholder/Ewebeditor';
import PlaceholderTitle from './control-placeholder/Title';
import PlaceholderTextArea from './control-placeholder/TextArea';
import PlaceholderCheckboxList from './control-placeholder/CheckboxList';
import PlaceholderRadioButtonList from './control-placeholder/RadioButtonList';
import PlaceholderSubTable from './control-placeholder/SubTable';
import PlaceholderOutput from './control-placeholder/Output';
import ToolTip from './control-placeholder/ToolTip';

const placeholderMap = {
  label: PlaceholderLabel,
  textbox: PlaceholderTextbox,
  ewebeditor: PlaceholderEwebeditor,
  title: PlaceholderTitle,
  textarea: PlaceholderTextArea,
  checkboxlist: PlaceholderCheckboxList,
  radiobuttonlist: PlaceholderRadioButtonList,
  subtable: PlaceholderSubTable,
  output: PlaceholderOutput
};
const defaultPlaceholder = {
  props: ['controlData'],
  template:
    '<span class="design-control-holder" :class="controlData.type">{{controlData.name || (controlData.namePrefix + "_" + controlData.autoIndex)}}</span>'
};

export default {
  name: 'control',
  props: {
    controlData: { type: Object, required: true }
  },
  components: {
    PlaceholderLabel,
    PlaceholderTextbox,
    PlaceholderTitle,
    PlaceholderTextArea,
    PlaceholderCheckboxList,
    PlaceholderRadioButtonList,
    ToolTip
  },
  data() {
    return {};
  },
  computed: {
    controlIconMap() {
      const map = {};
      window.FORM_DESIGN_CONFIG.controlList.concat(this.$store.state.extControls).forEach(ctr => {
        map[ctr.type] = ctr.icon;
      });
      return map;
    },
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
    extCls() {
      const config = this.controlData.tooltipConfig;

      let tipCls;
      if (!config || !config.content) {
        tipCls = '';
      } else {
        tipCls = `with-tooltip tooltip-${config.type}`;
      }

      return `${tipCls} ${this.controlData.type}`;
    }
  },
  methods: {
    removeControl() {
      this.$store.dispatch('deleteControl');
    },
    getControlComponent(type) {
      if (type in placeholderMap) {
        return placeholderMap[type];
      }
      return defaultPlaceholder;
    }
  }
};
</script>
