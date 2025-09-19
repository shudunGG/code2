# Tomcat基础镜像，版本拿仓库中最新的
FROM registry.epoint.com.cn/base/epoint_alpine_tomcat_jdk:v0.1

# 拷贝项目到容器内/usr/local/tomcat/webapps文件夹下
COPY App /usr/local/tomcat/webapps/epoint-web

ENV appbasepath /usr/local/tomcat
LABEL appbasepath="/usr/local/tomcat" volumes="dockerize:/usr/local/bin/dockerize;" appnames="epoint-web"
