-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/06/04
-- 新增字段 --季立霞

-- 添加DateFormatType字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('DateFormatType');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add DateFormatType  nvarchar2(20)';
  end if;
  end;
end;
/* GO */

-- 添加isFrameUser字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('isFrameUser');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add isFrameUser nvarchar2(2)';
  end if;
  end;
end;
/* GO */

-- 添加isFrameOu字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('isFrameOu');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add isFrameOu  nvarchar2(2)';
  end if;
  end;
end;
/* GO */

-- 添加自定义addurl字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_basicinfo') and column_name = upper('AddUrl');
  if (isexist = 0) then
    execute immediate 'alter table table_basicinfo add AddUrl  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 添加自定义editurl字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_basicinfo') and column_name = upper('EditUrl');
  if (isexist = 0) then
    execute immediate 'alter table table_basicinfo add EditUrl  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 添加自定义detailurl字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_basicinfo') and column_name = upper('DetailUrl');
  if (isexist = 0) then
    execute immediate 'alter table table_basicinfo add DetailUrl  nvarchar2(200)';
  end if;
  end;
end;
/* GO */


-- 添加系统保留字段配置表table_systemstruct_config
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_systemstruct_config');
 if (isexist = 0) then
    execute immediate '
      create table table_systemstruct_config
             (
               rowguid   nvarchar2(100) not null primary key,
               tableid  int,
               tablename nvarchar2(100),
               sysfieldid  int,
               sysfieldname nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */

-- 添加子父表关联字段配置表table_fieldrelation_config
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_fieldrelation_config');
 if (isexist = 0) then
    execute immediate '
      create table table_fieldrelation_config
             (
               rowguid   nvarchar2(100) not null primary key,
               maintableid  int,
               maintablename nvarchar2(100),
               mainfieldid  int,
               mainfieldname nvarchar2(100),
               goaltableid  int,
               goaltablename nvarchar2(100),
               goalfieldid  int,
               goalfieldname nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */

-- end;


