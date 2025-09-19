/*!
 * 主题2-breeze
 * author:JiangJinJian
 * date: 2018-05-31
 * version: 1.0.0
 */

/* global UserSettings, _userName_, _userGuid_, _getNiceScroll_, tabsNavConfig, getDataUrl,resizeTab, EpTabsNav, createMainContentCover, dealLinkOpen, initPortal, eWebSocket:true */
var FIRST_MENU_TPL = '{{#items}}<li class="leaf-item"><a href="javascript:;" data-code="{{code}}" data-name="{{name}}" data-url="{{url}}" data-openType="{{openType}}" data-hassub="{{hasSub}}" class="top-item"><div class="clearfix relative"><div class="l"><i class="icons font-icons {{icon}}"></i></div><div class="l text-name-contain text-ellipsis"><span class="text-name" title="{{name}}">{{name}}</span></div>{{#hasSub}}<div class="l arrow-icon"></div>{{/hasSub}}</div></a></li>{{/items}}';
var SECOND_MENU_TPL = '<li class="leaf-item"><a href="javascript:;" data-code="{{code}}" data-name="{{name}}" data-url="{{url}}" data-openType="{{openType}}" data-hassub="{{hasSub}}" style="padding-left: {{indent}}px;" class="second-item"><div class="clearfix relative"><div class="l icons-contain"><i class="icons font-icons {{icon}}"></i></div><div class="l text-name-contain text-ellipsis"><span class="text-name" title="{{name}}">{{name}}</span></div>{{#hasSub}}<div class="l arrow-icon"></div>{{/hasSub}}</div></a>{{#hasSub}}<ul class="dep-{{depLen}}">{{{subMenu}}}</ul>{{/hasSub}}</li>';

var $surfaceMain = $('#surface-main'),
    $header = $('#header'),
    $sidebarPopUp = $('#sidebar-popup'),
    $msgPanel = $('#msg-panel'),
    $themeBtn = $('#themes-btn'),
    $breezeTabs = $(tabsNavConfig.tabsContainer);

// pagerCover 容器以及生成方法
var $coverContainer = $('#page-cover');
if (Util.browsers.isIE && window.hasObjectTag) {
    window.createMainContentCover = function () {
        var iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.scrolling = 'no';
        iframe.frameBorder = 0;
        iframe.style.background = 'transparent';
        iframe.src = '../../activexcover/activexcover.html';

        var $cover = $('<div class="main-content-cover hidden"></div>');
        return $cover.append(iframe).appendTo($coverContainer);
    };
} else {
    window.createMainContentCover = function () {
        var $cover = $('<div class="main-content-cover hidden"></div>');
        return $cover.appendTo($coverContainer);
    };
}
window.dealLinkOpen = function (linkData) {
    switch (linkData.openType) {
        case 'tabsnav':
            TabsNav.addTab(linkData);
            break;
        case 'dialog':
            epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
            break;
        case 'blank':
            window.open(Util.getRightUrl(linkData.url), linkData.id);
            break;
        default:
            break;
    }
};
// 自定义事件 用于一些逻辑控制
var _breezeEvent_ = new Util.UserEvent();
var useWebsocket = Util.getFrameSysParam('useWebsocket') === true;

// 页面websocket对象
window.eWebSocket = undefined;

// 创建websocket链接
var creatWebSocket = function (uid, uname, callback) {
    // 避免重复创建
    if (eWebSocket) {
        callback && callback();
        return;
    }

    var cfg = window.EWebSocketConfig ? window.EWebSocketConfig : {
        url: EmsgConfig.websocketUrl
    };

    cfg.uid = uid;
    cfg.uname = uname;

    if (window.EWebSocket) {
        eWebSocket = new EWebSocket(cfg);
        callback && callback();
        _breezeEvent_.fire('websocketCreated');

    } else {
        Util.loadJs('frame/fui/js/widgets/ewebsocket/ewebsocket.js', function () {
            eWebSocket = new EWebSocket(cfg);
            callback && callback();
            _breezeEvent_.fire('websocketCreated');
        });
    }
};


// 初始化 tab 切换组件 
/* global TabsNav */
window.TabsNav = new EpTabsNav(tabsNavConfig);

// 处理同步修改tab名称
(function (win, $) {
    var $currTitle = $('#current-title');
    var originActiveFn = TabsNav.activeTab;
    TabsNav.activeTab = function () {
        var $tab = $('#' + this._getTabId(arguments[0]));
        var tabName = $tab.find('.tn-tabs-nav-name')[0].getAttribute('title');
        $currTitle.text(tabName);
        return originActiveFn.apply(this, arguments);
    }
})(this, jQuery);

/**
 * 由于收缩有css动画300ms, 所以添加定时器进行调整右侧tab菜单,
 * 展开时,右侧内容变窄，tabs会掉下去，所以添加透明度进行优化
 */
window.resizeTab = function () {
    $breezeTabs.css('opacity', '0');
    setTimeout(function () {
        $(window).trigger('resize');
        $breezeTabs.css('opacity', '1');
    }, 300);
};

// 使用通用接口获取数据的方法
var _getData_ = function (method, params) {
    return Util.ajax({
        url: epoint.dealRestfulUrl(getDataUrl + '/' + method),
        data: params
    });
};

/**
 * 右侧头部
 */
(function (win, $) {
    $header.on('click', '.change-tab', function () {
        $surfaceMain.toggleClass('showtab');
        resizeTab();
    });
    // TabsNav.addTab({
    //     id: '1111',
    //     name: '我的桌面',
    //     url: './test/testcolor.html',
    //     closeIcon: false,
    //     refresh: true
    // },false);

    // for(var i = 0; i < 15; i++) {
    //     TabsNav.addTab({
    //         id: i,
    //         name: '我的桌面',
    //         url: './test/testcolor.html'
    //     });
    // }
}(window, jQuery));

/**
 * 左侧菜单
 */
(function (win, $) {
    var $menu = $('#menu'),
        $topMenu = $('#top-menu'),
        $secondMenu = $('#second-menu'),

        $menuContainer = $topMenu.add($secondMenu),

        $popupTitle = $('#popup-title');

    var $cover = createMainContentCover();

    var menuData = {}, // 二级菜单数据
        topMenuData = [],
        quickMenuData = [],
        portalData = [];


    var winInfo = {
        width: parseInt($(win).width(), 10),
        height: parseInt($(win).height(), 10)
    };

    $(win).on('resize', function () {
        winInfo = {
            width: parseInt($(win).width(), 10),
            height: parseInt($(win).height(), 10)
        };
    });

    win.initPortal = function (homes, defaultHome) {
        // 数据不对就不再做处理，避免后台返回数据不对后，js报错导致后续代码不执行
        if(!homes || !homes.length) {
            return;
        }
        var home = {
            closeIcon: false,
            refresh: true
        };
        // 记录无分类的门户
        var singleHomes = [];
        // 默认展示后端配置的 或者 第一个openType为tabnav的
        // 遍历一次 处理分类和不带分类的
        // 同时寻找 默认门户
        // todo 这里面干了太多的事情 待优化
        for (var i = 0; i < homes.length; i++) {
            var cate = homes[i];
            var finded = false;

            // 带分类的
            // if (cate.items && cate.items.length) {
            if (cate.items != undefined) {
                // 寻找默认门户或 第一个带url的用于默认值
                !finded && $.each(cate.items, function (j, item) {
                    if (defaultHome) {
                        // server set
                        if (item.code == defaultHome) {
                            home.id = item.code || 'home';
                            home.url = item.url;
                            home.name = item.name;
                            finded = true;
                            return false;
                        }
                    } else {
                        // the first
                        if (item.openType == 'tabsnav') {
                            home.id = item.code || 'home';
                            home.url = item.url;
                            home.name = item.name;
                            finded = true;
                            return false;
                        }
                    }
                });
            } else {
                if (!finded) {
                    if (defaultHome) {
                        // server set
                        if (cate.code == defaultHome) {
                            home.id = cate.code || 'home';
                            home.url = cate.url;
                            home.name = cate.name;
                            finded = true;
                        }
                    } else {
                        // the first
                        if (cate.openType == 'tabsnav') {
                            home.id = cate.code || 'home';
                            home.url = cate.url;
                            home.name = cate.name;
                            finded = true;
                        }
                    }
                }
                // 不带分类的
                // singleHomes.push(homes.splice(i, 1));
                singleHomes = singleHomes.concat(homes.splice(i, 1));
                i--;
            }
        }

        TabsNav.addTab(home);


        var iconCls = 'modicon-75';
        portalData = [{
            name: '内网门户',
            icon: iconCls,
            hasSub: true,
            code: 'portal',
            items: [].concat(singleHomes, homes)
        }];

        function addDefaultIcon(data) {
            $.each(data, function (i, item) {
                if (!item.icon) {
                    item.icon = iconCls;
                }
                if (item.items && item.items.length) {
                    addDefaultIcon(item.items);
                }
            });
        }
        addDefaultIcon(portalData[0].items);
    };

    // 获取菜单数据 需要将门户和菜单进行拼装
    function getTopMenu() {

        var dtd = $.Deferred();
        _getData_('getMenu', {
            query: 'all'
        }).done(function (data) {
            data = data || [];

            // 门户当菜单处理 进行拼接
            topMenuData = [].concat(portalData, data);

            // topmenu
            $(topMenuData).each(function (index, item) {
                item.hasSub = item.hasSub || !!(item.items && item.items.length);
                if (item.hasSub) {
                    menuData[item.code] = item.items;
                }
            });

            dtd.resolve(topMenuData);
        });

        return dtd.promise();
    }

    // 获取顶级菜单
    var renderTopMenu = function () {
        if (topMenuData.length) {
            // 如果已经获取一次，则不再请求
            var html = Mustache.render(FIRST_MENU_TPL, {
                items: topMenuData
            });
            $topMenu.html(html);
        } else {
            getTopMenu().done(function (data) {

                var html = Mustache.render(FIRST_MENU_TPL, {
                    items: data
                });
                $topMenu.html(html);

                // 获取快捷菜单，避免由于没有快捷菜单而导致点击切换快捷菜单按钮后，按钮消失的现象
                getQuickMenu(true);
            });
        }
    };

    // 由于门户和顶级菜单一样的显示 因此在获取界面信息成功后再处理
    _breezeEvent_.on('afterPageInfo', renderTopMenu);
    // renderTopMenu();

    // 缩进值
    var INDENT_INIT = 0,
        INDENT_STEP = 8;

    var hideSecondMenu = function () {
        // $sidebarPopUp.hide();
        $sidebarPopUp.fadeOut(100);
        $cover.addClass('hidden');
    };

    $('body').on('click', function (e) {
        var $target = $(e.target);
        // if (!$target.closest($sidebarPopUp).length || !$target.closest($topMenu).length) {
        if (!$target.closest($menuContainer).length) {
            hideSecondMenu();
            $topMenu.find('.leaf-item.active').removeClass('active');
        }
    });

    var showSecondMenu = function () {
        var top = $sidebarPopUp.data('top');

        var _content_h = parseInt($secondMenu.outerHeight(), 10) + 5 + 39; // 内容高度
        var _bottom = 0,
            _top = top - 100;

        if (top + _content_h + 32 > winInfo.height) {
            _bottom = '-32px';
            if (winInfo.height - _content_h - 32 > 0) {
                _top = 'initial';
            } else if (_content_h + 32 > winInfo.height) {
                _top = '-100px';
            }
        } else {
            _bottom = 'initial';
        }

        $sidebarPopUp.css({
            bottom: _bottom,
            top: _top
            // ,display: 'block'
        }).fadeIn(100);
    };

    // 获取节点缩进值
    var getIndent = function (rowkey) {
        //分割成数组判断长度
        var len = rowkey.split('-').length;
        if(len < 2) {
            len = 2;
        }

        return INDENT_INIT + (len - 2) * INDENT_STEP;
    };

    // 获得节点行标识
    var getRowkey = function (rowkey, i) {
        return rowkey === undefined ? i + '' : rowkey + '-' + i;
    };

    // 构建菜单结构
    var buildLeftMenu = function (data, rowkey) {
        var html = [];

        $.each(data, function (i, item) {
            var view = {
                name: item.name,
                code: item.code,
                url: item.url,
                icon: item.icon || 'modicon-1',
                openType: item.openType,
                hasSub: !!(item.items && item.items.length)
            };

            view.rowkey = getRowkey(rowkey, i);

            var rowkeyLength = view.rowkey.split('-').length;
            view.depLen = rowkeyLength;
            if (rowkeyLength === 1) {
                view.isTop = true;
                view.indent = 0;
            } else {
                view.isTop = false;
                view.indent = getIndent(view.rowkey);
            }

            // 构建结构
            // 有子菜单则递归
            if (view.hasSub) {
                html.push(
                    Mustache.render(
                        SECOND_MENU_TPL,
                        $.extend(view, {
                            subMenu: buildLeftMenu(item.items, view.rowkey)
                        })
                    )
                );
            } else {
                html.push(Mustache.render(SECOND_MENU_TPL, view));
            }
        });

        return html.join('');
    };

    var initLeftMenu = function (opt) {
        var data = opt.data,
            code = opt.code,
            top = opt.top;

        var html = buildLeftMenu(data);
        $secondMenu.html(html).attr('top-code', code);

        $sidebarPopUp.data('top', top);

        showSecondMenu();

    };

    // 获取二级菜单
    var getSecondMenu = function (code, name, top) {
        /**
         * _getData_('getMenu', {
                query: 'sub',
                code: code
            }).done(function (data) {
                $popupTitle.attr('title', name).text(name);

                initLeftMenu({
                    data: data,
                    code: code,
                    name: name,
                    top: top
                });
        
            }).fail(function () {
            });
         */

        var data = menuData[code];
        $popupTitle.attr('title', name).text(name);
        initLeftMenu({
            data: data,
            code: code,
            name: name,
            top: top
        });
    };

    // 获取快捷菜单
    var getQuickMenu = function (notRender) {

        if (quickMenuData.length) {
            if(!notRender) {
                var html = Mustache.render(FIRST_MENU_TPL, {
                    items: quickMenuData
                });
                $topMenu.html(html);
            }
            
        } else {
            _getData_('getQuickMenu').done(function (data) {
                if (!data || !data.length) {
                    $('.quick-btns').hide();
                    return;
                }
                quickMenuData = data;
                if(!notRender) {
                    $topMenu.html(Mustache.render(FIRST_MENU_TPL, {
                        items: data
                    }));
                }

            });
        }
    };

    /**
     * 点击一级菜单
     */
    $menu.on('click', '.top-item', function (e) {

            var $this = $(this),
                data = $this.data(),
                _code = data.code,
                _url = data.url,
                _name = data.name,
                _openType = data.opentype,
                _hasSub = data.hassub;

            /* if (_url) {
                if (_openType === 'tabsnav') {
                    TabsNav.addTab({
                        id: _code,
                        name: _name,
                        url: _url
                    });
                } else {
                    // 新窗口打开
                    win.open(Util.getRightUrl(_url), _code);
                }
            } */
            $this.parent().addClass('active').siblings('.active').removeClass('active');

            // 有子菜单则加载子菜单
            if (_hasSub) {
                var _top = $this.offset().top;
                getSecondMenu(_code, _name, _top);
                $cover.removeClass('hidden');
            } else {
                // 没有则 隐藏左侧
                hideSecondMenu();
                if (_url) {
                    if (_openType === 'tabsnav') {
                        TabsNav.addTab({
                            id: _code,
                            name: _name,
                            url: _url
                        });
                    } else {
                        // 新窗口打开
                        win.open(Util.getRightUrl(_url), _code);
                    }
                }
            }

        })
        /**
         * 点击二级菜单
         */
        .on('click', '.second-item', function () {
            var $this = $(this),
                data = $this.data(),
                _code = data.code,
                _url = data.url,
                _name = data.name,
                _openType = data.opentype,
                _hasSub = data.hassub;

            /* if (_url) {
                if (_openType === 'tabsnav') {
                    TabsNav.addTab({
                        id: _code,
                        name: _name,
                        url: _url
                    });
                } else {
                    // 新窗口打开
                    win.open(Util.getRightUrl(_url), _code);
                }
            } */

            if (_hasSub) {
                $this.next().slideToggle(200);
                $this.toggleClass('active');

                setTimeout(function () {
                    showSecondMenu();
                }, 400);
            } else {
                hideSecondMenu();
                if (_url) {
                    if (_openType === 'tabsnav') {
                        TabsNav.addTab({
                            id: _code,
                            name: _name,
                            url: _url
                        });
                    } else {
                        // 新窗口打开
                        win.open(Util.getRightUrl(_url), _code);
                    }
                }
            }


        })
        /**
         * 快捷菜单按钮
         */
        .on('click', '#icon-quick', function () {
            var $this = $(this);
            if (!$this.hasClass('active')) {
                $this.addClass('active');
                getQuickMenu();
            } else {
                $this.removeClass('active');
                renderTopMenu();
            }
        })
        /**
         * 菜单收缩
         */
        .on('click', '#icons-trigger', function () {
            $(this).toggleClass('active');
            $menu.toggleClass('narrow');
            $surfaceMain.toggleClass('narrow');
            resizeTab();
        });
}(window, jQuery));

