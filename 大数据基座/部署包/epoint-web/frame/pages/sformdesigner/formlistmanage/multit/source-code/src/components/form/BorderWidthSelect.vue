<template>
  <div class="border-width-select" :class="{ disabled: disabled, none: borderWidth == 0, normal: borderWidth != 0 }">
    <el-select v-model="borderWidth" :disabled="disabled" placeholder="请选择" size="small" style="width:100px;">
      <el-option v-for="item in borderWidthList" :key="item.value" :label="item.label || item.value" :value="item.value">
        <span v-if="!!item.value" class="border-width-select-option" :style="selectedStyle(item.value)" :title="item.label || item.value"></span>
        <span v-if="!item.value" class="border-width-select-option-none" :title="item.label" :style="'color:' + borderColor">{{ item.label }}</span>
      </el-option>
    </el-select>
    <span class="border-width-select-curr" :style="selectedStyle()"></span>
  </div>
</template>

<script>
export default {
  name: 'border-width-select',
  props: ['value', 'borderColor', 'disabled'],
  data() {
    return {
      borderStyle: 'solid',
      borderWidth: this.value,
      borderWidthList: [{ label: 'none', value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]
    };
  },
  watch: {
    value(v) {
      if (v != this.borderWidth) {
        this.borderWidth = v;
      }
    },
    borderWidth(v) {
      this.$emit('input', v);
    }
  },
  methods: {
    selectedStyle(currWidth) {
      if (currWidth === undefined) {
        currWidth = this.borderWidth;
      }
      return `border-top-style:${this.borderStyle};border-top-color:${this.borderColor};border-top-width:${currWidth}px`;
    }
  }
};
</script>
