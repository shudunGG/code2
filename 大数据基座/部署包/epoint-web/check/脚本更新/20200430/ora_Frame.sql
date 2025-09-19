-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- frame_userrolerelation表唯一索引修改为3个字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from USER_IND_COLUMNS WHERE table_name =upper( 'frame_userrolerelation') and index_name=UPPER('UQ_FRAME_USERROLERELATION') and column_name=upper('ouguid');
  if (isexist = 0) then
    execute immediate 'drop index UQ_FRAME_USERROLERELATION';
    execute immediate' create Unique index uq_frame_userrolerelation on frame_userrolerelation(USERGUID, ROLEGUID, OUGUID)';
  end if;
  end;
end;
/* GO */

-- end;