// 主题皮肤切换
(function (win, $) {
    var $cover = createMainContentCover();
    var themeSelection;

    function initThemeSkin() {
        /* global getPagesUrl, savePageUrl */
        ThemeSelection._styleLoaded = true;
        themeSelection = new ThemeSelection({
            getPagesUrl: getPagesUrl,
            savePageUrl: savePageUrl,
            showCallback: function () {
                $cover.removeClass('hidden');
            },
            hideCallback: function () {
                $themeBtn.removeClass('active');
                $cover.addClass('hidden');
            }
        });
        window.themeSelection = themeSelection;

        $themeBtn.on('click', function () {
            if ($themeBtn.hasClass('active')) {
                $themeBtn.removeClass('active');
                themeSelection.hide();
            } else {
                themeSelection.show();
                $themeBtn.addClass('active');
            }
        });
        $('body').on('click', function (e) {
            var $target = $(e.target);
            if (!$target.closest('.theme-selection-container, #themes-btn').length) {
                $themeBtn.removeClass('active');
                themeSelection.hide();
            }
        });
    }

    if (!window.ThemeSelection) {
        Util.loadJs('frame/fui/js/widgets/themeselection/themeselection.js', initThemeSkin);
    } else {
        initThemeSkin();
    }
    /* global ThemeSelection */
})(this, jQuery);

