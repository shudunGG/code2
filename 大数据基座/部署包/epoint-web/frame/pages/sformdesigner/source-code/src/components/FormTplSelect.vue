<template>
  <span>
    <span style="color:#666;margin-right:6px;font-size:14px">模板选择</span>
    <el-select v-model="currentTpl" size="mini" @change="handleTplSelect">
      <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.text" />
    </el-select>
  </span>
</template>

<script>
import { copy } from '@/util/index.js';
export default {
  name: 'form-tpl-select',
  data() {
    return {
      currentTpl: '',

      list: []
    };
  },
  computed: {
    currentTplData() {
      const item = this.list.filter(item => {
        return item.id === this.currentTpl;
      })[0];
      return item ? item.data : null;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$httpPost(window.formDesignerActions.getAllFormTplUrl).then(res => {
        const list = res.list;
        if (Array.isArray(list)) {
          this.list = list;
        }
      });
    },
    handleTplSelect(v) {
      console.log(v);
      console.log(this.currentTplData);
      if (!this.currentTplData) {
        console.error();
      }
      const data = copy(this.currentTplData);
      this.$confirm('使用模板将完全替换当前设计器内容，是否继续？', '确认信息', {
        // confirmButtonText: '保存',
        // cancelButtonText: '放弃修改'
      })
        .then(() => {
          this.$emit('change', data);
        })
        .catch(() => {
          console.log('cancel');
          this.currentTpl = '';
        });
    }
  }
};
</script>

<style>
</style>