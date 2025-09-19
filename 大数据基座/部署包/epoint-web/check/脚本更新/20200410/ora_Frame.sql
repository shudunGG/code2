-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN
-- 2020/04/09
-- 添加表workflow_transactor_sequence --陈端一
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('workflow_transactor_sequence');
  if (isexist = 0) then
    execute immediate 'create table workflow_transactor_sequence
(
  sequenceGuid            nvarchar2(50) not null primary key,
  pviGuid                 nvarchar2(50),
  transactor              nvarchar2(50),
  transactorName          nvarchar2(50),
  ouGuid                  nvarchar2(50),
  operationDate           date,
  tag                     integer,
  activityGuid            nvarchar2(50),
  workItemGuid            nvarchar2(50),
  orderNum               integer,
  note                     nvarchar2(500),
  clientGuid              nvarchar2(100)
 )';
  end if;
  end;
end;
/* GO */

-- 2020/04/10
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_schemetableshow') and column_name = upper('parenttableid');
  if (isexist = 0) then
    execute immediate 'alter table frame_schemetableshow add parenttableid integer';
  end if;
  end;
end;
/* GO */-- 已存在frame_lessee表，只需要向表中添加username，password，del_flag字段


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_lessee') and column_name=upper('username');
  if (isexist = 0) then
  execute immediate 'alter table frame_lessee add username  nvarchar2(100)';
  end if;
  end;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_lessee') and column_name=upper('password');
  if (isexist = 0) then
  execute immediate 'alter table frame_lessee add password  nvarchar2(500)';
  end if;
  end;
  
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_lessee') and column_name=upper('del_flag');
  if (isexist = 0) then
  execute immediate 'alter table frame_lessee add del_flag  nvarchar2(1)';
  end if;
  end;
end;
/* GO */

-- 2020/04/10
-- 添加表frame_lessee --刘飞龙
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_lesseedata');
  if (isexist = 0) then
    execute immediate 'create table frame_lesseedata
(
  RowGuid           nvarchar2(100) not null primary key,
  lesseeguid        nvarchar2(100),
  classname         nvarchar2(100),
  strategy          nvarchar2(100),
  lastdate          date,
  orderNumber       number(11),
  del_flag          nvarchar2(1)
 )';
  end if;
  end;
end;
/* GO */
-- end;


