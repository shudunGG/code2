// jshint -W030

// 一级菜单
var FIRST_MENU_TPL = '<ul class="first-menu l clearfix" id="firstmenu">{{#items}}<li class="item-first l {{#selected}}select{{/selected}}" data-id="{{code}}" data-url="{{url}}" data-openType="{{openType}}" data-hassub="{{hasSub}}">{{name}}</li>{{/items}}</ul> <a href="javascript:void(0)" class="menu-down {{#hideTrigger}}hidden{{/hideTrigger}} l"></a>',

    // 快捷菜单模板
    QUICK_MENU_TPL = '<li class="quick-menu-item" data-code="{{code}}" data-url="{{url}}" data-opentype="{{openType}}">{{name}}</li>',

    // 左侧菜单模板
    LEFT_MENU_TPL = '<li class="left-menu-item {{#isTop}}top-item{{/isTop}} {{#hasSub}}sub-item{{/hasSub}}"><a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}"  title="{{name}}" data-openType="{{openType}}" class="item-link" style="padding-left: {{indent}}px;">{{#isTop}}<i class="left-menu-icon {{icon}} "></i>{{/isTop}} {{^isTop}}<i class="left-menu-dot"></i>{{/isTop}}<span class="item-link-text">{{name}}</span>{{#hasSub}}<i class="menu-trigger"></i>{{/hasSub}}</a>{{#hasSub}}<div class="slide-second-menu"><span class="slide-second-span">{{name}}</span></div><ul class="left-menu-sub"> {{{subMenu}}}</ul>{{/hasSub}} </li>',

    // 菜单搜索列表模板
    SEARCH_MENU_TPL = '<li class="menu-search-item" data-code="{{code}}" data-url="{{url}}" data-opentype="{{openType}}">{{{name}}}</li>',

    // 底部tab
    BOTTOM_TAB_ITEM = '<li class="tabs-nav-item" id="tab-{{id}}" data-id="tab-{{uid}}" data-target="tab-content-{{id}}"><span class="tabs-nav-name" title="{{name}}">{{name}}</span> {{#refresh}}<span class="tabs-nav-item-refresh"></span>{{/refresh}} {{#closeIcon}}<i class="tabs-nav-item-close"></i>{{/closeIcon}}</li>',

    // 底部tab项内容页模板
    TAB_NAV_CONTENT_TPL = '<iframe class="tab-content hidden" id="tab-content-{{id}}" src="{{url}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>',

    // 底部tab列表模板
    TAB_SLIDE_TPL = '<li class="slide-list-item" id="tab-{{id}}" data-id="tab-{{uid}}">{{name}}</li>',

    // 底部tab ContextMenu模板(右键)
    CONTEXT_MENU_TPL = '<div class="context-menu hidden" id="{{id}}"><ul>{{#items}}{{#text}}<li><a class="menu-item" role="{{role}}" href="javascript:void(0);"><span class="item-txt">{{text}}</span></a></li>{{/text}}{{^text}}<li class="sep"></li>{{/text}}{{/items}}</ul></div>',

    // 皮肤模板
    SKIN_TPL = '<div class="skin-choose  {{#selected}}{{selected}}{{/selected}}" data-name="{{name}}" style="background-color:{{color}}" title="{{name}}"><i class="choose-skin"></i></div>';

// 顶部菜单容器
var $topMenu = $("#top-menu"),

    $quickMenu = $('#quick-menu'),

    $leftContainer = $("#left-menu"),

    // 页面遮罩 
    $pageCover = $('#page-cover'),

    // 右侧消息
    $msgPanel = $('#msg-panel'),

    $dropBox = $('#bottom-drop'),
    $dropPanel = $('#bottom-slide-box'),

    $userInfo = $("#top-user"),

    $bgImg = $("#bg-img");

// 自定义事件 用于一些逻辑控制
var _graceEvent_ = new Util.UserEvent();

// 使用通用接口获取数据的方法
var _getData_ = function (method, pramas) {
    return Util.ajax({
        url: epoint.dealRestfulUrl(getDataUrl + '/' + method),
        data: $.extend({
            pageId: Util.getUrlParams('pageId') || 'grace'
        }, pramas)
    });
};

// 加载niceSrooll
var _getNiceSroll_xhr,
    _getNiceSroll_cbs = [];
var _getNiceSroll_ = function (cb) {
    if ($.fn.niceScroll) {
        cb();
    } else if (_getNiceSroll_xhr) {
        // 请求已发送但未返回成功，就不需要再重复发请求了
        // 把回调记住，等请求成功后遍历执行回调
        _getNiceSroll_cbs.push(cb);
    } else {
        _getNiceSroll_xhr = $.ajax({
            url: '../../../js/widgets/jquery.nicescroll.min.js',
            dataType: 'script'
        }).done(function () {
            for (var i = 0, l = _getNiceSroll_cbs.length; i < l; i++) {
                _getNiceSroll_cbs[i]();
            }
            _getNiceSroll_cbs = [];
        });
        _getNiceSroll_cbs.push(cb);
    }
};

// 设置背景图片
var loadBgImg = function () {
    var skin = mini.Cookie.get('_grace_skin_') || 'default';
    var src = './skins/' + skin + '/images/bg.png';
    var image = new Image();
    image.src = src;
    image.onload = function () {
        $bgImg[0].src = src;
    };
};

$(loadBgImg);

