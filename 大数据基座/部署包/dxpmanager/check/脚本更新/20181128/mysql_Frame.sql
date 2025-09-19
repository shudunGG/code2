-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 2018/11/28
-- 证书路径字段加大 --何晓瑜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'messages_ios_certification' and column_name = 'type') then 
    alter table messages_ios_certification change type certype varchar(50);   
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
            where table_schema = database() and table_name = 'messages_ios_certification' and column_name = 'path' and data_type = 'varchar' and character_maximum_length=200) then
    alter table messages_ios_certification modify path varchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- comm_notice_user_read表添加 --俞俊男

-- 添加comm_notice_user_read表
create table if not exists comm_notice_user_read
(
    rowguid  varchar(100) NOT NULL primary key,
    userguid  varchar(100) NOT NULL ,
	noticeguid  varchar(100) NOT NULL ,
	updateTime  datetime NOT NULL ,
	bak1  varchar(100) NULL  
);
GO

-- DELIMITER ; --