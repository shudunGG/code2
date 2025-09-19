-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN
-- 2019/4/26
-- Epointsform_Table_BasicInfo中去除TABLEID自增 --陈佳
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_triggers where trigger_name=upper('TG_Epointsform_Table_BasicInfo');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'DROP TRIGGER TG_Epointsform_Table_BasicInfo';    
    END;
    END IF;
  END;
END;
/* GO */

BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_sequences  where  sequence_name=upper('SQ_Epointsform_Table_BasicInfo');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'DROP SEQUENCE SQ_Epointsform_Table_BasicInfo  
        ';    
    END;
    END IF;
  END;
END;
/* GO */
-- end;
