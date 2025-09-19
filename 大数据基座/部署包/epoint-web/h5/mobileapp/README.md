# <font color="#F68736" face="微软雅黑"> 移动OA标准版 - 更新说明文档</font>
## 【产品】移动OA标准版H5 7.3.1
更新说明
#### 新增、修改
* 接口请求参数加密
* 重构待办、邮件、通知公告、分类信息列表样式
* 重构考勤签到页面
* 重构意见反馈页面
* 新增个人名片页面
* 新增更新记录页面


## 【产品】移动OA标准版H5 7.3.0b
更新说明
#### 新增、修改
* 优化默认头像拼接时增加拼接参数；
* 增加获取H5版本页面（ejs.m7.mobileframe.oa/pages/oaversion/index.html）
* 增加如何获取设备验证码页面（ejs.m7.mobileframe.oa/pages/equipments/equipments_operation_guide.html）
* 去除无网络情况下ajax提示abort的优化；
* 修改默认无数据样式；
* 头像加载失败显示更新背景色，最小文字大小；
#### 待办事宜、公文管理
* 优化无移动端表单的友好提示；
* 优化判断手写签批后不必填写意见逻辑；
* 优化待办事宜H5工作流兼容安卓4.4.4；
* 修改待办点击地址的弹出错误；
* 修改手写板组件安卓、IOS组件名称；
* 更新AIP全文签批采用附件上传方式；
* 增加判断手写签批组件版本API；
* 更新待办选人逻辑问题修复；
* 待办处理完成返回列表修改为无感刷新；
* 更新待办步骤签署意见不自动换行问题；
* 更新待办事宜模板文字BUG；
* 显示隐藏签署意见按钮逻辑顺序；
* 优化签署意见批量上传图片逻辑；
#### 首页卡片
* 修改卡片请求去除dataPath防止ajax报错；
* 修复获取步骤接口缺少参数问题；
* 卡片待办增加空白步骤友好提示；
#### 公务邮件
* 修改邮件附件图标显示jpeg不正确问题；
* 增加邮件列表标签显示，优化邮件列表样式；
* 增加邮件列表筛选新增“按条件（标题、发件人、反馈内容）”搜索；
* 新增邮件详情反馈@功能；
* 修复邮件列表首页头像空白问题；
#### 网络硬盘
* 网络硬盘'组织共享、私人共享'改为'组织协作、我的协作'；
* 网络硬盘个人去文件转移，新增功能"转移至根目录"，跟PC端功能同步；
#### 请假管理
* 优化请假管理选择请假类型；
* 请假管理表单详情步骤优化；
#### 通知公告、分类信息
* 优化正文超宽后不能左右滑动的问题；
* 修改详情改变字体后不改变滑动高度问题，修改分类信息列表请求参数缺少问题；
#### 设备安全
* 修改本机样式不居中；
#### 全文检索
* 原业务接口全部用全文检索的接口代替;根据全文检索接口返回的内容，去掉邮件和收发文模块的筛选功能;修改各模块列表点击的打开方式；
* 全文检索导航菜单样式优化；
#### 我的日程
* 我的日程首页——日程列表样式修改


## 【产品】移动OA标准版H5 7.3.0更新说明
* 全面测试优化BUG缺陷；
* 默认头像为蓝底+姓名展示；
* 增加全文检索功能模块；
* 增加设备安全验证功能模块；
* 增加首页卡片功能模块；
#### 待办事宜
* 去除原生工作流组件，使用H5页面实现个性化表单；
* 更新无表单个性化提示；
* 增加可删除不可新增选人逻辑；
* 更新锁定提示，优化锁定后禁止送下一步；
* 更新优化录音权限弹出逻辑；
#### 公文管理
* 修改公文搜索逻辑，以下四种情况都满足：
    1. 仅输入起始时间；
    1. 仅输入终止时间；
    1. 先输入起始时间，再输入终止时间；
    1. 先输入终止时间，再输入起始时间，且终止时间早于起始时间时要有提示；
