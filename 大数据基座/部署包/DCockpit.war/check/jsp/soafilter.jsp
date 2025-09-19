<%@ page contentType="text/html;charset=UTF-8" language="java"
	pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*,java.security.MessageDigest"%>
<%@ page import="java.util.jar.JarFile"%>
<%@ page import="java.util.jar.Manifest"%>
<%@ page import="java.util.jar.Attributes"%>
<%@ page import="java.util.regex.Pattern"%>
<%@ page import="java.util.regex.Matcher"%>
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>
<%@ page import="com.epoint.core.utils.string.StringUtil"%>
<%@ page import="com.epoint.core.utils.system.SystemHelper"%>
<%@ page import="com.epoint.core.utils.reflect.ReflectUtil"%>
<%@ page import="com.epoint.basic.soa.SOAEnum.SOAErrorType"%>
<%@ page import="com.epoint.core.utils.httpclient.HttpClientUtil"%>
<%@ page import="com.epoint.core.utils.json.JsonUtil"%>
<%@ page import="com.epoint.basic.soa.SOAService"%>
<%@ page import="com.epoint.core.utils.memory.EHCacheUtil"%>
<%@ page import="com.epoint.basic.bizlogic.orga.ou.init.OuInit"%>
<%@ page import="com.epoint.basic.bizlogic.orga.user.init.UserInit"%>
<%@ page import="com.epoint.basic.bizlogic.uiset.menu.module.init.ModuleInit"%>
<%@ page import="com.epoint.authenticator.asutils.SSOConfigEnvironment"%>
<%@ page import="org.apache.commons.lang.StringUtils"%>
<%@ page import="com.epoint.core.utils.httpclient.HttpClientUtil"%>
<%@ page import="com.alibaba.fastjson.JSONObject"%>
<%@ page import="com.epoint.basic.authentication.UserSession"%>
<%@ page import="javax.servlet.http.*"%> 
<%@ page import="com.epoint.core.utils.config.ConfigUtil"%>

<%! //当前用户是否时管理员
    Boolean isAdmin = true;

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
	}%>
<html>
<head>
<title>soa检测</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<link href="../css/bootstrap.min.css" rel="stylesheet" />
<link href="../css/style.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../js/jquery.min.js"></script>
<script src="../js/common.js" type="text/javascript" charset="utf8"></script>
<style>
 .td_con{
 word-wrap:break-word;word-break:break-all;
 }
