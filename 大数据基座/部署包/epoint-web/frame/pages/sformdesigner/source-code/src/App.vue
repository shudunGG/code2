<template>
  <div id="app" :style="'height:' + height + 'px'">
    <Main />
    <!-- <test /> -->
  </div>
</template>

<script>
import Main from './Main.vue';
// import test from './test.vue';

export default {
  name: 'app',
  components: {
    Main
    // ,test
  },
  data() {
    return {
      height: window.innerHeight
    };
  },
  mounted() {
    window.addEventListener('resize', this.handelResize);
    this.handleIE();
  },
  methods: {
    handelResize() {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => {
        this.height = window.innerHeight;
      }, 200);
    },
    handleIE() {
      if ((!!document.all && document.compatMode) || ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style)) {
        if (document.body.className) {
          document.body.className += ' ie';
        } else {
          document.body.className = ' ie';
        }

        this.$message({
          message: '为了有更好的体验，请使用最新版Chrome浏览器。',
          type: 'error',
          showClose: true,
          duration: 10000
        });

      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handelResize);
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Microsoft Yahei';
}
html {
  overflow-x: auto;
  overflow-y: hidden;
}
#app {
  font-size: 14px;
  height: 100vh;
}
</style>
