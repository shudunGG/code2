(function (win, $) {
    var TABS_ITEM_TPL = '<li class="tabsnav-tabs-item{{^closeIcon}} fixed{{/closeIcon}}" id="tab-{{id}}" data-id="tab-{{uid}}" data-target="tab-content-{{id}}"><span class="tabsnav-tabs-name" title="{{name}}">{{name}}</span>{{#refresh}}<i class="tabsnav-tabs-refresh"></i>{{/refresh}}{{#closeIcon}}<i class="tabsnav-tabs-close"></i>{{/closeIcon}}</li>',
        TABS_QUICK_NAV_ITEM_TPL = '<li class="tabsnav-quicknav-item" id="tab-{{id}}" data-id="tab-{{uid}}">{{name}}</li>',
        TABS_CONTENT_TPL = '<iframe class="tab-content hidden" id="tab-content-{{id}}" src="{{url}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>',
        SCROLL_BTN_TPL = '<div class="tabsnav-scroll-btn {{position}} invisible"></div>',
        CONTEXT_MENU_TPL = '<div class="tabsnav-contextmenu hidden" id="{{id}}"><ul>{{#items}}{{#text}}<li class="tabsnav-contextmenu-item" role="{{role}}">{{text}}</li>{{/text}}{{^text}}<li class="tabsnav-contextmenu-item sep"></li>{{/text}}{{/items}}</ul></div>',

        TABS_WRAPPER = '<div class="tabsnav-wrapper l clearfix"><div class="tabsnav-fixed l"><ul class="tabsnav-tabs-list clearfix"</ul></div><div class="tabsnav-variable l"><ul class="tabsnav-tabs-list clearfix"></ul></div></div>',
        QUICK_NAV_TRIGGER = '<span class="tabsnav-quicknav-trigger disabled"></span>',
        QUICK_NAV_BOX = '<div class="tabsnav-quicknav-box"><ul class="tabsnav-quicknav-list"></ul></div>',

        M = Mustache;

    var defaultConfig = {
        needScrollBtn: false, //是否显示左右滚动按钮
        scrollBtnSite: 'sides', //左右滚动按钮的位置，两侧：'sides',右侧：'right'
        smoothItems: 3, //点击左右滚动按钮，滑动单个tab的宽度的倍数
        needQuickNav: true, //是否显示快捷导航

        refreshOnActiveTab: false, // 激活tab时是否自动刷tab页面

        position: 'bottom', // tab显示的位置，头部：'top'，底部：'bottom'，默认为'bottom'
        tabWidth: 112 // 默认一个tab的宽度
    };

    var tabDefaultSetting = {
        closeIcon: true,
        refresh: false
    };

    // 调用addTab后自动调用tab页面内的回调
    // 该需求由OA提出，在OA邮件中，看邮件和写邮件是同一个页面，但是不同地方点击后显示的可能是看邮件功能，也可能是写邮件功能。
    // 所以需要在addTab后执行一个回调，根据传递的参数决定显示哪个功能
    var onContentLoad = function (iframe, param, isActiveTab) {
        // 防止弹出页面跨域而报错导致无法后续不响应
        try {
            if (iframe.contentWindow.afterTabInit) {
                iframe.contentWindow.afterTabInit(param, isActiveTab);
            }
        } catch (e) {
            console.error('跨域了!' + e.message);
        }
    };

    var EpTabsNav = function (cfg) {
        // tabs存放容器
        this.$tabContainer = $(cfg.tabContainer);
        // 内容iframe存放容器
        this.$ifrContainer = $(cfg.ifrContainer);

        if (!this.$tabContainer.length) {
            throw new Error('EpTabsNav组件配置项tabContainer配置错误！未找到对应的dom元素！');
        }

        if (!this.$ifrContainer.length) {
            throw new Error('EpTabsNav组件配置项ifrContainer配置错误！未找到对应的dom元素！');
        }
        this.cfg = $.extend({}, defaultConfig, cfg);


        // css由主界面自己引用，以避免ie下动态插入css顺序问题
        // var link = document.createElement('link');
        // link.id = 'tabsnav-style';
        // link.rel = 'stylesheet';
        // link.href = Util.getRightUrl('fui/pages/tabsnav/tabsnav.css');

        // var self = this;
        // // css加载完成后需要重新计算tab的宽度
        // link.onload = function () {
        //     self._calcSize();
        //     self.adjustSize();

        // };
        // var themeSkinLink = document.getElementById('theme-skin');
        // if (themeSkinLink) {
        //     $(link).insertBefore(themeSkinLink);
        // } else {
        //     document.head.appendChild(link);
        // }

        // Util.loadCss('fui/pages/tabsnav/tabsnav.css', '#theme-skin', 'Before', true);

        this._init();
    };

    $.extend(EpTabsNav.prototype, {
        _init: function () {
            this.$tabsWrapper = $(TABS_WRAPPER).appendTo(this.$tabContainer);

            if (this.cfg.needQuickNav) {
                this.$quickNavTrigger = $(QUICK_NAV_TRIGGER).appendTo(this.$tabContainer);
                // 放到与tab容器同级，以方便位置计算
                this.$quickNavBox = $(QUICK_NAV_BOX).appendTo(this.$tabContainer.parent());
                this.$quickNavList = $('.tabsnav-quicknav-list', this.$quickNavBox);
            }

            this.$fixedTabsList = $('.tabsnav-fixed > .tabsnav-tabs-list', this.$tabsWrapper);
            this.$variableTabsWrapper = $('.tabsnav-variable', this.$tabsWrapper);
            this.$variableTabsList = $('.tabsnav-tabs-list', this.$variableTabsWrapper);

            if (this.cfg.needScrollBtn) {
                this.$leftScrollBtn = $(M.render(SCROLL_BTN_TPL, {
                    position: 'left'
                }));
                this.$rightScrollBtn = $(M.render(SCROLL_BTN_TPL, {
                    position: 'right'
                }));

                if (this.cfg.scrollBtnSite == 'sides') {
                    this.$leftScrollBtn.insertBefore(this.$variableTabsWrapper);
                    this.$rightScrollBtn.insertAfter(this.$variableTabsWrapper);
                } else {
                    this.$rightScrollBtn.insertAfter(this.$variableTabsWrapper);
                    this.$leftScrollBtn.insertAfter(this.$variableTabsWrapper);
                }
            }

            this.tabsCache = {};
            this.fixedTabs = {};
            this.variableTabs = {};
            this._lastFixedTabId = '';
            this._activeId = '';

            var self = this;
            // 右键菜单
            this.contextMenu = new ContextMenu({
                items: [{
                        text: '关闭',
                        role: 'close-self',
                        click: function (options) {
                            var id = options.tabId;
                            self.removeTab(id);
                        }
                    }, {
                        icon: 'remove',
                        text: '关闭其他页',
                        role: 'close-others',
                        click: function (options) {
                            var id = options.tabId;
                            self.removeAll(id);
                        }
                    },
                    {
                        icon: 'remove',
                        text: '关闭全部',
                        role: 'close-all',
                        click: function (options) {
                            self.removeAll();
                        }
                    },
                    {
                        text: '刷新',
                        role: 'refresh-self',
                        click: function (options) {
                            var id = options.tabId;
                            self.refreshTabContent(id);
                        }
                    }
                ]
            });

            this._calcSize();

            this._bindEvent();
        },

        _bindEvent: function () {
            var timer,
                self = this;
            $(win).on('resize', function () {
                clearTimeout(timer);
                // self.adjustSize();
                // self.activeTab(self._activeId);
                timer = setTimeout(function () {
                    self.adjustSize();
                    self.activeTab(self._activeId);
                }, 200);
            });

            $('body').on('click', function (e) {
                var $target = $(e.target);
                if (!$target.hasClass('tabsnav-quicknav-trigger')) {
                    self._hideQuickNavBox();
                }

            });
            this.$tabsWrapper.on('click', '.tabsnav-tabs-item', function (e) {
                // 点击激活
                var id = this.id;
                self.activeTab(id);

            }).on('click', '.tabsnav-tabs-close', function (e) {
                // 点击关闭
                var id = this.parentNode.getAttribute('data-id');
                self.removeTab(id);

            }).on('click', '.tabsnav-tabs-refresh', function (e) {
                // 刷新
                e.stopPropagation();
                this.className = 'tabsnav-tabs-refresh rotate';
                var id = this.parentNode.getAttribute('data-id');

                self.refreshTabContent(id);
                var that = this;
                setTimeout(function() {
                    that.className = 'tabsnav-tabs-refresh';
                },3000);

            }).on('contextmenu', '.tabsnav-tabs-item', function (event) {
                //  右键菜单
                var tabId = this.id;

                // 固定项目不响应
                if (self.fixedTabs[tabId]) return;

                var $this = $(this),
                    offset = $this.offset(),
                    positionX = offset.top,
                    positionY = offset.left;

                if (self.cfg.position == 'bottom') {
                    positionX -= (self._contentMenu_h + 1);
                } else {
                    positionX += self._tab_h + 1;
                }

                self.contextMenu.setOptions('tabId', tabId).show({
                    x: positionX,
                    y: positionY
                });

                self._showPageCover();

                return false;
            });

            if (this.cfg.needQuickNav) {
                this.$quickNavTrigger.on('click', function () {
                    if ($(this).hasClass('active')) {
                        self._hideQuickNavBox();
                    } else {
                        self._showQuickNavBox();
                    }
                });

                this.$quickNavList.on('click', '.tabsnav-quicknav-item', function () {
                    var id = this.getAttribute('data-id');

                    self.activeTab(id);
                });
            }

            if (this.cfg.needScrollBtn) {
                this.$leftScrollBtn.on('click', function () {
                    self._scrollTabs(-self._scroll_w_once);
                });

                this.$rightScrollBtn.on('click', function () {
                    self._scrollTabs(self._scroll_w_once);
                });
            }
        },

        addTab: function (cfg, withoutActive) {
            var data = $.extend({}, tabDefaultSetting, cfg),
                tabId = 'tab-' + data.id,
                tabHtml,
                quickNavData,
                $tabContent,
                $tab,
                iframe;

            // 兼容下忘记传id的情况
            if(!data.id) {
                data.id = Util.uuid();
                tabId = 'tab-' + data.id;
            }

            // 不存在则添加
            if (!this.tabsCache[tabId]) {
                // 处理url，补全路径
                if (!withoutActive) {
                    data.url = Util.getRightUrl(data.url);
                } else {
                    data.realUrl = Util.getRightUrl(data.url);
                    data.url = 'about:blank';
                }

                // tab模板要渲染到两个地方 id不能相同 uid用以标识其二者相同的id
                data.uid = data.id;

                tabHtml = Util.clearHtml(M.render(TABS_ITEM_TPL, data));

                // 可关闭，则为非固定tab
                if (data.closeIcon) {
                    // 插入到底部和右侧
                    $(tabHtml).appendTo(this.$variableTabsList);

                    if (this.cfg.needQuickNav) {
                        // id不能一致 需要处理一下
                        quickNavData = $.extend({}, data);
                        quickNavData.id += '-quicknav';
                        $(Util.clearHtml(M.render(TABS_QUICK_NAV_ITEM_TPL, quickNavData))).appendTo(this.$quickNavList);
                        quickNavData = null;

                        this._adjustQuickNavTrigger(false);
                    }

                    this.variableTabs[tabId] = true;


                } else {
                    $(tabHtml).appendTo(this.$fixedTabsList);
                    // 记录此固定项目id
                    this.fixedTabs[tabId] = true;
                    this._lastFixedTabId = tabId;
                }

                $tabContent = $(Util.clearHtml(M.render(TABS_CONTENT_TPL, data))).appendTo(this.$ifrContainer);

                iframe = $tabContent[0];

                // 添加tab加载后的回调
                if (Util.browsers.isIE && !Util.browsers.isIE11) {
                    iframe.onreadystatechange = function () {
                        if (this.readyState && this.readyState == 'complete') {
                            onContentLoad(iframe, cfg.param, false);
                        }
                    };
                } else {
                    iframe.onload = function () {
                        onContentLoad(iframe, cfg.param, false);
                    };

                }

                this.tabsCache[tabId] = data;

                if (withoutActive) {
                    this.tabsCache[tabId].notInit = true;
                }

                this.adjustSize();
            } else {
                // 若已加载过，也需要再执行一遍回调
                $tab = $('#' + tabId);
                if ($tab) {
                    onContentLoad($('#' + $tab.data('target'))[0], cfg.param, true);
                }
            }

            if (!withoutActive) {
                this.activeTab(tabId);
            }
        },

        activeTab: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id，此处需兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var $tab = $('#' + id),
                $tabCon,
                data;
            if ($tab.length) {
                $tabCon = $('#' + $tab.data('target'));
                data = this.tabsCache[id];

                // 非固定项目需要确保可见
                if (!this.fixedTabs[id]) {
                    this.adjustTabPosOnActive(id);
                }

                if ($tab.hasClass('active')) {
                    return;
                }

                this.$tabsWrapper.find('li.active').removeClass('active');
                $tab.addClass('active');

                this._activeId = id;

                if (data.notInit) {
                    $tabCon[0].src = data.realUrl;
                    data.notInit = false;
                } else if(this.cfg.refreshOnActiveTab) {
                    $tabCon[0].src = $tabCon[0].src;
                }
                $tabCon.removeClass('hidden')
                    .siblings('.tab-content')
                    .addClass('hidden');
                if (this.cfg.menuLinked) {
                    this.reverseActive(id);
                }

                if(win.TabsNav && TabsNav.onTabActive) {
                    TabsNav.onTabActive(id);
                }
            }
        },

        // 反向激活菜单
        reverseActive: function(id) {
            var _id = id;
            if(_id.indexOf('tab-') ===0) {
                _id = _id.split('tab-')[1];
            }
            var menuConfig = $.extend({}, {id: _id}, this.cfg.reserveConfig);

            var _this = this;
            enableMenu(menuConfig);

            // 激活父级菜单
            function enableMenu(opt) {

                var id = opt.id, // 菜单ID
                    liClass = opt.liClass || 'left-menu-item', // 左侧菜单所有 li 带有的 class
                    liActiveClass = opt.liActiveClass || 'opened', // 左侧菜单所有 li 展开时的 class
                    linkClass = opt.linkClass || 'left-menu-link', // 左侧 a 标签带有的 class
                    linkActiveClass = opt.linkActiveClass || 'active', // 左侧 a 标签激活的样式 class
                    idAttr = opt.idAttr || 'data-id', // 左侧 a 标签上的 id 属性
                    liTopClass = opt.liTopClass || 'level-1', // 左侧顶级菜单的 li 的class
                    leftUlClass = opt.leftUlClass || 'left-menu-wrap', // 左侧菜单最外层Ul的 class
                    leftUlIdPre = opt.leftUlIdPre || 'left-menu-', // 左侧菜单最外层Ul的id的前缀
                    leftHiddenClass = opt.leftHiddenClass || 'hidden'; // 左侧菜单最外层Ul显隐的class

                $('.' + linkClass + '.' + linkActiveClass).removeClass(linkActiveClass);

                var $currentLink = $("."+ linkClass + "[" + idAttr + "='" + id + "']"),
                    $currentLi = $currentLink.parent();   
                
                // 获取当前激活的菜单
                // function getActiveLeftMenu (){
                //     var $leftMenuWrap = $('.left-menu-wrap');
                //     for (var i = 0; i < $leftMenuWrap.length; i++) {
                //         var $item = $($leftMenuWrap[i]);
                //         if (!$item.hasClass('hidden')) {
                //             $activeLeftMenu = $item;
                //             break;
                //         }
                //     }
                // }
                // 先切换左侧菜单
                // if(related) {
                //     // debugger;
                //     // 顶部一级菜单
                //     var $topCurrent = $('.' + topLiClass + "[" + idAttr + "='" + id + "']");

                //     if($topCurrent.hasClass(topLiClass)) {
                //         $('.left-menu-sub-list').hide();
                //         $('.'+ liClass +'.'+ liTopClass).removeClass('opened');
                //         // 如果是一级菜单
                //         // recoveryLeft();
                //         $('.' + topLiClass).removeClass(topLiActiveClass);
                //         $topCurrent.addClass(topLiActiveClass);
                //         if ($topCurrent.data('hassub')) {
                //             $('#main').removeClass('left-none');
                //         } else {
                //             $('#main').addClass('left-none');
                //         }
                //         var $currentLeftUl = $('#' + leftUlIdPre + id);
                //         $('.' + leftUlClass).addClass(leftHiddenClass);
                //         $currentLeftUl.removeClass(leftHiddenClass);
                //         // getActiveLeftMenu();
                //         // $activeLeftMenu = $currentLeftUl;
                //         // $('.main-content-cover').addClass('hidden');
                //         // $menuCover.addClass('hidden');
                //     } else {
                //         // 二级菜单的话先显示
                //         // expandLeft();
                //         if(!$currentLink.hasClass(linkClass)) {
                //             // 处理 我的首页 加载的时候没有对应的菜单
                //             $('#main').addClass('left-none');
                //             $('.' + topLiClass).removeClass(topLiActiveClass);
                //             return false;
                //         }
                //         // 先显示菜单
                //         $('#main').removeClass('left-none');
                //         // 不是一级菜单，则左侧的菜单向上查找到一级菜单的 id
                //         var $currentLeftUl = $currentLi.parents('.' + leftUlClass),
                //             _currentLeftUlId = $currentLeftUl[0].id,
                //             _currentTopId = _currentLeftUlId.split(leftUlIdPre)[1];

                //         var _topCurrentId = $('.'+topLiClass+'.'+topLiActiveClass).data('id'); // 当前选中的一级菜单id

                //         if(_currentTopId === _topCurrentId) {
                //             activeLi();
                //         } else {
                //             $topCurrent = $('.' + topLiClass + "[" + idAttr + "='" + _currentTopId + "']");
                //             $('.' + topLiClass).removeClass(topLiActiveClass);
                //             $topCurrent.addClass(topLiActiveClass);
                //             // extendEvent({
                //             //     name: $topCurrent.text()
                //             // });
                //             $('.' + leftUlClass).addClass(leftHiddenClass);
                //             $currentLeftUl.removeClass(leftHiddenClass);
                //             // getActiveLeftMenu();
                //             // $activeLeftMenu = $currentLeftUl;
                //             activeLi();
                //         }
                //     }
                // }
                // 二级菜单的话先显示
                if(!$currentLink.hasClass(linkClass)) {
                    // 处理 我的首页 加载的时候没有对应的菜单
                    $('#main').addClass('left-none');
                    // $('.' + topLiClass).removeClass(topLiActiveClass);
                    return false;
                }
                // 先显示菜单
                $('#main').removeClass('left-none');
                // 不是一级菜单，则左侧的菜单向上查找到一级菜单的 id
                var $currentLeftUl = $currentLi.parents('.' + leftUlClass);
                    // _currentLeftUlId = $currentLeftUl[0].id;
                    // _currentTopId = _currentLeftUlId.split(leftUlIdPre)[1];

                // var _topCurrentId = $('.'+topLiClass+'.'+topLiActiveClass).data('id'); // 当前选中的一级菜单id

                // if(_currentTopId === _topCurrentId) {
                //     activeLi();
                // } else {
                    // $topCurrent = $('.' + topLiClass + "[" + idAttr + "='" + _currentTopId + "']");
                    // $('.' + topLiClass).removeClass(topLiActiveClass);
                    // $topCurrent.addClass(topLiActiveClass);
                    // extendEvent({
                    //     name: $topCurrent.text()
                    // });
                    $('.' + leftUlClass).addClass(leftHiddenClass);
                    $currentLeftUl.removeClass(leftHiddenClass);
                    // getActiveLeftMenu();
                    // $activeLeftMenu = $currentLeftUl;
                    activeLi();
                // }

                // 判断是否是一级菜单
                // 判断一级菜单是否有二级菜单，
                // 判断一级菜单是否是tabsnav打开
                
                function activeLi() {
                    if (!$currentLink.data('hassub')) {
                        // 添加 a 标签激活的样式
                        $currentLink.addClass(linkActiveClass);
                    }
                    // 移除所有展开的li的class
                    $('.' + liClass).removeClass(liActiveClass);
                    $('.left-menu-sub-list').hide();
                    expandLi($currentLi);
                    // 递归打开父级菜单
                    function expandLi($li) {
                        if(!$li.hasClass(liTopClass)) {
                            var $currentUl = $li.parent(),
                                $parentLi = $currentUl.parent();
                                // $parentLi = $currentUl.parent().parent().parent();
                            // console.log(2,$parentLi);
                            if(!$parentLi.hasClass(liTopClass)) {
                                $parentLi.addClass(liActiveClass);
                                $parentLi.children('.left-menu-sub-list').show();
                                // $currentUl.show();
                                expandLi($parentLi);
                            } else {
                                $parentLi.addClass(liActiveClass);
                                $parentLi.children('.left-menu-sub-list').show();
                                // $currentUl.show();
                                if($parentLi.hasClass(liActiveClass) && $('#main').hasClass('left-narrow')) {
                                    // _this._showPageCover();
                                    // $menuCover.removeClass('hidden');
                                } else {
                                    // $('.main-content-cover').addClass('hidden');
                                    // $menuCover.addClass('hidden');
                                }
                            }
                        } else {
                            // $('.main-content-cover').addClass('hidden');
                            // $menuCover.addClass('hidden');
                        }
                    }
                }
            }
        },
        getActiveTab: function () {
            var data = this.tabsCache[this._activeId];

            return new Tab(this, data);
        },

        getActiveIframe: function () {
            var $li = this.$tabsWrapper.find('#' + this._activeId),
                frameId = $li.data('target');

            return $('#' + frameId, this.$ifrContainer)[0];
        },

        removeTab: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id，此处需兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var $tab = $('#' + id),
                $tabCon = $('#' + $tab.data('target')),
                $prev = $tab.prev(),
                $next = $tab.next(),
                callback = this.tabsCache[id] ? this.tabsCache[id].closeCallback : undefined;

            if ($tab.hasClass('active')) {
                if ($prev.length) {
                    this.activeTab($prev[0].id);
                } else if ($next.length) {
                    this.activeTab($next[0].id);
                } else {
                    // 高亮最后一个固定tab
                    this.activeTab(this._lastFixedTabId);
                }
            }

            // 移除两处的tab和内容
            $tab.remove();

            // 清理tab内容页iframe
            Util.clearIframe($tabCon);
            $tabCon.remove();

            // tab关闭回调
            if (typeof callback === 'function') {
                callback();
            }

            delete this.tabsCache[id];
            delete this.variableTabs[id];
            
            if (this.cfg.needQuickNav) {
                this.$quickNavList.find('#' + id + '-quicknav').remove();
                this._adjustQuickNavTrigger();
            }

            this.adjustSize();
        },
        // remove all tabs except fixed tabs
        removeAll: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id，此处需兼容处理
            if (id && id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var self = this;

            this.$variableTabsList.children().each(function (i, li) {
                var tabId = li.id;

                if (tabId != id) {
                    self.removeTab(tabId);
                }
            });

            if (!id) {
                this.activeTab(this._lastFixedTabId);
            }
        },

        adjustSize: function () {
            var tabs_w = this._getTabWidth() * this.$variableTabsList.children().length + 1,
                // 最大可视宽度 = 父容器宽度-tab外元素宽度-固定tab宽度
                max_w = this.$tabContainer.width() - this._rest_w - this.$fixedTabsList.outerWidth(true) - 1;

            this._tabs_w = tabs_w;
            this._max_w = max_w;

            if (tabs_w > 0) {
                this.$variableTabsList.css('width', tabs_w);
            }
            this.$variableTabsWrapper.css('width', max_w);

            if (max_w > tabs_w) {
                this.$variableTabsList.stop(true).animate({
                    marginLeft: 0
                }, 500);
                // this.$variableTabsWrapper.css('width', 'auto');

            } else {
                this.$variableTabsList.stop(true).animate({
                    marginLeft: max_w - tabs_w
                }, 500);
                // this.$variableTabsWrapper.css('width', max_w);
            }

            if (this.cfg.needScrollBtn) {
                this._adjustScrollBtnVisible();
            }
        },
        adjustTabPosOnActive: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id，此处需兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var self = this,
                $li = $('#' + id),
                $prev_lis = $li.prevAll(),
                tab_w = this._getTabWidth(),
                scroll_w = Math.ceil(Math.abs(parseFloat(this.$variableTabsList.css('margin-left'), 10))),
                marginLeft = scroll_w,
                prev_w = tab_w * $prev_lis.length,
                max_w = this._max_w,
                tabs_w = this._tabs_w;

            if (tabs_w <= max_w) { // 可视区域大于tabs宽度，不需滚动
                marginLeft = 0;
            } else if (prev_w <= scroll_w) { // 激活tab在左侧隐藏部分，则需将激活tab移到可视区域有最左侧
                marginLeft = prev_w;
            } else if (prev_w >= max_w + scroll_w || prev_w + tab_w > max_w + scroll_w) { // 激活tab在右侧隐藏部分，则需将激活tab移到可视区域最右侧
                marginLeft = prev_w + tab_w - max_w;
            } else if (tabs_w - scroll_w < max_w) { // 存在滚动并且tabs的最右侧在可视区域最右侧的左边，则需要将tabs的最右侧移到可视区域的最右侧
                marginLeft = tabs_w - max_w;
            }

            // 只有在原始的滚动距离和新的不一致时在需要滚动
            if (scroll_w == marginLeft) {
                return;
            }
            this.$variableTabsList.stop(true).animate({
                marginLeft: -marginLeft
            }, 500, function () {
                self._adjustScrollBtnVisible();
            });
        },

        refreshTabContent: function (id) {
            // id 应该始终指菜单项目的id，而非tab-id，此处需兼容处理
            if (id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }

            var $tab = $('#' + id),
                $tabCon = $('#' + $tab.data('target'));
            // $tabCon[0].contentWindow.location.reload();
            // 不要直接reload，而是赋值为原地址，可防止页面报错后 刷新仍是错误页面的地址。
            $tabCon[0].src = 'about:blank';
            $tabCon[0].src = Util.getRightUrl(this.tabsCache[id].realUrl || this.tabsCache[id].url);
        },

        _getTabWidth: function () {
            if (!this._tab_w) {
                this._tab_w = this.$fixedTabsList.children().eq(0).outerWidth(true) || this.cfg.tabWidth;
            }

            return this._tab_w;

        },

        _calcSize: function () {
            this._tab_w = this.$fixedTabsList.children().eq(0).outerWidth(true) || this.cfg.tabWidth;

            this._tab_h = this.$tabContainer.height();

            // 除tab外的其他元素的宽度
            this._rest_w = 0;

            if (this.cfg.needQuickNav) {
                this._rest_w += this.$quickNavTrigger.outerWidth(true);
            }

            if (this.cfg.needScrollBtn) {
                this._rest_w += this.$leftScrollBtn.outerWidth(true) * 2;
                this._scroll_w_once = this._tab_w * this.cfg.smoothItems;
            }

            this._contentMenu_h = this.contextMenu._getSize().height;
        },

        _showQuickNavBox: function () {
            if(!this.cfg.needQuickNav) {
                return;
            }

            // 没有非固定tab，则不需要做任何事情
            if($.isEmptyObject(this.variableTabs)){
                return;
            }

            this.$quickNavTrigger.addClass('active');

            var $tabContainer = this.$tabContainer,
                attr;

            if (this.cfg.position == 'bottom') {
                attr = {
                    bottom: $tabContainer.outerHeight() + 1
                };
                this.$quickNavBox.css('top', 'auto');
            } else {
                attr = {
                    top: $tabContainer.outerHeight() + 1
                };
                this.$quickNavBox.css('bottom', 'auto');
            }

            this.$quickNavBox.stop(true).removeClass('invisible').animate(attr, 200);

            this._showPageCover();
        },

        _hideQuickNavBox: function () {
            if(!this.cfg.needQuickNav) {
                return;
            }
            this.$quickNavTrigger.removeClass('active');

            var $quickNavBox = this.$quickNavBox,
                attr;

            if (this.cfg.position == 'bottom') {
                attr = {
                    bottom: -$quickNavBox.outerHeight()
                };
            } else {
                attr = {
                    top: -$quickNavBox.outerHeight()
                };
            }

            $quickNavBox.stop(true).animate(attr, 200, function () {
                // 隐藏后让其不可见，以避免下次新增tab时由于高度变大而显示到可是区域内
                $quickNavBox.addClass('invisible');
            });

            this._hidePageCover();
        },

        _adjustQuickNavTrigger: function(disable) {
            if(!this.cfg.needQuickNav) {
                return;
            }

            if(disable === undefined) {
                disable = $.isEmptyObject(this.variableTabs);
            }

            if(disable === true) {
                this.$quickNavTrigger.addClass('disabled');
            } else {
                this.$quickNavTrigger.removeClass('disabled');
            }

        },

        _scrollTabs: function (dist) {
            var ml = Math.ceil(Math.abs(parseFloat(this.$variableTabsList.css('margin-left'), 10))),
                new_ml = ml + dist,
                max_ml = this._tabs_w - this._max_w,
                self = this;

            if (max_ml > 0) {
                if (new_ml < 0) {
                    new_ml = 0;
                } else if (new_ml > max_ml) {
                    new_ml = max_ml;
                }
            } else {
                new_ml = 0;
            }
            // 只有在原始的滚动距离和新的不一致时在需要滚动
            if (ml == new_ml) {
                return;
            }

            this.$variableTabsList.stop(true).animate({
                marginLeft: -new_ml
            }, 500, function () {
                self._adjustScrollBtnVisible();
            });

        },

        _adjustScrollBtnVisible: function () {
            if(!this.cfg.needScrollBtn) {
                return;
            }
            var tabs_w = this._tabs_w,
                max_w = this._max_w,
                ml,
                max_ml;

            if (max_w > tabs_w) {
                this.$leftScrollBtn.addClass('invisible');
                this.$rightScrollBtn.addClass('invisible');
            } else {

                this.$leftScrollBtn.removeClass('invisible');
                this.$rightScrollBtn.removeClass('invisible');

                ml = Math.ceil(Math.abs(parseFloat(this.$variableTabsList.css('margin-left'), 10)));
                max_ml = tabs_w - max_w;

                if (ml > 0) {
                    this.$leftScrollBtn.removeClass('disabled');
                } else {
                    this.$leftScrollBtn.addClass('disabled');
                }

                if (ml < max_ml) {
                    this.$rightScrollBtn.removeClass('disabled');
                } else {
                    this.$rightScrollBtn.addClass('disabled');
                }
            }
        },

        _getPageCover: function () {
            if (!this._$pageCover) {
                this._$pageCover = $('<div class="content-cover"></div>').prependTo(this.$ifrContainer);
            }

            return this._$pageCover;
        },

        _showPageCover: function () {
            this._getPageCover().removeClass('hidden');
        },
        _hidePageCover: function () {
            this._getPageCover().addClass('hidden');
        }
    });

    // Tab模型，内部使用
    var Tab = function (tabsNav, data) {
        this._tabsNav = tabsNav;
        this._data = data;
    };

    $.extend(Tab.prototype, {
        remove: function () {
            var tabId = 'tab-' + this._data.id;

            if (this._tabsNav.fixedTabs[tabId]) {
                console && console.warn('警告：固定Tab是不能删除的！');
                return;
            }

            this._tabsNav.removeTab(tabId);
        },

        getData: function () {
            var data = this._data;

            return $.extend({}, data, {
                tabId: 'tab-' + data.id
            });
        },

        refreshContent: function () {
            var tabId = 'tab-' + this._data.id;

            this._tabsNav.refreshTabContent(tabId);
        },

        active: function () {
            var tabId = 'tab-' + this._data.id;

            this._tabsNav.activeTab(tabId);
        },

        prev: function () {
            var $li = $('#tab-' + this._data.id),
                $prev = $li.prev();

            if (!$prev.length) {
                console && console.warn('已经到头了！');
                return;
            }

            return new Tab(this._tabsNav, this._tabsNav.tabsCache[$prev[0].id]);
        },

        next: function () {
            var $li = $('#tab-' + this._data.id),
                $next = $li.next();

            if (!$next.length) {
                console && console.warn('已经到尾了！');
                return;
            }

            return new Tab(this._tabsNav, this._tabsNav.tabsCache[$next[0].id]);
        }
    });

    var menuDefaultSetting = {
        id: false,
        items: [{
            text: '',
            role: '',
            icon: '',
            click: Util.noop
        }]
    };

    var ContextMenu = function (cfg) {
        this.cfg = $.extend({}, menuDefaultSetting, cfg);
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

            $widget.addClass('hidden-accessible').removeClass('hidden');

            size = {
                width: $widget.outerWidth(),
                height: $widget.outerHeight()
            };

            $widget.addClass('hidden').removeClass('hidden-accessible');

            return size;
        },

        _initView: function () {
            var c = this.cfg;

            if (!c.id) {
                c.id = Util.uuid(8, 16) + '-contextmenu';
            }

            this.$widget = $(Util.clearHtml(M.render(CONTEXT_MENU_TPL, c))).appendTo('body');

            this.size = this._getSize();
        },

        _initEvent: function () {
            var c = this.cfg,
                self = this,
                callbacks = {};

            $.each(c.items, function (i, item) {
                callbacks[item.role] = item.click;
            });

            this.$widget.on('click', '.tabsnav-contextmenu-item', function (event) {
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

        },

        hide: function () {
            this.$widget.addClass('hidden');
            return this;
        },

        show: function (pos) {
            this.$widget
                .css({
                    top: pos.x,
                    left: pos.y,
                    zIndex: Util.getZIndex()
                })
                .removeClass('hidden');

            return this;
        },

        setOptions: function (prop, val) {
            this.cfg.options[prop] = val;
            return this;
        }
    };

    win.EpTabsNav = EpTabsNav;
}(this, jQuery));