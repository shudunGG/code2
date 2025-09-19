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
        Util.gotoUrl('./label_list.html', { 'keyword': $searchInput.val() });
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
            url: getRootPath() + '/rest/portraittags/getDetail',
            data: {
                tagguid: Util.getUrlParams("labelguid")
            },
            success: function(data){
                data = data.result.tag;
                console.log(data);
                Mustache.parse(bannertmpl);
                var rendered = Mustache.render(bannertmpl, data);
                $(".banner").html(rendered);

                Mustache.parse(contenttmpl);
                var rendered = Mustache.render(contenttmpl, data);
                $("#sectionwrap").html(rendered);
                if ((data.tag_type == "主键" || data.tag_type == "规则" ) && typeof data.rule_desc == "object") {
                    setTimeout(function () {
                        
                        if(data.rule_desc.length > 0){
                            ruleOperate.editRule(data.rule_desc);
                            $('#basicRole').show();
                        }
                        
                    }, 30);
                    
				}
            }
        });
    }
    render();
})(this, jQuery);