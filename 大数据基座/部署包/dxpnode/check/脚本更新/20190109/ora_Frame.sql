-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/01/01 【时间】
-- 【内容简单介绍】 --【添加人姓名】
-- 触发器配置增加执行方式配置，可以选配触发器自动或手动执行，不配默认使用frame_task_msg的配置--严璐琛
-- 添加字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_task_trig') and column_name = upper('executetype');
  if (isexist = 0) then
    execute immediate 'alter table frame_task_trig add executetype  number(11,0)';
    execute immediate 'update frame_task_trig set executetype = 1 where taskguid in (select rowguid from frame_task_msg where executetype = 1)';
  end if;
  end;
end;
/* GO */


-- end;


