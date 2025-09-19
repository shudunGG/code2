/*!
 *“聚通用”智慧政府大数据管理平台新点数据平台 (查看结果) 脚本
 *author:guli
 *date:2020-11-17
 *version:9.4.1
 */
(function(win, $) {
	$('.view-pre').on('click', function() {
		window.history.go(-1);
	});
	var rowguid = Util.getUrlParams("rowguid");
	$('.view-save').on(
			'click',
			function() {
				epoint.openTopDialog("保存模型", './modeledit?flowGuid=' + rowguid
						+ "&type=2", function(ret) {
				}, {
					'width' : 750,
					'height' : 500
				});
			});

})(this, this.jQuery);