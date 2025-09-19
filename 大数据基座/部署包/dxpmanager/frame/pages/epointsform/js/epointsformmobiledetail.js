$(function() {
	var messenger = new epointsform.Messenger('epointsformPrintIframe',
			'epointsformMessenger');

	messenger.listen(function(msg) {
		if (!msg) {
			return;
		}
		msg = JSON.parse(msg);
		if (msg.handleType == "print") {
			msg.innerHtml = document.getElementById(msg.id).innerHTML;
			messenger.targets['parent'].send(JSON.stringify(msg));
		}
	});

	messenger.addTarget(window.parent, 'parent');
	// 初始化页面
	if (!window.epointsformdetailactionname) {// 详情页面actionname，可个性化
		window.epointsformdetailactionname = "formcommondetailaction";
	}
	epointm.initPage(window.epointsformdetailactionname, '', initCallBack);

	var tableId;

	function initCallBack(data) {
		// 发起 流程后的页面带不出控件值问题，暂时js处理
		//if (!data) {
		//	return;
		//}
		var msg = {};
		msg.handleType = "init";
		//msg.height = $('body').height();
		msg.iframeId = 'epointsformIframe';
		messenger.targets['parent'].send(JSON.stringify(msg));
	}

	window["searchData"] = function(data) {
		epointm.refresh('dataGrid');
	}
})