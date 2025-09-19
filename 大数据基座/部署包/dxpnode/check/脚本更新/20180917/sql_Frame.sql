-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/17 

-- 添加消息类型字段--周志豪
if not exists (select name from syscolumns  where id = object_id('messages_type') and name='opentype' ) 
alter table messages_type add opentype nvarchar(50); 
GO

-- 订阅消息表
-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('Message_subscribe'))
create table Message_subscribe
   (
    rowguid         nvarchar(50) not null primary key,
    appguid         nvarchar(50),
    subscribeguid         nvarchar(50),
    subscribetype         nvarchar(50)
    );
GO
