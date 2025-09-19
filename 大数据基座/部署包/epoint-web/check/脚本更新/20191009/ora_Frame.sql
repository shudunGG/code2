-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/10/09 【时间】
-- 【内容简单介绍】 --樊志君
 -- 去掉frame_mybook_snapshot或者frame_myaddressbook_snapshot 表的OBJECTTYPE字段默认值; 
-- 去掉FRAME_MYADDRESSBOOK 表的OBJECTTYPE字段默认值; 
-- 修改frame_secretlevel_snapshot主键为rowguid
-- 由于表名长度限制，将部分快照表名字重命名
-- frame_accountrelation_snapshot重命名为frame_ar_snapshot
-- frame_myaddressbook_snapshot重命名为frame_mybook_snapshot
-- frame_myaddressgroup_snapshot重命名frame_mygroup_snapshot
-- frame_secretlevel_snapshot重命名frame_seclevel_snapshot
-- 添加appcode字段 
begin
  declare isexist number;
          con_name varchar2(50);
          
  begin
  execute immediate 'alter table FRAME_MYADDRESSBOOK modify OBJECTTYPE default null';
  
  -- 去掉frame_mybook_snapshot或者frame_myaddressbook_snapshot 表的OBJECTTYPE字段默认值; 
   select count(1) into isexist from user_tables where table_name =upper('frame_myaddressbook_snapshot');
  if(isexist !=0) then
  	 execute immediate 'alter table frame_myaddressbook_snapshot modify OBJECTTYPE default null';
  else 
  	  execute immediate 'alter table frame_mybook_snapshot modify OBJECTTYPE default null';
  end if;
  
  
  select count(1) into isexist from user_tables where table_name =upper('frame_accountrelation_snapshot');
  if(isexist !=0) then
  	execute immediate 'alter table frame_accountrelation_snapshot rename to frame_ar_snapshot';
  end if;
  
  select count(1) into isexist from user_tables where table_name =upper('frame_myaddressbook_snapshot');
  if(isexist !=0) then
  	execute immediate 'alter table frame_myaddressbook_snapshot rename to frame_mybook_snapshot';
  end if;
  
  
  
  select count(1) into isexist from user_tables where table_name =upper('frame_myaddressgroup_snapshot');
  if(isexist !=0) then
  	execute immediate 'alter table frame_myaddressgroup_snapshot rename to frame_mygroup_snapshot';
  end if;
  
  select count(1) into isexist from user_tables where table_name =upper('frame_secretlevel_snapshot');
  if(isexist !=0) then
  	execute immediate 'alter table frame_secretlevel_snapshot rename to frame_seclevel_snapshot';
  end if;
    
  select count(1) into isexist from user_cons_columns a, user_constraints b where a.constraint_name = b.constraint_name and b.constraint_type = 'P' and a.table_name = upper('frame_seclevel_snapshot') and upper(a.column_name)='ROWGUID';
  if (isexist = 0) then
    select a.constraint_name into con_name  from user_cons_columns a, user_constraints b where a.constraint_name = b.constraint_name and b.constraint_type = 'P' and a.table_name = upper('frame_seclevel_snapshot') and upper(a.column_name)!='ROWGUID';
    execute immediate 'alter table frame_secretlevel_snapshot drop constraint ' || con_name;
    execute immediate 'alter table frame_secretlevel_snapshot add primary key (rowguid)';
  end if; 
  
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('appcode');
  if (isexist = 0) then
    execute immediate 'alter table app_info add appcode  nvarchar2(50)';
  end if;
  
  end;
end;
/* GO */


-- end;


