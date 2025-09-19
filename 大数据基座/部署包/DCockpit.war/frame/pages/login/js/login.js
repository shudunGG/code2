(function(window) {
    if (!window.Util) {
        window.Util = {};
    }
    Util.getExplorerInfo = function() {
        var explorer = window.navigator.userAgent.toLowerCase(),
            ver;
        //ie
        if (explorer.indexOf("msie") >= 0) {
            ver = explorer.match(/msie ([\d.]+)/)[1];
            return {
                type: "IE",
                version: ver
            };
        }
        //firefox
        else if (explorer.indexOf("firefox") >= 0) {
            ver = explorer.match(/firefox\/([\d.]+)/)[1];
            return {
                type: "Firefox",
                version: ver
            };
        }
        //Chrome
        else if (explorer.indexOf("chrome") >= 0) {
            ver = explorer.match(/chrome\/([\d.]+)/)[1];
            return {
                type: "Chrome",
                version: ver
            };
        }
        //Opera
        else if (explorer.indexOf("opera") >= 0) {
            ver = explorer.match(/opera.([\d.]+)/)[1];
            return {
                type: "Opera",
                version: ver
            };
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
            ver = explorer.match(/version\/([\d.]+)/)[1];
            return {
                type: "Safari",
                version: ver
            };
        }
        //手机端
        else {
            return {
                type: "IE",
                version: "none"
            };
        }
    };
}(this));

(function(win, $) {

    $('[placeholder]').placeholder();

    //记住密码按钮
    $('body').on('click', '.rem-btn', function() {
        $(this).toggleClass('checked');
    });

    //背景
    var bv = new Bideo();
    bv.init({
        videoEl: document.querySelector("#background_video"),
        container: document.querySelector("body"),
        resize: true,
        src: [{
            src: "images/bg.mp4",
            type: "video/mp4"
        }]
    });

    // 申明对象
    var params = {};

    // 设置cookie,记录登录方式
    var setCookie = function() {
        $.cookie('loginStyle', JSON.stringify(params), { expires: 7 });
    };
    // 翻转特效
    var cubeTransition = function() {
        var length = $('#cubeTransition>div').length,
            current = 1,
            next = 1,
            outClass, inClass, onGoing = false;
        $('#cubeTransition>div:eq(' + (current - 1) + ')').show();




        for (i = 0; i < length; i++) {
            var bullet = $("<li></li>");
            if (i == 0) bullet.addClass('active');
            $("#bullets").append(bullet);
        }

        function openIndex(i, type) {
            if (!onGoing && next != i) {
                onGoing = true;
                next = i;
                outClass = current > i ? 'rotateCubeBottomOut top' : 'rotateCubeTopOut top';
                inClass = current > i ? 'rotateCubeBottomIn' : 'rotateCubeTopIn';
                show();
            }
            params.type = type;
            setCookie();

        }

        function trans(direction) {
            if (!onGoing) {
                onGoing = true;
                if (direction == 'up') {
                    next = current > 1 ? current - 1 : length;
                    outClass = 'rotateCubeBottomOut top';
                    inClass = 'rotateCubeBottomIn';
                } else {
                    next = current < length ? current + 1 : 1;
                    outClass = 'rotateCubeTopOut top';
                    inClass = 'rotateCubeTopIn';
                }
                show();
            }
        }

        function show() {

            $('#cubeTransition>div:eq(' + (current - 1) + ')').addClass(outClass);
            $('#cubeTransition>div:eq(' + (next - 1) + ')').addClass(inClass);
            $('#bullets>li:eq(' + (current - 1) + ')').removeClass('active');
            $('#bullets>li:eq(' + (next - 1) + ')').addClass('active');
            $('#cubeTransition>div:eq(' + (next - 1) + ')').show();
            setTimeout(function() {
                $('#cubeTransition>div:eq(' + (current - 1) + ')').hide();
            }, 500);
            setTimeout(function() {
                $('#cubeTransition>div:eq(' + (current - 1) + ')').removeClass(outClass);
                $('#cubeTransition>div:eq(' + (next - 1) + ')').removeClass(inClass);
                current = next;
                onGoing = false;
            }, 800);
        }

        $('#cubeTransition').on('click', '#code', function() {
            openIndex(2, 1);
        }).on('click', '#brain', function() {
            openIndex(1, 0);
        });
    };

    // IE，翻转取消，直接切换
    var checkIE = function() {
        var gather = Util.getExplorerInfo();

        if (gather.type == "IE") {
            if (gather.version == "7.0" || gather.version == "8.0") {
                $('.keepOut').addClass('hidden');
            }
            $('#cubeTransition').removeClass('NOIE');

            $('#cubeTransition').on('click', '#code', function() {
                params.type = 1;
                setCookie();
            }).on('click', '#brain', function() {
                params.type = 0;
                setCookie();
            });

        } else {
            $('.example').removeClass('hidden');
            cubeTransition();
        }
    };

    checkIE();
})(this, jQuery);