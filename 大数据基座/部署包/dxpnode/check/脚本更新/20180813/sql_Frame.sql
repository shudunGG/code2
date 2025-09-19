-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/08/13
-- -- -- 如果personal_portal_element没有rowguid,删表重构---何晓瑜

if not exists (select name from syscolumns  where id = object_id('personal_portal_element') and name='rowguid' ) 
drop table personal_portal_element;
create table personal_portal_element
   (
    rowguid              nvarchar(50) not null primary key,
    ptrowguid           nvarchar(50) not null,
    isDisable              int,
    userguid              nvarchar(50) not null,
    elementlocation   nvarchar(50)
    );
GO


