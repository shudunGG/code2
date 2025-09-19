-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/10/10 【时间】

-- 个人消息规则表增加字段 --何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_personalrule') and column_name = upper('isvalid');
  if (isexist = 0) then
    execute immediate 'alter table messages_personalrule add isvalid integer';
  end if;
  end;
end;
/* GO */


-- end;


