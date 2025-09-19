-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/09/01
-- frame_attachinfo表添加附件类型webcontenttype
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_attachinfo') and column_name = upper('webcontenttype');
  if (isexist = 0) then
    execute immediate 'alter table frame_attachinfo add webcontenttype nvarchar2(150)';
  end if;
  end;
end;
/* GO */

-- end;


