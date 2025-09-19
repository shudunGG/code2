<template>
  <div class="extend-daterange-config">
    <div class="form-item">
      <label class="form-label">日期范围</label>
      <div class="form-control">
        <el-select v-model="rangeType" size="small" @change="onRangeTypeChange">
          <el-option v-for="item in rangeTypeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
        </el-select>
      </div>
    </div>
    <div v-if="rangeType == 'range'" class="form-item">
      <label class="form-label">开始</label>
      <div class="form-control">
        <el-select size="small" class="form-control-item" v-model="selectedValue1" @change="selectedChange($event, 'start')">
          <el-option value="static" label="选择固定日期"></el-option>
          <el-option v-for="ctr in controlList" :key="ctr.id" :value="ctr.id" :label="ctr.name"></el-option>
        </el-select>
        <el-date-picker class="form-control-item" v-if="selectedValue1 == typeMap.static" v-model="startDate" :picker-options="startPickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期" size="small" @change="onDateChange('start')"> </el-date-picker>
      </div>
    </div>
    <div v-if="rangeType == 'range'" class="form-item">
      <label class="form-label">结束</label>
      <div class="form-control">
        <el-select size="small" class="form-control-item" v-model="selectedValue2" @change="selectedChange($event, 'end')">
          <el-option value="static" label="选择固定日期"></el-option>
          <el-option v-for="ctr in controlList" :key="ctr.id" :value="ctr.id" :label="ctr.name"></el-option>
        </el-select>
        <el-date-picker class="form-control-item" v-if="selectedValue2 == typeMap.static" v-model="endDate" :picker-options="endPickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="选择结束日期" size="small" @change="onDateChange('end')"> </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
const DATE_REG = /^\d{4}-\d{2}-\d{2}$/;
const CONTROL_REG = /^\{.+\}$/;
export default {
  name: 'extend-daterange-config',
  props: ['controlData'],
  components: {},
  computed: {
    // 开始限制的 类型 可选 static  control
    startType() {
      return this.getLimitType(this.controlData.minDate);
    },
    // 结束限制的 类型 可选 static  control
    endType() {
      return this.getLimitType(this.controlData.maxDate);
    },
    // 可供选择的控件列表
    controlList() {
      const reg = /datepicker/i;
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
      // console.log(JSON.stringify(controlList));
      // // 将文本框 和 隐藏域排到前面来
      // controlList.sort((a, b) => {
      //   if (a.type == b.type) return 0;

      //   if ((b.type == 'textbox' && a.type != 'textbox') || (b.type == 'hiddenfield' && a.type != 'hiddenfield')) {
      //     return 1;
      //   }
      //   return -1;
      // });
      // console.log(controlList);

      return controlList;
    }
  },
  data() {
    return {
      rangeType: this.getRangeType(this.controlData.minDate, this.controlData.maxDate),
      rangeTypeList: [
        {
          id: 'empty',
          text: '留空'
        },
        {
          id: 'range',
          text: '指定范围'
        }
      ],
      // // 开始结束的选中值 值为静态或控件id
      // selectedValue1: '',
      // selectedValue2: '',
      // // 开始结束的今天日期
      // startDate: '',
      // endDate: '',
      ...this.getDateFromControl(this.controlData),
      typeMap: {
        static: 'static',
        control: 'control'
      },
      startPickerOptions: {
        // 根据结束日期禁用一部分日期
        disabledDate: currDate => {
          if (!this.endDate) {
            return false;
          }
          return currDate.getTime() > new Date(this.endDate).getTime();
        }
      },
      endPickerOptions: {
        // 根据开始日期禁用一部分日期
        disabledDate: currDate => {
          if (!this.startDate) {
            return false;
          }
          return currDate.getTime() < new Date(this.startDate).getTime();
        }
      }
    };
  },
  methods: {
    getDateFromControl(data) {
      let selectedValue1 = '',
        selectedValue2 = '',
        startDate = '',
        endDate = '';
      if (data.minDate) {
        if (CONTROL_REG.test(data.minDate)) {
          selectedValue1 = data.minDate.substring(1, data.minDate.length - 1);
        } else if (DATE_REG.test(data.minDate)) {
          selectedValue1 = 'static';
          startDate = data.minDate;
        } else {
          console.error('日期不合法： ' + data.minDate);
        }
      }

      if (data.maxDate) {
        if (CONTROL_REG.test(data.maxDate)) {
          selectedValue2 = data.maxDate.substring(1, data.maxDate.length - 1);
        } else if (DATE_REG.test(data.maxDate)) {
          selectedValue2 = 'static';
          endDate = data.maxDate;
        } else {
          console.error('日期不合法： ' + data.maxDate);
        }
      }

      return {
        selectedValue1,
        selectedValue2,
        startDate,
        endDate
      };
    },
    getRangeType(min, max) {
      // 都未配置 或 都为空 则是空 否则为范围限制
      if ((!min && !max) || (min == '' && max == '')) {
        return 'empty';
      }
      return 'range';
    },
    getLimitType(value) {
      if (!value || value == '') return this.typeMap.static;
      return DATE_REG.test(value) ? this.typeMap.static : this.typeMap.control;
    },
    onRangeTypeChange(value) {
      if (value == 'empty') {
        this.clearRange();
      } else {
        if (this.startDate) {
          this.onDateChange('start');
        }
        if (this.endDate) {
          this.onDateChange('end');
        }
      }
    },
    // 清空校验
    clearRange() {
      if (this.controlData.minDate != '') {
        this.$emit('change', '', 'minDate');
      }
      if (this.controlData.maxDate != '') {
        this.$emit('change', '', 'maxDate');
      }
    },
    selectedChange(value, type) {
      // 静态值
      if (value == this.typeMap.static) {
        const v = type == 'start' ? this.startDate : this.endDate;
        if (v) {
          this.$emit('change', v, type == 'start' ? 'minDate' : 'maxDate');
        }
        return;
      }
      // 控件值
      if (value) {
        this.$emit('change', `{${value}}`, type == 'start' ? 'minDate' : 'maxDate');
      }
    },
    // 静态日期改变时
    onDateChange(type) {
      if (this.rangeType != 'range') {
        return;
      }
      if (type == 'start' && this.startType == this.typeMap.static) {
        this.$emit('change', this.startDate, 'minDate');
      }

      if (type == 'end' && this.endType == this.typeMap.static) {
        this.$emit('change', this.endDate, 'maxDate');
      }
    }
  }
};
</script>

<style></style>
