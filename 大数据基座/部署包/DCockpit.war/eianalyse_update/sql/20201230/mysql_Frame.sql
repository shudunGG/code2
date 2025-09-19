drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_table_api_category' )<1
     then
		CREATE TABLE `portrait_table_api_category` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL,
		  `apicategoryname` varchar(255) COLLATE utf8_bin DEFAULT NULL,
		  `parentGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL,
		  `level` varchar(255) COLLATE utf8_bin DEFAULT NULL,
		  `sort` int(11) DEFAULT NULL,
		  `createDatetime` datetime DEFAULT NULL,
		  `updateDatetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
		  PRIMARY KEY (`rowguid`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	portrait_table_api_category WHERE rowguid='4e026be2-a2aa-49f4-af1f-614070906a00')<1
	then
		INSERT INTO portrait_table_api_category VALUES('4e026be2-a2aa-49f4-af1f-614070906a00', '平台开放服务', '', '4e026be2-a2aa-49f4-af1f-614070906a00', 0, '2020-12-30 15:37:54.0', '2020-12-30 15:38:17.0');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_table_api_info' )<1
     then
		CREATE TABLE `portrait_table_api_info` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '默认主键字段',
		  `apiCategoryGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT 'api分类guid',
		  `serviceName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '服务名称',
		  `serviceDesc` text COLLATE utf8_bin COMMENT '服务描述',
		  `serviceSource` int(11) DEFAULT NULL COMMENT '服务来源 0:系统服务 1:第三方 2.接口生成',
		  `originalAddress` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '接口源地址',
		  `requestMethod` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '请求方法 0:GET 1:POST 2:GET/POST',
		  `contentType` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '请求内容类型',
		  `requestSample` text COLLATE utf8_bin COMMENT '请求示例',
		  `responseSample` text COLLATE utf8_bin COMMENT '响应实例',
		  `gatewayServiceId` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '网关服务id',
		  `gatewayServicePath` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '网关服务路径',
		  `gatewayServiceState` int(11) DEFAULT '0' COMMENT '网关服务状态 :0:未注册 1:已注册 2:已发布 3已下线',
		  `gatewayproxyaccessurl` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT 'API网关代理访问地址',
		  `product_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `plan_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `backend_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `operation_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `createDatetime` datetime DEFAULT NULL COMMENT '创建时间',
		  `updateDatetime` datetime DEFAULT NULL COMMENT '更新时间',
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	portrait_table_api_info)<1
	then
		INSERT INTO portrait_table_api_info VALUES('88e9964e-75fa-4209-8051-482a277873bb', '4e026be2-a2aa-49f4-af1f-614070906a00', '根据政策获取申报项/事项', '根据政策获取申报项/事项', 0, '', '1', '0', '{\n    "params":{\n        "zcGuid":"30c587a8-9630-475a-b483-ef283488ee7d",\n        "page":0,\n        "pageSize":10\n    }\n}', '{\n  "status": {\n    "code": "1",\n    "text": "请求成功"\n  },\n  "custom": {\n    "total": "3",\n    "entityList": [\n      {\n        "portrait_guid": "e3bdaab1-c98d-4db9-85fe-83987e9a4a3c",\n        "sbxName": "申报项1",\n        "sbxGuid": "1",\n        "taskName": "",\n        "taskId": ""\n      },\n      {\n        "portrait_guid": "1b98028f-8aa0-48aa-901a-2d575f74aeb1",\n        "sbxName": "申报项2",\n        "sbxGuid": "2",\n        "taskName": "",\n        "taskId": ""\n      },\n      {\n        "portrait_guid": null,\n        "sbxName": "申报项3",\n        "sbxGuid": "3",\n        "taskName": "",\n        "taskId": ""\n      }\n    ]\n  }\n}', NULL, '/rest/x360/sbxInfo', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-30 16:51:20.0', '2020-12-30 16:51:20.0');
		INSERT INTO portrait_table_api_info VALUES('7e48cbf4-daaf-4098-86b4-acb831792ad2', '4e026be2-a2aa-49f4-af1f-614070906a00', '根据申报项/事项获取实体', '根据申报项/事项获取实体', 0, '', '1', '0', '{\n    "params":{\n        "portrait_guid":"30c587a8-9630-475a-b483-ef283488ee7d",\n        "page":0,\n        "pageSize":10,\n        "type":1\n    }\n}', '{\n  "status": {\n    "code": "1",\n    "text": "请求成功"\n  },\n  "custom": {\n    "total": "19",\n    "entityList": [\n      {\n        "cardNo": "320582197101020004"\n      },\n      {\n        "cardNo": "320582197101020005"\n      }\n    ]\n  }\n}', NULL, '/rest/x360/sbxMatchService', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-30 16:51:20.0', '2020-12-30 16:51:20.0');
		INSERT INTO portrait_table_api_info VALUES('6a10bdde-e6f0-41e9-9622-d910467d805a', '4e026be2-a2aa-49f4-af1f-614070906a00', '根据实体获取政策、申报项及关联的事项', '根据身份证号/社会信用代码，获取政策、申报项及关联的事项', 0, '', '1', '0', '{\n    "params":{\n        "cardNo":"320582197101020005",\n        "sendType":""\n    }\n}', '{\n  "status": {\n    "code": "1",\n    "text": "请求成功"\n  },\n  "custom": {\n    "entityList": [\n      {\n        "sbxList": [\n          {\n            "sbxName": "申报项3",\n            "sbxGuid": "5e95af0e-f787-44b6-b221-e8b6a5ae92dc",\n            "taskName": "",\n            "taskId": ""\n          },\n          {\n            "sbxName": "申报项1",\n            "sbxGuid": "b6ac1a6e-7a9b-4661-91a0-c64bd101c0ac",\n            "taskName": "",\n            "taskId": ""\n          }\n        ],\n        "zcName": "紧缺人才薪酬补贴资格认定",\n        "zcGuid": "1003"\n      },\n      {\n        "sbxList": [\n          {\n            "sbxName": "22211344",\n            "sbxGuid": "173ce849-c03f-495b-b557-25fb5f85f71c",\n            "taskName": "法律援助审批",\n            "taskId": "ba3d1286-b0ff-4262-bdcd-8d4fd2c59b7d"\n          }\n        ],\n        "zcName": "开办奖励政策",\n        "zcGuid": "0d2f9b38-bcbb-4982-b6b3-9e530f9234bb"\n      }\n    ]\n  }\n}', NULL, '/rest/x360/conformity', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-31 16:51:20.0', '2020-12-31 16:51:20.0');
		INSERT INTO portrait_table_api_info VALUES('f1729630-0b38-4add-9dbb-dde4a6a1a17e', '4e026be2-a2aa-49f4-af1f-614070906a00', '获取实体对象接口', '获取实体对象接口', 0, '', '1', '0', '{\n    "params":{\n        "subAlias":"PEOPLE",\n        "entityGuid":"320582197101020005",\n        "ouGuid":"9579bbf9-31d0-4548-b78f-ea4392bf68f9"\n    }\n}', '{\n  "status": {\n    "code": "1",\n    "text": "请求成功"\n  },\n  "custom": {\n    "entity": {\n      "hh": "10002",\n      "csrq": "1971-01-02 00:00:00",\n      "gj": "中国",\n      "hyzk": "已婚",\n      "dh": "58612345",\n      "gender": "男",\n      "name": "钱青青",\n      "hklb": "农村户口",\n      "rowkey": "320582197101020005",\n      "zzmm": "群众",\n      "mz": "汉族"\n    }\n  }\n}', NULL, '/rest/x360/searchLabel', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-31 16:51:20.0', '2020-12-31 16:51:20.0');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_table_api_request_params' )<1
    then
		CREATE TABLE `portrait_table_api_request_params` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键guid',
		  `serviceGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '服务guid',
		  `paramName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数名称',
		  `position` int(11) DEFAULT NULL COMMENT '0:url 1:header  2:body',
		  `type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数类型',
		  `mustFill` int(11) DEFAULT NULL COMMENT '0:不必填 1:必填',
		  `remark` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '参数说明',
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	portrait_table_api_request_params )<1
    then
    	INSERT INTO portrait_table_api_request_params VALUES('fb922431-9571-459b-b1c1-2734fcd6edbb', '88e9964e-75fa-4209-8051-482a277873bb', 'zcGuid', 3, 'String', 1, '政策唯一标识');
		INSERT INTO portrait_table_api_request_params VALUES('037ab2da-a05c-455a-8fe6-c3b9a026ce13', '88e9964e-75fa-4209-8051-482a277873bb', 'page', 3, 'Integer', 1, '页码');
		INSERT INTO portrait_table_api_request_params VALUES('db7bda5a-ecfb-46c2-9235-2acaf024f89b', '88e9964e-75fa-4209-8051-482a277873bb', 'pageSize', 3, 'Integer', 1, '每页条数');
		INSERT INTO portrait_table_api_request_params VALUES('edf5cbde-bf5d-49a4-ac8f-7225ae74a126', '7e48cbf4-daaf-4098-86b4-acb831792ad2', 'portrait_guid', 3, 'String', 1, '画像唯一标识/事项标识');
		INSERT INTO portrait_table_api_request_params VALUES('2e53ca2f-5aab-473b-802a-5eae735b8203', '7e48cbf4-daaf-4098-86b4-acb831792ad2', 'page', 3, 'Integer', 1, '页码');
		INSERT INTO portrait_table_api_request_params VALUES('9f127eb9-5a86-44bc-9748-76774f55d725', '7e48cbf4-daaf-4098-86b4-acb831792ad2', 'pageSize', 3, 'Integer', 1, '每页条数');
		INSERT INTO portrait_table_api_request_params VALUES('54e006d0-543f-4924-a9fb-da6f6cbd5015', '7e48cbf4-daaf-4098-86b4-acb831792ad2', 'type', 3, 'String', 1, '类型：1标识传入画像唯一标识；2标识传入事项标识');
		INSERT INTO portrait_table_api_request_params VALUES('54d2cd9c-7d1a-4210-8972-1bc44a352e25', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'cardNo', 3, 'String', 1, '主键标识');
		INSERT INTO portrait_table_api_request_params VALUES('0baa6c85-4af1-4d7a-8054-904f0a24354c', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'sendType', 3, 'String', 1, '类型');
		INSERT INTO portrait_table_api_request_params VALUES('a1473e97-ad81-4915-93f4-7d2d0328c622', 'f1729630-0b38-4add-9dbb-dde4a6a1a17e', 'subAlias', 3, 'String', 1, '主体别名');
		INSERT INTO portrait_table_api_request_params VALUES('2bd589a7-e2bf-4837-8a0b-829f7d4abcf4', 'f1729630-0b38-4add-9dbb-dde4a6a1a17e', 'entityGuid', 3, 'String', 1, '主键标识');
		INSERT INTO portrait_table_api_request_params VALUES('3b67cfe0-cc24-4170-ada8-a0730997c995', 'f1729630-0b38-4add-9dbb-dde4a6a1a17e', 'ouGuid', 3, 'String', 1, '部门标识');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_table_api_response_params' )<1
    then
		CREATE TABLE `portrait_table_api_response_params` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键',
		  `serviceGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '服务id',
		  `paramName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '返回参数名称',
		  `type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数类型:String:字符型  Boolean:布尔型  Date:日期型 Integer:整型 Number:数值型  Blob:二进制',
		  `remark` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '参数说明',
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	portrait_table_api_response_params )<1
    then
    	INSERT INTO portrait_table_api_response_params VALUES('e669bd72-55c9-467a-a518-527ec7424d9a', '88e9964e-75fa-4209-8051-482a277873bb', 'portrait_guid', 'String', '画像标识');
		INSERT INTO portrait_table_api_response_params VALUES('a156a23b-ad37-42ea-9781-ebfd08e0ea59', '88e9964e-75fa-4209-8051-482a277873bb', 'sbxName', 'String', '申报项名称');
		INSERT INTO portrait_table_api_response_params VALUES('e55c7aa6-cfb5-4559-9a5f-0aa95cd3547d', '88e9964e-75fa-4209-8051-482a277873bb', 'sbxGuid', 'String', '申报项标识');
		INSERT INTO portrait_table_api_response_params VALUES('bcc5461c-181e-4ccd-a274-d1f868f7c44d', '88e9964e-75fa-4209-8051-482a277873bb', 'taskName', 'String', '事项名称');
		INSERT INTO portrait_table_api_response_params VALUES('fc174da0-d0b6-45f2-9526-a634626dc47a', '88e9964e-75fa-4209-8051-482a277873bb', 'taskId', 'String', '事项标识');
		INSERT INTO portrait_table_api_response_params VALUES('c233563c-8141-4344-a9a6-55025b8456bf', '7e48cbf4-daaf-4098-86b4-acb831792ad2', 'cardNo', 'String', '主键标识');
		INSERT INTO portrait_table_api_response_params VALUES('480855dc-54b7-4c16-ab4f-fc0ef32ca743', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'sbxList', 'String', '申报项列表');
		INSERT INTO portrait_table_api_response_params VALUES('dc286445-e205-4214-b7a2-a07262ab5561', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'sbxName', 'String', '申报项名称');
		INSERT INTO portrait_table_api_response_params VALUES('6200d3b4-898e-4e5b-bdd9-078d50fb84f7', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'sbxGuid', 'String', '申报项标识');
		INSERT INTO portrait_table_api_response_params VALUES('6c733ac1-aed2-48b7-bd88-73c1646c95c3', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'taskName', 'String', '事项名称');
		INSERT INTO portrait_table_api_response_params VALUES('5d3a9823-7b8b-4605-b426-cec24d1a8768', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'taskId', 'String', '事项标识');
		INSERT INTO portrait_table_api_response_params VALUES('4b46abd9-9477-4c9d-bb47-5fe2a9feb7bd', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'zcName', 'String', '政策名称');
		INSERT INTO portrait_table_api_response_params VALUES('bb2f3458-8a2c-4f94-86e9-03b501e8a8e6', '6a10bdde-e6f0-41e9-9622-d910467d805a', 'zcGuid', 'String', '政策标识');
		INSERT INTO portrait_table_api_response_params VALUES('01537857-6859-46e6-86f9-2d33e65a16a3', 'f1729630-0b38-4add-9dbb-dde4a6a1a17e', 'entity', 'String', '实体对象');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_api_category' )<1
    then
		CREATE TABLE `cockpit_api_category` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL,
		  `apicategoryname` varchar(255) COLLATE utf8_bin DEFAULT NULL,
		  `parentGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL,
		  `level` varchar(255) COLLATE utf8_bin DEFAULT NULL,
		  `sort` int(11) DEFAULT NULL,
		  `createDatetime` datetime DEFAULT NULL,
		  `updateDatetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
		  PRIMARY KEY (`rowguid`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	cockpit_api_category WHERE rowguid='4e026be2-a2aa-49f4-af1f-614070906a00')<1
	then
		INSERT INTO cockpit_api_category VALUES('4e026be2-a2aa-49f4-af1f-614070906a00', '平台开放服务', '', '4e026be2-a2aa-49f4-af1f-614070906a00', 0, '2020-12-30 15:37:54.0', '2020-12-30 15:38:17.0');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_api_info' )<1
     then
		CREATE TABLE `cockpit_api_info` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '默认主键字段',
		  `apiCategoryGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT 'api分类guid',
		  `serviceName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '服务名称',
		  `serviceDesc` text COLLATE utf8_bin COMMENT '服务描述',
		  `serviceSource` int(11) DEFAULT NULL COMMENT '服务来源 0:系统服务 1:第三方 2.接口生成',
		  `originalAddress` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '接口源地址',
		  `requestMethod` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '请求方法 0:GET 1:POST 2:GET/POST',
		  `contentType` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '请求内容类型',
		  `requestSample` text COLLATE utf8_bin COMMENT '请求示例',
		  `responseSample` text COLLATE utf8_bin COMMENT '响应实例',
		  `gatewayServiceId` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '网关服务id',
		  `gatewayServicePath` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '网关服务路径',
		  `gatewayServiceState` int(11) DEFAULT '0' COMMENT '网关服务状态 :0:未注册 1:已注册 2:已发布 3已下线',
		  `gatewayproxyaccessurl` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT 'API网关代理访问地址',
		  `product_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `plan_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `backend_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `operation_id` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT 'APIG网关预留字段',
		  `createDatetime` datetime DEFAULT NULL COMMENT '创建时间',
		  `updateDatetime` datetime DEFAULT NULL COMMENT '更新时间',
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	cockpit_api_info )<1
    then
    	INSERT INTO cockpit_api_info VALUES('d4c02ddc-e36c-4bcd-a489-e7375eb7fb65', '4e026be2-a2aa-49f4-af1f-614070906a00', '获取目标指标数据', '指标数据查询通用接口', 0, '', '1', '0', '{\n    "params":{\n        "normGuid":"6f2ca1f5-1274-484d-98f9-a8e5ac8d3004",\n        "userGuid":"45f0c5f9-cad2-49e6-887d-b38dfcbc23de",\n        "type":"1",\n        "kylinParams":[],\n        "kylinCondition":[]\n    }\n}', '{\n  "status": {\n    "code": "1",\n    "text": "请求成功"\n  },\n  "custom": {\n    "hasTimeWindow": "0",\n    "normName": "预警指标测试",\n    "cockpitData": "13",\n    "cockpitType": "1"\n  }\n}', NULL, '/rest/cockpit/getNormData', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-30 16:51:20.0', '2020-12-30 16:51:20.0');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_api_request_params' )<1
    then
		CREATE TABLE `cockpit_api_request_params` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键guid',
		  `serviceGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '服务guid',
		  `paramName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数名称',
		  `position` int(11) DEFAULT NULL COMMENT '0:url 1:header  2:body',
		  `type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数类型',
		  `mustFill` int(11) DEFAULT NULL COMMENT '0:不必填 1:必填',
		  `remark` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '参数说明',
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	cockpit_api_request_params )<1
    then
    	INSERT INTO cockpit_api_request_params VALUES('d4d0de8e-8eeb-4cbe-b5bc-3daae6bbc98e', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'normGuid', 3, 'String', 1, '指标标识');
		INSERT INTO cockpit_api_request_params VALUES('0980c30f-b275-44a6-9a22-af4c19b26d50', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'userGuid', 3, 'String', 1, '用户标识');
		INSERT INTO cockpit_api_request_params VALUES('3ac52470-4d17-4796-91a9-39238cd1c840', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'type', 3, 'String', 0, '请求类别');
		INSERT INTO cockpit_api_request_params VALUES('53065710-5fc9-469a-ac32-dda391727fa7', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'kylinParams', 3, 'String', 1, 'kylin查询参数');
		INSERT INTO cockpit_api_request_params VALUES('41ef614c-3564-48a0-bc6d-77b85783d832', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'kylinCondition', 3, 'String', 1, 'kylin自定义查询条件');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_api_response_params' )<1
     then
		CREATE TABLE `cockpit_api_response_params` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键',
		  `serviceGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '服务id',
		  `paramName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '返回参数名称',
		  `type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数类型:String:字符型  Boolean:布尔型  Date:日期型 Integer:整型 Number:数值型  Blob:二进制',
		  `remark` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '参数说明',
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	cockpit_api_response_params )<1
    then
    	INSERT INTO cockpit_api_response_params VALUES('ea19efde-5c8d-4d0b-8cc6-517d69be1acb', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'hasTimeWindow', 'String', '是否有时间窗口');
		INSERT INTO cockpit_api_response_params VALUES('b5723a20-e2f7-44ec-948c-ec527c7f236d', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'normName', 'String', '指标名称');
		INSERT INTO cockpit_api_response_params VALUES('e25364d8-0d02-4317-82bb-5cc3a782adf0', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'cockpitData', 'String', '指标结果');
		INSERT INTO cockpit_api_response_params VALUES('22ee78d7-aff3-41eb-942b-8ebaf5af5c1f', 'd4c02ddc-e36c-4bcd-a489-e7375eb7fb65', 'cockpitType', 'String', '指标类型');
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO