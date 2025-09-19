-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/02/12
 
-- 添加表epointsformuniversal
 
-- 添加表epointsformuniversal
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformuniversal');
 if (isexist = 0) then
    execute immediate '
      create table epointsformuniversal
             (
               rowguid nvarchar2(50) not null primary key,
               encodename nvarchar2(50),
			   name nvarchar2(50),
			   controltype nvarchar2(50),
			   ordernumber Integer,
			   businesstype nvarchar2(50),
			   context clob,
              fieldtype nvarchar2(15),
              isenabled nvarchar2(10)
              )';
  end if;
  end;
end;
/* GO */


-- end;


