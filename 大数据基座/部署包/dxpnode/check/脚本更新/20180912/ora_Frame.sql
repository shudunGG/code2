-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/09/12
-- 二维码登录数据表

-- 添加表
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_qrcode');
 if (isexist = 0) then
    execute immediate '
      create table frame_qrcode
             (
               rowguid     nvarchar2(50) not null primary key,
               code            nvarchar2(50),
 			   token           nvarchar2(50),
 			   status          Integer,
			   scantime        date
              )';
  end if;
  end;
end;
/* GO */


-- end;


