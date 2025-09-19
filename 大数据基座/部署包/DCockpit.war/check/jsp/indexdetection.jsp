<%@ page contentType="text/html;charset=UTF-8" language="java"
	pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*,java.security.MessageDigest"%>
<%@ page import="java.util.jar.JarFile"%>
<%@ page import="java.util.jar.Manifest"%>
<%@ page import="java.util.jar.Attributes"%>
<%@ page import="java.util.regex.Pattern"%>
<%@ page import="java.util.regex.Matcher"%>
<%@ page import="com.epoint.core.dao.CommonDao"%>
<%@ page import="com.epoint.core.grammar.Record"%>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>
<%@ page import="com.epoint.core.utils.string.StringUtil"%>
<%@ page import="com.epoint.core.utils.file.FileManagerUtil"%>
<%@ page import="com.epoint.core.utils.system.SystemHelper"%>
<%@ page import="com.epoint.core.utils.reflect.ReflectUtil"%>
<%@ page import="com.epoint.core.utils.json.JsonUtil"%>
<%@ page import="com.epoint.core.utils.memory.EHCacheUtil"%>
<%@ page import="com.alibaba.fastjson.JSONObject"%>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%> 

<%! //当前用户是否时管理员
    Boolean isAdmin = true;
class IndexCompareInfo
{
    //同步状态：0：相同，1：缺，2：有差异
    private int syncStatus;
    //当前从库里查询出来的索引记录
    private List<Record> dbIndexList;
    //键名，字段
    private Map<String, Set<String>> sqlIndexMap;

    private List<String> needExecuteList;

    public IndexCompareInfo() {
        super();
    }

    public IndexCompareInfo(int syncStatus, List<Record> dbIndexList, List<String> needExecuteList) {
        super();
        this.syncStatus = syncStatus;
        this.dbIndexList = dbIndexList;
        this.needExecuteList = needExecuteList;
    }

    public int getSyncStatus() {
        return syncStatus;
    }

    public void setSyncStatus(int syncStatus) {
        this.syncStatus = syncStatus;
    }

    public List<Record> getDbIndexList() {
        return dbIndexList;
    }

    public void setDbIndexList(List<Record> dbIndexList) {
        this.dbIndexList = dbIndexList;
    }
    
    public Map<String, Set<String>> getSqlIndexMap() {
        return sqlIndexMap;
    }

    public void setSqlIndexMap(Map<String, Set<String>> sqlIndexMap) {
        this.sqlIndexMap = sqlIndexMap;
    }

    public List<String> getNeedExecuteList() {
        return needExecuteList;
    }

    public void setNeedExecuteList(List<String> needExecuteList) {
        this.needExecuteList = needExecuteList;
    }

}

//索引实体
class IndexInfo
{
    //索引类型，primary,unique,normal
    private String indexType;
    //键名Set
    private Set<String> indexKeys;
    //索引名
    private String indexName;
    //执行语句
    private String sql;

    public IndexInfo() {
        super();
    }

    public IndexInfo(String indexType, Set<String> indexKeys, String indexName, String sql) {
        super();
        this.indexType = indexType;
        this.indexKeys = indexKeys;
        this.indexName = indexName;
        this.sql = sql;
    }

    public String getIndexType() {
        return indexType;
    }

    public void setIndexType(String indexType) {
        this.indexType = indexType;
    }

    public Set<String> getIndexKeys() {
        return indexKeys;
    }

    public void setIndexKeys(Set<String> indexKeys) {
        this.indexKeys = indexKeys;
    }

    public String getIndexName() {
        return indexName;
    }

