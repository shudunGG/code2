-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/03/31
-- 插入系统参数和流程代理人两条数据  --陈星怡

-- 系统参数
begin
begin
declare isexist number;
begin
select count(*) into isexist from app_sync_subscribe where clienttag = 'FrameConfig';
if (IsExist=0) then
insert into app_sync_subscribe (rowguid,clienttag,clientname,subscribepage) values 
('696e27b3-4e09-450d-8eb1-60a1c904178b', 'FrameConfig', '系统参数', 'frame/pages/basic/gateway/app/appinfomanage/subscribeframeconfig');
 end if;
  end;
end;
commit;
end;
/* GO */

-- 流程代理人
begin
begin
declare isexist number;
begin
select count(*) into isexist from app_sync_subscribe where clienttag = 'FrameCommissionSet';
if (IsExist=0) then
insert into app_sync_subscribe (rowguid,clienttag,clientname) values 
('9ab7ce5c-6908-4e48-b738-b7381fd6474e', 'FrameCommissionSet', '流程代理人');
 end if;
  end;
end;
commit;
end;
/* GO */

-- 添加表frame_operateratelimit_log   --吴琦
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_operateratelimit_log');
  if (isexist = 0) then
    execute immediate 'create table frame_operateratelimit_log
(
  RowGuid                 nvarchar2(50) not null primary key,
  lockurl                 nvarchar2(500),
  locktype                nvarchar2(50),
  lockvalue               nvarchar2(50),
  locktime                date,
  clearlocktime           date
 )';
  end if;
  end;
end;
/* GO */

-- 表单版本表增加布局类型字段 --薛炳
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('epointformversion') and column_name = upper('layouttype');
  if (isexist = 0) then
    execute immediate 'alter table epointformversion add layouttype nvarchar2(10)';
  end if;
  end;
end;
/* GO */
-- end;