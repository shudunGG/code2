<template>
  <div class="form-control-item width-set" :style="styleText">
    <el-select v-model="currType" size="small" class="width-set-select" @change="typeChange">
      <!-- <el-option v-for=""></el-option> -->
      <el-option label="百分比" value="percent"></el-option>
      <el-option label="像素" value="number"></el-option>
    </el-select>
    <el-input-number class="width-set-input" v-model="currValue" @change="change" :min="min" :max="max" size="small" :controls="false" />
    <span class="form-unit form-control-suffix">{{ this.currType == 'percent' ? '%' : 'px' }}</span>
  </div>
</template>

<script>
export default {
  name: 'control-width-set',
  props: {
    // 此控件的值
    value: {
      type: [String, Number],
      require: true
    },
    // 此控件的配置
    config: {
      type: Object,
      require: true
    },
    styleText: {
      type: String,
      default: ''
    }
  },
  data() {
    const adapted = this.getAdaptedData(this.value);
    return {
      min: 1,
      ...adapted
    };
  },
  watch: {
    value() {
      const adapted = this.getAdaptedData(this.value);

      this.currType = adapted.currType;
      this.currValue = adapted.currValue;
      this.max = adapted.max;
    }
  },
  methods: {
    getAdaptedData(value) {
      const isString = value + '' === value;
      const num = parseInt(value, 10) || 100;
      return {
        currType: isString ? 'percent' : 'number',
        currValue: isString ? Math.min(100, num) : num,
        max: isString ? 100 : Infinity
      };
    },
    typeChange() {
      this.change(this.currValue);
    },
    change(v) {
      const value = this.currType == 'percent' ? v + '%' : v;
      this.$emit('change', value, this.config);
    }
  }
};
</script>

