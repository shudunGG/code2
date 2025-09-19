-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 删除表api_runtime_alert_rule字段 --【陈端一】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_runtime_alert_rule') and column_name = upper('type');
  if (isexist = 1) then
    execute immediate 'alter table api_runtime_alert_rule drop column type';
  end if;
  
  end;
end;
/* GO */

-- FRAME_COMMISSIONSET_HANDLE 增加title字段 --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('FRAME_COMMISSIONSET_HANDLE') and column_name = upper('title');
  if (isexist = 0) then
    execute immediate 'alter table FRAME_COMMISSIONSET_HANDLE add title nvarchar2(200)';
  end if;
  end;
end;
/* GO */
-- end;


