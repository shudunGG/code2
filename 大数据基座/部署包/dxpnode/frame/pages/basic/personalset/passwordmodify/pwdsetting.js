// 密码规则
// 不启用=0，默认不启用,
// 1=必须长度8位以上
// 2＝长度8位以上，且拥有小写、大写字母、数字、特殊字符4中组合中的两种，
// 3＝长度8，组合3种以上
//var rulesObj = {
//    _getCount: function (v) {
//        var arr = [];
//        if ((v || '').length < 8) {
//            return 0;
//        }
//        if (/\d/.test(v)) {
//            arr.push(1);
//        }
//        if (/[a-z]/.test(v)) {
//            arr.push(1);
//        }
//        if (/[A-Z]/.test(v)) {
//            arr.push(1);
//        }
//        // 特殊字符 非空格、字母 数字 全部当做特殊字符
//        if (/[^a-zA-Z0-9]/.test(v)) {
//            arr.push(1);
//        }
//        return arr.length;
//    },
//    '0': {
//        description: '请输入密码',
//        fn: function (v) {
//            return v && true;
//        }
//    },
//    '1': {
//        description: '密码长度8位及以上',
//        fn: function (v) {
//            // TODO
//            return (v || '').length >= 8;
//        }
//    },
//    '2': {
//        description: '8位以上，且包含小写、大写字母、数字、特殊字符中的两种',
//        fn: function (v) {
//            return this._getCount(v) >= 2;
//        }
//    },
//    '3': {
//        description: '8位以上，且包含小写、大写字母、数字、特殊字符中的三种',
//        fn: function (v) {
//            return this._getCount(v) >= 3;
//        }
//    }
//};

var $beginBtn = $('#set-btn'),
    $notEditBtn = $('#skip-btn'),
    $okBtn = $('#enter-btn'),
    $pwdBox = $('#pwd-box'),
    $setBox = $('.pwd-box-step.step-1', $pwdBox),
    $formBox = $('.pwd-box-step.step-2', $pwdBox),
    $pwdRuleTips = $('.pwd-tips-row', $pwdBox),
    $oldPwd = $('#oldpwd'),
    $pwd1 = $('#pwd-new1'),
    $pwd2 = $('#pwd-new2');

//var rsaKey;
//
//epoint.execute("rsapublickeyaction.getRSAPublicKey", "@none", function (data) {
//  rsaKey = RSAUtils.getKeyPair(data.publicExponent, "", data.modulus);
//}, true);

var currDescription = '';
var currRuleFn = function (password) {
	var flag = true;
	if(password) {
		Util.ajax({
	        url: epoint.dealRestfulUrl('mypasswordmodifyaction/checkPasswordComplex'),
	        data:{
	        	'password' : Util.encryptSM2(password)
	        },
	        async:false
	    }).done(function (data) {
	    	if(data.success) {
				$pwd1.closest('.pwd-form-row').removeClass('error').addClass('success');
				$pwd1.next().addClass('hidden');
				$pwd1.next().attr('title', '');
				$pwd2.closest('.pwd-form-row').removeClass('error').addClass('success');
				$pwd2.next().addClass('hidden');
				$pwd2.next().attr('title', '');
			}
			else {
				if(data.msg) {
					currDescription = data.msg;
					$pwd1.closest('.pwd-form-row').addClass('error').removeClass('success');
	    			$pwd1.next().removeClass('hidden');
	    			$pwd1.next().attr('title', currDescription);
	    			$pwd2.closest('.pwd-form-row').addClass('error').removeClass('success');
	    			$pwd2.next().removeClass('hidden');
	    			$pwd2.next().attr('title', currDescription);
				}
				flag = false;
			}
	    });
	}
	return flag;
};

// 获取密码规则
function getPwdRule() {
    return Util.ajax({
        url: getPwdRuleUrl
    }).done(function (data) {
        // 是否强制修改
        if (data.fouceEdit) {
            // 隐藏按钮
            $notEditBtn.addClass('hidden');
            // $beginBtn.css('margin-top', 60);
        } else {
            // 显示按钮
            // $beginBtn.css('margin-top', 30);
            $notEditBtn.removeClass('hidden').on('click', function () {
                Util.ajax({
                    url: notToModifyUrl
                }).done(function () {
                    redirectCallBack();
                });
            });
        }
    });
}

getPwdRule();

$beginBtn.on('click', function () {
    $formBox.show();
    $setBox.hide();
});

// 如果是重置密码
if (window.isResetPwd) {
    $oldPwd.on('blur keyup', function () {
        var v = this.value,
            $this = $(this),
            $tips = $this.next(),
            $inputRow = $this.closest('.pwd-form-row');
//        $tips.removeClass('hidden');
//        if (check(v, $inputRow, $tips)) {
//            $inputRow
//                .removeClass('error')
//                .addClass('success');
//            $tips.attr('title', '');
//            $okBtn.prop('disabled', false);
//        } else {
//            $okBtn.prop('disabled', true);
//        }
    });
}

$pwd1.on('blur keyup', function () {
    var v = this.value,
        $this = $(this),
        $tips = $this.next(),
        $inputRow = $this.closest('.pwd-form-row');
//    $tips.removeClass('hidden');

//    if (check(v, $inputRow, $tips)) {
//        $inputRow
//            .removeClass('error')
//            .addClass('success');
//        $tips.attr('title', '');
//        $okBtn.prop('disabled', false);
//    } else {
//        $okBtn.prop('disabled', true);
//    }

});

