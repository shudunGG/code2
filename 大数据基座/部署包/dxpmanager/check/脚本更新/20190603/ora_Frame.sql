-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/06/03

-- frame_portaltype
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portaltype');
 if (isexist = 0 ) then
    execute immediate '
     create table frame_portaltype( 
			    rowguid      nvarchar2(50) NOT NULL primary key,
                typename     nvarchar2(50)  NULL,
                ordernumber  integer NULL
		)';
	end if;
  end;
end;
/* GO */


-- frame_portal_element
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element');
 if (isexist = 0) then
     execute immediate'
create table frame_portal_element( 
			  rowguid               nvarchar2(50) NOT NULL primary key,
              belongportalguid      nvarchar2(50)  NULL,
              rowindex              integer NULL,
              colindex              integer NULL,
              belongelementtempguid nvarchar2(50)  NULL,
              title                 nvarchar2(50)  NULL,
              icon                  nvarchar2(200)  NULL,
              fontcolor             nvarchar2(50)  NULL,
              backgroundcolor       nvarchar2(50)  NULL,
              titlebackgroundcolor  nvarchar2(50)  NULL,
              customlinkurl         nvarchar2(200) NULL,
              infocount             integer  NULL,
              titlelength           integer  NULL,
              openwith              nvarchar2(50) NULL,
              isshowtitle           integer NULL,
              isshowmorebutton      integer NULL,
              isshowrefresh          integer NULL,
              moreopenwith           varchar(50)  NULL,
              framecolor             varchar(50)  NULL,
              height                integer NULL,
              extendcustomattr     nvarchar2(1000)  NULL,
              belonglayoutguid     nvarchar2(50)  NULL
			)';
		end if;
  end;
end;
/* GO */



-- frame_component_template
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_component_template');
 if (isexist = 0) then
     execute immediate'
   create table frame_component_template( 
        rowguid          nvarchar2(50) NOT NULL  PRIMARY KEY,
       componentname     nvarchar2(50) NULL,
       componenttype     nvarchar2(50)  NULL,
       ordernumber       integer NULL,
       mangeurl          nvarchar2(200)  NULL,
       showurl           nvarchar2(200)  NULL,
       showicon          nvarchar2(200)  NULL,
       templateheight    integer NULL,
       moreurl           nvarchar2(200)  NULL,
       moreopenwith      nvarchar2(50)  NULL,
       customtitleheight integer NULL,
       appguid            nvarchar2(50) NULL
			)';
  	end if;
  end;
end;
/* GO */

-- frame_layout_template
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_layout_template');
 if (isexist = 0) then
    execute immediate 'create table frame_layout_template( 
			     rowguid       nvarchar2(50) NOT NULL  PRIMARY KEY,
                 templatename  nvarchar2(50) NULL,
                 ordernumber   integer NULL,
                 customwidth   nvarchar2(100)  NULL,
                 thumbnail     nvarchar2(200) NULL
			)';
	end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_accountrelation');
 if (isexist = 0) then
    execute immediate 'create table frame_accountrelation( 
			     rowguid       nvarchar2(50) NOT NULL  PRIMARY KEY,
                 userguid  nvarchar2(50) NULL,
                 ordernumber   integer NULL,
                 relativeuserguid   nvarchar2(50)  NULL
			)';
	end if;
  end;
end;

-- end;