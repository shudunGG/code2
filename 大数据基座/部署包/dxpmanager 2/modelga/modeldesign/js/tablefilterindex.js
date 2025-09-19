(function(win, $) {
	var ITEM_TPL = $.trim($("#filter-template").html()), UL_TPL = $.trim($("#filter-ul-template").html());

	var filterDataList = [ {
		"relate" : "",
		"list" : [ {
			"categoryVal" : "",
			"operateVal" : "",
			"beginTime" : "",
			"endTime" : "",
			"filterVal" : "",
			"filterField" : "",
			"relateVal" : ""
		} ]
	} ];

	var $filterData = $('#filter-data');

	// 为了代码清晰，此处监听多个class
	$filterData.on('click', '.filter-item-add', function() {
		var $this = $(this), $li = $this.parent().parent().parent(), $filterAdd = $li.siblings('.filter-add');

		$filterAdd.before(Mustache.render(ITEM_TPL, {
			filterField : "",
			categoryVal : "",
			operateVal : "1",
			beginTime : "",
			endTime : "",
			filterVal : "",
			relateVal : "1",
			first : false,
			showTime : true,
			hideAll : false,
			showFilterField : false
		}));
		mini.parse();
		var dateFields = eval('(' + selectData + ')');
		for (var j = 0, len = dateFields.length; j < len; j++) {
			dateFields[j]["text"] = dateFields[j]["text"]
			+ "("
			+ dateFields[j]["id"]
			+ ")";
		}
		mini.get("pinputds").setData(dateFields);
		mini.get("pinputds1").setData(dateFields);

	}).on('click', '.filter-item-min', function() {
		var $this = $(this), $li = $this.parent().parent().parent();

		$li.remove();
	}).on('click', '.filter-box-add', function() {
		var $this = $(this), $ul = $this.parent().parent().parent();

		var liStr = Mustache.render(ITEM_TPL, {
			categoryVal : "",
			operateVal : "1",
			beginTime : "",
			endTime : "",
			filterVal : "",
			relateVal : "1",
			first : true,
			showTime : true,
			hideAll : false,
			showFilterField : false
		})

		var ulItem = {
			first : false,
			filterItem : [ liStr ],
			relate : "1"
		}

		$filterData.append(Mustache.render(UL_TPL, ulItem));
		mini.parse();
		var dateFields = eval('(' + selectData + ')');
		for (var j = 0, len = dateFields.length; j < len; j++) {
			dateFields[j]["text"] = dateFields[j]["text"]
			+ "("
			+ dateFields[j]["id"]
			+ ")";
		}
		mini.get("pinputds").setData(dateFields);
		mini.get("pinputds1").setData(dateFields);

	}).on('click', '.filter-box-min', function() {
		var $this = $(this), $ul = $this.parent().parent().parent();

		$ul.remove();
	});

	win.valueChange = function(e) {
		console.log(e);
		var $parent = $(e.sender.el).parent(), val = e.value, $time = $parent.siblings('.filter-time'), $input = $parent.siblings('.filter-value'), $filterfield = $parent.siblings('.filter-dropdown');
		console.log(mini.get('pinputds'));
		if (val == '1') {
			// 日期范围
			$time.removeClass('hidden');
			$input.addClass('hidden');
			$filterfield.addClass('hidden');
		} else if (val == '8' || val == '9') {
			// 空值不显示
			$time.addClass('hidden');
			$input.addClass('hidden');
			$filterfield.addClass('hidden');
			e.cancel=true;
		} else if (val == '16' || val == '17' || val == '18' || val == '19' || val == '20' || val == '21'||val=='22'||val=='23'||val=='24'||val=='25'||val=='26'||val=='27') {
			// 字段选择
			$time.addClass('hidden');
			$input.addClass('hidden');
			$filterfield.removeClass('hidden');
		} else {
			// 其他
			$time.addClass('hidden');
			$filterfield.addClass('hidden');
			$input.removeClass('hidden');
		}
	}

	win.confirm = function() {
		var $ulList = $filterData.children();
		var collectData = [];

		$ulList.each(function(index, item) {
			// console.log(item);

			var $filterItem = $(item).children('.filter-item'), $boxRelateItem = mini.byClass('filter-relate-select', $(item).children('.filter-box-relate'));

			var itemList = [];
			$filterItem
					.each(function(m, el) {
						var $el = $(el), $filterCategory = mini.byClass('filter-category-select', $el), $filterOperate = mini.byClass('filter-operate-select', $el), $beginTime = mini.byClass(
								'begin-time', $el), $endTime = mini.byClass('end-time', $el), $filterValue = mini.byClass('filter-value-input', $el), $filterRelate = mini.byClass(
								'filter-relate-select', $el), $filterField = mini.byClass('filter-dropdown-select', $el);

						if (mini.get($filterCategory)) {
							var elData = {
								categoryVal : mini.get($filterCategory).getValue() || "",
								operateVal : mini.get($filterOperate).getValue() || "",
								beginTime : mini.get($beginTime).getFormValue() || "",
								endTime : mini.get($endTime).getFormValue() || "",
								filterVal : mini.get($filterValue).getValue() || "",
								relateVal : mini.get($filterRelate) && mini.get($filterRelate).getValue() || "",
								filterField : mini.get($filterField).getValue() || "",
							}
							if(elData.operateVal == 1 && elData.beginTime>elData.endTime){
								collectData.push('falg',false);
								return;
							}
							itemList.push(elData);
						}

					});

			if (index) {
				if ($boxRelateItem) {
					console.log($boxRelateItem);
					collectData.push({
						relate : mini.get($boxRelateItem).getValue() || "",
						list : itemList
					});
				}
			} else {
				collectData.push({
					relate : "",
					list : itemList
				});
			}
		})

		console.log("结果");
		console.log(collectData);
		console.log(JSON.stringify(collectData));
		return JSON.stringify(collectData);
	}

	win.cancel = function() {

	}

	// 渲染页面
	win.initHtml = function(data) {
		var ulStr = "";
        console(data);
		$(data).each(function(index, ul) {

			if (ul.relate) {

			}
			var liList = ul.list || [];
			var liStr = "";

			$(liList).each(function(m, li) {
				li['first'] = m ? false : true;
				if (li.operateVal == 8 || li.operateVal == 9) {
					li['hideAll'] = true;
					li['showTime'] = true;
					li['showFilterField'] = true;
				}

				if (li.operateVal == 16 || li.operateVal == 17 || li.operateVal == 18 || li.operateVal == 19 || li.operateVal == 20 || li.operateVal == 21||li.operateVal == 22||li.operateVal == 23||li.operateVal == 24||li.operateVal == 25||li.operateVal == 26||li.operateVal == 27) {
					li['showFilterField'] = true;
					li['hideAll'] = false;
				}
				if (li.operateVal == 1) {
					li['showTime'] = true;
					li['hideAll'] = false;
				}

				liStr += Mustache.render(ITEM_TPL, li);
			});

			ul['filterItem'] = liStr;

			ul['first'] = index ? false : true;

			ulStr += Mustache.render(UL_TPL, ul)
		});

		$filterData.html(ulStr);
	}
	var html = initHtml(filterDataList);

	mini.parse();

})(window, jQuery)