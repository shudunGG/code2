(function (win, $) {

	var $accordion = $('#accordion'), // 手风琴
		$subscribeNum = $('#subscribe-num'), // 订阅数量
		$savedesktopConfig = $('#savedesktop-config'), // 桌面配置
		$addDesktopConfig = $('#adddesktop-config'); // 添加桌面设置
		$subscribeTotalNum = $('#subscribe-totalnum'); //总数

	var $curNotice = null,
		$curDesktopMenuItem = null,
		$curAppDesktopCombobox = null;

	var count = 0; // 订阅数
	var icondata = null; // 图标数据

	var tplAccordion = $('#tpl-accordion').html(), // 手风琴模板
		tplItem = $('#tpl-item').html();

	var businessTree = mini.get('businesstree');

	function initPage() {
		getIcons();
		initListeners();
		getApps();
		getTotalNum();

//		$accordion.sortable({
//			items: ".app",
//			axis: 'y',
//			distance: 15
//		}).disableSelection();

		// 关闭弹窗
		$(document).on('click', function () {
			$accordion.find('.notice-list').addClass('hidden');
			$accordion.find('.app-desktop-combobox').removeClass('active');
			$accordion.find('.app-desktop-menu').addClass('hidden');
		});
	}

	/**
	 * 点击事件监听
	 */
	function initListeners() {
		$accordion.on('click', '.accordion-item-tit', function () {
			var $this = $(this),
				$items = $this.next(),
				$arrow = $this.find('.action-icon');

			// 展开手风琴
			if ($items.hasClass('overflowhidden')) {
				$items.removeClass('overflowhidden');
				$arrow.removeClass('icon-down');
				$arrow.addClass('icon-up');
				$items.animate({
					height: $items.find('li.app').length * 50 + 'px'
				}, 300);
			} else {
				$arrow.removeClass('icon-up');
				$arrow.addClass('icon-down');
				$items.animate({
					height: 0
				}, 300, function () {
					$items.addClass('overflowhidden');
				});
			}
		});

		// 应用视图配置
		$accordion.on('click', '.app-view', function () {
			var $this = $(this);

			epoint.openDialog('应用视图配置', './appview.html?uiguid='+Util.getUrlParams('uiguid')+'&addr='+$this.attr('data-addr'), function (param) {

				if (param === 'ok') {
					save($this.parents('.app').data('appid'));
				}

			}, {
				width: 560,
				height: 300,
				param: {
					addr: $this.attr('data-addr'),
					$el: $this
				}
			});
		});

		// 点击消息通知
		$accordion.on('click', '.app-notice', function (e) {
			e.stopPropagation();

			var $this = $(this);
			var $noticelist = $this.next();
			var type = $this.attr('data-msgtype');

			$accordion.find('.app-desktop-menu').addClass('hidden');
			$accordion.find('.app-desktop-combobox').removeClass('active');
			$noticelist.toggleClass('hidden');
			$noticelist.css('left', $this.get(0).offsetLeft - 7);
			$curNotice = $this;

			$.each($noticelist.find('.notice-list-item'), function (i, e) {
				var $e = $(e);

				if ($e.attr('data-msgtype') == type) {
					$e.addClass('cur');
				} else {
					$e.removeClass('cur');
				}
			});

			$this.parents('.accordion-item').siblings().find('.notice-list').addClass('hidden');
			$this.parents('.app').siblings().find('.notice-list').addClass('hidden');
		});

		// 点击切换尺寸
		$accordion.on('click', '.app-size a', function () {
			var $this = $(this);

			$this.removeClass('disable').siblings().addClass('disable');
			// 保存数据
			save($this.parents('.app').data('appid'));
		});

		// 点击分配桌面
		$accordion.on('click', '.app-desktop-combobox', function (e) {
			e.stopPropagation();

			var $this = $(this),
				$appDesktopMenu = $this.next(),
				text = $this.text().trim(),
				$accordionItemSiblings = $this.parents('.accordion-item').siblings(),
				$appSiblings = $this.parents('.app').siblings();

			$curAppDesktopCombobox = $this;

			$accordion.find('.notice-list').addClass('hidden');
			$accordionItemSiblings.find('.app-desktop-combobox').removeClass('active');
			$accordionItemSiblings.find('.app-desktop-menu').addClass('hidden');
			$appSiblings.find('.app-desktop-combobox').removeClass('active');
			$appSiblings.find('.app-desktop-menu').addClass('hidden');

			if ($this.hasClass('active')) {
				$this.removeClass('active');
				$appDesktopMenu.addClass('hidden');
			} else {
				$this.addClass('active');
				$appDesktopMenu.removeClass('hidden');

				var menuItem = $this.next().children();

				$.each(menuItem, function (i, e) {
					var _text = $(e).text().trim();

					if (_text === '无' && text === '待分配') {
						$(e).addClass('cur');
					}

					if (_text === text) {
						$(e).addClass('cur');
					}
				});
			}
		});

		// 点击分配桌面菜单
		$accordion.on('click', '.desktop-menu-item', function (e) {
			e.stopPropagation();

			var $this = $(this),
				len = $(this).parent().children().length,
				$parent = $this.parent('.app-desktop-menu'),
				text = $this.text(),
				$desktop = $this.parents('.app-desktop'),
				$comboboxText = $parent.prev().children('span');

			$curDesktopMenuItem = $this;

			if ($this.hasClass('createdesktop')) {
				if (len <= 9) {
					$addDesktopConfig.removeClass('hidden');
					epoint.openDialog('桌面设置', './adddesktopsetting?uiguid='+Util.getUrlParams('uiguid'), function (param) {
						$('#accordion').children().remove();
						getApps();
					}, {
						width: 500,
						height: 224,
						param: {
							el: $curDesktopMenuItem,	
							desktopUrl: Config.desktopUrl
						}
					});
					return;
				} else {
					epoint.showTips('已达到桌面上限，无法创建！');
					return;
				}
			}

			var $accordionItemSiblings = $this.parents('.accordion-item').siblings(),
				$appSiblings = $this.parents('.app').siblings();

			$accordionItemSiblings.find('.app-desktop-combobox').removeClass('active');
			$accordionItemSiblings.find('.app-desktop-menu').addClass('hidden');
			$appSiblings.find('.app-desktop-combobox').removeClass('active');
			$appSiblings.find('.app-desktop-menu').addClass('hidden');

			if (text === '无') {
				$comboboxText.html('待分配');
				$desktop.addClass('wait');
			} else {
				$comboboxText.html(text);
				$desktop.removeClass('wait');
			}

			$this.addClass('cur').siblings().removeClass('cur');
			$parent.addClass('hidden');
			$parent.prev().removeClass('active');

			// 保存数据
			save($this.parents('.app').data('appid'));
		});

		// 点击编辑按钮
		$accordion.on('click', '.icon-edit', function (e) {
			e.stopPropagation();

			var $this = $(this),
				$text = $this.prev();

			$curDesktopMenuItem = $this.parents('.desktop-menu-item');

			epoint.openDialog('桌面设置', './changedesktopsetting?uiguid='+Util.getUrlParams('uiguid'), function () {
				epoint.refresh('businesstree');
				$('#accordion').children().remove();
				getApps();
			}, {
				width: 500,
				height: 224,
				param: {
					el: $curDesktopMenuItem,
					text: $text.text(),
					desktopUrl: Config.desktopUrl,
					desktopCombobox: $curAppDesktopCombobox
				}
			});
		});

		// 点击选择消息
		$accordion.on('click', '.notice-list-item', function () {
			var $this = $(this);
			var text = $this.text();
			var msgtype = $this.attr('data-msgtype');

			$this.parent().addClass('hidden');
			$curNotice.attr('data-msgtype', msgtype);
			$curNotice.attr('data-msg', text);

			if (msgtype == 0) {
				$curNotice.addClass('disable');
			} else {
				$curNotice.removeClass('disable');
			}

			// 保存设置
			save($curNotice.parents('.app').data('appid'));
		});

		// 点击管理图标
		$accordion.on('click', '.app-icon', function () {
			var $this = $(this);
			var bgcolor = $this.attr('data-bgcolor');
			var icon = $this.attr('data-icon');

			epoint.openDialog('图标设置', './iconsetting.html', function (param) {
				var bgcolor = param.bgcolor,
					icon = param.icon;

				if (param.msg === 'save') {
					$this.attr('data-bgcolor', bgcolor);
					$this.removeClass().addClass('l app-icon ' + bgcolor);
					$this.attr('data-icon', icon);
					$this.find('img').prop('src', icon);

					// 保存设置
					save($this.parents('.app').data('appid'));
				}
			}, {
				width: 728,
				height: 489,
				param: {
					bgcolor: bgcolor,
					icon: icon,
					icondata: icondata
				}
			});
		});

		// 删除订阅
		$accordion.on('click', '.app-del', function () {
			var $this = $(this),
				$app = $this.parents('.app'),
				$accordionItemCon = $this.parents('.accordion-item-con'),
				$accordionItemTit = $accordionItemCon.prev().find('.accordion-count');

			delApp($app.data('appid'), function () {
				$app.remove();

				var len = $accordionItemCon.children().length;

				if (len == 0) {
					$accordionItemCon.parent('.accordion-item').remove();
				} 
				var appId = $app.data('appid');
				$accordionItemTit.text($accordionItemCon.children().length);
				businessTree.uncheckNode(appId);
			});
		});

		// 清空树
		$('#clean-tree').on('click', function () {
			mini.get('businesstree').uncheckAllNodes()
			Util.ajax({
				url: win.Config.cleanDeskModule,
				data: '',
				type: 'post',
				success: function () {
				},
				error: function () {}
			});
			$accordion.html('');
			$('.accordion-count').text(0);
			$('#subscribe-num').text(0);
			count=0;
			$('.accordion-item-con').children('.app').remove();
		});

		// 树内容被选中触发
		businessTree.on('nodecheck', function (data) {
			var node = data.node;
			var id = node.id;

			// true 新增 false 删除
			if (node.checked) {
				getAppInf(node);
				count++;
				$subscribeNum.text(count);
			} else {
				delApp(id, function () {
					var $AccordionItemCon = $accordion.find('.app[data-appid="'+ id +'"]').parents('.accordion-item-con');
					var $accordionItemTit = $AccordionItemCon.prev().find('.accordion-count');
					var len = $AccordionItemCon.children().length;
					if(len == 1){
						$accordion.find('.app[data-appid="'+ id +'"]').remove();
						$AccordionItemCon.parent('.accordion-item').remove();
					}else{
						$accordion.find('.app[data-appid="'+ id +'"]').remove();
						$accordionItemTit.text(len-1);
					}
				});
			}
		});

		$savedesktopConfig.on('click', function (e) {
			e.stopPropagation();
		});

		$addDesktopConfig.on('click', function (e) {
			e.stopPropagation();
		});

		$savedesktopConfig.on('click', '.mini-tools-close', function (e) {
			e.stopPropagation();
		});
	}

	/**
	 * 获取应用信息
	 */
	function getAppInf(node) {
		Util.ajax({
			url: Config.getAppInfUrl,
			data: node,
			type: 'post',
			success: function (response) {
				if(response.result && response.result == "failure") {
					if(response.msg) {
						epoint.showTips(response.msg, {state:'warning'});
						epoint.refresh('businesstree');
						return;
					}
				}
				// 获取栏目
				var $category = $accordion.find('.accordion-item[data-categoryid="'+ response.categoryid +'"]');
				var item = '';
				var size = response.size;
				var view = $.extend({}, response, {
					desktopname: response.desktop || '待分配',
					smallsize: size === 'small' ? true : false,
					mediumsize: size === 'medium' ? true : false,
					largesize: size === 'large' ? true : false
				});
				// TODO: 如果没有栏目则创建栏目
				if (!$category.get(0)) {
					item = Mustache.render(tplAccordion, {
						categoryname: response.categoryname,
						categoryid: response.categoryid,
						childNum: 1,
					});
					$accordion.append(item);
					var $category = $accordion.find('.accordion-item[data-categoryid="'+ response.categoryid +'"]');
					$category.find('.accordion-item-con').append(Mustache.render(tplItem, view));
				} else {
					$category.find('.accordion-item-con').append(Mustache.render(tplItem, view));
				}
				var len = $category.find('.accordion-item-con').children().length;
				$accordionItemTit = $category.find('.accordion-item-con').prev().find('.accordion-count');
				$accordionItemTit.text(len);
			},
			error: function () {}
		});
	}
	
	/**
	 * 获取模块总数
	 */
	 function getTotalNum() {
	 	Util.ajax({
	 		url: Config.getTotalNumUrl,
	 		data: {},
	 		type: 'post',
	 		success: function (res) {
	 			$subscribeTotalNum.text(res.num);
	 		},
	 		error: function () {
	 		}
	 	});
	 }

	/**
	 * 获取应用图标
	 */
	function getIcons () {
		Util.ajax({
			url: win.Config.getIconUrl,
			type: 'post',
			data: {},
			success: function (response) {
				icondata = response;
			},
			error: function () {
			}
		});
    }

	/**
	 * 根据业务树，获取应用模块
	 */
	function getApps() {
		Util.ajax({
			url: Config.getAppUrl,
			data: {},
			type: 'post',
			success: function (res) {
				count = 0;
				var item = '';
				$.each(res, function (i, e) {
					var children = e.children;

					e.childNum = children.length;

					$.each(children, function (_i, _e) {
						var size = _e.size;
						count++;
						_e.desktopname = _e.desktop || '待分配';
						_e.smallsize = size === 'small' ? true : false;
						_e.mediumsize = size === 'medium' ? true : false;
						_e.largesize = size === 'large' ? true : false;
					});

					item += Mustache.render(tplAccordion, e);
				});

				$accordion.html(item);
				$subscribeNum.text(count);
			},
			error: function () {
			}
		});
	}

	/**
	 * 保存数据
	 * @param {String} id 标识
	 */
	function save(id) {
		var $el = $accordion.find('[data-appid="'+ id +'"]');
		var $appIcon = $el.find('.app-icon');
		var $appNotice = $el.find('.app-notice');
		var size = 'small';

		$.each($el.find('.app-size a'), function (i, e) {
			if (!$(e).hasClass('disable')) {
				size = $(e).data('size');
			}
		});

		var data = {
			id: id,
			bgcolor: $appIcon.attr('data-bgcolor'),
			icon: $appIcon.attr('data-icon'),
			name: $el.find('.appname').text(),
			desktop: $el.find('.app-desktop-combobox span').text(),
			msgtype: $appNotice.attr('data-msgtype'),
			msg: $appNotice.attr('data-msg') || '',
			addr: $el.find('.app-view').attr('data-addr'),
			size: size
		};

		Util.ajax({
			url: Config.saveUrl,
			type: 'post',
			data: data,
			success: function () {
			},
			error: function () {
			}
		});
	}

	/**
	 * 删除应用
	 * @param {String} id 应用标识
	 * @param {Function} callback 回调函数
	 */
	function delApp(id, callback) {
		Util.ajax({
			url: Config.delUrl,
			type: 'post',
			data: {
				id: id
			},
			success: function() {
				count--;
				$subscribeNum.text(count);
				callback && typeof callback === 'function' && callback();
			},
			error: function () {}
		});
	}

	/**
	 * 生成唯一标识
	 */
	function uuidv4 () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		  });
	};

	initPage();
}(window, jQuery));
