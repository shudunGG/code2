<template>
  <draggable class="dropArea layout" :class="'level-' + level" group="layout" @change="onLayoutChange" :swapThreshold="0.3" :delay="0" :list="list" @start="onLayoutDragStart" :move="checkLayoutMove" @end="onLayoutDragEnd" @choose="onDragChoose" filter=".col-helper-line" :preventOnFilter="false" :disabled="false">
    <div class="row" :row-id="row.id" :class="{ isTop: level == 0, first: rowIndex === 0, mid: rowIndex != 0, selected: selectedRowId == row.id }" v-for="(row, rowIndex) in list" :key="row.id" :style="'min-height:' + row.height + 'px'" :data-name="row.name" :level="level">
      <!-- 列 -->
      <div
        class="col"
        v-for="(col, colIndex) in row.cols"
        :id="col.id"
        :key="col.id"
        :name="col.name"
        :class="getColCls(col, colIndex, row.cols.length)"
        :data-text-align="col.style.textAlign"
        :data-vertical-align="col.style.verticalAlign"
        :style="colStyleMap[row.id][colIndex]"
        @click.stop="handleColClick(colIndex, col, $event)"
        @contextmenu.stop.prevent="
          onContextmenu($event, {
            row: row, // 当前行
            rowIndex: rowIndex, // 行索引
            parentCol: parentCol, // 所在父列

            col: col, // 当前列
            colIndex: colIndex, // 列索引
            colDeletable: !!row.cols.length // 此列是否可删除
          })
        "
      >
        <!-- 内嵌行 -->
        <RowLayout :list="col.subs" :level="levelNext" :parentCol="col" :parentRow="row" v-show="(col.subs && col.subs.length) || inLayoutDragging" v-if="!col.controls.length && row.cols.length != 1"></RowLayout>
        <!-- 控件容器 -->
        <draggable class="dropArea controls" group="control" :list="col.controls" v-if="!col.subs || !col.subs.length" :class="{ active: col.controls.length || inControlDragging }" @start="onControlDragStart" @end="onControlDragEnd" @add="onControlAdd($event, { col, colIndex, row })" draggable=".design-control" :swapThreshold="1" :invertedSwapThreshold="1" :invertSwap="false" direction="vertical" :move="checkControlMove">
          <!-- <div class="design-control-wrap"> -->
          <Control v-for="control in col.controls" :control-data="control" style="display:inline-block;" :key="control.id" :class="{ selected: control.id == selectedControlId }" @click.native.stop="onControlClick(control)"></Control>
          <!-- </div> -->
        </draggable>

        <!-- 最后一列不能调整宽度 -->
        <div class="col-helper-line line-v" :data-row-index="rowIndex" :data-col-index="colIndex" :data-level="level" v-if="colIndex !== row.cols.length - 1"></div>

        <!-- 内嵌行的最后一行不允许调整高度 应通过外层调整 -->
        <div class="col-helper-line line-h" :data-row-index="rowIndex" :data-col-index="colIndex" v-if="level === 0 || rowIndex !== list.length - 1"></div>
      </div>

      <!-- 行的功能按钮 -->
      <div class="row-helper">
        <el-tooltip placement="top" :enterable="false" :open-delay="300" content="移除行"><span @click.stop="handleRowRemove(row, rowIndex)" class="row-helper-btn remove el-icon-delete"></span></el-tooltip>
        <el-tooltip placement="top" :enterable="false" :open-delay="300" content="复制行"><span @click="handleRowCopy(row, rowIndex, parentCol)" class="row-helper-btn copy el-icon-copy-document"></span></el-tooltip>
        <el-tooltip placement="top" :enterable="false" :open-delay="300" content="选择"><span @click.stop="handleRowSelect(row.id)" class="row-helper-btn selected el-icon-top-left"></span></el-tooltip>
      </div>
    </div>
  </draggable>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import Control from '../Control';
import throttle from 'lodash.throttle';
import row from './row.js';
import col from './col.js';
import move from './move.js';
import contextmenu from './contextmenu.js';

