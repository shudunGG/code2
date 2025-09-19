<template>
  <div class="design-area" id="design-area" ref="designArea" style="position:relative" :data-width="size.width" :data-height="size.height" :style="{ width: size.width + 20 + 'px' }">
    <RowLayout :list="data" />
    <!-- 页面的隐藏域 -->
    <div class="design-hidden-area" >
      <Control v-for="ctr in hiddenControls" :control-data="ctr" :key="ctr.id"></Control>
    </div>
  </div>
</template>

<script>
import RowLayout from '../components/row-layout/RowLayout';
// import { mapState, mapActions } from 'vuex';
import Control from '../components/Control';
export default {
  name: 'PC-Preview',
  components: {
    RowLayout,
    Control
  },
  props: ['data', 'hiddenControls'],
  data() {
    return {
      size: {
        width: 900,
        height: 0
      }
    };
  }
};
</script>

<style>
</style>