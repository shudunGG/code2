package com.example.demo.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.Filter;
import javax.servlet.Servlet;

/**
 * Druid数据库连接池监控配置
 */
@Configuration
public class DruidConfig {
    
    /**
     * 配置Druid监控页面
     */
    @Bean
    public ServletRegistrationBean<Servlet> druidStatViewServlet() {
        ServletRegistrationBean<Servlet> registrationBean = new ServletRegistrationBean<>(new StatViewServlet(), "/druid/*");
        
        // 监控页面登录用户名和密码
        registrationBean.addInitParameter("loginUsername", "admin");
        registrationBean.addInitParameter("loginPassword", "123456");
        
        // 白名单（为空表示允许所有访问）
        registrationBean.addInitParameter("allow", "");
        
        // 黑名单（deny优先于allow）
        registrationBean.addInitParameter("deny", "");
        
        // 是否能够重置数据
        registrationBean.addInitParameter("resetEnable", "false");
        
        return registrationBean;
    }
    
    /**
     * 配置Web监控过滤器
     */
    @Bean
    public FilterRegistrationBean<Filter> druidWebStatFilter() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>(new WebStatFilter());
        
        // 添加过滤规则
        registrationBean.addUrlPatterns("/*");
        
        // 排除一些不必要的url
        registrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
        
        // 开启session统计功能
        registrationBean.addInitParameter("sessionStatEnable", "true");
        
        // session的最大个数
        registrationBean.addInitParameter("sessionStatMaxCount", "1000");
        
        // 使得druid能够知道是谁发起的数据库操作
        registrationBean.addInitParameter("principalSessionName", "USER_SESSION");
        
        return registrationBean;
    }
}