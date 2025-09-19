/*!
 *新点数据建模平台首页样式集合
 *author:guli
 *date:2020-08-17
 *version:1.1.0
 */
(function(win, $) {
    $(document).ready(function() {
        var $section = $('section'),
            $left = $section.find('>.left'),
            $center = $section.find('>.center'),
            $right = $section.find('>.right'),
            $modeling = $center.find('>.modeling');
        $left.css('transform', 'translateX(0)');
        $right.css('transform', 'translateX(0)');
        $modeling.css({
            'transform': 'scale(1)',
            'opacity': 1
        });
        setTimeout(function() {
            $('html').css('background-color', '');
        }, 200);
    });

    //遍历图片生成小圆点
    var $car = $(".carousel");
    var $moveBox = $car.find(">.moveBox");
    var $boxLists = $moveBox.find(">.boxList");
    var $leftBtn = $car.find(">.leftBtn");
    $leftBtn.addClass("disabled");
    var $rightBtn = $car.find(">.rightBtn");
    var $circles = $car.find(">.circles");
    var moveWidth = $boxLists.length * 100 + '%';
    $moveBox.css('width', moveWidth);
    var listWidth = 100 / $boxLists.length + '%';
    $boxLists.css('width', listWidth);
    for (var i = 0; i < $boxLists.length; i++) {
        var $dd = $("<dd class='circle'></dd>");
        $circles.append($dd);

    }
    var margin = -$circles.width() / 2 + 'px';
    $circles.css('margin-left', margin);
    var $circleLis = $circles.find('>.circle');
    $circleLis.eq(0).addClass('active');
    var index = 0;
    $car.on('click', '.rightBtn', function() {
        index++;
        console.log(index);
        changeBtn();
        moveBox();
        changeCircle();
    });
    $car.on('click', '.leftBtn', function() {
        index--;
        changeBtn();
        moveBox();
        changeCircle();
    });

    $car.on('click', '.circle', function() {
        var tempIndex = $(this).index();
        index = tempIndex;
        moveBox();
        changeBtn();
        changeCircle();
    });

    function moveBox() {
        var percent = -index * 100 + '%';
        $moveBox.stop().animate({ "left": percent }, 1000);
    }

    function changeCircle() {
        $circleLis.removeClass('active');
        $circleLis.eq(index).addClass('active');
    }

    function changeBtn() {
        if (index >= $boxLists.length - 1) {
            index = $boxLists.length - 1;
            $rightBtn.addClass('disabled');
            $leftBtn.removeClass('disabled');
        } else if (index <= 0) {
            index = 0;
            $leftBtn.addClass('disabled');
            $rightBtn.removeClass('disabled');
        } else if (0 < index < $boxLists.length - 1) {
            $leftBtn.removeClass('disabled');
            $rightBtn.removeClass('disabled');
        }
    }
    
    $('.date').on('click',function(){
    	window.location.href=Util.getRightUrl("frame/fui/pages/themes/datacenter/datacenter-date?code=7793");
    });
    $('.deploy').on('click',function(){
    	window.location.href=Util.getRightUrl("frame/fui/pages/themes/datacenter/datacenter-display?code=7796");
    });
    $('.model').on('click',function(){
    	window.location.href=Util.getRightUrl("frame/fui/pages/themes/datacenter/datacenter-model?code=7795");
    });
    var $userOuter = $('.userOuter'),
    $user = $userOuter.find('.user'),
    $clickUser = $userOuter.find('.clickUser'),
    flag = true;
    $userOuter.on('click', '.user', function() {
	    if (flag) {
	        $user.addClass('active');
	        $clickUser.stop().slideDown(200);
	        flag = false;
	    } else {
	        $user.removeClass('active');
	        $clickUser.stop().slideUp(200);
	        flag = true;
	    }
    })
    .on('click', '.exit', function () {
        var $this = $(this);
        console.log($this);
            // 注销
            mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
                if (action == 'ok') {
                    window.location.href = Util.getRightUrl('rest/logout?isCommondto=true');
                }
            });
        $user.removeClass('active');
    }).on('click', '.change-pwd', function () {
        // 修改密码
            	dealLinkOpen({
                    id: "change-pwd",
                    name: "修改密码",
                    url: "frame/pages/basic/personalset/mypasswordmodify",
                    openType: "dialog"
                })
    });


      // 处理链接打开
    win.dealLinkOpen = function (linkData) {
        switch (linkData.openType) {
            case 'tabsnav':
                TabsNav.addTab(linkData);
                break;
            case 'dialog':
                epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
                break;
            case 'blank':
                win.open(Util.getRightUrl(linkData.url), (linkData.id + '').replace(/-/g, '_'));
                break;
            default:
                break;
        }
    };

})(this, this.jQuery);

//2022.12.08修改
(function(win, $) {
})(this, this.jQuery);