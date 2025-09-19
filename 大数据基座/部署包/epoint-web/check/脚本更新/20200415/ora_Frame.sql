-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN
-- 2020/04/15
-- 添加表epoint_job_manager_config

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epoint_job_manager_config');
 if (isexist = 0) then
    execute immediate '
      CREATE TABLE epoint_job_manager_config (
	  rowguid nvarchar2(50) primary key,
	  configname nvarchar2(100),
	  configvalue nvarchar2(512) 
	) ';
  end if;
  end;
end;
-- end;