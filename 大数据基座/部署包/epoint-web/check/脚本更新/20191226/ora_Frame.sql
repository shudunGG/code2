-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/26
-- 新增表epointsform_tablerelation --【薛炳】
 
-- 添加表epointsform_tablerelation
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_tablerelation');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_tablerelation
             (
               rowguid nvarchar2(50) not null primary key,
               businesstableid nvarchar2(1000),
			   shareguid nvarchar2(50),
			   baseouguid nvarchar2(50),
			   ordernumber int,
			   multitablename nvarchar2(100),
			   templateguid nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- 添加表epointsform_designtemp
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_designtemp');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_designtemp
             (
               rowguid nvarchar2(50) not null primary key,
               templatename nvarchar2(200),
			   jsoncontent CLOB,
			   htmlcontent CLOB,
			   ordernumber int,
			   templatetype nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- end;


