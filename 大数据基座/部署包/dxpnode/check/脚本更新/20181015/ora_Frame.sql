-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/10/15
-- 添加涉密等级表 --季立霞

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_secretlevel');
 if (isexist = 0) then
    execute immediate '
      create table frame_secretlevel
             (
               rowguid               nvarchar2(50) not null primary key,
               levelname             nvarchar2(50),
			   secretlevel		      integer
              )';
  end if;
  end;
end;
/* GO */

-- 添加涉密等级快照表 --季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_secretlevel_snapshot');
 if (isexist = 0) then
    execute immediate '
      create table frame_secretlevel_snapshot
             (
               rowguid               nvarchar2(50) not null,
               levelname             nvarchar2(50),
			   secretlevel		      integer,
               appkey               nvarchar2(100),
               clientip             nvarchar2(50),
               levelguid      nvarchar2(50) not null primary key
              )';
  end if;
  end;
end;
/* GO */

-- 添加防篡改管理表 
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_anti_tamper');
 if (isexist = 0) then
    execute immediate '
      create table frame_anti_tamper(
               rowguid               nvarchar2(50) not null primary key,
               tablename             nvarchar2(50),
               anticolumns           nvarchar2(2000),
			   status		         integer,
			   ordernumber		     integer
              ) ';
  end if;
  end;
end;
/* GO */


-- end;


