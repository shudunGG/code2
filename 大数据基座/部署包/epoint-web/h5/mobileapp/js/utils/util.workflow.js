/**
 * 作者: 郭天琦
 * 创建时间: 2017/10/13
 * 版本: [2.0, 2017/10/13 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 工作流
 */

(function (Util) {
    'use strict';

    /**
     * 默认设置
     */
    var defaultSettings = {
        isDebug: false
    };

    /**
     * 常用变量
     */
    var operationNameArray = [], // 意见数组
        operationGuidArray = []; // 意见guid

    /**
     * 默认接口名称 v6 接口， v7以后再说
     *
     */
    var defaultInterface_V6 = {
        startProcess: 'Handle_StartProcess_V6',
        getUserOpinion: 'Opinion_GetUserOpinion_V6',
        getCommonOpinion: 'Opinion_GetComm_V6',
        dealWaitHandle: 'Handle_DealWaitHandle_V6'
    };

    // 默认为v6接口
    var interface_name = defaultInterface_V6;

    /**
     * Form表单-构造函数
     * constructor
     * @param {Object} 参数
     * isDebug {Boolean} 是否开启调试模式
     * serverUrl {String} 接口地址
     */
    function WorkFlow(options) {
        var self = this;

        options = options || {};
        self.options = Util.extend(defaultSettings, options);

        options.serverUrl ? self.serverUrl = options.serverUrl : self.serverUrl = self._getServerUrl();
    }

    /**
     * 原型
     */
    WorkFlow.prototype = {

        /**
         * 启动流程
         * @param {String} processGuid 流程唯一guid
         * @param {Function} callback 请求成功后的回调函数
         */
        startProcess: function (processGuid, callback, autoHandleData) {
            var self = this;
            var autoHandleCallback = null;

            autoHandleData = autoHandleData || true;

            if (!processGuid || typeof processGuid !== 'string') {
                throw new Error('请传入正确的ProcessGuid');
            }

            if (autoHandleData) {
                autoHandleCallback = function(response) {
                    ejs.navigator.setRightTextBtn('送下一步');
                    
                    var operationList = response.OperationList;

                    operationList.forEach(function(e, i) {
                        operationNameArray.push(e.OperationName);
                        operationGuidArray.push(e.OperationGuid);
                    });
                };
            }

            self._ajax({
                url: self.serverUrl + interface_name.startProcess,
                data: {
                    paras: {
                        ProcessGuid: processGuid
                    }
                },
                dataPath: 'UserArea.Worklowinfo',
                success: callback,
                autoHandleCallback: autoHandleCallback
            });

            // 初始化事件监听
            self._initListeners();
        },

        /**
         * 公用ajax
         * @param {object} options 参数
         * url {String} 接口地址
         * data {object} 请求参数
         * callback {Function} 回调函数
         * autoHandleCallback {Function} 内部字处理函数
         */
        _ajax: function(options) {
            var self = this;
            var requestData = options.data;

            options.callback = options.callback || function() {};

            ejs.oauth.getToken(function(result) {
                var token = result.token;

                requestData.ValidateData = token;

                ejs.sql.getConfigValue('MOA_KEY_UserGuid', function(result) {
                    var userGuid = result.value;

                    requestData.paras = requestData.paras || {};
                    requestData.paras.UserGuid = userGuid;

                    requestData = JSON.stringify(requestData);

                    self._showDebug(requestData);

                    Util.ajax({
                        url: options.url,
                        data: requestData,
                        type: 'post',
                        dataPath: options.dataPath || '',
                        success: function(response) {
                            if (options.dataPath) {
                                response = response.data;
                            }

                            options.callback.call(self, response);

                            // 有自处理的函数的话自己处理函数
                            if (options.autoHandleCallback) {
                                options.autoHandleCallback.call(self, response);
                            }

                            self._showDebug(JSON.stringify(response));
                        },
                        error: function() {
                            options.callback.apply(self, arguments);
                        }
                    });
                });
            });

            Util.ajax({
                url: options.url
            });
        },

        /**
         * 获取个人意见模板
         */
        getUserOpinionTpl: function () {

        },

        /**
         * 获取公共意见模板
         */
        getCommonOpinionTpl: function () {
            
        },

        /**
         * 事件监听
         */
        _initListeners: function() {
            // 右上角按钮
            window.onClickNBRightEJS = function() {
                ejs.nativeUI.actionSheet({
                    'items': operationNameArray,
                    'cancelable': 0
                },
                function(result, msg, detail) {
                    
                });
            };
        },

        /**
         * 获取接口地址前缀
         */
        _getServerUrl: function () {
            return Config.serverUrl;
        },

        /**
         * options.isDebug的时候，展示每次请求的请求参数与返回数据
         * @param {String} 输出的值
         */
        _showDebug: function (message) {
            var self = this;

            if (self.options.isDebug) {
                console.log(message);
            }
        }
    };

    Util.workflow = {
        /**
         * 初始化workflow
         * @param {Object} options 参数
         * isDebug {Boolean} 是否开启调试模式
         * serverUrl {String} 接口地址
         * @return {object} 实例
         */
        init: function (options) {
            return new WorkFlow(options);
        },

        /**
         * 可以设置接口名称，默认为标准版OA接口
         * @param {Object} options 参数
         */
        setInterfaceName: function (options) {
            if (!(options && typeof options === 'object')) {
                throw new Error('传入参数不正确');
            }

            Util.extend(interface_name, options);
        }
    };
}(window.Util));