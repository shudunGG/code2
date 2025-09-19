<template>
  <div class="design-container">
    <Header ref="header" :in-preview="showPreview" :formTitle="formTitle" @save-click="saveToServer()" @drop-item-click="handleCommand" />

    <Preview v-if="showPreview" :tableGuid="tableGuid" :designId="designId" :type="viewType" />

    <div class="design-body" v-if="!showPreview" :class="{ narrow: narrowMode, 'view-pc': viewType === 'pc', 'view-mobile': viewType === 'mobile'  }">
      <!-- left -->
      <div class="design-leftbar">
        <Tabs :value="leftActiveTab" @input="activeLeftTab">
          <TabPanel label="布局" name="layout" :disabled="viewType === 'mobile'">
            <PanelLayout />
          </TabPanel>
          <TabPanel label="控件" name="control" :disabled="viewType === 'mobile'">
            <PanelControl />
          </TabPanel>
          <TabPanel label="数据域" name="data">
            <PanelData />
          </TabPanel>
        </Tabs>
        <!-- <AccordionGroup> -->
        <!-- <Accordion title="布局">
          <PanelLayout />
        </Accordion>
        <Accordion title="控件">
          <PanelControl />
        </Accordion>-->
      </div>
      <!-- design-view -->
      <div class="design-view-container" :class="{'view-real':!viewDesign,'view-design':viewDesign}">
        <Design v-if="dataLoaded" v-show="viewType === 'pc'" :data="design" :size="formSize" />
        <MobileDesign v-if="dataLoaded && viewType === 'mobile'" />
      </div>
      <!-- right -->
      <div class="design-rightbar" :class="{ pickup: narrowMode && rightbarHidden }">
        <el-button v-if="narrowMode && viewType === 'pc'" class="design-rightbar-toggle" icon="el-icon-d-arrow-right" plain @click="rightbarHidden = !rightbarHidden"></el-button>
        <Tabs default-active="form" :value="rightActiveTab" @input="activeRightTab">
          <TabPanel label="表单设置" name="form" :disabled="viewType === 'mobile'">
            <ConfigForm v-if="dataLoaded" />
          </TabPanel>
          <TabPanel label="组件设置" name="control">
            <ConfigControl :control="selectedControl" v-if="selectedControl"></ConfigControl>
            <ConfigRow :row-id="selectedRowId" v-if="selectedRowId"></ConfigRow>
            <div v-if="!selectedControl && !selectedRowId">请选择控件或行</div>
          </TabPanel>
          <TabPanel :label="cellPanelName" name="cell" :disabled="viewType === 'mobile'">
            <ConfigCell :selected-col="selectedCol" v-if="selectedColId" />
            <div v-else>请选择单元格</div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
    <!-- pc端 html 渲染器 -->
    <LayoutGender ref="builder" v-if="needRender" :list="design" :global-style="globalStyle"></LayoutGender>

    <!-- 新增字段弹窗 -->
    <NewFiledDialog />

    <!-- 新版本弹窗 -->
    <NewVersionDialog v-if="false" />
  </div>
</template>

<script>
import Tabs from './components/Tabs';
import TabPanel from './components/TabPanel';
import PanelLayout from './components/Panel-Layout';
import PanelControl from './components/Panel-Control';
import PanelData from './components/Panel-Data';
import Design from './components/Design';
import MobileDesign from './components/MobileDesign';
import ConfigCell from './components/config-panel/Config-Cell';
import ConfigForm from './components/config-panel/Config-Form';
import ConfigControl from './components/config-panel/Config-Control';
import ConfigRow from './components//config-panel/Config-Row';
import Preview from './preview/Preview.vue';

// import Accordion from './components/Accordion';
import NewFiledDialog from './components/NewFiledDialog';

