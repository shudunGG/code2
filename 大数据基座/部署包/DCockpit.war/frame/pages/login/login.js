/*!
 *登录页交互
 *author: xiaolong
 */

/*!
 *tab组件
 *author: xiaolong
 */
(function(win, $) {
    var defaultSettings = {
        // 默认选中的tab项，从0计数
        activeIndex: 0,
        // 容器dom对象
        dom: null,
        // 触发tab切换的事件：click|mouseover
        triggerEvent: 'mouseover',
        // 高亮时的样式名
        activeCls: ''
    };

    win.TabView = function(opts) {
        this.cfg = $.extend({}, defaultSettings, opts);

        this._initView();
        this._initEvent();
    };

    $.extend(TabView.prototype, {
        _initView: function() {
            var c = this.cfg;

            var $widget = $(c.dom),
                
                $widgetHd = $widget.find('> [data-role="head"]'),
                $widgetBd = $widget.find('> [data-role="body"]'),

                $tabs = $widgetHd.find('[data-role="tab"]'),
                $tabCons = $widgetBd.find('> [data-role="tab-content"]');

            $.extend(this, {
                $widgetHd: $widgetHd,
                $tabs: $tabs,
                $tabCons: $tabCons
            });

            this.activeTabByIndex(c.activeIndex);
        },

        _initEvent: function() {
            var c = this.cfg,
                triggerEvent = c.triggerEvent,

                $widgetHd = this.$widgetHd,
                self = this;

            // 用于mouseover触发时的延时
            var overTimer = 0;

            if (triggerEvent == 'click') {
                $widgetHd.on('click', '[data-role="tab"]', function(event) {
                    event.preventDefault();

                    $.proxy(self._activeTab, self, $(this))();
                });

            } else if (triggerEvent == 'mouseover') {
                $widgetHd.on('mouseover', '[data-role="tab"]', function() {
                    overTimer && clearTimeout(overTimer);

                    overTimer = setTimeout($.proxy(self._activeTab, self, $(this)), 500);

                }).on('mouseout', '[data-role="tab"]', function() {
                    overTimer && clearTimeout(overTimer);
                });
            }
        },

        _activeTab: function($tab) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs;

            var targetId = $tab.data('target');

            $tabs.removeClass(activeCls);
            $tab.addClass(activeCls);

            this._activeTabContent(targetId);
        },

        // 通过index激活对应tab
        activeTabByIndex: function(index) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs,

                $activeTab = null,
                targetId = '';

            // 若index合法
            if (index >= 0 && index < $tabs.length) {
                $activeTab = $tabs.removeClass(activeCls).eq(index).addClass(activeCls);

                targetId = $activeTab.data('target');

                this._activeTabContent(targetId);
            }
        },

        _activeTabContent: function(targetId) {
            var $tabCons = this.$tabCons;

            $tabCons.addClass('hidden')
                .filter('[data-id="' + targetId + '"]')
                .removeClass('hidden');
        }
    });
}(this, jQuery));

(function($) {

    new TabView({
        dom: $(".login-right"),
        triggerEvent: 'click',
        activeCls: 'act'
    });

    var $input = $('.login-input'),
        $loginBtn = $('.login-submit');

    $input.on('keypress', function(event) {
        if(event.which == 13) {
            $loginBtn.filter(":visible").trigger('click');
        }
    });

    // 获取title和logo图片的地址
/*    if(initUrl) {
        Util.ajax({
            url: Util.getRightUrl(initUrl),
            data: {
                query: 'init-page'
            },
            success: function(data) {
                if(data) {
                    var title = data.title,
                        logoImg = data.logoImg;

                    if(title) {
                        document.title = title;
                        
                    }

                    if(logoImg) {
                        document.getElementById('logo-img').src = Util.getRightUrl(logoImg);

                    }
                }
            }
        })
    }*/
    
    $('input').placeholder();

}(jQuery));
