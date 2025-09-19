/**
 * 作者: guotq
 * 创建时间: 2017/05/24
 * 版本: [1.0, 2017/05/24 ]
 * 版权: 移动研发部
 * 描述: 页面通用模板
 */
(function(exports) {
	"use strict";

	var defaultLitemplate = Util.Clazz.extend({
		/**
		 * 初始化业务模板时,对象创建时会默认执行
		 */
		init: function(options) {
			var self = this;
			options = options || {};
			self.options = options;
			var title = options.title || '';
			self.appDom = document.getElementById(options.contentDom || 'ejs-app');
			if(!self.appDom) {
				throw new Error('错误，不存在appDom');
			}
			// ejs系统
			if(!Util.os.ejs) {
				self.generateHeader(title);
			} else {
				if(title) {
					ejs.navigator && ejs.navigator.setTitle(title);
				}

			}
			// 初始化默认业务
			self.initBiz();
		},
		/**
		 * 基于title生成头部
		 * @param {Strings} title
		 */
		generateHeader: function(title) {
			var self = this;
			var html = '';
			var leftBackClass = !self.options.isIndex ? 'mui-icon-left-nav' : '';
			html += '<header id="header" class="mui-bar mui-bar-nav ">' +
				'<a class="mui-action-back mui-icon ' + leftBackClass + '  mui-pull-left">' +
				'</a>' +
				'<h1 id="title" class="mui-title">' +
				title +
				'</h1>' +
				'<a id="info" class="mui-icon mui-icon-info-filled mui-pull-right">' +
				'</a>' +
				'</header>';

			var headerDom = document.createElement("div");
			headerDom.innerHTML = html;
			document.body.insertBefore(headerDom, self.appDom);
			self.appDom.style.marginTop = '44px';

		},
		/**
		 * 初始化
		 */
		initBiz: function() {
			var self = this;
			// info监听，默认的info监听
			Zepto('#header').on('tap', '#info', function() {
				var tips = '请务必在EJS环境中测试(公司OA即可)';

				alert(tips, '提示', '我知道了');
			});

		},
	});
	
	window.Util = window.Util || {};
	Util.litemplate = Util.litemplate || {};
	Util.litemplate.defaultLitemplate = defaultLitemplate;
})({});