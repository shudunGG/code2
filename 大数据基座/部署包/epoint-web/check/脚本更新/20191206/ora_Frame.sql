-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/06 
-- 消息渠道表增加渠道mq监听数量的配置 --【何晓瑜】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_channel') and column_name = upper('concurrency');
  if (isexist = 0) then
    execute immediate 'alter table messages_channel add concurrency  Integer';
  end if;
  end;
end;
/* GO */

-- end;


