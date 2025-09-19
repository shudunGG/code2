<template>
    <div class="left-panel">
        <div class="search-panel left-search">
            <input type="text" v-model="keySearch" placeholder="输入关键字">
        </div>
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item :title="table.name" :key="table.id" v-if="!table.hide" :name="table.id" v-for="(table, tindex) in shareFieldList">
                <draggable class="control-drag-area" :list="table.children" @start="moveStart" @end="moveEnd($event)" :group="{ name: 'control', pull: 'clone', put: false }" swapThreshold="0.3" :sort="false" :clone="createdCommonControl" @change="log" :emptyInsertThreshold="20" :move="checkMove">
                    <div class="field-item template-item" v-if="!field.hide" :class="{disable: field.isUse}" :data-name="field.name" :data-id="tindex + '_' + index" v-for="(field, index) in table.children" :key="field.id" :data-control-type="field.type">
                        <span class="field-item-name">{{field.name}}</span>
                        <span class="field-item-type" v-if="field.typeName">[{{field.typeName}}]</span>
                        <i class="field-item-icon" :class="{active: fieldCurrent == tindex+'_'+index || field.shareName}" @click="showConfig(field, tindex, index)"></i>
                    </div>
                </draggable>
            </el-collapse-item>
        </el-collapse>
        <!-- 配置相关 -->
        <div class="config-panel" v-if="isShowConfig">
            <h3 class="config-panel-title">{{currentShowField.name}}</h3>
            <i class="el-icon-close config-panel-close" @click="hideConfig"></i>
            <div class="search-panel">
                <input type="text" v-model="configSearch" placeholder="输入关键字">
            </div>
            <div class="config-panel-collapse">
                <el-collapse v-model="activeConfig" @change="handleChange">
                    <el-collapse-item :title="table.name" v-if="!table.hide" :name="table.id" v-for="table in configList" :key="table.id">
                        <el-checkbox class="check-field" :class="{'same-field': (field.shareName && currentShowField.shareName == field.shareName)}" v-model="field.check" v-if="!field.hide" :disabled="field.isUse || !!field.shareName" :key="field.id" v-for="field in table.children" :label="field.name"></el-checkbox>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="config-panel-button">
                <el-button type="primary" @click="saveConfig">保存</el-button>
                <el-button class="config-panel-button-right" type="text" @click="clearRelative">清空合并关系</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { uid, copy, controlAutoIndex } from '../util/index.js';
import eventEmitter from '../mixins/eventEmitter';
import throttle from 'lodash.throttle';
import { mapState } from 'vuex';
const CONTROL_LIST = window.FORM_DESIGN_CONFIG.controlList;

const search = new URLSearchParams(location.search);
const designId = search.get('designId') || '';
const tableGuid = search.get('tableGuid') || '';

// let prevState = null;

// 需要直接忽略掉的状态
const ignoreMutation = ((arr) => {
  const map = {};
  arr.forEach((t) => {
    map[t] = true;
  });
  return map;
})([
  'activeRightTab',
  'updateLineTop',
  'updateLineLeft',
  'showHLine',
  'hideHLine',
  'showVLine',
  'hideVLine',
  'layoutDragStart',
  'layoutDragEnd',
  'controlDragStart',
  'controlDragEnd',
  'toggleViewDesign',
  'updateViewType',

  'setJsCode',
  'setCssCode',
  'addToNewFieldList'
]);
// 连续触发 需要节流的状态
const throttleMutation = ((arr) => {
  const map = {};
  arr.forEach((t) => {
    map[t] = true;
  });
  return map;
})(['updateRowHeight', 'updateColWidth']);

