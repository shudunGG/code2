-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- frame_anti_tamper表新增 datatype、tableid、datamaskingtype字段，修改anticolumns长度--jyjie
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
-- 新增datatype
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_anti_tamper' and column_name = 'datatype') then
    alter table frame_anti_tamper add column datatype nvarchar(50);
end if;
-- 新增tableid
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_anti_tamper' and column_name = 'tableid') then
    alter table frame_anti_tamper add column tableid int;
end if;
-- 新增datamaskingtype
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_anti_tamper' and column_name = 'datamaskingtype') then
    alter table frame_anti_tamper add column datamaskingtype nvarchar(500);
end if;
-- 修改anticolumns长度
if not exists (select null from information_schema.columns
			where table_schema = database() and table_name = 'frame_anti_tamper' and column_name = 'anticolumns' and data_type = 'varchar' and character_maximum_length=50) then
    alter table frame_anti_tamper modify column anticolumns nvarchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --