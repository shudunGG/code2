-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/12/12
-- 新增 API运行统计资源表 --周志豪

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_statistics_subject');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_statistics_subject
             (
               rowguid   			  nvarchar2(50) not null primary key,
               resourcetype           nvarchar2(50),
			   updatetime             number,
			   uuid                   nvarchar2(50),
			   displayname            nvarchar2(100),
			   enabled                nvarchar2(50),
			   metric                 nvarchar2(200)
              )';
  end if;
  end;
end;
/* GO */

-- 新增API运行统计数据表 --周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_statistics_data');
 if (isexist = 0) then
    execute immediate '
      create table api_runtime_statistics_data
             (
               rowguid   			  nvarchar2(50) not null primary key,
               metric                 nvarchar2(200),
			   statisticsvalue        nvarchar2(1000),
			   statisticstime         number,
			   ordernumber            integer
              )';
  end if;
  end;
end;
/* GO */

-- 新增开发者表 --周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_developer');
 if (isexist = 0) then
    execute immediate '
      create table frame_developer
             (
               rowguid   			  nvarchar2(50) not null primary key,
               userguid               nvarchar2(100),
			   loginid                nvarchar2(100),
			   displayname            nvarchar2(100),
			   password               nvarchar2(100),
			   mobile                 nvarchar2(100),
			   companyname            nvarchar2(500)

              )';
  end if;
  end;
end;
/* GO */

-- 添加字段responseTime 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('jsoncontent');
  if (isexist = 0) then
    execute immediate 'alter table api_info add jsoncontent nvarchar2(1000)';
  end if;
  end;
end;
/* GO */


-- 添加字段responseTime 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log') and column_name = upper('responsetime');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_log add responsetime integer';
  end if;
  end;
end;
/* GO */

-- end;


