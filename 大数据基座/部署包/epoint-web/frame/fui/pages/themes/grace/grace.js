/*
 * @Author: chends
 * @Date: 2018-07-04 08:24:11
 * @LastEditors: jjj
 * @LastEditTime: 2018-09-15 16:21:19
 * @Description:
 */

// 全局变量处理
(function (win, $) {
    // 自定义事件 用于一些逻辑控制
    win._graceEvent_ = new Util.UserEvent();

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
            // $(iframe).appendTo($pageCover);
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
        // epoint.dealRestfulUrl方法已不再对全路径做处理，这里可以直接使用该方法
        return Util.ajax({
            url: epoint.dealRestfulUrl(getDataUrl + '/' + method),
            data: params
        });
    };

    // 处理链接打开
    win.dealLinkOpen = function (linkData) {
        linkData.url = Util.addHtmlToUrl(linkData.url);
        switch (linkData.openType) {
            case 'tabsnav':
                TabsNav.addTab(linkData);
                break;
            case 'dialog':
                epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
                break;
            case 'blank':
                win.open(Util.getRightUrl(linkData.url), (linkData.id + '').replace(/-/g, '_'));
                break;
            default:
                break;
        }
    };

    // 统一js动画时间
    win._ANIMATION_TIME_ = {
        slide: 300
    };

    if(Util.browsers.isIE) {
        win._ANIMATION_TIME_.slide = 0;
    }

    win.slideDownCb = function () {
        $(this).css('height', '');
    };
    win.slideUpCb = function () {
        $(this).css({
            height: 0,
            display: 'none'
        });
    };

    win.useWebsocket = Util.getFrameSysParam('useWebsocket') === true;

    // 页面websocket对象
    win.eWebSocket = undefined;

    // 创建websocket链接
    win.creatWebSocket = function (uid, uname, tenantname, callback) {
        if(typeof tenantname === 'function' && !callback) {
            callback = tenantname;
            tenantname = '';
        }
        // 避免重复创建
        if (eWebSocket) {
            callback && callback();
            return;
        }

        var cfg = win.EWebSocketConfig ?
            win.EWebSocketConfig : {
                url: EmsgConfig.websocketUrl
            };

        cfg.uid = uid;
        cfg.uname = uname;
        cfg.tenantname = tenantname;

        if (win.EWebSocket) {
            eWebSocket = new EWebSocket(cfg);
            callback && callback();
            _graceEvent_.fire('websocketCreated');
        } else {
            Util.loadJs('frame/fui/js/widgets/ewebsocket/ewebsocket.js', function () {
                eWebSocket = new EWebSocket(cfg);
                callback && callback();
                _graceEvent_.fire('websocketCreated');
            });
        }
    };

    // 获取当前左侧菜单的状态
    win.getLeftMenuState = function() {
        return localStorage.getItem('_grace_leftmenu_state_') || 'normal';
    };

    // 是否显示E讯
    win.showEXun = true;
    // 是否显示快捷菜单
    win.hasQuickMenu = true;
    // 消息中心配置
    win._msgcenterConfig_ = win.MsgCenterConfig || {};
    /* global  _graceEvent_ , _getData_ , getDataUrl, createMainContentCover , UserSettings, dealLinkOpen, _ANIMATION_TIME_ */
})(this, jQuery);

// 框架压测要求将主界面初始化请求合并成一个
// 合并请求包括：getMenu、getPageInfo、getUserInfo 三个
(function (win, $) {
    var getAllData = function (params) {
        _getData_('getData', params).done(function (data) {
            _graceEvent_.fire('themeDataLoad', data);
        });
    };
    getAllData({
        actions: JSON.stringify([{
            action: 'getMenu',
            params: {
                query: 'top'
            }
        }, {
            action: 'getPageInfo'
        }, {
            action: 'getUserInfo'
        }])
    });
})(this, jQuery);
// TabsNav 初始化
(function (win, $) {
    var useTabsNav = Util.getFrameSysParam('taskbar_mode') === 'singlelabel' ? false : true;
    
    var $main = $('#main'),
        $topMenu = $('#top-menu'),
        $mainContent = $('.main-content', $main),
        $activeMenuLink;

    var collapseSiblingsMenu = function($menuItem) {
        $menuItem.siblings('.opened')
            .removeClass('opened')
            .find('.left-menu-sub-list:eq(0)')
            .stop(true)
            .slideUp(_ANIMATION_TIME_.slide);
    };

    var expandParentMenu = function ($menuItem) {
        var $parentMenuItem = $menuItem.parent().closest('.left-menu-item'),
            isTop = $parentMenuItem.hasClass('level-1');

        if ($parentMenuItem.length) {

            expandMenu($parentMenuItem, isTop);

            isTop || expandParentMenu($parentMenuItem);
        }
    };

    var expandMenu = function($menuItem, isTop) {
        var $menuLink = $menuItem.children('.left-menu-link'),
            $sub = isTop ? $menuLink.next().find('.left-menu-sub-list:eq(0)') : $menuLink.next(),
            isNarrow = getLeftMenuState() === 'narrow';

        if (!$menuItem.hasClass('opened')) {

            // 展开当前 收起其他
            if (isTop && isNarrow) {
                // $sub.show();
            } else {
                $sub.stop(true).slideDown(_ANIMATION_TIME_.slide);
                
                collapseSiblingsMenu($menuItem.addClass('opened'));
            }

            console.log($menuItem);
        }
    };
    if(useTabsNav) {
        if (Object.prototype.toString.call(win.EpTabsNav) === '[object Function]') {
            var position = Util.getFrameSysParam('taskbar_position');

            if(position === 'top') {
                $mainContent.addClass('tabs-top');
            } else {
                position = 'bottom';
            }
            
            /* global TabsNav , EpTabsNav*/
            window.TabsNav = new EpTabsNav({
                ifrContainer: '#main-ifr-wrap', //内容父容器
                tabContainer: '#main-tab-wrap', //任务栏容器
    
                needScrollBtn: false, //是否显示左右滚动按钮
                scrollBtnSite: 'sides', //左右滚动按钮的位置，两侧：'sides',右侧：'right'
                smoothItems: 3, //点击左右滚动按钮，滑动单个tab的宽度的倍数，默认为3
                refreshOnActiveTab: Util.getFrameSysParam('ui_tab_refresh_onactive') || false, // 激活tab时是否自动刷tab页面
                needQuickNav: true, //是否显示快捷导航
    
                position: position, // tab显示的位置，头部：'top'，底部：'bottom'，默认为'bottom'
                tabWidth: 0 // 默认一个tab的宽度，没有固定tab时必须设置, 配置为0则自适应
            });
            // 重写遮罩实现
            TabsNav._$pageCover = createMainContentCover();
            
            // 实现tab与菜单联动
            TabsNav.onTabActive = function (id) {
                id = id.replace(/^tab-/, '');
                var topId = id.substr(0, 4),
                    $topMenuItem = $topMenu.find('.top-menu-item[data-id="' + topId + '"]'),
                    $curMenuWrap = $('#left-menu-' + topId),
                    $curMenuLink = $curMenuWrap.find('.left-menu-link[data-id="' + id + '"]'),
                    $curMenuItem;
    
                $activeMenuLink && $activeMenuLink.removeClass('active');
    
                // 调整顶部菜单
                if($topMenuItem.length) {
                    $topMenuItem.addClass('active')
                        .siblings()
                        .removeClass('active');
                } else {
                    $topMenu.find('.top-menu-item.active').removeClass('active');
                }
    
                // 调整左侧菜单
                if ($curMenuWrap.length) {
                    if ($curMenuLink.length) {
                        
                        $activeMenuLink = $curMenuLink.addClass('active');
                        $curMenuItem = $curMenuLink.parent();
                        collapseSiblingsMenu($curMenuItem);
                        expandParentMenu($curMenuItem);
                    }
    
                    getLeftMenu({code: topId});
                    $main.removeClass('left-none');
                } else {
                    $main.addClass('left-none');
                }
            };
    
        } else {
            console.error('The TabsNav is required! , please add the "frame/fui/js/widgets/tabsnav/tabsnav.js" before theme\'s javascript file');
        }
    } else {
        var contentIframe;
        window.TabsNav = {
            addTab: function(cfg) {
                if(!contentIframe) {
                    contentIframe = $('<iframe class="tab-content"  src="" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>').appendTo($('#main-ifr-wrap'))[0];
                }
                contentIframe.src = Util.getRightUrl(cfg.url);

                if(cfg.id) {
                    var id = cfg.id + '',
                    topId = id.substr(0, 4),
                    $curMenuWrap = $('#left-menu-' + topId),
                    $curMenuLink = $curMenuWrap.find('.left-menu-link[data-id="' + id + '"]'),
                    $curMenuItem;

                    if($curMenuLink.length) {
                        $activeMenuLink && $activeMenuLink.removeClass('active');
                        $activeMenuLink = $curMenuLink.addClass('active');

                        $curMenuItem = $curMenuLink.parent();
                        collapseSiblingsMenu($curMenuItem);
                        expandParentMenu($curMenuItem);
                    }

                }
            },
            removeTab: function() {},
            adjustSize: function () {}
        };

        $mainContent.addClass('notabs');
    }

})(this, jQuery);

