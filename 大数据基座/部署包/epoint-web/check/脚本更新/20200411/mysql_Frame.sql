-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/4/10 
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
-- 手势密码和生物识别锁定功能添加字段 --王颜
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user' and column_name = 'gesturepassword') then
    alter table frame_user add column gesturepassword nvarchar(500);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'mobile_user' and column_name = 'gesturepassword') then
    alter table mobile_user add column gesturepassword nvarchar(500);
end if;
-- 非织语环境禁止重复登录功能添加字段标记已被踢出 --王颜
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'sso_token_info' and column_name = 'mobilekickout') then
    alter table sso_token_info add column mobilekickout int;
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --