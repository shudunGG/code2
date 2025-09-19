-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
--BEGIN
---- 2019/4/26
-- table_basicinfo中去除TABLEID自增 --陈佳
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_triggers where trigger_name=upper('TG_TABLE_BASICINFO');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'DROP TRIGGER TG_TABLE_BASICINFO';    
    END;
    END IF;
  END;
END;
/* GO */

BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_sequences  where  sequence_name=upper('SQ_TABLE_BASICINFO');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'DROP SEQUENCE SQ_TABLE_BASICINFO  
        ';    
    END;
    END IF;
  END;
END;
/* GO */
-- end;
