-- 所有脚本可直接复制到sql server查询设计器中执行

-- 帮助中心用表 --季立霞

-- 添加内容发布信息表
if not exists (select * from dbo.sysobjects where id = object_id('comm_comprehensive_info'))
create table comm_comprehensive_info
   (
    cinfoguid   nvarchar(100) not null primary key,
  cinfoname   nvarchar(500),
  cinfotype    nvarchar(10),
  cinfocontent   text,
  createtime   datetime,
  createusername   nvarchar(50),
  createuserguid   nvarchar(100),
  pageview    int,
  ordernum    int
    );
GO

-- 添加分类管理表
if not exists (select * from dbo.sysobjects where id = object_id('comm_category_manage'))
create table comm_category_manage
   (
    ccategoryguid     nvarchar(100) not null primary key,
  ccategorynum      nvarchar(100),
  ccategoryname     nvarchar(100),
  orderNum      int
    );
GO

-- 添加内容发布信息表
if not exists (select * from dbo.sysobjects where id = object_id('comm_message_release'))
create table comm_message_release
   (
    cmessageguid   nvarchar(100) not null primary key,
  cmessagetitle   nvarchar(500),
  cmessagecontent    text,
  ccategorynum    nvarchar(100),
  ccategoryguid   nvarchar(100),
  ccategoryname   nvarchar(100),
  createuserguid   nvarchar(100),
  createusername   nvarchar(100),
  createtime   datetime,
  ordernum    int
    );
GO

-- 添加处理反馈明细表
if not exists (select * from dbo.sysobjects where id = object_id('comm_feedback_detail_info'))
create table comm_feedback_detail_info
   (
    cfeedbackguid  nvarchar(100) not null primary key,
  cfeedbackcontent  text,
  cfeedbackquestionguid  nvarchar(100),
  cfeedbackuserguid  nvarchar(100),
  cfeedbackusername  nvarchar(100),
  cfeedbacktime  datetime,
  status  nvarchar(20),
  ordernum  int
    );
GO

-- 添加反馈问题信息表
if not exists (select * from dbo.sysobjects where id = object_id('comm_feedback_question_info'))
create table comm_feedback_question_info
   (
    rowguid nvarchar(100) not null primary key,
   cfeedbackquestiontitle varchar(500),
   cfeedbackquestioncontent  text,
   cfunctiontype nvarchar(100),
   cfeedbacktype nvarchar(10),
   cfeedbackuserguid nvarchar(100),
   cfeedbackusername nvarchar(100),
   cfeedbackquestiontime  datetime,
   processversioninstanceguid  nvarchar(100),
   status   nvarchar(20),
   ordernum  int
    );
GO
