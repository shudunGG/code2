-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/03/23

-- 基础信息表添加表控件英文字段创建方式字段，manual手动，其余是自动  --季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_basicinfo') and column_name = upper('ctrlencreatetype');
  if (isexist = 0) then
    execute immediate 'alter table epointsform_table_basicinfo add ctrlencreatetype nvarchar2(12)';
  end if;
  end;
end;
/* GO */

-- end;


