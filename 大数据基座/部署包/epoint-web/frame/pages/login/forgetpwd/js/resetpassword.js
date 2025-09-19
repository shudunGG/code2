(function(win, $) {
	// 初始化请求
	epoint.initPage('frameforgetpwdaction', '', function(data) {
		if(data && data.smsTimeOut){
        	identCodeCount = data.smsTimeOut;
        	identCodeCountInit = data.smsTimeOut;
        }
	});

	// 验证账号
	$('#checkLoginInfo').click(function() {
		checkLoginInfo();
	});
	function checkLoginInfo() {
		if (epoint.validate()) {
			epoint.execute('checkLoginInfo', 'fui-form', '', loginInfoCallBack);
		}
	}
	function loginInfoCallBack(data) {
		var msg = data.msg;
		if (msg) {
			if (data.success) {
				epoint.showTips(msg, {
					state : 'success'
				});
				goStep(2);
				showStep(2);
				// 查出用户后刷新控件值
				epoint.refresh('fui-form');
			} else {
				epoint.alert(msg, '', '', 'warning');
				epoint.refresh('passwordverifycode');
			}

		}
	}
	
	var $input = $('.forget-input'), $loginBtn = $('.entry-active');

	$input.on('keypress', function(event) {
		if (event.which == 13) {
			$loginBtn.filter(":visible").trigger('click');
		}
	});

	// 验证身份
	// 前往手机号验证
	$('#checkIdentity1').click(function() {
		showStep(3);
	});
	// 前往人工验证
	$('#checkIdentity2').click(function() {
		showStep(4);
	});
	// 前往人工验证
	$('#checkIdentity3').click(
			function() {
				// 从第二步前往第四步
				$('.step-content:eq(3)').removeClass('hidden').prev().prev()
						.addClass('hidden');
			});

	function identity3CallBack(data) {
		var msg = data.msg;
		if (msg) {
			if (data.success) {
				epoint.showTips(msg, {
					state : 'success'
				});
			} else {
				epoint.alert(msg, '', '', 'warning');
			}

		}
	}
	// 返回选择验证方式
	$('#checkIdentity4').click(
			function() {
				// 从第四步返回第三步
				$('.step-content:eq(1)').removeClass('hidden').next().next()
						.addClass('hidden');
			});
	$('#checkIdentity5').click(
			function() {
				// 从第四步返回第-步
				$('.step-content:eq(0)').removeClass('hidden').next().next()
						.addClass('hidden');
				goStep(1);
			});
	// 手机号等验证身份
	$('#checkIdentity').click(function() {
		checkIdentity();
	});
	function checkIdentity() {
		if (epoint.validate()) {
			epoint.execute('checkIdentity', 'fui-form', '', identityCallBack);
		}
	}
	function identityCallBack(data) {
		var msg = data.msg;
		if (msg) {
			if (data.success) {
				epoint.showTips(msg, {
					state : 'success'
				});
				goStep(3);
				// 从第三步前往第五步
				$('.step-content:eq(4)').removeClass('hidden').prev().prev()
						.addClass('hidden');
			} else {
				epoint.alert(msg, '', '', 'warning');
			}

		}
	}

})(this, jQuery);