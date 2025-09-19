<template>
  <div class="accordion">
    <div class="accordion-header">
      <span class="accordion-title">{{ title }}</span>
      <span class="accordion-toggle el-icon-arrow-down" :class="{ collaspe: collaspe }" @click="collaspe = !collaspe"></span>
    </div>
    <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" v-on:before-leave="beforeLeave" v-on:leave="leave" v-on:after-leave="afterLeave">
      <div class="accordion-body" v-show="!collaspe" :class="{ collaspe: collaspe }" ref="body">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'accordion',
  props: {
    title: { type: String, required: true }
  },
  data() {
    return {
      collaspe: false,
      inGroup: false
    };
  },
  mounted() {
    if (this.$parent.$options.name == 'accordion-group') {
      this.inGroup = true;
    }
  },
  methods: {
    beforeEnter(el) {
      el.classList.add('collapse-transition');
      if (!el.dataset) el.dataset = {};

      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;

      el.style.height = '0';
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
      el.style.opacity = 0;
    },
    enter(el) {
      el.dataset.oldOverflow = el.style.overflow;
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + 'px';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      } else {
        el.style.height = '';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      }
      el.style.opacity = 1;

      el.style.overflow = 'hidden';
    },
    afterEnter(el) {
      el.classList.remove('collapse-transition');
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
      el.style.opacity = '';
    },
    beforeLeave(el) {
      if (!el.dataset) {
        el.dataset = {};
      }
      // 记录原始状态
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      // 设置高度 和 移除不可见
      el.style.height = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';
      el.style.opacity = 1;
    },
    leave(el) {
      // 离开时 加过渡样式 设值终点状态
      if (el.scrollHeight !== 0) {
        el.classList.add('collapse-transition');
      }
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
      el.style.opacity = 0;
    },
    afterLeave(el) {
      // 离开完成 移除过渡样式 恢复原始属性
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
      el.style.opacity = '';
    },
    setCollaspe(v) {
      if (v === undefined) {
        this.collaspe = !this.collaspe;
        return;
      }

      this.collaspe = !!v;
    },
  },
  watch: {
    collaspe(v) {
      if (this.inGroup) {
        this.$parent.updateStatus(v, this);
      }
      this.$emit('change', v);
    }
  }
};
</script>

<style lang="scss">
$activeColor: #2590eb;
.accordion {
  margin-bottom: 10px;
}
.accordion-header {
  height: 36px;
  line-height: 36px;
  overflow: hidden;
  padding: 0 14px;
  font-size: 15px;
}
.accordion-title {
  transition: 0.1s ease-out color;
  &:hover {
    color: $activeColor;
  }
}
.accordion-toggle {
  transition: 0.3s ease-out transform, 0.1s ease-out color;
  transform-origin: 50% 50%;
  float: right;
  text-align: center;
  width: 20px;
  height: 36px;

  line-height: 36px;
  display: block;
  cursor: pointer;
  &:hover {
    color: $activeColor;
  }
  &.collaspe {
    transform: rotate(180deg);
    transform: rotate3d(180deg);
  }
}

.accordion-body {
  overflow: hidden;
  user-select: none;
  box-sizing: border-box;
}
.collapse-transition {
  transition: all 0.3s ease-in-out;
}
</style>
