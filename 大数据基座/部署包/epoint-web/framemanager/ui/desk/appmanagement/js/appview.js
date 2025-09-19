(function ($, win) {

    var $curAppView = null;
    var miniAddr = mini.get('addr');

    // 保存应用视图
    $('#save-appviewconfig').on('click', function () {
        if (epoint.validate('fui-form')) {
            var value = miniAddr.getValue();

            $curAppView.attr('data-addr', value);
            epoint.closeDialog('ok');
            value ? $curAppView.removeClass('disable') : $curAppView.addClass('disable');
        }
    });

    // 取消应用视图
    $('#cancel-appviewconfig').on('click', function () {
        epoint.closeDialog();
    });

    window.pageLoad = function (param) {
        miniAddr.setValue(param.addr);
        $curAppView = param.$el;
    };
}(jQuery, window));
