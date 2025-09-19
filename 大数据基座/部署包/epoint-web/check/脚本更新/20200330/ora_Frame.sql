-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/03/30
 
-- 添加表frame_sms_verification   --吴琦
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_sms_verification');
  if (isexist = 0) then
    execute immediate 'create table frame_sms_verification
(
  RowGuid                 nvarchar2(50) not null primary key,
  OperateUserGuid         nvarchar2(50),
  smscode                 nvarchar2(50),
  smsno                   nvarchar2(50),
  createtime              date,
  mobilenumber            nvarchar2(50),
  isuesed                 integer,
  verifytime              date,
  verifyIP                nvarchar2(50)
 )';
  end if;
  end;
end;
/* GO */

-- 添加表frame_restricted_info   --吴琦
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_restricted_info');
  if (isexist = 0) then
    execute immediate 'create table frame_restricted_info
(
  RowGuid                 nvarchar2(50) not null primary key,
  RestrictedType          nvarchar2(50),
  RestrictedCreateTime    date,
  IsManualTerminate       integer,
  AutoTerminateTime       date,
  ManualTerminateTime     date,
  UserGuid                nvarchar2(50),
  RestrictedObj           nvarchar2(50)
 )';
  end if;
  end;
end;
/* GO */

-- end;


