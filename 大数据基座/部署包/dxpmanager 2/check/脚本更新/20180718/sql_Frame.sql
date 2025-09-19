-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/07/18
-- 修改索引为唯一索引--王颜
if not exists(SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('frame_user_secondou') AND name = 'uq_frame_user_secondou')
begin
create Unique index uq_frame_user_secondou on frame_user_secondou(userguid, ouguid);
end
else
begin
 if not exists(SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('frame_user_secondou') AND name = 'uq_frame_user_secondou' and is_unique='1')
    begin
    DROP INDEX frame_user_secondou.uq_frame_user_secondou;
    create Unique index uq_frame_user_secondou on frame_user_secondou(userguid, ouguid);
    end 
 end
 GO

if not exists(SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Frame_UserRoleRelation') AND name = 'uq_frame_userrolerelation')
begin
create Unique index uq_frame_userrolerelation on frame_userrolerelation(USERGUID, ROLEGUID);
end
else
begin
 if not exists(SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Frame_UserRoleRelation') AND name = 'uq_frame_userrolerelation' and is_unique='1')
    begin
    DROP INDEX Frame_UserRoleRelation.uq_frame_userrolerelation;
    create Unique index uq_frame_userrolerelation on frame_userrolerelation(USERGUID, ROLEGUID);
    end 
 end
 GO
