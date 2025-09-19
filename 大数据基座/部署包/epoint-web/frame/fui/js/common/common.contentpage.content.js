/*!
 * contentpage结构content区域计算
 */
(function (win, $) {
    var $toolbar = $('.fui-toolbar'),
        $condition = $('.fui-condition'),
        $notice = $('.fui-notice'),
        $content = $('.fui-content'),
        $toolbarbottom = $('.fui-toolbar-bottom');

    win.adjustContentHeight = Util.noop;

    if (!$content.length) return;

    // // toolbar可以配置为在底部显示
    // if ($toolbar.data('position') == "bottom") {
    //     $toolbar.addClass('bottom');

    //     $toolbar.parent().append($toolbar.remove());
    // }

    var getHeight = function ($el) {
        var h = 0;

        if ($el.length && !$el.hasClass('hidden') && $el.css('position') != 'absolute') {
            h = $el.outerHeight();
        }
        return h;
    };

    var _adjustHeight = function () {
        var win_h = $content.parent().innerHeight() || $(win).height(),

            toolbar_h = getHeight($toolbar),
            condition_h = getHeight($condition),
            notice_h = getHeight($notice),
            toolbarbottom_h = getHeight($toolbarbottom);

        $content.css('height' ,win_h - toolbar_h - condition_h - notice_h - toolbarbottom_h);

        // content区域高度调整后，调整表格布局
        Util._layoutDatagridInContent();
    };

    var timer = 0;

    var adjustHeight = function () {
        timer && clearTimeout(timer);

        timer = setTimeout(_adjustHeight, 50);
    };

    $(win).on('resize.contentPage', adjustHeight);

    win.adjustContentHeight = _adjustHeight;

    $(_adjustHeight);

}(this, jQuery));