// 用户信息 和 界面信息
(function (win, $) {
    var $logo = $('#logo-img'),
        $userInfo = $('#user-info'),
        $userPortrait = $('.user-portrait', $userInfo);

    var $cover = createMainContentCover();

    // 隐藏用户下拉面板
    function hideUserPanel() {
        $userInfo.removeClass('active');
        $cover.addClass('hidden');
    }

    $userInfo
        // 用户头像点击
        .on('click', '.user-info-summary', function () {
            if (!$userInfo.hasClass('active')) {
                $userInfo.addClass('active');
                $cover.removeClass('hidden');
            } else {
                hideUserPanel();
            }
        })
        .on('click', '.user-action-item', function () {
            var $this = $(this);
            // 个人信息
            if ($this.hasClass('person-info')) {
                dealLinkOpen({
                    id: this.getAttribute('data-id'),
                    name: this.getAttribute('data-name'),
                    url: this.getAttribute('data-url'),
                    openType: 'tabsnav'
                });
            } else if ($this.hasClass('logout')) {
                // 注销
                mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
                    if (action == 'ok') {
                        eWebSocket && eWebSocket.close();
                        UserSettings.logout();
                    }
                });
            } else if ($this.hasClass('role-change')) {
                // 兼职切换
                UserSettings.changeRole(_userGuid_);
            } else {
                // 其他扩展
                var openType = $this.data('opentype'),
                    id = $this.data('id'),
                    url = $this.attr('url'),
                    name = $this.text(),
                    script = $this.attr('script');
                // 无id时自动生成id 并写入，保证只会生成一次
                if (!id) {
                    id = Util.uuid();
                    $this.data('id', id).attr('data-id', id);
                }
                if (url) {
                    // url = Util.getRightUrl(url);
                    // if (openType == 'tabsnav') {
                    //     TabsNav.addTab({
                    //         id: id || 'ext-person-' + Util.uuid(),
                    //         name: name,
                    //         url: url
                    //     });
                    // } else if (openType == 'dialog') {
                    //     epoint.openTopDialog(name, url);
                    // } else {
                    //     window.open(url);
                    // }
                    dealLinkOpen({
                        id: id,
                        openType: openType,
                        name: name,
                        url: url
                    });
                } else if (script) {
                    try {
                        eval(script);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            hideUserPanel();
        });
    $('body').on('click', function (e) {
        if (!$(e.target).closest('#user-info').length) {
            hideUserPanel();
        }
    });

    var loadImg = function (url, el) {
        var img = new Image();

        img.onload = function () {
            img.onload = null;
            el.src = url;
        };

        img.onerror = function () {
            console.error(url + '对应的图片资源无法加载！');
        };

        img.src = url;
    };

    // 获取用户信息
    _getData_('getUserInfo').done(function (data) {
        // 用户guid和name是E讯必须要使用的 需要记录下来
        win._userName_ = data.name;
        win._userGuid_ = data.guid;

        // 消息中心的配置-打开是否全屏
        win._msgcenterConfig_ = $.extend({}, win.MsgCenterConfig, {
            isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
            msgCenterOrder: data.msgCenterOrder || 'asc',
            hideCallback: function () {}
        });

        // 使用websocket来更新消息数目，需要先建立连接
        if (useWebsocket) {
            creatWebSocket(_userGuid_, _userName_);
        }

        if (data.portrait) {
            // 头像
            var url = Util.getRightUrl(epoint.dealRestfulUrl(data.portrait));
            $userPortrait.attr('src', url);
        }

        // 兼职
        if (data.hasParttime) {
            $userInfo.find('.user-action-item.role-change').removeClass('hidden');
        }

        var $userInfoDetail = $('#user-info-detail');
        $userInfoDetail
            .find('.user-name')
            .text(data.name)
            .attr('title', data.name);
        $userInfoDetail
            .find('.user-dept')
            .text(data.ouName)
            .attr('title', data.ouName);
    });

    // 界面信息
    _getData_('getPageInfo').done(function (data) {
        // var $fullSearch = $('#top-full-search');
        // title
        if (data.title) {
            document.title = data.title;
            win.systemTitle = data.title;
        }
        // logo

        loadImg(Util.getRightUrl(data.logo || win.DEFAULT_LOGO_URL), $logo[0]);

        // 菜单类 homes处理
        // 1、最优先 defaultUrl 名称固定为我的桌面
        // 根据 defaultHome 从homes中取 不存在则错误提醒门户配置不正确
        // defaultUrl 和 defaultHome 都没有 则取homes 第一个
        // var actualHomes = [],
        //     hasActiveHome = false;
        // // 1 defaultUrl
        // if (data.defaultUrl) {
        //     actualHomes.push({
        //         id: 'home-default',
        //         name: '我的桌面',
        //         url: data.defaultUrl,
        //         active: true
        //     });
        //     hasActiveHome = true;
        // }
        // $.each(data.homes, function (i, item) {
        //     actualHomes.push(item);
        //     // 2 无defaultUrl 有 defaultHome
        //     if (!hasActiveHome && data.defaultHome == item.id) {
        //         hasActiveHome = true;
        //         item.active = true;
        //     }
        // });
        // // 遍历完成 在homes中没有 则提醒
        // if (!hasActiveHome && data.defaultHome) {
        //     epoint.alert('门户地址配置不正确', null, null, 'error');
        // }

        // // 3 无defaultUrl 无 defaultHome
        // if (!hasActiveHome && data.homes && data.homes.length) {
        //     data.homes[0].active = true;
        // }

        // // 加载homes
        // // homes
        // $.each(actualHomes, function (i, item) {
        //     TabsNav.addTab({
        //         id: item.id || 'home-' + i,
        //         url: item.url,
        //         name: item.name,
        //         closeIcon: false,
        //         refresh: true
        //     }, !item.active);
        // });

        // fullSearchUrl
        if (data.fullSearchUrl) {
            win._fullSearchUrl_ = data.fullSearchUrl;
        }

        // 初始化门户
        initPortal(data.homes, data.defaultHome);
        // 触发 afterPageInfo 事件
        _breezeEvent_.fire('afterPageInfo');
    });

    var EXT_TAB_TPL = '<li class="user-action-item" title="{{name}}" url="{{url}}" data-opentype="{{openType}}" script="{{script}}"><span class="{{icon}}"></span>{{name}}</li>';
    // 扩展tab加载
    _getData_('getExtTabsInfo').done(function (data) {
        if (data && data.length) {
            var html = '';
            $.each(data, function (i, item) {
                item.icon = item.icon || 'modicon-8';
                if (/^icon-/.test(item.icon)) {
                    // 操作图标
                    item.icon = 'action-icon ' + item.icon;
                }
                html += Mustache.render(EXT_TAB_TPL, item);
            });
            $(html).insertAfter('#person-info-setting');
        }
    });
})(this, jQuery);

// 消息提醒 和右侧消息
(function (win, $) {
    var $cover = createMainContentCover();

    var SOUND_URL = '../../msgsound/sound.html',
        ROLLER_TEXT = '您有新消息提醒，请点击查看！',
        rollerTip = ROLLER_TEXT,
        timer = 0,
        title = '';

    // 消息滚动
    var rollDocTitle = function () {
        // 优先取后端返回的标题
        title = win.systemTitle || document.title;

        document.title = rollerTip;

        clearTimeout(timer);

        timer = setTimeout(function roll() {
            document.title = rollerTip.substring(1, rollerTip.length) + rollerTip.substring(0, 1);
            rollerTip = document.title;

            timer = setTimeout(roll, 300);
        }, 300);
    };

    // 停止滚动
    var restoreDocTitle = function () {
        clearTimeout(timer);

        document.title = title || document.title;
        rollerTip = ROLLER_TEXT;
    };
    // 标题滚动
    win.docTitle = {
        roll: rollDocTitle,
        stop: restoreDocTitle
    };

    var $msgSound = $('#msg-sound'); 

    var parseNum = function (num) {
        var n = parseInt(num, 10);

        if (n > 99) {
            return '99+';
        } else if (n <= 0) {
            return '';
        }

        return n + '';
    };

    // 在线右侧消息
    var $iconList = $('#top-icons'),
        $remindNum = $('.icons-emsg > .tip-num', $iconList),
        $eMsgNum = $('.icons-chat > .tip-num', $iconList);

    var $msgEMsg = $('#msgEMsg', $msgPanel),
        $msgEMsgContent = $('.msg-panel-content', $msgEMsg),
        $msgEMsgRecent = $('.emsg-recent-list', $msgEMsgContent),
        $onlineUserNum = $('.online-user-num', $msgEMsg),
        onlineUserIframe = document.getElementById('online-user');

    // 获取消息数目
    var getMsgCount = function (useCache) {

        var params = {
            haseXun: true,
            needNum: true
        };
        if (useCache) {
            params.inCache = true;
        }

        return _getData_('getMsgCount', params).done(function (data) {
            updateMsgCount(data);
        });
    };

    var updateMsgCount = function (data) {
        var old = 0,
            hasNew = false;
        if (data.remind) {
            old = parseInt($remindNum.data('num'), 10) || 0;
            if (data.remind > old) {
                hasNew = true;
            }
            $remindNum.removeClass('hidden').text(parseNum(data.remind));
            $remindNum.data('num', data.remind);
        } else {
            $remindNum.text('').addClass('hidden');
        }
        if (data.eXun) {
            old = parseInt($eMsgNum.data('num'), 10) || 0;
            if (data.eXun > old) {
                hasNew = true;
            }
            $eMsgNum.removeClass('hidden').text(parseNum(data.eXun));
            $eMsgNum.data('num', data.eXun);
        } else {
            $eMsgNum.text('').addClass('hidden');
        }

        if (hasNew) {
            // 播放提醒 并滚动标题
            playNewMsgSound(100);
            // 标题滚动
            docTitle.roll();
        } else {
            // 停止标题滚动
            docTitle.stop();
        }
    };
    /**
     * 播放新消息的声音提醒
     * 
     * @param {number}  retryLimit chrome 下用户未操作的最大播放次数
     */
    var playNewMsgSound = (function ($msgSoundContainer, soundIframeUrl, soundFileUrl) {
        // 关闭则不用播放提醒
        if (Util.getFrameSysParam('messageSound') === false) {
            return Util.noop;
        }
        soundIframeUrl = Util.getRightUrl(soundIframeUrl);

        // IE 构造 iframe 播放
        if (Util.browsers.isIE) {
            var $soundIframe = $('<iframe src="" frameborder="0" class="hidden"></iframe>').appendTo($msgSoundContainer);
            return function () {
                $soundIframe[0].src = soundIframeUrl + '?_=' + +new Date();
            };
        }

        // 其他情况使用 audio 标签即可
        var msgAudio = document.createElement('audio');
        msgAudio.src = Util.getRightUrl(soundFileUrl);
        msgAudio.className = 'hidden-accessible';
        $msgSoundContainer.append(msgAudio);
        var newMsgAudioTimer = null;
        /**
         * @param {number | undefined}  retryLimit chrome 下用户未操作的最大播放次数
         */
        return function doPlayNewMsgAudio(retryLimit) {
            if (retryLimit === undefined) {
                retryLimit = 100;
            }
            msgAudio.play()['catch'](function () {
                clearTimeout(newMsgAudioTimer);
                if (retryLimit > 0) {
                    newMsgAudioTimer = setTimeout(function () {
                        doPlayNewMsgAudio(--retryLimit);
                    }, 50);
                }
            });
        };
    }($msgSound, SOUND_URL, '../../msgsound/newsms.wav'));

    // 界面信息获取完成后 开始获取消息数目 避免标题记录不对
    _breezeEvent_.on('afterPageInfo', function () {
        getMsgCount();
        if (!useWebsocket) {
            setInterval(function () {
                getMsgCount(true);
            }, 60000);
        }
    });
    // 使用websocket更新消息数目，则需要在websocket建立后绑定messagecount事件
    if (useWebsocket) {
        _breezeEvent_.on('websocketCreated', function () {

            eWebSocket.socketEvent.on('messagecount', function (e) {
                updateMsgCount(e.data);
            });
        });
    }

    /*  getMsgCount();
     setInterval(getMsgCount, 60000); */

    // 将刷新消息数目的方法开放出来，以备外部处理完代办后可以刷新主界面中的消息数目
    win.getMessageCount = getMsgCount;

    // var delHtmlTag = function (str) {
    //     return str.replace(/<[^>]+>/g, "");
    // };

    // eXun 列表
    // 减少
    var decreaseEmsgCount = function () {
        var cnt = $eMsgNum.text();
        if (cnt) {
            cnt = parseInt(cnt) - 1;
        }
        if (cnt == 0) {
            cnt = '';
            $eMsgNum.data('num', 0).addClass('hidden');
        }
        $eMsgNum.text(cnt);
    };

    var emsgList;

    function initEMsgList() {
        /* global EMsgList,EmsgConfig */
        emsgList = new EMsgList({
            content: $msgEMsgRecent,
            getUrl: EmsgConfig.baseUrl,
            ignoreUrl: EmsgConfig.baseUrl,
            userImg: EmsgConfig.userImg,
            groupImg: EmsgConfig.groupImg,
            afterOpenEMsg: function () {
                hidePanel();
            },
            onDecEmsgCount: decreaseEmsgCount
        });

        win.RefreshEMsg = $.proxy(emsgList.getData, emsgList);
    }

    if (!win.EMsgList) {
        Util.loadJs('frame/fui/js/widgets/emsglist/emsglist.js', function () {
            initEMsgList();
        });
    } else {
        initEMsgList();
    }
    /* global OnlineUserSettings */
    if (win.OnlineUserSettings && win.OnlineUserSettings.show) {
        $msgEMsg
            .find('.msg-panel-head')
            .addClass('tab')
            .find('.panel-hd-tab.hidden')
            .removeClass('hidden');

        // onlineUserIframe.src = OnlineUserSettings.url;

        $msgEMsg.on('click', '.panel-hd-tab', function () {
            var $this = $(this),
                ref = $this.data('ref'),
                hasShow = $this.data('hasShow'),
                $content = $msgEMsgRecent;

            if (!$this.hasClass('active')) {
                $this
                    .addClass('active')
                    .siblings()
                    .removeClass('active');

                if (ref) {
                    $content = $('#' + ref, $msgEMsgContent);

                    if (!hasShow) {
                        setTimeout(function () {
                            OnlineUserSettings.onRefreshData(function (count) {
                                $onlineUserNum.html(count);
                            });
                            $this.data('hasShow', true);
                        }, 10);
                    }
                }

                $content
                    .removeClass('hidden')
                    .siblings()
                    .addClass('hidden');
            }
        });
    }

    // 隐藏消息面板
    function hidePanel() {
        $cover.addClass('hidden');
        $msgPanel.stop(true).animate({
                right: -350
            },
            function () {
                $msgPanel.addClass('hidden');
            }
        );

        $iconList.find('.js-panel.active').removeClass('active');
    }
    /* global hideMessagePanel */
    win.hideMessagePanel = hidePanel;

    var msgCenter;

    win.messageCenter = {
        refresh: function () {
            if (msgCenter) {
                msgCenter.refresh();
            }
        }
    };

    // 顶部图标点击交互
    $iconList.on('click', '.js-panel', function () {
        var $el = $(this),
            ref = $el.data('ref'),
            $panel = $('#' + ref, $msgPanel);

        if ($el.hasClass('active')) {
            hidePanel();
        } else {
            $el
                .addClass('active')
                .siblings('.active')
                .removeClass('active');

            if (ref == 'msgRemind') {
                // messageList.getData();
                if (!msgCenter) {
                    msgCenter = new MsgCenter(win._msgcenterConfig_ || {});
                }
                msgCenter.show();
                hideMessagePanel();
                return;
            } else if (ref == 'msgEMsg') {
                emsgList.getData();
                if (win.OnlineUserSettings && win.OnlineUserSettings.show) {
                    // 在线人员iframe不需要一开始就加载，放到展开时再加载
                    if (!onlineUserIframe.src) {

                        onlineUserIframe.src = OnlineUserSettings.url;
                        if (onlineUserIframe.attachEvent) {
                            onlineUserIframe.attachEvent("onload", function () {
                                OnlineUserSettings.onRefreshData(function (count) {
                                    $onlineUserNum.html(count);
                                });
                            });
                        } else {
                            onlineUserIframe.onload = function () {
                                OnlineUserSettings.onRefreshData(function (count) {
                                    $onlineUserNum.html(count);
                                });
                            };
                        }

                    } else {
                        OnlineUserSettings.onRefreshData(function (count) {
                            $onlineUserNum.html(count);
                        });
                    }
                }
            }

            $panel
                .removeClass('hidden')
                .siblings('.js-detail')
                .addClass('hidden');

            $panel.find('.msg-panel-content').removeClass('hidden');
            // 先取消隐藏 再滑出
            $msgPanel.removeClass('hidden');
            $msgPanel.stop(true).animate({
                right: 0
            });

            $cover.removeClass('hidden');
        }
    });

    // 点击隐藏
    $msgPanel.on('click', '.msg-panel-hide', function (e) {
        hideMessagePanel();
    });
    $('body').on('click', function (e) {
        var $target = $(e.target);
        if (!$target.closest('#msg-panel , .js-panel[data-ref]').length) {
            hideMessagePanel();
        }
    });

    // 将刷新消息数目的方法开放出来，以备外部处理完代办后可以刷新主界面中的消息数目
    win.getMessageCount = getMsgCount;
})(this, jQuery);

// 全文检索
(function (win, $) {
    var $searchContainer = $('#search-container');
    var FULL_SEARCH_PREFIX = 'fullsearch';

    function doSearch(type, kw) {
        type = type || 'all';

        var fullSearchIfr = document.getElementById('tab-content-' + FULL_SEARCH_PREFIX);

        var aimUrl = win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type=' + type;

        if (!fullSearchIfr) {
            // 未打开则打开
            dealLinkOpen({
                id: FULL_SEARCH_PREFIX,
                name: '全文检索',
                url: aimUrl,
                openType: 'tabsnav'
            });
        } else {
            // 否则修改地址
            fullSearchIfr.src = Util.getRightUrl(aimUrl);
        }

        $searchContainer.removeClass('active');
    }

    function getCateData() {
        return Util.ajax({
            url: win._searchCfg.fullSearchCateUrl
        }).done(function (data) {
            initFullSearch(data.categories);
        });
    }

    function initFullSearch(cateData) {

        cateData = cateData || [];

        if (typeof cateData == 'string') {
            // cateData = JSON.parse(cateData);
            cateData = mini.decode(cateData);
        }

        var cates = [];
        $.each(cateData, function (i, item) {
            cates.push({
                id: item.guid,
                name: item.name,
                iconCls: item.icon || 'view'
            });
        });
        if (!cates.length) {
            cates.push({
                id: 'all',
                name: '全文检索',
                iconCls: 'modicon-25'
            });
        }

        // 初始化组件
        /* global ClassifySearch */
        // 禁止组件内部加载样式文件
        ClassifySearch._styleLoaded = true;
        ClassifySearch.CLASSIFICATION_TPL = '<div class="classify-search-classify-item {{#isActive}}active{{/isActive}}" data-id="{{id}}" data-title-tpl="与${keyword}相关的{{name}}"><span class="classify-search-classify-icon {{iconCls}}"></span>与<span class="classify-search-classify-kw"></span>相关的{{name}}<span class="classify-search-classify-target hidden">{{target}}</span></div>';
        // 创建遮罩
        ClassifySearch._$pageCover = createMainContentCover();
        var classifySearch = new ClassifySearch({
            id: 'header-search', // 绑定的容器id
            searchTarget: '内容', // 搜索目标
            category: cates,
            placeholder: '请输入', // 输入框placeholder内容
            maxShowCharacter: 4, // 下拉区域显示的最大关键字字符数
            enter: function (id, key) {
                // 回车，回车不会执行keyup
                // console.log('回车事件返回 id:' + id + 'key:' + key);
                doSearch(id, key);
            }
        });

        dealUserModuleSearch(classifySearch);

        // IE animate-fill-mode forwards 存在bug，不支持一些本身无法过渡的属性，此处进行单独处理
        function ieOverflowFixed(show) {
            if (Util.browsers.isIE || Util.browsers.isEdge) {
                $searchContainer[show ? 'addClass' : 'removeClass']('show-overflow');
            }
        }

        $searchContainer.on('click', '.search-btn', function () {
            // Util.browsers.isIE && $searchContainer.removeClass('show-overflow');
            ieOverflowFixed(false);
            $searchContainer.toggleClass('active').trigger('autoFocus');
        }).on('autoFocus', function () {
            // 不支持动画的情况下直接聚焦
            if (!Util.browsers.isSupportTransition) {
                $searchContainer.hasClass('active') && classifySearch.$input.trigger('focus');
            }
        });
        // 向右拉开完成后自动聚焦
        if (Util.browsers.isSupportTransition) {
            // 支持过渡则在过渡完成后自动聚焦
            $searchContainer.on(Util.browsers.transitionend, function (ev) {
                if (ev.target === this) {
                    if ($searchContainer.hasClass('active')) {
                        // Util.browsers.isIE && $searchContainer.addClass('show-overflow');
                        ieOverflowFixed(true);
                        classifySearch.$input.trigger('focus');
                    }
                }
            });
        }

        // 失去焦点自动隐藏
        if (Util.browsers.isSupportAnimation) {
            // 支持动画时则在内部下拉面板收起后再向左收起
            classifySearch.$popup.on(Util.browsers.animationend, function (ev) {
                if (ev.target === this) {
                    if (!classifySearch.$container.hasClass('popup')) {
                        ieOverflowFixed(false);
                        // Util.browsers.isIE && $searchContainer.removeClass('show-overflow');
                        $searchContainer.removeClass('active');
                    }
                }
            });
        } else {
            // 否则直接隐藏
            classifySearch.$input.on('blur', function () {
                Util.browsers.isIE && $searchContainer.removeClass('show-overflow');
                $searchContainer.removeClass('active');
            });
        }
    }

    // 处理用户和模块的实时搜索
    function dealUserModuleSearch(classifySearch) {
        var $userItem = classifySearch.$classifyList.find('[data-id="user"]'),
            $moduleItem = classifySearch.$classifyList.find('[data-id="module"]');

        if (!$userItem.length || !$moduleItem.length) {
            return;
        }

        var $userList = $('<ul class="top-search-user-list"></ul>'),
            $moduleList = $('<ul class="top-search-module-list"></ul>');
        if ($userItem.length) {
            // $userList.appendTo($userItem);
            $userList.insertAfter($userItem);
            $userList.on('click', '.top-search-user-item', function () {
                // epoint.showTips(this.getAttribute('data-id'));
                /* global _searchCfg */
                _searchCfg.userClick && _searchCfg.userClick(this.getAttribute('data-id'), this.title);
                classifySearch.$input.blur().val('');
                classifySearch.hidePopup();
            });
        }
        if ($moduleItem.length) {
            // $moduleList.appendTo($moduleItem);
            $moduleList.insertAfter($moduleItem);
            $moduleList.on('click', '.top-search-module-item', function () {
                var $this = $(this);
                $this.data('url') && dealLinkOpen({
                    id: $this.data('id'),
                    name: this.title,
                    url: $this.data('url'),
                    openType: $this.data('opentype')
                });
                classifySearch.$input.blur().val('');
                classifySearch.hidePopup();
            });
        }

        var timer;
        // enter,ctrl,shift,alt,esc,arrow*4
        var ignoreCodes = [13, 16, 17, 18, 27, 37, 38, 39, 40];
        var isSupportInput = (function () {
            var input = document.createElement('input');
            return 'oninput' in input;
        })();
        // keyup 会触发很多无用的搜索，需要对键码进行过滤，比较麻烦，支持input则优先使用
        if (isSupportInput) {
            classifySearch.$input.on('input', function () {
                clearTimeout(timer);
                timer = setTimeout(immediatelySearch, 50);
            });
        } else {
            classifySearch.$input.on('keyup', function (ev) {
                if ($.inArray(ev.which, ignoreCodes) != -1) return;
                clearTimeout(timer);
                timer = setTimeout(immediatelySearch, 50);
            });
        }
        // 设置一个历史搜索值时 也立即搜索
        classifySearch.$input.on('setHistoryValue', immediatelySearch);

        // 记录最后一次的请求
        var lastRequest;

        var USER_ITEM_TPL = '<li class="top-search-user-item" data-id="{{guid}}" title="{{name}}" ><img class="top-search-user-item-img" src="{{portrait}}" >{{{hlname}}}</li>';

        var MODULE_ITEM_TPL = '<li class="top-search-module-item" data-id="{{code}}" title="{{name}}" data-opentype="{{openType}}" data-url="{{url}}"><span class="top-search-module-item-icon {{icon}}"></span>{{{hlname}}}</li>';

        function immediatelySearch() {
            // var key = classifySearch._getSelectedItem('classify').data('id');
            var value = $.trim(classifySearch.$input.val());

            /* global _searchCfg.userModuleSearchUrl */
            if (lastRequest) {
                lastRequest.abort();
            }
            if (!value) {
                return;
            }
            lastRequest = Util.ajax({
                url: epoint.dealRestfulUrl(_searchCfg.userModuleSearchUrl),
                data: {
                    cnum: 'user,module',
                    key: value,
                    rn: 3,
                    location: 'search'
                }
            });

            lastRequest.done(function (res) {
                var data = mini.decode(res.frameinfo);
                var userHTML = [],
                    moduleHTML = [],
                    hlReg = new RegExp(value, 'ig');
                data.users && $.each(data.users, function (i, item) {
                    item.portrait = Util.getRightUrl(item.portrait);
                    item.hlname = item.name.replace(hlReg, '<span class="search-kw">' + value + '</span>');
                    userHTML.push(Mustache.render(USER_ITEM_TPL, item));
                });
                data.modules && $.each(data.modules, function (i, item) {
                    item.icon = item.icon || 'modicon-1';
                    item.hlname = item.name.replace(hlReg, '<span class="search-kw" >' + value + '</span>');
                    moduleHTML.push(Mustache.render(MODULE_ITEM_TPL, item));
                });
                $(userHTML.join('')).appendTo($userList.empty());
                $(moduleHTML.join('')).appendTo($moduleList.empty());
            });

        }

    }

    // getCateData();
    // 获取到全文检索地址后再进行初始化
    _breezeEvent_.on('afterPageInfo', function () {
        var $menu = $('#menu');
        if (win._fullSearchUrl_) {
            $menu.removeClass('no-search');
            getCateData();
        } else {
            $menu.addClass('no-search');
        }
    });

})(this, jQuery);

/*
 * 打开E讯聊天窗口
 * sessionId 会话id，当传入一个参数时sessionId表示uid
 * uid 对方用户id
 * type 个人：friend 讨论组：group
 */
window.OpenEMsg = function (sessionId, uid, type) {
    /* global eMsg , {eMsgSocket:true} */
    if (window.eMsg) {
        if (typeof uid === 'undefined') {
            eMsg.open(sessionId);
        } else {
            eMsg.openSession(sessionId, uid, type);
        }
    } else {

        creatWebSocket(_userGuid_, _userName_, function () {
            eWebSocket.openEmsg(sessionId, uid, type);
        });
    }
};