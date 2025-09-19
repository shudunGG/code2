<template>
  <div>
    <div class="config-block">
      <h3 class="config-category">
        手风琴项配置
        <el-tooltip :open-delay="50" content="复制ID">
          <span @click="copyId" class="el-icon-copy-document acc-copy-id"></span>
        </el-tooltip>
      </h3>
      <div class="form-item">
        <label class="form-label">手风琴标题</label>
        <div class="form-control">
          <div class="form-control-item">
            <el-input v-model="title" @blur="submitTitle" />
          </div>
        </div>
      </div>
      <div class="form-item">
        <label class="form-label">默认展开</label>
        <div class="form-control">
          <div class="form-control-item">
            <el-switch v-model="opened" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'config-acc-item',
  props: ['selectedCol'],
  data() {
    const data = this.selectedCol.props;
    return {
      title: data.title,
      opened: data.opened
    };
  },
  methods: {
    submitTitle() {
      const v = this.title;
      if (!v || v.trim() == '') {
        return this.$message({
          title: '系统提醒',
          message: '名称不能为空',
          type: 'error',
          showClose: true
        });
      }
      const group = 'acc-item-name';
      this.$store.commit('setColProps', {
        value: v,
        prop: 'props.title',
        group,
        col: this.selectedCol
      });
      // 同步修改名字 用于事件配置中的展示
      if (v) {
        this.$store.commit('setColProps', {
          value: v,
          prop: 'name',
          group,
          col: this.selectedCol
        });
      }
    },
    submitOpend(v) {
      this.$store.commit('setColProps', {
        value: v,
        prop: 'props.opened',
        col: this.selectedCol
      });
    },
    copyId() {
      if (!this.selectedCol) return;
      const id = this.selectedCol.id;
      const i = document.createElement('input');
      i.value = id;
      document.body.appendChild(i);
      i.select();
      document.execCommand('COPY');
      this.$message({
        message: '手风琴ID已复制到剪贴版',
        type: 'success'
      });

      i.parentNode.removeChild(i);
    }
  },
  watch: {
    // title(v) {
    //   this.submitTitle(v);
    // },
    opened(v) {
      this.submitOpend(v);
    },
    'selectedCol.props'() {
      const data = this.selectedCol.props;
      this.title = data.title;
      this.opened = data.opened;
    }
  }
};
</script>

<style scoped>
.acc-copy-id {
  cursor: pointer;
  display: none;
  margin-left: 10px;
}
.config-category:hover .acc-copy-id {
  display: inline-block;
}
</style>
