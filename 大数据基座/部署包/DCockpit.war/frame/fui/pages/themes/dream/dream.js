// jshint -W030
// 主菜单的顶级菜单模板
var NAV_TPL = '{{^isOverall}}<li class="fui-nav-item top"><a href="javascript:void(0);" class="fui-nav-link"data-url="{{url}}"data-rowkey="{{rowkey}}" data-code="{{code}}" title="{{name}}"data-opentype="{{openType}}"><i class="fui-nav-icon {{icon}}"></i><span class="fui-nav-text">{{name}}</span></a>{{/isOverall}}{{#hasSub}}<div class="fui-nav second"><h4 class="fui-nav-title" title="{{name}}" data-rowkey="{{rowkey}}">{{name}}</h4>{{^isOverall}}<div class="ajax-loading" ></div>{{/isOverall}}<ul class="fui-nav-items">{{{subItem}}}</ul></div>{{/hasSub}}{{^isOverall}}</li>{{/isOverall}}',
    // 主菜单的子菜单模板
    SUBNAV_TPL = '<li class="fui-nav-item"><a href="javascript:void(0);" class="fui-nav-link"{{#indent}}style="padding-left: {{indent}}px"{{/indent}} data-url="{{url}}" data-code="{{code}}" data-rowkey="{{rowkey}}" title="{{name}}"data-opentype="{{openType}}"><span class="fui-nav-text">{{name}}</span>{{#hasSub}}<i class="fui-nav-trigger"></i>{{/hasSub}}</a>{{#hasSub}}<ul class="fui-nav sub">{{{subItem}}}</ul>{{/hasSub}}</li>',
    // 快捷菜单模板
    QUICKNAV_TPL = '<li class="fui-nav-item top"><a href="javascript:void(0);" class="fui-nav-link quick-link-js" title="{{name}}"><i class="fui-nav-icon modicon-1"></i><span class="fui-nav-text">{{name}}</span></a><div class="fui-nav second"><h4 class="fui-nav-title"><span class="fui-quicknav-text">{{name}}</span><i data-url="{{editUrl}}" title="编辑自定义菜单" class="fui-nav-edit modicon-64"></i></h4><ul class="fui-nav-items">{{#quickNav}}<li class="fui-nav-item"><a href="javascript:void(0);" class="fui-nav-link" style="padding-left: 20px" data-url="{{url}}" data-code="{{code}}" title="{{name}}" data-opentype="{{openType}}"><span class="fui-nav-text">{{name}}</span></a></li>{{/quickNav}}</ul></div></li>',
    // 全局导航中搜索结果模板
    RESULTNAV_TPL = '<li class="fui-nav-item"><a href="javascript:void(0);" class="fui-nav-link"style="padding-left: 20px"data-url="{{url}}"data-code="{{code}}" title="{{name}}" data-opentype="{{openType}}"><span class="fui-nav-text">{{{resultName}}}</span></a></li>',
    // tab项模板
    TAB_ITEM_TPL = '<li id="tab-{{id}}" class="fui-main-tab" ref="tab-content-{{id}}" title="{{name}}"><span class="fui-tab-text">{{name}}</span>{{#closeIcon}}<i class="fui-tab-close" title="关闭"></i>{{/closeIcon}}{{^closeIcon}}<i class="fui-tab-refresh" title="刷新"></i>{{/closeIcon}}</li>',
    // tab项内容页模板
    TAB_CONTENT_TPL = '<div class="fui-tab-content" id="tab-content-{{id}}"><iframe src="{{url}}" allowTransparency="true" height="100%" width="100%" frameborder="0" scrolling="no"></iframe></div>',
    // 最近关闭tab模板
    // TAB_HISTORY_TPL = '<li class="fui-history-item" data-url="{{url}}" data-tabId="tab-{{id}}" title="{{name}}"><span class="fui-history-text">{{name}}</span><i class="fui-history-backicon"></i></li>',
    // 已打开tab模板
    TAB_CURRENT_TPL = '<li class="fui-current-item {{#isActive}}active{{/isActive}}" data-tabId="tab-{{id}}" title="{{name}}"><span class="fui-current-text">{{name}}</span></li>',
    // 消息列表模板
    MSG_TPL = '{{^hasHead}}<div class="msg-category" data-code="{{code}}"><h3 class="msg-category-head"data-url="{{url}}"data-title="{{name}}"><span class="msg-category-title" title="{{name}}">{{{name}}} (<span class="msg-category-num">{{num}}</span>)</span><i class="msg-category-remove" title="忽略全部"></i></h3><ul class="msg-list">{{/hasHead}}{{#items}}<li class="msg-list-item {{#hasNew}}newmsg{{/hasNew}}" data-url="{{url}}" data-guid="{{guid}}" data-title="{{title}}" data-opentype="{{openType}}"><span class="msg-item-text" title="{{title}}">{{{name}}}</span><span class="msg-item-date">{{date}}</span><i class="msg-item-ignore" title="忽略"></i></li>{{/items}}{{^hasHead}}</ul></div>{{/hasHead}}',
    // Emsg最近聊天会话模板
    EMSG_RECENT_TPL = '{{#items}}<li class="emsg-recent-item {{^hasRead}}newmsg{{/hasRead}}" data-sessionid="{{sessionId}}" data-uid="{{uid}}" data-type="{{type}}"><div class="emsg-user-img"><img src="{{imgUrl}}" onerror="this.onerror=\'\';this.src=\'../../emsg/images/emsg-user-error.jpg\';" /></div><div class="emsg-recent-record"><h2><span class="emsg-user-name" title="{{name}}">{{name}}</span>{{^hasRead}}<i class="emsg-not-read"></i>{{/hasRead}}<span class="emsg-recent-date">{{date}}</span></h2><p class="emsg-recent-message">{{message}}</p>{{^hasRead}} <span class="emsg-ignore-icon">忽略</span>{{/hasRead}}</div></li>{{/items}}';

// 新消息声音文件的路径
var SOUND_URL = '../../msgsound/sound.html';

