-- 所有脚本可直接复制到sql server查询设计器中执行

-- 2019/04/26
-- 将表Table_BasicInfo中的tableid由自增长列改为非自增长列 --陈佳
DECLARE @check varchar(20)
select @check= name from dbo.sysobjects where id = object_id(N'[dbo].[Drop_PK]') and OBJECTPROPERTY(id, N'IsProcedure') = 1
IF @check is not  null
DROP PROCEDURE [dbo].[Drop_PK]
GO


create  Procedure Drop_PK
(
    @table varchar(100)
)

AS 

Begin

DECLARE @sql varchar(200)
DECLARE @pk_name varchar(200)
DECLARE @column_name varchar(200)
DECLARE @IsIdentity int

-- 查看主键名称
select @pk_name = a.CONSTRAINT_NAME,@column_name=b.COLUMN_NAME
from information_schema.table_constraints a
inner join information_schema.constraint_column_usage b
on a.constraint_name = b.constraint_name
where a.constraint_type = 'PRIMARY KEY' and a.table_name = @table

-- 查看主键是否自增
SELECT  @IsIdentity = COLUMNPROPERTY( OBJECT_ID(@table),@column_name,'IsIdentity')


	IF @pk_name IS NOT NULL and @IsIdentity = 1
	BEGIN
		--拼接SQL
		set @sql = 'alter table '+ @table +' DROP CONSTRAINT ' +@pk_name+'; '
		exec(@sql)
		
		set @sql =  'alter table ' + @table + ' add id_clone int ; '
		exec(@sql)
		
		set @sql = 'update ' + @table + ' set id_clone = ' + @column_name + '; '
		exec(@sql)
		
		set @sql =  'alter table ' + @table + ' drop column ' + @column_name+'; '
		exec(@sql)
		
		set @sql =  'exec sp_rename "' + @table + '.id_clone","' + @column_name + '","column"'
		exec(@sql)
	
	END

END
GO
execute  Drop_PK  table_basicinfo
GO


