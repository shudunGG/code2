-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/03/04
 
-- 添加表frame_operateratelimit_config   --吴琦
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_operateratelimit_config');
  if (isexist = 0) then
    execute immediate 'create table frame_operateratelimit_config
(
  OperateUserName         nvarchar2(50),
  OperateDate             date,
  RowGuid                 nvarchar2(50) not null primary key,
  OperateUserGuid         nvarchar2(50),
  PolicyRemark            nvarchar2(200),
  TargetUserGuid          nvarchar2(50),
  TargetUserName          nvarchar2(50),
  PageUrl                 nvarchar2(500) not null,
  TimeInterval            integer,
  MaxCount                integer,
  VerificationMode        nvarchar2(50),
  PolicyValidPeriod       integer,
  PolicyEnabled           integer
 )';
  end if;
  end;
end;
/* GO */

-- end;


