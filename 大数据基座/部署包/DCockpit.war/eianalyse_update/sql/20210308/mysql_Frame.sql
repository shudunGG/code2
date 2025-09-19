drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (SELECT count(*) FROM information_schema.tables WHERE table_schema = DATABASE () AND table_name = 'cockpit_feedback_norm')<1
     then 
     	CREATE TABLE cockpit_feedback_norm (
		  rowguid varchar(50) NOT NULL,
		  feedbackTitle varchar(50) DEFAULT NULL,
		  feedbackDescribe varchar(255) DEFAULT NULL,
		  submitter varchar(50) DEFAULT NULL,
		  submitOu varchar(50) DEFAULT NULL,
		  submitTime datetime DEFAULT NULL,
		  status varchar(5) DEFAULT NULL,
		  PRIMARY KEY (rowGuid) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
	
	if  (SELECT count(*) FROM information_schema.tables WHERE table_schema = DATABASE () AND table_name = 'cockpit_feedback_norm_history')<1
     then 
     	CREATE TABLE cockpit_feedback_norm_history (
		  rowguid varchar(50) NOT NULL,
		  feedbackGuid varchar(50) DEFAULT NULL,
		  feedbackPerson varchar(50) DEFAULT NULL,
		  feedbackDescribe varchar(255) DEFAULT NULL,
		  feedbackTime datetime DEFAULT NULL,
		  PRIMARY KEY (rowGuid) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO