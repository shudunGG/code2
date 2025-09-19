/**
 * 作者： sunzl
 * 创建时间： 2017/07/13 12:53:24
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：   浏览器环境处理类 判断os系统 exports.os
 */

(function (exports) {
    function detect(ua) {
        this.os = {};
        this.os.name = 'browser';
        var funcs = [
            function () { // wechat
                var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);

                if (wechat) { // wechat
                    this.os.wechat = {
                        version: wechat[2].replace(/_/g, '.')
                    };
                    this.os.name += '_' + 'wechat';
                }

                return false;
            },
            function () { // uc

                var uc = ua.match(/(UCBrowser)\/([\d\.]+)/i);

                if (uc) { // wechat
                    this.os.uc = {
                        version: uc[2].replace(/_/g, '.')
                    };
                    this.os.name += '_' + 'uc';
                }

                return false;
            },
            function () { // QQ browser
                // console.log('ua:'+ua);
                var browserQQ = ua.match(/(QQBrowser)\/([\d\.]+)/i);

                if (browserQQ) { // wechat
                    this.os.browserQQ = {
                        version: browserQQ[2].replace(/_/g, '.')
                    };
                    this.os.name += '_' + 'browserQQ';
                }

                return this.os.browserQQ === true;
            },
            function () { // mobile QQ
                // 这个判断是否是手机QQ客户端
                // console.log('ua:'+ua);
                var mobileQQClient = ua.match(/(QQ)\/([\d\.]+)/i);

                if (mobileQQClient) { // wechat
                    this.os.mobileQQClient = {
                        version: mobileQQClient[2].replace(/_/g, '.')
                    };
                    this.os.name += '_' + 'mobileQQClient';
                }

                return this.os.mobileQQClient === true;
            },
            function () { // uc

                var weibo = ua.match(/(Weibo)/i);


                if (weibo) { // wechat
                    this.os.name += '_' + 'weibo';
                    this.os.weibo = true;
                }

            },
            function () { // android
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);

                if (android) {
                    this.os.android = true;
                    this.os.version = android[2];
                    this.os.isBadAndroid = !(/Chrome\/\d/
                        .test(window.navigator.appVersion));
                    this.os.name += '_' + 'Android';
                    this.os.name += '_' + 'mobile';
                }

                return this.os.android === true;
            },
            function () { // ios
                var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);

                if (iphone) { // iphone
                    this.os.ios = this.os.iphone = true;
                    this.os.version = iphone[2].replace(/_/g, '.');
                    this.os.name += '_' + 'iphone';
                    this.os.name += '_' + 'mobile';
                } else {
                    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

                    if (ipad) { // ipad
                        this.os.ios = this.os.ipad = true;
                        this.os.version = ipad[2].replace(/_/g, '.');
                        this.os.name += '_' + 'iOS';
                        this.os.name += '_' + 'mobile';
                    }

                }

                return this.os.ios === true;
            }
        ];

        [].every.call(funcs, function (func) {
            return !func.call(exports);
        });
    }
    detect.call(exports, navigator.userAgent);
})(window.app = {});