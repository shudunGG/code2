
-- 更改frame_userrole_snapshot_%表索引
DECLARE @tname nvarchar(100)
DECLARE @indexname VARCHAR(100)
DECLARE @createsql VARCHAR(200)
DECLARE @dropsql VARCHAR(200)

DECLARE cur CURSOR FOR
SELECT Name FROM SysObjects t Where XType='U' AND name LIKE 'frame_userrole_snapshot_%'
OPEN cur
fetch next from cur into @tname
while(@@FETCH_STATUS = 0)

BEGIN
SET @indexname = 'uq_frame_ur_snapshot_' + SUBSTRING(@tname, 25,40);

SELECT @dropsql='DROP INDEX '+@indexname+' on '+@tname;
EXEC (@dropsql)

SELECT @createsql='CREATE UNIQUE INDEX '+ @indexname +' ON ' +@tname + ' (UserGuid ASC,
	rowguid ASC,
	appkey ASC,
  clientip ASC,
  ouguid ASC) WITH (IGNORE_DUP_KEY = ON)' ;
EXEC (@createsql)
fetch next from cur into @tname
END
-- 关闭游标
CLOSE cur;
deallocate cur;

-- 删除索引
DROP INDEX Frame_UserRoleRelation.uq_frame_userrolerelation;
GO
-- 增加索引
CREATE UNIQUE INDEX uq_frame_userrolerelation ON Frame_UserRoleRelation (
	[UserGuid] ASC,
	[rowguid] ASC,
	[ouguid] ASC
) WITH (IGNORE_DUP_KEY = ON)
