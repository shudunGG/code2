-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/11/05 

-- 修改sso_token_info 表的字段名称--俞俊男

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('sso_token_info') and column_name = upper('type');
  if (isexist = 1) then
    execute immediate 'alter table sso_token_info rename column type to tokentype';
  end if;
  end;
end;
/* GO */

-- 修改frame_ou_weixin 表的字段名称--周志豪

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_weixin') and column_name = upper('id');
  if (isexist = 1) then
    execute immediate 'alter table frame_ou_weixin rename column id to rowguid';
  end if;
  end;
end;
/* GO */


-- end;