#### 公务邮件
* 发件人为空兼容列表；
* 更新列表增加免打扰标识；
* 更新查看签收列表全选非全选逻辑；
* 增加查看往来邮件页面；
* 邮件搜索列表样式同步邮件列表；
* 修改邮件详情显示更多部分内容；
* 更新往来邮件页面符合修改后的接口；
* 更新密送人反馈提示暴露身份；
* 去除邮件正文图片时间戳；
* 增加安卓物理返回列表刷新；
#### 通知公告、分类信息
* 优化列表样式；
* 修改不能滑动textarea的bug；
* 修改正文P标签mui默认颜色；
#### 我的日程
* 更新我的日程点击上一个月自动切换！
* 修复代理日程切换逻辑；
* 我的日程——代理人列表头像优化；
* 我的日程-优化代理人日程；
* 我的日程显示具体年月日优化；
* 日程提醒优化；
#### 考勤签到
* 增加列表定位权限申请；
* 增加了百度SDK定位开关；
#### 网络硬盘
* 网络硬盘个人区/共享区列表搜索优化；
* 网络硬盘-个人区-转移文件至另一个文件，遇同名文件，提示优化；
* 网络硬盘-新增文件夹跟重命名弹出层点击取消优化；
* 解决网络硬盘上下滑动时，顶部和底部容器移动的问题；
* 优化网络硬盘页面列表页面样式；
* 网络硬盘-列表重复下载优化；
* 网络硬盘新增文件夹和重命名字数限制；
* 优化网络硬盘顶部；
* 网络硬盘私人共享区权限优化；
* 网络硬盘新增文件夹、重命名字数限制；
#### 请假管理
* 销假详情【取消休假】按钮显隐优化；
* 请假管理——优化出现多个销假草稿的情况；
* 修改从请假详情点击销假，无法送下一步问题；
* 销假表单页，选择非工作日时，请假天数清空；
* 请假管理列表-销假中的请假，状态改为"销假中"；
* 请假管理-不同的请假类型对应的请假类型天数优化；
* 请假管理-销假表单选择非工作日优化；
* 请假管理-优化请假详情/销假详情步骤附件；
* 请假管理-表单详情-流程步骤优化；


## 移动OA标准版H5 7.0.1更新说明
#### 待办事宜
待办详情增加送下一步为底部按钮显示；
待办流程处理完成后显示为返回列表；
待办正文编辑时进审批页面去除上传正文编辑步骤；
修复了待办事宜高级筛选滑动会刷新列表问题；
#### 通用审批页面
重构审批页面，增加流程图查看，语音附件手写签批等附件上传功能；
语音录入低版本安卓兼容问题；
图片预览增加滑动切换；
流程图loading；
优化流程图显示时间换行问题；
#### 公文管理
公文管理列表渲染问题；
#### 公务邮件
写邮件页面回邮件列表无感刷新；
写邮件空白草稿直接返回；
写邮件主题对齐；
修复了[公务邮件] 高级筛选邮件列表显示不正确的问题；
修复了[公务邮件] 转发回复内容位置问题；
修复了[公务邮件] 邮件详情页面结束任务邮件不刷新邮件列表的问题；
邮件附件去除下载；
邮件搜索筛选优化；
删除最后一个邮件后，显示'暂无邮件数据'的图片；
#### 通知公告、分类信息
通知公告列表图片垂直居中；
修复了[通知公告、分类信息] 列表显示问题；
修复了通知公告和分类信息列表修改了文字底部溢出样式错乱的问题；
修复了通知公告和分类信息的反馈详情、修改反馈和添加反馈的字段输入参数，由infoguid改为了feedbackguid，需要找张志鹏更新接口包；
分类信息下一层标题改为对应栏目标题；
通知公告、分类信息反馈底部适配IphoneX，优化ios反馈时滑动对话框消失问题；
#### 我的日程
我的日程全天选项时间显示优化；
添加日程跟PC端界面字段一致；
修改了日程详情、修改日程页面和新增日程一致；
#### 考勤签到
增加定位权限判断；
#### 网络硬盘
更新去除网络硬盘共享区无用排序按钮；
#### 其他
解决了通用文件preview.js增加了预览地址加时间戳存在缓存的问题，兼容复杂下载地址和简单下载地址；

### 须知

【重要】开发人员必须梳理项目模块页面配置说明，以移动OA模块页面配置说明为准，以便后期项目部署（原生人员、项目经理、实施人员）,任何人通过该文档都可以快速实现模块的创建！


#### 待办事宜

> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_index.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_index.html) `待办事宜-列表`
>
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_text.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_text.html) `待办事宜-详情（默认打开原生组件页面） `

> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_form.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_form.html) `待办事宜-表单`
>
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_attach.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_attach.html) `待办事宜列-附件`
>
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_step.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_step.html) `待办事宜列-步骤`
>

__工作流组件配置参数：__
```js
{
	// 中转页面
    "url": "http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/todo/todo_detail_text.html?messageitemguid=ae2c5d13-8fb1-450a-9ecd-434fb6b8943f&type=1&canhandle=1&filetype=",
    // 页面标题
    "title": "审批事项",
    "extras": {
    	// 消息GUID
        "messageitemguid": "ae2c5d13-8fb1-450a-9ecd-434fb6b8943f",
        // 待办类型“1”和“0”，默认传“1”
        "type": "1",
        // 是否可以在移动设备上处理处理。1 可以处理；0 不可以处理；-1 能看不能办",
        "canhandle": "1",
        // 收发文类型待办，传值，sw、fw，其他传空
        "filetype": ""
    }
}
```


