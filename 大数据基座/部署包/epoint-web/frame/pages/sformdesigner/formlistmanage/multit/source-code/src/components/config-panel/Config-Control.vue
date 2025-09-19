<template>
    <div v-if="control" class="config-control">
        <NameConfig :component-data="control" :type="controlType" @change="onNameChange" @remove="removeControl" />
        <div v-if="supportEvent" class="config-control-tabs">
            <span class="config-control-tab" :class="{ active: currentView == 'attribute' }" @click="currentView = 'attribute'">属性</span>
            <span class="config-control-tab" :class="{ active: currentView == 'event' }" @click="currentView = 'event'">事件({{ eventCount }})</span>
        </div>
        <div class="config-control-tabcontent" :class="{ 'with-event': supportEvent }">
            <div class="attribute-block" v-if="currentView == 'attribute'">
                <div class="config-block" v-for="(cate, index) in controlConfig" :key="index">
                    <h3 class="config-category">{{ cate.category }}</h3>

                    <div :class="{ 'form-item': !config.extends, 'form-extend': !!config.extends }" v-for="config in cate.items" :key="config.label || config.extends + ''">
                        <!-- extends -->
                        <component v-for="preset in getExtends(config.extends)" :key="control.id + '-' + preset" v-bind:is="getControlComponent(preset)" :control-data="control" @change="handleExtendChange"></component>
                        <!-- 配置的组件 -->
                        <label v-if="!config.extends" class="form-label">{{ config.label }}</label>
                        <div v-if="!config.extends" class="form-control">
                            <!-- <component v-for="item in config.controls" :key="item.associatedProp" v-bind:is="item.type" :data="item" :label="config.label"></component> -->
                            <component v-for="item in config.controls" :key="control.id + '-' + item.associatedProp" v-bind:is="getControlComponent(item.type)" :config="item" :value="getControlValue(control, item)" @change="change" class="form-control-item" :class="item.type"></component>
                        </div>
                    </div>
                </div>
                <!-- 大表单配置 -->
                <!-- <div class="config-block">
          <h3 class="config-category">大表单配置</h3>
          <component v-bind:is="getControlComponent('extend-multiform')" :control-data="control" @change="handleExtendChange"></component>
        </div> -->
            </div>
            <div class="event-block" v-if="currentView == 'event'">
                <EventComponent :control-data="control" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NameConfig from '../form/NameConfig';
import { getDotProp, copy } from '../../util/index.js';
import { controlTypeMap, defaultComponent } from '../form/controlMap.js';
import EventComponent from '../event/Event';

export default {
  name: 'config-control',
  components: { NameConfig, EventComponent },
  props: ['control'],
  computed: {
    ...mapGetters(['controlType2nameMap']),
    controlType() {
      const type = this.control.type;
      return this.controlType2nameMap[type];
    },
    controlConfig() {
      const type = this.control.type;
      const config = window.FORM_DESIGN_CONFIG.controls[type];
      if (config) {
        return copy(config.configItems);
      }
      console.error(`${type} 类型控件的配置不存在，请检查！！！`);
      return [];
    },
    // 是否支持事件
    supportEvent() {
      // 支持的事件从配置上取
      const { type } = this.control;
      const { supportEvents } = window.FORM_DESIGN_CONFIG.controls[type];

      return supportEvents && supportEvents.length;
    },
    // 已绑定的事件计数
    eventCount() {
      if (!this.supportEvent) return 0;
      const { events } = this.control;
      if (events) {
        return Object.keys(events)
          .map((evName) => events[evName].length)
          .reduce((a, b) => a + b, 0);
      }
      return 0;
    }
  },

  created() {
    // 点击控件时 自动关联如果是label 或 title focus 输入框
    this.$bus.$on('cntrolClick', this.labelTextAutoFocus);
    // delete 删除
    document.addEventListener('keyup', this.deleteShortcurKey);
    // 控件数据兼容
    if (this.control) {
      // regexp 关键字导致sql注入风险被拦截 改名为 regSource 做旧数据兼容
      var customValidate = this.control && this.control.customValidate;
      if (customValidate && customValidate.regExp) {
        customValidate.regSource = customValidate.regExp;
        delete customValidate.regExp;
      }
    }
  },
  beforeDestroy() {
    this.$bus.$off('cntrolClick');
    document.removeEventListener('keyup', this.deleteShortcurKey);
  },
  data() {
    return {
      // controlTypeMap,
      // defaultComponent
      currentView: 'attribute'
    };
  },
  methods: {
    deleteShortcurKey(ev) {
      // delete
      if (ev.which === 46 && this.$store.state.selectedControlId) {
        this.removeControl();
      }
    },
    removeControl() {
      this.$store.dispatch('deleteControl');
    },
    onNameChange(value) {
      this.$store.dispatch('setControlProp', { value, prop: 'name', control: this.control });
    },
    labelTextAutoFocus() {
      this.$nextTick(() => {
        if (this.control.type == 'title' || this.control.type == 'label') {
          try {
            // console.log(this.$children[1]);
            // this.$children[1].focus();
            this.$children.some((ctr) => {
              if (ctr.focus) {
                ctr.focus();
                return true;
              }
            });
          } catch (error) {
            console.error(error);
          }
        }
      });
    },
    /**
     * !获取控件的绑定值 因为存在  a.b.c 这种绑定
     *
     * @param {object} control 控件对象
     * @param {object} editControl 控件配置
     * @returns
     */
    getControlValue(control, editControl) {
      if (/\./.test(editControl.associatedProp)) {
        return getDotProp(control, editControl.associatedProp);
      }
      return control[editControl.associatedProp];
    },
    change(v, editControl, group) {
      console.log('change');
      console.log(v, editControl, group);
      this.$store.dispatch('setControlProp', {
        value: v,
        prop: editControl.associatedProp,
        control: this.control,
        group
      });
    },
    getExtends(extendss) {
      if (!extendss) return [];
      if (extendss + '' === extendss) {
        return [('extend-' + extendss).toLowerCase()];
      }
      return extendss.map((ext) => ('extend-' + ext).toLowerCase());
    },
    handleExtendChange(value, prop, group) {
      this.$store.dispatch('setControlProp', { value, prop, control: this.control, group });
    },
    getControlComponent(t) {
      const type = t.toLowerCase();
      if (type in controlTypeMap) {
        return controlTypeMap[type];
      }

      return defaultComponent;
    }
  },
  watch: {
    'control.id'() {
      this.currentView = 'attribute';
    }
  }
};
</script>
