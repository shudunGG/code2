drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_manage_api_category' )<1
     then
		CREATE TABLE `portrait_manage_api_category` (
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
	if  (SELECT count( 1 ) FROM	portrait_manage_api_category WHERE rowguid='4e026be2-a2aa-49f4-af1f-614070906a00')<1
	then
		INSERT INTO portrait_manage_api_category VALUES('4e026be2-a2aa-49f4-af1f-614070906a00', '平台开放服务', '', '4e026be2-a2aa-49f4-af1f-614070906a00', 0, '2020-12-14 15:37:54.0', '2020-12-14 15:38:17.0');
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_manage_api_info' )<1
     then
		CREATE TABLE `portrait_manage_api_info` (
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
	if  (SELECT count( 1 ) FROM	portrait_manage_api_info)<1
	then
		INSERT INTO portrait_manage_api_info VALUES('14317401-b2ae-4a4b-a044-e4c6cc92ca97', '4e026be2-a2aa-49f4-af1f-614070906a00', '获取个体详情', '根据个体标识、主体别名和点的数据获取个体详情', 0, '', '1', '0', 'id=11&mainId=CAR&depart=30d80410-7daf-47d7-a242-369d72b8a3cd&body={"CAR_cartype":[{"id":"1l8-38g-29dx","value":"小汽车"}],"CAR_vguid":[{"id":"170-38g-2a6d","value":"11"}],"CAR_carno":[{"id":"1zg-38g-28lh","value":"苏EJH628"}]}', '{\n    "custom":{\n        "info":[\n            {\n                "title":"汽车类别",\n                "value":"小汽车"\n            },\n            {\n                "title":"车牌号",\n                "value":"苏EJH628"\n            },\n            {\n                "title":"标识",\n                "value":"11"\n            }\n        ]\n    }\n}', NULL, '/rest/relationserver/getDetail', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-14 17:17:51.0', '2020-12-14 17:17:51.0');
INSERT INTO portrait_manage_api_info VALUES('0da48355-c9fd-43c1-9cce-36efbb174cc4', '4e026be2-a2aa-49f4-af1f-614070906a00', '探索关系', '根据个体标识和主体别名查询关系', 0, '', '1', '0', 'id=11&mainId=CAR&depart=30d80410-7daf-47d7-a242-369d72b8a3cd&filterId=拥有', '{\n    "custom":{\n        "list":[\n            {\n                "children":[\n                    {\n                        "name":"张磊",\n                        "icon":1,\n                        "noExpand":false,\n                        "links":[\n                            {\n                                "link":"拥有",\n                                "descript":"拥有",\n                                "direction":"0"\n                            }\n                        ],\n                        "id":"320882199405263034",\n                        "mainId":"PERSON",\n                        "nodeType":"",\n                        "body":{\n                            "PERSON_name":[\n                                {\n                                    "id":"6q7-9ko-35x",\n                                    "value":"张磊"\n                                }\n                            ],\n                            "PERSON_birthday":[\n                                {\n                                    "id":"74f-9ko-1l1",\n                                    "value":"1987-08-02 00:00:00"\n                                }\n                            ],\n                            "PERSON_vguid":[\n                                {\n                                    "id":"7in-9ko-2dh",\n                                    "value":"320882199405263034"\n                                }\n                            ],\n                            "PERSON_registeraddress":[\n                                {\n                                    "id":"7wv-9ko-4qt",\n                                    "value":"锦丰镇时村镇蒲庄村西湾东组71号"\n                                }\n                            ],\n                            "PERSON_sex":[\n                                {\n                                    "id":"8b3-9ko-5j9",\n                                    "value":"男性"\n                                }\n                            ]\n                        }\n                    }\n                ],\n                "name":"人",\n                "sum":1,\n                "id":"PERSON"\n            }\n        ]\n    }\n}', NULL, '/rest/relationserver/exploreData', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-14 17:02:13.0', '2020-12-14 17:02:13.0');
INSERT INTO portrait_manage_api_info VALUES('12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', '4e026be2-a2aa-49f4-af1f-614070906a00', '查询个体列表', '根据条件查询个体列表', 0, '', '1', '0', 'key=徐&depart=30d80410-7daf-47d7-a242-369d72b8a3cd&filter=拥有', '{\n    "custom":{\n        "list":[\n            {\n                "children":[\n                    {\n                        "name":"徐恩保",\n                        "icon":1,\n                        "id":"320882194908184612",\n                        "mainId":"PERSON",\n                        "body":{\n                            "PERSON_name":[\n                                {\n                                    "id":"3yj-6e0-35x",\n                                    "value":"徐恩保"\n                                }\n                            ],\n                            "PERSON_birthday":[\n                                {\n                                    "id":"4cr-6e0-1l1",\n                                    "value":"1988-09-02 00:00:00"\n                                }\n                            ],\n                            "PERSON_vguid":[\n                                {\n                                    "id":"4qz-6e0-2dh",\n                                    "value":"320882194908184612"\n                                }\n                            ],\n                            "PERSON_registeraddress":[\n                                {\n                                    "id":"557-6e0-4qt",\n                                    "value":"常阴沙余圩办事处孙庄村万庄组10号"\n                                }\n                            ],\n                            "PERSON_sex":[\n                                {\n                                    "id":"5jf-6e0-5j9",\n                                    "value":"男性"\n                                }\n                            ]\n                        }\n                    },\n                    {\n                        "name":"徐成",\n                        "icon":1,\n                        "id":"320281199508233775",\n                        "mainId":"PERSON",\n                        "body":{\n                            "PERSON_name":[\n                                {\n                                    "id":"1crxtt-oe39k-35x",\n                                    "value":"徐成"\n                                }\n                            ],\n                            "PERSON_birthday":[\n                                {\n                                    "id":"1cry81-oe39k-1l1",\n                                    "value":"1995-08-23 00:00:00"\n                                }\n                            ],\n                            "PERSON_vguid":[\n                                {\n                                    "id":"1crym9-oe39k-2dh",\n                                    "value":"320281199508233775"\n                                }\n                            ],\n                            "PERSON_registeraddress":[\n                                {\n                                    "id":"1crz0h-oe39k-4qt",\n                                    "value":"塘桥镇华士镇华西二村西区377号201室"\n                                }\n                            ],\n                            "PERSON_sex":[\n                                {\n                                    "id":"1crzep-oe39k-5j9",\n                                    "value":"男性"\n                                }\n                            ]\n                        }\n                    }\n                ],\n                "name":"人",\n                "sum":3,\n                "id":"PERSON"\n            },\n            {\n                "children":[],\n                "name":"车",\n                "sum":0,\n                "id":"CAR"\n            }\n        ]\n    }\n}', NULL, '/rest/relationserver/searchData', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-14 16:51:20.0', '2020-12-14 16:51:20.0');
INSERT INTO portrait_manage_api_info VALUES('1a44a576-9c71-4d7d-a6c8-4abfdba500d6', '4e026be2-a2aa-49f4-af1f-614070906a00', '查询过滤条件', '查询过滤条件', 0, '', '1', '0', NULL, '{\n    "custom":{\n        "data":[\n            {\n                "id":"拥有",\n                "value":"拥有"\n            }\n        ]\n    }\n}', NULL, '/rest/relationserver/getFilter', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-14 16:01:45.0', '2020-12-14 16:01:45.0');
INSERT INTO portrait_manage_api_info VALUES('2a5050dc-823a-4468-b186-850a777362f8', '4e026be2-a2aa-49f4-af1f-614070906a00', '查询图库列表', '查询所有的图库列表', 0, '', '1', '0', NULL, '{\n    "custom":{\n        "data":[\n            {\n                "id":"30d80410-7daf-47d7-a242-369d72b8a3cd",\n                "value":"人车关系"\n            }\n        ]\n    }\n}', NULL, '/rest/relationserver/getDepart', 0, NULL, NULL, NULL, NULL, NULL, '2020-12-14 15:18:33.0', '2020-12-14 15:18:33.0');	
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_manage_api_request_params' )<1
     then
		CREATE TABLE `portrait_manage_api_request_params` (
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
	if  (SELECT count( 1 ) FROM	portrait_manage_api_request_params)<1
    then
    	INSERT INTO portrait_manage_api_request_params VALUES('0071e272-93fc-4d9c-baa5-8909672e548e', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'filter', 3, 'String', 0, '图库关系');
		INSERT INTO portrait_manage_api_request_params VALUES('0370025c-26ec-4a31-a57c-7dd6025f5928', '0da48355-c9fd-43c1-9cce-36efbb174cc4', 'id', 3, 'String', 0, '个体标识');
		INSERT INTO portrait_manage_api_request_params VALUES('1a738b82-2267-4676-bcc7-234bc7ba76db', '0da48355-c9fd-43c1-9cce-36efbb174cc4', 'depart', 3, 'String', 0, '图库标识');
		INSERT INTO portrait_manage_api_request_params VALUES('23910072-8ac3-4b9d-900a-5634a52f8741', '14317401-b2ae-4a4b-a044-e4c6cc92ca97', 'mainId', 3, 'String', 0, '主体别名');
		INSERT INTO portrait_manage_api_request_params VALUES('4509ca3b-75bd-4bd5-af35-476aba0c4196', '0da48355-c9fd-43c1-9cce-36efbb174cc4', 'mainId', 3, 'String', 0, '主体别名');
		INSERT INTO portrait_manage_api_request_params VALUES('63eab881-f6a9-49e9-b873-a2b52075d46c', '14317401-b2ae-4a4b-a044-e4c6cc92ca97', 'id', 3, 'String', 0, '个体标识');
		INSERT INTO portrait_manage_api_request_params VALUES('7d0251b1-5af2-4c1d-9638-e9ddcdebb19c', '14317401-b2ae-4a4b-a044-e4c6cc92ca97', 'depart', 3, 'String', 0, '图库标识');
		INSERT INTO portrait_manage_api_request_params VALUES('8d956b26-5b1a-4633-996e-15ef5ab58eec', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'depart', 3, 'String', 0, '图库标识');
		INSERT INTO portrait_manage_api_request_params VALUES('d6b1b742-2e4f-49f8-bef7-077d5c5bda18', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'key', 3, 'String', 0, '关键字');
		INSERT INTO portrait_manage_api_request_params VALUES('d887f35f-57b1-43d9-a224-118666f774e4', '0da48355-c9fd-43c1-9cce-36efbb174cc4', 'filterId', 3, 'String', 0, '图库关系');
		INSERT INTO portrait_manage_api_request_params VALUES('fdf53a53-c2f8-4e54-9f75-546280bd87c0', '14317401-b2ae-4a4b-a044-e4c6cc92ca97', 'body', 3, 'String', 0, '点的数据');
    end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'portrait_manage_api_response_params' )<1
     then
		CREATE TABLE `portrait_manage_api_response_params` (
		  `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键',
		  `serviceGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '服务id',
		  `paramName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '返回参数名称',
		  `type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数类型:String:字符型  Boolean:布尔型  Date:日期型 Integer:整型 Number:数值型  Blob:二进制',
		  `remark` varchar(4000) COLLATE utf8_bin DEFAULT NULL COMMENT '参数说明',
		  PRIMARY KEY (`rowguid`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
	end if;
	if  (SELECT count( 1 ) FROM	portrait_manage_api_response_params)<1
     then
		INSERT INTO portrait_manage_api_response_params VALUES('11d2aec5-02d9-48ae-aaaa-ea8b8850345f', '1a44a576-9c71-4d7d-a6c8-4abfdba500d6', 'id', 'String', '图库关系名称');
		INSERT INTO portrait_manage_api_response_params VALUES('1283562c-6a38-45d0-a35a-821c1ce30b0d', '2a5050dc-823a-4468-b186-850a777362f8', 'value', 'String', '图库名称');
		INSERT INTO portrait_manage_api_response_params VALUES('2b09826d-d73b-4483-b004-467d90535895', '2a5050dc-823a-4468-b186-850a777362f8', 'id', 'String', '图库主键');
		INSERT INTO portrait_manage_api_response_params VALUES('49c0d630-cf71-4220-be2b-11b951475774', '14317401-b2ae-4a4b-a044-e4c6cc92ca97', 'value', 'String', '标签值');
		INSERT INTO portrait_manage_api_response_params VALUES('705e6bd1-28f5-4d6e-92b3-f46dbd214f7e', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'list', 'String', '主体列表');
		INSERT INTO portrait_manage_api_response_params VALUES('8aa3d4b3-0ef8-40a9-b20b-4eec51a37e71', '0da48355-c9fd-43c1-9cce-36efbb174cc4', 'children', 'String', '个体列表');
		INSERT INTO portrait_manage_api_response_params VALUES('8df73253-3eb5-4c85-a7b8-447b6a4b3b21', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'name', 'String', '主体名称');
		INSERT INTO portrait_manage_api_response_params VALUES('98886736-6800-4564-8a80-83ae5d761590', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'children', 'String', '个体列表');
		INSERT INTO portrait_manage_api_response_params VALUES('9e7ef7b2-137e-4069-90a7-88aef64b85ab', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'id', 'String', '主体别名');
		INSERT INTO portrait_manage_api_response_params VALUES('a54d95d5-bf2c-49a6-9fc6-a3c1d1a9dd52', '12d963f0-d4ad-47da-92c4-ac23d3ddbcb4', 'sum', 'String', '个体总数');
		INSERT INTO portrait_manage_api_response_params VALUES('c0aa74af-595a-462c-9b43-06a69c0c4508', '0da48355-c9fd-43c1-9cce-36efbb174cc4', 'list', 'String', '主体列表');
		INSERT INTO portrait_manage_api_response_params VALUES('d198a05b-efbf-4174-9bb1-11c7c508c463', '1a44a576-9c71-4d7d-a6c8-4abfdba500d6', 'value', 'String', '图库关系名称');
		INSERT INTO portrait_manage_api_response_params VALUES('e63b8055-fde7-494a-a4ab-93e0fdb5d967', '14317401-b2ae-4a4b-a044-e4c6cc92ca97', 'title', 'String', '标签名称');
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO