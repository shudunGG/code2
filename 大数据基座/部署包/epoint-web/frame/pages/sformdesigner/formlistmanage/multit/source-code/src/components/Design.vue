<template>
  <div class="design-area" id="design-area" ref="designArea" style="position:relative" :data-width="size.width" :data-height="size.height" :style="{ width: size.width + 20 + 'px' }" @click="handleFormClick">
    <RowLayout :list="data" />
    <HelperLine type="v" v-show="showVLine" />
    <HelperLine type="h" v-show="showHLine" />

    <!-- 页面的隐藏域 -->
    <draggable class="design-hidden-area" group="control" v-model="hiddenControls" :move="checkControlMove">
      <Control v-for="(ctr, index) in hiddenControls" :control-data="ctr" :key="ctr.id" :class="{ selected: ctr.id == selectedControlId }" @click.native.stop="onControlClick(ctr, index, hiddenControls)"></Control>
    </draggable>

    <!-- <div v-html="globalStyle"></div> -->
    <div v-html="colBorderStyle"></div>
    <v-contextmenu ref="ctxMenu">
      <!-- <v-contextmenu-item :disabled="true || !ctxMenuData.isControl">存为常用控件</v-contextmenu-item> -->
      <!-- <v-contextmenu-item divider></v-contextmenu-item> -->

      <v-contextmenu-item @click="ctxMneuItemHandle('insertRowUp')">向上插入1行</v-contextmenu-item>
      <v-contextmenu-item @click="ctxMneuItemHandle('insertRowDown')">向下插入1行</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="ctxMneuItemHandle('insertColLeft')" :disabled="ctxMenuData.type != 'row-layout'">向左插入1列</v-contextmenu-item>
      <v-contextmenu-item @click="ctxMneuItemHandle('insertColRight')" :disabled="ctxMenuData.type != 'row-layout'">向右插入1列</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>

      <v-contextmenu-item @click="ctxMneuItemHandle('deleteControl')" :disabled="!ctxMenuData.isControl">删除控件</v-contextmenu-item>

      <v-contextmenu-item v-if="ctxMenuData.type == 'acc-layout'" @click="ctxMneuItemHandle('removeCol')" :disabled="!ctxMenuData.colDeletable || ctxMenuData.isControl">删除此手风琴项</v-contextmenu-item>
      <v-contextmenu-item v-if="ctxMenuData.type != 'acc-layout'" @click="ctxMneuItemHandle('removeCol')" :disabled="!ctxMenuData.colDeletable || ctxMenuData.isControl">删除此列</v-contextmenu-item>

      <v-contextmenu-item v-if="ctxMenuData.type == 'acc-layout'" @click="ctxMneuItemHandle('removeRow')" :disabled="ctxMenuData.isControl">删除此手风琴</v-contextmenu-item>
      <v-contextmenu-item v-if="ctxMenuData.type != 'acc-layout'" @click="ctxMneuItemHandle('removeRow')" :disabled="ctxMenuData.isControl">删除此行</v-contextmenu-item>
    </v-contextmenu>
    <el-dialog append-to-body title="请输入行列" :visible.sync="dialogVisible" width="460px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="multi-row-dialog">
      <el-form :model="rowData" size="mini" inline inline-message>
        <el-form-item label="行数目">
          <el-input-number :min="1" :max="20" :controls="false" v-model="rowData.rowCount" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="列数目">
          <el-input-number :min="1" :max="20" :controls="false" v-model="rowData.colCount"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleDialogClose('cancel')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleDialogClose('ok')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RowLayout from './row-layout/RowLayout';
import HelperLine from './HelperLine';
import { mapState, mapActions } from 'vuex';
import Control from './Control';

