# 接口

### 接口配置
```
var MsgCenterConfig = {
    "typeListUrl": getDataUrl + '/getTypeListUrl', // 类型接口
    "msglistUrl": getDataUrl + '/getMsglistUrl', // 右侧列表接口
    "markToReadUrl": getDataUrl + '/markToReadUrl', // 标记为已读接口，多个用逗号隔开
    "deleteUrl": getDataUrl + '/deleteUrl', // 删除接口, 类型为all表示删除所有，不然直接传id，多个逗号隔开
    "msgTipsUrl": getDataUrl + '/getMsgTipsUrl' // 消息提醒接口，返回各个类别的数据和总数
}
```

1、 左侧消息类型接口

`typeListUrl`

请求参数： 无

返回值：

```
{
  "msgTypes": [
    {
      "id": 0, // 唯一id
      "name": "全部", // 名称
      "icon": "modicon-99", // 图标
      "show": true // 加载时是否显示
    },
    {
      "id": 1,
      "name": "系统提醒",
      "icon": "modicon-1"
    },
    {
      "id": 2,
      "name": "待办事宜",
      "icon": "modicon-2"
    },
    {
      "id": 3,
      "name": "新邮件",
      "icon": "modicon-3"
    },
    {
      "id": 4,
      "name": "邮件反馈",
      "icon": "modicon-4"
    }
  ]
}
```

2、右侧列表接口

`msglistUrl`

请求参数： 

```
{
    index: 1, // 当前页数 从1开始
    page: 10, // 一页多少条，默认10条，可配置
    msgtype: 0, // 当前消息类型ID，对应左侧消息类型的id
    unread: false, // false 表示全部，true表示查询未读
    key: _key // 搜索关键字
}
```

返回值：

```
{
    "list": [
        {
            "id": "@guid()", // 消息的唯一id
            "typeId": 1, // 消息类型id
            "title": "<div>您收到一条待办事宜，标题：【审核】项目绩效管理中涵盖内部流程配置的临时变更申请，提交人：<a href='#1'>张三</div>", // 消息标题
            "readed": false, // 是否已读，false为未读，true表示已读
            "createTime": "2018-09-12 14:20:34", // 时间
            "openType":"dialog", // 消息打开方式，参照系统的约定
            "url":"http://localhost:8080/epoint-web/frame/pages/helpcenter/questionfeedback/feedbackworkflow?ProcessVersionInstanceGuid=94ff0c78-79ac-408a-af51-8e5222c5faa0&WorkItemGuid=dbf557b6-226d-4c2a-83e2-7258faab183e&MessageItemGuid=c5fcbe8d-ba8f-47ef-8a45-d976f4934a52&messageGuid=ecbb76e2-857b-4d80-8948-23832fc2f32c" // 查询详情
        },
        ...],
    "pageInfo": {
        "index": 1, // 当前页数
        "page": 10, // 单页个数
        "sum": 5 // 总页数，从1开始
    }
}
```

3、标记为已读

`markToReadUrl`

请求参数：

```
{
    id: id || '' // 不传表示忽略全部，多个用英文逗号隔开如:"1,2,3"
    msgtype: 1 // id为空时需要传消息类型ID，清空该类型下的未读消息，有id时不需要传，因为消息ID是唯一的，需要的话联系前端添加
};
```

返回值：

暂时没有设定，需要返回一个成功的标记


4、删除接口

`deleteUrl`

请求参数：

```
{
    id: id // 多个用英文逗号隔开如:"1,2,3",如果是清除所有,则传 'all'
    msgtype: 1 // id为 'all' 时需要传消息类型ID，清空该类型下的未读消息，有id时不需要传，因为消息ID是唯一的，需要的话联系前端添加
};
```


返回值：

暂时没有设定，需要返回一个成功的标记


5、消息提醒接口

`msgTipsUrl`

请求参数: 无

返回值： 