    public void setIndexName(String indexName) {
        this.indexName = indexName;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }
}

	public String hideStr(String s, int start, int end) {
		String result = "";
		try {
			String s1 = s.substring(0, start - 1);
			String s2 = s.substring(end, s.length());
			String splitStr = "*****";
			result = s1 + splitStr + s2;
		} catch (Exception e) {
		}
		return result;
	}
	
	//类别，表，索引List()
	Map<String,Map<String,List<IndexInfo>>> indexTypeList=new LinkedHashMap<String,Map<String,List<IndexInfo>>>();
	//比较结果
	Map<String, Map<String, IndexCompareInfo>> indexCompareList = new LinkedHashMap<String, Map<String, IndexCompareInfo>>();
	
	private void addCompareResult(Map<String, IndexCompareInfo> tableCompareMap, CommonDao dao, String tableName,
            List<IndexInfo> currentIndexList) {
        String mysqlSql = "show index from " + tableName;
        String oraPkSql="select i.CONSTRAINT_NAME,j.COLUMN_NAME  from user_constraints i,user_cons_columns j where i.CONSTRAINT_NAME=j.CONSTRAINT_NAME and lower(i.table_name) = ?1 and i.constraint_type ='P'";
        String oraSql = "select i.index_name,c.column_name from user_indexes i, user_ind_columns c where i.index_name = c.index_name and lower(i.TABLE_NAME)=?1";
        String sql = "EXEC sp_helpindex " + tableName;
        IndexCompareInfo compareInfo = new IndexCompareInfo();
        compareInfo.setSyncStatus(0);
        List<String> needExecuteList = new ArrayList<String>();
        List<Record> list = null;
        Map<String, Set<String>> sqlIndexMap = new LinkedHashMap<String, Set<String>>();
        
        
        if (dao.isMySql()) {
            try {
                list = dao.findList(mysqlSql, Record.class);
            }
            catch (Exception e) {
                compareInfo.setSyncStatus(3);
            }
            if (list != null && list.size() > 0) {
                for (Record record : list) {
                    String keyName = record.get("key_name").toString().toLowerCase();
                    String columnName = record.get("column_name").toString().toLowerCase();
                    if (sqlIndexMap.containsKey(keyName)) {
                        sqlIndexMap.get(keyName).add(columnName);
                    }
                    else {
                        Set<String> columnSet = new HashSet<String>();
                        columnSet.add(columnName);
                        sqlIndexMap.put(keyName, columnSet);
                    }
                }
            }
        }
        else if (dao.isOracle()) {
          	//oracle的主键不会从上面的索引结果集中得出，需要单独查一次主键 ,然后再查索引
          	list = dao.findList(oraPkSql, Record.class, tableName.toLowerCase());
          	if (list != null && list.size() > 0) {
                for (Record record : list) {
                    String keyName = record.get("constraint_name").toString().toLowerCase();
                    String columnName = record.get("column_name").toString().toLowerCase();
                    if (sqlIndexMap.containsKey(keyName)) {
                        sqlIndexMap.get(keyName).add(columnName);
                    }
                    else {
                        Set<String> columnSet = new HashSet<String>();
                        columnSet.add(columnName);
                        sqlIndexMap.put(keyName, columnSet);
                    }
                }
            }
          	
            list = dao.findList(oraSql, Record.class, tableName.toLowerCase());
            if (list != null && list.size() > 0) {
                for (Record record : list) {
                    String keyName = record.get("index_name").toString().toLowerCase();
                    String columnName = record.get("column_name").toString().toLowerCase();
                    if (sqlIndexMap.containsKey(keyName)) {
                        sqlIndexMap.get(keyName).add(columnName);
                    }
                    else {
                        Set<String> columnSet = new HashSet<String>();
                        columnSet.add(columnName);
                        sqlIndexMap.put(keyName, columnSet);
                    }
                }
            }
            
            
        }
        else {
            try {
                list = dao.findList(sql, Record.class);
            }
            catch (Exception e) {
                compareInfo.setSyncStatus(3);
            }
            if (list != null && list.size() > 0) {
                for (Record record : list) {
                    String keyName = record.get("index_name").toString().toLowerCase();
                    String columnNames = record.get("index_keys").toString().toLowerCase();
                    Set<String> columnSet = new HashSet<String>();
                    String[] columnNameArray=columnNames.split(",");
                    for(String columnName :columnNameArray){
                        columnSet.add(columnName.toLowerCase().trim());
                    }
                    sqlIndexMap.put(keyName, columnSet);
                }
            }
        }
                
        
        //如果没从库中查到任何记录，则直接添加原所有语句
        if (sqlIndexMap.size()==0) {
            if(compareInfo.getSyncStatus()==0){
                compareInfo.setSyncStatus(1);
            }
            for (IndexInfo indexInfo : currentIndexList) {
                needExecuteList.add(indexInfo.getSql());
            } 
        }
        else {
            int syncStatus = 0;
            for (IndexInfo indexInfo : currentIndexList) {
                if (!hasIndex(indexInfo, sqlIndexMap)) {
                    syncStatus = 1;
                    needExecuteList.add(indexInfo.getSql());
                }
            }
            compareInfo.setSyncStatus(syncStatus);
        }
        //=0的时候需要判断 实际库中的索引是否是在标准索引中没有的，这种情况需要其自行处理
        if(compareInfo.getSyncStatus()==0){
            if(sqlIndexMap.size()==currentIndexList.size()){
                boolean isContain=false;
                for(Map.Entry<String, Set<String>> entry:sqlIndexMap.entrySet()){
                    isContain=false;
                    int entrySize=entry.getValue().size();
                    for(IndexInfo indexInfo:currentIndexList){
                        int indexSize=indexInfo.getIndexKeys().size();
                        Set<String> tSet = new HashSet<String>();
                        tSet.addAll(entry.getValue());
                        tSet.addAll(indexInfo.getIndexKeys());
                        //合并后的集合大小 如果和indexInfo的相同，表示
                        if(tSet.size()==indexSize && tSet.size()==entrySize){
                            isContain=true;
                            break;
                        }
                    }
                    //一遍比较过来没有一个符合 表示此项不存在，直接退出
                    if(isContain==false){
                        break;
                    }
                }
                //最终如果不包含，就是有差异
                if(isContain==false){
                    compareInfo.setSyncStatus(2);
                }
            }
            //在非缺少的情况下，数量不一样，肯定有差异
            else{
                compareInfo.setSyncStatus(2);
            }
        }
        
        
        compareInfo.setSqlIndexMap(sqlIndexMap);
        compareInfo.setNeedExecuteList(needExecuteList);
        compareInfo.setDbIndexList(list);
        tableCompareMap.put(tableName, compareInfo);
    }

    private boolean hasIndex(IndexInfo indexInfo, Map<String, Set<String>> sqlIndexMap) {
        boolean result = false;
        for (Set<String> valueSet : sqlIndexMap.values()) {
            //个数一样才需要继续判断元素是否后一样
            if (valueSet.size() == indexInfo.getIndexKeys().size()) {
                Set<String> tSet = new HashSet<String>();
                tSet.addAll(valueSet);
                tSet.addAll(indexInfo.getIndexKeys());
                if (tSet.size() == valueSet.size()) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    private void getAllSqlInfo(CommonDao dao, File libfile) {
        boolean isMySql = dao.isMySql();
        boolean isOracle = dao.isOracle();
        boolean isSqlserver = dao.isSqlserver();
        try {
            File[] files = libfile.listFiles();
            for (File f : files) {
                if (f.isDirectory()) {
                    //类别
                    String txtType = f.getName();
                    Map<String, List<IndexInfo>> tableIndexMap = new LinkedHashMap<String, List<IndexInfo>>();
                    Map<String, IndexCompareInfo> tableCompareMap = new LinkedHashMap<String, IndexCompareInfo>();
                    File[] sqlFiles = f.listFiles();
                    for (File sql : sqlFiles) {
                        File finalSqlFile = null;
                        if (isMySql && sql.isFile() && "mysql_index.txt".equals(sql.getName())) {
                            finalSqlFile = sql;
                        }
                        else if (isOracle && sql.isFile() && "ora_index.txt".equals(sql.getName())) {
                            finalSqlFile = sql;
                        }
                        else if (isSqlserver && sql.isFile() && "sql_index.txt".equals(sql.getName())) {
                            finalSqlFile = sql;
                        }
                        if (finalSqlFile != null) {
                            List<String> lineList = FileManagerUtil.getContentFromSystemByLine(finalSqlFile.getPath());
                            //至少3行才有接下去走的意义
                            if (lineList.size() >= 3) {
                                //表与索引关系
                                String currentTableName = "";
                                IndexInfo currentInfo = null;
                                List<IndexInfo> currentIndexList = new ArrayList<IndexInfo>();
                                //定义行标记位，0:表名行,1:索引行,2:脚本行,3:空行
                                int lineFlag = 3;
                                for (String line : lineList) {
                                    String lineContent = line.replace("--", "").replace("\r\n", "").replace("\n", "")
                                            .replace("\r", "").trim();
                                    if (StringUtil.isBlank(lineContent)) {
                                        //符合条件的存入大的map集合中
                                        if (StringUtil.isNotBlank(currentTableName)
                                                && !tableIndexMap.containsKey(currentTableName)
                                                && currentIndexList.size() > 0) {
                                            tableIndexMap.put(currentTableName, currentIndexList);
                                            //比较2组集合
                                            addCompareResult(tableCompareMap, dao, currentTableName, currentIndexList);
                                        }
                                        currentTableName = "";
                                        currentIndexList = new ArrayList<IndexInfo>();
                                        lineFlag = 3;
                                    }
                                    else {
                                        //当前应该是表名行
                                        if (lineFlag == 3) {
                                            lineFlag = 0;
                                            currentTableName = lineContent;
                                        }
                                        //如果flag=0,那当前行是索引行，需要解析出索引
                                        else if (lineFlag == 0) {
                                            String[] lineArray = lineContent.split(";");
                                            currentInfo = new IndexInfo();
                                            if (lineArray.length >= 2) {
                                                //设置indexType
                                                String indexType = lineArray[0].trim();
                                                if (StringUtil.isNotBlank(indexType)) {
                                                    currentInfo.setIndexType(indexType);
                                                }
                                                //设置IndexKeys
                                                String[] fields = lineArray[1].split(",");
                                                Set<String> fieldSet = new HashSet<String>();
                                                for (String field : fields) {
                                                    field = field.trim();
                                                    if (StringUtil.isNotBlank(field)) {
                                                        fieldSet.add(field.toLowerCase());
                                                    }
                                                }
                                                if (fieldSet != null && fieldSet.size() > 0) {
                                                    currentInfo.setIndexKeys(fieldSet);
                                                }
                                                //设置IndexName
                                                if (lineArray.length >= 3) {
                                                    currentInfo.setIndexName(lineArray[2].trim());
                                                }
                                                else {
                                                    currentInfo.setIndexName(currentInfo.getIndexType());
                                                }
                                                lineFlag = 1;
                                            }
                                            //此行不符合规范，不计入
                                            else {
                                                currentInfo = null;
                                            }
                                        }
                                        //如果flag=1,那当前行是脚本行
                                        else if (lineFlag == 1) {
                                            if (currentInfo != null) {
                                                currentInfo.setSql(lineContent);
                                                currentIndexList.add(currentInfo);
                                                lineFlag = 0;
                                            }
                                        }
                                    }

                                }
                            }
                        }

                    }
                    if (tableIndexMap != null && tableIndexMap.size() > 0) {
                        indexTypeList.put(txtType, tableIndexMap);
                    }
                    if (tableCompareMap != null && tableCompareMap.size() > 0) {
                        indexCompareList.put(txtType, tableCompareMap);
                    }
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
%>

<%
	String RootPath = application.getRealPath("/");
	CommonDao dao = null;
	try {
	    dao=CommonDao.getInstance();
		if ("1".equals(ConfigUtil.getConfigValue("checkIsAdmin"))) {
			isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
		}
 		if (isAdmin) {
			getAllSqlInfo(dao,new File(request.getSession().getServletContext().getRealPath("/") + "check/index"));
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
<title>索引检测</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<link href="../css/bootstrap.min.css" rel="stylesheet" />
<link href="../css/style.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../js/jquery.min.js"></script>
<script src="../js/common.js" type="text/javascript" charset="utf8"></script>
<style>
 .td_con{
 word-wrap:break-word;word-break:break-all;
 }
 
 td{
 text-align:center!important;
 }
 
 textarea{
 	text-align:center!important;
 	width: 100%!important;
 	padding: 0px!important;
 	margin-bottom: 0px!important;
 }
 
 .smalltd{
 	font-size: 12px!important;
 }
 
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
	<%
		//当前用户是否是管理员
		if ("1".equals(ConfigUtil.getConfigValue("checkIsAdmin"))) {
			isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
		}
	%>
	 <input type="hidden" name="isAdmin" id="isAdmin" value="<%=isAdmin%>"/>
	<div class="container">
		<form method="post" id="sqlForm" action="">
			<table style="background-color: #fff"
				class="showtable table table-bordered responsive-utilities">
				<%
					int numIndex=0;
					for (Map.Entry<String, Map<String, IndexCompareInfo>> typeEntry : indexCompareList.entrySet()) { 
					    Map<String,List<IndexInfo>> indexInfoMap=indexTypeList.get(typeEntry.getKey());
				%>
				<tr>
					<td colspan="5"><h4><%= typeEntry.getKey() %></h4></td>
				</tr>
				<tr>
					<td style="width: 8%; font-weight: bold">序号</td>
					<td style="width: 23%; font-weight: bold">表名</td>
					<td style="width: 23%; font-weight: bold">索引状态</td>
					<td style="width: 23%; font-weight: bold">同步</td>
					<td style="width: 23%; font-weight: bold">查看索引</td>
				</tr>
				<%
						numIndex=0;
						for (Map.Entry<String, IndexCompareInfo> entry : typeEntry.getValue().entrySet()) {
						    String tableName=entry.getKey();
						    IndexCompareInfo compareInfo= entry.getValue();
						    //状态
						    String shonwIndexStatus="";
						    if(compareInfo.getSyncStatus()==1){
						        shonwIndexStatus="<font color=\"red\">缺少索引</font>";
						    }else if(compareInfo.getSyncStatus()==2){
						        shonwIndexStatus="与标准索引有差异";
						    }
						    else if(compareInfo.getSyncStatus()==3){
						        shonwIndexStatus="<font color=\"red\">索引或表不存在</font>";
						    }
						    else{
						        shonwIndexStatus="正常";
						    }
						    //执行的sql
						    String showCompareSql="";
						    if(compareInfo.getNeedExecuteList()!=null && compareInfo.getNeedExecuteList().size()>0){
						        for(String exeSql:compareInfo.getNeedExecuteList()){
						            String suffix="";
						            if(!exeSql.endsWith(";")){
						                suffix=";";
						            }
						            showCompareSql+=exeSql+suffix;
						        }
						    }
						    //标准索引
						    List<IndexInfo> indexInfoList=indexInfoMap.get(tableName);
						    String showIndexName="";
						    String showIndexKeys="";
						    if(indexInfoList!=null && indexInfoList.size()>0){
						        for(IndexInfo indexInfo:indexInfoList){
						            showIndexName+=indexInfo.getIndexName()+"\r\n";
						            String currentKeys="";
						            for(String key:indexInfo.getIndexKeys()){
						                currentKeys+=key+";";
						            }
						            if(currentKeys.endsWith(";")){
						                currentKeys=currentKeys.substring(0,currentKeys.length()-1);
						            }
						            showIndexKeys+=currentKeys+"\r\n";
						        }
						    }
						    
						    //库中索引
						    Map<String, Set<String>> sqlIndexMap = compareInfo.getSqlIndexMap();
						    String showComIndexName="";
						    String showComIndexKeys="";
						    if(sqlIndexMap!=null && sqlIndexMap.size()>0){
						        for (Map.Entry<String, Set<String>> sqlIndexEntry : sqlIndexMap.entrySet()) {
						            showComIndexName+=sqlIndexEntry.getKey()+"\r\n";
						            String currentComKeys="";
						            for(String key:sqlIndexEntry.getValue()){
						                currentComKeys+=key+";";
						            }
						            if(currentComKeys.endsWith(";")){
						                currentComKeys=currentComKeys.substring(0,currentComKeys.length()-1);
						            }
						            showComIndexKeys+=currentComKeys+"\r\n";
						        }
						    }
						    
						    numIndex++;
				%>
				<tr>
					<td style="width: 8%;"><%= numIndex%></td>
					<td style="width: 23%;"><%= entry.getKey()%></td>
					<td style="width: 23%;" class="ischeck"><%= shonwIndexStatus%></td>
					<td style="width: 23%;">
					<%
						if(compareInfo.getSyncStatus()==1 || compareInfo.getSyncStatus()==3){
					%>
						<a href="javascript:;" onclick="doUpdate(<%=(numIndex-1)%>)">同步索引</a>
						<a href="javascript:;" onclick="toggleDiv($('.hidepath').eq(<%=(numIndex-1)%>));">查看待执行SQL</a>
					<%
						}
					%>	
						
						</td>
					<td style="width: 23%;" ><a
						onclick="toggleDiv($('.hidesql').eq(<%=(numIndex-1)%>));">查看</a></td>
				</tr>
				<tr>
					<td class="hidepath" id="hidepath<%=(numIndex-1)%>" colspan="5"><%=showCompareSql%></td>
				</tr>
				<tr>
					<td class="hidesql" id="hidesql<%=(numIndex-1)%>" colspan="5" style="padding: 0px;">
						<table style="width: 100%;border: 0px;padding: 0px;" cellpadding="0" cellspacing="0">
							<tr>
								<td colspan="2" class="smalltd">标准索引</td>
								<td colspan="2" class="smalltd">当前库索引</td>
							</tr>
							<tr>
								<td class="smalltd">索引名</td>
								<td class="smalltd">索引字段</td>
								<td class="smalltd">索引名</td>
								<td class="smalltd">索引字段</td>
							</tr>
							<tr>
								<td class="smalltd" style="padding: 0px;">
									<textarea rows="6"><%=showIndexName%></textarea>
								</td>
								<td class="smalltd" style="padding: 0px;">
									<textarea rows="6"><%=showIndexKeys%></textarea>
								</td>
								<td class="smalltd" style="padding: 0px;">
									<textarea rows="6"><%=showComIndexName%></textarea>
								</td>
								<td class="smalltd" style="padding: 0px;">
									<textarea rows="6"><%=showComIndexKeys%></textarea>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td class="hideerr" colspan="5"></td>
				</tr>
				<%
						}
				%>
				<%
					}
				%>
			</table>	
		</form>
	</div>
	<script type="text/javascript">
	var showDiv;
		if ("false" == $('#isAdmin').val().trim()) {
			alert("抱歉，您不是管理员，无权限访问此页。");
			CloseWebPage();
		}
		$(document).ready(function() {
			hideAll(true);
			epoint.common.buildHead(6);
			epoint.common.buildFooter();
		});
		
		function hideAll(showerror){
			$('.hidesql').hide();
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
		
		function doUpdate(i){
	     	$.ajax({
	     		beforeSend: function(){
					$(".loading").show();
	     		},
	       		url:"indexdoupdate",
	       		type:"post",
	       		data:{doUpdateIndex:i,
	       			indexContent:$('.hidepath').eq(i).html()
	       			},
	       		success:function(data){
	       			$('.hideerr').eq(i).html(data);
	       			$('.hideerr').eq(i).show();
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
