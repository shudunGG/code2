<template>
  <div class="design-head">
    <span class="design-tittle">{{ formTitle }}</span>

    <Shuttle ref="shuttle" class="header-btn-group" v-show="!showPreview" />

    <span class="header-btn-group" v-show="!showPreview">
      <span class="header-btn js-btn" type="text" size="mini" @click="openEditor('js')" title="打开js编辑"></span>
      <span class="header-btn css-btn" type="text" size="mini" @click="openEditor('css')" title="打开css编辑"></span>

      <!-- <span class="header-btn el-icon-s-grid view-design-btn" :class="{'active': viewDesign === true}" @click="toggleViewDesign" :title="viewDesign ?  '切换为真实模式':'切换为设计模式'" size="mini" type="text"></span> -->
      <!-- </span> -->

      <!-- <span class="header-btn-group">
      <span class="header-btn pc" :class="{'active':viewType == 'pc'}" @click="updateViewType('pc')">pc</span>
      <span class="header-btn mobile" :class="{'active':viewType == 'mobile'}" @click="updateViewType('mobile')">mobile</span>
    </span> -->
      <span class="header-btn view-design-btn" :class="{'active': viewDesign === true}" @click="toggleViewDesign"
        :title="viewDesign ?  '切换为真实模式':'切换为设计模式'" size="mini" type="text"></span>
      <span class="header-btn design-select-btn" @click="showDesignSelect" :title="'重新选择表单'" size="mini" type="text"></span>
    </span>

    <!-- <span class="header-btn-group" v-show="!showPreview">
      <span class="header-btn pc" :class="{'active':viewType == 'pc'}" @click="updateViewType('pc')" title="查看pc端设计"></span>
      <span class="header-btn mobile" :class="{'active':viewType == 'mobile'}" @click="updateViewType('mobile')" title="查看移动端设计"></span>
    </span> -->

    <!-- <span class="fe-mock-buttons" v-if="showLocalBtns">
      <button @click="save" style="margin-right:10px">本地暂存</button>
      <button @click="getLocalData" style="margin-right:10px">还原本地存储</button>
      <button @click="clear" style="margin-right:10px">清空内容</button>
    </span>-->

    <div class="design-head-right" style="float:right;">
      <!-- <FormTplSelect @change="onFormTplChange" /> -->
      <!-- <el-button class="preview-btn" type="primary" size="mini" @click="preview" :disabled="!design.length" v-if="showLocalBtns">预览</el-button> -->
      <!-- <FormTplSelect @change="onFormTplChange" style="margin-right:10px" v-show="!showPreview" /> -->
      <!-- <el-button class="preview-btn" type="primary" size="mini" @click="preview" :disabled="!design.length" v-if="showLocalBtns">预览</el-button> -->

      <!-- <el-button class="save-btn" type="primary" size="mini" @click="saveToServer" :disabled="!design.length">保存</el-button> -->
      <el-button class="preview-btn" size="mini" @click="setShowPreview(!showPreview)">{{showPreview ?
        '退出预览':'预览'}}</el-button>
      <el-dropdown v-if='load' split-button type="primary" @click="onSaveClick" @command="onDropDownItemClick" trigger="click" size="mini"
        style="margin-left: 10px">
        保存
        <el-dropdown-menu slot="dropdown" class="save-menu">
          <el-dropdown-item command="saveToTpl">另存为模板</el-dropdown-item>
          <el-dropdown-item command="saveToNewVersion">生成新版本</el-dropdown-item>
          <el-dropdown-item command="saveToCopy">生成副本</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-if="!load" split-button type="primary" size="mini"
        style="margin-left: 10px;" class="split-disabled">
        保存
      </el-dropdown>
    </div>

    <!-- 代码编辑弹窗 -->
    <el-dialog append-to-body :title="editorDialog.title" :visible.sync="editorDialog.show" width="90"
      :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" @opened="onEditorDialogOpened"
      fullscreen custom-class="code-editor-dialog" :before-close="closeEditorDialog">
      <Editor v-if="editorDialog.display" :code="editorDialog.code" :language="editorDialog.lang" @save="saveEditorCode"
        @cancel="closeEditorDialog" />
    </el-dialog>

    <!-- 选择表单 -->
    <el-dialog append-to-body
        title="选择表单"
        :visible.sync="dialogVisible"
        width="50%" custom-class="select-form"
        :before-close="handleClose">
        
        <iframe :src="reSetSelectUrl" width="100%" height="100%" frameborder="0"></iframe>

        <!-- <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">下一步</el-button>
            <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
        </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Shuttle from '@/components/Shuttle';
import Editor from '@/components/Editor';

import FormTplSelect from '@/components/FormTplSelect';

