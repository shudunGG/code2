-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 菜单配置功能表添加 -- 俞俊男

-- 添加用户菜单表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_personal_menu');
 if (isexist = 0) then
    execute immediate '
      create table frame_personal_menu
             (
				rowguid  nvarchar2(100) NOT NULL primary key,
				userguid  nvarchar2(100) NOT NULL ,
				relatedguid  nvarchar2(100) NOT NULL ,
				menuType  number NOT NULL ,
				orderNumber  number NULL 
              )';
  end if;
  end;
end;
/* GO */


-- 添加系统菜单表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_sys_menu');
 if (isexist = 0) then
    execute immediate '
      create table frame_sys_menu
             (
				rowguid  nvarchar2(100) NOT NULL primary key,
				relatedguid  nvarchar2(100) NOT NULL ,
				menuType  number NOT NULL ,
				orderNumber  number NULL 
              )';
  end if;
  end;
end;
/* GO */

-- end;


