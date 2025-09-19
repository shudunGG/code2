/**
 * ！！！此文件不应被修改！！！
 * 
 * 此文件用于导入所有提供的基础配置组件件和预设配置组件
 * 此文件由 {/script/genderControl.js} 脚本自动生成
 * 在新增基础组件和预设组件后 请运行 {yarn genderControl} 命令来重新生成此文件
 */
import ControlCheckbox from './Control-Checkbox.vue';import ControlCheckboxlist from './Control-Checkboxlist.vue';import ControlCombobox from './Control-Combobox.vue';import ControlDefaultDate from './Control-DefaultDate.vue';import ControlFileTypePicker from './Control-FileTypePicker.vue';import ControlFontColor from './Control-FontColor.vue';import ControlFormDataCombobox from './Control-FormDataCombobox.vue';import ControlHelp from './Control-Help.vue';import ControlMonthPicker from './Control-MonthPicker.vue';import ControlNumberTextbox from './Control-NumberTextbox.vue';import ControlRadioButtonList from './Control-RadioButtonList.vue';import ControlSwitch from './Control-Switch.vue';import ControlTextbox from './Control-Textbox.vue';import ControlWidthConfig from './Control-WidthConfig.vue';import ExtendAlignConfig from './Extend-AlignConfig.vue';import ExtendButtoneditField from './Extend-ButtoneditField.vue';import ExtendDataAction from './Extend-DataAction.vue';import ExtendDateRangeConfig from './Extend-DateRangeConfig.vue';import ExtendFontConfig from './Extend-FontConfig.vue';import ExtendFrozenColumn from './Extend-FrozenColumn.vue';import ExtendListDefaultValue from './Extend-ListDefaultValue.vue';import ExtendMultiForm from './Extend-MultiForm.vue';import ExtendRangeValidate from './Extend-RangeValidate.vue';import ExtendSubTableEditForm from './Extend-SubTableEditForm.vue';import ExtendSubTableFields from './Extend-SubTableFields.vue';import ExtendSubTableSource from './Extend-SubTableSource.vue';import ExtendTooltipConfig from './Extend-TooltipConfig.vue';

// 此处对配置文件中配置的控件type进行转化 提供统一的输入和输出
// 针对配置控件
// 组件属性传入为 config 、 value
// config 为当前编辑控件的属性
// value 作为初始值传入
// 值变化 通过 change 事件派发，参数（新的值，编辑控件配置）

// 针对 预设控件
// 组件传入属性 control-data
// 值变化 通过 change 事件派发 参数 (新的值， 要修改的控件属性名)
const controlTypeMap = {
  checkbox: ControlCheckbox,  checkboxlist: ControlCheckboxlist,  combobox: ControlCombobox,  defaultdate: ControlDefaultDate,  filetypepicker: ControlFileTypePicker,  fontcolor: ControlFontColor,  formdatacombobox: ControlFormDataCombobox,  help: ControlHelp,  monthpicker: ControlMonthPicker,  numbertextbox: ControlNumberTextbox,  radiobuttonlist: ControlRadioButtonList,  switch: ControlSwitch,  textbox: ControlTextbox,  widthconfig: ControlWidthConfig,  'extend-alignconfig': ExtendAlignConfig,  'extend-buttoneditfield': ExtendButtoneditField,  'extend-dataaction': ExtendDataAction,  'extend-daterangeconfig': ExtendDateRangeConfig,  'extend-fontconfig': ExtendFontConfig,  'extend-frozencolumn': ExtendFrozenColumn,  'extend-listdefaultvalue': ExtendListDefaultValue,  'extend-multiform': ExtendMultiForm,  'extend-rangevalidate': ExtendRangeValidate,  'extend-subtableeditform': ExtendSubTableEditForm,  'extend-subtablefields': ExtendSubTableFields,  'extend-subtablesource': ExtendSubTableSource,  'extend-tooltipconfig': ExtendTooltipConfig
};
const defaultComponent = {
  name: "default-control-component",
  inheritAttrs: false,
  props: ['config', 'value', 'controlData'],
  template: '<div>{{controlData ? "配置功能" : config.type}} 开发中...</div>'
};

export { controlTypeMap, defaultComponent };
