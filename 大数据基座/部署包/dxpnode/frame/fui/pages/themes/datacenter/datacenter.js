'use strict';
// 全局变量处理
(function (win, $) {
    // 自定义事件 用于一些逻辑控制
    win._datacenterEvent_ = new Util.UserEvent();

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
    // 获取当前左侧菜单的状态
    win.getLeftMenuState = function() {
        return localStorage.getItem('_grace_leftmenu_state_') || 'normal';
    };

    win.getTplHtml = function (id, data) {
        var tpl = $('#' + id).html();
        Mustache.parse(tpl);
        return Mustache.render(tpl, data);
    };
    
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
            refreshOnActiveTab: Util.getFrameSysParam('refreshOnActiveTab') || false, // 激活tab时是否自动刷tab页面
            needQuickNav: true, //是否显示快捷导航

            position: 'bottom', // tab显示的位置，头部：'top'，底部：'bottom'，默认为'bottom'
            tabWidth: 115 // 默认一个tab的宽度，没有固定tab时必须设置
        });
        // 重写遮罩实现
        TabsNav._$pageCover = createMainContentCover();
        // 实现tab与菜单联动
        TabsNav.onTabActive = function (id) {
            id = id.replace(/^tab-/, '');
            var $curMenuItem = $('#left-menu-'+id);
            $curMenuItem.addClass('active').siblings().removeClass('active');
        };
    } else {
        console.error('The TabsNav is required! , please add the "frame/fui/js/widgets/tabsnav/tabsnav.js" before theme\'s javascript file');
    }
})(this, jQuery);

// userinfo
(function (win, $) {
    var $logo = $('#sys-logo-img'),
        $userInfo = $('#user-info'),
        $homeBtn = $('#home-btn');

    // 获取用户信息
    _getData_('getUserInfo').done(function (data) {
        initUserInfo(data);
    });

    _getData_('getPageInfo').done(function (data) {
        initPageInfo(data);
    });

    var initUserInfo = function(data) {
        // 用户guid和name是E讯必须要使用的 需要记录下来
        /* global _userName_, _userGuid_ */
        win._userName_ = data.name;
        win._userGuid_ = data.guid;
        $userInfo.find('.user-info-name').text(data.name);
        $userInfo.find('.user-info-name').attr('title',data.name);
        // var $userInfoDetail = $('#user-info-detail');
        // $userInfoDetail
        //     .find('.user-name')
        //     .text(data.name)
        //     .attr('title', data.name);
        // $userInfoDetail
        //     .find('.user-dept')
        //     .text(data.ouName)
        //     .attr('title', data.ouName);
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
        win.goHome = function() {
            if(home.id) {
                TabsNav.addTab(home);
            }
        }
        if(home.id) {
            TabsNav.addTab(home);
        }

        // 触发 afterPageInfo 事件
        _datacenterEvent_.fire('afterPageInfo');
    };
    // 修改 start
    var $cover = createMainContentCover();
    $userInfo
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
            if ($this.hasClass('logout')) {
                // 注销
                mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
                    if (action == 'ok') {
                        window.location.href = Util.getRightUrl('rest/logout?isCommondto=true');
                    }
                });
            } else if ($this.hasClass('change-pwd')) {
                // 修改密码
            	dealLinkOpen({
                    id: "change-pwd",
                    name: "修改密码",
                    url: "frame/pages/basic/personalset/mypasswordmodify",
                    openType: "tabsnav"
                })
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
    // 修改 end
    $homeBtn.on('click',function() {
    	window.location.href=Util.getRightUrl("./datacenter");
    })
})(this, jQuery);

