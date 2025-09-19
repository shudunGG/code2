-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/03/15
-- 新增用户锁定表 --周志豪
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_login_lockinfo');
 if (isexist = 0) then
    execute immediate 'CREATE TABLE frame_login_lockinfo (
		  rowguid nvarchar2(50) not null primary key,
		  lockeditem nvarchar2(50),
		  lockedloginid nvarchar2(50),
		  lockeduserguid nvarchar2(50),
		  lockedtime date,
		  clearlockedtime date, 
		  ishandunlock nvarchar2(50),
		  handunlocktime date
)';
  end if;
  end;
end;
/* GO */

-- 添加动态口令表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_onetime_pwd');
  if (isexist = 0) then
    execute immediate 'CREATE TABLE frame_onetime_pwd (
 		 rowguid NVARCHAR2(50) not null primary key,
 		 loginid NVARCHAR2(50),
 		 efftime DATE,
 		 onetimepassword NVARCHAR2(50)
)';
  end if;
  end;
end;
/* GO */
-- end;