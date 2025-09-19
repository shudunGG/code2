-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/01/16 
-- 【内容简单介绍】改造工作流为存储过程启动，新增存储过程 --【季海英】

-- 添加存储过程CreatePVI

drop procedure if exists CreatePVI;
GO
CREATE PROCEDURE CreatePVI (
	T_ProcessGuid VARCHAR (50),
	T_ProcessVersionInstanceGuid VARCHAR (50),
	T_UserGuid VARCHAR (50),
	T_UserName VARCHAR (100),
	T_WorkItemGuid VARCHAR (50),
	T_OuGuid VARCHAR (50)
)
BEGIN
	DECLARE
		T_ErrorMsg VARCHAR (50);

/****** 流程版本 ******/
DECLARE
	T_ProcessVersionGuid VARCHAR (50);

DECLARE
	/******过程实例名称 ******/
	T_InstanceName VARCHAR (50);

DECLARE
	/******新增时间=当前时间 ******/
	T_AddDate datetime;

DECLARE
	/******材料id ******/
	T_MaterialInstanceGuid VARCHAR (50);

DECLARE
	/******开始活动实例 ******/
	T_StartActivityInstanceGuid VARCHAR (50);

DECLARE
	/******开始活动Guid ******/
	T_StartActivityGuid VARCHAR (50);

DECLARE
	/******开始活动名称 ******/
	T_StartActivityName VARCHAR (50);

DECLARE
	/******第一步流程活动实例Guid ******/
	T_FirstActivityInstanceGuid VARCHAR (50);

DECLARE
	/******第一步流程活动Guid ******/
	T_FirstActivityGuid VARCHAR (50);

DECLARE
	/****** 开始到第一步的变迁 ******/
	T_TransitionGuid VARCHAR (50);

DECLARE
	/******第一步流程活动名称 ******/
	T_FirstActivityName VARCHAR (50);

DECLARE
	/******第一个活动的操作处理页面 ******/
	T_HandleURL VARCHAR (500);

DECLARE
	/******工作项名称 ******/
	T_WorkItemName VARCHAR (500);

DECLARE
	/******HandleURL的拼接 ******/
	T_suffixStr VARCHAR (500);

DECLARE
	T_Priority INT;

DECLARE
	T_WorkItemModeName VARCHAR (50);

DECLARE
	/******消息guid ******/
	T_WaitHandleGuid VARCHAR (50);

DECLARE
	/******版本名 ******/
	T_ProcessVersionName VARCHAR (50);

SELECT
	ProcessVersionGuid,
	ProcessVersionName INTO T_ProcessVersionGuid,
	T_ProcessVersionName
FROM
	Workflow_ProcessVersion
WHERE
	STATUS = '10'
AND ProcessGuid = T_ProcessGuid;


IF T_ProcessVersionGuid = '' THEN

SET T_ErrorMsg = '没有找到活动的流程版本';


END
IF;

/******过程实例名称 ******/
SELECT
	PROCESSNAME INTO T_InstanceName
FROM
	Workflow_Process
WHERE
	ProcessGuid = T_ProcessGuid;

/******新增时间=当前时间 ******/
SET T_AddDate = now();

/******材料id ******/
SET T_MaterialInstanceGuid = uuid();

/******开始活动实例 ******/
SET T_StartActivityInstanceGuid = uuid();

/******开始活动Guid ******/
SELECT
	ActivityGuid,
	ActivityName INTO T_StartActivityGuid,
	T_StartActivityName
FROM
	Workflow_Activity
WHERE
	ProcessVersionGuid = T_ProcessVersionGuid
AND ActivityType = 10;


IF T_StartActivityGuid = '' THEN

SET T_ErrorMsg = '没有找到开始活动';


END
IF;

/******第一步流程活动实例Guid ******/
SET T_FirstActivityInstanceGuid = uuid();

/******第一步流程活动Guid,活动名称， ******/
SELECT
	TransitionGuid,
	ToActivityGuid,
	WorkItemModeName INTO T_TransitionGuid,
	T_FirstActivityGuid,
	T_WorkItemModeName
FROM
	Workflow_Transition
WHERE
	FromActivityGuid = T_StartActivityGuid
AND Is_ShowAsOperationButton = 20;


IF (
	T_TransitionGuid = ''
	OR T_FirstActivityGuid = ''
) THEN

SET T_ErrorMsg = '开始活动没有后续活动!';


END
IF;

/******第一步流程活动名称 ******/
SELECT
	ActivityName,
	HandleURL,
	Priority INTO T_FirstActivityName,
	T_HandleURL,
	T_Priority
FROM
	Workflow_Activity
WHERE
	ActivityGuid = T_FirstActivityGuid;

/******工作项名称 ******/
SET T_WorkItemName = CONCAT(
	'【',
	T_FirstActivityName,
	'】',
	T_InstanceName
);

