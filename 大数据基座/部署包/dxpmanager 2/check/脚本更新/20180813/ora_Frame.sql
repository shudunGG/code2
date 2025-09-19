-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/08/13 
--  -- -- 如果personal_portal_element没有rowguid,删表重构---何晓瑜
begin
  declare isexist number;
  begin
    select count(1) into isexist from user_tables where table_name = upper('personal_portal_element');
    if (isexist = 1) then
        execute immediate   
        'drop table personal_portal_element';
    end if;
  end;
end;
/* GO */   

	begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('personal_portal_element');
 if (isexist = 0) then
    execute immediate '
      create table personal_portal_element
             (
               rowguid         nvarchar2(50) not null primary key,
               ptrowguid      nvarchar2(50) not null,
               isdisable         integer,
               userguid        nvarchar2(50) not null,
               elementlocation nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */  

-- end;


