<template>
  <el-select :value="value" @change="change" size="small" :style="styleText" filterable clearable>
    <!-- <el-option v-for=""></el-option> -->
    <el-option v-for="item in optionList" :key="item.id" :label="item.text" :value="item.id">
      <!-- <span>{{ item.text }}</span
      ><span style="float:right;color:#999;font-weight:normal;font-size:12px;">{{ item.id }}</span> -->
    </el-option>
  </el-select>
</template>

<script>
import { copy } from '../../util/index.js';
import getData from './getData.js';

const PRESETS = window.FORM_DESIGN_CONFIG.preset;
export default {
  name: 'control-combobox',
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
      default: ''
    }
  },
  data() {
    return {
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
    change(v) {
      this.$emit('change', v, this.config);
    }
  }
};
</script>
