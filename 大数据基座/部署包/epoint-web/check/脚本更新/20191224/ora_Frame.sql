-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/12/24 【时间】
-- 新增表epointsform_share_config --【季宇杰】
-- 新增表epointsform_field_config --【季宇杰】
-- 新增表epointsform_table_config --【季宇杰】
-- 新增表epointsform_fieldrelation --【季宇杰】

-- 添加epointsform_share_config表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_share_config');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_share_config
             (
			   rowguid nvarchar2(50) not null primary key,
			   sharename nvarchar2(100) not null,
			   ordernumber int
              )';
  end if;
  end;
end;
/* GO */

-- 添加epointsform_field_config表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_field_config');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_field_config
             (
               rowguid nvarchar2(50) not null primary key,
			   fieldname nvarchar2(100) not null,
		       fieldchinesename nvarchar2(100) not null,
			   fieldtype nvarchar2(50),
			   ordernumber int,
			   shareguid nvarchar2(50) not null
              )';
  end if;
  end;
end;
/* GO */

-- 添加epointsform_table_config表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_table_config');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_table_config
             (
               rowguid nvarchar2(50) not null primary key,
               formname nvarchar2(100) not null,
  			   formid nvarchar2(100) not null,
  			   formguid nvarchar2(50) not null,
  			   tableid int not null,
  		       ordernumber int,
  			   shareguid nvarchar2(50) not null
              )';
  end if;
  end;
end;
/* GO */

-- 添加epointsform_fieldrelation表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointsform_fieldrelation');
 if (isexist = 0) then
    execute immediate '
      create table epointsform_fieldrelation
             (
  			  rowguid nvarchar2(50) not null primary key,
  			  formguid nvarchar2(100) not null,
              configguid nvarchar2(100) ,
        	  tableid int not null,
  			  ordernumber int,
  	 		  shareguid nvarchar2(50) not null,
  			  fieldname nvarchar2(100) not null,
  			  fieldcname nvarchar2(100) not null,
  			  sharefieldname nvarchar2(100) not null,
  			  sharefieldcname nvarchar2(100) not null
              )';
  end if;
  end;
end;
/* GO */
-- end;