// 顶部个人信息区交互
(function (win, $) {
    var $headerUser = $('#headerUser'),
        $userDrop = $('#userDropdown'),
        // $signature = $('.fui-userinfo-signature', $userDrop),
        // $signatureText = $signature.children('span'),
        // $signatureEdit = $('.fui-userinfo-editor', $userDrop),
        // $signatureInput = $signatureEdit.find('input'),

        $helloInfo = $('.fui-user-hello', $headerUser),
        $orgName = $('.fui-user-org', $headerUser),

        $userName = $('.fui-userinfo-name', $userDrop),
        $ouName = $('.fui-userinfo-org', $userDrop),

        $searchArea = $('#headerSearch'),
        $searchInput = $('input', $searchArea),
        $searchBtn = $('.fui-search-icon', $searchArea),


        $help = $('#headerHelp'),

        $bgImg = $('#bg-img'),
        $logoImg = $('#logo-img'),

        userGuid = '',
        $pageCover = $('#page-cover');


    var hideUserDrop = function () {
        $userDrop.addClass('hidden');
    };
    var showUserDrop = function () {
        $userDrop.removeClass('hidden');
        $pageCover.removeClass('hidden');
    };

    var switchUserDrop = function () {
        // $userDrop.toggleClass('hidden');
        $userDrop.hasClass('hidden') ? showUserDrop() : hideUserDrop();
    };

    var userTimer = null;
    var delayedExecution = function (fun) {
        if (userTimer) {
            clearTimeout(userTimer);
        }

        userTimer = setTimeout(fun, 400);
    };

    var showLogoutConfirm = function () {
        mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
            if (action == 'ok') {
                if (UserConfig.onLogout) {
                    eMsgSocket && eMsgSocket.close();
                    UserConfig.onLogout();
                }
            } else {
                hideUserDrop();
            }
        });
    };

    var loadBgImg = function () {
        var skin = mini.Cookie.get('_dream_skin_') || 'default';
        var src = './skins/' + skin + '/images/bg.png';
        var image = new Image();
        image.src = src;
        image.onload = function () {
            $bgImg[0].src = src;
        };
    };


    var initDropInfo = function (data) {
        $userName.html(data.name);
        // $signatureText.html(data.signature);
        $ouName.html(data.ouName);
        if (data.hasParttime) {
            $('#user-btns', $userDrop).addClass('switch');
        }
    };

    var getUserInfo = function () {
        Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: UserConfig.getUrl,
            // data: {
            //     query: "init-header"
            // },
            success: function (data) {
                userGuid = data.guid;

                $helloInfo.html(data.name + '，您好！');
                $orgName.html(data.ouName);

                // eMsgSocket = new EMsgSocket(userGuid, data.userName);
                // 用户guid和name是E讯必须要使用的 需要记录下来
                win._userName_ = data.name;
                win._userGuid_ = userGuid;

                var searchUrl = data.searchUrl,
                    helpUrl = data.helpUrl,
                    title = data.title,
                    homes = data.homes,
                    // bgImg = data.bgImg,
                    logoImg = data.logo;

                // 设置页面title
                if (title) {
                    document.title = title;
                }
                // // 设置背景图片
                // if (bgImg) {
                //     loadBgImg(Util.getRightUrl(bgImg));
                // }
                // 设置logo图片
                if (logoImg) {
                    $logoImg.attr('src', Util.getRightUrl(epoint.dealRestfulUrl(logoImg)));
                }

                // 加载首页
                if (!win.FixedTabs || FixedTabs.length === 0) {
                    FixedTabs = [];
                    // if (homeName && homeUrl) {
                    //     FixedTabs.push({
                    //         id: 'home',
                    //         name: homeName,
                    //         url: homeUrl
                    //     });
                    // }
                    $.each(homes, function (i, item) {
                        FixedTabs.push({
                            id: 'home-' + i,
                            name: item.name,
                            url: item.url
                        });
                    });
                }
                initFixedTab();

                // 顶部搜索区交互
                // if (searchUrl) {
                //     searchUrl = Util.getRightUrl(searchUrl);

                //     $searchArea.removeClass('hidden');

                //     $searchInput.on('focus', function () {
                //         $searchArea.addClass('big');
                //     }).on('blur', function () {
                //         $searchArea.removeClass('big');
                //     }).on('keypress', function (event) {
                //         if (event.which == 13) {
                //             $searchBtn.trigger('click');
                //         }
                //     });

                //     $searchBtn.on('click', function () {
                //         win.open(searchUrl + '?keywords=' + $searchInput.val());
                //     });

                //     // 有帮助按钮，则用户信息区域需要显示分割线
                //     $headerUser.addClass('split');
                // }

                // 顶部帮助按钮
                // if (helpUrl) {
                //     $help.removeClass('hidden');
                //     //$help.find('a').attr('href', Util.getRightUrl(helpUrl));
                //     $help.find('a').attr('href', ' http://192.168.200.180:8088/framedoc/docs/showcase/category/index/index.html');

                //     // 有帮助按钮，则用户信息区域需要显示分割线
                //     $headerUser.addClass('split');
                // }

                setTimeout(function () {
                    initDropInfo(data);
                }, 800);
            }
        });
    };

    var initEvent = function () {

        // 点击时显示下拉框
        $headerUser.on('click', switchUserDrop);

        // 其他部位隐藏
        $('body').on('click', function (e) {
            if (!$.contains($headerUser[0], e.target)) {
                hideUserDrop();
            }
        });

        $userDrop
            // .on('click', '.fui-userinfo-editicon', function() {
            //     // 编辑个性签名
            //     var value = $signatureText.text().trim();

            //     $signature.hide();
            //     $signatureEdit.show();
            //     $signatureInput.val(value).focus();
            // })
            .on('click', '.fui-user-linkitem', function () {
                // Todo
                // 打开对应tab页

                var $el = $(this),
                    url = $el.data('url'),
                    name = $el.text(),
                    id = 'userlink-' + $el.index();

                TabsNav.addTab({
                    id: id,
                    name: name,
                    url: url
                });

                hideUserDrop();
            }).on('click', '.fui-user-logout', function () {
                // Todo
                // 注销

                showLogoutConfirm();
            }).on('click', '.fui-user-switch', function () {
                if (UserConfig.onSwitch) {
                    UserConfig.onSwitch(userGuid);
                }
            });

        // $signatureInput.on('blur', function() {
        //     var value = this.value.trim();
        //     saveSignature(value);
        // }).on('keyup', function(event) {
        //     if (event.which == '13') {
        //         $(this).blur();
        //     }
        // });

    };

    // domReady时获取用户数据
    $(function () {
        loadBgImg();
        getUserInfo();
        initEvent();

    });

}(this, jQuery));


