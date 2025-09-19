<template>
  <div class="tab-body" :data-name="name" :style="{ width: width}">
    <slot></slot>
  </div>
</template>

<script>
import getPercent from '../mixins/getPercent.js';
import eventEmitter from '../mixins/eventEmitter.js';
export default {
  name: 'tab-panel',
  inject: ['tabCount', 'activeIndex'],
  mixins: [getPercent, eventEmitter],
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    width() {
      return this.getPercent(1 / this.tabCount);
    }
  },
  methods: {
    propChange() {
      this.dispatch('Tabs', 'tab-panel-props-change');
    }
  },
  watch: {
    label() {
      this.propChange();
    },
    name() {
      this.propChange();
    },
    disabled() {
      this.propChange();
    }
  }
};
</script>
