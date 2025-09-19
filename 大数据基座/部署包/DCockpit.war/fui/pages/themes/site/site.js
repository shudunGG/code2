/*
 * @Author: jjj
 * @Date: 2019-06-12 08:24:11
 * @LastEditors: jjj
 * @LastEditTime: 2019-06-12 08:24:11
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
        switch (linkData.openType) {
            case 'tabsnav':
                TabsNav.addTab(linkData);
                break;
            case 'dialog':
                epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
                break;
            case 'blank':
                win.open(Util.getRightUrl(linkData.url), linkData.id);
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

    $('#quit').on('click', function() {
      if(onQuit && typeof onQuit == 'function') {
        onQuit();
      }
    });

    /* global  _graceEvent_ , _getData_ , getDataUrl, createMainContentCover , UserSettins, dealLinkOpen, _ANIMATION_TIME_ */
})(this, jQuery);

// TabsNav 初始化
(function (win, $) {
    if (Object.prototype.toString.call(win.EpTabsNav) === '[object Function]') {
        /* global TabsNav , EpTabsNav*/
        window.TabsNav = new EpTabsNav({
            ifrContainer: '#main-ifr-wrap', //内容父容器
            tabContainer: '#main-tab-wrap', //任务栏容器

            needScrollBtn: false, //是否显示左右滚动按钮
            scrollBtnSite: 'sides', //左右滚动按钮的位置，两侧：'sides',右侧：'right'
            smoothItems: 3, //点击左右滚动按钮，滑动单个tab的宽度的倍数，默认为3

            needQuickNav: true, //是否显示快捷导航

            position: 'bottom', // tab显示的位置，头部：'top'，底部：'bottom'，默认为'bottom'
            tabWidth: 112 // 默认一个tab的宽度，没有固定tab时必须设置
        });
        // 重写遮罩实现
        TabsNav._$pageCover = createMainContentCover();
    } else {
        console.error('The TabsNav is required! , please add the "fui/pages/tabsnav/tabsnav.js" before theme\'s javascript file');
    }
})(this, jQuery);

