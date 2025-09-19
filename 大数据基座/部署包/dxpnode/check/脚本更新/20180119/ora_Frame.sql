-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/01/19
-- 用户表中的职务字段清空--王露
begin
  declare isexist number;
  begin
  select count(1) into isexist from frame_user where title is not null;
  if (isexist > 0) then
    update frame_user set title =null;
  end if;
  end;
end;
/* GO */

-- end;


