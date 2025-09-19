/**
 * ! 数据集成-数据源配置 date:2019-09-20 author: [xulb];
 */
(function(win, $) {
	var temp = $("#temp").html(), temp1 = $("#temp1").html(), temp2 = $("#temp2")
			.html(), $sqlList = $(".sql-list"), $dataChoose = $("#data-choose"), $key = $("#searchDataSourceName"),
	// $key2 = $("#searchNodeName"),
	$searchBtn = $(".search-button"), $pager = $("#page");

	// $("#data-choose").chosen({
	// disable_search: true,
	// placeholder_text_single: '请选择数据源类型'
	// }).change(function (event, opt) {
	// param.type = opt.selected;
	// });

	$(".data-content").niceScroll('.sql-list', {
		cursorcolor : "#ccc",
		cursorwidth : "6px",
		cursorborder : "none",
		bouncescroll : false,
		zindex : 9999,
		horizrailenabled : false
	});

	var $jsContent = $('.js-content');
	function RequestData(id) {
		param.belongouguid = id;

		$.ajax({
			url : interfaceName,
			dataType : "JSON",
			type : "POST",
			data : param,
			success : function(data) {
				data = data.custom;
				param.total = data.total;
				$sqlList.html(Mustache.render(temp, data));
				$(".tab").Tab();
				onPageChanged();
				if(data.total === 0) {
					$jsContent.addClass('nodata');
				} else {
					$jsContent.removeClass('nodata');
				}
				
				$(".data-content").getNiceScroll().resize();
				$(".data-content").scrollTop(0);

				$('.edit-icon').on("click", function(event) {
					$parent = $(this).closest(".sql-item");
					var id = $parent.data("id");
					editDataSource(id);
				});

				$('.copy-icon').on("click", function(event) {
					$parent = $(this).closest(".sql-item");
					var id = $parent.data("id");
					copyDataSource(id);
				});

				$('.delete-icon').on("click", function(event) {
					$parent = $(this).closest(".sql-item");
					var id = $parent.data("id");
					deleteDataSource(id);
				});

				$('.change-icon').on("click", function(event) {
					$parent = $(this).closest(".sql-item");
					var id = $parent.data("id");
					changetmp(id);
				});

				$('.detail-icon').on("click", function(event) {
					$parent = $(this).closest(".sql-item");
					var id = $parent.data("id");
					opendetail(id);
				});
			}
		});
	}

	function RequestSourceTypeData() {
		$.ajax({
			url : interfaceSourceTypeName,
			dataType : "JSON",
			type : "POST",
			success : function(data) {
				data = data.custom;
				$dataChoose.html(Mustache.render(temp1, data));
				$dataChoose.chosen({
					disable_search : true,
					placeholder_text_single : '请选择数据源类型'
				}).change(function(event, opt) {
					param.type = opt.selected;
					mini.get('dataSourceType').setValue(opt.selected);
				});

				// $dataChoose.val('').trigger("chosen:updated");
			}
		});
	}

	/*
	 * function RequestNodeNameData() { $.ajax({ url: interfaceNodeName,
	 * dataType: "JSON", type: "POST", success: function (data) { data =
	 * data.custom; $key2.html(Mustache.render(temp2, data)); $key2.chosen({
	 * disable_search: true, placeholder_text_single: '请选择所属节点'
	 * }).change(function (event, opt) { param.nodename = opt.selected;
	 * mini.get('searchNodeName').setValue(opt.selected); }); //
	 * $dataChoose.val('').trigger("chosen:updated"); } }); }
	 */

	function bindEvent() {
		// 移入移出
		$sqlList
				.on(
						"mouseenter",
						".sql-item>a",
						function() {
							var that = $(this), $icon = that.find(".sql-icon"), src = $icon
									.attr('src'), srcArray = src.split("."), activesrc = srcArray[0]
									+ '-active.' + srcArray[1];
							$icon.attr('src', activesrc);

						})
				.on(
						"mouseleave",
						".sql-item>a",
						function() {
							var that = $(this), $icon = that.find(".sql-icon"), src = "images/"
									+ $icon.data("src");
							$icon.attr('src', src);
						});

		// 点击搜索
		$searchBtn.on("click", function() {
			param.keywords = $.trim($key.val());
			// param.nodename = $.trim($key2.val());
			param.pageIndex = 0;
			mini.get('dataSourceName').setValue($.trim($key.val()));
			// mini.get('nodeName').setValue($.trim($key2.val()));
			var node = mini.get('tree').getSelectedNode();
			var belongouguid;
			if (node && 'f9root' != node.id) {
				belongouguid = node.id;
            }
			RequestData(belongouguid);
			epoint.refresh([ 'datagrid', 'fui-form' ]);
		});

		// 关键词
		$key.on("keyup", function(event) {
			if (event.keyCode == "13") {
				param.pageIndex = 0;
				param.keywords = $.trim($key.val());
				// param.nodename = $.trim($key2.val());
				RequestData();
				mini.get('dataSourceName').setValue($.trim($key.val()));
				// mini.get('nodeName').setValue($.trim($key2.val()));
				epoint.refresh([ 'datagrid', 'fui-form' ]);
			}
		});

		// $key2.on("keyup", function (event) {
		// if (event.keyCode == "13") {
		// param.pageIndex = 0;
		// param.keywords = $.trim($key.val());
		// //param.nodename = $.trim($key2.val());
		// RequestData();
		// mini.get('dataSourceName').setValue($.trim($key.val()));
		// //mini.get('nodeName').setValue($.trim($key2.val()));
		// epoint.refresh([ 'datagrid', 'fui-form' ]);
		// }
		// });

	}

	// 渲染分页
	function onPageChanged() {
		mini.get('page').update(param.pageIndex,param.pageSize,param.total);
		mini.get('page').setSizeList([12,16,20,24]);
		/*if ($pager.pagination()) {
			$pager.pagination('setPageIndex', param.pageIndex);
			$pager.pagination('setPageSize', param.pageSize);
			$pager.pagination('render', param.total);
		} else {
			// 默认渲染第一个
			$pager.pagination({
				pageIndex : param.pageIndex,
				pageSize : param.pageSize,
				totalCount : param.total,
				pageBtnCount : 8,
				firstBtnText : "&lt;",
				lastBtnText : "&gt;",
				showInfo : false,
				showJump : true,
				showPageSizes : true,
				pageSizeItems : [ 12, 16, 20, 24 ],
				// prevBtnText: '&laquo;',
				// nextBtnText: '&raquo;',
				pageElementSort : [ '$page', '$size', '$jump' ]
			});
			$pager.on("pageClicked", function(event, data) {
				param.pageIndex = data.pageIndex;
				param.pageSize = data.pageSize;
				RequestData();
			}).on('pageSizeChanged', function(event, data) {
				param.pageIndex = data.pageIndex;
				param.pageSize = data.pageSize;
				RequestData();
			}).on('jumpClicked', function(event, data) {
				param.pageIndex = data.pageIndex;
				param.pageSize = data.pageSize;
				pagechanged(update(param.pageIndex,param.pageSize,param.total));
				
			});
		}*/
	}

	function initPage() {
		RequestData();
		// RequestNodeNameData();
		RequestSourceTypeData();
		bindEvent();
	}

	initPage();

	win.RequestData = RequestData;
})(this, jQuery);