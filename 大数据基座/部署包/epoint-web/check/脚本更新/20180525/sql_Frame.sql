-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/05/16 【时间】
-- 【地址簿表，新增2个快照表（frame_myaddressgroup_snapshot、frame_myaddressbook_snapshot），同步地址簿的时候用，
--	新增一个地址簿授权表（frame_myaddressgroupright），地址簿同步选择同步范围和授权部门用。
--	通讯录表（frame_myaddressbook）、地址簿表（Frame_MyAddressGroup）修改了几个字段，为了更好的支持同步同能，】 --【施佳炜】

if not exists (select * from dbo.sysobjects where id = object_id('frame_myaddressgroup_snapshot'))
create table frame_myaddressgroup_snapshot(
  groupguid nvarchar(100) NOT NULL,
  groupname nvarchar(100) DEFAULT NULL,
  owneruserguid nvarchar(100) DEFAULT NULL,
  belongbaseouguid nvarchar(100) DEFAULT NULL,
  ordernumber integer DEFAULT '0',
  clientip nvarchar(50) DEFAULT NULL,
  appkey nvarchar(100) DEFAULT NULL,
  parentgroupguid nvarchar(100) DEFAULT NULL,
  ouguids TEXT,
  rowguid nvarchar(50) NOT NULL primary key
);
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_myaddressbook_snapshot'))
create table frame_myaddressbook_snapshot (
  groupguid nvarchar(100) DEFAULT NULL,
  objectguid nvarchar(100) DEFAULT NULL,
  objectname nvarchar(100) DEFAULT NULL,
  objecttype nvarchar(100) DEFAULT '( ''user'' )',
  ordernumber integer DEFAULT NULL,
  rowguid nvarchar(50) NOT NULL primary key,
  clientip nvarchar(50) DEFAULT NULL,
  appkey nvarchar(100) DEFAULT NULL,
  bookguid nvarchar(50) NOT NULL
);
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_myaddressgroupright'))
create table frame_myaddressgroupright(
  rowguid nvarchar(50) NOT NULL primary key,
  allowto nvarchar(50) DEFAULT NULL,
  allowtype nvarchar(50) DEFAULT NULL,
  groupguid nvarchar(50) DEFAULT NULL
);
GO

if not exists (select name from syscolumns  where id = object_id('Frame_MyAddressBook') and name='rowguid' ) 
alter table Frame_MyAddressBook add rowguid nvarchar(50) not null;
GO

if not exists (select name from syscolumns  where id = object_id('Frame_MyAddressGroup') and name='parentgroupguid' ) 
alter table Frame_MyAddressGroup add parentgroupguid nvarchar(50);
GO

if not exists (select name from syscolumns  where id = object_id('Frame_MyAddressGroup') and name='ouguids' ) 
alter table Frame_MyAddressGroup add ouguids text;
GO

if  exists (select name from syscolumns  where id = object_id('frame_myaddressbook') and name='row_id' ) 
alter table Frame_MyAddressBook drop constraint  PK_Frame_MyAddressBook;
alter table Frame_MyAddressBook drop column row_id;
GO

if  exists (select name from syscolumns  where id = object_id('frame_myaddressbook') and name='rowguid' ) 
alter table Frame_MyAddressBook add constraint PK_Frame_MyAddressBook primary key(rowguid);
GO


