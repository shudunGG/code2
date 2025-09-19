/**
 * 作者： Gejie
 * 创建时间： 2018/09/14
 * 版本： [1.0, 2018/09/14]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 设备验证操作指南
 */

'use strict';
Util.loadJs([
    'pages/common/preview.js',
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
    initListeners: function() {
        /**
         * 点击预览图片
         */
        mui('.mui-content').on('tap', '.step-img', function() {
            var _this = this;
            var src = _this.getAttribute('src');

            ejs.util.prevImage({
                index: 0,
                selectedPhotos: [src],
                success: function(result) {},
                error: function(error) {}
            });
        });
    }
};