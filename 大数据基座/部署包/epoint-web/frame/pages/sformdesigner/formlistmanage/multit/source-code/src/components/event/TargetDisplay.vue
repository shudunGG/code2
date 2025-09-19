<template>
  <div v-if="type" class="event-targets-tree">
    <el-tree @check-change="handleChange" ref="tree" :data="treeData" :props="treeDataProps" :show-checkbox="true" :default-checked-keys="checkedNodes" :check-strictly="!checkLinkage" node-key="id" default-expand-all>
      <span class="custom-tree-node" :class="{ checked: node.checked }" slot-scope="{ node, data }">
        <!-- <span class="el-icon-check" v-if="!node.childNodes.length || type == 'all'"></span> -->
        <span class="custom-tree-node-text">{{ node.label }} </span>
        <!-- 赋值的字段选择 -->
        <span v-if="type == 'controls' && data.nodeType == 'control'" class="custom-tree-node-ext">
          <span class="node-field-text">{{ fieldNameMap[data.setValueField] }}</span>
          <el-select class="node-field-select" v-model="data.setValueField" size="mini">
            <el-option v-for="item in fieldList" :key="item.id" :value="item.id" :label="item.text"></el-option>
          </el-select>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui';
import { copy } from '../../util/index.js';

export default {
  name: 'target-display',
  components: {
    [Tree.name]: Tree
  },
  props: {
    // 选择类型 all 全部； controls 控件； combobox；
    type: {
      type: String,
      validator(v) {
        return /^(?:all|controls|combobox)$/.test(v);
      },
      default: 'all'
    },
    fieldList: {
      default: () => []
    },
    fieldNameMap: {
      type: Object
    },
    actionType: {
      type: String
    },
    defaultTargets: {
      type: Array,
      default: () => []
    },
    exceptId: {
      type: String
    }
  },
  computed: {
    checkLinkage() {
      // return this.type == 'all';
      return false;
    },
    checkedNodes() {
      return this.defaultTargets.map(item => {
        return item.id;
      });
    },
    // 目标值 值字段的 记录
    targetFieldMap() {
      const map = {};
      // 赋值情况下才需要
      if (this.actionType == 'assignment') {
        this.defaultTargets.forEach(target => {
          if (target.setValueField) {
            map[target.id] = target.setValueField;
          }
        });
      }
      return map;
    }
  },
  data() {
    return {
      treeData: [],
      treeDataProps: {
        label: 'nodeName'
      }
    };
  },
  created() {
    this.treeData = this.getTreeData();
  },
  methods: {
    setDefaultValueField(ctr) {
      if (this.actionType != 'assignment') return;

      ctr.setValueField = this.targetFieldMap[ctr.id] || '';
    },
    /**
     * 获取用于选择的树的树状数据
     */
    getTreeData() {
      const type = this.type;
      const actionType = this.actionType;
      const exceptId = this.exceptId;
      const design = copy(this.$store.state.design);
      const treeData = [];
      // 控件模式下才需要 加入隐藏域
      if (type == 'controls') {
        const hiddenControls = copy(this.$store.state.hiddenControls);
        hiddenControls.forEach(ctr => {
          const { named, nodeName } = getNameInfo(ctr);
          ctr.named = named;
          ctr.nodeName = nodeName;
          ctr.nodeType = 'control';
          this.setDefaultValueField(ctr);
        });
        treeData.push({
          id: 'hidden',
          nodeName: '隐藏区域',
          named: true,
          nodeType: 'layout',
          children: hiddenControls
        });
      }

      const addItem = row => {
        const nameInfo = getNameInfo(row);
        const itemData = {
          id: row.id,
          ...nameInfo,
          nodeType: 'layout',
          children: []
        };

        row.cols.forEach(col => {
          // 手风琴加入
          if (row.type === 'acc-layout') {
            itemData.children.push({
              id: col.id,
              type: 'layout',
              nodeType: 'acc-item',
              nodeName: col.props.title
            });
          }
          // 控件
          if (col.controls && col.controls.length) {
            col.controls.forEach(ctr => {
              // 选择目标需排除自身
              if (ctr.id == exceptId) return;
              // title 或 label 仅在全部时可用
              if (actionType == 'clear' || actionType == 'assignment') {
                if (ctr.type == 'title' || ctr.type == 'label') return;
              }
              const { named, nodeName } = getNameInfo(ctr);
              ctr.named = named;
              ctr.nodeName = nodeName;
              // 本质是一个 dom 不是控件
              if (ctr.type == 'title' || ctr.type == 'label') {
                ctr.nodeType = 'layout';
              } else {
                ctr.nodeType = 'control';
              }
              this.setDefaultValueField(ctr);

              // combobox 模式下仅需要显示combobox
              if (type == 'combobox') {
                ctr.type == 'combobox' && itemData.children.push(ctr);
              } else {
                itemData.children.push(ctr);
              }
            });
          }
          if (col.subs && col.subs.length) {
            col.subs.forEach(addItem);
          }
        });

        if (type != 'all') {
          // 控件模式下去掉不含控件的布局
          itemData.children.length && treeData.push(itemData);
        } else {
          treeData.push(itemData);
        }
      };

      design.forEach(addItem);

      console.log(treeData);
      return treeData;

      function getNameInfo(node) {
        return {
          named: !!node.name,
          nodeName: node.name || node.namePrefix + '_' + node.autoIndex
        };
      }
    },
    /**
     * 获取选中的节点信息
     */
    getCheckedData() {
      const onlyLeaf = this.type == 'controls';
      const includeHalfChecked = false;
      const checkeds = this.$refs.tree.getCheckedNodes(onlyLeaf, includeHalfChecked);
      console.log(checkeds);
      return checkeds;
    },
    handleChange() {
      this.$emit('ckecked-change', this.getCheckedData());
    }
  },
  watch: {
    // type() {
    //   this.treeData = this.getTreeData();
    // },
    actionType() {
      this.treeData = this.getTreeData();
    },
    // 字段改变也需要重新获取
    fieldList() {
      this.treeData = this.getTreeData();
      this.$nextTick(() => {
        // 同时由于整个树都变了 重新触发 赋值
        this.handleChange();
      });
    }
  }
};
</script>

<style lang="scss">
.el-tree-node__content {
  line-height: 34px;
  height: 34px;
}
.custom-tree-node {
  flex-grow: 1;

  &-text,
  &-ext {
    display: inline-block;
    vertical-align: top;
  }
  &-text {
    width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .node-field-text {
    color: #999;
  }
  .node-field-select {
    display: none;
    width: 100px;
  }
}
.el-tree-node__content:hover {
  .node-field-text {
    display: none;
  }
  .node-field-select {
    display: block;
  }
}
.event-targets-tree {
  padding-right: 10px;
}
</style>
