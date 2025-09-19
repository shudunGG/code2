//TabsNav
(function(win, $){

    var M = Mustache,
        // 底部tab
        BOTTOM_TAB_ITEM = '<li class="tn-tabs-nav-item" id="tab-{{id}}" data-id="tab-{{uid}}" data-target="tab-content-{{id}}"><span class="tn-tabs-nav-name" title="{{name}}">{{name}}</span> {{#refresh}}<span class="tn-tabs-nav-item-refresh"></span>{{/refresh}} {{#closeIcon}}<i class="tn-tabs-nav-item-close"></i>{{/closeIcon}}</li>',
        // 底部tab项内容页模板
        TAB_NAV_CONTENT_TPL = '<iframe class="tn-tab-content hidden" id="tab-content-{{id}}" src="{{url}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>',
        // 底部tab列表模板
        TAB_SLIDE_TPL = '<li class="tn-slide-list-item" id="tab-{{id}}" data-id="tab-{{uid}}">{{name}}</li>';

        
    win.EpTabsNav = function(cfg) {
        this.cfg = cfg;
        this._defaultCfg = {
            refreshTab: false, //默认切换tab不刷新页面
            refreshCallback: $.noop,   //refreshTab为true时，刷新后的回调
            scroller: true, //是否显示点击按钮
            scrollerSite: 'sides', //点击按钮的位置，两侧：'sides',右侧：'right'
            scrollerWidth: 20,    //点击按钮的宽度
            dropList: true, //是否显示下拉列表
            
            smoothItem: 3,  //点击左右按钮，滑动单个tab的宽度的倍数
            onDropHide: $.noop,
            onDropShow: $.noop
        };
        this._isComplete = false;
        this._tab_w = 0;
        //最大可视宽度
        this._max_w = 0;
        //当前激活的tabId
        this._activeId = null;
        this._tabDefaultSetting = {
            closeIcon: true,
            refresh: false
        };
        this._tabsCache = {}; 
        //固定项目的id集合 使用对象能更高效查找 键名为id 值 true false
        this._fixedTab = {}; 
        //最后一个固定的tabid
        this._lastFixedTabId = '';
        //右键菜单和下拉列表的方向
        this._direction = 'down';
        //resize的定时器
        this._timer = null;
        //右侧的距离
        this.rightWidth = 80;
        this._scrollWidth = 0;
        //dropList宽度的缓存
        this.cacheDropListWidth = 0;
        //两侧按钮总宽度
        this.scrollerSumWidth = 0;

        this.registeEvent = {};
        this._initEvent();
    };

    EpTabsNav.prototype = {
        constructor: EpTabsNav,
        //渲染tabslist
        _renderTabsListBox: function() {
            var tabsListDom = '<div id="tn-tabs-list" class="tn-tab-row l"><ul class="tn-bottom-tab-line clearfix"></ul></div>',
                tabsListContain = null,
                tabsBoxDom = null,
                dropListDom = '',
                scroller = this.cfg.scroller,
                dropList = this.cfg.dropList;

            //移动点击按钮，两侧 或者 右侧
            if(scroller) {
                var prevBtnDom = '<div id="tn-prev" style="width: '+ this.cfg.scrollerWidth +'px" class="tn-prev-btn l"><div class="tn-prev"></div></div>',
                    nextBtnDom = '<div id="tn-next" style="width: '+ this.cfg.scrollerWidth +'px" class="tn-next-btn l"><div class="tn-next"></div></div>';

                if(this.cfg.scrollerSite === 'sides') {
                    tabsListContain = prevBtnDom + tabsListDom + nextBtnDom;
                } else {
                    tabsListContain = tabsListDom + prevBtnDom + nextBtnDom;
                }
            } else {
                tabsListContain = tabsListDom;
            }

            //下拉列表 是否显示
            if(dropList) {

                dropListDom = '<div id="tn-bottom-drop" class="tn-bottom-drop r">'
                                +'<div class="tn-drop-btn"></div>'
                                +'<div class="tn-bottom-slide-box" id="tn-bottom-slide-box">'
                                    +'<ul class="tn-slide-list clearfix"></ul>'
                                +'</div>'
                            +'</div>';
            }

            //最终
            tabsBoxDom = '<div id="tn-all-tabs-list" class="tn-bottom-tab-box l clearfix">'
                                +'<div class="l">'
                                    +'<ul id="tn-tabs-fixed-list" class="tn-my-desk clearfix"></ul>'
                                +'</div>'
                                + tabsListContain
                        + '</div>' + dropListDom;
            
            this.$tabsContainer.html(tabsBoxDom);

            //$ 对象
            this.$allTabList = $('#tn-all-tabs-list'),
            this.$tabListWrap = $('#tn-tabs-list'),
            this.$tabList = this.$tabListWrap.find('.tn-bottom-tab-line'),
            this.$tabFixList = $('#tn-tabs-fixed-list');

            //显示两侧按钮
            if(scroller) {
                var $prevBtn = $('#tn-prev'),
                    $nextBtn = $('#tn-next');
                this.$prevBtnCls = $('.tn-prev', $prevBtn);
                this.$nextBtnCls = $('.tn-next', $nextBtn);
                this.scrollerSumWidth = this.cfg.scrollerWidth * 2;
                this._hideAllBtn();
            }

            if(dropList) {
                this.$dropBox = $('#tn-bottom-drop');
                this.$dropPanel = $('#tn-bottom-slide-box');
                this.$dropList = this.$dropPanel.find('.tn-slide-list');
            }

            this._calcMaxW();

            tabsListDom = null;
            tabsListContain = null;
            tabsBoxDom = null;

            this._initClickEvent();
        },
        //计算可显示的最大宽度
        _calcMaxW: function() {
            //空白区域总宽度
            if(this.cfg.dropList){
                this.cacheDropListWidth = this.cacheDropListWidth ? this.cacheDropListWidth : this.$dropBox.outerWidth();

                this.rightWidth = this.cacheDropListWidth + this.scrollerSumWidth;
            } else {
                this.rightWidth = this.scrollerSumWidth;
            }
            this._max_w =  $(this.cfg.tabsContainer).width() - this.rightWidth - this.$tabFixList.outerWidth(true) - 1;
        },
        _getTabId: function(id) {
            // id 应该始终指菜单项目的id，而非tab-id， 文档以更新 此处兼容处理
            if (id && id.indexOf('tab-') !== 0) {
                id = 'tab-' + id;
            }
            return id;
        },
        //初始化配置
        _initEvent: function() {
            
            if (!this.cfg || !this.cfg.ifrContainer || !this.cfg.tabsContainer) {
                throw new Error('必须指定导航控件的父容器和内容容器');
            }

            this.cfg = $.extend({}, this._defaultCfg, this.cfg);
            
            this.$ifrContainer = $(this.cfg.ifrContainer);
            this.$tabsContainer = $(this.cfg.tabsContainer);

            this._tabTmpl = $.trim(BOTTOM_TAB_ITEM);
            this._conTpl = $.trim(TAB_NAV_CONTENT_TPL);
            this._tablistTpl = $.trim(TAB_SLIDE_TPL);

            //判断导航的位置 up 在上，down在下
            this.navsTabSite = this.$ifrContainer.offset().top > this.$tabsContainer.offset().top ? 'up' : 'down';

            this._renderTabsListBox();
            this._initResize();
            
        },
        _hideAllBtn: function() {
            this._hidePrevBtn();
            this._hideNextBtn();
        },
        //向前
        _showPrevBtn: function() {
            if(!this.cfg.scroller) return false;
            this.$prevBtnCls.show();
        },
        _hidePrevBtn: function() {
            if(!this.cfg.scroller) return false;
            
            this.$prevBtnCls.hide();
        },
        //向后
        _showNextBtn: function() {
            if(!this.cfg.scroller) return false;
            this.$nextBtnCls.show();
        },
        _hideNextBtn: function() {
            if(!this.cfg.scroller) return false;
            this.$nextBtnCls.hide();
        },
        //点击tab判断是否要显示两侧按钮
        _adjustShowButton: function() {

            var marginLeft = Math.ceil((Math.abs(parseFloat(this.$tabList.css('margin-left'), 10)))),
                tab_w = this._getTabWidth(),
                tabs_w = this.$tabList.children().length * tab_w,
                max_w = this._max_w,
                move_max_w = tabs_w - max_w;

            if(move_max_w <= 0) {
                //总长度小于等于容器宽度则表示没有scroll
                this._hideAllBtn();
            } else {
                if(marginLeft > 0) {
                    this._showPrevBtn();
                } else {
                    this._hidePrevBtn();
                }

                if(marginLeft < move_max_w) {
                    this._showNextBtn();
                } else {
                    this._hideNextBtn();
                }
            }
        },
        _getTabWidth: function() {
            if (!this._tab_w) {
                this._tab_w = this.$tabFixList.children().eq(0).outerWidth(true);
            }

            return this._tab_w;
        },
        //新增tab
        addTab: function(cfg, withoutActive, existRefresh) {
            
            var data = $.extend({}, this._tabDefaultSetting, cfg),
                tabId = 'tab-' + data.id,
                $tabContent;

            //不存在，则添加
            if(!this._tabsCache[tabId]) {
                //补全路径
                if (!withoutActive) {
                    data.url = Util.getRightUrl(data.url);
                } else {
                    data.realUrl = Util.getRightUrl(data.url);
                    data.url = 'about:blank';
                }

                // tab模板要渲染到两个地方 id不能相同 uid用以标识其二者相同的id
                data.uid = data.id;

                var tabHtml = Util.clearHtml(M.render(this._tabTmpl, data));

                // 可关闭，则为非固定tab
                if (data.closeIcon) {
                    // 插入到底部和右侧
                    $(tabHtml).appendTo(this.$tabList);

                    if(this.cfg.dropList) {
                        // id不能一致 需要处理一下
                        var dropData = $.extend({}, data);
                        dropData.id += '-drop';
                        $(Util.clearHtml(M.render(this._tablistTpl, dropData))).appendTo(this.$dropList);
                        dropData = null;
                    }
                } else {

                    $(tabHtml).appendTo(this.$tabFixList);
                    // 记录此固定项目id
                    this._fixedTab[tabId] = true;
                    this._lastFixedTabId = tabId;
                }

                $tabContent = $(Util.clearHtml(M.render(this._conTpl, data))).appendTo(this.$ifrContainer);

                this._tabsCache[tabId] = data;
                
                if (withoutActive) {
                    this._tabsCache[tabId].notInit = true;
                }

                this.adjustSize();
                //this.adjustScroll();
            } else if(existRefresh){
                // 存在，若需要刷新内容则刷新
                this.refreshTabContent(tabId);
            }
            
            if (!withoutActive) {
                this.activeTab(tabId, 'add');
            }
        },
        //移除tab
        removeTab: function(id) {
            id = this._getTabId(id);

            var $tab = $('#' + id),
                $tabCon = $('#' + $tab.data('target'));

            if ($tab.hasClass('active')) {
                if ($tab.prev().length) {
                    this.activeTab($tab.prev()[0].id);
                } else if ($tab.next().length) {
                    this.activeTab($tab.next()[0].id);
                } else {
                    // 高亮最后一个固定tab
                    this.activeTab(this._lastFixedTabId);
                }
            }

            // 移除两处的tab和内容
            $tab.remove();

            if(this.cfg.dropList) {
                this.$dropList.find('#' + id + '-drop').remove();
            }

            // 清理tab内容页iframe
            Util.clearIframe($tabCon);
            $tabCon.remove();

            delete this._tabsCache[id];

            this.adjustSize();
            //this.adjustScroll();
        },
        //移除所有Tab
        removeAll: function(id) {
            var that = this;
            id = that._getTabId(id);

            that.$tabList.find('.tn-tabs-nav-item').each(function (i, li) {
                var tabId = li.id;

                if (tabId != id) {
                    that.removeTab(tabId);
                }
            });

            if (!id) {
                that.activeTab(that._lastFixedTabId);
            }
        },
        //刷新指定tab
        refreshTabContent: function(id) {
            id = this._getTabId(id);

            var $tab = $('#' + id),
                $tabCon = $('#' + $tab.data('target'));

            // $tabCon[0].contentWindow.location.reload();
            // 不要直接reload，而是赋值为原地址，可防止页面报错后 刷新仍是错误页面的地址。
            $tabCon[0].src = 'about:blank';
            $tabCon[0].src = Util.getRightUrl(this._tabsCache[id].realUrl || this._tabsCache[id].url);
        },
        getActiveTab: function () {
            var $li = this.$allTabList.find('#' + this._activeId),
                data = this._tabsCache[$li[0].id];

            //return new Tab(data);
            return data;
        },
        //获取当前激活的 tab 对应的 iframe 对象
        getActiveIframe:function() {
            var $li = this.$allTabList.find('#' + this._activeId),
                frameId = $li.data('target');

            return $('#' + frameId, this.$ifrContainer)[0];
        },
        //将激活的tab显示在可视区域
        adjustSize: function() {

            this._calcMaxW();
            this.$tabListWrap.css('width', this._max_w);

            var tabs_w = this._getTabWidth() * this.$tabList.children().length+1,
                scrollRange = 0;
            
            if (tabs_w > 0) {
                this.$tabList.css('width', tabs_w);
            }

            if (!this._fixedTab[this._activeId]) {
                //非固定tab激活中
                this._adjustTabPosOnActive(this._activeId);
            } else {
                //固定tab激活中
                this._adjustScroll();
            }
        },
        _adjustScroll: function() {
            var scroll_w = Math.ceil((Math.abs(parseFloat(this.$tabList.css('margin-left'), 10)))),
                marginLeft = scroll_w,
                max_w = this._max_w,
                tab_w = this._getTabWidth(),
                tabs_w = this.$tabList.children().length * tab_w,
                move_max_w = tabs_w - max_w;

            //在中间得时候，不做操作
            if(scroll_w == 0){

                marginLeft = 0;
                this._hidePrevBtn();
            } else if(scroll_w > move_max_w) {
                
                //表示在最右边
                marginLeft = move_max_w;
                this._hideNextBtn();
                this._showPrevBtn();
            }

            if(this._max_w > tabs_w) { 
                marginLeft = 0;
                this._hideAllBtn();
            }

            this.$tabList.stop(true).animate({
                marginLeft: -marginLeft
            }, 500);
        },
        //激活id对应的tab
        activeTab: function(id, type) {
            
            id = this._getTabId(id);

            var $tab = $('#' + id);

            if($tab.length) {
                var $tabCon = $('#' + $tab.data('target')),
                    data = this._tabsCache[id];

                // 非固定项目需要确保可见
                if (!this._fixedTab[id]) {
                    this._adjustTabPosOnActive(id);

                }

                if ($tab.hasClass('active')) {
                    return;
                }

                this.$allTabList.find('li.active').removeClass('active');
                $tab.addClass('active');

                this._activeId = id;

                if (data.notInit) {
                    $tabCon[0].src = data.realUrl;
                    data.notInit = false;
                }

                $tabCon.removeClass('hidden')
                    .siblings('.tn-tab-content')
                    .addClass('hidden');

                //判断参数是否刷新页面中的表格
                if(type != 'add') {
                    if(this.cfg.refreshTab) {
                        try {
                            var $tabConWin = $tabCon[0].contentWindow,
                                $tabConGrid = $tabConWin.mini ? $tabConWin.mini.get('datagrid') : false,
                                _id = id.split('tab-')[1];

                            //表格刷新
                            if($tabConGrid) {
                                $tabConGrid.load();
                            }

                            //个性化刷新
                            if($tabConWin.onTabsNavRefresh) {
                                $tabConWin.onTabsNavRefresh();
                            }

                        }catch(e){
                            //console.log(e);
                        }
                    }
                }
            }
        },
        
        _adjustTabPosOnActive: function(id) {

            id = this._getTabId(id);

            var $li = $('#' + id),
                $prev_lis = $li.prevAll(),

                tab_w = this._getTabWidth(),
                scroll_w = Math.ceil((Math.abs(parseFloat(this.$tabList.css('margin-left'), 10)))),
                marginLeft = scroll_w,
                prev_w = tab_w * $prev_lis.length,
                tabs_w = this.$tabList.children().length * tab_w,
                max_w = this._max_w,
                move_max_w = tabs_w - max_w;

            if (prev_w < scroll_w) {
                marginLeft = prev_w;

            } else if (prev_w >= (max_w + scroll_w)) {
                marginLeft = prev_w + tab_w - max_w;

            } else if (prev_w > scroll_w && prev_w < (max_w + scroll_w) && (prev_w + tab_w) > (max_w + scroll_w)) {
                marginLeft = prev_w + tab_w - max_w;
            }

            //解决浏览器放大后，tabsList多的时候，没有向右靠齐的问题
            if(max_w > tabs_w) {
                //如果最大距离大于列表总宽度，那就不显示按钮，不需要margin
                marginLeft = 0;
            } else if(max_w < tabs_w && max_w > (tabs_w - scroll_w) && marginLeft != 0){
                //如果最大距离小于列表总宽度，且在上面的那些判断之后，右侧还留有空白，那就向右靠齐
                marginLeft = tabs_w - max_w;
            }

            this.$tabList.stop(true).animate({
                marginLeft: -marginLeft
            }, 500);

            //点击tab激活时，判断是否需要显示对应的按钮
            //marginLeft 值不为0时，表示右移了
            if(Math.abs(marginLeft) > 0) {
                this._showPrevBtn();
            } else {
                this._hidePrevBtn();
            }

            //marginLeft小于最大可右移长度时，表示左移了
            if(move_max_w > 0 && (Math.abs(marginLeft) + 1) < move_max_w) {
                this._showNextBtn();
            } else {
                this._hideNextBtn();
            }
        },
        //缩放浏览器进行调整
        _initResize: function() {
            
            var that = this;
            $(window).on('resize', function (event) {
                // clearTimeout(that.timer);
                // that.timer = setTimeout(function () {
                    
                // });
                that.adjustSize();
            });
        },
        //设置点击一次移动的距离
        _getScrollWidth: function() {
            if(!this._scrollWidth) {
                this._scrollWidth = this._tab_w * this.cfg.smoothItem;
            }

            return this._scrollWidth;
        },
        //初始化tabsNav的点击事件
        _initClickEvent: function() {
            this._isComplete = true;
            var that = this,
                tabContextMenu = new EpContextMenu({
                    items: [{
                        text: '关闭',
                        role: 'close-self',
                        click: function (options) {
                            var id = options.tabId;
                            that.removeTab(id);
                        }
                    }, {
                        // icon: 'remove',
                        text: '关闭其他页',
                        role: 'close-others',
                        click: function (options) {
                            var id = options.tabId;
                            that.removeAll(id);
                        }
                    }, {
                        // icon: 'remove',
                        text: '关闭全部',
                        role: 'close-all',
                        click: function (options) {
                            that.removeAll();
                        }
                    }, {
                        text: '刷新',
                        role: 'refresh-self',
                        click: function (options) {
                            var id = options.tabId;
                            that.refreshTabContent(id);
                        }
                    }, 'sep', {
                        text: '取消',
                        role: 'quit',
                        click: function (options) {

                        }
                    }]
                });
            
            //点击激活
            that.$allTabList
                .on('click', '.tn-tabs-nav-item', function (e) {
                    var id = this.id;
                    if(that._activeId !== id) {
                        that.activeTab(id);
                    }
                })
                // 点击关闭
                .on('click', '.tn-tabs-nav-item-close', function (e) {
                    e.stopPropagation();
                    var id = this.parentNode.getAttribute('data-id');

                    that.removeTab(id);
                })
                // 刷新
                .on('click', '.tn-tabs-nav-item-refresh', function (e) {
                    e.stopPropagation();
                    var id = this.parentNode.getAttribute('data-id');

                    that.refreshTabContent(id);
                })
                //  右键菜单
                .on('contextmenu', '.tn-tabs-nav-item', function (event) {
                    var tabId = this.id;
                    // 固定项目不响应
                    if (that._fixedTab[tabId]) return;

                    var $this = $(this),
                        _pageX = event.pageX,   //鼠标的位置
                        _pageY = event.pageY,
                        _ctxMenuSize = tabContextMenu.size,    //右键菜单的高度和宽度信息
                        positionX = _pageX,
                        positionY = 0;

                    if(_pageY < _ctxMenuSize.height) {
                        //只能向下
                        positionY = _pageY;
                    } else {
                        //向上
                        positionY = _pageY - _ctxMenuSize.height;
                    }

                    tabContextMenu.setOptions('tabId', tabId).show({
                        x: positionX,
                        y: positionY
                    });

                    _pageX = null;
                    _pageY = null;
                    _ctxMenuSize = null;
                    positionX = null;
                    positionY = null;

                    return false;
                });

            //有下拉列表
            if(that.cfg.dropList) {

                //切换下拉列表
                var switchDrop = function () {
                    that.$dropBox.toggleClass('showPanel');
                    if (that.$dropBox.hasClass('showPanel')) {
                        that.$dropPanel.slideDown();
                        
                        that.cfg.onDropShow();
                    } else {
                        that.$dropPanel.slideUp();
                        that.cfg.onDropHide();
                    }
                };



                // 下拉面板中点击激活
                that.$dropPanel.on('click', '.tn-slide-list-item', function (e) {
                    var id = this.getAttribute('data-id');
                    that.activeTab(id);
                    switchDrop();
                });

                that.$dropBox.on('click', '.tn-drop-btn', function (e) {
                    e.stopPropagation();
                    var _height = that.$dropBox.outerHeight();

                    if(that.navsTabSite === 'up') {
                        that.$dropPanel.css({'top': _height + 'px', 'right': 0,'bottom': 'auto'});

                    } else {
                        that.$dropPanel.css({'bottom': _height + 'px', 'right': 0});
                    }

                     switchDrop();
                });

                if(!$.fn.niceScroll) {
                    Util.loadJs('frame/fui/js/widgets/jquery.nicescroll.min.js', function() {
                        that.$dropPanel.niceScroll({
                            cursorcolor: '#d5dee6'
                        });
                    });
                } else {
                    that.$dropPanel.niceScroll({
                        cursorcolor: '#d5dee6'
                    });
                }

                //点击页面其他地方，隐藏下拉列表
                $('body').on("click", function (e) {
                    e.stopPropagation();
                    var $target = $(e.target);

                    if (!$target.closest('.tn-bottom-drop').length) {
                        
                        if(that.$dropBox.hasClass('showPanel')){
                            that.$dropPanel.slideUp();
                            that.cfg.onDropHide();
                            that.$dropBox.removeClass('showPanel');
                        }
                    }
                });
                
            }

            //有两侧切换按钮
            if(that.cfg.scroller) {

                var _$tabList = that.$tabList;

                that.$allTabList
                    .on('click', '.tn-prev', function() {

                        var marginLeft = Math.ceil((Math.abs(parseFloat(_$tabList.css('margin-left'), 10)))),
                            max_w = that._max_w;

                        if(marginLeft == 0) return;

                        marginLeft -= that._getScrollWidth();

                        if(marginLeft <= 0) {
                            marginLeft = 0;

                            that._hidePrevBtn();
                        }

                        that.$tabList.stop(true).animate({
                            marginLeft: -marginLeft
                        },500);

                        that._showNextBtn();
                    })
                    .on('click','.tn-next', function() {
                        var tab_w = that._getTabWidth(),
                            marginLeft = Math.ceil((Math.abs(parseFloat(_$tabList.css('margin-left'), 10)))),
                            max_w = that._max_w,
                            total_w = that.$tabList.children().length  * tab_w,
                            move_max_w = total_w - max_w;

                        if(marginLeft == move_max_w) return;

                        marginLeft  +=  that._getScrollWidth();

                        if(marginLeft >= move_max_w) {
                            marginLeft = move_max_w;
                            
                            that._hideNextBtn();
                        }

                        that.$tabList.stop(true).animate({
                            marginLeft: -marginLeft
                        }, 500);

                        that._showPrevBtn();
                    });
            }
        }
    }

})(this, jQuery);