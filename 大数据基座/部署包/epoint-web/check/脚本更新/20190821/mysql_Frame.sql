-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

-- 2019/08/21
-- table_visit_allowto中row_id自增 --cdy

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
BEGIN

IF NOT EXISTS (
	SELECT
		column_name
	FROM
		information_schema. COLUMNS
	WHERE
		table_schema = DATABASE ()
	AND table_name = 'table_visit_allowto'
	AND column_name = 'row_id'
	AND extra='auto_increment'
) THEN
alter table table_visit_allowto ADD KEY comp_index (row_id);
alter table table_visit_allowto modify row_id int auto_increment; 

end if;
END;


GO

call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --