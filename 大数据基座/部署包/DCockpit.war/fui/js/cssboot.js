var _rootPath = (function () {
    var path = location.pathname;

    if (path.indexOf('/') === 0) {
        path = path.substring(1);
    }

    return '/' + path.split('/')[0];
}());

// 框架版本号
var _v = '9.2.10-sp2';

// 时间戳
// 在静态资源有更新时需要修改下值，以解决缓存问题
var _t = '20193292055';

// 默认字体大小，可取值为'default'、'medium'、'large'
var _font_mode = "default";

(function (win) {
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
    theme = theme || getCookie('_theme_') || 'grace';
    skin = skin || getCookie('_' + theme + '_skin_') || 'default';



    // css文件目录结构
    // themes/{themeName}/skins/{skinName}/skin.css
    // themeName是在每个界面主题页面中自己配置好的
    var skinPath = 'themes/' + theme + '/skins/' + skin + '/skin.css';

    var SrcBoot = {
        getPath: function (path) {
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

        getExt: function (path) {
            if (path.indexOf('?') != -1) {
                path = path.split('?')[0];
            }

            var dotPos = path.lastIndexOf('.'),
                ext = path.substring(dotPos + 1);

            return ext;
        },

        // 处理资源路径
        handleResPath: function (res) {
            res = this.getPath(res);
            
            // 增加时间戳
            return [res, '?_=', _v, '_', _t].join('');
        },

        // 批量输出css|js
        output: function (arr) {
            var i = 0,
                len = arr.length,
                id,
                path,
                ext;

            for (; i < len; i++) {
                if (Object.prototype.toString.call(arr[i]) === '[object Array]') {
                    id = arr[i][0];
                    path = this.handleResPath(arr[i][1]);
                } else {
                    path = this.handleResPath(arr[i]);
                }

                if (path) {
                    ext = this.getExt(path);

                    if (ext == 'js') {
                        document.writeln('<script ' + (id ? 'id="' + id + '"' : '') + ' src="' + path + '"></sc' + 'ript>');
                    } else {
                        document.writeln('<link ' + (id ? 'id="' + id + '"' : '') + ' rel="stylesheet" href="' + path + '">');
                    }

                }
                id = path = null;
            }
        },

        /*
         * 是否调试环境
         * 当debug为false，则全部使用压缩代码，适合生产环境
         * 当debug为true时，
         *   1. develop为false，则使用有除miniui外的未压缩代码，适合项目开发环境
         *   2. develop为true， 则全部使用未压缩代码，适合框架开发环境
         */
        debug: false,
        
        /*
         * 是否开发环境。
         * 只有当debug为true时该配置才有效
         * 拥有完全未压缩代码的权限才能使用该配置
         * 框架发布时需将该配置改为false
         */
        develop: true,
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

    var fontMode = getCookie('_font_mode_') || _font_mode;
    var arr = [
        // miniui样式
        'fui/js/miniui/themes/default/miniui.css',
        ['miniui-skin', 'fui/js/miniui/' + skinPath],

        // 公共样式
        'fui/css/common.min.css',
        ['common-skin', 'fui/css/' + skinPath],

        // 操作图标，按钮图标
        'fui/css/modicons.min.css'

    ];

    // ie8将字体图标替换为png图标
    if (document.all && document.querySelector && !document.addEventListener) {
        // 操作图标，按钮图标
        arr.push('fui/js/miniui/themes/action/actimages.css');

        // 针对字体图标的颜色兼容和图片
        if (skin == 'black') {
            arr.push('fui/js/miniui/themes/grace/skins/black/action/blackimages.css');
        }

    } else {
        arr.push('fui/js/miniui/themes/action/acticons.css','fui/css/common.scale.css');

        if(fontMode && fontMode != 'default') {
            arr.push('fui/js/miniui/themes/' + fontMode + '-mode.css');
        }
        if (skin == 'black') {
            arr.push('fui/js/miniui/themes/grace/skins/black/action/black.css');
        }
        
    }


    // 如果是主界面，则输出主界面的css样式
    if (isThemePage) {
        // 主界面css文件
        arr.push(['theme', 'fui/pages/themes/' + theme + '/' + theme + '.min.css']);
        // 主界面的皮肤样式文件
        arr.push(['theme-skin', 'fui/pages/' + skinPath]);
    }

    // 页面预埋一个 style 标签 用于懒加载皮肤的样式文件
    var lazyLoadStyle = document.createElement('style');
    lazyLoadStyle.id = 'lazy-load-style';
    lazyLoadStyle.setAttribute('type', 'text/css');
    document.getElementsByTagName('head')[0].appendChild(lazyLoadStyle);
    SrcBoot.output(arr);
    SrcBoot.output(['frame/pages/pbd/res/eputil.css']);

    win.SrcBoot = SrcBoot;
}(this));