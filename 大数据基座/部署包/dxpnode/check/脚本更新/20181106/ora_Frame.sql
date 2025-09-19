-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/11/06
-- 之前勿删的table_visit_allowto，现在再加回来 --徐剑

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_visit_allowto');
 if (isexist = 0) then
    execute immediate '
      create table table_visit_allowto
             (
               row_id                int not null primary key,
			   tableid               int,
			   operatecode           varchar2(50),
			   allowto               varchar2(50),
			   allowtype             varchar2(50),
			   templateid            int,
			   templateid_sub        int,
			   queryid               int
              )';
  end if;
  end;
end;
/* GO */

-- end;


