-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2019/07/02

-- 添加更新提醒信息表
create table if not exists comm_message_remind_info
(
  infoguid   nvarchar(100) not null primary key,
  infotitle   nvarchar(500),
  remindtime  datetime,
  targetuserguid nvarchar(2000),
  targetusername nvarchar(2000),
  infocontent   text,
  createtime   datetime,
  createusername   nvarchar(50),
  createuserguid   nvarchar(100),            
  ordernum    int
);
GO



-- DELIMITER ; --