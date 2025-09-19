# 事件说明

事件配置格式如下

1. 事件类型，即是什么事件。
1. 事件动作，即这个事件要干什么。
1. 事件目标，即这个事件的这个动作的操作目标是谁。

一个事件可能存在多个动作，一个动作可能有多个目标。

如 “值变更，关系比较” 中，满足特定条件时，可能需要显示一个（多个）控件（区域）并且要隐藏一个（多个）控件（区域）。

## 事件类型

**值变更** `valuechanged`

场景：

1. 输入值变更时，发起请求，查询相关信息赋值给某些控件

支持控件：

- 控件：all

配置流程

1. 选择要查询的数据表
2. 选择赋值目标控件
3. 为赋值的目标控件选择赋值的字段
  
**值变更：关系比较** `valuechanged:compare`

场景：

1. 控件值变更，且当前值符合于指定值的比较关系成立时 执行显示 / 隐藏 / 清空 / 赋值 等操作

支持控件为选择性控件：

- **combobox**
- **radiobuttonList**
- **treeSelect**

配置流程

1. 选择条件比较的操作符，等于或不等于
2. 选择条件比较的目标值
3. 选择事件的执行动作和相应的目标控件

若事件动作为赋值，则 还需要配置：

1. 数据查询的数据表
2. 赋值目标控件的赋值字段

**值变更：获取代码子项** `valuechanged:getcodelist`

场景：

1. combobox 联动选择

支持控件：

- **combobox**
  
配置流程：

为具有联动关系的父组件配置此事件，事件目标选择为待联动的子控件即可。

如：省市区的联动选择，则为省和市下拉框配置此事件，其中省事件的动作目标为市控件、市控件的动作目标为区控件即可。

## 事件动作

即表示事件要做什么操作，具体如下：

```js
{
  show: { name: '显示' },
  hide: { name: '隐藏' },
  assignment: { name: '赋值' },
  clear: { name: '清空' },
  setData: { name: '数据源设置' }
}
```

## 事件目标

即事件动作的操作目标，是显示哪一块区域，还是隐藏那个控件，或者是哪一个控件赋值。具体取决事件动作。

## 数据组织

```js
{
  events: {
    // 事件类型名称 用于配置时使用，如：值改变（关系比较）、值改变（获取用户详情）
    // 此 eventName 并非生成时控件上的事件类型， 目前生成绑定事件应统一为： valueChanged
    [eventName]: [
      // event description object
      {
        // 事件名称 同外部的 eventName 仅用于配置时的标识
        type: 'eventName',
        // 真实绑定给控件的事件名称
        originType: 'valuechanged',
        // 是否在初始化执行
        runAtInit: false,
        // 条件 可能为空
        conditions: [
          {
            // 比较操作符 == !=
            operation: '>',
            // 比较的目标值 即选择控件的value字段值
            target: ''
          }
        ],
        // 事件操作
        actions: [
          {
            // 事件操作类型 如显示、隐藏、赋值、清空等
            type: 'show',
            // 目标信息
            targets: [
              {
                // 目标类型
                type: 'layout',
                // 目标id
                id: 'rowid-asghjsgsd82j'
              },
              {
                type: 'control',
                id: 'controlId'
              }
            ]
          },
          {
            type: 'assignment',
            sourceTableId: '目标数据表id',
            targets: [
              {
                type: 'control',
                id: 'controlId',
                setValueField: '控件赋值时新的关联字段'
              }
            ]
          }
        ]
      }
    ]
  }
}
```
