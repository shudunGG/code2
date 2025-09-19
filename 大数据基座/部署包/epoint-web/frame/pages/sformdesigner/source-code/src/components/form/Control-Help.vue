<template>
  <el-tooltip popper-class="control-help-popper" :placement="placement" :content="currentValue">
    <div slot="content" v-html="currentValue"></div>
    <span class="design-help"></span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'control-help',
  props: {
    // 此控件的值
    config: {
      type: Object,
      default: () => {
        return {};
      },
      required: true
    }
  },
  data() {
    return {
      placement: this.config.placement || 'right',
      currentValue: this.getContent()
    };
  },
  watch: {
    'config.content'() {
      this.currentValue = this.getContent();
    }
  },
  methods: {
    getContent() {
      let str = this.config.content;
      if (str) {
        if (Array.isArray(str)) {
          str = str.join('<br>');
        }
        str.replace(/<script/,'');
        str = str.replace(/ /g, '&nbsp;');
        return str;
      }
      return '';
    }
  }
};
</script>
