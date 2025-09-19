/**
 * 作者： sunzl
 * 创建时间： 2017/07/13 12:53:24
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：   页面下载sss
 */
'use strict';

var customBiz = {
    configReady: function() {
        var self = this;

        // 初始化
        self.initConfig();
        // 点击安装
        mui('.mui-content').on('tap', '#install', function() {
            var downloadUrl = this.getAttribute('downloadUrl');
            var platform = document.getElementById('plat').innerHTML;
            var tmpV = document.getElementById('ver').innerHTML;
            var version = tmpV.substr(0, tmpV.indexOf('<'));

            self.judgeENV(function(tips) {
                var fromUrl = window.location.href;
                var url = fromUrl.substr(0, fromUrl.indexOf('/d/')) + '/rest/mobileappclient/updatecount';
                var data = JSON.stringify({
                    'platform': platform,
                    'version': version,
                    'appguid': self.getExtraDataByKey('appguid')
                });

                mui.ajax(url, {
                    data: data,
                    dataType: 'json', // 服务器返回json格式数据
                    type: 'post', // HTTP请求类型
                    timeout: 50000, // 超时时间设置为10秒；
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function(result) {
                        // 服务器返回响应，根据响应结果，分析是否登录成功；
                        // console.log(JSON.stringify(result));
                        location.href = downloadUrl;
                    },
                    error: function(xhr, type, errorThrown) {
                        // 异常处理；
                        console.log(JSON.stringify(xhr));
                        location.href = downloadUrl;
                    }
                });
            });

        });

        // 点击应用图标
        mui('.mui-content').on('tap', '.em-logo', function() {
            var downloadUrl = this.parentNode.querySelector('#install').getAttribute('downloadUrl');

            self.judgeENV(function(tips) {
                location.href = downloadUrl;
                /* if(!tips) {
					location.href = downloadUrl;
				} else {
					mui.toast(tips);
				}*/
            });
        });
    },
    /**
	 * 初始化下载配置
	 */
    initConfig: function() {
        var self = this;
        var appguid = self.getExtraDataByKey('appguid');

        if (appguid == '' || appguid == null || appguid == undefined) {
            alert('应用唯一标识为空');

            return;
        }

        var fromUrl = window.location.href;
        // fromUrl = 'http://xd.pkxfzx.com:9089/EMP7/rest/mainPage/getUpdateInfo';
        var url = fromUrl.substr(0, fromUrl.indexOf('/d/')) + '/rest/mobileappclient/getupdateinfo';

        console.log(url);
        var data = JSON.stringify({
            'appguid': appguid
        });

        mui.ajax(url, {
            data: data,
            dataType: 'json', // 服务器返回json格式数据
            type: 'post', // HTTP请求类型
            timeout: 10000, // 超时时间设置为10秒；
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(result) {
                // 服务器返回响应，根据响应结果，分析是否登录成功；
                console.log(JSON.stringify(result));
                if (result.status.code == 1) {
                    var res = result.custom;
                    var info = {};

                    if (app.os.ios) {
                        // .ipa包下载安装地址
                        info = res.iphoneinfo[0];
                        info.sysicon = 'img/img_icon_ios.png';
                        info.downloadUrl = info.plistUrl;
                    } else {
                        // .apk包下载安装地址
                        info = res.andriodinfo[0];
                        info.sysicon = 'img/img_icon_android.png';
                        info.downloadUrl = info.url;
                    }
                    // 渲染数据
                    var templ = document.getElementById('templ').innerHTML;
                    var output = Mustache.render(templ, info);

                    document.querySelector('.mui-content').innerHTML = output;
                    // 初始化
                    self.judgeENV();
                } else {
                    mui.toast(result.status.text);
                }
            },
            error: function(xhr, type, errorThrown) {
                // 异常处理；
                console.log(JSON.stringify(xhr));
            }
        });

    },
    /**
	 * 判断环境
	 */
    judgeENV: function(callback) {
        var self = this;
        // 默认没有特殊的提示
        var specialTips = '';
        var alertTips = '';
        var tipWrapperNode = document.querySelector('.em-tip');
        var tipTxtNode = document.querySelector('.em-tip-left');
        var androidIconNode = document.getElementById('androidIcon');
        var iosIconNode = document.getElementById('iosIcon');

        if (app.os.ios) {
            // ios UC浏览器
            if (app.os.uc) {
                // IOS环境UC浏览器
                specialTips = '您当前使用的是UC浏览器，该浏览器不支持安装App。请在Safari中打开，即可下载';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            } else if (app.os.mobileQQClient) {
                specialTips = '您当前使用的是QQ客户端，该客户端不支持安装App。请在Safari中打开，即可下载';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            } else if (app.os.browserQQ) {
                specialTips = '您当前使用的是QQ浏览器，该浏览器不支持安装App。请在Safari中打开，即可下载';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            } else if (app.os.wechat) {
                specialTips = '点击右上角按钮，然后在弹出的菜单中，请在Safari中打开，即可下载';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            }

            // 隐藏和显示安卓和ios应用图标
            iosIconNode.style.display = 'inline-block';
            androidIconNode.style.display = 'none';

        } else if (app.os.android) {
            // android UC浏览器
            if (app.os.uc) {
                // android环境UC浏览器
                specialTips = '';
            } else if (app.os.mobileQQClient) {
                specialTips = '点击右上角按钮，然后在弹出的菜单中，点击在浏览器中打开，即可安装';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            } else if (app.os.browserQQ) {
                // androidQQ浏览器
                specialTips = '';
            } else if (app.os.wechat) {
                specialTips = '点击右上角按钮，然后在弹出的菜单中，点击在浏览器中打开，即可安装';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            }
            // 隐藏和显示安卓和ios应用图标
            iosIconNode.style.display = 'none';
            androidIconNode.style.display = 'inline-block';
        } else {
            specialTips = '当前为PC浏览器,PC浏览器下无法安装APP,请用手机浏览器打开';
            // 弹出Safari 浏览器下载提示
            tipTxtNode.innerText = specialTips;
            tipWrapperNode.classList.add('em-tip-active');
        }

        // 回调
        callback && callback(specialTips);

    },
    /**
	 * 通过传入key值,得到页面key的初始化传值
	 * 实际情况是获取 window.location.href 中的参数的值
	 * @param {String} key 键名
	 * @return {String} 键值
	 */
    getExtraDataByKey: function(key) {
        if (!key) {
            return null;
        }
        // 获取url中的参数值
        var getUrlParamsValue = function(url, paramName) {
            var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
            var paraObj = {};
            var i,
                j;

            for (i = 0;
                (j = paraString[i]); i++) {
                paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
            }
            var returnValue = paraObj[paramName.toLowerCase()];

            // 需要解码浏览器编码
            returnValue = decodeURIComponent(returnValue);
            if (typeof(returnValue) === 'undefined') {
                return undefined;
            } else {
                return returnValue;
            }
        };
        var value = getUrlParamsValue(window.location.href, key);

        if (value === 'undefined') {
            value = null;
        }

        return value;
    }

    /**
	 *
	 */
};

// 初始化
customBiz.configReady();