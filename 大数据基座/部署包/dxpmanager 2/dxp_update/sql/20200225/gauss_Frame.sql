--此脚本为样例
-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
--BEGIN 

-- 2020/01/10【时间】
-- 新增test1数据 --【XXX】


-- 新增test1数据
--  begin
--   declare isexist number;
--   begin
--   select count(1) into isexist from test1 where rowguid = '3';
--   if (isexist = 0) then
--      execute immediate 'insert into test1(rowguid,column1,column2) values(3, 1, 1)';
--   end if;
--   end;
-- end;


--end;


