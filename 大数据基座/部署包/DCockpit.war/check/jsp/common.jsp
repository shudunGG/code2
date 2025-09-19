<%--
  Created by IntelliJ IDEA.
  User: wangleai
  Date: 2017/11/20
  Time: 19:13
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8"%>
<%@ page import="java.net.InetAddress,java.net.URL,java.util.*" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.regex.Pattern" %>
<%!
    //其实我更想对应jsp中写逻辑，但是复用有点多就只好把这个方法独立出来了。
    //写入需要检测的各框架框架jar包中必带的class,格式如com.epoint.basic.controller.orga.user.FrameUserListAction
    private static final List<String> classList= Arrays.asList("com.epoint.basic.controller.orga.user.FrameUserListAction");

    private static final Pattern VERSION_PATTERN = Pattern.compile("(-[0-9][0-9a-zA-Z_\\.\\-]*)\\.jar");

    private String frameVersion="unknown";

    public String getFrameVersion(){
        commoninit();
        getVersionByClass();
        return frameVersion;
    }

    private void commoninit(){
        frameVersion="unknown";
    }

    private void getVersionByClass(){
        for(String str:classList){
            String classpath=str.replaceAll("\\.","/")+".class";
            if(!checkClassDuplicate(classpath)){
                try {
                    Class clazz=Thread.currentThread().getContextClassLoader().loadClass(str);
                    String version=getVersion(clazz);
                    if(version != null && version.length() > 0){
                        frameVersion=version;
                        //只检测一个class
                        break;
                    }
                } catch (ClassNotFoundException e) {
                    //我...
                }
            }
        }
    }

    //判断是否冲突
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
                isDuplicate=false;
            }
        } catch (Throwable e) {
            // 防御性容错
        }
        return isDuplicate;

    }

    //得到版本
    private String getVersion(Class cls) {
        String version=null;
        try {
            // 首先查找MANIFEST.MF规范中的版本号
            version = cls.getPackage().getImplementationVersion();
            if (version == null || version.length() == 0) {
                version = cls.getPackage().getSpecificationVersion();
            }
            if (version == null || version.length() == 0) {
                // 如果MANIFEST.MF规范中没有版本号，基于jar包名获取版本号
                String file = cls.getProtectionDomain().getCodeSource().getLocation().getFile();
                if (file != null&&file.length()>0 &&file.endsWith(".jar")) {
                    Matcher matcher = VERSION_PATTERN.matcher(file);
                    while (matcher.find()&&matcher.groupCount()>0) {
                        version = matcher.group(0);
                        version = version.substring(1,version.length()-4);//去掉-前缀.jar后缀
                    }
                }
            }
        } catch (Throwable e) {
            // 防御性容错
        }
        return version;
    }
%>