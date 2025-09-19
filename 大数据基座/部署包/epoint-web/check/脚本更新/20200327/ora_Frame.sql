-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/03/27 
-- 【删除表】  --【陈星怡】

-- 删除表appmanage_appinfo
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('appmanage_appinfo');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table appmanage_appinfo
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除表appmanage_pa_unload
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('appmanage_pa_unload');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table appmanage_pa_unload
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除表frame_desktop_manage
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('frame_desktop_manage');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table frame_desktop_manage
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除表frame_desktopright
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('frame_desktopright');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table frame_desktopright
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除表appmanage_personalapp
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('appmanage_personalapp');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table appmanage_personalapp
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除表appmanage_publicelement
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('appmanage_publicelement');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table appmanage_publicelement
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除表appmanage_elementright
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('appmanage_elementright');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table appmanage_elementright
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除表appmanage_personalelement
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('appmanage_personalelement');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table appmanage_personalelement
        ';    
    END;
    END IF;
  END;
END;
/* GO */


-- end;


