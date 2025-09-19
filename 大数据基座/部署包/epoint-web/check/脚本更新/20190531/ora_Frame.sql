-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/05/17 【时间】
-- 【新增经办表，相关参数表新增描述字段】 --【季海英】

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_handle_info');
 if (isexist = 0) then
    execute immediate '
      create table workflow_handle_info(
            handleguid 	nvarchar2(100) not null primary key,
            processguid 	nvarchar2(100) null,
            processversionguid 	nvarchar2(100) null,
            pviguid 	nvarchar2(100) null,
            misrowguid 	nvarchar2(100) null,
            tableid 	Integer null,
            userguid 	nvarchar2(100) null,
            ouguid 	nvarchar2(100) null,
            baseouguid 	nvarchar2(100) null,
            lasthandletime 	date null,
            status 	nvarchar2(100) null,
            isdone 	Integer null,
            note 	nvarchar2(100) null
)';
  end if;
  end;
end;
/* GO */

-- 添加字段示例
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_method_parameter') and column_name = upper('mpnamedescription');
  if (isexist = 0) then
    execute immediate 'alter table workflow_method_parameter add mpnamedescription nvarchar2(100)';
  end if;
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_method_parameter') and column_name = upper('mpvaluedescription');
  if (isexist = 0) then
    execute immediate 'alter table workflow_method_parameter add mpvaluedescription nvarchar2(100)';
  end if;
  end;
end;
/* GO */


-- end;


