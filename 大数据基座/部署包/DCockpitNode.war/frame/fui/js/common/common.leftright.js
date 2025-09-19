/*!
 * 左右布局
 */
(function (win, $) {
    var $left = $('.fui-left'),
        $right = $('.fui-right');

    var getTitleHtml = function (title) {
        return title ? ('<h4 class="fui-left-title">' + title + '</h4>') : '';
    };

    var toggleHtml = '<i class="fui-left-toggle"></i>';

    var parse = function () {
        var $hd = $left.find('> [role="head"]'),
            title = $hd.attr('title');

        var $bd = $left.find('> [role="body"]');

        // head和body都没有时说明已解析过
        if ($hd.length || $bd.length) {
            $left.append(toggleHtml);

            if ($hd.length) {
                $hd.addClass('fui-left-hd')
                    .append(getTitleHtml(title))
                    // 清理role，防止重复parse
                    .removeAttr('role');
            }

            if ($bd.length) {
                $bd.addClass('fui-left-bd')
                    // 清理role，防止重复parse
                    .removeAttr('role');
            }

            initEvent();
        }


    };

    var initEvent = function () {
        $left.on('click', '.fui-left-toggle', function () {
            var closed = $left.hasClass('closed');

            $left.toggleClass('closed', !closed);

            if (Util.browsers.isIE8) {
                $right.toggleClass('expanded', !closed);
            }

            // 左侧面板显|隐后，调整content区域表格布局
            Util._layoutDatagridInContent();
            
            // 兼容之前不好的API规范
            if(!Util.leftRight.onToggle) {
                Util.leftRight.onToggle = Util.onLeftRightResize;
            }
            if(Util.leftRight.onToggle) {
                Util.leftRight.onToggle();
            }
        });
    };

    Util.leftRight = Util.leftRight || {};

    // 左右布局解析，供外部调用
    // 一般待html结构条件满足后，手动调用解析
    win.parseLeftRightLayout = function () {
        $left = $('.fui-left');
        $right = $('.fui-right');

        parse();
    };

    if (!$left.length || !$right.length) return;

    parse();

}(this, jQuery));
