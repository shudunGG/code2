<template>
  <div class="accordion-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'accordion-group',
  props: {
    accordionMode: { type: Boolean, default: true }
  },
  data() {
    return {
      activeIndex: 0,
      accordions: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getAcc();
      this.active();
    });
  },
  methods: {
    getAcc() {
      this.accordions = this.$children.filter(c => c.$options.name === 'accordion');
    },
    active() {
      const acc = this.accordions[this.activeIndex];
      acc && acc.setCollaspe(false);
      if (this.accordionMode) {
        this.accordions.forEach((acc, i) => {
          if (i != this.activeIndex) {
            acc.setCollaspe(true);
          }
        });
      }
    },
    updateStatus(collaspe, from) {
      // 某个折叠时 无需处理
      if (collaspe || !this.accordionMode) {
        return;
      }

      // 某个展开时 其他收起
      this.accordions.forEach((acc, i) => {
        if (acc === from) {
          this.activeIndex = i;
        } else {
          acc.setCollaspe(true);
        }
      });
    }
  }
};
</script>

<style></style>
