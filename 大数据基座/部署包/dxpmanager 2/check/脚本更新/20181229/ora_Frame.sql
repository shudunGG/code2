-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/12/17
-- 徐剑

-- app_info添加issyncuserconfig字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('issyncuserconfig');
  if (isexist = 0) then
    execute immediate 'alter table app_info add issyncuserconfig int';
  end if;
  end;
end;
/* GO */

-- 添加app_userconfig_relation
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_userconfig_relation');
 if (isexist = 0) then
    execute immediate '
      create table app_userconfig_relation
             (
                 rowguid        nvarchar2(50) not null primary key,
  			     appguid        nvarchar2(50),
                 configname     nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */

-- 添加frame_userconfig_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_userconfig_snapshot');
 if (isexist = 0) then
    execute immediate '
      create table frame_userconfig_snapshot
             (
                 rowguid             nvarchar2(50) not null primary key,
			     userconfigguid      nvarchar2(100),
			     belonguserguid      nvarchar2(100),
			     configname          nvarchar2(100),
			     configvalue         nvarchar2(500),
			     configguid          nvarchar2(100),
			     updatetime          date,
			     appkey              nvarchar2(50),
			     clientip            nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- end;


