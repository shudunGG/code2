-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/02 【时间】
-- Frame_UserRoleRelation表添加ouguid字段 --【徐剑】

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('Frame_UserRoleRelation') and column_name = upper('ouguid');
  if (isexist = 0) then
    execute immediate 'alter table Frame_UserRoleRelation add ouguid nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;


