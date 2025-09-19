-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/01/13 【时间】
-- 添加OPERATECONTENT，CONTENT字段长度 --周志豪

-- 修改字段长度示例
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_log') and column_name = upper('CONTENT') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table frame_log add newcolumn NVARCHAR2(2000)';
    execute immediate 'update frame_log set newcolumn = CONTENT';
    execute immediate 'alter table frame_log drop column CONTENT';
    execute immediate 'alter table frame_log rename column newColumn to CONTENT';
  end if;
  end;
end;

/* GO */


-- 修改字段长度示例
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_log') and column_name = upper('OPERATECONTENT') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table frame_log add newcolumn NVARCHAR2(2000)';
    execute immediate 'update frame_log set newcolumn = OPERATECONTENT';
    execute immediate 'alter table frame_log drop column OPERATECONTENT';
    execute immediate 'alter table frame_log rename column newColumn to OPERATECONTENT';
  end if;
  end;
end;

/* GO */


-- end;


