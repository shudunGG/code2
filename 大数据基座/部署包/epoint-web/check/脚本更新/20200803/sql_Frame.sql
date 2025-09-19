-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/8/3
-- 新增日志数据库表frame_logconfig,frame_log表新增appkey字段  -- 陈星怡

-- 新增日志数据库表frame_logconfig
if not exists (select * from dbo.sysobjects where id = object_id('frame_logconfig'))
create table frame_logconfig
   (
    sysguid                       nvarchar(100) primary key not null,
    attach_connectionstringname   nvarchar(100),
    attach_connectionstring       text,
    isnowuse                      int,
    ordernum                      int,
    databasetype                  nvarchar(100)
    );
GO

-- frame_log表新增appkey字段
if not exists (select name from syscolumns  where id = object_id('frame_log') and name='appkey' ) 
alter table frame_log add appkey  nvarchar(100); 
GO