</style>
</head>
<body>
	<%
		//当前用户是否是管理员
		if ("1".equals(ConfigUtil.getConfigValue("checkIsAdmin"))) {
			isAdmin = UserSession.getInstance().isAdmin(request.getSession(false));
		}
		String soaAddress = ConfigUtil.getConfigValue("SOAAddress");
		boolean isSoaAddressBlank = StringUtil.isBlank(soaAddress);
		String currentMode = isSoaAddressBlank ? "soa服务端(epointframe.properties未配置 SOAAddress;如果是普通应用,无须关注以下检测)"
				: "soa应用接入端";
	%>
	 <input type="hidden" name="isAdmin" id="isAdmin" value="<%=isAdmin%>"/>
	<div class="container">
		<h3>
			当前识别状态：<%= currentMode%>
		</h3>
		<%
    	if(isSoaAddressBlank){
    	    String enableMutiClient=ConfigUtil.getConfigValue("enableMutiClient");
    	    String enableMutiClientResult="1".equals(enableMutiClient)?"已开启":"未开启";
    	    String soaFlagOu=ConfigUtil.getConfigValue("frameouservice9_reflectclassname");
    	    String soaFlagUser=ConfigUtil.getConfigValue("frameuserservice9_reflectclassname");
    	    String soaFlagRole=ConfigUtil.getConfigValue("frameroleservice9_reflectclassname");
    	    String soaFlagRelation=ConfigUtil.getConfigValue("frameuserrolerelationservice9_reflectclassname");
    	    String soaFlagResult="";
    	    if(StringUtil.isNotBlank(soaFlagOu) && StringUtil.isNotBlank(soaFlagUser)
    	            && StringUtil.isNotBlank(soaFlagRole)&& StringUtil.isNotBlank(soaFlagRelation)){
    	        soaFlagResult="已配置组织架构变动标志位功能";
    	    }else{
    	        soaFlagResult="<font color=\"red\">组织架构变动标志位功能 未配置或未配置完整</font>";
    	    }
    	    String soaSnapInitClass="com.epoint.basic.bizlogic.orga.sync.snapshot.init.SOASnapInit";
    	    List<String> fieldFilterList=new ArrayList<String>();
    	    if(ReflectUtil.exist(soaSnapInitClass)){
    	        fieldFilterList=(List<String>)ReflectUtil.invokeMethod(soaSnapInitClass, "initMemory");
    	    }
    	    
    %>
		<table style="background-color: #fff"
			class="showtable table table-bordered responsive-utilities">
			<tr>
				<td class="td_lable">enableMutiClient</td>
				<td width="35%">开启接入应用IP区分;=1时开启</td>
				<td width="40%"><%= enableMutiClientResult %></td>
			</tr>
			<tr>
				<td class="td_lable">组织架构变动标志位功能</td>
				<td width="75%" colspan="2"><%= soaFlagResult %></td>
			</tr>
		</table>
		<br />
		<%
        	if(fieldFilterList!=null && fieldFilterList.size()>0){
        	    int size=fieldFilterList.size();
    %>
		<h3>源表与快照表字段检测(按要求修改)：</h3>
		<table style="background-color: #fff"
			class="showtable table table-bordered responsive-utilities">
			<% for(int i=0;i<size;i++){%>
			<tr>
				<td class="td_lable" style="color: red;"><%= fieldFilterList.get(i) %></td>
			</tr>
			<%}//for循环结尾%>
		</table>
		<br />
		<%
    		}//fieldFilterList结尾
    	}else{
    	    String soaAddrClass="";
    	    if(!soaAddress.endsWith("rest/organization")){
    	        soaAddrClass="color:red;";
    	    }
    	    String isOAuthEnabled=ConfigUtil.getConfigValue("IsOAuthEnabled");
    	    String SOA_Appkey_secret=ConfigUtil.getConfigValue("SOA_Appkey_secret");
    	    String issoaFrameOu=ConfigUtil.getConfigValue("FrameOU");
	        String issoaFrameUser=ConfigUtil.getConfigValue("FrameUser");
	        String issoaFrameRole=ConfigUtil.getConfigValue("FrameRole");
	        String issoaFrameRoleType=ConfigUtil.getConfigValue("FrameRoleType");
			String issoaFrameOUIntoDB=ConfigUtil.getConfigValue("soaFrameOUIntoDB");
			String issoaFrameUserIntoDB=ConfigUtil.getConfigValue("soaFrameUserIntoDB");
			String f9MessageRemindClass=ConfigUtil.getConfigValue("F9MessageRemindClass");
			String messagesCenterSOAAddress=ConfigUtil.getConfigValue("MessagesCenterSOAAddress");
	        String client_id=ConfigUtil.getConfigValue("EpointSSOClient", "client_id");
	        String client_secret=ConfigUtil.getConfigValue("EpointSSOClient", "client_secret");
	        String verification_type=ConfigUtil.getConfigValue("EpointSSOClient", "verification_type");
	        
	        List<String> clientFilterList=new ArrayList<String>();
	        String token="";
	        String[] keyArray=SOA_Appkey_secret.split(";");
	        String appKey=keyArray[0];
	        String appKeySecret="";
	        if(keyArray.length==2){
	            appKeySecret=keyArray[1];
	        }
	        String showSOA_Appkey_secret="";
	        if(StringUtil.isBlank(appKey) || StringUtil.isBlank(appKeySecret)){
	            showSOA_Appkey_secret="<font color=\"red\">未配置SOA_Appkey_secret</font>";
	        }else{
	            showSOA_Appkey_secret=hideStr(appKey,10,23)+";"+hideStr(appKeySecret,10,23);
	        }
	        
	        if((!"1".equals(issoaFrameOu))||(!"1".equals(issoaFrameUser))){
	            clientFilterList.add(SOAErrorType.soa003.getValue());
	        }
	        
	        
	        if(!"1".equals(isOAuthEnabled)){
	            Map<String, Object> param = new HashMap<String, Object>();
                param.put("appKey", appKey);
                param.put("appSecret", appKeySecret);
                param.put("clientConnectionTimeout", 20 * 1000);// 20秒拿不到token就认为是过期
                String json = HttpClientUtil
                        .post(soaAddress.replace("/organization", "/authorization") + "/getToken", param, 2)
                        .toString();
                if(!HttpClientUtil.CONNECT_TIME_OUT.equals(json)){
                    if(StringUtil.isBlank(json)){
                        if(StringUtil.isBlank(token)){
                            clientFilterList.add(SOAErrorType.soa002.getValue());
                        }
                    }else{
                        Map<String, Object> result = JsonUtil.jsonToMap(json);
                        token = result.get("access_token").toString();
                        if(StringUtil.isBlank(token)){
                            clientFilterList.add(SOAErrorType.soa002.getValue());
                        }
                    }
                }else{
                    clientFilterList.add(SOAErrorType.soa001.getValue());
                }
	        }
	        
	        String ouCount="0";
	        Object ouObj=EHCacheUtil.get("f9CacheOu");
	        OuInit ouInit=null;
	        if(ouObj!=null){
	            ouInit=(OuInit)ouObj;
	        }
	        if(ouInit!=null){
	            List list=ouInit.getLstCacheOu();
	            if(list!=null){
	                ouCount=list.size()+"";
	            }
	        }else{
	            ouCount="没有部门缓存数据";
	        }
	        
	        
	        String userCount="0";
	        Object userObj=EHCacheUtil.get("f9CacheUser");
	        UserInit userInit=null;
	        if(userObj!=null){
	            userInit=(UserInit)userObj;
	        }
	        if(userInit!=null){
	            List userlist=userInit.getLstCacheUser();
	            if(userlist!=null){
	                userCount=userlist.size()+"";
	            }
	        }else{
	            userCount="没有用户缓存数据";
	        }
	        
	        String roleCount="0";
	        Object roleObj=EHCacheUtil.get("f9CacheRole");
	        List roleList=null;
	        if(roleObj!=null){
	        	roleList=(List)roleObj;
	        }
	        if(roleList!=null){
	        	roleCount=roleList.size()+"";
            }else{
            	roleCount="没有角色缓存数据";
	        }
	        
	        String moduleCount="0";
	        Object moduleObj=EHCacheUtil.get("f9CacheModule");
	        ModuleInit moduleInit=null;
	        if(moduleObj!=null){
	        	moduleInit=(ModuleInit)moduleObj;
	        }
	        if(moduleInit!=null){
	            List modulelist=moduleInit.getLstCacheModule();
	            if(modulelist!=null){
	            	moduleCount=modulelist.size()+"";
	            }
	        }else{
	        	moduleCount="没有模块缓存数据";
	        }
	        
	        String issoaFrameOuDisplay = ("1".equals(issoaFrameOu)?"启用":"未启用");
	        String issoaFrameUserDisplay = ("1".equals(issoaFrameUser)?"启用":"未启用");
	        String issoaFrameRoleDisplay = ("1".equals(issoaFrameRole)?"启用":"未启用");
	        String issoaFrameRoleTypeDisplay = ("1".equals(issoaFrameRoleType)?"启用":"未启用");
	        String isOAuthEnabledDisplay = ("1".equals(isOAuthEnabled)?"启用":"未启用");
			String issoaFrameOUIntoDBDisplay = ("1".equals(issoaFrameOUIntoDB)?"启用":"未启用");
			String issoaFrameUserIntoDBDisplay = ("1".equals(issoaFrameUserIntoDB)?"启用":"未启用");
			
			String showMessagesCenterSOAAddress=messagesCenterSOAAddress;
			if(StringUtil.isBlank(messagesCenterSOAAddress)){
			    showMessagesCenterSOAAddress="未对接统一消息";
			}
			
	                                
    %>
		<table style="background-color: #fff"
			class="showtable table table-bordered responsive-utilities">
			<tr>
				<td colspan="3"><h4>epointframe.properties:</h4></td>
			</tr>
			<tr>
				<td class="td_lable">SOAAddress</td>
				<td width="35%">soa接入地址</td>
				<td width="50%" style="<%= soaAddrClass %>"><%= soaAddress %></td>
			</tr>
			<tr>
				<td class="td_lable">SOA_Appkey_secret</td>
				<td width="35%">当前配置的appKey和密码(隐藏)</td>
				<td width="40%"><%= showSOA_Appkey_secret %></td>
			</tr>
			<tr>
				<td class="td_lable">FrameOU</td>
				<td width="35%">等于1时表示同步部门数据</td>
				<td width="40%"><%= issoaFrameOuDisplay %></td>
			</tr>
			<tr>
				<td class="td_lable">FrameUser</td>
				<td width="35%">等于1时表示同步用户数据</td>
				<td width="40%"><%= issoaFrameUserDisplay %></td>
			</tr>
			<tr>
				<td class="td_lable">FrameRole</td>
				<td width="35%">等于1时表示同步角色数据</td>
				<td width="40%"><%= issoaFrameRoleDisplay %></td>
			</tr>
			<tr>
				<td class="td_lable">FrameRoleType</td>
				<td width="35%">等于1时表示同步角色类别数据</td>
				<td width="40%"><%= issoaFrameRoleTypeDisplay %></td>
			</tr>
			<tr>
				<td class="td_lable">IsOAuthEnabled</td>
				<td width="35%">等于1时开启oauth认证，此时通过oauth去拿token</td>
				<td width="40%"><%= isOAuthEnabledDisplay %></td>
			</tr>
			<tr>
				<td class="td_lable">soaFrameOUIntoDB</td>
				<td width="35%">等于1时开启同步支撑平台部门到本地库</td>
				<td width="40%"><%= issoaFrameOUIntoDBDisplay %></td>
			</tr>
			<tr>
				<td class="td_lable">soaFrameUserIntoDB</td>
				<td width="35%">等于1时开启同步支撑平台用户到本地库</td>
				<td width="40%"><%= issoaFrameUserIntoDBDisplay %></td>
			</tr>
			<tr>
				<td class="td_lable">f9MessageRemindClass</td>
				<td width="35%">remindClass配置</td>
				<td width="40%"><%= f9MessageRemindClass %></td>
			</tr>
			<tr>
				<td class="td_lable">MessagesCenterSOAAddress</td>
				<td width="35%">统一消息配置地址</td>
				<td width="40%"><%= showMessagesCenterSOAAddress %></td>
			</tr>
			<tr>
				<td colspan="3"><h4>测试结果:</h4></td>
			</tr>
			<tr>
				<td class="td_lable">getToken</td>
				<td width="35%">尝试获取Token</td>
				<td width="40%"><%=  hideStr(SOAService.getToken(),10,50) %></td>
			</tr>
			<tr>
				<td class="td_lable">localOuCount</td>
				<td width="35%">本地总部门数量</td>
				<td width="40%"><%=  ouCount %></td>
			</tr>
			<tr>
				<td class="td_lable">localUserCount</td>
				<td width="35%">本地总用户数量</td>	
				<td width="40%"><%=  userCount %></td>
			</tr>
			<tr>
				<td class="td_lable">localRoleCount</td>
				<td width="35%">本地总角色数量</td>
				<td width="40%"><%=  roleCount %></td>
			</tr>
			<tr>
				<td class="td_lable">localModuleCount</td>
				<td width="35%">本地总模块数量</td>	
				<td width="40%"><%=  moduleCount %></td>
			</tr>
			<% 
        	if(clientFilterList!=null && clientFilterList.size()>0){
        	    int clientFilterSize=clientFilterList.size();
        	    for(int i=0;i<clientFilterSize;i++){
        %>
			<tr>
				<td class="td_lable" style="color: red;" colspan="3"><%= clientFilterList.get(i) %></td>
			</tr>
			<%
        		}//for循环结尾
        	}    
        %>

		</table>
		<br />
		<%
    	}
    %>

		<h4>EpointSSOClient.properties</h4>
		<% String client_idSSO = SSOConfigEnvironment.CLIENT_ID; 
			if("admin".equals(client_idSSO)) {
		%>
		<h5>(注意：client_id为admin（管理员账号），检测结果可能会出现误差)</h5>
		<%
			} 
		%>
		<%
		    String ssoEnabled = SSOConfigEnvironment.getConfigValue("verification_type") == null
							? "未启用"
							: SSOConfigEnvironment.getConfigValue("verification_type").toString();
					if ("1".equals(ssoEnabled)) {
						ssoEnabled = "启用（Rest方式认证）";
					} else if ("2".equals(ssoEnabled)) {
						ssoEnabled = "启用（RPC方式认证）";
					} else {
						ssoEnabled = "未启用";
					}
					 client_idSSO = SSOConfigEnvironment.CLIENT_ID;
					String[] arr = client_idSSO.split("-");
					if (arr.length >= 3) {
						StringBuilder sb = new StringBuilder(arr[0]);
						for (int i = 0; i < (arr.length - 2); i++) {
							sb.append("-******-");
						}
						sb.append(arr[arr.length - 1]);
						client_idSSO = sb.toString();
					}
					String client_secretSSO = SSOConfigEnvironment.CLIENT_SECRET;
					arr = client_secretSSO.split("-");
					if (arr.length >= 3) {
						StringBuilder sb = new StringBuilder(arr[0]);
						for (int i = 0; i < (arr.length - 2); i++) {
							sb.append("-******-");
						}
						sb.append(arr[arr.length - 1]);
						client_secretSSO = sb.toString();
					}
					
					// 判断是否开启了soa
					if (!isSoaAddressBlank) {
						String SOA_Appkey_secret = ConfigUtil.getConfigValue("SOA_Appkey_secret");
						String[] keyArray = SOA_Appkey_secret.split(";");
						String appKey = keyArray[0];
						String appKeySecret = "";
						if (keyArray.length == 2) {
							appKeySecret = keyArray[1];
						}

						if (StringUtil.isNotBlank(appKey)) {
							if (!appKey.equals(SSOConfigEnvironment.CLIENT_ID)) {
								client_idSSO += "<font color=\"red\">  (警告：SOA配置的APPKey与SSO配置的Client_id不一致，请配置为同一个客户端应用！)</font>";
							}
						}
						
						if (StringUtil.isNotBlank(appKeySecret)) {
							if (!appKeySecret.equals(SSOConfigEnvironment.CLIENT_SECRET)) {
							    client_secretSSO += "<font color=\"red\">  (警告：SOA配置的APPSecret与SSO配置的Client_secret不一致，请配置为同一个客户端应用！)</font>";
							}
						}
					}
					
					String server_url = SSOConfigEnvironment.SERVER_URL;
					String server_intranet_url = SSOConfigEnvironment.SERVER_INTRANET_URL;
					String redirect_url = SSOConfigEnvironment.REDIRECT_URL;
					String redirect_intranet_url = SSOConfigEnvironment.getConfigValue("redirect_intranet_url") == null
							? ""
							: SSOConfigEnvironment.getConfigValue("redirect_intranet_url").toString();
					String display = SSOConfigEnvironment.DISPLAY;
					String scope = SSOConfigEnvironment.SCOPE;
					String ssoenabled = SSOConfigEnvironment.SSOEnabled ? "启用" : "不启用";
					String token = "";

					if (StringUtil.isNotBlank(client_idSSO) && StringUtil.isNotBlank(client_secretSSO)
							&& StringUtil.isNotBlank(server_url) && ssoEnabled.indexOf("启用") == 0) {
						Map<String, Object> param = new HashMap<String, Object>();
						param.put("client_id", SSOConfigEnvironment.CLIENT_ID);
						param.put("client_secret", SSOConfigEnvironment.CLIENT_SECRET);
						param.put("grant_type", "client_credentials");
						param.put("clientConnectionTimeout", 20 * 1000);// 20秒拿不到token就认为是过期
						String ssoUrl = "";
						if (StringUtil.isNotBlank(server_intranet_url)) {
							ssoUrl = server_intranet_url;
						} else {
							ssoUrl = server_url;
						}
						
						try {
							String json = HttpClientUtil.post(ssoUrl + "/rest/oauth2/token", param, 2).toString();
							
							Map<String, Object> param2 = new HashMap<String, Object>();
							param2.put("client_id", SSOConfigEnvironment.CLIENT_ID);
							param2.put("client_secret", SSOConfigEnvironment.CLIENT_SECRET);
							param2.put("grant_type", "authorization_code");
							param2.put("code", "123");
							param2.put("redirect_uri", redirect_url);
							param2.put("clientConnectionTimeout", 20 * 1000);// 20秒拿不到token就认为是过期
							String json2 = HttpClientUtil.post(ssoUrl + "/rest/oauth2/token", param2, 2).toString();
							if(!HttpClientUtil.CONNECT_TIME_OUT.equals(json2)) {
								if(json2.indexOf("invalid_redirect_url") >= 0){
								    token = "<font color=\"red\"> (警告：获取Token异常，填写的redirect_uri非法) </font>";
							    }
							}
							
							System.out.println(json2);
							System.out.println(json);
							if (StringUtil.isBlank(token) && !HttpClientUtil.CONNECT_TIME_OUT.equals(json)) {
									if(json.indexOf("invalid_client") >= 0) {
									    token = "<font color=\"red\"> (警告：获取Token异常，填写的client_id非法) </font>";
									} else if(json.indexOf("unauthorized_client") >= 0) {
									    token = "<font color=\"red\"> (警告：获取Token异常，填写的client_secret非法) </font>";
									}else {
									    token = "<font color=\"green\">成功获取Token</font>";
									}
							} else if(StringUtil.isBlank(token)) {
								// 一般是统一认证服务端的地址访问不同导致
								if (StringUtil.isNotBlank(server_intranet_url)) {
								    token = "<font color=\"red\">  (警告：获取Token异常，请确认统一认证平台内网地址（server_intranet_url）是否配置正确，目前访问网络超时！)</font>";
								} else {
								    token = "<font color=\"red\">  (警告：获取Token异常，请确认统一认证平台地址（server_url）是否配置正确，目前访问网络超时！<br/> 如果统一认证平台有内网地址，请配置在server_intranet_url中！)</font>";
								}
							}
						}catch (Exception e) {
						    e.printStackTrace();
						    token = "<font color=\"red\">  尝试获取token在服务端发生异常，在联系框架人员查看日志之前，请先确认配置的统一认证服务端地址是否是一个合法的HTTP地址！</font>";
						}
					}
		%>

		<table style="background-color: #fff"
			class="showtable table table-bordered responsive-utilities">
			<tr>
				<td class="td_lable">verification_type</td>
				<td width="35%">统一认证</td>
				<td width="70%"><%=ssoEnabled%></td>
			</tr>

			<tr>
				<td class="td_lable">client_id</td>
				<td width="35%">客户端标识</td>
				<td width="70%"><%=client_idSSO%></td>
			</tr>
			<tr>
				<td class="td_lable">client_secret</td>
				<td width="35%">客户端凭证</td>
				<td width="70%"><%=client_secretSSO%></td>
			</tr>
			<tr>
				<td class="td_lable">server_url</td>
				<td width="35%">服务端地址</td>
				<td width="40%"><%=server_url%></td>
			</tr>
			<tr>
				<td class="td_lable">server_intranet_url</td>
				<td width="35%">服务端内网地址</td>
				<td width="40%"><%=server_intranet_url%></td>
			</tr>
			<tr>
				<td class="td_lable">redirect_url</td>
				<td width="35%">客户端回掉地址</td>
				<td width="40%"><%=redirect_url%></td>
			</tr>
			<tr>
				<td class="td_lable">redirect_intranet_url</td>
				<td width="35%">客户端回掉内网地址</td>
				<td width="40%"><%=redirect_intranet_url%></td>
			</tr>
			<tr>
				<td class="td_lable">display</td>
				<td width="35%">认证页展示方式</td>
				<td width="40%"><%=display%></td>
			</tr>
			<tr>
				<td class="td_lable">scope</td>
				<td width="35%">授权范围</td>
				<td width="40%"><%=scope%></td>
			</tr>
			<tr>
				<td class="td_lable">ssoenabled</td>
				<td width="35%">单点登出(配为1则启用)</td>
				<td width="40%"><%=ssoenabled%></td>
			</tr>
			<tr>
				<td class="td_lable">getToken</td>
				<td width="35%">尝试获取授权令牌</td>
				<td width="40%" class="td_con"><%=token%></td>
			</tr>

		</table>
	</div>
	<script type="text/javascript">
	
		if ("false" == $('#isAdmin').val().trim()) {
			alert("抱歉，您不是管理员，无权限访问此页。");
			CloseWebPage();
		}
		$(document).ready(function() {
			epoint.common.buildHead(5);
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