// 左侧菜单
(function (win, $) {
    var $body = $('#fuiBody'),
        $sidebar = $('#sidebar', $body),
        $leftNav = $('#leftNav', $sidebar),
        $toggle = $('.fui-sidebar-toggle', $sidebar),

        $pageCover = $('#page-cover'),

        $overall = $('#navOverall', $sidebar),
        $overallContent = $('.fui-overall-content', $overall),
        $overallNavs = $('.fui-overall-navs', $overallContent),
        $overallFooter = $('.fui-overall-footer', $overallContent),

        $overallScroll = $('.fui-overall-scroller', $overallFooter),
        $overallScrollLeft = $('.fui-scroller-left', $overallScroll),
        $overallScrollRight = $('.fui-scroller-right', $overallScroll),
        $resultNav = $('#navResult', $overall),
        $navSearch = $('#navSearch', $overallFooter).children('input'),

        header_h = $('#fuiHeader').outerHeight(),
        overall_h = $overall.outerHeight(),
        toggle_h = $toggle.outerHeight(),

        overall_w = $overall.find('.fui-overall-content').width(),
        overallNavs_w = 0,
        max_left = 0;

    var adjustLayout = function () {
        var win_h = $(win).height(),
            body_h = win_h - header_h,
            nav_h = body_h - toggle_h - overall_h;

        $leftNav.css('height', nav_h);

        // $overallNavs.css('width', overallNavs_w);

    };


    var M = Mustache,
        navTempl = $.trim(NAV_TPL),
        subNavTempl = $.trim(SUBNAV_TPL),
        quickNavTempl = $.trim(QUICKNAV_TPL),
        resultNavTempl = $.trim(RESULTNAV_TPL);

    var INDENT_1 = 20,
        INDENT_STEP = 15;

    //  记录顶级菜单是否不需要加载，code为键
    var topNavStatus = {},
        overallNavStatus = false; // 全局菜单是否加载完成
    // 管理节点缓存
    var CacheMgr = {
        _cache: {},
        // 搜索节点，只需配置url的子节点
        searchNodes: [],

        // 缓存节点信息
        cacheNodeData: function (data) {
            var prop,
                rowkey = data.rowkey;

            this._cache[rowkey] = {};

            for (prop in data) {
                if (prop !== 'items') {
                    this._cache[rowkey][prop] = data[prop];
                }
            }
        },

        // 获取节点数据
        getNodeData: function (rowkey) {
            var rt = this._cache[rowkey];

            return rt ? rt : null;
        },

        cacheSearchNode: function (data) {
            if (data.url) {
                var view = {
                    name: data.name,
                    url: data.url,
                    code: data.code
                };

                this.searchNodes.push(view);
            }
        }
    };

    // 获取节点缩进值
    var getIndent = function (rowkey) {
        var len = rowkey.split('-').length;

        if (len !== 1) {
            return (INDENT_1 + (len - 2) * INDENT_STEP);
        }

        return false;
    };

    // 获得节点行标识
    var getRowkey = function (rowkey, i) {
        return (rowkey === undefined) ? (i + '') : (rowkey + '-' + i);
    };

    // 构建顶级菜单导航html结构
    var buildNav = function (data, rowkey) {
        var html = [];

        $.each(data, function (i, item) {
            var view = {
                name: item.name,
                icon: item.icon || 'modicon-1',
                url: item.url,
                code: item.code,
                openType: item.openType,
                hasSub: item.hasSub
                // hasSub: !item.url
            };

            view.rowkey = getRowkey(rowkey, i);

            // 缓存节点信息
            CacheMgr.cacheNodeData($.extend({}, item, view));
            // 没有子节点则不用加载
            if (!view.hasSub) topNavStatus[view.code] = true;
            // 顶级菜单直接加载顶层
            html.push(M.render(navTempl, view));

        });

        return html.join('');
    };
    // 构建全局菜单
    var buildOverallNav = function (data, rowkey) {
        var overallHtml = [];

        $.each(data, function (i, item) {
            var view = {
                name: item.name,
                icon: item.icon,
                url: item.url,
                code: item.code,
                openType: item.openType,
                hasSub: item.items && item.items.length
            };

            view.rowkey = getRowkey(rowkey, i);

            // 缓存节点信息
            CacheMgr.cacheNodeData($.extend({}, item, view));

            // 全局导航节点
            var overallView = $.extend({}, item, view);
            overallView.isOverall = true;
            overallView.hasSub = true;

            if (view.hasSub) {
                var subItem = buildSubNav(item.items, view.rowkey, true);

                overallHtml.push(M.render(navTempl, $.extend(overallView, {
                    subItem: subItem
                })));
            } else {
                overallHtml.push(M.render(navTempl, overallView));

                // 缓存搜索节点，只有叶节点才缓存
                CacheMgr.cacheSearchNode(view);
            }
        });

        return overallHtml.join('');
    };
    var buildSubNav = function (data, rowkey, isOverall) {
        var html = [];

        $.each(data, function (i, item) {
            var view = {
                name: item.name,
                url: item.url,
                code: item.code,
                openType: item.openType,
                hasSub: item.items && item.items.length
            };

            view.rowkey = getRowkey(rowkey, i);
            view.indent = getIndent(view.rowkey);

            // 缓存节点信息
            CacheMgr.cacheNodeData($.extend({}, item, view));

            if (view.hasSub) {
                html.push(M.render(subNavTempl, $.extend(view, {
                    subItem: buildSubNav(item.items, view.rowkey, isOverall)
                })));
            } else {
                html.push(M.render(subNavTempl, view));

                // 缓存搜索节点，只有叶节点才缓存
                // 菜单改成懒加载了，只需要在构建全局导航时缓存就可以了
                // 每个子菜单如果也重复缓存会照成数据重复的问题
                if (isOverall) {
                    CacheMgr.cacheSearchNode(view);
                }

            }
        });

        return html.join('');
    };

    // 构建快捷菜单html结构
    var buildQuickNav = function (data) {
        var view = {
            name: QuickNav.name,
            icon: QuickNav.icon,
            editUrl: QuickNav.editUrl,
            quickNav: data
        };

        return M.render(quickNavTempl, view);
    };

    var initQuickNav = function (data) {
        var html = '';

        if (data && data.length) {
            html = buildQuickNav(data);

            $(Util.clearHtml(html)).appendTo($leftNav);
        }
    };
    // 初始化顶级菜单
    var initView = function (data) {

        if (data && data.items.length) {
            html = buildNav(data.items);
            $(Util.clearHtml(html)).appendTo($leftNav);
        }
    };

    var buildSearchNav = function (keywords) {
        var html = [];

        $.each(CacheMgr.searchNodes, function (i, item) {
            if (item.url) {
                var index = item.name.indexOf(keywords);
                if (index >= 0) {
                    var view = {
                        url: item.url,
                        code: item.code,
                        name: item.name,
                        openType: item.openType
                    };

                    var resultName = [];
                    resultName.push(item.name.substr(0, index));
                    resultName.push('<span class="keynote">' + item.name.substr(index, keywords.length) + '</span>');
                    resultName.push(item.name.substring(index + keywords.length));

                    view.resultName = resultName.join('');


                    html.push(M.render(resultNavTempl, view));
                }

            }
        });

        return html.join('');
    };

    var overallScroller = function (ml, toRight) {
        if (toRight) {
            if (ml == max_left) {
                // 已最右，直接返回
                return;
            }

            ml = ml - overall_w;
            if (ml < max_left) {
                ml = max_left;
            }
        } else {
            if (ml === 0) {
                // 已最左，直接返回
                return;
            }
            ml = ml + overall_w;
            if (ml > 0) {
                ml = 0;
            }
        }

        // 控制按钮的状态
        if (ml === 0) {
            $overallScrollLeft.addClass('disabled');
            $overallScrollRight.removeClass('disabled');

        } else if (ml > max_left) {
            $overallScrollLeft.removeClass('disabled');
            $overallScrollRight.removeClass('disabled');
        } else {
            $overallScrollLeft.removeClass('disabled');
            $overallScrollRight.addClass('disabled');

        }
        $overallNavs.stop(true).animate({
            left: ml
        }, 800);

    };

    var bindMousewheel = function () {
        $leftNav.on('mousewheel', function (event) {
            var target = event.target;

            // 触发源不在子菜单中才处理
            if (!$(target).closest('.fui-nav.second').length) {
                event.preventDefault();
                var scrollTop = this.scrollTop;
                this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
            }
        });

    };
    // var $activeNode = null;


    var initEvent = function () {
        $sidebar
            .on('click', '.fui-nav-link', function (event) {
                event.preventDefault();

                var $el = $(this),
                    url = $el.data('url'),
                    code = $el.data('code'),
                    name = $el.attr('title'),
                    rowkey = $el.data('rowkey'),
                    openType = $el.data('opentype'),
                    $item = $el.parent(),
                    $sub = $item.find('> .fui-nav');


                var hasSub = !!$sub.length;

                var callback = SidebarNav.onNodeClick;

                // 回调返回false，则终止后续操作
                if (rowkey && callback &&
                    callback.call(this, CacheMgr.getNodeData(rowkey)) === false) {
                    return;
                }
                // 顶级菜单点击处理
                if ($item.hasClass('top')) {

                    $item.hasClass('opened') ? $pageCover.addClass('hidden') : $pageCover.removeClass('hidden');
                    // 全局导航时隐藏搜索结果
                    if ($item.hasClass('fui-overall')) {
                        $overallContent.removeClass('small');
                        $navSearch.val('');
                        $item.toggleClass('opened');

                        $leftNav.children('.opened').removeClass('opened');
                    } else {
                        $item.toggleClass('opened')
                            .siblings('.opened').removeClass('opened');

                        $overall.removeClass('opened');

                        // 加载顶级菜单的子菜单
                        var $link = $item.children('a.fui-nav-link');
                        // 快捷菜单不是懒加载 不用发请求
                        if ($link.hasClass('quick-link-js')) return;
                        // 其他菜单发请求加载子菜单
                        var id = $link.data('code');
                        // 加载顶级菜单的子菜单
                        if ($item.hasClass('fui-nav-item top') && !topNavStatus[id]) {
                            getSubNavData(id, $item);
                        }
                    }
                } else if (hasSub) {
                    // 子节点显示|影藏
                    if ($item.hasClass('opened')) {
                        $item.removeClass('opened');
                    } else {
                        // 同一层级只展开一个，手风琴效果
                        $item.siblings('.opened')
                            .removeClass('opened')
                            .end()
                            .addClass('opened');
                    }
                }

                // 子节点且不是顶级菜单标题有active样式
                if (!hasSub) {
                    // 子节点点击 收起展开的菜单
                    $el.closest('.fui-nav-item.top,.fui-overall').removeClass('opened');
                    $pageCover.addClass('hidden');

                    // 配置了url
                    if (url) {
                        if (openType == 'blank') {
                            win.open(Util.getRightUrl(url));
                        } else {
                            TabsNav.addTab({
                                id: code,
                                name: name,
                                url: url
                            });
                        }
                        // 隐藏展开的二级菜单
                        var $topItem = $el.closest('.fui-nav-item.top');

                        if ($topItem.length) {
                            $topItem.removeClass('opened');
                        } else {
                            // 被点击的节点是全局导航中的
                            $overall.removeClass('opened');
                        }

                        return false;
                    }
                }
            })
            .on('click', '.fui-nav-edit', function () {
                // Todo
                // 打开编辑快捷菜单页面
                var $el = $(this),
                    url = $el.data('url'),
                    name = $el.parent().text();

                TabsNav.addTab({
                    id: 'editNav',
                    name: name,
                    url: url
                });

                $el.closest('.fui-nav-item.top').removeClass('opened');

            })

            .on('click', '.fui-overall-link', function (event) {
                var $el = $(this).parent();
                //  加载全局菜单
                if (!overallNavStatus) {
                    getOverallNavData();
                }
                // 展开
                $overallContent.removeClass('small');
                $navSearch.val('');
                $el.hasClass('opened') ? $pageCover.addClass('hidden') : $pageCover.removeClass('hidden');
                $el.toggleClass('opened');

                $leftNav.children('.opened').removeClass('opened');
            });

        // 空白点击收起
        $('body').on('click', function (e) {
            // var $target = $(e.target);
            if (!$.contains($leftNav[0], e.target) && !$.contains($overall[0], e.target)) {
                $sidebar.find('.fui-nav-item.top, .fui-overall').removeClass('opened');
            }
        });



        var searchTimer = null;
        $navSearch.on('keyup', function (event) {
            var keywords = $.trim(this.value);

            if (keywords.length) {
                searchTimer && clearTimeout(searchTimer);

                searchTimer = setTimeout(function () {
                    var html = buildSearchNav(keywords);

                    $resultNav.find('.fui-nav-items')
                        .html(Util.clearHtml(html));
                }, 500);

                $overallContent.addClass('small');

            } else {
                $overallContent.removeClass('small');

            }
        });

        // 全局导航滚动
        $overallScroll.on('click', '.fui-scroller-left', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var ml = parseInt($overallNavs.css('left'));

            overallScroller(ml);
        }).on('click', '.fui-scroller-right', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var ml = parseInt($overallNavs.css('left'));
            overallScroller(ml, true);
        });

        // sidebar切换
        $toggle.on('click', function () {
            if ($sidebar.hasClass('big')) {
                $sidebar.removeClass('big');

                // 修复IE8中不repaint视图的情况
                $('#tabs-nav').css('marginLeft', '46px');

                $.cookie('isBigSidebar', '0');
            } else {
                $sidebar.addClass('big');
                $('#tabs-nav').css('marginLeft', '146px');

                $.cookie('isBigSidebar', '1');
            }
        });

        if ($.fn.mousewheel) {
            bindMousewheel();
        } else {
            Util.loadJs('frame/fui/js/lib/jquery.mousewheel.min.js', bindMousewheel);
        }
        var timer = 0;
        $(win).on('resize', function () {
            timer && clearTimeout(timer);

            timer = setTimeout(adjustLayout, 50);
        });


    };

    // 获取快捷菜单数据
    var getQuickNavData = function () {
        var xhr = Util.ajax({
            url: QuickNav.loadUrl
            // ,
            // data: {
            //     query: 'init-quickNav'
            // }
        });

        xhr.done(initQuickNav, getTopNavData)
            .fail(getTopNavData);
    };

    // 获取菜单数据 顶级菜单
    var getTopNavData = function () {
        var xhr = Util.ajax({
            url: SidebarNav.loadUrl,
            data: {
                query: 'top'
            }
        });

        // 菜单数据加载完成后
        xhr.done(initView, initEvent, adjustLayout)
            .fail(initEvent, adjustLayout);
    };
    // 获取子菜单
    var getSubNavData = function (id, $el) {
        topNavStatus[id] = 'pedding';
        var xhr = Util.ajax({
            url: SidebarNav.loadUrl,
            data: {
                query: 'sub',
                code: id // 顶级菜单的id
            }
        });
        // 菜单数据加载完成后

        xhr.done(function (data) {
            var $subNavItems = $el.find('.fui-nav-items'),
                $cover = $subNavItems.siblings('.ajax-loading');

            if (data && data.length) {
                html = buildSubNav(data);
                $(Util.clearHtml(html)).appendTo($subNavItems);
                $cover.addClass('hidden');
            }
            topNavStatus[id] = true;

        }).fail(function () {
            topNavStatus[id] = false;
        });

    };
    // 获取全局菜单
    var getOverallNavData = function () {
        var xhr = Util.ajax({
            url: SidebarNav.loadUrl,
            data: {
                query: "all"
            }
        });

        // 菜单数据加载完成后
        xhr.done(function (data) {
            if (data && data.length) {
                html = buildOverallNav(data);
                $(Util.clearHtml(html)).appendTo($overallNavs);

                overallNavs_w = $overallNavs.children().eq(0).outerWidth() * data.length;
                max_left = overall_w - overallNavs_w;
                $overallNavs.css('width', overallNavs_w);
                if (max_left >= 0) {
                    $overallScrollRight.addClass('disabled');
                }
                $overallContent.find('.ajax-loading').addClass('hidden');
                overallNavStatus = true;
            }
        }, adjustLayout).fail(adjustLayout);
    };


    // 若用户上次选择收缩sidebar（即cookie中isBigSidebar为0）则初始时自动收缩。
    var isBigSidebar = $.cookie('isBigSidebar');

    if (isBigSidebar == '0') {
        $sidebar.removeClass('big');

        // 修复IE8中不repaint视图的情况
        $('#tabs-nav').css('marginLeft', '46px');
    }

    setTimeout(getQuickNavData, 1);
}(this, jQuery));

// 中间tab交互
(function (win, $) {
    var $tabsNav = $('#tabs-nav'),
        $tabsHead = $('.fui-main-head', $tabsNav),
        $wrap = $('.fui-main-tabcontainer', $tabsHead),
        $allTabs = $('.fui-main-tabs', $tabsHead),
        $fixedTabs = $allTabs.filter('#fixedTabs'),
        $tabList = $allTabs.filter('#mainTabs'),

        $scrollCon = $('.fui-taboperation-scroller', $tabsHead),
        $scrollL = $('.fui-tabscroller-left', $tabsHead),
        $scrollR = $('.fui-tabscroller-right', $tabsHead),

        $close = $('.fui-taboperation-close', $tabsHead),
        $more = $('.fui-taboperation-more', $tabsHead),
        $dropdown = $('.fui-taboperation-dropdown', $tabsHead),

        $history = $('.fui-taboperation-history', $dropdown),
        $current = $('.fui-taboperation-current', $dropdown),
        $curFixed = $current.filter('#currentFixed'),
        $curCommon = $current.filter('#currentCommon'),

        $mainframe = $('#mainframe', $tabsNav);

    var M = Mustache,
        tabTmpl = $.trim(TAB_ITEM_TPL),
        tabConTmpl = $.trim(TAB_CONTENT_TPL),
        // tabHistoryTmpl = $.trim(TAB_HISTORY_TPL),
        tabCurrTmpl = $.trim(TAB_CURRENT_TPL);

    var OPERATION_WIDTH = $('.fui-main-taboperation', $tabsHead).outerWidth(true),
        MESSAGE_WIDTH = $('.fui-main-msg', $tabsHead).outerWidth(true),
        SCROLL_STEP = 100,
        fixedTab_width = 0;

    var scrollRange = 0,
        shownRange = 0;

    var tabsCache = {},
        fixedTab = [],
        // 最后一个固定tab的id
        lastFixedTabId = '';

    var historyChanged = false,
        currentChanged = false;

    var activeTabId = null;

    var HistoryMgr = {
        _cache: [],

        _reSort: function (index) {
            var item = this._cache[index];
            for (var i = 0; i <= index; i++) {
                var temp = this._cache[i];

                this._cache[i] = item;

                item = temp;
            }
        },

        _inHistory: function (item) {
            for (var i = 0, len = this._cache.length; i < len; i++) {
                if (this._cache[i].id == item.id) {
                    return i;
                }
            }

            return -1;
        },

        addHistory: function (item) {
            var index = this._inHistory(item);
            // 已在历史记录中，则将其提到第一个
            if (index > -1) {
                if (index > 0) {
                    this._reSort(index);
                    historyChanged = true;
                }
            } else {
                if (this._cache.length >= 3) {
                    this._cache.pop();
                }

                this._cache.unshift(item);
                historyChanged = true;
            }
        },

        removeHistory: function (item) {
            for (var i = 0, len = this._cache.length; i < len; i++) {
                if (this._cache[i].id == item.id) {
                    this._cache.splice(i, 1);
                    historyChanged = true;
                    break;
                }
            }

        }
    };

    // var buildHistory = function() {
    //     $history.empty();

    //     if (HistoryMgr._cache.length) {
    //         $.each(HistoryMgr._cache, function(i, item) {
    //             $(Util.clearHtml(M.render(tabHistoryTmpl, item))).appendTo($history);
    //         });
    //     } else {
    //         $history.html('<li class="fui-history-item empty" >无记录</li>');
    //     }

    //     historyChanged = false;
    // };

    var buildCurrent = function (isfixed) {
        if (isfixed) {
            $curFixed.empty();
            $.each(fixedTab, function (i, id) {
                var view = {
                    id: tabsCache[id].id,
                    name: tabsCache[id].name,
                    isFixed: true
                };

                if (id == activeTabId) {
                    view.isActive = true;
                }
                $(Util.clearHtml(M.render(tabCurrTmpl, view))).appendTo($curFixed);
            });
        } else {
            $curCommon.empty();
            $.each(tabsCache, function (i, item) {
                if (item && item.closeIcon) {
                    var view = {
                        id: item.id,
                        name: item.name
                    };

                    if ('tab-' + item.id == activeTabId) {
                        view.isActive = true;

                        $curFixed.find('.active').removeClass('active');
                    }
                    $(Util.clearHtml(M.render(tabCurrTmpl, view))).appendTo($curCommon);
                }
            });

        }

        currentChanged = false;
    };

    // 调整关闭所有按钮的可用状态
    var ajustCloseAllIcon = function () {
        if ($tabList.children().length) {
            $close.removeClass('disabled');
        } else {
            $close.addClass('disabled');
        }
    };

    // 调整当前打开tab记录中的高亮情况
    var ajustCurrent = function () {
        var $active = $current.find('[data-tabid="' + activeTabId + '"]');
        if ($active.length && !$active.hasClass('active')) {
            $current.find('.active').removeClass('active');
            $active.addClass('active');
        }
    };

    var tabDefaultSetting = {
        closeIcon: true
    };

    win.TabsNav = {
        _tab_w: null,

        _getTabWidth: function () {
            if (!this._tab_w) {
                this._tab_w = $tabList.children().eq(0).outerWidth(true);
            }

            return this._tab_w;
        },

        addTab: function (cfg, withoutActive) {
            var data = $.extend({}, tabDefaultSetting, cfg),
                tabId = 'tab-' + data.id,
                $tabContent;

            // 不存在，则添加
            if (!tabsCache[tabId]) {
                // 补全路径
                if (!withoutActive) {
                    data.url = Util.getRightUrl(data.url);
                } else {
                    data.realUrl = Util.getRightUrl(data.url);
                    data.url = 'about:blank';
                }

                // 可关闭，则为非固定tab
                if (data.closeIcon) {
                    $(Util.clearHtml(M.render(tabTmpl, data))).appendTo($tabList);
                } else {
                    $(Util.clearHtml(M.render(tabTmpl, data))).appendTo($fixedTabs);
                }

                $tabContent = $(Util.clearHtml(M.render(tabConTmpl, data))).appendTo($mainframe);

                tabsCache[tabId] = data;

                if (withoutActive) {
                    tabsCache[tabId].notInit = true;
                }

                this.adjustSize();

                currentChanged = true;

                ajustCloseAllIcon();
            }

            if (!withoutActive) {
                this.activeTab(tabId);
            }
        },

        getActiveTab: function () {
            var $li = $allTabs.find('li.active'),
                data = tabsCache[$li[0].id];

            return new Tab(data);
        },

        // start form 0
        getTabByIndex: function (index) {
            // var $li = $tabList.find('li').eq(index);

            // if(!$li.length) {
            //     console.warn('警告：索引越界，当前范围[0 - %s]', $tabList.find('li').length - 1);
            //     return;
            // }

            // var data = tabsCache[$li[0].id];

            // return new Tab(data);
        },

        activeTab: function (id) {
            var $tab = $('#' + id);
            if ($tab.length) {
                var $tabCon = $('#' + $tab[0].getAttribute('ref')),
                    data = tabsCache[id];

                if ($tab.hasClass('active')) {
                    return;
                }

                $allTabs.find('li.active').removeClass('active');
                $tab.addClass('active');

                if (data.notInit) {
                    $tabCon.find('iframe')[0].src = data.realUrl;
                    data.notInit = false;
                }
                $tabCon.addClass('active')
                    .siblings('.fui-tab-content')
                    .removeClass('active');

                activeTabId = id;

                ajustCurrent();

                if ($.inArray(id, fixedTab) == -1) {
                    this.adjustTabPosOnActive(id);
                }
            }

        },

        // make active tab shown
        adjustTabPosOnActive: function (id) {
            if ($scrollCon.hasClass('invisible')) {
                return;
            }

            var $li = $('#' + id),
                $prev_lis = $li.prevAll(),

                tab_w = this._getTabWidth(),
                scroll_w = Math.ceil((Math.abs(parseFloat($tabList.css('margin-left'), 10)))),
                marginLeft = scroll_w,
                prev_w = tab_w * $prev_lis.length;

            // $prev_lis.each(function(i, li) {
            //     prev_w += $(li).outerWidth(true);
            // });

            if (prev_w < scroll_w) {
                marginLeft = prev_w;

            } else if (prev_w >= (shownRange + scroll_w)) {
                marginLeft = prev_w + tab_w - shownRange;

            } else if (prev_w > scroll_w && prev_w < (shownRange + scroll_w) && (prev_w + tab_w) > (shownRange + scroll_w)) {
                marginLeft = prev_w + tab_w - shownRange;
            }

            $tabList.stop(true).animate({
                marginLeft: -marginLeft
            }, 500);

            if (marginLeft === 0) {
                $scrollL.addClass('disabled');
                $scrollR.removeClass('disabled');
            } else if (marginLeft == scrollRange) {
                $scrollL.removeClass('disabled');
                $scrollR.addClass('disabled');
            } else {
                $scrollL.removeClass('disabled');
                $scrollR.removeClass('disabled');
            }
        },

        removeTab: function (id) {
            var $tab = $('#' + id),
                $tabCon = $('#' + $tab[0].getAttribute('ref'));

            if ($tab.hasClass('active')) {
                if ($tab.prev().length) {
                    this.activeTab($tab.prev()[0].id);
                } else if ($tab.next().length) {
                    this.activeTab($tab.next()[0].id);
                } else {
                    // 高亮最后一个固定tab
                    this.activeTab(lastFixedTabId);
                }
            }

            $tab.remove();
            // 清理tab内容页iframe
            Util.clearIframe($tabCon.find('>iframe'));
            $tabCon.remove();
            delete tabsCache[id];

            this.adjustSize();

            currentChanged = true;

            ajustCloseAllIcon();
        },

        // remove all tabs except fixed tabs
        removeAll: function (id) {

            $tabList.find('.fui-main-tab').each(function (i, li) {
                var tabId = li.id;

                if (tabId != id) {
                    TabsNav.removeTab(tabId);
                }
            });

            if (!id) {
                TabsNav.activeTab(lastFixedTabId);
            }
        },

        adjustSize: function () {
            var max_w = $tabsHead.width() - OPERATION_WIDTH - MESSAGE_WIDTH - fixedTab_width - 1,
                tabs_w = this._getTabWidth() * $tabList.children().length;

            // $tabList.css('width', 'auto');
            // $('> li', $tabList).each(function(i, li) {
            //     tabs_w += $(li).outerWidth(true);
            // });
            if (tabs_w > 0) {
                $tabList.css('width', tabs_w);
            }

            if (max_w > tabs_w) {
                $scrollCon.addClass('invisible');

                $tabList.stop(true).css('margin-left', 0);
                $wrap.css('width', 'auto');
            } else {
                $scrollCon.removeClass('invisible');

                $scrollR.addClass('disabled');
                $scrollL.removeClass('disabled');

                scrollRange = tabs_w - max_w;
                shownRange = max_w;

                $tabList.stop(true).css('margin-left', -scrollRange);
                $wrap.css('width', shownRange);
            }
        },

        refreshTabContent: function (id) {
            var $tab = $('#' + id),
                $tabCon = $('#' + $tab[0].getAttribute('ref'));

            // $('iframe', $tabCon)[0].contentWindow.location.reload();
            // 不要直接reload，而是赋值为原地址，可防止页面报错后 刷新仍是错误页面的地址。
            $('iframe', $tabCon)[0].src = 'about:blank';
            $('iframe', $tabCon)[0].src = Util.getRightUrl(tabsCache[id].realUrl || tabsCache[id].url);
        }
    };

    // Tab模型，内部使用
    var Tab = function (data) {
        this._data = data;
    };

    $.extend(Tab.prototype, {
        remove: function () {
            var tabId = 'tab-' + this._data.id;

            if ($.inArray(tabId, fixedTab) > -1) {
                console.warn('警告：固定Tab是不能删除的！');
                return;
            }

            TabsNav.removeTab(tabId);
        },

        getData: function () {
            var data = this._data;

            return $.extend({}, data, {
                tabId: 'tab-' + data.id
            });
        },

        refreshContent: function () {
            var tabId = 'tab-' + this._data.id;

            TabsNav.refreshTabContent(tabId);
        },

        active: function () {
            var tabId = 'tab-' + this._data.id;

            TabsNav.activeTab(tabId);
        },

        prev: function () {
            var $li = $('#tab-' + this._data.id),
                $prev = $li.prev();

            if (!$prev.length) {
                console.warn('已经到头了！');
                return;
            }

            return new Tab(tabsCache[$prev[0].id]);
        },

        next: function () {
            var $li = $('#tab-' + this._data.id),
                $next = $li.next();

            if (!$next.length) {
                console.warn('已经到尾了！');
                return;
            }

            return new Tab(tabsCache[$next[0].id]);
        }
    });

    var hideDropdown = function () {
        if ($more.hasClass('active')) {
            $more.removeClass('active');
            $dropdown.addClass('hidden');
        }
    };

    // 内部使用，带历史记录的
    var _removeTab = function (tabId) {
        HistoryMgr.addHistory(tabsCache[tabId]);
        TabsNav.removeTab(tabId);
    };

    var closeAllDialogNotTip = false;

    /*
    var closeAllDialog = null;
    var showCloseAllDialog = function() {
        if (!closeAllDialog) {
            closeAllDialog = new TipDialog({
                showNoTipCheck: true,
                clickNoTipCheck: function(checked) {
                    closeAllDialogNotTip = checked;
                },
                // 是否显示关闭
                showClose: true,
                title: '系统提示',
                msg: '关闭所有tab？',
                // info|success|confirm|deny|warn|error
                type: 'confirm',
                // button config array
                btns: [{
                    text: '确定',
                    role: 'yes'
                }, {
                    text: '取消',
                    role: 'cancel'
                }],

                callback: function(role, options) {
                    if (role == 'yes') {
                        TabsNav.removeAll();
                    }
                }
            });
        }
        closeAllDialog.show(true);
    };
    */

    var showCloseAllDialog = function () {
        mini.showMessageBox({
            title: '系统提示',
            message: '关闭所有tab？',
            buttons: ['ok', 'cancel'],
            iconCls: 'mini-messagebox-question',
            showNoTipCheck: true,
            clickNoTipCheck: function (checked) {
                closeAllDialogNotTip = checked;
            },
            callback: function (action) {
                if (action == 'ok') {
                    TabsNav.removeAll();
                }
            }
        });
    };

    $(win).on('resize', function (event) {
        TabsNav.adjustSize();
    });

    // active selected tab
    $tabsNav.on('click', '.fui-main-tab', function (event) {
        TabsNav.activeTab(this.id);
    }).on('click', '.fui-tab-refresh', function (event) {
        event.stopPropagation();

        TabsNav.refreshTabContent(this.parentNode.id);

        // 由于阻止了冒泡，要手动将显示的下拉框隐藏掉
        hideDropdown();
    }).on('click', '.fui-tab-close', function (event) {
        event.stopPropagation();

        var tabId = this.parentNode.id;

        _removeTab(tabId);

        // 由于阻止了冒泡，要手动将显示的下拉框隐藏掉
        hideDropdown();
    });

    // scroll right
    $scrollR.on('click', function (event) {
        var ml = parseInt($tabList.css('marginLeft'));

        if (ml != -scrollRange) {
            ml -= SCROLL_STEP;
            if (ml <= -scrollRange) {
                ml = -scrollRange;
                $scrollR.addClass('disabled');
            }
            $tabList.stop(true, true).animate({
                marginLeft: ml
            }, 500);
        }

        $scrollL.removeClass('disabled');
    });

    // scroll left
    $scrollL.on('click', function (event) {
        var ml = parseInt($tabList.css('marginLeft'));
        if (ml !== 0) {
            ml += SCROLL_STEP;
            if (ml >= 0) {
                ml = 0;
                $scrollL.addClass('disabled');
            }
            $tabList.stop(true, true).animate({
                marginLeft: ml
            }, 500);
        }
        $scrollR.removeClass('disabled');
    });

    // 关闭所有
    $close.on('click', function () {
        if (!$close.hasClass('disabled')) {
            if (!closeAllDialogNotTip) {
                showCloseAllDialog();
            } else {
                TabsNav.removeAll();
            }
        }
    });

    // 关闭历史及已打开
    var $pageCover = $('#page-cover');
    $more.on('click', function () {
        var $this = $(this);

        if ($this.hasClass('active')) {
            hideDropdown();
        } else {
            $this.addClass('active');

            // if (historyChanged) {
            //     buildHistory();
            // }
            if (currentChanged) {
                buildCurrent();
            }
            $dropdown.removeClass('hidden');
            $pageCover.removeClass('hidden');
        }
    });

    var hideTimer = null;
    $dropdown.on('click', '.fui-history-item', function () {
        var $this = $(this);
        if (!$this.hasClass('empty')) {
            var url = $this.data('url'),
                tabId = $this.data('tabid'),
                name = $this.text();

            TabsNav.addTab({
                id: tabId.substr(4),
                name: name,
                url: url
            });

            HistoryMgr.removeHistory(tabsCache[tabId]);
            hideDropdown();

        }

    }).on('click', '.fui-current-item', function () {
        var $this = $(this),
            tabId = $this.data('tabid');

        if (!$this.hasClass('active')) {
            TabsNav.activeTab(tabId);
            $current.find('.active').removeClass('active');
            $this.addClass('active');
        }

        hideDropdown();
    });

    $('body').on('click', function (e) {
        // if (!$.contains($wrap[0], e.target)) {
        if ($(e.target).closest('.fui-main-taboperation').length === 0) {
            hideDropdown();
        }
    });
    // .on('mouseleave', function () {
    //     if (hideTimer) {
    //         clearTimeout(hideTimer);
    //     }

    //     hideTimer = setTimeout(function () {
    //         hideDropdown();
    //     }, 2000);
    // }).on('mouseenter', function () {
    //     if (hideTimer) {
    //         clearTimeout(hideTimer);
    //     }
    // });

    // var contextMenu = new EpContextMenu({
    //     id: 'tabContextMenu',
    //     items: [{
    //         text: '刷新',
    //         icon: 'images/mainframe/tab-bar/icon-refresh.png',
    //         role: 'tab-refresh',
    //         click: function(opt) {
    //             TabsNav.refreshTabContent(opt.tabId);
    //         }
    //     }, 'sep', {
    //         text: '关闭其他',
    //         icon: 'images/mainframe/tab-bar/icon-close-other.png',
    //         role: 'tab-removeother',
    //         click: function(opt) {
    //             TabsNav.removeAll(opt.tabId);

    //             //  清空关闭历史
    //             // HistoryMgr.clearHistory();
    //         }
    //     }, {
    //         text: '关闭',
    //         icon: 'images/mainframe/tab-bar/icon-close.png',
    //         role: 'tab-remove',
    //         click: function(opt) {
    //             _removeTab(opt.tabId);
    //         }
    //     }, 'sep', {
    //         text: '取消'
    //     }]
    // });

    win.tabContextMenu = {
        refresh: function (e) {
            var tabId = e.sender.ownerMenu.tabId;
            TabsNav.refreshTabContent(tabId);
        },
        closeOther: function (e) {
            var tabId = e.sender.ownerMenu.tabId;
            TabsNav.removeAll(tabId);
        },
        close: function (e) {
            var tabId = e.sender.ownerMenu.tabId;
            _removeTab(tabId);
        }
    };

    var contextMenu = mini.get('tabContextMenu');

    $(contextMenu.el).on('mouseout', function () {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        hideTimer = setTimeout(function () {
            contextMenu.hide();
        }, 500);
    }).on('mouseover', function () {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

    });

    $tabList.on('contextmenu', '.fui-main-tab', function (event) {
        var tabId = this.id;


        // if($(this).hasClass('closeable')){
        //  contextMenu.enableItem('tab-removeother').enableItem('tab-remove');
        // }else{
        //  contextMenu.disableItem('tab-remove').disableItem('tab-removeother');
        // }
        contextMenu.set({
            'tabId': tabId
        }).showAtPos(event.pageX, event.pageY);
        return false;
    });

    // $(document).on('click', function(event) {
    //     if (!$.contains($dropdown[0], event.target) && event.target.className.indexOf('fui-taboperation-more') < 0) {
    //         hideDropdown();
    //     }
    // });

    // 将固定tab初始化的方法开放出来，以备菜单初始化后调用
    win.initFixedTab = function () {
        $.each(FixedTabs, function (i, item) {
        	if (item.name =="我的桌面")
        	 item.url ="/frame/pages/eianalysemis/desktop/index";
            TabsNav.addTab({
                id: item.id,
                name: item.name,
                url: item.url,
                closeIcon: false
            }, true);
            fixedTab.push('tab-' + item.id);
            lastFixedTabId = 'tab-' + item.id;
        });

        // 默认显示第一个固定tab
        TabsNav.activeTab('tab-' + FixedTabs[0].id);

        fixedTab_width = $fixedTabs.outerWidth(true);

        buildCurrent(true);

        addNiceScroll();
    };

    var _addNiceScroll = function () {
        $curCommon.niceScroll({
            cursorcolor: '#666'
        });
    };

    // 增加虚拟滚动条
    var addNiceScroll = function () {
        if ($.niceScroll) {
            _addNiceScroll();
        } else {
            Util.loadJs('frame/fui/js/lib/jquery.nicescroll.min.js', _addNiceScroll);
        }
    };

}(this, jQuery));

