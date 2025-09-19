<template>
  <div class="event-card">
    <div class="event-card-header">
      <span class="el-icon-arrow-down event-card-toggle"></span>
      <span class="event-name">{{ eventInfo[eventData.type].name }}</span>
      <span class="event-card-config">
        <span class="el-icon-setting event-card-setting" @click="editEvent"></span>
        <span class="el-icon-delete event-card-delete" @click="removeEvent"></span>
      </span>
    </div>
    <!-- 条件 -->
    <div class="event-card-condition" v-if="eventData.conditions && eventData.conditions.length">当满足 This {{ operationNames[eventData.conditions[0].operation] }} {{ eventData.conditions[0].target }} 时</div>

    <!-- 动作列表 -->
    <div class="event-card-actions">
      <div class="event-card-action" v-for="(action, index) in eventData.actions" :key="action.type">
        <span class="event-card-action-remove el-icon-close" @click="removeAction(action.type, index, eventData.actions.length == 1)"></span>
        <div class="event-card-action-name">{{ actionInfo[action.type].name }}</div>
        <div class="event-card-action-targets">
          <div class="event-card-action-target" v-for="target in action.targets" :key="target.id">
            {{ targetNameMap[target.id] }} <span style="margin-left:10px" v-if="target.setValueField">[ {{ target.setValueField }} ]</span>
          </div>
        </div>
      </div>
    </div>
    <div class="event-card-init" v-if="eventData.runAtInit"><span class="el-icon-s-flag"></span> 初始化时执行</div>
  </div>
</template>

<script>
import { eventInfo, actionInfo, operationNames } from './namemap.js';

export default {
  name: 'event-card',
  components: {},
  props: {
    eventData: {
      type: Object
    },
    targetNameMap: { type: Object }
  },
  data() {
    return { eventInfo, actionInfo, operationNames };
  },
  methods: {
    removeAction(actionType, index, isOnly) {
      this.$confirm(isOnly ? '此事件下仅有此一个动作，将删除事件，是否继续？' : '确认移除此此事件动作？')
        .then(() => {
          this.$emit('remove-action', actionType, index);
        })
        .catch(() => {
          console.log('cancel');
        });
    },
    editEvent() {
      this.$emit('edit-event');
    },
    removeEvent() {
      this.$confirm('确认移除此事件？')
        .then(() => {
          this.$emit('remove-event');
        })
        .catch(() => {
          console.log('cancel');
        });
    }
  }
};
</script>

<style lang="scss">
$active_color: #2590eb;
$danger_color: #f96d41;
.event-card {
  background: #f8f9fb;
  margin-bottom: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
  &-header {
    display: flex;
    justify-content: flex-start;
    .event-name {
      font-weight: bold;
    }
  }
  &-toggle {
    line-height: 30px;
    width: 16px;
    margin-right: 10px;
    margin-left: 4px;
    flex-grow: 0;
    text-align: center;
  }
  &-config {
    font-size: 14px;
    flex-grow: 1;
    text-align: right;
    padding-right: 10px;
  }
  &-setting,
  &-delete {
    cursor: pointer;
    transition: all 0.2s ease-out;
  }
  &-setting {
    margin-right: 6px;
    &:hover {
      color: $active_color;
    }
  }
  &-delete {
    &:hover {
      color: $danger_color;
    }
  }
  &-condition,
  &-action,
  &-init {
    padding-left: 30px;
    padding-right: 10px;
  }
  &-action {
    position: relative;
    cursor: default;

    &-name {
      font-weight: bold;
    }
    &-remove {
      position: absolute;
      top: 0;
      right: 10px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      transition: color 0.2s ease-out;
      visibility: hidden;
      &:hover {
        color: $danger_color;
      }
    }
    &:hover {
      background: #ebf5ff;
    }
    &:hover &-remove {
      visibility: visible;
    }

    &-targets {
      color: #999;
      line-height: 24px;
    }
    &-target {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
