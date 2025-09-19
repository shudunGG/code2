-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/05/16 【时间】
-- 【地址簿表，新增2个快照表（frame_myaddressgroup_snapshot、frame_myaddressbook_snapshot），同步地址簿的时候用，
--	新增一个地址簿授权表（frame_myaddressgroupright），地址簿同步选择同步范围和授权部门用。
--	通讯录表（frame_myaddressbook）、地址簿表（Frame_MyAddressGroup）修改了几个字段，为了更好的支持同步同能，】 --【施佳炜】

CREATE TABLE if not exists frame_myaddressgroup_snapshot(
  groupguid varchar(100) NOT NULL,
  groupname varchar(100) DEFAULT NULL,
  owneruserguid varchar(100) DEFAULT NULL,
  belongbaseouguid varchar(100) DEFAULT NULL,
  ordernumber int(11) DEFAULT '0',
  clientip varchar(50) DEFAULT NULL,
  appkey varchar(100) DEFAULT NULL,
  parentgroupguid varchar(100) DEFAULT NULL,
  ouguids TEXT,
  rowguid varchar(50) NOT NULL,
  PRIMARY KEY (rowguid) 
);
GO

CREATE TABLE if not exists frame_myaddressbook_snapshot (
  groupguid varchar(100) DEFAULT NULL,
  objectguid varchar(100) DEFAULT NULL,
  objectname varchar(100) DEFAULT NULL,
  objecttype varchar(100) DEFAULT '( ''user'' )',
  ordernumber int(11) DEFAULT NULL,
  rowguid varchar(50) NOT NULL,
  clientip varchar(50) DEFAULT NULL,
  appkey varchar(100) DEFAULT NULL,
  bookguid varchar(50) NOT NULL,
  PRIMARY KEY (rowguid)
);
GO

CREATE TABLE if not exists frame_myaddressgroupright(
  rowguid varchar(50) NOT NULL,
  allowto varchar(50) DEFAULT NULL,
  allowtype varchar(50) DEFAULT NULL,
  groupguid varchar(50) DEFAULT NULL,
  PRIMARY KEY (rowguid)
);
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_MyAddressBook' and column_name = 'rowguid') then
  	alter table Frame_MyAddressBook add column rowguid nvarchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_MyAddressGroup' and column_name = 'parentgroupguid') then
  	alter table Frame_MyAddressGroup add column parentgroupguid nvarchar(50);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_MyAddressGroup' and column_name = 'ouguids') then
  	alter table Frame_MyAddressGroup add column ouguids text;
end if;

if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'Frame_MyAddressBook' and column_name = 'row_id') then
  	alter table Frame_MyAddressBook drop column row_id;
end if;

If not exists (select * from information_schema.KEY_COLUMN_USAGE t where table_schema = database() 
and t.TABLE_NAME='frame_myaddressbook' and t.CONSTRAINT_NAME='PRIMARY') then 
	truncate table frame_myaddressbook;
	alter table frame_myaddressbook ADD CONSTRAINT PRIMARY KEY(rowguid);
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --