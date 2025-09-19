<template>
  <div class="component-name-config config-block">
    <h3 class="component-type config-category">{{ type }} <span class="remove-component" @click="onComponentRemove">删除</span></h3>
    <div class="component-name-block">
      <div class="component-name" @click="(editorValue = name), (showEditor = true)" v-show="!showEditor">{{ name }}</div>
      <div v-if="showEditor">
        <!-- <el-input v-model="editorValue" size="mini" style="width:50%;margin-right:6px;" @keyup.enter="submitName" /> -->
        <div class="el-input el-input--mini" style="width:50%;margin-right:6px;"><input class="el-input__inner" v-model="editorValue" size="mini" @keyup.enter="submitName" /></div>
        <el-button icon="el-icon-check" size="mini" circle @click="submitName"></el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'name-config',
  props: ['componentData', 'type'],
  computed: {},
  data() {
    return {
      name: this.componentData.name || this.getComponentName(),
      showEditor: false,
      editorValue: ''
    };
  },
  methods: {
    getComponentName() {
      const { namePrefix, autoIndex } = this.componentData;
      if (namePrefix && autoIndex) {
        return `${namePrefix}_${autoIndex}`;
      }
      return this.type;
    },
    onComponentRemove() {
      this.$emit('remove');
    },
    change(value) {
      this.$emit('change', value);
    },
    submitName() {
      const v = this.editorValue.trim();
      if (!v) {
        return this.$message({ message: '必须输入组件件名称', type: 'error', showClose: true });
      }
      if (!/^[^\d][\d\w\u4E00-\u9FA5]+$/.test(v)) {
        return this.$message({ message: '组件名称不合法，只接受非数字开头的汉字、字母、数字组合', type: 'error', showClose: true });
      }

      if (this.componentData.name != v) {
        this.name = v;
        this.change(v);
      }
      this.showEditor = false;
    }
  },
  watch: {
    // id 变更时 表示修改的控件变了 直接放弃编辑
    'componentData.id'() {
      this.showEditor = false;
      this.name = this.componentData.name || this.getComponentName();
    }
    // 'componentData.name'(v) {
    //   if (v != this.name) {
    //     this.name = v;
    //   }
    // },
    // name(v) {
    //   if (v !== this.componentData.name) {
    //     this.change(v);
    //   }
    // }
  }
};
</script>

<style lang="scss">
.component-name-config {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 110px;
  background: #f8f9fb;
  padding: 14px;
  margin-top: 0;
  margin-bottom: 0;
  box-sizing: border-box;
  .remove-component {
    float: right;
    font-size: 12px;
    cursor: pointer;
    font-weight: normal;
    color: #666;
    transition: all 0.1s ease-out;
    &:hover {
      color: #333;
    }
  }
  .component-name-block {
    height: 40px;
    background: #fff;
    padding-left: 10px;
    line-height: 40px;
  }
  .component-name {
    font-style: italic;

    &:before {
      content: '(';
    }
    &:after {
      content: ')';
    }
  }
}
</style>
