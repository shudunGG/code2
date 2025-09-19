-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/07/02 
-- 新增开放平台配置表, token表--【施佳炜】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_open_platform_config');
 if (isexist = 0) then
    execute immediate 'CREATE TABLE frame_open_platform_config(
  configname nvarchar2(100) NOT NULL,
  configvalue nvarchar2(500),
  relationguid varchar(50),
  description nvarchar2(2000),
  platform nvarchar2(50),
  rowguid nvarchar2(50) NOT NULL PRIMARY KEY
)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('sso_token_info');
 if (isexist = 0) then
    execute immediate 'CREATE TABLE  sso_token_info(
  rowguid nvarchar2(50) NOT NULL PRIMARY KEY,
  keystr nvarchar2(50),
  clientid nvarchar2(50),
  principal nvarchar2(100),
  userguid nvarchar2(50),
  refreshtoken nvarchar2(50),
  sessionid nvarchar2(50),
  exin integer,
  createtime date,
  scope nvarchar2(1000),
  apis nclob,
  type nvarchar2(50)
)';
  end if;
  end;
end;
/* GO */

-- end;


