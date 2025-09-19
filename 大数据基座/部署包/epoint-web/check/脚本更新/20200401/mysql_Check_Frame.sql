-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
SELECT	COUNT(*) FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE () AND ROUTINE_TYPE = 'PROCEDURE' AND  SPECIFIC_NAME='CreatePVI'
