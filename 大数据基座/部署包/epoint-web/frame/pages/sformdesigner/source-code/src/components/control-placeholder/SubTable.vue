<template>
  <table class="design-control-holder sub-table">
    <colgroup>
      <col for="checkcolumn" width="50px" />
      <col for="indexcolumn" width="50px" />
      <col for="normal" v-for="column in columns" :key="column.field" :width="column.width + 'px'" />
      <col for="actioncolumn" width="100px" />
    </colgroup>
    <thead>
      <tr>
        <th class="text-center" :class="{ frozen: checkcolumnFrozen }" data-column-type="checkcolumn" v-if="checkcolumn"><span class="checkcolumn-icon"></span></th>
        <th class="text-center" :class="{ frozen: frozenIndex == 1 }" data-column-type="indexcolumn" v-if="indexcolumn">序</th>

        <th :class="{ ['text-' + column.align]: true, frozen: frozenIndex == index + prevColumnCount }" data-column-type="normal" v-for="(column, index) in columns" :key="column.field">{{ column.name }}</th>

        <th class="text-center" data-column-type="actioncolumn" v-if="actioncolumn">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center" :class="{ frozen: checkcolumnFrozen }" v-if="checkcolumn"><span class="checkcolumn-icon"></span></td>
        <td class="text-center" :class="{ frozen: frozenIndex == 1 }" v-if="indexcolumn">1</td>

        <td :class="{ ['text-' + column.align]: true, frozen: frozenIndex == index + prevColumnCount }" v-for="(column, index) in columns" :key="column.field">...</td>

        <td class="text-center" v-if="actioncolumn">
          <span><i class="action-btn el-icon-plus"></i><i class="action-btn el-icon-edit"></i><i class="action-btn el-icon-delete"></i></span>
        </td>
      </tr>
      <tr>
        <td class="text-center" :class="{ frozen: checkcolumnFrozen }" v-if="checkcolumn"><span class="checkcolumn-icon"></span></td>
        <td class="text-center" :class="{ frozen: frozenIndex == 1 }" v-if="indexcolumn">2</td>

        <td :class="{ ['text-' + column.align]: true, frozen: frozenIndex == index + prevColumnCount }" v-for="(column, index) in columns" :key="column.field">...</td>

        <td class="text-center" v-if="actioncolumn">
          <span><i class="action-btn el-icon-plus"></i><i class="action-btn el-icon-edit"></i><i class="action-btn el-icon-delete"></i></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'placeholder-sub-table',
  props: ['controlData'],
  computed: {
    specificColumns() {
      if (!this.controlData) return [];
      return this.controlData.specialColumns.split(',');
    },
    checkcolumn() {
      return this.specificColumns.indexOf('checkcolumn') !== -1;
    },
    checkcolumnFrozen() {
      // check 必定是第一个
      if (this.checkcolumn && this.frozenIndex == 0) return true;
      return false;
    },
    indexcolumn() {
      return this.specificColumns.indexOf('indexcolumn') !== -1;
    },
    indexcolumnForzen() {
      // 存在 check 则是第二个 否则为第一个
      if (this.checkcolumn) {
        return this.frozenIndex == 1 ? true : false;
      }
      return this.frozenIndex == 0 ? true : false;
    },
    actioncolumn() {
      return this.specificColumns.indexOf('actioncolumn') !== -1;
    },
    frozenIndex() {
      return this.controlData.frozenColumnIndex;
    },
    prevColumnCount() {
      if (this.checkcolumn && this.indexcolumn) {
        return 2;
      }
      if (this.checkcolumn || this.indexcolumn) {
        return 1;
      }
      if (!this.checkcolumn && !this.indexcolumn) {
        return 0;
      }
      return 0;
    },
    columns() {
      if (!this.controlData.columns.length) {
        return [
          {
            field: 'name',
            name: '姓名',
            width: 100,
            align: 'center',
            required: true,
            vtype: 'number'
          }
        ];
      }
      return this.controlData.columns;
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style></style>
