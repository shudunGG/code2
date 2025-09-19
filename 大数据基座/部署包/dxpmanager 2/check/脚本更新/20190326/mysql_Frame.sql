-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/03/26 
-- 修改app_element中elementurl字段长度 -- 王颜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_element' and column_name = 'elementurl' and data_type = 'nvarchar' and character_maximum_length=200) then
    alter table app_element modify elementurl nvarchar(200);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- frame_userrole_snapshot表的row_id字段设置可为null--王露
alter table frame_userrole_snapshot modify column  row_id int(11) null;
GO

-- DELIMITER ; --