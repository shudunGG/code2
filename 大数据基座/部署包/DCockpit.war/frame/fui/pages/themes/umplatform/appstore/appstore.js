/**
 * 统一集成平台imac界面的应用仓库
 * author: chends
 * date: 2017-07-24 11:51:33
 */
var APPS_TPL = '{{#list}}<div class="apps-catalogue"data-catalogue="{{name}}"id="catalogue-{{index}}"><h2 class="catalogue-name">{{name}}</h2><ul class="apps-wrap clearfix">{{#apps}}<li class="app-item l"id="app-{{id}}"data-id="{{id}}"tittle="{{name}}"data-catalogue="{{index}}"><img src="{{icon}}"alt=""class="app-icon"><span class="app-install">安 装</span><p class="app-name">{{name}}</p></li>{{/apps}}</ul></div>{{/list}}';

// 应用渲染 安装和卸载
(function (win, $) {
    var $appWrap = $('#apps-container'),
        $input = $('#search-input'),
        // 无搜索结果的提示
        $noResult = $('#no-result'),
        $key = $('#key', $noResult),
        // 无应用的提示
        $noAppsTip = $('#no-apps'),
        // 记录应用数据缓存
        appCache = [],
        // 记录所有分类
        $allCata,
        // 记录所有应用
        $allApps;

    // 父页面的themeId
    var themeId = (function () {

        try {
            // 从主界面中获取themeId
            var themeMatch = top.location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i),
                themeId = themeMatch && themeMatch[1];

            return themeId ? themeId : 'umplatform';
        } catch (err) {
            console && console.error(err.message);
            // 取不到 就直接 给 'umplatform'
            return 'umplatform';
        }
    }());
    // 父界面的pageId
    var pageId = (function () {
        try {
            return top.Util.getUrlParams('pageId');
        } catch (err) {
            throw err;
        }
    })();

    // 获取数据
    var getData = function () {
        return Util.ajax({
            url: getUnerectedAppsUrl,
            data: {
                themeId: themeId,
                pageId: pageId
            }
        }).done(function (data) {
            render(data);
        });
    };
    getData();

    // 获取应用图片所在路径
    // var imgPath = (function () {
    //     try {
    //         var pathArr = parent.location.href.split('themes/'),
    //             themeName = pathArr[1].split('/')[0];
    //         return pathArr[0] + 'themes/' + themeName + '/images/app/';
    //     } catch (err) {
    //         throw err;
    //     }
    // })();

    // 处理路径
    var fixedPath = function (app) {
        // 图标可能直接是base64 如果是则不用处理
        if (!/^data:image/.test(app.icon)) {
            // 图标目录为主题目录下images/app
            // app.icon = imgPath + app.icon;
            // 又改成不用固定文件夹了 后端直接返回路径
            app.icon = Util.getRightUrl(app.icon);
        }
        return app;
    };

    // 处理数据中 加索引、路径并缓存
    var dealData = function (data) {
        $.each(data, function (i, catalogue) {
            catalogue.index = i;
            catalogue.name = catalogue.name || '其他';

            $.each(catalogue.apps, function (i, app) {
                app = fixedPath(app);
            });
        });

        appCache = data;
        return data;
    };

    // 渲染应用
    var render = function (data) {
        if (data && data.length) {
            $(Mustache.render(APPS_TPL, {
                list: dealData(data)
            })).appendTo($appWrap.empty());
        }else {
            $noAppsTip.removeClass('hidden');
        }
    };

    // 点击安装
    $appWrap.on('click', '.app-item', function (app) {
        var id = this.getAttribute('data-id'),
            app = this;

        parent.AppMgr.installApp(id, function () {
            var $app = $(app),
                hasApp = $app.siblings().length > 0;
            // 检查当前分类下是否还有应用 没有则需要一并移除
            if (!hasApp) {
                $app.closest('.apps-catalogue').remove();
            }
            // 安装成后移除   
            $(app).remove();
            appCache[id] = null;
            delete appCache[id];
            epoint.showTips('安装成功！', {
                state: 'success'
            });
        });
    });

    // nicescroll
    if ($.fn.niceScroll) {
        $appWrap.niceScroll();
    } else {
        Util.loadJs('frame/fui/js/libs/jquery.nicescroll.min.js', function () {
            $appWrap.niceScroll();
        });
    }

    // 应用搜索
    /**
     * 关键字过滤
     * 
     * @param {String} kw 搜索关键字
     * @return {Array}  过滤结果的数组
     */
    var filter = function (kw) {
        var result = [],
            i,
            j,
            l1,
            l2,
            catalogue,
            temp;

        kw = kw.toLowerCase();

        // 分类
        for (i = 0, l1 = appCache.length; i < l1; ++i) {
            result[i] = {
                apps: [],
                name: appCache[i].name,
                // 标识是否为当前分类名符合
                matchAsCata: false
            };
            catalogue = appCache[i];

            // 检查分类名是否符合;
            if (catalogue.name.toLowerCase().indexOf(kw) != -1) {
                result[i].matchAsCata = true;
                // 分类符合就不用继续搜索了
                continue;
            }

            // 分类中应用
            for (j = 0, l2 = catalogue.apps.length; j < l2; ++j) {
                temp = catalogue.apps[j];

                if (temp.name.toLowerCase().indexOf(kw) != -1) {
                    result[i].apps.push(temp);
                }
            }
        }

        return result;
    };

    /**
     * 重置高亮和空提示
     */
    var reset = function () {
        $appWrap.find('.catalogue-name').each(function (i, item) {
            item.innerHTML = item.innerText;
        });
        $allApps.find('.app-name').each(function (i, item) {
            item.innerHTML = item.innerText;
        });
        $noResult.addClass('hidden');
    };
    // 处理
    var showResult = function (kw) {

        // 无应用时无需搜索
        if (!appCache.length) return;

        var result = filter(kw),
            i,
            j,
            l1,
            l2,
            catalogue,
            $cata,
            hasApp = false;

        // 隐藏所有分类、应用
        $allApps = $allApps || $appWrap.find('.app-item');
        $allCata = $allCata || $appWrap.find('.apps-catalogue');
        $allCata.addClass('hidden');
        $allApps.addClass('hidden');

        // 重置高亮
        reset();

        for (i = 0, l1 = result.length; i < l1; ++i) {
            catalogue = result[i];

            // 分类符合
            if (catalogue.matchAsCata) {
                hasApp = true;
                $cata = $appWrap.find('#catalogue-' + i);
                // 子应用显示
                // $allApps.filter(function () {
                //     return this.getAttribute('data-catalogue') == i;
                // }).removeClass('hidden');
                $cata.find('.app-item').removeClass('hidden');
                // 高亮
                $cata.find('.catalogue-name').html(catalogue.name.replace(kw, '<b>' + kw + '</b>'));
                // 显示分类
                $cata.removeClass('hidden');

                continue;
            } else if (!catalogue.apps.length) {
                // 当前分类无应用 隐藏并下一个分类
                $appWrap.find('#catalogue-' + i).addClass('hidden');
                continue;
            }

            // 显示每个搜索到的应用
            for (j = 0, l2 = catalogue.apps.length; j < l2; ++j) {
                $allApps.filter('#app-' + catalogue.apps[j].id).removeClass('hidden')
                    .find('.app-name').html(catalogue.apps[j].name.replace(kw, '<b>' + kw + '</b>'));
                hasApp = true;
            }
            // 显示当前分类
            $appWrap.find('#catalogue-' + i).removeClass('hidden');
        }

        // 如果没有 则给出提醒 没有搜索到
        if (!hasApp) {
            // console.log('无结果');
            $key.text(kw);
            $noResult.removeClass('hidden');
        }

    };
    win.showResult = showResult;

    // 绑定输入事件 IE8、9不支持input
    var timer;
    if (Util.browsers.isIE && (Util.browsers.isIE8 || Util.browsers.isIE9)) {
        $input.on('onkeypress', function () {
            var that = this;
            timer = setTimeout(function () {
                showResult(that.value);
            }, 200);
        });
    } else {
        $input.on('input', function () {
            var that = this;
            timer = setTimeout(function () {
                showResult(that.value);
            }, 200);
        });
    }
    // 回车搜索
    $input.on('onkeypress', function (e) {
        if (e.which === 13) {
            showResult(this.value);
        }
    });

    // 开放一个重置的方法，在父页面卸载应用时调用
    win.afterAppUninstall = function () {
        // 重置数据 并重新加载
        appCache = [];
        $allApps = false;
        $allCata = false;
        getData();
    };

}(this, jQuery));