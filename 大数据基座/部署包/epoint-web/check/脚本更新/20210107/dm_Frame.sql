-- 如需手工在dm管理工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- workflow_activity表增加isallowattachwrite字段 --cdy

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_activity') and column_name = upper('isallowattachwrite');
  if (isexist = 0) then
    execute immediate 'alter table workflow_activity add isallowattachwrite  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- end;


