var  uuidv4 = function () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
  }

// 获取树控件
Mock.mock(Util.getRightUrl('test/radiotreeaction'), function() {
	var data = [{
		"fullPath": "",
		"isOU": "true",
		"img": "",
		"expanded": true,
		"checked": true,
		"pid": "-1",
		"id": "",
		"text": "\u6240\u6709\u90E8\u95E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "",
		"id": "00c4ab1e-dfb6-4227-97cd-4e4064a2b68d",
		"text": "\u65B0\u70B9\u8F6F\u4EF6",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "",
		"id": "b3c5912d-7607-49b0-b610-ac40fbc8c1b1",
		"text": "\u5BA2\u6237\u4EBA\u5458",
		"ckr": true,
		"iconCls": "",
		"isLeaf": true
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "00c4ab1e-dfb6-4227-97cd-4e4064a2b68d",
		"id": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"text": "\u603B\u90E8\u804C\u80FD\u90E8\u95E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "00c4ab1e-dfb6-4227-97cd-4e4064a2b68d",
		"id": "2e762259-0dc2-4aeb-80e0-db171028ade8",
		"text": "\u8425\u9500\u548C\u4EA4\u4ED8\u670D\u52A1\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "00c4ab1e-dfb6-4227-97cd-4e4064a2b68d",
		"id": "b61c794a-53db-4981-9b98-7e201bd2b4f6",
		"text": "\u4EA7\u54C1\u548C\u89E3\u51B3\u65B9\u6848\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"id": "04bf7b51-b95b-4308-a24b-ee5b2044d1b8",
		"text": "\u6218\u7565\u548C\u53D1\u5C55\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"id": "48cf669d-8507-4027-83b6-944d91d34044",
		"text": "\u8D28\u91CF\u8FD0\u8425\u548C\u6D41\u7A0B\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"id": "80be0678-5e9c-49f2-9ee2-760f09c2646b",
		"text": "\u4EBA\u529B\u8D44\u6E90\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"id": "23f1765b-6930-46cd-aa3e-3bca1bb22d13",
		"text": "\u65B0\u70B9\u5B66\u9662",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"id": "9ea835d3-e853-4119-b16a-23ad3348f687",
		"text": "\u8D22\u52A1\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": true
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"id": "6bdbad70-1744-4a8a-acbd-222955ab8846",
		"text": "\u884C\u653F\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": false
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "ffa0252c-4bba-4bd6-8d0c-3bc6340a6605",
		"id": "b07ac99b-9e01-4fcd-95ac-0456d2de0cde",
		"text": "\u91C7\u8D2D\u4F9B\u5E94\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": true
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "23f1765b-6930-46cd-aa3e-3bca1bb22d13",
		"id": "3469ef04-52e2-413a-be56-31e83dce96d1",
		"text": "\u57F9\u8BAD\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": true
	}, {
		"fullPath": "",
		"img": "",
		"expanded": false,
		"checked": false,
		"pid": "23f1765b-6930-46cd-aa3e-3bca1bb22d13",
		"id": "be844b5c-496f-43fe-a4d2-ec90ced095b0",
		"text": "\u5B66\u5458\u90E8",
		"ckr": true,
		"iconCls": "",
		"isLeaf": true
	}];

	return data;
});