// 右侧消息交互
(function (win, $) {
    var $rightMessage = $('#rightMessage'),
        $iconList = $('.fui-msg-iconlist', $rightMessage),
        $msgPanel = $('.msg-panel', $rightMessage),

        $remindNum = $('.icon-info', $iconList).next(),
        $eMsgNum = $('.icon-emsg', $iconList).next(),

        $msgRemind = $('#msgRemind', $msgPanel),
        $msgRemindContent = $('.msg-panel-content', $msgRemind);

    var $msgSound = $('#msg-sound'),
        $soundIframe,
        msgAudio;
    // 根据浏览器加载不同的声音提醒方案
    if (Util.browsers.isIE) {
        $soundIframe = $('<iframe src="" frameborder="0" class="hidden" id="msgcenter-sound"></iframe>').appendTo($msgSound);
    } else {
        $msgSound.html('<audio id="msgcenter-sound-audio" controls="controls" src="../../msgsound/newsms.wav" class="hidden-accessible"></audio>');
        msgAudio = document.getElementById('msgcenter-sound-audio');
    }
    var M = Mustache,
        msgRemindTempl = $.trim(MSG_TPL);


    var CookieMgr = {
        _cookie: {},

        _reSort: function (cookie, index) {
            var item = cookie[index];
            for (var i = 0; i <= index; i++) {
                var temp = cookie[i];

                cookie[i] = item;

                item = temp;
            }
        },

        _inCookie: function (cookie, value) {
            for (var i = 0, len = cookie.length; i < len; i++) {
                if (cookie[i] == value) {
                    return i;
                }
            }

            return -1;
        },

        getCookie: function (type) {
            if (!this._cookie[type]) {
                var val = $.cookie(type + 'History') || '';
                this._cookie[type] = val.split(';');
            }

            return this._cookie[type];
        },

        setCookie: function (type, value) {
            var cookie = this.getCookie(type);
            var index = this._inCookie(cookie, value);
            if (index > -1) {
                if (index > 0) {
                    this._reSort(cookie, index);
                }
            } else {
                if (cookie.length >= 5) {
                    cookie.pop();
                }
                cookie.unshift(value);
            }

            $.cookie(type + 'History', cookie.join(';'), {
                expires: 30
            });
        },

        removeCookie: function (type, value) {
            var cookie = this.getCookie(type);

            var index = this._inCookie(cookie, value);

            if (index > -1) {
                cookie.splice(index, 1);

                $.cookie(type + 'History', cookie.join(';'), {
                    expires: 30
                });
            }
        }
    };

    var delHtmlTag = function (str) {
        return str.replace(/<[^>]+>/g, "");
    };

    var parseNum = function (num) {
        var n = parseInt(num);

        if (n > 99) {
            return '99+';
        } else if (n <= 0) {
            return '';
        }

        return n + '';
    };



    var getMessageCount = function () {
        var hasNew = false, // 是否有新的未读消息，控制提示音播放
            hasMessage = false; // 是否有未读消息，控制标题滚动
        var oNum, nNum;
        var xhr = Util.ajax({
            url: MsgNumUrl,
            data: {
                "haseXun": true, // 是否包含eXun 消息数目
                "needNum": true // 是否需要实际的提醒数目
            }
        });

        xhr.done(function (data) {

            if (data.remind) {
                nNum = parseInt(data.remind);
                oNum = $remindNum.data('num') || 0;
                if (nNum > oNum) {
                    hasNew = true;
                } else if (nNum) {
                    hasMessage = true;
                }
                $remindNum.text(parseNum(nNum)).data('num', nNum);

            } else {
                $remindNum.text('').data('num', 0);
            }

            if (data.eXun) {
                nNum = parseInt(data.eXun);
                if (!hasNew) {
                    oNum = $eMsgNum.data('num') || 0;
                    if (nNum > oNum) {
                        hasNew = true;
                    } else if (nNum) {
                        hasMessage = true;
                    }
                }

                $eMsgNum.text(parseNum(nNum)).data('num', nNum);
            } else {
                $eMsgNum.text('').data('num', 0);
            }

            if (hasNew) {
                // 新消息加上声音提示
                // $soundIframe[0].src = Util.getRightUrl(SOUND_URL + '?_=' + (+new Date()));
                if (Util.browsers.isIE) {
                    $soundIframe[0].src = Util.getRightUrl(SOUND_URL + '?_=' + (+new Date()));
                } else {
                    msgAudio.play();
                }
                // 标题滚动
                docTitle.roll();
            } else if (!hasMessage) {
                // 停止标题滚动
                docTitle.stop();
            }
        });

    };

    var $pageCover = $('#page-cover');
    // 隐藏消息面板
    var hidePanel = function () {
        $msgPanel.animate({
            right: -350
        }, function () {
            $msgPanel.addClass('hidden');
        });
        // $pageCover.addClass('hidden');
        $iconList.find('.active').removeClass('active');
    };

    // 消息列表

    var messageList;

    function initMessageList() {
        messageList = new MessageList({
            container: $msgRemindContent,
            getUrl: MsgRemind.getUrl,
            ignoreUrl: MsgRemind.ignoreUrl,
            afterOpenMsg: hidePanel,
            afterIgnore: function (count) {
                // 目前忽略消息后不会返回数据 需要重新拉去消息。 内容的拉取在内部显示了，此处 还需要更新数值，因此手动拉去消息数目
                getMessageCount();
            }
        });
    }

    if (!win.MessageList) {
        Util.loadJs('../../messagelist/messagelist.js', function () {
            initMessageList();
        });
    } else {
        initMessageList();
    }




    // 顶部图标点击交互
    $iconList.on('click', '.fui-msg-iconitem', function (e) {
        e.stopPropagation();
        var $el = $(this),
            ref = $el.data('ref'),
            $panel = $('#' + ref, $msgPanel);

        if ($el.hasClass('active')) {
            hidePanel();
        } else {
            $el.addClass('active')
                .siblings('.active')
                .removeClass('active');

            if (ref == 'msgRemind') {
                messageList.getData();
            } else if (ref == "msgEMsg") {
                emsgList.getData();
            }

            $panel.removeClass('hidden')
                .siblings()
                .addClass('hidden');

            // 清空搜索值
            // $panel.find('.msg-srh-input').val('');

            // 隐藏搜索结果和历史面板
            // $panel.find('.msg-panel-result').addClass('hidden');
            // $panel.find('.msg-panel-history').addClass('hidden');
            $panel.find('.msg-panel-content').removeClass('hidden');
            // 先取消隐藏 再滑出
            $msgPanel.removeClass('hidden');
            $msgPanel.animate({
                right: 0
            });
            $pageCover.removeClass('hidden');
        }
    });
    // 点击任意部位后隐藏panel
    $('body').on('click', function (e) {
        if ($(e.target).closest('.msg-panel').length === 0) {
            hidePanel();
        }
    });


    //EMsg交互

    var $msgEMsg = $('#msgEMsg', $msgPanel),

        $msgEMsgIcon = $("li[data-ref='msgEMsg']", $iconList),
        $msgEMsgContent = $('.msg-panel-content', $msgEMsg),
        $msgEMsgRecent = $('.emsg-recent-list', $msgEMsgContent);

    var emsgList;

    function initEMsgList() {
        emsgList = new EMsgList({
            content: $msgEMsgRecent,
            getUrl: EmsgConfig.baseUrl,
            ignoreUrl: EmsgConfig.baseUrl,
            userImg: EmsgConfig.userImg,
            groupImg: EmsgConfig.groupImg,
            afterOpenEMsg: hidePanel,
            onDecEmsgCount: decreaseEmsgCount
        });


        win.RefreshEMsg = $.proxy(emsgList.getData, emsgList);
    }

    if (!win.EMsgList) {
        Util.loadJs('../../emsglist/emsglist.js', function () {
            initEMsgList();
        });
    } else {
        initEMsgList();
    }


    // var msgEmsgRecentTempl = $.trim(EMSG_RECENT_TPL);

    // var renderEmsgPanel = function (data) {
    //     if (data && data.sessionlist.length) {
    //         var fixdata = $.map(data.sessionlist, function (e, i) {
    //             if (e.type === "friend" && e.imgUrl === "") {
    //                 e.imgUrl = EmsgConfig.userImg;
    //             }
    //             if (e.type === "group") {
    //                 e.imgUrl = EmsgConfig.groupImg;
    //             }
    //             e.message = e.message.replace(/<[^>]+>/g, "").replace(/&nbsp;/ig, "");
    //             return e;
    //         });
    //         var html = M.render(msgEmsgRecentTempl, {
    //             items: fixdata
    //         });
    //         $(Util.clearHtml(html)).appendTo($msgEMsgRecent.empty());
    //     }
    // };

    // var getEmsgRecentMessage = function () {
    //     if (!$msgEMsgIcon.hasClass("active")) {
    //         return false;
    //     }
    //     var xhr = Util.ajax({
    //         url: EmsgConfig.baseUrl,
    //         data: {
    //             'query': 'loadrecentsession'
    //         },
    //     });
    //     xhr.done(renderEmsgPanel);
    // };

    // win.RefreshEMsg = getEmsgRecentMessage;

    // var ignoreMessage = function (sessionid) {
    //     Util.ajax({
    //         url: EmsgConfig.baseUrl,
    //         data: {
    //             'query': 'ignoremessage',
    //             'sessionid': sessionid
    //         }
    //     });
    // };
    var decreaseEmsgCount = function () {
        var cnt = $eMsgNum.text();
        if (cnt) {
            cnt = (parseInt(cnt)) - 1;
        }
        if (cnt == 0) {
            cnt = "";
        }
        $eMsgNum.text(cnt);
    };
    // $msgEMsgRecent.on("click", ".emsg-ignore-icon", function (e) {
    //     e.stopPropagation();
    //     $(this).closest("div").find(".emsg-not-read").remove();
    //     var sessionid = $(this).closest("li").removeClass('newmsg').data("sessionid");
    //     ignoreMessage(sessionid);
    //     decreaseEmsgCount();
    //     $(this).remove();
    // }).on("click", ".emsg-recent-item", function (e) {
    //     e.stopPropagation(e);
    //     $(this).removeClass('newmsg');
    //     var $ignoreicon = $(this).find(".emsg-not-read,.emsg-ignore-icon");
    //     var sessionid = $(this).data("sessionid"),
    //         uid = $(this).data("uid"),
    //         type = $(this).data("type");
    //     if ($ignoreicon.length) {
    //         $ignoreicon.remove();
    //         decreaseEmsgCount();
    //     }
    //     hidePanel();
    //     OpenEMsg(sessionid, uid, type);
    // });

    $msgPanel.on('click', '.msg-panel-hide', function () {
        hidePanel();
    });

    $(function () {
        getMessageCount();

        // 轮训获取消息
        setInterval(getMessageCount, 60000);

        // $('.msg-srh-input', $msgPanel).placeholder();
    });
}(this, jQuery));

