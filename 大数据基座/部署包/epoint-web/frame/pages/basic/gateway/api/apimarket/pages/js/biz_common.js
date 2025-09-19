(function($) {
    //业务全局变量扩展
    $.extend(Config, {
        PAGE_SIZE: 10, //每页记录数
        USER_INFO: {}
    });

    // 运行非框架层面的
    Util.runCommon();


    // console.log(para);

    // 后台采用流方式接受参数
    //Util.overwrite('ajaxParamsHandler', function(data) {
    //    return JSON.stringify(data);
    //});

    Util.overwrite("showLogin", function() {
        var c = layer.confirm("您还没有登录，请登录后访问！", {
            btn: ["前往登录", "立即注册"],
            title: "提示",
            btnAlign: 'c'
        }, function() {
            var returnUrl = location.href;
            Util.gotoUrl('../account/login.html?returnUrl=' + returnUrl);
        }, function() {
            Util.gotoUrl('../account/register.html');
        });
    });

    var $header = $('#header'),
        $footer = $('#footer');

    var headerInc = $header.length ? Util.getIncInstance($header[0].id, 'pages/_include/header.inc.html') : null;
    var footerInc = $footer.length ? Util.getIncInstance($footer[0].id, 'pages/_include/footer.inc.html') : null;

    // placeholder值
    var placeholder;

    var pageUrl = window.location.toString().match(/pages\/(\w+\/\w+)/ig),
        partUrl = pageUrl[pageUrl.length - 1];


    // if (partUrl == "pages/api/apidebug" && hideHeader) {
    //     $("#header").remove();
    //     $("#footer").remove();
    // } else {
    if (headerInc) {
        headerInc.fetch(function(el, $html) {
            //高亮菜单
            // 高亮菜单
            var pageList = window.location.toString().match(/pages\/(\w+\/\w+)/ig),
                subUrl = pageList[pageList.length - 1],

                // model = subUrl.substring(6, subUrl.length - 1),

                $curr_a = $("li[data-model='" + subUrl + "']", $html);
            // console.log(subUrl);
            if ($curr_a.length) {
                $curr_a.addClass("active");
            }

            Util.ajax({
                url: "../../js/widgets/fixedSlide.js",
                dataType: "script",
                type: 'get',
                success: function() {
                    $("#header").scrollFixed({ fixed: "left" });
                }
            });

            getScroll($(".common-list"));
            // var pagename = /pages\/(\w+\/\w+\.html)/i.exec(window.location.toString())[1],
            //     $curr_a = $("a[href*='" + pagename + "']", $html);

            // console.log(pagename);

            // if ($curr_a.length) {
            //     $curr_a.addClass("active").closest("li").addClass("active");
            // }

            // 引入插件用于头部水平跟随滚动


            //    获取搜索框的热门事项
            //getHotSearch("test/getHotSearch");
            // 用来存储搜索的文本（跳转过去之后再清除）

            var searchTimer = null,
                $search = $(".search"),
                $searchList = $("#search-list"),
                $hotSearch = $("#hot-search"),
                $topSearch = $("#top-search");

            // 事件绑定
            $topSearch.on("focus", function() {
                var that = $(this);
                if (!$.trim(that.val())) {
                    $hotSearch.removeClass("hidden");
                    $searchList.addClass("hidden");
                }
            }).on('keyup', function(event) {
                var that = $(this),
                    value = $.trim(that.val());
                if (value && value.length) {

                    if (event.keyCode == 13) {
                        // 页面跳转
                        if (subUrl.indexOf('pages/search/search') < 0) {
                            Util.gotoUrl("pages/search/search.html?key=" + value + "");
                        }

                    } else {
                        searchTimer && clearTimeout(searchTimer);
                        searchTimer = setTimeout(function() {
                            value = $.trim(that.val());
                            $hotSearch.addClass("hidden");
                            getVagueSearch("test/getVagueSearch", value);
                            // $('#tree-search-btn').trigger('click');
                        }, 600);
                    }
                } else {

                    searchTimer && clearTimeout(searchTimer);
                    $searchList.addClass("hidden");
                    if (event.keyCode == 13) {
                        if (placeholder) {
                            Util.gotoUrl("pages/api/apidetail.html?key=" + placeholder + "");
                        } else {
                            layer.alert('请输入内容！', { title: "", closeBtn: false }, function(index) {
                                layer.close(index);
                            });
                        }
                    }

                }
            });

            // 点击模糊查询项
            $search.on("click", ".top-search-item", function() {
                // 记录
                var that = $(this),
                    id = that.data("id");
                // 页面跳转
                Util.gotoUrl("pages/api/apidetail.html?key=" + id + "");
            }).on("click", ".search-btn", function() {
                // 点击搜索按钮
                var value = $.trim($topSearch.val());
                if (value) {
                    if (subUrl.indexOf('pages/search/search') < 0) {
                        Util.gotoUrl("pages/search/search.html?key=" + value + "");
                    }
                } else {

                    // 如果有placeholder 直接搜placeholder的值
                    if (placeholder) {
                        Util.gotoUrl("pages/api/apidetail.html?key=" + placeholder + "");
                    } else {
                        layer.alert('请输入内容！', { title: "", closeBtn: false });
                    }

                }
            });

            // 点击页面其他区域
            $(document).on("click", function(e) {
                var target = e.target;
                if (!$.contains($search[0], target)) {
                    $hotSearch.addClass("hidden");
                    $searchList.addClass("hidden");
                }
            });


            // Util.ajax({
            //     url: "http://192.168.201.159:9100/Test/IsLogin",
            //     success: function(data) {
            //         data = data.custom;
            //         //数据格式参考，
            //         //{   //判断是否登录，如果登录islogin:true,并且返回username
            //         //    "custom": { "islogin": false },
            //         //    "status": { "code": 200, "url": "", "text": "" },
            //         //    "controls": []
            //         //}
            //         $("#accounbtn", $html).toggle(!data.islogin);
            //         $("#userinfo", $html).toggle(data.islogin);

            //         if (data.islogin) {
            //             $(".username", $html).text(data.username); //后台返回用户名
            //             Config.USER_INFO.UserName = data.username;
            //             Config.USER_INFO.IsLogin = true;
            //         }
            //     }
            // });

        });
    }

    if (footerInc) {
        footerInc.fetch(function() {

            console.log('footer is loaded');
        });
    }
    // }







    // 热门搜索
    function getHotSearch(url) {
        Mock.mock(url, function() {
            data = Mock.mock({
                'hotTop': {
                    'name': '@ctitle(5, 10)',
                    'guid': '@guid()'
                },
                'otherHot|7': [{
                    'name': '@ctitle(2, 5)',
                    'guid': '@guid()'
                }]
            });

            return {
                controls: [],
                custom: data,
                status: {
                    code: 200,
                    text: "",
                    url: ""
                }
            };
        });

        // 执行请求（对接的时候直接把上面的mock这一段去掉即可）
        Util.ajax({
            url: url,
            success: function(data) {
                data = data.custom;
                if (data.hotTop) {
                    $("#top-search").attr("placeholder", data.hotTop.name);
                    $("#top-search").attr("data-id", data.hotTop.guid)
                    placeholder = data.hotTop.guid;

                    getPlaceholder($("#top-search"));
                }
                // placeholder
                var html = "";
                $.each(data.otherHot, function(i, item) {
                    html +=
                        "<li class='top-search-item' data-id=" +
                        item.guid + ">" + item.name + "</li>";
                });

                $("#hot-list").html($.trim(html));

                $("#hot-list")
                    .getNiceScroll()
                    .resize();
            }
        });


    }

    // 模糊搜索
    function getVagueSearch(url, val) {
        // var list;
        Mock.mock(url, function() {
            data = Mock.mock({
                "vague|0-5": [{
                    'name': "@ctitle(5, 10)",
                    'guid': "@guid()"
                }]
            });

            return {
                controls: [],
                custom: data,
                status: {
                    code: 200,
                    text: "",
                    url: ""
                }
            };
        });


        // 执行请求（对接的时候直接把上面的mock这一段去掉即可）
        Util.ajax({
            url: url,
            data: {
                "key": val
            },
            success: function(data) {
                data = data.custom.vague;
                var html = "";

                if (data && data.length) {

                    $.each(data, function(i, item) {
                        html += "<li class='top-search-item' data-id=" + item.guid + ">" + item.name + "</li>";
                    });

                    $("#search-list").html($.trim(html));


                    $("#search-list").removeClass("hidden");

                    $("#search-list").getNiceScroll().resize();
                }
                // $("#top-search").attr("placeholder", data.hotTop);
            }
        });


    }

    // 获取placeholder
    function getPlaceholder(target) {
        Util.ajax({
            url: '../../js/widgets/jquery.placeholder.min.js',
            type: 'get',
            dataType: "script",
            success: function() {
                // console
                if (target && target.length) {
                    target.placeholder();
                }
            }
        })
    }

    function getScroll(target) {
        Util.ajax({
            url: "../../js/widgets/jquery.nicescroll.min.js",
            dataType: "script",
            type: 'get',
            success: function() {
                if (target && target.length) {
                    target.niceScroll({
                        cursorcolor: "#d5d5ec",
                        cursorwidth: "6px",
                        cursorborder: "none",
                        zindex: 9999,
                        horizrailenabled: false
                    });
                }

            }
        });
    }

    getPlaceholder();
    getScroll();

    // 引入nicescroll



    // 重写ajaxPreSuccess
    Util.overwrite("ajaxPreSuccess", function(data) {
        var status = data.status,
            code = 1,
            text = '',
            url = '';

        // f9 response
        if (status) {
            code = Util.toInt(status.code);
            text = status.text;
            url = status.url;

            $.proxy(Util.statusNodeHandler, this)(code, text, url);
        }

        if (typeof(data.custom) == 'string') {
            data.custom = JSON.parse(data.custom);
        }

        return data;
    });
    // $('body').on('click', '.quit', function(event) {
    //     layer.confirm('您确认要注销登录？', {
    //         btn: ['确定', '取消'],
    //         title: "注销"
    //     }, function() {
    //         // TODO 确认退出需要发送ajax
    //         Util.ajax({
    //             url: "http://192.168.201.159:9100/Test/LogOff",
    //             success: function(data) {
    //                 data = data.custom;
    //                 if (data.success) {
    //                     Util.gotoUrl("../account/login.html");
    //                 } else {
    //                     layer.msg(data.message);
    //                 }
    //             }
    //         });
    //     });
    // }).on("click", ".needlogin", function(event) {
    //     if (!Config.USER_INFO.IsLogin) {
    //         event.preventDefault();
    //         var _this = this;
    //         var c = layer.confirm("您还没有登录，请登录后访问！", {
    //             btn: ["前往登录", "立即注册"],
    //             title: "提示",
    //             btnAlign: 'c'
    //         }, function() {
    //             var returnUrl = location.href;
    //             if (_this.href) {
    //                 returnUrl = _this.href;
    //             }
    //             Util.gotoUrl('../account/login.html?returnUrl=' + returnUrl)
    //         }, function() {
    //             Util.gotoUrl('../account/register.html')
    //         });
    //         return false;
    //     }
    // });


}(jQuery));