drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from frame_config where CONFIGNAME='SYS_TAGS_SERVICE_ADDRESS')<1
     then
       INSERT INTO frame_config(`SYSGUID`, `CONFIGNAME`, `CONFIGVALUE`, `DESCRIPTION`, `ROW_ID`, `CLIENTTAG`, `CATEGORYGUID`, `ORDERNUMBER`, `isrestjsboot`, `manageindependent`) VALUES ('550c3b7d-5b35-4cb3-bfd1-f800c7ba24d7', 'SYS_TAGS_SERVICE_ADDRESS', '', '智能分析平台的标签数据服务访问地址  1.如果没有配置数据服务集群,则只需要配置数据服务的业务系统的根地址,例如:http://192.168.133.90:8080/eiAnalyse  2.如果配置了数据服务集群,请配置nginx代理后的访问地址', 0, NULL, '103afb14-0f93-43f9-bc12-c7c60cf06618', 0, 0, 0);
     end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --