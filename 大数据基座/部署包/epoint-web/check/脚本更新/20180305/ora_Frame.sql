-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/03/05

-- 快照表frame_role_snapshot --周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_role_snapshot');
 if (isexist > 0 ) then
 	execute immediate 'drop table frame_role_snapshot';
   	end if;
    execute immediate 'create table frame_role_snapshot( 
			   roleguid nvarchar2(50) not null,
			   rolename nvarchar2(50) null,
			   ordernumber integer null,
			   isreserved integer null,
			   belongouguid nvarchar2(50) null,
			   roletype nvarchar2(50) null,
			   row_id number(10,0) null,
			   isallowassign number(38,0) null,
			   appkey nvarchar2(50) null,
			   rowguid nvarchar2(50) not null primary key,
			   clientip nvarchar2(50) null
		)';
  end;
end;

-- 快照表frame_roletype_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_roletype_snapshot');
 if (isexist > 0) then
 	execute immediate 'drop table frame_roletype_snapshot';
 	end if;
    execute immediate 'create table frame_roletype_snapshot( 
			   roletypeguid     nvarchar2(50) not null primary key,
			   roletypename     nvarchar2(50) null,
			   ordernumber      integer null,
			   belongbaseouguid nvarchar2(50) null,
			   appkey           nvarchar2(50) null,
			   rowguid          nvarchar2(50) not null,
			   clientip         nvarchar2(50) null
			)';
  end;
end;

-- 快照表frame_secondou_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_secondou_snapshot');
 if (isexist > 0) then
 	execute immediate 'drop table frame_secondou_snapshot';
 	end if;
    execute immediate 'create table frame_secondou_snapshot( 
			    row_id      number(10,0) not null,
			    userguid    nvarchar2(50) not null,
			    ouguid      nvarchar2(50) not null,
			    title       nvarchar2(100) null,
			    tel         nvarchar2(100) null,
			    ordernumber number(20) null,
			    user_ordernumber number(38) null,
			    appkey           nvarchar2(50) null,
			    clientip         nvarchar2(50) null,
			    orderfloat       number(38) null,
			    user_orderfloat  number(38) null,
			    rowguid          nvarchar2(50) not null primary key
			)';
  
  end;
end;

-- 快照表frame_user_e_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_e_snapshot');
 if (isexist > 0) then
 	execute immediate 'drop table frame_user_e_snapshot';
 	end if;
    execute immediate 'create table frame_user_e_snapshot( 
			   row_id integer null,
			   userguid nvarchar2(50) not null,
			   usbkey nvarchar2(50) null,
			   birthday date null,
			   qqnumber nvarchar2(50) null,
			   msnnumber nvarchar2(50) null,
			   piccontent blob null,
			   piccontenttype nvarchar2(100) null,
			   postaladdress nvarchar2(100) null,
			   postalcode nvarchar2(50) null,
			   identitycardnum nvarchar2(50) null,
			   isdisable integer null,
			   ntx_extnumber nvarchar2(50) null,
			   ntx_password nvarchar2(50) null,
			   epassrnd nvarchar2(50) null,
			   epassserial nvarchar2(50) null,
			   epassguid nvarchar2(50) null,
			   epasspwd nvarchar2(50) null,
			   ad_account nvarchar2(50) null,
			   loginip nvarchar2(200) null,
			   shortmobile nvarchar2(50) null,
			   appkey nvarchar2(50) null,
			   rowguid nvarchar2(50) not null primary key,
			   clientip nvarchar2(50) null,
			   tenantguid nvarchar2(50) null,
			   carnum nvarchar2(50) null
			)';
  end;
end;

