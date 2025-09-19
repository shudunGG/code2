-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2018/11/06
-- 之前勿删的table_visit_allowto，现在再加回来 --徐剑

-- 添加表
if not exists (select * from dbo.sysobjects where id = object_id('table_visit_allowto'))
create table table_visit_allowto
   (
    row_id                int not null primary key,
    tableid               int,
    operatecode           varchar(50),
    allowto               varchar(50),
    allowtype             varchar(50),
    templateid            int,
    templateid_sub        int,
    queryid               int
    );
GO
