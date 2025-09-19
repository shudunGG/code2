drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
	 if  (select count(1) from frame_config where CONFIGNAME='SOURCEAPPGUID')<1
     then
       INSERT INTO frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) Values('9b813b01-9474-4db5-a1f7-8b73fd252774','SOURCEAPPGUID','64a69308-8033-45d6-a6c8-62af6f68fb9a','我们应用再中间平台guid',null,null,'',0) ON DUPLICATE KEY UPDATE sysguid='9b813b01-9474-4db5-a1f7-8b73fd252774';
     end if;
	 if  (select count(1) from frame_config where CONFIGNAME='APPKEY')<1
     then
       INSERT INTO frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) Values('94db540b-bf51-4280-bcbf-01c8b4c5531c','APPKEY','','当前系统再第三方的标识',null,null,'',0) ON DUPLICATE KEY UPDATE sysguid='94db540b-bf51-4280-bcbf-01c8b4c5531c';
     end if;
     if  (select count(1) from frame_config where CONFIGNAME='INTERMEDIATE_PLATFORM_URL')<1
     then
       INSERT INTO frame_config (sysguid,ConfigName,ConfigValue,Description,Row_ID,Clienttag,categoryguid,ordernumber) Values('40da995a-7928-4809-b7e6-5c60bdb77642','INTERMEDIATE_PLATFORM_URL','http://192.168.206.120:8234/EpointCase/rest/case/','中间平台地址（此处配的测试地址请修改）',null,null,'',0) ON DUPLICATE KEY UPDATE sysguid='40da995a-7928-4809-b7e6-5c60bdb77642';
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --