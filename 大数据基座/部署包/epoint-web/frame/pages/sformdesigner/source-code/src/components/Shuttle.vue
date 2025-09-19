<template>
  <span class="form-shuttle-btns">
    <el-tooltip :open-delay="200" :content="canUndo ? '撤销' : '无可撤销的操作'">
      <span class="header-btn form-icon-undo" :class="{'disabled':!canUndo}" @click="undo"></span>
    </el-tooltip>
    <el-tooltip :open-delay="200" :content="canRedo ? '还原' : '无可还原的操作'">
      <span class="header-btn form-icon-redo" :class="{'disabled':!canRedo}" @click="redo"></span>
    </el-tooltip>
  </span>
</template>

<script>
// import { copy } from '../util/index.js';
import throttle from 'lodash.throttle';

let prevState = null;

// 需要直接忽略掉的状态
const ignoreMutation = (arr => {
  const map = {};
  arr.forEach(t => {
    map[t] = true;
  });
  return map;
})([
  'activeRightTab',
  'updateLineTop',
  'updateLineLeft',
  'showHLine',
  'hideHLine',
  'showVLine',
  'hideVLine',
  'layoutDragStart',
  'layoutDragEnd',
  'controlDragStart',
  'controlDragEnd',
  'toggleViewDesign',
  'updateViewType',

  'setJsCode',
  'setCssCode',
  'addToNewFieldList'
]);

// 连续触发 需要节流的状态
const throttleMutation = (arr => {
  const map = {};
  arr.forEach(t => {
    map[t] = true;
  });
  return map;
})(['updateRowHeight', 'updateColWidth']);

export default {
  name: 'shuttle',
  data() {
    return {
      history: [],
      future: []
    };
  },
  mounted() {
    document.addEventListener('keyup', this.initShortcutKey);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.initShortcutKey);
  },
  computed: {
    canUndo() {
      return this.history.length;
    },
    canRedo() {
      return this.future.length;
    }
  },
  methods: {
    init() {
      window.shuttleManager = this;
      this.subscribeStore();
    },
    subscribeStore() {
      // subscribe vuex mutation
      // 在每次状态更新后进行处理
      // 若此状态需要更新 则将前一个状态推入 undo 栈中
      // 每次状态更新均将本次修改后的最新状态序列化记录， 下一次变化时，取这个值即为前一次的状态
      // 直接使用 throttle 来做合成是有问题的 throttle 将会是异步的 记录的时机已经推迟 状态可能不对 而同时 leading 和 trailing 本身又无法合成了
      // 因此 throttle 仅用来处理连续的事件 其他连续提交 手动分组
      prevState = JSON.stringify(this.$store.state);

      const subscribeFn = (mutation, state) => {
        const type = mutation.type;

        console.log(mutation);

        if (mutation.payload && mutation.payload.shuttle) {
          this.storeState(type, prevState, mutation.payload.group);
        }

        prevState = JSON.stringify(state);
      };
      const throttleSub = throttle(subscribeFn, 300, { leading: true, trailing: false });

      this.$store.subscribe((mutation, state) => {
        const type = mutation.type;

        if (ignoreMutation[type]) return;

        if (throttleMutation[type]) {
          throttleSub(mutation, state);
        } else {
          subscribeFn(mutation, state);
        }
      });
    },
    addHistory(data) {
      if (!data.group) {
        this.history.unshift(data);
      } else {
        // 处理组合成
        let idx = -1;
        for (let i = 0, len = this.history.length; i < len; i++) {
          if (this.history[i].group == data.group) {
            idx = i;
            continue;
          } else {
            break;
          }
        }
        if (idx === -1) {
          this.history.unshift(data);
        } else {
          // 如果存在组相同 则最早的那一个才是正确的状态 就无须加入当前状态
        }
      }
      if (this.history.length > 10) {
        this.history.length = 10;
      }
    },
    addFuture(data) {
      this.future.unshift(data);
      if (this.future.length > 10) {
        this.future.length = 10;
      }
    },
    storeState(name, state, group) {
      const data = { name, state, group };
      this.addHistory(data);
      this.future = [];
    },
    undo() {
      if (!this.canUndo) return;

      // 记录当前状态作为前进目标
      const target = {
        name: 'undo',
        state: JSON.stringify(this.$store.state)
      };
      this.addFuture(target);

      // 取前一个状态还原
      const past = this.history.shift();
      this.shuttle(past.state);

      // 将当前状态记录
      prevState = JSON.stringify(this.$store.state);
    },
    redo() {
      if (!this.canRedo) return;

      // 将当前状态推到历史中
      const target = {
        name: 'undo',
        state: JSON.stringify(this.$store.state)
      };
      this.addHistory(target);

      // 取一个状态还原
      const future = this.future.shift();
      this.shuttle(future.state);

      // 将当前状态记录
      prevState = JSON.stringify(this.$store.state);
    },
    shuttle(data) {
      const state = JSON.parse(data);
      state.helper.showVLine = false;
      state.helper.showHLine = false;
      state.helper.inControlDragging = false;
      state.helper.inLayoutDragging = false;

      // 保持左右侧的面板状态
      state.leftActiveTab = this.$store.state.leftActiveTab;
      state.rightActiveTab = this.$store.state.rightActiveTab;

      this.$store.replaceState(state);
    },
    initShortcutKey(ev) {
      // ctrl + z
      if (ev.ctrlKey && ev.which == 90) {
        this.undo();
        return;
      }
      // ctrl + y
      if (ev.ctrlKey && ev.which == 89) {
        this.redo();
        return;
      }
    }
  }
};
</script>

<style lang="scss">
.form-icon {
  &-undo,
  &-redo {
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 1;
    cursor: pointer;
  }
  &-undo {
    background: url('../assets/images/header/undo.png') center no-repeat;
    &:hover {
      background-color: #efefef;
      background-image: url('../assets/images/header/undo-h.png');
    }
  }
  &-redo {
    background: url('../assets/images/header/redo.png') center no-repeat;
    &:hover {
      background-color: #efefef;
      background-image: url('../assets/images/header/redo-h.png');
    }
  }
  &-undo.disabled {
    background-image: url('../assets/images/header/undo.png');
    opacity: 0.3;
  }
  &-redo.disabled {
    background-image: url('../assets/images/header/redo.png');
    opacity: 0.3;
  }
}
</style>
