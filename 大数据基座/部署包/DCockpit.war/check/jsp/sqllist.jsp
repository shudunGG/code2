<%@page import="org.springframework.web.bind.annotation.RequestParam"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"
	pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*,java.security.MessageDigest"%>
<%@ page import="com.epoint.core.utils.file.FileManagerUtil"%>
<%@ page import="com.epoint.core.dao.CommonDao"%>
<%@ page import="com.epoint.core.EpointFrameDsManager"%>
<%@ page import="org.apache.tools.ant.Project"%>
<%@ page import="org.apache.tools.ant.taskdefs.SQLExec"%>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>
<%@ page import="com.epoint.core.utils.string.StringUtil"%>
<!DOCTYPE html>

<%!List<Map<String, String>> datelist = new ArrayList<Map<String, String>>();
	//当前用户是否时管理员
	Boolean isAdmin = true;
	FileManagerUtil fileUtil = new FileManagerUtil();
	CommonDao dao = CommonDao.getInstance();
	boolean isMySql = dao.isMySql();
	boolean isOracle = dao.isOracle();
	boolean isSqlserver = dao.isSqlserver();

	private List<Map<String, String>> getAllSqlInfo(File libfile) {
		datelist = new ArrayList<Map<String, String>>();
		try {
		    //文件夹按照日期排序
		    File[] files = libfile.listFiles();
	        List<File> sortfiles = Arrays.asList(files);
	        Collections.sort(sortfiles, new Comparator<File>()
	        {
	            public int compare(File o1, File o2) {
	                return o1.getName().compareTo(o2.getName());
	            }
	        });
			for (File f : sortfiles) {
			    if (f.isDirectory() && !"history".equals(f.getName()) && !"example".equals(f.getName())) {
                    Map<String, String> date = new HashMap<String, String>();
                    date.put("dateDir", f.getName());
                    File[] sqlFiles = new File(f.getPath()).listFiles();
                    for (File sql : sqlFiles) {
                        if (isMySql) {
                            if (sql.isFile() && "mysql_Check_Frame.sql".equals(sql.getName())) {
                                date.put("check", isCheck(sql));
                            }
                            if (sql.isFile() && "mysql_Frame.sql".equals(sql.getName())) {
                                date.put("path", sql.getAbsolutePath());
                                date.put("update", fileUtil.getContentFromSystemByReader(sql.getPath()));
                            }
                        }
                        if (isOracle) {
                            if (sql.isFile() && "ora_Check_Frame.sql".equals(sql.getName())) {
                                date.put("check", isCheck(sql));
                            }
                            if (sql.isFile() && "ora_Frame.sql".equals(sql.getName())) {
                                date.put("path", sql.getAbsolutePath());
                                date.put("update", fileUtil.getContentFromSystemByReader(sql.getPath()));
                            }
                        }
                        if (isSqlserver) {
                            if (sql.isFile() && "sql_Check_Frame.sql".equals(sql.getName())) {
                                date.put("check", isCheck(sql));
                            }
                            if (sql.isFile() && "sql_Frame.sql".equals(sql.getName())) {
                                date.put("path", sql.getAbsolutePath());
                                date.put("update", fileUtil.getContentFromSystemByReader(sql.getPath()));
                            }
                        }
                        if (sql.isFile() && sql.getName().endsWith(".txt")) {
                            date.put("description", fileUtil.getContentFromSystemByReader(sql.getPath()));
                        }
                    }
                    date.put("error", "");
                    datelist.add(date);
                }
            }
        }
        catch (Exception e) {

        }
        return datelist;
    }
	
    private String isCheck(File file) {
        String msg = "";
        StringBuffer sb = new StringBuffer();
        List<String> listSql = fileUtil.getContentFromSystemByLine(file.getPath());
        if (listSql != null && listSql.size() > 0) {
            for (String chsql : listSql) {
                if (!chsql.startsWith("--")) {
                    sb.append(chsql);
                }
            }
        }
        String sql = sb.toString();
        if (StringUtil.isNotBlank(sql)) {
            Integer count = 0;
            try {
                count = dao.queryInt(sql);
            }
            catch (Exception e) {
                msg = "<font color=\"red\">检测脚本不规范，查询结果应为数字</font>";
            }
            finally {
                if (StringUtil.isBlank(msg)) {
                    if(count!=null){
                   		msg = count >= 1 ? "已更新" : "<font color=\"red\">未更新</font>";
                    }else{
                        msg = "<font color=\"red\">检测脚本不规范，查询结果应为数字</font>";
                    }
                }
            }
        }
        else {
            msg = "<font color=\"red\">无检测脚本</font>";
        }
        return msg;
    }%>
<%
	String RootPath = application.getRealPath("/");
	try {
		if ("1".equals(ConfigUtil.getConfigValue("checkIsAdmin"))) {
			isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
		}
 		if (isAdmin) {
			getAllSqlInfo(new File(request.getSession().getServletContext().getRealPath("/") + "docs/脚本更新"));
 		}
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		dao.close();
	}
%>
<html>
<head>
<title>脚本检测</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<link href="../css/bootstrap.min.css" rel="stylesheet" />
<link href="../css/style.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../js/jquery.min.js"></script>
<script src="../js/common.js" type="text/javascript" charset="utf8"></script>
<style>
.hideerr {
	color: red;
}

