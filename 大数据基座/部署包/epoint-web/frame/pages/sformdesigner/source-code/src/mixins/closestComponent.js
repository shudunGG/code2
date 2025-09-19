export default {
  methods: {
    /**
     * 向上获取最近的 组件
     *
     * @param {string | () => boolean} componentName 组件名称 或 比对函数实参为父组件实例
     * @param {CombinedVueInstance | undefined} from 起始组件 ，默认为自身
     * @returns
     */
    closestComponent(componentName, from) {
      const self = from ? from : this;
      let parent = self.$parent || self.$root;

      if (componentName + '' === componentName) {
        let name = parent.$options.name;
        while (parent && (!name || name !== componentName)) {
          parent = parent.$parent;
          if (parent) {
            name = parent.$options.name;
          }
        }
      } else {
        while (parent && !componentName(parent)) {
          parent = parent.$parent;
        }
      }

      return parent;
    }
  }
};
