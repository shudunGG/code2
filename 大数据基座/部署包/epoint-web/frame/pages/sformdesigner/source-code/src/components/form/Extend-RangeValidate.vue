<template>
  <div class="extend-range-validate">
    <div class="form-item">
      <label class="form-label">{{ validateTextMap[validateType] }}</label>
      <div class="form-control">
        <!-- <el-select size="small" class="form-control-item" v-model="validateType">
          <el-option value="string" label="文本值比较" :disabled="inputType == 'number'"></el-option>
          <el-option value="number" label="数值比较" :disabled="inputType == 'string'"></el-option>
        </el-select> -->
        <el-switch v-model="showRangeValidate" @change="change"></el-switch>
      </div>
    </div>
    <div class="form-item" v-if="showRangeValidate">
      <label class="form-label">值</label>
      <div class="form-control">
        <el-select size="small" class="range-validate-operation" v-model="operation1" @change="change">
          <el-option v-for="item in operationList" :key="item" :value="item" :label="item"></el-option>
        </el-select>
        <el-select size="small" class="range-validate-value" v-model="selectedValue1" @change="change">
          <el-option value="static" label="输入固定值"></el-option>
          <el-option v-for="ctr in controlList" :key="ctr.id" :value="ctr.id" :label="ctr.name"></el-option>
        </el-select>
        <el-input placeholder="请输入" class="range-validate-input" size="small" v-if="selectedValue1 == 'static'" v-model="operationValue1" @change="change" />
        <span class="ext-btn el-icon-plus" v-show="!showExt" @click="showCondition2"></span>
      </div>
    </div>
    <div class="form-item" v-if="showRangeValidate" v-show="showExt">
      <label class="form-label">且</label>
      <div class="form-control">
        <el-select size="small" class="range-validate-operation" v-model="operation2" @change="change">
          <el-option v-for="item in operationList" :key="item" :value="item" :label="item"></el-option>
        </el-select>
        <el-select size="small" class="range-validate-value" v-model="selectedValue2" @change="change">
          <el-option value="static" label="输入固定值"></el-option>
          <el-option v-for="ctr in controlList" :key="ctr.id" :value="ctr.id" :label="ctr.name"></el-option>
        </el-select>
        <el-input placeholder="请输入" class="range-validate-input" size="small" v-if="selectedValue2 == 'static'" v-model="operationValue2" @change="change" />
        <span class="ext-btn el-icon-delete" @click="hideCondition2"></span>
      </div>
    </div>
  </div>
</template>

<script>
// {
//   vtype:'',
//   rangeValidator: {
//     type: 'string', // string || number
//     conditions: [
//       {
//         operation: '==',
//         value:'{someControlId}'
//       },
//       {
//         operation: '>=',
//         value:'123'
//       }
//     ]
//   }
// }