import LayoutGender from './components/RowGender/LayoutGender.vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { copy, htmlEncode, uid, encrypt, decrypt } from './util/index.js';
import merge from 'lodash.merge';
import { Promise } from 'q';
import autoIndex from './util/autoIndex';
import throttle from 'lodash.throttle';

import Header from './views/Header';
// import FormTplSelectVue from './components/FormTplSelect.vue';
import NewVersionDialog from './components/NewVersionDialog';
import Vue from 'vue';
const NewVersionDialogC = Vue.extend(NewVersionDialog);

const search = new URLSearchParams(location.search);
const designId = search.get('designId') || '';
const tableGuid = search.get('tableGuid') || '';

export default {
  name: 'app-main',
  components: {
    Header,
    Preview,
    // MainDesign,
    Tabs,
    TabPanel,
    PanelLayout,
    PanelData,
    Design,
    MobileDesign,
    ConfigCell,
    ConfigForm,
    PanelControl,
    ConfigControl,
    ConfigRow,
    LayoutGender,
    // Accordion,
    NewFiledDialog
  },
  data() {
    return {
      autoSaveTimer: null,
      autoSaveInterval: 1000 * 60,
      needAutoSave: false,

      dataLoaded: false,
      formTitle: '表单设计器',
      needRender: false,
      showLocalBtns: process.env.VUE_APP_DEBUG_MODE == 'true' || /useMock/i.test(location.search),
      enableRightBarCover: true,
      narrowMode: false,
      rightbarHidden: false,
      designId,
      tableGuid
    };
  },
  computed: {
    ...mapState([
      'leftActiveTab',
      'rightActiveTab',
      'formSize',
      'selectedColId',
      'hiddenControls',
      'selectedRowId',
      'jsCode',
      'cssCode',
      'newFieldList',
      'mobileDesignData'
    ]),
    ...mapState({
      viewDesign: state => state.helper.viewDesign,
      viewType: state => state.helper.viewType,
      showPreview: state => state.helper.showPreview
    }),
    ...mapGetters(['codeListMap', 'selectedCol']),
    selectedControl() {
      const sid = this.$store.state.selectedControlId;

      if (sid) {
        const data = this.$store.getters.controlDataMap[sid];
        if (data && data.control) {
          return data.control;
        }
      }

      return null;
    },
    cellPanelName() {
      if (!this.selectedColId) return '单元格';
      if (this.selectedCol && this.selectedCol.type == 'acc-item') {
        return '手风琴项';
      }
      return '单元格';
    },
    globalStyle: {
      get() {
        return this.$store.state.globalStyle;
      },
      set(value) {
        // console.log(value);
        this.$store.commit('updateGlobalStyle', {
          style: value
        });
      }
    },
    design: {
      get() {
        return this.$store.state.design;
      },
      set(value) {
        console.log('set design', value);
        this.$store.commit('updateDesign', value);
      }
    }
  },
  mounted() {
    // 暴露保存方法
    const that = this;
    window.FORM_DESIGNER.save = function(opt) {
      return that.saveToServer(opt);
    };
    if (this.enableRightBarCover) {
      this.calcWidth();
      window.addEventListener('resize', this.calcWidth);
    }
    // 获取数据
    Promise.all([
      this.$httpPost(window.formDesignerActions.getUrl, { designId, tableGuid }),
      this.$httpPost(window.formDesignerActions.getCodeItemUrl, { designId, tableGuid })
    ])
      .then(res => {
        const data = res[0];
        const codeMain = res[1].codeMain;
        const {
          extControls,
          fieldList,
          designData,
          macroTypes,
          sourceTables,
          dataTables,
          dataType,
          commonFields
        } = data;

        // 设置通用字段
        if (Array.isArray(commonFields)) {
          this.setCommonControls(commonFields);
        }

        // 设置字段列表
        if (fieldList && fieldList.length) {
          // 先转化下后端返回的字符串的 0 和 1
          fieldList.forEach(table => {
            table.fields.forEach(item => {
              item.required = parseInt(item.required, 10) == 1 ? true : false;
              item.fieldtype = parseInt(item.fieldtype, 10);
            });
          });
          this.setFieldList(fieldList);
        }
        // title
        if (data.name) {
          this.formTitle = data.name;
          document.title = this.formTitle;
        }
        // 设置代码项
        if (codeMain && codeMain.length) {
          this.setCodeList(codeMain);
        }
        // 设置 宏类型
        if (macroTypes && macroTypes.length) {
          this.setMacroTypes(macroTypes);
        }
        // 扩展控件
        if (extControls && extControls.length) {
          this.setExtControls(extControls);
        }
        // 设置子表
        if (sourceTables && sourceTables.length) {
          this.setSourceTables(sourceTables);
        }
        // 设置数据表
        if (dataTables && dataTables.length) {
          this.setDataTables(dataTables);
        }
        // 还原js css
        if (data.jsCode) {
          this.setJsCode(decrypt(data.jsCode));
        }
        if (data.cssCode) {
          this.setCssCode(decrypt(data.cssCode));
        }
        // 设置 创建新字段时 可选的数据库类型
        if (dataType) {
          this.setDBDataTypes(dataType);
        }
        // 还原设计区域数据
        if (designData) {
          if (designData.globalStyle) {
            this.globalStyle = designData.globalStyle;
          }
          if (designData.design) {
            this.design = designData.design;
          }
          if (designData.mobileDesignData) {
            this.$store.commit({
              type: 'replaceMobileDesign',
              mobileDesignData: designData.mobileDesignData
            });
          }
          if (designData.hiddenControls) {
            this.$store.commit('setHiddenControls', designData.hiddenControls);
          }

          if (designData.skin) {
            this.$store.commit('setSkin', { skinName: designData.skin });
          }

          // 设置历史数据 以便适配 autoIndex
          autoIndex.control.adapt(this.$store.getters.allControls);
          autoIndex.control.adapt(this.$store.state.hiddenControls);
          autoIndex.col.adapt(this.design);

          // 适配id生成器
          uid.adapt(this.$store.getters.allRows, row => row.id);

          this.$store.commit({
            type: 'controlCompatible',
            controls: this.$store.getters.allControls
          });

          this.dataLoaded = true;
          // 自动保存时间配置
          const autoSaveInterval = parseInt(data.autoSaveTime, 10);
          if (autoSaveInterval) {
            this.autoSaveInterval = autoSaveInterval;
          }
          // 全部完成后开始记录 undo
          this.$nextTick(() => {
            // 此处需要再次nextTick是由于 需等待上面提交的数据全部应用更新完成后再开始记录状态 避免记录一些无用信息
            this.$refs.header.$refs.shuttle.init();
          });

          // 开始 执行自动保存
          this.subscribeStore();
          this.doAutoSave();
        }
      })
      .catch(err => {
        console.error(err);
      });
    // buttonedit 的 弹出选择页面
    this.$httpPost(window.formDesignerActions.getListInfoUrl, { designId, tableGuid })
      .then(data => {
        const { SformListInfo } = data;
        if (Array.isArray(SformListInfo)) {
          this.$store.commit('setButtonEditPopupList', SformListInfo);
        }
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    ...mapMutations([
      'activeLeftTab',
      'setFieldList',
      'setCodeList',
      'setMacroTypes',
      'setExtControls',
      'setSourceTables',
      'setDataTables',
      'setJsCode',
      'setCssCode',
      'setDBDataTypes',
      'setCommonControls'
    ]),
    ...mapActions(['activeRightTab']),

    calcWidth: throttle(
      function() {
        this.narrowMode = window.innerWidth < 1610;
      },
      20,
      {
        leading: true,
        trailing: true
      }
    ),

    clear() {
      this.design = [];
    },
    preview() {
      return this.getData().then(data => {
        const { build } = data;
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Document</title>
          <style>html,body{margin:0;padding:0;}.container{margin:0 auto;}</style>
          <style>.row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-flow:row nowrap;-ms-flex-flow:row nowrap;flex-flow:row nowrap}.col{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;box-sizing:border-box;min-height:30px;padding:6px;line-height:30px;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.col.hasSub{padding:0}.col>*{position:relative;z-index:1}.col:after{position:absolute;z-index:0;top:0;right:0;bottom:0;left:0;display:block;-webkit-box-sizing:border-box;box-sizing:border-box;content:"";background:transparent}.col.hasSub:after{border-top-width:0 !important;border-right-width:0 !important;border-bottom-width:0 !important;border-left-width:0 !important}.col.mid:after{border-left-width:0 !important}.col.mid>.row>.col.first:after,.col.mid>.row-container>.row>.col.first:after,.col.last>.row>.col.first:after,.col.last>.row-container>.row>.col.first:after{border-left-width:0 !important}.col.mid ~ .col.last:after,.col.first ~ .col.last:after{border-left-width:0 !important}.row.mid>.col:after{border-top-width:0 !important}.row.mid>.col>.row>.col:after,.row.mid>.col>.dropArea>.row>.col:after{border-top-width:0 !important}.col{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.col.text-left{text-align:left}.col.text-center{text-align:center}.col.text-right{text-align:right}.col.vertical-top{vertical-align:top}.col.vertical-middle{vertical-align:middle}.col.vertical-bottom{vertical-align:bottom}.col.text-left{-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start}.col.text-center{-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.col.text-right{-webkit-box-align:end;-webkit-align-items:flex-end;-ms-flex-align:end;align-items:flex-end}.col.vertical-top{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start}.col.vertical-middle{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.col.vertical-bottom{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end}.design-form-title,.design-form-label{position:relative;display:block;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%}.design-form-label{padding-right:8px}.design-form-label.required:after{position:absolute;top:50%;right:-2px;display:block;width:8px;height:16px;margin-top:-8px;font-size:16px;line-height:16px;content:"*";color:red}.mini-textbox-readOnly .mini-textbox-border,.mini-textbox-readOnly .mini-textbox-input,.mini-buttonedit-readOnly .mini-buttonedit-border,.mini-buttonedit-readOnly .mini-buttonedit-input,.mini-readonly .mini-textboxlist-border{cursor:default;border:0;background:none}.mini-buttonedit-readOnly .mini-buttonedit-button,.mini-readonly .mini-textboxlist-close{display:none}.mini-readonly .mini-textboxlist-item{padding-right:8px}.row.acc-layout{display:block;padding-left:0;padding-right:0}.col.acc-item{display:block}.col.acc-item>.fui-acc-bd{padding-left:0;padding-right:0}.col.acc-item:after{border:none !important}</style>
          <style>${build.style}</style>
      </head>
      <body>
          <div class="container" style="width:${this.formSize.width}px;">${build.html}</div>
      </body>
      </html>
      `;

        const blob = new Blob([html], { type: 'text/html' });
        var a = document.createElement('a');
        a.download = '测试表单设计器生成布局';
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.html = html;
      });
    },
    /**
     * 组织获取移动设计的数据
     * 取pc端的数据配置重新赋值
     */
    getMobileData() {
      const mobileData = copy(this.mobileDesignData);
      const map = this.$store.getters.controlDataMap;
      mobileData.forEach(item => {
        if (item.control) {
          const id = item.control.id;
          if (map[id]) {
            item.control = map[id].control;
          }
        }
      });

      this.$store.commit({
        type: 'replaceMobileDesign',
        mobileDesignData: mobileData
      });

      return mobileData;
    },
    getData(opt = { htmlEncode: true, withBuild: true }) {
      // 是否需要html
      let htmlBuilder;
      let style = '';
      if (opt.withBuild) {
        htmlBuilder = this.getHtml();
        style = this.getStyle();
      } else {
        htmlBuilder = Promise.resolve('');
      }

      return htmlBuilder.then((html, err) => {
        if (err) {
          return console.error(err);
        }
        const designData = this.getDesignData();
        const hiddenControls = designData.hiddenControls;
        let allControls = copy(this.$store.getters.allControls);
        allControls.push(...hiddenControls);
        const data = {
          designData: designData,
          build: { html, style },
          controls: allControls,
          jsCode: encrypt(this.jsCode),
          cssCode: encrypt(this.cssCode),
          newFieldList: copy(this.newFieldList),
          designId: designId,
          tableGuid: tableGuid
        };
        // 是否 html 转移
        if (opt.withBuild && opt.htmlEncode != false) {
          if (data.build.html) {
            data.build.html = htmlEncode(data.build.html);
          }
        }
        return data;
      });
    },
    getDesignData() {
      this.$store.dispatch('dealSubmitControl');
      const hiddenControls = copy(this.hiddenControls);
      return {
        globalStyle: copy(this.globalStyle),
        hiddenControls: hiddenControls,
        design: copy(this.design),
        skin: this.$store.state.skin,
        mobileDesignData: this.getMobileData()
      };
    },
    /**
     * 获取未绑定字段的控件，发送至服务端进行字段创建字段
     * 再将服务端返回的字段信息绑定到对应的控件上
     */
    autoCreateField() {
      const allControls = [...this.$store.getters.allControls, ...this.$store.state.hiddenControls];
      if (!allControls || !allControls.length) return Promise.resolve();

      const hasKey = (obj, key) => {
        return Object.prototype.hasOwnProperty.call(obj, key);
      };
      // 获取得到所有未绑定字段的控件
      const unbindControls = allControls.filter(ctr => {
        return hasKey(ctr, 'bind') && ctr.bind == '';
      });

      console.log('当前所有未绑定字段的控件', unbindControls);

      if (!unbindControls.length) return Promise.resolve();

      const controls = copy(unbindControls);
      controls.forEach(ctr => {
        if (!ctr.name) {
          // ctr.name = ctr.namePrefix + '_' + (ctr.autoIndex || '');
          ctr.name = ctr.namePrefix + (ctr.autoIndex || '');
        }
      });

      // 提交信息以备自动创建字段
      console.log('=========\n 自动创建字段');
      return this.$httpPost(window.formDesignerActions.autoCreateFieldUrl, {
        designId,
        tableGuid,
        controls: controls
      }).then(res => {
        const fieldList = res.fieldList;

        if (!Array.isArray(fieldList) || !fieldList.length) {
          console.error('未获取到自动创建的字段数据');
          return Promise.reject(new Error('自动创建字段时失败'));
        }

        const fieldMaps = fieldList.reduce((t, c) => {
          if (!t[c.controlId]) {
            t[c.controlId] = c;
          } else {
            // 日期范围选择会返回两个字段 单独处理。。。
            t[c.controlId] = [t[c.controlId], c];
          }
          return t;
        }, {});

        this.$store.dispatch({
          type: 'bindFieldToControl',
          fieldMaps: fieldMaps,
          controls: unbindControls,
          newFieldList: fieldList.map(field => {
            const c = copy(field);
            delete c.controlId;
            return c;
          })
        });

        console.log('=========\n 自动创建字段成功并并绑定');
      });
    },
    /**
     * 合并分析数据 并重置分析数据
     * @param {Object} data 将要提交到服务端的数据
     */
    mergeAndRestAnalyData(data) {
      merge(data, {
        analysis: {
          ...window.FORM_DESIGNER_ANALYSIS
        }
      });
      window.FORM_DESIGNER_ANALYSIS.reset();
      return data;
    },
    saveToServer(noTips) {
      return this.autoCreateField()
        .then(() => {
          return this.getData();
        })
        .then(data => {
          // 校验
          if (
            window.FORM_DESIGNER &&
            window.FORM_DESIGNER.validateBeforeSave &&
            typeof window.FORM_DESIGNER.validate == 'function'
          ) {
            const validateResult = window.FORM_DESIGNER.validate(data);
            // 同步失败 直接reject
            if (validateResult === false) {
              return Promise.reject(new Error('校验失败'));
            }
            // promise 则在成功时继续
            if (validateResult && validateResult.then) {
              return validateResult.then(() => {
                return this.$httpPost(window.formDesignerActions.saveUrl, this.mergeAndRestAnalyData(data));
              });
            }
          }
          return this.$httpPost(window.formDesignerActions.saveUrl, this.mergeAndRestAnalyData(data));
        })
        .then(res => {
          const custom = res;
          if (parseInt(custom.msg, 10) == 1) {
            !noTips &&
              this.$msgbox({
                title: '系统提醒',
                message: '保存成功',
                type: 'success',
                showClose: true,
                callback() {
                  location.reload();
                }
              });
          } else {
            throw new Error(custom.msg || custom);
          }
        })
        .catch(err => {
          this.$msgbox({
            title: '系统提醒',
            message: '保存失败 ' + ((err && err.message) || ''),
            type: 'error',
            showClose: true
          });
        });
    },
    /**
     * 获取未绑定字段的控件，发送至服务端进行字段创建字段
     * 再将服务端返回的字段信息绑定到对应的控件上
     * @param {Object} opt 提问框配置
     * @param {(inputValue: string)=> Promise} saveFn 保存方法
     */
    promptAndSave(opt, saveFn) {
      return this.$msgbox(
        merge(
          {
            closeOnClickModal: false,
            showInput: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
            showConfirmButton: true,
            beforeClose: (action, instance, done) => {
              console.log(action, instance, done);
              if (action === 'confirm') {
                instance.$type = 'prompt';
                const result = instance.validate();
                if (!result) {
                  return;
                }

                instance.confirmButtonLoading = true;
                // 调用外部传递的保存方法 回调关闭
                saveFn(instance.inputValue)
                  .then(() => {
                    done();
                  })
                  .finally(() => {
                    instance.confirmButtonLoading = false;
                  });
              } else {
                done();
              }
            }
          },
          opt
        )
      );
    },
    // 保存下拉点击
    handleCommand(command) {
      if (command == 'saveToTpl') {
        return this.promptAndSave(
          {
            message: '请输入模板名称',
            title: '创建模板',
            inputValue: `${this.formTitle}_模板_1`,
            inputValidator(str) {
              if (!str || !str.trim()) {
                return '模板名称不能为空';
              }
              return /^[.\d\w-_\u4E00-\u9FA5]+$/.test(str) ? true : '模板名称格式不正确';
            }
          },
          inputValue => this.saveAsTpl(inputValue)
        );
      }

      if (command === 'saveToNewVersion') {
        this.confirmNewVersion();
      }

      if (command === 'saveToCopy') {
        return this.promptAndSave(
          {
            confirmButtonText: '生成',
            message: '请输入表单名称',
            title: '生成副本',
            inputValue: `${this.formTitle}_副本_1`,
            inputValidator(str) {
              if (!str || !str.trim()) {
                return '表单名称不能为空';
              }
              return /^[.\d\w-_\u4E00-\u9FA5]+$/.test(str) ? true : '表单名称格式不正确';
            }
          },
          inputValue => this.saveAsCopy(inputValue)
        );
      }
    },
    /**
     * 保存模板
     */
    saveAsTpl(name) {
      return this.getData()
        .then(data => {
          data.name = name;
          return this.$httpPost(window.formDesignerActions.saveAsTplUrl, data);
        })
        .then(res => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '模板保存成功'
          });

          return Promise.resolve();
        })
        .catch(err => {
          console.error(err);
          this.$message({
            type: 'error',
            message: '模板保存失败',
            showClose: true,
            duration: 3000
          });

          return Promise.reject();
        });
    },
    confirmNewVersion() {
      const dialog = new NewVersionDialogC({
        el: document.createElement('div')
      });
      dialog.save = value => this.saveAsNewVersion(value);
      document.body.appendChild(dialog.$el);
    },
    /**
     * 保存为新版本
     */
    saveAsNewVersion(tplId) {
      return this.getData({
        withBuild: false
      })
        .then(data => {
          data.tplId = tplId;
          return this.$httpPost(window.formDesignerActions.saveAsNewVersionUrl, data);
        })
        .then(res => {
          console.log(res);
          this.$confirm('新版本创建成功，是否进入新表单进行设计', '提示', {
            confirmButtonText: '开始设计',
            cancelButtonText: '留在当前页'
          }).then(() => {
            const { tableGuid, designId } = res;
            const url = `${location.pathname}?tableGuid=${tableGuid || ''}&designId=${designId || ''}`;
            location.replace(url);
          });
        })
        .catch(err => {
          console.error(err);
          this.$message({
            type: 'error',
            message: '新版本创建失败',
            showClose: true,
            duration: 3000,
            offset: ((window.innerHeight / 4) * 3) >> 0
          });
          return Promise.reject();
        });
    },
    /**
     * 保存为副本
     */
    saveAsCopy(name) {
      return this.getData({
        withBuild: false
      })
        .then(data => {
          data.name = name;
          return this.$httpPost(window.formDesignerActions.saveAsCopyUrl, data);
        })
        .then(res => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '表单副本保存成功'
          });
          // 提问是否进入新的设计器
          setTimeout(() => {
            this.$confirm('新表单创建成功，是否进入新表单进行设计', '提示', {
              confirmButtonText: '开始设计',
              cancelButtonText: '留在当前页'
            }).then(() => {
              const { tableGuid, designId } = res;
              const url = `${location.pathname}?tableGuid=${tableGuid || ''}&designId=${designId || ''}`;
              location.replace(url);
            });
          }, 100);
          return Promise.resolve();
        })
        .catch(err => {
          console.error(err);
          this.$message({
            type: 'error',
            message: '表单副本保存失败',
            showClose: true,
            duration: 3000,
            offset: ((window.innerHeight / 4) * 3) >> 0
          });
          return Promise.reject();
        });
    },

    /**
     * 替换使用模板
     */
    replaceDesign(designData) {
      if (designData.globalStyle) {
        this.globalStyle = designData.globalStyle;
      }

      this.design = designData.design || [];

      this.$store.commit('setHiddenControls', designData.hiddenControls || []);
      this.$store.commit('setSkin', { skinName: designData.skin });

      // 设置历史数据 以便适配 autoIndex
      autoIndex.control.adapt(this.$store.getters.allControls);
      autoIndex.control.adapt(this.$store.state.hiddenControls);
      autoIndex.col.adapt(this.design);

      // 适配id生成器
      uid.adapt(this.$store.getters.allRows, row => row.id);
    },

    subscribeStore() {
      // 订阅 store 的更新
      // 任意变动则需要自动保存
      // 自动保存成功后重置此值
      this.$store.subscribe(() => {
        this.needAutoSave = true;
      });
      // 避免重复调用
      this.subscribeStore = function() {};
    },
    autoSave(noTips) {
      // 无需自动保存的情况
      if (!this.needAutoSave) {
        console.log('[autoSave] 在上次保存后，无变动，无需自动保存');
        return Promise.resolve();
      }
      const data = {
        designData: this.getDesignData(),
        newFieldList: copy(this.newFieldList)
      };
      return this.$httpPost(window.formDesignerActions.autoSaveUrl, merge({ designId, tableGuid }, data))
        .then(res => {
          const custom = res;
          if (parseInt(custom.msg, 10) == 1) {
            !noTips &&
              this.$message({
                title: '系统提醒',
                message: '自动保存成功',
                type: 'success',
                showClose: true
              });
            // submit New Field List
            this.$store.commit('submitNewFieldList');

            console.log('[autoSave] 自动保存成功');
            this.needAutoSave = false;
          } else {
            throw new Error(custom.msg || custom);
          }
        })
        .catch(err => {
          this.$message({
            title: '系统提醒',
            message: '自动保存失败 ' + err.message,
            type: 'error',
            showClose: true
          });
        });
    },
    doAutoSave() {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = setTimeout(() => {
        this.autoSave().finally(() => {
          this.doAutoSave();
        });
      }, this.autoSaveInterval || 1000 * 60);
    },
    getStyle() {
      return this.$store.getters.colStyleText;
    },
    getHtml() {
      this.needRender = true;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject({ msg: '渲染超时！！！' });
        }, 3000);
        this.$nextTick(() => {
          this.$refs.builder.getHtmlContent().then(html => {
            resolve(html);
            console.log(html);
            clearTimeout(timer);
            this.needRender = false;
          });
        });
      }).catch(err => {
        this.needRender = false;
        console.error(err);
      });
    }
  },
  beforeDestroy() {
    if (this.enableRightBarCover) {
      window.removeEventListener('resize', this.calcWidth);
    }
    clearTimeout(this.autoSaveTimer);
  },
  watch: {
    design: {
      deep: false,
      handler(newDesigne) {
        console.group('design change');
        if (JSON.stringify(newDesigne) != JSON.stringify(this.design)) {
          console.log('未通过 vuex 的更新 需要提交');
          this.$store.commit('updateDesign', newDesigne);
        } else {
          console.log('无须提交');
        }
        console.groupEnd();
      }
    }
  }
};
</script>

<style lang="scss">
.design {
  $header_height: 50px;
  $left_width: 264px;
  $right_width: 400px;

  &-container {
    height: 100%;
    position: relative;
    padding-top: $header_height;
    box-sizing: border-box;

    // min-width: 900 + $left_width + $right_width + 40;
  }
  &-head {
    position: fixed;
    top: 0;
    z-index: 10;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    height: $header_height;
    line-height: $header_height;
    font-size: 16px;
    padding: 0 16px;
    box-shadow: 0px 1px 6px 0px rgba(215, 220, 228, 1);

    .view-toggle {
      margin-right: 20px;
      user-select: none;
    }
    // .preview-btn,
    // .save-btn {
    // }
  }
  // &-leftbar,
  // &-rightbar {
  //   z-index: 2;
  //   position: fixed;
  //   top: $header_height;
  //   bottom: 0;
  //   background: #fff;
  // }
  // &-leftbar {
  //   left: 0;
  //   width: $left_width;
  //   box-shadow: 1px 0px 6px 0px rgba(215, 220, 228, 1);
  // }
  // &-rightbar {
  //   width: $right_width;
  //   box-shadow: -1px 0px 6px 0px rgba(215, 220, 228, 1);
  //   right: 0;
  // }
  &-body {
    // margin-top: $header_height;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    // margin-left: $left_width;
    // margin-right: $right_width;
  }
  &-leftbar,
  &-rightbar {
    flex-grow: 0;
    flex-shrink: 0;
  }
  &-leftbar {
    width: $left_width;
    height: 100%;
    overflow: auto;
    user-select: none;
  }
  &-rightbar {
    width: $right_width;

    color: #555555;
  }
  &-view-container {
    flex-grow: 1;
    flex-shrink: 0;
    background: #f0f2f5;
    padding: 10px;

    overflow-y: auto;
  }
}
</style>

<style lang="scss">
.code-editor-dialog {
  .el-dialog__body {
    height: calc(100% - 80px);
    padding: 0;
    overflow: hidden;
  }
}
</style>
