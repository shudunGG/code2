-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/06/28 
-- 表字段text修改为varchar--王颜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_extendinfo') and column_name = upper('INDIVIDUATIONIMGPATH') 
  and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table frame_ou_extendinfo add newcolumn nvarchar2(500)';
    execute immediate 'update frame_ou_extendinfo set newcolumn = INDIVIDUATIONIMGPATH';
    execute immediate 'alter table frame_ou_extendinfo drop column INDIVIDUATIONIMGPATH';
    execute immediate 'alter table frame_ou_extendinfo rename column newColumn to INDIVIDUATIONIMGPATH';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_e_snapshot') and column_name = upper('INDIVIDUATIONIMGPATH') 
  and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table frame_ou_e_snapshot add newcolumn nvarchar2(500)';
    execute immediate 'update frame_ou_e_snapshot set newcolumn = INDIVIDUATIONIMGPATH';
    execute immediate 'alter table frame_ou_e_snapshot drop column INDIVIDUATIONIMGPATH';
    execute immediate 'alter table frame_ou_e_snapshot rename column newColumn to INDIVIDUATIONIMGPATH';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachinfo') and column_name = upper('ATTACHFILENAME') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table frame_attachinfo add newcolumn nvarchar2(200)';
    execute immediate 'update frame_attachinfo set newcolumn = ATTACHFILENAME';
    execute immediate 'alter table frame_attachinfo drop column ATTACHFILENAME';
    execute immediate 'alter table frame_attachinfo rename column newColumn to ATTACHFILENAME';
  end if;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachinfo') and column_name = upper('CONTENTTYPE') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table frame_attachinfo add newcolumn nvarchar2(200)';
    execute immediate 'update frame_attachinfo set newcolumn = CONTENTTYPE';
    execute immediate 'alter table frame_attachinfo drop column CONTENTTYPE';
    execute immediate 'alter table frame_attachinfo rename column newColumn to CONTENTTYPE';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachinfo') and column_name = upper('CLIENGTAG') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table frame_attachinfo add newcolumn nvarchar2(200)';
    execute immediate 'update frame_attachinfo set newcolumn = CLIENGTAG';
    execute immediate 'alter table frame_attachinfo drop column CLIENGTAG';
    execute immediate 'alter table frame_attachinfo rename column newColumn to CLIENGTAG';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachinfo') and column_name = upper('CLIENGINFO') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table frame_attachinfo add newcolumn nvarchar2(200)';
    execute immediate 'update frame_attachinfo set newcolumn = CLIENGINFO';
    execute immediate 'alter table frame_attachinfo drop column CLIENGINFO';
    execute immediate 'alter table frame_attachinfo rename column newColumn to CLIENGINFO';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachinfo') and column_name = upper('FILEPATH') 
  and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table frame_attachinfo add newcolumn nvarchar2(500)';
    execute immediate 'update frame_attachinfo set newcolumn = FILEPATH';
    execute immediate 'alter table frame_attachinfo drop column FILEPATH';
    execute immediate 'alter table frame_attachinfo rename column newColumn to FILEPATH';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachstorage') and column_name = upper('CONTENTTYPE') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table frame_attachstorage add newcolumn nvarchar2(200)';
    execute immediate 'update frame_attachstorage set newcolumn = CONTENTTYPE';
    execute immediate 'alter table frame_attachstorage drop column CONTENTTYPE';
    execute immediate 'alter table frame_attachstorage rename column newColumn to CONTENTTYPE';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachstorage') and column_name = upper('CLIENGTAG') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table frame_attachstorage add newcolumn nvarchar2(200)';
    execute immediate 'update frame_attachstorage set newcolumn = CLIENGTAG';
    execute immediate 'alter table frame_attachstorage drop column CLIENGTAG';
    execute immediate 'alter table frame_attachstorage rename column newColumn to CLIENGTAG';
  end if;
  
     select count(1) into isexist from user_tab_columns where table_name = upper('onlinemessage_info') and column_name = upper('NOTE') 
  and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table onlinemessage_info add newcolumn nvarchar2(500)';
    execute immediate 'update onlinemessage_info set newcolumn = NOTE';
    execute immediate 'alter table onlinemessage_info drop column NOTE';
    execute immediate 'alter table onlinemessage_info rename column newColumn to NOTE';
  end if;
  
    select count(1) into isexist from user_tab_columns where table_name = upper('code_items') and column_name = upper('itemtext') 
  and data_type='NVARCHAR2' and data_length='200';
  if (isexist = 0) then
     execute immediate 'alter table code_items add newcolumn nvarchar2(100)';
    execute immediate 'update code_items set newcolumn = itemtext';
    execute immediate 'alter table code_items drop column itemtext';
    execute immediate 'alter table code_items rename column newColumn to itemtext';
  end if;
  
      select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('dbname') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table datasource add newcolumn nvarchar2(200)';
    execute immediate 'update datasource set newcolumn = dbname';
    execute immediate 'alter table datasource drop column dbname';
    execute immediate 'alter table datasource rename column newColumn to dbname';
  end if;
  
       select count(1) into isexist from user_tab_columns where table_name = upper('datasource') and column_name = upper('connectionstring') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table datasource add newcolumn nvarchar2(200)';
    execute immediate 'update datasource set newcolumn = connectionstring';
    execute immediate 'alter table datasource drop column connectionstring';
    execute immediate 'alter table datasource rename column newColumn to connectionstring';
  end if;
  
        select count(1) into isexist from user_tab_columns where table_name = upper('frame_config') and column_name = upper('CONFIGVALUE') 
  and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table frame_config add newcolumn nvarchar2(500)';
    execute immediate 'update frame_config set newcolumn = CONFIGVALUE';
    execute immediate 'alter table frame_config drop column CONFIGVALUE';
    execute immediate 'alter table frame_config rename column newColumn to CONFIGVALUE';
  end if;
  
     select count(1) into isexist from user_tab_columns where table_name = upper('frame_config_category') and column_name = upper('CATEGORYDES') 
  and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
     execute immediate 'alter table frame_config_category add newcolumn nvarchar2(200)';
    execute immediate 'update frame_config_category set newcolumn = CATEGORYDES';
    execute immediate 'alter table frame_config_category drop column CATEGORYDES';
    execute immediate 'alter table frame_config_category rename column newColumn to CATEGORYDES';
  end if;
  
       select count(1) into isexist from user_tab_columns where table_name = upper('frame_quicklink') and column_name = upper('LINKURL') 
  and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table frame_quicklink add newcolumn nvarchar2(500)';
    execute immediate 'update frame_quicklink set newcolumn = LINKURL';
    execute immediate 'alter table frame_quicklink drop column LINKURL';
    execute immediate 'alter table frame_quicklink rename column newColumn to LINKURL';
  end if;
  
   select count(1) into isexist from user_tab_columns where table_name = upper('frame_quicklink_user') and column_name = upper('LINKURL') 
  and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table frame_quicklink_user add newcolumn nvarchar2(500)';
    execute immediate 'update frame_quicklink_user set newcolumn = LINKURL';
    execute immediate 'alter table frame_quicklink_user drop column LINKURL';
    execute immediate 'alter table frame_quicklink_user rename column newColumn to LINKURL';
  end if;

  
  end;
end;
/* GO */

-- end;