export default {
  name: 'design',
  components: {
    RowLayout,
    HelperLine,
    Control
  },
  provide() {
    return {
      getDesignContainer: () => this.$refs.designArea,
      showCtxMenu: this.showCtxMenu,
      showMutliRowConfirm: this.showMutliRowConfirm
    };
  },
  props: {
    data: {
      type: Array
    },
    size: {
      type: Object
    }
  },
  data() {
    return {
      ctxMneuItemHandle: () => {},
      ctxMenuData: {
        isControl: false,
        colDeletable: true,
        type: 'row-layout'
      },
      rowData: {
        rowCount: 1,
        colCount: 1
      },
      dialogVisible: false,
      dialogOkCallback: () => {}
    };
  },
  computed: {
    ...mapState({
      showVLine: state => state.helper.showVLine,
      showHLine: state => state.helper.showHLine
    }),
    selectedControlId() {
      return this.$store.state.selectedControlId;
    },
    hiddenControls: {
      get() {
        return this.$store.state.hiddenControls;
      },
      set(list) {
        this.$store.commit('setHiddenControls', list);
      }
    },
    colBorderStyle() {
      return '<style>' + this.$store.getters.colStyleText + '</style>';
    }
  },
  methods: {
    ...mapActions(['setSelectedControl', 'setSelectedLayout', 'activeRightTab']),
    /**
     * 触发控件选中
     */
    onControlClick(control, index, list) {
      this.setSelectedControl({
        id: control.id
      });
      this.activeRightTab('control');
    },
    /**
     * 隐藏控件移动检测
     */
    checkControlMove(ev) {
      // 隐藏域只能放入隐藏区域
      // 此处限制隐藏控件不能被拖出去即可
      if (!ev.to.classList.contains('design-hidden-area')) {
        return false;
      }
    },
    handleFormClick(ev) {
      const target = ev.target;
      if (!target.closest('.row')) {
        this.activeRightTab('form');
      }
    },
    showMutliRowConfirm(callback) {
      this.dialogVisible = true;
      this.dialogOkCallback = callback;
    },
    adjustCtxPos(eventX, eventY) {
      // 插件的 show 方法中没有处理边缘情况 此处进行手动修正
      this.$nextTick(() => {
        // 鼠标位置
        const pos = {
          top: eventY,
          left: eventX
        };

        const width = this.$refs.ctxMenu.clientWidth;
        const height = this.$refs.ctxMenu.clientHeight;

        // 如果溢出 则进行相应的偏移
        if (height + eventY >= window.innerHeight) {
          pos.top -= height;
        }
        if (width + eventX >= window.innerWidth) {
          pos.left -= width;
        }
        this.$refs.ctxMenu.style = {
          top: `${pos.top}px`,
          left: `${pos.left}px`
        };
      });
    },
    showCtxMenu(event, data, handle) {
      this.ctxMenuData.isControl = !!data.control;
      this.ctxMenuData.colDeletable = data.colDeletable;
      this.ctxMenuData.type = data.row.type || 'row-layout';
      this.ctxMneuItemHandle = handle;
      const eventX = event.pageX;
      const eventY = event.pageY;
      this.$refs.ctxMenu.show({
        top: eventY,
        left: eventX
      });
      this.adjustCtxPos(eventX, eventY);
    },
    handleDialogClose(action) {
      this.dialogVisible = false;
      const { rowCount, colCount } = this.rowData;
      if (action == 'ok') {
        this.dialogOkCallback(rowCount, colCount);
      } else {
        this.dialogOkCallback(1, 1);
      }
      this.rowData.rowCount = 1;
      this.rowData.colCount = 1;
    }
  }
};
</script>

<style lang="scss">
.design-area {
  background: #fff;
  min-height: 100%;
  padding: 10px;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  user-select: none;
}
.design-hidden-area {
  border: 1px solid #ddd;
  min-height: 60px;
  background: #f8f8f8;
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  margin-top: 16px;
  .sortable-ghost {
    width: 200px !important;
    display: inline-block;
  }
  .design-control.hiddenfield {
    background: #fff;
    margin-bottom: 6px;
    margin-right: 10px;
    width: 200px !important;
    display: inline-block;
  }
  &:before {
    content: '隐藏域';
    font-size: 16px;
    color: #999;
    // display: block;
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
  }
}
</style>

<style lang="scss">
.multi-row-dialog {
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
.view-design {
  .dropArea.layout {
    // display: flex;
    max-width: 100%;
  }
  .row {
    // padding: 10px;
    background: #f8f8f8;

    &.isTop {
      margin-bottom: 10px;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
  .col {
    position: relative;
    padding: 6px;
    flex-grow: 0;
    flex-shrink: 1;
    .dropArea.controls {
      padding: 10px;
      display: none !important;
    }
    &:before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;

      border: 1px solid #ddd;
    }
    &:after {
      opacity: 0.3;
    }
  }
}
// .view-real {
//   .row {
//     &.isTop {
//       &:first-child {
//         > .col::before {
//           border-top: 1px dotted #ddd;
//         }
//       }
//     }
//   }
//   .col {
//     &::before {
//       content: '';
//       position: absolute;
//       display: block;
//       z-index: 0;
//       box-sizing: border-box;
//       top: 0;
//       right: 0;
//       bottom: 0;
//       left: 0;
//     }
//     &.hasSub:before {
//       border-width: 0;
//     }

//     &.isSub {
//       &::before {
//         border-bottom: 1px dotted #ddd;
//         border-right: 1px dotted #ddd;
//       }
//       &:first-child:before {
//         border-left: 1px dotted #ddd;
//       }
//     }
//   }
// }
</style>
