<template>
  <!-- <el-checkbox :value="value" @change="change">{{ config.text }}</el-checkbox> -->
  <el-radio-group v-model="currValue" @change="change" :class="'direction-' + direction">
    <el-radio v-for="item in optionList" :key="item.id" :label="item.id">{{ item.text }}</el-radio>
  </el-radio-group>
</template>

<script>
import getData from './getData.js';
const PRESETS = window.FORM_DESIGN_CONFIG.preset;
export default {
  name: 'control-radio-list',
  mixins: [getData],
  props: {
    // 此控件的值
    value: {
      type: String,
      require: true
    },
    // 此控件的配置
    config: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      currValue: this.value,
      loading: false,
      originOptionList: []
    };
  },
  created() {
    if (!this.config.data && this.config.url) {
      this.getOriginData(this.config.url);
    }
  },
  watch: {
    value() {
      this.currValue = this.value;
    }
  },
  computed: {
    direction() {
      return this.config.direction || 'horizontal';
    },
    optionList() {
      return this.config.data ? this.staticOptionList : this.originOptionList;
    },
    staticOptionList() {
      const data = this.config.data;
      if (!data) {
        return [];
      }
      if (Array.isArray(data)) {
        return data;
      }
      const isString = data + '' === data;
      if (isString && data in PRESETS) {
        return PRESETS[data];
      }
      return [];
    }
  },
  methods: {
    change(v) {
      this.$emit('change', v, this.config);
    }
  }
};
</script>
