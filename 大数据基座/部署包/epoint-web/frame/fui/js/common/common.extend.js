/*!
 * 其他通用的最页面功能效果增强的扩展
 */

// 隐藏页面loading效果
(function(win, $) {
    var $pageLoading = $('body > .page-loading');

    Util.hidePageLoading = function() {
        if (!$pageLoading.length) return;

        $pageLoading.fadeOut(300, function() {
            $pageLoading.remove();
        });
    };
})(this, jQuery);

// 添加 ajax 全局处理
(function (win, $) {
    var fp = localStorage.getItem('fingerprint') || '',
        userSign = Util.getFrameSysParam('epoint_user_loginid') || '';
    if (!fp) {
        calcFingerPrint();
    }

    function calcFingerPrint() {
        Fingerprint2.get(function (components) {
            var values = components.map(function (component) {
                return component.value;
            }); // 配置的值的数组
            fp = Fingerprint2.x64hash128(values.join(''), 31); // 生成浏览器指纹
            localStorage.setItem('fingerprint', fp);
        });
    }

    $.ajaxSetup({
        beforeSend: function (XMLHttpRequest) {
            var csrfcookie = Util.readCookie(win.CSRF_COOKIE_NAME || '_CSRFCOOKIE'),
                reqTime = new Date().getTime(),
                deviceId,
                userToken;

            // 如果已经有指纹，直接把指纹放到header中
            if (fp) {
                deviceId = fp;
                userToken = 'userSign=' + userSign + ',reqTime=' + reqTime + ',deviceId=' + deviceId + ',title=' + encodeURI(document.title);
            }
            if(epoint.enableButtonRecord && mini._lastClickedBtn){
                userToken += (userToken ? ',' : '') + 'btnId=' + mini._lastClickedBtn.id + ',btnText=' + encodeURI(mini._lastClickedBtn.text);
            }
            // 对csrf防御处理
            if (csrfcookie) {
                XMLHttpRequest.setRequestHeader(win.CSRF_HD_NAME || 'CSRFCOOKIE', csrfcookie);
            }
            XMLHttpRequest.setRequestHeader('User-Token', userToken);
        },
        // 通用的状态码处理
        statusCode: Util._handleStatusCode()
    });
})(this, jQuery);

// 浏览器检测提醒
(function() {
    // 非主界面无需加载
    if (!/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i.test(location.href)) return;

    // 加载文件自动提醒
    Util.loadJs('frame/fui/js/widgets/browsertips/browsertips.js');
})();

// 阻止IE下退格键回退页面
(function(win, $) {
    if (Util.browsers.isIE) {
        $(document).on('keydown', function(e) {
            var keyCode = e.which;
            var elem = e.target;
            var name = elem.nodeName;
            if (keyCode == 8) {
                if (name != 'INPUT' && name != 'TEXTAREA' && elem.contentEditable != 'true') {
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
})(this, jQuery);

// 为通过第三方安全检测，隐藏js库的版本号
(function($, Mustache) {
    var d = new Date();
    var t = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('.');
    d = null;

    try {
        // jquery / jquery.ui 版本号
        // jquery 版本号的隐藏已通过直接修改文件来实现
        // $.fn.jquery = $.ui.version = t;
        // Mustache 版本号
        Mustache.version = t;
    } catch (err) {}
})(jQuery, this.Mustache);

// 重写 JSON.parse 方法，以支持电子交易那边不正常的用法
(function(win) {
    if (win.JSON && JSON.parse) {
        var _oParse = JSON.parse;

        JSON.parse = function(s) {
            if (typeof s == 'object') {
                return s;
            }

            return _oParse(s);
        };
    }
})(this);
// 添加对操作系统版本的标记，临时解决左右布局中切换按钮在win7系统下的显示不全问题
(function($) {
    var version = navigator.userAgent,
        $document = $(document.documentElement);

    if (version.indexOf('Windows NT 5.1') > -1 || version.indexOf('Windows XP') > -1) {
        $document.addClass('winxp');
    } else if (version.indexOf('Windows 7') > -1 || version.indexOf('Windows NT 6.1') > -1) {
        $document.addClass('win7');
    } else if (version.indexOf('Windows NT 10.0') > -1 || version.indexOf('Windows 10') > -1) {
        $document.addClass('win10');
    }
})(jQuery);

// btn group 中按钮显隐变化后的适配
(function(win, $) {
    var observer;
    function markGroupBtn($group) {
        var $visibleBtns = $group.children().filter(function(i, btn) {
            var $btn = $(btn);
            return /(?:mini-button|mini-webuploader)/.test(btn.className) && $btn.is(':visible');
        });

        var lastIndex = $visibleBtns.length - 1;
        $visibleBtns.each(function(i, btn) {
            $(btn).removeClass('mini-btn-group-first mini-btn-group-last');
            // 修改属性会再次触发变化 手动清空待处理队列
            observer && observer.takeRecords();
            if (i === 0) {
                $(btn).addClass('mini-btn-group-first');
                observer && observer.takeRecords();
            }
            if (i === lastIndex) {
                $(btn).addClass('mini-btn-group-last');
                observer && observer.takeRecords();
            }
        });
    }

    /**
     * 适配 mini-btn-group 中的按钮样式
     *
     * @param {undefined|string|jQueryObject|HTMLElement} $targetGroup 要适配的 btngroup 省略时处理页面全部
     */
    function adaptButtonGroup($targetGroup) {
        var $btnGroup = $targetGroup ? $($targetGroup) : $('.fui-toolbar .mini-btn-group, .fui-toolbar-bottom .mini-btn-group');
        $btnGroup.each(function(i, group) {
            markGroupBtn($(group));
        });
    }
    Util.adaptButtonGroup = adaptButtonGroup;

    $(win).on('load', function () {
        adaptButtonGroup();
        // 如果支持 MutationObserver 则自动观察并适配
        win.MutationObserver &&  initObserver();
    });
    

    function initObserver() {
        observer = new MutationObserver(function(mutationsList) {
            mutationsList.forEach(function(mutation) {
                var type = mutation.type;
                switch (type) {
                    case 'childList':
                        handleAddOrRemove(mutation);
                        break;
                    case 'attributes':
                        handleAttributesChange(mutation);
                        break;
                    default:
                        break;
                }
            });
        });

        function handleAddOrRemove(/** @type MutationRecord */ mutation) {
            var $target = $(mutation.target);
            if ($target.hasClass('mini-btn-group')) {
                markGroupBtn($target);
            }
        }

        function handleAttributesChange(/** @type MutationRecord */ mutation) {
            if (mutation.attributeName == 'style' || mutation.attributeName === 'class') {
                markGroupBtn($(mutation.target).closest('.mini-btn-group'));
            }
        }

        $('.fui-toolbar .mini-btn-group, .fui-toolbar-bottom .mini-btn-group').each(function(i, el) {
            observer.observe(el, { childList: true, attributes: true, attributeOldValue: true, characterData: false, subtree: true });
        });
        $(win).on('beforeunload', function() {
            observer.disconnect();
        });
    }
})(this, this.jQuery);
