-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/04/24 【时间】
-- -- EpointsformListVersion（列表版本表）添加字段formguid -- 薛炳

-- EpointsformListVersion（列表版本表）添加字段formguid
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformListVersion') and column_name = upper('formguid');
  if (isexist = 0) then
    execute immediate 'alter table EpointsformListVersion add formguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;


