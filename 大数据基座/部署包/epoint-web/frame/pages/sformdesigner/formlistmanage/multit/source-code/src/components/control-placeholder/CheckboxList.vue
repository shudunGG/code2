<template>
  <!-- <span class="design-control-holder checkboxlist" :value="controlData.bind || controlData.value" :placeholder="controlData.emptyText">
    <span v-for="(item, index) in dataList" :key="index"> <span class="checkbox-icon"></span> {{ item.text }} </span>
  </span> -->
  <span class="design-control-holder checkboxlist" :class="controlData.repeatDirection == 'vertical' ? 'vertical' : 'horizontal'"
    ><el-checkbox-group v-model="valueList"
      ><el-checkbox v-for="item in dataList" :key="item.id" :label="item.id">{{ item.text }}</el-checkbox></el-checkbox-group
    ></span
  >
</template>

<script>
import checkRadioList from './checkRadioList.js';

export default {
  name: 'placeholder-checkboxlist',
  props: ['controlData'],

  mixins: [checkRadioList],
  data() {
    return {
      valueList: this.getValueList(),
      defaultDataList: [1, 2, 3].map(i => {
        return { id: i, text: '选项-' + i };
      }),
      originData: []
    };
  },
  methods: {
    getValueList() {
      if (this.controlData.value) {
        return this.controlData.value.split(',') || [];
      }
      return [];
    }
  },
  created() {
    this.getDataList();
  },
  watch: {
    'controlData.value'() {
      this.valueList = this.getValueList();
    },
    'controlData.bind'() {
      this.valueList = this.getValueList();
    }
  }
};
</script>
