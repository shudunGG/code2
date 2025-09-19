-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/04/02 
-- 删除视图view_appmanage_myapp,view_appmanage_appinfo_right,view_appmanage_element_right,view_appmanage_myelement --陈星怡

-- 删除view_appmanage_myapp
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_views where view_name = upper('view_appmanage_myapp');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop view view_appmanage_myapp
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除view_appmanage_appinfo_right
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_views where view_name = upper('view_appmanage_appinfo_right');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop view view_appmanage_appinfo_right
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除view_appmanage_element_right
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_views where view_name = upper('view_appmanage_element_right');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop view view_appmanage_element_right
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 删除view_appmanage_myelement
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_views where view_name = upper('view_appmanage_myelement');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop view view_appmanage_myelement
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- end;


