-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/11/28
-- 证书路径字段加大 --何晓瑜

 begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_ios_certification') and column_name = upper('type');
  if (isexist = 1) then
    execute immediate 'alter table messages_ios_certification rename column type to certype';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('messages_ios_certification') and column_name = upper('path') and data_type='NVARCHAR2' and data_length='400';
  if (isexist = 0) then
    execute immediate 'alter table messages_ios_certification add newcolumn nvarchar2(200)';
    execute immediate 'update messages_ios_certification set newcolumn = path';
    execute immediate 'alter table messages_ios_certification drop column path';
    execute immediate 'alter table messages_ios_certification rename column newColumn to path';
  end if;
  end;
end;
/* GO */
-- comm_notice_user_read表添加 -- 俞俊男

-- 添加comm_notice_user_read表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_notice_user_read');
 if (isexist = 0) then
    execute immediate '
      create table comm_notice_user_read
             (
				rowguid  nvarchar2(100) NOT NULL primary key,
				userguid  nvarchar2(100) NOT NULL ,
				noticeguid  nvarchar2(100) NOT NULL ,
				updateTime  date NOT NULL ,
				bak1  nvarchar2(100) NULL 
              )';
  end if;
  end;
end;
/* GO */


-- end;


