/**
 * ! 全文检索 author: liub; Date:2018-3-13;
 */

(function (win, $) {
	var $fsHead = $('#fs-head'),
		$fsSearch = $('#fs-search'),
		$category = $('#category'),
		$searcWd = $('#swd'),
		$searchBtn = $('#searchBtn'),
		$sort = $('#sort'),
		$advsSwitch = $('#advs-switch'),
		$advsContent = $('#advs-content'),
		$content = $('#fs-content'),
		$grid = $('#grid'),
		$riTitle = $('#ri-title'),
		$riClose = $('#ri-close'),
		$riList = $('#ri-list');

	var mailCategory = window.EpFrameSysParams ? EpFrameSysParams["FullSearchMailCategory"] : undefined;

	if (mailCategory) {
		mailCategory += '';
		if (mailCategory.substr(mailCategory.length - 1) == ';') {
			mailCategory = mailCategory.substr(0, mailCategory.length - 1);
		}

	}

	// 时间控件
	var time = mini.get("time");

	// 检索方式中的相关度下拉控件
	var relevantControl = mini.get('relevant');

	// token值
	var _currentToken = '',
		_currentToCategorys = '',
		// 需过滤的特殊字符
		needPassWord = [':'];

	// 模板
	var categoryItemTpl = Util.clearHtml($('#categoryItemTpl').html()),
		riItemTpl = Util.clearHtml($('#riItemTpl').html()),
		gridItemTpl = Util.clearHtml($('#gridItemTpl').html()),
		userInOneTpl = Util.clearHtml($('#userInOneTpl').html()),
		moduleInOneTpl = Util.clearHtml($('#moduleInOneTpl').html()),
		appInOneTpl = Util.clearHtml($('#appInOneTpl').html()),
		userItemTpl = Util.clearHtml($('#userItemTpl').html()),
		moduleItemTpl = Util.clearHtml($('#moduleItemTpl').html()),
		modulePathTpl = Util.clearHtml($('#modulePathTpl').html()),
		appItemTpl = Util.clearHtml($('#appItemTpl').html());

	// 搜索条件的表单字段
	var searchForm = {
		categoryId: '',
		sort: {
		},
		ssort: '',
		pageIndex: 0,
		pageSize: 10
	};

	// 类型相关信息的缓存
	var typeCache = {};

	var storeType = function (item) {
		typeCache[item.guid] = {
			img: item.img,
			name: item.name,
			operations: item.operations
		};

		if (item.active) {
			searchForm.categoryId = item.guid;
		}
	};

	var getTypeOpertionBtns = function (guid) {
		var i = 0,
			l, html = [],
			operations = typeCache[guid].operations,
			optBtn = typeCache[guid].optBtn,
			operation;

		if (optBtn) {
			return optBtn;
		}

		l = operations ? operations.length : 0;

		if (l) {
			for (; i < l; i++) {
				operation = operations[i];
				html.push('<span class="fs-operation-btn" data-opti="' + i + '">' + operation.name + '</span>');
			}
		}

		typeCache[guid].optBtn = optBtn = html.join('');

		return optBtn;
	};

	var M = Mustache;

	// 高级搜索表单
	var advsForm = new mini.Form('#advs-form'),
		wd_all = mini.get('wd_all'),
		pager = mini.get('pager'),
		startTime = mini.get('startTime'),
		endTime = mini.get('endTime');

	// 获取数据通用方法
	var _getData = function (url, params) {
		epoint.showLoading();
		_getToken();
		// 需要对查找关键字中的特殊字符进行过滤
		var wd_all = _getKeywordfilter(params.wd_all);
		var wd_any = _getKeywordfilter(params.wd_any);
		var wd_exc = _getKeywordfilter(params.wd_exc);
		return Util.ajax({
			url: epoint.dealRestfulUrl(url),
			cache: false,
			// data: params
			data: {
				"token": _currentToken, // 权限参数，索引中的userguid字段值，通过des加密
				"pn": params.pageIndex * params.pageSize, // 起始行
				"rn": params.pageSize, // 记录数
				"sdt": params.start_time, // 开始时间（yyyy-MM-dd
				// HH:mm:ss），搜索日期默认为infodate
				"edt": params.end_time, // 结束时间（yyyy-MM-dd
				// HH:mm:ss）搜索日期默认为infodate
				"key": encodeURIComponent(wd_all), // 关键词（以空格分隔代表全包含）
				"inc_wd": encodeURIComponent(wd_any), // 包含任意关键词
				"exc_wd": encodeURIComponent(wd_exc), // 不包含关键词
				"fields": params.ssort == "" ? "title;content" : params.ssort, // 全文检索范围（需要搜索的字段，以";"分隔，不传则搜索无效，返回空,搜索范围默认搜索标题和内容）
				"cnum": params.categoryId == "all" ? "" : params.categoryId, // 分类号（以";"分隔，不传默认返回后台配置的所有分类下的数据）
				"sort": params.sort, // 字段升序降序排序 '{"infodate":"0"}'
				"ssort": "", // 字段匹配度排序
				"cl": 100, // 返回内容长度
				"terminal": "", // 终端类别（0:pc,1:移动端,2:其他）
				"condition": "",
				"time": null, // 时间范围（字段名称，开始时间，结束时间）,时间格式yyyy-MM-dd
				// HH:mm:ss
				"highlights": "title;content", // 需要高亮的字段（以";"分隔，不传则默认将fields字段高亮）
				"statistics": null, // 统计，默认按照后台索引分类统计，可以指定一个字段统计（这个字段不能有分词）
				"unionCondition": null, // 查询条件（所有字段之间都是或者关系）,例子同condition
				"accuracy": "", // 查询内容精确度（0~100整数)，此参数默认为空，关键词匹配方式为and，如果传入1~100的数字，则匹配方式为or
				"noParticiple": '1', // 查询关键词不要分词（设置为1则启用，否则不启用）
				"searchRange": params.searchRange
				// 范围查询，比如某个字段值为10，要查0~20之间的索引，例子如下：
				// "searchRange":''[{"fieldName":"status","start":"0","end":"10"},{},{}]'
			}
		}).always(function () {
			epoint.hideLoading();
		});

	};

	// 获取相关数据通用方法
	var _getRelateData = function (url, params) {
		_getToken();
		var wd = _getKeywordfilter(params.title);
		var tocategorys = "";
		if (_currentToCategorys) {
			// 设置过范围
			if (_currentToCategorys.indexOf(";") > 0) {
				// 设置多类时进行查找操作
				tocategorys = _currentToCategorys.replace(params.categorynum + ";", "");
			} else {
				tocategorys = _currentToCategorys;
			}
		}
		epoint.showLoading();
		return Util.ajax({
			url: epoint.dealRestfulUrl(url),
			cache: false,
			data: {
				"token": _currentToken,
				"wd": wd,
				"fromCategorys": params.categorynum,
				"fromFields": "title",
				"toCategorys": tocategorys,
				"toFields": "title;content",
				"accuracy": "50",
				"limit": 5,
				"sortField": "",
				"re_fields": "title;linkurl"
			}
		}).always(function () {
			epoint.hideLoading();
		});
	};

	var hasMoreCategory = false,
		$moreCategory,
		$moreCategoryList;

	// var maxCategoryNum = win.maxCategoryNum ? win.maxCategoryNum : 4;
	// 渲染分类
	var renderCategory = function (data) {
		var i, len, html = [];
		if (!data || !(len = data.length)) {
			return;
		}
		// hasMoreCategory = len > maxCategoryNum;
		// if (hasMoreCategory) {
		// 	for (i = 0; i < maxCategoryNum; i++) {
		// 		html.push(M.render(categoryItemTpl, data[i]));
		// 		storeType(data[i]);
		// 	}

		// 	html.push('<li class="fs-category-item more">更多<ul class="fs-category-more">');

		// 	for (i = maxCategoryNum; i < len; i++) {
		// 		html.push(M.render(categoryItemTpl, data[i]));
		// 		storeType(data[i]);
		// 	}

		// 	html.push('</ul></li>');
		// } else {
		for (i = 0; i < len; i++) {
			html.push(M.render(categoryItemTpl, data[i]));
			storeType(data[i]);
		}
		// }
		// 第一次加载所有类别
		_currentToCategorys = data[0].tocategorys;

		html.push('<li class="fs-category-item more hidden">更多<ul class="fs-category-more"></ul></li>');
		$category.html(html.join(''));

		$moreCategory = $category.find('.fs-category-item.more');
		$moreCategoryList = $moreCategory.find('ul');

		adjustCategoryWidth();
	};

	var adjustCategoryWidth = function () {
		var headW = $fsHead.width(),
			searchW = $fsSearch.outerWidth(),
			listMaxW = headW - searchW - 80,
			listW = 0,
			$item;

		$moreCategoryList.children().insertBefore($moreCategory);
		$moreCategoryList.empty();
		$moreCategory.addClass('hidden');
		hasMoreCategory = false;

		$category.children().each(function (i, item) {
			$item = $(item);
			if ($item.hasClass('more')) {
				return true;
			}
			if (!hasMoreCategory) {

				listW += $item.outerWidth();

				if (listW > listMaxW) {
					hasMoreCategory = true;

					$item.appendTo($moreCategoryList);
				}
			} else {
				$item.appendTo($moreCategoryList);
			}
		});

		if (hasMoreCategory) {
			$moreCategory.removeClass('hidden');
		}
	};

	var getCategoryData = function () {
		Util.ajax({
			url: epoint.dealRestfulUrl(getCategoryUrl)
		}).done(function (data) {
			var json = JSON.parse(data.categories);
			// console.log(json.categories);
			renderCategory(json);
			// 渲染完分类后，需要进行数据搜索
			var key = Util.getUrlParams('wd');
			var type = Util.getUrlParams('type') || 'all';
			if (key) {
				// 高亮
				$category.find('#' + type).addClass('active')
					.siblings().removeClass('active');

				searchForm.categoryId = type;
				$searcWd.val(decodeURI(key));
				wd_all.setValue(decodeURI(key));

				adjustConditionDisplay(type);
				searchData();
			}
		});
	};

	// 切换高级搜索面板显隐
	var toggleAdvsContent = function (show) {
		if (!show) {
			$advsSwitch.removeClass('active');
			$advsContent.addClass('hidden');
		} else {
			$advsSwitch.addClass('active');
			$advsContent.removeClass('hidden');
		}
	};

	// 高级搜索面板三个按钮点击后执行的方法
	var advsBtnClickFun = {
		search: function () {
			searchData();
		},
		reset: function () {
			// 清楚高级搜索中信息
			advsForm.reset();
			// 清空搜索框信息
			$searcWd.val("");
		},
		close: function () {
			toggleAdvsContent(false);
		}
	};

	// 控制内容超出两行...显示
	var clampGridInfo = function () {
		var $info = $('.fs-info-bd', $grid);

		for (var i = 0, l = $info.length; i < l; i++) {
			$clamp($info[i], {
				clamp: 2
			});
		}
	};
	// 切换右侧相关信息面板显隐
	var toggleRightContent = function (show) {
		if (show) {
			$content.addClass('showright');
		} else {
			$content.removeClass('showright');
		}
	};

	// 获取当前用户token信息
	var _getToken = function () {

	};

	// 将关键字特殊符号过滤掉
	var _getKeywordfilter = function (wd) {
		for (var i = 0; i < needPassWord.length; i++) {
			if (wd.indexOf(needPassWord[i]) > -1) {
				wd = wd.replaceAll(needPassWord[i], '');
			}
		}
		return wd;
	};

	String.prototype.replaceAll = function (FindText, RepText) {
		regExp = new RegExp(FindText, "g");
		return this.replace(regExp, RepText);
	}

	var _currentRelatedInfoGuid;
	// 获取相关信息并展示
	var getRelatedInfo = function (guid, title, categorynum) {
		if (guid != _currentRelatedInfoGuid) {
			_currentRelatedInfoGuid = guid;
			var retitle = title;
			if (title.length > 10) {
				title = title.substr(0, 10) + '...';
			}
			$riTitle.html('“' + title + '”的相关信息');

			_getRelateData(win.getRelatedInfoUrl, {
				guid: guid,
				title: retitle,
				categorynum: categorynum
			}).done(function (data) {
				renderRelatedInfo(data);
			});
		}
		toggleRightContent(true);
	};

	var renderRelatedInfo = function (data) {
		var i = 0,
			l = data ? data.records.length : 0,
			html = [];

		if (l) {
			for (; i < l; i++) {
				html.push(M.render(riItemTpl, data.records[i]));
			}

			$riList.html(html.join('')).removeClass('empty');
		} else {
			$riList.empty().addClass('empty');
		}
	};

	var updatePager = function () {
		if ($grid.children().length >= pager.getTotalCount()) {
			pager.setVisible(false);
			$grid.addClass('no-pager');
		} else {
			pager.setVisible(true);
			$grid.removeClass('no-pager');
		}
	};

	var searchData = function () {
		var params = getParams();
		return _getData(win.searchDataUrl, params).done(function (data) {
			// 有返回结果时，渲染结果
			var backData = JSON.parse(data.frameinfo);

			$grid.empty().addClass('empty');

			var total = backData.totalcount;
			total > -1 && pager.setTotalCount(total);
			pager.setPageIndex(searchForm.pageIndex);

			for (var i in backData) {
				renderData(backData[i], i);
			}
			// renderData(backData.modules, genderModuleHtml);
			// renderData(backData.users, genderUserHtml);
			// renderGrid(backData.records);

			clampGridInfo();
			updatePager();
			toggleAdvsContent(false);
		});

	};

	var renderData = function (data, type) {
		var genderFun = typeHandlers[type];

		if (!data || typeof genderFun != 'function') {
			return;
		}
		var kw = $searcWd.val();
		if (kw) {
			data.wd = kw;
			var html = genderFun(data || {}, true);

			if (html) {
				// 普通搜索结果需放到最后面
				if (type === 'records') {
					$(html).appendTo($grid);
				} else {
					$(html).prependTo($grid);
				}
				$grid.removeClass('empty');
			}
		}
	};


	// 搜索类型渲染处理函数配置
	var typeHandlers = {
		modules: genderModuleHtml,
		users: genderUserHtml,
		apps: genderAppHtml,
		records: genderRecordHtml
	};

	// 用户的渲染
	function genderUserHtml(data) {
		var html = [];
		var kw = data.wd;
		var isInOne = searchForm.categoryId === "all";
		// 是有用户tab
		var hasUserTab = $category.find('#user').length ? true : false;
		if (data && data.length) {
			if (isInOne) {
				html.push(Mustache.render(userInOneTpl, $.extend({}, data, {
					hasUserTab: hasUserTab,
					subList: _render(data)
				})));
			} else {
				html.push(_render(data));
			}
		}

		return html.join();

		function _render(list) {
			var html = [];
			$.each(list, function (i, item) {
				// image path
				if (item.portrait && !/^data:/.test(item.portrait)) {
					item.portrait = Util.getRightUrl(item.portrait);
				}
				// hightlight kwyword
				if (kw) {
					// var reg = new RegExp(kw,'ig');
					item.hlname = item.name.replace(new RegExp(kw, 'ig'),
						'<span class="kw">' + kw + '</span>');
					item.position = item.position.replace(new RegExp(kw, 'ig'),
						'<span class="kw">' + kw + '</span>');
					// 部门不高亮
					// item.dept = item.dept.replace(new RegExp(kw, 'ig'),
					// '<span class="kw">' + kw + '</span>');
				}
				html.push(Mustache.render(userItemTpl, item));
			});
			return html.join('');
		}
	}
	// 模块的渲染
	function genderModuleHtml(data) {
		var BGS = ['#fe8682', '#3391e5', '#58cece', '#dee7fb', '#fbdeed',
			'#71bc57', '#86699f'
		];
		var html = [];
		var kw = data.wd;
		var isInOne = searchForm.categoryId === "all";
		// 是有用模块tab
		var hasModuleTab = $category.find('#module').length ? true : false;
		if (data && data.length) {
			if (isInOne) {
				html.push(Mustache.render(moduleInOneTpl, $.extend({}, data, {
					hasModuleTab: hasModuleTab,
					subList: _render(data)
				})));
			} else {
				html.push(_render(data));
			}
		}
		return html.join('');

		function _render(list) {
			var html = [];
			$.each(list, function (i, item) {
				item.icon = item.icon || 'modicon-1';
				// item.iconBg = BGS[Math.random() * 7 >> 0]; 不随机，特定
				item.iconBg = item.iconBackColor || BGS[i % 7 >> 0];
				// pullpath
				item.fullpathHTML = '';
				$.each(item.pullpath, function (i, pit) {
					pit.hlname = pit.name.replace(new RegExp(kw, 'ig'),
						'<span class="kw">' + kw + '</span>');
					item.fullpathHTML += Mustache.render(modulePathTpl, pit);
				});
				// hightlight kwyword
				if (kw) {
					// var reg = new RegExp(kw,'ig');
					item.hlname = item.name.replace(new RegExp(kw, 'ig'),
						'<span class="kw">' + kw + '</span>');
				}
				html.push(Mustache.render(moduleItemTpl, item));
			});
			return html.join('');
		}
	}
	// 应用的渲染
	function genderAppHtml(data) {
		var html = [];
		var kw = data.wd;
		var isInOne = searchForm.categoryId === "all";
		// 是有应用模块tab
		var hasAppTab = $category.find('#app').length ? true : false;
		if (data && data.length) {
			if (isInOne) {
				html.push(Mustache.render(appInOneTpl, $.extend({}, data, {
					hasAppTab: hasAppTab,
					subList: _render(data)
				})));
			} else {
				html.push(_render(data));
			}
		}
		return html.join('');

		function _render(list) {
			var html = [];
			$.each(list, function (i, item) {
				// image path
				if (item.icon && !/^data:/.test(item.icon)) {
					item.icon = Util.getRightUrl(item.icon);
				}
				// hightlight kwyword
				if (kw) {
					item.hlname = item.name.replace(new RegExp(kw, 'ig'), '<span class="kw">' + kw + '</span>');

				}
				html.push(Mustache.render(appItemTpl, item));
			});
			return html.join('');
		}
	}
	// 普通搜索结果的渲染
	function genderRecordHtml(data) {
		var i = 0,
			l = data ? data.length : 0,
			html = [],
			typeGuid, dataItem, item, title, content;

		_gridCache = {};

		if (l) {
			for (; i < l; i++) {
				dataItem = data[i];
				_gridCache[dataItem.guid] = dataItem;
				typeGuid = dataItem.syscategory;

				// 全文检索出来的邮件数据title和content是在subject和mailcontent字段中的，需要特殊处理下
				if (typeGuid === mailCategory) {
					title = dataItem.subject;
					content = dataItem.mailcontent;

					if (title) {
						dataItem.title = title;
					}
					if (content) {
						dataItem.content = content;
					}

					if (!dataItem.linkurl) {
						dataItem.linkurl = 'https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailreceivedetail?detailguid=' + dataItem.detailguid;
					}
				}
				if (dataItem.infoproperty) {
					var infoid = dataItem.id;
					dataItem.linkurl = 'https://oa.epoint.com.cn/netoffice8/EpointWebinfo/Pages/WebInfoRead/Info_Detail.aspx?infoGuid=' + infoid.substring(0, infoid.length - 4);
				}
				if (dataItem.linkurl && dataItem.linkurl.indexOf("http://oa2.epoint.com.cn") > -1) {
					dataItem.linkurl = dataItem.linkurl.replace("http://oa2.epoint.com.cn", "https://oa.epoint.com.cn");
				}
				try {
					item = $.extend({}, dataItem, {
						pureTitle: dataItem.title.replace(/<[^>]+>/g, ""),
						typeName: typeCache[typeGuid].name,
						typeImg: typeCache[typeGuid].img,
						optBtn: getTypeOpertionBtns(typeGuid)

					});
				} catch (e) {
					item = $.extend({}, dataItem, {});
				}
				html.push(M.render(gridItemTpl, item));
			}
		}

		return html.join('');
	}

	// 缓存搜索记录，以备操作按钮点击事件用
	var _gridCache = {};
	// var renderGrid = function (data) {
	// 	var i = 0,
	// 		l = data ? data.length : 0,
	// 		html = [],
	// 		typeGuid, dataItem, item, title, content;

	// 	_gridCache = {};

	// 	if (l) {
	// 		for (; i < l; i++) {
	// 			dataItem = data[i];
	// 			_gridCache[dataItem.guid] = dataItem;
	// 			typeGuid = dataItem.syscategory;

	// 			// 全文检索出来的邮件数据title和content是在subject和mailcontent字段中的，需要特殊处理下
	// 			if(typeGuid === mailCategory) {
	// 				title = dataItem.subject;
	// 				content = dataItem.mailcontent;

	// 				if(title) {
	// 					dataItem.title = title;
	// 				}
	// 				if(content) {
	// 					dataItem.content = content;
	// 				}

	// 				if(!dataItem.linkurl) {
	// 					dataItem.linkurl = 'https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailreceivedetail?detailguid=' + dataItem.detailguid; 
	// 				}
	// 			}
	// 			if (dataItem.infoproperty) { 
	//                 var infoid = dataItem.id; 
	//                 dataItem.linkurl = 'https://oa.epoint.com.cn/netoffice8/EpointWebinfo/Pages/WebInfoRead/Info_Detail.aspx?infoGuid=' + infoid.substring(0,infoid.length-4); 
	// 			}
	// 			if(dataItem.linkurl && dataItem.linkurl.indexOf("http://oa2.epoint.com.cn")>-1){
	// 				dataItem.linkurl = dataItem.linkurl.replace("http://oa2.epoint.com.cn","https://oa.epoint.com.cn");
	// 			}
	// 			try {
	// 				item = $.extend({}, dataItem, {
	// 					pureTitle: dataItem.title.replace(/<[^>]+>/g, ""),
	// 					typeName: typeCache[typeGuid].name,
	// 					typeImg: typeCache[typeGuid].img,
	// 					optBtn: getTypeOpertionBtns(typeGuid)

	// 				});
	// 			} catch (e) {
	// 				item = $.extend({}, dataItem, {});
	// 			}
	// 			html.push(M.render(gridItemTpl, item));
	// 		}

	// 		$grid.append(html.join('')).removeClass('empty');

	// 		clampGridInfo();
	// 	}
	// };

	// 获取搜索条件
	var getParams = function () {
		var params = {};

		var advsParams = advsForm.getData();

		if (advsParams.time == 0) {
			advsParams.start_time = advsParams.end_time = '';
		} else if (advsParams.time != 'custom') {
			var now = new Date();
			advsParams.end_time = mini.formatDate(now, "yyyy-MM-dd");
			advsParams.start_time = mini.formatDate(new Date(now.getTime() -
					(advsParams.time - 0) * 24 * 60 * 60 * 1000),
				"yyyy-MM-dd");
		} else {
			advsParams.end_time = mini.formatDate(advsParams.end_time,
				"yyyy-MM-dd");
			advsParams.start_time = mini.formatDate(advsParams.start_time,
				"yyyy-MM-dd");
		}

		params = $.extend({}, advsParams, searchForm);

		params.sort = JSON.stringify(params.sort);

		return params;
	};

	// 用nicescroll初始化页面中的滚动效果
	// var initScroll = function (items) {

	// 	for (var i = 0, l = items.length; i < l; i++) {
	// 		items[i].niceScroll({
	// 			cursorcolor: '#2dabec',
	// 			cursorborder: '1px solid #2dabec',
	// 			cursorwidth: '2px'
	// 		});
	// 	}
	// };

	var toggleSort = function (name, osort) {
		var nsort = '';
		switch (osort) {
			case '':
				nsort = 'down';
				searchForm.sort[name] = '0';
				break;
			case 'down':
				nsort = 'up';
				searchForm.sort[name] = '1';
				break;
			case 'up':
				nsort = '';
				searchForm.sort[name] = '';
				break;
		}

		return nsort;
	};

	var adjustConditionDisplay = function (type) {
		// 新增关于用户和模块的处理
		// 用户和模块无须时间和相关程度
		// 无全文检索地址也隐藏
		if (/^(?:user|module)$/.test(type) || !win.searchDataUrl) {
			$('body').addClass('hide-condition');
		} else {
			$('body').removeClass('hide-condition');
		}
	};

	var initEvent = function () {
		// 分类点击事件
		$category.on('click', '.fs-category-item', function (e) {
			var $this = $(this),
				id = this.id,
				tocategorys = $this.data('tocategorys');
			if ($this.hasClass('active')) {
				return;
			}
			if (!id) {
				return;
			}
			// 第一次加载所有类别
			_currentToCategorys = tocategorys;

			$category.find('.fs-category-item.active').removeClass('active');
			$this.addClass('active');

			searchForm.categoryId = id;

			if (hasMoreCategory &&
				$this.parent().hasClass('fs-category-more')) {
				$moreCategory.addClass('active');
			}
			// 切换分类时，需回到查询的第一页
			searchForm.pageIndex = 0;
			adjustConditionDisplay(id);

			searchData();
		});

		// 搜索按钮点击事件
		$searchBtn.on('click', function () {
			searchData();
		});

		// 绑定回车事件
		$searcWd.on('keypress', function (event) {
			if (event.keyCode == 13) {
				searchData();
			}
		});

		// 排序区域点击事件
		$sort.on('click', '.fs-sort-item', function () {
			var $this = $(this),
				name = $this.data('name'),
				osort = $this.hasClass('down') ? 'down' : ($this.hasClass('up') ? 'up' : ''),
				relevant;

			if (name == 'fullmatch') {
				// if ($this.hasClass('active')) {
				// 	$this.removeClass('active');
				// 	searchForm.noParticiple = '0';
				// } else {
				// 	$this.addClass('active');
				// 	searchForm.noParticiple = '1';
				// }

			} else if (name == 'relevant') {
				// relevant = $this.data('relevant');
				// searchForm.ssort = relevant;
				// $this.addClass('active').siblings('.relevant').removeClass('active');

				return true;

			} else if (name == 'infodate') {
				nsort = toggleSort(name, osort);
				$this.removeClass(osort).addClass(nsort);
			}
			searchData();
		});

		// 排序区域相关度下拉控件值改变事件
		relevantControl.on('valuechanged', function (e) {
			searchForm.ssort = (e.value == 'all' ? '' : e.value);
			searchData();
		});

		// 高级搜索按钮点击事件
		$advsSwitch.on('click', function () {
			toggleAdvsContent(!$(this).hasClass('active'));
		});

		// 高级搜索底部按钮点击事件
		$advsContent.on('click', '.fs-advs-btn', function () {
			var role = $(this).attr('role');
			advsBtnClickFun[role]();
		});

		// 结果列表内部的点击事件
		$grid.on('click', '.fs-info-ri', function (e) {
			// 相关信息
			var $item = $(this).closest('.fs-grid-item'),
				guid = $item.data('guid'),
				title = $item.data('title'),
				categorynum = $item.data('categorynum');
			tocategorys = $item.data('tocategorys');
			getRelatedInfo(guid, title, categorynum);
		}).on('click', '.fs-operation-btn', function (e) {
			var $this = $(this),
				$parent = $this.parent(),
				typeGuid = $parent.data('typeguid'),
				index = $this.data('opti'),
				$item = $this.closest('.fs-grid-item'),
				guid = $item.data('guid'),

				jsFunStr = typeCache[typeGuid] ? typeCache[typeGuid].operations[index].jsFun : '',
				jsFun;

			if (jsFunStr && (jsFun = window[jsFunStr])) {
				// 去除后4位,后4位固定格式_XXX
				jsFun(guid.substring(0, guid.length - 4));
				// jsFun(_gridCache[guid]);
			}
		}).on('click', '.fs-info-title', function () {
			var url = $(this).data('url');
			var $item = $(this).closest('.fs-grid-item'),
				title = $item.data('title'),
				guid = $item.data('guid');
			win.onGridItemClick && onGridItemClick(title, url);

			Util.ajax({
				url: epoint.dealRestfulUrl(updateCTRUrl),
				data: {
					id: guid
				}
			});
		}).on('click', '.view-all', function () {
			// 用户和模块的查看全部
			var type = $(this).closest('.fs-grid-item').data('type');
			type && $category.find('#' + type).trigger('click');
		}).on('click', '.module-item', function (e) {
			// 模块点击
			var $this = $(this),
				name = this.title,
				url = $this.data('url'),
				id = $this.data('id'),
				openType = $this.data('opentype');
			// 无url或在模块视图中不响应 但是排除打开按钮
			if (!url || (!$this.closest('.fs-grid-item.module-inone').length) && !$(e.target).hasClass('btn-open')) {
				return;
			}
			url = Util.getRightUrl(url);
			name = name.replace(/<\/?.+?>/g, '');
			try {
				if (openType == 'tabsnav') {
					top.TabsNav.addTab({
						id: id,
						name: name,
						url: url
					});
				} else if (openType == 'dialog') {
					epoint.openTopDialog(name, url);
				} else {
					win.open(url, id);
				}
			} catch (err) {
				win.open(url, id);
			}
		}).on('click', '.module-path.hasLink', function (e) {
			// 模块路径中的点击
			e.stopPropagation();
			var $this = $(this),
				name = this.title,
				url = $this.data('url'),
				id = $this.data('id'),
				openType = $this.data('opentype');
			if (!url) {
				return;
			}
			url = Util.getRightUrl(url);
			name = name.replace(/<\/?.+?>/g, '');
			try {
				if (openType == 'tabsnav') {
					top.TabsNav.addTab({
						id: id,
						name: name,
						url: url
					});
				} else if (openType == 'dialog') {
					epoint.openTopDialog(name, url);
				} else {
					win.open(url, id);
				}
			} catch (err) {
				win.open(url, id);
			}
		}).on('click', '.app-item', function () {
			// 应用的点击
			var $this = $(this),
				url = $this.data('url'),
				id = $this.data('id');
			if (top.AppMgr) {
				top.AppMgr.openApp(id);
			} else {
				if (!url) {
					return;
				}
				url = Util.getRightUrl(url);
				win.open(url, id);
			}
		});



		// 相关信息关闭按钮点击事件
		$riClose.on('click', function () {
			toggleRightContent(false);
		});

		// 相关信息列表点击事件
		$riList.on('click', '.fs-ri-item', function () {
			var $this = $(this),
				guid = $this.data('guid'),
				url = $this.data('url');

			win.onRiItemClick && onRiItemClick({
				url: url,
				guid: guid
			});
		});

		// 搜索输入框和高级搜索联动
		wd_all.on('valuechanged', function (e) {
			$searcWd.val(e.value);
		});

		$searcWd.on('keyup', function () {
			wd_all.setValue(this.value);
		});

		// 高级搜索自定义时间开始结束时间大小控制
		startTime.on('valuechanged', function (e) {
			var end = endTime.getValue();
			if (!end || end >= e.value) {
				return;
			}

			startTime.setValue('');
			epoint.showTips('开始时间不能大于结束时间！', {
				state: 'warning'
			});
		});
		endTime.on('valuechanged', function (e) {
			var start = startTime.getValue();
			if (!start || start <= e.value) {
				return;
			}

			endTime.setValue('');
			epoint.showTips('开始时间不能大于结束时间！', {
				state: 'warning'
			});
		});

		// 窗口大小改变时动态调整头部分类更多的显示
		$(win).on('resize', function () {
			adjustCategoryWidth();
		});
	};
	var tip = new mini.PanelTip();
	tip.set({
		url: epoint.dealRestfulUrl('fullsearchaction/getUserInfoUrl'),
		tplUrl: "./usercard.tpl",
		cssUrl: "./css/usercard.css",
		onbeforeopen: function (e) {
			e.data.guid = $(e.element).closest('.user-item').data('usergiud');
			// console.log(e,$(e.element).closest('.user-item'));
		}
	});
	// 用户点击事件
	$('body').on('click', '.sublist-item.user-item', function () {

		tip.open($(this).find('.user-portrait')[0]);

	}).on('click', function (e) {
		if (!$(e.target).closest('.user-item').length) {
			tip.hide();
		}
	}).on('click', '.sublist-item.user-item .user-actions > span', function (e) {
		e.stopPropagation();
		tip.hide();
		var $this = $(this),
			$user = $this.closest('.sublist-item.user-item'),
			guid = $user.data('usergiud'),
			action = $this.attr('class');
		try {
			switch (action) {
				case 'mail':
					// 邮件
					break;
				case 'msg':
					if (top !== window) {
						top.OpenEMsg(guid);
					} else {
						throw new Error('必须在主界面中才能使用聊天');
					}
					// 消息
					break;
				case 'sms':
					// 短信
					break;
				default:
					break;
			}
		} catch (error) {
			console.error(error);
		}
	});

	// 时间选项值改变
	time.on("valuechanged", function (e) {
		if (this.getValue() == "custom") {
			$('#time_range').removeClass("hidden");
		} else {
			$('#time_range').addClass("hidden");
		}
	});

	// 初始化时间时，将自定义时间选项隐藏
	var initTimeRange = function () {
		$('#time_range').addClass("hidden");
	};

	// 加载分类
	// getCategoryData();
	// initScroll([$grid, $riList]);
	initEvent();
	initTimeRange();

	var onPageChanged = function (e) {
		searchForm.pageIndex = e.pageIndex;
		searchForm.pageSize = e.pageSize;
		// 非第一页无须插入
		searchData(e.pageIndex !== 0, {
			pageIndex: e.pageIndex,
			pageSize: e.pageSize
		});
	};

	win.onPageChanged = onPageChanged;
	win.getCategoryData = getCategoryData;

	getCategoryData();
})(this, jQuery);