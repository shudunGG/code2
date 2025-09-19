<template>
  <span class="design-button" >
    <span class="design-button-icon" v-if="icon" :class="icon"></span><slot></slot>
  </span>
</template>

<script>
export default {
  name: 'design-button',
  props: {
    icon: {
      type: String
    }
  }
};
</script>
