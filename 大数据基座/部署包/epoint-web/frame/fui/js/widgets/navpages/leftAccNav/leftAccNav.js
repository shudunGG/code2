(function(win, $) {
    var $accNav = $('#acc-nav'),
        $list = $('> .acc-nav-list', $accNav),

        $iframe = $('#main-frame');

    var M = Mustache,
        navTempl = $.trim($('#nav-templ').html());

    var INDENT_1 = 40,
        INDENT_STEP = 24;

    var setPageUrl = function(url) {
        // 自动加上页面url参数，让url参数能够传到子页面
        url = Util.addUrlParams(url, Util.getUrlParams(), 'ignore');
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

    var getDefaultNode = false;
    // 是否单层菜单
    var isSingleLayer = true;
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

            if(!view.isLeaf) {
                isSingleLayer = false;
            }

            view.rowkey = getRowkey(rowkey, i);
            view.indent = getIndent(view.rowkey);
            view.isTop = view.rowkey.split('-').length === 1;
            
            if(!getDefaultNode && item.url) {
                _defaultActiveNode = view.rowkey;
                getDefaultNode = true;
            }
            if(item.defaultActive) {
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
        if (Util.browsers.isIE) { 
            Util.loadJs('frame/fui/js/widgets/jquery.nicescroll.min.js', function() {
                $accNav.niceScroll({
                    cursorcolor: '#666'
                });
            });
        }else {
            $accNav.css({
                height: '100%',
                overflow: 'auto'
            });
        }
    };

    var initView = function(data) {
        var html = '';

        if (data && data.length) {
            html = buildNav(data);

            $(Util.clearHtml(html)).appendTo($list.empty());

            if(isSingleLayer) {
                $accNav.addClass('singlelayer');
            }

            addNiceScroll();
        }
    };

    // 兼容之前不好的API命名
    if(!AccNav.onLoad && win.onLeftAccNavLoad) {
        AccNav.onLoad = win.onLeftAccNavLoad;
    } 
    if (!AccNav.onLoad) {
        AccNav.onLoad = Util.noop;
    }

    var initPage = function() {
        // 设置了defaultUrl则直接显示defaultUrl页面
        if (AccNav.defaultUrl) {
            setPageUrl(AccNav.defaultUrl);
            return;
        }
        var $activeNav;

        if(_defaultActiveNode){
            $activeNav = $list.find('.acc-nav-link').filter('[data-rowkey="' + _defaultActiveNode + '"]');
    
            // 显示需要激活的菜单项页面
            $activeNav.trigger('click');
            expandNode($activeNode);
        }

    };
    
    // 展开节点
    var expandNode = function($node) {
        var $parent = $node.parent().parents('.acc-nav-item ');
        $parent.addClass('opened');
        $parent.find('> .acc-nav-list').stop(true).slideDown(200, function () {
            $(this).css({
                display: 'block',
                height: ''
            });
        });
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

        xhr.done(initView, initEvent, initPage, AccNav.onLoad);
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
                    $sub.stop(true).slideUp(200, function () {
                        $(this).css('display', 'none');
                    }); 
                } else {
                    $item.addClass('opened');
                    $sub.stop(true).slideDown(200, function () {
                        $(this).css({
                            display: 'block',
                            height: ''
                        });
                    });
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
