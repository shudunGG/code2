-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 2018/12/04
-- 添加服务文档相关表结构 --何晓瑜

-- api_document_title（文档标题表）
create table if not exists api_document_title
(
  rowguid                varchar(50) not null primary key,
  titlename              varchar(500) not null,
  parenttitleguid      varchar(50),
  ordernumber        int(11)
);
GO

-- api_document（服务文档表）
create table if not exists api_document
(
  rowguid            varchar(50) not null primary key,
  content             text,
  mdcontent        text,
  titleguid            varchar(50) not null
);
GO

-- DELIMITER ; --