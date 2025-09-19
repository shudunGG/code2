// contentpage信息提示notice区域交互
(function (win, $) {
    var $notice = $('.fui-notice');

    if (!$notice.length) return;

    var $toolbar = $('.fui-toolbar'),
        $helper = $toolbar.find('[role="helper"]');

    if (!$helper.length) return;

    // 按照新格式 仅显示图标 直接放在最右侧
    $helper.addClass('fui-toolbar-helper r').attr('title', $helper[0].innerHTML).empty();

    // right
    var $floatRight = $toolbar.find('.r');
    if ($floatRight.length) {
        $floatRight.eq(0).before($helper);
    } else {
        $helper.appendTo($toolbar);
    }

    var showAsTooltip = $helper[0].getAttribute('showtype') == 'tooltip' ? true : false;

    // 创建关闭按钮
    var $close = $('<span class="notice-close-btn"></span>').appendTo($notice);

    // tooltip 格式
    if (showAsTooltip) {
        var contentHtml = $notice[0].innerHTML,
            tip = new mini.ToolTip();

        tip.set({
            target: document,
            scope: $toolbar[0],
            trigger: 'click',
            selector: '.fui-toolbar-helper',
            placement: 'bottom',
            autoHide: false,
            theme: 'light',
            defaultTheme: 'light',
            onbeforeopen: function (e) {
                e.content = contentHtml;
                e.cancel = false;
            }
        });
        tip.addCls('fui-toolbar-tooltip');

        // 点击按钮关闭
        $('.fui-toolbar-tooltip').on('click', '.notice-close-btn', function () {
            tip.close();
        });
    } else {
        // 默认格式
        var wrapHtml = '<div class="fui-notice-inner"></div>';

        $notice.children().wrapAll(wrapHtml);

        $helper.on('click', function () {
            $notice.toggleClass('hidden', !$notice.hasClass('hidden'));

            adjustContentHeight();
        });

        $close.on('click', function () {
            $helper.trigger('click');
        });

    }

}(this, jQuery));