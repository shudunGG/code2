<template>
  <div class="event-config">
    <div class="event-config-header">
      <!-- 类型选择 -->
      <el-select class="event-config-typeselect" v-model="eventType" size="small" :disabled="!eventTypeChangeable || (!eventTypeList.length || eventTypeList.length == 1)" @change="onEventTypeChanged">
        <el-option v-for="item in eventTypeList" :key="item.type" :value="item.type" :label="item.name"></el-option>
      </el-select>
      <!-- condition -->
      <div class="event-config-condition" v-show="showCondition">
        当满足 This
        <el-select class="event-operation" v-model="condition.operation" size="small">
          <el-option v-for="item in operationList" :key="item" :value="item" :label="operationNames[item]"></el-option>
        </el-select>
        <!-- <el-select v-model="condition.target" size="small">
          <el-option v-for="item in controlDataList" :key="item.id" :value="item.id" :label="item.text || item.id"></el-option>
        </el-select> -->
        <virtual-select
          clearable
          v-model="condition.target" 
          size="small"
          :items="controlDataList"
          :buffer="34"
          :item-size="34"
          filterable
          filter-key="text"
        >
          <template #default="{ item }">
            <el-option slot="default" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </template>
        </virtual-select>
      </div>
    </div>

    <!-- 内容部分  -->
    <div class="event-config-body">
      <div class="event-config-lane choice">
        <h3 class="event-config-title">选择动作</h3>
        <div class="event-config-list choice" v-if="eventConfigMap[eventType]">
          <div class="choice-action-item" :class="{ disabled: selectedActions[item.type] }" v-for="item in eventConfigMap[eventType].actionList" :key="item.type" @click="addAction(item.type)">{{ item.name }}</div>
        </div>
      </div>
      <div class="event-config-lane action-config">
        <h3 class="event-config-title">组织动作</h3>
        <div class="event-config-list" v-if="actions.length">
          <div class="action-item" v-for="(item, index) in actions" :key="item.type">
            <h4 class="action-header" :class="{ active: item.type == currentAction, collaspe: item.collaspe }" @click="currentAction = item.type">
              <span class="el-icon-arrow-down action-toggle" @click.stop="item.targets.length && (item.collaspe = !item.collaspe)"></span>
              <span class="action-name">{{ item.name }}</span>
              <span class="action-remove el-icon-close" @click.stop="removeAction(index, item.type == currentAction)"></span>
            </h4>
            <div class="action-targets" :style="'height:' + 30 * item.targets.length + 'px'" v-if="item.targets.length">
              <div v-for="target in item.targets" :key="target.id">
                {{ targetNameMap[target.id] }}
                <span v-if="target.setValueField">{{ fieldNameMap[target.setValueField] }}</span>
              </div>
            </div>
            <span v-else>请在右侧为动作选择目标</span>
          </div>
        </div>
        <span v-else>请先从左侧添加动作</span>
      </div>
      <div class="event-config-lane targets">
        <h3 class="event-config-title">
          对象目标 {{ currentActionName }}
          <div v-if="currentAction == 'assignment'">
            <div class="event-config-target-table">
              <label>赋值来源数据表：</label>
              <el-select v-model="targetTable" style="float:right;margin-right:10px;" size="mini" @change="onTargetTableChange" filterable>
                <el-option v-for="table in dataTables" :key="table.id" :value="table.id" :label="table.text"></el-option>
              </el-select>
            </div>
            <div class="event-config-target-tablefield" v-if="currentAction == 'assignment'">
              <label>数据查询字段：</label>
              <el-select v-model="targetTableField" style="float:right;margin-right:10px;" size="mini" filterable>
                <el-option v-for="item in fieldList" :key="item.id" :value="item.id" :label="item.text"></el-option>
              </el-select>
            </div>
          </div>
        </h3>
        <TargetDisplay class="event-config-list" :class="{ table: currentAction == 'assignment', tablefield: currentAction == 'assignment' }" @ckecked-change="handleTargetChange" v-if="currentAction" :type="treeDisplayType" :default-targets="currentActionTargets" :action-type="currentAction" :field-list="fieldList" :field-name-map="fieldNameMap" :except-id="controlData.id" />
        <span v-else>请先选择动作</span>
      </div>
    </div>
    <!--  -->
    <div class="event-config-footer">
      <el-checkbox v-model="runAtInit">初始化执行</el-checkbox>
      <el-button type="primary" size="mini" @click="save">保存</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { copy } from '../../util/index.js';
