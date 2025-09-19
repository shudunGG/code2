<template>
  <div>
    <h3 class="config-category">手风琴配置</h3>
    <div class="form-item">
      <label class="form-label">显示导航</label>
      <div class="form-control">
        <div class="form-control-item">
          <el-switch v-model="showNav"></el-switch>
        </div>
      </div>
    </div>
    <h3 class="config-category">手风琴项配置</h3>
    <div class="form-item">
      <div class="form-control-item acc" v-for="(item, index) in items" :key="item.id" @click="handleItemClick(item)">
        <span style="margin-right: 4px">{{index | getOrder}}</span>
        <span>{{item.props.title}}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="form-control-item" v-show="editing">
        <el-input ref="nameInput" v-model="itemName" style="width:160px;margin-right:8px" placeholder="请输入手风琴项标题"></el-input>
        <el-tooltip :open-delay="500" content="新增">
          <el-button class="el-icon-check" :disabled="!itemNameValidated" @click="addItem"></el-button>
        </el-tooltip>
      </div>

      <el-tooltip :open-delay="500" content="添加手风琴项">
        <el-button class="el-icon-plus" v-show="!editing" @click="handleAdd"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { copy } from '@/util/index.js';
import { mapActions } from 'vuex';
export default {
  name: 'config-acc',
  props: ['layoutData'],
  data() {
    const data = this.layoutData;
    return {
      showNav: data.props.showNav,

      itemName: '',
      editing: false
    };
  },
  computed: {
    items() {
      return this.layoutData.cols;
    },
    itemNameValidated() {
      return this.itemName && this.itemName.trim();
    }
  },
  filters: {
    getOrder(index) {
      const j = index + 1;
      return j >= 10 ? j : '0' + j;
    }
  },
  methods: {
    ...mapActions(['activeRightTab', 'setSelectedCol']),
    submit(prop, value) {
      this.$store.commit({
        type: 'setRowProps',
        prop,
        value,
        row: this.layoutData
      });
    },
    handleItemClick(item) {
      const id = item.id;
      this.setSelectedCol({ id: id });
      this.activeRightTab('cell');
    },
    handleAdd() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs['nameInput'].focus();
      });
    },
    addItem() {
      const name = this.itemName;
      const rowId = this.layoutData.id;
      const len = this.layoutData.cols.length;
      const newItem = {
        id: `col-${rowId}-${len + 1}`,
        name: name,
        type: 'acc-item',
        props: {
          title: name,
          opened: true
        },
        style: {
          verticalAlign: 'middle',
          textAlign: 'center',
          width: '100%',
          border: copy(this.$store.state.globalStyle.border)
        },
        subs: [],
        controls: []
      };
      this.$store.commit({
        type: 'addAccItem',
        item: newItem,
        parentRow: this.layoutData,
        shuttle: true
      });
      this.editing = false;
      this.itemName = '';
    }
  },
  watch: {
    showNav(v) {
      this.submit('props.showNav', v);
    }
  }
};
</script>

<style>
.form-control-item.acc {
  cursor: pointer;
}
</style>