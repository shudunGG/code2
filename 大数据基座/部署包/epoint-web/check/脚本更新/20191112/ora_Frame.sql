-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/11/11 【时间】
-- Frame_Module表添加whitelist字段 --徐剑

-- Frame_Module表添加whitelist字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_Module') and column_name = upper('whitelist');
  if (isexist = 0) then
    execute immediate 'alter table Frame_Module add whitelist clob';
  end if;
  end;
end;
/* GO */

-- end;


