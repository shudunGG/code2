-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/06/19
-- epointsformtemplate表添加MobileWorkflowDetailTemplateUrl --薛炳
-- frame_ip_lockinfo表添加CreateDate、UpdateDate -- 俞俊男

-- frame_ip_lockinfo表添加CreateDate、UpdateDate
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ip_lockinfo') and column_name = upper('CreateDate');
  if (isexist = 0) then
    execute immediate 'alter table frame_ip_lockinfo add CreateDate date';
  end if;
  end;
end;
/* GO */

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ip_lockinfo') and column_name = upper('UpdateDate');
  if (isexist = 0) then
    execute immediate 'alter table frame_ip_lockinfo add UpdateDate date';
  end if;
  end;
end;
/* GO */


-- 删除表epointsformtemplate字段 --【薛炳】

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformtemplate') and column_name = upper('MobileWorkflowDetailTemplateUrl');
  if (isexist = 1) then
    execute immediate 'alter table epointsformtemplate drop column MobileWorkflowDetailTemplateUrl';
  end if;
  end;
end;
/* GO */

-- epointsformtemplate表添加mobilewfdetailtemplateurl
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformtemplate') and column_name = upper('mobilewfdetailtemplateurl');
  if (isexist = 0) then
    execute immediate 'alter table epointsformtemplate add mobilewfdetailtemplateurl nvarchar2(100)';
  end if;
  end;
end;
/* GO */

 

-- end;
