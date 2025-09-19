

var eleEvent = {
    // 初始化页面，获取数据
    initPage: function(opt) {
        var callback = opt.callback;
        epoint.initPage(portalConfig.initAction, '', function (data) {
            if(typeof callback == 'function') {
                callback(data);
            }
        });

        // 可写为以下写法，为方便个性化开发人员易于理解，故此处写了上面的写法
        // epoint.initPage('elementeditaction', '', callback);
    },
    savePage: function(opt) {
        var columnData = opt.columnData,
            otherData = opt.otherData || '',
            callback = opt.callback;

        epoint.execute(portalConfig.saveAction, '@all', [columnData, otherData], function (data) {
            if(typeof callback == 'function') {
                callback(data);
            }
        });
    }


}