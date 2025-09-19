// 页面左侧手风琴树 导航结构
(function (win, $) {
    var $con = $('#acc-nav');

    var ACC_ITEM_HEIGHT = 36;

    var ROW_KEY_SEP = '-';

    var M = Mustache,
        accItemTempl = $.trim($('#acc-item-templ').html());

    // 右侧iframe
    var $iframe = $('#main-frame');

    // 当前展开的手风琴rowkey
    var expandedAcc = '';

    // 手风琴个数
    var accNum = 0;

    var cache = {};

    var defaultExpandedNodes = [];

    var CacheMgr = {
        cacheNodeData: function (data) {
            var copy = {},
                prop;

            for (prop in data) {
                if (!$.isArray(data[prop])) {
                    copy[prop] = data[prop];
                }
            }

            cache[data.rowkey] = copy;
        },

        cacheTreeData: function (data, rowkey) {
            cache[rowkey + '-tree'] = data;
        },

        getNodeData: function (rowkey) {
            var data = cache[rowkey];

            return data ?
                $.extend({}, data) : false;
        },

        getTreeData: function (rowkey) {
            var data = cache[rowkey + '-tree'];

            return data || false;
        },

        // 缓存expanded为true的节点
        cacheDefaultExpandedNodes: function (node) {
            if (!node.isLeaf && node.expanded) {
                defaultExpandedNodes.push(node);
            }
        }
    };

    // 右侧显示默认页面
    var showDefaultPage = function () {
        var url = '';

        // 若指定defaultUrl，则显示该页面
        if (LeftAccTree.defaultUrl) {
            url = LeftAccTree.defaultUrl;

        } else {
            // 若未指定defaultUrl，显示展开的手风琴项url
            url = CacheMgr.getNodeData(expandedAcc).url;

            // 若该手风琴项未配置url，则采用其下第一节点的url
            if (!url) {
                url = CacheMgr.getNodeData(expandedAcc + '-0').url;
            }
        }

        $iframe[0].src = Util.getRightUrl(url);
    };

    // 获取模块数据 
    var getData = function () {
        var params = $.extend({
            query: 'init-accTree'
        }, LeftAccTree.params);

        Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: Util.getRightUrl(LeftAccTree.loadUrl),
            data: params,
            success: function (data) {

                data = data.result || data;

                if (data && data.length) {
                    renderAccordion(data);

                    // 展开expanded为true的节点 
                    processNodesExpansion();

                    showDefaultPage();
                }
                if (LeftAccTree.onLoad) {
                    LeftAccTree.onLoad();
                }
            },
            error: Util._ajaxErr
        });
    };

    var get$ElById = function (id) {
        return $con.find('[data-id="' + id + '"]');
    };

    var processNodesExpansion = function () {
        if (defaultExpandedNodes.length) {
            $.each(defaultExpandedNodes, function (i, node) {

                get$ElById(node.code)
                    .find('> .node-line')
                    .find('.node-toggle')
                    .trigger('click');
            });

            // 清理掉缓存
            defaultExpandedNodes = null;
        }
    };

    // 计算展开手风琴内容高度
    var adjustExpandedAccBdHeight = function ($accBd) {
        if ($.trim(expandedAcc) === '') return;

        var win_h = Util.getWinSize().height;

        if (!$accBd) {
            $accBd = $con.find('[data-rowkey="' + expandedAcc + '"]').find('.acc-item-bd');
        }

        $accBd.css('height', win_h - ACC_ITEM_HEIGHT * accNum + 'px');
    };

    // 渲染手风琴
    var renderAccordion = function (data) {
        var html = [];

        $.each(data, function (i, acc) {
            acc.rowkey = i + '';

            // 缓存节点
            CacheMgr.cacheNodeData(acc);

            // 获取默认展开项ID
            if (!expandedAcc && acc.expanded) {
                expandedAcc = acc.rowkey;
            }

            var items = acc.items;

            if (items && items.length) {
                acc.initTree = true;

                // 缓存树节点数据
                CacheMgr.cacheTreeData(items, acc.rowkey);
            } else if (acc.isLazy) {
                acc.initTree = true;
            }

            html.push(M.render(accItemTempl, acc));
        });

        $con.empty().html(Util.clearHtml(html.join('')));

        accNum = data.length;

        showAccBdByRowkey(expandedAcc);
    };

    // 渲染导航树
    var renderTree = function (data, acc) {
        var parent = acc.find('.acc-item-bd')[0];

        var tree = new mini.Tree();
        tree.set({
            idField: 'code',
            textField: 'name',
            iconField: 'icon',
            nodesField: 'items',
            autoLoad: false,
            url: Util.getRightUrl(LeftAccTree.loadUrl),
            data: data
        });

        tree.on('beforeload', function (e) {
            e.data.query = 'lazyLoad-accTree';
        });

        tree.on('nodeclick', function (e) {
            var node = e.node;
            handleNodeClick(node);
        });

        tree.render(parent);

        acc.data('inittree', false);

    };

    // 隐藏指定rowkey的手风琴内容
    var hideAccBdByRowkey = function (rowkey) {
        if (rowkey === '') return;

        var $acc = $con.find('[data-rowkey="' + rowkey + '"]'),

            $accBd = $acc.find('.acc-item-bd');

        $accBd.addClass('hidden');

        $acc.removeClass('opened')
            .addClass('closed');

        expandedAcc = '';
    };

    // 显示指定rowkey的手风琴内容
    var showAccBdByRowkey = function (rowkey) {
        var $acc = $con.find('[data-rowkey="' + rowkey + '"]'),

            initTree = $acc.data('inittree'),

            $accBd = $acc.find('.acc-item-bd');

        expandedAcc = $acc.data('rowkey');

        if (initTree) {
            var treeData = CacheMgr.getTreeData(rowkey);
            if (treeData) {
                renderTree(treeData, $acc);
            } else {
                fetchTreeData($acc);
            }

        }

        adjustExpandedAccBdHeight($accBd);

        $accBd.removeClass('hidden');

        $acc.removeClass('closed')
            .addClass('opened');
    };

    // 节点点击处理
    var handleNodeClick = function (data) {
        var url = data.url,
            // 用户自定义回调
            callback = LeftAccTree.onNodeClick,
            // 回调返回值
            rt = true;

        if (callback) {
            rt = $.proxy(callback, LeftAccTree, data)();
        }
        // 回调返回false 阻止默认处理
        if (rt === false) return;

        if (url) {
            url = Util.getRightUrl(url);

            if (data.isBlank) {
                win.open(url);
            } else {
                $iframe[0].src = url;
            }
        }
    };

    var fetchTreeData = function (acc) {
        var code = acc.data('id');

        Util.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                query: 'lazyLoad-accTree',
                code: code
            },
            url: Util.getRightUrl(LeftAccTree.loadUrl),
            success: function (data) {
                renderTree(data, acc);
            }
        });

    };


    // 点击手风琴标题
    $con.on('click', '.acc-item-hd', function (event) {
        var $el = $(this),

            $acc = $el.parent(),
            $accBd = $acc.find('.acc-item-bd'),

            rowkey = $acc.data('rowkey'),
            data = CacheMgr.getNodeData(rowkey);

        if ($accBd.hasClass('hidden')) {
            hideAccBdByRowkey(expandedAcc);
            showAccBdByRowkey(rowkey);

        } else {
            hideAccBdByRowkey(rowkey);
        }

        handleNodeClick(data);


    });

    // 高度调节
    var adjustTimer = 0;

    $(win).on('resize', function () {
        adjustTimer && clearTimeout(adjustTimer);

        adjustTimer = setTimeout(adjustExpandedAccBdHeight, 80);
    });

    getData();
}(this, jQuery));