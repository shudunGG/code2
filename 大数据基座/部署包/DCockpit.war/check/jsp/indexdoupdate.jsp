<%@page import="org.springframework.web.bind.annotation.RequestParam"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"
	pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*,java.security.MessageDigest"%>
<%@ page import="java.util.jar.JarFile"%>
<%@ page import="java.util.jar.Manifest"%>
<%@ page import="java.util.jar.Attributes"%>
<%@ page import="java.util.regex.Pattern"%>
<%@ page import="java.util.regex.Matcher"%>
<%@ page import="com.epoint.core.utils.file.FileManagerUtil"%>
<%@ page import="com.epoint.core.dao.CommonDao"%>
<%@ page import="org.apache.tools.ant.Project"%>
<%@ page import="org.apache.tools.ant.taskdefs.SQLExec"%>
<%@ page import="com.epoint.core.utils.string.StringUtil"%>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>

<!DOCTYPE html>

<%!List<Map<String, String>> datelist = new ArrayList<Map<String, String>>();
	//当前用户是否时管理员
	Boolean isAdmin = true;
	String chenkIsAdmin = ConfigUtil.getConfigValue("checkIsAdmin");
	CommonDao dao = null;
	boolean isOracle = false;
	String delimiterStr = "";

	private String initPara(String indexContent, String method) {
		String msg = "";
		if (method.toLowerCase().equals("post") && StringUtil.isNotBlank(indexContent)) {
			try {
				executeSqlFile(indexContent);
			} catch (Exception e) {
				msg += "出错,错误信息：<br/>" + e.toString();
			}
			msg = msg.replace("\r\n", "<br />");
		}
		if (msg == "")
			msg = "OK";
		return msg;
	}

	public void executeSqlFile(String indexContent) {
		if (("1".equals(chenkIsAdmin) && isAdmin) || !"1".equals(chenkIsAdmin)) {
			//SQLExec sqlExec = new SQLExec();
			// 设置数据库参数
			//sqlExec.setDriver(dao.getDataSource().getDriver());
			//sqlExec.setUrl(dao.getDataSource().getUrl());
			//sqlExec.setUserid(dao.getDataSource().getUsername());
			//sqlExec.setPassword(dao.getDataSource().getPassword());

			//要执行的脚本  
			String [] sqlContentArray=indexContent.split(";");
			for(String cSql:sqlContentArray){
			    if(StringUtil.isNotBlank(cSql)){
			        dao.execute(cSql);
			    }
			}
			//有出错的语句该如何处理   
			//sqlExec.setOnerror((SQLExec.OnError) (EnumeratedAttribute.getInstance(SQLExec.OnError.class, "abort")));
			//sqlExec.setDelimiter(delimiterStr);
			//sqlExec.setDescription("null");
			//sqlExec.setEncoding("GB2312"); //
			//sqlExec.setPrint(false);
			//sqlExec.setProject(new Project());
			//sqlExec.execute();
		}
	}%>
<%
	try {
	    dao=CommonDao.getInstance();
	    isOracle=dao.isOracle();
	    delimiterStr=isOracle ? "/* GO */" : "GO";
		isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
		if (request.getParameter("indexContent") != null && request.getParameter("indexContent") != "") {
			String error = initPara(request.getParameter("indexContent"), request.getMethod());
		if ("1".equals(chenkIsAdmin) && !isAdmin) {
			error = "抱歉，您不是管理员，无权限访问此页。";
		}
			response.getWriter().write(error);
		}
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
	    if(dao!=null){
	        dao.close();
	    }
	}
%>
<html>
<head>
<title>执行脚本=</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<link href="../css/bootstrap.min.css" rel="stylesheet" />
<link href="../css/style.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../js/jquery.min.js"></script>
<script src="../js/common.js" type="text/javascript" charset="utf8"></script>

</head>
<body>

	<div class="container">
		<form method="post" id="sqlForm" action="">
		</form>
	</div>
	<script type="text/javascript">
	//var showDiv;

</script>

</body>
</html>
