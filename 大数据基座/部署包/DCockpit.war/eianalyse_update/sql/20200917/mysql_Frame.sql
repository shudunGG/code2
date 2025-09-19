drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from frame_config where CONFIGNAME='labelAdminGroup')<1
     then
            INSERT INTO frame_config (`SYSGUID`, `CONFIGNAME`, `CONFIGVALUE`, `DESCRIPTION`, `ROW_ID`, `CLIENTTAG`, `CATEGORYGUID`, `ORDERNUMBER`, isrestjsboot, manageindependent) VALUES('873f2987-12cd-4810-b796-bcc5082a4581', 'labelAdminGroup', 'labelAdminGroup', '标签管理员角色名称', 0, NULL, '', 0, 0, 0);
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --