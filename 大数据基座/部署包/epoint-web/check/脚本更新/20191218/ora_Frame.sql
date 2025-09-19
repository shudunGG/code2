-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/18
-- 修改字段platform的string为int类型--王颜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_update') and column_name = upper('platform');
  if (isexist = 1) then
    execute immediate 'alter table mobile_update modify platform int';
  end if;
  end;
end;
/* GO */

-- 添加字段userinfo， 用于保存登录时的用户信息，当用户表中用户被删除时展示出来--王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_device') and column_name = upper('userinfo');
  if (isexist = 0) then
    execute immediate 'alter table mobile_device add userinfo  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- 表单模版表中增加左树名称字段 --【薛炳】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('EpointsformTemplate') and column_name = upper('treetitle');
  if (isexist = 0) then
    execute immediate 'alter table EpointsformTemplate add treetitle  nvarchar2(10)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('codeid');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add codeid  Integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('itemid');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add itemid  Integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('columnordernum');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add columnordernum  Integer';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_struct') and column_name = upper('beforetableid');
  if (isexist = 0) then
    execute immediate 'alter table table_struct add beforetableid  Integer';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('table_basicinfo') and column_name = upper('mergeformids');
  if (isexist = 0) then
    execute immediate 'alter table table_basicinfo add mergeformids  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- end;


