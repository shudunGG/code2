var _rootPath = (function() {
    var path = location.pathname;

    if (path.indexOf('/') === 0) {
        path = path.substring(1);
    }

    return '/' + path.split('/')[0];
}());

// 时间戳
var _t = '9.3.3';

(function(win) {
    // 主题界面的url规则
    var themeReg = /^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i;
    // 当前页面的url
    var curUrl = win.location.toString();
    // 当前页是否是主界面
    var isThemePage = themeReg.test(curUrl);

    var theme, skin;

    if (isThemePage) {
        theme = curUrl.match(themeReg)[1];

        setCookie('_theme_', theme, 365);
        // 从cookie中根据主题名获取皮肤名，如果未定义则默认`default`
        // _classic_skin_: default
        skin = getCookie('_' + theme + '_skin_') || 'default';
    }

    // 非主界面页面从cookie中读取主题名
    theme = theme || getCookie('_theme_') || 'dream';
    skin = skin || getCookie('_' + theme + '_skin_') || 'default';



    // css文件目录结构
    // themes/{themeName}/skins/{skinName}/skin.css
    // themeName是在每个界面主题页面中自己配置好的
    var skinPath = 'themes/' + theme + '/skins/' + skin + '/skin.css';

    var SrcBoot = {
        getPath: function(path) {
            // 全路径
            if (/^(http|https|ftp)/g.test(path)) {
                return path;
            }

            // 用于测试本地mockjs测试用例js，约定以_test最为前缀，debug为false时不在页面输出
            if (path.indexOf('_test') != -1 && !this.debug) {
                return false;
            }

            // 是否是相对路径
            var isRelative = path.indexOf('./') === 0 || path.indexOf('../') === 0;

            path = (isRelative ? '' : (_rootPath + '/')) + path;

            return path;
        },

        getExt: function(path) {
            if (path.indexOf('?') != -1) {
                path = path.split('?')[0];
            }

            var dotPos = path.lastIndexOf('.'),
                ext = path.substring(dotPos + 1);

            return ext;
        },

        // 批量输出css|js
        output: function(arr) {
            var i = 0,
                len = arr.length,
                path,
                ext;

            for (; i < len; i++) {
                path = this.getPath(arr[i]);

                if (path) {
                    ext = this.getExt(path);

                    if (ext == 'js') {
                        document.writeln('<script src="' + path + '?_t=' + _t + '"></sc' + 'ript>');
                    } else {
                        document.writeln('<link rel="stylesheet" href="' + path + '?_t=' + _t + '">');
                    }

                }
            }
        },

        debug: true,
        /*
         * 是否开启数据模拟。
         * 开启后不会对epoint.execute和epoint.initPage请求的url进行处理。
         */
        mock: false
    };


    function getCookie(sName) {
        var aCookie = document.cookie.split("; ");
        var lastMatch = null;
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (sName == aCrumb[0]) {
                lastMatch = aCrumb;
            }
        }
        if (lastMatch) {
            var v = lastMatch[1];
            if (v === undefined) return v;
            return decodeURI(v);
        }
        return null;
    }

    function setCookie(name, value, expires, domain) {
        var largeExpDate = new Date();
        if (expires != null) {

            largeExpDate = new Date(largeExpDate.getTime() + (expires * 1000 * 3600 * 24)); //expires天数
        }

        document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + largeExpDate.toGMTString())) + ";path=/" + (domain ? "; domain=" + domain : "");
    }

    var arr = [
        // miniui样式
        'frame/fui/js/miniui/themes/default/miniui.css',
        // 公共样式
        'frame/fui/css/common.min.css'

    ];

    // ie8将字体图标替换为png图标
    if (document.all && document.querySelector && !document.addEventListener) {
        // 操作图标，按钮图标
        arr.push('frame/fui/js/miniui/themes/action/actimages.css');

    } else {
        arr.push('frame/fui/js/miniui/themes/action/acticons.css');
    }

    SrcBoot.output(arr);

    win.SrcBoot = SrcBoot;
}(this));