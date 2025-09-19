-- 如需手工在工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tables WHERE table_name=UPPER('dxp_flow_relate');
  if (isexist = 0) then
    execute immediate 'create table dxp_flow_relate(
						rowguid varchar(50) not null primary key,
						flowguid varchar(50)  not null,
						relateflowguid varchar(50)  not null,
						relateTime date  not null
					)';
  end if;
  end;
end;
/* GO */

-- end;