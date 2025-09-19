# fui 目录结构说明

> 从 9.3.3 版本开始，框架的前端资源目录结构进行了调整，之前的版本我们还是会单独维护的。

## css 目录

css 目录是框架公共样式资源目录，里面包含：

- fonts 目录。字体图标资源，主要是模块图标

- images 目录。图片资源目录

- themes 目录。与公共样式相关的主题皮肤资源。

- common 目录。公共样式 css 资源目录，里面将原 common.css 文件按照功能模块拆分成一个个独立的 css 文件。

- common.css 文件。由 common 目录中的 css 文件合并出的总文件。

- modicons.css 文件。模块图标 css 文件。

### themes 目录

themes 目录放的是与公共样式相关的主题皮肤资源，其结构如下：

- grace `以主题名字命名的文件夹`

  - skins `名字固定为 skins ，用来存放主题下的所有皮肤资源`

    - default `以皮肤名字命名的文件夹， default 为默认皮肤，不需要有`

      - images `图片资源`

      - skin.css `皮肤css文件，名字固定为 skin.css`

    - xxx皮肤

      - images

      - skin.css

- xxx主题

  - skins

    - default

      - images

      - skin.css

### common 目录

common 目录为公共样式 css 资源目录，里面各文件的说明如下：

- common.reset.css 浏览器样式重置相关

- common.util.css 基础工具样式类

- common.form.css 表单样式类

- common.leftright.css 左右布局样式类

- common.accordions.css 手风琴布局样式类

- common.contentpage.css contentPage 布局样式类

- common.others.css 其他页面相关公共样式类

## js 目录

js 目录是框架 js 资源目录，里面包含：

- common 目录。核心 js 资源目录。

- epoint 目录。页面级的 js 资源目录。

- miniui 目录。 miniui 资源目录。

- libs 目录。第三方基础 js 库资源目录。

- widgets 目录。第三方或我们自己开发的组件资源目录。

- dist 目录。自动化合并压缩后资源存放目录。

- cssboot.js 文件。

- jsboot.js 文件。

### common 目录

common 目录是框架核心 js 资源目录，里面包含下面这些 js 文件：

- common.util.js 基础工具方法

- common.leftright.js 左右布局解析

- common.form.js 表单布局解析

- common.contentpage.content.js contentPage 布局中的 content 区域解析

- common.contentpage.condition.js contentPage 布局中的 condition 区域解析

- common.contentpage.notice.js contentPage 布局中的 notice 区域解析

- common.contentpage.advancedsearch.js contentPage 布局中的高级搜索

- common.accordions.js 手风琴布局解析

- common.master.js 页面导航模板解析

- common.extend.js 页面其他功能的扩展，主要是对页面全局效果、事件等的处理

- common.dto.js 原 commondto.js 文件

### miniui 目录

miniui 目录是 miniui 控件的资源目录，其结构如下：

- ext 目录。框架层面对 miniui 控件的重写和扩展。

- local目录。miniui 语言包。

- plugin目录。基于 miniui 开发的增强控件功能的插件。

- themes目录。miniui 主题皮肤样式资源。

  - action 目录。控件相关操作图标资源

  - default 目录。默认样式资源。

  - grace 目录。grace主题的皮肤资源。

  - xxx 目录。xxx 主题的皮肤资源。

- miniui.js。miniui js 源码。

## pages 目录

pages 目录是框架前端基础页面资源目录，里面包含：

- desktop 目录。我的桌面页面。

- msgsound 目录。框架新消息声音提醒页面资源。

- pagechoose 目录。主题界面选择页面。

- themes 目录。框架主题界面页面资源。

  - grace 目录。 grace 主题界面。

    - images 目录。 主界面相关图片资源目录。

    - skins 目录。 主题中的皮肤资源目录。

    - grace.css 文件。主界面 css 文件。

    - grace.html 文件。主界面 html 文件。

    - grace.js 文件。主界面 js 文件。

    - grace.tpl 文件。主界面相关模板文件，最终会写到主界面 js 文件中。

    - grace.proto.html文件。主界面前端原型页面文件。

## docs 目录

docs 目录是框架前端资源的说明文档目录，包含：

-  changelog.md 文件。前端更新日志。

- readme.md 文件。前端目录结构说明。