// 背景切换
(function (win, $) {
    var $bgImg = $('#theme-bg-img');
    // 设置背景图片
    var loadBgImg = function (skin) {
        skin = skin || mini.Cookie.get('_grace_skin_') || 'default';
        var src = './skins/' + skin + '/images/bg.png';
        var image = new Image();
        image.src = src;
        image.onload = function () {
            $bgImg[0].src = src;
        };
    };

    // $(function () {
    //     loadBgImg();
    // });
    // 皮肤更新是切换背景
    $(window).on('message', function (event) {
        event = event.originalEvent;
        if (!event.data) return;
        try {
            var data = JSON.parse(event.data);
            if (data.type == 'skinChange' && data.skin) {
                loadBgImg(data.skin);
            }
        } catch (error) {
            console.error(error);
        }
    });
})(this, jQuery);

// topmenu
(function (win, $) {
    var TOP_MENU_ITEM_TPL = '{{#items}}<li class="top-menu-item l {{#isActived}}active{{/isActived}}" data-id="{{code}}" data-url="{{url}}" data-opentype="{{openType}}" data-hassub="{{hasSub}}" title="{{name}}">{{name}}</li>{{/items}}';

    var $mainNav = $('#header-main-nav'),
        $main = $('#main'),
        $topMenu = $('#top-menu'),
        $topMenuList = $('.top-menu-list', $topMenu);

    var PORTAL_WIDTH = $('#top-portal-container').outerWidth(true) || 30,
        QUICK_WIDTH,
        EXTRA_WIDTH = 40,
        TOP_MENU_ITEM_WIDTH,
        TOP_MENU_ITEM_HEIGHT;

    // 动画支持检测
    var el = document.createElement('div');
    var isSupportTransition = 'transition' in el.style;
    el = null;
    var $style = $('<style></style>').appendTo('head');
    var TOP_MENU_COUNT = 0;

    function adjustTopMenuWidth() {
        if (!TOP_MENU_COUNT) {
            TOP_MENU_COUNT = $topMenuList.children().length;
            if (TOP_MENU_COUNT === 0) {
                // 若菜单还未加载 则无需计算
                return;
            }
        }
        // 由于存在字体放大，menu的行高会不固定，所以需要去计算
        if (!TOP_MENU_ITEM_HEIGHT) {
            TOP_MENU_ITEM_HEIGHT = $topMenuList
                .children()
                .eq(0)
                .outerHeight(true);
        }
        // 由于存在字体放大，menu的行高会不固定，所以需要去计算
        if (!TOP_MENU_ITEM_WIDTH) {
            TOP_MENU_ITEM_WIDTH = $topMenuList
                .children()
                .eq(0)
                .outerWidth(true) + 1;
        }
        if (!QUICK_WIDTH) {
            QUICK_WIDTH = $('#quick-menu').outerWidth(true) || 30 + 8;
        }
        
        var mainNav_w = $mainNav.width();
        // 处理 IE8 偶尔容器宽度为0的问题
        if (mainNav_w <= 0) {
            return setTimeout(adjustTopMenuWidth, 17);
        }
        // 计算容器宽度 并转化为最大展示个数
        var wrap_w = mainNav_w - PORTAL_WIDTH - QUICK_WIDTH - EXTRA_WIDTH;
        var max_items = ((wrap_w - 30) / TOP_MENU_ITEM_WIDTH) >> 0;

        // var w = Math.min(TOP_MENU_COUNT, max_items) * TOP_MENU_ITEM_WIDTH + 30;

        if (TOP_MENU_COUNT > max_items) {
            // w = TOP_MENU_COUNT * TOP_MENU_ITEM_WIDTH + 30;
            $topMenu.addClass('is-over').css('width', max_items * TOP_MENU_ITEM_WIDTH);
        } else {
            // w = max_items * TOP_MENU_ITEM_WIDTH + 30;
            $topMenu.removeClass('is-over').css('width', TOP_MENU_COUNT * TOP_MENU_ITEM_WIDTH);
        }
        // $topMenu.css('width', w);

        // $topMenu[TOP_MENU_COUNT > max_items ? 'addClass':'removeClass']('is-over');

        // 计算正确的max-heigh值 以保证动画正常
        if (isSupportTransition) {
            // var h = $topMenuList.height();
            var h = TOP_MENU_ITEM_HEIGHT * Math.ceil(TOP_MENU_COUNT / max_items);
            $style.text('.top-menu-wrap.active{max-height:' + h + 'px;max-height:' + h / 100 + 'rem}');
        }
    }
    var timer;
    $(window).on('resize.topmenuadjust', function () {
        clearTimeout(timer);
        timer = setTimeout(adjustTopMenuWidth, 17);
    });

    _graceEvent_.on('headerSearchLoad', adjustTopMenuWidth);

    var $cover = createMainContentCover();
    $topMenu
        .on('click', '.top-menu-trigger', function () {
            if (!$topMenu.hasClass('is-over')) {
                return;
            }
            if ($topMenu.hasClass('active')) {
                // 保持颜色状态 解决收起时直接没有背景 感觉上没有动画的问题
                isSupportTransition && $topMenu.addClass('hold-color');
                $topMenu.removeClass('active');
                $cover.addClass('hidden');
            } else {
                $topMenu.addClass('active');
                $cover.removeClass('hidden');
            }
        })
        .on('transitionend', function (e) {
            // 保持颜色状态 解决收起时直接没有背景 感觉上没有动画的问题
            if (e.target !== this) {
                return;
            }
            $topMenu.removeClass('hold-color');
        })
        .on('click', '.top-menu-item', function () {
            var $this = $(this),
                url = $this.data('url'),
                name = this.getAttribute('title') || this.innerText,
                openType = $this.data('opentype'),
                hasSub = $this.data('hassub');

            $this
                .addClass('active')
                .siblings()
                .removeClass('active');

            if (hasSub) {
                $main.removeClass('left-none');
                getLeftMenu({
                        code: this.getAttribute('data-id'),
                        name: this.getAttribute('title') || this.innerText
                    },
                    true
                );
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
                });
            }
            $topMenu.removeClass('active');
            $cover.addClass('hidden');
        });
    $('body').on('click', function (e) {
        if (!$(e.target).closest('#top-menu').length) {
            $topMenu.removeClass('active');
            $cover.addClass('hidden');
        }
    });

    // function getTopMenu() {
    //     _getData_('getMenu', {
    //         query: 'top'
    //     }).done(function (data) {
    //         if (!data || !data.items) return;

    //         // var defaultCode = data.code,
    //         //     topMenuName = '',
    //         //     hasSub;

    //         // 查找默认需要打开的
    //         // if (defaultCode) {
    //         //     $.each(data.items, function (i, item) {
    //         //         if (item.code === defaultCode) {
    //         //             item.isActived = true;
    //         //             topMenuName = item.name;
    //         //             hasSub = item.hasSub;
    //         //             return false;
    //         //         }
    //         //     });
    //         // } else {
    //         //     // 没有直接取第一个
    //         //     data.items[0].isActived = true;
    //         //     defaultCode = data.items[0].code;
    //         //     topMenuName = data.items[0].name;
    //         //     hasSub = data.items[0].hasSub;
    //         // }

    //         // 渲染加载
    //         $(Mustache.render(TOP_MENU_ITEM_TPL, data)).appendTo($topMenuList);
    //         _graceEvent_.fire('topMenuLoad');
    //         // 渲染完成后适应宽度
    //         adjustTopMenuWidth();

    //         // 找到的有子菜单时自动加载左侧
    //         // if (hasSub) {
    //         //     getLeftMenu({
    //         //         code: defaultCode,
    //         //         name: topMenuName
    //         //     });
    //         // } else {
    //         // 无子菜单 隐藏左侧
    //         $main.addClass('left-none');
    //         // }
    //     });
    // }
    // getTopMenu();

    _graceEvent_.on('themeDataLoad', function(evt){
        var menu = evt.data.getMenu;
        if(typeof menu === 'string') {
            menu = JSON.parse(menu);
        }
        if (!menu || !menu.items) return;

        // var defaultCode = menu.code,
        //     topMenuName = '',
        //     hasSub;

        // 查找默认需要打开的
        // if (defaultCode) {
        //     $.each(menu.items, function (i, item) {
        //         if (item.code === defaultCode) {
        //             item.isActived = true;
        //             topMenuName = item.name;
        //             hasSub = item.hasSub;
        //             return false;
        //         }
        //     });
        // } else {
        //     // 没有直接取第一个
        //     menu.items[0].isActived = true;
        //     defaultCode = menu.items[0].code;
        //     topMenuName = menu.items[0].name;
        //     hasSub = menu.items[0].hasSub;
        // }

        // 渲染加载
        $(Mustache.render(TOP_MENU_ITEM_TPL, menu)).appendTo($topMenuList);
        _graceEvent_.fire('topMenuLoad');
        // 渲染完成后适应宽度
        adjustTopMenuWidth();

        // 找到的有子菜单时自动加载左侧
        // if (hasSub) {
        //     getLeftMenu({
        //         code: defaultCode,
        //         name: topMenuName
        //     });
        // } else {
        // 无子菜单 隐藏左侧
        $main.addClass('left-none');
        // }
    });
})(this, jQuery);

