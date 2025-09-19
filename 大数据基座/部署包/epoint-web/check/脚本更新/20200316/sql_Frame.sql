-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/03/16
if not exists (select * from dbo.sysobjects where id = object_id('app_sync_subscribe'))
create table app_sync_subscribe
(
  rowguid             nvarchar(50) not null primary key,
  clienttag           nvarchar(50)  null,
  clientname          nvarchar(100)  null,
  subscribepage       nvarchar(200)  null,
  createdate          datetime DEFAULT null
);
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_soanotify_log'))
create table frame_soanotify_log
(
  logguid          nvarchar(50) not null primary key,
  status           int null,
  eventname        nvarchar(50) null,
  entityname       nvarchar(100) null,
  datalist         text null,
  clienttype       nvarchar(50) null,
  pushguid         nvarchar(50) null,
  remark           nvarchar(2000) null,
  appkey           nvarchar(50) null,
  notifylistener   nvarchar(100) null,
  pushdate         datetime null,
  pushurl          nvarchar(200) null
);
GO

-- 2020/03/16
-- 新建frame_privacy隐私表 --孟佳佳
if not exists (select * from dbo.sysobjects where id = object_id('frame_privacy'))
create table frame_privacy(
  rowguid              	nvarchar(50) not null primary key,
  privacyStatement     	text null,
  privacyVersion       	nvarchar(50) null,
  privacyStatus		   	int default 0,
  publishTime			datetime null,
);
GO

-- 2020/03/16
-- 新建frame_privacy_agree隐私同意表 --孟佳佳
CREATE TABLE frame_privacy_agree(
  rowguid              	nvarchar(50) not null primary key,
  privacyGuid          	nvarchar(50) null,
  agreeUserguid         nvarchar(50) null,
  agreeTime           	datetime null,
);
GO