// 对低级浏览器增加placeholder支持
(function (win, $) {
    var enableHolder = function () {
        $('[placeholder]').placeholder();
    };

    // placeholder
    if ($.placeholder) {
        enableHolder();
    } else {
        Util.loadJs('frame/fui/js/lib/jquery.placeholder.min.js', enableHolder);
    }
}(this, jQuery));


// (function (win, $) {
// var $rightMessage = $('#rightMessage'),
//     $remindNum = $('.icon-info', $rightMessage).next(),
//     // $attentionNum = $('.icon-attention', $rightMessage).next(),
//     $eMsgNum = $('.icon-emsg', $rightMessage).next();

// var $soundIframe = $('#msgcenter-sound');
// var msgAudio = document.getElementById('msgcenter-sound-audio');

//消息数量推送
// win.NewMessageRemind = function (data) {
//     var parseNum = function (num) {
//         if (num > 99) {
//             return '99+';
//         } else if (num <= 0) {
//             return '';
//         }
//         return num + '';
//     };

//     var hasNew = false;
//     var oNum, nNum;
//     if (data.msgRemindNum) {
//         nNum = parseInt(data.msgRemindNum);
//         oNum = parseInt($remindNum.text()) || 0;
//         if (nNum > oNum) {
//             hasNew = true;
//         }
//         $remindNum.text(parseNum(nNum));
//     } else {
//         $remindNum.text('');
//     }

