<%--
  Created by IntelliJ IDEA.
  User: wangleai
  Date: 2017/11/17
  Time: 16:13
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.epoint.core.utils.xml.ReadXML" %>
<%@ page import="com.epoint.core.utils.xml.XMLNode" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.io.File" %>
<%@ include file="common.jsp" %>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>

<%!
    //当前用户是否时管理员
	Boolean isAdmin = true;
    //各版本框架web.xml基础配置过滤器链顺序，写filter-class的值
    public List<Map<String,String>> baseFilterClasses=new ArrayList<Map<String,String>>();

    //考虑大版本号和小版本号和修订版本号，比如9.3.4-SNAPSHOT考虑为9.3.4
    private static final Pattern VERSIONDETAILNAME_PATTERN = Pattern.compile("(\\d+\\.\\d+\\.\\d+)");

    //考虑大版本号和小版本号，比如9.3.4考虑为9.3
    private static final Pattern VERSIONNAME_PATTERN = Pattern.compile("(\\d+\\.\\d+)");

    //默认比较文件，目前比较F9.2
    String filename="F9.2.xml";

    private void readVersionXML(String version,String xmlpath){
        String tempfilename=filename;
        if(!"unknown".equals(version)){
            String temp = tempfilename;
            Matcher matcherdetail = VERSIONDETAILNAME_PATTERN.matcher(version);
            while (matcherdetail.find() && matcherdetail.groupCount() > 0) {
                temp = "F" + matcherdetail.group(1) + ".xml";
                break;
            }
            //确保存在文件
            File file1 = new File(xmlpath + "/" + temp);
            if (file1.exists()) {
                tempfilename = temp;
            }else {
                //修订版本号对应的版本不存在
                Matcher matcher = VERSIONNAME_PATTERN.matcher(version);
                while (matcher.find() && matcher.groupCount() > 0) {
                    temp = "F" + matcher.group(1) + ".xml";
                    break;
                }
                //确保存在文件
                File file2 = new File(xmlpath + "/" + temp);
                if (file2.exists()) {
                    tempfilename = temp;
                }
            }
        }
        xmlpath=xmlpath+"/"+tempfilename;
        ReadXML xml=new ReadXML(xmlpath);
        List<XMLNode> xmlNodes=xml.getXMLNodeListByTag("filter-class");
        Map<String,String> node=null;
        for(XMLNode xmlNode:xmlNodes){
            node=new HashMap<String,String>();
            List<XMLNode> attrXmlNodes=xmlNode.getAttribute();
            node.put("filterclass",xmlNode.getTextValue());
            node.put("optional","");
            node.put("annotation","");
            for(XMLNode attrnode:attrXmlNodes){
                if("optional".equals(attrnode.getTagName())&&"true".equals(attrnode.getTextValue())){
                    node.put("optional","可选");
                }
                if("annotation".equals(attrnode.getTagName())){
                    node.put("annotation",attrnode.getTextValue());
                }
            }
            baseFilterClasses.add(node);
        }
    }
%>

<%!
    private List<String> filterClasses=new ArrayList<String>();

    //缺失信息
    private List<String> lossinfos=new ArrayList<String>();
    //顺序错误信息
    private List<String> sequenceinfos=new ArrayList<String>();

    private void readWebXML(String webxmlpath){
        ReadXML xml=new ReadXML(webxmlpath);
        List<XMLNode> xmlNodes=xml.getXMLNodeListByTag("filter");
        for(XMLNode xmlNode:xmlNodes){
            List<XMLNode> childXmlNodes=xmlNode.getChildren();
            for(XMLNode childXmlNode:childXmlNodes){
                if("filter-class".equals(childXmlNode.getTagName())){
                    filterClasses.add(childXmlNode.getTextValue());
                }
            }
        }
    }

    private void comparelist(){
        int[] index=new int[baseFilterClasses.size()];
        for(int i=0;i<baseFilterClasses.size();i++){
            String filterclass=baseFilterClasses.get(i).get("filterclass");
            int temp=filterClasses.indexOf(filterclass);
            //非可选的filterclass才会缺失
            if(temp==-1&&!"可选".equals(baseFilterClasses.get(i).get("optional"))){
                lossinfos.add(filterclass+"缺失");
            }
            index[i]=-1;
        }
        for(int i=0;i<index.length-1;i++){
            if(index[i]>-1) {
                for (int j = i + 1; j < index.length; j++) {
                    if (index[i] > index[j] && index[j] != -1) {
                        sequenceinfos.add(baseFilterClasses.get(i) + "与" + baseFilterClasses.get(j) + "顺序有误");
                    }
                }
            }
        }
    }

    private void initPara(String version){
        lossinfos=new ArrayList<String>();
        sequenceinfos=new ArrayList<String>();
        baseFilterClasses=new ArrayList<Map<String,String>>();
        filterClasses=new ArrayList<String>();
    }
%>

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
	String version = getFrameVersion();
	initPara(version);
	readWebXML(request.getSession().getServletContext().getRealPath("/") + "WEB-INF/web.xml");
	//下面的地址需要手动修改
	readVersionXML(version, request.getSession().getServletContext().getRealPath("/") + "check/xml");
	comparelist();
%>

</body>
<div class="container">
    <h3>
        <%= version %>版本对应过滤器链顺序（以filter-class标签为序）
    </h3>
    <table style="background-color: #fff" class="showtable table table-bordered responsive-utilities">
        <tr>
            <td style="width: 30%;font-weight: bold" >名称</td>
            <td style="width: 20%;font-weight: bold" >是否可选</td>
            <td style="width: 50%;font-weight: bold" >说明</td>
        </tr>
        <%
            for(int i=0;i<baseFilterClasses.size();i++){
        %>
        <tr>
            <td width="30%" ><%= baseFilterClasses.get(i).get("filterclass") %></td>
            <td width="20%" ><%= baseFilterClasses.get(i).get("optional") %></td>
            <td width="50%" ><%= baseFilterClasses.get(i).get("annotation") %></td>
        </tr>
        <%}%>
    </table>
    <br>
    <h3>
        当前过滤器链顺序（以filter-class标签为序）
    </h3>
    <table style="background-color: #fff" class="showtable table table-bordered responsive-utilities">
        <tr>
            <td style="font-weight: bold" >名称</td>
        </tr>
        <%
            for(int i=0;i<filterClasses.size();i++){
        %>
        <tr>
            <td><%= filterClasses.get(i) %></td>
        </tr>
        <%}%>
    </table>
    <br>
    <h3>
        失误信息
    </h3>
    <table style="background-color: #fff" class="showtable table table-bordered responsive-utilities">
        <tr>
            <td style="font-weight: bold" >信息</td>
        </tr>
        <%
            for(int i=0;i<lossinfos.size();i++){
        %>
        <tr>
            <td><%= lossinfos.get(i) %></td>
        </tr>
        <%}%>
        <tr><td></td></tr>
        <%
            for(int i=0;i<sequenceinfos.size();i++){
        %>
        <tr>
            <td><%= sequenceinfos.get(i) %></td>
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
		epoint.common.buildHead(3);
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
</html>
