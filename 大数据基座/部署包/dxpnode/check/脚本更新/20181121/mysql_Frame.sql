-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin 
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user' and column_name = 'issyncthirdparty') then
    alter table frame_user add column issyncthirdparty int(11);
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
if not exists (select null from information_schema.columns
            where table_schema = database() and table_name = 'frame_user_snapshot' and column_name = 'issyncthirdparty') then
    alter table frame_user_snapshot add column issyncthirdparty int(11);
end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO

create or replace view view_frame_user_java as
select distinct
	frame_user.userguid as userguid,
	frame_user.loginid as loginid,
	frame_user.password as password,
	frame_user.ouguid as ouguid,
	frame_user.displayname as displayname,
	frame_user.isenabled as isenabled,
	frame_user.title as title,
	frame_user.leaderguid as leaderguid,
	frame_user.ordernumber as ordernumber,
	frame_user.telephoneoffice as telephoneoffice,
	frame_user.mobile as mobile,
	frame_user.email as email,
	frame_user.description as description,
	frame_user.telephonehome as telephonehome,
	frame_user.fax as fax,
	frame_user.allowuseemail as allowuseemail,
	frame_user.sex as sex,
	frame_user.updatetime as updatetime,
	frame_user.issyncthirdparty as issyncthirdparty,
	frame_user_extendinfo.birthday as birthday,
	frame_user_extendinfo.shortmobile as shortmobile,
	frame_user_extendinfo.usbkey as usbkey,
	frame_user_extendinfo.ntx_extnumber as ntx_extnumber,
	frame_user_extendinfo.qqnumber as qqnumber,
	frame_user_extendinfo.msnnumber as msnnumber,
	frame_user_extendinfo.postaladdress as postaladdress,
	frame_user_extendinfo.postalcode as postalcode,
	frame_user_extendinfo.carnum as carnum,
	frame_ou.ouname as ouname,
	frame_ou.oushortname as oushortname,
	frame_ou.parentouguid as parentouguid,
	frame_ou.oucodelevel as oucodelevel
from
	(
		(
			frame_user
			left join frame_ou on (
				(
					frame_user.ouguid = frame_ou.ouguid
				)
			)
		)
		left join frame_user_extendinfo on (
			(
				frame_user.userguid = frame_user_extendinfo.userguid
			)
		)
	)
-- DELIMITER ; --