/*
* 标签详情
* date: 2020-12-30
* author: guohanyu
*/

(function (win, $) {

    var $fix = $(".fix"),
        $fixtop = $(".fix-top"),
        $nav = $("#nav"),
        $searchInput = $('.search-input');

    $nav.onePageNav({
        offset: 70,
        scrollThreshold: 0.5,
    });

    $fixtop.scrollFix({
        distanceTop: 82
    });
    $fix.scrollFix();

    setTimeout(function () {
        $('html, body').scrollTop(0);
    }, 30);

    // 搜索
    $('body').on('click', '.search-btn', function () {
        Util.gotoUrl('./norm_list.html', { 'keyword': $searchInput.val() });
    });

    function getRootPath() {
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName
            .substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPaht + projectName);
    }
    function render() {
        var bannertmpl = $("#banner-tmpl").html();
        var contenttmpl = $("#content-tmpl").html();
        Util.ajax({
            url: getRootPath() + '/rest/cockpitnorm/getDetail',
            data: {
                rowguid: Util.getUrlParams("rowguid")
            },
            success: function(data){
                console.log(data);
                data = data.result.norm;
                
                Mustache.parse(bannertmpl);
                var rendered = Mustache.render(bannertmpl, data);
                $(".banner").html(rendered);

                Mustache.parse(contenttmpl);
                var rendered = Mustache.render(contenttmpl, data);
                $("#sectionwrap").html(rendered);
            }
        });
    }
    render();
})(this, jQuery);