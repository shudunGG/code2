<template>
  <div class="extend-fieldname">
    <div class="form-item">
      <label class="form-label">字段英文名</label>
      <div class="form-control">
        <div class="form-control-item">
          <el-input v-popover="'error'" :class="{'in-error':hasError}" class="extend-fieldname-input" v-model="currentValue" :disabled="!enabled" @change="onValueChange" @focus="onFocus"></el-input>
          <el-popover ref="error" placement="bottom" width="200" trigger="hover" content="字段名称仅支持以字母开头的字母数字组合"></el-popover>
        </div>
      </div>
    </div>
    <div class="form-item" v-if="isMultiField">
      <label class="form-label">字段英文名2</label>
      <div class="form-control">
        <div class="form-control-item">
          <el-input v-popover="'error2'" :class="{'in-error':hasError2}" class="extend-fieldname-input" v-model="currentValue2" :disabled="!enabled" @change="onValueChange2" @focus="onFocus"></el-input>
          <el-popover ref="error2" placement="bottom" width="200" trigger="hover" content="字段名称仅支持以字母开头的字母数字组合"></el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'extend-fieldname',
  props: ['controlData'],
  components: {
    // MyButton: Button
  },
  mounted() {
    // this.addTooltipConfig();
  },
  beforeDestroy() {
    this.hasError = false;
    clearTimeout(this.timer);
  },
  computed: {
    isMultiField() {
      return this.controlData.type == 'daterangepicker';
    },
    enabled() {
      const ctrData = this.controlData;
      // 通用字段全部禁止
      if (ctrData.isCommonField || ctrData.universalId) {
        return false;
      }

      // 已经绑定了字段 则禁止输入
      if (ctrData.bind || ctrData.bind2) return false;

      return true;
    }
  },
  data() {
    return {
      timer: null,
      hasError: false,
      currentValue: this.controlData.fieldName || '',
      hasError2: false,
      currentValue2: this.controlData.fieldName || ''
    };
  },
  methods: {
    autoHide() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hasError = false;
      }, 1000);
    },
    onFocus() {
      this.hasError = false;
    },
    onValueChange(v) {
      if (!v) {
        this.change('', 'fieldName');
        return;
      }

      if (/^[^\d][a-zA-Z\d_]+$/.test(v)) {
        this.change(v, 'fieldName');
      } else {
        this.hasError = true;
        // this.autoHide();
        // this.$message({
        //   message: '字段名称仅支持以字母开头的字母数字组合',
        //   type: 'error',
        //   offset: window.innerHeight * .3 >> 0
        // });
        this.currentValue = '';
      }
    },
    onValueChange2(v) {
      if (!v) {
        this.change('', 'fieldName2');
        return;
      }

      if (/^[^\d][a-zA-Z\d_]+$/.test(v)) {
        this.change(v, 'fieldName2');
      } else {
        this.hasError2 = true;
        this.currentValue2 = '';
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
    'controlData.fieldName'(v) {
      if (v) {
        this.currentValue = v;
      } else {
        this.currentValue = '';
      }
    }
  }
};
</script>

<style lang="scss">
.extend-fieldname-input.in-error {
  .el-input__inner {
    border-color: red;
  }
}
</style>