// 背景切换
(function (win, $) {
    var $bgImg = $('#theme-bg-img');
    // 设置背景图片
    var loadBgImg = function (skin) {
        skin = skin || mini.Cookie.get('_site_skin_') || 'default';
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

// userinfo
(function (win, $) {
    var $logo = $('#sys-logo-img'),
        $userInfo = $('#user-info'),
        $userPortrait = $('.user-portrait', $userInfo);
    var $cover = createMainContentCover();
    /* $userInfo
        // 用户头像点击
        .on('click', '.user-info-summary', function () {
            if (!$userInfo.hasClass('active')) {
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
            }
            // 注销
            else if ($this.hasClass('logout')) {
                mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
                    if (action == 'ok') {
                        eWebSocket && eWebSocket.close();
                        UserSettins.logout();
                    }
                });
            }
            // 兼职切换
            else if ($this.hasClass('role-change')) {
                UserSettins.changeRole(_userGuid_);
            }
            // 其他扩展
            else {
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
    });*/
    var moduleCode = Util.getUrlParams('moduleCode');
    // 获取用户信息
    _getData_('getUserInfo',{"moduleCode":moduleCode}).done(function (data) {
        // 用户guid和name是E讯必须要使用的 需要记录下来
        /* global _userName_, _userGuid_ */
        win._userName_ = data.name;
        win._userGuid_ = data.guid;

        // 使用websocket来更新消息数目，需要先建立连接
        // if (useWebsocket) {
        //     creatWebSocket(_userGuid_, _userName_);
        // }
        // if (data.portrait) {
        //     // 头像
        //     var url = Util.getRightUrl(epoint.dealRestfulUrl(data.portrait));
        //     $userPortrait.attr('src', url);
        // }
        // logo
        if (data.logo) {
            // $logo.attr('src', Util.getRightUrl(epoint.dealRestfulUrl(data.logo)));
            // dataurl 模式无须拼接
            if(/^data:/.test(data.logo)) {
                $logo.attr('src', data.logo);
            } else {
                $logo.attr('src', Util.getRightUrl(data.logo));
            }
        }
        
        // 首页名称
        if(data.moduleName){
        	$(".sys-logo-wrap").html("张家港市警务大数据--"+data.moduleName);
        }

        // 兼职
        // if (data.hasParttime) {
        //     $userInfo.find('.user-action-item.role-change').removeClass('hidden');
        // }

        // var $userInfoDetail = $('#user-info-detail');
        // $userInfoDetail
        //     .find('.user-name')
        //     .text(data.name)
        //     .attr('title', data.name);
        // $userInfoDetail
        //     .find('.user-dept')
        //     .text(data.ouName)
        //     .attr('title', data.ouName);

        if (data.title) {
            document.title = data.title;
            win.systemTitle = data.title;
        }
        // fullSearchUrl
        // if (data.fullSearchUrl) {
        //     win._fullSearchUrl_ = data.fullSearchUrl;
        // }

        var home = {
            closeIcon: false,
            refresh: true
        };
        // 默认展示后端配置的 或者 第一个openType为tabnav的
        $.each(data.homes, function (i, cate) {
            var finded = false;

            if (cate.items) {
                $.each(cate.items, function (j, item) {
                    if (data.defaultHome) {
                        // server set
                        if (item.code == data.defaultHome) {
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
            }
            if (finded) {
                return false;
            }
        });
        // 初始化门户
        // initPortal(data.homes, home);

        TabsNav.addTab(home);

        // 触发 afterPageInfo 事件
        _graceEvent_.fire('afterPageInfo');
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
    var EXT_TAB_TPL = '<li class="user-action-item" title="{{name}}" url="{{url}}" data-opentype="{{openType}}" ><span class="{{icon}}"></span>{{name}}</li>';
    // 扩展tab加载f
    /*_getData_('getExtTabsInfo').done(function (data) {
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
    });*/
})(this, jQuery);

// left-menu 
(function (win, $) {
    var leftMenuStatus = {};

    var $main = $('#main'),
        $leftMenu = $('#left-menu'),
        $leftMenuTrigger = $('.left-nav-trigger', $leftMenu),
        $leftMenuContainer = $('.left-nav-container', $leftMenu);

    var $activeLeftMenu;

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
    var LEFT_MENU_ITEM_TPL = '<li class="left-menu-item {{level}}"><a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" data-hasSub="{{hasSub}}" class="left-menu-link"style="padding-left: {{indent}}px;">{{#isTop}}<i class="left-menu-icon {{icon}} "></i>{{/isTop}}<span class="left-menu-name">{{name}}</span>{{#hasSub}}<i class="left-menu-trigger"></i>{{/hasSub}}</a>{{#hasSub}}{{#isTop}}<div class="left-menu-sub"><div class="left-menu-sub-inner"><div class="left-menu-sub-header"><span class="left-menu-sub-title">{{name}}</span></div>{{/isTop}}<ul class="left-menu-sub-list" style="display:none;"> {{{subMenu}}}</ul>{{#isTop}}</div></div>{{/isTop}}{{/hasSub}}</li>';
    var LEFT_MENU_TPL = '<div class="left-menu-wrap" id="left-menu-{{code}}"><ul class="left-menu-list">{{{leftMenuItems}}}</ul></div>';

    function initEvent() {
        // 记录当前左侧菜单的状态
        function saveLeftMenuState(v) {
            localStorage.setItem('_site_leftmenu_state_', v);
        }

        function getLeftMenuState() {
            return localStorage.getItem('_site_leftmenu_state_') || 'normal';
        }
        var leftMenuState = getLeftMenuState();

        // if(leftMenuState == 'normal') {
        //     $main.removeClass('left-narrow');
        // }else {
        //     $main.addClass('left-narrow');
        // }
        $main[leftMenuState == 'normal' ? 'removeClass' : 'addClass']('left-narrow');

        var isIE89 = Util.browsers.isIE8 || Util.browsers.isIE9;
        var $cover = createMainContentCover();


        $('.left-nav-trigger').on('click', function () {
            if ($main.hasClass('left-narrow')) {
                saveLeftMenuState(leftMenuState = 'normal');
                $main.removeClass('left-narrow');
                $cover.addClass('hidden');
            } else {
                saveLeftMenuState(leftMenuState = 'narrow');
                $main.addClass('left-narrow');
                // 如果有展开的菜单 则显示遮罩
                if ($activeLeftMenu) {
                    var $openedMenu = $activeLeftMenu.find('.left-menu-item.level-1.opened');
                    if ($openedMenu.length) {
                        $cover.removeClass('hidden');
                    } else {
                        // 触发一个自定义事件
                        // 隐藏掉窄状态下 的二级过渡效果
                        // cause ：无展开的二级菜单时 收起时候回子级闪现的问题 
                        $leftMenu.trigger('hide-trans');
                    }
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
                    var $sub = isTop ? $this.next().find('.left-menu-sub-list:eq(0)') : $this.next();

                    if (!$item.hasClass('opened')) {
                        $item.addClass('opened');
                        // 遮罩
                        isTop && isNarrow && $cover.removeClass('hidden');

                        // 展开当前 收起其他
                        $sub.stop(true).slideDown(_ANIMATION_TIME_.slide);
                        $item.siblings('.opened').removeClass('opened').find('.left-menu-sub-list:eq(0)').stop(true).slideUp(_ANIMATION_TIME_.slide);

                    } else {
                        $item.removeClass('opened');
                        $sub.stop(true).slideUp(_ANIMATION_TIME_.slide);

                        // 遮罩
                        isTop && isNarrow && $cover.addClass('hidden');
                    }
                }
                // 处理链接
                else if (linkData.url) {
                    dealLinkOpen(linkData);
                    // 打开具体链接后收起
                    // if (isNarrow && !isTop) {
                    if (isNarrow) {
                        $activeLeftMenu.find('.left-menu-item.level-1.opened').removeClass('opened')
                            .find('.left-menu-sub-list:eq(0)').slideUp(_ANIMATION_TIME_.slide);
                        $cover.addClass('hidden');
                        $leftMenu.removeClass('has-opened');
                    }
                }
                if (isTop && isNarrow) {
                    // 如果有展开的菜单 则更新状态 
                    // 用于窄状态下 已经展开一个菜单 切换展示其他菜单时会有一个收起一个出现的情况 用于去掉此现象
                    $leftMenu[($activeLeftMenu.find('.left-menu-item.level-1.opened').length) ? 'addClass' : 'removeClass']('has-opened');
                }
            });
        $('body').on('click', function (e) {
            if (!$(e.target).closest('#left-menu').length) {
                $cover.addClass('hidden');
                // 窄状态下 空白点击收起菜单 
                if (leftMenuState === 'narrow' && $activeLeftMenu) {
                    $activeLeftMenu.find('.left-menu-item.level-1.opened').removeClass('opened')
                        .find('.left-menu-sub-list:eq(0)').slideUp();
                }
            }
        });
    }
    initEvent();

    function getRowKey(rowkey, i) {
        return rowkey === undefined ? i + '' : rowkey + '-' + i;
    }
    // 缩进值
    var INDENT_INIT = 36,
        INDENT_STEP = 13;

    // 获取节点缩进值
    function getIndent(rowkey, len) {
        //分割成数组判断长度
        len = len || rowkey.split('-').length;

        return INDENT_INIT + (len - 1) * INDENT_STEP;
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
            // ie8 补充高度 是的滚动条正常出现
            if (Util.browsers.isIE8) {
                $activeLeftMenu.find('.left-menu-list').height($leftMenu.height() - $leftMenuTrigger.height() || 36);
            }
        }
    }

    function getLefMenu(tMenu, findSubUrlOpen) {
        var tCode = tMenu.code;
        // 未请求 或请求失败
        if (!leftMenuStatus[tCode] || leftMenuStatus[tCode] === 'reject') {
            return _getData_('getMenu', {
                query: 'all'
            }).done(function (data) {
                ininView(data, tMenu);
                leftMenuStatus[tCode] = 'resolve';
                findSubUrlOpen && findFirstSecUrlOpen(tCode + '');
            }).fail(function () {
                leftMenuStatus[tCode] = 'reject';
            });
        }

        // 已经加载并且成功  则直接切换
        if (leftMenuStatus[tCode] === 'resolve') {
            $activeLeftMenu = $('#left-menu-' + tCode);
            $activeLeftMenu.removeClass('hidden')
                .siblings('.left-menu-wrap').addClass('hidden');

            findSubUrlOpen && findFirstSecUrlOpen(tCode);
            return;
        }
    }
    /* global getLefMenu */
    win.getLefMenu = getLefMenu;

    getLefMenu({
      code: "home",
      name: "首页"
    })

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
        $targetMenu.find('.left-menu-item-link').each(function (i, item) {
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

}(this, jQuery));
