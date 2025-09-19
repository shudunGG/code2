<template>
  <div class="column-config-item">
    <!-- show -->
    <div class="span display">
      <el-checkbox v-model="field.display" @change="change('display', field.display)"></el-checkbox>
    </div>
    <!-- handle -->
    <div class="span move">
      <span class="sort-handle el-icon-rank" style="cursor:move;"></span>
    </div>
    <!-- 名称 -->
    <!-- <div class="span field">
      <el-input v-model="field.field"></el-input>
    </div> -->
    <div class="span name">
      <el-input v-model="field.name" size="mini" @change="change('name', field.name)"></el-input>
    </div>
    <!-- 字段选择 -->
    <div class="span editor" v-if="showEditor">
      <el-select v-model="field.controlType" size="mini" @change="change('controlType', field.controlType)">
        <el-option v-for="item in controlTypes" :key="item.id" :value="item.id" :label="item.text"></el-option>
      </el-select>
    </div>
    <!-- 必填 -->
    <div class="span required" v-if="showEditor">
      <el-checkbox v-model="field.required" @change="change('required', field.required)"></el-checkbox>
    </div>
    <!-- 对齐方式 -->
    <div class="span align">
      <AlignButton v-model="field.align" type="horizontal" @change="change('align', field.align)" />
    </div>
    <!-- width -->
    <div class="span width">
      <el-input-number size="mini" :controls="false" v-model="field.width" @change="change('width', field.width)"></el-input-number>
    </div>
    <!-- vtype -->
    <div class="span vtype" v-if="showEditor">
      <!-- 仅文本框作为编辑时才具有vtype -->
      <el-select size="mini" v-model="field.vtype" :disabled="field.controlType != 'textbox'" @change="change('vtype', field.vtype)">
        <el-option v-for="item in vtypeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import AlignButton from './AlignButton';
import { copy } from '../../util/index.js';

export default {
  name: 'column-config',
  components: { AlignButton },
  props: ['field', 'showEditor'],
  computed: {},
  data() {
    return {
      vtypeList: copy(window.FORM_DESIGN_CONFIG.preset['epointsform.validateTypes']),
      controlTypes: copy(window.FORM_DESIGN_CONFIG.preset['epointsform.columnEditors'])
    };
  },
  methods: {
    // getColumnData() {
    //   return copt(this.field);
    // },

    change(key, value) {
      this.$emit('change', key, value);
    }
  }
};
</script>

<style></style>
