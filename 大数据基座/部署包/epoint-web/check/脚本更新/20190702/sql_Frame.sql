-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/07/02

-- 添加更新提醒信息表
if not exists (select * from dbo.sysobjects where id = object_id('comm_message_remind_info'))
create table comm_message_remind_info
   (
    infoguid   nvarchar(100) not null primary key,
    infotitle   nvarchar(500),
    remindtime  datetime,
    targetuserguid nvarchar(2000),
    targetusername nvarchar(2000),
    infocontent   text,
    createtime   datetime,
    createusername   nvarchar(50),
    createuserguid   nvarchar(100),            
    ordernum    int
    );
GO

