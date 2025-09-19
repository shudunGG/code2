// 渲染标题图片实现
(function (win, $) {
    var TITLE_IMG_TPL = '<img class="title-img-item l" data-src="{{src}}" src="{{url}}"/>';
    var $imgList = $('#title-img-container').find('.img-list');
    var renderTitleImgs = (function () {
        var isInit = false;

        return function (data) {
            if (isInit || !data || !data.length) {
                return;
            }
            isInit = true;
            var html = '';
            $.each(data, function (i, item) {
                html += Mustache.render(TITLE_IMG_TPL, {
                    url: Util.getRightUrl(item),
                    src: item
                });
            });

            $(html).appendTo($imgList);
        };
    }());

    

    win.renderTitleImgs = renderTitleImgs;
}(this, jQuery));