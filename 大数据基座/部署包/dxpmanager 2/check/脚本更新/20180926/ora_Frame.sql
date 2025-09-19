-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2018/09/25 
-- 修改isrestjsboot字段类型
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_config') and column_name = upper('isrestjsboot') and data_type = upper('NUMBER');
  if (isexist = 0) then
    execute immediate 'update frame_config set isrestjsboot=1 where isrestjsboot = ''true''';
    execute immediate 'update frame_config set isrestjsboot=0 where isrestjsboot =''false''';
    execute immediate 'alter table frame_config add isrestjsboot_tmp integer';
    execute immediate 'update frame_config set isrestjsboot_tmp = isrestjsboot';
    execute immediate 'alter table frame_config drop column isrestjsboot';
    execute immediate 'alter table frame_config rename column isrestjsboot_tmp to isrestjsboot';
  end if;
  end;
end;
/* GO */
-- end;


