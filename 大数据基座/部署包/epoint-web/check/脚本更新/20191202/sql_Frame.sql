-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/12/2
-- 新增表frame_login_statistics --【俞俊男】

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('frame_login_statistics'))
create table frame_login_statistics
   (
    rowguid     nvarchar(50) not null primary key,
    loginid     nvarchar(100),
	failnum int,
	successnum int,
	lastlogintime datetime,
	lastfreqrecordtime datetime,
	platform     nvarchar(50)
    );
GO