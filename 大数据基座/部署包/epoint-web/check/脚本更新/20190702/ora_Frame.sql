-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/07/02

-- 添加更新提醒信息表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('comm_message_remind_info');
 if (isexist = 0) then
    execute immediate'
      create table comm_message_remind_info(
             infoguid   nvarchar2(100) not null primary key,
             infotitle   nvarchar2(500),
             remindtime  date,
             targetuserguid nvarchar2(2000),
             targetusername nvarchar2(2000),
             infocontent   nclob,
             createtime   date,
             createusername   nvarchar2(50),
             createuserguid   nvarchar2(100),            
             ordernum    integer
              )';
  end if;
  end;
end;
/* GO */


-- end;


