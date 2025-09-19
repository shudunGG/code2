<template>
  <div class="design-button-group align-group" :class="type" :data-value="active">
    <el-tooltip :open-delay="500" :content="tipsText[item]" v-for="item in alignList" :key="item">
      <MyButton :icon="'align-' + item" :class="{ active: active == item }" @click.native="activeBtn(item)"></MyButton>
    </el-tooltip>
  </div>
</template>

<script>
import Button from './Button';

const hAlignList = ['left', 'center', 'right'];
const vAlignList = ['top', 'middle', 'bottom'];

export default {
  name: 'align-button',
  components: {
    MyButton: Button
  },
  props: {
    type: {
      type: String,
      default: 'horizontal',
      validator(v) {
        const ok = ['horizontal', 'vertical'].indexOf(v) !== -1;
        if (!ok) {
          console.error("type 应为 'horizontal' 或 'vertical'");
        }
        return ok;
      }
    },
    value: {
      type: String,
      default() {
        if (this.type == 'horizontal') return 'left';
        if (this.type == 'vertical') return 'middle';
      }
    }
  },
  computed: {
    alignList() {
      if (this.type == 'horizontal') {
        return ['left', 'center', 'right'];
      }
      if (this.type == 'vertical') {
        return ['top', 'middle', 'bottom'];
      }
    }
  },
  data() {
    return {
      active: this.value,
      tipsText: {
        left: '左对齐',
        center: '居中对齐',
        right: '右对齐',
        top: '顶端对齐',
        middle: '垂直居中',
        bottom: '底端对齐'
      }
    };
  },
  watch: {
    value() {
      this.active = this.value;
    },
    active(v) {
      this.$emit('input', v);
    }
  },
  methods: {
    activeBtn(alignValue) {
      this.active = alignValue;
    }
  }
};
</script>