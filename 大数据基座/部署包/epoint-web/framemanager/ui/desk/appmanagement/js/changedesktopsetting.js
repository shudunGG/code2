(function ($, win) {

    var miniInputDesktop = mini.get('input-desktop'),
        $curMenuItem = null,
        desktopUrl = '',
        $curAppDesktopCombobox = null;

    // 保存设置
    $('#save-desktopconfig').on('click', function () {
        if (epoint.validate('fui-form')) {
            var desktopText = miniInputDesktop.getValue();
            var id = $curMenuItem.attr('data-id'),
                $span = $curMenuItem.find('span'),
                originalDesktopText = $span.text().trim();

            // 如果未对桌面进行修改直接返回
            if (originalDesktopText == desktopText) {
            	epoint.clear('fui-form');
                epoint.closeDialog();
                return;
            }
            
            var data = {
					desktopid: id,
					desktop: desktopText
				};
            
            Util.ajax({
				url: win.Config.editDeskTop,
				data: data,
				type: 'post',
				success: function (response) {
					if (response.result === 'success') {
						$span.text(desktopText);
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

    // 删除桌面
    $('#delete-desktopconfig').on('click', function () {
        // 初始化文本
        var originalDesktopText = $curMenuItem.find('span').text().trim(),
            id = $curMenuItem.attr('data-id');
        var data={desktopid:id};
        
        epoint.confirm('确认删除？', '', function () {
			Util.ajax({
				url: win.Config.deleteDeskTop,
				data: data,
				type: 'post',
				success: function (response) {
					if (response.result === 'success') {
						$curMenuItem.remove();
			            $curMenuItem = null;
			            epoint.clear('fui-form');
			            epoint.closeDialog();
					} else {
						mini.alert('至少要保留一个桌面!');
						return;
					}
				},
				error: function () {
				}
			});
		});
    });

    // 接受参数
    window.pageLoad = function (param) {
        miniInputDesktop.setValue(param.text);
        $curMenuItem = param.el;
        desktopUrl = param.desktopUrl;
        $curAppDesktopCombobox = param.desktopCombobox;
    };

    /**
     * 修改桌面
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