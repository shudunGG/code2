<%--
  Created by IntelliJ IDEA.
  User: wangleai
  Date: 2017/11/16
  Time: 10:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8"%>
<%@ page import="java.util.Date" %>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%>
<%@ include file="jsp/common.jsp" %>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>
<%!String strOS = System.getProperty("os.name");
	//当前用户是否时管理员
	Boolean isAdmin = true;
	
	private String getIp() {
		String strTmp = "";
		try {
			strTmp = InetAddress.getLocalHost().getHostAddress();
			return strTmp;
		} catch (Exception e) {
			return strTmp;
		}
	}%>
<html>
<head>
    <title>系统检测</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf8" />
    <link href="css/bootstrap.min.css" rel="stylesheet" />
    <link href="css/style.css" type="text/css" rel="stylesheet"/>
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script src="js/common.js" type="text/javascript" charset="utf8"></script>
</head>
<body>
	<%
		if ("1".equals(ConfigUtil.getConfigValue("checkIsAdmin"))) {
			isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
		}
		String version = getFrameVersion();
	%>
	<input type="hidden" name="isAdmin" id="isAdmin" value="<%=isAdmin%>"/>
<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <span class="brand">Check</span>
            <div class="nav-collapse">
                <ul class="nav">
                    <li><a href="index.jsp">基本信息</a></li>
                    <li><a href="jsp/jarlist.jsp">jar包列表</a></li>
                    <li><a href="jsp/jarduplicatelist.jsp">jar包冲突检测</a></li>
                    <li><a href="jsp/filterlist.jsp">过滤器链配置检测</a></li>
                    <li><a href="jsp/sqllist.jsp">脚本检测</a></li>
                    <li><a href="jsp/soafilter.jsp">soa检测</a></li>
                    <li><a href="jsp/indexdetection.jsp">索引检测</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
<div class="container">
    <h3>
        基本信息
    </h3>
    <table style="background-color: #fff" class="showtable table table-bordered responsive-utilities">
        <tr>
            <td class="td_lable">插件基本信息</td>
            <td width="85%">V0.1</td>
        </tr>
        <tr>
            <td class="td_lable">框架版本信息</td>
            <td width="85%"><%= version %></td>
        </tr>
    </table>
    <br>
    <h3>
        服务器基本信息
    </h3>
    <table id="dataTable1" style="background-color: #fff" class="showtable table table-bordered responsive-utilities">
        <tr>
            <td class="td_lable">服务器名称</td>
            <td width="85%"><%= request.getServerName() %></td>
        </tr>
        <tr>
            <td class="td_lable">域名/IP</td>
            <td width="85%"><%= request.getServerName() %>/<%= getIp() %></td>
        </tr>
        <tr>
            <td class="td_lable">服务器端口</td>
            <td width="85%"><%= request.getServerPort() %></td>
        </tr>
        <tr>
            <td class="td_lable">客户端端口</td>
            <td width="85%"><%= request.getRemotePort() %></td>
        </tr>
        <tr>
            <td class="td_lable">客户端IP</td>
            <td width="85%"><%= request.getRemoteAddr() %></td>
        </tr>
        <tr>
            <td class="td_lable">Web 服务器</td>
            <td width="85%"><%= application.getServerInfo() %></td>
        </tr>
        <tr>
            <td class="td_lable">操作系统</td>
            <td width="85%"><%= strOS+" "+System.getProperty("sun.os.patch.level")+" Ver:"+System.getProperty("os.version") %></td>
        </tr>
        <tr>
            <td class="td_lable">服务器时间</td>
            <td width="85%"><%= new Date().toLocaleString() %></td>
        </tr>
        <tr>
            <td class="td_lable">用户账户名称</td>
            <td width="85%"><%= System.getProperty("user.name") %></td>
        </tr>
        <tr>
            <td class="td_lable">用户当前工作目录</td>
            <td width="85%"><%= System.getProperty("user.dir") %></td>
        </tr>
        <tr>
            <td class="td_lable">根目录</td>
            <td width="85%"><%= request.getSession().getServletContext().getRealPath("/") %></td>
        </tr>
    </table>
    <br>
    <h3>
        Java相关信息
    </h3>
    <table id="dataTable2" style="background-color: #fff" class="showtable table table-bordered responsive-utilities">
        <tr>
            <td class="td_lable">JDK 版本</td>
            <td width="85%"><%= System.getProperty("java.version") %></td>
        </tr>
        <tr>
            <td class="td_lable">Servlet 版本</td>
            <td width="85%"><%= application.getMajorVersion()+"."+application.getMinorVersion() %></td>
        </tr>
        <tr>
            <td class="td_lable">JDK 安装路径</td>
            <td width="85%"><%= System.getProperty("java.home") %></td>
        </tr>
        <tr>
            <td class="td_lable">Java类路径</td>
            <td width="85%"><%= System.getProperty("java.class.path")%></td>
        </tr>
        <tr>
            <td class="td_lable">Java 虚拟机实现版本</td>
            <td width="85%"><%= System.getProperty("java.vm.version")%></td>
        </tr>
        <tr>
            <td class="td_lable">Java 虚拟机实现名称</td>
            <td width="85%"><%= System.getProperty("java.vm.name")%></td>
        </tr>
    </table>
</div>

<script type="text/javascript">

	if ("false" == $('#isAdmin').val().trim()) {
		alert("抱歉，您不是管理员，无权限访问此页。");
		CloseWebPage();
	}
	$(document).ready(function() {
		$(".navbar .nav li").eq(0).addClass("active");
		epoint.common.buildFooter();
	});

	//关闭页面
	function CloseWebPage() {
		if (navigator.userAgent.indexOf("MSIE") > 0) {
			if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
				window.opener = null;
				window.close();
			} else {
				window.open('', '_top');
				window.top.close();
			}
		} else if (navigator.userAgent.indexOf("Firefox") > 0) {
			window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的    
			//window.history.go(-2);     
		} else {
			window.location.href = "about:blank";
			window.close();
		}
	}
</script>
</body>
</html>
