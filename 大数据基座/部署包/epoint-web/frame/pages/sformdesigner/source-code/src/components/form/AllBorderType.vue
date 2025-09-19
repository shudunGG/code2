<template>
  <div>
    <div class="form-control-item  form-all-border">
      <el-tooltip :open-delay="500" placement="top"  :content="tipsText[item]" v-for="item in list1" :key="item">
        <MyButton :icon="'all-border-' + item" :class="{ active: item == currentType }" @click.native="handleChange(item)" />
      </el-tooltip>
    </div>

    <div class="form-control-item form-all-border">
      <el-tooltip :open-delay="500"  placement="top" :content="tipsText[item]" v-for="item in list2" :key="item">
        <MyButton :icon="'all-border-' + item" :class="{ active: item == currentType }" @click.native="handleChange(item)" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import Button from './Button';
export default {
  name: 'form-all-border-config',
  components: { MyButton: Button },
  props: {
    borderType: { type: String, default: 'all' }
  },
  data() {
    return {
      currentType: this.borderType,
      list1: ['all', 'inner', 'hline', 'vline', 'outer'],
      list2: ['left', 'top', 'right', 'bottom', 'none'],
      tipsText: {
        all: '全部框线',
        inner: '仅内框线',
        hline: '仅水平线',
        vline: '仅垂直线',
        outer: '仅外边框',
        left: '仅左框线',
        top: '仅上框线',
        right: '仅右框线',
        bottom: '仅底框线',
        none: '无框线'
      }
    };
  },
  methods: {
    handleChange(v) {
      this.currentType = v;
      this.$emit('active', v);
    }
  },
  watch: {
    borderType(v) {
      this.currentType = v;
    }
  }
};
</script>

<style></style>
