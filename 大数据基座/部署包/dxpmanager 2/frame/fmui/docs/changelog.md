### 20171013

- (guotq)更新部分ejs API，如`refreshToken`
    
- (guotq)增加标准v7规范的自动token注入，只需要开启配置参数`isAutoProxy`即可自动注入token
    
- (guotq)修改`Gallery`,`MinireRresh`,`pulltorefresh`,`indexedlist`内部的注入参数`isAutoProxy`默认为`false`
    
- (guotq)增加`isAutoDealError`参数，开启后会默认处理ajax返回错误的场景
    
- (guotq)更新`移动app v7接口规范`中的V7输入格式与返回格式

### 20170919

- (guotq)去除token自动注入，修复minirefresh bug，更新ejs

- (TODO)后续需要一个人重构工作流模块

### 20170913

- (guotq)修复`VerifyCode`组件的大写验证不通过bug

### 20170821

- (guotq)更新`7.0.1`版本，修复部分bug，如

    - `ejs 2.x`调用`configvalue`重复调用问题
    
    - `ajax`无法处理`code`为`1`的问题
    
    - 细节优化，本次更新为无缝更新，`7.0.0`可以直接覆盖升级

### 20170727

- (guotq)debug模式引入`vConsole`

### 20170720

- (guotq)接口规范改为全小写，同步更新所有示例

### 20170713

- (guotq)增加了`showcase`快速发布功能，重新规划了`showcase`目录下的结构

### 20170712

- (guotq)`Util`工具类基本重构完毕

- (guotq)`UI`组件`FileInput`，`百度地图`等重构完毕

### 20170707

- (guotq)优化`dataProcess`的处理

- (guotq)重构典型示例，列表，详情

### 20170706

- (guotq)重构部分`Util`，如`string`与`html`等

- (guotq)内部增加`Promise`的支持，去除`Deferred`

- (guotq)重写`Ajax`，支持`Promise`

### 20170630

- (guotq)统一`timeline`类名

- (guotq)`slider`组件增加上下滚动配置

- (guotq)`mui.extend.css`增加text-nowrap与text-ellipsis

### 20170629

- (guotq)优化`addrselect`组件的滚动条

### 20170628

- (guotq)更新地区选择组件`addrselect`的说明文档

- (guotq)完善tabview滑动、更新`tabview`组件的说明文档

- (guotq)开发设计`slider`组件

### 20170627

- (guotq)将一些常用样式加入mui.extend.css

- (guotq)在showcase里加入一个常用列表样式customlist

### 20170623

- (guotq)gulpfile引用jsboot，文件打包配置只会再依赖于jsboot一个文件

- (guotq)gulpfile引用cssboot，增加css核心文件打包和压缩功能，便于拓展框架的css

### 20170622

- (zhyan)更新了zepto.min.js，该zepto包含：zepto核心、event、ajax、deferred

- (guotq)制定`m7组件设计规范`，并且按要求重构好`下拉刷新`，`图片轮播`，`ajax`等组件与工具方法

- (guotq)重新拆分`common.js`，便于以后维护

### 20170712

- (guotq)重构了`地区选择`、`九宫格解锁`、`tabview`

### 20170721

- (guotq) 将 `地区选择`、`Slider`、`formvalidateor` 均重构了一下，修改了下使用方式

### 20170727

- (guotq) 解决`tabview`组件当中，子节点无法被选中问题

### 20170807 

- (guotq) 解决`tabview`组件当中，多层嵌套标题出现的节点不正确，解决了回调函数不传报错的问题