-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/04/08 【时间】
-- api_info表添加字段funcNameSpace、funcPackageName、funcClassName  --【俞俊男】


-- 添加字段funcNameSpace
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('funcNameSpace');
  if (isexist = 0) then
    execute immediate 'alter table api_info add funcNameSpace nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- 添加字段funcPackageName
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('funcPackageName');
  if (isexist = 0) then
    execute immediate 'alter table api_info add funcPackageName nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- 添加字段funcClassName
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('funcClassName');
  if (isexist = 0) then
    execute immediate 'alter table api_info add funcClassName nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- end;


