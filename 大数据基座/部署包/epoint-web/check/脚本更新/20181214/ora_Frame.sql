-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/10/30
-- 多账号关系表  --徐剑

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_accountrelation');
 if (isexist = 0) then
    execute immediate '
      create table frame_accountrelation
             (
               rowguid             nvarchar2(50) not null primary key,
               userguid            nvarchar2(50),
			   ordernumber         int,
               relativeuserguid    nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_accountrelation_snapshot');
 if (isexist = 0) then
    execute immediate '
      create table frame_accountrelation_snapshot
             (
               rowguid             nvarchar2(50) not null primary key,
               userguid            nvarchar2(50),
			   ordernumber         int,
               relativeuserguid    nvarchar2(50),
               accountrelationguid nvarchar2(50),
               appkey              nvarchar2(50),
               clientip            nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- end;


