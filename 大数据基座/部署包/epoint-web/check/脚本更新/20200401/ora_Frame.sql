-- 2020/04/01
-- 【内容简单介绍】改造工作流为存储过程启动，新增存储过程 --【季海英】

-- 添加存储过程CreatePVI
CREATE OR REPLACE PROCEDURE CreatePVI(T_ProcessGuid                IN NVARCHAR2,
                                      T_ProcessVersionInstanceGuid IN NVARCHAR2,
                                      T_UserGuid                   IN NVARCHAR2,
                                      T_UserName                   IN NVARCHAR2,
                                      T_WorkItemGuid               IN NVARCHAR2,
                                      T_OuGuid                     IN NVARCHAR2) AS
  T_ErrorMsg NVARCHAR2(50);

  /****** 流程版本******/
  T_ProcessVersionGuid NVARCHAR2(50);

  /****** 过程实例名称******/
  T_InstanceName NVARCHAR2(50);

  /****** 新增时间=当前时间******/
  T_AddDate date;

  /****** 材料id******/
  T_MaterialInstanceGuid NVARCHAR2(50);

  /****** 开始活动实例******/
  T_StartActivityInstanceGuid NVARCHAR2(50);

  /****** 开始活动Guid******/
  T_StartActivityGuid NVARCHAR2(50);
  /****** 开始活动名称******/
  T_StartActivityName NVARCHAR2(50);

  /****** 第一步流程活动实例Guid******/
  T_FirstActivityInstanceGuid NVARCHAR2(50);

  /****** 第一步流程活动Guid******/
  T_FirstActivityGuid NVARCHAR2(50);

  /******  开始到第一步的变迁******/
  T_TransitionGuid NVARCHAR2(50);

  /****** 第一步流程活动名称******/
  T_FirstActivityName NVARCHAR2(50);

  /****** 第一个活动的操作处理页面******/
  T_HandleURL NVARCHAR2(500);

  /****** 工作项名称******/
  T_WorkItemName NVARCHAR2(500);

  /****** HandleURL的拼接******/
  T_suffixStr        NVARCHAR2(500);
  T_Priority         INT;
  T_WorkItemModeName NVARCHAR2(50);
  /****** 消息guid******/
  T_WaitHandleGuid NVARCHAR2(50);
  /****** 版本名******/
  T_ProcessVersionName NVARCHAR2(50);
  /******移动端处理页面地址******/
  T_MobileHandleURL NVARCHAR2(500);

