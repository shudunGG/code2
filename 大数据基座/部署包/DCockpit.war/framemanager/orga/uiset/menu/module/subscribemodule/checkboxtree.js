// var ITEM_TPL = `
// {{^showAsLeaf}}<div class="check-group {{level}}">{{/showAsLeaf}}
// <span class="cb-container {{level}}">
//     <input type="checkbox" id="{{code}}" class="cb-cb" {{#checked}}checked{{/checked}}>
//     <span class="cb-show"></span>
//     <label for="{{code}}" class="cb-label">{{name}}</label>
// </span>
// {{#hasSub}}
//     {{^showAsLeaf}}<div class="check-group">{{/showAsLeaf}}
//     {{{subItems}}}
//     {{^showAsLeaf}}</div>{{/showAsLeaf}}
// {{/hasSub}}
// {{^showAsLeaf}}</div>{{/showAsLeaf}}
// `;
var ITEM_TPL =
    '\
<span class="cb-container {{level}} {{^showAsLeaf}} asblock{{/showAsLeaf}} {{#disabled}} disabled{{/disabled}} {{#checked}} checked{{/checked}} {{#color}} {{color}}{{/color}}" data-id="{{code}}" data-pid="{{pid}}" {{#hasSub}}data-isparent="true"{{/hasSub}}>\
    <input type="checkbox" id="{{code}}" class="cb-cb" {{#checked}}checked{{/checked}} {{#disabled}}disabled{{/disabled}}><span class="cb-show"></span><label for="{{code}}" class="cb-label">{{name}}</label>\
</span>\
{{#hasSub}}\
    <div class="check-group" >\
    {{{subItems}}}\
    </div>\
{{/hasSub}}\
\
';

// {{^showAsLeaf}}<div class="check-group {{level}}">{{/showAsLeaf}}\
// {{^showAsLeaf}}</div>{{/showAsLeaf}}\

(function (win, $) {
    /* global Mustache */
    // array join ,the Array.prototype.join is to slow;
    var joinArr = function (arr, c) {
        if (c === undefined) {
            c = '';
        }
        if (!arr || !arr.length) {
            return '';
        }
        var str = arr[0],
            i = 1,
            l = arr.length;
        while (i < l) {
            str += c + arr[i];
            i++;
        }
        return str;
    };

    var renderItem = function (data) {
        return Mustache.render(ITEM_TPL, data);
    };

    var addRowKey = function (rowkey, i) {
        return rowkey === undefined ? i + '' : rowkey + '-' + i;
    };

    var build = function (data, pid, rowkey) {
        var html = [];

        $.each(data, function (i, item) {
            // var view = $.extend({}, item);
            var view = {
                code: item.moduleguid,
                name: item.modulename,
                color: item.color,
                checked: item.hasRight === 1,
                disabled: item.color ? true : false
            };
            // 别名
            item.items = item.children;
            item.code = item.moduleguid;

            view.rowkey = addRowKey(rowkey, i);

            var len = view.rowkey.split('-').length;
            view.level = 'level-' + len;
            view.showAsLeaf = len > 2 ? true : false;

            view.hasSub = !!(item.items && item.items.length);
            if (pid) {
                view.pid = pid;
            }

            if (view.hasSub) {
                html.push(
                    Mustache.render(
                        ITEM_TPL,
                        $.extend(view, {
                            subItems: build(item.items, item.code, view.rowkey)
                        })
                    )
                );
            } else {
                html.push(renderItem(view));
            }
        });

        return joinArr(html, '');
    };

    var $container = $('#tree-container');

    // 加载数据渲染方法
    win.checkboxTree = {
        // 初始化
        init: function (data) {
            $(build(data)).appendTo($container.empty());
        },
        // 获取选中的数据
        getData: function (getAll) {
            getAll = getAll || false;
            var arr = [];
            $container.find('.cb-cb').each(function (i, item) {
                if (item.checked) {
                    // 排除掉禁用的
                    if (!item.disabled || getAll) {
                        arr.push(item.id);
                    }
                }
            });
            return JSON.stringify(arr);
        }
    };

    $container.on('click', '.cb-cb', function () {
        var $input = $(this);
        // 禁用节点不响应
        if ($input.prop('disabled')) {
            return;
        }

        handleClick($input);
    });

    function handleClick($input) {
        var $cb = $input.parent(),
            isParent = $cb.data('isparent'),
            pid = $cb.data('pid');

        // if (Util.browsers.isIE8) {
        //     if ($input.prop('checked')) {
        //         $cb.addClass('checked');
        //     } else {
        //         $cb.removeClass('checked');
        //     }
        // }

        if (pid) {
            // '检查兄弟 同步父节点'
            checkedParent($cb);
        }

        if (isParent) {
            // '调整子节点'
            checkedChildren($cb, $input.prop('checked'));
        }
    }

    function checkedParent($node) {
        // var $nodes = $node.siblings('.cb-container'),
        var $nodes = $node.parent().children(),
            pid = $node.data('pid'),
            $parent = $node.parent().siblings('[data-id="' + pid + '"]'),
            checked = [],
            allChecked = true;

        // 添加自己
        // $nodes.add($node);
        $nodes.each(function (i, node) {
            // var input = node.firstElementChild || node.firstChild;
            var $input = $(node).find('>.cb-cb');
            if ($input.prop('checked')) {
                checked.push(node.getAttribute('data-id'));
            } else {
                allChecked = false;
            }
        });

        if (allChecked || checked.length) {
            // 全部选中
            checkNode($parent);
        } else {
            // 全不选
            unCheckNode($parent);
        }
        // 不处理半选状态
        // else if (checked.length) {
        //     // 部分选中
        //     halfCheckNode($parent);
        // }

        // 继续向上检查
        if ($parent.data('pid')) {
            checkedParent($parent);
        }
    }

    function checkedChildren($node, checked) {
        $node
            .next()
            .find('.cb-container')
            .each(function (i, item) {
                var $item = $(item);
                if (checked) {
                    checkNode($item);
                } else {
                    unCheckNode($item);
                }
            });
    }

    function checkNode($node) {
        // 禁用节点跳过
        if ($node.hasClass('disabled')) {
            return;
        }

        $node
            .find('.cb-cb')
            // .removeClass('half-checked')
            .prop('checked', true);
    }

    function unCheckNode($node) {
        // 禁用节点跳过
        if ($node.hasClass('disabled')) {
            return;
        }

        $node
            .find('.cb-cb')
            // .removeClass('half-checked')
            .prop('checked', false);
    }

    function halfCheckNode($node) {
        console.log($node[0], '需要设置为半选');
        $node.find('.cb-cb').addClass('half-checked');
    }

    // IE8 不支持 :checked 伪类 为其添加一个类来标识
    if (Util.browsers.isIE8) {
        /* eslint  no-func-assign:"off" */
        checkNode = function ($node) {
            // 禁用节点跳过
            if ($node.hasClass('disabled')) {
                return;
            }

            $node
                .addClass('checked')
                .find('.cb-cb')
                .prop('checked', true);
        };
        unCheckNode = function ($node) {
            // 禁用节点跳过
            if ($node.hasClass('disabled')) {
                return;
            }

            $node
                .removeClass('checked')
                .find('.cb-cb')
                .prop('checked', false);
        };
        var _handleClick = handleClick;
        handleClick = function ($input) {
            var $cb = $input.parent();
            if ($input.prop('checked')) {
                $cb.addClass('checked');
            } else {
                $cb.removeClass('checked');
            }
            _handleClick($input);
        };
    }
})(this, jQuery);