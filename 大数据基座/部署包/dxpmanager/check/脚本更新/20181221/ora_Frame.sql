-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('allowDistrictCodeId');
  if (isexist = 1) then
    execute immediate 'alter table app_info modify allowDistrictCodeId nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('linkmanphone');
  if (isexist = 0) then
    execute immediate 'alter table app_info add linkmanphone  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('linkmanname');
  if (isexist = 0) then
    execute immediate 'alter table app_info add linkmanname  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_feedback_detail_info') and column_name = upper('processversioninstanceguid');
  if (isexist = 0) then
    execute immediate 'alter table comm_feedback_detail_info add  processversioninstanceguid nvarchar2(100)';
  end if;
commit;
  
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_feedback_detail_info') and column_name = upper('workitemguid');
  if (isexist = 0) then
    execute immediate 'alter table comm_feedback_detail_info add  workitemguid nvarchar2(100)';
  end if;
commit;
  
  end;
end;
/* GO */


-- end;