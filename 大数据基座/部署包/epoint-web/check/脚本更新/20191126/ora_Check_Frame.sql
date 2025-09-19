-- 这里是检测每天最后一条数据是否存在，所以第一个人建立的人请把最下方的数据做一个check
SELECT count(*) FROM  USER_PROCEDURES where OBJECT_NAME=upper('FUN_GETPY') and OBJECT_TYPE=upper('function')