#### 公务邮件
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/mail/mail_index.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/mail/mail_index.html) `公务邮件-首页`
>
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/mail/mail_detail.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/mail/mail_detail.html) `公务邮件-详情`
>
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/mail/mail_write.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/mail/mail_write.html) `公务邮件-写邮件`
>

__邮件详情配置参数：__
```js
{
    // 邮件唯一标示
	mailguid: "邮件标识",
	// 邮件类型，100000收件箱，100001已发邮件，100002草稿箱，100003 回收站
	boxtype: "100000"
}
```

__写邮件配置参数：__
```js
{
    // 写邮件
	setTitle: "写邮件",
	// 右上角显示
	setNBRightTxt: "发送"
}
```

#### 通知公告
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/notice/notice_list.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/notice/notice_list.html) `通知公告-首页`
>

#### 分类信息
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/classification/class_primary.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/classification/class_primary.html) `通知公告-首页`
>

#### 公文管理
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/document/doc_index.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/document/doc_index.html) `公文管理-首页`
>

#### 我的日程
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/schedule/sdule_index.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/schedule/sdule_index.html) `我的日程-首页`
>
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/schedule/sdule_write.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/schedule/sdule_write.html) `我的日程-添加日程`
>

__同步日程自定义API配置参数：__

```js
API名称：`synchroSchedule`
调用参数：
{
   data:`参数`
}
```

#### 网络硬盘
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/netdisk/netdisk_homepage.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/netdisk/netdisk_homepage.html) `网络硬盘-首页`
>

#### 考勤签到
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/attendance/attendance_sign.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/attendance/attendance_sign.html) `考勤签到-记录`
>
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/attendance/attendance_location.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/attendance/attendance_location.html) `考勤签到-签到`
>


#### 请假模块
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/leaveword/leaveword_list.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/leaveword/leaveword_list.html) `请假管理-首页`
>

#### 零报告
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/zeroreport/zero_journal.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/zeroreport/zero_journal.html) `请假管理-首页`
>


#### 博客论坛 -首页
> *  [http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/blog/blog_index.html](http://218.4.136.114:7009/H5/ejs.m7.mobileframe.oa/pages/blog/blog_index.html) `博客论坛-首页（V7）`
>
> *  [http://218.4.136.114:7009/H5/V6/ejs.m7.mobileframe.oa/pages/blog/blog_index.html](http://218.4.136.114:7009/H5/V6/ejs.m7.mobileframe.oa/pages/blog/blog_index.html) `请假管理-首页（V6）`
>


#### 正式版源码SVN
> *  `源码：` [svn://192.168.0.51/2017/T10/移动OA标准版7.0/Trunk/code/移动OA类/移动OA_V7/h5/ejs.m7.mobileframe.oa](svn://192.168.0.51/2017/T10/移动OA标准版7.0/Trunk/code/移动OA类/移动OA_V7/h5/ejs.m7.mobileframe.oa)
>
> *  `新点公司发布版地址：` [http://218.4.136.121:8086/oarest9V7/rest/oa9/](http://218.4.136.121:8086/oarest9V7/rest/oa9/)
>
> *  `内部开发版地址：` [http://218.4.136.114:8089/oarest9V7/rest/oa9/](http://218.4.136.114:8089/oarest9V7/rest/oa9/)
>

#### 自动化打包
> *  `项目svn地址：`[svn://192.168.0.51/2014/T10/新点微门户平台/trunk/dcloud/Dcloud项目/标准产品/移动OA7.0/应用包/](svn://192.168.0.51/2014/T10/新点微门户平台/trunk/dcloud/Dcloud项目/标准产品/移动OA7.0/应用包/)

> *  `包名：`[com.epoint.workplatform.oa](永远不变)
>
> *  `应用ID：`[da5e2880-874c-469a-aaaa-d169844f9e39](联系纪红艳或者张志鹏给出)
>
> *  `移动应用管理平台地址：`[http://218.4.136.114:8089/EMP7](联系纪红艳或者张志鹏给出)
>

#### 在线文档地址
> *  [m7框架在线文档](http://app.epoint.com.cn/m7fedoc/) `在线打包`
>
>
>
>

<font color="#F68736"  face="微软雅黑">**负责人：移动研发部-孙尊路**</font>


#### 结尾
