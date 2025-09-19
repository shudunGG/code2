/**
 * 网站大师头像裁剪页面js
 * author:陈东顺
 * date:2017-01-03
 */

(function(win, $) {
    // 滑块拖动事件
    var $zoomSlider = $('#nstSlider').nstSlider({
        "left_grip_selector": ".leftGrip",
        "value_bar_selector": ".bar",
        "value_changed_callback": function(cause, value) {
            // 值改变时 进行缩放
            if (cause !== 'init') {
                var aimZoom = value / 100 + 1;
                imgCropper.zoomTo(aimZoom);
            }
        }
    });

    // 用于初始化后为滑块设置最小值和当前值
    function initSliderPosition() {
        imgCropper.zoomTo(0);
        var zoom = 100 * (imgCropper.getZoom() - 1);
        $zoomSlider.nstSlider('set_range', zoom, 100);
        $zoomSlider.nstSlider('set_position', zoom);
    }
    win.initSliderPosition=initSliderPosition;
    
    
    // imgCropper.init('./images/test/1.png', {
    //     // 第二个参数可传递一些配置信息
    //     // aspectRatio: 1,
    //     autoCropArea: 0.9,
    //     // 初始化后执行的回调
    //     built: function() {
    //         // 根据图片调整滑块范围和位置（必须)
    //         initSliderPosition();
    //     }
    // });

    

    // tool-bar 事件
    $('#tool-bar').on('click', function(e) {
        var $target = $(e.target),
            nowZoom;

        if ($target.hasClass('zoomout')) {
            imgCropper.zoomOut();
            nowZoom = 100 * (imgCropper.getZoom() - 1);

            $zoomSlider.nstSlider('set_position', nowZoom);

        } else if ($target.hasClass('zoomin')) {
            imgCropper.zoomIn();
            nowZoom = 100 * (imgCropper.getZoom() - 1);
            $zoomSlider.nstSlider('set_position', nowZoom);

            // $zoomSlider[0].value = nowZoom;
        } else if ($target.hasClass('rotate-left')) {
            imgCropper.rotate(-90);
        } else if ($target.hasClass('rotate-right')) {
            imgCropper.rotate(90);
        }
    });
    // 键盘事件支持
    $('body').on('keyup', function(e) {
        var code = e.which;
        // up down left right
        // 38 40 37 39
        switch (code) {
            case 38:
                imgCropper.cropperMove(0, -5);
                break;
            case 40:
                imgCropper.cropperMove(0, 5);

                break;
            case 37:
                imgCropper.cropperMove(-5, 0);

                break;
            case 39:
                imgCropper.cropperMove(5, 0);
                break;
            default:
                break;
        }
    });


    // 确定按钮
    $('#submit').on('click', function() {
        // 获取裁剪数据 参数可指定生成图像的宽高度
        var imgdata = imgCropper.getData({
            width: 300,
            height: 300
        });
        // imgdata 即为裁剪后的头像信息 格式如下
        // imgdata = {
        //     data: 'data:image/jpeg;base64,/9...', // data字段为裁剪出头像的base64字符串
        //     info字段为裁剪的坐标信息
        //     info: {
        //         height: 478,
        //         rotate: 0,
        //         scaleX: 1,
        //         scaleY: 1,
        //         width: 478,
        //         x: 45,
        //         y: 27
        //     }
        // };


        // 将数据提交到服务器即可，
        // 注意在成功回调中关闭此页面
        // TODO
        window.open(imgdata.data);
    });
    // 更换图片事件
    $('#change-img').on('click', function() {
        // 用户上传一张图片 成功后执行下面的代码
        // 第一个参数为 新上传的图片的路径
        // 第二个参数为 初始化的一些配置，一般不需要额外配置，但built回调函数即其中执行的 initSliderPosition();是必须的
        // imgCropper.init('./images/test/1.png', {
        //     // 初始化后执行的回调
        //     built: function() {
        //         // 根据图片调整滑块范围和位置（必须
        //         initSliderPosition();
        //     }
        // });
        //
        // TODO
         console.log('用户上传一张图片 成功后执行下面的代码');
    });


}(this, jQuery));





// 经典头像
(function(win, $) {
    // 渲染
    var CLASSIC_HEAD_TPL = $.trim($('#classic-head-templ').html());

    // 头像是否已经加载
    var imgLoaded = false,
        // 当前选择的头像li
        $activeItem;

    var $classicHeadList = $('#classic-head-list'),
        $modal = $('#classic-modal');

    // 渲染头像
    var render = function(data) {
        var html = '';

        for (var i = 0, l = data.length; i < l; i++) {
            html += Mustache.render(CLASSIC_HEAD_TPL, data[i]);
        }

        $(html).appendTo($classicHeadList.empty());
    };

    // 点击打开弹窗
    $('#use-classic').on('click', function(e) {
        // 未加载图片时加载图片 否则直接显示
        if (!imgLoaded) {
            $.ajax({
                url: classicHeadUrl,
                dataType: 'JSON'
            }).done(function(data) {
                render(data);
                imgLoaded = true;
                $modal.removeClass('hidden');
                // 初始化虚拟滚动条
                if (!$.fn.niceScroll) {
                    $.ajax({
                        url: './js/jquery.nicescroll.min.js',
                        dataType: 'script'
                    }).done(function() {
                        $classicHeadList.niceScroll();
                    });
                } else {
                    $classicHeadList.niceScroll();
                }
            });
        } else {
            $modal.removeClass('hidden');
        }
    });

    // 头像点击事件
    $classicHeadList.on('click', '.classic-head-item ', function(e) {
        var $this = $(this);

        // 记录当前头像
        $activeItem = $this.addClass('active');

        $activeItem.siblings().removeClass('active');
    });

    // 确定 取消
    $('#classic-head-ok').on('click', function(e) {
        // 无头衔直接返回
        if (!($activeItem && $activeItem.length)) {
            console.log('您必须选择一个 头像！');
            return;
        } else {
            var src = $activeItem.find('img')[0].src;
            console.log('选择头像的路径为：', src);
            // 发出请求 提交选择的经典头像的路径
            $.ajax({

                url: '',
                data: {
                    headImgSrc: src
                },
                type: 'POST'
            }).done(function(data) {
                // 可根据服务端返回数据给出用户提醒等
                console.log(data);

                // 移除头像激活状态(必须 不可移除)
                $activeItem.removeClass('active').siblings().removeClass('active');
                $activeItem = null;

                // 关闭推荐头像 modal
                $modal.addClass('hidden');

                // 关闭头衔弹出窗
                // TODO
            });
        }
    });
    $('#classic-head-cancel').on('click', function(e) {
        $modal.addClass('hidden');
    });

    // modal 顶部关闭事件
    $modal.on('click', '.modal-close-btn', function(e) {
        $modal.addClass('hidden');
    });



}(window, jQuery));
