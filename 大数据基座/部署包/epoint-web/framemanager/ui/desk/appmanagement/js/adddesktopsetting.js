(function ($, win) {

    var $curDesktopMenuItem = null,
        desktopUrl = '';

    var minidesktop = mini.get('inputdesktop');

    // 保存桌面
    $('#save-desktopconfig').on('click', function () {
        if (epoint.validate('fui-form')) {
            var text = minidesktop.getValue(),
                id = Util.uuid();
            var data = {
					desktop: text
				};
            
            Util.ajax({
				url: win.Config.createDesktop,
				data: data,
				type: 'post',
				success: function (response) {
					if (response.result === 'success') {
						$('.createdesktop').before('<li class="desktop-menu-item" data-id="' + response.id + '"><span>' + text + '</span><i class="action-icon icon-edit r" data-name="edit"></i></li>');
						minidesktop.setValue('');
						epoint.clear('fui-form');
		                epoint.closeDialog();
					} else {
						mini.alert('该桌面名称已存在');
						return;
					}
				},
				error: function () {}
			});
        }
    });

    // 取消
    $('#cancel-desktopconfig').on('click', function () {
        epoint.closeDialog();
        epoint.clear('fui-form');
    });

    // 接收参数
    window.pageLoad = function (param) {
        $curDesktopMenuItem = param.el;
        desktopUrl = param.desktopUrl;
    };

    /**
     * 新增桌面
     * @param {Object} data 请求参数
     * @param {Function} callback 成功回调
     */
    function changeDesktop(data, callback) {
        Util.ajax({
            url: desktopUrl,
            type: 'post',
            data: data,
            success: function (response) {
                callback && typeof callback === 'function' && callback();
            },
            error: function (err) {
                console.error('桌面修改失败：' + JSON.stringify(err));
            }
        });
    }
}(jQuery, window));