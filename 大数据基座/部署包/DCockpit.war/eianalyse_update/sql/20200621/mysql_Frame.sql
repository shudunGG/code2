drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	 if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='portrait_tags_api_request_params')<1
     then
            CREATE TABLE `portrait_tags_api_request_params` (
                `rowguid` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '主键guid',
                `serviceGuid` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '服务guid',
                `paramName` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数名称',
                `position` int(11) DEFAULT NULL COMMENT '0:url 1:header  2:body',
                `type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '参数类型',
                `mustFill` int(11) DEFAULT NULL COMMENT '0:不必填 1:必填',
                `remark` text COLLATE utf8_bin DEFAULT NULL COMMENT '参数说明',
                PRIMARY KEY (`rowguid`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
            INSERT INTO `portrait_tags_api_request_params` VALUES ('026502bc-a90e-46c7-b6b1-3489133d0e4a', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'cl', 3, 'String', 0, '返回内容长度');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('03f80d47-42aa-4834-af70-30dd60755900', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'unionCondition', 3, 'String', 0, '额外查询条件(或)');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('080e270a-b86d-4d1f-98f6-9b0751515506', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'condition', 3, 'String', 0, '额外查询条件(且)');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('120acb0d-02d3-4aaf-a62c-fddb61d6701b', '6f9283e1-eb3d-4774-ae77-8aa2937b2d0b', 'ouGuid', 3, 'String', 1, '部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('15bfb8ea-93c1-4be2-9d32-cf135e255ce6', '8a378cda-8e3e-46bc-82bc-b97c98149961', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('16570330-78a9-479c-bf74-0633a52ab7a4', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'pn', 3, 'String', 0, '起始行');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('16efaac3-f19e-4fa2-b152-745aa5d75576', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'ouGuid', 3, 'String', 1, '部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('18f908b6-a42a-46f1-9694-f5440dcacbb6', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'ssort', 3, 'String', 0, '匹配度排序');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('1923ad9b-306c-4dc2-a3f9-d779dd463156', 'c2a73164-0820-4f59-b24b-75c199c1d735', 'ouGuid', 3, 'String', 1, '部门guid,部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('1969ba64-bfe9-4413-9444-7f73fb9121c6', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'statistics', 3, 'String', 1, '统计字段');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('1acdab61-d67c-47c0-893f-973381dfd680', 'ef4d3843-7bad-42e5-a2c9-ddd7a43adceb', 'wd', 3, 'String', 0, '查询关键字');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('1e052a57-22b6-4ccb-a8f0-37b6bbb31a8d', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'pageNum', 3, 'Integer', 0, '页码');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('25185ccd-a45e-4c79-b0df-fc838095e9d4', 'ef4d3843-7bad-42e5-a2c9-ddd7a43adceb', 'fields', 3, 'String', 1, '查询指标别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('2ac2b6dc-d63c-459d-aaf5-c4006d53547b', '6f9283e1-eb3d-4774-ae77-8aa2937b2d0b', 'modifyInfo', 3, 'String', 1, '标签别名,标签值');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('2d457b26-e43e-4b21-984e-fa5999b9ab86', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'statistics', 3, 'String', 0, '统计字段');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('32bcf4bc-0b02-4c9f-a37e-2046e8577dc5', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'sdt', 3, 'String', 0, '查询开始时间');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('3d1529bc-d9f7-41ae-b6a1-82b27f8c3e91', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'incWd', 3, 'String', 0, '包含关键字');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('3e61866f-884b-40ca-91b3-d433f3ed0300', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'times', 3, 'String', 0, '额外时间范围条件');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('40f3eabe-ce79-4f46-9c3f-48ce0ef7af01', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'ouGuid', 3, 'String', 1, '部门ouguid,部门唯一标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('4108cafb-fe34-438a-b478-0b6005be4bc2', 'd3e34462-e880-4670-aa69-c56cba7f479b', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('44d679e7-5ae2-4095-940d-a36383cf6d89', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'highLightFields', 3, 'String', 0, '高亮字段');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('4ad884e5-501f-4286-aa7b-c6773366825f', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('4f51c2f9-1efb-495e-a986-0f69b165d473', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'condition', 3, 'String', 0, '额外查询条件(且)');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('50f94004-9ba3-46ec-8201-e71d6211c0de', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'rn', 3, 'String', 0, '返回数');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('51c9a37a-39ff-4b6b-8d1f-7df56ef35bec', '9a7538bb-b8f8-4789-94ac-13054481c024', 'pageNum', 3, 'String', 1, '页码');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('5314ad38-b659-4d90-8048-5f600ac10ea3', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'incWd', 3, 'String', 0, '包含关键字');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('53baa5c2-9f4e-4cea-b26b-ee2d298b85f6', 'ef4d3843-7bad-42e5-a2c9-ddd7a43adceb', 'ouGuid', 3, 'String', 1, '部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('54da206e-48f4-461a-b8a8-a26aecfed99e', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'fields', 3, 'String', 0, '查询指标别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('5500f6de-8c80-40a5-a6b1-e1900b2b62fc', '8a378cda-8e3e-46bc-82bc-b97c98149961', 'ouGuid', 3, 'String', 1, '部门ouguid,部门唯一标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('55f5907b-7c9e-42e4-b474-1a8bc0fe005e', 'ef4d3843-7bad-42e5-a2c9-ddd7a43adceb', 'reFields', 3, 'String', 0, '返回字段');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('57babbbc-0a98-4140-8dcb-be36f48c9219', '6b223f8a-e361-43cb-814f-06d4ea59f537', 'ouGuid', 3, 'String', 1, '部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('58e612fe-5b13-44a7-bad6-db49802af50b', '6b223f8a-e361-43cb-814f-06d4ea59f537', 'entityGuids', 3, 'String', 1, '主体标识列表');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('6198f686-eb3e-4495-8e75-85fdd2f175c4', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('63063b1c-96e7-4a91-8609-c437f9d9003f', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'wd', 3, 'String', 0, '查询关键字');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('6433ed20-946c-4db7-a07c-5e479f39ac27', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'times', 3, 'String', 0, '额外时间范围条件');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('65f36db0-408d-41f8-a6cc-a819d9d3ea07', '6f9283e1-eb3d-4774-ae77-8aa2937b2d0b', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('66657458-d6ee-41d9-af36-32229a4280a9', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'pageNum', 3, 'Integer', 1, '页码');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('68fb1531-0c67-446b-a7eb-0b092f865004', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'noParticiple', 3, 'String', 0, '是否分词(1:启用；2:不启用)');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('6b69f910-426d-417e-8445-06aa7c894777', '6b223f8a-e361-43cb-814f-06d4ea59f537', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('6ba609f1-5439-41cb-a00f-c37bb0659715', '51408c9c-1b3d-4c1c-8fac-89f11ab3a4b3', 'ouGuid', 3, 'String', 1, '部门ouguid,部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('6cd68149-55c7-44d7-91ca-cb8df4c01098', '9a7538bb-b8f8-4789-94ac-13054481c024', 'pageSize', 3, 'String', 1, '每页数量');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('6fb93176-78ef-481e-af37-95645adb4f2b', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'cutIngore', 3, 'String', 0, '排除字段长度截取');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('752d3d06-44b9-4c50-9e71-ccea055ebe21', 'ef4d3843-7bad-42e5-a2c9-ddd7a43adceb', 'pageSize', 3, 'Integer', 1, '每页数量');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('78d0455b-c7f7-402c-ad39-78b2531439c3', 'c2a73164-0820-4f59-b24b-75c199c1d735', 'portraitAlias', 3, 'String', 1, '画像别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('79a55cd8-edf4-453d-9a3c-f9353c2d902b', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'searchRange', 3, 'String', 0, '根据某个字段值范围查询');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('7c4e1983-10ef-475f-a5c3-01d087521041', 'ef4d3843-7bad-42e5-a2c9-ddd7a43adceb', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('7e2f5ecc-ab90-4872-9487-a7527789c975', 'c2a73164-0820-4f59-b24b-75c199c1d735', 'entityGuids', 3, 'String', 1, '个体主键列表');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('7edbbcc9-e49b-4a5d-b69a-b4bf7ba49030', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'noParticiple', 3, 'String', 0, '是否分词(1:启用；2:不启用)');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('80079415-301e-49ae-9a52-e3be69e9be70', '2a599083-b368-4619-83c1-5198b909a270', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('81503fbe-988b-4e4a-b6cf-a98f21f4bced', '6f9283e1-eb3d-4774-ae77-8aa2937b2d0b', 'rowGuid', 3, 'String', 1, '主体标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('81f35ab0-50fa-46dc-8c0f-43473dccce20', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('8a3ceb96-5e9e-4764-b39c-00d1afc9ca99', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'pageSize', 3, 'Integer', 1, '每页数量');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('9122be7e-0b8a-40c0-85bd-25ba8823dca0', 'a5f566cb-6ce3-4c6f-9caa-5bc8c8338738', 'ouGuid', 3, 'String', 1, '部门ouguid,部门唯一标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('93780347-b690-439d-81f7-314690c39fb9', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'noWd', 3, 'String', 0, '是否需要关键词');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('96558545-6cf6-4ad9-aabf-21c2900a1ff3', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'pageSize', 3, 'Integer', 0, '每页数量');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('9e2cf82d-fd18-445f-aa3b-2780cadca5e5', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'subAlias', 3, 'String', 0, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('a5967797-d90d-479f-88e1-5fb061293de8', 'fc8f0e0b-551d-4c04-ad48-c00d4f825e3b', 'entityGuid', 3, 'String', 1, '个体标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('a793ba90-647e-4459-a8e4-0457c433fe52', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'isUseClickSort', 3, 'String', 0, '开启热度排序');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('a9de06d5-f880-4a33-af4d-a7645d78f066', '9a7538bb-b8f8-4789-94ac-13054481c024', 'ouGuid', 3, 'String', 1, '部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('aa2ba75e-fc8f-40b9-a51f-36d22e0e10d3', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'wd', 3, 'String', 0, '查询关键字');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('aafd55d1-24f9-4ffc-ac0b-d0928d583e6c', '4f4fb4ef-65d4-4415-a151-84e258295dc6', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('ba8132f3-4354-4199-a6d3-b86391ccadc9', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'condition', 3, 'String', 0, '额外查询条件(且)');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('bb7c0430-1c7f-4771-a513-0f91d26a2780', 'a5f566cb-6ce3-4c6f-9caa-5bc8c8338738', 'subAlias', 3, 'String', 1, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('bcb1c0c1-7e45-4e94-9616-c3e8cd431153', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'edt', 3, 'String', 0, '查询结束时间');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('bf846934-e75c-4a40-9573-9d594e13e37a', 'd3e34462-e880-4670-aa69-c56cba7f479b', 'entityGuids', 3, 'String', 1, '主体标识列表');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('c53ec0e1-a9f0-4533-a960-57de433d2e55', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'ouGuid', 3, 'String', 0, '部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('c766ded4-4930-48ba-82e8-a6792928aba6', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'unionCondition', 3, 'String', 0, '额外查询条件(或)');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('cc78e87a-b7ea-4df7-aa27-9e157aa2d879', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'accuracy', 3, 'String', 0, '精确度查询');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('cddaf69d-66c5-4aa1-a5f1-1b49ad473028', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'terminal', 3, 'String', 0, '终端类别');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('cfa2886a-9a35-4440-8fe9-6ca79ad1168d', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'edt', 3, 'String', 0, '查询结束时间');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('d117eca1-8fae-42c1-856f-9cd687bb2b0a', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'fields', 3, 'String', 1, '查询指标别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('d28e9f6a-f86d-4b6e-8343-61340fbde01d', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'subAlias', 3, 'String', 0, '主体别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('d72a161c-e7a6-4600-93b7-3ae6dda2f7fd', 'a5f566cb-6ce3-4c6f-9caa-5bc8c8338738', 'entityGuid', 3, 'String', 1, '主体中 主键标签对应的实际数据值');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('d85ba4fd-c55b-435f-a7b1-f207bb16cb0f', '2a599083-b368-4619-83c1-5198b909a270', 'ouGuid', 3, 'String', 1, '部门ouguid,部门的唯一标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('dbacb6c3-478d-4654-bf58-c80f5e74aec0', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'searchRange', 3, 'String', 0, '根据某个字段值范围查询');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('dd3d22b0-a96b-4137-b33f-bca68e364af4', '9a7538bb-b8f8-4789-94ac-13054481c024', 'portraitAlias', 3, 'String', 1, '画像别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('dd7e4628-6240-478d-b126-9eee0dec2a3b', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'reFields', 3, 'String', 0, '返回字段');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('dee0ad53-16dd-4af8-b585-1bdafd3aa6f3', 'a2c937d1-306b-4227-ac50-5bfae503cf0a', 'fields', 3, 'String', 0, '查询指标别名');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('e4058e96-be3c-4972-95c8-d4a5135dee03', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'accuracy', 3, 'String', 0, '精确度查询');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('eab487e4-3288-451f-89f5-3ada41f748fd', 'd49f0b5b-47d4-4ad8-bfe9-77e2412ead79', 'excWd', 3, 'String', 0, '不包含关键字');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('f113d920-eff9-4cf0-864c-16928b76598d', 'ef4d3843-7bad-42e5-a2c9-ddd7a43adceb', 'pageNum', 3, 'Integer', 1, '页码');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('f1170970-368c-4ce8-b670-5bd9590de547', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'sdt', 3, 'String', 0, '查询开始时间');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('f1ea1b68-a99c-42c2-b615-b8adc6b1a274', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'ouGuid', 3, 'String', 0, '部门标识');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('f23b1454-4124-4fe3-a7c6-0e06de9a0467', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'sort', 3, 'String', 0, '排序');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('f8931389-4b97-4da5-8017-6d28df8f9df2', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'wd', 3, 'String', 0, '查询关键字');
            INSERT INTO `portrait_tags_api_request_params` VALUES ('fbe202e1-6c6b-46c5-b779-babb39f1cd7d', 'b9875cfb-edd7-444e-b8fc-ef1f3188ad1c', 'excWd', 3, 'String', 0, '不包含关键字');
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --