-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/12/2
-- 新增表frame_login_statistics --【俞俊男】

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_login_statistics');
 if (isexist = 0) then
    execute immediate '
      create table frame_login_statistics
             (
               rowguid nvarchar2(50) not null primary key,
               loginid nvarchar2(100),
			   failnum int,
			   successnum int,
			   lastlogintime date,
			   lastfreqrecordtime date,
			   platform nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- end;


