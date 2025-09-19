/*
 * @Author: 吴松泽
 * @Date: 2019-03-19 09:34:35
 * @Last Modified by: 吴松泽
 * @Last Modified time: 2019-03-19 10:54:23
 * @Description:  二维码长按识别打开网络地址
 */

(function (exports, doc, win) {
    'use strict';
    /**
     * @param {string} node 需要识别的DOM父元素，会查找该节点下的img图片
     */
    function QRtoLongTap(node) {
        var self = this;
        var contentImgNode = document.querySelectorAll(node + ' img');

        // 遍历所有二维码网络地址转成识别后的网址
        [].forEach.call(contentImgNode, function (e, n) {
            self.picUrlToPageUrl(e.src, function (url) {
                e.setAttribute('imgurl', url);
            });

        });
        mui(node).off('longtap', '[imgurl]');
        // 对已经识别出页面地址的二维码增加长按事件
        mui(node).on('longtap', '[imgurl]', function () {
            var url = this.getAttribute('imgurl');

            if (self.isExternalUrl(url)) {
                ejs.ui.actionSheet({
                    items: ['识别图中二维码'],
                    cancelable: 1,
                    success: function (result) {
                        ejs.page.open({
                            pageUrl: url,
                            pageStyle: 1,
                            orientation: 1,
                            data: {
                                key1: 'value1'
                            },
                            success: function (result) {}
                        });
                    },
                    error: function (err) {}
                });
            }
        });
    }
    /*
     * 原型
     */
    QRtoLongTap.prototype = {
        /**
         * 将网络图片二维码地址转成识别后的网址
         * @param {string} src 图片地址
         * @param {string} cb 二维码识别后的网址
         */
        picUrlToPageUrl: function (src, cb) {
            var self = this;
            var picUrl = src;

            this.convertFileToDataURLviaFileReader(picUrl, function (base64) {
                var img = new Image();

                img.onload = function () {};
                img.src = base64;
                ejs.util.recognizeQRCode({
                    imgPath: '',
                    imgBase64: base64,
                    success: function (result) {
                        var imgUrl = result.corePath;

                        if (self.isExternalUrl(imgUrl)) {
                            cb && cb(imgUrl);
                        }
                    },
                    error: function (error) {}
                });
            });
        },
        /**
         *
         * @param {string} url 网络图片二维码地址
         * @param {string} callback base64字符串
         */
        convertFileToDataURLviaFileReader: function (url, callback) {
            var xhr = new XMLHttpRequest();

            xhr.responseType = 'blob';
            xhr.onload = function () {
                var reader = new FileReader();

                reader.onloadend = function () {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        },
        /**
         * 判断是否为外部url
         * @param {String} str 需验证的字符串
         * @return {Boolean} true or false
         */
        isExternalUrl: function (str) {
            // http s ftp等
            var reg = /^(\/\/|http|https|ftp|file)/;

            return this.checkReg(reg, str);
        },
        checkReg: function(reg, str) {
            if (!str) {
                return false;
            }
            if (reg.test(str) === true) {
                return true;
            }

            return false;
        }
    };
    win.QRtoLongTap = QRtoLongTap;
}({}, document, window));