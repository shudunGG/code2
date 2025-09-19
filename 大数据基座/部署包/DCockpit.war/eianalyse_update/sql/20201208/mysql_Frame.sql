drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='c14fa968-927d-48d7-8500-55afaf90b7e0')>0
	then 
		update portrait_tags_api_info set responseSample='返回参数\n{\n	"custom": [{\n		"name": "主体名称",\n		"alias": "主体别名",\n		"index": "全文检索索引名称",\n		"rowguid":"0d313f87-a264-4f48-b176-e18a0b34b7cf"\n	}],\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n返回成功示例\n{\n  "custom": [\n    {\n      "name": "主体测试",\n      "alias": "ZTCS",\n      "index": "049",\n      "rowguid": "072f4a40-4176-4f4d-a7fc-9ca4dcd6a735"\n    },\n    {\n      "name": "处室",\n      "alias": "INNEROU",\n      "index": "051",\n      "rowguid": "3f0ecf95-0eb1-4f6f-8cd2-bad9f382ba0e"\n    },\n    {\n      "name": "职责",\n      "alias": "RESPONSIBILITY",\n      "index": "052",\n      "rowguid": "803f6b75-6119-4413-8080-9675cd99868b"\n    },\n    {\n      "name": "厅局",\n      "alias": "DEPART",\n      "index": "054",\n      "rowguid": "86270bd2-5ac4-4d07-a5e7-8091f02716f7"\n    },\n    {\n      "name": "企业",\n      "alias": "COMPANY",\n      "index": "077",\n      "rowguid": "171e582a-ba60-46cc-93d1-d4b9ed2c0fe9"\n    }\n  ],\n  "status": {\n    "code": "000000",\n    "text": "请求成功"\n  }\n}\n\n返回失败示例\n{\n	"custom": "",\n	"status": {\n		"code": "000030",\n		"text": "服务内部错误!"\n	}\n}' where rowguid='c14fa968-927d-48d7-8500-55afaf90b7e0';
	end if;
	
    if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='4900f9df-8b87-4ecf-939b-4bcce00f00df')<1
	then
		INSERT INTO `portrait_tags_api_response_params` VALUES ('4900f9df-8b87-4ecf-939b-4bcce00f00df', 'c14fa968-927d-48d7-8500-55afaf90b7e0', 'rowguid', 'String', '主体标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='cdb8edcc-5f72-4464-a7cb-c94200d491ba')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('cdb8edcc-5f72-4464-a7cb-c94200d491ba', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'fs', 'String', '是否全文检索:1:是,其他:否');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='42b93988-5f77-44e7-bf09-01ff15370375')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('42b93988-5f77-44e7-bf09-01ff15370375', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'alias', 'String', '标签别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='6a98534c-1957-44af-8cb6-07d511d41b35')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('6a98534c-1957-44af-8cb6-07d511d41b35', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'cs', 'String', '筛选条件');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='3aac3638-35d9-415f-9cab-633b79bd3fca')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('3aac3638-35d9-415f-9cab-633b79bd3fca', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'ss', 'String', '是否多值');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='a1b51aff-c302-41c4-8a29-36d642879cd2')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('a1b51aff-c302-41c4-8a29-36d642879cd2', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'name', 'String', '标签名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='fff23377-c49d-463c-b002-090cbe58ffc7')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('fff23377-c49d-463c-b002-090cbe58ffc7', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'searchField', 'String', '查询字段');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='9ad7a95d-1314-4341-b772-c8b89b474b9d')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('9ad7a95d-1314-4341-b772-c8b89b474b9d', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'codevalues', 'String', '关联代码项');
	end if;

	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='500e1473-25ec-4332-8fa2-23cbf9ff3c6a')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('500e1473-25ec-4332-8fa2-23cbf9ff3c6a', '8a378cda-8e3e-46bc-82bc-b97c98149961', 'name', 'String', '画像名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='4ffe10bf-0eac-4175-bd12-37238c2a692b')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('4ffe10bf-0eac-4175-bd12-37238c2a692b', '8a378cda-8e3e-46bc-82bc-b97c98149961', 'alias', 'String', '画像别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='fc8f0e0b-551d-4c04-ad48-c00d4f825e3b')>0
	then 
		update portrait_tags_api_info set responseSample='返回参数:\n{\n	"custom": {\n		"标签分类": [{\n			"name": "标签名称",\n			"alias": "标签别名",\n			"value": "标签值",\n			"cs":"筛选条件",\n			"fs":"是否全文检索:1:是,其他:否"\n		}]\n]\n	},\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n\n返回成功描述\n{\n	"custom": {\n		"学历职称": [{\n			"name": "文化程度",\n			"alias": "WHCD",\n			"value": "博士后",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"外貌特征": [{\n			"name": "发色",\n			"alias": "FAX",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "身高",\n			"alias": "SHENGGAO",\n			"value": "175厘米以上",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "体型",\n			"alias": "TX",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"通讯信息": [{\n			"name": "Email",\n			"alias": "EMAIL",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "QQ",\n			"alias": "QQ",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "手机",\n			"alias": "SHOUJI",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"身份属性": [{\n			"name": "身份",\n			"alias": "SHENFEN",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"自然属性": [{\n			"name": "民族",\n			"alias": "MZ",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"前科劣迹": [{\n			"name": "侵财",\n			"alias": "QINGCAI",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"持有证件": [{\n			"name": "证件种类",\n			"alias": "ZZZLEI",\n			"value": "居住证",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"宗教信仰": [{\n			"name": "宗教信仰",\n			"alias": "ZJXY",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"基本信息": [{\n			"name": "身份证标签",\n			"alias": "ROWGUID",\n			"value": "320582193409230881",\n			"cs": "0",\n			"fs": "0"\n		}, {\n			"name": "姓名",\n			"alias": "XM",\n			"value": "王锦黛",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"职业特点": [{\n			"name": "职业",\n			"alias": "ZHIYE",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"地址信息": [{\n			"name": "户籍地址",\n			"alias": "HUJIDZ",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "现住址",\n			"alias": "XZZ",\n			"value": "江苏省张家港市大港纬四街99号-13-6",\n			"cs": "0",\n			"fs": "1"\n		}]\n	},\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n\n返回失败描述\n\n  {\n	"custom": "",\n	"status": {\n		"code": "000010",\n		"text": "参数错误!"\n	}\n}' where rowguid='fc8f0e0b-551d-4c04-ad48-c00d4f825e3b';
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='6aded348-a5e1-49b6-b295-856eebecf4c6')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('6aded348-a5e1-49b6-b295-856eebecf4c6', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'fs', 'String', '是否全文检索:1:是,其他:否');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='5b6c3695-3559-4834-9bf0-9f9e02d72f0e')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('5b6c3695-3559-4834-9bf0-9f9e02d72f0e', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'alias', 'String', '标签别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='3055cbb3-45d9-4959-b8bc-37355a3f51f4')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('3055cbb3-45d9-4959-b8bc-37355a3f51f4', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'cs', 'String', '筛选条件');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='312bace3-2b5d-472b-a361-253ab088ddc2')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('312bace3-2b5d-472b-a361-253ab088ddc2', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'value', 'String', '标签值');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='d3f7f62c-d81f-4158-a6da-b401cfe02594')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('d3f7f62c-d81f-4158-a6da-b401cfe02594', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'name', 'String', '标签名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='b9d2afca-4702-492c-940b-160234780906')<1
	then
		INSERT INTO `portrait_tags_api_info` VALUES ('b9d2afca-4702-492c-940b-160234780906', '4e026be2-a2aa-49f4-af1f-614070906a00', '查询个体列表服务', '根据多个个体标识查询个体层级结构和标签值列表', 0, '', '1', '0', '{\n	\"params\": {\n		\"subAlias\": \"TESTP\",\n		\"entityGuid\": \"320582193409230881\",\n                \"ouGuid\": \"9579bbf9-31d0-4548-b781f-ea4392bf68\"\n	}\n}', '返回参数:\n{\n	"custom": {\n		"标签分类": [{\n			"name": "标签名称",\n			"alias": "标签别名",\n			"value": "标签值",\n			"cs":"筛选条件",\n			"fs":"是否全文检索:1:是,其他:否"\n		}]\n]\n	},\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n\n返回成功描述\n{\n	"custom": [\n	{\n		"学历职称": [{\n			"name": "文化程度",\n			"alias": "WHCD",\n			"value": "博士后",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"外貌特征": [{\n			"name": "发色",\n			"alias": "FAX",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "身高",\n			"alias": "SHENGGAO",\n			"value": "175厘米以上",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "体型",\n			"alias": "TX",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"通讯信息": [{\n			"name": "Email",\n			"alias": "EMAIL",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "QQ",\n			"alias": "QQ",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "手机",\n			"alias": "SHOUJI",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"身份属性": [{\n			"name": "身份",\n			"alias": "SHENFEN",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"自然属性": [{\n			"name": "民族",\n			"alias": "MZ",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"前科劣迹": [{\n			"name": "侵财",\n			"alias": "QINGCAI",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"持有证件": [{\n			"name": "证件种类",\n			"alias": "ZZZLEI",\n			"value": "居住证",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"宗教信仰": [{\n			"name": "宗教信仰",\n			"alias": "ZJXY",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"基本信息": [{\n			"name": "身份证标签",\n			"alias": "ROWGUID",\n			"value": "320582193409230881",\n			"cs": "0",\n			"fs": "0"\n		}, {\n			"name": "姓名",\n			"alias": "XM",\n			"value": "王锦黛",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"职业特点": [{\n			"name": "职业",\n			"alias": "ZHIYE",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}],\n		"地址信息": [{\n			"name": "户籍地址",\n			"alias": "HUJIDZ",\n			"value": "",\n			"cs": "0",\n			"fs": "1"\n		}, {\n			"name": "现住址",\n			"alias": "XZZ",\n			"value": "江苏省张家港市大港纬四街99号-13-6",\n			"cs": "0",\n			"fs": "1"\n		}]\n	}\n	],\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n\n返回失败描述\n\n  {\n	"custom": "",\n	"status": {\n		"code": "000010",\n		"text": "参数错误!"\n	}\n}', '', '/rest/portrait/searchLabelList', 0, '', NULL, NULL, NULL, NULL, '2020-12-08 11:32:53', '2020-12-08 20:44:24');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='6d782b23-513c-4cc2-8ac2-8295011bc522')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('6d782b23-513c-4cc2-8ac2-8295011bc522', 'b9d2afca-4702-492c-940b-160234780906', 'ouGuid', 3, 'String', 1, '部门ouguid,部门唯一标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='47c71b59-5b37-4fb1-835c-c7624ae69554')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('47c71b59-5b37-4fb1-835c-c7624ae69554', 'b9d2afca-4702-492c-940b-160234780906', 'subAlias', 3, 'String', 1, '主体别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='e4066e92-ebb2-456b-baaa-202b4790752e')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('e4066e92-ebb2-456b-baaa-202b4790752e', 'b9d2afca-4702-492c-940b-160234780906', 'entityGuid', 3, 'String', 1, '个体标识列表，多个标识以‘,’分开');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='a14b0979-f6ce-4c85-9083-ee664c549311')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('a14b0979-f6ce-4c85-9083-ee664c549311', 'b9d2afca-4702-492c-940b-160234780906', 'fs', 'String', '是否全文检索:1:是,其他:否');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='e02ff3fe-d33b-4a76-a998-29043480efd6')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('e02ff3fe-d33b-4a76-a998-29043480efd6', 'b9d2afca-4702-492c-940b-160234780906', 'alias', 'String', '标签别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='08849344-d4d3-4205-958b-db2ea3e22489')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('08849344-d4d3-4205-958b-db2ea3e22489', 'b9d2afca-4702-492c-940b-160234780906', 'cs', 'String', '筛选条件');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='25e98ff1-f0e7-4466-800f-d1c1d228e543')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('25e98ff1-f0e7-4466-800f-d1c1d228e543', 'b9d2afca-4702-492c-940b-160234780906', 'value', 'String', '标签值');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='e6a559a6-8878-4257-a350-fb6d8989ea4a')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('e6a559a6-8878-4257-a350-fb6d8989ea4a', 'b9d2afca-4702-492c-940b-160234780906', 'name', 'String', '标签名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='3d5fe618-87a9-4d94-9d3b-5a7b090eeb9c')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('3d5fe618-87a9-4d94-9d3b-5a7b090eeb9c', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'tagname', 'String', '标签名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='b4420a57-a286-4fb0-a177-7be5e0a486c5')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('b4420a57-a286-4fb0-a177-7be5e0a486c5', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'subalias', 'String', '主体别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='dc21093a-b3ad-45b3-a557-9929b0e411c1')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('dc21093a-b3ad-45b3-a557-9929b0e411c1', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'subname', 'String', '主体名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='94badf22-e410-46ba-b504-f41c60b31726')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('94badf22-e410-46ba-b504-f41c60b31726', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'tagalias', 'String', '标签别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='18792fc3-aafd-45a2-a557-c61cbdc0c03d')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('18792fc3-aafd-45a2-a557-c61cbdc0c03d', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'guidname', 'String', '标签名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='fe7688d5-3151-41db-b170-b18eade96374')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('fe7688d5-3151-41db-b170-b18eade96374', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'codevalues', 'String', '关联代码项');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='cba15e49-57b5-486c-9691-826ac1a4d62b')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('cba15e49-57b5-486c-9691-826ac1a4d62b', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'typename', 'String', '标签分类名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='deea29be-2f55-4fc2-89c5-9a0e5cc7b8e4')<1
	then
		INSERT INTO `portrait_tags_api_info` VALUES ('deea29be-2f55-4fc2-89c5-9a0e5cc7b8e4', '4e026be2-a2aa-49f4-af1f-614070906a00', '删除自定义标签值', '删除自定义标签值', 0, '', '1', '0', '{\n	\"params\": {\n				\"subAlias\": \"JSU_PERSON\",\n				\"rowGuid\": \"320158199410090589\",\n				\"ouGuid\": \"9579bbf9-31d0-4548-b781f-ea4392bf68\"\n				\"tagAlias\": [\n					\"name\",\"zyq123\"\n				]\n			}\n}', '返回成功描述\n{\n	\"custom\": \"success\",\n	\"status\": {\n		\"code\": \"000000\",\n		\"text\": \"请求成功\"\n	}\n}\n\n返回失败描述\n\n  {\n	\"custom\": \"\",\n	\"status\": {\n		\"code\": \"000010\",\n		\"text\": \"参数错误!\"\n	}\n}', '', '/rest/portrait/delCustomTags', 0, '', NULL, NULL, NULL, NULL, '2020-12-09 08:08:09', '2020-12-09 09:50:26');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='a8b1f2a2-8edc-4395-b4f4-49f27a3d4e3a')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('a8b1f2a2-8edc-4395-b4f4-49f27a3d4e3a', 'deea29be-2f55-4fc2-89c5-9a0e5cc7b8e4', 'ouGuid', 3, 'String', 1, '部门标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='4d3d56fd-5e90-4fa9-959e-fde03825dafa')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('4d3d56fd-5e90-4fa9-959e-fde03825dafa', 'deea29be-2f55-4fc2-89c5-9a0e5cc7b8e4', 'tagAlias', 3, 'String', 1, '标签别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='f5edbcf9-7882-49e5-a409-50232429c644')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('f5edbcf9-7882-49e5-a409-50232429c644', 'deea29be-2f55-4fc2-89c5-9a0e5cc7b8e4', 'subAlias', 3, 'String', 1, '主体别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='891aa156-f8eb-41c7-a54a-26661c99e40e')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('891aa156-f8eb-41c7-a54a-26661c99e40e', 'deea29be-2f55-4fc2-89c5-9a0e5cc7b8e4', 'rowGuid', 3, 'String', 1, '主体标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='00b1be30-bcad-469e-b114-cf9fde4bef73')<1
	then
		INSERT INTO `portrait_tags_api_info` VALUES ('00b1be30-bcad-469e-b114-cf9fde4bef73', '4e026be2-a2aa-49f4-af1f-614070906a00', '全文检索多标签多值联合查询', '全文检索接口，多标签多值联合查询', 0, '', '1', '0', '{\n    \"params\": {\n        \"wd\": \"王\",\n        \"subAlias\": \"JSU_PERSON\",\n        \"pageNum\": 1,\n        \"pageSize\": 2,\n        \"tags\": {\n            \"alias\": \"name\",\n            \"values\": \"王以,王哲\"\n        },\n      \"ouGuid\": \"19579bbf9-31d0-4548-b781f-ea4392\"\n    }\n}', '返回参数\n{\n	\"custom\": {\n		\"result\":个体业务数据,\n		\"count\": 10000\n	},\n	\"status\": {\n		\"code\": \"000000\",\n		\"text\": \"请求成功\"\n	}\n}\n返回成功描述\n{\n	\"custom\": {\n		\"result\": [{\n			\"SHENGGAO\": \"160~165厘米\",\n			\"ZZZLEI\": \"学位证\",\n			\"subAlias\": \"R_BIGDATA\",\n			\"XM\": \"王以\",\n			\"XZZ\": \"江苏省张家港市阳信路121号-12-8\",\n			\"WHCD\": \"小学      \",\n			\"ROWGUID\": \"320582198910038749\"\n		}, {\n			\"SHENGGAO\": \"160~165厘米\",\n			\"ZZZLEI\": \"党员证\",\n			\"subAlias\": \"R_BIGDATA\",\n			\"XM\": \"王哲\",\n			\"XZZ\": \"江苏省张家港市澄海一路48号-6-2\",\n			\"WHCD\": \"博士      \",\n			\"ROWGUID\": \"320582198910044145\"\n		}],\n		\"count\": 10000\n	},\n	\"status\": {\n		\"code\": \"000000\",\n		\"text\": \"请求成功\"\n	}\n}\n\n返回失败描述\n\n  {\n	\"custom\": \"\",\n	\"status\": {\n		\"code\": \"000010\",\n		\"text\": \"参数错误!\"\n	}\n}', '', '/rest/portrait/searchNodeByMutiCondition', 0, '', NULL, NULL, NULL, NULL, '2020-12-09 08:08:09', '2020-12-09 09:50:26');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='6e8a7b6d-30e9-483b-9a6b-b18733d2e489')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('6e8a7b6d-30e9-483b-9a6b-b18733d2e489', '00b1be30-bcad-469e-b114-cf9fde4bef73', 'pageNum', 3, 'Integer', 1, '页码');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='ed42c082-bca3-4528-8591-a8d53a10f9f0')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('ed42c082-bca3-4528-8591-a8d53a10f9f0', '00b1be30-bcad-469e-b114-cf9fde4bef73', 'wd', 3, 'String', 0, '查询关键字');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='3d0d3f5e-98ac-4ad3-b154-85865887ca14')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('3d0d3f5e-98ac-4ad3-b154-85865887ca14', '00b1be30-bcad-469e-b114-cf9fde4bef73', 'pageSize', 3, 'Integer', 1, '每页数量');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='45ef0e4e-9a17-4c72-9df7-7e4bd7314df2')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('45ef0e4e-9a17-4c72-9df7-7e4bd7314df2', '00b1be30-bcad-469e-b114-cf9fde4bef73', 'tags', 3, 'String', 0, '标签值列表');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='0cb15c95-0d5a-4248-bc3f-dfe72ad6ca43')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('0cb15c95-0d5a-4248-bc3f-dfe72ad6ca43', '00b1be30-bcad-469e-b114-cf9fde4bef73', 'ouGuid', 3, 'String', 1, '部门标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='dfd0a728-c40e-4fa2-a8f5-90d78bc70d23')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('dfd0a728-c40e-4fa2-a8f5-90d78bc70d23', '00b1be30-bcad-469e-b114-cf9fde4bef73', 'subAlias', 3, 'String', 1, '主体别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='1cab93c9-1dfe-4a92-8833-a1271dc339b1')<1
	then
		INSERT INTO `portrait_tags_api_info` VALUES ('1cab93c9-1dfe-4a92-8833-a1271dc339b1', '4e026be2-a2aa-49f4-af1f-614070906a00', '新增实体', '新增实体', 0, '', '1', '0', '{\n	\"params\": {\n		\"subAlias\": \"TESTP\",\n                \"entityGuids\": [\"19579bbf9-31d0-4548-b781f-ea4\"]\n	}\n}', '返回成功描述\n{\n	"custom": "success",\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n\n返回失败描述\n\n  {\n	"custom": "",\n	"status": {\n		"code": "000010",\n		"text": "参数错误!"\n	}\n}', '', '/rest/portrait/addEntity', 0, '', NULL, NULL, NULL, NULL, '2020-12-09 14:39:43', '2020-12-09 15:45:29');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='449e47c2-114e-4667-b709-6b3e9dd6195d')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('449e47c2-114e-4667-b709-6b3e9dd6195d', '1cab93c9-1dfe-4a92-8833-a1271dc339b1', 'subAlias', 3, 'String', 1, '主体别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='5262b270-e08a-472a-afea-8569b5fd3b5e')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('5262b270-e08a-472a-afea-8569b5fd3b5e', '1cab93c9-1dfe-4a92-8833-a1271dc339b1', 'entityGuids', 3, 'String', 1, '个体标识列表');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='499d98d4-3c60-4f60-b862-7956cdc1391e')<1
	then
		INSERT INTO `portrait_tags_api_info` VALUES ('499d98d4-3c60-4f60-b862-7956cdc1391e', '4e026be2-a2aa-49f4-af1f-614070906a00', '删除实体', '删除实体', 0, '', '1', '0', '{\n	\"params\": {\n		\"subAlias\": \"TESTP\",\n                \"entityGuids\": [\"19579bbf9-31d0-4548-b781f-ea4\"]\n	}\n}', '返回成功描述\n{\n	"custom": "success",\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n\n返回失败描述\n\n  {\n	"custom": "",\n	"status": {\n		"code": "000010",\n		"text": "参数错误!"\n	}\n}', '', '/rest/portrait/deleteEntity', 0, '', NULL, NULL, NULL, NULL, '2020-12-09 14:39:43', '2020-12-09 15:45:29');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='e2976d3b-2136-4e56-b011-d787c090255b')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('e2976d3b-2136-4e56-b011-d787c090255b', '499d98d4-3c60-4f60-b862-7956cdc1391e', 'subAlias', 3, 'String', 1, '主体别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='0d86817c-edce-4acd-9cb3-6920fab64667')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('0d86817c-edce-4acd-9cb3-6920fab64667', '499d98d4-3c60-4f60-b862-7956cdc1391e', 'entityGuids', 3, 'String', 1, '个体标识列表');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_info WHERE rowguid='da45af66-a72a-4fde-a2b9-4b1abac12853')<1
	then
		INSERT INTO `portrait_tags_api_info` VALUES ('da45af66-a72a-4fde-a2b9-4b1abac12853', '4e026be2-a2aa-49f4-af1f-614070906a00', '查询标签分类标签树', '根据主体别名查询标签分类标签树', 0, '', '1', '0', '{\n	\"params\": {\n		\"alias\": \"TESTP\",\n		\"ouGuid\": \"19579bbf9-31d0-4548-b781f-ea4\"\n	}\n}', '返回参数\n{\n	"custom": {\n		"typelist": [{\n			"typelist": 标签分类列表,\n			"typeguid": 标签分类标识,\n			"typename": 标签分类名称,\n			"taglist": [\n				"tagname":标签名称,\n				"tagguid":标签标识,\n				"tagalias":标签别名,\n				"dataType"标签数据类型,\n				"fullsearch":是否支持全文检索,\n				"remark":备注,\n				"tagcontent":标签代码项,\n				"type"标签值类型 (0表示二值，1表示多值，2表示动态，3表示集合，4表示仅值),\n				"tagtype"标签状态(1:表示下线 0表示上线),\n			]\n		}]\n	},\n	"status": {\n		"code": "000000",\n		"text": "请求成功"\n	}\n}\n返回成功描述\n{\n  "custom": {\n    "typelist": [\n      {\n        "typelist": [\n          {\n            "typelist": [],\n            "typeguid": "33dc90c2-0778-4955-9165-7ab369b592ba",\n            "typename": "登记信息",\n            "taglist": [\n              {\n                "tagname": "身份证号码",\n                "fullsearch": "1",\n                "tagguid": "6280a3ad-d0e9-446b-8000-4db8b7c7a7f9",\n                "tagalias": "id",\n                "dataType": "",\n                "remark": "",\n                "tagcontent": [],\n                "type": "4",\n                "tagtype": "0"\n              },\n              {\n                "tagname": "姓名",\n                "fullsearch": "1",\n                "tagguid": "8b30afc3-5340-40cd-9e18-c59de2f59bb2",\n                "tagalias": "name",\n                "dataType": "java.lang.String",\n                "remark": "",\n                "tagcontent": [],\n                "type": "2",\n                "tagtype": "0"\n              },\n              {\n                "tagname": "性别",\n                "fullsearch": "1",\n                "tagguid": "fd744e22-7080-4503-a926-310af5629782",\n                "tagalias": "gender",\n                "dataType": "java.lang.String",\n                "remark": "",\n                "tagcontent": [\n                  {\n                    "text": "女",\n                    "value": "2"\n                  },\n                  {\n                    "text": "男",\n                    "value": "1"\n                  }\n                ],\n                "type": "1",\n                "tagtype": "0"\n              }\n            ]\n          }\n        ],\n        "typeguid": "0baa5303-7aee-4a36-8e16-d28aa2e02923",\n        "typename": "基本信息",\n        "taglist": [\n          {\n            "tagname": "身份证2",\n            "fullsearch": "1",\n            "tagguid": "8d782c91-2cc3-48e6-a6a6-8f876ff90f4e",\n            "tagalias": "sfz",\n            "dataType": "java.lang.String",\n            "remark": "",\n            "tagcontent": [],\n            "type": "2",\n            "tagtype": "0"\n          }\n        ]\n      },\n      {\n        "typelist": [],\n        "typeguid": "5f1c1a85-ecd5-444d-8154-7d97f4f0d7fb",\n        "typename": "第一层",\n        "taglist": [\n          {\n            "tagname": "gfhdf",\n            "fullsearch": "0",\n            "tagguid": "98bec471-f0f5-4378-9acd-c900974aa45b",\n            "tagalias": "gjsgfhdfg",\n            "dataType": "java.lang.String",\n            "remark": "",\n            "tagcontent": [],\n            "type": "0",\n            "tagtype": "0"\n          }\n        ]\n      }\n    ],\n    "entity": "PEOPLE"\n  },\n  "status": {\n    "code": "000000",\n    "text": "请求成功"\n  }\n}\n\n返回失败描述\n\n  {\n	"custom": "",\n	"status": {\n		"code": "000010",\n		"text": "参数错误!"\n	}\n}', '', '/rest/portrait/getTagSearch', 0, '', NULL, NULL, NULL, NULL, '2020-12-09 14:39:43', '2020-12-09 15:45:29');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='60a0a6b4-6197-46f4-8ae1-217df7e00c66')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('60a0a6b4-6197-46f4-8ae1-217df7e00c66', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'alias', 3, 'String', 1, '主体别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_request_params WHERE rowguid='e7f7927c-6bbc-4179-ad62-47c4b1d709dc')<1
	then
		INSERT INTO portrait_tags_api_request_params VALUES('e7f7927c-6bbc-4179-ad62-47c4b1d709dc', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'ouGuid', 3, 'String', 1, '部门标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='90405bb6-e830-40e9-9950-9280349cd167')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('90405bb6-e830-40e9-9950-9280349cd167', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'typelist', 'String', '标签分类列表');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='03488875-442a-4913-ac60-c0f972dab360')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('03488875-442a-4913-ac60-c0f972dab360', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'typeguid', 'String', '标签分类标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='be2e7b96-bc7b-49c3-b496-87fc5e20005c')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('be2e7b96-bc7b-49c3-b496-87fc5e20005c', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'typename', 'String', '标签分类名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='8a5a46db-0097-4a57-8ac9-fdb91d0b563f')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('8a5a46db-0097-4a57-8ac9-fdb91d0b563f', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'taglist', 'String', '标签列表名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='44e4b487-2014-43a9-a958-0071bf861103')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('44e4b487-2014-43a9-a958-0071bf861103', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'tagname', 'String', '标签名称');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='8a5956a1-0ae1-4aa4-af82-d1fb12f48961')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('8a5956a1-0ae1-4aa4-af82-d1fb12f48961', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'tagguid', 'String', '标签标识');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='4d7f6ca8-e2dd-472a-ac1c-e1817d4721f8')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('4d7f6ca8-e2dd-472a-ac1c-e1817d4721f8', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'tagalias', 'String', '标签别名');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='d0148b96-34c1-4810-9839-2105434d7c06')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('d0148b96-34c1-4810-9839-2105434d7c06', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'dataType', 'String', '标签数据类型');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='26ed56e5-2a60-4fe3-8b3b-cb4ae4393b4d')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('26ed56e5-2a60-4fe3-8b3b-cb4ae4393b4d', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'fullsearch', 'String', '是否支持全文检索');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='426b8946-37e7-45bf-bb44-b57b26a63955')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('426b8946-37e7-45bf-bb44-b57b26a63955', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'remark', 'String', '备注');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='710a7e3a-fbb7-4400-8dc4-1590392f8fbd')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('710a7e3a-fbb7-4400-8dc4-1590392f8fbd', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'tagcontent', 'String', '标签代码项');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='5fb7ac69-0207-4cd7-9962-a0bd48aee3d6')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('5fb7ac69-0207-4cd7-9962-a0bd48aee3d6', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'type', 'String', '标签值类型 (0表示二值，1表示多值，2表示动态，3表示集合，4表示仅值)');
	end if;
	
	if  (SELECT count( 1 ) FROM	portrait_tags_api_response_params WHERE rowguid='67370a32-fa89-40d0-94dd-9eece307c2d6')<1
	then
		INSERT INTO portrait_tags_api_response_params VALUES('67370a32-fa89-40d0-94dd-9eece307c2d6', 'da45af66-a72a-4fde-a2b9-4b1abac12853', 'tagtype', 'String', '标签状态(1:表示下线 0表示上线)');
	end if;
	
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO