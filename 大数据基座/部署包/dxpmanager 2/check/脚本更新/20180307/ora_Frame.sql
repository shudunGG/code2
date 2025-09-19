-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/03/07
-- 消息类型表大图标字段加大 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_type') and column_name = upper('bigicon');
  if (isexist = 1) then
    execute immediate 'alter table messages_type modify bigicon nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- end;