.loading-layer {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index：10;
}

.loading {
	display: none;
}

.loading-bg {
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .8);
}

.loading-gif {
	width: 36px;
	height: 36px;
	position: absolute;
	top: 50%;
	left: 50%; z-index：11;
	margin-top: -8px;
	margin-left: -8px;
}

.loading-img {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
</head>
<body>

	<div class="container">
		<form method="post" id="sqlForm" action="">
			<table style="background-color: #fff"
				class="showtable table table-bordered responsive-utilities">
				<tr>
					<td style="width: 20%; font-weight: bold">脚本版本</td>
					<td style="width: 20%; font-weight: bold">是否更新</td>
					<td style="width: 20%; font-weight: bold">ִ执行更新</td>
					<td style="width: 20%; font-weight: bold">脚本详情</td>
					<td style="width: 20%; font-weight: bold">ִ更新说明</td>
				</tr>
				<%
					for (int i = 0; i < datelist.size(); i++) {
				%>
				<tr>
					<td width="20%"><%=datelist.get(i).get("dateDir")%></td>
					<td width="20%" class="ischeck"><%=datelist.get(i).get("check")%></td>
					<td width="20%"><a href="javascript:;"
						onclick="doUpdate(<%=i%>)">更新脚本</a></td>
					<td width="20%"><a
						onclick="toggleDiv($('.hidesql').eq(<%=i%>));">查看</a></td>
					<td width="20%"><a
						onclick="toggleDiv($('.hidedesc').eq(<%=i%>));">查看</a></td>
				</tr>
				<tr class="hidesql" id="hidesql<%=i%>">
					<td colspan="5"><%=datelist.get(i).get("update") == null
						? ""
						: datelist.get(i).get("update").replace("\r\n", "<br/>")%>
					</td>
				</tr>
				<tr class="hidedesc" id="hidedesc<%=i%>">
					<td colspan="5"><%=datelist.get(i).get("description")%></td>
				</tr>
				<tr>
					<td class="hideerr" colspan="5"><%=datelist.get(i).get("error")%></td>
				</tr>
				<tr>
					<td class="hidepath" colspan="5"><%=datelist.get(i).get("path")%></td>
				</tr>
				<%
					}
				%>
			</table>
			<input type="hidden" name="doUpdateIndex" id="doUpdateIndex" /> <input
				type="hidden" name="isAdmin" id="isAdmin" value="<%=isAdmin%>" />
		</form>
	</div>
	<div class="loading-layer loading">
		<div class="loading-bg"></div>
		<div class="loading-gif">
			<img class="loading-img" src="loading.gif" alt="">
		</div>
	</div>

	<script type="text/javascript">
	var showDiv;
	if("false"==$('#isAdmin').val().trim()){
		alert("抱歉，您不是管理员，无权限访问此页。");
 		CloseWebPage();
	}
    $(document).ready(function() {
    	hideAll(true);
        epoint.common.buildHead(4);
        epoint.common.buildFooter();
    });
    function doUpdate(i){
     	$.ajax({
     		beforeSend: function(){
				$(".loading").show();
     		},
       		url:"sqldoupdate",
       		type:"post",
       		data:{doUpdateIndex:i,
       			path:$('.hidepath').eq(i).html()
       			},
       		success:function(data){
       			$('.hideerr').eq(i).html(data);
       			//$('.hideerr').eq(i).show();
       			toggleDiv($('.hideerr').eq(i));
       			if(data.indexOf("OK")==0){
       				$('.ischeck').eq(i).html('已更新')
       			}
       		},
       		complete: function(){
          		 $(".loading").hide();
          		},
       		error:function(e){
       			alert("error");
       		}
       		
       	});
    }
    
    function hideAll(showerror){
    	$('.hidesql').hide();
    	$('.hidedesc').hide();
    	$('.hidepath').hide();
    	$('.hideerr').each(function(){
    		if($(this).html().trim()=="")
    			$(this).hide();
    		else if($(this).html().trim()=="OK"){
    			$(this).hide();
    			$(this).html("");
    		}
    		else{
    			showDiv= $(this);
    			$(this).show();
    		}	
    	});
    }
    
    function toggleDiv(tDiv){
    	if(showDiv){
		    showDiv.hide();
		    if(showDiv[0].id!=tDiv[0].id){
			    showDiv=tDiv;
			    showDiv.show();
    		}
    		else
    			showDiv=null;
   		}
    	else{
    		showDiv=tDiv;
    		showDiv.show();
    	}
    }
    function CloseWebPage() {     
        if (navigator.userAgent.indexOf("MSIE") > 0) {     
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {     
                window.opener = null; window.close();     
            }     
            else {     
                window.open('', '_top'); window.top.close();     
            }     
        }     
        else if (navigator.userAgent.indexOf("Firefox") > 0) {     
            window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的    
            //window.history.go(-2);     
        }     
        else {   
        	window.location.href = "about:blank";
			window.close();
        }     
    }
    
    /* function openDetail(obj){
    	//alert($('.sql').eq(obj).val());
    	$('.hidesql').eq(obj).toggle();
    	
    } */
</script>

</body>
</html>
