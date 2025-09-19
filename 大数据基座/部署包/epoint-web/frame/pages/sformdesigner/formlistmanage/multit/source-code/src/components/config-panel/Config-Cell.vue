<template>
  <!-- <div class="config-cell">
    <ConfigCol :selectedCol="selectedCol" v-if="type == 'col-item'" />
    <ConfigAccItem :selectedCol="selectedCol" v-if="type == 'acc-item'" />
  </div>-->
  <component :is="componentName" :selectedCol="selectedCol" class="config-cell" />
</template>

<script>
import ConfigAccItem from './Config-AccItem';
import ConfigCol from './Config-Col';

export default {
  name: 'config-cell',
  components: {
    ConfigAccItem,
    ConfigCol
  },
  props: ['selectedCol'],
  computed: {
    type() {
      console.log("--------------------------------this.selectedCol");
      console.log(this.selectedCol);
      const type = this.selectedCol ? this.selectedCol.type : '';
      return type ? type : 'col-item';
    },
    componentName() {
      if (this.type == 'acc-item') return ConfigAccItem;
      if (this.type == 'col-item') return ConfigCol;
      return '';
    }
  }
};
</script>

<style lang="scss"></style>
