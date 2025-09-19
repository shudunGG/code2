(function(win, $) {
    var $accNav = $('#acc-nav'),
        $list = $('> .acc-nav-list', $accNav),

        $iframe = $('#main-frame');

    var M = Mustache,
        navTempl = $.trim($('#nav-templ').html());

    var INDENT_1 = 38,
        INDENT_STEP = 24;

    var setPageUrl = function(url) {
        $iframe[0].src = Util.getRightUrl(url);
    };

    // 记录服务端返回数据中默认激活节点的guid
    var _defaultActiveNode;

    // 管理节点缓存
    var CacheMgr = {
        _cache: {},

        // 缓存节点信息
        cacheNodeData: function(data) {
            var prop,
                rowkey = data.rowkey;

            this._cache[rowkey] = {};

            for (prop in data) {
                if (prop !== 'items') {
                    this._cache[rowkey][prop] = data[prop];
                }
            }
        },

        // 获取节点数据
        getNodeData: function(rowkey) {
            var rt = this._cache[rowkey];

            return rt ? rt : null;
        }
    };

    // 获取节点缩进值
    var getIndent = function(rowkey) {
        var len = rowkey.split('-').length;

        if (len !== 1) {
            return (INDENT_1 + (len - 2) * INDENT_STEP);
        }

        return false;
    };

    // 或者节点行标识
    var getRowkey = function(rowkey, i) {
        return (rowkey == undefined) ? (i + '') : (rowkey + '-' + i);
    };

    // 构建导航html结构
    var buildNav = function(data, rowkey) {
        var html = [];

        $.each(data, function(i, item) {
            var view = {
                name: item.name,
                icon: item.icon,
                url: item.url,
                isLeaf: !(item.items && item.items.length),
                expanded: item.expanded
            };

            view.rowkey = getRowkey(rowkey, i);
            view.indent = getIndent(view.rowkey);
            view.isTop = view.rowkey.split('-').length === 1;

            if(item.active) {
                _defaultActiveNode = view.rowkey;
            }

            // 缓存节点信息
            CacheMgr.cacheNodeData($.extend({}, item, view));

            if (!view.isLeaf) {
                html.push(M.render(navTempl, $.extend(view, {
                    subNav: buildNav(item.items, view.rowkey)
                })));
            } else {
                html.push(M.render(navTempl, view));
            }
        });

        return html.join('');
    };

    // 增加虚拟滚动条
    var addNiceScroll = function() {
        Util.loadJs('fui/js/lib/jquery.nicescroll.min.js', function() {
            $accNav.niceScroll({
                cursorcolor: '#666'
            });
        });
    };

    var initView = function(data) {
        var html = '';

        if (data && data.length) {
            html = buildNav(data);

            $(Util.clearHtml(html)).appendTo($list.empty());

            addNiceScroll();
        }
    };

    // 兼容之前不好的API命名
    if(!AccNav.onLoad && win.onLeftAccNavLoad) {
        AccNav.onLoad = win.onLeftAccNavLoad;
    } 

    var initPage = function() {
        // 设置了defaultUrl则直接显示defaultUrl页面
        if (AccNav.defaultUrl) {
            setPageUrl(AccNav.defaultUrl);
            return;
        }
        var $activeParent,
            $activeNav;

        if(_defaultActiveNode){
            $activeNav = $list.find('.acc-nav-link').filter('[data-rowkey="' + _defaultActiveNode + '"]');

        } else {
            // 默认展示第一个手风琴
            $activeParent = $list.children().eq(0),
            $activeNav = $activeParent.find('.acc-nav-link.not-top').eq(0);

            // 没有子节点则显示父节点的页面
            if (!$activeNav.length) {
                $activeNav = $activeParent.find('.acc-nav-link').eq(0);
            } else {
                $activeParent.addClass('opened');

            }
        }
    
        // 显示需要激活的菜单项页面
        $activeNav.trigger('click');

        if(AccNav.onLoad) {
            AccNav.onLoad();
        }
    };

    // 获取节点数据
    var getData = function() {
        var params = $.extend({
            query: 'init-accNav'
        }, AccNav.params);

        var xhr = Util.ajax({
            url: Util.getRightUrl(AccNav.loadUrl),
            dataType: 'json',
            type: 'POST',
            data: params
        });

        xhr.done(initView, initEvent, initPage);
    };

    var $activeNode = null;

    var initEvent = function() {
        $accNav.on('click', '.acc-nav-link', function(event) {
            event.preventDefault();

            var $el = $(this),
                url = $el.data('url'),
                rowkey = $el.data('rowkey');

            var $item = $el.parent(),
                $sub = $item.find('> .acc-nav-list');

            var isLeaf = !$sub.length;

            // 若当前节点有子节点，则控制子节点显示|隐藏
            if (!isLeaf) {
                if ($item.hasClass('opened')) {
                    $item.removeClass('opened');

                } else {
                    $item.addClass('opened');
                }

                // Force IE8 redraw :before/:after pseudo element
                Util.redrawPseudoEl($el.find('.acc-nav-icon')[0]);
            }

            // 子节点高亮active
            if (isLeaf) {
                $activeNode && $activeNode.removeClass('active');

                // Force IE8 redraw :before/:after pseudo element
                if ($activeNode) {
                    Util.redrawPseudoEl($activeNode.find('.acc-nav-icon')[0]);
                }

                $activeNode = $el;
                $activeNode.addClass('active');

                // Force IE8 redraw :before/:after pseudo element
                Util.redrawPseudoEl($activeNode.find('.acc-nav-icon')[0]);

                setPageUrl(url);
            }
        });
    };

    // domReady时获取节点数据
    getData();
    // $(getData);

}(this, jQuery));
