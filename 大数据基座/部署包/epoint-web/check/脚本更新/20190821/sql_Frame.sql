-- 将table_visit_allowto中row_id自增（考虑到项目组升级上来，库中已有数据，重新创建一张表）
if  not exists (select * from syscolumns where id=object_id('table_visit_allowto') and name='row_id' and colstat=1)
create table table_visit_allowto1
   (
    row_id            int not null identity(1, 1) primary key,
    tableid           int,
    operatecode       nvarchar(50),
    allowto           nvarchar(50),
    allowtype         nvarchar(50),
    templateid        int,
    templateid_sub    int,
    queryid           int
    );
GO
if  exists (select * from dbo.sysobjects where id = object_id('table_visit_allowto1'))
 set identity_insert table_visit_allowto1 on;
 GO
 if  exists (select * from dbo.sysobjects where id = object_id('table_visit_allowto1'))
 insert into table_visit_allowto1(row_id, tableid, operatecode, allowto, allowtype, templateid, templateid_sub,queryid) select row_id, tableid, operatecode, allowto, allowtype, templateid, templateid_sub,queryid from table_visit_allowto;
GO
if  exists (select * from dbo.sysobjects where id = object_id('table_visit_allowto1'))
 drop table table_visit_allowto;
 GO
if exists (select * from dbo.sysobjects where id = object_id('table_visit_allowto1'))
 Exec sp_rename 'table_visit_allowto1', 'table_visit_allowto' 
 set identity_insert table_visit_allowto off;
 GO