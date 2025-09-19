<template>
  <div class="mui-card">
    <div class="mui-input-group ep-mui-radiobuttonlist">
      <div class="mui-input-row mui-radio" v-for="item in dataList" :key="item.id">
        <label>{{item.text}}</label>
        <input type="radio" :name="controlData.id" :value="item.id" />
        <span class="el-radio__inner"></span>
      </div>
    </div>
  </div>
</template>

<script>
import checkRadioList from '../control-placeholder/checkRadioList';
export default {
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

<style lang="scss">
.mobile-form-item.radiobuttonlist,
.mobile-form-item.checkboxlist  {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  &:after {
    display: none;
  }
  .mobile-form-label {
    width: 100%;
    float: none;
    
    padding: 10px;
    height: auto;
    line-height: 14px;
    font-size: 14px;
  }
  .mobile-form-control {
    width: 100%;
  }
  .mui-card {
    font-size: 14px;
    position: relative;
    overflow: hidden;
    margin: 10px;
    margin-top: 0;
    border-radius: 2px;
    background-color: #fff;
    background-clip: padding-box;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .mui-input-group {
    position: relative;
    padding: 0;
    border: 0;
    background-color: #fff;
  }
  .mui-card .mui-input-group:before,
  .mui-card .mui-input-group:after {
    height: 0;
  }
  .mui-input-group:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #c8c7cc;
  }
  .mui-input-group .mui-input-row {
    height: 40px;
  }
  .mui-radio,
  .mui-checkbox {
    position: relative;
  }
  .mui-radio label,
  .mui-checkbox label {
    padding: 11px 15px;
    display: inline-block;
    float: none;
    width: 100%;
    padding-right: 58px;
  }
  .mui-radio input[type='radio'],
  .mui-checkbox input[type='checkbox'] {
    position: absolute;
    top: 4px;
    right: 20px;
    display: inline-block;
    width: 28px;
    height: 26px;
    border: 0;
    outline: 0 !important;
    background-color: transparent;
    -webkit-appearance: none;
  }
  .el-radio__inner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    display: inline-block;
    width: 28px;
    height: 26px;
  }
}
</style>