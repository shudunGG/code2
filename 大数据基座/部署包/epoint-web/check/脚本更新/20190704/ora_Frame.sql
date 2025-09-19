-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/04【时间】
-- 添加表epointformversion --【薛炳】


-- 表epointformversion添加字段htmlData
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('htmlData');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add htmlData clob';
  end if;
    
  end;
end;
/* GO */


 



-- end;


