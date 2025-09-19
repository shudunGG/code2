-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 帮助中心所需表 --季立霞

-- 添加内容发布信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_comprehensive_info');
 if (isexist = 0) then
    execute immediate'
      create table comm_comprehensive_info(
             cinfoguid   nvarchar2(100) not null primary key,
             cinfoname   nvarchar2(500),
             cinfotype    nvarchar2(10),
             cinfocontent   nclob,
             createtime   date,
             createusername   nvarchar2(50),
             createuserguid   nvarchar2(100),
             pageview    integer,
             ordernum    integer
              )';
  end if;
  end;
end;
/* GO */

-- 添加分类管理表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_category_manage');
 if (isexist = 0) then
    execute immediate '
      create table comm_category_manage
      (
             ccategoryguid     nvarchar2(100) not null primary key,
             ccategorynum      nvarchar2(100),
             ccategoryname     nvarchar2(100),
             orderNum      integer
       )';
  end if;
  end;
end;
/* GO */

-- 添加内容发布信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_message_release');
 if (isexist = 0) then
    execute immediate '
      create table comm_message_release
      (
             cmessageguid   nvarchar2(100) not null primary key,
  cmessagetitle   nvarchar2(500),
  cmessagecontent    nclob,
  ccategorynum    nvarchar2(100),
  ccategoryguid   nvarchar2(100),
  ccategoryname   nvarchar2(100),
  createuserguid   nvarchar2(100),
  createusername   nvarchar2(100),
  createtime   date,
  ordernum    integer
       )';
  end if;
  end;
end;
/* GO */


-- 添加处理反馈明细表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_feedback_detail_info');
 if (isexist = 0) then
    execute immediate '
      create table comm_feedback_detail_info
      (
             cfeedbackguid  nvarchar2(100) not null primary key,
  cfeedbackcontent  nclob,
  cfeedbackquestionguid  nvarchar2(100),
  cfeedbackuserguid  nvarchar2(100),
  cfeedbackusername  nvarchar2(100),
  cfeedbacktime  date,
  status  nvarchar2(20),
  ordernum  integer
       )';
  end if;
  end;
end;
/* GO */


-- 添加反馈问题信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_feedback_question_info');
 if (isexist = 0) then
    execute immediate '
      create table comm_feedback_question_info
      (
             rowguid nvarchar2(100) not null primary key,
   cfeedbackquestiontitle nvarchar2(500),
   cfeedbackquestioncontent  nclob,
   cfunctiontype nvarchar2(100),
   cfeedbacktype nvarchar2(10),
   cfeedbackuserguid nvarchar2(100),
   cfeedbackusername nvarchar2(100),
   cfeedbackquestiontime  date,
   processversioninstanceguid  nvarchar2(100),
   status   nvarchar2(20),
   ordernum  integer
       )';
  end if;
  end;
end;
/* GO */

-- end;


