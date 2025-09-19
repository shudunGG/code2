-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/03/24
-- 陈星怡

-- 添加app_frameconfig_relation
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_frameconfig_relation');
 if (isexist = 0) then
    execute immediate '
      create table app_frameconfig_relation
             (
                 rowguid        nvarchar2(50) not null primary key,
  			     appguid        nvarchar2(50),
                 configname     nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */

-- end;


