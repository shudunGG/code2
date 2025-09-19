-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2021/6/16
-- 表frame_user_snapshot添加字段gesturepassword,hiredate --【白钦】
-- 表frame_ou_snapshot添加字段oucodefull --【白钦】


-- 表frame_user_snapshot添加字段gesturepassword,hiredate
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user_snapshot' and column_name = 'gesturepassword') then
    alter table frame_user_snapshot add column gesturepassword nvarchar(500);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user_snapshot' and column_name = 'hiredate') then
    alter table frame_user_snapshot add column hiredate datetime;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO


-- 表frame_ou_snapshot添加字段oucodefull
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_ou_snapshot' and column_name = 'oucodefull') then
    alter table frame_ou_snapshot add column oucodefull nvarchar(100);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --