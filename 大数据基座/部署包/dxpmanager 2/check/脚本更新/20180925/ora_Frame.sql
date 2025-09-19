-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/09/25
-- 添加图标背景颜色字段 --施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_type') and column_name = upper('iconbgcolor');
  if (isexist = 0) then
    execute immediate 'alter table messages_type add iconbgcolor nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;


