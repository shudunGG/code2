/**
 * 页面公共配置
 */

// 项目接口配置
(function () {
    window.Config = {
        // 前端包文件夹名称，比如前端文件夹为html，此处则配置为‘html’，需要注意的是，路径中不要出现相同的文件夹名称，不要使用中文
        folderName: 'statisticslargescreen',
        // 直接指向前端工程的根目录
        // 如：http://192.168.112.666:8080/bigscreen/html/index.html，basePath 则为 '/bigscreen/html'
        basePath: '/epoint-web/frame/pages/basic/gateway/api/statisticslargescreen',
        preUrl: '/epoint-web/rest/frame/pages/basic/gateway/api/statisticslargescreen/statisticsinfoaction', //统一接口地址前缀
    };
}());

(function () {
    var feConfig = {
        // 前端用于公共资源的输出配置
        resExport: {
            css: null,
            js: null
        },
        needRem: true, //是否启用rem方案,适用范围1366*768 ~ 1920*1080
        // 个性化常用资源引入配置，单页面引入资源在页面head中单独配置
        needECharts: true,

        needAnimstion: false, //进场出场动画
        needNiceScroll: false, //美化滚动条
    };
    window.setBasicSize = function () {
        var docEl = document.documentElement,
            clientWidth = docEl.clientWidth;
        if (clientWidth < 1366) clientWidth = 1366;
        docEl.style.fontSize = (30 / 554 * clientWidth - 3.97) + 'px';
    };
    // 页面载入完成后，显示页面，如果启用rem方案，此处会被覆盖
    window.onload = function () {
        document.body.setAttribute('class', 'loaded');
    };

    // 如果启用rem方案，自动引入nicescroll
    if (feConfig.needRem) {
        setBasicSize();
        feConfig.needNiceScroll = true;
        var pageResizeTimer = null;
        window.addEventListener('resize', function () {
            if (pageResizeTimer) clearTimeout(pageResizeTimer);
            pageResizeTimer = this.setTimeout(setBasicSize, 50);
        });
    }
    for (var i in feConfig) {
        window.Config[i] = feConfig[i];
    }

    if (location.protocol == "file:") {
        Config.basePath = location.href.substring(0, location.href.indexOf(Config.folderName)) + Config.folderName;
    }
}());

// 生成初始化css、js配置, 创建ResBoot对象
(function () {
    window.ResBoot = {
        // 获取路径中文件的扩展名，如：js/libs/mock.js -> js
        getResExt: function (url) {
            if (url.indexOf('?') !== -1) {
                url = url.split('?')[0];
            }

            var dotPos = url.lastIndexOf('.');

            return url.substring(dotPos + 1);
        },

        // 从根路径开始
        getPath: function (path) {
            // 全路径
            if (/^(http|https|ftp)/g.test(path)) {
                return path;
            }
            // 是否是相对路径
            var isRelative = path.indexOf('./') === 0 || path.indexOf('../') === 0;
            path = (isRelative ? '' : (Config.basePath + '/')) + path;
            return path;
        },

        // 处理资源路径
        handleResPath: function (res) {
            return this.getPath(res);
        },

        // 以document.writeln方式输出css、js资源
        output: function (path) {
            var arr = [],
                res = '',
                ext = '';

            if (typeof path === 'string') {
                arr.push(path);
            } else {
                arr = path;
            }

            for (var i = 0, len = arr.length; i < len; i++) {
                res = arr[i];
                ext = this.getResExt(res);
                res = this.handleResPath(res);

                if (ext === 'js') {
                    document.writeln('<script src="' + res + '"></sc' + 'ript>');
                } else {
                    document.writeln('<link rel="stylesheet" href="' + res + '">');
                }
            }
        }
    };

    Config.resExport = {
        // 通用 css 资源输出配置
        css: (function () {
            var css = ['./css/common.css'];
            if (Config.needAnimstion) {
                css.push('./css/libs/animsition.min.css');
            }
            return css;
        }()),

        // 通用 js 资源输出配置
        js: (function () {
            var js = ['./js/libs/jquery-1.12.min.js'];
            // 工具方法
            js.push('./js/util.js');
            // 可以追加业务层面的通用 js
            js.push('./js/common.js');
            // 引入动态加载数字插件
            js.push('./js/libs/jquery.animateNumber.min.js');

            if (Config.needECharts) {
                js.push('./js/libs/echarts4.1.0.min.js');
            }

            if (Config.needAnimstion) {
                js.push('./js/libs/animsition.min.js');
            }

            if (Config.needNiceScroll) {
                js.push('./js/libs/niceScroll/jquery.nicescroll.min.js');
            }

            return js;
        }())
    };

    ResBoot.output(Config.resExport.css);
}());