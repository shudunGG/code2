-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- frame_ou_snapshot表修改OrderNumberFull字段长度为1000
-- Frame_UserRole_snapshot表添加ouguid字段 

-- BEGIN 

begin
  declare isexist number;
  begin
  select count(1) into isexist  from user_tab_columns where table_name = upper('frame_ou_snapshot') and column_name = upper('OrderNumberFull') and data_length='2000';
  if (isexist = 0) then
    execute immediate 'alter table frame_ou_snapshot modify ordernumberfull  nvarchar2(1000)';
  end if;
  end;
end;


-- Frame_UserRole_snapshot表添加ouguid字段 

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_UserRole_Snapshot') and column_name = upper('ouguid');
  if (isexist = 0) then
    execute immediate 'alter table Frame_UserRole_Snapshot add ouguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;

