-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin if (select count(*) from frame_config WHERE configname='platform') <1 then
INSERT INTO `frame_config` (`SYSGUID`, `CONFIGNAME`, `CONFIGVALUE`, `DESCRIPTION`, `ROW_ID`, `CLIENTTAG`, `CATEGORYGUID`, `ORDERNUMBER`, `isrestjsboot`, `manageindependent`) VALUES ('2b07a98e-fbe7-4a34-aa48-10f99257f752', 'platform', 'hw-6.5.1', 'hadoop版本，目前可填写hdp-2.6.2,hw-6.5.1,hw-C80', 0, NULL, '', 0, 0, 0);
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --