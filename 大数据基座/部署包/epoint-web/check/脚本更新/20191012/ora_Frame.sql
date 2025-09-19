-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/10/12
-- 【增量日志表】 --【何晓瑜】

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_sync_log');
  if (isexist = 0) then
    execute immediate 'create table app_sync_log
(
   rowguid            nvarchar2(50) not null primary key,
   appsyncflag        nvarchar2(50),
   updatetime         date,
   appkey             nvarchar2(50),
   status             integer
)';
  end if;
  end;
end;
/* GO */

-- end;