-- 快照表frame_user_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_snapshot');
 if (isexist > 0) then
 	execute immediate 'drop table frame_user_snapshot';
   	end if;
    execute immediate 'create table frame_user_snapshot( 
			  userguid    nvarchar2(50) not null,
			  loginid     nvarchar2(50) not null,
			  password    nvarchar2(50) null,
			  ouguid      nvarchar2(50) null,
			  displayname nvarchar2(50) not null,
			  isenabled   integer null,
			  title       nvarchar2(100) null,
			  leaderguid  nvarchar2(50) null,
			  ordernumber integer null,
			  telephoneoffice nvarchar2(50) null,
			  mobile       nvarchar2(50) null,
			  email        nvarchar2(100) null,
			  description  nvarchar2(100) null,
			  telephonehome  nvarchar2(50) null,
			  fax          nvarchar2(50) null,
			  allowuseemail integer null,
			  sex          nvarchar2(50) null,
			  oucodelevel  nvarchar2(500) null,
			  updatetime date null,
			  row_id integer null,
			  firstname nvarchar2(100) null,
			  middlename nvarchar2(100) null,
			  lastname nvarchar2(100) null,
			  prelang nvarchar2(100) null,
			  timezone nvarchar2(100) null,
			  adloginid nvarchar2(200) null,
			  appkey nvarchar2(50) null,
			  rowguid nvarchar2(50) not null primary key,
			  clientip nvarchar2(50) null,
			  tenantguid nvarchar2(50) null,
			  updatepwd date null
			)';
  end;
end;

-- 快照表frame_userrole_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_userrole_snapshot');
 if (isexist > 0) then
 	execute immediate 'drop table frame_userrole_snapshot';
  	end if;
    execute immediate 'create table frame_userrole_snapshot( 
			   row_id number(10,0) not null,
			   userguid nvarchar2(50) null,
			   roleguid nvarchar2(50) null,
			   updatetime date null,
			   isfromsoa number(38,0) null,
			   appkey nvarchar2(50) null,
			   rowguid nvarchar2(50) not null constraint pk_frame_userrole_snapshot primary key,
			   clientip nvarchar2(50) null,
			   tenantguid nvarchar2(50) null
			)';
  end;
end;

-- 快照表frame_ou_e_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_e_snapshot');
 if (isexist > 0) then
 	execute immediate 'drop table frame_ou_e_snapshot';
   	end if;
    execute immediate 'create table frame_ou_e_snapshot( 
			   ouguid         nvarchar2(50) not null,
			   isindependence integer null,
			   oufax          nvarchar2(100) null,
			   oucertguid     nvarchar2(50) null,
			   oucertcontent  blob null,
			   oucertname     nvarchar2(100) null,
			   individuationimgpath nvarchar2(300) null,
			   appkey         nvarchar2(50) null,
			   rowguid nvarchar2(50) not null primary key,
			   clientip nvarchar2(50) null,
			   tenantguid nvarchar2(50) null
			)';

  end;
end;

-- 快照表frame_ou_snapshot
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_snapshot');
 if (isexist > 0) then
 	execute immediate 'drop table frame_ou_snapshot';
 	end if;
    execute immediate 'create table frame_ou_snapshot( 
			    ouguid      nvarchar2(50) not null,
			    oucode      nvarchar2(50) null,
			    ouname      nvarchar2(50) null,
			    oushortname nvarchar2(50) null,
			    ordernumber integer null,
			    description nvarchar2(50) null,
			    address     nvarchar2(50) null,
			    postalcode  nvarchar2(50) null,
			    tel         nvarchar2(50) null,
			    baseouguid  nvarchar2(50) null,
			    issubwebflow integer null,
			    parentouguid nvarchar2(50) null,
			    oucodelevel nvarchar2(500) null,
			    haschildou integer null,
			    haschilduser integer null,
			    updatetime date null,
			    testvarchar nvarchar2(50) null,
			    testintger number(10,0) null,
			    testnumber number(10,0) null,
			    ordernumberfull nvarchar2(1000) null,
			    appkey nvarchar2(50) null,
			    rowguid nvarchar2(50) not null primary key,
			    clientip nvarchar2(50) null,
			    tenantguid nvarchar2(50) null,
			    bussinessoucode nvarchar2(127) null,
			    row_id number(10,0) null
			)';
  end;
end;

-- end;