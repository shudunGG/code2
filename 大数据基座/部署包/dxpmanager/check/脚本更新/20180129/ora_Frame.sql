-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/02/29
-- soa相关快照表检测并增加主键及唯一键，防止同步后删除所有数据,此脚本会清空快照表，执行完后接入应用需要重启--樊志君
begin
  declare isexist number;
  begin
	  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_ou_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_ou_snapshot';
    execute immediate 'alter table frame_ou_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_ou_snapshot') and t.constraint_name=upper('uq_frame_ou_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_ou_snapshot';
    execute immediate 'alter table frame_ou_snapshot  ADD CONSTRAINT uq_frame_ou_snapshot UNIQUE (ouguid, appkey, clientip)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_ou_e_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_ou_e_snapshot';
    execute immediate 'alter table frame_ou_e_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_ou_e_snapshot') and t.constraint_name=upper('uq_frame_ou_e_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_ou_e_snapshot';
    execute immediate 'alter table frame_ou_e_snapshot  ADD CONSTRAINT uq_frame_ou_e_snapshot UNIQUE (ouguid, appkey, clientip)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_user_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_user_snapshot';
    execute immediate 'alter table frame_user_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_user_snapshot') and t.constraint_name=upper('uq_frame_user_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_user_snapshot';
    execute immediate 'alter table frame_user_snapshot  ADD CONSTRAINT uq_frame_user_snapshot UNIQUE (userguid, appkey, clientip)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_user_e_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_user_e_snapshot';
    execute immediate 'alter table frame_user_e_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_user_e_snapshot') and t.constraint_name=upper('uq_frame_user_e_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_user_e_snapshot';
    execute immediate 'alter table frame_user_e_snapshot  ADD CONSTRAINT uq_frame_user_e_snapshot UNIQUE (userguid, appkey, clientip)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_secondou_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_secondou_snapshot';
    execute immediate 'alter table frame_secondou_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_secondou_snapshot') and t.constraint_name=upper('uq_frame_secondou_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_secondou_snapshot';
    execute immediate 'alter table frame_secondou_snapshot  ADD CONSTRAINT uq_frame_secondou_snapshot UNIQUE (userguid, ouguid, appkey, clientip)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_roletype_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_roletype_snapshot';
    execute immediate 'alter table frame_roletype_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_roletype_snapshot') and t.constraint_name=upper('uq_frame_roletype_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_roletype_snapshot';
    execute immediate 'alter table frame_roletype_snapshot  ADD CONSTRAINT uq_frame_roletype_snapshot UNIQUE (roletypeguid, appkey, clientip)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_role_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_role_snapshot';
    execute immediate 'alter table frame_role_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_role_snapshot') and t.constraint_name=upper('uq_frame_role_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_role_snapshot';
    execute immediate 'alter table frame_role_snapshot  ADD CONSTRAINT uq_frame_role_snapshot UNIQUE (roleguid, appkey, clientip)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_userrole_snapshot') and t.constraint_type='P';
  if (isexist = 0) then
  	execute immediate 'truncate table frame_userrole_snapshot';
    execute immediate 'alter table frame_userrole_snapshot add primary key (rowguid)';
  end if;
  
  select count(1) into isexist from user_constraints t where t.table_name = upper('frame_userrole_snapshot') and t.constraint_name=upper('uq_frame_userrole_snapshot') and t.constraint_type='U';
  if (isexist = 0) then
    execute immediate 'truncate table frame_userrole_snapshot';
    execute immediate 'alter table frame_userrole_snapshot  ADD CONSTRAINT uq_frame_userrole_snapshot UNIQUE (userguid,roleguid, appkey, clientip)';
  end if;
  
  end;
end;
/* GO */

-- end;


