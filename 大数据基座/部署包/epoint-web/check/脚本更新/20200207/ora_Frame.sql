-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/02/07 【时间】
-- 新增表frame_ui_deskmodule --【陈星怡】
-- 新增表frame_ui_desk_personalmodule --【陈星怡】


-- 添加frame_ui_deskmodule表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ui_deskmodule');
 if (isexist = 0) then
    execute immediate '
      create table frame_ui_deskmodule
             (
			   rowguid nvarchar2(50) not null primary key,
			   sourceguid nvarchar2(50) not null,
			   belongdeskguid nvarchar2(50) not null,
			   opentype nvarchar2(50),
			   ordernumber int,
			   costomparam nvarchar2(2000)
              )';
  end if;
  end;
end;
/* GO */

-- 添加frame_ui_desk_personalmodule表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ui_desk_personalmodule');
 if (isexist = 0) then
    execute immediate '
      create table frame_ui_desk_personalmodule
             (
               rowguid nvarchar2(50) not null primary key,
			   deskmoduleguid nvarchar2(50) not null,
		       parentguid nvarchar2(50),
			   belongdeskguid nvarchar2(50) not null,
			   ordernumber int,
			   userguid nvarchar2(50) not null,
			   isinstalled int,
			   parentname nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */
-- end;
