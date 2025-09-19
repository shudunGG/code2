-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/01/08
-- 用户信息增加入编时间字段 --王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user') and column_name = upper('hiredate');
  if (isexist = 0) then
    execute immediate 'alter table frame_user add hiredate date';
  end if;
  end;
end;
/* GO */
-- end;


