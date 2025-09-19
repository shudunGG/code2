import Vue from 'vue';
import App from './App.vue';
// import Test from './Test.vue';
import contextmenu from 'v-contextmenu';
import {
  Input,
  InputNumber,
  Select,
  Option,
  OptionGroup,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  Button,
  Form,
  FormItem,
  Tooltip,
  Message,
  MessageBox,
  Dialog,
  DatePicker,
  Tag,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Row,
  Col,
  ButtonGroup,
  Collapse, 
  CollapseItem
} from 'element-ui';

import draggable from 'vuedraggable';
import store from './store/index.js';
import { get, post } from './util/http.js';
import { parse as jsoncParse } from 'jsonc-parser';

window.jsoncParse = jsoncParse;

// 允许表单model类型为array
Form.props.model = [Object, Array];

// 调整 Option 为其新增 title
// const oldMounted = c.mounted;
// Option.mounted = function() {
//   if (oldMounted) {
//     oldMounted.apply(this, arguments);
//   }
//   if (this.$el && !this.$el.title && this.label && this.label.length > 10) {
//     this.$el.setAttribute('title', this.label);
//   }
// };
const ExtendTitleOption = Vue.extend({
  extends: Option,
  mounted: function() {
    if (this.$el && !this.$el.title && this.label && this.label.length > 10) {
      this.$el.setAttribute('title', this.label);
    }
  }
});

Vue.prototype.$ELEMENT = { size: 'small' };
Vue.prototype.$bus = new Vue();
Vue.prototype.$httpGet = get;
Vue.prototype.$httpPost = post;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$msgbox = MessageBox;
Vue.config.productionTip = false;
Vue.component('draggable', draggable);
Vue.component(Input.name, Input);
Vue.component(Checkbox.name, Checkbox);
Vue.component(CheckboxGroup.name, CheckboxGroup);
Vue.component(Collapse.name, Collapse);
Vue.component(CollapseItem.name, CollapseItem);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Select.name, Select);
// Vue.component(Option.name, Option);
Vue.component(Option.name, ExtendTitleOption);
Vue.component(OptionGroup.name, OptionGroup);
Vue.component(Switch.name, Switch);
Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Message.name, Message);
Vue.component(Dialog.name, Dialog);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Tag.name, Tag);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);

import LayoutGender from '@/components/RowGender/LayoutGender.vue';
Vue.component('LayoutGender', LayoutGender);
Vue.use(contextmenu);

import './style/index.scss';
import 'v-contextmenu/dist/index.css';
if (typeof window.FORM_DESIGNER != 'object') {
  window.FORM_DESIGNER = {};
}
window.FORM_DESIGNER.app = new Vue({
  store,
  render: h => h(App)
}).$mount('#app');

// new Vue({
//   store,
//   render: h => h(Test)
// }).$mount('#app');
