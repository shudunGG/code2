/**
 * 作者： 葛杰
 * 创建时间： 2018/11/26
 * 版本： [1.0, 2018/11/26]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 意见反馈——表单提交
 */
'use strict';

Util.loadJs([
    'pages/common/common.js',
    'js/widgets/fileinput/fileinput.js',
], function () {
    customBiz.configReady();
});

var customBiz = {
    // 初始化校验，必须调用
    // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
    configReady: function () {
        var self = this;
        Config.configReady([], function () {
            self.initListeners();
        }, function (error) {
        });
    },

    // 初始化监听、注册事件
    initListeners: function () {
        var self = this;

        self.modulename = Util.getExtraDataByKey('modulename');
        self.moduleguid = Util.getExtraDataByKey('moduleguid');
        // 是否锁定当前的输入状态
        self.isLock = false;
        // 问题类型，默认为报错
        self.questiontype = '报错';
        self.deviceinfo = '';
        self.userguid = '';
        self.imageNames = [];
        self.domain = '';

        // 提交
        mui('body').on('tap', '.g-form-button', function () {
            if (self.checkInputFormat()) {
                self.submit();
            }
        });

        document.querySelector('#content').addEventListener('input', function () {
            // 只有在非中文输入状态的时候，才能更改数字
            if (!self.isLock) {
                var num = this.value.length;

                document.querySelector('.word-number').innerText = num;
                if (num >= 250) {
                    document.querySelector('.word-number').classList.add('red-star');
                } else {
                    document.querySelector('.word-number').classList.remove('red-star');
                }
            }
        });
        // 中文输入开始的时候，会触发此函数
        document.querySelector('#content').addEventListener('compositionstart', function () {
            self.isLock = true;// 此时在输入中，加锁
        });
        // 中文输入结束的时候，会触发此方法
        document.querySelector('#content').addEventListener('compositionend', function () {
            var num = this.value.length;

            self.isLock = false;
            document.querySelector('.word-number').innerText = num;
            if (num >= 250) {
                document.querySelector('.word-number').classList.add('red-star');
            } else {
                document.querySelector('.word-number').classList.remove('red-star');
            }
        });

        // 选择问题类型
        mui('.mui-content').on('tap', '.g-question-btn', function () {
            var _this = this;
            var btnList = document.querySelectorAll('.g-question-btn');
            var questionType = _this.innerText;

            self.questiontype = questionType;
            // 选中样式改变
            for (var i = 0; i < btnList.length; i++) {
                btnList[i].classList.remove('active');
            }
            _this.classList.add('active');
        });

        new FileInput({
            container: '#upload-img',
            isMulti: false,
            type: 'Image_Camera',
            success: function (b64, file, detail) {
                var uuid = Util.uuid();

                // file.url = b64;
                file.uuid = uuid;
                self.uploadImg(file);
            },
            error: function (error) {
                console.error(error);
            }
        });

        // 删除附件
        mui('.mui-content').on('tap', '.upload-img-del', function () {
            var _this = this;
            // 上传按钮显隐
            var imgDom = document.querySelector('.g-upload-frame').querySelectorAll('.uploadimg');
            var uuid = _this.parentNode.getAttribute('uuid');
            var imgNumber = imgDom.length;

            ejs.ui.confirm({
                title: '提示',
                message: '是否删除该附件！',
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                success: function (result) {
                    if (result.which === 1) {
                        for (var i = 0; i < imgDom.length; i++) {
                            if (imgDom[i].getAttribute('uuid') === uuid) {
                                var par = _this.parentNode;
                                var index = self.imageNames.indexOf(imgDom[i].getAttribute('imgname'));

                                self.imageNames.splice(index, 1);
                                imgNumber -= 1;
                                _this.parentNode.parentNode.removeChild(par);
                                document.querySelector('.img-num').innerText = imgNumber;

                                if (imgNumber < 3) {
                                    document.querySelector('.img-num').classList.remove('red-star');
                                    document.querySelector('.upload-btn').classList.remove('mui-hidden');
                                }
                            }
                        }
                    }
                },
                error: function (err) {
                }
            });
        });

        // 图片预览
        mui('.mui-content').on('tap', '.uploadimg img', function () {
            var imgDiv = document.querySelector('.g-upload-frame').querySelectorAll('.uploadimg');
            var urlArr = [];
            var index = 0;
            var currentUrl = this.getAttribute('src');

            for (var i = 0; i < imgDiv.length; i++) {
                urlArr.push(imgDiv[i].querySelector('img').getAttribute('src'));
                if (currentUrl === imgDiv[i].querySelector('img').getAttribute('src')) {
                    index = i;
                }
            }

            ejs.util.prevImage({
                index: index,
                selectedPhotos: urlArr,
                success: function (result) {
                },
                error: function (error) {
                }
            });
        });

        // 获取用户信息
        ejs.auth.getUserInfo({
            success: function(result) {
                self.userguid = JSON.parse(result.userInfo).userguid;
                self.username = JSON.parse(result.userInfo).displayname;
            },
            error: function(error) {}
        });

        // 设备厂商信息
        ejs.device.getVendorInfo({
            success: function(result) {
                if (Util.os.ios) {
                    self.deviceinfo = result.uaInfo.replace(/iOS/, '');
                } else if (Util.os.android) {
                    self.deviceinfo = result.uaInfo.replace(/android/, '');
                }
            },
            error: function(error) {}
        });

        // 获取App版本号
        ejs.runtime.getAppVersion({
            success: function(result) {
                self.appversion = result.version;
            },
            error: function(error) {}
        });

        // 获取系统版本
        self.osVersion = self.getOSVersion();
        console.log(self.osVersion);
        // 获取中间平台地址
        ejs.runtime.getPlatformUrl({
            success: function(result) {
                self.domain = result.platformUrl;
            },
            error: function(error) {}
        });
    },

    /**
     * 获取操作系统版本
     * @return {String} OSVision 系统版本
     */
    getOSVersion: function () { // 获取操作系统版本
        var OSVision = null;
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // Android
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

        if (isAndroid) {
            var redA = /android [\d._]+/gi;
            var infoA = u.match(redA);

            OSVision = (infoA + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.');
        }
        if (isIOS) {
            var regI = /os [\d._]+/gi;
            var infoI = u.match(regI);

            OSVision = (infoI + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.');
        }

        return OSVision;
    },
    /**
     * 上传
     * @param {Object} oFile 文件
     */
    uploadImg: function (oFile) {
        var self = this;

        ejs.ui.showWaiting('正在加载...');
        Util.upload({
            url: self.domain + 'feedbackImageUpload',
            files: [{
                name: oFile.name,
                file: oFile
            }],
            isEncrypt: false,
            beforeSend: function () {

            },
            success: function (response, status, xhr) {
                if (response.status.code === 1) {
                    var arr = [];
                    var html = '';
                    var template = document.getElementById('img-tmp').innerHTML;
                    var subStr = new RegExp('/client/');
                    var domain = self.domain.replace(subStr, '/file/getFile');

                    arr.push({
                        uuid: oFile.uuid,
                        url: domain + '?fileName=' + response.custom.imageNames + '&outname=',
                        imageNames: response.custom.imageNames
                    });

                    mui.each(arr, function (k, v) {
                        html += Mustache.render(template, v);
                    });
                    Zepto('.g-upload-frame').prepend(html);

                    // 判断上传图片张数
                    var imgDiv = document.querySelector('.g-upload-frame').querySelectorAll('.uploadimg');
                    var imgNumber = imgDiv.length;

                    document.querySelector('.img-num').innerText = imgNumber;
                    if (imgNumber >= 3) {
                        document.querySelector('.img-num').classList.add('red-star');
                        document.querySelector('.upload-btn').classList.add('mui-hidden');
                    }
                    self.imageNames.push(response.custom.imageNames);
                    ejs.ui.closeWaiting();

                } else {
                    ejs.ui.toast('上传失败，请重试~');
                }
            },
            error: function (xhr, status, statusText) {
                ejs.ui.closeWaiting();
            },
            uploading: function (percent, speed, status) {
                ejs.ui.closeWaiting();
                console.log("上传中:" + percent + ',speed:' + speed + ',msg:' + status);
            }
        });

    },

    /**
     * 用户反馈（提交）
     */
    submit: function () {
        var self = this;
        var imageNames = self.imageNames.join(';');

        ejs.runtime.getAppKey({
            success: function(result) {
                var data = {
                    userid: self.userguid,
                    content: document.querySelector('#content').value,
                    appguid: result.appKey,
                    deviceinfo: self.deviceinfo,
                    displayname: self.username,
                    moduleguid: self.moduleguid,
                    modulename: self.modulename,
                    errorstatus: self.questiontype,
                    devicesystemversion: self.osVersion,
                    appversion: self.appversion,
                    frameversion: '',
                    imageNames: imageNames,
                    platform: Util.os.ios ? 6 : 5, // android 5, ios 6
                };

                common.ajax({
                    url: self.domain + 'feedback',
                    data: data,
                    isShowWaiting: true,
                    isEncrypt: false,
                },
                function (result) {
                    if (result.status.code === 1) {
                        ejs.ui.toast('提交成功！');
                        ejs.page.close({
                            // 也支持传递字符串
                            resultData: {
                                key: 'value2'
                            }
                        });
                    } else {
                        ejs.page.open({
                            pageUrl: './feedback_fail.html',
                            pageStyle: 1,
                            orientation: 1,
                            data: {
                                key1: 'value1'
                            },
                            error: function(error) {}
                        });
                    }
                },
                function (error) {
                    ejs.ui.toast(Config.TIPS_II);
                }, {
                    isDebug: false
                });
            },
            error: function(error) {}
        });

    },

    /**
     * 校验
     */
    checkInputFormat: function () {
        var flag = true;
        var self = this;
        // 问题类型
        var questiontype = self.questiontype;
        // 问题描述
        var content = document.querySelector('#content').value;

        if (questiontype == '') {
            ejs.ui.toast('请选择问题类型！');
            flag = false;
        } else if (content == '') {
            ejs.ui.toast('请填写问题描述！');
            flag = false;
        }

        return flag;
    }


};