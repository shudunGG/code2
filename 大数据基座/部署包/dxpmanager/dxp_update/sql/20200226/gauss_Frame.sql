-- 如需手工在工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
	V_SQL_CREATE_TABLE VARCHAR2(500) := 'create table dxp_flow_relate(rowguid varchar(50) not null primary key,flowguid varchar(50)  not null,relateflowguid varchar(50)  not null,relateTime date  not null)';
  begin
  select count(*) into isexist from user_tables WHERE table_name=UPPER('dxp_flow_relate');
  if (isexist = 0) then
    EXECUTE IMMEDIATE V_SQL_CREATE_TABLE;
  end if;
  end;
end;


-- end;