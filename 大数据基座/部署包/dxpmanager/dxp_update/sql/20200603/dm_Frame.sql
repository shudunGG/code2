--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER  注释去除即可 --
-- DELIMITER GO --

INSERT INTO dxp_subassembly (rowguid, pluginname, steptype, classpath, iconsmall, icon, url, introduce, banwrong, groupguid, ordernum) VALUES ('120f9c44-9ccb-4940-a251-8163a88af6dd', 'excel输出', 'ExcelOutput', 'com.epoint.dxp.development.trans.steps.ExcelOutputStep', 'images/add-icon/excel-output.png', 'images/icon/excel-output.png', './transassembly/exceloutput.html', 'excel输出', '0', '2c700a9c-18c1-4674-a67f-b884d8ce499f', '100')

GO
-- DELIMITER  --