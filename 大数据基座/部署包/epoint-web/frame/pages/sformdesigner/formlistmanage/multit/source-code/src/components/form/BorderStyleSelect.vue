<template>
  <div class="border-style-select" :class="{ disabled: disabled }">
    <el-select v-model="borderStyle" :disabled="disabled" placeholder="请选择" size="small" style="width:100px;">
      <el-option v-for="item in borderStyleList" :key="item.value" :label="item.label || item.value" :title="item.label || item.value" :value="item.value">
        <span v-if="!!item.value" class="border-style-option" :style="'border-top-color:' + borderColor + ';border-top-width:' + (borderWidth || 3) + 'px;border-top-style:' + item.value + ';'"></span>
      </el-option>
    </el-select>
    <span class="border-style-select-curr" :style="selectedStyle"></span>
  </div>
</template>

<script>
export default {
  name: 'border-style-select',
  props: ['value', 'borderColor', 'disabled'],
  data() {
    return {
      borderWidth: 4,
      borderStyle: this.value,
      borderStyleList: ['solid', 'dashed', 'dotted', 'double'].map(v => {
        return { value: v };
      })
    };
  },
  watch: {
    value(v) {
      if (v != this.borderStyle) {
        this.borderStyle = v;
      }
    },
    borderStyle(v) {
      this.$emit('input', v);
    }
  },
  computed: {
    selectedStyle() {
      return `border-top-style:${this.borderStyle};border-top-color:${this.borderColor};border-top-width:${this.borderWidth || 3}px;`;
    }
  }
};
</script>
