-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/01/02
-- e讯发送消息内容字段类型改为text--王露
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('exun_message') and column_name = upper('content') and data_type=upper('nclob');
  if (isexist = 0) then
    execute immediate 'alter table exun_message add newcolumn nclob';
    execute immediate 'update exun_message set newcolumn = content';
    execute immediate 'alter table exun_message drop column content';
    execute immediate 'alter table exun_message rename column newColumn to content';
  end if;
  end;
end;
/* GO */

-- end;


