# 使用说明

## 访问地址

启动本地服务器

`drawpc.html?pid=11`

正式环境删除mock相关js

```
<script src="./test/mock-min.js"></script>
<script src="./test/mockData.js"></script>
```

## 1、流程图接口

apiConfig.flowData

请求参数

```
{
	pid: 1 //流程图ID
}
```


返回值: 

**（）括号中表示对应原来的 字段**

```
{
		"wfprops":{ // 流程基本信息 (wfprops)
　　　　　　         "name":"流程名", (name)
　　　　　　        "key":"processVersionGuid" (key)
　　　　         },
		"nodedataarray": [	//节点列表 (nodes)
			{
				"category":"",	//类型，默认为空，备用，用于节点样式类型修改需求 (type)
				"name":"谷歌", 	//活动名称 (text.text)
				"icon":"2", 	//图标，2表示为 2.png，后续可修改为图片地址(原接口没有图标，只有类型)
				status: '', //1：未开始 2：待办理 3：已完成 4：超期 5：超期待处理
				"key":-2,			//活动id, 开始固定为1，结束固定为-1,其余按照实际情况 (id)
				"loc":"-217 376",	//在画布中的位置信息 (attr.x attr.y)
				"detail": {  //活动信息(detail)
					"transactor": "处理人，处理人2，处理人3",
					"url": "列表地址"
				}
			},
			...
		],
		"linkdataarray": [	//变迁线列表(actions)
			{
                "from":-1,  //-1表示key,也就是活动id (from)
                "to":-2,    //-2表示key,也就是活动id (to)
                "isdone": 1, //1表示完成，0表示未完成
                "points":[-147,141,-147,151,-147,180,-115,180,-115,209,-115,219] //位置信息(dots)
            },
            ...
		]
}
```