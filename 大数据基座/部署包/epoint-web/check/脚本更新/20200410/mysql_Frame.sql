-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2020/04/10
-- 添加表workflow_transactor_sequence --陈端一
create table if not exists workflow_transactor_sequence 
(
 sequenceGuid varchar(50) NOT NULL,
 pviGuid varchar(50) DEFAULT NULL,
 transactor varchar(50) DEFAULT NULL,
 transactorName varchar(50) DEFAULT NULL,
 ouGuid varchar(50) DEFAULT NULL,
 operationDate datetime DEFAULT NULL,
 tag int(11) DEFAULT NULL,
 activityGuid varchar(50) DEFAULT NULL,
 workItemGuid varchar(50) DEFAULT NULL,
 orderNum int(11) DEFAULT NULL,
 note varchar(500) DEFAULT NULL,
 clientGuid varchar(100) DEFAULT NULL,
  PRIMARY KEY (sequenceGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO


-- 已存在frame_lessee表，只需要向表中添加username，password，del_flag字段
drop procedure if exists`epoint_proc_alter`;
GO
create  procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_lessee' and column_name = 'username' and data_type = 'varchar') then
    alter table frame_lessee add column username varchar(100);
end if;

if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_lessee' and column_name = 'password' and data_type = 'varchar') then
    alter table frame_lessee add column password varchar(500);
end if;
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_lessee' and column_name = 'del_flag' and data_type = 'varchar') then
    alter table frame_lessee add column del_flag varchar(1);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO



-- 添加表frame_lesseedata --刘飞龙
create table if not exists frame_lesseedata (
  RowGuid varchar(100) NOT NULL,
  lesseeguid varchar(100) DEFAULT NULL,
  classname varchar(100) DEFAULT NULL,
  strategy varchar(100) DEFAULT NULL,
  lastdate datetime DEFAULT NULL,
  orderNumber int(11) DEFAULT NULL,
  del_flag varchar(1) CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (RowGuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
GO

-- DELIMITER ; --