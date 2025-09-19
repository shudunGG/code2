-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/7/8
-- appinfo中添加三个字段，用于移动应用 --王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('platform');
  if (isexist = 0) then
    execute immediate 'alter table app_info add  platform nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('logo');
  if (isexist = 0) then
    execute immediate 'alter table app_info add  logo nvarchar2(2000)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_info') and column_name = upper('IsExternal');
  if (isexist = 0) then
    execute immediate 'alter table app_info add  IsExternal int';
  end if;
  end;
end;
/* GO */


begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('platform');
  if (isexist = 0) then
    execute immediate 'alter table app_module add platform nvarchar2(50)';
  end if;
  end;
end;
/* GO */

begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_module') and column_name = upper('IsEnter');
  if (isexist = 0) then
    execute immediate 'alter table app_module add IsEnter int';
  end if;
  end;
end;
/* GO */

-- 添加应用参数
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('app_param');
 if (isexist = 0) then
    execute immediate '
      create table app_param
             (
                 rowguid              nvarchar2(50) not null primary key,
                 paramname           nvarchar2(50),
                 paramvalue           nvarchar2(1000),
                 appguid           nvarchar2(50),
                 moduleguid         nvarchar2(50),
                 description           nvarchar2(500),  
                 paramtype          int,
                 ordernum           int,
                 createdate          date,
                 isshowmobile        int
              )';
  end if;
  end;
end;
/* GO */

-- 添加移动设备表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_device');
 if (isexist = 0) then
    execute immediate '
      create table mobile_device
             (
                  rowguid              nvarchar2(50) not null primary key,
  userguid          nvarchar2(50),
  deviceid           nvarchar2(50),
  appguid           nvarchar2(50),
  deviceinfo           nvarchar2(200),  
  registdate          date,
  lastusedate          date,
  enable           int,
  appversion           nvarchar2(50),
  description          nvarchar2(50),
  devicedetailinfo     nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */

-- 添加移动错误日志表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_errorlog');
 if (isexist = 0) then
    execute immediate '
      create table mobile_errorlog
  (rowguid              nvarchar2(50) not null primary key,
  userguid            nvarchar2(50),
  loginid           nvarchar2(50),
  displayname           nvarchar2(50),
  appguid           nvarchar2(50),
  logcontent         blob,
  appversion      nvarchar2(50),
  systemversion    nvarchar2(50),
  devicemodel      nvarchar2(100),   
  manufacturer     nvarchar2(100),  
  uploaddate     date
)';
  end if;
  end;
end;
/* GO */

-- 添加移动个人名片表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_personnalcard');
 if (isexist = 0) then
    execute immediate '
      create table mobile_personnalcard
             (
                 rowguid              nvarchar2(50) not null primary key,
  shorturl            nvarchar2(200),
  userguid           nvarchar2(200),
  showmobile           int,
  showouname            int,
  showmail                int,
  showtitle               int,
  showaddress            int,
  recordid               nvarchar2(200),
  empaddress             nvarchar2(200)
)';
  end if;
  end;
end;
/* GO */

-- 添加移动信息更新表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_update');
 if (isexist = 0) then
    execute immediate '
      create table mobile_update
             (
                 rowguid              nvarchar2(50) not null primary key,
  appguid           nvarchar2(50),
  platform           nvarchar2(50),
  versionname            nvarchar2(50),
  message                blob,
  enable           int,
  must             int,
  createdate       date,
  optdate          date,
  filename         nvarchar2(100),
  url              nvarchar2(500),
  plisturl          nvarchar2(500),
  packagename        nvarchar2(200),
  downloadnum       int
)';
  end if;
  end;
end;
/* GO */

-- 添加移动外部应用人员添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_user');
 if (isexist = 0) then
    execute immediate '
      create table mobile_user
             (
                userguid              nvarchar2(50) not null primary key,
  loginid           nvarchar2(50),
  displayname           nvarchar2(50),
  enable           int,
  appguid         nvarchar2(50),
  createdate          date
)';
  end if;
  end;
end;
/* GO */

-- 添加移动二维码生成表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('mobile_validatecode');
 if (isexist = 0) then
    execute immediate '
      create table mobile_validatecode
             (
                rowguid              nvarchar2(50) not null primary key,
   code               int,
  createDate         date,
  enable              int,
  userguid               nvarchar2(50),
   appguid           nvarchar2(50)
)';
  end if;
  end;
end;
/* GO */
-- end;


