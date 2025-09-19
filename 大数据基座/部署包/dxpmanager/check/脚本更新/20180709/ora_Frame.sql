-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/07/09 【时间】
-- frame_login_log添加appkey字段 -- 周志豪

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_login_log') and column_name = upper('appkey');
  if (isexist = 0) then
    execute immediate 'alter table frame_login_log add appkey  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;


