-- 2018/4/19
-- 检测没有扩展信息的用户，新增扩展信息 --周志豪

declare  
i integer; 
j integer;
begin  
i := 1;  
select count(*) into j from frame_user u LEFT OUTER JOIN frame_user_extendinfo ue on u.USERGUID=ue.USERGUID where ue.userguid is NULL;
loop  
insert into frame_user_extendinfo(userguid) (select u.userguid from 
(
select rownum ,u.USERGUID from frame_user u LEFT OUTER JOIN frame_user_extendinfo ue on u.USERGUID=ue.USERGUID where ue.userguid is NULL 
) u
where rownum =1);
i := i + 1;  
exit when i >j;  
end loop;  
commit;  
end;  


