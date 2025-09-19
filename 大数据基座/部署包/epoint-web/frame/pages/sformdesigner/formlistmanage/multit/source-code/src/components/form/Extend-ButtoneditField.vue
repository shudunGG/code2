<template>
  <div class="extend-buttonedit-field" v-if="controlData.popup">
    <div class="form-item">
      <div class="form-label">值字段</div>
      <div class="form-control">
        <el-select v-model="idField" size="small">
          <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.text"></el-option>
        </el-select>
      </div>
    </div>
    <div class="form-item">
      <div class="form-label">显示字段</div>
      <div class="form-control">
        <el-select v-model="textField" size="small">
          <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.text"></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import getDataWithCache from '@/util/getDataWithCache.js';
export default {
  name: 'extend-buttonedit-field',
  props: ['controlData'],
  data() {
    return {
      list: [],
      idField: this.controlData.idField || '',
      textField: this.controlData.textField || ''
    };
  },
  mounted() {
    if (this.controlData.popup) {
      this.getList(this.controlData.popup);
    }
  },
  methods: {
    getList(id) {
      // this.$httpPost(window.formDesignerActions.getListStructUrl, { listGuid: id })
      getDataWithCache(window.formDesignerActions.getListStructUrl, { listGuid: id }, 'buttoneditStruct-' + id)
        .then(data => {
          if (Array.isArray(data.ListStruct)) {
            this.list = data.ListStruct;
            // 如果字段不在里面 则标识无效 需要清空
            if (!this.checkIn(this.idField, 'id', this.list)) {
              this.idField = '';
            }
            if (!this.checkIn(this.textField, 'id', this.list)) {
              this.textField = '';
            }
          } else {
            throw new TypeError('列表必须为数组');
          }
        })
        .catch(err => {
          this.list = [];
          this.idField = this.textField = '';
          this.console.error(err);
        });
    },
    checkIn(value, key, list) {
      for (let item of list) {
        if (item[key] == value) return true;
      }
      return false;
    },
    change(v, field) {
      this.$emit('change', v, field);
    }
  },
  watch: {
    'controlData.popup'(value) {
      if (!value) {
        this.list = [];
        this.idField = this.textField = '';
      } else {
        this.getList(value);
      }
    },
    idField(value) {
      if (value != this.controlData.idField) {
        this.change(value, 'idField');
      }
    },
    textField(value) {
      if (value != this.controlData.textField) {
        this.change(value, 'textField');
      }
    }
  }
};
</script>

<style></style>
