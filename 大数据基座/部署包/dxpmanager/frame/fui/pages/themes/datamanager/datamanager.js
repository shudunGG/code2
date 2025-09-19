/*!
 * 新点研发平台
 * author:jiangqn
 * date: 2019-09-23
 * version: 1.0.0
 */
var $main = $('#main'),
    $loading = $('#loading'),
	$mainIframe = $('#main-iframe');

var menuData = [], // 菜单数据
    quickMenuList = [], // 快捷菜单列表
    menuWidth = 185;// 全部模块了每个菜单的宽度 

// 全局变量处理
(function (win, $) {
    // 自定义事件 用于一些逻辑控制
    win._datamanagerEvent_ = new Util.UserEvent();

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
        console.log(linkData);
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
            _datamanagerEvent_.fire('websocketCreated');

        } else {
            Util.loadJs('frame/fui/js/widgets/ewebsocket/ewebsocket.js', function () {
                eWebSocket = new EWebSocket(cfg);
                callback && callback();
                _datamanagerEvent_.fire('websocketCreated');
            });
        }
    };

    // 获取模板html
    win.getTplHtml = function(id, data) {
        var tpl = $('#' + id).html();
        Mustache.parse(tpl);
        return Mustache.render(tpl, data);
    }
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }
            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }
})(this, jQuery);

