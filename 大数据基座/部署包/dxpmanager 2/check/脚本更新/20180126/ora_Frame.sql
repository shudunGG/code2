-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/01/26
-- 修改api_sync_log中description字段长度--施佳炜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_sync_log') and column_name = upper('description') and data_type=upper('clob');
  if (isexist = 0) then
    execute immediate 'alter table api_sync_log add newcolumn clob';
    execute immediate 'update api_sync_log set newcolumn = description';
    execute immediate 'alter table api_sync_log drop column description';
    execute immediate 'alter table api_sync_log rename column newColumn to description';
  end if;
  end;
end;
/* GO */

-- end;


