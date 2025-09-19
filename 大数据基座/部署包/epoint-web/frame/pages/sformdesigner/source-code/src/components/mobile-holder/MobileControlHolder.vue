<template>
  <component :is="getControlComponent(controlData.type)" :control-data="controlData"></component>
</template>

<script>
import RadioList from './RadioList';
const props = ['controlData'];
const placeholderMap = {
  title: {
    props,
    template: '<span class="mobile-form-title">{{controlData.textContent || ""}}</span>'
  },
  textbox: {
    props,
    template: '<input type="text" :placeholder="controlData.emptyText || controlData.type" />'
  },
  textarea: {
    props,
    template: '<textarea :placeholder="controlData.emptyText || controlData.type" ></textarea>'
  },
  radiobuttonlist: RadioList,
  checkboxlist: RadioList,
  webuploader: {
    props,
    template: '<div class="uploader-wrap"><span class="uploader-btn"></span></div>'
  }
};
const defaultPlaceholder = {
  props,
  template: '<input type="text" :placeholder="controlData.emptyText || controlData.type" />'
};
export default {
  name: 'mobile-control',
  props,
  methods: {
    getControlComponent(type) {
      if (type in placeholderMap) {
        return placeholderMap[type];
      }
      return defaultPlaceholder;
    }
  }
};
</script>

<style lang="scss">
.mobile-form-control input {
  position: relative;
  width: calc(100% - 105px);
  height: 44px;
  border: none;
  padding: 0 10px 0 15px;
  margin: 0;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 2;
}

// textarea
.mobile-form-item.textarea {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  .mobile-form-label {
    width: 100%;

    padding: 10px;
    height: auto;
    line-height: 14px;
    font-size: 14px;
  }
  .mobile-form-control textarea {
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: #fff;
    height: 190px;
    width: 100%;
    border-left: none;
    border-right: none;
    border-radius: 0;
    font-size: 16px;
    color: #666;
    padding: 10px;
    resize: none;
  }
}

// webuploader

.mobile-form-item.webuploader {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  &:after {
    display: none;
  }
  .mobile-form-label {
    width: 100%;

    padding: 10px;
    height: auto;
    line-height: 14px;
    font-size: 14px;
    float: none;
  }
  .mobile-form-control {
    background: #fff;
    padding: 10px;

    .uploader-wrap {
      width: 94px;
      height: 94px;
      background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QN6aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MmJiOTM5ZDgtYTE0ZC1kMDRkLWI2ZTgtMGNiYzViYzIxNTA1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMyRUM5NzE5RjEyQTExRTg4NDZBQjk0RkQyOEQ2MTVFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMyRUM5NzE4RjEyQTExRTg4NDZBQjk0RkQyOEQ2MTVFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZTg3NjAxMy1iYjNhLWJkNDktOTc1Mi01MGI2NGMxMzI5YTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MmJiOTM5ZDgtYTE0ZC1kMDRkLWI2ZTgtMGNiYzViYzIxNTA1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3Jk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)
        no-repeat;
      background-size: 100%;
    }
  }
}
</style>