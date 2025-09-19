为了性能以及避免miniui源码的泄露，在发布时必须要删除以下未压缩过的js：
fui/js/dist目录中的
	frame.js
	miniui.js
fui/js/miniui目录中的
	miniui.js
	ext目录
	
在发布时，需要把cssboot.js中的debug改为false

对于前端界面UI的集成，请务必参考：
http://192.168.200.159:81/f9fedocs/#page=pluginIntegrationGuid.php