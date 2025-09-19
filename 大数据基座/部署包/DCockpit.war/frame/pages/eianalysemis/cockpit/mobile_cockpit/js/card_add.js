/**
 * 新增卡片
 * date: 2020-06-16
 * author: guohanyu
 **/

'use strict';

/* global pageConfig */
(function (win, $) {

    var $phoneContent = $('#phone-content'),
        $operate = $('#operate'),
        phoneContentTmpl = $('#phone-content-tmpl').html();

    var screenParam = {
        screenData :[]
    };
    
    // 点击图片区域
    $phoneContent.on('click', '.screen_click', function () {
        var $this = $(this),
            guid = $this.data('guid');
        $this.siblings().removeClass('active');
        $this.addClass('active');
        if(guid){
            $operate.removeClass('nodata');
        }
        // win.pageConfig.onCardSelect(guid);
    });

    // 获取图片数据
    win.getImgData = function (modelguid) {
        $.ajax({
            url:win.pageConfig.getImgDataUrl,
            data: {
                params: JSON.stringify({
                    modelguid: modelguid
                })
            },
            type: "POST",
            success: function (data) {
                data = data.custom.result;
                var dataList = data.cardData;
                screenParam.screenData = data.cardData;
                $.each(dataList, function (index, item) {
                    var point1 = item.point1.split(','),
                        point2 = item.point2.split(',');
                    item.left = point1[0] + 'px';
                    item.top = point1[1] + 'px';
                    item.width = Math.floor(point2[0]) - Math.floor(point1[0]) + 'px';
                    item.height = Math.floor(point2[1]) - Math.floor(point1[1]) + 'px';
                });
                $phoneContent.html(Mustache.render(phoneContentTmpl, data));
            }
        });
    };

    var initPage = function () {
        //getImgData();
    };

    initPage();

})(this, jQuery);