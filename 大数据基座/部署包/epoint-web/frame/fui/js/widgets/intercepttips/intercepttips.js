(function(win,$){
    var contentHtmlTpl = '<div class="form-row intercept-tip"><i class="mini-iconfont mini-messagebox-warning"></i>{{text}}</div><div class="form-row intercept-action">{{{actionHtml}}}</div>';

    var actionHtml = {
        "picture": '<label class="form-label required">验证码：</label><input id="intercept-verifycode-input" class="mini-textbox mr10" required="true" emptyText="请输入验证码"/><div class="mini-verifycode" id="intercept-verifycode"></div>',
        "password": '<label class="form-label required">密码：</label><input id="intercept-password-input" class="mini-password" style="width:280px" required="true" emptyText="请输入登录用户的密码"/></div>'
    };
    var input,
        verifyCode,
        operationratelimituuid;
        
    var initCallBack = {
        "picture": function(data) {
            data = data.data || data;
            input = mini.get('intercept-verifycode-input');
            verifyCode = mini.get('intercept-verifycode');

            verifyCode.setData(data);
        },
        "password": function(data) {
            input = mini.get('intercept-password-input');
        }
    };

    var okCallBack = {
        "picture": function() {
            var inputVal = input.getValue();
            if(!inputVal) {
                mini.showTips({
                    content: '请输入验证码进行验证',
                    state: 'warning',
                    x: 'center',
                    y: 'center'
                });
                return false;
            } else {
                return doVerify({
                    mode: 'picture',
                    verifyCode: inputVal
                }, function(data) {
                    input.setValue('');
                    mini.showTips({
                        content: '输入的验证码不正确！',
                        state: 'warning',
                        x: 'center',
                        y: 'center'
                    });
                });
            }
        },
        "password": function(data) {
            var password = input.getValue();

            if(!password) {
                mini.showTips({
                    content: '请输入密码进行验证',
                    state: 'warning',
                    x: 'center',
                    y: 'center'
                });
                return false;
            } else {
                return doVerify({
                    mode: 'password',
                    password: password
                }, function(data) {
                    input.setValue('');
                    mini.showTips({
                        content: '输入的密码不正确！',
                        state: 'warning',
                        x: 'center',
                        y: 'center'
                    });
                });
            }
        }
    };

    var verifyUrl;
    var doVerify = function(data, callback) {
        data.operationratelimituuid = operationratelimituuid;
        var result = false;
        // 对密码进行加密处理
        var passWordVar = epoint.encodeUtf8(data.password);
        passWordVar = Util.encryptSM2(passWordVar);
        // 需要服务端验证是否通过，通过才能关闭对话框，所以请求需要同步，不能没法实现等待请求成功后再关闭对话框
        var params = {
                operationratelimituuid: data.operationratelimituuid,
                mode: data.mode,
                password: passWordVar
            };
        $.ajax({
			url : Util.getRightUrl(verifyUrl),
			dataType : 'JSON',
			data: params,
			async : false,
			success : function(data) {
				if(data.custom) {
	                result = true;
	            } else {
	                callback(data);
	            }
			}
		}).done(function(data) {
			
        }).fail(function(msg) {
        	
        });
        
        return result;
    };
    function showBox(data) {
        data = data.customverification || data;
        data = mini.decode(data);
        verifyUrl = data.verifyUrl;
        var mode = data.mode;

        operationratelimituuid = data.operationratelimituuid
        var html = Mustache.render(contentHtmlTpl, {
            text: data.msgcontext,
            actionHtml: actionHtml[mode]
        });
        mini.showMessageBox({
            width: 420,
            title: "提示",
            buttons: ["ok", "cancel"],
            html: html,
            callback: function (action) {
                if(action === 'ok') {
                    return okCallBack[mode]();
                }
            }
        });
        mini.parse();

        initCallBack[mode](data.encode);
    }

    win.showInterceptTips = showBox;
})(this, jQuery);