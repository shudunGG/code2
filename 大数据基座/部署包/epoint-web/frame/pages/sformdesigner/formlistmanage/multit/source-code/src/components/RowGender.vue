<template>
  <div class="row-container">
    <div class="row" :id="row.id" :row-id="row.id" :class="{ isTop: level == 0, first: rowIndex === 0, mid: rowIndex != 0 }" v-for="(row, rowIndex) in list" :key="row.id" :style="'min-height:' + row.height + 'px'">
      <div class="col" v-for="(col, colIndex) in row.cols" :id="col.id" :key="col.id" :name="col.name" :class="getColCls(col, colIndex, row.cols.length)" :style="rowColWidthMap[row.id][colIndex]">
        <RowGender v-if="col.subs && col.subs.length" :list="col.subs" :level="levelNext"></RowGender>
        <component v-for="control in col.controls" :key="control.id" :id="control.id" :control-data="control" :asControl="true" :is="getControl(control.type)"></component>
        <!-- <span v-for="control in col.controls" :key="control.id" :id="control.id"></span> -->
      </div>
    </div>
    <!-- 隐藏域 -->
    <div v-if="level === 0" class="hidden-area" style="display:none;">
      <component v-for="control in hiddenControls" :key="control.id" :id="control.id" :control-data="control" :asControl="true" :is="getControl(control.type)"></component>
    </div>
  </div>
</template>

<script>
import PlaceholderLabel from './control-placeholder/Label';
import PlaceholderTitle from './control-placeholder/Title';

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
  name: 'RowGender',
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
    globalStyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  created() {
    console.log(...arguments);
  },
  computed: {
    hiddenControls() {
      return this.$store.state.hiddenControls;
    },
    levelNext() {
      return this.level + 1;
    },
    rowColWidthMap() {
      const rowMap = {};

      this.list.forEach(row => {
        rowMap[row.id] = [];

        row.cols.forEach(col => {
          const width = col.style.width;
          // const border = col.style.border;
          rowMap[row.id].push({
            width: `${width}px`,
            minHeight: `${row.height}px`
          });
        });
      });

      return rowMap;
    }
  },
  methods: {
    getColCls(col, colIndex, length) {
      const globalStyle = this.globalStyle;
      const subLength = col.subs.length;
      const style = col.style;
      const cls = {
        isSub: !subLength,
        hasSub: subLength,
        first: colIndex === 0,
        mid: colIndex && colIndex !== length - 1,
        last: colIndex === length - 1,
        ['text-' + (style.textAlign || globalStyle.textAlign)]: true,
        ['vertical-' + (style.verticalAlign || globalStyle.verticalAlign)]: true
      };

      return cls;
    },
    getHtmlContent() {
      return this.$el.innerHTML;
    },
    getControl(type) {
      if (type in needReplaceControlTypes) {
        return needReplaceControlTypes[type];
      }
      return controlHolder;
    }
  }
};
</script>

<style></style>
