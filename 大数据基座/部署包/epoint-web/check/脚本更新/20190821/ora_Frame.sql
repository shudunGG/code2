-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN
-- 2019/08/21
-- table_visit_allowto中row_id自增 --cdy
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_sequences  where  sequence_name=upper('SQ_table_visit_allowto');
    IF (IsExist = 0) THEN
      BEGIN      
        execute   immediate   
        'create sequence SQ_table_visit_allowto
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
    select count(*) into IsExist from user_triggers where trigger_name=upper('TG_table_visit_allowto');
    IF (IsExist = 0) THEN
      BEGIN      
        execute   immediate   
        'create or replace trigger  TG_table_visit_allowto
before insert on table_visit_allowto
for each row  
begin  
select  SQ_table_visit_allowto.nextval into :new.row_id from dual;  
end;';    
    END;
    END IF;
  END;
END;
/* GO */

--END;
