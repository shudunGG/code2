-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/04/16 【时间】
-- frame_ou（部门表）添加字段OUCODEFULL -- 俞俊男
-- 新增门户元件分类表/frame_componenttype -- 俞俊男
-- 门户元件表[frame_portal_element]添加字段componenttype、moreurl -- 俞俊男


-- 新增门户元件分类表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_componenttype');
 if (isexist = 0) then
    execute immediate '
       create table frame_componenttype (
  rowguid nvarchar2(50) not null primary key,
  typename nvarchar2(50),
  ordernum integer
)';
  end if;
  end;
end;
/* GO */

-- 门户元件表[frame_portal_element]添加字段componenttype
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('componenttype');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add componenttype  integer';
  end if;
  end;
end;
/* GO */

-- 门户元件表[frame_portal_element]添加字段moreurl
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_portal_element') and column_name = upper('moreurl');
  if (isexist = 0) then
    execute immediate 'alter table frame_portal_element add moreurl  nvarchar2(1000)';
  end if;
  end;
end;
/* GO */

-- frame_ou（部门表）添加字段OUCODEFULL
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou') and column_name = upper('OUCODEFULL');
  if (isexist = 0) then
    execute immediate 'alter table frame_ou add OUCODEFULL  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- end;