export default {
  name: 'RowLayout',
  inject: {
    getDesignContainer: {
      default: () => document.getElementById('design-area')
    },
    showCtxMenu: 'showCtxMenu',
    showMutliRowConfirm: 'showMutliRowConfirm'
  },
  mixins: [row, col, move, contextmenu],
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
      // 用于ctxmenu的数据 无须响应式
      // eslint-disable-next-line vue/no-reserved-keys
      _ctxMenuData: null,
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
    Control
  },
  computed: {
    ...mapState(['leftActiveTab', 'selectedColId', 'formSize', 'globalStyle', 'selectedRowId', 'selectedControlId']),
    ...mapGetters(['inControlDragging', 'inLayoutDragging', 'selectedCol']),
    levelNext() {
      return this.level + 1;
    },
    dataMap() {
      return this.$store.getters.rowDataMap;
    },
    pathMap() {
      return this.$store.getters.subRowPathMap;
    },
    colStyleMap() {
      const rowMap = {};

      this.list.forEach(row => {
        rowMap[row.id] = [];

        row.cols.forEach(col => {
          const width = col.style.width;
          // const border = col.style.border;
          rowMap[row.id].push({
            width: `${width}px`
            // borderTopWidth: border.top.width,
            // borderTopStyle: border.top.style,
            // borderTopColor: border.top.color,

            // borderRightWidth: border.right.width,
            // borderRightStyle: border.right.style,
            // borderRightColor: border.right.color,

            // borderBottomWidth: border.bottom.width,
            // borderBottomStyle: border.bottom.style,
            // borderBottomColor: border.bottom.color,

            // borderLeftWidth: border.left.width,
            // borderLeftStyle: border.left.style,
            // borderLeftColor: border.left.color
            // borderTop: `${border.top.width}px ${border.top.style} ${border.top.color}`,
            // bordeRight: `${border.right.width}px ${border.right.style} ${border.right.color}`,
            // borderBottom: `${border.bottom.width}px ${border.bottom.style} ${border.bottom.color}`,
            // borderLeft: `${border.left.width}px ${border.left.style} ${border.left.color}`
          });
        });
      });

      return rowMap;
    }
  },
  methods: {
    ...mapMutations(['updateLineTop', 'updateLineLeft', 'showHLine', 'hideHLine', 'showVLine', 'hideVLine', 'updateRowHeight', 'updateColWidth', 'layoutDragStart', 'layoutDragEnd', 'controlDragStart', 'controlDragEnd', 'copyRow', 'splitCol']),

    ...mapActions(['setSelectedControl', 'setSelectedCol', 'setSelectedLayout', 'deleteRow', 'deleteControl', 'activeRightTab']),

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
      if (dragData.cols.length == 1 && !ev.to.classList.contains('level-0')) {
        console.log('单列禁止嵌套在其他里面');
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
    // 控件点击
    onControlClick(control) {
      this.setSelectedControl({ id: control.id });

      this.activeRightTab('control');
      // 直接派发 面板可能还未渲染好事件监听也还没有
      setTimeout(() => {
        this.$bus.$emit('cntrolClick');
      }, 100);
    },
    onControlAdd(ev, data) {
      console.log('control add');
      console.log(ev, data);
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
          this.$store.dispatch('autoAddLabel', { parentCol: prevCol });
        }
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
        console.log('parentCol', this.parentCol);
        console.log(addData);

        if (addData.asMulti) {
          // 多行多列情况
          return this.showMutliRowConfirm((rowCount, colCount) => {
            console.log(rowCount, colCount);
            this.$store.commit('replaceToMulti', { row: addData, rowIndex: ev.added.newIndex, rowCount, colCount, shuttle: true });
          });
        }

        // #region 列宽度更新
        {
          // 直接抽象为变化比例 交由 vuex 递归实现更新
          // 当前宽度为 父列宽度或页面宽度

          const pw = !this.parentCol ? this.formSize.width : this.parentCol.style.width;
          // 当前宽度
          const cw = addData.cols.reduce((t, c) => {
            return t + c.style.width;
          }, 0);
          // 变化比例
          const ratio = pw / cw;
          // 提交更新
          this.$store.commit({
            type: 'updateRowColWidth',
            rowId: addData.id,
            row: addData,
            ratio,
            shuttle: true,
            group: 'adjust'
          });
        }
        // #end region

        // #region 行高度适应
        {
          // 拖拽进入行时
          // 高度小于目标行 则需自身撑开
          // 高度大于目标行时 需调整父行高度
          const currHeight = addData.height;
          // 直接放在最外面的情况无须更新
          if (this.parentCol) {
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
    },
    getColStyleText(col) {
      const w = col.style.width;
      if (w == 'unset' || w == 'auto') {
        return '';
      }
      if (w + '' === w) {
        return `width:${w};`;
      }
      return `width:${w}px;`;
    },
    clearSelectedStyle(type = 'cell') {
      if (type == 'cell' || type == 'col') {
        const selectedCells = this.getDesignContainer().querySelectorAll('.col.selected');
        selectedCells &&
          selectedCells.forEach(cell => {
            cell.classList.remove('selected');
          });
      }
    }
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
    min-height: calc(100vh - 160px);
  }
}
.row {
  display: flex;
  flex-flow: row nowrap;
  padding: 0;
  // font-size: 0;
  // line-height: 0;
  box-sizing: border-box;
  position: relative;

  &.sortable-chosen,
  &.sortable-drag {
    cursor: grabbing;
  }
  &-helper {
    position: absolute;
    bottom: -10px;
    right: 0;
    display: none;
    z-index: 101;
    > .row-helper-btn {
      font-size: 12px;
      margin-left: 10px;
      color: #fff;
      background: #2299ee;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  // &:hover {
  //   box-shadow: 0 0 0
  // }
  &:hover > &-helper {
    display: block;
  }
  &.selected {
    z-index: 10;
    box-shadow: 0 0 6px rgba(#51a6ef, 0.6);
  }
}

.col {
  min-height: 38px;
  line-height: 38px;
  position: relative;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  &.selected {
    background: rgba(#51a6ef, 0.6);
    color: #fff;
  }
}

.col-helper-line {
  position: absolute;
  opacity: 0;
  z-index: 100;
  box-sizing: border-box;
  &:hover {
    opacity: 1;
  }
  &:before {
    content: '';
    display: block;
    background: #0971a0;
    width: 100%;
    height: 100%;
  }

  &.line-h {
    left: 0;
    right: 0;
    bottom: -5px;
    height: 10px;
    padding: 4px 0;
    cursor: row-resize;
  }
  &.line-v {
    top: 0;
    bottom: 0;
    right: -5px;
    width: 10px;
    padding: 0 4px;
    cursor: col-resize;
  }
}
// .control-dragging .col-helper-line {
//   display:none;
// }
</style>
