/**
 * 作者： 葛杰
 * 创建时间： 2018/11/26
 * 版本： [1.0, 2018/11/26]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 意见反馈——提交失败
 */
'use strict';

Util.loadJs([
    'pages/common/common.js'
], function() {
    customBiz.configReady();
});

var customBiz = {
    // 初始化校验，必须调用
    // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
    configReady: function() {
        var self = this;
        Config.configReady(null, function() {
            self.initListeners();
        }, function(error) {});
    },

    // 初始化监听、注册事件
    initListeners: function() {
        mui('.mui-content').on('tap', '.g-feedback-retry', function () {
            ejs.page.close({
                // 也支持传递字符串
                resultData: {
                    key: 'value2'
                },
                popPageNumber: 2
            });
        });
    }

};