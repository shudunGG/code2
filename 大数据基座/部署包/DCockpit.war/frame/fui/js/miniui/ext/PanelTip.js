/*
 * 复写目的是为了改造请求数据的方法以适应框架的数据格式
 */
mini.overwrite(mini.PanelTip, {
    // 第三方资源路径
    externalSrc:  _rootPath + '/frame/fui/js/libs/',

    _getData: function(params, openedGuid) {
        var self = this;
        this.showLoading();
        // 框架中返回的数据是在custom中的，为了方便处理，改为用框架中的ajax方法
        Util.ajax({
            url: this.url,
            data: params,
            async: true,
            success: function(text) {
                var data = mini.decode(text) || '';

                // 记住当前展示的guid，避免点击同一个时重复请求数据
                self._opened = openedGuid;

                if (!window.Mustache) {
                    mini.loadJS(self.externalSrc + 'mustache.min.js', function() {
                        self._renderContent(data);
                    });
                } else {
                    self._renderContent(data);
                }

            }
        });
    }
});