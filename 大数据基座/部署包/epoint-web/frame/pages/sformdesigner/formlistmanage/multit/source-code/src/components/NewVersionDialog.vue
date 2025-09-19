<template>
  <el-dialog title="生成新版本" :visible="true" custom-class="new-version-dialog" width="420px" top="calc(50vh - 100px)" :show-close="false">
    <p style="margin:0">在一个新版本中编辑表单，原版本将被保留</p>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="选择模板结构" prop="tplId">
        <el-select v-model="form.tplId" size="mini">
          <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.text" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {
      // visible: false,
      form: {
        tplId: ''
      },
      list: [],
      rules: {
        tplId: [{ required: true, message: '必须选择模板', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$httpPost(window.formDesignerActions.getSFormTplUrl).then(res => {
        const list = res.list;
        if (Array.isArray(list)) {
          this.list = list;
        }
      });
    },
    confirm() {
      this.$refs.form.validate(ok => {
        if (!ok) return;

        this.save(this.form.tplId).then(() => {
          this.cancel();
        });
      });
    },
    cancel() {
      document.body.removeChild(this.$el);
      this.$destroy();
    }
  }
};
</script>

<style lang="scss">
.new-version-dialog {
  .el-dialog__body {
    padding: 10px 15px;
  }
  .el-dialog__footer {
    padding-bottom: 10px;
  }
}
</style>