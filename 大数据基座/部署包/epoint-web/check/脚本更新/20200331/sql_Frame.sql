-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/03/31
-- 插入系统参数和流程代理人两条数据  --陈星怡

-- 插入系统参数
if not exists(select clienttag from app_sync_subscribe where clienttag = 'FrameConfig')
begin 
insert into app_sync_subscribe (rowguid,clienttag,clientname,subscribepage) values ('696e27b3-4e09-450d-8eb1-60a1c904178b', 'FrameConfig', '系统参数', 'frame/pages/basic/gateway/app/appinfomanage/subscribeframeconfig');
end 
GO 

-- 插入流程代理人
if not exists(select clienttag from app_sync_subscribe where clienttag = 'FrameCommissionSet')
begin 
insert into app_sync_subscribe (rowguid,clienttag,clientname) values ('9ab7ce5c-6908-4e48-b738-b7381fd6474e', 'FrameCommissionSet', '流程代理人');
end 
GO 

-- 添加表frame_operateratelimit_log   --吴琦
if not exists (select * from dbo.sysobjects where id = object_id('frame_operateratelimit_log'))
create table frame_operateratelimit_log
(
  RowGuid nvarchar(50) not null primary key,
  lockurl nvarchar(500) null,
  locktype nvarchar(50) null,
  lockvalue nvarchar(50) null,
  locktime datetime null,
  clearlocktime datetime null
);
GO

-- 表单版本表增加布局类型字段 --薛炳
if not exists (select * from  information_schema.columns where  table_name = 'epointformversion' and column_name = 'layouttype' ) 
alter table epointformversion add layouttype nvarchar(10); 
GO