/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2020-09-16 15:23:21
 * @Description: '' 
 */
var $sidebarPanel = $('#sidebar-panel'),
	$main = $('#main'),
	$paintingArea = $('#painting-area');

var CACHE_ELEMENT_TPL = $.trim($("#cache-element-tpl").html());

var cacheColumnResult = {};

var MOVE_WIDTH = 200;

// 顶部按钮
(function(win, $) {
	var getSaveData = function() {
		var tableData = [];
		$(cacheLibMenu).each(function(index, item) {
			var other = JSON.parse(item.other);
			tableData.push({
				orginalEleGuid: item.orginalEleGuid,
				id: item.id, // 标识
				row: other.row,
				col: other.col,
				sizex: item.sizex,
				sizey: item.sizey,
				visible: item.visible
			})
		})

		var resultData = {
			tableData: JSON.stringify(tableData)
		}

		return resultData;
	}

	var getAllSaveData = function() {
		var tableData = [];
		$(cacheLibMenu).each(function(index, item) {
			var other = JSON.parse(item.other);
			tableData.push(other);
		})

		return tableData;
	}

	// 保存
	win.save = function(e) {
		var resultData = getSaveData();

		Util.ajax({
			url: portalConfig.deskSave,
			data: $.extend({}, {
				portalGuid: portalGuid
			}, resultData)
		}).done(function(res) {
			// epoint.showTips(res.msg || '保存成功');
			epoint.closeDialog({
				type: 'ok',
				options: getAllSaveData()
			});
		});
	}

	win.cancel = function() {
		epoint.closeDialog({
			type: 'close'
		});
	}
	
	win.otherSave = function (e) {
		var htmlContent = $('#htmlContent').clone().addClass('copy')[0];

		htmlContent.style.display = "";
		mini.showMessageBox({
			width: 350,
			height: 150,
			title: "存为模板",
			buttons: ["取消", "保存"],
			customCls: "portal-tip",
			// message: "自定义Html",
			html: htmlContent,
			showModal: true,
			callback: function (action) {
				if (action == '保存') {
					var name = $('.copy #portal-name').val().trim();
					if (!name) {
						epoint.showTips('名称不能为空', {
							state: "danger"
						});
						return;
					}

					if(name.length > 50) {
						epoint.showTips('名称请控制在50字以内，谢谢', {
							state: "danger"
						});
						return;
					}

					var resultData = getSaveData();

					saveToTemp($.extend({}, {
						portalGuid: portalGuid,
						name: name,
					}, resultData));
				}

			}
		});
	};

	function saveToTemp(data) {
		Util.ajax({
			url: portalConfig.saveToTemplate,
			data: data
		}).done(function(res) {

			getTemplateData();
			epoint.showTips('保存成功');
		})
	}
})(window, jQuery);

var cacheEleMenu = [], // 缓存元件-模板菜单
	cacheLibMenu = [], // 缓存元件-仓库菜单
	cacheTempMenu = []; // 缓存模板菜单

