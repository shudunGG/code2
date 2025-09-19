-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/08/23【时间】
-- api_info表添加字段timeoutInMilliseconds、requestVolumeThreshold、errorThresholdPercentage、sleepWindowInMilliseconds、dataSourceId、operatetype、apidata --【俞俊男】


-- 添加字段timeoutInMilliseconds
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('timeoutInMilliseconds');
  if (isexist = 0) then
    execute immediate 'alter table api_info add timeoutInMilliseconds NUMBER(20,0)';
  end if;
  end;
end;
/* GO */

-- 添加字段requestVolumeThreshold
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('requestVolumeThreshold');
  if (isexist = 0) then
    execute immediate 'alter table api_info add requestVolumeThreshold NUMBER(10,0)';
  end if;
  end;
end;
/* GO */

-- 添加字段errorThresholdPercentage
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('errorThresholdPercentage');
  if (isexist = 0) then
    execute immediate 'alter table api_info add errorThresholdPercentage NUMBER(10,0)';
  end if;
  end;
end;
/* GO */

-- 添加字段sleepWindowInMilliseconds
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('sleepWindowInMilliseconds');
  if (isexist = 0) then
    execute immediate 'alter table api_info add sleepWindowInMilliseconds NUMBER(20,0)';
  end if;
  end;
end;
/* GO */

-- 添加字段dataSourceId
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('dataSourceId');
  if (isexist = 0) then
    execute immediate 'alter table api_info add dataSourceId NUMBER(10,0)';
  end if;
  end;
end;
/* GO */


-- 添加字段operatetype
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('operatetype');
  if (isexist = 0) then
    execute immediate 'alter table api_info add operatetype nvarchar2(50)';
  end if;
  end;
end;
/* GO */


-- 添加字段apidata
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('apidata');
  if (isexist = 0) then
    execute immediate 'alter table api_info add apidata nclob';
  end if;
  end;
end;
/* GO */

-- end;


