<template>
  <draggable class="dropArea layout" :class="'level-' + level" group="layout" @change="onLayoutChange" :swapThreshold="0.3" :delay="0" :list="list" @start="onLayoutDragStart" :move="checkLayoutMove" @end="onLayoutDragEnd" @choose="onDragChoose" filter=".col-helper-line" :preventOnFilter="false" :disabled="false">
    <Row v-for="(row, rowIndex) in list" :key="row.id" :level="level" :row="row" :index="rowIndex" :parent-col="parentCol" :is-last-row="rowIndex == list.length -1 " :prev-row="rowIndex==0? null :list[rowIndex - 1]"></Row>
  </draggable>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import Row from './Row.vue';
import throttle from 'lodash.throttle';
import move from './move.js';

export default {
  name: 'row-layout',
  inject: {
    getDesignContainer: {
      default: () => document.getElementById('design-area')
    },
    showCtxMenu: 'showCtxMenu',
    showMutliRowConfirm: 'showMutliRowConfirm'
  },
  mixins: [move],
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
  data() {
    return {
      inMoving: false,
      rowEl: null,
      colEl: null,
      rowId: '',
      rowData: null,
      colData: null,
      nextColData: null,
      startOffsetX: 0,
      startOffsetY: 0,
      // 鼠标位置和实际位置的偏移
      mouseOffset: {
        x: 0,
        y: 0
      },
      // 拖拽可移动的范围
      moveRange: {
        x: [0, 0],
        y: [0, 0]
      },
      // 非拖动列的 位置 用于吸边比较
      otherColOffSets: [],
      startHeight: 0,
      startWidth: 0,
      resizeMode: false
    };
  },
  mounted() {
    if (this.level === 0) {
      // 鼠标点击的拖拽事件
      this.$el.addEventListener('mousedown', this.onMouseDown);
    }
  },
  components: {
    Row
  },
  computed: {
    ...mapState(['formSize']),
    levelNext() {
      return this.level + 1;
    },
    dataMap() {
      return this.$store.getters.rowDataMap;
    },
    pathMap() {
      return this.$store.getters.subRowPathMap;
    }
  },
  methods: {
    ...mapMutations([
      'updateLineTop',
      'updateLineLeft',
      'showHLine',
      'hideHLine',
      'showVLine',
      'hideVLine',
      'updateRowHeight',
      'updateColWidth',
      'layoutDragStart',
      'layoutDragEnd',
      'controlDragStart',
      'controlDragEnd'
    ]),

    ...mapActions([
      'setSelectedControl',
      'setSelectedCol',
      'setSelectedLayout',
      'deleteRow',
      'deleteControl',
      'activeRightTab'
    ]),

    throttle: throttle(
      (fn, data) => {
        console.log(fn.name + ' called');
        fn(data);
      },
      20,
      {
        leading: true,
        trailing: false
      }
    ),
    checkLayoutMove(ev) {
      const dragData = ev.draggedContext.element;
      // console.log(ev.relatedContext);
      // 单列的不允许放入其他列中
      // if (dragData.cols.length == 1 && ev.relatedContext.component.$parent.level != 0) {
      if (dragData.cols.length == 1 && !ev.to.classList.contains('level-0') && !ev.to.parentElement.classList.contains('acc-item')) {
        console.log('单列禁止嵌套在其他里面');
        return false;
      }
      // 手风琴只能放在最外层
      if (dragData.type == 'acc-layout' && !ev.to.classList.contains('level-0')) {
        console.log('手风琴只能放在最外层');
        return false;
      }
    },
    /**
     * 控件移动检测
     */
    checkControlMove(ev) {
      // 隐藏域只能放入隐藏区域 嵌套布局中 本身没有隐藏域 此处只用保障 不能进入 隐藏区域即可
      if (ev.to.classList.contains('design-hidden-area')) {
        return false;
      }
    },
    onLayoutChange(ev) {
      console.log('change');
      console.log(this);
      console.log(ev);
      if (ev.added) {
        // 新增情况
        // 需要根据放置位置重新调整宽度 如：将一行放到某列中 其每个宽度需要重新计算
        const addData = ev.added.element;
        const parentCol = this.parentCol;
        console.log('parentCol', this.parentCol);
        console.log(addData);

        if (addData.asMulti) {
          // 多行多列情况
          return this.showMutliRowConfirm((rowCount, colCount) => {
            console.log(rowCount, colCount);
            // 禁止单列直接嵌套在单元格中
            if (parentCol && parentCol.type != 'acc-item' && rowCount == 1 && colCount == 1) {
              // 还原已经新增的
              this.$store.dispatch({
                type: 'deleteRow',
                parentCol: this.parentCol,
                row: addData,
                index: ev.added.newIndex,
                shuttle: false
              });
              return this.$message({
                type: 'error',
                message: '单行单列不能被嵌套在单元格中'
              });
            }
            this.$store.commit('replaceToMulti', {
              row: addData,
              rowIndex: ev.added.newIndex,
              rowCount,
              colCount,
              parentCol,
              shuttle: true
            });
          });
        }

        // 创建手风琴的情况
        if (addData.type == 'acc-layout') {
          // 检查 前后 尝试合并
          return this.$store.commit({
            type: 'tryMergeAcc',
            row: addData,
            rowIndex: ev.added.newIndex
          });
        }

        // #region 列宽度更新
        // 直接抽象为变化比例 交由 vuex 递归实现更新
        // 当前宽度为 父列宽度或页面宽度
        this.handleColWidthChange(addData);
        // #end region

        // #region 行高度适应
        {
          // 拖拽进入行时
          // 高度小于目标行 则需自身撑开
          // 高度大于目标行时 需调整父行高度
          // 直接放在最外面的情况无须更新
          // 手风琴里面放置时，不用处理高度
          if (this.parentCol && this.parentCol.type != 'acc-item') {
            const parentRowPath = this.pathMap[addData.id];
            const parentRow = parentRowPath[0];
            const parentHeight = parentRow.height;
            const allSubHeight = this.parentCol.subs.reduce((t, c) => {
              return t + c.height;
            }, 0);
            // 插入此行的高度仍小于父行的高度 则更新本行高度即可
            const delta = parentHeight - allSubHeight;
            if (delta <= 0) {
              // 插入此行后 高度超出原有高度 需更新父行高度
              this.updateRowHeight({
                rowId: parentRow.id,
                row: parentRow,
                height: allSubHeight,
                bubble: true,
                rowPath: this.pathMap[parentRow.id],
                shuttle: true,
                group: 'adjust'
              });
            } else {
              // 插入此行 仍没占满 则补上即可
              this.updateRowHeight({
                rowId: addData.id,
                height: addData.height + delta,
                row: addData,
                // 这种情况不需要向上处理
                bubble: false,
                shuttle: true,
                group: 'adjust'
              });
            }
          }
        }
        // #endregion
      }

      // 行移走时 高度变化
      // 将此行内嵌的最后一行的高度修改 占据此行移走的高度即可
      if (ev.removed) {
        console.log('行移走 处理高度问题');
        if (this.parentCol && this.parentRow) {
          const subRows = this.parentCol.subs;
          const rowHeight = this.parentRow.height;
          const currentHeight = subRows.reduce((t, row) => t + row.height, 0);
          const lastSubRow = subRows[subRows.length - 1];
          const height = lastSubRow.height + (rowHeight - currentHeight);
          if (height) {
            this.updateRowHeight({
              rowId: lastSubRow.id,
              row: lastSubRow,
              height: height,
              bubble: false,
              shuttle: true,
              group: 'adjust'
            });
          }
        }
      }
    },
    /**
     * 处理行放置时候的列宽适配
     */
    handleColWidthChange(addData) {
      if (addData.type == 'acc-layout') return;

      const pw = !this.parentCol ? this.formSize.width : this.parentCol.style.width;

      // 当前宽度
      const cw = addData.cols.reduce((t, c) => {
        return t + c.style.width;
      }, 0);
      // 变化比例
      let ratio = pw / cw;
      if (isNaN(ratio)) {
        ratio = 1;
      }
      // 提交更新
      this.$store.commit({
        type: 'updateRowColWidth',
        rowId: addData.id,
        row: addData,
        ratio,
        shuttle: true,
        group: 'adjust'
      });
    },

    onLayoutDragStart() {
      this.layoutDragStart();
      console.log('onLayoutDragStart');
    },
    onLayoutDragEnd() {
      this.layoutDragEnd();
      console.log('onLayoutDragEnd');
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
    onDragChoose() {
      // return false;
    },
    findRow(rowId) {
      const rowData = this.dataMap[rowId];
      return rowData ? rowData.row : null;
    }
    // clearSelectedStyle(type = 'cell') {
    //   if (type == 'cell' || type == 'col') {
    //     const selectedCells = this.getDesignContainer().querySelectorAll('.col.selected');
    //     selectedCells &&
    //       selectedCells.forEach(cell => {
    //         cell.classList.remove('selected');
    //       });
    //   }
    // }
  },
  beforeDestroy() {
    this.$el.removeEventListener('mousedown', this.onMouseDown);
  }
};
</script>

<style lang="scss">
.dropArea {
  display: block;
  height: 100%;

  box-sizing: border-box;
  min-height: 38px;
  position: relative;
  z-index: 5;
  &.level-0 {
    min-height: calc(100vh - 176px);
  }
}

// .control-dragging .col-helper-line {
//   display:none;
// }
</style>
