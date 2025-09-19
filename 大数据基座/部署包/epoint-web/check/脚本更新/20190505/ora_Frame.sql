-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/05/05【时间】
-- api_info表添加字段wsNameSpace、wsSoapAction、wsWsdlContent --【俞俊男】


-- 添加字段wsNameSpace
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('wsNameSpace');
  if (isexist = 0) then
    execute immediate 'alter table api_info add wsNameSpace nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- api_request_params表中添加example/position -- 王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_request_params') and column_name = upper('position');
  if (isexist = 0) then
    execute immediate 'alter table api_request_params add position  nvarchar2(200)';
  end if;
  end;
end;
/* GO */

-- 添加字段wsSoapAction
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('wsSoapAction');
  if (isexist = 0) then
    execute immediate 'alter table api_info add wsSoapAction nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- 添加字段wsWsdlContent
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_info') and column_name = upper('wsWsdlContent');
  if (isexist = 0) then
    execute immediate 'alter table api_info add wsWsdlContent nclob';
  end if;
  end;
end;
/* GO */

-- end;


