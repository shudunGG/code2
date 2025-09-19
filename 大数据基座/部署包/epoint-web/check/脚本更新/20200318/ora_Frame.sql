-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN
-- 2020/03/18
-- 新增表frame_privacy_agree字段 --【孟佳佳】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_privacy_agree') and column_name = upper('status');
  if (isexist = 0) then
    execute immediate 'alter table frame_privacy_agree add status integer default 1';
  end if;
  end;
end;
/* GO */

-- end;


