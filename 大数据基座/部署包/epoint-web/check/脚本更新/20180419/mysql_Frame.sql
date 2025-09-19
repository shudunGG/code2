-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/4/19
-- 检测没有扩展信息的用户，新增扩展信息--周志豪
drop procedure if exists`test_insert`;
GO
create   procedure `test_insert`()
BEGIN 

DECLARE i INT DEFAULT 0;

DECLARE j INT DEFAULT (select count(*) from frame_user u LEFT OUTER JOIN frame_user_extendinfo ue on u.USERGUID=ue.USERGUID where ISNULL(ue.USERGUID));

WHILE i<j
DO
insert into frame_user_extendinfo(userguid) (select u.USERGUID from frame_user u LEFT OUTER JOIN frame_user_extendinfo ue on u.USERGUID=ue.USERGUID where ISNULL(ue.USERGUID) limit 0,1);
SET i=i+1; 
END WHILE ; 
 
END;
GO
call test_insert();
GO
drop procedure if exists `test_insert`;
GO

-- DELIMITER ; --