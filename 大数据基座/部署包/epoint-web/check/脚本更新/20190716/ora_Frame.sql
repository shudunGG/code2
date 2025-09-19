-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/7/16
-- comm_feedback_question_info新增字段platform--wy
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_feedback_question_info') and column_name = upper('platform');
  if (isexist = 0) then
    execute immediate 'alter table comm_feedback_question_info add platform int';
  end if;
  end;
end;
/* GO */

-- 修改paramvalue长度为2000 --wy
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_param') and column_name = upper('paramvalue') and data_type='NVARCHAR2' and data_length='4000';
  if (isexist = 0) then
     execute immediate 'alter table app_param modify paramvalue nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

-- end;


