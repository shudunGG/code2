# 使用说明

## 访问地址

启动本地服务器

`drawDemo.html?pid=11`

pid表示某个流程图，无或者为空表示新建

## 1、流程图接口

apiConfig.flowData

请求参数

```
{
	pid: 1 //流程图ID，为空表示新建
}
```

返回值
```
 {
	"pid": 1,	//该流程图的id，为空表示新建，不为空表示修改
	"data": {
	    "class": "go.GraphLinksModel",	//必传，写死
			"nodeDataArray": [ 	//节点信息
			{"id":"1", "category":"", "name":"百度", "icon":"1", "type":"", "key":-1,"url":"./test/test.html", "loc":"-218 121",
			"participatorflag":"0","operationflag":"0","materialflag":"0","info":{"activityguid":"","status":"","workflowactivity":"","participators":"","operations":"","materials":""}},
			{"id":"3", "category":"", "name":"名字很长名字很长名", "icon":"3", "type":"", "key":-3,"url":"./test/test.html", "loc":"-186.00000000000006 238.99999999999994", "participatorflag":"0","operationflag":"0","materialflag":"0","info":{"activityguid":"","status":"","workflowactivity":"","participators":"","operations":"","materials":""}},
			{"id":"2", 	//表示节点的id
			"category":"",	//类型，默认为空
			 "name":"谷歌", 	//名称
			 "icon":"2", 	//图标，2表示为 2.png，后续可修改为图片地址
			 "type":"", 	//type为0或者为空表示存在右键菜单，为1表示不存在
			 "key":-2,			//插件自动生成的key，在该流程图中值唯一
			 "url":"./test/test.html",	//跳转地址
			 "loc":"-217 376",	//在画布中的位置信息
			 "participatorflag":"0",
			 "operationflag":"0",
			 "materialflag":"0",
			 "info":{
			    "activityguid":"",
			    "status":"",//状态（已流转、未流转）
			    "workflowactivity":"",//工作流活动实体
			    "participators":"",//处理人信息
			    "operations":"",//操作按钮信息
			    "materials":"",//材料信息
			    "transactor":""//处理人名称：处理人，处理人2，处理人3
			    }
			 }
		 ],
		  "linkDataArray": [ 	//连线信息
			{
				"from":-1,  //-1表示key 
				"to":-3, 	//-3表示key
				"points":[-147,141,-147,151,-147,180,-115,180,-115,209,-115,219]， //位置信息
				"transition":"",//变迁实体数据
			},
			{"from":-3, "to":-2, "points":[-115,259,-115,269,-115,307.5,-146,307.5,-146,346,-146,356]}
		 ],
		 "methodDataArray":[],
         "contextDataArray":[],
         "eventDataArray":[]
	}
}
```

## 2、节点列表

apiConfig.nodeList

请求参数

```
{
	pid: 1 //流程图ID，为空表示新建
}
```

返回值

```
[
		{ 
			id: "@increment()",	//节点id
			category: '',	//分类，默认为空
			name: '@first()',		
			"icon": '1',	//图标地址
			url:'./test/test.html',	//跳转地址
			"type": 0	//0 表示有右键菜单，1则无
		},
		...
	]
```


## 3、 保存接口

apiConfig.saveFlow

请求参数

请求参数同 流程图接口 中的返回数据，
pid存在则表示修改，不存在或者为空字符则表示新建

返回值：

```
{
	code: 200 //200表示成功
}
```
