<template>
  <div class>
    <!-- 新增事件 -->
    <el-dropdown class="add-event-drop" size="small" trigger="click" placement="bottom-start" @command="addEvent">
      <div class="add-event-drop-trigger">
        <span class="el-icon-plus add-event-icon"></span>添加事件
      </div>
      <el-dropdown-menu slot="dropdown" class="add-event-dropmenu">
        <el-dropdown-item v-for="item in eventTypeList" :key="'1-'+item.type" :command="{type:item.type, initRun: false}">{{ item.name }}</el-dropdown-item>

        <li class="el-dropdown-menu__item" style="pointer-events: none;color: #999;margin-top: 10px;">初始化事件</li>
        <el-dropdown-item v-for="item in eventTypeList" :key="'2-'+item.type" :command="{type:item.type, initRun: true}">{{ item.name }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 已经配置好的事件 -->
    <div class v-if="eventList.length">
      <div v-for="(eventDescriptions, evType) in controlData.events" :key="evType">
        <EventCard v-for="(event, index) in eventDescriptions" :key="event.type + '-' + index" :event-data="event" :target-name-map="targetNameMap" @edit-event="editEvent(evType, index)" @remove-event="removeEvent(evType, index)" @remove-action="removeEventAction(evType, index, ...arguments)" />
      </div>
    </div>
    <!-- 事件配置弹窗 -->
    <el-dialog width="800px" class="event-config-dialog" :visible="dialogVisible" :title="configData.editType == 'add' ? '新增事件' : '修改事件'" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancel" append-to-body>
      <EventConfig v-if="dialogVisible" :control-data="controlData" :target-name-map="targetNameMap" :edit-type="configData.editType" :default-event-type="configData.eventType" :event-description="configData.evData" :event-type-list="eventTypeList" @save="saveEvent" @cancel="cancel" />
    </el-dialog>
  </div>
</template>

<script>
import { copy } from '../../util/index.js';
import EventConfig from './EventConfig';
import EventCard from './EventCard';
import { eventInfoArr } from './namemap.js';
import { mapActions } from 'vuex';

const eventEditType = {
  add: 'add',
  edit: 'edit'
};

export default {
  name: 'event',
  components: {
    EventConfig,
    EventCard
  },
  props: ['controlData'],
  computed: {
    // 支持的事件列表
    eventTypeList() {
      const { type } = this.controlData;
      const { supportEvents } = window.FORM_DESIGN_CONFIG.controls[type];

      return eventInfoArr.filter(ev => supportEvents.indexOf(ev.type) != -1);
    },
    // 已经配置好的事件
    eventList() {
      const { events } = this.controlData;
      if (events) {
        const arr = [];
        Object.keys(events).forEach(evName => {
          arr.push(...events[evName]);
        });
        return arr;
      }
      return [];
    },
    targetNameMap() {
      const controlNameMap = this.$store.getters.controlNameMap;
      const rows = this.$store.getters.allRows;
      const rowNameMap = {};

      rows.forEach(row => {
        rowNameMap[row.id] = row.name || `${row.namePrefix}_${row.autoIndex}`;
      });

      return {
        ...controlNameMap,
        ...rowNameMap
      };
    }
  },
  data() {
    return {
      dialogVisible: false,
      configData: {
        // 事件编辑的模式 add edit
        editType: eventEditType.add,
        // 事件类型
        eventType: '',
        // 编辑的事件描述对象
        evData: null,
        editingIndex: -1,
        editingType: ''
      }
    };
  },
  methods: {
    ...mapActions(['setControlProp']),
    addEvent(opt) {
      const { type, initRun } = opt;
      // alert(type);
      this.configData.eventType = type;
      this.configData.editType = eventEditType.add;
      this.configData.evData = { runAtInit: initRun };
      this.dialogVisible = true;
    },
    editEvent(type, index) {
      this.configData.eventType = type;
      this.configData.editType = eventEditType.edit;
      this.configData.evData = this.controlData.events[type][index];
      this.configData.editingIndex = index;
      this.configData.editingType = type;
      this.dialogVisible = true;
    },
    /**
     * 保存事件
     * @param {String} type type of event
     * @param {Object} description the  description of event handle
     */
    saveEvent(type, description) {
      const eventData = this.controlData.events ? copy(this.controlData.events) : {};
      // 新增事件的情况下 直接添加即可
      if (this.configData.editType == eventEditType.add) {
        if (!eventData[type]) {
          eventData[type] = [description];
        } else {
          eventData[type].push(description);
        }
      } else {
        // 编辑 则直接替换目标位置即可
        const { editingType, editingIndex } = this.configData;
        if (editingType && editingIndex != -1) {
          eventData[editingType][editingIndex] = description;
        } else {
          console.error('修改事件发生错误！');
        }
      }

      this.setControlProp({
        prop: 'events',
        value: eventData,
        control: this.controlData
      });
      this.dialogVisible = false;
    },
    saveEditEvent() {
      // const
    },
    cancel() {
      this.dialogVisible = false;
    },
    /**
     * 移除一个事件
     * @param {String} type  事件类型
     * @param {Number} index 要移除的事件在事件数组下的索引
     */
    removeEvent(type, index) {
      const events = this.controlData.events;
      console.group('移除事件');
      console.log('将要移除的事件描述');
      console.log(JSON.stringify(events[type][index], 0, 2));

      const newEventObj = copy(events);
      if (newEventObj[type].length == 1) {
        // 此事件类型下仅一个时 直接删掉
        delete newEventObj[type];
      } else {
        newEventObj[type].splice(index, 1);
      }
      console.log('移除后的事件描述');
      console.log(JSON.stringify(newEventObj, 0, 2));

      const group = 'remove-event';

      // 代码项联动时新增了属性 删除事件的时候需要扫描移除
      if (type == 'valuechanged:getcodelist') {
        {
          const pid = this.controlData.id;
          const oldLinkedCtrs = this.$store.getters.allControls.filter(ctr => ctr.codeSyncPid == pid);
          if (oldLinkedCtrs.length) {
            oldLinkedCtrs.forEach(linkedCtr => {
              this.setControlProp({
                group: group,
                prop: 'codeSyncPid',
                value: '',
                control: linkedCtr
              });
            });
          }
        }
      }

      this.setControlProp({
        group: group,
        prop: 'events',
        value: newEventObj,
        control: this.controlData
      });
      console.groupEnd();
    },
    /**
     * 移除事件动作
     * @param {Strring} evType type of event
     * @param {Number} evIndex index of event description
     * @param {String} actiontype action type
     * @param {Number} actionIndex action
     */
    removeEventAction(evType, evIndex, actiontype, actionIndex) {
      if (actionIndex === undefined) {
        return console.error('无法删除，错误的动作索引：' + actionIndex);
      }
      const events = this.controlData.events;
      console.group('移除事件动作');
      console.log(JSON.stringify(events[evType][evIndex].actions[actionIndex], 0, 2));

      const newEventObj = copy(events);
      let targetEvDes = newEventObj[evType][evIndex];
      if (targetEvDes.actions && targetEvDes.actions.length) {
        targetEvDes.actions.splice(actionIndex, 1);
        // 动作删除完了 事件也就无效了也需要同步删除
        if (!targetEvDes.actions.length) {
          targetEvDes = null;
          // 删除所在的事件
          if (newEventObj[evType].length == 1) {
            delete newEventObj[evType];
          } else {
            newEventObj[evType].splice(evIndex, 1);
          }
        }
        console.log(JSON.stringify(newEventObj, 0, 2));
        this.setControlProp({
          prop: 'events',
          value: newEventObj,
          control: this.controlData
        });
      } else {
        console.error('无法删除');
      }

      console.groupEnd();
    }
  }
};
</script>

<style lang="scss">
.add-event-drop {
  display: block;

  background: #f8f9fb;
  margin-bottom: 14px;
  .add-event-icon {
    width: 16px;
    margin-right: 10px;
    margin-left: 4px;
  }
  &-trigger {
    line-height: 30px;
    cursor: pointer;
  }
}
.add-event-dropmenu {
  // todo 宽度移动到 媒体查询 或js赋值
  width: 180px;
  .popper__arrow {
    left: 30px !important;
  }
}
.event-config-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #ddd;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
