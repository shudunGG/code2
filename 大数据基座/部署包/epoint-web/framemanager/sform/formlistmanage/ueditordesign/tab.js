/* 初始化tab标签 */
function initTabs() {
	var tabs = $G('tabhead').children;
	for (var i = 0; i < tabs.length; i++) {
		domUtils.on(tabs[i], "click", function(e) {
			var target = e.target || e.srcElement;
			setTabFocus(target.getAttribute('data-content-id'));
		});
	}
}

/* 初始化tabbody */
function setTabFocus(id) {
	if (!id)
		return;
	var i, bodyId, tabs = $G('tabhead').children;
	for (i = 0; i < tabs.length; i++) {
		bodyId = tabs[i].getAttribute('data-content-id');
		if (bodyId == id) {
			domUtils.addClass(tabs[i], 'focus');
			domUtils.addClass($G(bodyId), 'focus');
		} else {
			domUtils.removeClasses(tabs[i], 'focus');
			domUtils.removeClasses($G(bodyId), 'focus');
		}
	}
}

/* 初始化onok事件 */
function initButtons() {
	dialog.onok = function() {
		var remote = false, list = [], id, tabs = $G('tabhead').children;
		for (var i = 0; i < tabs.length; i++) {
			if (domUtils.hasClass(tabs[i], 'focus')) {
				id = tabs[i].getAttribute('data-content-id');
				break;
			}
		}
	};
}

