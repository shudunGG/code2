-- 所有脚本可直接复制到sql server查询设计器中执行
-- 2020/01/08
-- 用户信息增加入编时间字段 --王颜
if not exists (select * from  information_schema.columns where  table_name = 'frame_user' and column_name = 'hiredate' ) 
alter table frame_user add hiredate datetime; 
GO
