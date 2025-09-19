<template>
  <el-checkbox-group v-model="valueList" @change="change" :class="'direction-' + direction">
    <el-checkbox v-for="item in optionList" :key="item.id" :label="item.id">{{ item.text }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { copy } from '../../util/index.js';
import getData from './getData.js';
const PRESETS = window.FORM_DESIGN_CONFIG.preset;

export default {
  name: 'control-checkboxlist',
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
    },
    styleText: {
      type: String,
      default: 'width:200px'
    }
  },
  data() {
    return {
      valueList: this.getValueList(),
      loading: false,
      originOptionList: []
    };
  },
  created() {
    if (!this.config.data && this.config.url) {
      this.getOriginData(this.config.url);
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
      if (isString) {
        if (data in PRESETS) {
          return PRESETS[data];
        }
        // 获取后半段 在 state 中查找
        const subKey = data.replace(/^epointsform\./, '');
        if (subKey && Array.isArray(this.$store.state[subKey])) {
          return copy(this.$store.state[subKey]);
        }
      }
      return [];
    }
  },
  methods: {
    getValueList() {
      if (!this.value) {
        return [];
      }

      return this.value.split(',');
    },
    change(v) {
      this.$emit('change', v.join(','), this.config);
    }
  }
};
</script>

<style></style>
