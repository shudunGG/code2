/**
 * 作者: guotq
 * 创建时间: 2017/05/24
 * 版本: [1.0, 2017/05/24 ]
 * 版权: 移动研发部
 * 描述: 抽象ejs demo演示页面的业务逻辑代码
 */
(function(exports) {
	"use strict";
	
	var listLitemplate = Util.litemplate.defaultLitemplate.extend({
		/**
		 * 初始化
		 */
		initBiz: function() {
			var self = this;
			self._super();
			mui(self.appDom).on('tap', 'li>a', function() {
				var runCode = self.getRunCodeById(this.id);
				runCode && runCode();
			});
			self.generateRunCodeLayout();
		},
		/**
		 * 显示消息
		 * @param {String} msg
		 */
		showTips: function(msg, isAlert) {
			if(isAlert) {
				ejs.nativeUI.alert('提示', msg);
			} else {
				ejs.nativeUI.toast(msg);
			}

		},
		/**
		 * 根据runcode,生成出来在页面显示
		 */
		generateRunCodeLayout: function() {
			var self = this;
			// 获取运行代码并生成示例
			var runCodeData = self.getEjsRunCodeData() || self.options.ejsApi;
			self.runCodeData = runCodeData;
			if(!runCodeData) {
				return;
			}
			self.getRunCodeHtmlByData(runCodeData, function(html) {
				if(html) {
					self.appDom.innerHTML = html;
				}

			});

		},
		/**
		 * 根据传入的id找到对应的执行代码
		 * @param {String} id
		 */
		getRunCodeById: function(id) {
			var self = this;
			if(!id) {
				return;
			}
			var loop = function(data) {
				var runCode;
				if(!Array.isArray(data)) {
					// 如果这个数据本身就是允许代码
					if(data.id == id) {
						runCode = data.runCode;
					} else if(data.items && Array.isArray(data.items)) {
						for(var i = 0, len = data.items.length; i < len; i++) {
							var tmpCode = loop(data.items[i]);
							if(tmpCode) {
								runCode = tmpCode;
								break;
							}
						}
					}

				} else {
					// 这个是父元素
					// for in循环效率较低，但是方便，有一个取舍点
					for(var i = 0, len = data.length; i < len; i++) {
						var tmpCode = loop(data[i]);
						if(tmpCode) {
							runCode = tmpCode;
							break;
						}
					}
				}
				return runCode;
			};
			var runCode = loop(self.runCodeData);

			return runCode;
		},
		/**
		 * 传入数据,然后
		 * @param {JSON} runCodeData 对应数据
		 * @param {Function} callback
		 */
		getRunCodeHtmlByData: function(runCodeData, callback) {
			var self = this;
			var loop = function(data) {
				var html = '';
				if(!Array.isArray(data)) {
					// 如果这个数据本身就是允许代码
					if(!data.items) {
						html += '<li class="mui-table-view-cell">';
						if(data.tag) {
							var classStr = '';
							if(data.tag == 'h5') {
								classStr = ' blue';
							}
							html += '<div class="topleft-triangle'+classStr+'"></div><div class="topleft-text">'+data.tag+'</div>';
						}
						
						html += '<a class="mui-navigate-right" id="' + data.id + '">';
						html += data.text;
						html += '</a>';
						html += '</li>';
					} else if(data.items && Array.isArray(data.items)) {
						for(var i = 0, len = data.items.length; i < len; i++) {
							html += loop(data.items[i]);
						}
					}

				} else {
					// 这个是父元素
					// for in循环效率较低，但是方便，有一个取舍点
					for(var i = 0, len = data.length; i < len; i++) {
						html += loop(data[i]);
					}
				}
				return html;
			};
			var html = '';
			if(runCodeData) {
				html = '<ul class="mui-table-view ">';

				html += loop(runCodeData);

				html += '</ul>';

			}

			callback && callback(html);

		},
		/**
		 * 获取ejs执行代码
		 * @return {JSON} 返回可执行代码
		 */
		getEjsRunCodeData: function() {
			// 以模块划分
			var ejsRunCode = [{
				'id': 'ejs_v1',
				'text': 'ejs_v1',
			}, {
				'id': 'ejs_v2',
				'text': 'ejs_v2',
				'runCode': function() {
					console.log("执行");
				}
			}];

			// 不返回就会默认用options里的
		},
	});

	exports.showTips = function(msg, isAlert) {
		if(isAlert) {
			ejs.nativeUI.alert(msg,'提示');
		} else {
			ejs.nativeUI.toast(msg);
		}

	};
	
	window.Util = window.Util || {};
	Util.litemplate = Util.litemplate || {};
	Util.litemplate.listLitemplate = listLitemplate;
})({});