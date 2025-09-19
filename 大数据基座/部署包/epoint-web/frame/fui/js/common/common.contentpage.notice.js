// contentpage信息提示notice区域交互
(function (win, $) {
    var $notice = $('.fui-notice');

    if (!$notice.length) return;

    var $toolbar = $('.fui-toolbar:not(.bottom)'),
        $toolbarBottom = $('.fui-toolbar-bottom'),
        $helper = $toolbar.add($toolbarBottom).find('[role="helper"]');

    if (!$helper.length) {
        console.error('当前页面存在 【.fui-notice】 区域，但工具栏中不存在【[role="helper"]】按钮， 帮助提示功能无法正常使用');
        return;
    }

    $helper.addClass('fui-toolbar-helper').attr('title', $helper.text() ).empty();
    if ($helper.parent('.fui-toolbar').length) {
        // 如果是在顶部工具栏中 则在最后即可
        $helper.addClass('r');
        var $lr = $toolbar.find('> .r').eq(0);
        $lr.length ? $helper.insertBefore($lr) : $helper.appendTo($toolbar);
    } else {
        // 否则需要 fixed 到顶部
        $helper.addClass('fixed').appendTo('body');
    }

    // right
    // var $floatRight = $toolbar.find('.r');
    // if ($floatRight.length) {
    //     $floatRight.eq(0).before($helper);
    // } else {
    //     $helper.appendTo($toolbar);
    // }

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
                $helper.addClass('active');
                if ($helper.hasClass('fixed')) {
                    $(tip.el).css('margin-right', 5);
                }
                e.content = contentHtml;
                e.cancel = false;
            }
        });
        tip.addCls('fui-toolbar-tooltip');

        $(window).on('resize', function () {
            $helper.removeClass('active');
            tip.close();
        });

        // 点击空白区域时自动隐藏
        $('body').on('click', function(e){
            if(!$(e.target).closest('.fui-toolbar-tooltip').length) {
                $helper.removeClass('active');
                tip.close();
            }
        });
        // 点击按钮关闭
        $('.fui-toolbar-tooltip').on('click', '.notice-close-btn', function () {
            $helper.removeClass('active');
            tip.close();
        });
    } else {
        // 默认格式
        var wrapHtml = '<div class="fui-notice-inner"></div>';

        $notice.children().wrapAll(wrapHtml);
        $helper.toggleClass('active', !$notice.hasClass('hidden'));

        $helper.on('click', function () {
            $notice.toggleClass('hidden', !$notice.hasClass('hidden'));
            $helper.toggleClass('active', !$notice.hasClass('hidden'));

            if ($helper.hasClass('fixed') && $helper.hasClass('active')) {
                $helper.addClass('hidden');
            } else {
                $helper.removeClass('hidden');
            }

            adjustContentHeight();
        });

        $close.on('click', function () {
            $helper.trigger('click');
        });

    }

}(this, jQuery));