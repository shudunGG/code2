<template>
  <div class="design-view-container" :class="{'view-real':!viewDesign,'view-design':viewDesign}">
    <PC v-if="dataLoaded" v-show="viewType === 'pc'" :data="design" :hiddenControls="hiddenControls" />
    <Mobile v-if="dataLoaded" v-show="viewType === 'mobile'" :data="mobileDesign" />
  </div>
</template>

<script>
import PC from './PC-Preview';
import Mobile from './Mobile-Preview';

export default {
  name: 'preview',
  components: {
    PC,
    Mobile
  },
  data() {
    return {
      viewType: 'pc',
      viewDesign: false,
      dataLoad: false,
      design: [],
      hiddenControls: [],
      mobileDesign: []
    };
  }
};
</script>

<style>
</style>