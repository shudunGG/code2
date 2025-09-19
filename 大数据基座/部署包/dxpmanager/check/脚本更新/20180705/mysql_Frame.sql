-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 2018/07/05
-- 去除frame_user中ouguid字段的空格--王颜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if exists (select * from frame_user where OUGUID like '% %') then
    update  frame_user set OUGUID = lTRIM(RTRIM(OUGUID));
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 数据源表放大servername长度--王露
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select * from information_schema.columns
            where table_schema = database() and table_name = 'datasource' and column_name = 'SERVERNAME' and character_maximum_length=500) then
    alter table datasource modify  SERVERNAME nvarchar(500);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --