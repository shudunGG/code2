-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/04/29 【时间】
-- 门户模板表新增所属门户字段 --【俞俊男】

-- 门户模板表新增所属门户字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_template') and column_name = upper('belongportalguid');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_template add belongportalguid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;


