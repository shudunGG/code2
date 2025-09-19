<template>
  <div class="form-item" v-if="showFormSelect">
    <label class="form-label">编辑页地址</label>
    <div class="form-control">
      <el-select class="form-control-item" v-model="selectedFormId" @change="change" size="mini">
        <el-option v-for="item in formList" :key="item.id" :value="item.id" :label="item.text"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import getDataWithCache from '@/util/getDataWithCache.js';

export default {
  name: 'extend-sub-table-edit-form',
  props: ['controlData'],
  computed: {
    showFormSelect() {
      return this.controlData.editType == 'dialog';
    },
    tableId() {
      return this.controlData.sourceTable;
    }
  },
  data() {
    return {
      selectedFormId: this.controlData.editFormGuid || '',
      formList: []
    };
  },
  mounted() {
    this.getForms();
  },
  methods: {
    getForms() {
      if (!this.tableId) {
        return (this.formList = []);
      }
      getDataWithCache(window.formDesignerActions.getSubTableInfoUrl, { tableId: this.tableId }, 'subTableData-' + this.tableId)
        .then(res => {
          const data = res.SubTableForm;
          if (Array.isArray(data)) {
            this.formList = data.map(item => {
              return {
                id: item.formGuid,
                text: item.formName
              };
            });
          } else {
            throw new Error('获取编辑表单失败');
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    change(v) {
      this.$emit('change', v, 'editFormGuid');
    }
  },
  watch: {
    tableId() {
      if (this.showFormSelect) {
        this.getForms();
      }
    },
    'controlData.editFormGuid'(v) {
      this.selectedFormId = v;
    }
  }
};
</script>

<style></style>
