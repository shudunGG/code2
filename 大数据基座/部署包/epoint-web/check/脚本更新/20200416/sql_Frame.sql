-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/04/16 【时间】
-- frame_ou（部门表）添加字段OUCODEFULL -- 俞俊男
-- 新增门户元件分类表/frame_componenttype -- 俞俊男
-- 门户元件表[frame_portal_element]添加字段componenttype、moreurl -- 俞俊男

-- 新增门户元件分类表
if not exists (select * from dbo.sysobjects where id = object_id('frame_componenttype'))
create table frame_componenttype (
  rowguid varchar(50) not null primary key,
  typename varchar(50),
  ordernum int
);
GO

-- 门户元件表[frame_portal_element]添加字段componenttype
if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='componenttype' ) 
alter table frame_portal_element add componenttype  int; 
GO

-- 门户元件表[frame_portal_element]添加字段moreurl
if not exists (select name from syscolumns  where id = object_id('frame_portal_element') and name='moreurl' ) 
alter table frame_portal_element add moreurl  nvarchar(1000); 
GO

-- frame_ou（部门表）添加字段OUCODEFULL
if not exists (select name from syscolumns  where id = object_id('frame_ou') and name='OUCODEFULL' ) 
alter table frame_ou add OUCODEFULL  nvarchar(100); 
GO
