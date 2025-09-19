/**
 * ! 安全验证弹框 date:2019-10-11 author: [xulb];
 */
(function(win, $) {
	// 模拟手机号
	var phoneCode = $("#mobile").val();

	var $send = $("#send-code"), 
	$second = $(".second"), 
	$remindLine = $(".remind-line"), 
	$wrong = $(".wrong-remind"), 
	$securityverificationcode = $("#securityverificationcode"), 
	$submit2 = $(".submit2"), 
	$close = $(".close"), 
	$smsNo = $('#sms-no'),
	$smsNoText = $('span', $smsNo),
	count = 59, isRequesting;
	
	$send.on("click", function() {
		if (isRequesting)
			return;
		count = 59, $remindLine.removeClass("hidden");
		$wrong.addClass("hidden");
		$submit2.addClass("unable");
		isRequesting = true;
		$.ajax({
			url : Util.getRightUrl("rest/oauth2/sendmessageauthenticationcode"),
			dataType : 'JSON',
			type : 'POST',
			data : {
			},
			success : function(data) {
				if (data.status.code==0) {
					$remindLine.addClass("hidden");
					$(".wrong-remind").html(data.status.text);

					$wrong.removeClass("hidden");
					isRequesting = false;
				} else {
					isRequesting = false;
					$second.removeClass("hidden").prev().addClass("hidden");
					renderSecond();
					if( $securityverificationcode.val().length==6){
						$submit2.removeClass("unable");
					}

					if(data.custom && data.custom.smsno) {
						$smsNo.removeClass('hidden');
						$smsNoText.text(data.custom.smsno);
					} else {
						$smsNo.addClass('hidden');
					}
				}

			}
		})
	});

	function renderSecond() {
		if (count > 0) {
			$second.html(count + 's');
			setTimeout(function() {
				count--;
				renderSecond();
			}, 1000);
		} else {
			codeResult = null;
			$remindLine.removeClass("hidden");
			$wrong.addClass("hidden");
			$second.addClass("hidden").prev().removeClass("hidden");
		}
	}

	function bindEvent() {
		$securityverificationcode.keyup(function() {
			var writeCode = $securityverificationcode.val();
			 if(writeCode.length==6){
				 if (!/^\d+$/.test(writeCode)) {
						$(".wrong-remind").html("验证码必须为数字！");
						$submit2.addClass("unable");
						$remindLine.addClass("hidden");
						$wrong.removeClass("hidden");
					}else{
						$submit2.removeClass("unable");
						$remindLine.removeClass("hidden");
						$wrong.addClass("hidden");
					}
				 
			 }else{
				 $submit2.addClass("unable");
			 }
		});

		// 提交
		$submit2.on("click", function() {
			if (!$submit2.hasClass("unable")) {
			epoint.execute('loginaction.login?isMobileVerification='
					+ $securityverificationcode.val()
					+ '&isSmsNo=' + $smsNoText.text(), '', [
					userName_securityverification,
					passWord_securityverification,
					loginType_securityverification,
					rememberMe_securityverification,
					verifycode_securityverification ], checkMultipleLogin);
			}
		});
	}

	bindEvent();

})(this, jQuery);