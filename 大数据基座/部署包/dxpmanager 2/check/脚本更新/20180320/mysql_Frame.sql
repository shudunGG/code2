-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO -- 

-- 2018/03/20

-- 添加应用附件数据源关联关系表
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'app_attachconfig') then
CREATE TABLE app_attachconfig (
  rowguid varchar(50),
  appguid varchar(50),
  configguid varchar(50),
  ordernumber int(11)
);
alter table app_attachconfig add primary key (rowguid);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; -- 