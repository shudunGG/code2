-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2020/02/12
 
-- 添加表epointsformuniversal
 
-- 添加表epointsformuniversal
if not exists (select * from dbo.sysobjects where id = object_id('epointsformuniversal'))
create table epointsformuniversal
   (
    rowguid     nvarchar(50) not null primary key,
    encodename    nvarchar(50),
	businesstype     nvarchar(50),
	controltype      nvarchar(50),
	ordernumber     int,
	name            nvarchar(50),
	context          text,
	fieldtype       nvarchar(15),
	isenabled       nvarchar(10)
    );
GO


 