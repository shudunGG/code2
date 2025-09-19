/**
 * 作者： Gejie
 * 创建时间： 2018/12/04
 * 版本： [1.0, 2018/12/04]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 版本更新记录
 */
'use strict';

Util.loadJs([
    'pages/common/common.js',
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
        }, function (error) {
        });
    },

    // 初始化监听、注册事件
    initListeners: function () {
        var self = this;

        // 点击展开更多
        mui('.mui-content').on('tap', '.version-more-btn', function () {
            var nodeList = this.parentNode.querySelector('.version-update-bottom');
            var ohStr = nodeList.querySelector('.version-update-content').getAttribute('height');

            if (this.classList.contains('rotate0')) {
                this.classList.add('rotate180');
                this.classList.remove('rotate0');
                nodeList.style.height = ohStr;
                nodeList.style.maxHeight = ohStr;
                nodeList.querySelector('.version-update-content').style.webkitLineClamp = 'initial';
                // nodeList.querySelector('.version-update-content').style.display = 'block';
            } else {
                this.classList.remove('rotate180');
                this.classList.add('rotate0');
                nodeList.style.height = '82px';
                // nodeList.querySelector('.version-update-content').style.display = '-webkit-box';
                nodeList.querySelector('.version-update-content').style.webkitLineClamp = 4;
            }
        });
        // 获取更新记录
        self.getList();
    },

    /**
     * 获取版本更新记录并渲染
     */
    getList: function () {
        var self = this;
        var APPMANAGEURL;

        ejs.ui.showWaiting('正在加载...');
        Promise.all([
            new Promise(function (resolve, reject) {
                ejs.runtime.getAppKey({
                    success: function (result) {
                        resolve(result.appKey);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            }),
            new Promise(function (resolve, reject) {
                ejs.runtime.getPlatformUrl({
                    success: function (result) {
                        resolve(result.platformUrl);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            })
        ]).then(function (value) {
            var params = {
                'appguid': value[0],
                'platform': Util.os.ios ? 6 : 5
            };

            // APPMANAGEURL = value[1].substr(-1) === '/' ? value[1] : value[1] + '/';
            common.ajax({
                url: 'getupdatelist',
                data: params,
                isShowWaiting: false,
                isEncrypt: false,
                clientId: value[0]
            },
            function (result) {
                ejs.ui.closeWaiting();
                if (result.status.code === 1) {
                    var tmpInfo = result.custom;
                    var html = '';
                    var template = document.getElementById('template').innerHTML;

                    mui.each(tmpInfo, function (k, v) {
                        v.createdate = DateUtil.getDate(v.createdate, 'yyyy-mm-dd');
                        if (v.message === null) {
                            v.message = '无更新说明';
                        }
                        html += Mustache.render(template, v);
                    });
                    document.getElementById('listdata').innerHTML = html;

                    var nodeList = document.querySelectorAll('.version-update-frame');

                    for (var i = 0; i < nodeList.length; i++) {
                        var ohStr = self.getStyle(nodeList[i].querySelector('.version-update-content'), 'height');
                        var oh = parseInt(ohStr.substr(0, ohStr.length - 2), 10);

                        nodeList[i].querySelector('.version-update-content').setAttribute('height', ohStr);
                        if (oh > 84) {
                            nodeList[i].querySelector('.version-more-btn').classList.remove('mui-hidden');
                            nodeList[i].querySelector('.version-update-bottom').style.height = '84px';
                            nodeList[i].querySelector('.version-update-content').style.webkitLineClamp = '4';
                            nodeList[i].querySelector('.version-update-bottom').style.padding = '0 10% 0 4%';
                        } else {
                            nodeList[i].querySelector('.version-more-btn').classList.add('mui-hidden');
                            nodeList[i].querySelector('.version-update-bottom').style.height = ohStr;
                            nodeList[i].querySelector('.version-update-bottom').style.padding = '0 4%';
                        }
                    }

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
    },

    /**
     * 获取当前样式
     * @param {Object} element  元素对象
     * @param {Object} att  属性名
     * @return {*} 属性值
     */
    getStyle: function (element, att) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(element)[att];
        } else {
            return element.currentStyle[att];
        }
    }

};