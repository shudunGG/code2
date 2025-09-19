<template>
  <div class="row" :row-id="row.id" :class="className" :style="style" :data-name="row.name" :data-level="level">
    <ColGender v-for="(col, colIndex) in row.cols" :key="col.id" :is-last-row="isLastRow" :index="colIndex" :col="col" :row="row" :level="level" :row-index="index"></ColGender>
  </div>
</template>

<script>
import ColGender from './ColGender.vue';

export default {
  name: 'row-gender',
  components: {
    ColGender: ColGender
  },
  props: {
    row: {
      type: Object
    },
    index: {
      type: Number
    },
    level: {
      type: Number
    },
    parentCol: {
      type: Object,
      default: null
    },
    isLastRow: {
      type: Boolean
    },
    // 前一行
    prevRow: {
      type: Object,
      default: null
    }
  },
  computed: {
    // 组件类型
    type() {
      const row = this.row;
      return row && row.type ? row.type : 'row-layout';
    },
    style() {
      const h = this.row.height;
      const height = h + '' === h ? h : h + 'px';
      const s = {};
      if (this.type == 'acc-layout') {
        s.marginTop = '16px';
        s.marginBottom = '16px';
      }
      if (this.type == 'row-layout') {
        s['min-height'] = height;
      }
      return s;
    },
    className() {
      const type = this.type;
      const s = {
        [type]: true,
        isTop: this.level == 0
      };
      if (type == 'acc-layout') {
        s['fui-accordions'] = true;
        return s;
      }
      if (this.index === 0 || (this.prevRow && this.prevRow.type && this.prevRow.type != 'row-layout')) {
        s.first = true;
      } else {
        s.mid = true;
      }
      return s;
    }
  }
};
</script>
