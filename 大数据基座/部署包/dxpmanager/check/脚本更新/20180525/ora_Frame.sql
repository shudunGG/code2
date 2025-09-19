-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/05/16 
--  地址簿表，新增2个快照表（frame_myaddressgroup_snapshot、frame_myaddressbook_snapshot），同步地址簿的时候用， --【施佳炜】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_myaddressgroup_snapshot');
 if (isexist = 0) then
    execute immediate '
  create table  frame_myaddressgroup_snapshot (
  groupguid nvarchar2(100) NOT NULL,
  groupname nvarchar2(100) DEFAULT NULL,
  owneruserguid nvarchar2(100) DEFAULT NULL,
  belongbaseouguid nvarchar2(100) DEFAULT NULL,
  ordernumber integer DEFAULT 0,
  clientip nvarchar2(50) DEFAULT NULL,
  appkey nvarchar2(100) DEFAULT NULL,
  parentgroupguid nvarchar2(100) DEFAULT NULL,
  ouguids clob,
  rowguid nvarchar2(50) NOT NULL,
  PRIMARY KEY (rowguid)
  )';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_myaddressbook_snapshot');
 if (isexist = 0) then
    execute immediate 'create table  frame_myaddressbook_snapshot(
  groupguid nvarchar2(100) DEFAULT NULL,
  objectguid nvarchar2(100) DEFAULT NULL,
  objectname nvarchar2(100) DEFAULT NULL,
  objecttype nvarchar2(100) DEFAULT (user),
  ordernumber integer DEFAULT NULL,
  rowguid nvarchar2(50) NOT NULL,
  clientip nvarchar2(50) DEFAULT NULL,
  appkey nvarchar2(100) DEFAULT NULL,
  bookguid nvarchar2(50) NOT NULL,
  PRIMARY KEY (rowguid)
  ) ';
  end if;
  end;
end;
/* GO */

--  新增一个地址簿授权表（frame_myaddressgroupright），地址簿同步选择同步范围和授权部门用。 --【施佳炜】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_myaddressgroupright');
 if (isexist = 0) then
    execute immediate '
  create table  frame_myaddressgroupright (
  rowguid nvarchar2(50) NOT NULL,
  allowto nvarchar2(50) DEFAULT NULL,
  allowtype nvarchar2(50) DEFAULT NULL,
  groupguid nvarchar2(50) DEFAULT NULL,
  PRIMARY KEY (rowguid)
) ';
  end if;
  end;
end;
/* GO */

--  通讯录表（frame_myaddressbook）、地址簿表（Frame_MyAddressGroup）修改了几个字段，为了更好的支持同步同能， --【施佳炜】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressBook') and column_name = upper('rowguid');
  if (isexist = 0) then
    execute immediate 'alter table Frame_MyAddressBook add  rowguid nvarchar2(50)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressGroup') and column_name = upper('parentgroupguid');
  if (isexist = 0) then
    execute immediate 'alter table Frame_MyAddressGroup add  parentgroupguid nvarchar2(100)';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressGroup') and column_name = upper('ouguids');
  if (isexist = 0) then
    execute immediate 'alter table Frame_MyAddressGroup add  ouguids clob';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('Frame_MyAddressBook') and column_name = upper('row_id');
  if (isexist = 1) then
    execute immediate 'alter table Frame_MyAddressBook drop column row_id';
  end if;
commit;
  
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_ind_columns where table_name = upper('frame_myaddressbook') and column_name = upper('rowguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_myaddressbook add  primary key(rowguid)';
  end if;
    end;
end;
/* GO */
  

-- end;


