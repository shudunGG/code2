-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/7/13 【时间】
-- 【内容简单介绍】 --【添加人姓名】

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_parameter');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_parameter
             (
               mpGuid    nvarchar2(100) not null primary key,
               methodGuid   nvarchar2(100),
               mpName   nvarchar2(100),
               mpType   number,
               mpValue   nvarchar2(1000),
               encrypt  nvarchar2(2),
               orderNum  number,
               mpnamedescription nvarchar2(100),
               mpvaluedescription  nvarchar2(100),
               note   nvarchar2(1000),
               backa  nvarchar2(100),
               backb  nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */

-- end;


