-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists `epoint_proc_alter`;
GO
	create procedure `epoint_proc_alter`() begin if (
		select
			count(*)
		from
			frame_config
		where
			CONFIGNAME = 'hasRight'
	) < 1 then
INSERT INTO
	frame_config (
		SYSGUID,
		CONFIGNAME,
		CONFIGVALUE,
		DESCRIPTION,
		ROW_ID,
		CLIENTTAG,
		CATEGORYGUID,
		ORDERNUMBER,
		isrestjsboot,
		manageindependent
	)
VALUES
	(
		'08c8f9fa-8657-4ee4-82e7-285d46833237',
		'hasRight',
		'1',
		'是否开启标签访问控制   0为关闭  1为开启',
		0,
		NULL,
		'635c852a-3729-4f14-b4a3-da57b6ec5022',
		0,
		0,
		0
	);
end if;
end;
GO
	call epoint_proc_alter();
GO
	drop procedure if exists `epoint_proc_alter`;
GO
	-- DELIMITER ; --