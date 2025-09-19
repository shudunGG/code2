-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
--BEGIN
---- 2019/8/29
-- 添加AUTO_INCREASE_ITEMID方法
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_procedures where object_name=upper('AUTO_INCREASE_ITEMID');
    IF (IsExist = 0) THEN
      BEGIN      
        execute   immediate   
        'CREATE OR REPLACE FUNCTION AUTO_INCREASE_ITEMID
  RETURN NVARCHAR2
  AS
    ItemIDTemp number;
    ItemIDFinal number;
    IsExist number;
  BEGIN
    ItemIDFinal := 1;
    select COUNT(*) INTO IsExist from CODE_ITEMS;
    if(IsExist > 0) THEN
      select min(ITEMID) into ItemIDTemp from CODE_ITEMS;
      with tabs as
          (
          select row_number() over(order by itemid) num,itemid  from code_items
          )
         select max(itemid)+1 into ItemIDFinal from tabs where num+(ItemIDTemp-1)=itemid;
    END IF;
    return ItemIDFinal;
  END;';    
    END;
    END IF;
  END;
END;
/* GO */

--END;
