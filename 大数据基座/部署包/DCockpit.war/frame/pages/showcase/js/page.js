/**!
 * [页面名称]
 * date:2020-03-03
 * author: [author];
 */
(function ($) {
	Util.ajax({
		url: Config.ajaxUrls.loaddata,
		data: {
			userguid: "2983-3kd93jd-3938dj-kd93kd0-kdld"
		},
		beforeSend: function () {
			Util.showLoading();
		},
		success: function (data) {
			// 渲染对象数据
			Util.renderer("userInfo-tpl", data.userInfo).to("userInfo");

			//无模版渲染方式
			Util.renderer(data.baseInfo, "data-render").container("baseInfo");

			// 根据状态码为数据添加显隐条件
			var list = Util.setValueBoolean(data.list, "state", {
				isOver: 0,
				isWrite: 1,
				isSubmit: 2,
				isOverAndSubmit: [0, 2]
			});

			// 根据数据状态添加文字描述
			list = Util.setValueText(list, "state", {
				0: "已完成",
				1: "未填写",
				2: "未提交"
			});

			// 渲染列表数据
			Util.renderer("tableList-tpl", list).to("tableList");

			//单使用数字滚动方法
			Util.scrollNumber("#scrollNumber", data.number);
			//单使用数字滚动方法
			Util.animateNumber("#animateNumber", data.number);
		},
		complete: function () {
			Util.hideLoading();
		}
	});
})(jQuery);
