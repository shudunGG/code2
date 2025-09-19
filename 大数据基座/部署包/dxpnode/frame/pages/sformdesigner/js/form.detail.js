// detail页面通用js
(function(win) {
	var action = win.epointsformdetailactionname || 'formcommondetailaction';

	epoint.initPage(action+win.epointsformurl, 'fui-form', initCallBack);

	// 初始化页面回调
	function initCallBack(data)  {
		if (win.initPageControl) {
			initPageControl(data);
		}
	};

})(this);