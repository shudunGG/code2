-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/19
-- 工作流活动表添加多人处理锁定锁定时间字段 --季立霞

-- 添加多人处理锁定锁定时间字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_activity') and column_name = upper('locktimewhenmultitransactor');
  if (isexist = 0) then
    execute immediate 'alter table workflow_activity add locktimewhenmultitransactor nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- end;


