-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 
-- 2020/5/22
-- 修改frame_userrolerelation索引加上ouguid --hexy
declare s_sql clob:=''; -- 声明一个变量，该变量用于存储查询的sql语句
BEGIN
    EXECUTE IMMEDIATE 'drop index uq_frame_userrolerelation';
    EXECUTE IMMEDIATE 'CREATE INDEX UQ_FRAME_USERROLERELATION ON frame_userrolerelation (userguid,roleguid,ouguid)';
    
    for t in (select table_name from USER_TABLES where table_name like 'FRAME_USERROLE_SNAPSHOT_%') loop
     s_sql:= CONCAT('uq_frame_ur_snapshot_' ,substr(t.table_name,25));
   -- dbms_output.put_line(s_sql); 
    EXECUTE IMMEDIATE 'drop index '||s_sql||'';
    EXECUTE IMMEDIATE 'CREATE INDEX '||s_sql||' ON '||t.table_name||' ( USERGUID,ROLEGUID,APPKEY,CLIENTIP,ouguid)';
    end loop;
    
END;
/* GO */

-- end;


