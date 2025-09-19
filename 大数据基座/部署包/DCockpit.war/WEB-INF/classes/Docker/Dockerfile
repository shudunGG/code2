FROM registry.epoint.com.cn/base/epoint_alpine_tomcat:v1.12
COPY App /usr/local/tomcat/webapps/DCockpit
RUN chmod 777 /usr/local/tomcat/webapps/eiAnalyse/frame/pages/eianalysemis/cockpit/cockpitnorm/phantomjs_linux/bin/phantomjs
COPY App/WEB-INF/classes/front /usr/share/fonts