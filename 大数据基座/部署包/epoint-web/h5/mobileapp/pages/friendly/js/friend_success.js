/**
 * 作者： 孙尊路
 * 创建时间： 2017/06/16 13:27:09
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 邮件-邮件详情
 * 编号：P002 
 */

"use strict";
Util.loadJs([
	'pages/common/common.js',
], function() {
	customBiz.configReady();

});

/**
 * @description 所有业务处理
 */
var customBiz = {
	// 初始化校验，必须调用
	// 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功

	configReady: function() {
		var self = this;

		Config.configReady(null, function() {
			customBiz.initListeners();

		}, function(error) {});

	},
	//全局变量
	initListeners: function() {
		var self = this;
		// 成功提示文本
		var successText = Util.getExtraDataByKey('successText') || "操作成功";
		// 成功操作按钮
		var successBtn = Util.getExtraDataByKey('successBtn') || "立即前往";
		// 默认传"1"; 连续关闭 前1个页面；连续关闭前面2个页面
		self.popPageNumber = Util.getExtraDataByKey('popPageNumber') || "1";
		var tmpInfo = {
			successText: successText,
			successBtn: successBtn
		};
		var template = document.getElementById("template").innerHTML;
		var output = Mustache.render(template, tmpInfo);
		document.querySelector('.mui-content').innerHTML = output;

		// 设置完成
		ejs.navigator.setRightBtn({
			which: 0,
			text: "完成",
			// 设置图片的优先级会较高
			success: function(result) {
				// 兼容快速调用
				self.closePage();
			}
		});
		//拦截导航栏左侧的返回按钮，拦截后原有返回功能不再有
		ejs.navigator.hookBackBtn({
			success: function(result) {
				self.closePage();
			}
		});
		// 保存邮件
		ejs.navigator.hookSysBack({
			success: function(result) {
				self.closePage();
			}
		});
		//立即前往
		document.querySelector('.em-button-forword').addEventListener('tap', function() {
			self.closePage();
		});
	},
	/**
	 * 关闭当前页面
	 */
	closePage: function() {
		var self = this;

		// 兼容快速调用，关闭页面
		ejs.page.close({
			// 默认传"1"; 连续关闭 前1个页面；连续关闭前面2个页面
			popPageNumber: self.popPageNumber,
			// 需要传递给上一个页面的数据
			resultData: {
				test: "test"
			},
		});

		// 作用：Android环境下需要唤醒resume，来告诉最页面的那个页面执行刷新操作
		ejs.storage.setItem({
			"refresh": '1'
		});

	}
};