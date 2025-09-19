(function(window) {
	if (!window.Util) {
		window.Util = {};
	}
	Util.getExplorerInfo = function() {
		var explorer = window.navigator.userAgent.toLowerCase();
		var ver;
		// ie
		if (explorer.indexOf("msie") >= 0) {
			ver = explorer.match(/msie ([\d.]+)/)[1];
			return {
				type : "IE",
				version : ver
			};
		}
		// firefox
		else if (explorer.indexOf("firefox") >= 0) {
			ver = explorer.match(/firefox\/([\d.]+)/)[1];
			return {
				type : "Firefox",
				version : ver
			};
		}
		// Chrome
		else if (explorer.indexOf("chrome") >= 0) {
			ver = explorer.match(/chrome\/([\d.]+)/)[1];
			return {
				type : "Chrome",
				version : ver
			};
		}
		// Opera
		else if (explorer.indexOf("opera") >= 0) {
			ver = explorer.match(/opera.([\d.]+)/)[1];
			return {
				type : "Opera",
				version : ver
			};
		}
		// Safari
		else if (explorer.indexOf("Safari") >= 0) {
			ver = explorer.match(/version\/([\d.]+)/)[1];
			return {
				type : "Safari",
				version : ver
			};
		}
		// 手机端
		else {
			return {
				type : "IE",
				version : "none"
			};
		}
	};
}(this));

var LOGIN_MODE = {
	'0' : 'account',
	'10' : 'usbkey',
	'30' : 'mobile'
};

