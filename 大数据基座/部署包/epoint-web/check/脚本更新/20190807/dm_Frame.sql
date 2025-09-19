-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/08/07
-- 工作流部门岗位逻辑相关功能添加字段 --季立霞

-- 角色添加是否是职位标记字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_role') and column_name = upper('isjobflag');
  if (isexist = 0) then
    execute immediate 'alter table frame_role add isjobflag nvarchar2(4)';
  end if;
  en
end;
/* GO */


-- 角色快照表添加是否是职位标记字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_role_snapshot') and column_name = upper('isjobflag');
  if (isexist = 0) then
    execute immediate 'alter table frame_role_snapshot add isjobflag nvarchar2(4)';
  end if;
  end;
end;
/* GO */


-- 活动预处理人表添加角色guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_participator') and column_name = upper('roleguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_participator add roleguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 工作项表添加角色guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_workitem') and column_name = upper('roleguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_workitem add roleguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 工作项历史表添加角色guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_workitem_history') and column_name = upper('roleguid');
  if (isexist = 0) then
    execute immediate 'alter table workflow_workitem_history add roleguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- 待办表添加角色guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_center') and column_name = upper('roleguid');
  if (isexist = 0) then
    execute immediate 'alter table messages_center add roleguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 待办历史表添加角色guid字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_center_histroy') and column_name = upper('roleguid');
  if (isexist = 0) then
    execute immediate 'alter table messages_center_histroy add roleguid nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- end;


