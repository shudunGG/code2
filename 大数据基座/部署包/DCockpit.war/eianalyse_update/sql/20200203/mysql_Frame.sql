-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
    if (select count(*) from frame_module WHERE MODULEGUID='ea1d7614-dca7-4267-a48f-4284150ebd6d' AND MODULENAME='图库管理')>0 then
    UPDATE frame_module SET MODULEURL='frame/pages/portraitsys/portraitmanage/portraitmanagelist?moduleGuid=ea1d7614-dca7-4267-a48f-4284150ebd6d' WHERE MODULEGUID='ea1d7614-dca7-4267-a48f-4284150ebd6d' AND MODULENAME='图库管理';
    end if;
    if (select count(*) from frame_module WHERE MODULEGUID='2a0d5ab7-0ea6-4e0e-a065-0f79587a1abf' AND MODULENAME='图谱查看')>0 then
    UPDATE frame_module SET MODULEURL='frame/pages/eianalysedemosys/resourcemap/relation?moduleGuid=2a0d5ab7-0ea6-4e0e-a065-0f79587a1abf' WHERE MODULEGUID='2a0d5ab7-0ea6-4e0e-a065-0f79587a1abf' AND MODULENAME='图谱查看';
    end if;
    if (select count(1) from frame_module where MODULEGUID = '103bee9f-d36d-4af5-9ee9-a5266a8af033' and MODULECODE = '779100050004')<1 then
    INSERT INTO frame_module (MODULEGUID, MODULECODE, MODULENAME, MOUDLEMENUNAME, MODULEURL, ORDERNUMBER, ISDISABLE, ISBLANK, BIGICONADDRESS, SMALLICONADDRESS, MODULETYPE, ISADDOU, ROW_ID, isfromsoa, IsUse, IsReserved) VALUES ('103bee9f-d36d-4af5-9ee9-a5266a8af033', '779100050004', '图库调度', '', 'frame/pages/portraitsys/portraitmanage/portraitlabeltasklist', '0', '0', '0', ';', NULL, 'public', '0', NULL, NULL, NULL, '0');
    end if;
    if (select count(1) from frame_moduleright where row_id = 1076473)<1 then
    INSERT INTO frame_moduleright (ROW_ID, MODULEGUID, ALLOWTO, ALLOWTYPE, isfromsoa, righttype) VALUES ('1076473', '103bee9f-d36d-4af5-9ee9-a5266a8af033', 'All', 'Role', NULL, 'public');
    end if;
    if (select count(*) from frame_module WHERE MODULEGUID='c7b1d161-2972-4c4b-a85c-3c7dc4f8ec02' AND MODULENAME='知识图谱')>0 then
    UPDATE frame_module SET ISADDOU='0' WHERE MODULEGUID='c7b1d161-2972-4c4b-a85c-3c7dc4f8ec02' AND MODULENAME='知识图谱';
    end if;
    if (select count(*) from frame_module WHERE MODULEGUID='e1e63b9e-af6e-46c4-8024-93f39bef0755' AND MODULENAME='关系管理')>0 then
    UPDATE frame_module SET ISADDOU='1' WHERE MODULEGUID='e1e63b9e-af6e-46c4-8024-93f39bef0755' AND MODULENAME='关系管理';
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --