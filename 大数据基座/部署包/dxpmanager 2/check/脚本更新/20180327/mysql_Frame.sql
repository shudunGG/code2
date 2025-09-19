-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2017/10/20 【时间】
-- 【内容简单介绍】 --【添加人姓名】

-- 修改frame_ip_lockinfo -- 施佳炜
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ip_lockinfo' and column_name = 'Ip_manager_type') then 
    alter table frame_ip_lockinfo add column Ipmanagertype varchar(50);
else 
    alter table frame_ip_lockinfo CHANGE Ip_manager_type Ipmanagertype varchar(50);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --