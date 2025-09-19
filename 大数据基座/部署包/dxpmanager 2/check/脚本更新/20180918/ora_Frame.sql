-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/9/18
-- 一级菜单排序表 --季立霞

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_topModuleSort');
 if (isexist = 0) then
    execute immediate '
      create table frame_topModuleSort
(
  rowguid              nvarchar2(50) not null primary key,
  moduleguid           nvarchar2(50),
  userguid             nvarchar2(50),
  ordernumber          integer
)';
  end if;
  end;
end;
/* GO */

-- 模块点击频率表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_moduleFrequency');
 if (isexist = 0) then
    execute immediate '
      create table frame_moduleFrequency
(
  rowguid              nvarchar2(50) not null primary key,
  moduleguid           nvarchar2(50),
  userguid             nvarchar2(50),
  count                integer
)';
  end if;
  end;
end;
/* GO */




-- end;


