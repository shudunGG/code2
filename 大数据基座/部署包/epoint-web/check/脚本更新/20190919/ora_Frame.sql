-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2019/09/19 【时间】
-- 添加表frame_user_dingtalk、frame_ou_dingtalk --【何晓瑜】

-- frame_ou_dingtalk
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_dingtalk');
 if (isexist = 0) then
    execute immediate '
      create table frame_ou_dingtalk
             (
               ouguid  nvarchar2(50) not null primary key,
               dingtalkouid  NUMBER(20,0)
              )';
  end if;
  end;
end;
/* GO */

-- frame_user_dingtalk
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_user_dingtalk');
 if (isexist = 0) then
    execute immediate '
      create table frame_user_dingtalk
             (
               dingtalkunionid  nvarchar2(50) not null primary key,
               userguid  nvarchar2(50),
               dingtalkuserid  nvarchar2(50)
              )';
  end if;
  end;
end;
/* GO */

-- end;