/******HandleURL的拼接 ******/
SET T_suffixStr = CONCAT(
	'ProcessVersionInstanceGuid=',
	T_ProcessVersionInstanceGuid,
	'&WorkItemGuid=',
	T_WorkItemGuid
);

/******TODO IF (T_HandleURL='[#=FirstMaterialUrl#]') then ******/
IF (instr('?', T_HandleURL) > 0) THEN

SET T_HandleURL = CONCAT(
	T_HandleURL,
	'&',
	T_suffixStr
);


ELSE

SET T_HandleURL = CONCAT(
	T_HandleURL,
	'?',
	T_suffixStr
);


END
IF;

/******消息guid ******/
SET T_WaitHandleGuid = uuid();

SELECT
	T_HandleURL;

/****** 0.==========================================================开始=======================================******/
/****** 1.初始化PVI dbo.Workflow_PVI  ******/
INSERT INTO Workflow_PVI (
	ProcessVersionInstanceGuid,
	ProcessVersionInstanceName,
	ProcessVersionGuid,
	Initiator,
	StartDate,
	STATUS,
	Is_SubProcessVersionInstance,
	ActivityGuid_Callme,
	ActivityInstanceGuid_Callme,
	SyncType,
	Note,
	ProcessGuid,
	Is_NeedSendEarlyWarning,
	Is_NeedSendOverTimeNotify,
	MainPVIGuid,
	MainPVActivityGuid,
	lockstatus
)
VALUES
	(
		T_ProcessVersionInstanceGuid,
		T_InstanceName,
		T_ProcessVersionGuid,
		T_UserGuid,
		T_AddDate,
		10,
		20,
		'',
		'',
		10,
		'',
		T_ProcessGuid,
		20,
		20,
		'',
		'',
		'20'
	);

/****** 2.初始化相关数据 dbo.Workflow_Context_Value  ******/
INSERT INTO Workflow_Context_Value (
	FieldGuid,
	ProcessVersionInstanceGuid,
	FieldName,
	FieldType,
	FieldValue
) SELECT
	UUID(),
	T_ProcessVersionInstanceGuid,
	FieldName,
	FieldType,
	FieldValue
FROM
	Workflow_Context
WHERE
	ProcessVersionGuid = T_ProcessVersionGuid;

/****** 3.初始化流程材料 dbo.Workflow_PVI_Material  ******/
INSERT INTO Workflow_PVI_Material (
	MaterialInstanceGuid,
	MaterialInstanceName,
	AddDate,
	Is_Defined,
	ProcessVersionInstanceGuid,
	MaterialGuid,
	MaterialName,
	Source,
	Type,
	AttachStorageInfoGroupGuid,
	PageUrl_ReadAndWrite,
	PageUrl_Read,
	PageUrl_Print,
	STATUS,
	IS_ShowInGrid,
	ClientTag,
	Is_InitMisTable
) SELECT
	T_MaterialInstanceGuid,
	MaterialName,
	T_AddDate,
	10,
	T_ProcessVersionInstanceGuid,
	MaterialGuid,
	MaterialName,
	Source,
	Type,
	'',
	PageUrl_ReadAndWrite,
	PageUrl_Read,
	PageUrl_Print,
	10,
	Is_ShowInGrid,
	ClientTag,
	Is_InitMisTable
FROM
	Workflow_PV_Material
WHERE
	MaterialGuid IN (
		SELECT
			MaterialGuid
		FROM
			Workflow_PV_Material
		WHERE
			ProcessVersionGuid = T_ProcessVersionGuid
		AND STATUS = 10
		AND MainPVActivityGuid IS NULL
	);

/****** 4. Workflow_PVI_MisTableRow  ******/
INSERT INTO Workflow_PVI_MisTableRow (
	MaterialInstanceGuid,
	TableID,
	SQL_TableName,
	PVIGuid,
	MisTableSetInstanceGuid
) SELECT
	T_MaterialInstanceGuid,
	TableID,
	SQL_TableName,
	T_ProcessVersionInstanceGuid,
	UUID()
FROM
	Workflow_PV_MisTableSet
WHERE
	MaterialGuid IN (
		SELECT
			MaterialGuid
		FROM
			Workflow_PV_Material
		WHERE
			ProcessVersionGuid = T_ProcessVersionGuid
		AND STATUS = 10
		AND MainPVActivityGuid IS NULL
	);

/****** 分割线******/
/****** 5.新建开始活动实例 dbo.Workflow_Activity_Instance  ******/
INSERT INTO Workflow_Activity_Instance (
	ActivityInstanceGuid,
	ProcessVersionGuid,
	ProcessVersionInstanceGuid,
	SubProcessVersionInstanceGuid,
	ActivityGuid,
	StartDate,
	STATUS,
	RollBackTag,
	Note
)
VALUES
	(
		T_StartActivityInstanceGuid,
		T_ProcessVersionGuid,
		T_ProcessVersionInstanceGuid,
		'',
		T_StartActivityGuid,
		T_AddDate,
		80,
		20,
		''
	);

