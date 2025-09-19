drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from frame_module where MODULEGUID='9693710c-a9d2-436c-8dfe-60a00ce9a409')<1
     then
        INSERT INTO frame_module(MODULEGUID, MODULECODE, MODULENAME, MOUDLEMENUNAME, MODULEURL, ORDERNUMBER, ISDISABLE, ISBLANK, BIGICONADDRESS, SMALLICONADDRESS, MODULETYPE, ISADDOU, ROW_ID, isfromsoa, IsUse, IsReserved) VALUES ('9693710c-a9d2-436c-8dfe-60a00ce9a409', '77910008', '行权限控制', '行权限控制', 'frame/pages/eianalyse/portraitentityaccess/portraitentityaccesslist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --