-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/5/23
-- 【excel导入查询历史表】 --【严璐琛】

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('excel_import_history') and column_name = upper('rowguid');
  if (isexist = 0) then
    execute immediate 'create table excel_import_history
(
   rowguid            nvarchar2(50) not null primary key,
   belongxiaqucode    nvarchar2(50),
   operateusername    nvarchar2(50),
   operatedate        date,
   row_id             number(10),
   yearflag           nvarchar2(4),
   importuserguid     nvarchar2(50),
   attachguid         nvarchar2(50),
   attachmd5          nvarchar2(50),
   importresult       nvarchar2(500),
   importdetail       clob
)';
  end if;
  end;
end;
/* GO */

-- end;


