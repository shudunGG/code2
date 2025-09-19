-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER ; 注释去除即可 --
-- DELIMITER GO --

drop procedure if exists`epoint_proc_alter`;
GO
create   procedure `epoint_proc_alter`()
begin
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='desensitization_rule_category')<1
     then
            CREATE TABLE `desensitization_rule_category` (
              `Categoryguid` varchar(50) NOT NULL,
              `Categoryname` varchar(50) DEFAULT NULL,
              `Ordernum` int(11) DEFAULT NULL,
              PRIMARY KEY (`Categoryguid`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

            INSERT INTO desensitization_rule_category(`Categoryguid`, `Categoryname`, `Ordernum`)VALUES('2a5564e3-ba7d-4172-a0ff-223489ef31a2', '泛化技术', 0);
            INSERT INTO desensitization_rule_category(`Categoryguid`, `Categoryname`, `Ordernum`)VALUES('88ff219c-00da-46e1-8ed7-455a30778bf7', '抑制技术', 0);
            INSERT INTO desensitization_rule_category(`Categoryguid`, `Categoryname`, `Ordernum`)VALUES('990ffaca-ca3d-479f-92ae-89fa5afd8d51', '扰乱技术', 0);
     end if;
     if  (select count(1) from information_schema.tables where TABLE_SCHEMA=DATABASE() and table_name='desensitization_rule')<1
     then
            CREATE TABLE `desensitization_rule` (
              `Categoryguid` varchar(50) DEFAULT NULL,
              `Regularname` varchar(50) DEFAULT NULL,
              `Reversible` bit(1) DEFAULT NULL,
              `Enable` bit(1) DEFAULT NULL,
              `Applicabletype` varchar(500) DEFAULT NULL,
              `Description` varchar(1000) DEFAULT NULL,
              `paramDescription` varchar(1000) DEFAULT NULL,
              `methodguid` varchar(50) DEFAULT NULL,
              `methodclass` varchar(500) DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

            INSERT INTO desensitization_rule(`Categoryguid`, `Regularname`, `Reversible`, `Enable`, `Applicabletype`, `Description`, `paramDescription`, methodguid, methodclass)VALUES('990ffaca-ca3d-479f-92ae-89fa5afd8d51', '加密', 1, 1, '文本类型(ntext),字符串(nvarchar)', '使用Base64对数据进行加密', '不需要参数', '2d55427d-67bf-11e8-90fb-005056900951', 'com.epoint.portraitsys.impl.desensitizationrule.DesensitizationRuleEncrypt');
            INSERT INTO desensitization_rule(`Categoryguid`, `Regularname`, `Reversible`, `Enable`, `Applicabletype`, `Description`, `paramDescription`, methodguid, methodclass)VALUES('88ff219c-00da-46e1-8ed7-455a30778bf7', '掩码', 0, 1, '文本类型(ntext),字符串(nvarchar)', '用通用的字符串替换原始数据总的部分信息，例如：将手机号码 18800010001经过掩码后得到188****0001，掩码后的数据长度保持不变', '参数必填，格式为：开始截取的位置（从0开始）;截取的长度;用于替换的字符串截取长度为空时，从开始位置替换所有字符；用于替换的字符串为空时，默认使用（*）；例如：3;8;*表示从第4位替换长度为8的字符串值为*；', '2d554d63-67bf-11e8-90fb-005056900951', 'com.epoint.portraitsys.impl.desensitizationrule.DesensitizationRuleMaskCode');
            INSERT INTO desensitization_rule(`Categoryguid`, `Regularname`, `Reversible`, `Enable`, `Applicabletype`, `Description`, `paramDescription`, methodguid, methodclass)VALUES('2a5564e3-ba7d-4172-a0ff-223489ef31a2', '数据截断', 1, 1, '数字类型(Numeric),整数类型(Integer),文本类型(ntext),字符串(nvarchar)', '直接舍弃业务不需要的信息，仅仅保留部分关键信息，例如：将手机号码 18800010001，截断为188；', '参数必填，格式为：开始截取的位置（从0开始）;截取的长度；截取长度为空时，从开始位置截取调所有字符；例如：3;8表示从第三位截断长度为8的字符串；', '2d56cd5b-67bf-11e8-90fb-005056900951', 'com.epoint.portraitsys.impl.desensitizationrule.DesensitizationRuleCensoredData');
            INSERT INTO desensitization_rule(`Categoryguid`, `Regularname`, `Reversible`, `Enable`, `Applicabletype`, `Description`, `paramDescription`, methodguid, methodclass)VALUES('2a5564e3-ba7d-4172-a0ff-223489ef31a2', '日期偏移取整', 0, 1, '日期类型(DateTime)', '按照一定的粒度对时间进行向上或向下偏移取整，可在保证时间数据一定分布特征的情况下隐藏原始时间，例如：将时间 20170328 01:01:09 按照 5 秒钟的粒度向下取整得到：20170328 01:01:05。', '参数必填，格式为：偏移的粒度，单位：秒。例如：3600 表示偏移1小时；', '2d56d2fa-67bf-11e8-90fb-005056900951', 'com.epoint.portraitsys.impl.desensitizationrule.DesensitizationRuleOffsetDate');
            INSERT INTO desensitization_rule(`Categoryguid`, `Regularname`, `Reversible`, `Enable`, `Applicabletype`, `Description`, `paramDescription`, methodguid, methodclass)VALUES('990ffaca-ca3d-479f-92ae-89fa5afd8d51', '替换', 1, 1, '数字类型(Numeric),整数类型(Integer),文本类型(ntext),字符串(nvarchar)', '按照特定规则对原始数据进行替换', '参数格式：源字符串+“分号”+用于替换的字符串，如将女性性别统一替换为“F”，女;F。', '2d56d7bd-67bf-11e8-90fb-005056900951', 'com.epoint.portraitsys.impl.desensitizationrule.DesensitizationRuleInterchange');
            INSERT INTO desensitization_rule(`Categoryguid`, `Regularname`, `Reversible`, `Enable`, `Applicabletype`, `Description`, `paramDescription`, methodguid, methodclass)VALUES('990ffaca-ca3d-479f-92ae-89fa5afd8d51', '重排', 1, 1, '数字类型(Numeric),整数类型(Integer),文本类型(ntext),字符串(nvarchar)', '将字符串或者数字倒序排列', '不需要参数', '2d56dc0f-67bf-11e8-90fb-005056900951', 'com.epoint.portraitsys.impl.desensitizationrule.DesensitizationRuleReset');
     end if;
     if  (select count(1) from frame_module where MODULEGUID='88ff219c-00da-46e1-8ed7-455a30778bf6')<1
     then
         INSERT INTO frame_module (`MODULEGUID`,`MODULECODE`,`MODULENAME`,`MOUDLEMENUNAME`,`MODULEURL`,`ORDERNUMBER`,`ISDISABLE`,`ISBLANK`,`BIGICONADDRESS`,`SMALLICONADDRESS`,`MODULETYPE`,`ISADDOU`,`ROW_ID`,isfromsoa,`IsUse`,`IsReserved`) VALUES
         ('88ff219c-00da-46e1-8ed7-455a30778bf6','778700040008','脱敏方法管理','','frame/pages/portraitsys/desensitizationrule/desensitizationrulelist',0,0,0,'','','public',0,NULL,NULL,NULL,0);
     end if;
     if(select count(1) from information_schema.`COLUMNS`where TABLE_SCHEMA=DATABASE() and TABLE_NAME='portrait_tags' and column_name='densensitizationrule')<1
     then
        alter table portrait_tags add COLUMN densensitizationrule varchar(50);
     end if;
     if(select count(1) from information_schema.`COLUMNS`where TABLE_SCHEMA=DATABASE() and TABLE_NAME='portrait_tags' and column_name='densensitizationparam')<1
     then
        alter table portrait_tags add COLUMN densensitizationparam varchar(500);
    end if;
end;
GO
call epoint_proc_alter();
GO
drop procedure if exists `epoint_proc_alter`;
GO





-- DELIMITER ; --





