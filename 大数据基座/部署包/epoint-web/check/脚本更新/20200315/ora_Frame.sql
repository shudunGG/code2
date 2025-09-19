-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/03/15
 
-- 添加表frame_attachrightconfig   --吴琦
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachrightconfig');
  if (isexist = 0) then
    execute immediate 'create table frame_attachrightconfig
(
  OperateDate             date,
  RowGuid                 nvarchar2(50) not null primary key,
  verifytype              nvarchar2(50),
  verifyto                nvarchar2(2000),
  isenabled               integer
 )';
  end if;
  end;
end;
/* GO */

-- 添加表frame_attachrightinfo   --吴琦
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachrightinfo');
  if (isexist = 0) then
    execute immediate 'create table frame_attachrightinfo
(
  RowGuid                 nvarchar2(50) not null primary key,
  attachrightguid         nvarchar2(50),
  allowtype               nvarchar2(100),
  allowto                 nvarchar2(100),
  isenabled               integer,
  righttype               nvarchar2(50)
 )';
  end if;
  end;
end;
/* GO */

-- end;