// userinfo
(function (win, $) {
    var $logo = $('#sys-logo-img'),
        $userInfo = $('#user-info'),
        $userPortrait = $('.user-portrait', $userInfo);
    var $cover = createMainContentCover();
    $userInfo
        // 用户头像点击
        .on('click', '.user-info-summary', function () {
            if (!$userInfo.hasClass('active')) {
                !isExtTabsInfoLoad && getExtTabsInfo();
                $userInfo.addClass('active');
                $cover.removeClass('hidden');
            } else {
                $userInfo.removeClass('active');
                $cover.addClass('hidden');
            }
        })
        .on('click', '.user-action-item', function () {
            var $this = $(this);
            // 个人信息
            if ($this.hasClass('person-info')) {
                TabsNav.addTab({
                    id: this.getAttribute('data-id'),
                    name: this.getAttribute('data-name'),
                    url: this.getAttribute('data-url')
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
            $userInfo.removeClass('active');
            $cover.addClass('hidden');
        }
    });
    // 获取用户信息
    // _getData_('getUserInfo').done(function (data) {
    //     initUserInfo(data);
    // });


    // _getData_('getPageInfo').done(function (data) {
    //     initPageInfo(data);
    // });

    var initUserInfo = function(data) {
        // 用户guid和name是E讯必须要使用的 需要记录下来
        /* global _userName_, _userGuid_ */
        win._userName_ = data.name;
        win._userGuid_ = data.guid;
        win._tenantName_ = data.tenantsysname;

        // 消息中心的配置-打开是否全屏
        $.extend(win._msgcenterConfig_, {
            isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
            msgCenterOrder: data.msgCenterOrder || 'asc',
            hideCallback: function () {
                $cover.addClass('hidden');
            }
        });

        // 使用websocket来更新消息数目，需要先建立连接
        if (useWebsocket) {
            creatWebSocket(_userGuid_, _userName_, _tenantName_);
        }
        if (data.portrait) {
            // 头像
            var url = Util.getRightUrl(epoint.dealRestfulUrl(data.portrait));
            $userPortrait.attr('src', url);
        }
        // 兼职
        if (data.hasParttime) {
            $userInfo.find('.user-action-item.role-change').removeClass('hidden');

            if(data.isOpenDefaultOU) {
                // 直接弹出兼职切换窗口
                UserSettings.changeRole(_userGuid_);
            }
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
    };
    var initPageInfo = function (data) {
        // logo
        // 9.3版本需兼容直接返回base64的情况
        if (data.logo) {
            $logo.attr('src', /^data:/i.test(data.logo) ? data.logo : Util.getRightUrl(data.logo));
        }
        if (data.title) {
            document.title = data.title;
            win.systemTitle = data.title;
        }
        // fullSearchUrl
        if (data.fullSearchUrl) {
            win._fullSearchUrl_ = data.fullSearchUrl;
        }
        // 快捷菜单
        if(data.hasQuickMenu === false) {
            win.hasQuickMenu = false;
        }

        if (data.showEXun === false) {
            win.showEXun = false;
        }

        // var home = {
        //     closeIcon: false,
        //     refresh: true
        // };
        // 默认展示后端配置的 或者 第一个openType为tabnav的
        // $.each(data.homes, function (i, cate) {
        //     var finded = false;

        //     if (cate.items) {
        //         $.each(cate.items, function (j, item) {
        //             if (data.defaultHome) {
        //                 // server set
        //                 if (item.code == data.defaultHome) {
        //                     home.id = item.code || 'home';
        //                     home.url = item.url;
        //                     home.name = item.name;
        //                     finded = true;
        //                     return false;
        //                 }
        //             } else {
        //                 // the first
        //                 if (item.openType == 'tabsnav') {
        //                     home.id = item.code || 'home';
        //                     home.url = item.url;
        //                     home.name = item.name;
        //                     finded = true;
        //                     return false;
        //                 }
        //             }
        //         });
        //     }
        //     if (finded) {
        //         return false;
        //     }
        // });
        // 初始化门户
        // initPortal(data.homes, home);
        initPortal(data.homes, data.defaultHome);

        // 触发 afterPageInfo 事件
        _graceEvent_.fire('afterPageInfo');
    };
    _graceEvent_.on('themeDataLoad', function(evt){
        var userInfo = evt.data.getUserInfo,
            pageInfo = evt.data.getPageInfo;

        if(typeof userInfo === 'string') {
            userInfo = JSON.parse(userInfo);
        }
        if(typeof pageInfo === 'string') {
            pageInfo = JSON.parse(pageInfo);
        }

        initUserInfo(userInfo);
        initPageInfo(pageInfo);
    });
    // 用户头像更改
    $(win).on('message', function (e) {
        try {
            var data = JSON.parse(e.originalEvent.data);
            if (data.type === 'userPortraitChange') {
                $userPortrait.attr('src', data.imgData);
            }
        } catch (error) {}
    });
    var EXT_TAB_TPL = '<li class="user-action-item" title="{{name}}" url="{{url}}" data-opentype="{{openType}}" script="{{script}}"><span class="{{icon}}"></span>{{name}}</li>';
    var isExtTabsInfoLoad = false;
    // 扩展tab加载
    var getExtTabsInfo = function(){
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
            isExtTabsInfoLoad = true;
        });
    };
})(this, jQuery);

// #region 门户相关
// (function(win, $) {
//     var $topPortal = $('#top-portal'),
//         // $currPortal = $('.portal-curr', $topPortal),
//         $portalDrop = $('.portal-box-inner', $topPortal);

//     var PORTAL_CATEGORY_ITEM = '<div class="top-portal-cate-item" data-target="{{code}}"><span class="top-portal-cate-name" title="{{name}}">{{name}}</span><span class="top-portal-cate-trigger"></span></div>';
//     var PORTAL_ITEM = '{{#items}}<div class="top-portal-item" data-id="{{code}}" data-opentype="{{openType}}" title="{{name}}" data-url="{{url}}">{{name}}</div>{{/items}}';

//     // 处理带分类和不带分类的
//     function dealData(homes, defaultHome) {
//         var home = {
//             closeIcon: false,
//             refresh: true
//         };
//         // 记录无分类的门户
//         var signleHomes = [];
//         // 默认展示后端配置的 或者 第一个openType为tabnav的
//         // 遍历一次 处理分类和不带分类的
//         // 同时寻找 默认门户
//         // todo 这里面干了太多的事情 待优化
//         for (var i = 0; i < homes.length; i++) {
//             var cate = homes[i];
//             var finded = false;

//             // 带分类的
//             // if (cate.items && cate.items.length) {
//             if (cate.items != undefined) {
//                 // 寻找默认门户或 第一个带url的用于默认值
//                 !finded &&
//                     $.each(cate.items, function(j, item) {
//                         if (defaultHome) {
//                             // server set
//                             if (item.code == defaultHome) {
//                                 home.id = item.code || 'home';
//                                 home.url = item.url;
//                                 home.name = item.name;
//                                 finded = true;
//                                 return false;
//                             }
//                         } else {
//                             // the first
//                             if (item.openType == 'tabsnav') {
//                                 home.id = item.code || 'home';
//                                 home.url = item.url;
//                                 home.name = item.name;
//                                 finded = true;
//                                 return false;
//                             }
//                         }
//                     });
//             } else {
//                 if (!finded) {
//                     if (defaultHome) {
//                         // server set
//                         if (cate.code == defaultHome) {
//                             home.id = cate.code || 'home';
//                             home.url = cate.url;
//                             home.name = cate.name;
//                             finded = true;
//                         }
//                     } else {
//                         // the first
//                         if (cate.openType == 'tabsnav') {
//                             home.id = cate.code || 'home';
//                             home.url = cate.url;
//                             home.name = cate.name;
//                             finded = true;
//                         }
//                     }
//                 }
//                 // 不带分类的
//                 // signleHomes.push(homes.splice(i, 1));
//                 signleHomes = signleHomes.concat(homes.splice(i, 1));
//                 i--;
//             }
//         }
//         var outputHomes = [
//             {
//                 code: 'signleHomes',
//                 name: '默认分类',
//                 items: signleHomes
//             }
//         ];
//         $.each(homes, function(i, item) {
//             outputHomes.push(item);
//         });
//         return {
//             homes: outputHomes,
//             home: home
//         };
//     }

//     function initPortal(homes, defaultHome) {
//         var data = dealData(homes, defaultHome);
//         return _initPortal(data.homes, data.home);
//     }

//     function _initPortal(data, defaultHome) {
//         TabsNav.addTab(defaultHome);
//         // data.length = 2;
//         // console.log(JSON.stringify(data, 0, 2));
//         var html = '',
//             isMulti = data.length >= 3 ? true : false,
//             cateHtml,
//             subHtml;
//         if (isMulti) {
//             $topPortal.addClass('multi');
//             cateHtml = '<div class="portal-category-list">';
//             subHtml = '<div class="portal-sub-container">';
//             $.each(data, function(i, cate) {
//                 cateHtml += Mustache.render(PORTAL_CATEGORY_ITEM, cate);
//                 subHtml += '<div class="portal-sub-list" data-cate="' + cate.code + '">';
//                 subHtml += Mustache.render(PORTAL_ITEM, cate);
//                 subHtml += '</div>';
//             });
//             cateHtml += '</div>';
//             subHtml += '</div>';
//             html = cateHtml + subHtml;
//         } else {
//             $.each(data, function(i, cate) {
//                 html += Mustache.render(PORTAL_CATEGORY_ITEM, cate);
//                 html += '<div class="portal-sub-list" data-cate="' + cate.code + '">';
//                 html += Mustache.render(PORTAL_ITEM, cate);
//                 html += '</div>';
//             });
//         }
//         $(html).appendTo($portalDrop.empty());

//         _initEvent(isMulti, defaultHome);

//         // 只有一个门户分类、且下面只有一个门户时 隐藏即可
//         if (
//             // 没有分类仅仅一个
//             (data.length === 1 && !data[0].items) ||
//             // 带分类 一个分类 一个门户
//             (data.length === 1 && data[0].items && data[0].items.length === 1)
//         ) {
//             $topPortal.find('.portal-trigger').addClass('hidden');
//         }
//     }

//     function _initEvent(isMulti, defaultHome) {
//         var $cover = createMainContentCover();
//         if (isMulti) {
//             // 默认激活第一个
//             var $activeCate = $portalDrop.find('.top-portal-cate-item:eq(0)').addClass('active');
//             $portalDrop
//                 .find('.portal-sub-list[data-cate="' + $activeCate.data('target') + '"]')
//                 .removeClass('hidden')
//                 .siblings()
//                 .addClass('hidden');
//             $topPortal
//                 // 点击切换展示
//                 .on('click', '.top-portal-cate-item', function() {
//                     var $this = $(this);
//                     $this
//                         .addClass('active')
//                         .siblings()
//                         .removeClass('active');
//                     $portalDrop
//                         .find('.portal-sub-list[data-cate="' + $this.data('target') + '"]')
//                         .removeClass('hidden')
//                         .siblings()
//                         .addClass('hidden');
//                 });
//         } else {
//             $topPortal.on('click', '.top-portal-cate-trigger, .top-portal-cate-name', function() {
//                 var $cate = $(this).closest('.top-portal-cate-item'),
//                     $sub = $cate.next();

//                 if ($cate.data('target') == $sub.data('cate')) {
//                     if ($cate.hasClass('close')) {
//                         $cate.removeClass('close');
//                         $sub.stop(true).slideDown(_ANIMATION_TIME_.slide);
//                     } else {
//                         $cate.addClass('close');
//                         $sub.stop(true).slideUp(_ANIMATION_TIME_.slide);
//                     }
//                 }
//             });
//         }
//         $topPortal
//             // 点击展示更多门户
//             .on('click', '.portal-trigger', function() {
//                 if (!$topPortal.hasClass('active')) {
//                     $topPortal.addClass('active');
//                     $cover.removeClass('hidden');
//                 } else {
//                     $topPortal.removeClass('active');
//                     $cover.addClass('hidden');
//                 }
//             })
//             // 点击打开
//             .on('click', '.top-portal-item', function() {
//                 var $this = $(this),
//                     id = $this.data('id'),
//                     openType = $this.data('opentype'),
//                     url = $this.data('url'),
//                     name = $this.attr('title');
//                 if (openType == 'tabsnav') {
//                     TabsNav.addTab({
//                         id: id,
//                         name: name,
//                         url: url
//                     });
//                 } else if (openType == 'blank') {
//                     window.open(Util.getRightUrl(url), id);
//                 }
//                 // 打开后隐藏
//                 $topPortal.removeClass('active');
//                 $cover.addClass('hidden');
//             })
//             // 点击文字切换到默认门户
//             .on('click', '.portal-curr', function() {
//                 TabsNav.addTab(defaultHome);
//             });

//         $('body').on('click', function(e) {
//             if (!$(e.target).closest('#top-portal').length) {
//                 $topPortal.removeClass('active');
//                 $cover.addClass('hidden');
//             }
//         });
//     }

//     win.initPortal = initPortal;
//     /* global initPortal */
// });
// #endregion

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
                !finded &&
                    $.each(cate.items, function (j, item) {
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
        var isOne = $portal.find('.top-portal-item').length === 1;

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
                if (isOne) {
                    TabsNav.addTab(defaultHome);
                }
            })
            // 点击打开门户
            .on('click', '.top-portal-item', function () {
                // var $this =$(this);
                dealLinkOpen({
                    url: this.getAttribute('data-url'),
                    name: this.title,
                    openType: this.getAttribute('data-opentype'),
                    id: this.getAttribute('data-id')
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
        $(win)
            .on('resize', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    var h = $main.height() - 50;
                    h > 0 && $portalPanel.css('max-height', h);
                }, 17);
            })
            .trigger('resize');
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
            html.push('<div class="top-portal-block"><h3 class="top-portal-cate">' + cate.name + '<span class="top-portal-cate-trigger"></span></h3><ul class="top-portal-list" style="max-height:' + 30 * cate.items.length + 'px">');
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

// quick Menu
(function (win, $) {
    var $quickMneu = $('#quick-menu'),
        // $quickMneuBtn = $('.quick-menu-header', $quickMneu),
        $quickMneuList = $('.quick-menu-list', $quickMneu);

    var QUICK_MENU_TPL = '<li class="quick-menu-item" data-id="{{code}}" title="{{name}}" data-opentype="{{openType}}" data-url="{{url}}">{{name}}</li>',
        QUICK_MENU_SETTING_TPL = '<li class="quick-menu-item menu-setting"><i class="action-icon icon-gear"></i>配置</li>';

    var $cover = createMainContentCover();

    function initEvent() {
        $quickMneu
            .on('click', '.quick-menu-header', function () {
                if ($quickMneu.hasClass('active')) {
                    $quickMneu.removeClass('active');
                    $cover.addClass('hidden');
                } else {
                    if(!isQuickMenuLoaded) {
                        getQuickMenu();
                    }
                    $quickMneu.addClass('active');
                    $cover.removeClass('hidden');
                }
            })
            .on('click', '.quick-menu-item', function () {
                var $this = $(this),
                    openType = $this.data('opentype'),
                    id = $this.data('id'),
                    name = this.title,
                    url = $this.data('url');

                if($this.hasClass('menu-setting')) {
                    openQuickMenuSetting();
                } else if (openType == 'tabsnav') {
                    TabsNav.addTab({
                        id: id,
                        name: name,
                        url: url
                    });
                } else {
                    win.open(Util.getRightUrl(url), id);
                }
                $quickMneu.removeClass('active');
                $cover.addClass('hidden');
            });

        $('body').on('click', function (e) {
            if (!$(e.target).closest('#quick-menu').length) {
                $cover.addClass('hidden');
                $quickMneu.removeClass('active');
            }
        });
    }
     // 常用菜单配置点击
     var quickMenuSettingUrl = 'frame/fui/pages/quickmenusetting/quickmenusetting' + (/proto\.html/.test(location.pathname) ? '.proto.html' : '');
     var openQuickMenuSetting = function () {
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
                getQuickMenu();
             }
         }, opt);
     };
 
    var isQuickMenuLoaded = false;
    var getQuickMenu = function(){
        _getData_('getQuickMenu').done(function (data) {
            if (data && data.length) {
                var html = [];
                $.each(data, function (i, item) {
                    html.push(Mustache.render(QUICK_MENU_TPL, item));
                });
                html.push(QUICK_MENU_SETTING_TPL);
                $(html.join('')).appendTo($quickMneuList.empty());
            } else {
                $quickMneu.addClass('hidden');
            }
            isQuickMenuLoaded = true;
        });
    };

    _graceEvent_.on('afterPageInfo', function(){
        if(!win.hasQuickMenu) {
            $quickMneu.addClass('hidden');
        } else {
            initEvent();
        }
    });
    
})(this, jQuery);

