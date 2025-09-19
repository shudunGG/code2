/*
 * @Author: 吴松泽
 * @Date: 2018-12-01 14:54:08
 * @Last Modified by: 吴松泽
 * @Last Modified time: 2019-07-08 17:39:40
 * @Description: 个人名片
 */
'use strict';

Util.loadJs(
    './js/qrcode.js',
    './js/html2canvas.js',
    'pages/common/common.js',
    'js/utils/util.charset.js',
    function () {
        var customAPIName;

        if (Util.os.android) {
            customAPIName = 'com.epoint.android.workflow.container.ejsapi.EpointWorkflowApi';
        } else {
            customAPIName = 'OAEJSCustomCalss';
        }

        Config.configReady(null, function () {
            initListeners();
        }, function (error) {});
    });
var userPhoto = '',
    showTogglePage = 0,
    coName = 1;

var brandCoZh = '',
    brandCoEn = '',
    brandCoLogo = '';

var userInfo = {};
// 控制页面显示内容
var isShowTitle;
// 中间平台地址
var rusinessRestUrl;
// 是否显示隐藏分享按钮 1隐藏 0显示
var isHidden;
// 后台用户信息是否存在
/* var userHasInfo = {
    co: 0,
    ouname: 0,
    title: 0,
    phone: 0,
    mail: 0,
    address: 0
}; */

function initListeners() {
    // 是否隐藏分享按钮 1隐藏
    isHidden = Util.getExtraDataByKey('isHidden') || '0';

    // 当不支持分享API时隐藏分享按钮
    if (isHidden == 1) {
        document.querySelector('.em-tool-share').classList.add('mui-hidden');
    }


    ejs.storage.getItem({
        key: 'isShowTitle', // 或者 ['key1', 'akey2']
        success: function (result) {
            if (result.isShowTitle == '') {
                isShowTitle = {
                    ouname: 1,
                    title: 0,
                    phone: 0,
                    mail: 0,
                    address: 0,
                };
            } else {
                isShowTitle = JSON.parse(result.isShowTitle);
            }
        },
        error: function (error) {
        }
    });
    // 生成截图事件绑定
    saveAndShare();

    if (ejs.os.ejs) {
        //  获取用户信息，渲染页面
        ejsGetUserInfo().then(function (userInfo) {
            // 根据字段显隐信息
            controlExplicit(isShowTitle);
            // 根据字段控制自定义名片的开关
            controlDiff(isShowTitle);
            // 跟进字段生成二维码
            buildQrcode(userInfo.userguid).then(function () {
                document.querySelector('.mui-content').classList.remove('mui-hidden');
            });
            console.log('都成功了');
            /* if (isHidden != 1) {
                getShortUrl();
            } */
        });
    } else if (1) {
        alert('请在ejs容器中访问页面');
        // return
        // 获取userGuid
        getUserId(function (userGuid) {
            isHidden = 1;
            // 获取用户详情和中间平台公司参数信息
            // 渲染二维码
            Promise.all([getUserInfo(userGuid), getCoInfo()]).then(function () {
                buildQrcode(userGuid).then(function () {
                    document.querySelector('.mui-content').classList.remove('mui-hidden');
                });
                console.log('都成功了');

            }).catch(function (error) {
                console.log(error);

                console.log('有任务失败了');
            }).finally(function () {
                console.log('所有任务执行完毕');
            });

        });
    }
    mui('.mui-content').on('tap', '.em-user-tel', function () {
        var tel = this.getAttribute('tel');

        ejs.device.callPhone(tel);
    });

    // 控制显隐内容，改变数据
    mui('.em-toggle-div').on('tap', '.mui-switch', function (e) {
        var _this = this;
        var isshow = this.parentNode.getAttribute('is-show-type');
        var isActive = this.classList.contains('mui-active');

        if (isshow == 'co' && coName == 0) {
            ejs.ui.alert({
                title: '提示',
                message: '请通知管理人员在中间平台增加公司名称参数',
                buttonName: '确定',
                cancelable: 0,
                success: function (result) {
                    // 关闭公司标签
                    document.querySelector('.em-toggle-co-name .mui-active').classList.remove('mui-active');
                    document.querySelector('.em-toggle-co-name .mui-switch-handle').style.transform = 'translate(0px, 0px)';
                },
                error: function (err) {}
            });

            return;
        }
        var hasData = this.classList.contains('em-has-data')
;

        if (!hasData) {
            ejs.ui.alert({
                title: '提示',
                message: '请在个人信息中完善基本信息',
                buttonName: '确定',
                cancelable: 0,
                success: function (result) {
                    _this.classList.remove('mui-active');
                    _this.querySelector('.mui-switch-handle').style.transform = 'translate(0px, 0px)';
                },
                error: function (err) {}
            });

        }
        if (isActive) {
            isShowTitle[isshow] = 1;
            console.log('打开状态');
        } else {
            isShowTitle[isshow] = 0;
            console.log('关闭状态');
        }
        console.log(isShowTitle);

    });

    mui('.mui-content').on('tap', '.em-tool-zdy', function (e) {
        // 显示个性化页面
        showToggle();
        // 历史记录中插入一条记录,防止返回按钮会关闭页面
        var state = {
            title: '个性化页面',
            url: '#toggle' // 这个url可以随便填，只是为了不让浏览器显示的url地址发生变化，对页面其实无影响
        };

        window.history.pushState(state, state.title, state.url);

    });
    // 添加监听返回\前进事件监听
    if (ejs.os.ios) {
        window.addEventListener('popstate', function (e) {
            backFun();
        }, false);
    } else if (ejs.os.android) {
        ejs.navigator.hookSysBack({
            success: function (result) {
                if (showTogglePage == 1) {
                    backFun();
                } else {
                    ejs.page.close();
                }
                /**
                 * Android中每一次按下系统返回就会触发回调
                 */
            },
            error: function (error) {}
        });
        ejs.navigator.hookBackBtn({
            success: function (result) {
                if (showTogglePage == 1) {
                    backFun();
                } else {
                    ejs.page.close();
                }
                /**
                 * 每一次按下导航栏左侧返回就会触发回调
                 */
            },
            error: function (error) {}
        });
    }

}
// 返回事件
function backFun() {
    if (isShowTitle.co == 0) {
        document.querySelector('.em-card-top').classList.add('flex-direction-row');
    } else {
        document.querySelector('.em-card-top').classList.remove('flex-direction-row');
    }
    document.querySelector('[is-show-type="ouname"] .mui-switch').classList.contains('mui-active') ? isShowTitle.ouname = 1 : isShowTitle.ouname = 0;
    document.querySelector('[is-show-type="title"] .mui-switch').classList.contains('mui-active') ? isShowTitle.title = 1 : isShowTitle.title = 0;
    document.querySelector('[is-show-type="phone"] .mui-switch').classList.contains('mui-active') ? isShowTitle.phone = 1 : isShowTitle.phone = 0;
    document.querySelector('[is-show-type="mail"] .mui-switch').classList.contains('mui-active') ? isShowTitle.mail = 1 : isShowTitle.mail = 0;
    document.querySelector('[is-show-type="address"] .mui-switch').classList.contains('mui-active') ? isShowTitle.address = 1 : isShowTitle.address = 0;
    hideToggle();
    // 返回时存储显隐字段
    ejs.storage.setItem({
        isShowTitle: JSON.stringify(isShowTitle),
        success: function (result) {},
        error: function (error) {}
    });
    controlExplicit(isShowTitle);


}
// 控制卡片显隐
function controlExplicit(data) {
    for (var key in data) {
        // 只要考虑对象本身的属性，而不是它的原型
        if (data.hasOwnProperty(key)) {
            console.log(key + ' ' + data[key]);
            if (data[key] == 0) {
                console.log(key);

                document.querySelector('.' + key).classList.add('mui-hidden');
            } else if (data[key] == 1) {
                document.querySelector('.' + key).classList.remove('mui-hidden');
            }
        }
    }
}
// 隐藏个性化页面
function hideToggle() {
    showTogglePage = 0;
    // 隐藏页面时重新构造二维码
    buildQrcode();
    setTimeout(function() {
        document.querySelector('.em-toggle-div').classList.remove('em-toggle-show');

    }, 200);
    setTimeout(function () {
        document.querySelector('.em-toggle-div').classList.add('mui-hidden');
    }, 400);
    history.go(-1);

}
// 显示个性化页面
function showToggle() {
    showTogglePage = 1;
    document.querySelector('.em-toggle-div').classList.remove('mui-hidden');
    setTimeout(function () {
        document.querySelector('.em-toggle-div').classList.add('em-toggle-show');
    }, 100);

    setTimeout(function () {
        // 隐藏已构造二维码
        document.querySelector('#qrcode canvas').remove();
        document.querySelector('#qrcode [alt="Scan me!"]').remove();
    }, 1000);
}
// 获取用户guid
function getUserId(callback) {
    var userGuid = Util.getExtraDataByKey('userGuid') || '440c5ddb-af66-45cf-aa17-145382e6780b';

    // 440c5ddb-af66-45cf-aa17-145382e6780b
    // 69e11a64-cf4e-455f-b5ee-325a5b8f7c52
    if (userGuid == '') {

        ejs.auth.getUserInfo({
            success: function (result) {
                var result = JSON.parse(result.userInfo);

                console.log(result.userguid);

                var userGuid = result.userguid;

                callback && callback(userGuid);
            },
            error: function (error) {}
        });
    } else {
        callback && callback(userGuid);
    }

}
// ejs获取用户身份
function ejsGetUserInfo() {
    return new Promise(function (resolve, reject) {
        ejs.util.invokePluginApi({
            path: 'contact.provider.serverOperation',
            dataMap: {
                method: 'getPersonalDetailInfo',
            },
            success: function (result) {
                var jsonstr = result;

                console.log(result);

                // 处理用户数据
                processUserData(jsonstr).then(function () {
                    resolve(jsonstr);
                    // alert(JSON.stringify(isShowTitle))
                    // controlExplicit(isShowTitle);
                });
                // result 返回数据
            },
            error: function (err) {
                alert(JSON.stringify(err));
                // err 错误信息
            }
        });
        /* ejs.auth.getUserInfo({
            success: function (result) {
                console.log(typeof result.userInfo);
                var jsonstr = JSON.parse(result.userInfo);

                console.log(result.userInfo);

                // 处理用户数据
                processUserData(jsonstr).then(function () {
                    resolve(jsonstr);
                });
            },
            error: function (error) {}
        }); */
    });
}
// 获取用户信息
function getUserInfo(userGuid) {
    return new Promise(function (resolve, reject) {
        common.ajax({
            url: 'address_getuserdetail_v7',
            data: {
                'userguid': userGuid // 唯一标识
            },
            // 考虑到网络不佳情况下，业务是否手动显示加载进度条
            isShowWaiting: false
        },
        function (result) {
            if (result.status && result.status.code == 1) {
                var jsonstr = result.custom;

                // 处理用户数据
                processUserData(jsonstr).then(function () {
                    resolve();
                });

            } else {
                ejs.ui.alert({
                    title: '提示',
                    message: result.status.text,
                    buttonName: '确定',
                    cancelable: 0,
                    success: function (result) {
                        // 点击 alert的按钮后回调
                        ejs.page.close({
                            // 也支持传递字符串
                            resultData: {
                                key: 'value2'
                            },
                            success: function (result) {}
                        });
                    },
                    error: function (err) {}
                });
            }
        },
        function (error) {
            var jsonstr = {
                'custom': {
                    'ccworksequenceid': '5365685463046424',
                    'loginid': 'wsze',
                    'ouguid': '9579bbf9-31d0-4548-b78f-ea4392bf68f9',
                    'telephoneoffice': '58121212',
                    'sex': '男',
                    'mobile': '18651125426',
                    'postaladdress': '前端开发工程师前端开发工程师前端开发工程师前端开发工程师前端开发工程师前端开发工程师前端开发工程师前端开发工程师',
                    'title': '前端开发工程师',
                    'sequenceid': '5365685463046424',
                    'photourl': 'rest/readpictureaction/getUserPicture?isCommondto=true&userGuid=440c5ddb-af66-45cf-aa17-145382e6780b&isMobile=true&md5=658f10519a47d9b57df7e3261232cd8e',
                    'userguid': '440c5ddb-af66-45cf-aa17-145382e6780b',
                    'baseouname': '系统管理部',
                    'postalcode': '',
                    'displayname': '吴松泽',
                    'ordernumber': 1,
                    'fax': '',
                    'pinyininitials': 'wsz',
                    'telephonehome': '',
                    'email': '461834849@qq.com',
                    'ouname': '系统管理部',
                    'shortmobile': ''
                },
                'status': {
                    'code': 1,
                    'text': '请求成功'
                }
            };

            // 处理用户数据
            processUserData(jsonstr.custom).then(function () {
                resolve();
            });
            // reject();
        }, {
            isDebug: false
        }
        );
    });
}
// 处理用户数据
function processUserData(jsonstr) {
    return new Promise(function (resolve, reject) {
        userInfo['displayname'] = jsonstr.displayname;
        userInfo['userguid'] = jsonstr.userguid;
        userInfo['ouname'] = jsonstr.ouname;
        userInfo['title'] = jsonstr.title;
        userInfo['phone'] = jsonstr.mobile;
        userInfo['mail'] = jsonstr.email;
        userInfo['address'] = jsonstr.postaladdress;
        // jsonstr.photourl = Config.serverOA9Url.replace(/oa9\//, '') + 'readpictureaction/getUserPicture?isCommondto=true&userGuid=' + jsonstr.userguid + '&isMobile=true';
        jsonstr.photourl = Config.serverOA9Url + jsonstr.photourl;
        var template = document.getElementById('tmp-user').innerHTML; // HTML 模板


        var output = Mustache.render(template, jsonstr);

        userPhoto = jsonstr.photourl;
        // 二维码中间增加logo
        document.querySelector('.qrcode__logo').setAttribute('src', userPhoto);
        document.querySelector('.qrcode__logo').setAttribute('alt', jsonstr.displayname);
        // 渲染卡片
        document.querySelector('.em-user-div').innerHTML = output; // 渲染卡片

        var templateToggle = document.getElementById('tmp-toggle').innerHTML; // HTML 模板
        var outputToggle = Mustache.render(templateToggle, jsonstr);

        document.querySelector('.em-toggle-div').innerHTML = outputToggle; // 渲染个性化列表

        // document.querySelector('.em-card-top').setAttribute('hidden-co', 0);

        mui('.mui-switch')['switch']();
        resolve(userInfo);
    });
}
// 获取公司信息
function getCoInfo() {
    return new Promise(function (resolve, reject) {
        if (ejs.os.ejs) {
            ejs.runtime.getPlatformUrl({
                success: function (result) {
                    rusinessRestUrl = result['platformUrl'];

                    console.log(rusinessRestUrl);
                    ejs.runtime.getAppKey({
                        success: function (result) {
                            var appKey = result['appKey'];
                            var data = {
                                params: JSON.stringify({
                                    'appguid': appKey
                                })
                            };

                            Util.ajax({
                                url: rusinessRestUrl + 'getAppParams',
                                data: data,
                                isEncrypt: 0, // 请求中间平台接口不加密
                                isAutoProxy: 0, // 请求中间平台接口不带用户token
                                success: function (result) {
                                    console.log('配置参数：' + JSON.stringify(result));
                                    if (result.status.code == '1') {
                                        // brandCoZh = result.custom.commonparams['brand-co-zh'];
                                        // brandCoEn = result.custom.commonparams['brand-co-en'];
                                        // brandCoLogo = result.custom.commonparams['brand-co-logo'];

                                        // if (brandCoZh && brandCoEn && brandCoLogo) {
                                        //     // 中间平台有公司名称等信息
                                        //     document.querySelector('.em-top-title img').setAttribute('src', brandCoLogo);
                                        //     document.querySelector('.em-top-title .em-title-co').innerText = brandCoZh;
                                        //     document.querySelector('.em-top-title .em-title-co-en').innerText = brandCoEn;
                                        //     document.querySelector('.em-card-top').setAttribute('hidden-co', 0);
                                        // } else {
                                        // 中间平台没有公司名称等信息
                                        coName = 0;
                                        isShowTitle.co = 0;
                                        // 关闭公司标签
                                        // document.querySelector('.em-toggle-co-name .mui-active').classList.remove('mui-active');
                                        // document.querySelector('.em-toggle-co-name .mui-switch-handle').style.transform = 'translate(0px, 0px)';
                                        // }
                                        resolve();
                                    } else {
                                        ejs.ui.toast(result.status.text);
                                    }
                                }
                            });
                        },
                        error: function (error) {}
                    });
                },
                error: function (error) {}
            });
            ejs.storage.getBusinessRestUrl({
                success: function (result) {},
                error: function (error) {}
            });

        } else {
            resolve();
        }

    });
}
// 初始化二维码
function buildQrcode(userGuid) {
    return new Promise(function (resolve, reject) {
        console.log(window.location.href + '?userGuid=' + userGuid);
        scanUrl(function (url) {
            var url = url;

            console.log('url:' + url);
            // alert();
            // document.querySelector('[alt="Scan me!"]').remove();
            if (document.querySelector('[alt="Scan me!"]')) {
                document.querySelector('[alt="Scan me!"]').remove();
            }
            // ejs.util.createQRCode({
            //     qrCodeStr: url,
            //     success: function (result) {
            //         // console.log(result.img);
            //         // document.getElementById('qrcode').style.backgroundImage = result.img;
            //         document.querySelector('#qrcode').setAttribute('src', result.img);
            //         // Zepto('#qrcode img').css('background-image', result.img);
            //         /**
            //  * img: xxx
            //  */
            //     },
            //     error: function (error) {}
            // });
            // 初始化二维码
            new QRCode(document.getElementById('qrcode'), {
                text: url,
                width: 370,
                height: 370,
                colorDark: '#333',
                colorLight: 'transparent',
                correctLevel: QRCode.CorrectLevel.Q // LMQH
            });

            resolve();
        });


    });
}
// setTimeout(function() {
// ejs.callApi({
//     name: 'OA_LongScreenCaptureToShare', // 例如 alert（仅举例）
//     mudule: 'OA_LongScreenCaptureToShare', // 例如 ui（仅举例）
//     isLongCb: 0, // 是否是长期回调
//     data: {}, // 需要传递给原生的数据
//     success: function (result) {
//         alert(result)
//         /**
//          * 长期回调的情况下，每次符合条件都会触发
//          * 短期回调的情况下，只会触发一次
//          * 回调的参数由具体的自定义API决定
//          */
//     },
//     error: function (error) {
//         alert(error)

