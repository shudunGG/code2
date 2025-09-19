-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/12/04
-- 添加服务文档相关表结构 --何晓瑜

-- api_document_title（文档标题表）
if not exists (select * from dbo.sysobjects where id = object_id('api_document_title'))
create table api_document_title
   (
    rowguid                nvarchar(100) not null primary key,
    titlename              nvarchar(500) not null,
    parenttitleguid      nvarchar(100),
    ordernumber         int
    );
GO

-- api_document（服务文档表）
if not exists (select * from dbo.sysobjects where id = object_id('api_document'))
create table api_document
   (
    rowguid            nvarchar(50) not null primary key,
    content             text,
    mdcontent        text,
    titleguid            nvarchar(50) not null
    );
GO