<template>
  <div class="mobile-designer-area">
    <!-- 移动端设计器 -->
    <div class="right-fixed-area">
      <el-tooltip placement="top" :enterable="false" :open-delay="300" content="一键同步">
        <el-button icon="el-icon-refresh" @click="onSyncCLick"></el-button>
      </el-tooltip>
    </div>
    <Device type="iphone-8" color="silver">
      <draggable class="mobile-form-container" group="data" :list="list" @add="onDataAdd" direction="vertical" @sort="onMobileControlSort" filter=".hide" @filter="onFilter">
        <div class="mobile-form-item" :class="getCls(item, index)" v-for="(item, index) in list" :key="'item-'+index" :data-index="index">
          <label class="mobile-form-label">
            <span v-if="item.label">{{item.label.labelText | removeLineFeed}}</span>
          </label>
          <span class="mobile-form-control">
            <!-- <input v-if="item.control" type="text" :placeholder="item.control.emptyText || item.control.type" /> -->
            <MobileControl v-if="item.control" :control-data="item.control" />
          </span>
          <div class="mobile-form-helper row-helper">
            <el-tooltip placement="top" :enterable="false" :open-delay="300" content="切换显示">
              <span @click="onVisibleChange(item,index)" class="row-helper-btn view el-icon-view"></span>
            </el-tooltip>
            <el-tooltip placement="top" :enterable="false" :open-delay="300" content="选择">
              <span @click.stop="onItemClick(item,index)" class="row-helper-btn selected el-icon-top-left"></span>
            </el-tooltip>
          </div>
        </div>
      </draggable>
    </Device>

    <!-- <draggable class="mobile-form-container">
      <div class="mobile-form-item" v-for="(item, index) in list" :key="item.id" :data-index="index">
        <label class="mobile-form-label">label</label>
        <span class="mobile-form-control">控件</span>
      </div>
    </draggable>-->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MobileControl from './mobile-holder/MobileControlHolder';
import Device from './Device';