//     }
// });
// }, 2000);
// 生成截图
function saveAndShare() {
    // 分享
    var path = 'oacustomplugin.oacustomprovider.screenCaptureandShareAction';

    // 分享
    document.querySelector('.em-tool-share').addEventListener('tap', function () {
        // 隐藏工具栏
        document.querySelector('.em-tool-zdy').classList.add('mui-hidden');
        isHidden == 0 ? document.querySelector('.em-tool-share').classList.add('mui-hidden') : '';
        document.querySelector('.em-tool-save').classList.add('mui-hidden');
        // 显示工具栏
        setTimeout(function() {
            document.querySelector('.em-tool-zdy').classList.remove('mui-hidden');
            isHidden == 0 ? document.querySelector('.em-tool-share').classList.remove('mui-hidden') : '';
            document.querySelector('.em-tool-save').classList.remove('mui-hidden');
        }, 3000);
        // 延迟触发截图
        setTimeout(function() {
        // 截屏并分享
            ejs.util.invokePluginApi({
                path: path,
                dataMap: {
                    method: 'screenCaptureToShare',
                    islong: '0',
                    longheight: document.querySelector('body').clientHeight
                },
                success: function (result) {},
                error: function (err) {
                    var path = ejs.os.ios ? 'WPLAboutViewController' : 'com.epoint.app.oa.view.OA_AboutActivity';

                    ejs.ui.alert({
                        title: '提示',
                        message: '分享失败，请更新OA至最新版本',
                        buttonName: '去更新',
                        cancelable: 0,
                        success: function (result) {
                            ejs.page.openLocal({
                                className: path,
                                isOpenExist: 0,
                                data: {
                                    key1: 'value1'
                                },
                                success: function (result) {

                                },
                                error: function (error) {}
                            });
                        },
                        error: function (err) {}
                    });
                }
            });
        }, 500);

    });
    // 保存到本地
    document.querySelector('.em-tool-save').addEventListener('tap', function () {
        // 隐藏工具栏
        document.querySelector('.em-tool-zdy').classList.add('mui-hidden');
        document.querySelector('.em-tool-share').classList.add('mui-hidden');
        document.querySelector('.em-tool-save').classList.add('mui-hidden');

        // 延迟触发截图
        setTimeout(function() {
            ejs.io.screenShot({
                captureType: 1,
                success: function (result) {
                    ejs.ui.toast('已保存至相册');
                    // 显示工具栏
                    document.querySelector('.em-tool-zdy').classList.remove('mui-hidden');
                    isHidden == 0 ? document.querySelector('.em-tool-share').classList.remove('mui-hidden') : '';
                    document.querySelector('.em-tool-save').classList.remove('mui-hidden');
                    // document.querySelector('.swiper-container').style.overflow = 'hidden';
                    /**
                     * 截屏后返回图片的本地路径
                     * {
                            picPath: ""
                       }
                     */
                },
                error: function (error) {

                }
            });
            /* ejs.util.invokePluginApi({
                path: path,
                dataMap: {
                    method: 'savePhotosAlbum',
                    islong: '0',
                    longheight: document.querySelector('body').clientHeight
                },
                success: function (result) {
                    ejs.ui.toast('已保存至相册');
                    // 显示工具栏
                    document.querySelector('.em-tool-zdy').classList.remove('mui-hidden');
                    isHidden == 0 ? document.querySelector('.em-tool-share').classList.remove('mui-hidden') : '';
                    document.querySelector('.em-tool-save').classList.remove('mui-hidden');
                    // document.querySelector('.swiper-container').style.overflow = 'hidden';
                },
                error: function (err) {
                    var path = ejs.os.ios ? 'WPLAboutViewController' : 'com.epoint.app.oa.view.OA_AboutActivity';

                    ejs.ui.alert({
                        title: '提示',
                        message: '保存失败，请更新OA至最新版本',
                        buttonName: '去更新',
                        cancelable: 0,
                        success: function (result) {
                            ejs.page.openLocal({
                                className: path,
                                isOpenExist: 0,
                                data: {
                                    key1: 'value1'
                                },
                                success: function (result) {

                                },
                                error: function (error) {}
                            });
                        },
                        error: function (err) {}
                    });
                    // ejs.ui.alert('保存失败，请更新公司OA至最新版本');
                    // ejs.ui.toast('保存失败，请更新公司OA至最新版本');
                }
            }); */
        }, 500);

    });


}

