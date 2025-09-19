<template>
  <span v-if="show" :class="cls" :data-tooltip="tooltip" :title="tooltip">{{config.type !=='tooltip' ? config.content:''}}</span>
</template>

<script>
export default {
  name: 'control-tooltip',
  props: ['controlData'],
  computed: {
    // config() {
    //   return this.controlData.tooltipConfig;
    // },
    cls() {
      let className = 'control-tooltip';
      if (this.config && this.config.type) {
        className += ' tips-' + this.config.type;
        if (this.config.type == 'tooltip') {
          className += ' el-icon-question';
        }
      }
      return className;
    },
    show() {
      return !!(this.config && this.config.type && this.config.content);
    },
    tooltip() {
      return this.config && this.config.type === 'tooltip' ? this.config.content : '';
    }
  },
  data() {
    return {
      config: this.controlData.tooltipConfig
    };
  },
  methods: {
    doUpdate() {
      this.config = this.controlData.tooltipConfig;
    }
  },
  watch: {
    controlData: {
      deep: true,
      handler(v) {
        this.doUpdate();
      }
    }
  }
};
</script>

<style lang="scss">
.control-tooltip {
  display: inline-block;
  color: #999;
  &.tips-tooltip {
    display: inline-block;
    vertical-align: top;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #409eff;
  }
  &.tips-bottom {
    display: block;

    line-height: 1.2;
    font-size: 0.9em;
  }
  &.tips-right {
    display: inline-block;
    width: auto;

    line-height: 1.2;
    font-size: 0.9em;
  }
}
</style>