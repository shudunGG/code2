/*
* 标签搜索首页
* date: 2021-01-04
* author: guohanyu
*/

(function (win, $) {
    function requestList(){
        var params = {
            rankmode: "最多搜索",
            current: 1,
            pagesize: 3
        }
        Util.ajax({
            url: Config.ajaxUrls.listUrl,
            data: params,
            success: function (data) {
                data = data.result;
                var listTmpl = $("#list-item-tmpl").html();
                var $list = $("#list");
                Mustache.parse(listTmpl);
                var rendered = Mustache.render(listTmpl, data);
                $list.html(rendered);
            }
        });
    }
    requestList();

    $('body').on('click', '.search-btn', function () {
        var $searchInput = $("#keyword");
        Util.gotoUrl('./label_list.html', { 'keyword': $searchInput.val() });
    });

})(this, jQuery);