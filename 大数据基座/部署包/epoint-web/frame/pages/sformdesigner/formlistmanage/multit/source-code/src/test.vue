<template>
  <div id="app" >
    <test />
  </div>
</template>

<script>
import Editor from "./components/editor/Editor";
export default {
  name: 'app',
  components: {
    test: Editor
  },
  data() {
    return {
      
    };
  },
  mounted() {
  },
  methods: {}
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