//     // if (data.msgAttentionNum) {
//     //     nNum = parseInt(data.msgAttentionNum);
//     //     if (!hasNew) {
//     //         oNum = parseInt($attentionNum.text()) || 0;
//     //         if (nNum > oNum) {
//     //             hasNew = true;
//     //         }
//     //     }
//     //     $attentionNum.text(parseNum(nNum));
//     // } else {
//     //     $attentionNum.text('');
//     // }

//     if (data.msgEMsgNum) {
//         nNum = parseInt(data.msgEMsgNum);
//         if (!hasNew) {
//             oNum = parseInt($eMsgNum.text()) || 0;
//             if (nNum > oNum) {
//                 hasNew = true;
//             }
//         }
//         $eMsgNum.text(parseNum(nNum));
//     } else {
//         $eMsgNum.text('');
//     }

//     if (hasNew) {
//         // 新消息加上声音提示
//         // $soundIframe[0].src = Util.getRightUrl(SOUND_URL + '?_=' + (+new Date()));
//         // 在前面已经动态创建过了。直接根据元素判断
//         if ($soundIframe.length) {
//             // 有这个iframe则为其设置地址即可
//             $soundIframe[0].src = Util.getRightUrl(SOUND_URL + '?_=' + (+new Date()));
//         } else {
//             // 非IE使用audio提醒
//             msgAudio && msgAudio.play();
//         }
//         // 标题滚动
//         docTitle.roll();
//     } else {
//         // 停止标题滚动
//         docTitle.stop();
//     }

