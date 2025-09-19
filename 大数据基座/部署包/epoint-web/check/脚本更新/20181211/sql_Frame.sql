-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/12/12
-- 新增 API运行统计资源表 --周志豪

if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_statistics_subject'))
create table api_runtime_statistics_subject
   (
    rowguid     nvarchar(50) not null primary key,
    resourcetype     nvarchar(50),
    updatetime       bigint,
    uuid     	 nvarchar(50),
    displayname     nvarchar(100),
    enabled     nvarchar(50),
    metric     nvarchar(200)
    );
GO

-- 新增API运行统计数据表 --周志豪
if not exists (select * from dbo.sysobjects where id = object_id('api_runtime_statistics_data'))
create table api_runtime_statistics_data
   (
    rowguid     nvarchar(50) not null primary key,
    metric     nvarchar(200),
    statisticsvalue       nvarchar(1000),
    statisticstime     	 bigint,
    displayname     nvarchar(100),
    ordernumber     int
    );
GO

-- 新增开发者表 --周志豪
if not exists (select * from dbo.sysobjects where id = object_id('frame_developer'))
create table frame_developer
   (
    rowguid     nvarchar(50) not null primary key,
    userguid     nvarchar(100),
    loginid       nvarchar(100),
    displayname   nvarchar(100),
    password     nvarchar(100),
    mobile     nvarchar(100),
    companyname     nvarchar(500)
    );
GO

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('api_info') and name='jsoncontent' ) 
alter table api_info add   jsoncontent  nvarchar(1000); 
GO

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('api_runtime_log') and name='responsetime' ) 
alter table api_runtime_log add responsetime  int; 
GO
