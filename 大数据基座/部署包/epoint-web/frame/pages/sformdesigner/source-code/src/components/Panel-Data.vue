<template>
  <div class="left-panel">
    <Accordion :title="table.name + '中的字段'" v-for="table in tables" :key="table.id">
      <draggable
        class="control-drag-area mis-field-list"
        :list="table.fields"
        :group="{ name: 'control', pull: 'clone', put: false }"
        swapThreshold="0.3"
        :sort="false"
        :clone="createFieldControl"
        :emptyInsertThreshold="20"
        filter=".disabled"
        :move="checkMove"
        @filter="onFilter"
      >
        <div
          class="template-item data-tpl-item"
          v-for="field in table.fields"
          :key="table.id + field.field"
          :data-control-type="field.fielddisplaytype"
          :class="{ disabled: selectedFieldMap[`#${table.sqltablename || ''};#${field.fieldname || ''}`] }"
        >
          <div class="template-item-inner">
            <span class="template-item-icon control" :class="getControlIcon({ type: field.fielddisplaytype })"></span>
            <span class="template-item-name">{{ field.name }}</span>
            <span class="template-item-type">[{{ controlCNameMap[field.fielddisplaytype] || '文本框' }}]</span>
          </div>
        </div>
      </draggable>
    </Accordion>

    <Accordion title="已使用的字段">
      <draggable
        class="data-drag-area"
        :list="dataList"
        :group="{ name: 'data', pull: 'clone', put: false }"
        swapThreshold="0.3"
        :sort="false"
        :clone="createArea"
        @change="log"
        :emptyInsertThreshold="20"
        :move="checkMove"
        filter=".disabled"
        @filter="onFilter"
      >
        <div
          class="template-item data-tpl-item"
          :class="{ disabled: usedMap[control.id] }"
          v-for="control in dataList"
          :key="control.id"
          :data-control-type="control.type"
        >
          <span class="template-item-icon control" :class="control.icon"></span>
          <span class="template-item-name">{{ control | getName }}</span>
          <span class="template-item-type">[{{ controlCNameMap[control.type] || control.type }}]</span>
        </div>
      </draggable>
    </Accordion>
  </div>
</template>

<script>
import Accordion from './Accordion';
import { mapGetters, mapState } from 'vuex';
import { copy } from '../util/index.js';

import createControl from '../mixins/createControl';

const CONTROL_ICON_MAP = {
  title: '',
  label: '',
  textbox: 'textbox',
  textarea: 'textarea',
  spinner: 'spinner',
  radiobuttonlist: 'radio',
  checkboxlist: 'check',
  combobox: 'drop',
  buttonedit: 'drop',
  datepicker: 'date',
  daterangepicker: 'dates',
  monthpicker: 'month',
  macro: 'macro',
  organizationselect: 'person',
  treeselect: 'tree',
  webuploader: 'upload',
  subtable: 'subtable',
  ewebeditor: 'ewebeditor',
  output: 'output',
  hiddenfield: 'textbox'
};

const CONTROL_LIST = window.FORM_DESIGN_CONFIG.controlList;

export default {
  name: 'panel-data',
  data() {
    return {
      // dataList: [...new Array(10)].map((_, i) => {
      //   return {
      //     icon: '',
      //     name: '数据域' + i,
      //     type: 'textbox'
      //   };
      // })
    };
  },
  mixins: [createControl],
  components: { Accordion },
  computed: {
    ...mapGetters(['allControls', 'selectedFieldMap']),
    ...mapState(['hiddenControls', 'mobileDesignData']),
    // 数据域 即pc端的所有控件
    dataList() {
      const allControls = this.allControls;
      // const hiddenControls = this.hiddenControls;

      const arr = [];
      allControls.forEach(ctr => {
        if (ctr.type != 'label' && ctr.type != 'title') {
          arr.push(copy(ctr));
        }
      });

      return arr;
    },
    controlCNameMap() {
      const map = {};
      CONTROL_LIST.forEach(item => {
        map[item.type] = item.name;
      });
      this.$store.state.extControls.forEach(item => {
        map[item.type] = item.name;
      });
      return map;
    },
    usedMap() {
      const map = {};

      this.mobileDesignData.forEach(item => {
        const control = item.control;
        if (!control) return;
        map[control.id] = true;
      });
      return map;
    },
    tables() {
      const tables = copy(this.$store.state.fieldList);
      tables.forEach((table, i) => {
        table.fields.forEach(item => {
          item.actualId = `#${table.sqltablename || ''};#${item.fieldname || ''}`;
        });
      });
      return tables;
    }
  },
  filters: {
    getName(ctr) {
      return ctr.name || ctr.namePrefix;
    }
  },
  methods: {
    createArea(item) {
      console.log(item);
      // debugger;

      const label = {
        labelText: item.name || `${item.namePrefix || '控件'}_${item.autoIndex || 1}`
      };

      return {
        label,
        visible: true,
        control: copy(item)
      };
    },
    log() {
      console.log('cahnge', ...arguments);
    },
    checkMove(ev) {
      // 禁止本列表进入放入
      if (this.$el == ev.to || this.$el.compareDocumentPosition(ev.to) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        return false;
      }
      // 隐藏域只能放入隐藏区域 隐藏区域只能放置隐藏域
      const data = ev.draggedContext.element;
      return !((data.type === 'hiddenfield') ^ ev.to.classList.contains('design-hidden-area'));
    },
    onFilter(ev) {
      if (ev.target.classList.contains('disabled')) {
        return false;
      }
    },
    getControlIcon(tpl) {
      return CONTROL_ICON_MAP[tpl.type] || '';
    },
    createFieldControl(field) {
      const type = field.fielddisplaytype || 'textbox';
      const tpl = {
        type: type,
        name: this.controlCNameMap[type],
        icon: this.getControlIcon({ type: type })
      };
      const control = this.createControl(tpl);

      // 将字段带的信息写入控件
      if (control.bind !== undefined) {
        control.bind = field.actualId;
      }
      if (control.required !== undefined) {
        control.required = field.required;
      }
      if (field.datasource && control.codeItem !== undefined) {
        control.codeItem = field.datasource;
      }
      if (field.multiSelect && control.multiSelect !== undefined) {
        control.multiSelect = field.multiSelect;
      }
      if (field.mode && control.mode !== undefined) {
        control.mode = field.mode;
      }
      control.name = control.name = field.name;

      return control;
    }
  }
};
</script>

<style>
.template-item.data-tpl-item {
  width: 100%;
  margin-left: 0;
}

.data-tpl-item .template-item-type {
  color: #999;
}
.data-tpl-item.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
