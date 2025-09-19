<template>
  <component :id="controlData.id" :control-data="controlData" :asControl="true" :is="getControl(controlData.type)"></component>
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