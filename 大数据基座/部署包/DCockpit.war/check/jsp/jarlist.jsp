<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*,java.security.MessageDigest" %>
<%@ page import="java.util.jar.JarFile" %>
<%@ page import="java.util.jar.Manifest" %>
<%@ page import="java.util.jar.Attributes" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="com.epoint.core.utils.system.SystemHelper" %>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>
<%!private static final Pattern VERSION_PATTERN = Pattern.compile("(-[0-9][0-9a-zA-Z_\\.\\-]*)\\.jar");
	//当前用户是否时管理员
	Boolean isAdmin = true;
	List<Map<String, String>> jarlist = new ArrayList<Map<String, String>>();

	//得到lib目录下所有jar包
	private List<Map<String, String>> getAllJarName(File libfile) {
		try {
			File[] files = libfile.listFiles();
			for (File f : files) {
				if (f.isDirectory()) {

				}
				if (f.isFile() && f.getName().endsWith(".jar")) {
					Map<String, String> jar = new HashMap<String, String>();
					jar.put("jarname", f.getName());
					jar.put("jarsha256", getFileSHA256(f));
					jar.put("jarversion", getVersionByJar(f.getPath()));
					jarlist.add(jar);
				}
			}
		} catch (Exception e) {
			//防止地址错误
		}
		return jarlist;
	}

	//计算文件sha256码
	private String getFileSHA256(File file) {
		String result = "";
		FileInputStream in = null;
		if (file.isFile()) {
			byte buffer[] = new byte[1024];
			int len;
			try {
				in = new FileInputStream(file);
				MessageDigest digest = MessageDigest.getInstance("SHA-256");
				while ((len = in.read(buffer, 0, 1024)) != -1) {
					digest.update(buffer, 0, len);
				}
				result = convertToHexString(digest.digest());
				in.close();
			} catch (Exception e) {
				//我拦
			}
		}
		return result;
	}

	//byte转string
	private String convertToHexString(byte data[]) {
		StringBuffer strBuffer = new StringBuffer();
		for (int i = 0; i < data.length; i++) {
			strBuffer.append(Integer.toHexString(0xff & data[i]));
		}
		return strBuffer.toString();
	}

	//得到jar版本
	private String getVersionByJar(String jarpath) {
		String version = "";
		JarFile jarFile = null;
		try {
			jarFile = new JarFile(jarpath);
			Manifest manifest = jarFile.getManifest();
			if (manifest != null) {
				Attributes att = manifest.getMainAttributes();
				version = att.getValue("Implementation-Version");
				if (version == null || version.length() == 0) {
					version = att.getValue("Specification-Version");
				}
			}
			if (version == null || version.length() == 0) {
				Matcher matcher = VERSION_PATTERN.matcher(jarpath);
				while (matcher.find() && matcher.groupCount() > 0) {
					version = matcher.group(0);
					version = version.substring(1, version.length() - 4);//去掉-前缀.jar后缀
				}
			}
		} catch (IOException e1) {
			//我防
		}
		return version;
	}

	private void initPara() {
		//钻石符两边必须写全类型
		jarlist = new ArrayList<Map<String, String>>();
	}%>
<html>
<head>
    <title>系统检测</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf8" />
    <link href="../css/bootstrap.min.css" rel="stylesheet" />
    <link href="../css/style.css" type="text/css" rel="stylesheet"/>
    <script type="text/javascript" src="../js/jquery.min.js"></script>
    <script src="../js/common.js" type="text/javascript" charset="utf8"></script>
</head>
<body>
<%
	if ("1".equals(ConfigUtil.getConfigValue("checkIsAdmin"))) {
		isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
	}
	initPara();
	String useros = SystemHelper.getSystemOSName();
	if (useros.toLowerCase().contains("win")) {
		getAllJarName(new File(request.getSession().getServletContext().getRealPath("/") + "WEB-INF\\lib"));
	} else {
		getAllJarName(new File(request.getSession().getServletContext().getRealPath("/") + "WEB-INF/lib"));
	}
%>
<div class="container">
    <h3>
        jar包列表 总数：<%= jarlist.size()%>
    </h3>
    <table style="background-color: #fff" class="showtable table table-bordered responsive-utilities">
        <tr>
            <td style="width: 30%;font-weight: bold" >名称</td>
            <td style="width: 50%;font-weight: bold" >sha256</td>
            <td style="width: 20%;font-weight: bold" >版本</td>
        </tr>
        <%
            for(int i=0;i<jarlist.size();i++){
        %>
        <tr>
            <td width="30%" ><%= jarlist.get(i).get("jarname") %></td>
            <td width="50%" ><%= jarlist.get(i).get("jarsha256") %></td>
            <td width="20%" ><%= jarlist.get(i).get("jarversion") %></td>
        </tr>
        <%}%>
    </table>
    <input type="hidden" name="isAdmin" id="isAdmin" value="<%=isAdmin%>"/>
</div>
<script type="text/javascript">

	if ("false" == $('#isAdmin').val().trim()) {
		alert("抱歉，您不是管理员，无权限访问此页。");
		CloseWebPage();
	}
	$(document).ready(function() {
		epoint.common.buildHead(1);
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
