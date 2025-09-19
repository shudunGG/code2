--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER  注释去除即可 --
-- DELIMITER GO --

--添加组件表
CREATE TABLE dxp_subassembly  (
  rowguid varchar(50)   PRIMARY KEY ,
  pluginname varchar(100) ,
  steptype varchar(100) ,
  classpath varchar(500) ,
  iconsmall varchar(500) ,
  icon varchar(500) ,
  url varchar(500) ,
  introduce varchar(200) ,
  banwrong int NOT NULL,
  groupguid varchar(50),
  ordernum int 
)

GO
-- ----------------------------
-- Records of dxp_subassembly
-- ----------------------------
INSERT INTO dxp_subassembly VALUES ('00fff2ca-6706-4308-aa2e-923da9ca3d7b', '增加常量', 'Constant', 'com.epoint.dxp.development.trans.steps.AddConstantsStep', 'images/add-icon/add-constant.png', 'images/icon/add-constant.png', './transassembly/addConstants.html', '增加常量组件', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 100)

GO

INSERT INTO dxp_subassembly VALUES ('0337228a-5344-40ee-94cb-feeff4808e10', '结束', 'SUCCESS', 'com.epoint.dxp.development.flow.steps.SuccessEntryStep', 'images/add-icon/end-icon.png', 'images/icon/end-icon.png', '', '结束组件', 1, 'd30a5f63-763d-48bd-ad72-2126b464d0b2', 50)

GO

INSERT INTO dxp_subassembly VALUES ('041e3d47-c8d9-4765-80ef-cbdc44044158', 'JSON输入', 'JsonInput', 'com.epoint.dxp.development.trans.steps.JsonInputStep', 'images/add-icon/jsoninput.png', 'images/icon/jsoninput.png', './transassembly/jsoninput.html', 'JSON解析', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 70)

GO

INSERT INTO dxp_subassembly VALUES ('05295aa6-8874-445f-aa81-ce9e4c1d8825', 'sm4加密', 'Sm4Encrypt', 'com.epoint.dxp.development.trans.steps.Sm4EncryptStep', 'images/add-icon/sm4encrypt.png', 'images/icon/sm4encrypt.png', './transassembly/sm4encrypt.html', 'sm4加密', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 20)

GO

INSERT INTO dxp_subassembly VALUES ('0e9626f4-9273-44e6-9a49-4b7c7efd4751', 'XMLoutput', 'XmlOutput', 'com.epoint.dxp.development.trans.steps.XmlOutputStep', 'images/add-icon/xmloutput.png', 'images/icon/xmloutput.png', './transassembly/xmloutput.html', '输出xml格式的记录', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 60)

GO

INSERT INTO dxp_subassembly VALUES ('15234946-603d-4d86-a568-460d24bc100c', 'Switch/case', 'SwitchCase', 'com.epoint.dxp.development.trans.steps.SwitchCaseStep', 'images/add-icon/switch-case.png', 'images/icon/switch-case.png', './transassembly/switchcase.html', 'Switch/case', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 80)

GO

INSERT INTO dxp_subassembly VALUES ('16ac04c0-28ee-48da-8fa4-6b1e4f92c750', '检验字段的值', 'SIMPLE_EVAL', 'com.epoint.dxp.development.flow.steps.SimpleEvalEntryStep', 'images/add-icon/checkvalue-icon.png', 'images/icon/checkvalue-icon.png', './jobassembly/simpleevalentry.html', '检验字段的值', 0, '30a1d2b6-062e-4efe-9142-f6e39a64c293', 100)

GO

INSERT INTO dxp_subassembly VALUES ('17498522-b80b-4895-b970-f4afe63bd1cc', 'hbaseoutput', 'HBaseOutput', 'com.epoint.dxp.development.trans.steps.HbaseOutputStep', 'images/add-icon/hbase-output.png', 'images/icon/hbase-input.png', './transassembly/hbaseoutput.html', 'hbase输出', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 10)

GO

