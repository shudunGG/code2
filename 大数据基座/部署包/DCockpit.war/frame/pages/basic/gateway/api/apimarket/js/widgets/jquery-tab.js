/**
 * Tab组件1.0
 * date:2018-03-21
 * author: [chengang];
 */
(function($, window) {
    var defaults = {
        hd: null,   //Tab头选择器，默认为当前插件选择器下的第一个元素的子节点
        bd: null,   //Tab内容选择器，默认为当前插件选择器下的第二个元素的子节点
        target: null,   //Tab锚点，默认通过索引
        activeIndex: 0,      //默认激活Tab索引
        event: "click",         //Tab激活方式 click，mouseover
        activeClass: "active",  //Tab激活样式
        delay: 300,             //mouseover延迟时间
        before: $.noop, //选中前触发
        after: $.noop   //选中后触发
    };

    function TabView(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this.init();
    }

    TabView.prototype = {
        init: function() {
            var self = this, settings = self.settings, overTimer;
            var hdselector = settings.hd || ">:eq(0)>*",
                bdselector = settings.bd || ">:eq(1)>*";
            settings.$hd = $(hdselector, self.element);
            settings.$bd = $(bdselector, self.element);

            if (settings.event == 'click') {
                $(self.element).on('click', hdselector, function(event) {
                    event.preventDefault();
                    $.proxy(self.activeTab, self, $(this))();
                });

            } else if (settings.event == 'mouseover') {
                $(self.element).on('mouseover', hdselector, function() {
                    overTimer && clearTimeout(overTimer);
                    overTimer = setTimeout($.proxy(self.activeTab, self, $(this)), settings.delay);
                });
            }
            self.activeTab(settings.$hd.eq(settings.activeIndex), true);
        },
        activeTab: function($acthd, init) {
            var self = this, settings = self.settings,
                $bd = settings.$bd, $actbd;

            var $currbd = $bd.filter(":visible");
            if (!init && settings.before.call(self, $acthd, $currbd) === false) {
                return false;
            }

            $acthd.addClass(settings.activeClass).siblings(settings.hd || "*").removeClass(settings.activeClass);

            if (!settings.target) {
                var idx = $acthd.index();
                $actbd = $bd.eq(idx)
                $actbd.show().siblings(settings.bd || "*").hide();
            } else {
                var targetid = $acthd.data(settings.target);
                $actbd = $bd.filter('[data-' + settings.target + '="' + targetid + '"]').show();
                $bd.not($actbd).hide();
            }
            if (!init) {
                settings.after.call(self, $acthd, $actbd);
            }
        },
        activeTabByIndex: function(index) {
            var self = this, settings = self.settings;
            var $acthd = settings.$hd.eq(index);
            self.activeTab($acthd);
        }
    };

    $.fn.Tab = function(options, param) {
        if (typeof options == 'string') {
            var method = $.fn.Tab.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        return this.each(function() {
            if (!$.data(this, "Tab")) {
                $.data(this, "Tab", new TabView(this, options));
            }
        });
    };

    $.fn.Tab.methods = {
        active: function(jq, index) {
            return jq.each(function() {
                $.data(this, 'Tab').activeTabByIndex(index);
            });
        }
    };

})(jQuery, window);