export default {
  name: 'panel-control',
  data() {
    return {
      baseControls: copy(CONTROL_LIST),
      activeNames: ['1'],
      activeConfig: ['c-1', 'c-2'],
      isShowConfig: false,
      check: true,
      currentShowField: {},
      keySearch: '',
      configSearch: '',
      fieldCurrent: '',
      // fieldList: [], // 数据域数据
      configList: [], // 数据域对应的配置数据
      canMove: false
    };
  },
  computed: {
    ...mapState(['shareFieldList']),
    extControls() {
      return this.$store.state.extControls;
    },
    design() {
      return this.$store.state.design;
    }
  },
  mixins: [eventEmitter],
  mounted() {
    this.update();
    this.getFieldList();
    this.subscribeStore();
  },
  methods: {
    update() {
      this.dispatch('accordion', 'updated');
    },
    subscribeStore() {
      // subscribe vuex mutation
      // 在每次状态更新后进行处理
      // 若此状态需要更新 则将前一个状态推入 undo 栈中
      // 每次状态更新均将本次修改后的最新状态序列化记录， 下一次变化时，取这个值即为前一次的状态
      // 直接使用 throttle 来做合成是有问题的 throttle 将会是异步的 记录的时机已经推迟 状态可能不对 而同时 leading 和 trailing 本身又无法合成了
      // 因此 throttle 仅用来处理连续的事件 其他连续提交 手动分组
      const that = this;
      //   prevState = JSON.stringify(this.$store.state);

      const subscribeFn = (mutation) => {
        // const type = mutation.type;
        if (mutation.type === 'removeControl') {
          if (mutation.payload && mutation.payload.selectedControl) {
            that.recoveryCanUse(mutation.payload.selectedControl.id, false);
          }
        }

        // 删除行
        if (mutation.type === 'removeRow') {
          if (mutation.payload && mutation.payload.row) {
            var row = mutation.payload.row;
            if (row.type === 'row-layout') {
              // 删除行
              row.cols.forEach((col) => {
                col.controls.forEach((control) => {
                  that.recoveryCanUse(control.id, false);
                });
                if (col.subs.length) {
                  that.recursionRemove(col.subs);
                }
              });
            } else if (row.type === 'acc-layout') {
              // 删除手风琴
              row.cols.forEach((col) => {
                if (col.subs.length) {
                  that.recursionRemove(col.subs);
                }
              });
            }
          }
        }
        // if (mutation.payload && mutation.payload.shuttle) {
        //   this.storeState(type, prevState, mutation.payload.group);
        // }

        // prevState = JSON.stringify(state);
      };
      const throttleSub = throttle(subscribeFn, 300, { leading: true, trailing: false });

      this.$store.subscribe((mutation, state) => {
        const type = mutation.type;
        if (ignoreMutation[type]) return;

        if (throttleMutation[type]) {
          throttleSub(mutation, state);
        } else {
          subscribeFn(mutation, state);
        }
      });
    },
    // 递归恢复数据域中的控件状态
    recursionRemove(subs) {
      const that = this;
      subs.forEach((sub) => {
        sub.cols.forEach((subCol) => {
          subCol.controls.forEach((control) => {
            that.recoveryCanUse(control.id, false);
          });
          if (subCol.subs) {
            that.recursionRemove(subCol.subs);
          }
        });
      });
    },
    handleChange(val) {
      console.log(val);
    },
    getFieldList() {
      this.$httpPost(window.formDesignerActions.getFieldListUrl, { formId: tableGuid, designId })
        .then((data) => {
          this.$store.commit('setShareFieldList', {
            value: data
          });
          // this.fieldList = data;
          this.activeNames = [];
          if (data.length) {
            this.activeNames = [data[0].id];
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getFieldConfig() {
      let tableId = this.currentShowField.tableId;
      let fieldName = this.currentShowField.fieldName;
      let formGuid = this.currentShowField.formGuid;
      let fieldType = this.currentShowField.fieldType;
      let type = this.currentShowField.type;

      this.$httpPost(window.formDesignerActions.getFieldConfigUrl, {
        formId: tableGuid,
        designId,
        fieldType,
        type,
        tableId,
        fieldName,
        formGuid
      })
        .then((data) => {
          this.configList = data;
          this.isShowConfig = true;
          this.activeConfig = [];
          data.forEach((el) => {
            this.activeConfig.push(el.id);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showConfig(field, tindex, index) {
      const that = this;
      that.fieldCurrent = tindex + '_' + index;
      this.currentShowField = field;
      this.getFieldConfig();
    },
    hideConfig() {
      this.isShowConfig = false;
      this.fieldCurrent = '';
    },
    /**
     * 创建通用字段 即带一些预设信息的控件
     */
    createdCommonControl(tpl) {
      const ctr = this.createControl(tpl);
      const props = copy(tpl.props);

      Object.keys(props).forEach((k) => {
        ctr[k] = props[k];
      });

      return ctr;
    },
    createControl(tpl) {
      const { type, typeIcon, name, tableId, props } = tpl; // 20210422
      const controlConfig = window.FORM_DESIGN_CONFIG.controls[type];
      if (!controlConfig) {
        throw new Error(`控件的 ${type} 配置信息不存在，无法创建`);
      }
      const control = copy(controlConfig);
      delete control.configItems;
      const idx = controlAutoIndex.getIndex(type);
      const id = uid();

      tpl['uuid'] = type + '-' + id;

      control.id = type + '-' + id;
      control.namePrefix = name;
      control.autoIndex = idx;
      control.name = '';
      control.icon = typeIcon;
      // 20210422
      // 多表合一时， 控件上加上是属于哪个表的
      control.tableId = tableId;

      // 检查绑定的字段是否有效，多个表合一是新的物理表，如果之前的属性不在表内，则清空
      const fieldMap = this.$store.getters.fieldMap;

      if (props.bind && !(props.bind in fieldMap)) {
        control.bind = '';
        control.props && (control.props.bind = '');
        props.bind = '';
      }

      if (props.bind2 && !(props.bind2 in fieldMap)) {
        control.bind2 = '';
        control.props && (control.props.bind2 = '');
        props.bind = '';
      }

      if (!control.width) {
        control.width = '100%';
      }

      // 文字类控件需要应用全局样式
      if (['title', 'label', 'output'].indexOf(type) != -1) {
        this.copyGlobalStyleToControl(control);
      }

      return control;
    },
    recoveryCanUse(uuid, hasUse) {
      this.shareFieldList.forEach((el) => {
        el.children.forEach((child) => {
          if (child.uuid === uuid) {
            child.isUse = hasUse;
          }
        });
      });
    },
    copyGlobalStyleToControl(ctr) {
      const {
        fontSize,
        fontFamily,
        fontColor,
        fontBolder,
        fontItalic,
        fontUnderline
        // textAlign,
        // verticalAlign
      } = this.$store.state.globalStyle;
      if (ctr.type == 'label') {
        ctr.fontSize = fontSize;
      }
      ctr.fontFamily = fontFamily;
      ctr.fontColor = fontColor;
      ctr.fontBolder = fontBolder;
      ctr.fontItalic = fontItalic;
      ctr.fontUnderline = fontUnderline;
      // ctr.textAlign = textAlign;
      // ctr.verticalAlign = verticalAlign;
    },
    moveStart() {
      this.canMove = false;
    },
    moveEnd(ev) {
      // const that = this;
      if (this.canMove) {
        var _index = ev.item.dataset.id;
        var pIndex = _index.split('_')[0],
          index = _index.split('_')[1];
        this.shareFieldList[pIndex].children[index].isUse = true;

        // this.$store.commit('setShareFieldList', {
        //   value: that.fieldList,
        //   shuttle: true
        // });

        var props = this.shareFieldList[pIndex].children[index].props || '';
        if (props) {
          props.id = this.shareFieldList[pIndex].children[index].uuid;
          this.$store.commit('updateControlProp', {
            control: props,
            prop: 'emptytext',
            value: props.emptytext,
            shuttle: false
          });
        }
      }
    },
    checkMove(ev) {
      // 禁止本列表进入放入
      if (this.$el == ev.to || this.$el.compareDocumentPosition(ev.to) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        return false;
      }
      // 隐藏域只能放入隐藏区域 隐藏区域只能放置隐藏域
      const data = ev.draggedContext.element;
      // if(data.isUse) {
      //   return;
      // }
      if (ev.dragged.classList.contains('disable')) {
        return false;
      }
      this.canMove = true;
      return !((data.type === 'hiddenfield') ^ ev.to.classList.contains('design-hidden-area'));
    },
    log() {
      console.log('log');
      console.log(...arguments);
    },
    saveConfig() {
      let arr = [],
        idArr = [];
      const that = this;

      let _list = JSON.parse(JSON.stringify(this.configList));
      _list.forEach((el) => {
        el.children.forEach((child) => {
          if (!child.isUse && child.check) {
            arr.push(child);
            idArr.push(child.id);
          }
        });
      });

      this.saveConfigUrl(arr, function() {
        that.getFieldList();
        that.shareFieldList.forEach((el) => {
          el.children.forEach((child) => {
            if (idArr.indexOf(child.id) > -1) {
              if (!that.currentShowField.isUse) {
                child.isUse = false;
              }
              that.removeFromDesign(child.uuid);
            }
          });
        });
        that.isShowConfig = false;
        that.fieldCurrent = '';
      });
    },
    saveConfigUrl(config, callback) {
      let tableId = this.currentShowField.tableId;
      let fieldName = this.currentShowField.fieldName;
      let formGuid = this.currentShowField.formGuid;
      let fieldType = this.currentShowField.fieldType;
      let name = this.currentShowField.name;
      let type = this.currentShowField.type;
      this.$httpPost(window.formDesignerActions.saveFieldConfigUrl, {
        formId: tableGuid,
        designId,
        tableId,
        fieldName,
        name,
        type,
        formGuid,
        fieldType,
        list: config
      })
        .then((res) => {
          let custom = res.custom || '';
          let msg = '保存成功';
          if (custom) {
            if (typeof custom == 'string') {
              custom = JSON.parse(custom);
            }
            if (typeof custom == 'object') {
              msg = custom.msg || '保存成功';
            }
          }
          this.$msgbox({
            title: '系统提醒',
            message: msg,
            type: 'success',
            showClose: true,
            callback() {}
          });
          if (typeof callback == 'function') {
            callback();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 递归删除某个id的控件
    recursionRemoveSome(subs, uuid) {
      const that = this;
      let controlDataIndex, parentControl;
      subs.forEach((sub) => {
        sub.cols.forEach((subCol) => {
          subCol.controls.forEach((control, cIndex) => {
            that.recoveryCanUse(control.id, false);
            if (control.id === uuid) {
              controlDataIndex = cIndex;
              parentControl = subCol;
              parentControl.controls.splice(controlDataIndex, 1);
            }
          });
          if (subCol.subs) {
            that.recursionRemoveSome(subCol.subs, uuid);
          }
        });
      });
    },
    removeFromDesign(uuid) {
      // controlData,
      const that = this;
      let controlDataIndex, parentControl;
      var designList = JSON.parse(JSON.stringify(this.design));
      designList.forEach((design) => {
        // 手风琴
        if (design.type === 'acc-layout') {
          design.cols.forEach((col) => {
            that.recursionRemoveSome(col.subs, uuid);
            // col.subs.forEach(sub => {
            //   sub.cols.forEach(subCol => {
            //     subCol.controls.forEach((control, cIndex) => {
            //       if (control.id === uuid) {
            //         // controlData = control;
            //         controlDataIndex = cIndex;
            //         parentControl = subCol;
            //         parentControl.controls.splice(controlDataIndex, 1);
            //       }
            //     });
            //   });
            // });
          });
        } else {
          // 删除行
          design.cols.forEach((col) => {
            col.controls.forEach((control, cIndex) => {
              if (control.id === uuid) {
                // controlData = control;
                controlDataIndex = cIndex;
                parentControl = col;
                parentControl.controls.splice(controlDataIndex, 1);
              }
            });
            if (col.subs.length) {
              that.recursionRemoveSome(col.subs, uuid);
            }
          });
          // // 行
          // design.cols.forEach(col => {
          //   // 列
          //   col.controls.forEach((control, cIndex) => {
          //     // 控件
          //     if (control.id === uuid) {
          //       // controlData = control;
          //       controlDataIndex = cIndex;
          //       parentControl = col;
          //       parentControl.controls.splice(controlDataIndex, 1);
          //     }
          //   });
          // });
        }
      });

      this.$store.commit('updateDesign', designList);
    },
    clearRelative() {
      let shareName = this.currentShowField.shareName;
      if (shareName) {
        this.$httpPost(window.formDesignerActions.deleteFieldRelationUrl, { formId: tableGuid, shareName, designId })
          .then((res) => {
            let custom = res.custom || '';
            let msg = '清除成功';
            if (custom) {
              if (typeof custom == 'string') {
                custom = JSON.parse(custom);
              }
              if (typeof custom == 'object') {
                msg = custom.msg || '清除成功';
              }
            }
            this.$msgbox({
              title: '系统提醒',
              message: msg,
              type: 'success',
              showClose: true,
              callback() {}
            });
            this.getFieldConfig();
            this.getFieldList();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.configList.forEach((el) => {
          el.children.forEach((child) => {
            if (!child.isUse && child.check) {
              child.check = false;
            }
          });
        });
      }
    }
  },
  watch: {
    extControls() {
      this.update();
    },
    baseControls() {
      this.update();
    },
    keySearch(newval) {
      this.shareFieldList.forEach((el) => {
        let hide = true;
        el.children.forEach((child) => {
          if (child.name.indexOf(newval) > -1) {
            // 存在就不隐藏
            child['hide'] = false;
            hide = false;
          } else {
            child['hide'] = true;
          }
        });
        el['hide'] = hide;
      });
    },
    configSearch(newval) {
      this.configList.forEach((el) => {
        let hide = true;
        el.children.forEach((child) => {
          if (child.name.indexOf(newval) > -1) {
            // 存在就不隐藏
            child['hide'] = false;
            hide = false;
          } else {
            child['hide'] = true;
          }
        });
        el['hide'] = hide;
      });
    }
  }
};
</script>

<style lang="scss">
.search-panel {
  input {
    width: 100%;
    height: 34px;
    line-height: 34px;
    background-color: transparent;
    border: 0;
    display: block;
    padding: 3px 30px 3px 14px;
    box-sizing: border-box;
    outline: none;
  }
  background: url('../assets/images/field/icon_search.png') 235px center no-repeat;
  &.left-search {
    margin: -20px -14px 0;
    background-color: #f8f9fb;
  }
}
.field-item {
  padding: 0 40px 0 5px;
  height: 32px !important;
  line-height: 32px !important;
  color: #666;
  background-color: #f9fafc;
  position: relative;
  margin: 0px !important;
  margin-bottom: 5px !important;
  width: 100% !important;
  &.disable {
    color: #cacaca;
    .field-item-type {
      color: #cacaca;
    }
  }
  &-icon {
    position: absolute;
    top: 5px;
    right: 0;
    display: none;
    width: 30px;
    height: 22px;
    background: url('../assets/images/field/link.png') center no-repeat;
    &:hover,
    &.active {
      cursor: pointer;
      background: url('../assets/images/field/link_icon.png') center no-repeat;
      display: block !important;
    }
  }
  &:hover &-icon {
    display: block;
  }
  &-type {
    color: #999;
  }
}

.config-panel {
  width: 234px;
  position: fixed;
  left: 258px;
  top: 24%;
  z-index: 11;
  background: #fff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
  .check-field {
    width: 100%;
    &.same-field .el-checkbox__label {
      color: #409eff;
    }
  }
  &-title {
    height: 40px;
    line-height: 40px;
    margin: 0;
    padding: 0 8px;
  }
  &-close {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 11;
    &:hover {
      cursor: pointer;
    }
  }
  .el-collapse-item__wrap {
    background: transparent !important;
  }
  .el-collapse-item__content {
    padding-bottom: 10px;
  }
  .search-panel {
    background-color: #f8f9fb;
    padding: 0 8px;
    height: 32px;
    line-height: 32px;
    background-position-x: 210px;
    input {
      padding-left: 0;
    }
  }
  &-collapse {
    padding: 0 8px;
    box-sizing: border-box;
    height: 296px;
    overflow-y: auto;
  }
  &-button {
    height: 50px;
    box-sizing: border-box;
    padding: 8px 8px;
    box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.12);
    span {
      font-size: 14px !important;
    }
    &-right {
      float: right;
      color: #555555;
    }
  }
}
</style>