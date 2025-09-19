<template>
  <div>
    <el-select v-model="type" size="small" @change="configTypeChange">
      <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.text"></el-option>
    </el-select>

    <div style="margin-top:8px;" v-if="type == typeMap.select">
      <el-input placeholder="请选择" :value="selectedTypes.join(',')" size="small" readonly>
        <el-button slot="append" icon="el-icon-more" @click.native="showDialog"> </el-button>
      </el-input>
    </div>
    <div style="margin-top:8px;" v-if="type == typeMap.input">
      <el-input placeholder="请输入文件扩展名" v-model="userInputType" size="small" @change="userInputChange"></el-input><el-tooltip placement="top" content="扩展名不带点，多个逗号分隔"><span class="design-help"></span></el-tooltip>
    </div>

    <el-dialog :visible.sync="dialogVisible" title="类型选择" append-to-body>
      <div class="tree-like" v-if="type == typeMap.select">
        <div v-show="dialogSelectedTypes.length" style="margin-bottom:10px">
          <el-tag style="margin-right:4px" v-for="tag in dialogSelectedTypes" :key="tag" size="mini" closable @close="hanldeRemoveTag(tag)">{{ tag }}</el-tag>
        </div>

        <div style="margin-bottom:10px" v-for="cate in dialogTypeTree" :key="cate.id">
          <div class="file-type-category">
            <el-checkbox v-model="cate.allChecked" :indeterminate="cate.halfChecked" :label="cate.text" @change="cateCheckedChange($event, cate)"></el-checkbox>
          </div>
          <el-checkbox-group class="file-type-group" v-model="cate.checkedArr" @change="itemCheckedChange($event, cate)">
            <el-checkbox class="file-type-item" v-for="item in cate.items" :key="item.id" :label="item.id"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSelect">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copy } from '../../util/index.js';

const DEFAULT_TYPE = '[default]';

const TYPE_MAP = {
  default: 'default',
  empty: 'empty',
  select: 'select',
  input: 'input'
};

