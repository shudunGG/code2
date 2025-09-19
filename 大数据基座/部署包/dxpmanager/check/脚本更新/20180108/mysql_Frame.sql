-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 更新函数getChildOuList-- 何晓瑜
drop function if exists getChildOuList;
GO
create  function getChildOuList(rootId VARCHAR(50)) RETURNS longtext
BEGIN
	DECLARE sTemp longtext;
	DECLARE sTempChd longtext;
	SET@@group_concat_max_len = 102400;
	SET sTemp = '$';
	SET sTempChd = rootId;
WHILE sTempChd IS NOT NULL DO
	SET sTemp = concat(sTemp, ',', sTempChd);
	SELECT group_concat(ouguid) INTO sTempChd FROM frame_ou
	WHERE FIND_IN_SET(parentouguid, sTempChd) > 0;
END
WHILE;
	SET@@group_concat_max_len = 1024;
RETURN SUBSTRING(sTemp, 3);
END
GO

-- 2018/01/08
-- 微服务支撑框架中的mysql脚本，此表作为框架标准表。-- 王颜
create table if not exists zzz_ecloud_check
(id int(1) not null) ENGINE=InnoDB DEFAULT CHARSET=utf8; 
GO

drop procedure if exists `epoint_proc_insert`;
GO
create   procedure `epoint_proc_insert`()
begin 
if not exists  (select 1 from  zzz_ecloud_check where id = '1') then
  insert into zzz_ecloud_check(id) values('1');
end if;
end;
GO
call epoint_proc_insert();
GO
drop procedure if exists  `epoint_proc_insert`;
GO


-- DELIMITER ; --