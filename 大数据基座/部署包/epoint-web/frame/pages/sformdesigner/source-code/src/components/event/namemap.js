// 事件信息
const eventInfo = {
  valuechanged: {
    // 中文名称
    name: '值变更',
    // 实际绑定的事件名称
    originType: 'valuechanged',
    // 支持的动作
    actions: ['assignment']
  },
  'valuechanged:compare': {
    name: '值变更(关系比较)',
    originType: 'valuechanged',
    // 支持的动作
    actions: ['show', 'hide', 'assignment', 'clear']
  },
  // 人员部门详情可直接合并到 普通 的值变更中去
  // 人员和部门的区分以及表的配置可直接通过控件本身完成
  // 'valuechanged:getdeptinfo': {
  //   name: '值变更(获取部门详情)',
  //   originType: 'valuechanged',
  //   // 支持的动作
  //   actions: ['assignment']
  // },
  // 'valuechanged:getuserinfo': {
  //   name: '值变更(获取人员详情)',
  //   originType: 'valuechanged',
  //   // 支持的动作
  //   actions: ['assignment']
  // },
  'valuechanged:getcodelist': {
    name: '值变更(获取代码项)',
    originType: 'valuechanged',
    // 支持的动作
    actions: ['setData']
  }
};

// 动作信息
const actionInfo = {
  show: { name: '显示' },
  hide: { name: '隐藏' },
  assignment: { name: '赋值' },
  clear: { name: '清空' },
  setData: { name: '数据源设置' }
};

const actionInfoArr = Object.keys(actionInfo).map(key => {
  actionInfo[key].type = key;
  return actionInfo;
});

const eventInfoArr = Object.keys(eventInfo).map(key => {
  eventInfo[key].type = key;

  eventInfo[key].actionList = eventInfo[key].actions.map(action => {
    return actionInfo[action];
  });

  return eventInfo[key];
});

const operationNames = {
  '<=': '小于等于',
  '<': '小于',
  '!=': '不等于',
  '==': '等于',
  '>': '大于',
  '>=': '大于等于'
};

export { eventInfo, eventInfoArr, actionInfo, actionInfoArr, operationNames };
