-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/4/19
-- 检测没有扩展信息的用户，新增扩展信息 --周志豪
create procedure test_insert
as
declare @i int
declare @j int
set @i =1
set @j =(select count(*) from frame_user u LEFT OUTER JOIN frame_user_extendinfo ue on u.USERGUID=ue.USERGUID where ue.userguid is NULL)
while(@i<=@j)
begin
insert into frame_user_extendinfo(userguid) (select u.userguid from 
(
select row_number()over(order by u.userguid)as row ,u.USERGUID from frame_user u LEFT OUTER JOIN frame_user_extendinfo ue on u.USERGUID=ue.USERGUID where ue.userguid is NULL 
) u
where row =1);
set @i=@i+1
end
GO
exec test_insert  
drop procedure test_insert