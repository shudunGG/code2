-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
SELECT  COUNT(*)
FROM    sysindexes a JOIN sysindexkeys b ON a .id = b .id  AND a .indid = b.indid
        JOIN sysobjects c ON b .id = c .id
        JOIN syscolumns d ON b .id = d .id  AND b .colid = d .colid
WHERE   a .indid NOT IN (0,255)  and   c.xtype='U'   and   c.status>-1
AND c.name = 'Frame_UserRoleRelation' and d.name = 'ouguid'