// 用户信息 和 界面信息
(function (win, $) {
    var $logo = $("#logo-img"),

        $headImg = $("#head-img"),
        $dropHeadImg = $('#drop-head-img');

    // 隐藏用户下拉面板
    var hideUserPanel = function () {
        $userInfo.removeClass("showPanel");
        $pageCover.addClass("hidden");
    };

    $userInfo
        // 用户头像点击
        .on("click", ".head-img", function () {
            if (!$userInfo.hasClass("showPanel")) {
                $userInfo.addClass("showPanel");
                $pageCover.removeClass("hidden");
            } else {
                hideUserPanel();
            }
        })
        // 个人资料、界面配置、功能配置
        .on('click', '.setting-item', function () {
            var target = $(this).data('target');
            TabsNav.addTab(userTabData[target]);
            hideUserPanel();
        })
        // 用户注销
        .on("click", '.loginout', function () {
            mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
                if (action == 'ok') {
                    eMsgSocket && eMsgSocket.close();
                    UserSettins.logout();
                }
            });
            hideUserPanel();
        })
        // 兼职切换
        .on("click", ".role-change", function () {
            hideUserPanel();
            // 兼职切换函数
            UserSettins.changeRole(_userGuid_);
        });

    // 三个按钮
    var userTabData = {
        'personal': {
            name: '个人资料',
            url: UserSettins.datum,
            id: 'personal-datum'
        },
        'page': {
            name: '界面配置',
            url: UserSettins.interfaceUrl,
            id: 'personal-interface'
        },
        'function': {
            name: '功能配置',
            url: UserSettins.functionUrl,
            id: 'personal-function'
        }
    };

    var loadImg = function (url, el) {

        var img = new Image();

        img.onload = function () {
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
        if (data.portrait) {
            // 头像
            url = Util.getRightUrl(epoint.dealRestfulUrl(data.portrait));
            $headImg.attr("src", url);
            $dropHeadImg.attr("src", url);
        }

        // 兼职
        if (data.hasParttime) {
            $userInfo.find('.cancel-out').addClass("hasRoles");
        }

        var $usertxt = $(".user-txt");
        $usertxt.find(".username").text(data.name);
        $usertxt.find(".departname").text(data.ouName);

    });

    // 界面信息
    _getData_('getPageInfo').done(function (data) {
        var $fullSearch = $('#top-full-search');
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
        var actualHomes = [],
            hasActiveHome = false;
        // 1 defaultUrl
        if (data.defaultUrl) {
            actualHomes.push({
                id: 'home-default',
                name: '我的桌面',
                url: data.defaultUrl,
                active: true
            });
            hasActiveHome = true;
        }
        $.each(data.homes, function (i, item) {
            actualHomes.push(item);
            // 2 无defaultUrl 有 defaultHome
            if (!hasActiveHome && data.defaultHome == item.id) {
                hasActiveHome = true;
                item.active = true;
            }
        });
        // 遍历完成 在homes中没有 则提醒
        if (!hasActiveHome && data.defaultHome) {
            epoint.alert('门户地址配置不正确',null,null,'error');
        }

        // 3 无defaultUrl 无 defaultHome
        if (!hasActiveHome && data.homes && data.homes.length) {
            data.homes[0].active = true;
        }

        // 加载homes
        // homes
        $.each(actualHomes, function (i, item) {
            TabsNav.addTab({
                id: item.id || ("home-" + i),
                url: item.url,
                name: item.name,
                closeIcon: false,
                refresh: true
            }, !item.active);
        });

        // fullSearc
        if (data.fullSearchUrl) {
            $fullSearch[0].action = Util.getRightUrl(data.fullSearchUrl);
        } else {
            $fullSearch.addClass('hidden');
        }
        // 触发 afterPageInfo 事件
        _graceEvent_.fire('afterPageInfo');
    });

}(this, jQuery));


// 顶部菜单
(function (win, $) {

    // 菜单项目事件
    $topMenu.on("click", ".item-first", function () {
            var $this = $(this),
                guid = $this.data("id"),
                url = $this.data("url"),
                hasSub = $this.data('hassub'),
                name = $this.text(),
                opentype = $this.data("opentype");

            $this.addClass("select").siblings().removeClass("select");

            if (url) {
                if (opentype === 'tabsnav') {
                    TabsNav.addTab({
                        id: guid,
                        name: name,
                        url: url
                    });
                } else {
                    win.open(Util.getRightUrl(url), guid);
                    // 新窗口打开 则不必保留顶级菜单的激活状态
                    // 因为 切换回来时没有左侧菜单的 无对应关系
                    $this.removeClass("select");
                }
            }
            // 有子菜单则加载子菜单
            if (hasSub) {
                win.getLeftMenu(guid, name);
            } else {
                // 没有则 隐藏左侧 
                win.hideLeftMenu();
            }

            // 点击后收起面板
            if ($topMenu.hasClass("showPanel")) {
                $topMenu.removeClass("showPanel");
                $pageCover.addClass("hidden");
            }
        })
        // 下拉按钮
        .on("click", ".menu-down", function () {
            if (!$topMenu.hasClass("showPanel")) {
                $topMenu.addClass("showPanel");
                $pageCover.removeClass("hidden");
            } else {
                $topMenu.removeClass("showPanel");
                $pageCover.addClass("hidden");
            }
        });
    // 大屏幕时 显示为5个 8 个 10 个
    var $trigger,
        resizeTimer,
        ITEM_WIDTH = 95;

    $(win).on('resize.topMunu', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var l = $topMenu.find('.item-first').length,
                c_width = $topMenu.find('#firstmenu').width();
            if (l * ITEM_WIDTH > c_width) {
                $trigger.removeClass('hidden');
            } else {
                $trigger.addClass('hidden');
            }
        }, 200);
    });
    var getNumBySize = function (size) {
        // ie 8 不支持媒体查询
        if (Util.browsers.isIE8 || Util.browsers.isIE67) {
            setTimeout(_renderStyleInIe8, 20);
        }
        if (size >= 1800) {
            return 13;
        } else if (size >= 1500) {
            return 11;
        } else {
            return 8;
        }
    };
    // 解决ie8下不支持媒体查询的问题
    var _renderStyleInIe8 = function () {
        // IE8不用在resize时调整大小
        $(win).off('resize.topMunu');
        // 初始化时样式
        var size = $(win).width();
        if (size >= 1800) {
            $topMenu
                .css({
                    'width': '1094px',
                    'margin-left': '-497px'
                })
                .find('#firstmenu').css({
                    'width': '1050px'
                });
            return;
        } else if (size >= 1500) {
            $topMenu
                .css({
                    'width': '1004px',
                    'margin-left': '--402px'
                })
                .find('#firstmenu').css({
                    'width': '1060px'
                });
            return;
        } else {
            return;
        }
    };
    // 获取顶级菜单
    _getData_('getMenu', {
        query: 'top'
    }).done(function (data) {

        if (!data || !data.items) return;

        var defaultCode = data.code,
            topMenuName = '',
            hasSub;
        // defaultCode 高亮 没有则取第一个
        if (defaultCode) {
            for (var i = 0, l = data.items.length; i < l; i++) {
                var item = data.items[i];
                if (item.code == defaultCode) {
                    item.selected = true;
                    topMenuName = item.name;
                    hasSub = item.hasSub;
                    break;
                }
            }
        } else {
            data.items[0].selected = true;
            defaultCode = data.items[0].code;
            topMenuName = data.items[0].name;
            hasSub = data.items[0].hasSub;
        }

        // 小于5、8、10个则不显示trigger
        if (data.items.length <= getNumBySize($(win).width())) {
            data.hideTrigger = true;
        }

        var html = Mustache.render(FIRST_MENU_TPL, data);

        $topMenu.html(html);

        // 渲染完成后 记录切换按钮 
        $trigger = $topMenu.find('.menu-down');

        if (hasSub) {
            // 自动加载子菜单
            win.getLeftMenu(defaultCode, topMenuName);

        }

    });

}(this, jQuery));

