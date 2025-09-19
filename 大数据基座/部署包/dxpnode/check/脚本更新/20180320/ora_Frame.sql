-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/03/20
-- 添加应用附件数据源关联关系表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_attachconfig');
  if (isexist = 0) then
    execute immediate 'CREATE TABLE app_attachconfig (
 		 rowguid NVARCHAR2(50) not null primary key,
 		 appguid NVARCHAR2(50),
 		 configguid NVARCHAR2(50),
 		 ordernumber INTEGER
)';
  end if;
  end;
end;

-- end;