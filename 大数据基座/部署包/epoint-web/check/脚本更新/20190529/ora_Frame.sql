-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2019/5/29 
-- 添加frame_lessee表 --王颜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_lessee');
 if (isexist = 0) then
    execute immediate '
      create table frame_lessee
             (
              RowGuid   nvarchar2(100) not null primary key,
              lesseename    nvarchar2(100),
              lesseesysname   nvarchar2(100),
              ouGuid  nvarchar2(100),
              ordernumber INTEGER
              )';
  end if;
  end;
end;
/* GO */

-- end;


