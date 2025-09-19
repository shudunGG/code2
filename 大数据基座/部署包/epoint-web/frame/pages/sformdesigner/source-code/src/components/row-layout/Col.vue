<template>
  <div class="col" :id="col.id" :name="col.name" :class="getColCls(col, index, row.cols.length)" :style="colStyle" @click.stop="handleColClick(index, col, $event)" @contextmenu.stop.prevent="onContextMenu">
    <!-- <slot /> -->
    <!-- 手风琴 -->
    <h2 v-if="type == 'acc-item'" class="acc-item-header" :class="{'closed':!col.props.opened }">
      <span class="acc-item-index">{{getAccItemIndex(index)}}</span>
      <span class="acc-item-title">{{col.props.title}}</span>
      <span class="acc-item-toggle" @click="toggleAccItem"></span>
    </h2>

    <!-- row -->
    <RowLayout :list="col.subs" :level="levelNext" :parentCol="col" :parentRow="row" v-show="type == 'acc-item' || (col.subs && col.subs.length) || inLayoutDragging" v-if="showNested"></RowLayout>
    <!-- <component :is="RowLayout" :list="col.subs" :level="levelNext" :parentCol="col" :parentRow="row" v-show="(col.subs && col.subs.length) || inLayoutDragging" v-if="!col.controls.length && row.cols.length != 1"></component> -->
    <!-- 控件容器 -->
    <draggable class="dropArea controls" group="control" :list="col.controls" v-if="showControlContainer" :class="{ active: col.controls.length || inControlDragging }" @start="onControlDragStart" @end="onControlDragEnd" @add="onControlAdd($event, { col, colIndex: index, row })" draggable=".design-control" :swapThreshold="1" :invertedSwapThreshold="1" :invertSwap="false" direction="vertical" :move="checkControlMove">
      <!-- <div class="design-control-wrap"> -->
      <Control v-for="control in col.controls" :control-data="control" :key="control.id" :class="{ selected: control.id == selectedControlId }" @click.native.stop="onControlClick(control.id)"></Control>
      <!-- </div> -->
    </draggable>

    <!-- 最后一列不能调整宽度 -->
    <div class="col-helper-line line-v" :data-row-index="rowIndex" :data-col-index="index" :data-level="level" v-if="showXResizer"></div>

    <!-- 内嵌行的最后一行不允许调整高度 应通过外层调整 -->
    <div class="col-helper-line line-h" :data-row-index="rowIndex" :data-col-index="index" v-if="showYResizer"></div>
  </div>
</template>  

<script>
import Control from '../Control';
import { mapState, mapGetters, mapActions } from 'vuex';
import closestComponent from '@/mixins/closestComponent.js';

export default {
  name: 'ColLayout',
  components: {
    RowLayout: () => import('./RowLayout.vue'),
    Control
  },
  data() {
    return {};
  },
  inject: {
    hideCtxMenu: 'hideCtxMenu',
  },
  mixins: [closestComponent],
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
    ...mapState(['globalStyle', 'selectedColId', 'selectedControlId']),
    ...mapGetters(['inControlDragging', 'inLayoutDragging']),
    showNested() {
      if (this.type !== 'col-item') return true;

      return !this.col.controls.length && this.row.cols.length != 1;
    },
    type() {
      const col = this.col;
      return col && col.type ? col.type : 'col-item';
    },
    showControlContainer() {
      if (this.type != 'col-item') return false;
      return !this.col.subs || !this.col.subs.length;
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
    },
    showXResizer() {
      // 手风琴项目本身也无宽度设置
      if (this.type == 'acc-item') return false;
      // 非最后一项均可调整宽度
      return this.index !== this.row.cols.length - 1;
    },
    showYResizer() {
      // 手风琴本身无需调整高度
      if (this.type == 'acc-item') return false;
      // 手风琴项内嵌的第一层的 全部允许 调整高度
      if (this.level == 1 && this.type == 'col-item') {
        const ancestorCol = this.closestComponent('ColLayout', this.$parent);
        if (ancestorCol && ancestorCol.type == 'acc-item') return true;
      }
      // 第一层以及 非最后一行均可 调整高度
      return this.level === 0 || !this.isLastRow;
    }
  },
  methods: {
    ...mapActions(['setSelectedControl', 'activeRightTab', 'setSelectedCol']),
    getColCls(col, colIndex, length) {
      const globalStyle = this.globalStyle;
      const subLength = col.subs.length;
      const style = col.style;
      const cls = {
        selected: this.selectedColId == col.id,
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
    },
    // 处理列点击
    handleColClick(index, col, ev) {
      this.hideCtxMenu();
      const target = ev.target;
      if (target.classList.contains('col-helper-line')) {
        return;
      }
      const colEl = target.closest('.col');
      if (!colEl) return;

      const isSelected = col.id == this.selectedColId;

      if (!isSelected) {
        // if (this.type != 'acc-item') {
        this.setSelectedCol({ id: col.id });
        this.activeRightTab('cell');
        // }
      } else {
        this.setSelectedCol({ id: '' });
      }
    },
    onControlDragStart() {
      this.controlDragStart();
      console.log('onControlDragStart');
    },
    onControlDragEnd(ev) {
      this.controlDragEnd();
      console.log('onControlDragEnd');
      console.log(ev);
    },

    onControlAdd(ev, data) {
      console.log('control add');
      console.log(ev, data);
      // 新创建的自动选中
      const addedControl = data.col.controls && data.col.controls[ev.newIndex];
      if (addedControl && addedControl.id) {
        this.onControlClick(addedControl.id);
      }
      // 如果是来自左边的 尝试新建label
      if (ev.from.classList.contains('control-drag-area')) {
        const type = ev.item.dataset.controlType;
        // 部分控件无须生成 label
        if (type == 'title' || type == 'label' || type == 'subtable') {
          return;
        }
        const { row, colIndex } = data;
        const prevCol = row.cols[colIndex - 1];
        if (!prevCol) {
          return;
        }
        const isEmpty = !prevCol.controls.length && !prevCol.subs.length;
        if (isEmpty) {
          this.$store.dispatch('autoAddLabel', { parentCol: prevCol, controlData: addedControl });
        }
      }
    },
    /**
     * 控件移动检测
     */
    checkControlMove(ev) {
      console.log('checkControlMove', ev);
      // 隐藏域只能放入隐藏区域 嵌套布局中 本身没有隐藏域 此处只用保障 不能进入 隐藏区域即可
      if (ev.to.classList.contains('design-hidden-area')) {
        return false;
      }
    }, // 控件点击
    onControlClick(controlId) {
      this.setSelectedControl({ id: controlId });

      this.activeRightTab('control');
      // 直接派发 面板可能还未渲染好事件监听也还没有
      setTimeout(() => {
        this.$bus.$emit('cntrolClick');
      }, 100);
    },
    onContextMenu(ev) {
      console.log(...arguments);
      this.$emit('on-context-menu', ev);
    },
    getAccItemIndex(index) {
      const i = index + 1;
      return i < 10 ? '0' + i : i;
    },
    toggleAccItem(ev) {
      ev.stopPropagation();
      const header = ev.target.closest('.acc-item-header');
      if (header) {
        header.classList.toggle('closed');
      }
    }
  }
};
</script>

<style>
</style>