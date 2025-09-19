drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card_specialclass' )<1
     then 
     	CREATE TABLE `cockpit_card_specialclass` (
  		`rowguid` varchar(50) DEFAULT NULL,
  		`className` varchar(50) DEFAULT NULL,
  		`liableouguid` varchar(50) DEFAULT NULL,
  		`liableperguid` varchar(50) DEFAULT NULL,
  		`leaderguid` varchar(50) DEFAULT NULL,
  		`groupleaderguid` varchar(50) DEFAULT NULL,
  		`deputygroupleaderguid` varchar(50) DEFAULT NULL,
  		`groupmemberguids` varchar(255) DEFAULT NULL,
  		`CreateTime` date DEFAULT NULL
	) ;
	end if;
     if  (SELECT count( 1 ) FROM	information_schema.COLUMNS WHERE	TABLE_SCHEMA = DATABASE ( ) AND table_name = 'cockpit_card' and column_name='specialclassguid')<1
     then 
        ALTER TABLE cockpit_card ADD specialclassguid varchar(50);
	end if;    
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO