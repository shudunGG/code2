/**
 * 全局配置 Config
 */
(function () {
	window.Config = {
		version: "2.0.1",

		// 直接指向前端工程的根目录
		// 如：http://www.zwfw.com/f9xapp/pages/account/login.html，basePath 则为 '/f9xapp',可以单独配置
		basePath: (function () {
			var pname = location.pathname;
			return pname.substring(0, pname.indexOf("/pages/"));
		})(),
		compress: {
			// 是否采用压缩资源
			enabled: 1,
			// 排除的目录或文件
			exclude: [/js\/libs/, /js\/widgets/, /pages\/js/, /pages\/css/, /\.\/js/, /\.\/css/, /\.\/_test/]
		},

		//0：调用后台接口，1：本地Mock，2：本地Mock并输出Mock数据
		isLocalMock: 0,

		//页面跳转时是否带有.html后缀名
		suffix: 1,

		//是否启用rem方案,适用范围1366*768 ~ 1920*1080，设计稿要求1920*1080，最小字号不能低于16
		supportrem:0,

		//[开启supportrem之后生效] 使用rem方案时请在此处配置设计稿的标准
		remWidth: 1920,

		// [开启supportrem之后生效] rem缩放的最小宽度
		minRemWidth: 1366,

		// [开启supportrem之后生效] rem缩放的最大宽度
		maxRemWidth: null,

		//[开启supportrem之后生效] rem单位 计算倍数    px值 / rem2px = rem值
		rem2px: 100,

		niceScroll: {
			show: false,
			cursorcolor: "#ccc",
			cursorborder: "#ccc",
			bouncescroll: false,
			zIndex: 9999
		},

		echartsResize: 0, // 是否使echarts随浏览器缩放自适应

		// 静态资源时间戳，每次发布时调整一次即可，开发阶段可以禁止浏览器缓存
		timestamp: "20200920",

		// 用于公共资源的输出配置，这里用于初始化命名空间，无需修改
		resExport: { css: {}, js: {} },

		// 针对IE的最低兼容性配置，低于该版本，自动载入 浏览器升级 提示
		browserSupport: { ie: "11" },

		//真实系统 url 前缀
		realUrl: "http://yapi.devdemo.trs.net.cn/mock/1958/",

		// 用于每个页面配置接口地址
		// 这里用于初始化命名空间，无需修改
		ajaxUrls: {},

		// 用于所有页面的公共接口地址配置
		// 如有公共接口，如验证登录等，请直接配置在这里
		publicAjaxUrls: {
			isLogin: "_test/isLogin",
			headerPath: "pages/_include/header.html",
			footerPath: "pages/_include/footer.html"
		},

		//页面和接口是否在同域，并且符合F9接口地址规范
		isSameDomain: 0,

		// ajax请求的全局配置
		ajax: {
			// 请求延时默认6秒
			timeout: 6000,

			// 跨域时，是否把cookie相关信息随请求传给后端，使用条件：IE10+，后端开启跨域
			// 目前主要解决PC端开发过程中，跨域的后端session恢复问题。
			withCredentials: 1
		},
		//OAuth相关配置
		oAuth2: {
			open: 0,
			actionUrl: ""
		},
		//CSRF相关配置
		csrf: {
			open: 0,
			CSRF_COOKIE_NAME: "_CSRFCOOKIE",
			CSRF_HD_NAME: "CSRFCOOKIE"
		},
		//是否加密参数
		enableEncodeParam: 0,

		//自定义组件全局引入
		widgets: {
			css: [],
			js: [
				"js/widgets/chosen/chosen.jquery.min.js",
				"js/widgets/pagination/mricode.pagination.js",
				"js/widgets/echarts/echarts.min.js"
			]
		}
	};

	//config载入成功之后运行boot中的pageInit方法初始化页面
	ResBoot.pageInit();
})();
