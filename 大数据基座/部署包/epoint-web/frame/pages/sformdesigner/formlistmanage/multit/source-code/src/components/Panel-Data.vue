<template>
  <div class="left-panel">
    <draggable class="data-drag-area" :list="dataList" :group="{ name: 'data', pull: 'clone', put: false }" swapThreshold="0.3" :sort="false" :clone="createArea" @change="log" :emptyInsertThreshold="20" :move="checkMove">
      <div class="template-item data-tpl-item" :class="{'disabled': usedMap[control.id]}" v-for="control in dataList" :key="control.id" :data-control-type="control.type">
        <!-- <span class="template-item-icon area" :class="control.icon"></span> -->
        <span class="template-item-name">{{ control | getName }}</span>
        <span class="template-item-type">[{{ controlCNameMap[control.type] || control.type }}]</span>
      </div>
    </draggable>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { copy } from '@/util/index.js';

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
  computed: {
    ...mapGetters(['allControls']),
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
        labelText: item.name || (`${item.namePrefix || '控件'}_${item.autoIndex || 1}`)
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