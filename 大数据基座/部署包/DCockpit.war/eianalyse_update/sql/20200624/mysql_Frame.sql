drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from frame_module where MODULEGUID='0c971f19-57af-4080-9550-aa8a701d1618')<1
     then
       INSERT INTO  frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, `isfromsoa`, `IsUse`, `IsReserved`) VALUES ('0c971f19-57af-4080-9550-aa8a701d1618', '77910007', 'API服务管理', 'API服务管理', 'frame/pages/eianalyse/portraittagsapi/portraittagsapilist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --