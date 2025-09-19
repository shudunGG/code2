-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/4/10
-- 手势密码和生物识别锁定功能添加字段 --王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user') and column_name = upper('gesturepassword');
  if (isexist = 0) then
    execute immediate 'alter table frame_user add gesturepassword nvarchar2(500)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_user') and column_name = upper('gesturepassword');
  if (isexist = 0) then
    execute immediate 'alter table mobile_user add gesturepassword nvarchar2(500)';
  end if;
  end;
end;
/* GO */

-- 非织语环境禁止重复登录功能添加字段标记已被踢出 --王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('sso_token_info') and column_name = upper('mobilekickout');
  if (isexist = 0) then
    execute immediate 'alter table sso_token_info add  mobilekickout int';
  end if;
  end;
end;
/* GO */

-- end;


