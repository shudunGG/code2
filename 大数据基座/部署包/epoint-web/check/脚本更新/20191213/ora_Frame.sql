-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/13 
-- 表单版本表中增加复制数量字段 --【薛炳】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('copynum');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add copynum  Integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('TableList_SearchAreaConfig') and column_name = upper('customcode');
  if (isexist = 0) then
    execute immediate 'alter table TableList_SearchAreaConfig add customcode  nvarchar2(50)';
  end if;
  end;
end;
/* GO */


-- end;


