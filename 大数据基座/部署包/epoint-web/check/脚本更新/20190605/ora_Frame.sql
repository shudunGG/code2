-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/05/15 【时间】
-- 新增列表配置 --薛炳

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformTemplate');
 if (isexist = 0) then
    execute immediate '
      create table EpointsformTemplate 
             (
               RowGuid       nvarchar2(100) not null primary key,
               TemplateName            nvarchar2(50),
               TemplateType nvarchar2(2),
               AddTemplateUrl nvarchar2 (200),
	           DetailTemplateUrl nvarchar2 (200),
	           WorkflowTemplateUrl nvarchar2 (200),
	           PrintDetailTemplateUrl nvarchar2 (200),
	           MobileAddTemplateUrl nvarchar2 (200),
	           MobileDetailTemplateUrl nvarchar2 (200),
	           MobileWorkflowTemplateUrl nvarchar2 (200),
	           ListTemplateUrl nvarchar2 (200),
	           MobileListTemplateUrl nvarchar2 (200),
	           OrderNum INT
              )';
  end if;
  end;
end;
/* GO */
-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformTableList');
 if (isexist = 0) then
    execute immediate '
      create table EpointsformTableList  
             (
               RowGuid       nvarchar2(100) not null primary key,
               TableId INT,
	           SqlTableName nvarchar2 (100),
	           TableType INT ,
	           PageName nvarchar2 (100),
	           OrderNum INT
              )';
  end if;
  end;
end;
 
/* GO */

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformListVersion');
 if (isexist = 0) then
    execute immediate '
      create table EpointsformListVersion   
             (
               RowGuid       nvarchar2(100) not null primary key,
               ListGuid nvarchar2 (100),
	           TemplateGuid nvarchar2 (100),
               Version nvarchar2 (10) ,
	           Enabled int,
	           PageVolume INT,
               Combination	 nvarchar2 (100),
               MobileCombination   nvarchar2 (100),
               FormListType             nvarchar2 (10),
               PageType                   nvarchar2 (10),
               MobileTemplateGuid       nvarchar2 (50),
               OrderNum int
              )';
  end if;
  end;
end;
 
/* GO */


-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Epointsform');
 if (isexist = 0) then
    execute immediate '
      create table Epointsform    
             (
               RowGuid       nvarchar2(100) not null primary key,
               TableId INT,
	           SQlTableName nvarchar2 (100),
	           TableType INT,
               FormName nvarchar2 (100),
               OrderNum int
              )';
  end if;
  end;
end;
 
/* GO */

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointFormVersion');
 if (isexist = 0) then
    execute immediate '
      create table EpointFormVersion     
             (
             RowGuid       nvarchar2(100) not null primary key,
            TableId int,
	        TemplateGuid nvarchar2 (100),
	        Version nvarchar2 (10),
	        Enabled int,
	        Content clob ,
            PreviewUrl nvarchar2 (100),
            JsContent clob,
            CssContent  clob,
            JsonData	  clob,
            controlsData	 clob,
            OrderNum int,
            TableGuid nvarchar2 (100)
              )';
  end if;
  end;
end;
 
/* GO */

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformExtensibleControl');
 if (isexist = 0) then
    execute immediate '
      create table EpointsformExtensibleControl      
             (
             ControlGuid       nvarchar2(100) not null primary key,          
	         ControlName nvarchar2 (100),
	         ControlEnglishName nvarchar2 (100),
	         Version nvarchar2 (10),
	         AllowFieldType nvarchar2 (100),
	         Icon nvarchar2 (2000),
	         ControlServiceClass nvarchar2 (100),
	         OrderNum INT
              )';
  end if;
  end;
end;
 
/* GO */

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('IsCustom');
  if (isexist = 0) then
    execute immediate 'alter table table_struct  add IsCustom  nvarchar2(2)';
  end if;
  end;
end;
/* GO */

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('CustomTableId');
  if (isexist = 0) then
    execute immediate 'alter table table_struct  add CustomTableId  int';
  end if;
  end;
end;
/* GO */

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('CustomFieldname');
  if (isexist = 0) then
    execute immediate 'alter table table_struct  add CustomFieldname  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('CustomChinesename');
  if (isexist = 0) then
    execute immediate 'alter table table_struct  add CustomChinesename  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_fieldrelation_config') and column_name = upper('RelationType');
  if (isexist = 0) then
    execute immediate 'alter table table_fieldrelation_config   add RelationType  nvarchar2(10)';
  end if;
  end;
end;
/* GO */

-- 2019/05/05 
-- 添加列表配置--季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_schemeshowinfo');
 if (isexist = 0) then
    execute immediate '
      create table tablelist_schemeshowinfo
             (
               rowguid     nvarchar2(100) not null primary key,
               tableid     integer,
               fieldid     integer,
               isallowsort nvarchar2(6),
               columntext  nvarchar2(50),
               isadaptivewidth nvarchar2(6),
               columnwidth nvarchar2(50),
               columntype  nvarchar2(50),
               controltype nvarchar2(50),
               operatetype nvarchar2(50),
               hyperlinkaddress nvarchar2(200),
               addressopentype nvarchar2(50),
               dialogtype  nvarchar2(50),
               dialogtitle  nvarchar2(100),
               dialogwidth  nvarchar2(50),
               dialogheigh  nvarchar2(50),
               icon    nvarchar2(2000),
               customcolname  nvarchar2(100),
               deleteprompt  nvarchar2(100),
               listguid  nvarchar2(100),
               versionguid  nvarchar2(100),
               ordernum    integer
              )';
  end if;
  end;
end;
/* GO */


-- 添加列表高级配置--季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_advancedconfig');
 if (isexist = 0) then
    execute immediate '
      create table tablelist_advancedconfig
             (
               rowguid     nvarchar2(100) not null primary key,
               conditiondescription  nvarchar2(200),
               tableid     int,
               fieldid     int,
               comparison  nvarchar2(10),
               valuetype   nvarchar2(4),
               comparevalue  nvarchar2(100),
               htmltemplate  nvarchar2(200),
               showinfoguid   nvarchar2(100),
               controltype  nvarchar2(10),
               formattype  nvarchar2(100),
               listguid  nvarchar2(100),
               versionguid  nvarchar2(100),
               ordernum    int
              )';
  end if;
  end;
end;
/* GO */


-- 添加排序配置明细表--季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_schemeorderinfo');
 if (isexist = 0) then
    execute immediate '
      create table tablelist_schemeorderinfo
             (
               rowguid     nvarchar2(100) not null primary key,
               tableid     integer,
               fieldid     integer,
               sortorder  nvarchar2(50),
               listguid  nvarchar2(100),
               versionguid  nvarchar2(100),
               ordernum    integer
              )';
  end if;
  end;
end;
/* GO */


-- 添加筛选条件配置明细表--季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_dataquery');
 if (isexist = 0) then
    execute immediate '
      create table tablelist_dataquery
             (
               rowguid     nvarchar2(100) not null primary key,
               conditionno   nvarchar2(10),
               querytype    nvarchar2(50),
               tableid     integer,
               fieldid     integer,
               valuetype  nvarchar2(4),
               comparision   nvarchar2(50),
               datavalue  nvarchar2(50),
               description nvarchar2(200),
               listguid  nvarchar2(100),
               versionguid  nvarchar2(100),
               ordernum    integer
              )';
  end if;
  end;
end;
/* GO */

-- 添加查询区域显示配置明细表--季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_searchareaconfig');
 if (isexist = 0) then
    execute immediate '
      create table tablelist_searchareaconfig
             (
               rowguid     nvarchar2(100) not null primary key,
               querytext   nvarchar2(10),
               tableid     integer,
               fieldid     integer,
               ctype       nvarchar2(50),
               controltype nvarchar2(50),
               querytype   nvarchar2(50),
               rangetype   nvarchar2(50),
               startconfig  nvarchar2(200),
               endconfig  nvarchar2(200),
               listguid  nvarchar2(100),
               versionguid  nvarchar2(100),
               ordernum    integer
              )';
  end if;
  end;
end;
/* GO */


-- 添加按钮显示配置表--季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_buttonconfig');
 if (isexist = 0) then
    execute immediate '
      create table tablelist_buttonconfig
             (
               rowguid     nvarchar2(100) not null primary key,
               buttonname   nvarchar2(100),
               buttontype     nvarchar2(50),
               linkurl     nvarchar2(200),
               processguid    nvarchar2(200),
               processname    nvarchar2(100),
               opentype nvarchar2(50),
               dialogtype nvarchar2(50),
               dialogtitle nvarchar2(100),
               dialogwidth  nvarchar2(50),
               dialogheigh  nvarchar2(50),
               deleteprompt  nvarchar2(100),
               eventselect  nvarchar2(100),
               listguid  nvarchar2(100),
               versionguid  nvarchar2(100),
               ordernum    int
              )';
  end if;
  end;
end;
/* GO */

-- 添加事件配置表--季立霞
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablelist_eventconfig');
 if (isexist = 0) then
    execute immediate '
      create table tablelist_eventconfig
             (
               rowguid     nvarchar2(100) not null primary key,
               eventname   nvarchar2(100),
               operatetype  nvarchar2(50),
               eventtype  nvarchar2(50),
               methodguid  nvarchar2(200),
               synctype     nvarchar2(6),
               ordernum    int
              )';
  end if;
  end;
end;
/* GO */

-- end;


