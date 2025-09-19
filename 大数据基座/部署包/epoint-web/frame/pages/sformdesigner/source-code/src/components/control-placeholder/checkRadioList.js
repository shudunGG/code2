export default {
  computed: {
    dataList() {
      const controlData = this.controlData;
      if (Array.isArray(controlData.data)) {
        return controlData.data;
      }
      if (this.originData && this.originData.length) {
        return this.originData;
      }
      return this.defaultDataList;
    }
  },
  methods: {
    getDataList() {
      const controlData = this.controlData;
      if (Array.isArray(controlData.data) || !controlData.codeItem) {
        return (this.originData = []);
      }

      this.$httpPost(window.formDesignerActions.getControlDataListUrl, { controlData: this.controlData })
        .then(data => {
          if (Array.isArray(data)) {
            this.originData = data;
          } else {
            throw new Error('获取控件数据出错!');
          }
        })
        .catch(err => {
          this.originData = [];
          console.error(err);
        });
    }
  },
  watch: {
    'controlData.codeItem'(v) {
      v && this.getDataList();
    }
  }
};
