webapp/fui/epoint/js/uc为基础框架自定义用户控件的存放目录

控件文件组织规范：
uc
|-controlname
	|-images			// 控件css涉及的图片
	|	|-xx1.png
	|	|-xx2.png
	|-controlname.js    // 控件js
	|-controlname.css   // 控件css
	|-controlname.tpl   // 控件模板
	|-controlname.json  // 控件数据结构说明（用于与后台CommonDto对接）

如何进行自定义用户控件的编写，请参考：
http://192.168.200.159:81/f9LayoutDocs/#page=userControl.php

上述规范对项目组开发同样适用，不过uc目录需要项目组人员自行创建，不可混入框架目录中
