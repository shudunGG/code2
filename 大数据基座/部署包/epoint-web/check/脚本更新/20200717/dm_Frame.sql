-- 如需手工在dm管理工具中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/07/17 
-- 新增隐私类型表 --王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_privacy_type');
 if (isexist = 0) then
    execute immediate '
      create table frame_privacy_type
             (
               rowguid     nvarchar2(50) not null primary key,
               privacytype     nvarchar2(50),
               privacydetail           nvarchar2(100),
               isdefault          integer
              )';
  end if;
  end;
end;
/* GO */


-- 隐私版本表添加隐私类型
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_privacy') and column_name = upper('privacytype');
  if (isexist = 0) then
    execute immediate 'alter table frame_privacy add privacytype  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;


