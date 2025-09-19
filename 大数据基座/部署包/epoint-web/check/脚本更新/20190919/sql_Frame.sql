-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2019/09/19 【时间】
-- 添加表frame_user_dingtalk、frame_ou_dingtalk --【何晓瑜】

-- frame_ou_dingtalk
if not exists (select * from dbo.sysobjects where id = object_id('frame_ou_dingtalk'))
create table frame_ou_dingtalk
   (
               ouguid  nvarchar(50) not null primary key,
               dingtalkouid  bigint
    );
GO

-- frame_user_dingtalk
if not exists (select * from dbo.sysobjects where id = object_id('frame_user_dingtalk'))
create table frame_user_dingtalk
   (
               dingtalkunionid  nvarchar(50) not null primary key,
               dingtalkuserid  nvarchar(50),
               userguid  nvarchar(50)
    );
GO
