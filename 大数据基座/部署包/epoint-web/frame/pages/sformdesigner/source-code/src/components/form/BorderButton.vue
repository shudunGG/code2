<template>
  <div class="design-button-group border-group" :data-value="selectedText">
    <MyButton :icon="'border-' + item" v-for="item in list" :key="item" :class="{ active: selectes[item] }" @click.native="activeBtn(item)"></MyButton>
  </div>
</template>

<script>
import Button from './Button';

const list = ['top', 'right', 'bottom', 'left'];

export default {
  name: 'bordern-button',
  components: {
    MyButton: Button
  },
  props: {
    value: { type: String }
  },
  data() {
    return {
      list: list,
      selectes: this.getSubValue()
    };
  },
  computed: {
    selectedText() {
      const arr = [];
      if (this.selectes.top) {
        arr.push('top');
      }
      if (this.selectes.right) {
        arr.push('right');
      }
      if (this.selectes.bottom) {
        arr.push('bottom');
      }
      if (this.selectes.left) {
        arr.push('left');
      }
      return arr.join(',');
    }
  },
  watch: {
    value() {
      this.selectes = this.getSubValue();
    },
    selectedText(v) {
      this.$emit('input', v);
    }
  },
  methods: {
    getSubValue() {
      const valueList = this.value.split(',');
      return {
        top: valueList.indexOf('top') !== -1,
        right: valueList.indexOf('right') !== -1,
        bottom: valueList.indexOf('bottom') !== -1,
        left: valueList.indexOf('left') !== -1
      };
    },
    activeBtn(value) {
      this.selectes[value] = !this.selectes[value];
    }
  }
};
</script>

