-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/09/26 【时间】
-- 添加表api_runtime_log添加字段consumerguid --【俞俊男】

-- 添加consumerId字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_log') and column_name = upper('consumerguid');
  if (isexist = 0) then
    execute immediate 'alter table api_runtime_log add consumerguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;


