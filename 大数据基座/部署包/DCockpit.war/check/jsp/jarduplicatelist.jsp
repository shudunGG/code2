<%--
  Created by IntelliJ IDEA.
  User: wangleai
  Date: 2017/11/16
  Time: 15:35
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8"%>
<%@ page import="java.io.File,java.io.IOException,java.net.URL,java.net.URLDecoder,java.util.*" %>
<%@ page import="java.util.jar.JarEntry" %>
<%@ page import="java.util.jar.JarFile" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="com.epoint.core.utils.system.SystemHelper" %>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>
<%!//写入需要检测的各版本框架jar包中必带的class,格式如com.epoint.basic.controller.orga.user.FrameUserListAction
	private static final List<String> classList = Arrays
			.asList("com.epoint.basic.controller.orga.user.FrameUserListAction");
	//当前用户是否时管理员
	Boolean isAdmin = true;%>

<%!
    private List<String> duplicateJar=new ArrayList<String>();
    private List<Integer> separate=new ArrayList<Integer>();
    private List<String> duplicateClass=new ArrayList<String>();

    int unexistJarNum=0;//缺失的jar包数

    //得到lib目录下所有非框架jar包
    private void getAllJarName(File libfile){
        try {
            File[] files = libfile.listFiles();
            for (File f : files) {
                if (f.isDirectory()) {
                    getAllJarName(f);
                }
                if (f.isFile() && f.getName().endsWith(".jar") && !f.getName().contains("epoint")) {
                    //检测非框架包，只需要名字相同
                    String name=getJarName(f.getPath());
                    if(name!=null && name.length()>0) {
                        putMap(name, f.getName());
                    }
                    //checkDuplicate(f.getPath());
                }
            }
        }catch (Exception e){
            //防止地址错误
        }
    }

    //检测所有jar的class是否有冲突
    private void checkDuplicate(String jarpath) {
        JarFile jarFile = null;
        try {
            jarFile = new JarFile(jarpath);
        } catch (IOException e1) {
            //我挡
        }
        Enumeration<JarEntry> classes = jarFile.entries();
        while (classes.hasMoreElements()) {
            JarEntry ent = (JarEntry) classes.nextElement();
            if (ent.getName().endsWith(".class")) {
                String path = ent.getName();
                if(checkClassDuplicate(path)){
                    break;
                }
            }
        }
    }

    //检测特定列表class是否冲突
    private void checkClassList(){
        for(String str:classList){
            String classpath=str.replaceAll("\\.","/")+".class";
            checkClassDuplicate(classpath);
        }
    }

    //检测class是否冲突
    private boolean checkClassDuplicate(String classpath){
        boolean isDuplicate=false;
        try {
            // 在ClassPath搜文件
            Enumeration urls = Thread.currentThread().getContextClassLoader().getResources(classpath);
            Set files = new HashSet();
            while (urls.hasMoreElements()) {
                URL url = (URL) urls.nextElement();
                if (url != null) {
                    String file = url.getFile();
                    if (file != null && file.length() > 0) {
                        files.add(file);
                    }
                }
            }
            // 如果有多个，就表示重复
            if (files.size() > 1) {
                Iterator<String> it = files.iterator();
                boolean isrepeat = true;
                //判断对应class冲突的jar包是否已经全部重复
                while (it.hasNext()) {
                    //这样取jar包名称未必准确
                    String str = it.next().replaceAll("\\.jar!.*", ".jar");
                    if (!duplicateJar.contains(str)) {
                        isrepeat = false;
                        break;
                    }
                }
                if (!isrepeat) {
                    int number = 0;
                    it = files.iterator();
                    while (it.hasNext()) {
                        //这样取jar包名称未必准确
                        String str = it.next().replaceAll("\\.jar!.*", ".jar");
                        String[] jarnames=str.split("/");
                        duplicateJar.add(jarnames[jarnames.length-1]);
                        number++;
                    }
                    separate.add(number);
                    duplicateClass.add(classpath+"存在冲突：");
                }
                isDuplicate=true;
            }else if(files.size()==0){
                //0表示缺失
                separate.add(1);
                duplicateClass.add(classpath+"未检测到存在");
                duplicateJar.add("");
                unexistJarNum++;
            }
        } catch (Throwable e) {
            // 防御性容错
        }
        return isDuplicate;
    }
%>