INSERT INTO dxp_subassembly VALUES ('1ab41930-932c-4e74-9676-2a0d50b7baef', '设置变量', 'SetVariable', 'com.epoint.dxp.development.trans.steps.SetVariableStep', 'images/add-icon/setVariable.png', 'images/icon/setVariable.png', './transassembly/setvariable.html', '设置变量', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 70)

GO

INSERT INTO dxp_subassembly VALUES ('2017643d-d119-4a29-b3f3-11cfda21c078', '获取系统信息', 'SystemInfo', 'com.epoint.dxp.development.trans.steps.SystemDataStep', 'images/add-icon/systemdata.png', 'images/icon/systemdata.png', './transassembly/systemdata.html', '获取系统信息，例如时间、日期', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 50)

GO

INSERT INTO dxp_subassembly VALUES ('213163ee-0ac0-47d9-a013-aac2524a64d2', 'MPP输出', 'MppCopy', 'com.epoint.dxp.development.trans.steps.MppOutputStep', 'images/add-icon/jsonoutput.png', 'images/icon/jsonoutput.png', './transassembly/mppoutput.html', 'MPP输出', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 40)

GO

INSERT INTO dxp_subassembly VALUES ('23649333-375d-459a-b735-287883267cb1', 'kafka消费者', 'KafkaConsumer', 'com.epoint.dxp.development.trans.steps.KafkaConsumerStep', 'images/add-icon/jsonoutput.png', 'images/icon/jsonoutput.png', './transassembly/kafkaconsumer.html', 'kafka消费者', 0, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 40)

GO

INSERT INTO dxp_subassembly VALUES ('2391a818-5dee-43d7-a79a-c05df8419fba', '二进制转base64', 'BinaryChange', 'com.epoint.dxp.development.trans.steps.ToBase64Step', 'images/add-icon/switch-case.png', 'images/icon/switch-case.png', './transassembly/tobase64.html', '二进制转base64', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 10)

GO

INSERT INTO dxp_subassembly VALUES ('269abc51-b832-44bd-881d-0977255646c7', '记录集连接', 'MergeJoin', 'com.epoint.dxp.development.trans.steps.MergeJoinStep', 'images/add-icon/mergeJoin.png', 'images/icon/mergeJoin.png', './transassembly/mergejoin.html', '记录集连接', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 30)

GO

INSERT INTO dxp_subassembly VALUES ('26dc7b92-8b14-413c-ac64-7d44135ead05', '复制记录到结果', 'RowsToResult', 'com.epoint.dxp.development.trans.steps.RowsToResultStep', 'images/add-icon/rowsToResult.png', 'images/icon/rowsToResult.png', './transassembly/rowstoresult.html', '复制记录到结果', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 50)

GO

INSERT INTO dxp_subassembly VALUES ('2aeec8e0-be33-4872-a137-10d372e732dd', '转换状态日志', 'TransStatusLog', 'com.epoint.dxp.development.trans.steps.TransStatusLogStep', 'images/add-icon/transstauslog.png', 'images/icon/transstauslog.png', './transassembly/transstatuslog.html', '转换状态日志', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 100)

GO

INSERT INTO dxp_subassembly VALUES ('2c878eaa-ad85-4683-9b1a-7be9d86770df', '剪切字符串', 'StringCut', 'com.epoint.dxp.development.trans.steps.StringCutStep', 'images/add-icon/stringcut.png', 'images/icon/stringcut.png', './transassembly/stringcut.html', '剪切字符串', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 60)

GO

INSERT INTO dxp_subassembly VALUES ('3168d48a-f4cf-4e48-868b-26d7ec7d7353', 'hadoopCopyFiles', 'HadoopCopyFilesPlugin', 'com.epoint.dxp.development.flow.steps.HadoopCopyFilesStep', 'images/add-icon/checkvalue-icon.png', 'images/icon/checkvalue-icon.png', './jobassembly/hadoopcopyfiles.html', 'hadoopCopyFiles', 0, '267e8944-52a7-4e37-8404-d1502b96901a', 50)

GO

