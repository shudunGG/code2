-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/07/05
-- 去除frame_user中ouguid字段的空格--王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from frame_user where OUGUID like '% %';
  if (isexist = 1) then
    update  frame_user set OUGUID = lTRIM(RTRIM(OUGUID));
    commit;
  end if;
  end;
end;
/* GO */


-- 数据源表放大servername长度--王露
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('DataSource') and column_name = upper('servername') and data_type='NVARCHAR2' and data_length='1000';
  if (isexist = 0) then
    execute immediate 'alter table DataSource modify servername NVARCHAR2(500)';
  end if;
  end;
end;
/* GO */

-- end;

