/*
 * @Author: chends
 * @Date: 2018-08-19 09:15:52
 * @LastEditors: jjj
 * @LastEditTime: 2018-09-12 19:05:20
 * @Description: 
 */

// 全局变量处理
(function (win, $) {
    // 自定义事件 用于一些逻辑控制  
    win._aideEvent_ = new Util.UserEvent();

    // pagecover 容器以及生成方法
    var $coverContainer = $('#cover-wrap');
    if (Util.browsers.isIE && window.hasObjectTag) {
        win.createMainContentCover = function () {
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
        win.createMainContentCover = function () {
            var $cover = $('<div class="main-content-cover hidden"></div>');
            return $cover.appendTo($coverContainer);
        };
    }

    // 获取数据统一方法
    win._getData_ = function (method, params) {
        return Util.ajax({
            url: epoint.dealRestfulUrl(getDataUrl + '/' + method),
            data: params
        });
    };
    var $main = $('#main');
    // 处理链接打开
    win.dealLinkOpen = function (linkData, needLeft) {
        switch (linkData.openType) {
            case 'tabsnav':
                !needLeft && $main.addClass('left-none');
                TabsNav.addTab(linkData);
                break;
            case 'dialog':
                epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
                break;
            case 'blank':
                var _id = linkData.id ? (linkData.id + '').replace(/-/g, '') : '';
                win.open(Util.getRightUrl(linkData.url), _id);
                break;
            default:
                break;
        }
    };

    // 统一js动画时间
    win._ANIMATION_TIME_ = {
        slide: 200
    };

    win.useWebsocket = Util.getFrameSysParam('useWebsocket') === true;

    // 页面websocket对象
    win.eWebSocket = undefined;

    // 创建websocket链接
    win.creatWebSocket = function (uid, uname, callback) {
        // 避免重复创建
        if (eWebSocket) {
            callback && callback();
            return;
        }

        var cfg = win.EWebSocketConfig ? win.EWebSocketConfig : {
            url: EmsgConfig.websocketUrl
        };

        cfg.uid = uid;
        cfg.uname = uname;

        if (win.EWebSocket) {
            eWebSocket = new EWebSocket(cfg);
            callback && callback();
            _aideEvent_.fire('websocketCreated');

        } else {
            Util.loadJs('frame/fui/js/widgets/ewebsocket/ewebsocket.js', function () {
                eWebSocket = new EWebSocket(cfg);
                callback && callback();
                _aideEvent_.fire('websocketCreated');
            });
        }
    };
    win.randomColor = function (index) {
        var colors = ['#3391e5', '#58cece', '#f16caa', '#7d9459', '#298aae', '#58cece', '#ffce3d', '#fe5d58', '#3391e5', '#f16caa'];

        return colors[index % 10];
    };

    // tab和左侧菜单联动的数据缓存
    win.$activeLeftMenu = null;
    var tabsCache = {};
    win.tab2leftManage = (function () {
        function cache(id, $target, $wrap) {
            tabsCache[id] = {
                $target: $target,
                $wrap: $wrap
            };
        }

        function deCache(id) {
            if (id) {
                tabsCache[id] = null;
            } else {
                tabsCache = {};
            }
        }

        function click(id) {
            var it = tabsCache[id];
            if (!it || !it.$wrap) {
                return $main.addClass('left-none');
            }
            $activeLeftMenu = it.$wrap;
            $main.removeClass('left-none');
            it.$wrap.removeClass('hidden').siblings().addClass('hidden');
            it.$wrap.find('.left-menu-link.active').removeClass('active');
            if (it.$target) {
                it.$target.addClass('active');
                openTarget(it.$target);
            }
        }
        // 查找目标链接并逐级展开
        function openTarget($target) {
            var $items = $target.parents('.left-menu-item');
            var l = $items.length;
            doOpen($items, l);
        }

        // 递归从最顶层逐个展开
        function doOpen($items, len) {
            if (len < 0) {
                return;
            }

            var $item = $items.eq(len - 1);
            var $sub = $item.find('.left-menu-sub-list:eq(0)');

            // 补充展开类
            if ($item.find('>.left-menu-link').data('hassub')) {
                $item.addClass('opened');
            }
            // 展开当前
            $sub.stop(true).slideDown(_ANIMATION_TIME_.slide, function () {
                // 当前展开完成后继续下一层
                slideDownCb.call(this);
                doOpen($items, --len);
            });
            // 关闭其他
            $item.siblings('.opened')
                .removeClass('opened')
                .find('.left-menu-sub-list:eq(0)').stop(true).slideUp(_ANIMATION_TIME_.slide, slideUpCb);
        }
        return {
            cache: cache,
            deCache: deCache,
            click: click
        };
    })();

    // 解决 jq slide 动画偶尔完成后高度未去掉，导致内部继续展开第存在的bug
    // 此处手动在动画完成时进行修复
    win.slideDownCb = function () {
        $(this).attr('style', 'display: block;');
    };

    win.slideUpCb = function () {
        $(this).attr('style', 'display: none;');
    };

    // function outputSupport() {
    //     var i,
    //         re = /^on[a-zA-z]*?[aA]nimation/;
    //     for (i in window) {
    //         if (re.test(i)) {
    //             console.log(i);
    //         }
    //     }
    //     re = /^on[a-zA-z]*?[tT]ransition/;
    //     for (i in window) {
    //         if (re.test(i)) {
    //             console.log(i);
    //         }
    //     }
    // }

    // 是否显示E讯
    win.showEXun = true;
    // 消息中心配置
    win._msgcenterConfig_ = win.MsgCenterConfig || {};

    /* global  _aideEvent_ , _getData_ , getDataUrl, createMainContentCover , UserSettings, dealLinkOpen, _ANIMATION_TIME_ , useWebsocket, randomColor, slideDownCb, slideUpCb, tab2leftManage, $activeLeftMenu:true*/
})(this, jQuery);
// TabsNav 初始化
(function (win, $) {
    // 根据页面css计算tab宽度
    var tabWidth = (function () {
        var $tab = $('<li class="tabsnav-tabs-item"></li>');
        var $tab2 = $tab.clone(false);
        var $list = $('<ul class="hidden-accessible"></ul>').append($tab, $tab2).appendTo('body');
        var w = $tab2.outerWidth(true);
        $list.empty().remove();
        $list = $tab = $tab2 = null;
        return w || 115;
    })();
    if (Object.prototype.toString.call(win.EpTabsNav) === '[object Function]') {
        /* global TabsNav , EpTabsNav*/
        window.TabsNav = new EpTabsNav({
            ifrContainer: '#main-ifr-wrap', //内容父容器
            tabContainer: '#footer', //任务栏容器

            needScrollBtn: true, //是否显示左右滚动按钮
            scrollBtnSite: 'sides', //左右滚动按钮的位置，两侧：'sides',右侧：'right'
            smoothItems: 3, //点击左右滚动按钮，滑动单个tab的宽度的倍数，默认为3

            needQuickNav: true, //是否显示快捷导航

            position: 'bottom', // tab显示的位置，头部：'top'，底部：'bottom'，默认为'bottom'
            tabWidth: tabWidth // 默认一个tab的宽度，没有固定tab时必须设置
        });
        // 重写遮罩实现
        TabsNav._$pageCover = createMainContentCover();

        // 激活时关联左侧菜单
        TabsNav.onTabActive = function (id) {
            if (!id) {
                return;
            }
            id = id.substr(4);
            var $tab = $('#tab-' + id);
            if (!$tab.length) {
                // 第一次打开时无需关联
                return;
            }
            tab2leftManage.click(id);
        };
    } else {
        console.error('The TabsNav is required! , please add the "frame/fui/js/widgets/tabsnav/tabsnav.js" before theme\'s javascript file');
    }
})(this, jQuery);

// userinfo
(function (win, $) {
    var $logo = $('#sys-logo-img'),
        $userInfo = $('#user-info'),
        $userPortrait = $('.user-portrait', $userInfo);
    var $cover = createMainContentCover();

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

            $userInfo.removeClass('active');
            $cover.addClass('hidden');
        });
    $('body').on('click', function (e) {
        if (!$(e.target).closest('#user-info').length) {
            hideUserPanel();
        }
    });
    // 获取用户信息
    _getData_('getUserInfo').done(function (data) {
        // 用户guid和name是E讯必须要使用的 需要记录下来
        /* global _userName_, _userGuid_ */
        win._userName_ = data.name;
        win._userGuid_ = data.guid;

        // 消息中心的配置-打开是否全屏
        $.extend(win._msgcenterConfig_, {
            isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
            msgCenterOrder: data.msgCenterOrder || "asc",
            hideCallback: function () {
                $cover.addClass('hidden');
            }
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

    // pageInfo
    _getData_('getPageInfo').done(function (data) {
        // logo
        if (data.logo) {
            // $logo.attr('src', Util.getRightUrl(epoint.dealRestfulUrl(data.logo)));
            // dataurl 模式无须拼接
            $logo.attr('src', Util.getRightUrl(data.logo));
        }
        if (data.title) {
            document.title = data.title;
            win.systemTitle = data.title;
        }
        // fullSearchUrl
        if (data.fullSearchUrl) {
            win._fullSearchUrl_ = data.fullSearchUrl;
        }

        if(data.showEXun === false) {
            win.showEXun = false;
        }
        // 初始化门户
        initPortal(data.homes, data.defaultHome);

        // 触发 afterPageInfo 事件
        _aideEvent_.fire('afterPageInfo');
    });

    // 用户头像更改
    $(win).on('message', function (e) {
        try {
            var data = JSON.parse(e.originalEvent.data);
            if (data.type === 'userPortraitChange') {
                $userPortrait.attr('src', data.imgData);
            }
        } catch (error) {

        }
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

// portal
(function (win, $) {
    var $main = $('#main');
    var PORTAL_ITEM_TPL = '<li class="top-portal-item" data-id="{{code}}" data-url="{{url}}" data-opentype="{{openType}}" title="{{name}}"><span class="top-portal-icon {{icon}}"></span><span class="top-portal-name">{{name}}</span></li>';

    function initPortal(homes, defaultHome) {
        var home = {
            closeIcon: false,
            refresh: true
        };
        // 记录无分类的门户
        var signleHomes = [];
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
                // signleHomes.push(homes.splice(i, 1));
                signleHomes = signleHomes.concat(homes.splice(i, 1));
                i--;
            }
        }

        initview(signleHomes, homes);
        initEvent(home);

        TabsNav.addTab(home);
    }

    function initEvent(defaultHome) {
        var $portal = $('#top-portal-container');
        var $cover = createMainContentCover();

        var leaveTimer, enterTimer;

        $portal
            // .on('click', '.top-portal-btn', function () {
            //     // 点击打开默认的
            //     TabsNav.addTab(defaultHome);
            // })
            // .on('mouseenter', function () {
            //     $('body').trigger('click');
            //     clearTimeout(leaveTimer);
            //     clearTimeout(enterTimer);
            //     enterTimer = setTimeout(function () {
            //         toggleProtal(true);
            //     }, 200);
            // })
            // .on('mouseleave', function () {
            //     clearTimeout(leaveTimer);
            //     clearTimeout(enterTimer);
            //     leaveTimer = setTimeout(function () {
            //         toggleProtal(false);
            //     }, 400);
            // })
            .on('click', '.top-portal-header', function () {
                // 点击打开默认的
                TabsNav.addTab(defaultHome);
            })
            // 顶部点击切换
            .on('click', '.top-portal-btn', function () {
                toggleProtal(!$portal.hasClass('active'));
            })
            // 点击打开门户
            .on('click', '.top-portal-item', function () {
                // var $this =$(this);
                dealLinkOpen({
                    url: this.getAttribute('data-url'),
                    name: this.title,
                    openType: this.getAttribute('data-opentype'),
                    id: this.getAttribute('data-id'),
                });
                toggleProtal(false);
            })
            // 分类点击切换
            .on('click', '.top-portal-cate', function () {
                var $block = $(this).parent();
                $block.toggleClass('collapse');
            });

        function toggleProtal(show) {
            if (show) {
                $portal.addClass('active');
                $cover.removeClass('hidden');
                return;
            }

            $portal.removeClass('active');
            $cover.addClass('hidden');
        }
        // 空白点击隐藏
        $('body').on('click', function (ev) {
            if (!$(ev.target).closest($portal).length) {
                toggleProtal(false);
            }
        });

        // 门户面板高度处理
        var timer,
            $portalPanel = $portal.find('.top-portal');
        $(win).on('resize', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var h = $main.height() - 50;
                h > 0 && $portalPanel.css('max-height', h);
            }, 17);
        }).trigger('resize');
    }

    function initview(signleHomes, homes) {
        var html = [];
        // 无分类的
        if (signleHomes) {
            html.push('<ul class="top-portal-list">');
            $.each(signleHomes, function (i, item) {
                item.icon = item.icon || 'default-modicon';
                html.push(Mustache.render(PORTAL_ITEM_TPL, item));
            });
            html.push('</ul>');
        }

        // 带分类的
        $.each(homes, function (i, cate) {
            // 根据条数计算下最大高度，用于优化动画效果
            html.push('<div class="top-portal-block"><h3 class="top-portal-cate">' + cate.name + '<span class="top-portal-cate-trigger"></span></h3><ul class="top-portal-list" style="max-height:' + (30 * cate.items.length) + 'px">');
            $.each(cate.items, function (j, item) {
                item.icon = item.icon || 'default-modicon';
                html.push(Mustache.render(PORTAL_ITEM_TPL, item));
            });
            html.push('</ul></div>');
        });

        $(html.join('')).appendTo('#top-portal-content');
    }
    /* global initPortal*/
    win.initPortal = initPortal;
})(this, jQuery);

// topmenu quickmenu
(function (win, $) {
    var $main = $('#main');
    var $cover = createMainContentCover();
    var $header = $('#header');
    var $menuPanel = $('#top-menu-panel');
    var $menuTrigger = $('.header-menu-btn', $header);
    $header.on('click', '.header-menu-btn', function () {
        toggleMenuPanel(!$(this).hasClass('active'));
    });

    function toggleMenuPanel(show) {
        if (show) {
            $cover.removeClass('hidden');
            $menuTrigger.addClass('active');
            $menuPanel.addClass('active');
        } else {
            $menuTrigger.removeClass('active');
            $menuPanel.removeClass('active');
            $cover.addClass('hidden');

            if ($topMenuList.hasClass('in-sort')) {
                epoint.showTips('您的应用排序尚未保存，请及时重新打开进行保存！', {
                    state: 'warning'
                });
            }
        }
    }
    $('body').on('click', function (e) {
        var $target = $(e.target);
        if (!$menuPanel.hasClass('active')) {
            return;
        }
        if (!$target.closest($menuTrigger).length && !$target.closest($menuPanel).length && !$target.closest('.mini-panel-header').length) {
            toggleMenuPanel(false);
        }
    });
    var TOP_MENU_ITEM_TPL = '<li class="top-menu-item l {{#isActived}}active{{/isActived}}" data-id="{{code}}" data-url="{{url}}" data-opentype="{{openType}}" data-hassub="{{hasSub}}" title="{{name}}"><span class="top-menu-icon {{icon}}" style="background:{{bg}};"></span><span class="topmenu-text">{{name}}</span></li>';

    var $topMenuList = $('#top-menu-list');

    $topMenuList.on('click', '.top-menu-item', function () {
        // 排序状态下不响应点击事件
        if ($topMenuList.hasClass('in-sort')) {
            return;
        }
        var $this = $(this),
            url = $this.data('url'),
            name = this.getAttribute('title') || this.innerText,
            openType = $this.data('opentype'),
            hasSub = $this.data('hassub');

        $this.addClass('active')
            .siblings().removeClass('active');

        if (hasSub) {
            $main.removeClass('left-none');
            getLeftMenu({
                code: this.getAttribute('data-id'),
                name: this.getAttribute('title') || this.innerText,
                url: url,
                openType: openType
            }, true);
        } else {
            // 无子菜单 隐藏左侧
            $main.addClass('left-none');
        }
        if (url) {
            dealLinkOpen({
                openType: openType,
                name: name,
                id: $this.data('id'),
                url: url
            }, true);
        }

        toggleMenuPanel(false);

    });

    function getTopMenu() {
        _getData_('getMenu', {
            query: 'top'
        }).done(function (data) {
            if (!data || !data.items) return;

            var defaultCode = data.code,
                defaultMenu = {},
                hasSub;

            // 查找默认需要打开的
            if (defaultCode) {
                $.each(data.items, function (i, item) {
                    if (item.code == defaultCode) {
                        item.isActived = true;
                        defaultMenu = item;
                        hasSub = item.hasSub;
                        return false;
                    }
                });
            } else {
                // 没有直接取第一个
                data.items[0].isActived = true;
                defaultMenu = data.items[0];
                hasSub = data.items[0].hasSub;
            }
            // ie8 
            if (Util.browsers.isIE8) {
                toggleMenuPanel(true);
            }
            // 渲染加载
            $(render(data.items, TOP_MENU_ITEM_TPL)).appendTo($topMenuList);
            // ie8 
            if (Util.browsers.isIE8) {
                toggleMenuPanel(false);
            }
            _aideEvent_.fire('topMenuLoad');

            // if (hasSub) {
            //     // 自动加载左侧
            //     getLeftMenu(defaultMenu, true);
            // } else {
            $main.addClass('left-none');
            // }
        });
    }

    function render(data, tpl) {
        var html = [];
        $.each(data, function (i, item) {
            item.icon = item.icon || 'modicon-1';
            item.bg = item.iconBackColor || randomColor(i);
            html.push(Mustache.render(tpl, item));
        });
        return html.join('');
    }

    getTopMenu();

    var QUICK_MENU_ITEM_TPL = '<li class="quick-menu-item l" data-id="{{code}}" data-url="{{url}}" data-opentype="{{openType}}" title="{{name}}"><span class="top-menu-icon {{icon}}" style="background:{{bg}};"></span><span class="topmenu-text">{{name}}</span></li>';

    var $quickMenuList = $('#quick-menu-list');

    $quickMenuList.on('click', '.quick-menu-item', function () {
        var $this = $(this),
            url = $this.data('url'),
            name = this.getAttribute('title') || this.innerText,
            openType = $this.data('opentype');
        url && dealLinkOpen({
            openType: openType,
            name: name,
            id: $this.data('id'),
            url: url
        });
        toggleMenuPanel(false);
    });

    function renderQuickMenu() {
        return _getData_('getQuickMenu',{showNum: 10}).done(function (data) {
            if (!data || !data.length) {
                return;
            }
            // ie8 
            if (Util.browsers.isIE8) {
                toggleMenuPanel(true);
            }
            $(render(data, QUICK_MENU_ITEM_TPL)).appendTo($quickMenuList.empty());
            if (Util.browsers.isIE8) {
                toggleMenuPanel(false);
            }
        });
    }
    renderQuickMenu();

    // 常用菜单配置点击
    var quickMenuSettingUrl = 'frame/fui/pages/quickmenusetting/quickmenusetting' + (/proto\.html/.test(location.pathname) ? '.proto.html' : '');
    $menuPanel.on('click', '.quick-menu-btn', function () {
        var opt = {
            width: 820,
            height: 500
        };
        var win_size = Util.getWinSize();
        if (win_size.height < opt.height) {
            opt.height = win_size.height;
        }
        if (win_size.width < opt.width) {
            opt.width = win_size.width;
        }

        epoint.openTopDialog('常用菜单配置', quickMenuSettingUrl, function (isChanged) {
            if (isChanged === true) {
                renderQuickMenu();
            }
        }, opt);
    });

})(this, jQuery);

(function (win, $) {
    if (!Util.getFrameSysParam('enableCustomSort')) {
        return;
    }
    var timer;
    var saveAjax;
    var oldSorts;
    var $topMenuList = $('#top-menu-list');
    var $btns = $('#top-menu-btns');

    $btns.find('.start').removeClass('hidden');
    $topMenuList.sortable({
        // opacity: 0.8,
        revert: 200,
        delay: 300,
        distance: 30,
        forcePlaceholderSize: true,
        containment: 'parent',
        disabled: true,
        tolerance: 'pointer',
        update: function () {
            // dealSave();
        },
        stop: function () {
            // dealSave();
        },
        sort: function () {
            // clearTimeout(timer);
        },
        start: function () {
            // clearTimeout(timer);
            // $topMenuList.addClass('in-sort');
        }
    });

    $btns
        .on('click', '.start', function () {
            sortHandle(true);
            mini.showTips({
                content: '拖动菜单进行排序调整，完成后点击保存',
                state: 'info',
                x: 'center',
                y: 'center'
            });

        })
        .on('click', '.save', function () {
            var data = getSort();
            // 不相等时保存
            if (data.join('') !== oldSorts.join('')) {
                _save(getSort()).always(function () {
                    sortHandle(false);
                });
            } else {
                sortHandle(false);
                // mini.showTips({
                //     content: '排序未更改',
                //     state: 'info',
                //     x: 'center',
                //     y: 'center',
                //     timeout: 3000
                // });
            }
        })
        .on('click', '.cancel', function () {
            // todo 还原排序
            sortHandle(false);
            var $children = $topMenuList.children().remove();
            $.each(oldSorts, function (i, id) {
                $children.filter('[data-id="' + id + '"]').appendTo($topMenuList);
            });
        });

    function sortHandle(active) {
        if (active) {
            $topMenuList.addClass('in-sort');
            $topMenuList.sortable('enable');
            $btns.find('.start').addClass('hidden')
                .siblings().removeClass('hidden');
        } else {
            $topMenuList.sortable('disable');
            $topMenuList.removeClass('in-sort');
            $btns.find('.start').removeClass('hidden')
                .siblings().addClass('hidden');
        }
    }

    function getSort() {
        return $topMenuList.sortable('toArray', {
            attribute: 'data-id'
        });
    }
    // 菜单加载完成后记录原始顺序
    _aideEvent_.on('topMenuLoad', function () {
        oldSorts = getSort();
    });

    function dealSave() {
        clearTimeout(timer);
        timer = setTimeout(save, 1 * 1000);
    }

    function _save(data) {
        return Util.ajax({
            url: topMenuSaveUrl,
            data: {
                sort: JSON.stringify(data)
            }
        }).done(function () {
            mini.showTips({
                content: '保存成功',
                state: 'success',
                x: 'center',
                y: 'center',
                timeout: 3000
            });
            // 保存成功后再次更新旧记录
            oldSorts = getSort();
        });
    }

    function save() {
        if (saveAjax) {
            try {
                saveAjax.abort();
            } catch (error) {}
        }
        var data = getSort();
        // 不相等时保存
        if (data.join('') !== oldSorts.join('')) {
            /* global topMenuSaveUrl */
            saveAjax = _save(data);
        } else {
            mini.showTips({
                content: '排序未更改',
                state: 'info',
                x: 'center',
                y: 'center',
                timeout: 3000
            });
        }
        $topMenuList.removeClass('in-sort');
    }


})(this, jQuery);

// leftmenu
(function (win, $) {
    var leftMenuStatus = {};

    var $main = $('#main'),
        $leftMenu = $('#left-menu'),
        $leftMenuContainer = $leftMenu;
    var LEFT_MENU_ITEM_TPL = '<li class="left-menu-item {{level}}"><a href="javascript:void(0);" data-url="{{url}}" data-rowkey="{{rowkey}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" data-hasSub="{{hasSub}}" class="left-menu-link"style="padding-left: {{indent}}px;">{{#isTop}}<i class="left-menu-icon {{icon}} " style="background:{{bg}};"></i>{{/isTop}}<span class="left-menu-name">{{name}}</span>{{#hasSub}}<i class="left-menu-trigger"></i>{{/hasSub}}</a>{{#hasSub}}{{#isTop}}<div class="left-menu-sub"><div class="left-menu-sub-inner"><div class="left-menu-sub-header"><span class="left-menu-sub-title">{{name}}</span></div>{{/isTop}}<ul class="left-menu-sub-list" style="display:none;"> {{{subMenu}}}</ul>{{#isTop}}</div></div>{{/isTop}}{{/hasSub}}</li>';
    var LEFT_MENU_TPL = '<div class="left-menu-wrap" id="left-menu-{{code}}"><div class="left-menu-header">{{name}}</div><ul class="left-menu-list">{{{leftMenuItems}}}</ul></div>';

    function initEvent() {
        $leftMenu
            .on('click', '.left-menu-link', function () {
                var $this = $(this),
                    $item = $this.parent(),
                    isTop = $item.hasClass('level-1'),
                    hasSub = $this.data('hassub'),

                    linkData = {
                        url: $this.data('url'),
                        openType: $this.data('opentype'),
                        name: this.title,
                        id: $this.data('id')
                    };

                // 处理子节点展开收起
                if (hasSub) {
                    var $sub = isTop ? $this.next().find('.left-menu-sub-list:eq(0)') : $this.next();

                    if (!$item.hasClass('opened')) {
                        $item.addClass('opened');

                        // 展开当前 收起其他
                        $sub.stop(true).slideDown(_ANIMATION_TIME_.slide, slideDownCb);
                        $item.siblings('.opened').removeClass('opened').find('.left-menu-sub-list:eq(0)').stop(true).slideUp(_ANIMATION_TIME_.slide, slideUpCb);

                    } else {
                        $item.removeClass('opened');
                        $sub.stop(true).slideUp(_ANIMATION_TIME_.slide, slideUpCb);
                    }
                }
                if (linkData.url) {
                    $activeLeftMenu.find('.left-menu-link.active').removeClass('active');
                    $this.addClass('active');
                    if (linkData.openType == 'tabsnav') {
                        tab2leftManage.cache(linkData.id, $this, $activeLeftMenu);
                    }
                    // 处理链接
                    dealLinkOpen(linkData, true);
                }
            });
        // tab点击时处理左侧
        $('body').on('click', '.tabsnav-tabs-item, .tabsnav-quicknav-item', function (e) {
            var id = this.getAttribute('data-id').substr(4);
            if ($(e.target).hasClass('tabsnav-tabs-close')) {
                return tab2leftManage.deCache(id);
            }
            // 激活已经统一
            // tab2leftManage.click(id);
        });
        // $('body').on('click', function (e) {
        //     if (!$(e.target).closest('#left-menu').length) {
        //         $cover.addClass('hidden');
        //         // 窄状态下 空白点击收起菜单 
        //         if (leftMenuState === 'narrow' && $activeLeftMenu) {
        //             $activeLeftMenu.find('.left-menu-item.level-1.opened').removeClass('opened')
        //                 .find('.left-menu-sub-list:eq(0)').slideUp();
        //         }
        //     }
        // });
    }
    initEvent();

    function getRowKey(rowkey, i) {
        return rowkey === undefined ? i + '' : rowkey + '-' + i;
    }
    // 缩进值
    var INDENT_INIT = 22,
        INDENT_STEP = 14;

    // 获取节点缩进值
    function getIndent(rowkey, len) {
        //分割成数组判断长度
        len = len || rowkey.split('-').length;
        if (len < 2) {
            return 0;
        }
        return INDENT_INIT + (len - 2) * INDENT_STEP;
    }
    /**
     * 构建左侧菜单的详情html
     *
     * @param {Array} data 菜单数据
     * @param {String} rowkey 父节点rowkey
     * @returns 渲染完成的html字符串
     */
    function buildLeftMenu(data, rowkey) {
        var html = '';

        $.each(data, function (i, item) {
            // 此处暂无搜索支持，无需copy 
            // 但为方便后续扩展 使用别名view
            var view = item;
            view.hasSub = !!(item.items && item.items.length);
            view.rowkey = getRowKey(rowkey, i);

            var len = view.rowkey.split('-').length;
            view.isTop = len === 1;
            view.level = 'level-' + len;
            view.indent = getIndent(view.rowkey, len);

            if (view.isTop) {
                view.bg = item.iconBackColor || randomColor(i);
            }

            if (len === 1) {
                view.icon = view.icon || 'modicon-1';
            }

            if (view.hasSub) {
                html += Mustache.render(LEFT_MENU_ITEM_TPL, $.extend(view, {
                    subMenu: buildLeftMenu(item.items, view.rowkey)
                }));
            } else {
                html += Mustache.render(LEFT_MENU_ITEM_TPL, view);
            }
        });
        return html;
    }
    /**
     * 生成左侧菜单结构并插入展示
     * @param {Array} data 当前菜单数据
     * @param {*} tMenu 顶级菜单的数据
     */
    function ininView(data, tMenu) {
        if (data && data.length) {
            var html = buildLeftMenu(data);
            var viewData = {
                code: tMenu.code,
                name: tMenu.name,
                leftMenuItems: html
            };
            $activeLeftMenu = $(Mustache.render(LEFT_MENU_TPL, viewData));
            $activeLeftMenu.appendTo($leftMenuContainer)
                .siblings('.left-menu-wrap').addClass('hidden');
            return $activeLeftMenu;
        }
    }
    // 记录是否第一次自动加载左侧 用于去除首次直接进入的动画
    var isFirstEnter = true;

    function getLeftMenu(tMenu, findSubUrlOpen) {
        var tCode = tMenu.code;
        // 未请求 或请求失败
        if (!leftMenuStatus[tCode] || leftMenuStatus[tCode] === 'reject') {
            return _getData_('getMenu', {
                query: 'sub',
                code: tCode
            }).done(function (data) {
                var $menu = ininView(data, tMenu);
                leftMenuStatus[tCode] = 'resolve';
                // 如果此顶级菜单有链接
                if (tMenu.url && tMenu.openType === 'tabsnav') {
                    tab2leftManage.cache(tCode, null, $menu);
                } else {
                    // 找第一个子链接打开
                    findSubUrlOpen && findFirstSecUrlOpen(tCode + '');
                }
                if (isFirstEnter) {
                    isFirstEnter = false;
                    $main.removeClass('no-trans left-none');
                }
            }).fail(function () {
                leftMenuStatus[tCode] = 'reject';
            });
        }

        // 已经加载并且成功  则直接切换
        if (leftMenuStatus[tCode] === 'resolve') {
            $activeLeftMenu = $('#left-menu-' + tCode);
            $activeLeftMenu.removeClass('hidden')
                .siblings('.left-menu-wrap').addClass('hidden');
            if (!tMenu.url || tMenu.openType !== 'tabsnav') {
                findSubUrlOpen && findFirstSecUrlOpen(tCode);
            }
            return;
        }
    }
    /* global getLeftMenu */
    win.getLeftMenu = getLeftMenu;

    // 每次切换都需要查找 效率低 因此做缓存处理
    var subUrlCache = {};
    /**
     * 查找子菜单中第一个配置了url的菜单进行打开
     *
     * @param {String} $targetMenu 顶级菜单code
     */
    function findFirstSecUrlOpen(targetMenu) {
        // 有缓存直接使用
        if (subUrlCache[targetMenu]) {
            return TabsNav.addTab(subUrlCache[targetMenu]);
        }
        // 否则获取并查找
        var $targetMenu = $leftMenuContainer.find('#left-menu-' + targetMenu);
        var openType = '',
            url = '';
        $targetMenu.find('.left-menu-link').each(function (i, item) {
            url = item.getAttribute('data-url');
            openType = item.getAttribute('data-opentype');
            if (url && openType == 'tabsnav') {
                subUrlCache[targetMenu] = {
                    id: item.getAttribute('data-id'),
                    name: item.title,
                    url: url
                };
                tab2leftManage.cache(targetMenu, $(item), $targetMenu);
                // TabsNav.addTab(subUrlCache[targetMenu]);
                $(item).trigger('click');
                return false;
            }
        });
    }
})(this, jQuery);


// 主题皮肤切换
(function (win, $) {
    var $themeBtn = $('#theme-skin-switch'),
        $cover = createMainContentCover();
    var themeSelection;

    function initThemeSkin() {
        /* global getThemesUrl, saveThemeUrl */
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
            if (!$target.closest('.theme-selection-container, #theme-skin-switch').length) {
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

// 消息提醒 和右侧消息
(function (win, $) {
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
    var docTitle = {
        roll: rollDocTitle,
        stop: restoreDocTitle
    };

    var $msgSound = $('#msg-sound');
    // ,
    //     $soundIframe,
    //     msgAudio;
    // // 根据浏览器加载不同的声音提醒方案
    // if (Util.browsers.isIE) {
    //     $soundIframe = $('<iframe src="" frameborder="0" class="hidden" id="msgcenter-sound"></iframe>').appendTo(
    //         $msgSound
    //     );
    // } else {
    //     $msgSound.html(
    //         '<audio id="msgcenter-sound-audio" controls="controls" src="../../msgsound/newsms.wav" class="hidden-accessible"></audio>'
    //     );
    //     msgAudio = document.getElementById('msgcenter-sound-audio');
    // }

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
    var $topActionList = $('#header-action-btns'),
        $eMsgIcon = $('.header-action-btn.chart', $topActionList),
        $remindNum = $('.remind-num', $topActionList),
        $eMsgNum = $('.emsg-num', $topActionList),
        //e讯的
        $msgPanel = $('#msg-panel');
        // $msgRemind = $('#msgRemind', $msgPanel),
        // $msgRemindContent = $('.msg-panel-content', $msgRemind);

    var $msgEMsg = $('#msgEMsg', $msgPanel),
        $msgEMsgContent = $('.msg-panel-content', $msgEMsg),
        $msgEMsgRecent = $('.emsg-recent-list', $msgEMsgContent),
        $onlineUserNum = $('.online-user-num', $msgEMsg),
        onlineUserIframe = document.getElementById('online-user');

    // 新消息 Tips
    var $tips = $('#new-remind-wrap');

    /* global RemindTipsCfg */
    var remindTips = {
        show: function () {
            if (RemindTipsCfg.show) {
                $tips.removeClass('hidden');
                this.autoHide();
            }
        },
        autoHide: (function () {
            if (RemindTipsCfg.timeout != 0) {
                return function () {
                    clearTimeout(remindTips.timer);
                    remindTips.timer = setTimeout(function () {
                        $tips.addClass('hidden');
                    }, RemindTipsCfg.timeout);
                };
            }
            return function () {};
        }()),
        initEvent: function () {
            if (RemindTipsCfg.show) {
                $tips.on('click', '.icon, .text', function () {
                    $tips.addClass('hidden');
                }).on('click', '.close', function (e) {
                    e.stopPropagation();
                    $tips.addClass('hidden');
                });
            }
        }
    };
    remindTips.initEvent();

    // 获取消息数目
    var getMsgCount = function (useCache) {
        var params = {
            haseXun: win.showEXun,
            needNum: true
        };
        if (useCache) {
            params.inCache = true;
        }
        return _getData_('getMsgCount', params).done(function (data) {
            updateMsgCount(data);
        });
    };
    // 更新消息数目
    var updateMsgCount = function (data) {
        var old = 0,
            hasNew = false;

        if (data.remind) {
            old = parseInt($remindNum.data('num'), 10) || 0;
            if (data.remind > old) {
                hasNew = true;
                remindTips.show();
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
        var winSize = Util.getWinSize();
        var top = winSize.height/2 + 75;
        var left = winSize.width/2 - 150;
         if(data.systemUpdate){
         	var myWindow=window.open("","","width=300,height=150,top=" + top + ",left=" + left);
             myWindow.document.write("<p>"+data.systemUpdate+"</p>");
             myWindow.focus();
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

    win.updateMsgTipCount = function(data) {
        var old = 0,
            hasNew = false;

        if (data.remind) {
            old = parseInt($remindNum.data('num'), 10) || 0;
            if (data.remind > old) {
                hasNew = true;
                remindTips.show();
            }
            $remindNum.removeClass('hidden').text(parseNum(data.remind));
            $remindNum.data('num', data.remind);
        } else {
            $remindNum.text('').addClass('hidden');
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
    }

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

    // // 轮训获取消息
    // $(function() {
    //     getMsgCount();
    //     setInterval(getMsgCount, 60000);
    // });
    // 界面信息获取完成后 开始获取消息数目 避免标题记录不对
    _aideEvent_.on('afterPageInfo', function () {
        getMsgCount(true);

        if (!useWebsocket) {
            setInterval(function () {
                getMsgCount(true);
            }, 60000);
        }

        if(win.showEXun) {
            initEmsg();
        } else {
            $eMsgIcon.addClass('hidden');
        }

    });

    // 使用websocket更新消息数目，则需要在websocket建立后绑定messagecount事件
    if (useWebsocket) {
        _aideEvent_.on('websocketCreated', function () {

            eWebSocket.socketEvent.on('messagecount', function (e) {
                updateMsgCount(e.data);
            });
        });
    }


    // 将刷新消息数目的方法开放出来，以备外部处理完代办后可以刷新主界面中的消息数目
    win.getMessageCount = getMsgCount;

    // 消息列表
    /* var messageList;

    function initMessageList() {
        messageList = new MessageList({
            container: $msgRemindContent,
            getUrl: epoint.dealRestfulUrl(getDataUrl + '/getMsgData'),
            ignoreUrl: epoint.dealRestfulUrl(getDataUrl + '/ignoreRemind'),
            afterOpenMsg: function () {
                hidePanel();
            },
            afterIgnore: function () {
                // 目前忽略消息后不会返回数据 需要重新拉去消息。 内容的拉取在内部显示了，此处 还需要更新数值，因此手动拉去消息数目
                getMsgCount();
            }
        });
    }
    if (!win.MessageList) {
        Util.loadJs('frame/fui/js/widgets/messagelist/messagelist.js', function () {
            initMessageList();
        });
    } else {
        initMessageList();
    } */

    // eXun 列表
    // 减少
    var decreaseEmsgCount = function () {
        var cnt = $eMsgNum.text();
        if (cnt) {
            cnt = parseInt(cnt, 10) - 1;
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

    var initEmsg = function() {
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
    };
    

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

        $topActionList.find('[data-ref].active').removeClass('active');
    }
    /* global hideMessagePanel */
    win.hideMessagePanel = hidePanel;
    var $cover = createMainContentCover();

    var msgCenter;

    win.messageCenter = {
        refresh: function () {
            if (msgCenter) {
                msgCenter.refresh();
            }
        },
        hide: function() {
            if (msgCenter) {
                msgCenter.hide();
            }
        }
    };
    // 顶部图标点击交互
    $topActionList.on('click', '[data-ref]', function () {
        var $el = $(this),
            ref = $el.data('ref'),
            $panel = $('#' + ref, $msgPanel);

        if ($el.hasClass('active')) {
            hidePanel();
            $cover.addClass('hidden');
        } else {
            $el
                .addClass('active')
                .siblings('.active')
                .removeClass('active');

            if (ref == 'msgRemind') {
                // messageList.getData();
                if (!msgCenter) {
                    msgCenter = new MsgCenter(win._msgcenterConfig_);
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

            } else if (ref == 'msgSkin') {
                win.initSkinView && win.initSkinView();
            }

            $panel
                .removeClass('hidden')
                .siblings('.msg-panel-detail')
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
    $msgPanel.on('click', '.msg-panel-hide', function () {
        hidePanel();
    });

    $('body').on('click', function (e) {
        var $target = $(e.target);
        if (!$target.closest('#msg-panel , .header-action-btn[data-ref]').length) {
            hideMessagePanel();
        }
    });


})(this, jQuery);

// 全文检索
(function (win, $) {
    // var $header = $('.header-container');
    var $headerSearch = $('#header-search-container');

    function doSearch(type, kw) {
        type = type || 'all';
        try {
            TabsNav.removeTab('fullsearch');
        } catch (error) {

        }
        // TabsNav.addTab({
        //     id: 'fullsearch',
        //     name: '全文检索',
        //     url: win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type=' + type
        // });
        dealLinkOpen({
            id: 'fullsearch',
            name: '全文检索',
            url: win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type=' + type,
            openType: 'tabsnav'
        });
        $('#header-search-container').removeClass('active');
    }

    function getCateData() {
        return Util.ajax({
            url: win._searchCfg.fullSearchCateUrl
        }).done(function (data) {
            initTopFullSearch(data.categories);
        });
    }

    function initTopFullSearch(cateData) {

        cateData = cateData || [];

        if (typeof cateData == 'string') {
            cateData = JSON.parse(cateData);
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
            maxShowCharacter: 3, // 下拉区域显示的最大关键字字符数
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
                $headerSearch[show ? 'addClass' : 'removeClass']('show-overflow');
            }
        }

        $headerSearch.on('click', '.header-search-btn', function () {
            // Util.browsers.isIE && $headerSearch.removeClass('show-overflow');
            ieOverflowFixed(false);
            $headerSearch.toggleClass('active').trigger('autoFocus');
        }).on('autoFocus', function () {
            // 不支持动画的情况下直接聚焦
            if (!Util.browsers.isSupportTransition) {
                $headerSearch.hasClass('active') && classifySearch.$input.trigger('focus');
            }
        });
        // 向右拉开完成后自动聚焦
        if (Util.browsers.isSupportTransition) {
            // 支持过渡则在过渡完成后自动聚焦
            $headerSearch.on(Util.browsers.transitionend, function (ev) {
                if (ev.target === this) {
                    if ($headerSearch.hasClass('active')) {
                        // Util.browsers.isIE && $headerSearch.addClass('show-overflow');
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
                        // Util.browsers.isIE && $headerSearch.removeClass('show-overflow');
                        $headerSearch.removeClass('active');
                    }
                }
            });
        } else {
            // 否则直接隐藏
            classifySearch.$input.on('blur', function () {
                Util.browsers.isIE && $headerSearch.removeClass('show-overflow');
                $headerSearch.removeClass('active');
            });
        }
    }

    // 处理用户和模块的实时搜索
    function dealUserModuleSearch(classifySearch) {
        var $userItem = classifySearch.$classifyList.find('[data-id="user"]'),
            $modulItem = classifySearch.$classifyList.find('[data-id="module"]');

        if (!$userItem.length || !$modulItem.length) {
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
        if ($modulItem.length) {
            // $moduleList.appendTo($modulItem);
            $moduleList.insertAfter($modulItem);
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
                    item.hlname = item.name.replace(hlReg, '<span class="top-search-kw">' + value + '</span>');
                    userHTML.push(Mustache.render(USER_ITEM_TPL, item));
                });
                data.modules && $.each(data.modules, function (i, item) {
                    item.icon = item.icon || 'modicon-1';
                    item.hlname = item.name.replace(hlReg, '<span class="top-search-kw" >' + value + '</span>');
                    moduleHTML.push(Mustache.render(MODULE_ITEM_TPL, item));
                });
                $(userHTML.join('')).appendTo($userList.empty());
                $(moduleHTML.join('')).appendTo($moduleList.empty());
            });

        }

    }

    // getCateData();
    // 获取到全文检索地址后再进行初始化
    _aideEvent_.on('afterPageInfo', function () {
        if (win._fullSearchUrl_) {
            getCateData();
            // $header.addClass('has-search');
        } else {
            // $header.removeClass('has-search');
        }
        // _aideEvent_.fire('headerSearchLoad');
    });

})(this, jQuery);

/*
 * 打开E讯聊天窗口
 * sessionid 会话id，当传入一个参数时sessionid表示uid
 * uid 对方用户id
 * type 个人：friend 讨论组：group
 */
window.OpenEMsg = function (sessionid, uid, type) {
    /* global eMsg , {eMsgSocket:true} */
    if (window.eMsg) {
        if (typeof uid === 'undefined') {
            eMsg.open(sessionid);
        } else {
            eMsg.openSession(sessionid, uid, type);
        }
    } else {

        creatWebSocket(_userGuid_, _userName_, function () {
            eWebSocket.openEmsg(sessionid, uid, type);
        });

        // Util.loadPageModule({
        //     templ: 'fui/pages/emsg/emsg.tpl',
        //     js: 'fui/pages/emsg/emsg.js',
        //     css: 'fui/pages/emsg/emsg.css',
        //     callback: function () {
        //         eWebSocket = new EMsgSocket(_userGuid_, _userName_);
        //         if (typeof uid === 'undefined') {
        //             eMsg.open(sessionid);
        //         } else {
        //             eMsg.openSession(sessionid, uid, type);
        //         }
        //     }
        // });
    }
};

// 更新公告
(function(win, $){
    var $helpIcon = $('#help-icon');
    
    var templ = '<div class="notice-remind-cover"></div>' +
        '<div class="notice-remind">' +
            '<h2 class="notice-remind-hd">更新公告</h2>' +
            '<span class="notice-remind-history">历史公告</span>' +
            '<div class="notice-remind-bd">' +
            '</div>' +
            '<button class="notice-remind-btn">我知道了</button>' +
        '</div>',

        style = '.notice-remind-cover{position:absolute;top:0;right:0;bottom:0;left:0;background:#000;opacity:.4;filter:alpha(opacity=40);z-index:9999}.notice-remind{position:absolute;top:50%;left:50%;width:630px;height:380px;margin-left:-315px;margin-top:-190px;border-radius:8px;background:#fff;z-index:10000}.notice-remind-hd{height:70px;line-height:70px;text-align:center;font-size:18px;font-weight:700;color:#4080f5}.notice-remind-history{position:absolute;width:60px;top:25px;right:40px;color:#9fb1d3;font-size:14px;line-height:22px;cursor:pointer}.notice-remind-bd{height:240px;margin:0 40px;overflow:auto}.notice-remind-btn{position:absolute;bottom:26px;left:50%;margin-left:-55px;width:110px;height:34px;border:0;background:#4080f5;color:#fff;border-radius:2px;cursor:pointer}.notice-remind-bd h1,.notice-remind-bd h2,.notice-remind-bd h3,.notice-remind-bd h4,.notice-remind-bd h5,.notice-remind-bd h6{position:relative;margin-top:1em;margin-bottom:16px;font-weight:bold;line-height:1.4}.notice-remind-bd h1 .octicon-link,.notice-remind-bd h2 .octicon-link,.notice-remind-bd h3 .octicon-link,.notice-remind-bd h4 .octicon-link,.notice-remind-bd h5 .octicon-link,.notice-remind-bd h6 .octicon-link{display:none;color:#000;vertical-align:middle}.notice-remind-bd h1:hover .anchor,.notice-remind-bd h2:hover .anchor,.notice-remind-bd h3:hover .anchor,.notice-remind-bd h4:hover .anchor,.notice-remind-bd h5:hover .anchor,.notice-remind-bd h6:hover .anchor{padding-left:8px;margin-left:-30px;text-decoration:none}.notice-remind-bd h1:hover .anchor .octicon-link,.notice-remind-bd h2:hover .anchor .octicon-link,.notice-remind-bd h3:hover .anchor .octicon-link,.notice-remind-bd h4:hover .anchor .octicon-link,.notice-remind-bd h5:hover .anchor .octicon-link,.notice-remind-bd h6:hover .anchor .octicon-link{display:inline-block}.notice-remind-bd h1{padding-bottom:.3em;font-size:2.25em;line-height:1.2;border-bottom:1px solid #eee}.notice-remind-bd h1 .anchor{line-height:1}.notice-remind-bd h2{padding-bottom:.3em;font-size:1.75em;line-height:1.225;border-bottom:1px solid #eee}.notice-remind-bd h2 .anchor{line-height:1}.notice-remind-bd h3{font-size:1.5em;line-height:1.43}.notice-remind-bd h3 .anchor{line-height:1.2}.notice-remind-bd h4{font-size:1.25em}.notice-remind-bd h4 .anchor{line-height:1.2}.notice-remind-bd h5{font-size:1em}.notice-remind-bd h5 .anchor{line-height:1.1}.notice-remind-bd h6{font-size:1em;color:#777}.notice-remind-bd h6 .anchor{line-height:1.1}.notice-remind-bd p,.notice-remind-bd blockquote,.notice-remind-bd ul,.notice-remind-bd ol,.notice-remind-bd dl,.notice-remind-bd table,.notice-remind-bd pre{margin-top:0;margin-bottom:16px}.notice-remind-bd ul,.notice-remind-bd ol{padding-left:2em}.notice-remind-bd ul ul,.notice-remind-bd ul ol,.notice-remind-bd ol ol,.notice-remind-bd ol ul{margin-top:0;margin-bottom:0}.notice-remind-bd li>p{margin-top:16px}',
        
        $style = $('<style>' + style + '</style>');

        $el = $(templ),
        $content = $('.notice-remind-bd', $el);

    var bindEvent = function(){
        $el.on('click', '.notice-remind-history', function(){
            NoticeRemindConfig.onHistoryClick && NoticeRemindConfig.onHistoryClick();
            close();
        }).on('click', '.notice-remind-btn', function() {
            close();
        });
    };

    var close = function() {
        Util.ajax({
            url: NoticeRemindConfig.markToReadUrl,
            data: {cInfoGuid:cInfoGuid}
        });
        $el.off('click');
        $el.remove();
        $style.remove();
        $helpIcon.removeClass('new-info');
    };

    var show = function(content) {
        insertStyle();
        bindEvent();

        $content.html(content);

        $('body').append($el);
    };

    var insertStyle = function() {
        $style.appendTo('head');
    };

    var cInfoGuid = '';
    var getNotice = function() {
        Util.ajax({
            url: NoticeRemindConfig.getUrl
        }).done(function(data){
            if(data.content) {
                show(data.content);
                cInfoGuid = data.cInfoGuid;
            }
        });
    };

    var getNoticeCount = function(){
        Util.ajax({
            url: NoticeRemindConfig.getCountUrl
        }).done(function(data){
            if(data.isRead === false) {
                $helpIcon.addClass('new-info');
            }
        });
    };

    if(win.NoticeRemindConfig) {
        getNoticeCount();
    }

    $helpIcon.on('click', function(){
        var $this = $(this);

        if($this.hasClass('new-info')) {
            getNotice();
            $helpIcon.removeClass('new-info');
        } else {
            window.open(NoticeRemindConfig.pageUrl);
        }
    });

})(this, jQuery);