var getLoginType = function(val) {
	for ( var key in LOGIN_MODE) {
		if (LOGIN_MODE[key] == val) {
			return key + '';
		}
	}

	return '0';
};
var initClickEvent = function() {
	var win = this;
	var $ = jQuery;
	var $name = $('#username'), $pwd = $('#psd'), $usbpsd = $('#usbpsd'), $phone = $('#phone'), $identCode = $('#identCode'), $codeinput = $("#code-input"), $usbcodeinput = $("#usbcode-input");

	var loginType = getLoginType(params.mode);
	// switch (loginType) {
	// case 'account':
	// loginType = '0';
	// break;
	// case 'mobile':
	// loginType = '30';
	// break;
	// case 'usbkey':
	// loginType = '10';
	// break;
	// }
	// console.log(loginType);
	// win.changeLoginType = function(type) {
	// if ('10' == type) {
	// // 获取usbkey
	// var key = checkUsbKey();
	// if (key) {
	// $("#warn").hide();
	// $("#right").show();
	// } else {
	// $("#warn").show();
	// $("#right").hide();
	// }
	// }
	// loginType = type;
	// };

	var userName;
	var passWord;
	var verifycode;
	var rememberMe;

	win.encryUserMsg = function() {
		var result = true;

		if ('0' == loginType) {
			userName = $.trim($name.val());
			passWord = $.trim($pwd.val());

			var codeinput = $.trim($codeinput.val());
			if (!$("#verifycode-box").is(":hidden")) {
				if (!codeinput) {
					result = false;
					epoint.showTips('验证码不能为空!', {
						state : 'warning'
					});
					return false;
				}
			}
			var codedata = mini.get("verifyCode").getValue();
			verifycode = codeinput + '#' + codedata + "#verifyCode";
			var isCheck = mini.get('check').getValue();

			if (!(userName && passWord)) {
				result = false;
				epoint.showTips('用户名和密码不能为空!', {
					state : 'warning'
				});
				return false;
			}
			
			if(isCheck == 'false'){
				epoint.alert('请阅读并勾选《新点数据集成开发平台隐私保密声明》');
				return false;
			}
		} else if ('10' == loginType) {
			userName = checkUsbKey();
			passWord = $.trim($usbpsd.val());

			var codeinput = $.trim($usbcodeinput.val());
			/*if (!$("#usbverifycode-box").is(":hidden")) {
				if (!codeinput) {
					result = false;
					epoint.showTips('验证码不能为空!', {
						state : 'warning'
					});
					return false;
				}
			}*/
			var codedata = mini.get("usbVerifyCode").getValue();
			verifycode = codeinput + '#' + codedata;

			if (!(userName && passWord)) {
				result = false;
				epoint.showTips('未检测到CA锁或者未填写密码!', {
					state : 'warning'
				});
				return false;
			}
		} else if ('30' == loginType) {
			userName = $.trim($phone.val());
			passWord = $.trim($identCode.val());
			if (!(userName && passWord)) {
				result = false;
				epoint.showTips('手机号和验证码不能为空!', {
					state : 'warning'
				});
				return false;
			}
		}

		// 本地保存登录类型 和 用户名 用于快捷登录中的自动切换和填充
		if (window.localStorage) {
			localStorage.setItem('_loginType_', loginType);
			localStorage.setItem('_loginUsername_', userName);
		}

		var abcd = encode('张鸥');
		// 调用自定义编码
		// userName = epoint.encode(userName);
		// passWord = epoint.encode(passWord);

		// 调用SM2加密
		// 避免中文登录名的问题，先进行utf-8编码 edit by mjjia on 2019-06-28
		userName = epoint.encodeUtf8(userName);
		userName = Util.encryptSM2(userName);

		passWord = epoint.encodeUtf8(passWord);
		passWord = Util.encryptSM2(passWord);
		// 记住我
		rememberMe = $(".remember").hasClass('active');
		epoint.execute('loginaction.login', '', [ userName, passWord,
				loginType, rememberMe, verifycode ], checkMultipleLogin);

		return result;
	};

	win.checkMultipleLogin = function(args) {
		if (args.systemMessages) {
			if (args.systemMessages.indexOf('此账号') != -1) {
				var msgs = args.systemMessages.split('?');
				epoint.confirm(msgs[0] + '?', '', function() {
					epoint.execute('loginaction.login', '', [ userName,
							passWord, '20', rememberMe ], checkMultipleLogin);
				});
			} else if (args.systemMessages.indexOf('IsDefaultOU') != -1) {
				var userguid = args.systemMessages.split('?')[1];
				var url = "frame/pages/login/switchparttime?userguid="
						+ userguid + "&isLoginPage=true";
				epoint.openDialog("账号选择", url, secondLogin, {
					'width' : 850,
					'height' : 350
				});
			} else {
				epoint.showTips(args.systemMessages, {
					state : 'warning'
				});
				if (args.showVerifyCode) {
					var tabTypeParams = JSON.parse($.cookie('loginStyle'));
					if ('account' == tabTypeParams.mode) {
						if (!$("#verifycode-box").is(":hidden")) {
							epoint.refresh([ 'verifyCode' ]);
						}
						showVerifyCode();
					} else if ('usbkey' == tabTypeParams.mode) {
						if (!$("#usbverifycode-box").is(":hidden")) {
							epoint.refresh([ 'usbVerifyCode' ]);
						}

						showUsbVerifyCode();
					}
				}
			}
		}
	};

	win.secondLogin = function(result) {
		if (result && result != 'success' && result != 'close') {
			var msgs = result.split(";");
			// TODO 下面这段逻辑需要重新考虑实现,后台的
			var userName;
			var passWord;
			if ('0' == loginType) {
				userName = $.trim($name.val());
				passWord = $.trim($pwd.val());
				var codeinput = $.trim($codeinput.val());
				var codedata = mini.get("verifyCode").getValue();
				verifycode = codeinput + '#' + codedata + '#verifyCode';
			} else if ('10' == loginType) {
				userName = checkUsbKey();
				passWord = $.trim($usbpsd.val());
				var codeinput = $.trim($usbcodeinput.val());
				var codedata = mini.get("usbVerifyCode").getValue();
				verifycode = codeinput + '#' + codedata +'#usbVerifyCode';
			} else if ('30' == loginType) {
				userName = $.trim($phone.val());
				passWord = $.trim($identCode.val());
			}
			epoint.execute('loginaction.userLogin', '', [ loginType, msgs[1],
					msgs[2], epoint.encode(userName), epoint.encode(passWord), rememberMe, verifycode],
					userLoginCallBack);
		} else if(result == 'success' && result != 'close') {
			win.location.reload();
		} else if (result != 'success' && result == 'close') {
			// 直接关闭窗口时，执行一下登出请求，防止多账号模式下重复登录问题
			$.get(Util.getRootPath() + "rest/logout?isCommondto=true");
		}
	};

	win.userLoginCallBack = function(args) {
		if (args.systemMessages) {
			epoint.showTips(args.systemMessages, {
				state : 'warning'
			});
		}
	}

	function checkUsbKey() {
		var str;
		try {
			str = document.all('EliteIVGetSerialNumber').SERIAL_NUMBER();
		} catch (e) {
			epoint.showTips("当前浏览器不支持", {
				state : 'warning'
			});
			return false;
		}
		return str;
	}

	function encode(input) {
		// 先进行utf-8编码,解决中文问题
		input = epoint.encodeUtf8(input);

		// 对所有字符做ascii码转换
		var output = "", chr1 = "", i = 0, l = input.length;
		do {
			// 取字符的ascii码
			chr1 = input.charCodeAt(i++);
			// 偏移比较复杂，这里做个递减
			chr1 -= i;
			// =分割便于后台解析
			output = output + "=" + (chr1);
		} while (i < l);

		return output;
	}

};

