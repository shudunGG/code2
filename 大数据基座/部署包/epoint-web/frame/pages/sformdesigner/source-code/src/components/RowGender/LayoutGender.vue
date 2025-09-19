<template>
  <div class="row-container" v-if="list.length">
    <RowGender v-for="(row, rowIndex) in list" :key="row.id" :level="level" :row="row" :index="rowIndex" :parent-col="parentCol" :is-last-row="rowIndex == list.length -1 " :prev-row="rowIndex==0? null :list[rowIndex - 1]"></RowGender>

    <!-- 隐藏域 -->
    <div v-if="level === 0" class="hidden-area" style="display:none;">
      <ControlGender v-for="control in hiddenControls" :key="control.id" :control-data="control"></ControlGender>
    </div>
  </div>
</template>

<script>
import RowGender from './RowGender.vue';
import ControlGender from './ControlGender';

export default {
  name: 'LayoutGender',
  components: { RowGender, ControlGender },
  props: {
    // 行数组
    list: {
      type: Array,
      default: () => []
    },
    // 当前嵌套等级
    level: {
      type: Number,
      default: 0
    },
    // 父列数据
    parentCol: {
      type: Object,
      default: null
    },
    parentRow: {
      type: Object,
      default: null
    }
  },
  computed: {
    hiddenControls() {
      return this.$store.state.hiddenControls;
    }
  },
  methods: {
    getHtmlContent() {
      // return this.$el.innerHTML;
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          let html = this.$el.innerHTML;
          if (!html) {
            return resolve('');
          }
          console.log(html);
          // 去掉v-if导致的注释
          html = html.replace(/<!---->/g, '');
          // 去掉控件和控件提示信息的容器
          html = html.replace(/<section need-remove="true">(.*?)<\/section>/g, '$1');
          resolve(html);
        });
      });
    }
  }
};
</script>

<style>
</style>