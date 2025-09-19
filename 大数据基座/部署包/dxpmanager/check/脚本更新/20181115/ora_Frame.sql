-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/11/15
-- BELONGUSERGUID、BELONGDISPLAYNAM字段长度增长
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_job') and column_name = upper('BELONGUSERGUID') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table frame_job add newcolumn NVARCHAR2(2000)';
    execute immediate 'update frame_job set newcolumn = BELONGUSERGUID';
    execute immediate 'alter table frame_job drop column BELONGUSERGUID';
    execute immediate 'alter table frame_job rename column newColumn to BELONGUSERGUID';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_job') and column_name = upper('BELONGDISPLAYNAME') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table frame_job add newcolumn NVARCHAR2(2000)';
    execute immediate 'update frame_job set newcolumn = BELONGDISPLAYNAME';
    execute immediate 'alter table frame_job drop column BELONGDISPLAYNAME';
    execute immediate 'alter table frame_job rename column newColumn to BELONGDISPLAYNAME';
  end if;
  end;
end;
/* GO */
-- end;


