<template>
  <div class="multi-form">
    <div class="form-item">
      <label class="form-label">所属手风琴</label>
      <div class="form-control">
        <el-select class="form-control-item" v-model="multiFormAccId" @change="onAccChange">
          <el-option v-for="item in accList" :key="item.id" :value="item.id" :label="item.text">{{item.text}}</el-option>
        </el-select>
      </div>
    </div>
    <div class="form-item">
      <label class="form-label">所属栏目</label>
      <div class="form-control">
        <el-select class="form-control-item" v-model="multiFormColumnId" @change="onSubCateChange">
          <el-option v-for="item in subList" :key="item.id" :value="item.id" :label="item.text">{{item.text}}</el-option>
        </el-select>
      </div>
    </div>
    <div class="form-item">
      <label class="form-label">排序值</label>
      <div class="form-control">
        <el-input-number class="form-control-item" :controls="false" v-model="multiFormIndex" @change="onIndexChange" />
      </div>
    </div>
  </div>
</template>

<script>
import getDataWithCache from '@/util/getDataWithCache.js';

function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export default {
  name: 'extend-multi-form',
  props: ['controlData'],
  mounted() {
    // 加载手风琴列表
    this.getAccList();
    // 兼容老数据 自动新增必要属性
    this.addMultiFormProps();

    // 如果已经栏目值 则需要加载栏目列表以保障显示
    if (this.multiFormColumnId && this.multiFormAccId) {
      this.getSubCateList(this.multiFormAccId);
    }
  },
  data() {
    const c = this.controlData;
    return {
      accList: [],
      subList: [],
      multiFormAccId: hasKey(c, 'multiFormAccId') ? c.multiFormAccId : '',
      multiFormColumnId: hasKey(c, 'multiFormColumnId') ? c.multiFormColumnId : '',
      multiFormIndex: hasKey(c, 'multiFormIndex') ? c.multiFormIndex : 0
    };
  },
  methods: {
    // 大表单配置的几个属性 加到响应式内部去
    addMultiFormProps() {
      // 三个属性任意一个没有 则算没有
      if (
        !hasKey(this.controlData, 'multiFormAccId') ||
        !hasKey(this.controlData, 'multiFormColumnId') ||
        !hasKey(this.controlData, 'multiFormIndex')
      ) {
        // 在 controlData 新增必要的属性
        this.$store.commit({
          type: 'addMultiFormProps',
          controlData: this.controlData
        });
      }
    },
    /**
     * 获取手风琴列表的数据
     */
    getAccList() {
      return getDataWithCache(window.formDesignerActions.getMultiFormAccListUrl, {}, '').then(res => {
        const list = res.dataValue;
        if (Array.isArray(list)) {
          this.accList = list;
          // 值不在新列表则清除 避免无效值
          if (this.multiFormAccId && !this.checkValueInList(this.multiFormAccId, list)) {
            this.multiFormAccId = '';
            this.change('multiFormAccId', '');
          }
        } else {
          this.accList = [];
        }
      });
    },

    /**
     * 根据手风琴id获取可选的栏目列表
     */
    getSubCateList(multiFormAccId) {
      return getDataWithCache(
        window.formDesignerActions.getMultiFormSubCateListUrl,
        { codeId: multiFormAccId },
        'subid-' + multiFormAccId
      ).then(res => {
        const list = res.itemDataValue;
        if (Array.isArray(list)) {
          this.subList = list;
          // 值不在新列表则清除 避免无效值
          if (this.multiFormColumnId && !this.checkValueInList(this.multiFormColumnId, list)) {
            this.multiFormColumnId = '';
            this.change('', 'multiFormColumnId');
          }
        } else {
          this.subList = [];
          // 若无栏目 则自然之前的栏目 id 也是无用的
          this.change('', 'multiFormColumnId');
        }
      });
    },
    change(value, prop) {
      console.log(prop, value);
      if (prop && value !== undefined) {
        this.$emit('change', value, prop);
      }
    },
    checkValueInList(v, list) {
      return list.some(item => item.id == v);
    },
    onAccChange(v) {
      console.log('所在手风琴项', v);

      this.change(v, 'multiFormAccId');
      this.subList = [];
      this.getSubCateList(v);
    },
    onSubCateChange(v) {
      console.log('所在栏目', v);
      this.change(v, 'multiFormColumnId');
    },
    onIndexChange(v) {
      console.log('排序值', v);
      this.change(v, 'multiFormIndex');
    }
  },
  watch: {
    controlData: {
      deep: true,
      handler() {
        this.addMultiFormProps();
        if (this.multiFormAccId != this.controlData.multiFormAccId) {
          this.multiFormAccId = this.controlData.multiFormAccId;
        }
        if (this.multiFormColumnId != this.controlData.multiFormColumnId) {
          this.multiFormColumnId = this.controlData.multiFormColumnId;
        }
        if (this.multiFormIndex != this.controlData.multiFormIndex) {
          this.multiFormIndex = this.controlData.multiFormIndex;
        }
        // 如果已经栏目值 则需要加载栏目列表以保障显示
        if (this.multiFormColumnId && this.multiFormAccId) {
          this.getSubCateList(this.multiFormAccId);
        }
      }
    }
  }
};
</script>

<style>
</style>