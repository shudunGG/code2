-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/5/22
-- 修改frame_userrolerelation索引加上ouguid --hexy

drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select * from information_schema.statistics where table_schema= (select DATABASE()) and table_name = 'frame_userrolerelation' and index_name = 'uq_frame_userrolerelation' and COLUMN_NAME = 'ouguid') then
    alter table frame_userrolerelation drop index uq_frame_userrolerelation;
    alter table frame_userrolerelation add unique uq_frame_userrolerelation(userguid, roleguid, ouguid);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- 修改frame_userrolerelation所有关联快照表索引加上ouguid --hexy
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
BEGIN
DECLARE tname VARCHAR(50);
DECLARE uqname VARCHAR(50);
DECLARE Done int(1) DEFAULT 0;
DECLARE lists CURSOR FOR select table_name from information_schema.tables where table_schema = database()  and table_name like 'frame_userrole_snapshot_%';
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
OPEN lists;
FETCH NEXT FROM lists INTO tname;
REPEAT
IF NOT Done THEN
set uqname = CONCAT('uq_frame_ur_snapshot_' , substring(tname, 25));
IF EXISTS (SELECT * FROM information_schema.statistics WHERE table_schema= (select DATABASE()) AND table_name = tname AND index_name = uqname) THEN  
    SET @dropSql = CONCAT('alter table ',tname,' drop index ', uqname);
    PREPARE stmt FROM @dropSql;
    EXECUTE stmt;
    SET @createSql = CONCAT('alter table ',tname,' add unique ', uqname,'(userguid, roleguid, ouguid, appkey, clientip)');
    PREPARE stmt FROM @createSql;
    EXECUTE stmt;
END IF;
END IF;
FETCH NEXT FROM lists INTO tname;
UNTIL Done END REPEAT;
CLOSE lists;
END;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO
-- DELIMITER ; --