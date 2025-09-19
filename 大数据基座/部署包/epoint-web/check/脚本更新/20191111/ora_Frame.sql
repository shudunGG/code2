-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 【修改用户表的密码字段长度】 --【cdy】
-- 【修改用户快照表的密码字段长度】 --【cdy】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user') and column_name = upper('password') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
    execute immediate 'alter table frame_user add passwordbak NVARCHAR2(500)';
	execute immediate'update frame_user set passwordbak=password';
	execute immediate'alter table frame_user drop (password)';
	execute immediate'alter table frame_user rename column passwordbak to password';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_snapshot') and column_name = upper('password') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
    execute immediate 'alter table frame_user_snapshot add passwordbak1 NVARCHAR2(500)';
	execute immediate'update frame_user_snapshot set passwordbak1 = password';
	execute immediate'alter table frame_user_snapshot drop (password)';
	execute immediate'alter table frame_user_snapshot rename column passwordbak1 to password';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_process') and column_name = upper('processname') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
    execute immediate 'alter table workflow_process add processnamebak1 NVARCHAR2(2000)';
	execute immediate'update workflow_process set processnamebak1 = processname';
	execute immediate'alter table workflow_process drop (processname)';
	execute immediate'alter table workflow_process rename column processnamebak1 to processname';
  end if;
  end;
end;
/* GO */

-- end;


