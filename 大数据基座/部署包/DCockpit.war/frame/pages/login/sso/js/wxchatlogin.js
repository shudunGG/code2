/**
 * 作者： 丁力 创建时间：2018年4月9日08:46:59 版本： [1.0, 2018/04/09] 版权： 江苏国泰新点软件有限公司 描述： 微信登录
 */

"use strict";
Util.loadJs([ 'frame/pages/login/sso/js/util.sha1.js' ], function() {
	Config.configReady([], function() {
		customBiz.configReady();
	});

});
/**
 * @description 所有业务处理
 */
var customBiz = {
	// 初始化校验，必须调用
	// 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功

	configReady : function() {
		var self = this;
		self.initListeners();
	},

	// 全局变量
	initListeners : function() {
		var self = this;
		// 变量声明
		self.photoNode = document.querySelector('.em-head-icon');

		// 判断用户是否登录过
		ejs.storage.getItem({
			"key" : [ "photourl" ],
			success : function(result) {
				var url = result.photourl;
				if (!url) {
					self.photoNode.src = "../images/img_headbg.png";
				} else {
					self.photoNode.src = url;
				}
			},
			error : function(error) {
			}
		});
		// 登录
		mui('.mui-content').on('tap', '.em-login', function() {
			var username = document.getElementById("em-input-username").value;
			var passwd = document.getElementById("em-input-passwd").value;
			self.login(username, passwd);
		});

		// 记住密码
		var check = document.getElementById("em-remember");
		var checkicon = document.getElementById("em-uncheck-icon")
		check.onclick = function() {
			if (checkicon.className == 'em-uncheck-icon') {
				checkicon.classList.add('em-check-icon');
				checkicon.classList.remove('em-uncheck-icon');
			} else {
				checkicon.classList.add('em-uncheck-icon');
				checkicon.classList.remove('em-check-icon');
			}
		}

		// 密码显示隐藏
		var passwdclose = document.getElementById("em-passwdclose-icon");
		var inputpasswd = document.getElementById("em-input-passwd");
		passwdclose.onclick = function() {
			if (passwdclose.className == 'em-passwdclose-icon') {
				inputpasswd.setAttribute('type', 'text');
				passwdclose.classList.add('em-passwdopen-icon');
				passwdclose.classList.remove('em-passwdclose-icon');
			} else {
				inputpasswd.setAttribute('type', 'password');
				passwdclose.classList.add('em-passwdclose-icon');
				passwdclose.classList.remove('em-passwdopen-icon');
			}
		}
	},

	// 登录
	login : function(username, passwd) {
		// 获取openid
		var openid = Util.getExtraDataByKey("openid");
		var data = 'cmdParams=[' + username + ',' + passwd + ',60,' + openid
				+ ']';
		var param = location.search;
		// alert(param);
		Util.ajax({
			url : Config.testurl + 'rest/login/loginaction/login' + param
					+ '&isCommondto=true',
			data : data,
			dataType : "text",
			success : function(result) {
				var code = result.status.code;
				var systemMessages = result.custom.systemMessages;
				if (code == '307') {
					window.location.href = Config.testurl + result.status.url;
				} else if (code == '200' && systemMessages != '') {
					alert(systemMessages);
				}
			},
			error : function(error) {
				alert(error.custom.systemMessages);
			}
		});
	},
	/**
	 * 获取用户信息
	 */
	getUserInfo : function() {
		var self = this;
		// 获取设备ID
		self.getDeviceId();
		var data = {
			params : JSON.stringify({
				"devicenumber" : "48e4a32bb6f2501a"
			})
		};
		Util.ajax({
			url : Config.serverSrcUrl + 'rest/oa9/getuserinfo_guid_v7',
			data : data,
			success : function(result) {
				// console.log(JSON.stringify(result));
				if (result.status.code == "1") {
					var res = result.custom;
					var photourl = Config.serverSrcUrl + res.photourl;
					self.photoNode.src = photourl;
					ejs.storage.setItem({
						"photourl" : photourl,
						"userguid" : res.userguid,
						"loginid" : res.loginid,
						"previewurl" : res.previewurl,
						"ouguid" : res.ouguid,
						"oaversion" : res.oaversion,
						"displayname" : res.displayname,
						"usersignpicture" : res.usersignpicture,
						"sequenceid" : res.sequenceid,
						"ouname" : res.ouname,
						success : function(result) {
							ejs.page.open({
								pageUrl : "./index.html"
							});
						},
						error : function(error) {
						}
					});
				} else {
					ejs.ui.toast(result.status.text);
				}

			},
			error : function(error) {
				console.log(JSON.stringify(error));
			}
		});
	},
	/**
	 * 获取设备ID
	 */
	getDeviceId : function() {
		var self = this;
		console.log(self.access_token);
		var openId = Util.getExtraDataByKey('openId');
		var data = {
			params : JSON.stringify({
				"access_token" : self.access_token,
				"openid" : openId
			})
		};
		Util.ajax({
			url : "https://api.weixin.qq.com/device/get_bind_device",
			data : data,
			success : function(result) {
				// console.log(JSON.stringify(result));
				if (result.status.code == "1") {
					console.log(result);
				} else {
					ejs.ui.toast(result.status.text);
				}

			},
			error : function(error) {
				console.log(JSON.stringify(error));
			}
		});
	}
};