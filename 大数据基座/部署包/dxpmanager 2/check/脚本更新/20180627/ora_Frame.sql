-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/06/27
-- exun_message字段长度增加 --【王颜】
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('exun_message') and column_name = upper('touserdisplayname') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
    execute immediate 'alter table exun_message modify touserdisplayname nvarchar2(2000)';
  end if;
  end;
end;


/* GO */

-- end;


