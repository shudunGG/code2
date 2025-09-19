--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER  注释去除即可 --
-- DELIMITER GO --

CREATE TABLE dxp_subassemblyforhive (
  rowGuid varchar(50) PRIMARY KEY ,
  pluginName varchar(255) NOT NULL,
  stepType varchar(255) DEFAULT NULL,
  classpath varchar(255) DEFAULT NULL,
  iconsmall varchar(255) DEFAULT NULL,
  icon varchar(255) DEFAULT NULL,
  url varchar(255) DEFAULT NULL,
  introduce varchar(500) DEFAULT NULL,
  groupguid varchar(50) DEFAULT NULL,
  orderNum int DEFAULT NULL,
  jarclasspath varchar(255) DEFAULT NULL,
  hivedsid int DEFAULT NULL ,
  functionname varchar(255) DEFAULT NULL,
  functionparams varchar(500) DEFAULT NULL,
  hdfsdsid int DEFAULT NULL,
  maxLinks int DEFAULT NULL,
  maxInputLinks int DEFAULT NULL,
  enable int DEFAULT NULL
)


GO

INSERT INTO dxp_subassemblyforhive VALUES('110a4aa7-6acc-47aa-afb6-34f24b27f9c3', '行筛选', NULL, 'com.epoint.dxp.development.hive.flow.steps.FilterRowStep', 'images/add-icon/filterrows.png', 'images/icon/filterrows.png', 'dxp/development/hiveflowassembly/filterrows', '行筛选', '5269a595-3266-4929-a9b5-86c97e1be70e', 100, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('40eeee42-ff6b-4e65-bdf1-eb8455b6e17f', '列筛选', NULL, 'com.epoint.dxp.development.hive.flow.steps.FilterColumnStep', 'images/add-icon/filterrows.png', 'images/icon/filterrows.png', 'dxp/development/hiveflowassembly/filtercolumn', '列筛选', '5269a595-3266-4929-a9b5-86c97e1be70e', 80, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('448a14fc-2865-4673-9185-9dd0513b3173', '列合并', NULL, 'com.epoint.dxp.development.hive.flow.steps.ColumnUnionStep', 'images/add-icon/uniqueRows.png', 'images/add-icon/uniqueRows.png', 'dxp/development/hiveflowassembly/columnunion', '列合并', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 100, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('5d0d612e-48cc-4ad2-9f42-735d4fb8c5fa', '行数筛选', NULL, 'com.epoint.dxp.development.hive.flow.steps.FilterRowNumStep', 'images/add-icon/filterrows.png', 'images/icon/filterrows.png', 'dxp/development/hiveflowassembly/filterrownum', '记录行数范围', '5269a595-3266-4929-a9b5-86c97e1be70e', 50, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('693efa2d-d60e-4603-9b64-89a09de65e58', '表输出', NULL, 'com.epoint.dxp.development.hive.flow.steps.TableOutputStep', 'images/add-icon/table-put.png', 'images/icon/table-put.png', 'dxp/development/hiveflowassembly/tableOutput', '表输出', '4c484966-49b1-4af5-8e53-3a9610b1d725', 10, '', NULL, '', '', NULL, 0, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('7ecfe97e-ecdb-44df-b0d9-2dfcd4474b54', '表输入', NULL, 'com.epoint.dxp.development.hive.flow.steps.TableInputStep', 'images/add-icon/input-table.png', 'images/icon/input-table.png', 'dxp/development/hiveflowassembly/tableInput', '表输入', '294820e6-0668-44af-962a-f52507fc9659', 0, '', NULL, '', '', NULL, 1, 0, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('86ba87b1-0c42-46af-8ef4-c0ab83240be9', '分组聚合', NULL, 'com.epoint.dxp.development.hive.flow.steps.GroupByStep', 'images/add-icon/uniqueRows.png', 'images/icon/uniqueRows.png', 'dxp/development/hiveflowassembly/groupby', '分组', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 60, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('87c9778d-ecb8-46e7-8622-f9cf17928d14', '表合并', NULL, 'com.epoint.dxp.development.hive.flow.steps.TableUnionStep', 'images/add-icon/uniqueRows.png', 'images/icon/uniqueRows.png', '', '表合并', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 90, '', NULL, '', '', NULL, 1, -1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('984a6da4-3324-4cbd-ab58-f7e493e7c1a0', '字段联合', NULL, 'com.epoint.dxp.development.hive.flow.steps.FieldUnionStep', 'images/add-icon/uniqueRows.png', 'images/icon/uniqueRows.png', 'dxp/development/hiveflowassembly/fieldunion', '字段联合', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 0, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('adb54d51-d6ec-487d-a6b1-a0a82805080f', '表关联', NULL, 'com.epoint.dxp.development.hive.flow.steps.TableJoinStep', 'images/add-icon/mergeJoin.png', 'images/icon/mergeJoin.png', 'dxp/development/hiveflowassembly/tablejoin', '表关联', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 80, '', NULL, '', '', NULL, 1, 2, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('c8dd5077-302d-47d5-99a5-8470140182ef', '去重组件', NULL, 'com.epoint.dxp.development.hive.flow.steps.DeduplicationRowsStep', 'images/add-icon/uniqueRows.png', 'images/icon/uniqueRows.png', 'dxp/development/hiveflowassembly/deduplicaterows', '去重组件', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 0, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('d9cd7c5d-3f82-4a3d-8a2a-2087aab17bac', '列新增', NULL, 'com.epoint.dxp.development.hive.flow.steps.AddColumnStep', 'images/add-icon/add-sequence.png', 'images/icon/add-sequence.png', 'dxp/development/hiveflowassembly/addcolumn', '列新增', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 70, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('de68e08c-5520-428c-a8c2-96014917531c', '排序组件', NULL, 'com.epoint.dxp.development.hive.flow.steps.OrderByStep', 'images/add-icon/sortRows.png', 'images/icon/sortRows.png', 'dxp/development/hiveflowassembly/orderby', '排序组件', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 0, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassemblyforhive VALUES('e97c72df-1a39-487d-bd87-ad79c980656b', '分组去重', NULL, 'com.epoint.dxp.development.hive.flow.steps.GroupDeduplicateStep', 'images/add-icon/uniqueRows.png', 'images/icon/uniqueRows.png', 'dxp/development/hiveflowassembly/groupdeduplicate', '分组去重组件', '53b46ef1-ad53-4cb2-aa53-2ffa88288c78', 0, '', NULL, '', '', NULL, 1, 1, 1)

GO

INSERT INTO dxp_subassembly_group  VALUES('294820e6-0668-44af-962a-f52507fc9659', '输入组件', 'images/add-icon/input.png', 'function', 100)

GO

INSERT INTO dxp_subassembly_group  VALUES('4c484966-49b1-4af5-8e53-3a9610b1d725', '输出组件', 'images/add-icon/output.png', 'function', 90)

GO

INSERT INTO dxp_subassembly_group  VALUES('5269a595-3266-4929-a9b5-86c97e1be70e', '条件组件', 'images/add-icon/flow.png', 'function', 80)

GO

INSERT INTO dxp_subassembly_group  VALUES('53b46ef1-ad53-4cb2-aa53-2ffa88288c78', '转换组件', 'images/add-icon/change.png', 'function', 70)

GO

INSERT INTO dxp_subassembly_group  VALUES('ecd6a310-c002-45aa-8bc3-8a9dbe9c3bc0', 'UDF函数', 'images/add-icon/flow.png', 'udf', 60)

GO

ALTER TABLE dxp_subassembly ADD COLUMN maxLinks INT default null

GO

ALTER TABLE dxp_subassembly ADD COLUMN maxinputlinks INT default null

GO

ALTER TABLE dxp_subassembly ADD COLUMN enable INT default 1

GO


INSERT INTO frame_module VALUES('3ae7ef9f-05c4-4159-b1c4-06889742149a', '999901090003', 'hive组件管理', '', 'dxp/development/hivesubassemblymanager', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

INSERT INTO frame_moduleright VALUES ('3ae7ef9f-05c4-4159-b1c4-06889742149a', 'All', 'Role', NULL, 'public')

GO

-- DELIMITER  --