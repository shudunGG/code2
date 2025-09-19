<template>
  <el-dialog width="720px" append-to-body title="创建新字段" :visible="dialogVisible" :show-close="false">
    <el-form ref="form" :model="fieldProps" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段英文名" prop="fieldname">
            <el-input v-model="fieldProps.fieldname" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段中文名" prop="name">
            <el-input v-model="fieldProps.name" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="字段类型" prop="dbtype">
            <el-select v-model="fieldProps.dbtype" @change="onDBTypeChange" style="width:100%">
              <el-option v-for="item in DBDataTypes" :key="item.id" :value="item.id" :label="item.text">{{item.text}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showLength">
          <el-form-item label="字段长度">
            <el-input-number v-model="fieldProps.length" :controls="false" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="showPrecision">
        <el-col :span="12">
          <el-form-item label="字段精度">
            <el-input-number v-model="fieldProps.precision" :controls="false" style="width:100%" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12"></el-col> -->
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="显示类型" prop="fielddisplaytype">
            <el-select v-model="fieldProps.fielddisplaytype" style="width:100%">
              <el-option v-for="item in displayTypeList" :key="item.id" :value="item.id" :label="item.text">{{item.text}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代码项">
            <el-select v-model="fieldProps.datasource" clearable style="width:100%">
              <el-option v-for="item in codeList" :key="item.text" :value="item.id" :label="item.text">{{item.text}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="inSave" @click="create()">创建</el-button>
      <el-button type="primary" :loading="inSave" @click="create(true)">创建并绑定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import getDataWithCache from '@/util/getDataWithCache.js';
import { copy } from '@/util/index.js';

export default {
  computed: {
    ...mapState(['DBDataTypes', 'codeList', 'newFieldList', 'fieldList']),

    // 统计主表下的原有字段 + 新建字段 用于唯一性校验
    allFiledList() {
      const oldList = this.fieldList.length ? this.fieldList[0].fields : [];

      return [...oldList, ...this.newFieldList];
    },

    // 精度是否展示
    showPrecision() {
      return this.fieldProps.dbtype == 'Numeric';
    },

    // 是否显示长度
    showLength() {
      return this.fieldProps.dbtype == 'nvarchar' || this.fieldProps.dbtype == 'Numeric';
    },
    // 显示控件类型下拉列表
    displayTypeList() {
      const baseControls = window.FORM_DESIGN_CONFIG.controlList;
      const extControls = this.$store.state.extControls;

      const arr = [];

      baseControls.forEach(c => {
        arr.push({ id: c.type, text: c.name });
      });
      extControls.forEach(c => {
        arr.push({ id: c.type, text: c.name });
      });

      return arr;
    }
  },
  data() {
    return {
      fieldProps: {
        // 字段英文名
        fieldname: '',
        // 中文名
        name: '',
        // 数据库内字段类型
        dbtype: '',
        // 长度 仅字符串存在此值
        length: 18,
        // 精度 仅数值存在此值
        precision: 2,
        // 显示类型
        fielddisplaytype: '',
        // 代码项列表
        datasource: '',
        // 根据dbtype推算的 字段类型 0 其他 1 数值 2 整数
        fieldtype: ''
      },
      // displayTypeList: [],
      displayTypeLoading: false,

      dialogVisible: false,
      inSave: false,
      rules: {
        fieldname: [
          { required: true, message: '字段英文名必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 格式校验
              if (!/^[a-zA-Z][\da-zA-Z_]*$/.test(value)) {
                return callback(new Error('仅能是字母开头加数字、字母、下划线的组合'));
              }
              // 唯一性校验
              const dupled = this.allFiledList.some(item => item.fieldname == value);
              if (dupled) {
                return callback(new Error('字段英文名必须唯一'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        name: [{ required: true, message: '字段中文名必填', trigger: 'blur' }],
        dbtype: [{ required: true, message: '字段类型必填', trigger: 'blur' }],
        fielddisplaytype: [{ required: true, message: '显示类型必填', trigger: 'blur' }]
      },
      autoBindFn: () => {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$bus.$on('createBindField', autoBindFn => {
        this.dialogVisible = true;
        this.autoBindFn = autoBindFn;
        this.autoFillDisplayType();
      });
    },
    // 设置初始化值
    setInitData() {
      this.fieldProps = {
        fieldname: '',
        name: '',
        dbtype: '',
        // 长度
        length: 18,
        // 精度
        precision: 2,
        // 显示类型
        fielddisplaytype: '',
        // 代码项列表
        datasource: '',

        fieldtype: ''
      };
    },
    /**
     * 显示时 自动填充对应的控件类型作为
     */
    autoFillDisplayType() {
      const selectedControl = this.$store.getters.selectedControl.control;
      this.fieldProps.fielddisplaytype = selectedControl ? selectedControl.type : '';
    },
    create(autoBind) {
      this.inSave = true;
      this.$refs.form.validate(ok => {
        if (ok) {
          this.save(autoBind);
          this.$message({ message: '新增成功，字段将在保存表单时进行创建', type: 'success' });
          this.setInitData();

          this.inSave = false;
          this.dialogVisible = false;
        } else {
          this.$message({
            message: '字段信息不完整，请检查',
            type: 'error'
          });
          this.inSave = false;
        }
      });
    },
    // 暂存
    save(autoBind) {
      const data = copy(this.fieldProps);
      if (!this.showLength) {
        delete data.length;
      }
      if (!this.showPrecision) {
        delete data.precision;
      }
      this.$store.commit({
        type: 'addToNewFieldList',
        fieldProps: data
      });
      if (autoBind) {
        this.autoBindFn(data);
      }
    },

    onDBTypeChange() {
      //  db type convert to field type
      const type = this.fieldProps.dbtype;

      // 1 数值 2 整数 0 其他
      if (type == 'Numeric') {
        this.fieldProps.fieldtype = '1';
        this.fieldProps.length = 18;
      } else if (type == 'Integer') {
        this.fieldProps.fieldtype = '2';
      } else {
        this.fieldProps.fieldtype = '0';
        if (type == 'nvarchar') {
          this.fieldProps.length = 50;
        }
      }
    },
    // 检查显示类型是否在其下拉项里面 不是则清空
    adaptDisplayType() {
      if (!this.fieldProps.fielddisplaytype) return;
      const type = this.fieldProps.fielddisplaytype;

      const isMatch = this.displayTypeList.some(item => item.id == type);

      if (!isMatch) {
        this.fieldProps.fielddisplaytype = '';
      }
    }
  }
};
</script>

<style>
</style>