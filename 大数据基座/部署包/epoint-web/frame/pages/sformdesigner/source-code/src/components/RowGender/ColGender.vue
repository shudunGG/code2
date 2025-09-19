<template>
  <div class="col" :id="col.id" :class="getColCls(col, index, row.cols.length)" :style="colStyle" :role="col.type == 'acc-item' ? 'accordion' : ''" :opened="col.props && col.props.opened ? 'true': 'false'">
    <!-- 手风琴 -->
    <div v-if="type == 'acc-item'" role="head" :title="col.props.title" ></div>
    <div v-if="type == 'acc-item'" role="body">
      <LayoutGender :list="col.subs" :level="levelNext" :parentCol="col" :parentRow="row"></LayoutGender>

      <ControlGender v-for="control in col.controls" :key="control.id" :control-data="control"></ControlGender>
    </div>

    <!-- row -->
    <LayoutGender v-if="type != 'acc-item'" :list="col.subs" :level="levelNext" :parentCol="col" :parentRow="row"></LayoutGender>
    <ControlGender v-if="type != 'acc-item'" v-for="control in col.controls"  :control-data="control" :key="control.id" ></ControlGender>
  </div>
</template>  

<script>
import { mapState } from 'vuex';
import ControlGender from './ControlGender';

export default {
  name: 'ColLayout',
  components: {
    // LayoutGender: () => import('./LayoutGender.vue'),
    ControlGender
  },
  data() {
    return {};
  },
  props: {
    row: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number,
      required: true
    },
    col: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    isLastRow: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['globalStyle']),
    type() {
      const col = this.col;
      return col && col.type ? col.type : 'col-item';
    },
    levelNext() {
      return this.level + 1;
    },
    colStyle() {
      const w = this.col.style.width;
      const width = w + '' === w ? w : `${w}px`;
      return {
        width
      };
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
        ['text-' + (style.textAlign || globalStyle.textAlign)]: true,
        ['vertical-' + (style.verticalAlign || globalStyle.verticalAlign)]: true
      };
      cls[this.type] = true;
      if (this.type == 'col-item') {
        cls.first = colIndex === 0;
        cls.mid = colIndex && colIndex !== length - 1;
        cls.last = colIndex === length - 1;
      }
      return cls;
    }
  }
};
</script>