var $verityCode = $('#verifycode-box'), $usbVerityCode = $('#usbverifycode-box'), $login = $('#brainLogin'), $cube = $('#cubeTransition'), $tabview = $('#tabview');

var showVerifyCode = function() {

	if (!$verityCode.hasClass('hidden')) {
		// 改变验证码
		// todo
		// 清空输入框值
		$('input', $verityCode).val('');
	} else {
		$verityCode.removeClass('hidden');
		$login.css('height', '480px');
		$cube.css('height', '480px');
		$tabview.css('height', '284px');
	}

}

var showUsbVerifyCode = function() {

	if (!$usbVerityCode.hasClass('hidden')) {
		// 改变验证码
		// todo
		// 清空输入框值
		$('input', $usbVerityCode).val('');
	} else {
		$usbVerityCode.removeClass('hidden');
		$login.css('height', '400px');
		$cube.css('height', '425px');
		$tabview.css('height', '284px');
	}

}

var params;
$(function() {
	if (Util.getUrlParams()) {
		if (Util.getUrlParams().session_control_kickout_key == "1") {
			alert("您的账号在另一地点登录，已被迫下线。");
		}
	}

	// 初始化页面元素
	if (window.initUrl) {
		Util
				.ajax({
					url : Util.getRightUrl(initUrl),
					data : {
						query : 'init-page'
					},
					success : function(data) {
						if (data) {
							var title = data.title, logoImg = data.logoImg, loginTypes = data.loginTypes, showDriveDownload = data.showDriveDownload === undefined ? true
									: data.showDriveDownload, showMobileOADownload = data.showMobileOADownload === undefined ? true
									: data.showMobileOADownload;

							if (title) {
								document.title = title;
							}

							if (logoImg) {
								//document.getElementById('logo-img').src = Util
								//		.getRightUrl(logoImg);

							}

							// 调整需要显示的登录类型
							if (loginTypes) {
								var types = loginTypes.split(','), type, $tabview = $('#tabview'), tabview = $tabview
										.data('Tab');
								$tabview.find('[data-role="tab"]').addClass(
										'hidden');
								for (var i = 0, l = types.length; i < l; i++) {
									type = LOGIN_MODE[types[i]];

									if (type) {
										$tabview.find(
												'[data-target="' + type + '"]')
												.removeClass('hidden');

									}
								}

							}

							if (!showDriveDownload) {
								$('#drive-download').addClass('hidden');
							}

							if (!showMobileOADownload) {
								$('#mobile-download').addClass('hidden');
							}

							if (data.isFailureLogin) {
								var tabTypeParams = JSON.parse($
										.cookie('loginStyle'));
								if ('account' == tabTypeParams.mode) {
									showVerifyCode();
								} else if ('usbkey' == tabTypeParams.mode) {
									showUsbVerifyCode();
								}
							}

							adjustLoginType();
						}
					}
				});
	}

	// 开启电脑动画
	$('#computer').addClass('active');

	// 申明对象
	var $login = $('#brainLogin');

	// 设置cookie,记录登录方式
	var setCookie = function() {
		$.cookie('loginStyle', JSON.stringify(params), {
			expires : 7
		});
	};

	// 翻转特效
	var cubeTransition = function() {
		var length = $('#cubeTransition>div').length, current = 1, next = 1, outClass, inClass, onGoing = false;
		$('#cubeTransition>div:eq(' + (current - 1) + ')').show()

		for (i = 0; i < length; i++) {
			var bullet = $("<li></li>");
			if (i == 0)
				bullet.addClass('active');
			$("#bullets").append(bullet);
		}

		function openIndex(i, type) {
			if (!onGoing && next != i) {
				onGoing = true;
				next = i
				outClass = current > i ? 'rotateCubeBottomOut top'
						: 'rotateCubeTopOut top'
				inClass = current > i ? 'rotateCubeBottomIn'
						: 'rotateCubeTopIn';
				show()
			}
			params.type = type;
			setCookie();

		}

		function trans(direction) {
			if (!onGoing) {
				onGoing = true;
				if (direction == 'up') {
					next = current > 1 ? current - 1 : length;
					outClass = 'rotateCubeBottomOut top';
					inClass = 'rotateCubeBottomIn';
				} else {
					next = current < length ? current + 1 : 1;
					outClass = 'rotateCubeTopOut top';
					inClass = 'rotateCubeTopIn';
				}
				show();
			}
		}

		function show() {
			$('#cubeTransition>div:eq(' + (current - 1) + ')').addClass(
					outClass);
			$('#cubeTransition>div:eq(' + (next - 1) + ')').addClass(inClass);
			$('#bullets>li:eq(' + (current - 1) + ')').removeClass('active');
			$('#bullets>li:eq(' + (next - 1) + ')').addClass('active');
			$('#cubeTransition>div:eq(' + (next - 1) + ')').show();
			setTimeout(function() {
				$('#cubeTransition>div:eq(' + (current - 1) + ')').hide();
			}, 500);
			setTimeout(function() {
				$('#cubeTransition>div:eq(' + (current - 1) + ')').removeClass(
						outClass);
				$('#cubeTransition>div:eq(' + (next - 1) + ')').removeClass(
						inClass);
				current = next;
				onGoing = false;
			}, 800);
		}

		$('#cubeTransition').on('click', '#code', function() {
			openIndex(2, 1);
		}).on('click', '#brain', function() {
			openIndex(1, 0);
		});
	};

	// IE，翻转取消，直接切换
	var checkIE = function() {
		var gather = Util.getExplorerInfo();
		if (gather.type == "IE") {
			if (gather.version == "7.0" || gather.version == "8.0") {
				$('.keepOut').addClass('hidden');
			}
			$('#cubeTransition').removeClass('NOIE');

			$('#cubeTransition').on(
					'click',
					'#code',
					function() {
						params.type = 1
						setCookie();
						$('.example').eq(1).removeClass('hidden').siblings()
								.addClass('hidden');
					}).on(
					'click',
					'#brain',
					function() {
						params.type = 0
						setCookie();
						$('.example').eq(0).removeClass('hidden').siblings()
								.addClass('hidden');
					});

		} else {
			$('.example').removeClass('hidden');
			cubeTransition();
		}
	};

	checkIE();

	// 登录方式切换
	var initTab = function(mode) {
		var $tabview = $('#tabview');
		var activeIndex = $tabview.find('[data-target="' + mode + '"]').index();

		if (activeIndex < 0) {
			activeIndex = 0;
		}
		initClickEvent();

	};

	var adjustLoginType = function() {
		// 判断登录方式
		if ($.cookie('loginStyle') == null
				|| typeof ($.cookie('loginStyle')) == 'underfined') {
			var _setting = {
				"type" : 0, // 0,1，普通登录，扫码登录
				"mode" : 'account'
			// account,mobile,key，账号登录，手机验证 ，USB key
			};
			$.cookie('loginStyle', JSON.stringify(_setting), {
				expires : 7
			});
			params = _setting;
			initTab(_setting.mode);
		} else {
			params = JSON.parse($.cookie('loginStyle'));
			switch (params.type) {
			case 0:
				initTab(params.mode);
				break;
			case 1:
				$('#code').click();
				initTab('account');
				break;
			}
		}
	};

	// 监测输入框内容
	var checkInput = function(i) {
		var $p = $('.tabCon').eq(i), $input = $('input', $p);
		for (var i = 0; i < $input.length; i++) {
			if ($input.eq(i).val() == "") {
				if ($input.eq(i).hasClass('user')) {
					$p.find('.infoError').addClass('error')
						.html('请输入用户名/手机/邮箱')
					$input.eq(i).addClass('active');
					break;
				}
				if ($input.eq(i).hasClass('password')) {
					$p.find('.infoError').addClass('error').html('密码不能为空')
					$input.eq(i).addClass('active');
					break;
				}
				if ($input.eq(i).hasClass('codeinput')
						&& !$("#verifycode-box").is(":hidden")) {
					$p.find('.infoError').addClass('error').html('验证码不能为空')
					$input.eq(i).addClass('active');
					break;
				}
			}

		}
	}

	// 选择地区、手机验证发送验证码、显示密码
	var $national = $('#national'), $nationList = $('#nationList'), $getCode = $('#getCode'), $eye = $('.eye'), time = 60;

	var checkTime = function() {
		if (time > 0) {
			$getCode.html(time + 's').addClass('disable');
			time--;
			setTimeout(function() {
				checkTime()
			}, 1000);
		} else {
			$getCode.html('获取验证码').removeClass('disable');
			time = 60;
		}
	}

	$getCode.click(function() {
		var phone = $('#phone').val();
		if (phone == "") {
			epoint.showTips('请先输入手机号', {
				state : 'warning'
			});
			return false;
		}
		if (!$(this).hasClass('disable')) {
			checkTime();
		}
		Util.ajax({
			url : epoint.dealRestfulUrl('loginaction/sendShortMassage'),
			data : {
				mobile : phone
			}
		});

	});

	$national.click(function() {
		$nationList.css({
			display : 'block'
		});
	});

	$nationList.on('click', '.areacode-item', function() {
		var code = $(this).data('code');
		$national.html(code);
	});

	$eye.click(function() {
		if ($(this).hasClass('disable')) {
			$(this).prev()[0].type = 'password';
		} else {
			$(this).prev()[0].type = 'text';
		}
		$(this).toggleClass('disable');
		;
	});

	window.addEventListener('click', function(e) {
		if (e.target.id != 'national') {
			$nationList.css({
				display : 'none'
			});
		}
	});

	$('.remember').click(function() {
		$(this).toggleClass('active');
	})

	// Enter键监测
	$('body').bind('keypress', function(e) {
		var evt = e || window.event;
		var keyCode = evt.keyCode || evt.which || evt.charCode;
		if (keyCode == 13 && params.type == 0) {
//			var i = $('.option').index($('.option.active'));
//			checkInput(i);
//			$('.submit').eq(i).click();
			
			encryUserMsg();

		}
	});

	// 输入框验证
	var $accountLogin = $('#accountLogin');
	var gather = [ {
		id : "username",
		text : ""
	}, {
		id : "password",
		text : ""
	} ];

	// 账号登录验证
	$accountLogin
			.validate({
				errorPlacement : function(error, element) {
					var $infoError = $('.infoError', $accountLogin), id = element[0].id, text = error[0].innerText;
					for (var i = gather.length - 1; i >= 0; i--) {
						if (gather[i].id == id) {
							gather[i].text = text;
							break;
						}
					}

					for (var i = 0; i < gather.length; i++) {
						if (gather[i].text != "") {
							$infoError.html(gather[i].text).addClass('error');
							break;
						} else {
							$infoError.html('').removeClass('error');
						}
					}
					;
				},
				success : function(element) {
				},
				rules : {
					username : {
						required : true
					},
					password : {
						required : true,
						minlength : 5
					}
				},
				messages : {
					username : {
						required : "账号不能为空"
					},
					password : {
						required : "密码不能为空",
						minlength : "密码长度不能小于 5 个字母"
					},
				},
				// onsubmit: function(element) {
				// $(element).valid();
				// },
				// onfocusout: false,
				// onkeyup: false,
				// onclick: false,
				onfocusout : function(element) {
					$(element).valid();
				},
				submitHandler : function() {
					if (!$accountLogin.valid()) {
						return;
					} else {
						$('.infoError', $accountLogin).html('').removeClass(
								'error');
					}
					var params = $accountLogin.serializeArray();
					console.log(params);
				}
			});

	var $phoneLogin = $('#phoneLogin');
	var gatherP = [ {
		id : "phone",
		text : ""
	}, {
		id : "identCode",
		text : ""
	} ];

	// 手机验证
	$phoneLogin
			.validate({
				errorPlacement : function(error, element) {
					var $infoError = $('.infoError', $phoneLogin), id = element[0].id, text = error[0].innerText;
					for (var i = gatherP.length - 1; i >= 0; i--) {
						if (gatherP[i].id == id) {
							gatherP[i].text = text;
							break;
						}
					}

					for (var i = 0; i < gatherP.length; i++) {
						if (gatherP[i].text != "") {
							$infoError.html(gatherP[i].text).addClass('error');
							break;
						} else {
							$infoError.html('').removeClass('error');
						}
					}
					;

					if (id == 'phone') {
						element.parent().addClass('active');
					}
				},
				success : function(element) {
					var id = element[0].htmlFor;
					if (id == 'phone') {
						$('.phone').removeClass('active');
					}
				},
				rules : {
					phone : {
						required : true,
						phonenumber : true
					},
					identCode : {
						required : true,
						minlength : 6,
						maxlength : 6
					}
				},
				messages : {
					phone : {
						required : "手机号不能为空",
						phonenumber : "手机号格式有误"
					},
					identCode : {
						required : "验证码不能为空",
						minlength : "验证码长度为6位数",
						maxlength : "验证码长度为6位数"
					},
				},
				onfocusout : function(element) {
					$(element).valid();
				},
				submitHandler : function() {
					if (!$phoneLogin.valid()) {
						return;
					}
					var params = $phoneLogin.serializeArray();
					// console.log(params);
				}
			});

	$('input').placeholder();
});