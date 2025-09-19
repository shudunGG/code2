<template>
  <div class="extend-sub-table-source">
    <div class="form-item">
      <label class="form-label">数据来源</label>
      <div class="form-control">
        <el-select :value="value" @change="change" size="small" filterable clearable>
          <el-option v-for="item in optionList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'extend-sub-table-source',
  // components
  props: ['controlData'],
  data() {
    return {
      value: ''
    };
  },
  mounted() {
    if (this.controlData.sourceTable) {
      this.value = this.controlData.sourceTable;
    } else {
      this.value = '';
    }
  },
  computed: {
    optionList() {
      // 数据源在 epointsform.sourceTables 中
      const subKey = 'sourceTables';
      return this.$store.state[subKey];
    }
  },
  methods: {
    change(value) {
      const pid = this.getTargetItemPid(value);
      this.$emit('change', value, 'sourceTable');
      if (pid) {
        this.$emit('change', pid, 'sourceTablePid');
      }
    },
    getTargetItemPid(value) {
      let pid = '';

      for (let i = this.optionList.length - 1; i >= 0; i--) {
        if (this.optionList[i] && this.optionList[i].id == value) {
          pid = this.optionList[i].parentId;
          break;
        }
      }
      return pid;
    }
  },
  watch: {
    'controlData.sourceTable'(v) {
      this.value = v;
    }
  }
};
</script>

<style>
</style>