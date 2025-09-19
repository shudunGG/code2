-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/10/31 【时间】
-- 添加表frame_user_password_modifylog --【何晓瑜】

if not exists (select * from dbo.sysobjects where id = object_id('frame_user_password_modifylog'))
create table frame_user_password_modifylog
   (
    rowguid nvarchar(50) not null primary key,
	updatetime datetime,
	userguid nvarchar(50) not null,
	lastpwd nvarchar(200) not null
    );
GO
