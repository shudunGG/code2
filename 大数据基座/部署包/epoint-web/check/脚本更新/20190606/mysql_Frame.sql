-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/06/06 【时间】
-- 【扩展控件管理新增描述字段】 --【薛炳】

-- 添加字段示例
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'EpointsformExtensibleControl' and column_name = 'TableType') then
    alter table EpointsformExtensibleControl add column TableType int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

--  epointsform中formid自增 --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF not EXISTS (
	SELECT
		*
	FROM
		information_schema. COLUMNS
	WHERE
		table_schema = DATABASE ()
	AND table_name = 'epointsform' 
	AND column_name = 'formId')   
    THEN 
    alter table epointsform add formId int not null;
    alter table epointsform add key(formId) ;
    Alter table epointsform MODIFY  formId int not null auto_increment ;
end if;
END;
GO
call epoint_proc_alter();
GO

-- DELIMITER ; --

-- epointsformlistversion  表添加baseouguid --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF NOT EXISTS (
	  SELECT * FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'epointsformlistversion' AND column_name = 'baseouguid')   
    THEN 
    alter table epointsformlistversion add column baseouguid nvarchar(50);
end if;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- epointsform表添加baseouguid --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF NOT EXISTS (
	  SELECT * FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'epointsform' AND column_name = 'baseouguid')   
    THEN 
    alter table epointsform add column baseouguid nvarchar(50);
end if;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- epointformversion  表添加baseouguid --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF NOT  EXISTS (
	  SELECT * FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'epointformversion' AND column_name = 'baseouguid')   
    THEN 
    alter table epointformversion add column baseouguid nvarchar(50);
end if;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- epointsformtablelist  表添加baseouguid --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF NOT EXISTS (
	  SELECT * FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'epointsformtablelist' AND column_name = 'baseouguid')   
    THEN 
    alter table epointsformtablelist add column baseouguid nvarchar(50);
end if;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- epointsformlistversion表添加status --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF NOT  EXISTS (
	  SELECT * FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'epointsformlistversion' AND column_name = 'status')   
    THEN 
    alter table epointsformlistversion add column status nvarchar(50);
end if;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- epointformversion表添加status --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF NOT  EXISTS (
	  SELECT * FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'epointformversion' AND column_name = 'status')   
    THEN 
    alter table epointformversion add column status nvarchar(50);
end if;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 列表管理添加字段，自增长 --季立霞
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF not EXISTS (
	SELECT
		*
	FROM
		information_schema. COLUMNS
	WHERE
		table_schema = DATABASE ()
	AND table_name = 'epointsformtablelist' 
	AND column_name = 'ListId')   
    THEN 
    alter table epointsformtablelist add ListId int not null;
    alter table epointsformtablelist add key(ListId) ;
    Alter table epointsformtablelist MODIFY  ListId int not null auto_increment ;
end if;
END;
GO
call epoint_proc_alter();
GO

-- epointsformtablelist表添加listtype --薛炳
drop procedure if exists`epoint_proc_alter`;
GO
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN
IF  NOT EXISTS (
	  SELECT * FROM information_schema. COLUMNS WHERE table_schema = DATABASE () AND table_name = 'epointsformtablelist' AND column_name = 'listtype')   
    THEN 
    alter table epointsformtablelist add column listtype nvarchar(50);
end if;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --


