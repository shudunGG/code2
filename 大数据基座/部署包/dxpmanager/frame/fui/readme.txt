为了避免miniui源码的泄露，在发布时必须要删除以下未压缩过的js：
fui/js/dist目录中的
	miniui.js
fui/js/miniui目录中的
	miniui.js
	ext目录
	
在发布时，需要把cssboot.js中的debug改为false

对于前端界面UI的集成，请务必参考：
http://192.168.201.159/f9fedoc/?file=008-%E4%B8%BB%E9%A2%98%E7%95%8C%E9%9D%A2%E5%BC%80%E5%8F%91/003-%E4%B8%BB%E9%A2%98%E7%95%8C%E9%9D%A2%E9%9B%86%E6%88%90%E6%8C%87%E5%8D%97