/****** 6.新建第一个活动实例 dbo.Workflow_Activity_Instance  ******/
INSERT INTO Workflow_Activity_Instance (
	ActivityInstanceGuid,
	ProcessVersionGuid,
	ProcessVersionInstanceGuid,
	SubProcessVersionInstanceGuid,
	ActivityGuid,
	StartDate,
	STATUS,
	RollBackTag,
	Note
)
VALUES
	(
		T_FirstActivityInstanceGuid,
		T_ProcessVersionGuid,
		T_ProcessVersionInstanceGuid,
		'',
		T_FirstActivityGuid,
		T_AddDate,
		20,
		20,
		''
	);

/****** 7.新建变迁实例 dbo.Workflow_Transition_Instance  ******/
INSERT INTO Workflow_Transition_Instance (
	TransitionInstanceGuid,
	TransitionGuid,
	ProcessVersionInstanceGuid,
	SourceActiviryGuid,
	SourceActiviryName,
	SrcActInstGuid,
	SrcActInstName,
	TargetActivityGuid,
	TargetActivityName,
	TgtActInstGuid,
	TgtActInstName,
	Type,
	TransitDate,
	Direction
)
VALUES
	(
		uuid(),
		T_TransitionGuid,
		T_ProcessVersionInstanceGuid,
		T_StartActivityGuid,
		T_StartActivityName,
		T_StartActivityInstanceGuid,
		T_StartActivityName,
		T_FirstActivityGuid,
		T_FirstActivityName,
		T_FirstActivityInstanceGuid,
		T_FirstActivityName,
		20,
		T_AddDate,
		10
	);

/****** 新建工作项 dbo.Workflow_WorkItem  ******/
INSERT INTO Workflow_WorkItem (
	WorkItemGuid,
	ActivityGuid,
	ActivityName,
	ActivityInstanceGuid,
	WorkItemName,
	WorkItemType,
	WorkItemModeName,
	HandleURL,
	STATUS,
	Priority,
	SenderGuid,
	SenderName,
	Transactor,
	TransactorName,
	JobGuid,
	WaitHandleGuid,
	CreateDate,
	LimitMinutes,
	TimeLimit,
	TimeLimitUnit,
	Is_NeedSendEarlyWarning,
	Is_NeedSendOverTimeNotify,
	ProcessGuid,
	ProcessVersionGuid,
	ProcessVersionName,
	ProcessVersionInstanceGuid,
	ProcessVersionInstanceName,
	GroupGuid,
	AgentForUserGuid,
	AgentForWorkItemGuid,
	OperatorForDisplayGuid,
	OperatorForDisplayName,
	Note
)
VALUES
	(
		T_WorkItemGuid,
		T_FirstActivityGuid,
		T_FirstActivityName,
		T_FirstActivityInstanceGuid,
		T_WorkItemName,
		'FirstWorkItem',
		T_WorkItemModeName,
		T_HandleURL,
		10,
		T_Priority,
		T_UserGuid,
		T_UserName,
		T_UserGuid,
		T_UserName,
		'',
		T_WaitHandleGuid,
		T_AddDate ,- 1 ,- 1,
		50,
		20,
		20,
		T_ProcessGuid,
		T_ProcessVersionGuid,
		T_ProcessVersionName,
		T_ProcessVersionInstanceGuid,
		T_InstanceName,
		'',
		'',
		'',
		T_UserGuid,
		T_UserName,
		''
	);

/****** 新建待办事宜 dbo.Messages_Center  ******/
INSERT INTO Messages_Center (
	MessageItemGuid,
	Title,
	MessageType,
	Content,
	SendMode,
	GenerateDate,
	IsSchedule,
	ScheduleSendDate,
	MessageTarget,
	TargetUser,
	TargetDispName,
	FromUser,
	FromDispName,
	FromMobile,
	HandleUrl,
	BeiZhu,
	OuGuid,
	BaseOuGuid,
	IsShow,
	JobGuid,
	HandleType,
	ClientIdentifier,
	ClientTag,
	IsDel,
	IsNoHandle,
	PVIGuid,
	overtimepoint,
	earlywarningpoint
)
VALUES
	(
		T_WaitHandleGuid,
		T_WorkItemName,
		T_WorkItemModeName,
		'',
		4,
		T_AddDate,
		0,
		NULL,
		'',
		T_UserGuid,
		T_UserName,
		T_UserGuid,
		T_UserName,
		'',
		T_HandleUrl,
		T_FirstActivityName,
		T_OuGuid,
		'',
		0,
		'',
		T_WorkItemModeName,
		T_ProcessGuid,
		'',
		0,
		0,
		T_ProcessVersionInstanceGuid,
		NULL,
		NULL
	);


END;

GO
-- DELIMITER ; --