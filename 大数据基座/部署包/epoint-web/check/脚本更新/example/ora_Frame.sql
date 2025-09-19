-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2017/10/20 【时间】
-- 【内容简单介绍】 --【添加人姓名】

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablename');
 if (isexist = 0) then
    execute immediate '
      create table tablename
             (
               columnname1     nvarchar2(50) not null primary key,
               columnname2           nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- 删除表
BEGIN
  declare IsExist number;
  Begin
    select count(*) into IsExist from user_tables where Table_name = upper('tablename');
    IF (IsExist = 1) THEN
      BEGIN      
        execute   immediate   
        'drop table tablename
        ';    
    END;
    END IF;
  END;
END;
/* GO */

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablename') and column_name = upper('columnname');
  if (isexist = 0) then
    execute immediate 'alter table tablename add columnname  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- 修改字段示例
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablename') and column_name = upper('columnname') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 1) then
    execute immediate 'alter table tablename modify columnname nvarchar2(500)';
  end if;
  end;
end;
/* GO */

-- 修改字段示例（类型不一致）
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('tablename') and column_name = upper('columnname') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
     execute immediate 'alter table tablename add newcolumn clob';
    execute immediate 'update tablename set newcolumn = columnname';
    execute immediate 'alter table tablename drop column columnname';
    execute immediate 'alter table tablename rename column newColumn to columnname';
  end if;
  end;
end;


/* GO */

-- end;


