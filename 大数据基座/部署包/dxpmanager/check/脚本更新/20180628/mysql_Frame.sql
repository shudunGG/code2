-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/06/28 
-- 表字段text修改为varchar--王颜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ou_extendinfo' and column_name = 'INDIVIDUATIONIMGPATH' 
            and data_type = 'varchar' and character_maximum_length=500) then
    alter table frame_ou_extendinfo modify INDIVIDUATIONIMGPATH varchar(500);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ou_e_snapshot' and column_name = 'INDIVIDUATIONIMGPATH' 
            and data_type = 'varchar' and character_maximum_length=500) then
    alter table frame_ou_e_snapshot modify INDIVIDUATIONIMGPATH varchar(500);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachinfo' and column_name = 'ATTACHFILENAME' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table frame_attachinfo modify ATTACHFILENAME nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachinfo' and column_name = 'CONTENTTYPE' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table frame_attachinfo modify CONTENTTYPE nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachinfo' and column_name = 'CLIENGTAG' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table frame_attachinfo modify CLIENGTAG nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachinfo' and column_name = 'CLIENGINFO' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table frame_attachinfo modify CLIENGINFO nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachinfo' and column_name = 'FILEPATH' 
            and data_type = 'varchar' and character_maximum_length=500) then
    alter table frame_attachinfo modify FILEPATH nvarchar(500);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachstorage' and column_name = 'CONTENTTYPE' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table frame_attachstorage modify CONTENTTYPE nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_attachstorage' and column_name = 'CLIENGTAG' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table frame_attachstorage modify CLIENGTAG nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'onlinemessage_info' and column_name = 'NOTE' 
            and data_type = 'varchar' and character_maximum_length=500) then
    alter table onlinemessage_info modify NOTE nvarchar(500);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'code_items' and column_name = 'itemtext' 
            and data_type = 'varchar' and character_maximum_length=100) then
    alter table code_items modify itemtext nvarchar(100);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'dbname' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table datasource modify dbname nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'connectionstring' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table datasource modify connectionstring nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_config' and column_name = 'CONFIGVALUE' 
            and data_type = 'varchar' and character_maximum_length=500) then
    alter table frame_config modify CONFIGVALUE nvarchar(500);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_config_category' and column_name = 'CATEGORYDES' 
            and data_type = 'varchar' and character_maximum_length=200) then
    alter table frame_config_category modify CATEGORYDES nvarchar(200);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_quicklink' and column_name = 'LINKURL' 
            and data_type = 'varchar' and character_maximum_length=500) then
    alter table frame_quicklink modify LINKURL nvarchar(500);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_quicklink_user' and column_name = 'LINKURL' 
            and data_type = 'varchar' and character_maximum_length=500) then
    alter table frame_quicklink_user modify LINKURL nvarchar(500);
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --