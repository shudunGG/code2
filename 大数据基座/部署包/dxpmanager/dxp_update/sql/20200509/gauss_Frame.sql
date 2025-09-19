--此脚本为样例
-- 如需手工在navicat中执行，把语句拷贝到查询设计器，然后将下一行DELIMITER GO和最后一行的DELIMITER  注释去除即可 --
-- DELIMITER GO --

--添加组件表
CREATE TABLE epoint_job_manager_config  (
  rowguid varchar(50)   PRIMARY KEY ,
  configname varchar(100) ,
  configvalue varchar(512) 
)

GO
-- ----------------------------
-- Records of frame_module frame_moduleright
-- ----------------------------
INSERT INTO frame_module VALUES ('48a431db-500f-473f-8702-f7a98cd728c3', '999901060009', '统一调度', '', '', 0, 0, 0, '', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

INSERT INTO frame_module  VALUES ('93be906a-705c-4f7c-8a83-4f069e758ed9', '9999010600090001', '参数配置', '', '/frame/pages/epointjob/epointjobmanagerconfig', 0, 0, 0, '', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

INSERT INTO frame_module  VALUES ('9bae6d83-f14b-4dfd-bdd2-6f2817c67256', '9999010600090002', '执行器', '', '/frame/pages/epointjob/epointjobexecutorlist', 0, 0, 0, '', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

INSERT INTO frame_module  VALUES ('a910b9d8-0c54-4c9c-956e-ce702a8ae170', '9999010600090003', '常规任务', '', '/frame/pages/epointjob/epointjoblist', 0, 0, 0, '', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

INSERT INTO frame_module  VALUES ('cc413d15-0e51-4833-b050-1d0a643a65de', '9999010600090004', 'DAG流程', '', '/frame/pages/epointjob/epointjobdaglist', 0, 0, 0, '', NULL, 'public', 0, NULL, NULL, NULL, 0)

GO

delete from frame_module where moduleguid='ec40579c-ce4c-438b-af1a-3eb5d5f9dc49'

GO

delete from frame_module where moduleguid='2c24bf52-51cd-4ff5-b2a9-357fc3288cba'

GO
-- DELIMITER  --