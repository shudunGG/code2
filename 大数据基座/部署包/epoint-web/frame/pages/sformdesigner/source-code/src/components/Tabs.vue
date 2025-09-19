<template>
  <div class="tabs-view">
    <div class="tabs-head">
      <div class="tab-head" v-for="(item, index) in panels" :key="item.name" :class="getTabHeadCls(item)" @click="activeTab(index)">{{ item.label }}</div>
    </div>
    <div class="tabs-body-wrap">
      <div class="tabs-body" :style="{ width: width, marginLeft: marginLeft }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import getPercent from '../mixins/getPercent.js';
import TabPanel from './TabPanel.vue';
export default {
  name: 'Tabs',
  mixins: [getPercent],
  props: {
    defaultActive: {
      type: String
    },
    activeClass: {
      type: String,
      default: 'active'
    },
    value: {
      type: String
    }
  },
  components: {
    TabPanel
  },
  provide() {
    return { tabCount: this.tabCount, activeIndex: this.activeIndex };
  },
  mounted() {
    this.$on('tab-panel-props-change', this.tabPanelChange);
  },
  beforeDestroy() {
    this.$off('tab-panel-props-change');
  },
  data() {
    return {
      active: this.value || this.defaultActive,
      tabCount: 0,
      panels: this.getPanels()
    };
  },
  computed: {
    activeIndex() {
      if (this.panels.length) {
        for (let i = 0; i < this.panels.length; i++) {
          if (this.panels[i].name == this.active) {
            return i;
          }
        }
      }
      return 0;
    },
    width() {
      return this.getPercent(this.tabCount);
    },
    marginLeft() {
      return '-' + this.getPercent(this.activeIndex);
    }
  },
  watch: {
    panels: {
      immediate: true,
      handler() {
        this.tabCount = this.panels.length;
      }
    },
    value(v) {
      if (v) {
        this.active = v;
      }
    },
    active(v) {
      this.$emit('input', v);
    }
  },
  methods: {
    getTabHeadCls(item) {
      return {
        [this.activeClass]: this.active == item.name,
        disabled: item.disabled
      };
    },
    activeTab(index) {
      const target = this.panels[index];
      if (!target.disabled) {
        this.active = this.panels[index].name;
      }
    },
    tabPanelChange() {
      this.panels = this.getPanels();
    },
    // 根据 slots 获取 panels 配置
    getPanels() {
      // 过滤得到 vnode
      const panelNodes = this.$slots.default.filter(
        vnode => vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'tab-panel'
      );
      // 得到每个tab的配置
      const panelsConfigs = panelNodes.map(vnode => vnode.componentOptions.propsData);
      // this.tabCount = panelsConfigs.length;
      return panelsConfigs;
    }
  }
};
</script>

<style lang="scss">
$activeColor: #2590eb;
.tabs {
  &-head,
  &-body {
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }
  &-view {
    box-sizing: border-box;
    height: 100%;
  }
  &-head {
    font-size: 15px;
    height: 36px;
    line-height: 35px;
    border-bottom: 1px solid #f2f7ff;
    display: flex;
    box-sizing: border-box;
  }
  &-body {
    transition: margin-left 0.2s ease-out;
    height: 100%;
  }
  &-body-wrap {
    overflow: hidden;
    height: calc(100% - 36px);
  }
}
.tab {
  &-body {
    float: left;
  }
  &-head {
    flex-grow: 1;
    cursor: pointer;
    padding: 0 10px;
    position: relative;
    transition: all 0.1s ease-out;
    text-align: center;
    margin-bottom: -1px;
    color: #b5b5b5;
    &:after {
      content: '';
      position: absolute;
      left: 100%;
      bottom: 0;
      border-bottom: 1px solid $activeColor;
      width: 0;
      transform-origin: 50% 50%;
      transition: all 0.2s ease-out;
    }
    &.active {
      color: $activeColor;
      &:after {
        display: block;
        left: 0;
        right: 0;
        width: auto;
      }
    }
    &:hover {
      color: $activeColor;
      &:after {
        width: 100%;
        left: 0;
      }
    }
    &:hover ~ &:after {
      left: 0;
    }
    &.disabled {
      opacity: .3;
      cursor: not-allowed;
      color: #b5b5b5;
      &:before,
      &:after {
        display: none;
      }
    }
  }
  &-body {
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    > * {
      padding: 20px 14px;
    }
  }
}
</style>
