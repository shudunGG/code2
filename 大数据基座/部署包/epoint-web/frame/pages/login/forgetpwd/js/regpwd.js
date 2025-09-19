(function(win, $) {
	// 本页面请求使用sm2加密
	var useSm2Encrypt = true;
	var smsurl = Util.getRightUrl("rest/shellverifycode/send");// 发送短信接口地址
	//var loginurl = Util.getRightUrl('frame/pages/login/login');// 登录页

	// 发送短信验证码
	var isIdentcodeRequesting;
	$('#sendSms').click(function() {
		// 获取手机号、图形验证码输入值
		var phone_control = mini.get('mobile');
		var code_control = mini.get('codeinput');
		var phone = phone_control.getValue();
		var codeinput = code_control.getValue();

		if (isIdentcodeRequesting) {
			epoint.showTips('接口不通', {
				state : 'warning'
			});
			return;
		}
		isIdentcodeRequesting = true;

		// 发送请求获取验证码
		$.ajax({
			url : smsurl,
			dataType : 'JSON',
			type : 'POST',
			data : {
				mobile : phone,
				verifyType : smstype,
				verifyId : this.id
			},
			success : function(data) {
				if (data.status.code == 0) {
					epoint.showTips(data.status.text, {
						state : 'warning'
					});
				}
				else {
					$('#sendSms').addClass("hidden").next().removeClass("hidden");
					identcodeTimer();
				}
				isIdentcodeRequesting = false;
			}
		})
	});

	function identcodeTimer() {
		if (parseInt(identCodeCount) > 0) {
			$('#sendSms').next().html(identCodeCount + 's');
			setTimeout(function() {
				identCodeCount--;
				identcodeTimer();
			}, 1000);
		} else {
			identCodeCount = identCodeCountInit;
			$('#sendSms').removeClass("hidden").next().addClass("hidden");
		}
	}
	// 按钮点击事件
	$('.login-txtbtn').click(function() {
		location.href = otherurl;
	});
	$('#submit').click(function() {
		submit();
	});
	$('.login-btn').click(function() {
		showNext(2);
	});

	// 提交
	function submit() {
		if (epoint.validate()) {
			if ('03' == smstype) {// 忘记密码页对密码加密
				var pwd = Util.encryptSM2(mini.get('password').getValue());
				mini.get('password').setValue(pwd);
			}
			epoint.execute(regfunc, 'fui-form', '', msgCallBack);
		}
	}
	// 回调提醒
	function msgCallBack(data) {
		var msg = data.msg;
		if (msg) {
			if (data.success) {
				epoint.showTips(msg, {
					state : 'success'
				});
				if ('03' == smstype) {// 忘记密码
					goStep(4);
				}
				showNext(1);
			} else {
				if ('03' == smstype) {// 忘记密码页对密码解密
					// var pwd =
					// Util.decryptSM2(mini.get('password').getValue());
					mini.get('password').setValue("");
					mini.get('passwordqr').setValue("");
				}
				epoint.alert(msg, '', '', 'warning');
			}
		}
	}

	// 最后两步特殊操作
	function showNext(step) {
		if ('1' == step) {// 点击最后按钮跳转到成功标签事件，maincontent为成功标签上一标签的id
			$('#maincontent').addClass('hidden').next().removeClass('hidden');
			lastcountTimer();
		} else if ('2' == step) {// 最后成功标签的跳转登录页事件
			location.href = loginurl;
		}
	}
	var lastcount = 5;
	var lastcounthtml = $('#lastcount').html();
	function lastcountTimer() {
		if (parseInt(lastcount) > 0) {
			$('#lastcount').html(lastcounthtml + lastcount + 's');
			setTimeout(function() {
				lastcount--;
				lastcountTimer();
			}, 1000);
		} else {		
			showNext(2);
		}
	}

})(this, jQuery);
/** ********************需要页面控件或其他js调用的方法不能放在封装js中*********************** */
var reg = /^.{6,}$/; // 全是数字或全是字母 (弱)
var reg1 = /^((?![a-z]+$)(?![A-Z]+$)(?!\d+$)(?![!@#$%^&*_]+$)).{6,}$/; // 复杂度为长度不小于6位，且拥有小写、大写字母、数字、特殊字符4种组合中的2种(中)
var reg2 = /^((?![a-z\d]+$)(?![A-Z\d]+$)(?![a-z!@#$%^&*_]+$)(?![a-zA-z]+$)(?![A-Z!@#$%^&*_]+$)(?![\d!@#$%^&*_]+$)).{6,}$/; // 复杂度为长度不小于6位，且拥有小写、大写字母、数字、特殊字符4种组合中的3种

// 数据格式个性化验证统一方法
function onValidation(e) {
	var sender = e.sender;// 控件具体信息
	if (e.isValid) {
		if ('loginid' == sender.id) {
			if (e.value.length < 6 || e.value.length > 20) {
				e.errorText = "字符长度必须在6~20位";
				e.isValid = false;
			} else if (!/^[_0-9a-zA-Z]*$/.test(e.value)) {
				e.errorText = "用户名格式不正确";
				e.isValid = false;
			}
		} else if ('passwordqr' == sender.id) {
			var password = mini.get('password').getValue();
			if (password != e.value) {
				e.errorText = "确认密码不一致";
				e.isValid = false;
			}
		} else if ('cardnum' == sender.id) {
			var cardtype = mini.get('cardtype').getValue();
			if ('01' == cardtype) {// 身份证
				if (!/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/
						.test(e.value)) {
					e.errorText = "身份证号格式不正确";
					e.isValid = false;
				}
			} else {// 其他卡暂时设置大写字母数字组合
				if (!/^[0-9A-Z]*$/.test(e.value)) {
					e.errorText = "证件号码格式不正确，正确格式：大写字母和数字组合";
					e.isValid = false;
				}
			}
		} else if ('oucode' == sender.id) {
			if (!/^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/
					.test(e.value)) {
				e.errorText = "统一社会信用代码格式不正确";
				e.isValid = false;
			}
		}
	}
}

// 前往某个步骤
function goStep(step) {
	var $activeStep = $('#step-item-' + step);
	$activeStep.addClass('active').siblings().removeClass('active')
			.removeClass('finished');
	$activeStep.prevAll().addClass('finished');
}

// 显示某个步骤的div，最后一步由submit统一控制不可用此方法
function showStep(step) {
	var $activeStep = $('.step-content:eq(' + (parseInt(step) - 1) + ')');
	$activeStep.removeClass('hidden').prev().addClass('hidden');
}

var pwd = mini.get('password');
var $fieldStatus = $('.field-status');

pwd.on('keyup', function() {
	var val = pwd.getValue();
	if (val.match(reg2)) {
		$fieldStatus.removeClass('weak strong middle').addClass(
				'weak middle strong');
	} else if (val.match(reg1)) {
		$fieldStatus.removeClass('weak strong middle').addClass('weak middle');
	} else if (val.length > 0) {
		$fieldStatus.removeClass('weak strong middle').addClass('weak');
	} else {
		$fieldStatus.removeClass('weak strong middle');
	}

})