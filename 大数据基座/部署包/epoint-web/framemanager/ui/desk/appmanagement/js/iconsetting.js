(function (win, $) {

    var $iconSetting = $('#icon-setting'); // 图标管理

    var tplCustomicon = $('#tpl-customicon').html(), // 模板自定义图标
        tplFrameicon = $('#tpl-frameicon').html(); // 模板框架图标

    /**
     * 初始化页面
     */
    function initPage () {
        // 初始化事件监听
        initListeners();
    }

    // 接收参数
    window.pageLoad = function (data) {
        var icondata = data.icondata,
            icon = data.icon,
            bgcolor = data.bgcolor;

        $.each(icondata, function (i, e) {
            var type = e.type,
                children = e.children,
                item = '';

            $.each(children, function (_i, _e) {
                if (type == 'frame') {
                    item += Mustache.render(tplFrameicon, _e);
                } else {
                    item += Mustache.render(tplCustomicon, _e);
                }
            });

            type === 'frame' ? $('#icon-frame-items').html(item) : $('#icon-custom-items').html(item);
        });

        $iconSetting.find('.ig.icon-bgcolor-' + bgcolor).addClass('active');
        $iconSetting.find('.app-icon-item[data-icon="' + icon + '"]').addClass('active');
    };

    /**
     * 初始化事件监听
     */
    function initListeners () {
        // 确定选择图标
		$('#save-iconsetting').on('click', function () {
			closeIconSetting({
                bgcolor: $iconSetting.find('.ig.active').attr('data-bgcolor'),
                icon: $iconSetting.find('.app-icon-item.active').attr('data-icon'),
                msg: 'save'
            });
		});

		// 点击关闭图标设置
		$('#cancel-iconsetting').on('click', function () {
            closeIconSetting({
                msg: 'cancel',
                bgcolor: '',
                icon: ''
            });
        });
        
        // 点击图标设置 - 框架图标
		$iconSetting.on('click', '.icon-frame-item', function () {
			var $this = $(this);

			$this.addClass('active').siblings().removeClass('active');
			$iconSetting.find('.icon-custom-item').removeClass('active');
		});

		// 点击图标设置 - 自定义图标
		$iconSetting.on('click', '.icon-custom-item', function () {
			var $this = $(this);

			$this.addClass('active').siblings().removeClass('active');
			$iconSetting.find('.icon-frame-item').removeClass('active');
        });
        
        // 点击图标设置-背景色
		$iconSetting.on('click', '.ig', function () {
			var $this = $(this);

			$this.addClass('active').siblings().removeClass('active');
        });
    }

    /**
     * 关闭图标设置
     * @param {Object} data 参数
     */
    function closeIconSetting (data) {
        $.each($iconSetting.find('.ig'), function (i, e) {
            $(e).removeClass('active');
        });
        $.each($iconSetting.find('.icon-frame-item'), function (i, e) {
            $(e).removeClass('active');
        });
        $.each($iconSetting.find('.icon-custom-item'), function (i, e) {
            $(e).removeClass('active');
        });
        epoint.closeDialog(data);
    }
    
    // 初始化页面
    initPage();
}(window, jQuery));