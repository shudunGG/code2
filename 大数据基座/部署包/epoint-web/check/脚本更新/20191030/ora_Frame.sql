-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/10/31 【时间】
-- 添加表frame_user_password_modifylog --【何晓瑜】
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_password_modifylog');
 if (isexist = 0) then
    execute immediate '
      create table frame_user_password_modifylog
             (
               rowguid nvarchar2(50) not null primary key,
               updatetime date,
			   userguid nvarchar2(50) not null,
			   lastpwd nvarchar2(200) not null
              )';
  end if;
  end;
end;
/* GO */

-- end;


