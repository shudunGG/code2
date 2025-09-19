// 全局变量处理
(function(win, $) {
	// 自定义事件 用于一些逻辑控制
	win._themeEvent_ = new Util.UserEvent();

	// pagecover 容器以及生成方法
	var $coverContainer = $('#cover-wrap');
	if (Util.browsers.isIE && window.hasObjectTag) {
		win.createMainContentCover = function() {
			var iframe = document.createElement('iframe');
			iframe.width = '100%';
			iframe.height = '100%';
			iframe.scrolling = 'no';
			iframe.frameBorder = 0;
			iframe.style.background = 'transparent';
			iframe.src = '../../activexcover/activexcover.html';

			var $cover = $('<div class="main-content-cover hidden"></div>');
			return $cover.append(iframe).appendTo($coverContainer);
		};
	} else {
		win.createMainContentCover = function() {
			var $cover = $('<div class="main-content-cover hidden"></div>');
			return $cover.appendTo($coverContainer);
		};
	}

	// 获取数据统一方法
	win._getData_ = function(method, params) {
		return Util.ajax({
			url : epoint.dealRestfulUrl(getDataUrl + '/' + method),
			data : params
		});
	};
	var $main = $('#main');
	// 处理链接打开
	win.dealLinkOpen = function(linkData, needLeft) {
		switch (linkData.openType) {
		case 'tabsnav':
			!needLeft && $main.addClass('left-none');
			TabsNav.addTab(linkData);
			break;
		case 'dialog':
			epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
			break;
		case 'blank':
			var _id = linkData.id ? (linkData.id + '').replace(/-/g, '') : '';
			win.open(Util.getRightUrl(linkData.url), _id);
			break;
		default:
			break;
		}
	};

	// 统一js动画时间
	win._ANIMATION_TIME_ = {
		slide : 200
	};

	// win.useWebsocket = Util.getFrameSysParam('useWebsocket') === true;

	// // 页面websocket对象
	// win.eWebSocket = undefined;

	// // 创建websocket链接
	// win.creatWebSocket = function(uid, uname, callback) {
	// // 避免重复创建
	// if (eWebSocket) {
	// callback && callback();
	// return;
	// }

	// var cfg = win.EWebSocketConfig
	// ? win.EWebSocketConfig
	// : {
	// url: EmsgConfig.websocketUrl
	// };

	// cfg.uid = uid;
	// cfg.uname = uname;

	// if (win.EWebSocket) {
	// eWebSocket = new EWebSocket(cfg);
	// callback && callback();
	// _aideEvent_.fire('websocketCreated');
	// } else {
	// Util.loadJs('frame/fui/js/widgets/ewebsocket/ewebsocket.js', function() {
	// eWebSocket = new EWebSocket(cfg);
	// callback && callback();
	// _aideEvent_.fire('websocketCreated');
	// });
	// }
	// };
	// win.randomColor = function(index) {
	// var colors = ['#3391e5', '#58cece', '#f16caa', '#7d9459', '#298aae',
	// '#58cece', '#ffce3d', '#fe5d58', '#3391e5', '#f16caa'];

	// return colors[index % 10];
	// };

	// tab和左侧菜单联动的数据缓存
	win.$activeLeftMenu = $('#left-menu');
	var tabsCache = {};
	win.tab2leftManage = (function() {
		function cache(id, $target, $wrap) {
			tabsCache[id] = {
				$target : $target,
				$wrap : $wrap
			};
		}

		function deCache(id) {
			if (id) {
				tabsCache[id] = null;
			} else {
				tabsCache = {};
			}
		}

		function click(id) {
			var it = tabsCache[id];
			if (!it || !it.$wrap) {
				return $main.addClass('left-none');
			}
			$main.removeClass('left-none');

			it.$wrap.find('.left-menu-link.active').removeClass('active');
			if (it.$target) {
				it.$target.addClass('active');
				openTarget(it.$target);
			}
		}
		// 查找目标链接并逐级展开
		function openTarget($target) {
			var $items = $target.parents('.left-menu-item');
			var l = $items.length;
			doOpen($items, l);
		}

		// 递归从最顶层逐个展开
		function doOpen($items, len) {
			if (len < 0) {
				return;
			}

			var $item = $items.eq(len - 1);
			var $sub = $item.find('.left-menu-sub-list:eq(0)');

			// 补充展开类
			if ($item.find('>.left-menu-link').data('hassub')) {
				$item.addClass('opened');
			}
			// 展开当前
			$sub.stop(true).slideDown(_ANIMATION_TIME_.slide, function() {
				// 当前展开完成后继续下一层
				slideDownCb.call(this);
				doOpen($items, --len);
			});
			// 关闭其他
			$item.siblings('.opened').removeClass('opened').find(
					'.left-menu-sub-list:eq(0)').stop(true).slideUp(
					_ANIMATION_TIME_.slide, slideUpCb);
		}
		return {
			cache : cache,
			deCache : deCache,
			click : click
		};
	})();

	// 解决 jq slide 动画偶尔完成后高度未去掉，导致内部继续展开第存在的bug
	// 此处手动在动画完成时进行修复
	win.slideDownCb = function() {
		$(this).css({
			display : 'block',
			height : ''
		});
	};

	win.slideUpCb = function() {
		$(this).css({
			display : 'none',
			height : ''
		});
	};

	// function outputSupport() {
	// var i,
	// re = /^on[a-zA-z]*?[aA]nimation/;
	// for (i in window) {
	// if (re.test(i)) {
	// console.log(i);
	// }
	// }
	// re = /^on[a-zA-z]*?[tT]ransition/;
	// for (i in window) {
	// if (re.test(i)) {
	// console.log(i);
	// }
	// }
	// }

	// 是否显示E讯
	// win.showEXun = true;
	// 消息中心配置
	// win._msgcenterConfig_ = win.MsgCenterConfig || {};

	/*
	 * global _aideEvent_ , _getData_ , getDataUrl, createMainContentCover ,
	 * UserSettings, dealLinkOpen, _ANIMATION_TIME_ , useWebsocket, randomColor,
	 * slideDownCb, slideUpCb, tab2leftManage, $activeLeftMenu:true
	 */
})(this, jQuery);

// TabsNav
(function(win, $) {
	var $ifr = $('#content-frame');
	win.TabsNav = {
		addTab : function(tab) {
			var id = tab.id || ((Math.random() * 10000000) >> 0).toString(16);
			var url = Util.getRightUrl(tab.url);
			$ifr.attr({
				'data-id' : id,
				src : url
			});
		}
	};
})(this, this.jQuery);

// userinfo
(function(win, $) {
	var $logo = $('#sys-logo-img'), $userInfo = $('#user-info'), $userPortrait = $(
			'.user-portrait', $userInfo);
	var $cover = createMainContentCover();

	function hideUserPanel() {
		$userInfo.removeClass('active');
		$cover.addClass('hidden');
	}

	$userInfo
	// 用户头像点击
	.on('click', '.user-info-summary', function() {
		if (!$userInfo.hasClass('active')) {
			$userInfo.addClass('active');
			$cover.removeClass('hidden');
		} else {
			hideUserPanel();
		}
	}).on(
			'click',
			'.user-action-item',
			function() {
				var $this = $(this);
				// 个人信息
				if ($this.hasClass('person-info')) {
					dealLinkOpen({
						id : this.getAttribute('data-id'),
						name : this.getAttribute('data-name'),
						url : this.getAttribute('data-url'),
						openType : 'tabsnav'
					});
				} else if ($this.hasClass('logout')) {
					// 注销
					mini.confirm('您确定要退出系统吗？', '系统提示', function(action) {
						if (action == 'ok') {
							eWebSocket && eWebSocket.close();
							UserSettings.logout();
						}
					});
				} else if ($this.hasClass('role-change')) {
					// 兼职切换
					UserSettings.changeRole(_userGuid_);
				} else {
					// 其他扩展
					var openType = $this.data('opentype'), id = $this
							.data('id'), url = $this.attr('url'), name = $this
							.text(), script = $this.attr('script');
					// 无id时自动生成id 并写入，保证只会生成一次
					if (!id) {
						id = Util.uuid();
						$this.data('id', id).attr('data-id', id);
					}
					if (url) {
						// url = Util.getRightUrl(url);
						// if (openType == 'tabsnav') {
						// TabsNav.addTab({
						// id: id || 'ext-person-' + Util.uuid(),
						// name: name,
						// url: url
						// });
						// } else if (openType == 'dialog') {
						// epoint.openTopDialog(name, url);
						// } else {
						// window.open(url);
						// }
						dealLinkOpen({
							id : id,
							openType : openType,
							name : name,
							url : url
						});
					} else if (script) {
						try {
							eval(script);
						} catch (error) {
							console.error(error);
						}
					}
				}

				$userInfo.removeClass('active');
				$cover.addClass('hidden');
			});
	$('body').on('click', function(e) {
		if (!$(e.target).closest('#user-info').length) {
			hideUserPanel();
		}
	});
	// 获取用户信息
	_getData_('getUserInfo').done(
			function(data) {
				// 用户guid和name是E讯必须要使用的 需要记录下来
				/* global _userName_, _userGuid_ */
				win._userName_ = data.name;
				win._userGuid_ = data.guid;

				// 消息中心的配置-打开是否全屏
				// $.extend(win._msgcenterConfig_, {
				// isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
				// msgCenterOrder: data.msgCenterOrder || 'asc',
				// hideCallback: function() {
				// $cover.addClass('hidden');
				// }
				// });

				// 使用websocket来更新消息数目，需要先建立连接
				// if (useWebsocket) {
				// creatWebSocket(_userGuid_, _userName_);
				// }
				if (data.portrait) {
					// 头像
					var url = Util.getRightUrl(epoint
							.dealRestfulUrl(data.portrait));
					$userPortrait.attr('src', url);
				}

				// 兼职
				if (data.hasParttime) {
					$userInfo.find('.user-action-item.role-change')
							.removeClass('hidden');
				}

				var $userInfoDetail = $('#user-info-detail');
				$userInfo.attr('title', '您好，' + data.name).find('.user-name')
						.text(data.name).attr('title', data.name);
				$userInfoDetail.find('.user-dept').text(data.ouName).attr(
						'title', data.ouName);
			});

	// pageInfo
	_getData_('getPageInfo').done(function(data) {
		// logo
		if (data.logo) {
			// $logo.attr('src',
			// Util.getRightUrl(epoint.dealRestfulUrl(data.logo)));
			// dataurl 模式无须拼接
			$logo.attr('src', Util.getRightUrl(data.logo));
		}
		if (data.title) {
			document.title = data.title;
			win.systemTitle = data.title;
		}
		// fullSearchUrl
		if (data.fullSearchUrl) {
			win._fullSearchUrl_ = data.fullSearchUrl;
		}

		if (data.showEXun === false) {
			win.showEXun = false;
		}
		// 初始化门户
		// initPortal(data.homes, data.defaultHome);

		// 触发 afterPageInfo 事件
		_themeEvent_.fire('afterPageInfo');
	});

	// 用户头像更改
	$(win).on('message', function(e) {
		try {
			var data = JSON.parse(e.originalEvent.data);
			if (data.type === 'userPortraitChange') {
				$userPortrait.attr('src', data.imgData);
			}
		} catch (error) {
		}
	});
	var EXT_TAB_TPL = '<li class="user-action-item" title="{{name}}" url="{{url}}" data-opentype="{{openType}}" script="{{script}}"><span class="{{icon}}"></span>{{name}}</li>';
	// 扩展tab加载
	_getData_('getExtTabsInfo').done(function(data) {
		if (data && data.length) {
			var html = '';
			$.each(data, function(i, item) {
				item.icon = item.icon || 'modicon-8';
				if (/^icon-/.test(item.icon)) {
					// 操作图标
					item.icon = 'action-icon ' + item.icon;
				}
				html += Mustache.render(EXT_TAB_TPL, item);
			});
			$(html).insertAfter('#person-info-setting');
		}
	});
})(this, jQuery);

