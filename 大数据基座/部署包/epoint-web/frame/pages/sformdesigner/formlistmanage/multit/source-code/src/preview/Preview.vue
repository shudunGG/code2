<template>
  <div class="preview-wrap">
    <iframe ref="preview" :src="iframeUrl" height="100%" width="100%" frameborder="0"></iframe>
  </div>
</template>

<script>
const useSuffix = /.html/.test(location.pathname);
export default {
  name: 'preview',
  // data() {
  //   return {
  //     viewType: 'pc',
  //     viewDesign: false,
  //     dataLoad: false,
  //     design: [],
  //     hiddenControls: [],
  //     mobileDesign: []
  //   };
  // },
  props: ['designId', 'tableGuid'],
  computed: {
    iframeUrl() {
      const baseUrl =
        process.env.NODE_ENV != 'production'
          ? '//localhost/ep94/frame/pages/sformdesigner/preview/preview.html'
          : previewUrl; // './preview/preview' + (useSuffix ? '.html' : '');
      // const baseUrl = './preview/preview.html';
      return `${baseUrl}?tableGuid=${this.tableGuid}&designId=${this.designId}`;
    }
  },
  mounted() {
    const ifr = this.$refs['preview'];
    // 触发一次自动保存 以备扫码时可以根据id获取到数据
    this.$parent.autoSave(true);
    this.$parent.getData().then(data => {
      if (process.env.NODE_ENV != 'production') {
        setTimeout(() => {
          ifr.contentWindow.postMessage(
            JSON.stringify({
              type: 'previewHtml',
              params: data
            }),
            '*'
          );
        }, 3000);
      } else {
        this.retry(
          () => typeof ifr.contentWindow.getPreviewHtml == 'function',
          () => {
            console.log(ifr.contentWindow.getPreviewHtml);
            ifr.contentWindow.getPreviewHtml(data);
          }
        );
      }
    });
    // };
  },
  methods: {
    retry(compareFn, fn) {
      // console.log('try', compareFn);
      let i = 0;
      const go = () => {
        var res = compareFn();
        console.log(res);
        if (res) {
          fn();
        } else if (i++ < 500) {
          setTimeout(() => {
            this.retry(compareFn, fn);
          }, 20);
        } else {
          throw new Error('预览加载超时');
        }
      };
      go();
    }
  }
};
</script>

<style scoped lang="scss">
.preview-wrap {
  height: 100%;

  iframe {
    height: 100%;
    width: 100%;
  }
}
</style>