export default {
  name: 'extend-range-validate',
  props: ['controlData'],
  data() {
    return {
      validateTextMap: {
        string: '文本值比较',
        number: '数值比较'
      },
      ...this.getCompentValueFromControl(this.controlData)
      // showRangeValidate: false,

      // showExt: false,
      // // 当前验证类型 number or string
      // validateType: '',
      // // validateTypeList: [],

      // // 操作运算符 1 2
      // operation1: '',
      // operation2: '',

      // // 选择的值 1 2
      // selectedValue1: '',
      // selectedValue2: '',

      // // 输入值 1 2
      // operationValue1: '',
      // operationValue2: ''
    };
  },
  computed: {
    // 可供选择的控件列表
    controlList() {
      const reg = /textbox|textarea|radiobuttonlist|combobox|macro|treeselect/i;
      const hiddenControls = this.$store.state.hiddenControls;
      const normalControls = this.$store.getters.allControls;

      const controlList = [];

      normalControls.forEach(ctr => {
        if (reg.test(ctr.type) && ctr.id != this.controlData.id) {
          controlList.push({
            type: ctr.type,
            id: ctr.id,
            name: ctr.name || ctr.namePrefix + '_' + ctr.autoIndex
          });
        }
      });

      // 所有隐藏域都可用
      hiddenControls.forEach(ctr => {
        controlList.push({
          type: ctr.type,
          id: ctr.id,
          name: ctr.name || ctr.namePrefix + '_' + ctr.autoIndex
        });
      });
      // 将文本框 和 隐藏域排到前面来
      controlList.sort((a, b) => {
        if (a.type == b.type) return 0;

        if ((b.type == 'textbox' && a.type != 'textbox') || (b.type == 'hiddenfield' && a.type != 'hiddenfield')) {
          return 1;
        }
        return -1;
      });

      return controlList;
    },
    // 带验证控件的输入值类型 number or string
    inputType() {
      const vtype = this.controlData.vtype;
      if (vtype == 'int' || vtype == 'float') {
        return 'number';
      }

      // 非数值 没有大小比较
      return 'string';
    },
    // 可选操作列表
    operationList() {
      return this.inputType == 'number' ? ['<', '<=', '==', '>', '>='] : ['=='];
    },
    // 条件1是否完整
    condition1Done() {
      if (!this.operation1 || !this.selectedValue1) return false;
      if (this.selectedValue1 == 'static' && !this.operationValue1) return false;
      return true;
    },
    // 条件2是否完整
    condition2Done() {
      if (!this.operation2 || !this.selectedValue2) return false;
      if (this.selectedValue2 == 'static' && !this.operationValue2) return false;
      return true;
    }
  },
  methods: {
    getCompentValueFromControl(controlData) {
      let showRangeValidate = false,
        showExt = false,
        validateType = '',
        operation1 = '',
        operation2 = '',
        selectedValue1 = '',
        selectedValue2 = '',
        operationValue1 = '',
        operationValue2 = '';

      const vtype = (controlData || this.controlData).vtype;
      // 验证条件
      const validator = (controlData || this.controlData).rangeValidator;
      const validatorConditions = validator && validator.conditions;

      validateType = vtype == 'int' || vtype == 'float' ? 'number' : 'string';

      if (validatorConditions && validatorConditions.length) {
        showRangeValidate = true;

        // 两个条件显示值还原
        if (validatorConditions[0]) {
          operation1 = window.decodeURIComponent(validatorConditions[0].operation);
          const operationInfo1 = this.getOperationInfo(validatorConditions[0].value);
          selectedValue1 = operationInfo1.type;
          operationValue1 = operationInfo1.value;
        } else {
          operation1 = validateType == 'string' ? '==' : '<=';
          operationValue1 = selectedValue1 = '';
        }

        if (validatorConditions[1]) {
          operation2 = window.decodeURIComponent(validatorConditions[1].operation);
          const operationInfo2 = this.getOperationInfo(validatorConditions[1].value);
          selectedValue2 = operationInfo2.type;
          operationValue2 = operationInfo2.value;
          showExt = true;
        } else {
          operation2 = validateType == 'string' ? '==' : '>=';
          operationValue2 = selectedValue2 = '';
          showExt = false;
        }
      }

      return {
        showRangeValidate,
        showExt,
        validateType,
        operation1,
        operation2,
        selectedValue1,
        selectedValue2,
        operationValue1,
        operationValue2
      };
    },
    /**
     * 获取此组件内适用的 operation 信息
     * @param {string} value
     */
    getOperationInfo(value) {
      if (/^\{.+\}$/.test(value)) {
        const controlId = value.substring(1, value.length - 1);
        return {
          type: controlId,
          value: ''
        };
      }
      return {
        type: 'static',
        value
      };
    },
    showCondition2() {
      if (!this.condition1Done) {
        return this.$message({
          type: 'error',
          message: '请先填好当前条件'
        });
      }
      this.showExt = true;
      this.change();
    },
    hideCondition2() {
      this.showExt = false;
      // 删除条件时 将值也清空
      this.operation2 = this.validateType == 'string' ? '==' : '>=';
      this.operationValue2 = this.selectedValue2 = '';
      this.change();
    },
    /**
     * 获取提交到控件上的值
     */
    getSubmitValue() {
      const data = {
        type: this.validateType,
        conditions: []
      };
      // 条件1
      if (this.condition1Done) {
        data.conditions.push({
          operation: window.encodeURIComponent(this.operation1),
          value: this.selectedValue1 == 'static' ? this.operationValue1 : `{${this.selectedValue1}}`
        });
      }
      // 条件2
      if (this.showExt && this.condition2Done) {
        data.conditions.push({
          operation: window.encodeURIComponent(this.operation2),
          value: this.selectedValue2 == 'static' ? this.operationValue2 : `{${this.selectedValue2}}`
        });
      }
      return data;
    },
    change() {
      let rangeValidatorData = this.getSubmitValue();
      if (!this.showRangeValidate || !rangeValidatorData || !rangeValidatorData.conditions || !rangeValidatorData.conditions.length) {
        rangeValidatorData = null;
      }
      this.$emit('change', rangeValidatorData, 'rangeValidator');
    }
  },
  watch: {
    // vtype 改变时  此组件配置可用性需要调整
    'controlData.vtype'() {
      const { showRangeValidate, showExt, validateType, operation1, operation2, selectedValue1, selectedValue2, operationValue1, operationValue2 } = this.getCompentValueFromControl(this.controlData);
      this.showRangeValidate = showRangeValidate;
      this.showExt = showExt;
      this.validateType = validateType;
      this.operation1 = operation1;
      this.operation2 = operation2;
      this.selectedValue1 = selectedValue1;
      this.selectedValue2 = selectedValue2;
      this.operationValue1 = operationValue1;
      this.operationValue2 = operationValue2;
    }
  }
};
</script>

<style></style>
