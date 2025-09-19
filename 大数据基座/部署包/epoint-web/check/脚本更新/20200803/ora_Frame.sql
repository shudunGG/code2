-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2020/8/3
-- 新增日志数据库表frame_logconfig,frame_log表新增appkey字段  -- 陈星怡

-- 新增日志数据库表frame_logconfig
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_logconfig');
 if (isexist = 0) then
    execute immediate '
      create table frame_logconfig
             (
			   sysguid                       nvarchar2(100) primary key not null,
               attach_connectionstringname   nvarchar2(100),
			   attach_connectionstring       text,
			   isnowuse                      int,
			   ordernum                      int,
			   databasetype                  nvarchar2(100)
              )';
  end if;
  end;
end;
/* GO */


-- frame_log表新增appkey字段
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_log') and column_name = upper('appkey');
  if (isexist = 0) then
    execute immediate 'alter table frame_log add appkey  nvarchar2(100)';
  end if;
  end;
end;
/* GO */

-- end;


