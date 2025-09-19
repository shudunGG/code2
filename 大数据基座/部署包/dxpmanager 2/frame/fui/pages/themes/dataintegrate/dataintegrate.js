/*!
 * 新点数据集成开发平台
 * author:jiangqn
 * date: 2019-09-23
 * version: 1.0.0
 */
var $main = $('#main'),
    $mainIframe = $('#main-iframe');
// 全局变量处理
(function (win, $) {
    // 自定义事件 用于一些逻辑控制
    win._dataintegrateEvent_ = new Util.UserEvent();

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

    // 创建websocket链接
    win.creatWebSocket = function (uid, uname, callback) {
        // 避免重复创建
        if(eWebSocket) {
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
            _dataintegrateEvent_.fire('websocketCreated');

        } else {
            Util.loadJs('fui/pages/ewebsocket/ewebsocket.js', function () {
                eWebSocket = new EWebSocket(cfg);
                callback && callback();
                _dataintegrateEvent_.fire('websocketCreated');
            });
        }
    };
    // 获取模板html
    win.getTplHtml = function(id, data) {
        var tpl = $('#' + id).html();
        Mustache.parse(tpl);
        return Mustache.render(tpl, data);
    }
})(this, jQuery);

// TabsNav
(function (win, $) {
    // var $mainIfrWrap = $('#main-ifr-wrap');
    function addTab(cfg) {
        console.log(cfg);
        // 如果不是左侧菜单，则移除菜单active样式
        if (!cfg.menuLink) {
            $('.left-menu-link').removeClass('active');
        }
        $mainIframe[0].src = Util.getRightUrl(cfg.url);
        $mainIframe.data('id',cfg.id);
        // var $activeIframe = $('#tab-content-'+cfg.id);
        // if ($activeIframe.length) {
        //     $activeIframe.removeClass('hidden').siblings().addClass('hidden');
        // } else {
        //     $mainIfrWrap.append(
        //         '<iframe class="tab-content" id="tab-content-'+ cfg.id +'" src="'+ Util.getRightUrl(cfg.url) +'" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>'
        //     )
        // }
    }
    win.TabsNav = {
        addTab: addTab
    }
})(this, jQuery);

// topmenu
(function(win,$) {
    var $topMenu = $('#top-menu'),
        $topMenuInner = $('#top-menu-inner'),
        $hd = $('#header-container'),
        $menuTrigger = $('#menu-trigger'),
        $cover = createMainContentCover();

    $mainIframe[0].src = Util.getRightUrl(homeUrl);
    getTopMenu();
    // 获取顶部菜单
    function getTopMenu() {
        _getData_('getMenu', {
            query: 'top'
        }).done(function (data) {
            var items = data.items,
                width = Math.floor((100 / items.length) * 100) / 100;
            if (items.length <= 6) {
                $topMenuInner.width('1000px');
            }
            items.forEach(function(item) {
                item.width = width + '%';
            })
            $topMenuInner.html(getTplHtml('topmenu-tpl',{list: items}));
            // $('.top-menu-item',$topMenu).eq(0).addClass('active');
            // $('.top-menu-item',$topMenu).eq(0).trigger('click');
            // if(items[0].hasSub) {
            //     $main.removeClass('left-none');
            //     getLefMenu({
            //         code: items[0].code,
            //         name: items[0].name
            //     }, true);
            // } else {
            //     $main.addClass('left-none');
            // }
            if ($('#top-menu-'+localStorage.getItem('activeTopId')).length) {
                $('#top-menu-'+localStorage.getItem('activeTopId')).trigger('click');
            }
        });
    }
    // 点击顶部菜单
    $topMenu.on('click','.top-menu-item',function() {
        var $this = $(this),
            name = $this.data('name'),
            url = $this.data('url'),
            hassub = $this.data('hassub'),
            id = $this.data('id'),
            opentype = $this.data('opentype');
        if ($this.hasClass('active')) {
            $menuTrigger.removeClass('active');
            $topMenu.addClass('hidden');
            $cover.addClass('hidden');
            return;
        }
        $('.top-menu-item',$topMenu).removeClass('active');
        $this.addClass('active');

        if (hassub) {
            $main.removeClass('left-none');
            getLefMenu({
                code: this.getAttribute('data-id'),
                name: this.getAttribute('title') || this.innerText
            }, true);
        } else {
            // 无子菜单 隐藏左侧
            $main.addClass('left-none');
        }
        // 有url显示页面
        if (url) {
            dealLinkOpen({
                openType: opentype,
                name: name,
                id: id,
                url: url
            });
        }
        $menuTrigger.removeClass('active');
        $topMenu.addClass('hidden');
        $cover.addClass('hidden');
        localStorage.setItem('activeTopId',id);
    })
    // 点击显隐顶部菜单
    $hd.on('click','.menu-trigger',function() {
        if ($menuTrigger.hasClass('active')) {
            $menuTrigger.removeClass('active');
            $topMenu.addClass('hidden');
            $cover.addClass('hidden');
        } else {
            $menuTrigger.addClass('active');
            $topMenu.removeClass('hidden');
            $cover.removeClass('hidden');
        }
    })
    $('body').on('click',function(e) {
        if (!$(e.target).closest('#top-menu,#menu-trigger').length) {
            $menuTrigger.removeClass('active');
            $topMenu.addClass('hidden');
            $cover.addClass('hidden');
        }
    })
})(window,jQuery);

