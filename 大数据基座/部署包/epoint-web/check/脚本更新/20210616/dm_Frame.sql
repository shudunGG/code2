-- 如需手工在dm管理工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2021/6/16
-- 表frame_user_snapshot添加字段gesturepassword,hiredate --【白钦】
-- 表frame_ou_snapshot添加字段oucodefull --【白钦】


-- frame_ou_snapshot表新增oucodefull字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_snapshot') and column_name = upper('oucodefull');
  if (isexist = 0) then
    execute immediate 'alter table frame_ou_snapshot add oucodefull varchar(100)';
  end if;
  end;
end;
/* GO */
-- frame_user_snapshot表新增gesturepassword,hiredate字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_snapshot') and column_name = upper('gesturepassword');
  if (isexist = 0) then
    execute immediate 'alter table frame_user_snapshot add gesturepassword varchar(500)';
  end if;
  end;
end;
/* GO */
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_snapshot') and column_name = upper('hiredate');
  if (isexist = 0) then
    execute immediate 'alter table frame_user_snapshot add hiredate date';
  end if;
  end;
end;
/* GO */

-- end;


