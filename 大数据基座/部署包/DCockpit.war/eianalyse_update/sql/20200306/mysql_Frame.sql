-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
if (select count(*) from frame_config WHERE configname='isShowModelSyncButton')<1 then
INSERT INTO `frame_config` (`SYSGUID`, `CONFIGNAME`, `CONFIGVALUE`, `DESCRIPTION`, `ROW_ID`, `CLIENTTAG`, `CATEGORYGUID`, `ORDERNUMBER`, `isrestjsboot`, `manageindependent`) VALUES ('9d498290-9668-410c-ac85-94cd5d739393', 'isShowModelSyncButton', '0', '控制模型管理页面同步历史按钮显隐', '0', NULL, '', '0', '0', '0');
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --