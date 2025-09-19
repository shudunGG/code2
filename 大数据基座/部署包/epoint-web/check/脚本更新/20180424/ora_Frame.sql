-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/4/24
-- 新增预警规则表 --周志豪

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_rule');
 if (isexist = 0) then
    execute immediate 'create table api_runtime_alert_rule (
  Rowguid nvarchar2(50) not null primary key,
  subjects nclob,
  vdoing nvarchar2(50),
  rulename nvarchar2(100) ,
  metric nvarchar2(100) ,
  watchtime integer ,
  watchvaluetype nvarchar2(50) ,
  symbol nvarchar2(50) ,
  thresholdvalue nvarchar2(50) ,
  dumbperiod integer ,
  watchlength integer ,
  effectivetime nvarchar2(100) ,
  messagetype nvarchar2(50) ,
  targetusers nclob,
  alertlevel nvarchar2(50) ,
  enabled nvarchar2(50) ,
  latestpollingtime date 
)';
  end if;
  end;
end;
/* GO */


-- 新增预警展示表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_info');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_alert_info (
  rowguid nvarchar2(50) not null primary key,
  ruleguid nvarchar2(50) ,
  subjecttype nvarchar2(100),
  subjectname nvarchar2(100),
  time date ,
  decription nclob,
  messagetype nvarchar2(50) ,
  status nvarchar2(50)
) ';
  end if;
  end;
end;
/* GO */

-- end;



