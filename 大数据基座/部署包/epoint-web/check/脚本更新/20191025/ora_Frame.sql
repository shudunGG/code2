-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/10/16 【时间】
-- 添加表api_func_history、api_info_history --【俞俊男】
-- api_info_history添加字段version_number、related_apiguid --【俞俊男】
-- api_info添加字段online_version、version_number --【俞俊男】

-- 添加表api_func_history
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_func_history');
 if (isexist = 0) then
    execute immediate '
      create table api_func_history
             (
               rowguid nvarchar2(50) not null primary key,
               record_time date,
			   func_namespace nvarchar2(100),
			   func_package_name nvarchar2(100),
			   func_class_name nvarchar2(100),
			   func_data clob,
			   apiguid nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */

-- 添加表api_info_history
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('api_info');
    IF (IsExist = 1) THEN
			select count(*) into IsExist from user_tables where Table_name = upper('api_info_history');
      IF (IsExist = 0) THEN
				BEGIN      
					execute   immediate   
					'create table API_INFO_HISTORY as select * from API_INFO where 1=2';    
				END;
			END IF;
    END IF;
  END;
END;
/* GO */


-- api_info_history添加字段version_number
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info_history') and column_name = upper('version_number');
  if (isexist = 0) then
    execute immediate 'alter table api_info_history add version_number  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- api_info_history添加字段related_apiguid
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info_history') and column_name = upper('related_apiguid');
  if (isexist = 0) then
    execute immediate 'alter table api_info_history add related_apiguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- api_info添加字段online_version
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('online_version');
  if (isexist = 0) then
    execute immediate 'alter table api_info add online_version  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- api_info添加字段version_number
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('version_number');
  if (isexist = 0) then
    execute immediate 'alter table api_info add version_number  nvarchar2(100)';
  end if;
  end;
end;
/* GO */
-- end;


