<template>
  <!-- <span class="design-control-holder radiobuttonlist" :value="controlData.bind || controlData.value" :placeholder="controlData.emptyText">
    <span v-for="(item, index) in dataList" :key="index"> <span class="checkbox-icon"></span> {{ item.text }} </span>
  </span> -->
  <span class="design-control-holder radiobuttonlist" :class="controlData.repeatDirection == 'vertical' ? 'vertical' : 'horizontal'">
    <el-radio-group v-model="currValue">
      <el-radio v-for="item in dataList" :key="item.id" :label="item.id">{{ item.text }}</el-radio>
    </el-radio-group>
  </span>
</template>

<script>
import checkRadioList from './checkRadioList.js';
export default {
  name: 'placeholder-radio-button-list',
  props: ['controlData'],
  mixins: [checkRadioList],
  data() {
    return {
      currValue: this.controlData.value || '',
      defaultDataList: [1, 2, 3].map(i => {
        return { id: i, text: '选项-' + i };
      }),
      originData: []
    };
  },
  created() {
    this.getDataList();
  }
};
</script>

<style></style>
