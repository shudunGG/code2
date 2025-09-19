-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/06/19
-- epointsformtemplate表添加MobileWorkflowDetailTemplateUrl --薛炳
-- frame_ip_lockinfo表添加CreateDate、UpdateDate -- 俞俊男

-- frame_ip_lockinfo表添加CreateDate、UpdateDate
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ip_lockinfo' and column_name = 'CreateDate') then
    alter table frame_ip_lockinfo add column CreateDate datetime;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ip_lockinfo' and column_name = 'UpdateDate') then
    alter table frame_ip_lockinfo add column UpdateDate datetime;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- epointsformtemplate表删除MobileWorkflowDetailTemplateUrl
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsformtemplate' and column_name = 'MobileWorkflowDetailTemplateUrl') then 
    alter table epointsformtemplate drop COLUMN MobileWorkflowDetailTemplateUrl;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- epointsformtemplate表添加mobilewfdetailtemplateurl
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'epointsformtemplate' and column_name = 'mobilewfdetailtemplateurl') then
    alter table epointsformtemplate add column mobilewfdetailtemplateurl nvarchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ;