// 左侧面板
(function(win, $) {
	var $libNum = $('.lib-num', $sidebarPanel), // 仓库数字
		$libMoreMenu = $('#lib-more-menu'), // 仓库更多菜单
		$libListContainer = $('#lib-list-container'); // 元件（仓库）

	var LIB_ITEM_SEARCH_TPL = $.trim($("#lib-item-search-tpl").html()); // 元件（搜索仓库）

	var LIB_ITEM_TPL = $.trim($("#lib-item-tpl").html()); // 元件（仓库）

	var tempHtmlContent = document.getElementById("tempRename"),
		$tempName = $('#temp-name');

	// 重命名模板
	var renameTemplate = function(opt) {
		var id = opt.id,
			name = opt.name,
			callback = opt.callback || '';

		Util.ajax({
			url: portalConfig.renameTemplate,
			data: {
				name: name,
				id: id
			}
		}).done(function(data) {
			if(typeof callback == 'function') {
				callback();
			}
		});
	}

	$sidebarPanel
		.on('click', '.search-menu', function(e) {
			var $this = $(this);

			commonUtil.menuPosition($this, $libMoreMenu);
		})
		// 元件-仓库搜索值改变
		.on('input propertychange keyup', '#lib-search', function() {
			var $this = $(this),
				searchVal = $this.val();

			renderLibDom(searchVal);
		});

	$libMoreMenu.on('click', '.template-edit', function(e) {
		var $this = $(this),
			id = $this.data('id'),
			tempName = $this.data('name');
		e.stopPropagation();
		$libMoreMenu.hide();

		tempHtmlContent.style.display = "";
		$tempName.val(tempName);

		mini.showMessageBox({
			width: 350,
			height: 150,
			title: "模板重命名",
			buttons: ["cancel", "ok"],
			// customCls: "portal-tip",
			html: tempHtmlContent,
			showModal: true,
			callback: function(action) {

				if(action == 'ok') {
					var name = $tempName.val().trim();
					if(!name) {
						epoint.showTips('名称不能为空', {
							state: "danger"
						});
						return;
					}
					if(name.length > 50) {
						epoint.showTips('名称请控制在50字以内，谢谢', {
							state: "danger"
						});
						return;
					}
					renameTemplate({
						id: id,
						name: name,
						callback: function() {
							epoint.showTips('保存成功');
							// $tempMoreMenu.data('name', name);
							$this.data('name', name);
							$this.parent().data('name', name);
							$this.parent().attr('title', name);
							$this.prev().text(name);
						}
					})
				}

			}
		});

	}).on('click', '.menu-item', function(e) {
		var $this = $(this),
			ref = $this.data('ref'),
			id = $this.data('id'),
			public = $this.data('public');

		if(ref == 'create') {
			otherSave();
		} else {
			if($this.hasClass('edit-disable')) {
				epoint.showTips('请打开元件显隐功能');
				return;
			}
			getTemplateById({
				id: id,
				public: public
			});
		}

		$libMoreMenu.hide();
		e.stopPropagation();
	});

	function getTemplateById(opt) {
		var id = opt.id,
			public = opt.public;

		Util.ajax({
			url: portalConfig.getTemplateById,
			data: {
				templateGuid: id,
				public: public
			}
		}).done(function(data) {
			// cacheLibMenu = [];
			$(cacheLibMenu).each(function(index, item) {
				item.visible = false;
				var other = JSON.parse(item.other);
				other.visible = false;
				item.other = JSON.stringify(other);
			});

			var tableData = data.tableData;

			// 行列排序
			tableData.sort(
				function(a, b) {
					if(typeof a.col == "string") {
						a.col = +a.col
					}
					if(typeof b.col == "string") {
						b.col = +b.col
					}
					if(typeof a.row == "string") {
						a.row = +a.row
					}
					if(typeof b.row == "string") {
						b.row = +b.row
					}
					if (a.col === b.col) {
						return a.row - b.row;
					}
					return a.col > b.col ? 1 : -1;
			});

			var sum = $('.element-item').length;
			var i = 1;
			if(sum) {
				gridster.remove_all_widgets(function() {
					if(i == sum) {
						$.each(tableData, function(index, item) {
							ElementManage.addElementItem(item, true);
						});
						if (!canMove) {
							gridster.disable();
						}
					} else {
						i++;
					}
				});
			} else {
				$.each(tableData, function(index, item) {
					ElementManage.addElementItem(item, true);
				});
				if (!canMove) {
					gridster.disable();
				}
			}
			
		})
	}

	/* -------- 加载元件（模板） ---------- */

	/* -------- 加载元件（仓库） ---------- */

	win.renderLibDom = function(searchVal) {
		var elementItemDom = '';
		if(searchVal) {
			var empty = true;
			var list = JSON.parse(JSON.stringify(cacheLibMenu));
			$(list).each(function(index, item) {
				if(item.title.indexOf(searchVal) > -1) {
					var reg = new RegExp(searchVal, "g");
					empty = false;
					item.result = item.title.replace(reg, '<span class="result-mark">' + searchVal + '</span>');
				}
			});
			elementItemDom = Mustache.render(LIB_ITEM_SEARCH_TPL, {
				list: list || []
			});
			if(empty) {
				elementItemDom = '<li class="no-result">暂无数据</>'
			}
		} else {
			elementItemDom = Mustache.render(LIB_ITEM_TPL, {
				list: cacheLibMenu || []
			});

			if(cacheLibMenu.length != 0) {
				$libNum.text('(' + cacheLibMenu.length + ')');
			}

		}
		$libListContainer.html(elementItemDom);
		// 加载后初始化拖拽事件
		$('.drag-item').draggable(tplDragCfg);
	}

	win.getLibIndex = function(orginalEleGuid) {
		var _index = -1;
		$(cacheLibMenu).each(function(index, item) {
			if(item.orginalEleGuid == orginalEleGuid) {
				_index = index;
			}
		});
		return _index;
	}

	// 设置元件仓库模板可见性
	win.setEleVisible = function(opt) {
		var callback = opt.callback;

		if(typeof callback == 'function') {
			callback();
		}
	};

	/* -------- 加载元件（仓库）end ---------- */

	/* ------------ 左上角模板列表----- */
	var $menuItems = $('#menu-items'),
		TEMP_ITEM_TPL = $.trim($('#temp-item-tpl').html());

	win.getTemplateData = function() {
		Util.ajax({
			url: portalConfig.getTemplateList,
			data: {
				portalGuid: portalGuid,
				type: "front"
			}
		}).done(function(data) {

			if(!data || !data.length) {
				return;
			}

			var publicStr = '',
				myStr = '';

			$(data).each(function(index, item) {
				if(item.public) {
					publicStr += Mustache.render(TEMP_ITEM_TPL, item);
				} else {
					myStr += Mustache.render(TEMP_ITEM_TPL, item);
				}
			})

			$menuItems.html(publicStr + myStr);

			if(!canShow) {
				 // 加载元件后进行操作，放到添加元件的事件后
				 $('#lib-list-container').addClass('edit-cover');
				 $('.menu-template-item').addClass('edit-disable')
			}

		});
	};

	

	// 点击其他地方隐藏更多菜单
	$('body').on('click', function(e) {
		if(!$(e.target).closest('.lib-more, .more-menu, .search-menu').length) {
			$libMoreMenu.hide();
		}
	}).on('click', '.clock', function() {

		epoint.openDialog('元件设置', './deskedit?portalGuid=' + portalGuid, function(param) {

		});

	});

})(window, jQuery);

// 仓库更多菜单的内容
(function(win, $) {
	win.libMenuEvent = {
		edit: function(opt) {
			epoint.openDialog('元件设置', './child/eleedit?title=' + opt.title + '&id=' + opt.id, function(param) {
				if(param.type == 'ok') {

					var info = opt.info; // 原来组件的信息

					var gridOption = {
						col: info.col,
						id: info.id,
						row: info.row,
						sizex: info.sizex,
						sizey: info.sizey,
						manageUrl: info.manageUrl || "",
					};

					// 设置元件中的数据
					var setOption = param.options.attr;

					var newOption = $.extend({}, gridOption, setOption);

					ElementManage.removeElement($('#element-' + opt.id), function() {
						// 添加进去

						ElementManage.addElementItem(newOption, true)
					});

				} else if(param == 'close') {

				}
			}, {
				width: "415",
				height: "578",
				param: {
					// title: opt.title || '',
					// id: opt.id || ''
				}
			});
		},
		create: function() {
			epoint.openDialog('创建元件副本', './child/createele', function(param) {
				if(param.type == 'ok') {

				} else if(param == 'close') {

				}
			}, {
				width: "415",
				height: "394",
				param: {

				}
			});
		}
	}
})(window, jQuery);

// 右侧背景
(function(win, $) {
	// 绘制背景
	win.drawBg = function() {
		commonUtil.drawColBg(COLS);
	}
	drawBg();
	var timer = null;
	win.onresize = function() {
		timer && clearTimeout(timer);
		timer = setTimeout(resetBaseDimensions, 200);
	};
	win.resetBaseDimensions = commonUtil.resetBaseDimensions();
})(window, jQuery);

