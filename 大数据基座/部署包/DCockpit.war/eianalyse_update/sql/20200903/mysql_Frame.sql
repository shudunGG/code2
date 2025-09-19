-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	if (select count(*) from frame_module WHERE MODULEGUID='14a66be2-4243-49ae-b4db-e38cee6bce0e' AND MODULENAME='概览')>0
	then
    	UPDATE frame_module SET MODULENAME='快速入口',isaddou=1 WHERE MODULEGUID='14a66be2-4243-49ae-b4db-e38cee6bce0e';
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='c0ba73db-8057-42a5-980a-4d18e4d7bdb5')<1
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('c0ba73db-8057-42a5-980a-4d18e4d7bdb5', '77870013', '概览', '', 'frame/pages/eianalysemis/desktop/index', 102, 0, 0, 'modicon-10;', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='771cd333-d7de-4e31-8ff3-69cc43a82e03' AND MODULENAME='概览')>0
    then
    	UPDATE frame_module SET isaddou=1 WHERE MODULEGUID='771cd333-d7de-4e31-8ff3-69cc43a82e03' AND MODULENAME='概览';
    end if;
    
    if (select count(1) from frame_module where MODULEGUID = '08a3ccb4-3558-4c4d-a7c4-dcafcac89a49' and MODULENAME = '标签画像管理')>0
    then
    	UPDATE frame_module SET BIGICONADDRESS='modicon-24;' WHERE MODULEGUID='08a3ccb4-3558-4c4d-a7c4-dcafcac89a49' AND MODULENAME='标签画像管理';
    end if;
    
    if (select count(1) from frame_module where MODULEGUID = 'd0e021e5-b61a-4d38-83fc-b665ac33b5a9' and MODULENAME = '个人中心')>0
    then
    	UPDATE frame_module SET BIGICONADDRESS='modicon-6;' WHERE MODULEGUID='d0e021e5-b61a-4d38-83fc-b665ac33b5a9' AND MODULENAME='个人中心';
    end if;
    
    if (select count(1) from frame_module where MODULEGUID = 'd7d5f3f2-46be-40d7-aa04-47ffabba0a8e' and MODULENAME = '标签应用')>0
    then
    	UPDATE frame_module SET BIGICONADDRESS='modicon-64;' WHERE MODULEGUID='d7d5f3f2-46be-40d7-aa04-47ffabba0a8e' AND MODULENAME='标签应用';
    end if;
    
    if (select count(1) from frame_module where MODULEGUID = 'c7b1d161-2972-4c4b-a85c-3c7dc4f8ec02' and MODULENAME = '知识图谱')>0
    then
    	UPDATE frame_module SET BIGICONADDRESS='modicon-5;' WHERE MODULEGUID='c7b1d161-2972-4c4b-a85c-3c7dc4f8ec02' AND MODULENAME='知识图谱';
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='0c971f19-57af-4080-9550-aa8a701d1618' and MODULECODE = '77910007')>0
    then
    	DELETE FROM frame_module WHERE `MODULEGUID`='0c971f19-57af-4080-9550-aa8a701d1618';
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='9693710c-a9d2-436c-8dfe-60a00ce9a409' and MODULECODE = '77910008')>0
    then
    	DELETE FROM frame_module WHERE `MODULEGUID`='9693710c-a9d2-436c-8dfe-60a00ce9a409';
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='f6d74b6f-301e-46bf-8275-4b0f620853a8' and MODULECODE = '77910009')>0
    then
    	DELETE FROM frame_module WHERE `MODULEGUID`='f6d14466-16e5-4bf9-a97c-d2a42d396af4';
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='b2fd2dd4-7200-4d2f-a06e-46421ba484ba' and MODULECODE = '77910010')>0
    then
    	DELETE FROM frame_module WHERE `MODULEGUID`='b2fd2dd4-7200-4d2f-a06e-46421ba484ba';
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='201bb347-1297-4272-aa6c-e0607697c8c4' and MODULECODE = '77910011')>0
    then
    	DELETE FROM frame_module WHERE `MODULEGUID`='201bb347-1297-4272-aa6c-e0607697c8c4';
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='7b68923a-822a-4c00-9ad8-9e0b09217895' and MODULECODE = '77910006')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('7b68923a-822a-4c00-9ad8-9e0b09217895', '77910006', '标签配置管理', '', '', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='30684169-f7a9-4821-a36f-1e6ad1f911aa' and MODULECODE = '779100060001')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('30684169-f7a9-4821-a36f-1e6ad1f911aa', '779100060001', '标签服务管理', '', 'frame/pages/eianalyse/portraittagsapi/portraittagsapilist', 0, 0, 0, 'modicon-52;', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='e6087f04-d5a6-48c0-b448-c2afea16af13' and MODULECODE = '779100060002')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('e6087f04-d5a6-48c0-b448-c2afea16af13', '779100060002', '行权限控制', '', 'frame/pages/eianalyse/portraitentityaccess/portraitentityaccesslist', 0, 0, 0, 'modicon-77;', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='f1937962-9391-4621-8c9f-9a08e4561954' and MODULECODE = '779100060003')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('f1937962-9391-4621-8c9f-9a08e4561954', '779100060003', '脱敏方法管理', '', 'frame/pages/portraitsys/desensitizationrule/desensitizationrulelist', 0, 0, 0, 'modicon-92;', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='211213d7-b656-454f-b0cd-08029aaa9469' and MODULECODE = '779100030005')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('211213d7-b656-454f-b0cd-08029aaa9469', '779100030005', '标签地图', '', 'frame/pages/portraitsys/panoramicview/index?moduleGuid=211213d7-b656-454f-b0cd-08029aaa9469', 0, 0, 0, 'modicon-77;', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    
    
    if (select count(*) from frame_module WHERE MODULEGUID='8284c8f1-f660-4985-a490-8080625bcee0' and MODULECODE = '7793')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('8284c8f1-f660-4985-a490-8080625bcee0', '7793', '移动驾驶舱', '', '', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='7dd81ab2-2996-44a2-8e1f-bac815f9a5de' and MODULECODE = '77930001')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('7dd81ab2-2996-44a2-8e1f-bac815f9a5de', '77930001', '指标管理', '', '', 990, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='e4e15ebf-0750-49b8-bdcd-654935969689' and MODULECODE = '779300010001')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('e4e15ebf-0750-49b8-bdcd-654935969689', '779300010001', '指标梳理', '', 'frame/pages/eianalysemis/cockpit/cockpitnorm/cockpitnormlist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='9fef6f9e-4f69-4130-8639-28d05a2b5ff2' and MODULECODE = '779300010002')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('9fef6f9e-4f69-4130-8639-28d05a2b5ff2', '779300010002', '任务执行日志', '', 'frame/pages/eianalysemis/cockpit/cockpitjoblog/cockpitjobloglist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='9620da5d-f107-441c-b474-701cf1faf586' and MODULECODE = '779300010003')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('9620da5d-f107-441c-b474-701cf1faf586', '779300010003', '预警结果', '', 'frame/pages/eianalysemis/cockpit/cockpitwarningrule/cockpitwarningresultquery', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='99dea1c4-5417-4599-aab0-a2e0783efb68' and MODULECODE = '77930002')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('99dea1c4-5417-4599-aab0-a2e0783efb68', '77930002', '移动端管理', '', '', 989, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='b7a8ab27-8318-49a7-9b5f-7c3001453bbb' and MODULECODE = '779300020001')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('b7a8ab27-8318-49a7-9b5f-7c3001453bbb', '779300020001', '指标操作', '', 'frame/pages/eianalysemis/cockpit/cockpitnorm/cockpitnormoperatelist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='57fa17dd-7c7c-49b6-b311-e4498839d7c8' and MODULECODE = '779300020002')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('57fa17dd-7c7c-49b6-b311-e4498839d7c8', '779300020002', '指标日志', '', 'frame/pages/eianalysemis/cockpit/cockpitnorm/cockpitnormloglist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='11936962-0997-447f-a098-cdb6e284903e' and MODULECODE = '779300020003')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('11936962-0997-447f-a098-cdb6e284903e', '779300020003', '问题反馈', '', 'frame/pages/eianalysemis/cockpit/cockpitfeedback/cockpitfeedbacklist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='b38d333e-2745-4382-b9d8-78c723ab9b07' and MODULECODE = '779300020004')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('b38d333e-2745-4382-b9d8-78c723ab9b07', '779300020004', '版块管理', '', 'frame/pages/eianalysemis/cockpit/cockpitplate/cockpitplatelist', 980, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='fde02e9a-5e4a-43dd-b7d0-18e64aba2031' and MODULECODE = '779300020005')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('fde02e9a-5e4a-43dd-b7d0-18e64aba2031', '779300020005', '卡片管理', '', '', 990, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='830121f5-0bdd-4d7f-bbfb-315df7b8b27e' and MODULECODE = '7793000200050001')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('830121f5-0bdd-4d7f-bbfb-315df7b8b27e', '7793000200050001', '卡片模板管理', '', 'frame/pages/eianalysemis/cockpit/cockpitcard/cockpitcardtemplatelist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='e0a4d84a-8c20-4d7d-ac51-bc3d5b2bef19' and MODULECODE = '7793000200050002')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('e0a4d84a-8c20-4d7d-ac51-bc3d5b2bef19', '7793000200050002', '卡片梳理', '', 'frame/pages/eianalysemis/cockpit/cockpitcard/cockpitcardlist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
    
    if (select count(*) from frame_module WHERE MODULEGUID='3060aaed-427a-450f-8b44-fc4dc2ab16fc' and MODULECODE = '7793000200050003')<1 
    then
    	INSERT INTO frame_module (`MODULEGUID`, `MODULECODE`, `MODULENAME`, `MOUDLEMENUNAME`, `MODULEURL`, `ORDERNUMBER`, `ISDISABLE`, `ISBLANK`, `BIGICONADDRESS`, `SMALLICONADDRESS`, `MODULETYPE`, `ISADDOU`, `ROW_ID`, isfromsoa, `IsUse`, `IsReserved`) VALUES('3060aaed-427a-450f-8b44-fc4dc2ab16fc', '7793000200050003', '卡片统计', '', 'frame/pages/eianalysemis/cockpit/cockpitcard/cockpitcardstatisticslist', 0, 0, 0, ';', NULL, 'public', 0, NULL, NULL, NULL, 0);
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --