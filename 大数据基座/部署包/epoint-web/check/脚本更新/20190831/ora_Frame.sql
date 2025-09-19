-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/03/29


-- 添加frame_searchcategory表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_searchcategory');
 if (isexist = 0) then
    execute immediate '
      create table frame_searchcategory
             (
               rowguid  nvarchar2(50) not null primary key,
               categoryname  nvarchar2(50),
               parentguid  nvarchar2(50),
               createuserguid  nvarchar2(50),
               createdate  date,
               ordernumber  int
              )';
  end if;
  end;
end;
/* GO */


-- 添加frame_dataquery表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_dataquery');
 if (isexist = 0) then
    execute immediate '
      create table frame_dataquery
             (
               rowguid   nvarchar2(50) not null primary key,
               conditionname  nvarchar2(50),
               querytype  nvarchar2(10),
               combination  nvarchar2(500),
               queryentity  clob,
               querycategory  nvarchar2(50), 
               createuserguid  nvarchar2(50),
               createdate  date,
               ordernumber  int
              )';
  end if;
  end;
end;
/* GO */


-- 添加方案主表frame_schemeshow表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemeshow');
 if (isexist = 0) then
    execute immediate '
      create table frame_schemeshow
             (
               rowguid   nvarchar2(50) not null primary key,
               tableId   int,
               schemetype   nvarchar2(50),
               schemename   nvarchar2(50),
               ordernumber  int,
               createuserguid  nvarchar2(50),
               createdate  date,
               iscommon nvarchar2(5)
              )';
  end if;
  end;
end;
/* GO */


-- 添加方案明细frame_schemeshowinfo表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemeshowinfo');
 if (isexist = 0) then
    execute immediate '
      create table frame_schemeshowinfo
             (
               rowguid   nvarchar2(50) not null primary key,
               schemeguid   nvarchar2(50),
               fieldguid   nvarchar2(50),
               ordernumber  int,
               createuserguid  nvarchar2(50),
               createdate  date
              )';
  end if;
  end;
end;
/* GO */


-- 添加方案权限frame_schemeshowright表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemeshowright');
 if (isexist = 0) then
    execute immediate '
      create table frame_schemeshowright
             (
               rowguid   nvarchar2(50) not null primary key,
               schemeguid   nvarchar2(50),
               allowtype   nvarchar2(50),
               allowto   nvarchar2(50),
               createuserguid  nvarchar2(50),
               createdate  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加frame_table_right表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_table_right');
 if (isexist = 0) then
    execute immediate '
      create table frame_table_right
             (
               rowguid   nvarchar2(50) not null primary key,
               tableid   int,
               righttype  nvarchar2(10),
               allowtype   nvarchar2(50),
               allowto   nvarchar2(50),
               createuserguid  nvarchar2(50),
               createdate  date
              )';
  end if;
  end;
end;
/* GO */


-- 添加frame_tablestruct_right表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_tablestruct_right');
 if (isexist = 0) then
    execute immediate '
      create table frame_tablestruct_right
             (
               rowguid   nvarchar2(50) not null primary key,
               tableid   int,
               fieldguid nvarchar2(50),
               righttype  nvarchar2(10),
               allowtype   nvarchar2(50),
               allowto   nvarchar2(50),
               createuserguid  nvarchar2(50),
               createdate  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加排序方案主表frame_schemeorder
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemeorder');
 if (isexist = 0) then
    execute immediate '
      create table frame_schemeorder
             (
               rowguid   nvarchar2(50) not null primary key,
               schemename nvarchar2(50),
               tableid   int,
               ordernumber int,
               createuserguid  nvarchar2(50),
               createdate  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加排序方案明细表frame_schemeorderinfo
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemeorderinfo');
 if (isexist = 0) then
    execute immediate '
      create table frame_schemeorderinfo
             (
               rowguid   nvarchar2(50) not null primary key,
               schemeguid nvarchar2(50),
               fieldguid nvarchar2(50),
               ordertype nvarchar2(50),
               ordernumber int,
               createuserguid  nvarchar2(50),
               createdate  date
              )';
  end if;
  end;
end;
/* GO */

-- 添加表显示方案表frame_schemetableshow
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemetableshow');
 if (isexist = 0) then
    execute immediate '
      create table frame_schemetableshow
             (
               rowguid   nvarchar2(50) not null primary key,
               tableid int,
               ordernumber int,
               isvisible nvarchar2(5),
               createuserguid  nvarchar2(50),
               createdate  date
              )';
  end if;
  end;
end;
/* GO */

-- end;