// left-menu
(function (win, $) {
    var leftMenuStatus = {};

    var $main = $('#main'),
        $leftMenu = $('#left-menu'),
        $leftMenuTrigger = $('.left-nav-trigger', $leftMenu),
        $leftMenuContainer = $('.left-nav-container', $leftMenu);

    var $activeLeftMenu;

    // var tip = new mini.ToolTip();
    // tip.set({
    //     target: document,
    //     // scope: $leftMenu[0],
    //     trigger: 'hover',
    //     selector: '.main.left-narrow .left-menu-item.level-1 > .left-menu-link',
    //     placement: 'right',
    //     autoHide: true,
    //     // 适配左侧菜单的颜色
    //     theme: $leftMenu.hasClass('dark') ? 'dark' : 'light',
    //     defaultTheme: $leftMenu.hasClass('dark') ? 'dark' : 'light',
    //     onbeforeopen: function (e) {
    //         // 已经展开的则不显示了
    //         if ($leftMenu.hasClass('has-opened')) {
    //             e.cancel = true;
    //         }
    //     }
    // });

    // var LEFT_MENU_ITEM_TPL = `
    // <li class="left-menu-item {{level}}">
    //     <a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" data-hasSub="{{hasSub}}" class="left-menu-link"
    //         style="padding-left: {{indent}}px;">
    //         {{#isTop}}<i class="left-menu-icon {{icon}} "></i>{{/isTop}}
    //         <span class="left-menu-name">{{name}}</span>
    //         {{#hasSub}}<i class="left-menu-trigger"></i>{{/hasSub}}
    //     </a>
    //     {{#hasSub}}
    //         {{#isTop}}<div class="left-menu-sub"><div class="left-menu-sub-inner">
    //                 <div class="left-menu-sub-header">
    //                     <span class="left-menu-sub-title">{{name}}</span>
    //                 </div>{{/isTop}}
    //             <ul class="left-menu-sub-list" style="display:none;"> {{{subMenu}}}</ul>
    //         {{#isTop}}</div></div>{{/isTop}}
    //     {{/hasSub}}
    // </li>
    // `;
    var LEFT_MENU_ITEM_TPL = '<li class="left-menu-item {{level}}"><a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" data-hasSub="{{hasSub}}" class="left-menu-link"style="padding-left: {{indent}}px;padding-left: {{indentRem}}rem;">{{#isTop}}<i class="left-menu-icon {{icon}} "></i>{{/isTop}}<span class="left-menu-name">{{name}}</span>{{#hasSub}}<i class="left-menu-trigger action-icon icon-right"></i>{{/hasSub}}</a>{{#hasSub}}{{#isTop}}<div class="left-menu-sub"><div class="left-menu-sub-inner"><div class="left-menu-sub-header"><span class="left-menu-sub-title">{{name}}</span></div>{{/isTop}}<ul class="left-menu-sub-list" style="display:none;"> {{{subMenu}}}</ul>{{#isTop}}</div></div>{{/isTop}}{{/hasSub}}</li>';
    var LEFT_MENU_TPL = '<div class="left-menu-wrap" id="left-menu-{{code}}"><div class="left-menu-header">{{name}}</div><ul class="left-menu-list">{{{leftMenuItems}}}</ul></div>';
    
    function initEvent() {

        function saveLeftMenuState(v) {
            localStorage.setItem('_grace_leftmenu_state_', v);
        }

        var leftMenuState = getLeftMenuState();
        
        var $cover = createMainContentCover();

        // if(leftMenuState == 'normal') {
        //     $main.removeClass('left-narrow');
        // }else {
        //     $main.addClass('left-narrow');
        // }
        $main[leftMenuState == 'normal' ? 'removeClass' : 'addClass']('left-narrow');

        var isIE89 = Util.browsers.isIE8 || Util.browsers.isIE9;

        $('.left-nav-trigger').on('click', function () {
            if ($main.hasClass('left-narrow')) {
                saveLeftMenuState((leftMenuState = 'normal'));
                $main.removeClass('left-narrow');
                $cover.addClass('hidden');
            } else {
                saveLeftMenuState((leftMenuState = 'narrow'));
                $main.addClass('left-narrow');
                // 如果有展开的菜单 则显示遮罩
                if ($activeLeftMenu) {
                    var $openedMenu = $activeLeftMenu.find('.left-menu-item.level-1.opened');
                    if ($openedMenu.length) {
                        $cover.removeClass('hidden');
                        $leftMenu.addClass('has-opened');
                    } else {
                        // 触发一个自定义事件
                        // 隐藏掉窄状态下 的二级过渡效果
                        // cause ：无展开的二级菜单时 收起时候回子级闪现的问题
                        $leftMenu.trigger('hide-trans');
                    }

                    $activeLeftMenu.siblings().find('.left-menu-item.level-1.opened').removeClass('opened');
                }
            }
        });

        $leftMenu
            .on('hide-trans', function () {
                // 去除动画
                !isIE89 && $leftMenu.addClass('hide-trans');
            })
            .on('transitionend', function (e) {
                if (e.target !== this) {
                    return;
                }
                $leftMenu.removeClass('hide-trans');
            })
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
                    },
                    isNarrow = leftMenuState === 'narrow';

                // 处理子节点展开收起
                if (hasSub) {
                    // expandMenu($item, isTop, true);
                    var $sub = isTop ? $this.next().find('.left-menu-sub-list:eq(0)') : $this.next();

                    if (!$item.hasClass('opened')) {
                        $item.addClass('opened');
                        // 遮罩
                        isTop && isNarrow && $cover.removeClass('hidden');

                        // 展开当前 收起其他
                        if (isTop && isNarrow) {
                            $sub.show();
                        } else {
                            $sub.stop(true).slideDown(_ANIMATION_TIME_.slide);
                        }
                        $item
                            .siblings('.opened')
                            .removeClass('opened')
                            .find('.left-menu-sub-list:eq(0)')
                            .stop(true)
                            .slideUp(_ANIMATION_TIME_.slide);
                    } else {
                        $item.removeClass('opened');
                        $sub.stop(true).slideUp(_ANIMATION_TIME_.slide);

                        // 遮罩
                        isTop && isNarrow && $cover.addClass('hidden');
                    }
                } else if (linkData.url) {
                    // 处理链接
                    dealLinkOpen(linkData);

                    // 打开具体链接后收起
                    // if (isNarrow && !isTop) {
                    if (isNarrow) {
                        $activeLeftMenu
                            .find('.left-menu-item.level-1.opened')
                            .removeClass('opened')
                            .find('.left-menu-sub-list:eq(0)')
                            .slideUp(_ANIMATION_TIME_.slide);
                        $cover.addClass('hidden');
                        $leftMenu.removeClass('has-opened');
                    }
                }
                if (isTop && isNarrow) {
                    // tip.close();
                    // 如果有展开的菜单 则更新状态
                    // 用于窄状态下 已经展开一个菜单 切换展示其他菜单时会有一个收起一个出现的情况 用于去掉此现象
                    $leftMenu[$activeLeftMenu.find('.left-menu-item.level-1.opened').length ? 'addClass' : 'removeClass']('has-opened');
                }
            });
        $('body').on('click', function (e) {
            if (!$(e.target).closest('#left-menu').length) {
                $cover.addClass('hidden');
                // 窄状态下 空白点击收起菜单
                if (leftMenuState === 'narrow' && $activeLeftMenu) {
                    $activeLeftMenu
                        .find('.left-menu-item.level-1.opened')
                        .removeClass('opened')
                        .find('.left-menu-sub-list:eq(0)')
                        .slideUp();
                }
                $leftMenu.removeClass('has-opened');
            }
        });
        // 在内容区域宽度变化完后需要重新调整下tabsnav的宽度
        $('.main-content', $main).on('transitionend', function (e) {
            if (e.target !== this) {
                return;
            }
            TabsNav.adjustSize();
        });
    }
    initEvent();

    function getRowKey(rowkey, i) {
        return rowkey === undefined ? i + '' : rowkey + '-' + i;
    }
    // 缩进值
    var INDENT_INIT = 36,
        INDENT_STEP = 14;

    // 获取节点缩进值
    function getIndent(rowkey, len) {
        //分割成数组判断长度
        len = len || rowkey.split('-').length;
        if (len < 2) return INDENT_INIT;
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
            view.indentRem = view.indent && view.indent / 100;

            if (len === 1) {
                view.icon = view.icon || 'modicon-1';
            }

            if (view.hasSub) {
                html += Mustache.render(
                    LEFT_MENU_ITEM_TPL,
                    $.extend(view, {
                        subMenu: buildLeftMenu(item.items, view.rowkey)
                    })
                );
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
            $activeLeftMenu
                .appendTo($leftMenuContainer)
                .siblings('.left-menu-wrap')
                .addClass('hidden');
            $main.removeClass('left-none');
            // ie8 补充高度 是的滚动条正常出现
            if (Util.browsers.isIE8) {
                $activeLeftMenu.find('.left-menu-list').height($leftMenu.height() - $leftMenuTrigger.height() || 36);
            }
        } else {
            // 无子菜单 隐藏左侧
            $main.addClass('left-none');
        }
    }

    function getLeftMenu(tMenu, findSubUrlOpen) {
        var tCode = tMenu.code;
        // 未请求 或请求失败
        if (!leftMenuStatus[tCode] || leftMenuStatus[tCode] === 'reject') {
            return _getData_('getMenu', {
                    query: 'sub',
                    code: tCode
                })
                .done(function (data) {
                    ininView(data, tMenu);
                    leftMenuStatus[tCode] = 'resolve';
                    findSubUrlOpen && findFirstSecUrlOpen(tCode + '');
                })
                .fail(function () {
                    leftMenuStatus[tCode] = 'reject';
                });
        }

        // 已经加载并且成功  则直接切换
        if (leftMenuStatus[tCode] === 'resolve') {
            $activeLeftMenu = $('#left-menu-' + tCode);
            $activeLeftMenu
                .removeClass('hidden')
                .siblings('.left-menu-wrap')
                .addClass('hidden');

            findSubUrlOpen && findFirstSecUrlOpen(tCode);
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
                TabsNav.addTab(subUrlCache[targetMenu]);
                return false;
            }
        });
    }
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
        creatWebSocket(_userGuid_, _userName_, _tenantName_, function () {
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
    //     $soundIframe,
    //     msgAudio;
    // // 根据浏览器加载不同的声音提醒方案
    // if (Util.browsers.isIE) {
    //     $soundIframe = $('<iframe src="" frameborder="0" class="hidden" id="msgcenter-sound"></iframe>').appendTo($msgSound);
    // } else {
    //     $msgSound.html('<audio id="msgcenter-sound-audio" controls="controls" src="../../msgsound/newsms.wav" class="hidden-accessible"></audio>');
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
        })(),
        initEvent: function () {
            if (RemindTipsCfg.show) {
                $tips
                    .on('click', '.icon, .text', function () {
                        $tips.addClass('hidden');
                    })
                    .on('click', '.close', function (e) {
                        e.stopPropagation();
                        $tips.addClass('hidden');
                    });
            }
        }
    };
    remindTips.initEvent();

    // 获取消息数目
    // 后端为了减轻服务端压力，要求轮询数据从cache中获取
    var getMsgCount = function (inCache) {
        var data = {
            haseXun: win.showEXun,
            needNum: true
        };

        if (inCache) {
            data.inCache = true;
        }
        return _getData_('getMsgCount', data).done(function (data) {
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
        if (data.systemUpdate) {
            mini.showMessageBox({
                title: '系统升级提醒',
                iconCls: '',
                buttons: [],
                message: Util.htmlEscape(data.systemUpdate)
            });
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


    // // 轮训获取消息
    // $(function() {
    //     getMsgCount();
    //     setInterval(getMsgCount, 60000);
    // });
    // 界面信息获取完成后 开始获取消息数目 避免标题记录不对
    _graceEvent_.on('afterPageInfo', function () {
        getMsgCount();

        if (!win.useWebsocket) {
            setInterval(function () {
                getMsgCount(true);
            }, 60000);
        }

        if (win.showEXun) {
            initEmsg();
        } else {
            $eMsgIcon.addClass('hidden');
        }
    });

    // 使用websocket更新消息数目，则需要在websocket建立后绑定messagecount事件
    if (win.useWebsocket) {
        _graceEvent_.on('websocketCreated', function () {
            eWebSocket.socketEvent.on('messagecount', function (e) {
                updateMsgCount(e.data);
            });
        });
    }

    // 将刷新消息数目的方法开放出来，以备外部处理完代办后可以刷新主界面中的消息数目
    win.getMessageCount = getMsgCount;

    // 消息列表
    // var messageList;

    // function initMessageList() {
    //     /* global MessageList */
    //     messageList = new MessageList({
    //         container: $msgRemindContent,
    //         getUrl: epoint.dealRestfulUrl(getDataUrl + '/getMsgData'),
    //         ignoreUrl: epoint.dealRestfulUrl(getDataUrl + '/ignoreRemind'),
    //         afterOpenMsg: function () {
    //             hidePanel();
    //         },
    //         afterIgnore: function () {
    //             // 目前忽略消息后不会返回数据 需要重新拉去消息。 内容的拉取在内部显示了，此处 还需要更新数值，因此手动拉去消息数目
    //             getMsgCount();
    //         }
    //     });
    // }
    // if (!win.MessageList) {
    //     Util.loadJs('frame/fui/js/widgets/messagelist/messagelist.js', function () {
    //         initMessageList();
    //     });
    // } else {
    //     initMessageList();
    // }

    // eXun 列表
    // 减少
    var decreaseEmsgCount = function (sessionid) {
        var cnt = $eMsgNum.text();
        Util.ajax({
            url: EmsgConfig.countUrl,
            data: {
                sessionid: sessionid
            }
        }).done(function (data) {
            if (cnt && data) {
                cnt = parseInt(cnt, 10) - parseInt(data, 10);
            }
            if (cnt < 0) {
                cnt = 0;
            }
            if (cnt == 0) {
                cnt = '';
                $eMsgNum.data('num', 0).addClass('hidden');
            }
            $eMsgNum.text(cnt);
        });
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
            onDecEmsgCount: function (sessionid) {
                decreaseEmsgCount(sessionid);
            }
        });

        win.RefreshEMsg = $.proxy(emsgList.getData, emsgList);
    }

    var initEmsg = function () {
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
                    $content = $msgEMsgRecent;

                if (!$this.hasClass('active')) {
                    $this
                        .addClass('active')
                        .siblings()
                        .removeClass('active');

                    if (ref) {
                        $content = $('#' + ref, $msgEMsgContent);

                        setTimeout(function () {
                            OnlineUserSettings.onRefreshData(function (count) {
                                $onlineUserNum.html(count);
                            });
                        }, 500);
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
        hide: function () {
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
            $el.addClass('active')
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
                            onlineUserIframe.attachEvent('onload', function () {
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
    var $header = $('.header-container');
    var $topSearch = $('#top-search').addClass('invisible');

    function doSearch(type, kw) {
        type = type || 'all';
        try {
            TabsNav.removeTab('fullsearch');
        } catch (error) {}
        TabsNav.addTab({
            id: 'fullsearch',
            name: '全文检索',
            url: win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type=' + type
        });
    }

    var isCateDataLoaded = false;
    var cateData = [{
        id: 'all',
        name: '全文检索',
        iconCls: 'modicon-25'
    }];
    function getCateData() {
        return Util.ajax({
            url: win.fullSearchCateUrl
        }).done(function (data) {
            var categories = data.categories || [];

            if (typeof categories == 'string') {
                categories = JSON.parse(categories);
            }

            var cates = [];
            $.each(categories, function (i, item) {
                cates.push({
                    id: item.guid,
                    name: item.name,
                    iconCls: item.icon || 'view'
                });
            });
            if (cates.length) {
                cateData = cates;

                cs && cs.setOpt('category', cateData);
            }
            isCateDataLoaded = true;
        });
    }
    var cs;
    function initTopFullSearch() {
        // 初始化组件
        /* global ClassifySearch */
        // 禁止组件内部加载样式文件
        ClassifySearch._styleLoaded = true;
        // 创建遮罩
        ClassifySearch._$pageCover = createMainContentCover();
        cs = new ClassifySearch({
            id: 'header-search', // 绑定的容器id
            searchTarget: '内容', // 搜索目标
            category:cateData,
            placeholder: '请输入', // 输入框placeholder内容
            maxShowCharacter: 5, // 下拉区域显示的最大关键字字符数
            enter: function (id, key) {
                // 回车，回车不会执行keyup
                // console.log('回车事件返回 id:' + id + 'key:' + key);
                doSearch(id, key);
            },
            focus: function() {
                if(!isCateDataLoaded){
                    getCateData();
                }
            }
        });
        setTimeout(function () {
            $topSearch.removeClass('invisible');
        }, 200);
    }

    // getCateData();
    // 获取到全文检索地址后再进行初始化
    _graceEvent_.on('afterPageInfo', function () {
        if (win._fullSearchUrl_) {
            // getCateData();
            initTopFullSearch();
            $header.addClass('has-search');
        } else {
            $header.removeClass('has-search');
        }
        _graceEvent_.fire('headerSearchLoad');
    });
})(this, jQuery);

// 顶部菜单 的拖拽排序处理
(function (win, $) {
    // 配置是否启用排序
    // win.EpFrameSysParams = win.EpFrameSysParams || {};
    // EpFrameSysParams['enableCustomSort'] = 1;
    if (Util.getFrameSysParam('enableCustomSort') != true) {
        return;
    }

    var $sortCover = createMainContentCover();
    var $topMenu = $('#top-menu'),
        $list = $topMenu.find('.top-menu-list');
    $list.sortable({
        // opacity: 0.8,
        revert: 200,
        delay: 300,
        distance: 30,
        forcePlaceholderSize: true,
        containment: 'parent',
        // tolerance: 'pointer',
        update: function () {
            dealSave();
        },
        stop: function () {
            dealSave();
        },
        sort: function () {
            clearTimeout(timer);
        },
        start: function () {
            clearTimeout(timer);
            $sortCover.removeClass('hidden');
            $topMenu.addClass('active in-sort');
        }
    });
    var timer;
    var saveAjax;
    var oldSorts;
    // 菜单加载完成后记录原始顺序
    _graceEvent_.on('topMenuLoad', function () {
        oldSorts = getSort().join('');
    });

    function dealSave() {
        clearTimeout(timer);
        timer = setTimeout(save, 1 * 1000);
    }

    function save() {
        if (saveAjax) {
            try {
                saveAjax.abort();
            } catch (error) {}
        }
        var data = getSort();
        // 不相等时保存
        if (data.join('') !== oldSorts) {
            /* global topMenuSaveUrl */
            saveAjax = Util.ajax({
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
                oldSorts = getSort().join('');
            });
        } else {
            mini.showTips({
                content: '排序未更改',
                state: 'info',
                x: 'center',
                y: 'center',
                timeout: 3000
            });
        }
        $topMenu.removeClass('active in-sort');
        $sortCover.addClass('hidden');
    }

    function getSort() {
        return $list.sortable('toArray', {
            attribute: 'data-id'
        });
    }
})(this, jQuery);