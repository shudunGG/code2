<template>
  <div class="frozen-column">
    <div class="form-item">
      <div class="form-control ">
        <el-checkbox v-model="isFrozen" @change="onSwitch">冻结列</el-checkbox>
      </div>
    </div>
    <div class="form-item" v-if="isFrozen">
      <label class="form-label">冻结列索引</label>
      <div class="form-control ">
        <el-input-number v-model="frozenIndex" :min="0" :max="columnLength - 2" @change="change" size="mini" :controls="false"></el-input-number>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'extend-frozen-column',
  props: ['controlData'],
  computed: {
    columnLength() {
      const l1 = this.controlData.specialColumns.split(',').length;
      const l2 = this.controlData.columns.length || 4;
      return l1 + l2;
    }
  },
  data() {
    const idx = parseInt(this.controlData.frozenColumnIndex, 10);
    return {
      isFrozen: idx !== -1,
      frozenIndex: idx
    };
  },
  methods: {
    change(v) {
      if (this.controlData.frozenIndex == v) {
        return;
      }
      this.$emit('change', v, 'frozenColumnIndex');
    },
    onSwitch(v) {
      if (v) {
        this.$nextTick(() => {
          this.change(this.frozenIndex);
        });
      } else {
        this.$emit('change', -1, 'frozenColumnIndex');
      }
    }
  },
  watch: {
    'controlData.frozenColumnIndex'(v) {
      const idx = parseInt(v, 10);
      this.frozenIndex = idx;
      if (idx === -1) {
        this.isFrozen = false;
      } else {
        this.isFrozen = true;
      }
    }
  }
};
</script>

<style></style>
