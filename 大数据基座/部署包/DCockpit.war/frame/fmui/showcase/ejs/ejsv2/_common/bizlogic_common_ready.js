/**
 * 作者: guotq
 * 创建时间: 2017/05/25
 * 版本: [1.0, 2017/05/25 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: ejs页面ready的通用操作 
 */
(function(exports) {

	function ready(fileArray, callback) {
		if(typeof fileArray === 'function') {
			callback = fileArray;
			fileArray = null;
		}
		fileArray = fileArray || [];
		
		// 如果已经有3.0的，先消除
        Config.ejsVer != 2 && (window.ejs = undefined);
		/**
		 * 默认会取到html或者pages的上一层级
		 * 如果要取更上一级的路径，需要自己取根路径进行拼凑
		 */
		Util.loadJs(
		    // 如果不是2.0的ejs 额外引入
            Config.ejsVer != 2 ? 'js/ejs/v2/epoint.moapi.v2.js' : '',
            Config.ejsVer != 2 ? [
                // 默认引入ejs h5 dd所有的支持库作为示例展示
                'js/ejs/v2/epoint.moapi.v2.h5mui.js',
                'js/ejs/dingtalk.js',
                'js/ejs/v2/epoint.moapi.v2.dd.js'
            ] : '',
			'./_common/bizlogic_common_default.js',
			'./_common/bizlogic_common_ejs_default.js',			
			fileArray,
			function() {

				// 默认是h5环境的。所以ejs.os.h5设置是没有意义的
				// ejs.os.ejs = true;
				// ejs.os.dd = false;

				ejs.error(function(error) {
					mui.alert("ejs错误提示:" + JSON.stringify(error));
				});
				// v2中没有config，只有ready
				ejs.ready(function() {
					callback && callback();
				});
			});
	}

	window.Util = window.Util || {};
	Util.bizlogic = Util.bizlogic || {};
	Util.bizlogic.ready = ready;
})({});