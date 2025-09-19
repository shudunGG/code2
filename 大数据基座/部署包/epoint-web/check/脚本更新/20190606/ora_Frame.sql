-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/06/06 【时间】
-- 【扩展控件管理表新增描述字段】 --【薛炳】
 

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformExtensibleControl') and column_name = upper('TableType');
  if (isexist = 0) then
    execute immediate 'alter table EpointsformExtensibleControl add TableType INTEGER';
  end if;
  end;
end;
/* GO */

--  epointsform中formid自增 --薛炳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform') and column_name = upper('formId');
  if (isexist = 0) then
    execute immediate 'alter table epointsform add formId  int';
  end if;
  end;
end;
/* GO */

BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_sequences  where  sequence_name=upper('SQ_epointsform');
    IF (IsExist = 0) THEN
      BEGIN      
        execute   immediate   
        'create sequence SQ_epointsform
increment by 1   
start with 1  
nomaxvalue  
nominvalue  
nocache  
        ';    
    END;
    END IF;
  END;
END;
/* GO */


BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_triggers where trigger_name=upper('TG_epointsform');
    IF (IsExist = 0) THEN
      BEGIN      
        execute   immediate   
        'create or replace trigger  TG_epointsform
before insert on epointsform
for each row  
begin  
select  SQ_epointsform.nextval into :new.formId from dual;  
end;';    
    END;
    END IF;
  END;
END;
/* GO */

-- epointsformtablelist 表添加baseouguid --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformtablelist') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table epointsformtablelist add baseouguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- epointsformlistversion 表添加baseouguid --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformlistversion') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table epointsformlistversion add baseouguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- epointsform 表添加baseouguid --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table epointsform add baseouguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- epointformversion 表添加baseouguid --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('baseouguid');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add baseouguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- epointsformlistversion   表添加status --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformlistversion') and column_name = upper('status');
  if (isexist = 0) then
    execute immediate 'alter table epointsformlistversion add status nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- epointformversion 表添加status --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('status');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add status nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- epointsformtablelist 表添加listtype --薛炳
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformtablelist') and column_name = upper('listtype');
  if (isexist = 0) then
    execute immediate 'alter table epointsformtablelist add listtype nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 列表管理添加字段，自增长 --季立霞
-- 添加listId字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsformtablelist') and column_name = upper('ListId');
  if (isexist = 0) then
    execute immediate 'alter table epointsformtablelist add ListId  int';
  end if;
  end;
end;
/* GO */

BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_sequences  where  sequence_name=upper('SQ_epointsformtablelist');
    IF (IsExist = 0) THEN
      BEGIN      
        execute   immediate   
        'create sequence SQ_epointsformtablelist
increment by 1   
start with 1  
nomaxvalue  
nominvalue  
nocache  
        ';    
    END;
    END IF;
  END;
END;
/* GO */


BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_triggers where trigger_name=upper('TG_epointsformtablelist');
    IF (IsExist = 0) THEN
      BEGIN      
        execute   immediate   
        'create or replace trigger  TG_epointsformtablelist
before insert on epointsformtablelist
for each row  
begin  
select  SQ_epointsformtablelist.nextval into :new.listid from dual;  
end;';    
    END;
    END IF;
  END;
END;
/* GO */

-- end;