INSERT INTO dxp_subassembly VALUES ('332353aa-0e9c-4140-9047-2d893d633c64', '表输入', 'TableInput', 'com.epoint.dxp.development.trans.steps.TableInputStep', 'images/add-icon/input-table.png', 'images/icon/input-table.png', './transassembly/tableInput.html', '从数据库中读取信息', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 80)

GO

INSERT INTO dxp_subassembly VALUES ('37244839-461e-4826-bd10-41bf0f9948c3', 'sftp文件同步', 'SFTP_Sync', 'com.epoint.dxp.development.flow.steps.SFTPSyncStep', 'images/add-icon/checkvalue-icon.png', 'images/icon/checkvalue-icon.png', './jobassembly/sftpsync.html', 'sftp文件同步', 0, '267e8944-52a7-4e37-8404-d1502b96901a', 100)

GO

INSERT INTO dxp_subassembly VALUES ('49211899-38d3-4edf-87b8-85b8380ff51c', '字符串操作', 'StringOperations', 'com.epoint.dxp.development.trans.steps.StringOperationsStep', 'images/add-icon/stringoperations.png', 'images/icon/stringoperations.png', './transassembly/stringoperations.html', '字符串操作', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 30)

GO

INSERT INTO dxp_subassembly VALUES ('510cb095-bbad-4bfe-8539-e71cc5c531f9', '字符串替换', 'ReplaceString', 'com.epoint.dxp.development.trans.steps.StringReplaceStep', 'images/add-icon/string-replace.png', 'images/icon/string-replace.png', './transassembly/stringreplace.html', '字符串替换组件', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 120)

GO

INSERT INTO dxp_subassembly VALUES ('51db29fc-3bbc-4e2a-928d-b85b447d3d36', '去除重复记录', 'Unique', 'com.epoint.dxp.development.trans.steps.UniqueRowsStep', 'images/add-icon/uniqueRows.png', 'images/icon/uniqueRows.png', './transassembly/uniquerows.html', '去除重复记录', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 90)

GO

INSERT INTO dxp_subassembly VALUES ('53881ffc-5535-4a47-a297-880883ece1c2', '执行sql脚本', 'ExecSQL', 'com.epoint.dxp.development.trans.steps.ExecSQLStep', 'images/add-icon/execute-sql.png', 'images/icon/execute-sql.png', './transassembly/execsql.html', '执行sql脚本组件', 1, '9c7ae2c5-3a06-49a8-b6cf-88caf84148dc', 100)

GO

INSERT INTO dxp_subassembly VALUES ('57590cb7-1129-4550-9976-ab79c8b2dce1', '获取变量', 'GetVariable', 'com.epoint.dxp.development.trans.steps.GetVariableStep', 'images/add-icon/getVariable.png', 'images/icon/getVariable.png', './transassembly/getvariable.html', '获取变量', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 60)

GO

INSERT INTO dxp_subassembly VALUES ('5a2dae05-0e1f-42de-99f1-fc6484160e5a', '从结果获取记录', 'RowsFromResult', 'com.epoint.dxp.development.trans.steps.RowsFromResultStep', 'images/add-icon/rowsFromResult.png', 'images/icon/rowsFromResult.png', './transassembly/rowsfromresult.html', '从结果获取记录', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 40)

GO

INSERT INTO dxp_subassembly VALUES ('5e1813d2-1967-4996-addd-25e6d6c6da51', 'JsonOutput', 'JsonOutput', 'com.epoint.dxp.development.trans.steps.JsonOutputStep', 'images/add-icon/jsonoutput.png', 'images/icon/jsonoutput.png', './transassembly/jsonoutput.html', '输出json格式的记录', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 50)

GO

INSERT INTO dxp_subassembly VALUES ('61cb8601-6b05-4db2-8821-420fc7da25ad', '列拆分为多行', 'SplitFieldToRows3', 'com.epoint.dxp.development.trans.steps.SplitFieldToRowsStep', 'images/add-icon/splitFieldToRows.png', 'images/icon/splitFieldToRows.png', './transassembly/splitfieldtorows.html', '列拆分为多行', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 80)

GO

