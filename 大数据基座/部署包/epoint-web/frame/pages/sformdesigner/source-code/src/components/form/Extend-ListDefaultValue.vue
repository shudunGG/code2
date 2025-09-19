<template>
  <div class="multi-form">
    <div class="form-item">
      <label class="form-label">默认值</label>
      <div class="form-control">
        <!-- <el-select class="form-control-item" v-model="currentValue" @change="onValueChange" clearable :multiple="multiSelect" :placeholder="list.length ? '请选择默认值' : '请先选择数据源'">
          <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.text">{{item.text}}</el-option>
        </el-select> -->
        <virtual-select
          @change="onValueChange"
          clearable
          :multiple="multiSelect"
          :placeholder="list.length ? '请选择默认值' : '请先选择数据源'"
          v-model="currentValue"
          :items="list"
          :buffer="34"
          :item-size="34"
          filterable
          filter-key="text"
        >
          <template #default="{ item }">
            <el-option slot="default" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </template>
        </virtual-select>
      </div>
    </div>
  </div>
</template>

<script>
import VirtualSelect from "@/components/VirtualSelect.vue";
import getDataWithCache from '@/util/getDataWithCache.js';
import { copy } from '../../util';

function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export default {
  components: { VirtualSelect },
  name: 'extend-list-default-value',
  props: ['controlData'],
  mounted() {
    this.getValue();
    this.getList();
  },
  data() {
    return {
      loading: false,
      list: [],
      currentValue: []
    };
  },
  computed: {
    multiSelect() {
      // 是否多选 从控件上取
      const type = this.controlData.type;
      if (type == 'radiobuttonlist') {
        return false;
      }
      if (type == 'checkboxlist') {
        return true;
      }
      if (type == 'combobox') {
        return !!this.controlData.multiSelect;
      }
      return false;
    }
  },
  methods: {
    getList() {
      // 静态数据 、代码项
      const { data, codeItem } = this.controlData;

      if (data && Array.isArray(data)) {
        // 静态数据源
        this.list = copy(data);
        this.checkValueInList();
        return;
      }
      this.getData(codeItem);
    },
    getData(codeItem) {
      this.loading = true;
      this.list = [];
      if (!codeItem) {
        this.$emit('change', '', 'defaultValue');
        return;
      }
      getDataWithCache(window.formDesignerActions.getControlDataListUrl, { controlData: this.controlData }, codeItem)
        .then(res => {
          if (res && Array.isArray(res)) {
            this.loading = false;
            this.list = res;
            this.checkValueInList();
          } else {
            throw new Error('代码列表获取失败');
          }
        })
        .catch(err => {
          console.error('请求失败', err);
          this.loading = false;
          this.list = [];
        });
    },
    getValue() {
      const value = this.controlData.defaultValue;
      const emptyValue = this.multiSelect ? [] : '';
      if (!value) {
        this.currentValue = emptyValue;
      } else {
        this.currentValue = this.multiSelect ? value.split(',') : value;
      }
    },
    checkValueInList() {
      const v = this.currentValue;
      const list = this.list;
      if (!v || (this.multiSelect && !v.length)) return;

      let valueInList = true;
      if (!Array.isArray(list)) {
        valueInList = false;
      } else if (this.multiSelect) {
        // 多选要求每个都在列表中
        valueInList = v.every(i => list.some(item => item.id == i));
      } else {
        valueInList = list.some(item => item.id == v);
      }

      if (!valueInList) {
        this.$emit('change', '', 'defaultValue');
      }
    },
    onValueChange(v) {
      const defaultValue = v && v.toString ? v.toString() : v || '';

      this.$emit('change', defaultValue, 'defaultValue');
    }
  },
  watch: {
    'controlData.codeItem'() {
      this.getList();
    },
    'controlData.data'() {
      this.getList();
    },
    'controlData.defaultValue'() {
      this.getValue();
    }
  }
};
</script>

<style></style>