// TabsNav 初始化
(function (win, $) {
    /*if (Object.prototype.toString.call(win.EpTabsNav) === '[object Function]') {
         global TabsNav , EpTabsNav
        window.TabsNav = new EpTabsNav({
            ifrContainer: '#main-ifr-wrap', //内容父容器
            tabContainer: '#main-tab-wrap', //任务栏容器

            needScrollBtn: false, //是否显示左右滚动按钮
            scrollBtnSite: 'sides', //左右滚动按钮的位置，两侧：'sides',右侧：'right'
            smoothItems: 3, //点击左右滚动按钮，滑动单个tab的宽度的倍数，默认为3

            refreshOnActiveTab: Util.getFrameSysParam('refreshOnActiveTab') || false, // 激活tab时是否自动刷tab页面

            needQuickNav: true, //是否显示快捷导航

            position: 'top', // tab显示的位置，头部：'top'，底部：'bottom'，默认为'bottom'
            tabWidth: 117, // 默认一个tab的宽度，没有固定tab时必须设置
            menuLinked: true,
        });
        // 重写遮罩实现
        TabsNav._$pageCover = createMainContentCover();
    } else {
        console.error('The TabsNav is required! , please add the "fui/pages/tabsnav/tabsnav.js" before theme\'s javascript file');
    }*/
    
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

//topmenu
(function(win,$) {
    var $topMenu = $('#top-menu'),
        $topMenuInner = $('#top-menu-inner'),
        $hd = $('#header-container'),
        $menuTrigger = $('#menu-trigger'),
        $cover = createMainContentCover();

    $mainIframe[0].src = Util.getRightUrl(homeUrl);
//    getTopMenu();
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
        if (!$(e.target).closest('#user-info,#user-action-panel').length) {
            $userInfo.removeClass('active');
            $userActionPanel.slideUp();
            $cover.addClass('hidden');
        }
    });
    // 获取用户信息
    Util.ajax({
        url: getUserInfoUrl,
    }).done(function(data) {
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

        // 触发 afterPageInfo 事件
        // _datamanagerEvent_.fire('afterPageInfo');
    })

    // function dealData(homes, defaultHome) {
    //     var home = {
    //         closeIcon: false,
    //         refresh: true
    //     };
    //     // 记录无分类的门户
    //     var signleHomes = [];
    //     // 默认展示后端配置的 或者 第一个openType为tabnav的
    //     // 遍历一次 处理分类和不带分类的
    //     // 同时寻找 默认门户
    //     // todo 这里面干了太多的事情 待优化
    //     for (var i = 0; i < homes.length; i++) {
    //         var cate = homes[i];
    //         var finded = false;

    //         // 带分类的
    //         // if (cate.items && cate.items.length) {
    //         if (cate.items != undefined) {
    //             // 寻找默认门户或 第一个带url的用于默认值
    //             !finded && $.each(cate.items, function (j, item) {
    //                 if (defaultHome) {
    //                     // server set
    //                     if (item.code == defaultHome) {
    //                         home.id = item.code || 'home';
    //                         home.url = item.url;
    //                         home.name = item.name;
    //                         finded = true;
    //                         return false;
    //                     }
    //                 } else {
    //                     // the first
    //                     if (item.openType == 'tabsnav') {
    //                         home.id = item.code || 'home';
    //                         home.url = item.url;
    //                         home.name = item.name;
    //                         finded = true;
    //                         return false;
    //                     }
    //                 }
    //             });
    //         } else {
    //             if (!finded) {
    //                 if (defaultHome) {
    //                     // server set
    //                     if (cate.code == defaultHome) {
    //                         home.id = cate.code || 'home';
    //                         home.url = cate.url;
    //                         home.name = cate.name;
    //                         finded = true;
    //                     }
    //                 } else {
    //                     // the first
    //                     if (cate.openType == 'tabsnav') {
    //                         home.id = cate.code || 'home';
    //                         home.url = cate.url;
    //                         home.name = cate.name;
    //                         finded = true;
    //                     }
    //                 }
    //             }
    //             // 不带分类的
    //             // signleHomes.push(homes.splice(i, 1));
    //             signleHomes = signleHomes.concat(homes.splice(i, 1));
    //             i--;
    //         }
    //     }
    //     var outputHomes = [{
    //         code: 'signleHomes',
    //         name: '默认分类',
    //         items: signleHomes
    //     }];
    //     $.each(homes, function (i, item) {
    //         outputHomes.push(item);
    //     });
    //     return {
    //         homes: outputHomes,
    //         home: home
    //     };
    // }

    // _getData_('getPageInfo').done(function (data) {
    //     // fullSearchUrl
    //     if (data.fullSearchUrl) {
    //         win._fullSearchUrl_ = data.fullSearchUrl;
    //     }

    //     var newdata = dealData(data.homes, data.defaultHome);
	// 	TabsNav.addTab(newdata.home);
    //     // 触发 afterPageInfo 事件
    //     _datamanagerEvent_.fire('afterPageInfo');
    // });

    _getData_('getPageInfo').done(function (data) {
        // fullSearchUrl
        if (data.fullSearchUrl) {
            win._fullSearchUrl_ = data.fullSearchUrl;
        }

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

        TabsNav.addTab(home);
        // 触发 afterPageInfo 事件
        _datamanagerEvent_.fire('afterPageInfo');
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
    // var EXT_TAB_TPL = '<li class="user-action-item" title="{{name}}" url="{{url}}" data-opentype="{{openType}}" ><span class="{{icon}}"></span>{{name}}</li>';
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

/*
 * 打开E讯聊天窗口
 * sessionid 会话id，当传入一个参数时sessionid表示uid
 * uid 对方用户id
 * type 个人：friend 讨论组：group
 */

window.OpenEMsg = function (sessionid, uid, type) {
    /* global eMsg , eMsgSocket */
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
    // var $tips = $('#new-remind-wrap');

    /* global RemindTipsCfg */
    var remindTips = {
        show: function () {
            if (RemindTipsCfg.show) {
                // $tips.removeClass('hidden');
                this.autoHide();
            }
        },
        autoHide: (function () {
            if (RemindTipsCfg.timeout != 0) {
                return function () {
                    clearTimeout(remindTips.timer);
                    remindTips.timer = setTimeout(function () {
                        // $tips.addClass('hidden');
                    }, RemindTipsCfg.timeout);
                };
            }
            return function () {};
        }()),
        initEvent: function () {
            // if (RemindTipsCfg.show) {
            //     $tips.on('click', '.icon, .text', function () {
            //         $tips.addClass('hidden');
            //     }).on('click', '.close', function (e) {
            //         e.stopPropagation();
            //         $tips.addClass('hidden');
            //     });
            // }
        }
    };
    remindTips.initEvent();

    // 获取消息数目
    // 后端为了减轻服务端压力，要求轮询数据从cache中获取
    var getMsgCount = function (inCache) {
        var data = {
            haseXun: true,
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
    // 界面信息获取完成后 开始获取消息数目 避免标题记录不对
    _datamanagerEvent_.on('afterPageInfo', function () {
        getMsgCount();

        if (!useWebsocket) {
            setInterval(function(){
                getMsgCount(true);
            }, 60000);
        }

    });

    // 使用websocket更新消息数目，则需要在websocket建立后绑定messagecount事件
    if (useWebsocket) {
        _datamanagerEvent_.on('websocketCreated', function () {

            eWebSocket.socketEvent.on('messagecount', function (e) {
                updateMsgCount(e.data);
            });
        });
    }


    // 将刷新消息数目的方法开放出来，以备外部处理完代办后可以刷新主界面中的消息数目
    win.getMessageCount = getMsgCount;

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
        Util.loadJs('../../../js/widgets/messagelist/messagelist.js', function () {
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

    if (!win.EMsgList) {
        Util.loadJs('../../../js/widgets/emsglist/emsglist.js', function () {
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
        }
    }
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
    var $header = $('.header-container');
    var $topSearch = $('#top-search').addClass('invisible');

    function doSearch(type, kw) {
        type = type || 'all';
        try {
            TabsNav.removeTab('fullsearch');
        } catch (error) {

        }
        TabsNav.addTab({
            id: 'fullsearch',
            name: '全文检索',
            url: win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type=' + type
        });
    }

    function getCateData() {
        return Util.ajax({
            url: win.fullSearchCateUrl
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
        // 创建遮罩
        ClassifySearch._$pageCover = createMainContentCover();
        var cs = new ClassifySearch({
            id: 'header-search', // 绑定的容器id
            searchTarget: '内容', // 搜索目标
            category: cates,
            placeholder: '搜索', // 输入框placeholder内容
            maxShowCharacter: 5, // 下拉区域显示的最大关键字字符数
            enter: function (id, key) {
                // 回车，回车不会执行keyup
                // console.log('回车事件返回 id:' + id + 'key:' + key);
                doSearch(id, key);
            }
        });
        setTimeout(function () {
            $topSearch.removeClass('invisible');
        }, 200);
    }

    // getCateData();
    // 获取到全文检索地址后再进行初始化
    _datamanagerEvent_.on('afterPageInfo', function () {
        if (win._fullSearchUrl_) {
            getCateData();
            $header.addClass('has-search');
        } else {
            $header.removeClass('has-search');
        }
        _datamanagerEvent_.fire('headerSearchLoad');
    });

})(this, jQuery);

// 全局菜单
(function(win,$) {
    var $menuTrigger = $('#menu-trigger'),
        $globalMenu = $('#global-menu'),
        $quickMenuList = $('#quick-menu-list'),
        $allMenuSearch = $('#all-menu-search'),
        $allmenuSearchInput = $('#allmenu-search-input'),
        $allMenuBody = $('#all-menu-body'),
        $allMenu = $('#all-menu'),
        $allMenuBox = $('#all-menu-box'),
        $cover = createMainContentCover();

    var quickMenuFlag = false, // 快捷菜单数据是否已加载完成
        menuDataFlag = false, // 菜单数据是否已加载完成
        // allMenuRemoveFlag = false, // 控制是否可以执行移除所有模块动画
        _QUICK_DELAY_TIME_ = 500, // 延时毫秒数
        _ALL_MENU_BOX_ENTER_DELAY_ = 200, // 全部模块进入延迟
        _ALL_MENU_BOX_LEAVE_DELAY_ = 600; // 全部模块移出延迟
    // 瀑布流方法
    function waterfall() {
        var hArr = [];
        $('.all-menu-block',$allMenuBody).each(function(i,item) {
            var $item = $(item);
            if (i < 3) {
                if (i === 0) {
                    $item.css({
                        top: '10px',
                        left: 0 
                    })
                } else {
                    $item.css({
                        top: '10px',
                        left: (menuWidth * i) + 'px' 
                    })
                }
                hArr.push($item.outerHeight() + 10);
            } else {
                var min = getMin(hArr);
                if (min === 0) {
                    $item.css({
                        top: (min.num + 30) + 'px',
                        left: 0
                    })
                } else {
                    $item.css({
                        top: (min.num + 30) + 'px',
                        left: (menuWidth * min.index)+ 'px' 
                    })
                }
                
                hArr[min.index] = $item.outerHeight() + min.num + 30;
            }
        })
    }
    // 获取数组的最小值及索引
    function getMin(arr) {
        var num = 0,
            index = 0;
        arr.forEach(function(item,i) {
            if (i === 0) {
                num = item;
            } else if (i !== 0 && item < num) {
                num = item;
                index = i;
            }
        })
        return {
            num: num,
            index: index
        }
    }
    // 获取快捷菜单
    function getQuickMenu() {
        Util.ajax({
            url: getQuickMenuUrl,
        }).done(function(data) {
            quickMenuFlag = true;
            quickMenuList = data;
            $quickMenuList.html(getTplHtml('quick-menu-tpl',{list: quickMenuList}));
            if (menuDataFlag) {
                activeAllMenu();
            }
        })
    }
    // 获取菜单
    function getMenu() {
        Util.ajax({
            url: getMenuUrl,
            data: {
                query: 'all'
            }
        }).done(function(data) {
            menuDataFlag = true;
            menuData = data;
            initMenuData();
            $allMenuBody.html(getTplHtml('allmenu-block-tpl',{list: menuData}));
            waterfall();
            if (quickMenuFlag) {
                activeAllMenu();
            }
        })
    }
    // 给一级菜单加上hasSub属性
    function initMenuData() {
        menuData.forEach(function(item) {
            if(item.items && item.items.length) {
                item.hasSub = true;
                // item.items.forEach(function(item1) {
                //     if (item1.items && item1.items.length) {
                //         item1.hasSub = true;
                //     } else {
                //         item1.hasSub = false;
                //     }
                // })
            } else {
                item.hasSub = false;
            }
        })
    }
    // 激活全局菜单
    function activeAllMenu() {
        $('.allmenu-item').each(function(i,item) {
            var $item = $(item),
                id = $item.data('id');
            for(var j = 0; j < quickMenuList.length;j++) {
                if (quickMenuList[j].code == id) {
                    $item.addClass('active');
                    break;
                }
            }
        })
    }
    // 移除全局菜单active样式
    function unActiveAllMenu(id) {
        var $allMenu = $('.allmenu-item');
        for (var i = 0;i < $allMenu.length;i++) {
            var $item = $allMenu.eq(i)
            if ($item.data('id') == id) {
                $item.removeClass('active');
                break;
            }
        }
    }

    // 快捷菜单排序
    function sortQuickMenu() {
        var arr = [];
        $('.quick-menu').each(function(i,item) {
            var $item = $(item),
                id = $item.data('id');
            for(var j = 0;j < quickMenuList.length;j++) {
                if(quickMenuList[j].code == id) {
                    arr.push(quickMenuList[j]);
                    break;
                }
            }
        });
        quickMenuList = arr;
    }

    // 根据id删除快捷菜单
    function deleteQuickMenu(id) {
        for (var i = 0; i< quickMenuList.length;i++) {
            if (quickMenuList[i].code == id) {
                quickMenuList.splice(i,1);
            }
        }
        $quickMenuList.html(getTplHtml('quick-menu-tpl',{list: quickMenuList}));
    }
    // 保存菜单
    function saveCommonMenu() {
        var userSelected = [];
        quickMenuList.forEach(function(item) {
            userSelected.push(String(item.code));
        })
        console.log(userSelected);
        Util.ajax({
            url: saveCommonMenuUrl,
            data: {
                type: 'user-setting',
                userSelected: JSON.stringify(userSelected),
            }
        }).done(function(data) {
            
        })
    }
    // 拖拽快捷菜单
    function drag() {
        $quickMenuList.sortable({
            axis: "y", 
            handle: ".quick-menu-drag",
            zIndex: 100,
            deactivate: function(event, ui) {
                sortQuickMenu();
                saveCommonMenu();
            }
        });
    }
    function searchAllMenu() {
        var val = $allmenuSearchInput.val(),
            arr = [],
            menuDataCopy = JSON.parse(JSON.stringify(menuData));
        if (val === '') {
            $allMenuBody.html(getTplHtml('allmenu-block-tpl',{list: menuData}));
        } else {
            menuDataCopy.forEach(function(item) {
                var showFlag = false,
                    menuItem = {
                        items: []
                    };
                if (item.name.includes(val)) {
                    showFlag = true;
                }
                if (item.items && item.items.length) {
                    item.items.forEach(function(item1) {
                        if (item1.name.includes(val)) {
                            menuItem.items.push(item1);
                            showFlag = true;  
                        }
                    })
                }
                if (showFlag) {
                    menuItem.code = item.code;
                    menuItem.name = item.name;
                    menuItem.icon = item.icon;
                    menuItem.openType = item.openType;
                    menuItem.url = item.url;
                    arr.push(menuItem);
                }
            })
            $allMenuBody.html(getTplHtml('allmenu-block-tpl',{list: arr}));
        }
        waterfall();
        activeAllMenu();
    }
    // 点击显引全局菜单
    $menuTrigger.on('click',function() {
        if ($menuTrigger.hasClass('active')) {
            hideAllMenu()
            // $menuTrigger.removeClass('active');
            // $globalMenu.addClass('hide');
            // $cover.addClass('hidden');
        } else {
            $menuTrigger.addClass('active');
            $globalMenu.removeClass('hide');
            $cover.removeClass('hidden');
        }
    });
    // 聚焦搜索框
    $allmenuSearchInput.on('focus',function() {
        $allMenuSearch.addClass('active');
    })
    // 失去焦点
    .on('blur',function() {
        $allMenuSearch.removeClass('active');
    })
    // 按回车键搜索
    .on('keydown',function(e) {
        if(e.keyCode === 13) {
            searchAllMenu();
        }
    });

    // 点击添加快捷菜单
    $allMenuBody.on('click','.allmenu-item-flag',function(e) {
        e.stopPropagation();
        var $menuItem = $(this).parent(),
            id = $menuItem.data('id');
        var icon = $menuItem.data('icon'),
            name = $menuItem.data('name'),
            url = $menuItem.data('url'),
            openType = $menuItem.data('opentype'),
            icon = $menuItem.data('icon');
        if ($menuItem.hasClass('active')) {
            $menuItem.removeClass('active');
            deleteQuickMenu(id);
        } else {
            var itemData = {
                code : id,
                name: name,
                icon: icon,
                openType: openType,
            }
    
            if (url) {
                itemData.url = url;
            }
    
            quickMenuList.push(itemData);
            $menuItem.addClass('active');
            $quickMenuList.html(getTplHtml('quick-menu-tpl',{list: quickMenuList}));
        }

        saveCommonMenu();
    })
    // 点击全局菜单
    .on('click','.allmenu-item',function() {
        var $this = $(this),
            id = $this.data('id'),
            name = $this.data('name'),
            url = $this.data('url'),
            openType = $this.data('opentype'),
            hasSub = $this.data('hassub'),
            icon = $this.data('icon');
        $loading.removeClass('hidden');
        hideAllMenu();
        setTimeout(function() {
            if (url) {
                dealLinkOpen({
                    id: id,
                    name: name,
                    url: url,
                    openType: openType
                });
            }
            var openFirstUrl = url ? false : true;
            if ($this.hasClass('level1')) {
                if (hasSub) {
                    $main.removeClass('left-none');
                    
                    getLefMenu({
                        code: id,
                        name: name,
                        icon: icon
                    }, openFirstUrl);
                } else {
                    $main.addClass('left-none');
                    dealLinkOpen({
                        id: id,
                        name: name,
                        url: url,
                        openType: openType
                    });
                }
            } else {
                var $topItem = $this.siblings('.level1'),
                    topId = $topItem.data('id'),
                    topName = $this.data('name'),
                    topUrl = $this.data('url'),
                    topOpenType = $this.data('opentype'),
                    topHasSub = $this.data('hassub'),
                    topIcon = $this.data('icon');
                
                $main.removeClass('left-none');
                getLefMenu({
                    code: topId,
                    name: topName,
                    icon: topIcon,
                    activeCode: id
                }, openFirstUrl);
            }
            $loading.addClass('hidden');
            $(win).trigger('resize');
        },_QUICK_DELAY_TIME_)
        
        // $menuTrigger.removeClass('active');
        // $globalMenu.addClass('hide');
        // $cover.addClass('hidden');
        
    });
    // 点击删除快捷菜单
    $quickMenuList.on('click','.quick-menu-close',function(e) {
        e.stopPropagation();
        var $menuItem = $(this).parent(),
            id = $menuItem.data('id');
            deleteQuickMenu(id);
            unActiveAllMenu(id);

        saveCommonMenu();
    })
    // 点击快捷菜单
    .on('click','.quick-menu',function() {
        $allmenuSearchInput.val('');
        searchAllMenu();
        
        // 直接出发点击对应的全局菜单
        $('#all-menu-'+$(this).data('id')).trigger('click');
    });
    var timer1,
        timer2;
    // 鼠标进入
    $allMenu.on('mouseenter',function() {
        // allMenuRemoveFlag = false;
        win.clearTimeout(timer2);
        $allMenu.addClass('active');
        timer1 = setTimeout(function() {
            // if (!allMenuRemoveFlag) {
                $allMenuBox.addClass('show');
            // }
        },_ALL_MENU_BOX_ENTER_DELAY_)
    })
    // 鼠标移出
    .on('mouseleave',function() {
        win.clearTimeout(timer1);
        // allMenuRemoveFlag = true;
        $allMenu.removeClass('active');
        timer2 = setTimeout(function() {
            // if (allMenuRemoveFlag) {
                $allMenuBox.removeClass('show'); 
            // }
        },_ALL_MENU_BOX_LEAVE_DELAY_);
    })
    $allMenuBox.on('mouseenter',function() {
        win.clearTimeout(timer2);
        // allMenuRemoveFlag = false;
        $allMenu.addClass('active');
    })
    .on('mouseleave',function() {
        win.clearTimeout(timer1);
        // allMenuRemoveFlag = true;
        $allMenu.removeClass('active');
        timer2 = setTimeout(function() {
            // if (allMenuRemoveFlag) {
                $allMenuBox.removeClass('show'); 
            // }
        },_ALL_MENU_BOX_LEAVE_DELAY_);
    })

    function hideAllMenu() {
        $menuTrigger.removeClass('active');
        $globalMenu.addClass('hide');
        $allMenuBox.removeClass('show');
        $cover.addClass('hidden'); 
    }

    $('body').on('click', function (e) {
        if (!$(e.target).closest('#menu-trigger,#global-menu,#all-menu-box').length) {
            hideAllMenu();
            // $menuTrigger.removeClass('active');
            // $globalMenu.addClass('hide');
            // $allMenu.removeClass('show');
            // $cover.addClass('hidden'); 
        }
    });

    drag();
    getMenu();
    getQuickMenu();
    
})(window,jQuery);

// left-menu 
(function (win, $) {
    var leftMenuStatus = {};

    var $leftMenu = $('#left-menu'),
        $leftMenuTrigger = $('.left-nav-trigger', $leftMenu),
        $leftMenuContainer = $('.left-nav-container', $leftMenu),
        $cover = createMainContentCover();

    var $activeLeftMenu;

    var LEFT_MENU_ITEM_TPL = '<li class="left-menu-item {{level}}"><a href="javascript:void(0);" data-url="{{url}}" data-id="{{code}}" title="{{name}}" data-openType="{{openType}}" data-hasSub="{{hasSub}}" class="left-menu-link"style="padding-left: {{indent}}px;">{{#isTop}}<i class="left-menu-icon {{icon}} "></i>{{/isTop}}<span class="left-menu-name">{{name}}</span>{{#hasSub}}<i class="left-menu-trigger"></i>{{/hasSub}}</a>{{#hasSub}}{{#isTop}}<div class="left-menu-sub"><div class="left-menu-sub-inner"><div class="left-menu-sub-header"><span class="left-menu-sub-title">{{name}}</span></div>{{/isTop}}<ul class="left-menu-sub-list" style="display:none;"> {{{subMenu}}}</ul>{{#isTop}}</div></div>{{/isTop}}{{/hasSub}}</li>';
    var LEFT_MENU_TPL = '<div class="left-menu-wrap" id="left-menu-{{code}}"><div class="left-menu-header" data-url="{{url}}" data-id="{{code}}" data-openType="{{openType}}" data-hasSub="{{hasSub}}" ><span class="left-menu-header-txt">{{name}}</span><span class="left-menu-header-icon {{icon}}"></span></div><ul class="left-menu-list">{{{leftMenuItems}}}</ul></div>';
    var _DELAY_TIME_ = 300; // 延时动画的毫秒数
    function initEvent() {
        // 记录当前左侧菜单的状态
        // function saveLeftMenuState(v) {
        //     localStorage.setItem('_dataintegrate_leftmenu_state_', v);
        // }

        // function getLeftMenuState() {
        //     return localStorage.getItem('_dataintegrate_leftmenu_state_') || 'normal';
        // }
        // var leftMenuState = getLeftMenuState();
        var leftMenuState = 'normal';

        $main[leftMenuState == 'normal' ? 'removeClass' : 'addClass']('left-narrow');

        var isIE89 = Util.browsers.isIE8 || Util.browsers.isIE9;
        var $cover = createMainContentCover();


        $('.left-nav-trigger').on('click', function () {
            if ($main.hasClass('left-narrow')) {
                // saveLeftMenuState(leftMenuState = 'normal');
                $main.removeClass('left-narrow');
                // $cover.addClass('hidden');
            } else {
                // saveLeftMenuState(leftMenuState = 'narrow');
                $main.addClass('left-narrow');
                // 如果有展开的菜单 则显示遮罩
                if ($activeLeftMenu) {
                    var $openedMenu = $activeLeftMenu.find('.left-menu-item.level-1.opened');
                    if ($openedMenu.length) {
                        // $cover.removeClass('hidden');
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
                if (linkData.url) {
                    $('.left-menu-link').removeClass('active');
                    $this.addClass('active');
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
        INDENT_STEP = 15;

    // 获取节点缩进值
    function getIndent(rowkey, len) {
        //分割成数组判断长度
        len = len || rowkey.split('-').length;
        if (len == 2 || len == 1) {
            return INDENT_INIT;
        } else {
            return INDENT_INIT + (len - 2) * INDENT_STEP;
        }
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
            console.log(tMenu);
            var html = buildLeftMenu(data);
            var viewData = {
                code: tMenu.code,
                name: tMenu.name,
                leftMenuItems: html,
                icon: tMenu.icon,
                hasSub: tMenu.hasSub,
                openType: tMenu.openType,
                url: tMenu.url
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
        // 未渲染过
        if (!leftMenuStatus[tCode]) {
            for (var i = 0;i < menuData.length;i++) {
                var item = menuData[i];
                if (item.code == tCode) {
                    ininView(item.items, item);
                    leftMenuStatus[tCode] = 'resolve';
                    findSubUrlOpen && findFirstSecUrlOpen(tCode + '');
                    // return;
                    break;
                } 
            }
        }

        // 已经有该菜单  则直接切换
        if (leftMenuStatus[tCode] === 'resolve') {
            $activeLeftMenu = $('#left-menu-' + tCode);
            $activeLeftMenu.removeClass('hidden')
                .siblings('.left-menu-wrap').addClass('hidden');

            findSubUrlOpen && findFirstSecUrlOpen(tCode);
            // return;
            // break;
        }

        if (tMenu.activeCode) {
            var $leftMenuActive = $('#left-menu-'+tCode),
            $level1Link = $('.left-menu-item.level-1>.left-menu-link',$leftMenuActive);
            $('.left-menu-sub-list',$leftMenuActive).slideUp(_ANIMATION_TIME_.slide);
            $('.left-menu-link').removeClass('active');
            $('.left-menu-item').removeClass('opened');
            $level1Link.each(function(i,item) {
                var $item = $(item);
                if ($item.data('id') == tMenu.activeCode) {
                    if($item.data('hassub')) {
                        $item.parent().addClass('opened');
                        $item.parent().find('.left-menu-sub-list:eq(0)').slideDown(_ANIMATION_TIME_.slide);
                        // findFirstSecUrlOpen(tCode) 
                    } else {
                        $item.addClass('active');
                    }
                }
            })
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
    var menuTimer; //延迟动画定时器
        // leftOverFlag = false; // 控制是否要做延时动画
    // 鼠标覆盖离开操作
    $leftMenu.on('mouseover','.left-menu-list,.left-menu-header',function() {
        if ($main.hasClass('left-narrow')) {
            leftOverFlag = true;
            menuTimer = setTimeout(function() {
                $main.removeClass('left-narrow');
                $main.addClass('left-over');
            },_DELAY_TIME_);
        }
    })
    .on('mouseleave',function() {
        win.clearTimeout(menuTimer);
        if ($main.hasClass('left-over')) {
            $main.removeClass('left-over');
            $main.addClass('left-narrow');
        }
    })
    .on('click','.left-menu-header',function() {
        if ($(this).data('url')) {
            dealLinkOpen({
                id: $(this).data('id'),
                name: $(this).data('name'),
                url: $(this).data('url'),
                openType: $(this).data('opentype')
            })
        }
    })
}(this, jQuery));