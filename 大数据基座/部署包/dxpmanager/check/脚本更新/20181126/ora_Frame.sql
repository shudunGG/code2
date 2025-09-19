-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/11/26
-- 添加设计中台相关表结构 --徐剑

-- designstage_menu（栏目表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_menu');
 if (isexist = 0) then
    execute immediate '
      create table designstage_menu
             (
               menuguid            nvarchar2(50) not null primary key,
               menuname            nvarchar2(100) not null,
               parentmenuguid      nvarchar2(50),
               menuicon            nvarchar2(100),
			   menustyle           nvarchar2(20) not null,
			   ordernumber         number,
			   creatorguid         nvarchar2(50),
			   updateguid          nvarchar2(50),
			   gmtcreatetime       date,
			   gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_page（页面表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_page');
 if (isexist = 0) then
    execute immediate '
      create table designstage_page
             (
               pageguid            nvarchar2(50) not null primary key,
               pagename            nvarchar2(100) not null,
               menuguid            nvarchar2(50) not null,
               outerchainurl       nvarchar2(500),
               pagetype            nvarchar2(20) not null,
               pagestatus          number,
               releasetime         date,
               pagedatatype        nvarchar2(20),
               ordernumber         number,
               creatorguid         nvarchar2(50),
               updateguid          nvarchar2(50),
               gmtcreatetime       date,
               gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_recommend（首页推荐表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_recommend');
 if (isexist = 0) then
    execute immediate '
      create table designstage_recommend
             (
               recommendguid       nvarchar2(50) not null primary key,
               recommendtitle      nvarchar2(200) not null,
               introduce           blob not null,
               pageguid            nvarchar2(50) not null,
               validationtype      nvarchar2(20) not null,
  			   validationtime      date not null,
               ordernumber         number,
               creatorguid         nvarchar2(50),
               gmtcreatetime       date,
               updateguid          nvarchar2(50),
               gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_updateinfo（更新说明表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_updateinfo');
 if (isexist = 0) then
    execute immediate '
      create table designstage_updateinfo
             (
               infoguid            nvarchar2(50) not null primary key,
               info                blob,
               pageguid            nvarchar2(50) not null,
               ordernumber         number,
               creatorguid         nvarchar2(50),
               gmtcreatetime       date,
               updateguid          nvarchar2(50),
               gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_pagehistory（页面历史表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_pagehistory');
 if (isexist = 0) then
    execute immediate '
      create table designstage_pagehistory
             (
               pageguid            nvarchar2(50) not null primary key,
               pagename            nvarchar2(100) not null,
               menuguid            nvarchar2(50) not null,
               outerchainurl       nvarchar2(500),
               pagetype            nvarchar2(20) not null,
               pagestatus          number,
               releasetime         date,
               pagedatatype        nvarchar2(20),
               ordernumber         number,
			   creatorguid         nvarchar2(50),
               updateguid          nvarchar2(50),
               gmtcreatetime       date,
               gmtmodifiedtime     date,
               deleteguid          nvarchar2(50),
  			   gmtdeletetime       date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_document（文档表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_document');
 if (isexist = 0) then
    execute immediate '
      create table designstage_document
             (
               documentguid        nvarchar2(50) not null primary key,
               pictureurl          nvarchar2(500),
               introduce           blob,
               pageguid            nvarchar2(50),
               ordernumber         number,
               creatorguid         nvarchar2(50),
               updateguid          nvarchar2(50),
               gmtcreatetime       date,
               gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_module（模块表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_module');
 if (isexist = 0) then
    execute immediate '
      create table designstage_module
             (
               moduleguid          nvarchar2(50) not null primary key,
               layouttype          number,
               documentguid        nvarchar2(50) not null,
               ordernumber         number,
               creatorguid         nvarchar2(50),
               updateguid          nvarchar2(50),
               gmtcreatetime       date,
               gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_label（标签表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_label');
 if (isexist = 0) then
    execute immediate '
      create table designstage_label
             (
               labelguid           nvarchar2(50) not null primary key,
               labeltitle          nvarchar2(100) not null,
               labeltype           number,
               introduce           blob,
               iframeurl           nvarchar2(500),
               moduleguid          nvarchar2(50) not null,
               ordernumber         number,
               creatorguid         nvarchar2(50),
               updateguid          nvarchar2(50),
               gmtcreatetime       date,
               gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- designstage_demo（案例表）
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('designstage_demo');
 if (isexist = 0) then
    execute immediate '
      create table designstage_demo
             (
               demoguid            nvarchar2(50) not null primary key,
               htmlcode            blob,
               csscode             blob,
               jscode              blob,
               javacode            blob,
               codeexplain         blob,
               othercode           blob,
               relationguid        nvarchar2(50),
               relationtype        number,
               ordernumber         number,
               creatorguid         nvarchar2(50),
               updateguid          nvarchar2(50),
               gmtcreatetime       date,
               gmtmodifiedtime     date
              )';
  end if;
  end;
end;
/* GO */

-- end;


