-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/08/28【时间】
-- api_info表删除字段timeoutInMilliseconds --【俞俊男】


-- 删除timeoutInMilliseconds字段
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('timeoutInMilliseconds');
  if (isexist = 1) then
    execute immediate 'alter table api_info drop column timeoutInMilliseconds';
  end if;
  end;
end;
/* GO */

-- end;


