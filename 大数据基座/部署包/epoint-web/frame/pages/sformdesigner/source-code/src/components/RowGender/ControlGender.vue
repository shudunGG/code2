<template>
  <!-- 容器包裹并新增标识，在生成好提交的时候会去掉外面包裹的这一层 -->
  <section need-remove="true">
    <!-- 控件 -->
    <component :id="controlData.id" :control-data="controlData" :asControl="true" :is="getControl(controlData.type)"></component>
    <!-- 提示 -->
    <span class="control-tips" v-if="showTips" :class="{'tips-tooltip':isToolTip, 'action-icon':isToolTip, 'tips-bottom': !isToolTip}" :data-tooltip="isToolTip ? tipsContent : ''">{{!isToolTip ? tipsContent :''}}</span>
  </section>
</template>

<script>
import PlaceholderLabel from '../control-placeholder/Label';
import PlaceholderTitle from '../control-placeholder/Title';

const needReplaceControlTypes = {
  label: PlaceholderLabel,
  title: PlaceholderTitle
};

const controlHolder = {
  inheritAttrs: false,
  props: ['id'],
  template: '<span class="design-control-holder" :id="id"></span>'
};
export default {
  props: ['control-data'],
  computed: {
    showTips() {
      const c = this.controlData.tooltipConfig;
      return c && c.content;
    },
    isToolTip() {
      const c = this.controlData.tooltipConfig;
      return c && c.type == 'tooltip';
    },
    tipsContent() {
      const c = this.controlData.tooltipConfig;
      return c && c.content ? c.content : '';
    }
  },
  methods: {
    getControl(type) {
      if (type in needReplaceControlTypes) {
        return needReplaceControlTypes[type];
      }
      return controlHolder;
    }
  }
};
</script>

<style>
</style>