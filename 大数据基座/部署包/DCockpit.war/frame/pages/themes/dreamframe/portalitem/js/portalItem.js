(function(win, $) {

    // 获取模版
    var waithadletempl = $.trim($('#waithadletempl-' + type).html());

    var buttontempl = $.trim($('#buttontempl-' + type).html());

    var M = Mustache;

    // 获取后台数据
    Util.ajax({
        type: 'POST',
        dataType: 'json',
        url: dataUrl,
        data: {
            query: type
        },
        success: function(data) {
            generateHtml(data);
        }
    });

    // 拼接html
    function generateHtml(data) {

        // 内容html
        var html = [];

        if (data.messageList) {
            $.each(data.messageList, function(i, item) {
                html.push(M.render(waithadletempl, item));
            });
        }

        html = html.join("");

        $(".portalitem-body").html(html);

        // 按钮html
        html = [];
        if (data.buttonList) {
            $.each(data.buttonList, function(i, item) {
                html.push(M.render(buttontempl, item));
            });

        }


        html = html.join("");

        if (type == "large") {
            $(".portalitem-remind").html(html);
        } else if (type == "medium") {
            $(".portalitem-header-button").html(html);
        }

    }

}(this, jQuery));