<%!
    private static final Pattern VERSION_PATTERN = Pattern.compile("(-[0-9][0-9a-zA-Z_\\.\\-]*)\\.jar");

    private Map<String,List<String>> noepointjar=new HashMap<String,List<String>>();

    //得到非框架jar包包名
    private String getJarName(String jarpath){
        String name = "";
        JarFile jarFile = null;
        try {
            jarFile = new JarFile(jarpath);
            /*Manifest manifest = jarFile.getManifest();
            if(manifest!=null) {
                Attributes att = manifest.getMainAttributes();
                Map<String, Attributes> map = manifest.getEntries();
                for (String str : map.keySet()) {
                    String temp = map.get(str).getValue("Implementation-Title");
                    if (temp != null && temp.length() > 0) {
                        name = temp;
                        //只取第一个
                        break;
                    }
                }
                if (name == null || name.length() == 0) {
                    name = att.getValue("Implementation-Title");
                }
                if (name == null || name.length() == 0) {
                    name = att.getValue("Specification-Title");
                }
            }*/
            //只比名字
            if (name == null || name.length() == 0) {
                Matcher matcher = VERSION_PATTERN.matcher(jarpath);
                while (matcher.find() && matcher.groupCount() > 0) {
                	String useros=SystemHelper.getSystemOSName();
                	String[] jarname;
                	if(useros.toLowerCase().contains("win")){
                    //Jarfile的getName方法会得到路径
                    	jarname=jarFile.getName().split("\\\\");
                	}else{
                		jarname=jarFile.getName().split("/");
                	}
                    name=jarname[jarname.length-1].replace(matcher.group(0),"");
                }
            }
        }catch (IOException e1) {
            //我防
        }
        return name;
    }

    private void putMap(String jarname,String jarpath){
        if(noepointjar.containsKey(jarname)){
            List<String> jarpathlist=noepointjar.get(jarname);
            jarpathlist.add(jarpath);
            noepointjar.put(jarname,jarpathlist);
        }else {
            List<String> jarpathlist=new ArrayList<String>();
            jarpathlist.add(jarpath);
            noepointjar.put(jarname,jarpathlist);
        }
    }

    //遍历map
    private void checkMap(){
        for (String key : noepointjar.keySet()) {
            List<String> temp=noepointjar.get(key);
            //大于1存在冲突
            if(temp.size()>1){
                for(String str:temp){
                    duplicateJar.add(str);
                }
                separate.add(temp.size());
                duplicateClass.add(key+"标题存在冲突");
            }
        }
    }

    private void initPara(){
        separate=new ArrayList<Integer>();
        duplicateJar=new ArrayList<String>();
        duplicateClass=new ArrayList<String>();
        noepointjar=new HashMap<String,List<String>>();
        unexistJarNum=0;
    }
%>
<html>
<head>
<title>系统检测</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<link href="../css/bootstrap.min.css" rel="stylesheet" />
<link href="../css/style.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../js/jquery.min.js"></script>
<script src="../js/common.js" type="text/javascript" charset="utf8"></script>
</head>
<body>
	<%
		if ("1".equals(ConfigUtil.getConfigValue("checkIsAdmin"))) {
			isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
		}
		initPara();
		getAllJarName(new File(request.getSession().getServletContext().getRealPath("/") + "WEB-INF/lib"));
		checkClassList();
		checkMap();
		int i = 0;
	%>
	<div class="container">
		<h3>
			jar包冲突列表 总数：<%= duplicateJar.size()-unexistJarNum %>
		</h3>
		<table style="background-color: #fff"
			class="showtable table table-bordered responsive-utilities">
			<%
            for(int k=0;k<duplicateJar.size();){
                if(separate.size()>=i+1&&duplicateClass.size()>=i+1){
        %>
			<tr>
				<td><%= URLDecoder.decode(duplicateClass.get(i),"UTF-8") %></td>
			</tr>
			<%
            for(int j=0;j<separate.get(i);j++){
        %>
			<tr>
				<td><%= URLDecoder.decode(duplicateJar.get(k),"UTF-8") %></td>
			</tr>
			<%
                k++;
            }
        %>
			<tr>
				<td></td>
			</tr>
			<%
                }else {
                    break;
                }
                i++;
            }
        %>
		</table>
		<input type="hidden" name="isAdmin" id="isAdmin" value="<%=isAdmin%>" />
	</div>

<script type="text/javascript">
	if ("false" == $('#isAdmin').val().trim()) {
		alert("抱歉，您不是管理员，无权限访问此页。");
		CloseWebPage();
	}
	$(document).ready(function() {
		epoint.common.buildHead(2);
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
