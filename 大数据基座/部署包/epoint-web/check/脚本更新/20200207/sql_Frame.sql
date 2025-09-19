-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/02/07 【时间】
-- 添加表frame_ui_deskmodule --【陈星怡】
-- 添加表frame_ui_desk_personalmodule --【陈星怡】

if not exists (select * from dbo.sysobjects where id = object_id('frame_ui_deskmodule'))
create table frame_ui_deskmodule
   (
    rowguid nvarchar(50) not null primary key,
	sourceguid nvarchar(50) not null,
	belongdeskguid nvarchar(50) not null,
	opentype nvarchar(50),
	ordernumber int,
	costomparam nvarchar(2000)
    );
GO

if not exists (select * from dbo.sysobjects where id = object_id('frame_ui_desk_personalmodule'))
create table frame_ui_desk_personalmodule
   (
    rowguid nvarchar(50) not null primary key,
	parentguid nvarchar(50),
	belongdeskguid nvarchar(50) not null,
	ordernumber int,
	userguid nvarchar(50) not null,
	isinstalled int,
	parentname nvarchar(50)
    );
GO