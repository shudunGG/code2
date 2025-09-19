<template>
  <div v-if="rowId" class="config-row">
    <NameConfig :component-data="row" :type="rowType" @change="onNameChange" @remove="removeRow" />
    <div class="config-control-tabcontent" v-if="type == 'row-layout'">
      <div class="config-block">
        <h3 class="config-category"></h3>
        <div class="form-item">
          <label class="form-label">行</label>
          <div class="form-control"></div>
        </div>
      </div>
    </div>
    <ConfigAcc class="config-control-tabcontent" :layout-data="row" v-if="type == 'acc-layout'" />
  </div>
</template>

<script>
import NameConfig from '../form/NameConfig';
import ConfigAcc from './Config-Acc';
export default {
  name: 'config-row',
  props: ['rowId'],
  components: { NameConfig, ConfigAcc },
  computed: {
    row() {
      const rowId = this.rowId;
      return this.$store.getters.rowDataMap[rowId].row;
    },
    rowType() {
      return this.row.namePrefix || this.row.name;
    },
    type() {
      const type = this.row.type;
      return type ? type : 'row-layout';
    }
  },
  mounted() {
    document.addEventListener('keyup', this.deleteShortcurKey);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.deleteShortcurKey);
  },
  methods: {
    deleteShortcurKey(ev) {
      if (ev.which === 46 && this.rowId) {
        this.removeRow();
      }
    },
    onNameChange(value) {
      this.$store.dispatch('setLayoutProp', { value, prop: 'name' });
    },
    removeRow() {
      const isEmpty = this.isEmptyRow(this.row);

      if (isEmpty) {
        return this.doRemoveRow();
      }
      return this.$confirm('此操作将移除此行，以及此行内的所有内容，是否确认？', ' 删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.doRemoveRow();
        })
        .catch(() => {
          console.log('cancel');
        });
    },
    doRemoveRow() {
      const { index, layout } = this.$store.getters.selectedLayoutData;
      const parentCol = this.$store.getters.selectedRowParentCol;
      // const { layout, index, parentCol } = this.$store.state.selectedLayoutData;
      if (index != -1 && layout) {
        this.$store.dispatch('deleteRow', {
          parentCol,
          row: layout,
          index
        });
      } else {
        console.error('出现错误 无法删除');
      }
    },
    /**
     * 判断某行是否是空行 即内部不含子布局或控件
     * @param {rowData} row  行数据对象
     * @returns {Boolean} 是否为空行
     */
    isEmptyRow(row) {
      for (let col of row.cols) {
        if (col.subs.length || col.controls.length) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style></style>