const hasKey = Object.prototype.hasOwnProperty;
export default {
  name: 'mobile-design',
  components: { MobileControl, Device },
  data() {
    return {
      list: [],
      activeIndex: -1
    };
  },
  computed: {
    ...mapState(['mobileDesignData'])
  },
  filters:{
    removeLineFeed(text) {
      if (!text || text + '' !== text) return '';
      return text.replace(/\\n/g, '').replace(/ /g, '&nbsp;');
    }
  },
  methods: {
    getCls(item, index) {
      return {
        hide: !item.visible,
        [item.control && item.control.type]: true,
        active: this.activeIndex === index,
        'only-control': item.control && !item.label,
        'only-label': item.label && !item.control
      };
    },
    /**
     * 处理转换后的数据， 补全隐藏等属性
     */
    dealData(list) {
      return list.map(item => {
        if (!hasKey.call(item, 'visible')) {
          item.visible = true;
        }
        return item;
      });
    },
    pc2mobile() {
      this.loading = true;
      return this.$parent
        .getData({ withBuild: false })
        .then(data => {
          return this.$httpPost(window.formDesignerActions.pc2mobileUrl, data);
        })
        .then(res => {
          console.log('%c pc2mobile success:', 'color: green');
          console.log(res);
          this.list = this.dealData(res.mobileDesignData);
          this.restorePcSelected();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSyncCLick() {
      this.$msgbox({
        title: '提示',
        message: '是否按照当前PC表单配置，同步生成移动端表单？（该操作将覆盖现有移动表单配置）',
        confirmButtonText: '同步并覆盖',
        showCancelButton: true,
        cancelText: '取消',
        iconClass: 'el-icon-question',
        callback: action => {
          if (action == 'confirm') {
            this.pc2mobile();
          }
        }
      });
    },
    initSync() {
      this.$msgbox({
        title: '初始化',
        message: '可按照pc表单配置，快速完成移动端表单初始化',
        confirmButtonText: '一键初始化',
        showCancelButton: true,
        cancelText: '取消',
        iconClass: 'el-icon-question',
        callback: action => {
          if (action == 'confirm') {
            console.log('ok');
            this.pc2mobile();
          }
        }
      });
    },
    onVisibleChange(item, index) {
      item.visible = !item.visible;
      console.log(index);
    },
    onItemClick(item, index) {
      this.activeIndex = index;
      if (item.control && item.control.id) {
        this.$store.commit({
          type: 'setSelectedControl',
          id: item.control.id
        });
      } else {
        this.$store.commit({
          type: 'clearSelectedControl'
        });
      }
    },

    onDataAdd(item) {
      // console.log(...arguments);
      // 新增控件时标记为新增过
      window.FORM_DESIGNER_ANALYSIS.mobileDesignAdd = true;
    },
    onMobileControlSort() {
      // 排序控件时标记为移动过
      window.FORM_DESIGNER_ANALYSIS.mobileDesignMoved = true;
    },
    onFilter(ev) {
      if (ev.target.classList.contains('hide')) {
        return false;
      }
    },
    // 还原PC端控件的选中
    restorePcSelected() {
      const selectedCtrId = this.$store.state.selectedControlId;
      if (!selectedCtrId) {
        this.activeIndex = -1;
        return;
      }

      for (let i = this.list.length - 1; i >= 0; i--) {
        let item = this.list[i];
        if (item.control && item.control.id == selectedCtrId) {
          this.activeIndex = i;
          return;
        }
      }

      this.activeIndex = -1;
    }
  },
  mounted() {
    window.FORM_DESIGNER_ANALYSIS.mobileDesignEntered = true;
    // this.pc2mobile();
    if (!this.mobileDesignData.length) {
      this.initSync();
    } else {
      this.list = this.mobileDesignData;
      this.restorePcSelected();
    }
    // 自动激活到数据域 和 控件配置面板
    this.$store.commit('activeLeftTab', 'data');
    this.$store.commit('activeRightTab', 'control');
  },
  watch: {
    list: {
      deep: true,
      handler(v) {
        console.log('update mobile');
        this.$store.commit({
          type: 'replaceMobileDesign',
          mobileDesignData: v
        });
      }
    }
  }
};
</script>

<style>
.mobile-designer-area {
  min-height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
}
.mobile-form-container {
  /* padding-top: 30px; */
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  position: relative;
  background: #f5f5f5;
}
/* .mobile-form-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  min-height: 100%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.15);
} */
</style>

<style scoped>
.right-fixed-area {
  position: absolute;
  top: 110px;
  left: 50%;
  margin-left: 230px;
}
</style>

<style lang="scss">
.mobile-form-helper {
  > * {
    display: inline-block;
  }
}
.mobile-form-item {
  background: #fff;
  position: relative;
  // height: 45px;
  padding: 0 15px;
  overflow: visible;
  min-height: 44px;

  &:after {
    content: '';
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 0;
    border-bottom: 1px solid #d9d9d9;
    z-index: 2;
  }
  &:before {
    content: '';
  }
  &.hide {
    background: #f5f5f5;
    > .mobile-form-control,
    > .mobile-form-label {
      color: #999;
      opacity: 0.8;
    }

    > .mobile-form-control input {
      background: transparent;
      opacity: 0.6;
    }
  }

  &:hover,
  &.active {
    &:before {
      border: 1px dashed #409eff;
      height: 100%;
      box-sizing: border-box;
      display: block;
      background: rgba(#409eff, 0.15);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
    }
    .mobile-form-helper {
      display: block;
    }
  }
}
.mobile-form-item.title  {
  font-size: 16px;
  line-height: 44px;
  .mobile-form-control {
    float: left;
    padding-left: 15px;
    width: calc(100% - 100px);
  }
  &.only-control {
    .mobile-form-label {
      display: none;
    }
    .mobile-form-control {
      display: block;
      width: 100%;
      // line-height: 44px;
      // font-size: 16px;
      text-align: left;
      padding-left: 0;
    }
  }
}
.mobile-form-label {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 3;
  width: 100px;
  height: 44px;
  font-size: 16px;
  color: #666;
  margin-bottom: 0;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.only-label .mobile-form-label {
  white-space: normal;
  width: 100%;
  height: auto;
  float: none;
  line-height: 44px;
}
</style>