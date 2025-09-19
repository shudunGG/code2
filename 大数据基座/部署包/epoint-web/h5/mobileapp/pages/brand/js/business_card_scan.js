/*
 * @Author: 吴松泽
 * @Date: 2018-12-01 14:54:08
 * @Last Modified by: 吴松泽
 * @Last Modified time: 2019-07-05 18:27:35
 * @Description: 个人名片
 */
'use strict';

Util.loadJs(
    'pages/common/common.js',
    'js/utils/util.charset.js',
    function () {
        Config.configReady(null, function () {
            initListeners();
        }, function (error) {});
    });

function initListeners() {
    var userInfo = Util.getExtraDataByKey('encodeData') || '';

    userInfo = Util.charset.base64.decode(userInfo, 'gbk');
    userInfo = JSON.parse(userInfo);
    userInfo.photourl = Util.getFullPath('').replace(/h5\/mobileapp\//, '') + 'rest/mobileattachaction/getUserPicture?isCommondto=true&userGuid=' + userInfo.userguid + '&isMobile=true';
    // console.log(userInfo);
    var template = document.getElementById('tmp-user').innerHTML; // HTML 模板
    var output = Mustache.render(template, userInfo);

    console.log(output);

    document.querySelector('.em-user-div').innerHTML = output; // 渲染卡片
}
