<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<%@page import="com.stimulsoft.webviewer.StiWebViewer"%>
<%@page import="java.io.*"%>
<%@page import="java.util.*"%>
<%@page import="com.epoint.basic.bizlogic.sysconf.datasource.domain.*"%>
<%@page import="com.epoint.core.dao.*"%>
<%@page import="com.epoint.core.utils.container.ContainerFactory"%>
<%@page import="com.epoint.database.jdbc.connection.DataSourceConfig"%>
<%@page
	import="com.epoint.frame.service.metadata.datasource.api.IDataSourceService"%>
<%@page
	import="com.epoint.frame.service.metadata.datasource.entity.DataSource"%>
<%@page import="com.epoint.report.service.api.IReportInfoService"%>
<%@page import="com.epoint.report.service.entity.*"%>
<%@page import="com.stimulsoft.report.StiCustomFunction"%>
<%@page import="com.stimulsoft.report.StiOptions"%>
<%@page import="com.stimulsoft.report.StiReport"%>
<%@page import="com.epoint.core.EpointFrameDsManager"%>
<%@page import="com.stimulsoft.report.StiSerializeManager"%>
<%@page import="com.stimulsoft.report.dictionary.databases.*"%>
<%@page import="com.stimulsoft.webviewer.StiWebViewerOptions"%>
<%@page import="com.epoint.frame.service.attach.api.IAttachService"%>
<%@page
	import="com.epoint.frame.service.attach.entity.FrameAttachStorage"%>
<%@page
	import="com.epoint.report.controller.util.EpointStimulsoftReportUtil"%>

<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://stimulsoft.com/webviewer" prefix="stiwebviewer"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Report</title>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body>
	<div id="main">
		<%
		    		String rowguid = request.getParameter("rowguid");

					StiReport report = null;

					try {
						// 开启事务
						EpointFrameDsManager.begin(null);
						EpointStimulsoftReportUtil epointsrutil = new EpointStimulsoftReportUtil();
						IReportInfoService reportInfoService = ContainerFactory.getContainInfo()
								.getComponent(IReportInfoService.class);
						ReportInfo info = reportInfoService.getReportInfoByRowguid(rowguid);

						// F9.3.3开始改造java设计稿入库
						if ("1".equals(info.getBelongxiaqucode())) {
							IAttachService attachService = ContainerFactory.getContainInfo().getComponent(IAttachService.class);
							List<FrameAttachStorage> reportAttachList = (List<FrameAttachStorage>) attachService
									.getAttachListByGuid(rowguid);
							if (reportAttachList == null || reportAttachList.size() == 0
									|| reportAttachList.get(0).getContent() == null) {
								new RuntimeException("报表没有对应报表文件，请在后台管理页面上传报表文件！");
							}
							FrameAttachStorage reportAttach = reportAttachList.get(0);
							report = StiSerializeManager.deserializeReport(reportAttach.getContent());
						} else {
							//拼接报表路径
							String filepath = EpointStimulsoftReportUtil.getFilePath(info.getYearflag());
							filepath += info.getReportpath();
							report = StiSerializeManager.deserializeReport(new File(filepath));
						}

						//数据连接替换，拼接connectionstring
						StiDatabaseCollection databaseCollection = report.getDictionary().getDatabases();
						if (databaseCollection != null && databaseCollection.size() > 0) {
							IDataSourceService dataSourceService = ContainerFactory.getContainInfo()
									.getComponent(IDataSourceService.class);
							DataSource source = dataSourceService.getDataSourceByID(info.getDsID());
							DataSourceConfig dataSourceConfig = epointsrutil.getDataSource(source);
							String connectionString = "url=" + dataSourceConfig.getUrl() + ";user="
									+ dataSourceConfig.getUsername() + ";password=" + dataSourceConfig.getPassword()
									+ ";driver=" + dataSourceConfig.getDriver() + ";";
							for (int i = 0; i < databaseCollection.size(); i++) {
								if (databaseCollection.get(i) instanceof StiJDBCDatabase) {
									StiJDBCDatabase database = (StiJDBCDatabase) databaseCollection.get(i);
									database.setConnectionString(connectionString);
								}
							}
						}

						// 设置变量
						Enumeration paramNames = request.getParameterNames();
						if (paramNames != null) {
							while (paramNames.hasMoreElements()) {
								String paramName = (String) paramNames.nextElement();
								String paramValue = request.getParameter(paramName);
								if (paramName != null && paramName != "" && paramValue != null) {
									//System.out.println(paramName + ":" + paramValue);
									report.getDictionary().getVariables().add(paramName, paramValue);
								}
							}
						}

						//设置通用函数  
						report.getCustomFunctions().addAll(epointsrutil.getAllCommonFunction());
						//个性化时设置
						//report.getCustomFunctions().add(new StiCustomFunction()
						//{
						//    public Object invoke(List<Object> args) {
						//        return ((String) args.get(0)).substring(Integer.parseInt(args.get(1).toString()),
						//                Integer.parseInt(args.get(2).toString()));
						//    }

						//    @SuppressWarnings({"rawtypes", "unchecked" })
						//    public List<Class> getParametersList() {
						//       return new ArrayList<Class>(Arrays.asList(String.class, Long.class, Long.class));
						//    }

						//    public String getFunctionName() {
						//        return "subStr";
						//    }
						//});
						report.Render(false);

						StiWebViewerOptions options = new StiWebViewerOptions();
						options.setLocalization(
								request.getRealPath("/frame/pages/stimulsoftreport/localization/zh-CHS.xml"));
						StiOptions.Export.Html.setUseStrictTableCellSize(true);
						com.stimulsoft.report.options.ExportOptions.Html.setUseStrictTableCellSize(true);
						options.setViewerID("WebViewer1");

						pageContext.setAttribute("report", report);

						pageContext.setAttribute("options", options);

						// 提交事务
						EpointFrameDsManager.commit();
					} catch (Exception e) {
						try {
							// 回滚事务
							EpointFrameDsManager.rollback();
						} catch (Exception ee) {
						}
						e.printStackTrace();
					} finally {
						// 关闭数据源
						EpointFrameDsManager.close();
					}
		%>


		<stiwebviewer:webviewer report="${report}" options="${options}" />

	</div>
</body>

<!-- add by chb 20170420,个性化处理增加，解决报表打印预览在chrome等浏览器下的跨域报错问题 -->
<script>
	StiMvcViewer.prototype.printAsPopup = function(url, data) {
		var win = window
				.open(
						"blank.html",
						"PrintReport",
						"height=900, width=790, toolbar=no, menubar=yes, scrollbars=yes, resizable=yes, location=no, directories=no, status=no");
		this.getWinReady(win, url, data);

	}
	StiMvcViewer.prototype.getWinReady = function(win, url, data) {
		if (win != null) {
			if (!win.ready) {
				var that = this;
				window.setTimeout(function() {
					that.getWinReady(win, url, data);
				}, 10);
			} else {
				this.postForm(url, data, win.document);
			}
		}
	}
</script>

</html>