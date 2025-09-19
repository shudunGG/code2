<template>
  <div class="preset-data-action" :class="{ disabled: hasAutoCodeItem }">
    <div class="tips" v-if="hasAutoCodeItem"><i class="el-icon-info" style="color:#409EFF"></i> 选中的关联字段已经有对应数据源了</div>
    <div class="form-item">
      <label class="form-label">配置方式</label>
      <div class="form-control">
        <el-radio-group v-model="sourceType" :disabled="hasAutoCodeItem">
          <el-radio v-for="item in sourceList" :key="item.id" :label="item.id">{{ item.text }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="form-item" v-show="sourceType == 'static'">
      <el-form :model="customData" ref="dataActionForm" :inline="true" :disabled="hasAutoCodeItem">
        <div class="data-source-item" v-for="(item, index) in customData" :key="index">
          <el-form-item class="data-source-input value" :prop="index + '.id'" :rules="rules.id">
            <el-input v-model="item.id" placeholder="值" size="mini"></el-input>
          </el-form-item>
          <el-form-item class="data-source-input text" :prop="index + '.text'" :rules="rules.text">
            <el-input v-model="item.text" placeholder="显示名称" size="mini"></el-input>
          </el-form-item>
          <el-button class="data-source-item-btn del" type="danger" plain size="mini" icon="el-icon-delete" @click="deleteItem(index)"></el-button>
          <el-button class="data-source-item-btn up" size="mini" icon="el-icon-caret-top" :disabled="index == '0'" @click="moveUp(index)"></el-button>
          <el-button class="data-source-item-btn down" size="mini" icon="el-icon-caret-bottom" :disabled="index == customData.length - 1" @click="moveDown(index)"></el-button>
        </div>
      </el-form>
      <el-button icon="el-icon-plus" size="mini" @click="addItem">添加选项</el-button>
      <el-button :disabled="!customData.length" icon="el-icon-save" size="mini" @click="applyItem">应用</el-button>
    </div>
    <div class="form-item" v-show="sourceType == 'action'">
      <label class="form-label">远程数据源</label>
      <div class="form-control"><el-select placeholder="请选择远程数据源" :disabled="hasAutoCodeItem" v-model="selectedAction" size="small" @change="onActionChange" filterable> <el-option v-for="item in actionList" :key="item.id" :label="item.text" :value="item.id"></el-option> </el-select></div>
    </div>
  </div>
</template>

<script>
import { copy } from '../../util/index.js';
import { mapState } from 'vuex';

export default {
  name: 'extend-data-action',
  props: ['controlData'],
  components: {
    // ColorPicker,
    // MyButton: Button
  },
  data() {
    const { data, codeItem } = this.controlData;
    const hasData = Array.isArray(data);
    return {
      sourceType: hasData ? 'static' : 'action',
      sourceList: [{ id: 'static', text: '自定义' }, { id: 'action', text: '远程' }],
      customData: hasData ? copy(data) : [],
      // customData: {},

      selectedAction: codeItem || '',

      rules: {
        id: [{ validator: this.validateId, trigger: 'blur' }],
        text: [{ required: true, message: '必须输入显示名称', trigger: 'blur' }]
      }
    };
  },
  computed: {
    // 控件若已经选择 bind 需要检查bind中的字段是否有代码项 如果有了就不能再自行选择了
    // at 5.25 逻辑又修改了 只用动选中对应的即可
    hasAutoCodeItem() {
      return false;
      // const { bind } = this.controlData;
      // if (!bind) return false;

      // const fieldMap = this.$store.getters.fieldMap;
      // const field = fieldMap[bind];

      // if (field && field.datasource) {
      //   return true;
      // }

      // return false;
    },
    actionList() {
      return copy(this.$store.state.codeList);
    }
    // 实际要提交的到控件上的 data
    // realData() {
    //   if (this.sourceType == 'action') {
    //     return '';
    //   }
    //   return this.customData.filter(item => item.checked && item.id.trim() && item.text.trim());
    // }
  },
  methods: {
    validateId(rule, value, callback) {
      console.log(rule);
      console.log(value);

      if (!value) {
        return callback(new Error('必填'));
      }
      const currItem = this.customData[rule.field.split('.')[0]];
      // for (let item of this.customData) {
      //   if (item === currItem) continue;

      //   if (value == item.id) {
      //     isDuplicated = true;
      //     break;
      //   }
      // }
      if (this.checkDuplicated(value, currItem)) {
        return callback(new Error('值必须唯一'));
      }

      return callback();
    },
    checkDuplicated(value, currItem) {
      for (let item of this.customData) {
        if (item === currItem) continue;

        if (value == item.id) {
          return true;
        }
      }
      return false;
    },
    // validateText(text) {},
    addItem() {
      if (this.customData.length) {
        // 已经有内容的情况下 先校验
        return this.$refs.dataActionForm.validate(ok => {
          if (ok) {
            this.customData.push({ id: '', text: '' });
          } else {
            this.$message({
              message: '请先处理当前内容',
              customClass: 'data-action-error-box',
              // duration: 0,
              type: 'error'
            });
          }
        });
      }
      this.customData.push({ id: '', text: '' });
      // const len = Object.keys(this.customData).length;
      // this.$set(this.customData, len, { id: '', text: '' });
    },
    deleteItem(index) {
      this.customData.splice(index, 1);
    },
    applyItem() {
      // 触发一次验证
      this.$refs.dataActionForm.validate((ok, errors) => {
        console.log(errors);
        let data;
        if (ok) {
          data = copy(this.customData);
        } else {
          data = copy(
            this.customData.filter((item, index) => {
              if (index + '.id' in errors || index + '.text' in errors) {
                return false;
              }
              return true;
            })
          );
        }
        if (Array.isArray(data)) {
          this.useStaticData(data);
        }
      });
    },
    moveUp(currentIndex) {
      if (currentIndex === 0) {
        return;
      }
      const current = this.customData.splice(currentIndex, 1)[0];
      this.customData.splice(currentIndex - 1, 0, current);

      // if (currentKey == '0') return;

      // let temp = this.customData[currentKey];
      // const prevKey = parseInt(currentKey, 10) - 1;
      // this.customData[currentKey] = this.customData[prevKey];
      // this.customData[prevKey] = temp;
      // temp = null;
    },
    moveDown(currentIndex) {
      if (currentIndex === this.customData.length - 1) {
        return;
      }
      const current = this.customData.splice(currentIndex, 1)[0];
      this.customData.splice(currentIndex + 1, 0, current);

      // const curr = parseInt(currentKey, 10);
      // if (curr == Object.keys(this.customData).length - 1) return;

      // const nextKey = curr + 1;
      // let temp = this.customData[currentKey];
      // this.customData[currentKey] = this.customData[nextKey];
      // this.customData[nextKey] = temp;
      // temp = null;
    },
    onActionChange(v) {
      this.useAction(v);
    },
    useStaticData(data) {
      let group;
      if (this.controlData.codeItem) {
        group = 'dataaction' + +new Date();
        this.$emit('change', '', 'codeItem', group);
      }
      this.$emit('change', data, 'data', group);
    },
    useAction(action) {
      // 如果原来有data需要清空 group 用于撤销还原的分组
      let group;
      if (this.controlData.data) {
        group = 'dataaction' + +new Date();
        this.$emit('change', '', 'data', group);
      }
      this.$emit('change', action, 'codeItem', group);
    }
  },
  watch: {
    sourceType(v) {
      // const action = this.controlData.action;
      // if (action && v == 'action') {

      // }

      if (v == 'action') {
        this.useAction(this.selectedAction);
      }
    },
    controlData: {
      deep: true,
      handler() {
        const { data, codeItem } = this.controlData;
        if (Array.isArray(data)) {
          this.customData = copy(data);
          this.sourceType = 'static';
        } else {
          this.sourceType = 'action';
        }
        if (codeItem) {
          this.selectedAction = codeItem;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.preset-data-action {
  &.disabled {
    > .form-item {
      position: relative;
      opacity: 0.6;

      &:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        cursor: not-allowed;
      }
    }
  }
}
.data-source-item {
  margin-bottom: 6px;
  &-btn {
    margin-left: 5px;
    &.up,
    &.down {
      margin-left: 4px;
    }
  }
  .el-form-item__content {
    line-height: inherit;
  }
}
.data-source-input {
  display: inline-block;
  margin-bottom: 16px;

  &.value {
    width: 80px;
    margin-right: 10px;
  }

  &.text {
    width: 100px;
  }
}
.data-action-error-box {
  top: 30%;
}
</style>
