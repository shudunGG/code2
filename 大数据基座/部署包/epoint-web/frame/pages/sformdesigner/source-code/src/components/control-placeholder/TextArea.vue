<template>
  <textarea class="design-control-holder textbox" type="text" :style="'height:'+ (controlData.height || 26) + 'px'" style="resize: none;" :value="controlData.value" :placeholder="controlData.emptyText || (controlData.name)" readonly ></textarea>
</template>

<script>
export default {
  name: 'placeholder-textarea',
  props: ['controlData'],
};
</script>

<style></style>