// left-menu
(function (win, $) {
    var $leftNav = $('#left-nav'),
        $leftMenuList = $('#left-menu-list'),
        $leftMenuInnerlist = $('#left-menu-innerlist'),
        $subMenuList = $('#sub-menu-list'),
        $cover = createMainContentCover();
        var modelcode=Util.getUrlParams('code');
    var leftMenuData = [];
    // 获取菜单
    function getLeftMenu() {
        Util.ajax({
            url: epoint.dealRestfulUrl(getDataUrl + '/getMenu'),
            data: {
            	  query: 'sub',
                  code: modelcode
            }
        }).done(function(data) {
            data.forEach(function(item,i) {
                item.index = i;
            })
            leftMenuData = data;
            if(data.length > 4) {
                $leftNav.find('.left-menu-top,.left-menu-bottom').removeClass('hidden');
            }
            $leftMenuInnerlist.html(getTplHtml('left-menu-itemtpl',{list: data}));

            // 展示左侧第一个菜单
            for(var i = 0,len = data.length; i < len; i++) {
                var item = data[i];
                console.log(item.url,item.openType);
                if(item.url && item.openType == 'tabsnav') {
                    TabsNav.addTab({
                        id: item.code,
                        name: item.name,
                        openType: item.openType,
                        url:item.url
                    });
                    console.log('111',$('#left-menu-'+id));
                    $('#left-menu-'+item.code).addClass('active');
                    return;
                } else if(item.items && item.items.length){
                    for(var j = 0,len1 = item.items.length; j < len1; j++) {
                        var item1 = item.items[j];
                        if(item1.url&& item.openType == 'tabsnav') {
                            TabsNav.addTab({
                                id: item1.code,
                                name: item1.name,
                                openType: item1.openType,
                                url:item1.url
                            });
                            $('#left-menu-'+item1.code).addClass('active');
                            return;
                        }
                    }
                }
            }
        })
    }
    win.getLeftMenu = getLeftMenu;
    getLeftMenu();

    // 点击向下滚动
    $leftNav.on('click','.left-menu-bottom',function() {
        var boxHeight = $leftMenuList.outerHeight(),
            innerHeight = $leftMenuInnerlist.outerHeight(),
            mintop = boxHeight - innerHeight,
            activeTop = Number($leftMenuInnerlist.css('margin-top').split('px')[0]);
        if(activeTop - boxHeight < mintop) {
            $leftMenuInnerlist.css({'margin-top': mintop + 'px'});
        } else {
            $leftMenuInnerlist.css({'margin-top': (activeTop - boxHeight) + 'px'});
        }
    })
    // 点击向上滚动
    .on('click','.left-menu-top',function() {
        var boxHeight = $leftMenuList.outerHeight(),
            activeTop = Number($leftMenuInnerlist.css('margin-top').split('px')[0]);
        if(activeTop + boxHeight > 0) {
            $leftMenuInnerlist.css({'margin-top': '0px'});
        } else {
            $leftMenuInnerlist.css({'margin-top': (activeTop + boxHeight) + 'px'});
        }
    })
    // 点击一级菜单
    .on('click','.left-menu-item',function() {
        $cover.addClass('hidden');
        var $this = $(this),
            id = $this.data('id'),
            url = $this.data('url'),
            name = $this.data('name'),
            index = $this.data('index'),
            openType = $this.data('opentype'),
            ttop = $this.offset().top,
            cheight = document.body.clientHeight;
        $this.addClass('active').siblings().removeClass('active');
        $subMenuList.removeAttr('style').addClass('hidden');
        if(leftMenuData[index].items && leftMenuData[index].items.length) {
            $subMenuList.html(getTplHtml('sub-menu-itemtpl',{list: leftMenuData[index].items}));
            $subMenuList.css({'top':(ttop + 10) + 'px'}).removeClass('hidden');
            $cover.removeClass('hidden');
            var height = $subMenuList.outerHeight();
            if(height > (cheight - ttop - 50)) {
                $subMenuList.css({'height': (cheight - ttop - 50) + 'px'})
            }
        }

        if(url) {
            dealLinkOpen({
                id: id,
                name: name,
                url: url,
                openType: openType
            })
        }
    })
    // 点击二级菜单
    .on('click','.sub-menu-item',function() {
        var $this = $(this),
            id = $this.data('id'),
            url = $this.data('url'),
            name = $this.data('name'),
            openType = $this.data('opentype');
        dealLinkOpen({
            id: id,
            name: name,
            url: url,
            openType: openType
        })
        $subMenuList.addClass('hidden');
        $cover.addClass('hidden');
        // $('.left-menu-item.active').removeClass('active');
    })
    $('body').on('click',function(e) {
        if (!$(e.target).closest('.left-menu-item,#sub-menu-list').length) {
            $subMenuList.addClass('hidden');
            $cover.addClass('hidden');
            // $('.left-menu-item.active').removeClass('active');
        }
    })

})(this, jQuery);