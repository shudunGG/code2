/*
 * 作者: 吴松泽
 * 创建时间: 2018-07-03 16:44:03
 * 版本: [1.0, 2018-07-03 16:44:03]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 设备安全页面
 */

'use strict';
var APPID = '';
var APPMANAGEURL = '';
var DEVICEID = '';
Util.loadJs(
    'pages/common/common.js',
    function () {
        Config.configReady(null, function () {
            // 获取APPID
            ejs.runtime.getAppKey({
                success: function (result) {
                    APPID = result.appKey;
                    // 获取设备ID
                    ejs.device.getDeviceId({
                        success: function (result) {
                            DEVICEID = result.deviceId;
                            customBiz.initListeners();
                        },
                        error: function (error) {}
                    });
                },
                error: function (error) {}
            });
        }, function (error) {});
    });

var customBiz = {
    /**
     * @description 初始化
     */
    initListeners: function () {
        var self = this;
        // 获取中间平台地址
        ejs.runtime.getPlatformUrl({
            success: function (result) {
                APPMANAGEURL = result.platformUrl.substr(-1) === '/' ? result.platformUrl : result.platformUrl + '/';
            },
            error: function (error) {}
        });

        // self.getUserInfo(function () {
        // 请求中间平台不需要带上用户相关信息
        self.getDeviceList();
        self.getValidateCode();
        // });

        // ios关闭回弹
        ejs.device.setBounce({
            isEnable: 0,
            success: function (result) {},
            error: function (error) {}
        });
        // 遮罩DOM
        var qrcodeNode = document.querySelector('#qrcode');
        // 点击遮罩
        var mask = mui.createMask(function () {
            // 遮罩点击回调
            qrcodeNode.style.display = 'none';
        });

        // 验证码点击显示二维码
        mui('.em-header-yzm').on('tap', '.showcode', function () {
            mask.show();
            qrcodeNode.style.display = 'flex';
            qrcodeNode.classList.add('bounceInDown');
            qrcodeNode.classList.add('animated');
        });

        // // 二维码按钮点击
        // document.querySelector('.em-left-copy').addEventListener('tap', function () {
        //     mask.show();
        //     qrcodeNode.style.display = 'flex';
        //     qrcodeNode.classList.add('bounceInDown');
        //     qrcodeNode.classList.add('animated');
        // });

        // 二维码图片点击
        qrcodeNode.addEventListener('tap', function () {
            qrcodeNode.style.display = 'none';
            mask.close();
        });

        // 侧滑删除设备
        mui('#listdata').on('tap', '.remove', function (event) {
            var deviceId = this.getAttribute('deviceId');
            // var _this = this;

            ejs.ui.confirm({
                title: '提示',
                message: '删除后，在该设备登录需要重新验证授权。',
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                success: function (result) {
                    if (result.which == 1) {
                        self.delUserDevice(deviceId, function () {
                            self.getDeviceList();
                        });
                    }
                },
                error: function (err) {}
            });

        });
        // 登录页面DOM
        var listNode = document.querySelector('.em-loginList');
        // 首页DOM
        var indexPage = document.querySelector('.em-indexPage');

        // 点击最近登录记录，模拟路由效果
        document.querySelector('.em-lastTime').addEventListener('tap', function () {
            indexPage.classList.add('mui-hidden');
            listNode.classList.remove('mui-hidden');
            // 历史记录中插入一条记录,防止微信返回按钮会关闭页面
            var state = {
                title: '登录列表',
                url: '#login' // 这个url可以随便填，只是为了不让浏览器显示的url地址发生变化，对页面其实无影响
            };

            self.loginPage = 1;
            window.history.pushState(state, state.title, state.url);
        });
        self.loginPage = 0;
        // 路由效果兼容ejs安卓容器
        ejs.navigator.hookBackBtn({
            success: function (result) {
                if (self.loginPage == 1) {
                    window.history.go(-1);
                } else if (self.loginPage == 0) {
                    ejs.page.close();
                }
            },
            error: function (error) {}
        });
        ejs.navigator.hookSysBack({
            success: function (result) {
                if (self.loginPage == 1) {
                    window.history.go(-1);
                } else if (self.loginPage == 0) {
                    ejs.page.close();
                }
            },
            error: function (error) {}
        });
        // 监听前进后退
        window.addEventListener('popstate', function (e) {
            if (self.loginPage == 1) {
                listNode.classList.add('mui-hidden');
                indexPage.classList.remove('mui-hidden');
                self.loginPage = 0;
            } else if (self.loginPage == 0) {
                listNode.classList.remove('mui-hidden');
                indexPage.classList.add('mui-hidden');
                self.loginPage = 1;
            }
        }, false);

        // 改写js的splice方法，用于生成二维码时动态插入','功能
        if (!String.prototype.splice) {
            String.prototype.splice = function (start, delCount, newSubStr) {
                return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
            };
        }
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
    },
    /**
     * 初始化进度条
     * @param {Number} time 过期时间
     * @param {Object} callback 时间到期回调函数
     */
    initJdt: function (time, callback) {
        var self = this;

        // 初始化进度条
        mui('#jdt').progressbar({
            progress: 0,
        }).show();
        mui('#jdt').progressbar().setProgress(100);
        document.querySelector('.mui-progressbar span').style.transition = time + 's';
        self.timeOut = 0;
        setInterval(function () {
            self.timeOut += 1;
            mui('#jdt').progressbar().setProgress(self.timeOut);
            if (self.timeOut > 100) {
                self.timeOut = 0;
                mui('#jdt').progressbar().setProgress(self.timeOut);
                callback && callback();
            }
        }, time * (1000 / 60));
    },
    compare: function (p) { // 这是比较函数
        return function (m, n) {
            var a = m[p];
            var b = n[p];

            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            if (a = b) {
                return 0;
            }
        };
    },
    // 获取设备列表
    getDeviceList: function () {
        var self = this;
        var data = {
            'appguid': APPID
        };

        common.ajax({
            url: 'getdevicelist',
            // url: Config.APPMANAGEURL + 'modulelist',
            data: data,
            isEncrypt: 0
        }, function (result) {
            if (result.status.code == 1) {
                // 渲染设备列表
                var jsonstr = result.custom;
                var template = document.getElementById('item-template').innerHTML; // HTML 模板
                var output = '';

                if (jsonstr.length > 0) {
                    Zepto('.em-data-hidden').removeClass('mui-hidden');
                }

                mui.each(jsonstr, function (key, value) {
                    value.deviceDetailInfo = value.deviceDetailInfo == '' ? '未知设备' : value.deviceDetailInfo;
                    value.firstRegistdate = value.firstRegistdate.replace(/[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]/, '');
                    // alert(value.deviceId);
                    value.isSelf = DEVICEID == value.deviceId ? '' : 'mui-hidden';
                    value.noDel = DEVICEID == value.deviceId ? 'mui-hidden' : '';
                    output += Mustache.render(template, value);
                });
                document.getElementById('listdata').innerHTML = output; // 渲染节点

                // 渲染登录记录
                var jsonstrLast = result.custom;
                var templateLast = document.getElementById('login-template').innerHTML; // HTML 模板
                var output = '';

                jsonstrLast.sort(self.compare('lastUsedate'));
                mui.each(jsonstrLast, function (key, value) {
                    value.deviceDetailInfo = value.deviceDetailInfo == '' ? '未知设备' : value.deviceDetailInfo;
                    value.lastUsedate = value.lastUsedate.substring(5, 16);
                    output += Mustache.render(templateLast, value);
                });
                document.getElementById('loginlist').innerHTML = output; // 渲染节点
            }
        }, function (error) {
            ejs.ui.toast(Config.TIPS_II);
        }, {
            isDebug: false
        });
    },
    // 获取验证码
    getValidateCode: function () {
        var self = this;
        var data = {
            'appguid': APPID

        };


        common.ajax({
                url: 'getvalidatecode',
                // url: Config.APPMANAGEURL + 'modulelist',
                data: data,
                isEncrypt: 0
            },
            function (result) {
                if (result.status.code == 1) {
                    var six = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

                    self.codeNum = result.custom.validateCode;
                    document.querySelector('.mui-content').classList.remove('mui-hidden');
                    if (self.first != 1) {
                        self.first = 1;
                        // 初始化进度条
                        self.initJdt(60, function () {
                            self.getValidateCode();
                        });
                        // 初始化验证码
                        self.code = new Flip({
                            node: document.querySelector('.flip'),
                            duration: 1.5,
                            from: six,
                        });
                        // 初始化二维码
                        self.qrcode = new QRCode(document.getElementById('qrcode'), {
                            text: self.codeNum.toString().splice(1, 0, ',').splice(3, 0, ',').splice(5, 0, ',').splice(7, 0, ',').splice(9, 0, ','),
                            width: 200,
                            height: 200,
                            colorDark: '#333',
                            colorLight: 'transparent',
                        });

                    } else {
                        // 时间到后清空二维码重新渲染
                        document.querySelector('#qrcode').innerHTML = '';
                        // 初始化二维码
                        self.qrcode = new QRCode(document.getElementById('qrcode'), {
                            text: self.codeNum.toString().splice(1, 0, ',').splice(3, 0, ',').splice(5, 0, ',').splice(7, 0, ',').splice(9, 0, ','),
                            width: 200,
                            height: 200,
                            colorDark: '#333',
                            colorLight: 'transparent',
                        });
                    }
                    self.code.flipTo({
                        to: self.codeNum
                    });
                    var codeNode = document.querySelector('.em-true-code');

                    // 兼容低版本安卓机，隐藏动态切换验证码，使用无动效
                    if (codeNode.querySelectorAll('div').length < 1) {
                        document.querySelector('.em-true-code').classList.add('mui-hidden');
                        var codeItem = document.querySelector('.em-fixed').querySelectorAll('.ctnr');

                        // 静态验证码赋值
                        [].forEach.call(codeItem, function (e, n) {
                            e.querySelector('.digit').innerText = self.codeNum.toString().split('')[n];
                        });
                    }
                }
            },
            function (error) {
                ejs.ui.toast(Config.TIPS_II);
            }, {
                isDebug: false
            });
    },
    delUserDevice: function (deviceId, callback) {
        var self = this;
        var data = {
            // 'userguid': self.userGuid || '440c5ddb-af66-45cf-aa17-145382e6780b',
            'deviceid': deviceId,
            'appguid': APPID

        };

        common.ajax({
            url: 'deluserdevice',
            // url: Config.APPMANAGEURL + 'modulelist',
            data: data,
            isEncrypt: 0
        }, function (result) {
            if (result.status.code == 1) {
                callback && callback();
            }
        }, function (error) {
            ejs.ui.toast(Config.TIPS_II);
        }, {
            isDebug: false
        });
    },
    // 获取用户信息
    getUserInfo: function (callback) {
        var self = this;

        ejs.auth.getUserInfo({
            success: function (result) {
                result = JSON.parse(result.userInfo);
                self.userGuid = result.userguid;
                callback && callback();
            },
            error: function (error) {}
        });
    },
};