```
[
  {
    "id": 0, // 消息类型ID
    "num": 168 // 未读消息数
  },
  {
    "id": "1",
    "num": 82
  },
  {
    "id": "2",
    "num": 74
  },
  {
    "id": "3",
    "num": 42
  },
  {
    "id": "4",
    "num": 101
  }
]
```

## 消息高级设置

```
var MsgCenterSetting = {
    getMessageSettingUrl:  getDataUrl + '/getMessageSetting', // 获取参数数据
    saveMessageSettingUrl: getDataUrl + '/saveMessageSettingUrl' //保存 
}
```

说明： 同个人资料的高级设置

6、获取参数数据

`getMessageSettingUrl`

请求参数： 无

返回值： 

```
{
  "types": [
    {
      "id": "sms",
      "text": "短信"
    },
    {
      "id": "weixin",
      "text": "企业微信"
    },
    {
      "id": "gateway",
      "text": "门户"
    },
    {
      "id": "mobile",
      "text": "移动端"
    }
  ],
  "items": [
    {
      "name": "邮件",
      "id": "email",
      "state": false,
      "detail": [
        {
          "disabled": true,
          "id": "sms"
        },
        {
          "disabled": true,
          "id": "weixin"
        },
        {
          "id": "gateway",
          "state": false
        },
        {
          "id": "mobile",
          "state": false
        }
      ]
    },
    {
      "name": "任务",
      "id": "task",
      "state": false,
      "detail": [
        {
          "id": "sms",
          "state": false
        },
        {
          "disabled": true,
          "id": "weixin"
        },
        {
          "disabled": true,
          "id": "gateway"
        },
        {
          "disabled": true,
          "id": "mobile"
        }
      ]
    },
    {
      "name": "系统提醒",
      "id": "sysremind",
      "state": false,
      "detail": [
        {
          "disabled": true,
          "id": "sms"
        },
        {
          "disabled": true,
          "id": "weixin"
        },
        {
          "disabled": true,
          "id": "gateway"
        },
        {
          "id": "mobile",
          "state": false
        }
      ]
    },
    {
      "name": "待办",
      "id": "waithandle",
      "state": true,
      "detail": [
        {
          "disabled": true,
          "id": "sms"
        },
        {
          "id": "weixin",
          "state": true
        },
        {
          "id": "gateway",
          "state": true
        },
        {
          "disabled": true,
          "id": "mobile"
        }
      ]
    }
  ]
}
```

7、高级设置保存 

`saveMessageSettingUrl`

请求参数： 

```
[
    {
        "id": "email",
        "name": "邮件",
        "detail": [
            {
                "id": "sms",
                "disabled": true
            },
            {
                "id": "weixin",
                "disabled": true
            },
            {
                "id": "gateway",
                "state": false
            },
            {
                "id": "mobile",
                "state": false
            }
        ],
        "state": false
    },
    {
        "id": "task",
        "name": "任务",
        "detail": [
            {
                "id": "sms",
                "state": false
            },
            {
                "id": "weixin",
                "disabled": true
            },
            {
                "id": "gateway",
                "disabled": true
            },
            {
                "id": "mobile",
                "disabled": true
            }
        ],
        "state": false
    },
    {
        "id": "sysremind",
        "name": "系统提醒",
        "detail": [
            {
                "id": "sms",
                "disabled": true
            },
            {
                "id": "weixin",
                "disabled": true
            },
            {
                "id": "gateway",
                "disabled": true
            },
            {
                "id": "mobile",
                "state": false
            }
        ],
        "state": true
    },
    {
        "id": "waithandle",
        "name": "待办",
        "detail": [
            {
                "id": "sms",
                "disabled": true
            },
            {
                "id": "weixin",
                "state": true
            },
            {
                "id": "gateway",
                "state": true
            },
            {
                "id": "mobile",
                "disabled": true
            }
        ],
        "state": true
    }
]
```

返回值： 

返回成功标记即可
