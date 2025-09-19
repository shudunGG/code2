-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/07/24 【时间】
-- 企业微信组织架构同步，新增1个部门id对照表（frame_ou_weixin）--何晓瑜
begin
  declare isexist number;
  begin
  select count(1) into isexist from user_tab_columns where table_name = upper('frame_ou_weixin');
 if (isexist = 0) then
    execute immediate '
  create table  frame_ou_weixin (
  ouguid nvarchar2(50) NOT NULL,
  id integer NOT NULL,
  PRIMARY KEY (id)
  )';
  end if;
  end;
end;
/* GO */

-- end;


