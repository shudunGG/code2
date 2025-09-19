-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/09/25 
-- 修改isrestjsboot字段类型

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_config' and column_name = 'isrestjsboot' and data_type = 'varchar') then 
	update frame_config set isrestjsboot='1' where isrestjsboot='true';
	update frame_config set isrestjsboot='0' where isrestjsboot='false';
	alter table frame_config modify column isrestjsboot int(11) ;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --