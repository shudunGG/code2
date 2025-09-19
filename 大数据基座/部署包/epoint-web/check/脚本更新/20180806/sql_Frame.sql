-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/08/06 【时间】
-- app_info表添加issyncrole,issyncaddress字段 -- 樊志君

-- 添加字段示例
if not exists (select name from syscolumns  where id = object_id('app_info') and name='issyncrole' ) 
alter table app_info add issyncrole  int default 0; 
GO

if not exists (select name from syscolumns  where id = object_id('app_info') and name='issyncaddress' ) 
alter table app_info add issyncaddress  int default 0; 
GO