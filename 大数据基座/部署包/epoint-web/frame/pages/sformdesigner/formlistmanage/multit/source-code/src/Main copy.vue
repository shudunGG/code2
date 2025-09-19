<template>
  <div class="design-container">
    <div class="design-head">
      {{ formTitle }}
      <Shuttle ref="shuttle" />
      <FormTplSelect @change="replaceDesign" />
      <span class="fe-mock-buttons" v-if="showLocalBtns">
        <button @click="save" style="margin-right:10px">本地暂存</button>
        <button @click="getLocalData" style="margin-right:10px">还原本地存储</button>
        <button @click="clear" style="margin-right:10px">清空内容</button>
      </span>
      <div class="design-head-right" style="float:right;">
        <el-switch class="view-toggle" v-model="viewType" active-value="real" inactive-value="design" active-text="真实模式" inactive-text="设计模式"></el-switch>
        <el-button class="preview-btn" type="primary" size="mini" @click="preview" :disabled="!design.length" v-if="showLocalBtns">预览</el-button>
        <el-button class="js-btn" type="primary" size="mini" @click="openEditor('js')">js编辑</el-button>
        <el-button class="css-btn" type="primary" size="mini" @click="openEditor('css')">css编辑</el-button>
        <!-- <el-button class="save-btn" type="primary" size="mini" @click="saveToServer" :disabled="!design.length">保存</el-button> -->
        <el-dropdown split-button type="primary" @click="saveToServer" @command="handleCommand" trigger="click" size="mini" style="margin-left: 10px">
          保存
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="saveToTpl">另存为模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="design-body" :class="{ narrow: narrowMode }">
      <!-- left -->
      <div class="design-leftbar">
        <!-- <Tabs :value="leftActiveTab" @input="activeLeftTab">
          <TabPanel label="布局" name="layout">
            <PanelLayout />
          </TabPanel>
          <TabPanel label="控件" name="control"><PanelControl /></TabPanel>
          <TabPanel label="常用" name="common"><div>此处为一些常用控件</div></TabPanel>
        </Tabs>-->
        <!-- <AccordionGroup> -->
        <Accordion title="布局">
          <PanelLayout />
        </Accordion>
        <Accordion title="控件">
          <PanelControl />
        </Accordion>
      </div>
      <!-- design-view -->
      <div class="design-view-container" :class="'view-' + viewType">
        <Design v-if="dataLoaded" :designData="design" :size="formSize" />
      </div>
      <!-- right -->
      <div class="design-rightbar" :class="{ pickup: narrowMode && rightbarHidden }">
        <el-button v-if="narrowMode" class="design-rightbar-toggle" icon="el-icon-d-arrow-right" plain @click="rightbarHidden = !rightbarHidden"></el-button>
        <Tabs default-active="form" :value="rightActiveTab" @input="activeRightTab">
          <TabPanel label="表单设置" name="form">
            <ConfigForm v-if="dataLoaded" />
          </TabPanel>
          <TabPanel label="组件设置" name="control">
            <ConfigControl :control="selectedControl" v-if="selectedControl"></ConfigControl>
            <ConfigRow :row-id="selectedRowId" v-if="selectedRowId"></ConfigRow>
            <div v-if="!selectedControl && !selectedRowId">请选择控件或行</div>
          </TabPanel>
          <TabPanel :label="cellPanelName" name="cell">
            <ConfigCell :selected-col="selectedCol" v-if="selectedColId" />
            <div v-else>请选择单元格</div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
    <LayoutGender ref="builder" v-if="needRender" :list="design" :global-style="globalStyle"></LayoutGender>

    <NewFiledDialog />
  </div>
</template>

<script>
import Tabs from './components/Tabs';
import TabPanel from './components/TabPanel';
import PanelLayout from './components/Panel-Layout';
import PanelControl from './components/Panel-Control';
import Design from './components/Design';
import ConfigCell from './components/config-panel/Config-Cell';
import ConfigForm from './components/config-panel/Config-Form';
import ConfigControl from './components/config-panel/Config-Control';
import ConfigRow from './components//config-panel/Config-Row';
import Shuttle from './components/Shuttle';
import Editor from './components/Editor';
import Accordion from './components/Accordion';
import NewFiledDialog from './components/NewFiledDialog';
import FormTplSelect from './components/FormTplSelect';

import LayoutGender from './components/RowGender/LayoutGender.vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { copy, htmlEncode, uid, encrypt, decrypt } from './util/index.js';
import merge from 'lodash.merge';
import { Promise } from 'q';
import autoIndex from './util/autoIndex';
import throttle from 'lodash.throttle';

const VERSION = process.env.VUE_APP_VERSION;
console.log(VERSION);
const LOCAL_KEY = `${location.pathname}-formdesign-V${VERSION}`;

