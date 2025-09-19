(function($) {
    // 运行非框架层面的
    Util.runCommon();

    //业务全局变量扩展
    $.extend(Config, {
        PAGE_SIZE: 10 //每页记录数
    });

    Util = $.extend(
        {
            //设置导航菜单高亮
            setNavActive: function(header) {
                var $html = $(header);
                var location = window.location.toString();

                // 高亮菜单
                var pagename = /pages(\/\w+\/\w+)/i.exec(location)[1],
                    $curr_a = $("a[href*='" + pagename + "']", $html);

                if (!$curr_a.length) {
                    var parentName = /pages(\/\w+\/)/i.exec(location)[1];
                    $curr_a = $("a[href*='" + parentName + "']", $html);
                }
                $curr_a
                    .addClass("active")
                    .parents("li")
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
            },
            isLogin: function(fn) {
                Util.ajax({
                    url: Config.ajaxUrls.isLogin,
                    success: function(res) {
                        fn && fn(res);
                    },
                    error: function() {
                        fn &&
                            fn({
                                isLogin: false
                            });
                    }
                });
            }
        },
        Util
    );
    Util.loadInclude("header", Config.ajaxUrls.headerPath, function(html) {
        var $html = $(html);
        Util.setNavActive(html);
        /* Util.isLogin(function(data) {
            if (data.isLogin) {
                $(".user .user-name", $html).show();
            } else {
                $(".user .login", $html).show();
            }
        }); */

        Util.clock('<span>{{yyyy}}/{{MM}}/{{dd}}</span> <span>{{H}}：{{mm}}：{{ss}}</span> <span>{{EEE}}</span>', $('#timer'));
    });
 
    Util.loadInclude("footer", Config.ajaxUrls.footerPath, function() {
        // console.log("footer is loaded");
    });
})(jQuery);
