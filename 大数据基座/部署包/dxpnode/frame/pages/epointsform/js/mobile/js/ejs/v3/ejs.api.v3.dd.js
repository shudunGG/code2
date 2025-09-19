/**
 * 作者: 戴荔春
 * 创建时间: 2017/05/25
 * 版本: [3.0, 2017/05/25 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: h5获取其它非native环境的 call 模块，做出提示
 */
(function() {
    /**
     * @description 非ejs下 自定义api调用的错误提示
     * 如果已经有了，不会重复覆盖
     */
    ejs.call = ejs.call || function() {
        ejs.errorTips(ejs.globalError.ERROR_TYPE_CUSTOMEAPINOTEXIST.code, ejs.globalError.ERROR_TYPE_CUSTOMEAPINOTEXIST.msg);
    };
})();
/**
 * 作者: 戴荔春
 * 创建时间: 2017/05/25
 * 版本: [3.0, 2017/05/25 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: dd的 ui 模块 
 */
(function() {
    ejs.extendModule('ui', [{
        namespace: "alert",
        //必填，只有在特定的os下才会实现，不填则不会实现
        //另外，填了相应的os后，会覆盖原来os下相应的func
        //每一个os下可以有一个相应的api提示
        os: ['dd'],
        defaultParams: {
            title: "",
            message: "",
            buttonName: "确定"
        },
        runCode: function(options) {
            var title = '',
                msg = '',
                buttonName = '',
                success = options.success,
                error = options.error;
                
            if (typeof options !== 'object') {
                msg = options;
                title = arguments[1] || '';
                buttonName = arguments[2] || '';
            } else {
                msg = options.message;
                title = options.title;
                buttonName = options.buttonName;
            }
            dd.device.notification.alert({
                message: msg,
                title: title, //可传空
                buttonName: buttonName,
                onSuccess: function() {
                    //onSuccess将在点击button之后回调
                    /*回调*/
                    success && success();
                },
                onFail: function(err) {
                    error && error();
                }
            });
        }
    }]);
})();