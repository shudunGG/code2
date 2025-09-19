-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/09/12
-- 二维码登录数据表

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('frame_qrcode'))
create table frame_qrcode
   (
    rowguid     nvarchar(50) not null primary key,
    code        nvarchar(50),
    token        nvarchar(50),
    status       integer,
    scantime     datetime
    );
GO