import { eventInfo, eventInfoArr, actionInfo, operationNames } from './namemap.js';

import { getDataWithCache } from '@/util/getDataWithCache.js';
import VirtualSelect from "@/components/VirtualSelect.vue";

export default {
  name: 'event-config',
  components: {
    TargetDisplay: () => import('./TargetDisplay.vue'),
    VirtualSelect
  },
  props: {
    editType: {
      type: String,
      required: true,
      validator(v) {
        return /^(?:add|edit)$/.test(v);
      }
    },
    defaultEventType: {
      type: String,
      required: true
    },
    eventTypeList: {
      type: Array,
      default: () => eventInfoArr
    },
    controlData: {
      type: Object
    },
    // 编辑模式下传入的事件描述对象
    eventDescription: [Object, null],
    targetNameMap: { type: Object }
  },
  computed: {
    // 事件类型是否可更改
    eventTypeChangeable() {
      return this.editType == 'add';
    },
    // 可选表格列表
    dataTables() {
      return this.$store.state.dataTables;
    },
    // 统计得出所有已选的动作
    selectedActions() {
      const map = {};
      this.actions.forEach(action => {
        map[action.type] = true;
      });
      return map;
    },
    // 是否显示 条件配置
    showCondition() {
      return this.eventType == 'valuechanged:compare';
    },
    // 目标选择树的显示类型 all 全部； controls 控件； combobox；
    treeDisplayType() {
      if (/^(?:show|hide|clear)$/.test(this.currentAction)) {
        return 'all';
      }
      if (this.currentAction == 'assignment') {
        return 'controls';
      }
      if (this.currentAction == 'setData') {
        return 'combobox';
      }
      return '';
    },
    // 当前动作的名称
    currentActionName() {
      const info = this.actionInfo[this.currentAction];
      if (info) return `(${info.name})`;
      return '';
    },
    // 当前动作的 已选目标
    currentActionTargets() {
      for (let action of this.actions) {
        if (action.type == this.currentAction) {
          return action.targets || [];
        }
      }
      return [];
    },
    fieldNameMap() {
      const map = {};

      this.fieldList.forEach(item => {
        map[item.id] = item.text;
      });

      return map;
    }
  },
  data() {
    return {
      // 动作信息
      actionInfo,

      eventType: this.defaultEventType,
      // eventTypeList: eventInfoArr,
      eventConfigMap: eventInfo,

      condition: {
        operation: '==',
        target: ''
      },
      // operationList: ['<', '<=', '==', '!=', '>=', '>'],
      operationList: ['==', '!='],
      operationNames: operationNames,
      // 配置好的动作
      actions: [],
      // 当前激活的 action
      currentAction: '',

      // 初始时执行？
      runAtInit: false,

      // 赋值目标数据表
      targetTable: '',
      // 条件查询的字段
      targetTableField: '',
      // 可选字段列表
      fieldList: [],

      // 当前控件的可能的值列表
      controlDataList: []
    };
  },
  created() {
    this.getFieldList();
    this.getControlDataList();
    // if (this.editType == 'edit') {
    this.setEditEventData();
    // }
  },
  mounted() {
    if (this.editType == 'add' && this.eventConfigMap[this.eventType].actionList.length == 1) {
      this.addAction(this.eventConfigMap[this.eventType].actionList[0].type);
    }
  },
  methods: {
    /**
     * 设置编辑模式下初始化的事件数据
     * 涉及修改以下数据
     * eventType condition actions targetTable targetTableField
     */
    setEditEventData() {
      const { type, runAtInit, conditions, actions } = copy(this.eventDescription);

      // 事件类型
      if (type) {
        this.eventType = type;
      }

      // 条件
      if (conditions && conditions.length) {
        this.condition.operation = conditions[0].operation;
        this.condition.target = conditions[0].target;
      }

      // 动作
      if (Array.isArray(actions)) {
        this.actions = actions.map(action => {
          if (action.type == 'assignment') {
            this.targetTable = action.sourceTableId;

            this.targetTableField = action.sourceTableField || '';
          }
          return {
            ...action,
            name: actionInfo[action.type].name,
            collaspe: false
          };
        });
        this.currentAction = this.actions[0].type;
      } else {
        if (this.actions.length) this.actions = [];
        this.currentAction = '';
      }
      // 初始执行？
      this.runAtInit = runAtInit;
    },
    /**
     * 获取字段列表
     */
    getFieldList() {
      if (!this.targetTable) {
        return (this.fieldList = []);
      }
      getDataWithCache(
        window.formDesignerActions.getTableFieldsUrl,
        { tableId: this.targetTable },
        'targerTable-' + this.targetTable
      )
        .then(res => {
          const data = res.TableStruct;
          if (Array.isArray(data)) {
            this.fieldList = data;
          } else {
            this.fieldList = [];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    /**
     *
     */
    getControlDataList() {
      this.controlDataList = [];
      if (!this.showCondition) {
        return;
      }
      // 如果控件是手动配置的静态数据源
      if (this.controlData.data) {
        return (this.controlDataList = copy(this.controlData.data));
      }
      // 否则发请求远程获取
      return this.$httpPost(window.formDesignerActions.getControlDataListUrl, { controlData: this.controlData })
        .then(data => {
          if (Array.isArray(data)) {
            this.controlDataList = data;
          } else {
            throw new Error('获取控件数据出错!');
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    addAction(type) {
      if (this.selectedActions[type]) {
        return;
      }
      this.actions.push(this.createAction(type));
      this.currentAction = type;
    },
    createAction(type) {
      const { name } = actionInfo[type];
      const actionData = { type, name, targets: [], collaspe: false };

      return actionData;
    },
    removeAction(index, isActive) {
      this.actions.splice(index, 1);
      if (isActive) {
        this.currentAction = '';
      }
    },
    handleTargetChange(data) {
      const aimAction = this.actions.filter(t => t.type == this.currentAction)[0];
      if (!aimAction) {
        console.error('目标动作不存在');
        return;
      }
      aimAction.targets = data;
    },
    onEventTypeChanged() {
      console.log('event type change');
      this.actions = [];
      this.currentAction = '';
    },
    // 事件提交前的验证
    validate() {
      return new Promise((resolve, reject) => {
        const errors = [];

        // condition是否完成
        if (this.showCondition && !(this.condition.operation && this.condition.target)) {
          // const condition
          errors.push({
            type: 'condition',
            // target: '',
            message: '事件条件未填写完整'
          });
        }

        // 是否配置了动作
        if (!this.actions.length) {
          errors.push({
            type: 'action',
            message: '还未配置任何事件动作！'
          });
        } else {
          // action 完整性校验
          this.actions.forEach(action => {
            // 必须配置动作！
            if (!action.targets || !action.targets.length) {
              errors.push({
                type: 'action',
                target: action,
                message: `【${action.name}】动作未配置任何操作目标！`
              });
            }
            // 检查动作目标 完整性 如赋值 必须配置控件的赋值字段
            if (action.type == 'assignment') {
              // 是否配置了表格
              if (!this.targetTable) {
                errors.push({
                  type: 'targetTable',
                  message: '赋值必须选择数据来源表'
                });
              }

              if (!this.targetTableField) {
                errors.push({
                  type: 'targetTableField',
                  message: '必须选择查询字段'
                });
              }

              action.targets.forEach(target => {
                if (!target.setValueField) {
                  errors.push({
                    type: 'target',
                    message: `【${action.name}】动作下的 ${target.nodeName} 控件未配置赋值字段！！`
                  });
                }
              });
            }
          });
        }

        if (!errors.length) {
          resolve();
        } else {
          reject(errors);
        }
      });
    },
    save() {
      return this.validate()
        .then(() => {
          this._doSave();
        })
        .catch(errors => {
          if (Array.isArray(errors)) {
            console.error(errors);
            let message;
            if (errors.length == 1) {
              message = errors[0].message;
            } else {
              message = '事件配置信息不完整，请检查';
            }
            this.$message({
              message,
              type: 'error',
              customClass: 'event-config-error',
              showClose: true
            });
          } else {
            console.error(errors);
          }
        });
    },
    _doSave() {
      const eventDescription = {
        type: this.eventType,
        originType: eventInfo[this.eventType].originType,
        runAtInit: this.runAtInit
      };
      // 事件条件
      if (this.showCondition) {
        eventDescription.conditions = [copy(this.condition)];
      }
      // 事件动作
      eventDescription.actions = this.actions.map(action => {
        const data = {
          type: action.type,
          targets: action.targets.map(target => {
            const item = {
              // 类型： 布局或控件
              type: target.nodeType || target.type,
              id: target.id
            };
            if (target.setValueField) {
              item.setValueField = target.setValueField;
            }
            return item;
          })
        };
        // 赋值类型下 需要加入 目标的数据表
        if (action.type == 'assignment') {
          data.sourceTableId = this.targetTable;
          // 带上查询的字段
          data.sourceTableField = this.targetTableField;
        }
        return data;
      });
      console.log(JSON.stringify(eventDescription, 0, 2));
      this.$emit('save', this.eventType, eventDescription);
    },
    cancel() {
      this.$emit('cancel');
    },
    /**
     * 清空已经设置的赋值字段 即 条件查询字段
     */
    clearBindValueField() {
      const aim = this.actions.filter(action => action.type == 'assignment')[0];
      aim.sourceTableField = '';
      if (aim && aim.targets) {
        aim.targets.forEach(target => {
          target.setValueField = '';
        });
      }
    },
    onTargetTableChange() {
      this.clearBindValueField();
    }
  },
  watch: {
    targetTable() {
      this.fieldList = [];
      this.getFieldList();
    },
    showCondition(v) {
      // 条件可见时 需获取当前控件的值列表
      v && this.getControlDataList();
    }
  }
};
</script>

<style lang="scss">
$height: 70vh;
$header_height: 50px;
$footer_height: 48px;
$active_color: #2590eb;
.event-config {
  position: relative;
  height: $height;
  padding-top: $header_height;
  padding-bottom: $footer_height;
  box-sizing: border-box;
  line-height: 30px;
  &-header,
  &-footer {
    position: absolute;
    left: 0;
    right: 0;
    padding: 10px;
    box-sizing: border-box;
  }
  &-header {
    height: $header_height;
    top: 0;
  }
  &-footer {
    bottom: 0;
    height: $footer_height;
    text-align: right;
  }
  &-typeselect {
    margin-right: 10px;
  }
  &-condition {
    display: inline-block;
    .event-operation {
      width: 100px;
      margin-right: 6px;
    }
  }

  &-body {
    display: flex;
    height: 100%;
    box-sizing: border-box;
  }
  &-title {
    margin: 10px 0;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
  }
  &-lane {
    border-left: 1px solid #ddd;
    background: #f7f7f7;
    flex-grow: 1;
    padding: 10px;
    box-sizing: border-box;

    .event-config-list {
      box-shadow: border-box;
      height: calc(100% - 50px);
      overflow: auto;
      &.table {
        height: calc(100% - 80px);
      }
      &.table.tablefield {
        height: calc(100% - 120px);
      }
    }
    &:first-child {
      border-left: none;
    }
    &.choice {
      width: 120px;
    }
    &.action-config {
      width: 240px;
    }
    &.targets {
      width: 360px;
      .el-tree {
        background: transparent;
      }
    }
  }

  .choice-action-item {
    cursor: pointer;
    &.disabled {
      color: #999;
      cursor: not-allowed;
    }
  }

  .action-header {
    transition: all 0.2s ease-out;
    user-select: none;
    font-size: 14px;
    margin: 0;
    height: 30px;
    line-height: 30px;
    cursor: default;
    color: #333;
    &.active {
      background: #e6ebf4;
      .action-name {
        color: $active_color;
      }
    }
    .action-toggle {
      text-align: center;
      transition: all 0.2s ease-out;
      width: 20px;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        color: $active_color;
      }
    }
    .action-remove {
      float: right;
      line-height: inherit;
      margin-right: 10px;
      transition: all 0.2s ease-out;
      cursor: pointer;
      &:hover {
        color: $active_color;
      }
    }
    &.collaspe .action-toggle {
      transform: rotate(-90deg);
    }
    &.collaspe + .action-targets {
      height: 0 !important;
    }
  }
  .action-targets {
    overflow: hidden;
    transition: height 0.2s ease-out;
    padding-left: 30px;
  }
}
.event-config-error {
  top: 40%;
}
</style>