BEGIN
  SELECT ProcessVersionGuid, ProcessVersionName
    INTO T_ProcessVersionGuid, T_ProcessVersionName
    FROM Workflow_ProcessVersion
   WHERE STATUS = '10'
     AND ProcessGuid = T_ProcessGuid;

  IF T_ProcessVersionGuid = '' THEN
  
    T_ErrorMsg := '没有找到活动的流程版本';
  
  END IF;

  /****** 过程实例名称******/
  SELECT PROCESSNAME
    INTO T_InstanceName
    FROM Workflow_Process
   WHERE ProcessGuid = T_ProcessGuid;

  /****** 新增时间=当前时间******/
  T_AddDate := sysdate;

  /****** 材料id******/
 T_MaterialInstanceGuid := SYS_GUID();
  /****** 开始活动实例******/
  T_StartActivityInstanceGuid := SYS_GUID();

  /****** 开始活动Guid******/
  SELECT ActivityGuid, ActivityName
    INTO T_StartActivityGuid, T_StartActivityName
    FROM Workflow_Activity
   WHERE ProcessVersionGuid = T_ProcessVersionGuid
     AND ActivityType = 10;

  IF T_StartActivityGuid = '' THEN
  
    T_ErrorMsg := '没有找到开始活动';
  
  END IF;

  /****** 第一步流程活动实例Guid******/
  T_FirstActivityInstanceGuid := SYS_GUID();

  /****** 第一步流程活动Guid,活动名称，******/
  SELECT TransitionGuid, ToActivityGuid, WorkItemModeName
    INTO T_TransitionGuid, T_FirstActivityGuid, T_WorkItemModeName
    FROM Workflow_Transition
   WHERE FromActivityGuid = T_StartActivityGuid
     AND Is_ShowAsOperationButton = 20;

  IF (T_TransitionGuid = '' OR T_FirstActivityGuid = '') THEN
  
    T_ErrorMsg := '开始活动没有后续活动!';
  
  END IF;

  /****** 第一步流程活动名称******/
  SELECT ActivityName, HandleURL, Priority, MobileHandleURL
    INTO T_FirstActivityName, T_HandleURL, T_Priority, T_MobileHandleURL
    FROM Workflow_Activity
   WHERE ActivityGuid = T_FirstActivityGuid;

  /****** 工作项名称******/
  T_WorkItemName := '【' || T_FirstActivityName || '】<未提交的' ||
                    T_InstanceName || '>';

  /****** HandleURL的拼接******/
  T_suffixStr := 'ProcessVersionInstanceGuid=' ||
                 T_ProcessVersionInstanceGuid || '&' || 'WorkItemGuid=' ||
                 T_WorkItemGuid;

  /****** TODO IF (T_HandleURL='[--=FirstMaterialUrl--]') then******/
  IF (instr('?', T_HandleURL) > 0) THEN
  
    T_HandleURL := T_HandleURL || '&' || T_suffixStr;
  
  ELSE
  
    T_HandleURL := T_HandleURL || '?' || T_suffixStr;
  
  END IF;

  /****** 消息guid******/
  T_WaitHandleGuid := SYS_GUID();

  /****** 移动端处理页面地址******/
  /****** TODO IF (T_MobileHandleURL='[#=FirstMaterialUrl#]') then******/
  IF (instr('?', T_MobileHandleURL) > 0) THEN
  
    T_MobileHandleURL := T_MobileHandleURL || '&' || T_suffixStr;
  
  ELSE
  
    T_MobileHandleURL := T_MobileHandleURL || '?' || T_suffixStr;
  END IF;

  /******处理T_WorkItemModeName******/
  IF (T_WorkItemModeName IS NULL OR T_WorkItemModeName = '') THEN
  
    T_WorkItemModeName := '办理';
  
  ELSIF T_WorkItemModeName = '阅读' THEN
  
    T_WorkItemModeName := '阅读';
  
  ELSE
  
    T_WorkItemModeName := '办理';
  
  END IF;
  /****** 0.==========================================================开始=======================================******/
  /****** 1.初始化PVI dbo.Workflow_PVI  ******/
  INSERT INTO Workflow_PVI
    (ProcessVersionInstanceGuid,
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
     lockstatus)
  VALUES
    (T_ProcessVersionInstanceGuid,
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
     '20');

  /****** 2.初始化相关数据 dbo.Workflow_Context_Value  ******/
  INSERT INTO Workflow_Context_Value
    (FieldGuid,
     ProcessVersionInstanceGuid,
     FieldName,
     FieldType,
     FieldValue)
    SELECT SYS_GUID(),
           T_ProcessVersionInstanceGuid,
           FieldName,
           FieldType,
           FieldValue
      FROM Workflow_Context
     WHERE ProcessVersionGuid = T_ProcessVersionGuid;

  /****** 3.初始化流程材料 dbo.Workflow_PVI_Material  ******/
  INSERT INTO Workflow_PVI_Material
    (MaterialInstanceGuid,
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
     Is_InitMisTable)
    SELECT T_MaterialInstanceGuid,
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
           /****** TODO PageUrl_Read这个可能没有值******/
           PageUrl_Read,
           PageUrl_Print,
           10,
           Is_ShowInGrid,
           ClientTag,
           Is_InitMisTable
      FROM Workflow_PV_Material
     WHERE MaterialGuid IN
           (SELECT MaterialGuid
              FROM Workflow_PV_Material
             WHERE ProcessVersionGuid = T_ProcessVersionGuid
               AND STATUS = 10
               AND MainPVActivityGuid IS NULL);

 
  
  /****** 分割线******/
  /****** 5.新建开始活动实例 dbo.Workflow_Activity_Instance  ******/
  INSERT INTO Workflow_Activity_Instance
    (ActivityInstanceGuid,
     ProcessVersionGuid,
     ProcessVersionInstanceGuid,
     SubProcessVersionInstanceGuid,
     ActivityGuid,
     StartDate,
     ENDTIME,
     STATUS,
     RollBackTag,
     Note)
  VALUES
    (T_StartActivityInstanceGuid,
     T_ProcessVersionGuid,
     T_ProcessVersionInstanceGuid,
     '',
     T_StartActivityGuid,
     T_AddDate,
     T_AddDate,
     80,
     20,
     '');

  /****** 6.新建第一个活动实例 dbo.Workflow_Activity_Instance  ******/
  INSERT INTO Workflow_Activity_Instance
    (ActivityInstanceGuid,
     ProcessVersionGuid,
     ProcessVersionInstanceGuid,
     SubProcessVersionInstanceGuid,
     ActivityGuid,
     StartDate,
     STATUS,
     RollBackTag,
     Note)
  VALUES
    (T_FirstActivityInstanceGuid,
     T_ProcessVersionGuid,
     T_ProcessVersionInstanceGuid,
     '',
     T_FirstActivityGuid,
     T_AddDate,
     20,
     20,
     '');

  /****** 7.新建变迁实例 dbo.Workflow_Transition_Instance  ******/
  INSERT INTO Workflow_Transition_Instance
    (TransitionInstanceGuid,
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
     Direction)
  VALUES
    (SYS_GUID(),
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
     10);

  /****** 新建工作项 dbo.Workflow_WorkItem  ******/
  INSERT INTO Workflow_WorkItem
    (WorkItemGuid,
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
     OVERTIMEPOINT,
     EARLYWARNINGPOINT,
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
     Note,
     OUGUID)
  VALUES
    (T_WorkItemGuid,
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
     T_AddDate,
     -1,
     -1,
     55,
     '1753-01-01 00:00:00',
     '1753-01-01 00:00:00',
     20, /****** 否******/
     20, /****** 否******/
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
     '',
     T_OuGuid);

  /****** 新建待办事宜 dbo.Messages_Center  ******/
  INSERT INTO Messages_Center
    (MessageItemGuid,
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
     earlywarningpoint,
     WorkItemGuid,
     mobilehandletype,
     mobilehandleurl,
     messagesremindtype)
  VALUES
    (T_WaitHandleGuid,
     T_WorkItemName,
     T_WorkItemModeName,
     '办理',
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
     NULL,
     T_WorkItemGuid,
     'none',
     T_MobileHandleURL,
     'waithandle');

end;