// };


// }(this, jQuery));


// 标题滚动
(function (win, $) {
    var ROLLER_TEXT = '您有新消息提醒，请点击查看！';

    // document title roller
    // 标题是获取用户信息后设置的，不能直接取 在实际调用时再取得
    // var title = document.title,
    var title,
        rollerTip = ROLLER_TEXT,
        timer = 0;

    var restoreDocTitle = function () {
        clearTimeout(timer);

        document.title = title || document.title;
        rollerTip = ROLLER_TEXT;
    };

    var rollDocTitle = function () {
        // 仅在首次时赋值标题
        if (!title) title = document.title;

        document.title = rollerTip;

        clearTimeout(timer);

        timer = setTimeout(function roll() {
            document.title = rollerTip.substring(1, rollerTip.length) + rollerTip.substring(0, 1);
            rollerTip = document.title;

            timer = setTimeout(roll, 300);
        }, 300);
    };

    win.docTitle = {
        roll: rollDocTitle,
        stop: restoreDocTitle
    };

})(window, jQuery);


/*
 * 打开E讯聊天窗口
 * sessionid 会话id，当传入一个参数时sessionid表示uid
 * uid 对方用户id
 * type 个人：friend 讨论组：group
 */
var eMsgSocket;
window.OpenEMsg = function (sessionid, uid, type) {

    if (window.eMsg) {
        if (typeof uid == 'undefined') {
            eMsg.open(sessionid);
        } else {
            eMsg.openSession(sessionid, uid, type);
        }
    } else {
        Util.loadPageModule({
            templ: 'frame/fui/pages/emsg/emsg.tpl',
            js: 'frame/fui/pages/emsg/emsg.js',
            css: 'frame/fui/pages/emsg/emsg.css',
            callback: function () {
                // eMsg = new EMsgDialog();
                eMsgSocket = new EMsgSocket(_userGuid_, _userName_);
                if (typeof uid == 'undefined') {
                    eMsg.open(sessionid);
                } else {
                    eMsg.openSession(sessionid, uid, type);
                }
            }
        });
    }
};

// 空白处点击 收起菜单
(function ($) {
    var $headerUser = $('#headerUser'),
        $left = $('#leftNav,#navOverall'),
        $pageCover = $('#page-cover');

    $('body').on('click', function (e) {
        var target = e.target,
            $target = $(target),
            needHideCover = true;

        //  在右侧面板区域
        if ($(e.target).closest('.msg-panel').length !== 0) {
            needHideCover = false;
        }
        // 在用户下拉区域
        if ($.contains($headerUser[0], target)) {
            needHideCover = false;
        }
        // 在左侧菜单区域
        if ($.contains($left[0], target) || $.contains($left[1], target)) {
            needHideCover = false;
        }
        // 在tabs区域
        if ($target.closest('.fui-main-taboperation').length !== 0) {
            needHideCover = false;
        }

        needHideCover && $pageCover.addClass('hidden');
    });
})(jQuery);