// 快捷菜单
(function (win, $) {
    var $panel = $('.quick-menu-panel', $quickMenu),
        $list = $('.quick-menu-list', $quickMenu);

    $quickMenu.on('click', '.quick-menu-title', function () {
        if ($quickMenu.hasClass('open')) {
            $quickMenu.removeClass('open');
            $pageCover.addClass("hidden");
        } else {
            $quickMenu.addClass('open');
            $pageCover.removeClass("hidden");
        }
    }).on('click', '.quick-menu-item', function () {
        var $this = $(this),
            url = $this.data('url'),
            code = $this.data('code'),
            name = $this.text(),
            openType = $this.data('opentype');

        if (url) {
            if (openType === 'tabsnav') {
                TabsNav.addTab({
                    url: url,
                    name: name,
                    id: code
                });
            } else {
                win.open(Util.getRightUrl(url), guid);
            }
        }

        hidePanel();
    }).on('click', '.quick-menu-btn', function () {
        var $this = $(this);

        if ($this.hasClass('edit')) {
            TabsNav.addTab({
                id: 'editNav',
                name: '快捷菜单',
                url: QuickNav.editUrl
            });
            hidePanel();
        } else {
            getQuickMenu();
        }
    });

    var render = function (data) {
        if (!data || !data.length) {
            $panel.addClass('empty');
            $list.empty();

            return;
        }

        var html = [];
        for (var i = 0, l = data.length; i < l; i++) {
            html.push(Mustache.render(QUICK_MENU_TPL, data[i]));
        }

        $panel.removeClass('empty');
        $list.html(html.join(''));

    };

    var hidePanel = function () {
        $quickMenu.removeClass("open");
        $pageCover.addClass("hidden");
    };

    var getQuickMenu = function () {
        _getData_('getQuickMenu').done(function (data) {
            render(data);
        });
    };

    getQuickMenu();

    _getNiceSroll_(function () {
        $list.niceScroll({
            cursorcolor: '#2590cc',
            cursorborder: '1px solid #d5dee6',
            cursorwidth: '3px'
        });
    });

}(this, jQuery));

// 左侧菜单
(function (win, $) {
    // 记录左侧菜单是否加载
    win.leftMenuStatus = {};

    var $leftWrap = $leftContainer.find('.left-menu-wrap'),
        $topMenuName = $leftContainer.find(".name-txt");

    // 缩进值
    var INDENT_INIT = 35,
        INDENT_STEP = 10,

        // 记录是否已经加载
        leftMenuStatus = {};

    // 是否为展开状态
    win._leftIsWide = false;

    // 获取节点缩进值
    var getIndent = function (rowkey) {
        //分割成数组判断长度
        var len = rowkey.split('-').length;


        return INDENT_INIT + (len - 1) * INDENT_STEP;

    };
    // 宽窄切换
    $leftContainer.on("click", ".icon-triggle", function () {
        if ($leftContainer.hasClass('wide')) {
            $leftContainer.find('.top-item').removeClass('open');
            $leftContainer.removeClass('wide');
            $.cookie('_leftStatus_', 'narrow', {
                expires: 30
            });
            $pageCover.addClass('hidden');
            _leftIsWide = false;
        } else {
            $leftContainer.addClass('wide');

            $.cookie('_leftStatus_', 'wide', {
                expires: 30
            });
            _leftIsWide = true;
        }
        // css 动画存在 需要迟延后调整
        setTimeout(function () {
            $leftWrap.getNiceScroll(0).resize();
        }, 800);

        // 切换后需要调整底部tab的滚动状态
        TabsNav.adjustSize();
    });
    // 记住上次的菜单状态
    $(function () {
        var status = $.cookie('_leftStatus_') || 'wide';
        if (status == 'wide') {
            $leftContainer.addClass('wide');
            _leftIsWide = true;
        } else {
            $leftContainer.removeClass('wide');
            _leftIsWide = false;
        }
    });
    // 菜单点击事件
    $leftContainer.on("click", ".item-link", function () {
        var $this = $(this),
            $li = $this.parent('.left-menu-item'),
            // $subMenu = $this.siblings('.left-menu-sub'),
            hasSub = !!$this.siblings('.left-menu-sub').length;

        var url = $this.data('url');

        // 切换子菜单显隐藏
        if (hasSub) {
            if ($li.hasClass('open')) {
                $li.removeClass('open');
            } else {
                $li.removeClass('active').addClass('open')
                    .siblings().removeClass('active').removeClass('open');
            }

            // 窄状态顶级时候需要遮罩
            if (!_leftIsWide && $li.hasClass('top-item')) {
                if ($li.hasClass('open') || $li.siblings().hasClass('open')) {
                    $pageCover.removeClass('hidden');
                } else {
                    $pageCover.addClass('hidden');
                }
            }
        } // 存在url 则新打开url
        else if (url) {
            var openType = $this.data('opentype'),
                name = $this.attr('title');
            if (openType == 'blank') {
                win.open(Util.getRightUrl(url), name);
            } else {
                TabsNav.addTab({
                    id: $this.data('id'),
                    name: name,
                    url: url
                });
            }
            // 窄状态并且点击的不是顶层节点 点击后需要将菜单收起 并取消遮罩
            if (!_leftIsWide && !$li.hasClass('top-item')) {
                $li.closest('.top-item').removeClass('open').addClass('active');
                $pageCover.addClass('hidden');
            }
        }



    });


    // 获得节点行标识
    var getRowkey = function (rowkey, i) {
        return (rowkey === undefined) ? (i + '') : (rowkey + '-' + i);
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
            if (rowkeyLength === 1) {
                view.isTop = true;
                view.indent = 13;
            } else {
                view.isTop = false;
                view.indent = getIndent(view.rowkey);
            }

            // 构建结构
            // 有子菜单则递归
            if (view.hasSub) {
                html.push(Mustache.render(LEFT_MENU_TPL, $.extend(view, {
                    subMenu: buildLeftMenu(item.items, view.rowkey)
                })));
            } else {
                html.push(Mustache.render(LEFT_MENU_TPL, view));
            }
        });

        return html.join('');
    };

    /**
     * 根据数据渲染菜单
     * @param {Array} data [菜单数据]
     * @param {String} id [顶级菜单id]
     */
    var initLefeMenu = function (data, id) {
        var html = '';
        if (data && data.length) {

            html = buildLeftMenu(data);
            // 创建菜单外层ul
            var $leftMenuList = $('<ul id="left-menu-' + id + '" class="left-menu-list"></ul>');
            // 给此ul添加数据 并放到页面 隐藏兄弟元素
            $leftMenuList
                .append(Util.clearHtml(html))
                .appendTo($leftWrap)
                .siblings('.left-menu-list').addClass('hidden');
        }
    };

    /**
     * 切换左侧菜单
     * @param {String} code [顶级菜单id ]
     * @param {String} name [顶级菜单name ]
     */
    var getLeftMenu = function (code, name) {
        $leftContainer.removeClass('noleft');
        $topMenuName.text(name);
        if (!leftMenuStatus[code]) {
            // 未加载则加载数据
            leftMenuStatus[code] = 'waiting';

            _getData_('getMenu', {
                query: 'sub',
                code: code
            }).done(function (data) {
                leftMenuStatus[code] = true;
                initLefeMenu(data, code);
            }).fail(function () {
                leftMenuStatus[code] = false;
            });
        } else {
            // 否则直接切换显示
            $leftContainer.find('#left-menu-' + code).removeClass('hidden')
                .siblings('.left-menu-list').addClass('hidden');
        }
    };
    // 开放此方法 用以顶部菜单加载时自动加载对应子菜单
    win.getLeftMenu = getLeftMenu;

    // 用于无左侧菜单时隐藏左侧菜单。
    win.hideLeftMenu = function () {
        $leftContainer.addClass('noleft');
    };
    _getNiceSroll_(function () {
        $leftWrap.niceScroll({
            cursorcolor: '#2590cc',
            cursorborder: '1px solid #d5dee6',
            cursorwidth: '3px'
        });
    });

}(this, jQuery));