const search = new URLSearchParams(location.search);
const designId = search.get('designId') || '';
const tableGuid = search.get('tableGuid') || '';
export default {
  name: 'app-main',
  components: {
    // MainDesign,
    Tabs,
    TabPanel,
    PanelLayout,
    Design,
    ConfigCell,
    ConfigForm,
    PanelControl,
    ConfigControl,
    ConfigRow,
    LayoutGender,
    Shuttle,
    Accordion,
    Editor,
    NewFiledDialog,
    FormTplSelect
  },
  data() {
    return {
      autoSaveTimer: null,
      autoSaveInterval: 1000 * 60,
      needAutoSave: false,

      dataLoaded: false,
      formTitle: '表单设计器',
      // viewType: 'design',
      viewType: 'real',
      needRender: false,
      showLocalBtns: process.env.VUE_APP_DEBUG_MODE == 'true' || /useMock/i.test(location.search),
      enableRightbarCover: true,
      narrowMode: false,
      rightbarHidden: false
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
      'newFieldList'
    ]),
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
        console.log(value);
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
    if (this.enableRightbarCover) {
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
        const { extControls, fieldList, designData, macroTypes, sourceTables, dataTables, dataType } = data;
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

          this.dataLoaded = true;
          // 自动保存时间配置
          const autoSaveInterval = parseInt(data.autoSaveTime, 10);
          if (autoSaveInterval) {
            this.autoSaveInterval = autoSaveInterval;
          }
          // 全部完成后开始记录 undo
          this.$nextTick(() => {
            // 此处需要再次nextTick是由于 需等待上面提交的数据全部应用更新完成后再开始记录状态 避免记录一些无用信息
            this.$refs.shuttle.init();
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
      'setDBDataTypes'
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

    viewTypeChange(ev) {
      this.viewType = ev.target.value;
    },
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
    getData() {
      return this.getHtml().then((html, err) => {
        if (err) {
          return console.error(err);
        }
        const designData = this.getDesignData();
        const hiddenControls = designData.hiddenControls;
        let allControls = copy(this.$store.getters.allControls);
        allControls.push(...hiddenControls);
        const data = {
          designData: designData,
          build: { html, style: this.getStyle() },
          controls: allControls,
          jsCode: encrypt(this.jsCode),
          cssCode: encrypt(this.cssCode),
          newFieldList: copy(this.newFieldList)
        };
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
        skin: this.$store.state.skin
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

        const fieldMaps = fieldList.reduce((t, c) => {
          t[c.controlId] = c;
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
    saveToServer() {
      return this.autoCreateField()
        .then(() => {
          return this.getData();
        })
        .then(data => {
          if (data.build.html) {
            data.build.html = htmlEncode(data.build.html);
          }
          return this.$httpPost(window.formDesignerActions.saveUrl, merge({ designId, tableGuid }, data))
            .then(res => {
              const custom = res;
              if (parseInt(custom.msg, 10) == 1) {
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
                message: '保存失败 ' + (err.message || ''),
                type: 'error',
                showClose: true
              });
            });
        });
    },
    handleCommand(command) {
      if (command == 'saveToTpl') {
        this.$prompt('请输入模板名称', '创建模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /^[\d\w-_\u4E00-\u9FA5]+$/,
          // inputErrorMessage: '模板名称格式不正确'
          inputValidator(str) {
            if (!str || !str.trim()) {
              return '模板名称不能为空';
            }
            return /^[\d\w-_\u4E00-\u9FA5]+$/.test(str) ? true : '模板名称格式不正确';
          }
        }).then(({ value }) => {
          this.saveAsTpl(value);
        });
      }
    },
    /**
     * 保存模板
     */
    saveAsTpl(name) {
      const data = {
        name: name,
        designData: this.getDesignData(),
        designId,
        tableGuid
      };
      return this.$httpPost(window.formDesignerActions.saveAsTplUrl, data)
        .then(res => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '保存成功'
          });
        })
        .catch(err => {
          console.error(err);
          this.$message({
            type: 'error',
            message: '保存失败'
          });
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
    autoSave() {
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
          try {
            const html = this.$refs.builder.getHtmlContent();
            resolve(html);
            clearTimeout(timer);
            this.needRender = false;
          } catch (err) {
            reject(err);
          }
        });
        // const gender = new Vue({
        //   ...RowGender,
        //   propsData: { list: this.design, globalStyle: this.globalStyle },
        //   mounted() {
        //     this.$nextTick(() => {
        //       const html = this.$el.innerHTML;
        //       resolve(html);
        //       this.$destroy();
        //     });
        //   }
        // }).$mount(this.$refs.gendered);
      }).catch(err => {
        this.needRender = false;
        console.error(err);
      });
    }
  },
  beforeDestroy() {
    if (this.enableRightbarCover) {
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
