/**
 * [查询文章链接功能]
 * @return {[type]}     [title，id列表]
 */
(function(win, $) {
	var queryTitle = function(title,url,callback) {
        var postData = {
            title: title||''
        }
		Util.ajax({
            data: JSON.stringify(postData), 
            url: url,
            success: function(res) {
            	if(typeof callback == 'function') {
                    callback(res);
                }
            }
        });
	};

	win.queryTitle = queryTitle;
})(window,jQuery)