(function(win, $) {
	var pWin = win.parent;

	var $verId = $('#version-id');

	// 重定义control.js中submitData方法
	win.sumitData = function() {
		var val = $.trim($verId.val()),
			rt = 0;

		if(!val) {
			Util.alert('版本号不能为空');
		} else if(Util.isIllegalChars(val)) {
			Util.alert("版本号中不能有 ' \" \\\\ <> & ` 等非法字符");
		} else {
			rt = 1;
			// 保存版本
			pWin.saveVersion(val);
		}

		if(!rt) $verId.focus();
		
		return !!rt;
	};
}(this, jQuery));