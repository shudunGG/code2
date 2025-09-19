<template>
  <div class="device" :class="className">
    <div class="device-frame">
      <div class="device-content">
        <slot></slot>
      </div>
    </div>
    <div class="device-stripe"></div>
    <div class="device-header"></div>
    <div class="device-sensors"></div>
    <div class="device-btns"></div>
    <div class="device-power"></div>
  </div>
</template>

<script>
import '@/style/device.css';
export default {
  name: 'device',
  props: {
    type: {
      type: String,
      default: 'iphone-8'
    },
    color: {
      type: String,
      default: 'silver'
    }
  },
  computed: {
    className() {
      return `device-${this.type} device-${this.color}`;
    }
  }
};
</script>

<style>
</style>