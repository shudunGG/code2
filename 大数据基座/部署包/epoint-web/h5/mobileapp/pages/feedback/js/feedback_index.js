/**
 * 作者： 葛杰
 * 创建时间： 2018/11/26
 * 版本： [1.0, 2018/11/26]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 意见反馈
 */
'use strict';

Util.loadJs([
    'pages/common/common.js'
], function () {
    customBiz.configReady();
});

var customBiz = {
    // 初始化校验，必须调用
    // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
    configReady: function () {
        var self = this;

        Config.configReady(null, function () {
            self.initListeners();
            self.getModuleList();
        }, function (error) {
        });
    },

    // 初始化监听、注册事件
    initListeners: function () {
        var self = this;

        mui('.mui-content').on('tap', '.module-list', function () {
            var _this = this;
            var modulename = _this.getAttribute('modulename');
            var moduleguid = _this.getAttribute('moduleguid');

            ejs.page.open({
                pageUrl: Util.getProjectBasePath().replace(/h5\/mobileapp\//i, '') + 'frame/pages/epointworkflow/client/mobileprocesscreateinstance',
                pageStyle: 1,
                orientation: 1,
                data: {
                    modulename: modulename,
                    moduleguid: moduleguid,
                    processguid: self.processGuid,
                    canhandle: '1'
                },
                success: function(result) {

                },
                error: function(error) {}
            });
        });

    },

    /**
     * @param {String} appguid 应用唯一id
     * @param {String} platform 平台代号
     */
    getModuleList: function () {
        var self = this;

        ejs.ui.showWaiting('正在加载...');

        Promise.all([
            new Promise(function (resolve, reject) {
                ejs.runtime.getAppKey({
                    success: function(result) {
                        resolve(result.appKey);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            }),
            new Promise(function (resolve, reject) {
                ejs.runtime.getPlatformUrl({
                    success: function(result) {
                        resolve(result.platformUrl);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            })
        ]).then(function (value) {
            var params = {
                'appguid': value[0],
                'platform': Util.os.ios ? 6 : 5
            };

            common.ajax({
                url: 'getfeedbackmodulelist',
                data: params,
                isShowWaiting: false,
                isEncrypt: false
            },
            function (result) {
                ejs.ui.closeWaiting();
                var subStr = new RegExp('/client/');
                var domain = value[1].replace(subStr, '/file/getFile');

                if (result.status.code === 1) {
                    var tmpInfo = result.custom.module;
                    var html = '';
                    var template = document.getElementById('template').innerHTML;
                    var templatenop = document.getElementById('template-nop').innerHTML;

                    self.processGuid = result.custom.processguid;
                    mui.each(tmpInfo, function (k, v) {
                        if (v.moduleguid.indexOf('nop_') > -1) {
                            html += Mustache.render(templatenop, v);
                        } else {
                            // v.logo = domain + v.logo + '&outname=';
                            html += Mustache.render(template, v);
                        }

                    });

                    document.getElementById('listdata').innerHTML = html;
                } else {
                    ejs.ui.toast(result.status.text);
                }

            },
            function (error) {
                ejs.ui.closeWaiting();
                ejs.ui.toast(Config.TIPS_II);
            }, {
                isDebug: false
            });
        }).catch(function (error) {
            ejs.ui.toast(error);
        });
    }

};