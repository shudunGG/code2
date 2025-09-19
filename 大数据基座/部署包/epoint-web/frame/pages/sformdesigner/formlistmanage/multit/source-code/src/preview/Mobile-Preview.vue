<template>
  <div class="mobile-designer-area">
    <Device type="iphone-8" color="silver">
      <div class="mobile-form-container">
        <div class="mobile-form-item" :class="getCls(item, index)" v-for="(item, index) in data" :key="item.id" :data-index="index">
          <label class="mobile-form-label">
            <span v-if="item.label">{{item.label.labelText}}</span>
          </label>
          <span class="mobile-form-control">
            <!-- <input v-if="item.control" type="text" :placeholder="item.control.emptyText || item.control.type" /> -->
            <MobileControl v-if="item.control" :control-data="item.control" />
          </span>
        </div>
      </div>
    </Device>
  </div>
</template>

<script>
import Device from '../components/Device.vue';
import MobileControl from '@/components/mobile-holder/MobileControlHolder';

export default {
  name: 'Mobile-Preview',
  components: { MobileControl, Device },
  props: ['data'],
  data() {
    return {};
  },
  methods: {
    getCls(item, index) {
      return { hide: !item.visible, [item.control && item.control.type]: true, active: this.activeIndex === index };
    }
  }
};
</script>

<style>
</style>