// 构造二维码链接
function scanUrl(cb) {
    if (false) {
        var pageUrl = Util.getProjectBasePath() + 'pages/brand/business_card_scan.html';
        var data = {
            'displayname': userInfo.displayname,
            'userguid': userInfo.userguid
        };

        for (var key in isShowTitle) {
            // 只要考虑对象本身的属性，而不是它的原型
            if (isShowTitle.hasOwnProperty(key)) {
                if (isShowTitle[key] == 1) {
                    // 需要构造进链接
                    data[key] = userInfo[key];
                    switch (key) {
                        case 'co':
                            data['coName'] = brandCoZh;
                            data['coNameEn'] = brandCoEn;
                            data['coLogo'] = brandCoLogo;
                            break;

                        default:
                            data[key] = userInfo[key];
                            break;
                    }
                }
            }
        }
        var encodeData = Util.charset.base64.encode(JSON.stringify(data), 'gbk');

        // encodeData = JSON.stringify(data);

        console.error(encodeData);
        var fullPageUrl = pageUrl + '?encodeData=' + encodeData;

        console.error(fullPageUrl);
        cb && cb(fullPageUrl);
    } else {
        // 走接口生成短链接
        getShortUrl(function (fullPageUrl) {
            cb && cb(fullPageUrl);
        });
    }

    //

}
/* setTimeout(function() {
    scanUrl();
}, 2000); */
// 移动端接口返回短链接
function getShortUrl(cb) {
    ejs.runtime.getPlatformUrl({
        success: function (result) {
            rusinessRestUrl = result['platformUrl'];

            console.log(rusinessRestUrl);
            // 项目上页面查看名片地址
            // var sacnUrl = rusinessRestUrl.replace(/rest\/client\//, '') + 'ejs.m7.emp7.h5/pages/brand/business_card_scan.html?encodeData=';
            var sacnUrl = Util.getProjectBasePath() + 'pages/brand/business_card_scan.html?encodeData=';

            console.log(sacnUrl);

            // 获取用户列表信息
            common.ajax({
                url: 'getpersonnalcard',
                data: {
                    'showmobile': isShowTitle.phone, // 是否显示手机号，1显示，0不显示
                    'showouname': isShowTitle.ouname, // 是否显示部门，1显示，0不显示
                    'showmail': isShowTitle.mail, // 是否显示邮箱，1显示，0不显示
                    'showtitle': isShowTitle.title, // 是否显示职位，1显示，0不显示
                    'showaddress': isShowTitle.address, // 是否显示地址，1显示，0不显示
                    'empaddress': sacnUrl // 跳转名片地址前缀
                }
            }, function (result) {
                if (result.status.code == '1') {
                    console.log(result);
                    cb && cb(result.custom.shorturl);
                    // callback && callback(result.custom);
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                ejs.ui.toast(Config.TIPS_II);
            }, {
                isDebug: false
            });
        },
        error: function (error) {}
    });

}
// 根据字段控制自定义名片的开关
function controlDiff(isShowTitle) {
    isShowTitle.ouname == 0 && document.querySelector('[is-show-type="ouname"] .mui-active') ? document.querySelector('[is-show-type="ouname"] .mui-active').classList.remove('mui-active') : '';
    isShowTitle.title == 0 && document.querySelector('[is-show-type="title"] .mui-active') ? document.querySelector('[is-show-type="title"] .mui-active').classList.remove('mui-active') : '';
    isShowTitle.phone == 0 && document.querySelector('[is-show-type="phone"] .mui-active') ? document.querySelector('[is-show-type="phone"] .mui-active').classList.remove('mui-active') : '';
    isShowTitle.mail == 0 && document.querySelector('[is-show-type="mail"] .mui-active') ? document.querySelector('[is-show-type="mail"] .mui-active').classList.remove('mui-active') : '';
    isShowTitle.address == 0 && document.querySelector('[is-show-type="address"] .mui-active') ? document.querySelector('[is-show-type="address"] .mui-active').classList.remove('mui-active') : '';

}