// userinfo
(function (win, $) {
    var $userInfo = $('#user-info'),
        $userPortrait = $('.user-portrait', $userInfo),
        $userActionPanel = $('#user-action-panel');
    var $cover = createMainContentCover();
    $userInfo
        // 用户头像点击
        .on('click', '.user-info-summary', function () {
        	  if (!$userInfo.hasClass('active')) {
                  $userInfo.addClass('active');
                  $userActionPanel.slideDown();
                  $cover.removeClass('hidden');
              } else {
                  $userInfo.removeClass('active');
                  $userActionPanel.slideUp();
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
            $userActionPanel.slideUp();
        }
    });
    // 获取用户信息
    _getData_('getUserInfo').done(function (data) {
        // 用户guid和name是E讯必须要使用的 需要记录下来
        /* global _userName_, _userGuid_ */
        win._userName_ = data.name;
        win._userGuid_ = data.guid;

        // 消息中心的配置-打开是否全屏
        win._msgcenterConfig_ = $.extend({}, MsgCenterConfig, {
            isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
            msgCenterOrder: data.msgCenterOrder || "asc",
            hideCallback: function () {
                $cover.addClass('hidden');
            }
        })

        // 使用websocket来更新消息数目，需要先建立连接
        if (useWebsocket) {
            creatWebSocket(_userGuid_, _userName_);
        }
        if (data.portrait) {
            // 头像
            var url = Util.getRightUrl(epoint.dealRestfulUrl(data.portrait));
            $userPortrait.attr('src', url + "&t=" + Math.random());
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

        if (data.title) {
            document.title = data.title;
            win.systemTitle = data.title;
        }
        // fullSearchUrl
        if (data.fullSearchUrl) {
            win._fullSearchUrl_ = data.fullSearchUrl;
        }

        // var home = {
        //     closeIcon: false,
        //     refresh: true
        // };
        // // 默认展示后端配置的 或者 第一个openType为tabnav的
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

        //TabsNav.addTab(home);

        // 触发 afterPageInfo 事件
        _dataintegrateEvent_.fire('afterPageInfo');
    });
    
    _getData_('getPageInfo').done(function (data) {
        if (data.title) {
            document.title = data.title;
            win.systemTitle = data.title;
        }
        // fullSearchUrl
        if (data.fullSearchUrl) {
            win._fullSearchUrl_ = data.fullSearchUrl;
        }
        if (data.logo) {
          $("#dxpmanger-logo").attr('src', /^data:/i.test(data.logo) ? data.logo : Util.getRightUrl(data.logo));
		  $("#dxpmanger-logoname").hide();
        }
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

    var $msgSound = $('#msg-sound'),
        $soundIframe,
        msgAudio;
    // 根据浏览器加载不同的声音提醒方案
    if (Util.browsers.isIE) {
        $soundIframe = $('<iframe src="" frameborder="0" class="hidden" id="msgcenter-sound"></iframe>').appendTo(
            $msgSound
        );
    } else {
        $msgSound.html(
            '<audio id="msgcenter-sound-audio" controls="controls" src="../../msgsound/newsms.wav" class="hidden-accessible"></audio>'
        );
        msgAudio = document.getElementById('msgcenter-sound-audio');
    }

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
        $remindNum = $('.remind-num', $topActionList),
        $eMsgNum = $('.emsg-num', $topActionList),
        //e讯的
        $msgPanel = $('#msg-panel'),
        $msgRemind = $('#msgRemind', $msgPanel),
        $msgRemindContent = $('.msg-panel-content', $msgRemind);

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
    // 后端为了减轻服务端压力，要求轮询数据从cache中获取
    var getMsgCount = function (inCache) {
        var data = {
            haseXun: false,
            needNum: true
        };

        if(inCache) {
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

        if (hasNew) {
            // 播放提醒 并滚动标题
            if (Util.getFrameSysParam('messageSound') !== false) {
                if (Util.browsers.isIE) {
                    $soundIframe[0].src = Util.getRightUrl(SOUND_URL + '?_=' + +new Date());
                } else {
                    try {
                        // 新版chrome已经禁止自动播放声音
                        // 需要在用户和界面交互后才能进行播放操作
                        // 因此在开始时，暂时以 语音合成方案解决
                        msgAudio && msgAudio.play()['catch'](function () {
                            var speechSU = new window.SpeechSynthesisUtterance();
                            speechSU.text = '您有新短消息，请注意查收！';
                            window.speechSynthesis.speak(speechSU);
                        });
                    } catch (err) {}
                }
            }
            // 标题滚动
            docTitle.roll();
        } else {
            // 停止标题滚动
            docTitle.stop();
        }
    };

    // // 轮训获取消息
    // $(function() {
    //     getMsgCount();
    //     setInterval(getMsgCount, 60000);
    // });
    // 界面信息获取完成后 开始获取消息数目 避免标题记录不对
    _dataintegrateEvent_.on('afterPageInfo', function () {
        getMsgCount();

        if (!useWebsocket) {
            setInterval(function(){
                getMsgCount(true);
            }, 60000);
        }

    });

    // 使用websocket更新消息数目，则需要在websocket建立后绑定messagecount事件
    if (useWebsocket) {
        _dataintegrateEvent_.on('websocketCreated', function () {

            eWebSocket.socketEvent.on('messagecount', function (e) {
                updateMsgCount(e.data);
            });
        });
    }


    // 将刷新消息数目的方法开放出来，以备外部处理完代办后可以刷新主界面中的消息数目
    win.getMessageCount = getMsgCount;

    var msgCenter;

    win.messageCenter = {
        refresh: function () {
            if (msgCenter) {
                msgCenter.refresh();
            }
        }
    }
    // 消息列表
    var messageList;

    function initMessageList() {
        /* global MessageList */
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
        Util.loadJs('../../messagelist/messagelist.js', function () {
            initMessageList();
        });
    } else {
        initMessageList();
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

        $topActionList.find('[data-ref].active').removeClass('active');
    }
    /* global hideMessagePanel */
    win.hideMessagePanel = hidePanel;
    var $cover = createMainContentCover();


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
                if(!msgCenter) {
                    msgCenter = new MsgCenter(_msgcenterConfig_);
                }
                msgCenter.show();
                hideMessagePanel();
                return;
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

// left-menu 
(function (win, $) {
    var leftMenuStatus = {};

    var $leftMenu = $('#left-menu'),
        $leftMenuTrigger = $('.left-nav-trigger', $leftMenu),
        $leftMenuContainer = $('.left-nav-container', $leftMenu);

    var $activeLeftMenu;

    var LEFT_MENU_ITEM_TPL = '<li class="left-menu-item {{level}}"><a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" data-hasSub="{{hasSub}}" class="left-menu-link"style="padding-left: {{indent}}px;">{{#isTop}}<i class="left-menu-icon {{icon}} "></i>{{/isTop}}<span class="left-menu-name">{{name}}</span>{{#hasSub}}<i class="left-menu-trigger"></i>{{/hasSub}}</a>{{#hasSub}}{{#isTop}}<div class="left-menu-sub"><div class="left-menu-sub-inner"><div class="left-menu-sub-header"><span class="left-menu-sub-title">{{name}}</span></div>{{/isTop}}<ul class="left-menu-sub-list" style="display:none;"> {{{subMenu}}}</ul>{{#isTop}}</div></div>{{/isTop}}{{/hasSub}}</li>';
    var LEFT_MENU_TPL = '<div class="left-menu-wrap" id="left-menu-{{code}}"><div class="left-menu-header">{{name}}</div><ul class="left-menu-list">{{{leftMenuItems}}}</ul></div>';

    function initEvent() {
        // 记录当前左侧菜单的状态
        function saveLeftMenuState(v) {
            localStorage.setItem('_dataintegrate_leftmenu_state_', v);
        }

        function getLeftMenuState() {
            return localStorage.getItem('_dataintegrate_leftmenu_state_') || 'normal';
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
                // console.log($mainIframe.data('id'),$this.data('id'));
                // 处理链接
                if (linkData.url) {
                    if (String($mainIframe.data('id')) === String($this.data('id'))) {
                        return;
                    }
                    $('.left-menu-link').removeClass('active');
                    $this.addClass('active');
                    linkData.menuLink = true;
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
                query: 'sub',
                code: tCode
            }).done(function (data) {
                console.log(data);
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
