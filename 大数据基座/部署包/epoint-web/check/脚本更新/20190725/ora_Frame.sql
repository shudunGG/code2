-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/7/25 【时间】
-- 【高可用通道】 --cdy

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream');
 if (isexist = 0) then
    execute immediate '
      create table api_channel_upstream
             (
               row_guid       nvarchar2(50) not null primary key,
               order_number    number,
               upstream_name   nvarchar2(100),
               upstream_encode_name   nvarchar2(500),
               create_date     date,
               update_date     date
              )';
  end if;
  end;
end;
/* GO */

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_target');
 if (isexist = 0) then
    execute immediate '
      create table api_channel_target
             (
                row_guid    nvarchar2(50) not null primary key,
                weight      number,
                target_host    nvarchar2(100),
                upstream_guid  nvarchar2(50),
                create_date     date,
                update_date     date
              )';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_target') and column_name = upper('targetid');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_target add targetid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_channel_upstream') and column_name = upper('upstreamid');
  if (isexist = 0) then
    execute immediate 'alter table api_channel_upstream add upstreamid  nvarchar2(50)';
  end if;
  end;
end;
/* GO */

-- end;

-- end;


