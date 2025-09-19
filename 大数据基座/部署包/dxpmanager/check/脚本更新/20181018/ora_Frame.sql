-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/10/18 【时间】

-- 消息类型表增加字段 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_type') and column_name = upper('updatemode');
  if (isexist = 0) then
    execute immediate 'alter table messages_type add updatemode NVARCHAR2(50)';
  end if;
  end;
end;
/* GO */


-- end;


