-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/03/27

-- 修改frame_ip_lockinfo -- 施佳炜
 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ip_lockinfo') and column_name = upper('Ip_manager_type');
  if (isexist = 1) then
    execute immediate 'alter table frame_ip_lockinfo rename column  Ip_manager_type to Ipmanagertype';
  end if;
  end;
end;
/* GO */

-- end;