$pwd2.on('blur keyup', function () {
    var v = this.value,
        $this = $(this),
        $tips = $this.next(),
        $inputRow = $this.closest('.pwd-form-row');
//    $tips.removeClass('hidden');
//    if (check(v, $inputRow, $tips)) {
//        $inputRow
//            .removeClass('error')
//            .addClass('success');
//        $tips.attr('title', '');
//        $okBtn.prop('disabled', false);
//    } else {
//        $okBtn.prop('disabled', true);
//    }
});

$('input[type="password"]')
    .on('focus', function () {
        $(this)
            .next().addClass('hidden')
            .closest('.pwd-form-row')
            .removeClass('error')
            .addClass('active')
            .siblings()
            .removeClass('active');
    })
    .on('blur', function () {
        $(this)
            .closest('.pwd-form-row')
            .removeClass('active');
    })
    .on('keypress', function (e) {
        if (e.which === 13) {
            var $this = $(this),
                tabIndex = $this.attr('tabindex');
            $this.blur();
            foucusNext(tabIndex);
        }
    });
// 确定按钮点击
var isInSaving = false;
$okBtn.on('click', function () {
	if (!check($pwd1[0].value, $pwd1.closest('.pwd-form-row'), $pwd1.next())) {
		return;
	}
	
    if (!$(this).prop('disabled') && !isInSaving) {
        var pwd = $pwd2.val();
        var data = {
            newPwd: Util.encryptSM2(pwd)
        };
        // 如果是用户修改密码 则会包含原始密码
        if (window.isResetPwd) {
            data.oldPwd = Util.encryptSM2($oldPwd.val());
        }
        // 阻止用户连续请求
        isInSaving = true;
        savePwd(data).done(function () {
            isInSaving = false;
        }).fail(function () {
            isInSaving = false;
        });
    }
}).on('keypress', function (e) {
    if (e.which === 13) {
        $(this).trigger('click');
    }

});

function disableOkBtn() {
    $okBtn.prop('disabled', true);
}

function checkEnableOkBtn() {
    var allOk = true,
        $inputRows = $pwdBox.find('.pwd-form-row');
    $inputRows.each(function (i, item) {
        var $item = $(item);
        if ($item.is(':visible') && !$item.hasClass('success')) {
            allOk = false;
        }
    });

    if (allOk) {
        $okBtn.prop('disabled', false);
    }

}

function foucusNext(tabIndex) {
    tabIndex = +tabIndex;
    if (tabIndex === 3) {
        // 最后一个直接触发点击
        setTimeout(function () {
            $okBtn.trigger('click');
        });
    } else {
        // 否则光标移入下一个
        $('[tabIndex="' + (tabIndex + 1) + '"]').focus();
    }
}

function savePwd(pwdData) {
    return Util.ajax({
        url: savePwdUrl,
        data: pwdData
    }).done(function (data) {
        if (data.success) {
            epoint.alert(data.msg || '密码修改成功，下次请使用新密码登录', '系统提醒', function () {
                // 保存成功 TODO
                if (window.isResetPwd) {
                    // 用户修改
                    afterUserPwdModify();
                } else {
                    // 首次重置成功
                    redirectCallBack();
                }
            });
        } else if (data.msg) {
            epoint.alert(data.msg);
        }
    });
}
var $oldPwdRow = $oldPwd.parent();
var $pwd1Row = $pwd1.parent();
var $pwd2Row = $pwd2.parent();

function check(v, $inputRow, $tips) {
    var oldV = $oldPwd.val(),
        v1 = $pwd1.val(),
        v2 = $pwd2.val();
    // 空白判断
    if (/\s/.test(v)) {
        $inputRow.removeClass('success').addClass('error');
        $tips
            .attr('title', '密码中不能存在空白字符');
        return false;
    }

    if (window.isResetPwd) {
        // 规则判断 原始密码不需要
        if (!$inputRow.hasClass('old-pwd')) {
            if (!currRuleFn(v)) {
                $inputRow
                    .removeClass('success')
                    .addClass('error');
                $tips.attr('title', currDescription);
                return false;
            }
        }
        // 重置密码的 密码必填
        if (!oldV.length) {
            $inputRow
                .removeClass('success')
                .addClass('error');
            $tips.attr('title', '必须输入原始密码');
            return false;
        }
        // 重置密码的 原密码和新密码不能相同
        if (!$inputRow.hasClass('old-pwd')) {
            if (oldV == v) {
                $inputRow
                    .removeClass('success')
                    .addClass('error');
                $tips.attr('title', '新密码不能和原始密码相同');
                return false;
            }
        }
    }

    // 两次输入密码的  都有输入时才进行相同判断
    if (v1 && v2) {
        // 是否相等
        if (v1 !== v2) {
            $pwd1.closest('.pwd-form-row').addClass('error').removeClass('success');
			$pwd1.next().removeClass('hidden');
			$pwd1.next().attr('title', '两次密码不一致');
			$pwd2.closest('.pwd-form-row').addClass('error').removeClass('success');
			$pwd2.next().removeClass('hidden');
			$pwd2.next().attr('title', '两次密码不一致');
            return false;
        }
        
        if (!currRuleFn(v1)) {
        	return false;
        }
        

        $pwd1Row.removeClass('error')
            .addClass('success').find('.pwd-info')
            .attr('title', '');
        $pwd2Row.removeClass('error')
            .addClass('success').find('.pwd-info')
            .attr('title', '');
    } else {
        if (v1 && currRuleFn(v1)) {
            $pwd1Row.removeClass('error')
                .addClass('success').find('.pwd-info')
                .attr('title', '');
        }
        if (v2 && currRuleFn(v2)) {
            $pwd2Row.removeClass('error')
                .addClass('success').find('.pwd-info')
                .attr('title', '');
        }
        // 都有输入才通过
        return false;
    }

    return true;
}