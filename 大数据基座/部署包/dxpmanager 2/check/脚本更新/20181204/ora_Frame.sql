-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/12/04
-- 添加服务文档相关表结构 --何晓瑜

-- api_document_title（文档标题表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_document_title');
 if (isexist = 0) then
    execute immediate '
      create table api_document_title
             (
               rowguid                nvarchar2(100) not null primary key,
               titlename              nvarchar2(500) not null,
               parenttitleguid      nvarchar2(100),
			   ordernumber        number
              )';
  end if;
  end;
end;
/* GO */

-- api_document（服务文档表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('api_document');
 if (isexist = 0) then
    execute immediate '
      create table api_document
             (
               rowguid            nvarchar2(100) not null primary key,
               content            blob,
               mdcontent       blob,
               titleguid            nvarchar2(100) not null
              )';
  end if;
  end;
end;
/* GO */

-- end;


