<template>
  <div class="left-panel">
    <Accordion title="基础控件" v-if="baseControls.length">
      <draggable
        class="control-drag-area"
        :list="baseControls"
        :group="{ name: 'control', pull: 'clone', put: false }"
        swapThreshold="0.3"
        :sort="false"
        :clone="createControl"
        @change="log"
        :emptyInsertThreshold="20"
        :move="checkMove"
      >
        <div
          class="template-item control-tpl-item"
          v-for="control in baseControls"
          :key="control.type"
          :data-control-type="control.type"
          :title="control.name"
        >
          <span class="template-item-icon control" :class="control.icon"></span>
          <span class="template-item-name">{{ control.name }}</span>
        </div>
      </draggable>
    </Accordion>
    <Accordion title="扩展控件" v-if="extControls.length">
      <draggable
        class="control-drag-area"
        :list="extControls"
        :group="{ name: 'control', pull: 'clone', put: false }"
        swapThreshold="0.3"
        :sortable="false"
        :clone="createControl"
        @change="log"
        :move="checkMove"
      >
        <div
          class="template-item control-tpl-item"
          v-for="control in extControls"
          :key="control.type"
          :data-control-type="control.type"
          :title="control.name"
        >
          <span class="template-item-icon control" :class="control.icon"></span>
          <span class="template-item-name">{{ control.name }}</span>
        </div>
      </draggable>
    </Accordion>
    <Accordion title="通用字段" v-if="commonControls.length">
      <!-- <draggable class="control-drag-area" :list="commonControls" :group="{ name: 'control', pull: 'clone', put: false }" swapThreshold="0.3" :sortable="false" :clone="createdCommonControl" @change="log" :move="checkMove">
        <div class="template-item control-tpl-item" v-for="control in commonControls" :key="control.type" :data-control-type="control.type">
          <span class="template-item-icon control" :class="control.icon"></span>
          <span class="template-item-name">{{ control.name }}</span>
        </div>
      </draggable>-->
      <template v-for="catalog in commonControlsTree">
        <h3 class="common-control-catalog" :key="'header-' + catalog.id">{{ catalog.name }}</h3>
        <draggable
          :key="'body-' + catalog.id"
          class="control-drag-area"
          :list="catalog.children"
          :group="{ name: 'control', pull: 'clone', put: false }"
          swapThreshold="0.3"
          :sortable="false"
          :clone="createdCommonControl"
          @change="log"
          :move="checkMove"
        >
          <div
            class="template-item control-tpl-item"
            v-for="control in catalog.children"
            :key="catalog.id + control.name + control.type"
            :data-control-type="control.type"
            :title="control.name"
          >
            <span class="template-item-icon control" :class="control.icon"></span>
            <span class="template-item-name">{{ control.name }}</span>
          </div>
        </draggable>
      </template>
    </Accordion>
  </div>
</template>

<script>
import { copy } from '../util/index.js';
import createControl from '../mixins/createControl';
import Accordion from '@/components/Accordion';
import eventEmitter from '../mixins/eventEmitter';
const CONTROL_LIST = window.FORM_DESIGN_CONFIG.controlList;
export default {
  name: 'panel-control',
  components: { Accordion },
  data() {
    return {
      baseControls: copy(CONTROL_LIST)
    };
  },
  computed: {
    extControls() {
      return this.$store.state.extControls;
    },
    commonControls() {
      return this.$store.state.commonControls;
    },
    commonControlsTree() {
      const list = this.commonControls;
      const tree = {};

      list.forEach(item => {
        const catalog = item.businessType;
        const catalogName = item.businessName;
        if (!catalog || !catalogName) return;

        if (!tree[catalog]) {
          tree[catalog] = {
            id: catalog,
            name: catalogName,
            children: []
          };
        }

        tree[catalog].children.push(item);
      });

      return Object.keys(tree).map(k => tree[k]);
    }
  },
  mixins: [eventEmitter, createControl],
  mounted() {
    this.update();
  },
  methods: {
    update() {
      this.dispatch('accordion', 'updated');
    },
    /**
     * 创建通用字段 即带一些预设信息的控件
     */
    createdCommonControl(tpl) {
      const ctr = this.createControl(tpl);
      const props = copy(tpl.props);

      // 控件属性键名称全小写到驼峰的转换
      const ctrPropsKeyMap = {};
      Object.keys(ctr).forEach(key => {
        ctrPropsKeyMap[key.toLowerCase()] = key;
      });

      // 后端给的属性名中有纯小写、驼峰 需要转换后再做匹配。。。
      Object.keys(props).forEach(k => {
        const lowerKey = k.toLowerCase();
        const ctrKey = ctrPropsKeyMap[lowerKey];
        if (ctrKey) {
          ctr[ctrKey] = props[k];
        } else {
          ctr[k] = props[k];
        }
        // ctr[k] = props[k];
      });

      // 其他通用字段的标识属性
      if (tpl.fieldName !== undefined) {
        ctr.fieldName = tpl.fieldName;
      }

      if (tpl.universalId !== undefined) {
        ctr.universalId = tpl.universalId;
      }

      if (tpl.name && !ctr.name) {
        ctr.name = tpl.name;
      }

      return ctr;
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
    log() {
      console.log(...arguments);
    }
  },
  watch: {
    extControls() {
      this.update();
    },
    baseControls() {
      this.update();
    },
    commonControls() {
      this.update();
    }
  }
};
</script>