// 消息提醒 和右侧消息
(function (win, $) {

    var SOUND_URL = '../../msgsound/sound.html',
        ROLLER_TEXT = '您有新消息提醒，请点击查看！',
        rollerTip = ROLLER_TEXT,
        timer = 0,
        title = "",
        // $search = $(".search"),
        M = Mustache;

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

    var parseNum = function (num) {
        var n = parseInt(num);

        if (n > 99) {
            return '99+';
        } else if (n <= 0) {
            return '';
        }

        return n + '';
    };


    // 在线右侧消息
    var $rightMessage = $('#top-right-content'),
        $iconList = $('.top-right', $rightMessage),

        $remindNum = $('.remind-num', $iconList),
        $eMsgNum = $('.remind-msg-num', $iconList),

        //e讯的

        $msgRemind = $('#msgRemind', $msgPanel),
        $msgRemindContent = $('.msg-panel-content', $msgRemind);

    var $msgEMsg = $('#msgEMsg', $msgPanel),
        $msgEMsgContent = $('.msg-panel-content', $msgEMsg),
        $msgEMsgRecent = $('.emsg-recent-list', $msgEMsgContent);

    // 获取消息数目
    var getMsgCount = function () {
        var old = 0,
            hasNew = false;

        return _getData_('getMsgCount', {
            haseXun: true,
            needNum: true
        }).done(function (data) {
            if (data.remind) {
                old = parseInt($remindNum.data('num')) || 0;
                if (data.remind > old) {
                    hasNew = true;
                }
                $remindNum.removeClass('hidden').text(parseNum(data.remind));
                $remindNum.data('num', data.remind);
            } else {
                $remindNum.text('').addClass('hidden');
            }
            if (data.eXun) {
                old = parseInt($eMsgNum.data('num')) || 0;
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
                if (Util.browsers.isIE) {
                    $soundIframe[0].src = Util.getRightUrl(SOUND_URL + '?_=' + (+new Date()));
                } else {
                    msgAudio && msgAudio.play();
                }
                // 标题滚动
                docTitle.roll();
            } else {
                // 停止标题滚动
                docTitle.stop();
            }
        });
    };

    // 界面信息获取完成后 开始获取消息数目 避免标题记录不对
    _graceEvent_.on('afterPageInfo', function () {
        getMsgCount();
        setInterval(getMsgCount, 60000);
    });

    // var delHtmlTag = function (str) {
    //     return str.replace(/<[^>]+>/g, "");
    // };

    // 消息列表
    var messageList;

    function initMessageList() {
        messageList = new MessageList({
            container: $msgRemindContent,
            getUrl: epoint.dealRestfulUrl(getDataUrl + '/getMsgData'),
            ignoreUrl: epoint.dealRestfulUrl(getDataUrl + '/ignoreRemind'),
            afterOpenMsg: function () {
                hidePanel();
                $pageCover.addClass('hidden');
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
    }

    // eXun 列表
    // 减少
    var decreaseEmsgCount = function () {
        var cnt = $eMsgNum.text();
        if (cnt) {
            cnt = (parseInt(cnt)) - 1;
        }
        if (cnt == 0) {
            cnt = "";
            $eMsgNum.data('num', 0).addClass('hidden');
        }
        $eMsgNum.text(cnt);
    };
    var emsgList;

    function initEMsgList() {
        emsgList = new EMsgList({
            content: $msgEMsgRecent,
            getUrl: EmsgConfig.baseUrl,
            ignoreUrl: EmsgConfig.baseUrl,
            userImg: EmsgConfig.userImg,
            groupImg: EmsgConfig.groupImg,
            afterOpenEMsg: function () {
                // 隐藏面板并取消遮罩
                hidePanel();
                $pageCover.addClass('hidden');
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


    // 隐藏消息面板
    win.hidePanel = function () {
        $msgPanel.stop(true).animate({
            right: -350
        }, function () {
            $msgPanel.addClass('hidden');
        });

        var $iconActive = $iconList.find('.active').removeClass('active');

        // 当前激活的是菜单搜索面板，则需要重置下面板
        if ($iconActive.hasClass('menu-search')) {
            resetSearchPanel();
        }


    };



    // 顶部图标点击交互
    $iconList.on('click', '.js-panel', function () {

        var $el = $(this),
            ref = $el.data('ref'),
            $panel = $('#' + ref, $msgPanel);

        if ($el.hasClass('active')) {

            hidePanel();
            $pageCover.addClass('hidden');

        } else {

            $el.addClass('active')
                .siblings('.active')
                .removeClass('active');

            if (ref == 'msgRemind') {
                messageList.getData();
            } else if (ref == "msgEMsg") {
                emsgList.getData();
            } else if (ref == 'msgSkin') {
                win.initSkinView && win.initSkinView();
            }

            $panel.removeClass('hidden')
                .siblings('.js-detail')
                .addClass('hidden');


            $panel.find('.msg-panel-content').removeClass('hidden');
            // 先取消隐藏 再滑出
            $msgPanel.removeClass('hidden');
            $msgPanel.stop(true).animate({
                right: 0
            });

            $pageCover.removeClass("hidden");
        }
    });

    // 点击隐藏
    $msgPanel.on('click', '.msg-panel-hide', function (e) {
        hidePanel();
        $pageCover.addClass('hidden');
    });

    // 三个右侧面板中添加滚动条
    _getNiceSroll_(function () {
        $([$msgRemindContent, $msgEMsgContent, $('#menuSearch').find(".menu-search-list")]).each(function (i, $item) {
            $item.niceScroll({
                cursorcolor: '#ccc'
            });
        });
    });


})(this, jQuery);

// 菜单搜索
(function (win, $) {
    var $menuSearch = $('#menuSearch'),
        $searchInput = $('.msg-srh-input', $menuSearch),
        $historyContent = $('.menu-search-history', $menuSearch),
        $resultContent = $('.menu-search-result', $menuSearch),
        $historyList = $('.menu-search-list', $historyContent),
        $resultList = $('.menu-search-list', $resultContent);

    var searchMenuTpl = $.trim(SEARCH_MENU_TPL);

    var history = [];
    var _initHistory = function () {
        var _history = localStorage.getItem('menuSearchHistory');

        if (_history) {
            history = JSON.parse(_history);
        }

        renderData(history, $historyList);
    };

    var addHistory = function (item) {
        var l = history.unshift(item),
            code = item.code;

        // 去重
        for (var i = 1; i < l; i++) {
            if (history[i].code === code) {
                history.splice(i, 1);
                break;
            }
        }

        // 保证最多15个
        if (history.length > 15) {
            history.length = 15;
        }

        localStorage.setItem('menuSearchHistory', JSON.stringify(history));

        renderData(history, $historyList);

    };

    var renderData = function (data, $parent, keyword) {
        var html = [],
            i = 0,
            l = data.length,
            name,
            patt;

        if (keyword) {
            patt = new RegExp(keyword, 'g');
        }
        if (l) {
            for (; i < l; i++) {
                if (keyword) {
                    name = data[i].name;

                    name = name.replace(patt, '<span class="keyword">' + keyword + '</span>');

                    data[i].name = name;
                }
                html.push(Mustache.render(searchMenuTpl, data[i]));
            }

            $parent.removeClass('empty').html(html.join(''));
        } else {
            $parent.addClass('empty').empty();
        }
    };

    var okey;
    $menuSearch.on('click', '.menu-search-item', function () {
        var $this = $(this),
            url = $this.data('url'),
            code = $this.data('code'),
            name = $this.text(),
            openType = $this.data('opentype');

        if (url) {
            if (openType === 'tabsnav') {
                TabsNav.addTab({
                    url: url,
                    name: name,
                    id: code
                });
            } else {
                win.open(Util.getRightUrl(url), guid);
            }

            hidePanel();

            addHistory({
                url: url,
                name: name,
                code: code,
                openType: openType
            });

        }
    }).on('keyup', '.msg-srh-input', function (e) {
        var which = e.which,
            val = $searchInput.val();

        if (which === 13) {

            if (val !== okey) {
                okey = val;
                _getData_('searchModule', {
                    key: val
                }).done(function (data) {
                    if (data) {
                        renderData(data, $resultList, val);
                    }

                    $resultContent.removeClass('hidden');
                    $historyContent.addClass('hidden');
                });

            }
        }

        if (!val) {
            $resultContent.addClass('hidden');
            $historyContent.removeClass('hidden');
        }
    });

    // 返回初始状态
    var reset = function () {
        $resultContent.addClass('hidden');
        $historyContent.removeClass('hidden');
        $searchInput.val('');
        okey = '';
    };

    _initHistory();

    win.resetSearchPanel = reset;
})(this, jQuery);

// ContextMenu
(function (win, $) {
    var defaultSetting = {
        id: false,
        items: [{
            text: '',
            role: '',
            icon: '',
            click: Util.noop
        }],
        selector: false
    };

    var M = Mustache,
        ID_SUFFIX = '-contextmenu',
        EXTREA_MARGIN = 5,
        template = $.trim(CONTEXT_MENU_TPL);

    win.ContextMenu = function (cfg) {
        this.cfg = $.extend({}, defaultSetting, cfg);
        this._init();
    };

    ContextMenu.prototype = {
        constructor: ContextMenu,

        _init: function () {
            this.cfg.options = {};

            this._initView();
            this._initEvent();
        },

        _getSize: function () {
            var $widget = this.$widget,
                size = null;

            $widget.addClass('hidden-accessible')
                .removeClass('hidden');

            size = {
                width: $widget.outerWidth(),
                height: $widget.outerHeight()
            };

            $widget.addClass('hidden')
                .removeClass('hidden-accessible');

            return size;
        },

        _initView: function () {
            var c = this.cfg;

            if (!c.id) {
                c.id = Util.uuid(8, 16) + ID_SUFFIX;
            }

            this.$widget = $(Util.clearHtml(M.render(template, c))).appendTo('body');

            this.size = this._getSize();
        },

        _initEvent: function () {
            var c = this.cfg,
                self = this,
                callbacks = {},

                $bindEl;

            $.each(c.items, function (i, item) {
                callbacks[item.role] = item.click;

            });

            this.$widget.on('click', '.menu-item', function (event) {
                event.preventDefault();

                var role = this.getAttribute('role'),
                    callback = callbacks[role],
                    rt;
                if (callback) {
                    rt = $.proxy(callback, self, c.options, event)();
                }

                if (rt !== false) {
                    self.hide();
                }
            });

            $(document).on('click', function (event) {
                var t = event.target;
                if (!$.contains(self.$widget[0], t)) {
                    self.hide();
                }
            });

            // if selector is given, bind contextmenu event
            if (c.selector) {
                $bindEl = $(c.selector);
                $bindEl.length && $bindEl.on('contextmenu', function (event) {
                    var pos = {
                        x: event.pageX,
                        y: event.pageY
                    };

                    self.show(pos);
                    return false;
                });
            }
        },

        hide: function () {

            this.$widget.addClass('hidden');
            return this;
        },

        show: function (pos) {
            this.$widget.css({
                top: pos.x,
                left: pos.y,
                zIndex: Util.getZIndex()
            }).removeClass('hidden');

            return this;
        },

        setOptions: function (prop, val) {
            this.cfg.options[prop] = val;
            return this;
        }
    };

}(this, jQuery));
// tabsNav
(function (win, $) {

    // tabs导航容器
    var $allTabList = $('#all-tabs-list'),
        $tabListWrap = $('#tabs-list'),
        $tabList = $tabListWrap.find('.bottom-tab-line'),

        $tabFixList = $('#tabs-fixed-list');

    // ifr容器
    var $ifrContainer = $('#maincontent');

    // 下拉
    var $dropList = $dropPanel.find('.slide-list');

    var tabTmpl = $.trim(BOTTOM_TAB_ITEM),
        conTpl = $.trim(TAB_NAV_CONTENT_TPL),
        tablistTpl = $.trim(TAB_SLIDE_TPL),
        M = Mustache;


    var defaultTabWidth = 115,
        RIGHT_WIDTH = 40;


    var tabsCache = {},
        // 固定项目的id集合 使用对象能更高效查找 键名为id 值 true false
        fixedTab = {},
        // 最后一个固定的tabid 
        lastFixedTabId = '';

    var tabDefaultSetting = {
        closeIcon: true,
        refresh: false
    };

    // 最大可视宽度
    var max_w = $('#footer').width() - RIGHT_WIDTH - $tabFixList.outerWidth(true) - 1;;

    win.TabsNav = {
        _tab_w: 0,
        // 当前激活的tabid
        _activeId: '',

        _getTabWidth: function () {
            if (!this._tab_w) {
                this._tab_w = $tabFixList.children().eq(0).outerWidth(true) || defaultTabWidth;
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

                // tab模板要渲染到两个地方 id不能相同 uid用以标识其二者相同的id
                data.uid = data.id;

                var tabHtml = Util.clearHtml(M.render(tabTmpl, data));

                // 可关闭，则为非固定tab                
                if (data.closeIcon) {
                    // 插入到底部和右侧           
                    $(tabHtml).appendTo($tabList);
                    // id不能一致 需要处理一下
                    var dropData = $.extend({}, data);
                    dropData.id += '-drop';
                    $(Util.clearHtml(M.render(tablistTpl, dropData))).appendTo($dropList);
                    dropData = null;
                } else {
                    $(tabHtml).appendTo($tabFixList);
                    // 记录此固定项目id
                    fixedTab[tabId] = true;
                    lastFixedTabId = tabId;
                }

                $tabContent = $(Util.clearHtml(M.render(conTpl, data))).appendTo($ifrContainer);

                tabsCache[tabId] = data;

                if (withoutActive) {
                    tabsCache[tabId].notInit = true;
                }

                this.adjustSize();
            }

            if (!withoutActive) {
                this.activeTab(tabId);
            }
        },

        getActiveTab: function () {
            // var $li = $allTabs.find('li.active'),
            var $li = $allTabs.find('#' + this._activeId),
                data = tabsCache[$li[0].id];

            return new Tab(data);
        },

        activeTab: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id， 文档以更新 此处兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var $tab = $('#' + id);
            if ($tab.length) {
                var $tabCon = $('#' + $tab.data('target')),
                    data = tabsCache[id];

                // 非固定项目需要确保可见
                if (!fixedTab[id]) {
                    this.adjustTabPosOnActive(id);
                }

                if ($tab.hasClass('active')) {
                    return;
                }

                $allTabList.find('li.active').removeClass('active');
                $tab.addClass('active');

                this._activeId = id;

                // // 关联右侧激活状态
                // var $dropTab = $dropList.find('#' + id + '-drop');
                // // 非固定则同步激活 否则移除右侧激活状态
                // if ($dropTab.length) {
                //     $dropTab.addClass('active')
                //         .siblings().removeClass('active');
                // } else {
                //     $dropList.find('li').removeClass('active');
                // }

                if (data.notInit) {
                    $tabCon[0].src = data.realUrl;
                    data.notInit = false;
                }
                $tabCon.removeClass('hidden')
                    .siblings('.tab-content')
                    .addClass('hidden');
            }

        },

        // make active tab shown
        adjustTabPosOnActive: function (id) {

            // id 应该始终指菜单项目的id，而非tab-id， 文档以更新 此处兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
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

            } else if (prev_w >= (max_w + scroll_w)) {
                marginLeft = prev_w + tab_w - max_w;

            } else if (prev_w > scroll_w && prev_w < (max_w + scroll_w) && (prev_w + tab_w) > (max_w + scroll_w)) {
                marginLeft = prev_w + tab_w - max_w;
            }

            $tabList.stop(true).animate({
                marginLeft: -marginLeft
            }, 500);

        },

        removeTab: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id， 文档以更新 此处兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var $tab = $('#' + id),
                $tabCon = $('#' + $tab.data('target'));

            if ($tab.hasClass('active')) {
                if ($tab.prev().length) {
                    this.activeTab($tab.prev()[0].id);
                } else if ($tab.next().length) {
                    this.activeTab($tab.next()[0].id);
                } else {
                    // 高亮最后一个固定tab
                    // this.activeTab($tabFixList.children('li').last()[0].id);
                    this.activeTab(lastFixedTabId);
                }
            }

            // 移除两处的tab和内容
            $tab.remove();
            $dropList.find('#' + id + '-drop').remove();
            // 清理tab内容页iframe
            Util.clearIframe($tabCon);
            $tabCon.remove();

            delete tabsCache[id];

            this.adjustSize();
        },

        // remove all tabs except fixed tabs
        removeAll: function (id) {

            // id 应该始终指菜单项目的id，而非tab-id， 文档以更新 此处兼容处理
            if (id && id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            $tabList.find('.tabs-nav-item').each(function (i, li) {
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
            // 最大可视宽度 = 底部tab条-右侧-固定
            max_w = $('#footer').width() - RIGHT_WIDTH - $tabFixList.outerWidth(true) - 1;

            var tabs_w = this._getTabWidth() * $tabList.children().length + 1;


            if (tabs_w > 0) {
                $tabList.css('width', tabs_w);
            }

            if (max_w > tabs_w) {
                // $tabList.css({
                //     'margin-left': 0
                // });
                $tabList.stop(true).animate({
                    marginLeft: 0
                }, 500);
                $tabListWrap.css('width', 'auto');
            } else {

                var scrollRange = tabs_w - max_w;

                // $tabList.css({
                //     'margin-left': -scrollRange
                // });
                $tabList.stop(true).animate({
                    marginLeft: -scrollRange
                }, 500);
                $tabListWrap.css('width', max_w);
            }
        },

        refreshTabContent: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id， 文档以更新 此处兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var $tab = $('#' + id),
                $tabCon = $('#' + $tab.data('target'));
            // $tabCon[0].contentWindow.location.reload();
            // 不要直接reload，而是赋值为原地址，可防止页面报错后 刷新仍是错误页面的地址。
            $tabCon[0].src = 'about:blank';
            $tabCon[0].src = Util.getRightUrl(tabsCache[id].realUrl || tabsCache[id].url);
        }
    };
    // Tab模型，内部使用
    var Tab = function (data) {
        this._data = data;
    };

    $.extend(Tab.prototype, {
        remove: function () {
            var tabId = 'tab-' + this._data.id;

            if (fixedTab[tabId]) {
                console && console.warn('警告：固定Tab是不能删除的！');
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
                console && console.warn('已经到头了！');
                return;
            }

            return new Tab(tabsCache[$prev[0].id]);
        },

        next: function () {
            var $li = $('#tab-' + this._data.id),
                $next = $li.next();

            if (!$next.length) {
                console && console.warn('已经到尾了！');
                return;
            }

            return new Tab(tabsCache[$next[0].id]);
        }
    });

    // resize
    var timer;
    $(win).on('resize', function (event) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            TabsNav.adjustSize();
            TabsNav.activeTab(TabsNav._activeId);
        }, 200);
    });

    // 点击激活
    $allTabList
        .on('click', '.tabs-nav-item', function (e) {
            var id = this.id;
            TabsNav.activeTab(id);
        })
        // 点击关闭
        .on('click', '.tabs-nav-item-close', function (e) {

            var id = this.parentNode.getAttribute('data-id');

            TabsNav.removeTab(id);
        })
        // 刷新
        .on('click', '.tabs-nav-item-refresh', function (e) {
            e.stopPropagation();
            var id = this.parentNode.getAttribute('data-id');

            TabsNav.refreshTabContent(id);
        })
        //  右键菜单
        .on('contextmenu', '.tabs-nav-item', function (event) {
            var tabId = this.id;

            // 固定项目不响应
            if (fixedTab[tabId]) return;

            var $this = $(this),
                positionX = $this.offset().top + 68,
                positionY = $this.offset().left + 3;

            contextMenu.setOptions('tabId', tabId).show({
                x: positionX,
                y: positionY
            });

            return false;
        });
    // 下拉面板中点击激活
    $dropPanel.on('click', '.slide-list-item', function (e) {
        var id = this.getAttribute('data-id');
        TabsNav.activeTab(id);
        // 激活显示后需要 隐藏面板 取消遮罩
        switchDrop();
    });
    // // 下拉中的关闭
    // .on('click', '.tabs-nav-item-close', function (e) {
    //     // 需要阻止冒泡 防止触发激活事件
    //     e.stopPropagation();
    //     var id = this.parentNode.getAttribute('data-id');

    //     TabsNav.removeTab(id);

    //     // // 移除之后判断可见性 不可见则需要移除遮罩
    //     // if ($dropBox.hasClass('invisible')) {
    //     //     switchDrop();
    //     // }
    // })
    // drop切换
    $dropBox.on('click', '.drop-btn', function (e) {
        switchDrop();
    });
    // 切换下拉
    var switchDrop = function () {
        if ($dropBox.hasClass('showPanel')) {
            $dropPanel.stop(true).animate({
                bottom: -($dropPanel.height())
            });
            $pageCover.addClass('hidden');
        } else {
            $dropPanel.stop(true).animate({
                bottom: 30
            });
            $pageCover.removeClass('hidden');
        }
        $dropBox.toggleClass('showPanel');
    };
    // 右键菜单
    var contextMenu = new ContextMenu({
        items: [{
            text: '关闭',
            role: 'close-self',
            click: function (options) {
                var id = options.tabId;
                TabsNav.removeTab(id);
            }
        }, {
            icon: 'remove',
            text: '关闭其他页',
            role: 'close-others',
            click: function (options) {
                var id = options.tabId;
                TabsNav.removeAll(id);
            }
        }, {
            icon: 'remove',
            text: '关闭全部',
            role: 'close-all',
            click: function (options) {
                TabsNav.removeAll();
            }
        }, {
            text: '刷新',
            role: 'refresh-self',
            click: function (options) {
                var id = options.tabId;
                TabsNav.refreshTabContent(id);
            }
        }, 'sep', {
            text: '取消',
            role: 'quit',
            click: function (options) {

            }
        }]
    });

    // 下拉面板nicescoll
    _getNiceSroll_(function () {
        $dropPanel.niceScroll({
            cursorcolor: '#d5dee6'
        });
    });
})(this, jQuery);


// 换肤面板
/*
(function (win, $) {

    var $skinsPanel = $("#msgSkin").find(".msg-panel-content"),
        curTheme = $.cookie('_theme_'),
        currSkin = $.cookie('_' + curTheme + '_skin_') || 'default',
        M = Mustache;

    // 显示面板时再加载
    win.initSkinView = function () {
        return $.ajax('./skins/skins.json').done(function (data) {
            var html = [];
            $(data).each(function (i, item) {
                if (item.name == currSkin) {
                    item.selected = 'selected';
                }
                html.push(M.render(SKIN_TPL, item));
            });
            $(html.join('')).appendTo($skinsPanel.empty());
            // 成功后删除此方法
            delete window.initSkinView;
        });
    };

    $skinsPanel.on('click', '.skin-choose', function (e) {
        var $this = $(this);
        if ($this.hasClass('selected')) return;

        var skin = $this.data('name');
        $this.addClass('selected').siblings().removeClass('selected');
        $.cookie('_' + curTheme + '_skin_', skin, {
            expires: 365,
            path: '/'
        });
        // 提示是否刷新
        mini.confirm('换肤成功，是否立即为您刷新？', '系统提示', function (action) {
            if (action == 'ok') {
                location.reload();
            }
        });
    });

}(window, jQuery));
*/

// 点击空白处收起滑动面板并其取消遮罩
(function (win, $) {

    // 此处判断是否需要遮罩的显示隐藏与弹窗的显示隐藏
    $('body').on("click", function (e) {
        var $target = $(e.target),
            needhidePanel = true;
        if (!$.contains($userInfo[0], $target[0])) {
            //  不在用户下拉区域内
            $userInfo.removeClass('showPanel');
        } else {
            hidePanel();
            needhidePanel = false;
        }

        if (!$.contains($topMenu[0], $target[0])) {
            // not top menu
            $topMenu.removeClass('showPanel');
        } else {
            needhidePanel = false;
        }

        if (!$.contains($quickMenu[0], $target[0])) {
            // not top menu
            $quickMenu.removeClass('open');
        } else {
            needhidePanel = false;
        }

        if (!$target.closest('.bottom-drop').length) {
            // not bottom panel
            $dropBox.removeClass('showPanel');
            $dropPanel.stop(true).animate({
                bottom: -($dropPanel.height())
            });
        } else {
            needhidePanel = false;
        }

        if (!$.contains($msgPanel[0], $target[0]) && !$target.closest('.js-panel').length) {
            // not rightPanel
            hidePanel();
        } else {
            needhidePanel = false;
        }

        if (!_leftIsWide) {
            if (!$target.closest('.left-menu').length) {
                $leftContainer.find('.top-item.open').removeClass('open');
                // $pageCover.addClass('hidden');
            } else {
                needhidePanel = false;
            }
        }


        needhidePanel && $pageCover.addClass("hidden");

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
        Util.loadJs('frame/fui/js/widgets/jquery.placeholder.min.js', enableHolder);
    }
}(this, jQuery));


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
            templ: 'frame/fui/js/widgets/emsg/emsg.tpl',
            js: 'frame/fui/js/widgets/emsg/emsg.js',
            css: 'frame/fui/js/widgets/emsg/emsg.css',
            callback: function () {

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