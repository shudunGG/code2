/*!
 * 其他通用的最页面功能效果增强的扩展
 */

// 隐藏页面loading效果
(function (win, $) {
    var $pageLoading = $('body > .page-loading');

    Util.hidePageLoading = function () {
        if (!$pageLoading.length) return;

        $pageLoading.fadeOut(300, function () {
            $pageLoading.remove();
        });
    };
}(this, jQuery));

// 添加对csrf防御处理
(function (win, $) {
    $.ajaxSetup({
        beforeSend: function (XMLHttpRequest) {
            var csrfcookie = Util.readCookie(win.CSRF_COOKIE_NAME || '_CSRFCOOKIE');
            if (csrfcookie) {
                XMLHttpRequest.setRequestHeader(win.CSRF_HD_NAME || 'CSRFCOOKIE', csrfcookie);
            }
        }
    });
}(this, jQuery));

// 浏览器检测提醒
(function () {
    // 非主界面无需加载
    if (!/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i.test(location.href)) return;

    // 加载文件自动提醒
    Util.loadJs('frame/fui/js/widgets/browsertips/browsertips.js');
}());

// 阻止IE下退格键回退页面
(function (win, $) {
    if (Util.browsers.isIE) {
        $(document).on('keydown', function (e) {
            var keyCode = e.which;
            var elem = e.target;
            var name = elem.nodeName;
            if (keyCode == 8) {
                if (name != 'INPUT' && name != 'TEXTAREA' && elem.contentEditable != "true") {
                    return false;
                }
                var type_e = elem.type ? elem.type.toUpperCase() : '';
                if (name == 'INPUT' && (type_e != 'TEXT' && type_e != 'TEXTAREA' && type_e != 'PASSWORD' && type_e != 'FILE')) {
                    return false;
                }
                if (name == 'INPUT' && (elem.readOnly == true || elem.disabled == true)) {
                    return false;
                }
            }
        });
    }

}(this, jQuery));

// 为通过第三方安全检测，隐藏js库的版本号
(function ($, Mustache) {
    var d = new Date();
    var t = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('.');
    d = null;

    try {
        // jquery / jquery.ui 版本号
        $.fn.jquery = $.ui.version = t;
        // Mustache 版本号
        Mustache.version = t;
    } catch (err) {}
})(jQuery, this.Mustache);


// 重写 JSON.parse 方法，以支持电子交易那边不正常的用法
(function (win) {
    if (win.JSON && JSON.parse) {
        var _oParse = JSON.parse;

        JSON.parse = function (s) {
            if (typeof s == 'object') {
                return s;
            }

            return _oParse(s);
        };
    }
})(this);
// 添加对操作系统版本的标记，临时解决左右布局中切换按钮在win7系统下的显示不全问题
(function ($) {
    var version = navigator.userAgent,
        $document = $(document.documentElement);

    if (version.indexOf("Windows NT 5.1") > -1 || version.indexOf("Windows XP") > -1) {
        $document.addClass('winxp');
    } else if (version.indexOf("Windows 7") > -1 || version.indexOf("Windows NT 6.1") > -1) {
        $document.addClass('win7');
    } else if (version.indexOf("Windows NT 10.0") > -1 || version.indexOf("Windows 10") > -1) {
        $document.addClass('win10');
    }

})(jQuery);