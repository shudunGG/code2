-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/09/22【时间】
 
-- api_channel_upstream字段upstream_encode_name改为1500长度 --cdy
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('upstream_encode_name') and data_length='3000';
  if (isexist = 1) then
    execute immediate 'alter table api_channel_upstream modify upstream_encode_name nvarchar2(1500)';
  end if;
  end;
end;
/* GO */

-- end;


