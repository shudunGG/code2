<template>
  <div class="tooltip-config">
    <div class="form-item">
      <label class="form-label">位置</label>
      <div class="form-control">
        <!-- <el-select class="form-control-item" v-model="type">
          <el-option v-for="item in accList" :key="item.id" :value="item.id" :label="item.text">{{item.text}}</el-option>
        </el-select>-->
        <div class="design-button-group tooltip-group" :data-value="type">
          <el-tooltip :open-delay="500" :content="tipsText[item]" v-for="item in typeList" :key="item">
            <MyButton :icon="'tooltip-type-' + item" :class="{ active: type == item }" @click.native="activeBtn(item)"></MyButton>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="form-item">
      <label class="form-label">内容</label>
      <div class="form-control">
        <el-input type="textarea" v-model="content" rows="3" class="form-control-item" placeholder="请输入提示内容" allowresize="false" @change="onContentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button';
function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export default {
  name: 'extend-tooltip-config',
  props: ['controlData'],
  components: {
    MyButton: Button
  },
  mounted() {
    this.addTooltipConfig();
  },
  data() {
    const c = this.controlData.tooltipConfig;
    return {
      type: c ? c.type : 'tooltip',
      content: c ? c.content : '',
      tipsText: {
        tooltip: 'tooltip 提示',
        right: '右侧提示',
        bottom: '底部提示'
      },
      typeList: ['tooltip', 'bottom']
      // typeList: ['tooltip', 'right', 'bottom']
    };
  },
  methods: {
    activeBtn(type) {
      this.type = type;
      this.change(type, 'tooltipConfig.type');
    },
    onContentChange(v) {
      this.change(v, 'tooltipConfig.content');
    },
    // 提示信息的配置加到响应式内部去
    addTooltipConfig() {
      // 工具提示信息 属性补全
      if (!hasKey(this.controlData, 'tooltipConfig')) {
        // 在 controlData 新增必要的属性
        this.$store.commit({
          type: 'addTooltipConfig',
          controlData: this.controlData
        });
      }
    },

    change(value, prop) {
      console.log(prop, value);
      if (prop && value !== undefined) {
        this.$emit('change', value, prop);
      }
    }
  },
  watch: {
    controlData: {
      deep: true,
      immediate: true,
      handler() {
        this.addTooltipConfig();
        const c = this.controlData.tooltipConfig;
        if (c.type !== this.type) {
          this.type = c.type;
        }
        if (c.content !== this.content) {
          this.content = c.content;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.design-button-icon.tooltip-type-tooltip {
  background: url('../../assets/images/right/q.png') center no-repeat;
}
.design-button-icon.tooltip-type-bottom {
  color: #666;
  &:before {
    content: '下';
  }
}
.design-button.active > .design-button-icon.tooltip-type-bottom {
  color: #51a6ef;
}
</style>