// 初始化页面获取应用
Mock.mock(Util.getRightUrl('test/getapps'), function () {
	var data = [{
		categoryname: '协同办公',
		categoryid: uuidv4(),
		children: [{
			icon: './images/icon-menu.png',
			bgcolor: 'blue',
			name: '待办事宜',
			desktop: '',
			msg: '',
			msgtype: 0,
			addr: 'http://www.baidu.com',
			size: 'small',
			id: uuidv4(),
			msgoptions: [{
				msg: '不提醒',
				msgtype: 0
			}, {
				msg: '模块角标实现类型选项',
				msgtype: 1
			}],
			desktopoptions: [{
				text: '桌面1',
				id: uuidv4()
			}, {
				text: '桌面2',
				id: uuidv4()
			}, {
				text: '桌面3',
				id: uuidv4()
			}]
		}, {
			icon: './images/icon-menu.png',
			bgcolor: 'cyan',
			name: '通讯录',
			desktop: '桌面1',
			msg: '模块角标实现类型选项',
			msgtype: 1,
			addr: '',
			size: 'small',
			id: uuidv4(),
			msgoptions: [{
				msg: '不提醒',
				msgtype: 0
			}, {
				msg: '模块角标实现类型选项',
				msgtype: 1
			}],
			desktopoptions: [{
				text: '桌面1',
				id: uuidv4()
			}, {
				text: '桌面2',
				id: uuidv4()
			}, {
				text: '桌面3',
				id: uuidv4()
			}]
		}]
	}, {
		categoryname: '通讯录',
		categoryid: '38485708-2b06-455e-b738-b5f52eb211f6',
		children: [{
			icon: './images/icon-menu.png',
			bgcolor: 'blue',
			name: '通讯录A',
			desktop: '',
			msg: '',
			msgtype: 0,
			addr: '',
			size: 'small',
			id: uuidv4(),
			msgoptions: [{
				msg: '不提醒',
				msgtype: 0
			}, {
				msg: '模块角标实现类型选项',
				msgtype: 1
			}],
			desktopoptions: [{
				text: '桌面1',
				id: uuidv4()
			}, {
				text: '桌面2',
				id: uuidv4()
			}, {
				text: '桌面3',
				id: uuidv4()
			}]
		}, {
			icon: './images/icon-menu.png',
			bgcolor: 'cyan',
			name: '通讯录B',
			desktop: '桌面1',
			msg: '',
			msgtype: 0,
			addr: '',
			size: 'large',
			id: uuidv4(),
			msgoptions: [{
				msg: '不提醒',
				msgtype: 0
			}, {
				msg: '模块角标实现类型选项',
				msgtype: 1
			}],
			desktopoptions: [{
				text: '桌面1',
				id: uuidv4()
			}, {
				text: '桌面2',
				id: uuidv4()
			}, {
				text: '桌面3',
				id: uuidv4()
			}]
		}]
	}]

	return data;
});

// 获取模块信息
Mock.mock(Util.getRightUrl('test/getAppInf'), function () {
	var data = {
		categoryname: '通讯录',
		categoryid: '38485708-2b06-455e-b738-b5f52eb211f6',
		icon: './images/icon-menu.png',
		bgcolor: 'blue',
		name: '通讯录A',
		appid: uuidv4(),
		desktop: '',
		msg: '模块角标实现类型选项',
		msgtype: 1,
		addr: '',
		size: 'small',
		id: uuidv4(),
		msgoptions: [{
			msg: '不提醒',
			msgtype: 0
		}, {
			msg: '模块角标实现类型选项',
			msgtype: 1
		}]
	};

	return data;
});

// 获取应用图标
Mock.mock(Util.getRightUrl('test/geticons'), function () {
	var data = [{
		type: 'frame',
		children: [{
			icon: './images/icon-menu.png',
			index: 0
		}, {
			icon: './images/icon-menu.png',
			index: 1
		}, {
			icon: './images/icon-menu.png',
			index: 2
		}, {
			icon: './images/icon-menu.png',
			index: 3
		}, {
			icon: './images/icon-menu.png',
			index: 4
		}, {
			icon: './images/icon-menu.png',
			index: 5
		}, {
			icon: './images/icon-menu.png',
			index: 6
		}, {
			icon: './images/icon-menu.png',
			index: 7
		}, {
			icon: './images/icon-menu.png',
			index: 8
		}, {
			icon: './images/icon-menu.png',
			index: 9
		}, {
			icon: './images/icon-menu.png',
			index: 10
		}, {
			icon: './images/icon-menu.png',
			index: 11
		}, {
			icon: './images/icon-menu.png',
			index: 12
		}]
	}, {
		type: 'custom',
		children: [{
			icon: './images/icon-menu.png',
			index: 0
		}, {
			icon: './images/icon-menu.png',
			index: 1
		}]
	}];

	return data;
});

// 保存订阅
Mock.mock(Util.getRightUrl('test/save'), function () {
	// 请求参数
	// {"id":"c8e4435e-8bf6-433a-ba76-15bf4df187e0","bgcolor":"blue","icon":"./images/icon-menu.png","name":"待办事宜","desktop":"待分配","msgtype":"0","msg":"","addr":"","size":"medium"}
	return {};
});

// 删除订阅
Mock.mock(Util.getRightUrl('test/del'), function () {
	return {};
});

// 桌面相关接口
Mock.mock(Util.getRightUrl('test/desktop'), function () {
	// 修改保存桌面请求参数
	// {"id": "c8e4435e-8bf6-433a-ba76-15bf4df187e0", "text": "桌面22", "type": "save"}
	// 删除桌面请求参数
	// {"id": "c8e4435e-8bf6-433a-ba76-15bf4df187e0", "text": "桌面22", "type": "delete"}
	return {};
});
