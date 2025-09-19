访问路径：项目名/目录/index.jsp。
需要保证WEB-INF下有包含lib目录和web.xml文件！

自定义版本检测：
修改common.jsp中classList，写入用来检测的包名+类名，然后会根据写入内容检测到对应jar包的版本号。

自定义jar包冲突检测：
修改jarduplicatelist.jsp中classList，写入用来检测的包名+类名，然后会根据写入内容检测是否有多个jar包会加载此类（即有冲突）。
对于第三方jar包（目前按不含epoint关键字判断），不提供自定义，仅判断名称是否相同。

自定义过滤器模板配置：
将对应版本的过滤器顺序写入xml目录下，文件名按照F大版本号.小版本号，如F9.1。仅需提供<filter-class>即可。
如需修改默认模板（未检测到版本号或者版本对应模板不存在），需修改filterlist.jsp中filename，目前为F9.2.xml.。
xml文件具体格式请查看xml目录下F9.2.xml。



PS：修改根目录的情况下，需要修改filterlist.jsp文件中readVersionXML(version,request.getSession().getServletContext().getRealPath("/")+"check\\xml");这里边的路径需要手动修改。
