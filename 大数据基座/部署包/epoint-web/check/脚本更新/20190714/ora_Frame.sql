-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/7/13 【时间】
-- 【内容简单介绍】 --【添加人姓名】

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_method');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_method
             (
               methodGuid   nvarchar2(100) not null primary key,
               versionGuid    nvarchar2(100),
               tableGuid   nvarchar2(100),
               tableId   number,
               dllPath   nvarchar2(2000),
               typeName nvarchar2(100),
               methodName  nvarchar2(100),
               returnValueType  nvarchar2(100),
               orderNum number,
               note   nvarchar2(2000)
              )';
  end if;
  end;
end;
/* GO */

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_event');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_event
             (
               eventGuid   nvarchar2(100) not null primary key,
               eventName    nvarchar2(100),
               eventType number,
               eventMethodGuid nvarchar2(100),
               versionGuid nvarchar2(100),
               tableGuid   nvarchar2(100),
               tableId   number,
               belongTo  number,
               orderNum number,
               note   nvarchar2(1000)
              )';
  end if;
  end;
end;
/* GO */

-- end;