// leftmenu
(function(win, $) {
	var leftMenuStatus = {};

	var $main = $('#main'), $leftMenu = $('#left-menu');
	var LEFT_MENU_ITEM_TPL = '<li class="left-menu-item {{ level }}"><a href="javascript:void(0);" data-url="{{ url }}" data-rowkey="{{ rowkey }}" data-id="{{ code }}" title="{{ name }}" data-openType="{{ openType }}" data-hasSub="{{ hasSub }}" class="left-menu-link" style="padding-left: {{ indent }}px;"><span class="left-menu-name">{{ name }}</span>{{#hasSub}}<i class="left-menu-trigger"></i>{{/hasSub}}</a>{{#hasSub}}<ul class="left-menu-sub-list" style="display:none;">{{{subMenu}}}</ul>{{/hasSub}}</li>';

	function initEvent() {
		$('body').on('click', '.left-nav-toggle', function() {
			$main.toggleClass('left-hide');
		});
		$leftMenu
				.on(
						'click',
						'.left-menu-link',
						function() {
							var $this = $(this), $item = $this.parent(), isTop = $item
									.hasClass('level-1'), hasSub = $this
									.data('hassub'), linkData = {
								url : $this.data('url'),
								openType : $this.data('opentype'),
								name : this.title,
								id : $this.data('id')
							};

							// 处理子节点展开收起
							if (hasSub) {
								var $sub = $this.next();

								if (!$item.hasClass('opened')) {
									$item.addClass('opened');

									// 展开当前 收起其他
									$sub.stop(true)
											.slideDown(_ANIMATION_TIME_.slide,
													slideDownCb);
									$item.siblings('.opened').removeClass(
											'opened').find(
											'.left-menu-sub-list:eq(0)').stop(
											true).slideUp(
											_ANIMATION_TIME_.slide, slideUpCb);
								} else {
									$item.removeClass('opened');
									$sub.stop(true).slideUp(
											_ANIMATION_TIME_.slide, slideUpCb);
								}
							}
							if (linkData.url) {
								$activeLeftMenu.find('.left-menu-link.active')
										.removeClass('active');
								$this.addClass('active');
								if (linkData.openType == 'tabsnav') {
									tab2leftManage.cache(linkData.id, $this,
											$activeLeftMenu);
								}
								// 处理链接
								dealLinkOpen(linkData, true);
							}
						});
		// tab点击时处理左侧
		// $('body').on('click', '.tabsnav-tabs-item, .tabsnav-quicknav-item',
		// function(e) {
		// var id = this.getAttribute('data-id').substr(4);
		// if ($(e.target).hasClass('tabsnav-tabs-close')) {
		// return tab2leftManage.deCache(id);
		// }
		// });
	}
	initEvent();

	function getRowKey(rowkey, i) {
		return rowkey === undefined ? i + '' : rowkey + '-' + i;
	}
	// 缩进值
	var INDENT_INIT = 32, INDENT_STEP = 14;

	// 获取节点缩进值
	function getIndent(rowkey, len) {
		// 分割成数组判断长度
		len = len || rowkey.split('-').length;
		// if (len < 2) {
		// return INDENT_INIT;
		// }
		return INDENT_INIT + (len - 1) * INDENT_STEP;
	}
	/**
	 * 构建左侧菜单的详情html
	 * 
	 * @param {Array}
	 *            data 菜单数据
	 * @param {String}
	 *            rowkey 父节点rowkey
	 * @returns 渲染完成的html字符串
	 */
	function buildLeftMenu(data, rowkey) {
		var html = '';

		$.each(data, function(i, item) {
			// 此处暂无搜索支持，无需copy
			// 但为方便后续扩展 使用别名view
			var view = item;
			view.hasSub = !!(item.items && item.items.length);
			view.rowkey = getRowKey(rowkey, i);

			var len = view.rowkey.split('-').length;
			view.isTop = len === 1;
			view.level = 'level-' + len;
			view.indent = getIndent(view.rowkey, len);

			// if (view.isTop) {
			// view.bg = item.iconBackColor || randomColor(i);
			// }

			if (len === 1) {
				view.icon = view.icon || 'modicon-1';
			}

			if (view.hasSub) {
				html += Mustache.render(LEFT_MENU_ITEM_TPL, $.extend(view, {
					subMenu : buildLeftMenu(item.items, view.rowkey)
				}));
			} else {
				html += Mustache.render(LEFT_MENU_ITEM_TPL, view);
			}
		});
		return html;
	}
	/**
	 * 生成左侧菜单结构并插入展示
	 * 
	 * @param {Array}
	 *            data 当前菜单数据
	 * @param {*}
	 *            tMenu 顶级菜单的数据
	 */
	function initView(data, tMenu) {
		if (data && data.length) {
			var html = buildLeftMenu(data);
			$main.removeClass('left-none');
			$leftMenu.html(html);
		} else {
			$leftMenu.html('');
			$main.addClass('left-none');
		}
	}

	function getLeftMenu(tMenu, findSubUrlOpen) {
		if (!tMenu.defaultUrl) {
			findSubUrlOpen = true;
		} else {
			TabsNav.addTab({
				url : tMenu.defaultUrl
			});
		}
		var tCode = tMenu.code;

		return _getData_('getMenu', {
			query : 'sub',
			code : tCode
		}).done(function(data) {
			if (!data || !data.length) {
				$main.addClass('left-none');
				$leftMenu.html('');
				return;
			}
			var $menu = initView(data, tMenu);
			// 如果此顶级菜单有链接
			if (tMenu.url && tMenu.openType === 'tabsnav') {
				tab2leftManage.cache(tCode, null, $menu);
			} else {
				// 找第一个子链接打开
				findSubUrlOpen && findFirstSecUrlOpen(tCode + '');
			}
		}).fail(function() {
			$main.addClass('left-none');
			$leftMenu.html('');
		});
	}
	/* global getLeftMenu */
	win.getLeftMenu = getLeftMenu;

	// 每次切换都需要查找 效率低 因此做缓存处理
	var subUrlCache = {};
	/**
	 * 查找子菜单中第一个配置了url的菜单进行打开
	 * 
	 * @param {String}
	 *            $targetMenu 顶级菜单code
	 */
	function findFirstSecUrlOpen(targetMenu) {
		// 有缓存直接使用
		if (subUrlCache[targetMenu]) {
			return TabsNav.addTab(subUrlCache[targetMenu]);
		}
		// 否则获取并查找
		// var $targetMenu = $leftMenuContainer.find('#left-menu-' +
		// targetMenu);
		var $targetMenu = $('#left-menu');
		var openType = '', url = '';
		$targetMenu.find('.left-menu-link').each(function(i, item) {
			url = item.getAttribute('data-url');
			openType = item.getAttribute('data-opentype');
			if (url && openType == 'tabsnav') {
				subUrlCache[targetMenu] = {
					id : item.getAttribute('data-id'),
					name : item.title,
					url : url
				};
				tab2leftManage.cache(targetMenu, $(item), $targetMenu);
				// TabsNav.addTab(subUrlCache[targetMenu]);
				$(item).trigger('click');
				return false;
			}
		});
	}
})(this, jQuery);
