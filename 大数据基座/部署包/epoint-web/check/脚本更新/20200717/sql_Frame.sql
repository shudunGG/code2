-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/07/17 
-- 新增隐私类型表 --王颜
if not exists (select * from dbo.sysobjects where id = object_id('frame_privacy_type'))
create table tablename
   (
  rowguid             nvarchar(50) not null primary key,
  privacytype         nvarchar(50),
  privacydetail       nvarchar(100),
  isdefault           int
    );
GO

-- 隐私版本表添加隐私类型
if not exists (select name from syscolumns  where id = object_id('frame_privacy') and name='privacytype' ) 
alter table frame_privacy add privacytype  nvarchar(50); 
GO
