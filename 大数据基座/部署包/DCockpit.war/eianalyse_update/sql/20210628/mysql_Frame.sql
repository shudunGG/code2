drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_project_cate'  and column_name='ordernum')<1
    then 
     	alter TABLE cockpit_project_cate add ordernum int(11) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  dpresolution varchar(50) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  status varchar(10) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  apicode varchar(50) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  pcateguid varchar(100) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  createou varchar(50) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  createuser varchar(50) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  createtime datetime DEFAULT NULL;
		alter TABLE cockpit_project_cate add  cockpitguid varchar(50) DEFAULT NULL;
		alter TABLE cockpit_project_cate add  `type` varchar(10) DEFAULT NULL;
	end if;
	if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_project'  and column_name='pviguid')<1
    then 
     	ALTER TABLE cockpit_project add pviguid varchar(50) DEFAULT NULL;
     	ALTER TABLE cockpit_project add bindtime datetime DEFAULT NULL;
		ALTER TABLE cockpit_project add applytime datetime  DEFAULT NULL;
		ALTER TABLE cockpit_project add applyuserguid varchar(50) DEFAULT NULL;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --