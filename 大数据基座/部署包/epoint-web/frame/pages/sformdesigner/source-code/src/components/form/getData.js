import merge from 'lodash.merge';

export default {
  methods: {
    // 获取远程数据
    getOriginData(url, params) {
      if (!url) {
        throw new Error('url is required!');
      }
      let data;
      if (params) {
        data = merge({}, params);
      }
      
      this.loading = true;
      this.$httpPost(url, data)
        .then(res => {
          // 验证数据格式
          const list = [];
          if (!Array.isArray(res)) {
            throw new Error('远程数据必须为数组');
          }

          res.forEach(item => {
            if (item.id !== undefined && item.text !== undefined) {
              list.push(item);
            } else {
              console.warn(`id or text is not a valid type! ${JSON.stringify(item)}`);
            }
          });
          

          this.loading = false;
          this.originOptionList = list;

          return list;
        })
        .catch(error => {
          this.loading = false;
          console.error(error);
        });
    }
  }
};
