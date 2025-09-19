//OAuth2.0认证

(function(win, $) {
    //依赖Cookies组件
    if (!window.Cookies) {
        console.error("require js.cookie.min.js");
        return;
    }
    if (win.OAuth) {
        return;
    }

    var config = {
        basepath: Config.oAuth2.actionUrl,
        action: {
            getappinfo: "/rest/getOauthInfoAction/getAppInfo",      //应用信息接口地址
            gettoken: "/rest/getOauthInfoAction/getAccessToken",      //获取Token接口地址
            gettokenbypwd: "/rest/getOauthInfoAction/getAccessTokenByPwd",      //获取Token接口地址（用户名密码）
            getanonymoustoken: "/rest/getOauthInfoAction/getNoUserAccessToken",      //获取匿名访问Token接口地址
            refreshtoken: "/rest/getOauthInfoAction/refreshAccessToken"   //刷新Token
        },
        isNeedTip: true,
        showErrorMsg: function(msg) {
            console.error(msg);
        }
    };

    // ajax 封装
    var requestdata = function(options) {
        options = $.extend({}, {
            type: 'post',
            dataType: 'json',
            cache: false
        }, options);

        var success = function() { };

        if ($.isFunction(options.success)) {
            success = options.success;

            options.success = null;
            delete options.success;
        }

        if ($.isFunction(options.error)) {
            error = options.error;

            options.error = null;
            delete options.error;
        }

        options.data = {
            params: JSON.stringify(options.data)
        };

        var xhr = $.ajax(options);

        return xhr.done(function(data) {
            var status = data.status, custom = data.custom;
            if (status && (status.code == 0)) {
                if (status.text) {
                    config.showErrorMsg(status.text);
                }
            }
            if (custom && custom.errorText) {
                config.showErrorMsg(custom.errorText);
            }
        }).fail(function(xhr, textStatus, errorThrown) {
            var errMsg = xhr.responseJSON && xhr.responseJSON.error,
                debugMsg = ['请求地址：', this.url, ', 状态码：' + (xhr.status || '超时'), ', 错误信息：', errMsg].join('');
            console.error(debugMsg);
            error(xhr, textStatus, errorThrown);
        }).done(success);
    };

    win.OAuth = function(opts) {
        $.extend(config, opts);
        if (Cookies.get("oauthLoginUrl")) {
            this.oauthLoginUrl = Cookies.get("oauthLoginUrl") + location.href;
            this.oauthLogoutUrl = Cookies.get("oauthLogoutUrl") + "http://" + location.host;
        }
    };

    $.extend(OAuth.prototype, {
        //判断是否初始化
        isInit: function() {
            if (!Cookies.get("oauthClientId")) {
                return false;
            }
            return true;
        },
        //判断是否已经登录
        isLogin: function() {
            if (!Cookies.get("oauthAccessToken")) {
                return false;
            }
            return true;
        },
        //跳转登录页
        goLogin: function() {
            var _this = this;
            window.location.replace(_this.oauthLoginUrl);
        },
        //获取访问Token
        accessToken: function() {
            return Cookies.get("oauthAccessToken");
        },
        //获取匿名Token
        anonymousToken: function() {
            return Cookies.get("noOauthAccessToken");
        },
        //初始化应用的OAuth信息
        initApp: function() {
            var _this = this;
            if (!_this.initAppXhr) {
                _this.initAppXhr = requestdata({
                    url: config.basepath + config.action.getappinfo
                }).done(function(data) {
                    data = data.custom;
                    if (data) {
                        Cookies.set("oauthClientId", data.client_id);
                        Cookies.set("oauthPath", data.ssoPath);
                        Cookies.set("oauthLoginUrl", data.oauthLoginUrl);
                        Cookies.set("oauthLogoutUrl", data.oauthLogoutUrl);
                        _this.oauthLoginUrl = Cookies.get("oauthLoginUrl") + location.href;
                        _this.oauthLogoutUrl = Cookies.get("oauthLogoutUrl") + "http://" + location.host;
                    }
                }).always(function() {
                    _this.initAppXhr = null;
                });
            }
            return _this.initAppXhr;
        },

        //刷新Token
        refreshToken: function() {
            var _this = this;
            if (!_this.refreshTokenXhr) {
                _this.refreshTokenXhr = requestdata({
                    url: config.basepath + config.action.refreshtoken,
                    data: { "refresh_token": Cookies.get("oauthRefreshToken") }
                }).then(function(data) {
                    data = data.custom;
                    if (data.errorText && data.errorText.indexOf("expired_refreshtoken") > -1) {
                        OAuthInstance.goLogin();
                    }
                    else {
                        Cookies.set("oauthRefreshToken", data.refresh_token);
                        Cookies.set("oauthAccessToken", data.access_token);
                    }
                }, function() {
                    OAuthInstance.goLogin();
                }).always(function() {
                    _this.refreshTokenXhr = null;
                });
            }
            return _this.refreshTokenXhr;
        },
        //刷新匿名Token
        refreshAnonymousToken: function() {
            var _this = this;
            if (!_this.refreshAnonymousTokenXhr) {
                _this.refreshAnonymousTokenXhr = requestdata({
                    url: config.basepath + config.action.refreshtoken,
                    data: { "refresh_token": Cookies.get("noOauthRefreshToken") }
                }).then(function(data) {
                    data = data.custom;
                    if (data.errorText && data.errorText.indexOf("expired_refreshtoken") > -1) {
                        return _this.getAnonymousToken();
                    }
                    else {
                        Cookies.set("noOauthRefreshToken", data.refresh_token);
                        Cookies.set("noOauthAccessToken", data.access_token);
                    }
                }, function() {
                    return _this.getAnonymousToken();
                }).always(function() {
                    _this.refreshAnonymousTokenXhr = null;
                });
            }
            return _this.refreshAnonymousTokenXhr;
        },

        // 获取访问Token
        getToken: function(code, redirect_url) {
            var _this = this;
            if (!_this.gettokenXhr) {
                _this.gettokenXhr = requestdata({
                    url: config.basepath + config.action.gettoken,
                    data: { "code": code, "redirect_url": redirect_url }
                }).done(function(data) {
                    data = data.custom;
                    if (data.errorText) {
                        alert("系统错误，请联系管理员！");
                        return;
                    }
                    else {
                        Cookies.set("oauthRefreshToken", data.refresh_token);
                        Cookies.set("oauthAccessToken", data.access_token);
                    }
                }).always(function() {
                    _this.gettokenXhr = null;
                });
            }
            return _this.gettokenXhr;
        },

        //获取匿名Token
        getAnonymousToken: function() {
            var _this = this;
            if (!_this.getAnonymousTokenXhr) {
                _this.getAnonymousTokenXhr = requestdata({
                    url: config.basepath + config.action.getanonymoustoken
                }).done(function(data) {
                    data = data.custom;
                    if (data) {
                        Cookies.set("noOauthRefreshToken", data.refresh_token);
                        Cookies.set("noOauthAccessToken", data.access_token);
                    }
                }).always(function() {
                    _this.getAnonymousTokenXhr = null;
                });
            }
            return _this.getAnonymousTokenXhr;
        },

        //获取需登陆access_token(用户名密码方式)，一般用于自定义登录页
        getAccessTokenByPwd: function(username, password) {
            return requestdata({
                url: config.basepath + config.action.gettokenbypwd,
                data: { "username": username, "password": password },
                async: true,
                success: function(msg) {
                    data = data.custom;
                    if (data) {
                        Cookies.set("oauthRefreshToken", data.refresh_token);
                        Cookies.set("oauthAccessToken", data.access_token);
                    }
                }
            });
        },

        //单点远程登录，实现同步登录统一认证平台
        ssoLogin: function(username, password) {
            var params = {
                isCommondto: true,
                username: username,
                password: password
            };
            $.ajax({
                url: Cookies.get("oauthPath") + "/rest/oauth2/remotelogin",
                data: params,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                cache: false
            }).done(function(data) {

            }).fail(function(msg) {

            });
        },

        //退出登录
        logout: function() {
            var _this = this;
            Cookies.remove("oauthRefreshToken");
            Cookies.remove("oauthAccessToken");
            window.location.replace(_this.oauthLogoutUrl);

        },

        //清除Token
        clearToken: function() {
            Cookies.remove("oauthRefreshToken");
            Cookies.remove("oauthAccessToken");
        }
    });

    win.OAuthInstance = new OAuth();

}(this, jQuery));

