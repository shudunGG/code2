-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/07/18
-- 修改索引为唯一索引--王颜
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
	
if not exists (select * from information_schema.STATISTICS  where table_schema = database()  and table_NAME='frame_user_secondou' and INDEX_NAME='uq_frame_user_secondou' 
 ) then
  alter table frame_user_secondou add unique uq_frame_user_secondou(userguid, ouguid);
 else
   if not exists (select * from information_schema.STATISTICS  where table_schema = database()  and table_NAME='frame_user_secondou' and INDEX_NAME='uq_frame_user_secondou' 
 and NON_UNIQUE='0') then
   alter table frame_user_secondou drop index uq_frame_user_secondou;
   alter table frame_user_secondou add unique uq_frame_user_secondou(userguid, ouguid);
end if;
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
	
if not exists (select * from information_schema.STATISTICS  where table_schema = database()  and table_NAME='frame_userrolerelation' and INDEX_NAME='uq_frame_userrolerelation' 
 ) then
  alter table frame_userrolerelation add unique uq_frame_userrolerelation(userguid, roleguid);
 else
   if not exists (select * from information_schema.STATISTICS  where table_schema = database()  and table_NAME='frame_userrolerelation' and INDEX_NAME='uq_frame_userrolerelation' 
 and NON_UNIQUE='0') then
   alter table frame_userrolerelation drop index uq_frame_userrolerelation;
   alter table frame_userrolerelation add unique uq_frame_userrolerelation(userguid, roleguid);
end if;
end if;

end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

-- DELIMITER ; --