INSERT INTO dxp_subassembly VALUES ('639d14c9-0c08-401d-9d26-7dd9333ae6e7', 'sm4解密', 'Sm4Decrypt', 'com.epoint.dxp.development.trans.steps.Sm4DecryptStep', 'images/add-icon/sm4decrypt.png', 'images/icon/sm4decrypt.png', './transassembly/sm4decrypt.html', 'sm4解密', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 10)

GO

INSERT INTO dxp_subassembly VALUES ('63d0a1b3-9f45-44e7-ab57-60536429befa', '开始', 'SPECIAL', 'com.epoint.dxp.development.flow.steps.StartEntryStep', 'images/add-icon/start-icon.png', 'images/icon/start-icon.png', '', '开始组件', 1, 'd30a5f63-763d-48bd-ad72-2126b464d0b2', 100)

GO

INSERT INTO dxp_subassembly VALUES ('6c6036f1-0116-4be9-89fc-b030e302bf6b', '生成记录', 'RowGenerator', 'com.epoint.dxp.development.trans.steps.RowGeneratorStep', 'images/add-icon/random.png', 'images/icon/random.png', './transassembly/rowgenerator.html', '生成记录组件', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 100)

GO

INSERT INTO dxp_subassembly VALUES ('71e58b78-5dd2-4774-bbb7-5b62d3c92de6', 'hbaseinput', 'HBaseInput', 'com.epoint.dxp.development.trans.steps.HbaseInputStep', 'images/add-icon/hbase-input.png', 'images/icon/hbase-input.png', './transassembly/hbaseinput.html', 'hbase输入', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 20)

GO

INSERT INTO dxp_subassembly VALUES ('7b781aa8-50fc-4ef1-b05a-021ad0cdd312', 'java代码', 'UserDefinedJavaClass', 'com.epoint.dxp.development.trans.steps.ExecJavaCodeStep', 'images/add-icon/java.png', 'images/icon/java.png', './transassembly/execjavacode.html', 'java代码', 1, '9c7ae2c5-3a06-49a8-b6cf-88caf84148dc', 80)

GO

INSERT INTO dxp_subassembly VALUES ('7d64cadc-1367-4e81-8823-d081ee134ba6', '正则表达式', 'RegularExpression', 'com.epoint.dxp.development.trans.steps.ExecRegexpStep', 'images/add-icon/execute-regexp.png', 'images/icon/execute-regexp.png', './transassembly/execregexp.html', '正则表达式组件', 1, '9c7ae2c5-3a06-49a8-b6cf-88caf84148dc', 70)

GO

INSERT INTO dxp_subassembly VALUES ('86bb562e-e7aa-4813-bf10-850dfb7362c2', '表输出', 'TableOutPut', 'com.epoint.dxp.development.trans.steps.TableOutPutStep', 'images/add-icon/table-put.png', 'images/icon/table-put.png', './transassembly/tableOutput.html', '存储信息到数据库表中', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 80)

GO

INSERT INTO dxp_subassembly VALUES ('8d2c7e01-6a73-4083-9891-4b71eda8df5f', 'JavaScript代码', 'ScriptValueMod', 'com.epoint.dxp.development.trans.steps.ExecJavaScriptStep', 'images/add-icon/execute-javascript.png', 'images/icon/execute-javascript.png', './transassembly/execjavascript.html', 'JavaScript代码组件', 1, '9c7ae2c5-3a06-49a8-b6cf-88caf84148dc', 50)

GO

INSERT INTO dxp_subassembly VALUES ('972a6eb2-c994-4984-b124-19e5b0aaeea6', '排序记录', 'SortRows', 'com.epoint.dxp.development.trans.steps.SortRowsStep', 'images/add-icon/sortRows.png', 'images/icon/sortRows.png', './transassembly/sortrows.html', '排序记录', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 70)

GO

INSERT INTO dxp_subassembly VALUES ('975ee3ff-6ff5-4d75-9622-fe1d33dcde50', 'Kafka生产者', 'KafkaProducer', 'com.epoint.dxp.development.trans.steps.KafkaProducerStep', 'images/add-icon/systemdata.png', 'images/icon/systemdata.png', './transassembly/kafkaproducer.html', 'kafka生产者', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 30)

GO

INSERT INTO dxp_subassembly VALUES ('9bae560a-884a-4d81-87bc-248c28374b32', '删除', 'Delete', 'com.epoint.dxp.development.trans.steps.DeleteFieldStep', 'images/add-icon/del.png', 'images/icon/del.png', './transassembly/delete.html', '删除组件', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 110)

GO

INSERT INTO dxp_subassembly VALUES ('a209c202-a468-44ee-a19e-090e6c7fbe58', '检查表是否存在', 'TableExists', 'com.epoint.dxp.development.trans.steps.TableExistsStep', 'images/add-icon/tableexists.png', 'images/icon/tableexists.png', './transassembly/tableexists.html', '检查表是否存在', 1, '60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', 50)

GO

INSERT INTO dxp_subassembly VALUES ('b21d06fc-4fb1-4ce4-82f3-664ff0463ab3', '将字段值设置为常量', 'SetValueConstant', 'com.epoint.dxp.development.trans.steps.SetValueConstantStep', 'images/add-icon/setvalueconstant.png', 'images/icon/setvalueconstant.png', './transassembly/setvalueconstant.html', '将字段值设置为常量', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 50)

GO

INSERT INTO dxp_subassembly VALUES ('b600d82e-5f6b-4868-b633-ac01e5ee3d2b', '数据库查询', 'DBLookup', 'com.epoint.dxp.development.trans.steps.DatabaseLookupStep', 'images/add-icon/input-table.png', 'images/icon/input-table.png', './transassembly/databasequery.html', '允许在数据库表中查找值', 1, '60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', 100)

GO

INSERT INTO dxp_subassembly VALUES ('baef5f95-d372-4ec8-a079-7c99cfee2af4', '数据同步', 'EpointSynchronizeAfterMerge', 'com.epoint.dxp.development.trans.steps.SynchrodataStep', 'images/add-icon/synchrodata.png', 'images/icon/synchrodata.png', './transassembly/synchrodata.html', '数据同步组件', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 90)

GO

INSERT INTO dxp_subassembly VALUES ('c150e1c8-a0f4-4743-8a35-c040918131b7', 'RESTclient', 'Rest', 'com.epoint.dxp.development.trans.steps.RestStep', 'images/add-icon/restclient.png', 'images/icon/restclient.png', './transassembly/rest.html', 'RESTclient', 1, '60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', 80)

GO

INSERT INTO dxp_subassembly VALUES ('c24718bd-75e2-49cf-8809-93efa9761c93', '过滤记录', 'FilterRows', 'com.epoint.dxp.development.trans.steps.FilterRowsStep', 'images/add-icon/filterrows.png', 'images/icon/filterrows.png', './transassembly/filterrows.html', '过滤记录', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 90)

GO

INSERT INTO dxp_subassembly VALUES ('c8d06deb-410f-4ccb-a491-8cba20ca9462', '调用DB存储过程', 'DBProc', 'com.epoint.dxp.development.trans.steps.DBProcStep', 'images/add-icon/dbproc.png', 'images/icon/dbproc.png', './transassembly/dbproc.html', '通过调用数据库存储过程获得返回值', 1, '60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', 70)

GO

INSERT INTO dxp_subassembly VALUES ('cae1ea16-7589-4025-9f3f-2be3ce819368', '值映射', 'ValueMapper', 'com.epoint.dxp.development.trans.steps.ValueMappingStep', 'images/add-icon/value-icon.png', 'images/icon/value-icon.png', './transassembly/valueMapping.html', '值映射组件', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 130)

GO

INSERT INTO dxp_subassembly VALUES ('ce2a2160-8ce5-44f6-b594-85a39c7a5583', '空操作', 'Dummy', 'com.epoint.dxp.development.trans.steps.dummyStep', 'images/add-icon/dummy.png', 'images/icon/dummy.png', '', '空操作组件', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 110)

GO

INSERT INTO dxp_subassembly VALUES ('d63aa6d1-9551-4279-999a-5883d6a2adab', 'xml解析', 'getXMLData', 'com.epoint.dxp.development.trans.steps.GetXmlDataStep', 'images/add-icon/getdatafromxml.png', 'images/icon/getdatafromxml.png', './transassembly/getxmldata.html', 'XML解析', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 60)

GO

INSERT INTO dxp_subassembly VALUES ('d97cdaac-7d9d-4f53-8da1-6e86f8039b7d', '插入更新', 'InsertUpdate', 'com.epoint.dxp.development.trans.steps.InsertAndUpdateStep', 'images/add-icon/updata.png', 'images/icon/updata.png', './transassembly/insertandupdate.html', '利用查询关键字在表中搜索行，进行插入和更新操作', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 100)

GO

INSERT INTO dxp_subassembly VALUES ('dcf73d21-6fe7-4fa4-a441-fd80611a8a7e', 'hadoopfileoutput', 'HadoopFileOutputPlugin', 'com.epoint.dxp.development.trans.steps.HadoopFileOutputStep', 'images/add-icon/hadoop-file-output.png', 'images/icon/hadoop-file-output.png', './transassembly/hadoopfileoutput.html', 'hadoop文件输出（hdfs）', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 20)

GO

INSERT INTO dxp_subassembly VALUES ('df7c26d2-16fb-4613-bae3-be8b0f322de8', '日期格式化', 'DateChange', 'com.epoint.dxp.development.trans.steps.DateFormatStep', 'images/add-icon/date-change.png', 'images/icon/date-change.png', './transassembly/dateFormat.html', '日期格式化组件', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 110)

GO

INSERT INTO dxp_subassembly VALUES ('e2fe1a28-856f-4a09-b2a5-51903ac97966', '更新', 'Update', 'com.epoint.dxp.development.trans.steps.UpdateStep', 'images/add-icon/updata-icon.png', 'images/icon/updata-icon.png', './transassembly/update.html', '基于关键字更新记录到数据库', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 70)

GO

INSERT INTO dxp_subassembly VALUES ('e3dfa781-4a1e-454e-b655-7fb17230f0a3', '增加序列', 'Sequence', 'com.epoint.dxp.development.trans.steps.AddSequenceStep', 'images/add-icon/add-sequence.png', 'images/icon/add-sequence.png', './transassembly/addsequence.html', '增加序列', 1, '480ee04d-0f7b-4170-80d6-4845a651837a', 40)

GO

INSERT INTO dxp_subassembly VALUES ('ebbac6d1-1f77-4fe8-a8fd-7d462b214f11', 'hadoopfileinput', 'HadoopFileInputPlugin', 'com.epoint.dxp.development.trans.steps.HadoopFileInputStep', 'images/add-icon/hadoop-file-input.png', 'images/icon/hadoop-file-input.png', './transassembly/hadoopfileinput.html', 'hadoop文件输入（hdfs）', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 30)

GO

INSERT INTO dxp_subassembly VALUES ('fa949220-fd7b-444f-8a67-db7cb10a2111', '生成随机数', 'RandomValue', 'com.epoint.dxp.development.trans.steps.RandomDataStep', 'images/add-icon/random.png', 'images/icon/random.png', './transassembly/randomData.html', '随机数组件', 1, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 90)

GO

INSERT INTO dxp_subassembly VALUES ('fd680ade-9a94-4ae8-9649-6fb7b8089bb6', '写日志', 'WriteToLog', 'com.epoint.dxp.development.trans.steps.WriteToLogStep', 'images/add-icon/writetolog.png', 'images/icon/writetolog.png', './transassembly/writetolog.html', '写日志', 1, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 20)

GO

INSERT INTO dxp_subassembly VALUES ('ead070aa-ec32-4203-b263-b95b7f6bc74d', 'EpointJSONInput', 'EpointJsonInput', 'com.epoint.dxp.development.trans.steps.EpointJsonInputStep', 'images/add-icon/jsoninput.png', 'images/icon/jsoninput.png', './transassembly/jsoninput.html', 'JsonInput个性化', 0, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 72)

GO

INSERT INTO dxp_subassembly VALUES ('40c849e0-cab8-4ec9-88af-8ce0a8d2e8f5', 'EpointJsonOutput', 'EpointJsonOutput', 'com.epoint.dxp.development.trans.steps.EpointJsonOutputStep', 'images/add-icon/jsonoutput.png', 'images/icon/jsonoutput.png', './transassembly/jsonoutput.html', 'JsonOutput个性化', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 51)

GO

INSERT INTO dxp_subassembly VALUES ('23a8a9c1-8f07-4634-a97f-c36f216b8b16', 'HTTP client', 'HTTP', 'com.epoint.dxp.development.trans.steps.HTTPClientStep', 'images/add-icon/restclient.png', 'images/icon/restclient.png', './transassembly/httpclient.html', 'REST client', 0, '60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', 75)

GO

INSERT INTO dxp_subassembly VALUES ('2726093d-e43d-4d59-bd94-41eba69ec2dc', '合并记录', 'MergeRows', 'com.epoint.dxp.development.trans.steps.MergeRowsStep', 'images/add-icon/uniqueRows.png', 'images/icon/uniqueRows.png', './transassembly/mergerows.html', '合并记录', 0, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 24)

GO

INSERT INTO dxp_subassembly VALUES ('a1e014a8-a93a-478b-94ac-1fa1315b0d79', 'EpointRest', 'EpointRest', 'com.epoint.dxp.development.trans.steps.EpointRestStep', 'images/add-icon/restclient.png', 'images/icon/restclient.png', './transassembly/epointrest.html', 'EpointRest', 0, '60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', 88)

GO

INSERT INTO dxp_subassembly VALUES ('0702823b-08de-4009-a196-63e97b7ff39b', '正文脱敏', 'TextDesensitization', 'com.epoint.dxp.development.trans.steps.TextDesensitizationStep', 'images/add-icon/jsonoutput.png', 'images/icon/jsonoutput.png', './transassembly/textdesensitization.html', '正文脱敏', 0, '480ee04d-0f7b-4170-80d6-4845a651837a', 56)

GO

INSERT INTO dxp_subassembly VALUES ('51894d23-9c06-44db-8790-f719e19de25c', '添加水印', 'WaterMark', 'com.epoint.dxp.development.trans.steps.WaterMarkStep', 'images/add-icon/jsonoutput.png', 'images/icon/jsonoutput.png', './transassembly/watermark.html', '添加水印', 0, '480ee04d-0f7b-4170-80d6-4845a651837a', 55)

GO

INSERT INTO dxp_subassembly VALUES ('f1a5b45e-6390-483f-acde-b8950a75bffe', '多字段合并', 'ColumnUnit', 'com.epoint.dxp.development.trans.steps.ColumnUnitStep', 'images/add-icon/mergeJoin.png', 'images/icon/mergeJoin.png', './transassembly/columnunit.html', '多字段合并', 0, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 23)

GO

INSERT INTO dxp_subassembly VALUES ('4dfbbc64-c0be-49fb-aff7-b66d583ed6ba', 'OkHttpRest', 'OkhttpRest', 'com.epoint.dxp.development.trans.steps.OkHttpRestStep', 'images/add-icon/restclient.png', 'images/icon/restclient.png', './transassembly/okhttprest.html', 'OkHttpRest', 0, '60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', 85)

GO

INSERT INTO dxp_subassembly VALUES ('f91318e1-4750-4db9-b005-0ce6f366014f', '文本文件输出', 'TextFileOutput', 'com.epoint.dxp.development.trans.steps.TextFileOutputStep', 'images/add-icon/textfile.png', 'images/icon/textfile.png', './transassembly/textfileoutput.html', '文本文件输出', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 52)

GO

INSERT INTO dxp_subassembly VALUES ('475b5bf0-672c-418d-b6cf-223c9865b337', 'hdfs格式化', 'HdfsFormat', 'com.epoint.dxp.development.trans.steps.HdfsFormatStep', 'images/add-icon/date-change.png', 'images/icon/date-change.png', './transassembly/hdfsformat.html', 'hdfs格式化', 0, 'e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', 25)

GO

INSERT INTO dxp_subassembly VALUES ('18cba338-e585-4d28-9661-f9a9960f7501', '数据脱敏', 'DataDesensitization', 'com.epoint.dxp.development.trans.steps.DataDesensitzationStep', 'images/add-icon/jsonoutput.png', 'images/icon/jsonoutput.png', './transassembly/datadesensitization.html', '数据脱敏', 0, '480ee04d-0f7b-4170-80d6-4845a651837a', 52)


GO

INSERT INTO dxp_subassembly VALUES ('485ece1d-1e3a-4aca-a037-22aef9d9e38c', 'MongoDB Output', 'MongoDbOutput', 'com.epoint.dxp.development.trans.steps.MongoDbOutputStep', 'images/add-icon/table-put.png', 'images/icon/table-put.png', './transassembly/mongodboutput.html', 'Mongodb输出', 0, '2c700a9c-18c1-4674-a67f-b884d8ce499f', 25)

GO

INSERT INTO dxp_subassembly VALUES ('6848c942-b178-46b5-a9ae-b0c3b7fcc7e6', 'MongoDB Input', 'MongoDbInput', 'com.epoint.dxp.development.trans.steps.MongoDbInputStep', 'images/add-icon/input-table.png', 'images/icon/input-table.png', './transassembly/mongodbinput.html', 'mongodb输入', 0, 'c70c5849-ae73-4a4b-b8b2-23a7a00e7551', 25)

GO

--添加组件分组表
CREATE TABLE dxp_subassembly_group  (
  rowguid varchar(50)  PRIMARY KEY ,
  groupname varchar(100) ,
  typeicon varchar(500) ,
  plugintype varchar(50),
  ordernum int 
)

GO
-- ----------------------------
-- Records of dxp_subassembly_group
-- ----------------------------
INSERT INTO dxp_subassembly_group VALUES ('267e8944-52a7-4e37-8404-d1502b96901a', '文件传输', 'images/add-icon/flow.png', 'job', 180)

GO

INSERT INTO dxp_subassembly_group VALUES ('2c700a9c-18c1-4674-a67f-b884d8ce499f', '输出组件', 'images/add-icon/output.png', 'trans', 90)

GO


INSERT INTO dxp_subassembly_group VALUES ('30a1d2b6-062e-4efe-9142-f6e39a64c293', '条件组件', 'images/add-icon/flow.png', 'job', 190)

GO

INSERT INTO dxp_subassembly_group VALUES ('480ee04d-0f7b-4170-80d6-4845a651837a', '转换组件', 'images/add-icon/change.png', 'trans', 80)

GO

INSERT INTO dxp_subassembly_group VALUES ('60e1fc55-2a6a-437f-b977-f1d5f6d3ec19', '查询组件', 'images/add-icon/interface.png', 'trans', 60)

GO

INSERT INTO dxp_subassembly_group VALUES ('9c7ae2c5-3a06-49a8-b6cf-88caf84148dc', '脚本组件', 'images/add-icon/foot.png', 'trans', 50)

GO

INSERT INTO dxp_subassembly_group VALUES ('c70c5849-ae73-4a4b-b8b2-23a7a00e7551', '输入组件', 'images/add-icon/input.png', 'trans', 100)

GO

INSERT INTO dxp_subassembly_group VALUES ('d30a5f63-763d-48bd-ad72-2126b464d0b2', '通用组件', 'images/add-icon/flow.png', 'job', 200)

GO

INSERT INTO dxp_subassembly_group VALUES ('e8c9f66d-1c52-4065-94dd-e26f2f6c2e39', '应用组件', 'images/add-icon/flow.png', 'trans', 70)

GO

INSERT INTO frame_module VALUES ('fbf23e51-1eae-4492-b2a2-dfaa20d66aa5', '999901090002', '开发组件管理', '', 'dxp/development/devsubassemblymanager', 0, 0, 0, '', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

-- DELIMITER  --