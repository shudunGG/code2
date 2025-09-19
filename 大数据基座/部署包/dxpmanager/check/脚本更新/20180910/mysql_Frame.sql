-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --
-- 帮助中心信息表--季立霞

-- 添加添加内容发布信息表
create table if not exists comm_comprehensive_info
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
create table if not exists comm_category_manage
(
  ccategoryguid   nvarchar(100) not null primary key,
  ccategorynum    nvarchar(100),
  ccategoryname   nvarchar(100),
  ordernum      int
);
GO

-- 添加内容发布信息表
create table if not exists comm_message_release
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
create table if not exists comm_feedback_detail_info
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
create table if not exists comm_feedback_question_info
(
   rowguid nvarchar(100) not null primary key,
   cfeedbackquestiontitle nvarchar(500),
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

-- DELIMITER ; --