// 右侧表格中的元件
var ELEMENT_CONTENT_TPL = $.trim($('#element-content-tpl').html());
(function(win, $) {
	var ELEMENT_TPL = ''; // 右侧移动的元件

	var $gridList = $('ul', $container);
	var isDragging = false; // 是否开始移动

	win.gridster = $gridList.gridster({
		autogenerate_stylesheet: true,
		widget_margins: GAPS,
		widget_base_dimensions: BASE_SIZE,
		min_cols: MIN_COLSPAN,
		max_cols: COLS,
		max_size_x: MAX_COLSPAN,
		// 调整大小
		resize: {
			// 启动拖动
			enabled: true,
			handle_class: ["spots"],
			// 最大行列限制
			max_size: [MAX_COLSPAN, 6],
			start: function(e, ui, $widget) {
                $widget.addClass('elem-in-drag');
                var max_size_x = $widget.data('maxStart'), //最大宽度
                    min_size_x = $widget.data('minStart'), // 最小宽度
                    max_size_y = $widget.data('maxEnd'), // 最大高度
                    min_size_y = $widget.data('minEnd'); // 最小高度
                this.resize_min_size_x = min_size_x;
                this.resize_min_size_y = min_size_y;
                this.resize_max_size_y = max_size_y;
                this.resize_max_size_x = max_size_x;
			},
			stop: function(e, ui, $widget) {

				resetCacheLibMenu();

				$widget.removeClass('elem-in-drag');
				adjustScrollWrap($widget);

			}
		},
		// 拖拽
		draggable: {
			start: function(event, ui) {
				// 开始拖动则需要立即停止闪动
				// stopHighlight();
				ui.$player.addClass('elem-in-drag');

				isDragging = true;
				ElementManage.removeBound();
			},
			stop: function(event, ui) {
				resetCacheLibMenu();
				ui.$player.removeClass('elem-in-drag');
			}
		},
		// 自定义数据序列化
		serialize_params: function($w, wgd) {

			var dataInfo = $($w[0]).data();
			var result = $.extend({}, {}, {
				orginalEleGuid: dataInfo['orginalEleGuid'],
				id: dataInfo['id'],
				title: dataInfo['name'],
				col: wgd.col,
				row: wgd.row,
				sizex: wgd.size_x,
				sizey: wgd.size_y
			})
			return result;
		}
	}).data('gridster');

	win.resetCacheLibMenu = function() {
		var _widgetList = ElementManage.getData();

		var widgetIds = []; // 右侧元件中的数据
		$(_widgetList).each(function(index, item) {
			widgetIds.push(item.id);
			$(cacheLibMenu).each(function(i, el) {
				if(el.orginalEleGuid === item.orginalEleGuid) {
					var _elOther = JSON.parse(el.other);
					_elOther['col'] = item.col;
					_elOther['row'] = item.row;
					_elOther['sizex'] = item.sizex;
					_elOther['sizey'] = item.sizey;
					el.sizex = item.sizex;
					el.sizey = item.sizey;
					el.other = JSON.stringify(_elOther);

				}
			})
		})

		renderLibDom();
	}

	// 绑定事件
	function bindEvent() {
		$('body').on('click', '.element-item', function() {
			var $this = $(this);
			if($('body').hasClass('edit')) {
				if(!isDragging) {
					$this.addClass('change').siblings('.change').removeClass(('change'));
				}
				isDragging = false;
			}

		}).on('click', function(e) {
			if(!$(e.target).closest('.element-item').length) {
				ElementManage.removeBound();
			}
		}).on('click', '.scroll-left', function() {
			var $this = $(this),
				$columnBox = $this.parent().find('.column-box'),
				moveX = Number($columnBox.css('margin-left').replace(/px/, '')),
				siteX = moveX + MOVE_WIDTH > 0 ? 0 : moveX + MOVE_WIDTH;

			$columnBox.animate({
				'margin-left': siteX
			});

		}).on('click', '.scroll-right', function() {
			var $this = $(this),
				wrapWidth = $this.parent().find('.scroll-wrap').width(),
				$columnBox = $this.parent().find('.column-box'),
				columnWidth = $columnBox.width(),
				moveX = Number($columnBox.css('margin-left').replace(/px/, '')),
				siteX = moveX - MOVE_WIDTH < wrapWidth - columnWidth ? wrapWidth - columnWidth : moveX - MOVE_WIDTH;

			$columnBox.animate({
				'margin-left': siteX
			});

		})

	}

	bindEvent();

	// 渲染模板内容
	var renderElementBody = function(opt) {
		var id = opt.id,
			isDiy = opt.isDiy,
			url = opt.url,
			$widget = opt.$widget,
			countUrl = opt.countUrl,
			showHeader = opt.showHeader,
			hasChildColumn = opt.hasChildColumn,
			columnGuid = opt.columnGuid || '';

		// 如果为空，则直接显示空白
		if(!url) {
			$('#element-body-' + id, $widget).empty();
			return;
		}

		if(!isDiy) {

			// 标准元件

			// 将 url 上的参数传到请求的参数上，故此处获取
			var urlParams = Util._getUrlParams(url) || '',
				urlParamStr = '';
			if(urlParams) {
				for(var param in urlParams) {
					urlParamStr += '&' + param + '=' + urlParams[param];
				}
			}
			// 将 url 上的参数传到请求的参数上 end

			Util.ajax({
				url: portalConfig.getElementDataUrl + urlParamStr, //Util.getRightUrl(epoint.dealRestfulUrl(url)),
				data: {
					elementGuid: id,
					url: url,
					columnguid: columnGuid, // 点击tab 传此值，第一次加载为空字符串
					counturl: countUrl
				}
			}).done(function(res) {
				var titleCount = 0;
				if(res.data) {
					if(typeof res.data == 'string') {
						res.data = JSON.parse(res.data)
					}
					var itemListData = res.data.itemList || [];
					$('#element-body-' + id).html(Mustache.render(ELEMENT_CONTENT_TPL, {
						itemList: itemListData
					}));
				}
				if(res.countData) {
					var countData = res.countData || [];					
					$(countData).each(function(index, item) {
						var $columnItem = $('.column-item-' + item.id, $('#element-' + id)),
							showNum = $columnItem.data('showNum'),
							name = $columnItem.data('name');
						if(showNum) {
							$columnItem.html(name + '(' + item.count + ')');
						}
						titleCount =  titleCount + parseInt(item.count);
					});					 
				}
				var $column = $('#element-' + id),
					titleName = $column.data('title'),
					showTitleCount = $column.data('showTitleCount');
				if(showTitleCount){
					$('.name', $('#element-' + id)).html(titleName + '(' + titleCount + ')');
				}
			});

		} else {
			var url = Util.getRightUrl(url);
			var head_h = showHeader ? 40 : 0,
				childColumn_h = hasChildColumn ? 30 : 0,
				top_h = head_h + childColumn_h;
			$('#element-body-' + id, $widget).css({
				'margin': 0,
				'height': 'calc(100% -  ' + top_h + 'px)'
			}).empty().html('<iframe class="element-body-content" src="' + url + '" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>');
		}

	}

	/**
	 * 新增元件
	 * @param {Object} data 元件数据
	 * data 格式
	 * {
	 *      code: '元件id',
	 *      name: '元件名称',
	 *      url: '元件内嵌iframe的url',
	 *      // 新增的元件只用有以上信息即可
	 *      rowspan: 1,
	 *      colspan: 1,
	 *      row: 1,
	 *      col: 1
	 * }
	 * @param {Boolean} isInit 是否是初始化
	 */
	var addElementItem = function(data, isInit, noAddLib) {
		if(data.row == 0) {
			data.row = "";
		}
		if(data.col == 0) {
			data.col = '';
		}

		// 是否有子标签
		data['hasChildColumn'] = false;
		// 是否自定义数据来源
		data['isDiy'] = false;
		// 加载的地址判断并赋值
		var url = '',
			columnGuid = '';
		if(data.column) {
			if(data.column.columnItems && data.column.columnItems.length) {
				data['hasChildColumn'] = true;
				$(data.column.columnItems).each(function(index, item) {
					if(item.default) {
						data['isDiy'] = item.isDiy;
						url = item.url;
						columnGuid = item.id;
					}
				});
				if(!url) {
					var firstColumn = data.column.columnItems[0]
					url = firstColumn.url;
					data.column.columnItems[0].default = true;
					data['isDiy'] = firstColumn.isDiy;
					columnGuid = firstColumn.id;
				}
			} else {
				data['isDiy'] = data.column.isDiy;
				url = data.column.columnUrl;
			}
		}

		data.url = url;

		if(typeof data.visible == 'string') {
			data.visible = data.visible === 'true' ? true : false;
		}

		// 加载的地址判断并赋值 end
		if(data.visible) {

			ELEMENT_TPL = $.trim($("#element-tpl").html());

			var html = commonUtil.renderElem(data, ELEMENT_TPL);
			// 初始化元件
			if(isInit) {
				var arr = ['sizex', 'sizey'];

				$(arr).each(function(index, item) {
					if(typeof data[item] == 'string') {
						data[item] = Number(data[item])
					}
				})

				if(data.row && data.col) {
					gridster.add_widget(html, data.sizex || 4, data.sizey || 4, data.col, data.row, [MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
				} else {
					gridster.add_widget(html, data.sizex || 4, data.sizey || 4, "", "", [MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
				}
			}

			var $widget = $(html);

			adjustScrollWrap($widget);
			// 元件-仓库添加数据

			var _index = getLibIndex(data.orginalEleGuid);
			if (noAddLib) {
				var otherData = JSON.parse(cacheLibMenu[_index].other);
				otherData.visible = true;
				cacheLibMenu[_index].visible = true;
				cacheLibMenu[_index].other = JSON.stringify(otherData);
			} else {
				if (_index < 0) {
					var libItemData = JSON.parse(JSON.stringify(data)); // $('#element-' + data.id).data()

					cacheLibMenu.push({
						id: data.id,
						orginalEleGuid: data.orginalEleGuid,
						title: data.title,
						visible: data.visible,
						sizex: data.sizex,
						sizey: data.sizey,
						other: JSON.stringify(libItemData)
					})
				} else {
					var libItemData = JSON.parse(JSON.stringify(data)),
						newData = {
							id: data.id,
							orginalEleGuid: data.orginalEleGuid,
							title: data.title,
							sizex: data.sizex,
							sizey: data.sizey,
							visible: data.visible,
							other: JSON.stringify(libItemData)
						};
					cacheLibMenu.splice(_index, 1, newData);
				}
			}

			renderLibDom();
			if (data.visible) {
				var countUrl = "";
				if (data.countUrl) {
					countUrl = data.countUrl;
				} else if (data.column) {
					if (data.column.countUrl) {
						countUrl = data.column.countUrl;
					}
				}
				commonUtil.renderElementBody({
					id: data.id,
					isDiy: data.isDiy,
					url: data.url,
					$widget: $widget,
					countUrl: countUrl,
					showHeader: data.showHeader,
					hasChildColumn: data.hasChildColumn,
					columnGuid: columnGuid || ''
				});


				// 如果没有主标题
				// if(!data.showHeader) {
				// 如果有子标签
				if (data.hasChildColumn) {
					// 默认是第一个标签
					var currentColumn = '';
					$(data.column.columnItems).each(function (index, item) {
						if (item.default) {
							currentColumn = item;
						}
					});
					if (!currentColumn) {
						currentColumn = data.column.columnItems[0];
					}
					commonUtil.adjustColumnOperation(currentColumn, $widget);
				}
				// }
			}
		} else {
			var _index = getLibIndex(data.orginalEleGuid);
			if (noAddLib) {
				var otherData = JSON.parse(cacheLibMenu[_index].other);
				otherData.visible = true;
				cacheLibMenu[_index].visible = true;
				cacheLibMenu[_index].other = JSON.stringify(otherData);
			} else {
				if (_index < 0) {
					var libItemData = JSON.parse(JSON.stringify(data)); // $('#element-' + data.id).data()

					cacheLibMenu.push({
						id: data.id,
						orginalEleGuid: data.orginalEleGuid,
						title: data.title,
						visible: data.visible,
						sizex: data.sizex,
						sizey: data.sizey,
						other: JSON.stringify(libItemData)
					})
				} else {
					var libItemData = JSON.parse(JSON.stringify(data)),
						newData = {
							id: data.id,
							orginalEleGuid: data.orginalEleGuid,
							title: data.title,
							sizex: data.sizex,
							sizey: data.sizey,
							visible: data.visible,
							other: JSON.stringify(libItemData)
						};
					cacheLibMenu.splice(_index, 1, newData);
				}
			}

			renderLibDom();
		}
	};

	win.adjustScrollWrap = function ($widget) {
		var $scrollWrap = $('.scroll-wrap', $widget),
			widgetWidth = $widget.width() - 10 * 2, // 元件宽度
			$columnBox = $('.column-box', $widget), // 栏目
			$scrollBtn = $('.scroll-btn', $widget); // 切换按钮

		var item_width = 0;
		$('.element-column-item', $columnBox).each(function(index, item) {
			item_width += $(item).outerWidth(true);
		});

		$columnBox.css({
			"width": item_width + 'px'
		});

		if(item_width > widgetWidth) {
			// 显示两侧切换按钮
			$scrollBtn.show();
			$scrollWrap.addClass('show');
		} else {
			// 不显示两侧切换按钮
			$scrollBtn.hide();
			$scrollWrap.removeClass('show');
		}
	}

	// 移除元件
	var removeElement = function($el, cb) {
		if($el.width()) {
			return gridster.remove_widget($el, false, cb);
		}
	};

	var removeAll = function() {
		return gridster.remove_all_widgets();
	}

	// 移除元件调整大小的框
	var removeBound = function() {
		$('.element-item').removeClass('change');
	}

	// 对外开放的属性和方法
	win.ElementManage = {
		// 初始化后的gridster对象
		_gridster: gridster,
		// init: init,
		getAndAddElement: function() {

		},
		addCacheElement: editCommonUtil.addCacheElement,
		addElementItem: addElementItem,
		removeElement: removeElement,
		removeALl: removeAll,
		removeBound: removeBound,
		getData: function() {
			return gridster.serialize();
		}
	};

	$paintingArea.on('click', '.elem-icon', function() {
		var $this = $(this),
			$li = $this.parent().parent(),
			type = $this.data('ref'),
			info = $li.data();

		if(type == 'delete') {
			epoint.confirm("确定要删除元件" + '<span class="text-blue">' + info.title + '</span>' + "吗？", '', function(action) {

				setEleVisible({
					libId: info.id,
					visible: false,
					callback: function() {
						$li.toggleClass('active');
						var _index = getLibIndex(info.orginalEleGuid);
						if(_index > -1) {
							var otherData = JSON.parse(cacheLibMenu[_index].other);
							otherData.visible = false;
							cacheLibMenu[_index].other = JSON.stringify(otherData);

							cacheLibMenu[_index].visible = false;
						}
						ElementManage.removeElement($('#element-' + info.id));
						renderLibDom();
					}
				})
			})

		}

	});

})(window, jQuery);