export default {
  name: 'control-file-type-picker',
  props: ['config', 'value'],
  computed: {
    selectedTypes() {
      if (this.type != this.typeMap.select) return [];

      const arr = [];
      this.typeTree.forEach(cate => {
        if (cate.checkedArr && cate.checkedArr.length) {
          arr.push(...cate.checkedArr);
        }
      });

      return arr;
    },
    dialogSelectedTypes() {
      if (this.type != this.typeMap.select) return [];

      const arr = [];
      this.dialogTypeTree.forEach(cate => {
        if (cate.checkedArr && cate.checkedArr.length) {
          arr.push(...cate.checkedArr);
        }
      });

      return arr;
    }
  },
  data() {
    return {
      typeMap: TYPE_MAP,
      dialogVisible: false,
      userInputType: '',
      type: '',
      typeList: [
        {
          id: 'default',
          text: '系统默认'
        },
        {
          id: 'empty',
          text: '不限制'
        },
        {
          id: 'select',
          text: '选择类型'
        },
        {
          id: 'input',
          text: '手动输入'
        }
      ],
      typeTree: this.genderTypeTree(this.value),
      // dialogSelectedTypes: [],
      dialogTypeTree: []
    };
  },
  created() {
    this.type = this.getTypeFromValue(this.value);
    this.syncConfigValue();
  },
  methods: {
    // 从传入的控件的值上同步不同类型的值
    syncConfigValue() {
      if (this.type == TYPE_MAP.default || this.type == TYPE_MAP.empty) {
        this.userInputType = '';
      } else if (this.type == TYPE_MAP.select) {
        this.userInputType = '';

        // 选择模式下 将控件的值 对应到树上的选中状态
        this.typeTree = this.genderTypeTree(this.value);
      } else {
        this.userInputType = this.value;
      }
    },
    getFileTypeMap() {
      const map = {};
      this.typeTree.forEach(cate => {
        cate.valueArr.forEach(t => {
          map[t] = true;
        });
      });
      return map;
    },
    // 从传入的值上获取当前应用的是什么模式
    getTypeFromValue(value) {
      // 文件上传类型限制提交值格式
      // '[default]' 使用系统参数， 就是控件上不要加这个属性
      // '' 不限制类型
      // 'jpg,png' 用户通过选择或输入配置的扩展名

      // 系统参数模式
      if (value == DEFAULT_TYPE) {
        return TYPE_MAP.default;
      }
      // 为空 不限制模式
      if (value == '') {
        return TYPE_MAP.empty;
      }
      // 如果所有值都在列表中 则为选中 否则为输入模式
      const types = value.split(',');
      const typeMap = this.getFileTypeMap();
      let allInSelect = true;
      for (let t of types) {
        if (!typeMap[t]) {
          return TYPE_MAP.input;
        }
      }

      return TYPE_MAP.select;
    },
    // 生成类型选择的树结构
    genderTypeTree(value) {
      const data = [];
      const source = copy(window.FORM_DESIGN_CONFIG.preset['epointsform.fileTypes']);

      const selecteds = (value || '').split(',');

      source.forEach(cate => {
        // cate.allChecked = cate.halfChecked = false;
        // cate.valueArr = cate.items;
        // cate.checkedArr = [];
        // cate.items = this.genderItems(cate.valueArr);

        cate.valueArr = cate.items;
        cate.items = this.genderItems(cate.valueArr);

        // 从值上读选中状态
        const checkedArr = [];
        cate.valueArr.forEach(it => {
          if (selecteds.indexOf(it) !== -1) {
            checkedArr.push(it);
          }
        });
        cate.checkedArr = checkedArr;
        // 全选半选
        if (cate.checkedArr.length === 0) {
          cate.allChecked = cate.halfChecked = false;
        } else if (cate.checkedArr.length !== cate.valueArr.length) {
          cate.allChecked = false;
          cate.halfChecked = true;
        } else {
          cate.allChecked = true;
          cate.halfChecked = false;
        }

        data.push(cate);
      });
      console.log(source);
      return data;
    },
    genderItems(arr) {
      return arr.map(i => {
        return { id: i, text: i };
      });
    },
    // 分类值改变
    cateCheckedChange(value, cate) {
      console.log('sss');
      if (value) {
        cate.allChecked = true;
        cate.halfChecked = false;
        cate.checkedArr.splice(0, cate.checkedArr.length, ...cate.valueArr);
      } else {
        cate.allChecked = false;
        cate.halfChecked = false;
        cate.checkedArr.splice(0, cate.checkedArr.length);
      }
    },
    // 子选择改变
    itemCheckedChange(valueArr, cate) {
      console.log(...arguments);

      if (valueArr.length == cate.items.length) {
        // 全选
        cate.allChecked = true;
        cate.halfChecked = false;
      } else if (!valueArr.length) {
        // 全不选
        cate.allChecked = false;
        cate.halfChecked = false;
      } else {
        cate.allChecked = false;
        cate.halfChecked = true;
      }
    },
    // 标签方式移除
    hanldeRemoveTag(v) {
      let idx;
      for (let cate of this.dialogTypeTree) {
        idx = cate.checkedArr.indexOf(v);
        if (idx !== -1) {
          cate.allChecked = false;
          cate.checkedArr.splice(idx, 1);

          cate.halfChecked = cate.checkedArr.length !== 0 && cate.checkedArr.length != cate.valueArr.length;
          break;
        }
      }
    },
    // 类型切换
    configTypeChange(v) {
      if (v == TYPE_MAP.default) {
        return this.change(DEFAULT_TYPE);
      }

      if (v == TYPE_MAP.empty) {
        return this.change('');
      }

      if (v == TYPE_MAP.input) {
        return this.userInputType && this.change(this.userInputType);
      }

      if (v == TYPE_MAP.select) {
        return this.change(this.selectedTypes.join(','));
      }
    },
    userInputChange(v) {
      if (this.type == TYPE_MAP.input) {
        return this.change(this.userInputType);
      }
    },
    change(v) {
      this.$emit('change', v, this.config);
    },
    showDialog() {
      // this.dialogSelectedTypes = copy(this.selectedTypes);
      this.dialogTypeTree = copy(this.typeTree);
      this.dialogVisible = true;
    },
    submitSelect() {
      this.dialogVisible = false;
      this.change(this.dialogSelectedTypes.join(','));
    }
  },
  watch: {
    selectedTypes(v) {
      // 选择改变 则配置类型为选择时 更新配置
      // if (this.type == TYPE_MAP.select) {
      //   return this.change(this.selectedTypes.join(','));
      // }
    },
    value() {
      this.type = this.getTypeFromValue(this.value);
      if (this.type == TYPE_MAP.select) {
        this.typeTree = this.genderTypeTree(this.value);
      }
    }
  }
};
</script>

<style>
.file-type-category {
  line-height: 1;
  margin-bottom: 6px;
}
.file-type-group {
  padding-left: 24px;
}
.file-type-item {
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
