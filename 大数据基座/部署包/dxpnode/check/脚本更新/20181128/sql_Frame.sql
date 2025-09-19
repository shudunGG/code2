-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/28
-- 证书路径字段加大 --何晓瑜

if  exists (select * from information_schema.columns  where  table_name = 'messages_ios_certification' and column_name='type') 
exec sp_rename 'messages_ios_certification.type','certype';
GO


if not exists (select * from information_schema.columns where  table_name = 'messages_ios_certification' and column_name = 'path' and data_type='varchar' and character_maximum_length=200) 
alter table messages_ios_certification 
alter column path varchar(200); 
GO


-- comm_notice_user_read表添加 -- 俞俊男

-- 添加comm_notice_user_read表
if not exists (select * from dbo.sysobjects where id = object_id('comm_notice_user_read'))
create table comm_notice_user_read
   (
    rowguid  nvarchar(100) NOT NULL primary key,
    userguid  nvarchar(100) NOT NULL ,
	noticeguid  nvarchar(100) NOT NULL ,
	updateTime  datetime NOT NULL ,
	bak1  nvarchar(100) NULL
    );
GO

