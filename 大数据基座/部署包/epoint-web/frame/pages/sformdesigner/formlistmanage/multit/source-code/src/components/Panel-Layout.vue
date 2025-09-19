<template>
  <draggable class="layout-drag-area left-panel layout" :list="layoutList" :group="{ name: 'layout', pull: 'clone', put: false }" swapThreshold="0.3" :sort="false" :clone="createLayout" @change="log" :move="checkMove" @start="onDragStart" @end="onDragEnd">
    <div class="template-item layout-item" :class="layoutItem.type" v-for="(layoutItem, index) in layoutList" :key="layoutItem.id || index">
      <span class="template-item-icon layout" :class="layoutItem.icon"></span>
      <span class="template-item-name">{{ layoutItem.name }}</span>
    </div>
  </draggable>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { uid, copy, colAutoIndex, rowAutoIndex } from '../util/index.js';
import eventEmitter from '../mixins/eventEmitter';
export default {
  name: 'panel-layout',
  data() {
    return {
      layoutList: [
        {
          name: '一行2列',
          icon: 'col-2',
          cols: [1, 1],
          type: 'row-layout'
        },
        {
          name: '一行4列',
          icon: 'col-4',
          cols: [1, 1, 1, 1],
          type: 'row-layout'
        },
        {
          name: '一行6列',
          icon: 'col-6',
          cols: [1, 1, 1, 1, 1, 1],
          type: 'row-layout'
        },
        {
          name: '1：5',
          icon: 'col-2',
          cols: [1, 5],
          type: 'row-layout'
        },
        {
          name: '1：2：1：2',
          icon: 'col-4',
          cols: [1, 2, 1, 2],
          type: 'row-layout'
        },
        {
          name: '多行多列',
          icon: 'col-multi',
          cols: [],
          type: 'row-layout'
        },
        {
          name: '手风琴布局',
          icon: 'col-multi',
          cols: [1, 1, 1],
          type: 'acc-layout'
        }
      ]
    };
  },
  mixins: [eventEmitter],
  computed: {
    ...mapState(['formSize']),
    initialBorder() {
      return this.$store.state.globalStyle.border;
    }
  },
  mounted() {
    this.dispatch('accordion', 'updated');
  },
  methods: {
    ...mapMutations(['layoutDragStart', 'layoutDragEnd']),
    createLayout(tpl) {
      if (tpl.type == 'row-layout') {
        return this.createRowLayout(tpl);
      }
      if (tpl.type == 'acc-layout') {
        return this.createAccLayout(tpl);
      }
    },
    /**
     * 创建常规行列布局
     * 基于正常行列数据做扩展即可
     */
    createAccLayout(tpl) {
      const layoutData = this.createRowLayout(tpl);

      // 对应手风琴配置
      layoutData.props = {
        showNav: false
      };
      layoutData.cols.forEach((col, i) => {
        col.type = 'acc-item';
        col.style.width = '100%';
        // 对应手风琴项配置
        col.props = {
          title: '手风琴项目-' + (i + 1),
          opened: true
        };
      });

      return layoutData;
    },
    /**
     * 创建常规行列布局
     */
    createRowLayout(rowTempl) {
      const id = uid();
      const autoIndex = rowAutoIndex.getIndex(rowTempl.name);
      const data = {
        id,
        name: '',
        autoIndex: autoIndex,
        namePrefix: rowTempl.name,
        cols: this.createCols(rowTempl.cols, id),
        type: rowTempl.type || 'row-layout',
        height: 38
      };
      if (rowTempl.cols.length == 0) {
        data.asMulti = true;
        data.cols = this.createCols([1], id);
      }
      return data;
    },
    createCols(arr, id) {
      const total = arr.reduce((a, b) => a + b, 0);
      const width = this.formSize.width;

      return arr.map(it => {
        const index = colAutoIndex.getIndex(id);
        return {
          id: `col-${id}-${index}`,
          name: `col-${index}`,
          type: 'col-item',
          style: {
            verticalAlign: 'middle',
            textAlign: 'center',
            width: (width * it) / total,
            border: copy(this.initialBorder)
          },
          subs: [],
          controls: []
        };
      });
    },
    checkMove(ev) {
      // 禁止本列表进入放入
      if (this.$el == ev.to || this.$el.compareDocumentPosition(ev.to) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        return false;
      }
      // 单列的不允许放入其他列中
      const dragData = ev.draggedContext.element;
      if (dragData.cols == 1 && !ev.to.classList.contains('level-0')) {
        console.log('单列禁止嵌套在其他里面');
        return false;
      }
      // 手风琴只能放在最外层
      if (dragData.type == 'acc-layout' && !ev.to.classList.contains('level-0')) {
        console.log('手风琴只能放在最外层');
        return false;
      }
    },
    onDragStart() {
      this.layoutDragStart();
    },
    onDragEnd() {
      this.layoutDragEnd();
    },
    log() {
      console.log(...arguments);
    }
  }
};
</script>
