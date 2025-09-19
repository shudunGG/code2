(function (win, $) {
    // 视图切换
    $('body').on('click', '.fui-toolbar.my-model .diy-button', function (e) {
        var $this = $(this);
        if ($this.hasClass('active')) return;

        $this.addClass('active').siblings().removeClass('active');

        if ($this.hasClass('btn-card')) {
            $($('#card-view-tpl').html()).appendTo($('#grid-wrap').empty());
            $(".page-toolbar").hide();
            mini.parse();
            DtoUtils.bindBeforeLoad();
            // todo 重新加载数据
            epoint.refresh(['datagrid','condition']);
        } else if ($this.hasClass('btn-list')) {
            $($('#list-view-tpl').html()).appendTo($('#grid-wrap').empty());
            $(".page-toolbar").show();
            mini.parse();
            DtoUtils.bindBeforeLoad();
            // todo 重新加载数据
            epoint.refresh(['datagrid','condition']);
//            $('.my-model').attr('style','padding-top: 5px;');
        }
    });
})(this, this.jQuery);
