-- 如需手工在dm管理工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2021/07/20
-- 表frame_role新增字段roledescription   
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_role') and column_name = upper('roledescription');
  if (isexist = 0) then
    execute immediate 'alter table frame_role add roledescription varchar(100)';
     else
     execute immediate 'alter table frame_role modify roledescription varchar(100)';
  end if;
  end;
end;
/* GO */

-- end;