export default {
  name: 'Header',
  props: {
    formTitle: { type: String },
    inPreview: { type: Boolean },
    load: { type: Boolean },
  },
  components: {
    Shuttle,
    Editor,
    FormTplSelect
  },
  data() {
    return {
      showLocalBtns: false,
      dialogVisible: false,
      reSetSelectUrl: reSetSelectUrl,
      editorDialog: {
        title: '',
        show: false,
        code: '',
        display: false,
        lang: ''
      }
    };
  },
  computed: {
    ...mapState(['jsCode', 'cssCode']),
    ...mapState({
      viewType: state => state.helper.viewType,
      viewDesign: state => state.helper.viewDesign,
      showPreview: state => state.helper.showPreview
    })
  },
  methods: {
    ...mapMutations(['setJsCode', 'setCssCode', 'updateViewType', 'toggleViewDesign']),
    setShowPreview(show) {
      this.$store.commit({
        type: 'setShowPreview',
        showPreview: show
      });
    },
    handleClose() {
        this.dialogVisible = false;
    },
    showDesignSelect() {
        this.dialogVisible = true;
    },
    // 打开代码编辑器
    openEditor(type) {
      let code, title, lang;
      if (type == 'js') {
        code = this.jsCode;
        title = 'js编辑';
        lang = 'javascript';
      } else {
        code = this.cssCode;
        title = 'css编辑';
        lang = 'css';
      }
      this.editorDialog.title = title;
      this.editorDialog.code = code;
      this.editorDialog.lang = lang;
      this.editorDialog.show = true;
    },
    onEditorDialogOpened() {
      this.editorDialog.display = true;
    },
    // 保存代码
    saveEditorCode(code) {
      if (this.editorDialog.lang == 'javascript') {
        this.setJsCode(code);
      } else if (this.editorDialog.lang == 'css') {
        this.setCssCode(code);
      }
      this._closeEditorDialog();
    },
    _closeEditorDialog() {
      this.editorDialog.display = this.editorDialog.show = false;
    },
    closeEditorDialog() {
      this.$confirm('不需要保存此次的代码修改吗？', '保存提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this._closeEditorDialog();
        })
        .catch(err => {
          console.error(err);
        });
    },
    onFormTplChange(data) {
      this.$emit('form-tpl-change', data);
    },
    onSaveClick() {
      const hasData = this.$store.state.design && this.$store.state.design.length;
      if (hasData) {
        this.$emit('save-click');
        return;
      } else {
        this.$confirm('无设计数据，继续保存将提交空数据是否继续？', '删除保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$emit('save-click');
          })
          .catch(err => {
            if (err) {
              console.error(err);
            }
            console.log('cancel');
          });
      }
    },
    onDropDownItemClick(name) {
      this.$emit('drop-item-click', name);
    }
  }
};
</script>

<style lang="scss">
.header-btn-group {
  position: relative;
  padding: 0 10px;
  display: inline-block;
  line-height: 26px;
  height: 26px;
  vertical-align: middle;
  & + .header-btn-group:after {
    content: '';
    border-left: 1px solid #ddd;
    height: 20px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.header-btn {
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease-out;
  background-position: center center;
  background-repeat: no-repeat;
  transition: background-color 0.2s ease-out, color 0.2s ease-out;

  &:hover,
  &.active {
    color: #2590eb;
  }

  // }
  // .js-btn {
  //   background: url('../assets/images/top/icon_js.png') center no-repeat;
  //   background-color: transparent;
  //   border-color: transparent;
  //   color: transparent;
  //   height: 28px;
  //   vertical-align: middle;
  //   width: 44px;
  //   border-radius: 2px;
  //   box-sizing: border-box;
  //   &:hover {
  //     background-color: #efefef;
  //     border-color: #efefef;
  //     color: transparent;
  //   }
  // }
  // .css-btn {
  //   background: url('../assets/images/top/icon_css.png') center no-repeat;
  //   background-color: transparent;
  //   border-color: transparent;
  //   color: transparent;
  //   height: 28px;
  //   vertical-align: middle;
  //   width: 44px;
  //   border-radius: 2px;
  //   box-sizing: border-box;
  //   &:hover {
  //     background-color: #efefef;
  //     border-color: #efefef;
  //     color: transparent;

  &:hover {
    background-color: #efefef;
  }

  &.js-btn {
    background-image: url('../assets/images/header/js.png');
    &:hover,
    &.active {
      background-image: url('../assets/images/header/js-h.png');
    }
  }
  &.css-btn {
    background-image: url('../assets/images/header/css.png');
    &:hover,
    &.active {
      background-image: url('../assets/images/header/css-h.png');
    }
  }
  &.view-design-btn {
    background-image: url('../assets/images/header/p.png');
    &:hover,
    &.active {
      background-image: url('../assets/images/header/p-h.png');
    }
  }
  &.design-select-btn {
    background-image: url('../assets/images/header/select.png');
    &:hover,
    &.active {
      background-image: url('../assets/images/header/select-h.png');
    }
  }
  &.pc {
    background-image: url('../assets/images/header/pc.png');
    &:hover,
    &.active {
      background-image: url('../assets/images/header/pc-h.png');
    }
  }
  &.mobile {
    background-image: url('../assets/images/header/mobile.png');
    &:hover,
    &.active {
      background-image: url('../assets/images/header/mobile-h.png');
    }
  }
}
.split-disabled {
  .el-button--primary{
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
    color: #c0c4cc;
  }
  .el-dropdown__caret-button::before {
    background: #ebeef5;
  }
}

</style>
<style lang="scss">
.save-menu {
  .el-dropdown-menu__item {
    line-height: 36px;
    padding: 0 20px;
    margin: 0;
    font-size: 14px;
  }
}

.select-form {
    width: 80% !important;
}

.select-form .el-dialog__body {
    height: 520px;
}
</style>