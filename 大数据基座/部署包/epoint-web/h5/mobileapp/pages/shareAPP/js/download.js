/**
 * 作者： sunzl
 * 创建时间： 2017/07/13 12:53:24
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：   页面下载
 */
'use strict';
var customBiz = {
    configReady: function () {
        var self = this;

        // 初始化
        self.initConfig();
    },
    // 初始化监听
    addEvent: function () {
        var self = this;
        var downBtn = document.querySelector('.em-btn-content');
        var loading = document.querySelector('.loading');
        var showText = document.querySelector('#showtext');
        var modal = document.querySelector('.modal');
        var mask = document.querySelector('.em-mask');

        // 点击安装
        mui('.mui-content').on('tap', '#install', function () {
            var _this = this;
            var downloadUrl = this.getAttribute('downloadUrl');

            self.judgeENV(function (tips) {
                if (tips != '') {
                    mui.alert(tips);

                    return;
                } else {
                    location.href = downloadUrl;
                    if (app.os.ios) {
                        _this.classList.add('download-animation');
                        setTimeout(function () {
                            downBtn.style.display = 'none';
                            loading.style.display = 'block';
                        }, 250);
                        setTimeout(function () {
                            loading.style.display = 'none';
                            showText.style.display = 'block';
                        }, 3000);

                    } else {
                        _this.classList.add('download-animation');
                        showText.innerText = '正在下载，请在浏览器中查看下载进度';
                        setTimeout(function () {
                            downBtn.style.display = 'none';
                            loading.style.display = 'block';
                        }, 250);
                        setTimeout(function () {
                            loading.style.display = 'none';
                            showText.style.display = 'block';
                        }, 8000);
                    }
                }

            });

        });
        // 查看信任说明
        mui('.mui-content').on('tap', '.span12', function () {
            modal.style.opacity = '1';
            document.querySelector('.modal').style.zIndex = '999';
            document.querySelector('.modal-body').style.overflow = 'scroll';
            mask.style.display = 'block';

        });
        mui('.mui-content').on('tap', '.close', function () {
            document.querySelector('.modal').style.zIndex = '-10';
            modal.style.opacity = '0';
            mask.style.display = 'none';
            document.querySelector('.modal-body').style.overflow = 'hidden';
        });
    },
    /**
     * 初始化下载配置
     */
    initConfig: function () {
        var self = this;

        var appguid = self.getExtraDataByKey('appguid') || '';
        // 隐藏下载按钮
        var isHide = self.getExtraDataByKey('isHide') || '0';

        var fromUrl = location.href;

        if (appguid == '' || appguid == null || appguid == undefined) {
            alert('应用唯一标识为空');

            return;
        }

        var params = JSON.stringify({
            'appguid': appguid
        });
        var url = rootUrl + 'rest/mobileappclient/getupdateinfo';

        mui.ajax(url, {
        	data: {'params': params},
            dataType: 'json',
            type: 'post', // HTTP请求类型
            timeout: 10000, // 超时时间设置为10秒；
            success: function (result) {
                // 服务器返回响应，根据响应结果，分析是否登录成功；
                console.log('3.-App返回结果：' + result);
                result = JSON.parse(result);
                if (result.status.code == 1) {
                    var res = result.custom;
                    var info = {};

                    if (app.os.ios) {
                        // .ipa包下载安装地址
                        info = res.iphoneinfo[0] || {};
                        info.sysicon = 'img/img_icon_ios.png';
                        info.downloadUrl = info.plistUrl;
                        info.logo = Util.getRightUrl(info.logo,true);
                    } else {
                        // .apk包下载安装地址
                        info = res.andriodinfo[0] || {};
                        info.sysicon = 'img/img_icon_android.png';
                        info.downloadUrl = Util.getRightUrl(info.url,true);
                        info.logo = Util.getRightUrl(info.logo,true);
                    }
                    // 渲染数据
                    var templ = document.getElementById('templ').innerHTML;
                    var output = Mustache.render(templ, info);

                    document.querySelector('.mui-content').innerHTML = output;
                    if (isHide == 1) {
                        document.querySelector('.em-btn-content').classList.add('mui-hidden');
                        document.querySelector('.em-scan').innerText = '使用手机扫描二维码安装';
                        document.querySelector('.em-erweima').style.margin = '50px auto';
                        document.querySelector('.em-copyright').classList.add('mui-hidden');
                    }
                    // 初始化
                    self.judgeENV();
                    self.addEvent();

                    var shareurl = Util.getRightUrl("h5/mobileapp/pages/shareAPP/d.html?appguid=" + appguid,true);
                    console.log(shareurl);
                    // 加载完之后生成二维码
                    $('#qrcode').qrcode({
                        width: 101, // 设置宽高
                        height: 101,
                        render: 'canvas',
                        // 这个地址是后台的扫码确认接口地址，结合实际代码修改
                        text: shareurl
                    });
                } else {
                    mui.toast(result.status.text);
                }

            },
            error: function (xhr, type, errorThrown) {
                // 异常处理；
                console.log(JSON.stringify(xhr));
            }
        });

    },
    /**
     * 判断环境
     */
    judgeENV: function (callback) {
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
            } else if (app.os.weibo) {
                specialTips = '您当前使用的是微博客户端，该客户端不支持安装App。请在Safari中打开，即可下载';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            }

            // 隐藏和显示安卓和ios应用图标
            var trustSpan = document.querySelector('.span12');

            iosIconNode.style.display = 'inline-block';
            androidIconNode.style.display = 'none';
            trustSpan.style.display = 'block';
        } else if (app.os.android) {
            // android UC浏览器
            if (app.os.uc) {
                // android环境UC浏览器
                specialTips = '';
            } else if (app.os.wechat) {
                specialTips = '点击右上角按钮，然后在弹出的菜单中，点击右上角按钮在浏览器中打开，即可安装';
                tipTxtNode.innerText = specialTips;
                tipWrapperNode.classList.add('em-tip-active');
            } else if (app.os.weibo) {
                specialTips = '您当前使用的是微博客户端，该客户端不支持安装App，点击右上角按钮在浏览器中打开，即可安装';
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
    getExtraDataByKey: function (key) {
        if (!key) {
            return null;
        }
        // 获取url中的参数值
        var getUrlParamsValue = function (url, paramName) {
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
            if (typeof (returnValue) === 'undefined') {
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
};

// 初始化
customBiz.configReady();