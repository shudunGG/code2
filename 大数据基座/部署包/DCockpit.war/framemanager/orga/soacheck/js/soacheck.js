(function(win, $) {
	// 设置当前页面 ajax 请求超时时间

	jQuery.support.cors = true; // IE下模拟请求报错 hack代码，正式环境删除

	$.ajaxSetup({
		timeout : soaConfig.timeout
	// 超时时间设置，单位毫秒
	});

	// 模板
	var TABLE_TPL = '{{#tables}}<table class="soa-table"><caption style="text-align: left">{{{title}}}</caption><tr class="soa-tr">{{#th}}<th class="td-width">{{{.}}}</th>{{/th}}</tr>{{#trs}}<tr class="soa-tr">{{#tds}}<td class="td-width">{{{.}}}</td>{{/tds}}</tr>{{/trs}}</table>{{/tables}}',
    soaItemTemp = $.trim($('#soa-item-template').html());

	// 头部
	var $soaHeader = $('#soa-header'), $soaLoadStatus = $('#soa-load-status'), $rightBtn = $('#right-btn'), $soaTitle = $('#soa-title'), $progress = $('#progress-bg'), $soaTotal = $('#soa-total'), $soaErrorNum = $('#soa-error-num'), $soaTime = $('#soa-time'), $soaLastError = $('#soa-last-error-num'), errorNum = 0, // 异常个数
	soaTitles = {
		start : [ 'SOA 智能检测', '一键检测' ],
		load : [ '正在进行检测', '取消检测' ],
		end : [ '检测完成', '重新检测' ],
		last : [ 'SOA 智能检测', '一键检测' ]
	},
	// 列表
	$soaList = $('#soa-list'), soaIds = [], idsLen = 0;

	/**
	 * 修改顶部状态
	 * 
	 * @param {}
	 *            opt 单个参数：start表示未开始，load表示进行中，end表示结束, last表示上一次 对象：{ status:
	 *            'start'/'load'/'end'/'last', current: 1, sum: 10 }
	 */
	var setLoadStatus = function(opt) {
		var status, _type = typeof opt;

		if (_type == 'string') {
			status = opt;
		} else if (_type == 'object') {
			status = opt.status;
		}

		var $soaStatus = $('.soa-' + status, $soaLoadStatus), $refreshBtn = $(
				'.item-refresh-btn', $soaList);

		if (status == 'load') {
			var _percent = Math.floor(Number(opt.current) / Number(opt.sum)
					* 100)
			$progress.css('width', _percent + '%');
			$refreshBtn.hide();
		} else {
			$refreshBtn.show();
		}

		if ($soaStatus.hasClass('hidden')) {
			$rightBtn.text(soaTitles[status][1]).removeClass(
					'start load end last').addClass(status);
			$soaTitle.text(soaTitles[status][0]);
			$soaStatus.removeClass('hidden').siblings().addClass('hidden');
		}
	}

	// 渲染列表
	var renderItem = function(list) {
		$soaList.html(Mustache.render(soaItemTemp, {
			list : list
		}));
	};

	// 渲染列表中的详情
	var renderItemDetail = function(type, data) {
		if (type == 'txt') {
			return data;
		} else if (type == 'table') {
			var renderData = data.length ?  {tables: data} : {tables: [data]}
            return Mustache.render(TABLE_TPL, renderData);
		}
	};

	var getListData = function() {
		Util.ajax({
			url : soaConfig.checkList
		}).done(function(res) {
			// console.log(res);

			var _list = res.list;

			// 获取列表ID数组
			for (var i = 0, len = _list.length; i < len; i++) {
				soaIds.push(_list[i].guid);
			}

			// console.log(soaIds);

			renderItem(_list);

			// 再次打开
			if (!res.isFirst) {
				setLoadStatus('last');
				$soaTime.text(res.checkTime);
				$soaLastError.text(res.errorNum);
				$(_list).each(function(index, item) {
					renderSingleItem(item);
				});
			} else {
				setLoadStatus('start');
			}
		});
	}

	getListData();

	// 单个检测时渲染结果
	var renderSingleItem = function(data) {
		// console.log(data);
		var $item = $('#soa-' + data.guid), _status = data.type || '';
		// console.log($item);
		$item
				.removeClass('status-success status-checking status-wait status-warning');

		if (data.type == 'warning') {
			errorNum++;
		}

		if (data.msgContent) {
			$item.addClass('problem');

			if ($item.parent().find('.item-detail').length) {
				$item.parent().find('.item-detail').html(
						renderItemDetail(data.msgType, data.msgContent));
			} else {
				$item.parent().append(
						'<div class="item-detail">'
								+ renderItemDetail(data.msgType,
										data.msgContent) + '</div>');
			}
			
			if(data.type == 'warning') { 
                $item 
                    .next() 
                    .slideDown(300) 
                    .end() 
                    .parent() 
                    .addClass('active'); 
            }

		}

		$item.addClass('status-' + _status);
	}

	// 检测前触发，重置状态为正在检测，后面的为等待检测
	// isSingle为true 表示单独检测，不需要重置后面的数据
	var beforeChecking = function(id, isSingle) {
		var $item = $('#soa-' + id), $siblingsItem = $item.parent().nextAll()
				.find('.item-title');

		$item
				.removeClass('problem status-success status-cheking status-wait status-warning');
		$item.addClass('status-checking');

		if (serialNum == 0 && !isSingle) {
			$siblingsItem
					.removeClass('problem status-success status-cheking status-wait status-warning');
			$siblingsItem.addClass('status-wait');
		}
	}

	// 列表项点击事件
	$soaList
			.on(
					'click',
					'.item-title',
					function() {
						var $this = $(this);

						if (!$this.hasClass('problem'))
							return false;

						$this.next().slideToggle(300).end().parent()
								.toggleClass('active');
					})
			.on(
					'click',
					'.item-refresh-btn',
					function(e) {
						var $this = $(this), $item = $this.parent().parent(), _id = $item
								.data('id');

						if (!$rightBtn.hasClass('load')) {
							checkItem(_id, true);
						} else {
							epoint.alert("正在检测，请取消检测或等待全部检测完后进行单项检测！", "",
									function() {
									}, "warning");
						}
						e.stopPropagation();
					});

	// 发起检测请求
	var serialNum = 0;
	var request;
	function checkItem(id, isSingle) {
		var _id = id;

		if (!id) {
			_id = soaIds[serialNum];
		}

		beforeChecking(_id, isSingle);

		request = $.ajax({
			type : 'post',
			url : domain + _id + "?isCommondto=true",
			data : {
				guid : _id
			}
		}).done(function(res) {
			// console.log(res);
			res = eval('(' + res + ')');
			res = res.custom;
			renderSingleItem(res.data);

			if (!isSingle) {
				var _num = ++serialNum;

				// console.log(_num);

				setLoadStatus({
					status : 'load',
					current : _num,
					sum : idsLen
				});

				if (_num < idsLen) {
					checkItem(soaIds[_num]);
				} else {
					// 检测结束
					$soaTotal.text(serialNum);
					$soaErrorNum.text(errorNum);
					setLoadStatus({
						status : 'end'
					});
				}
			}

		});
	}

	// 一键检测
	$soaHeader.on('click', '.right-btn', function() {
		var $this = $(this);

		idsLen = soaIds.length || 0;

		if (!$this.hasClass('load')) {

			serialNum = 0;
			errorNum = 0;
			setLoadStatus({
				status : 'load',
				current : 0,
				sum : idsLen
			});
			if (request) {
				request.abort();
				$('.item-title', $soaList).removeClass('status-checking');
			}

			checkItem();

		} else {
			mini.confirm("正在进行检测，是否确认要终止？", "确定？", function(action) {
				if (action == "ok") {
					if (request != null) {
						request.abort();
						$soaTotal.text(serialNum);
						$soaErrorNum.text(errorNum);

						// 重置正则检测项为等待检测
						var checkingId = soaIds[serialNum], $item = $('#soa-'
								+ checkingId);

						$item.removeClass('status-checking').addClass(
								'status-wait');
					}

					setLoadStatus({
						status : 'end'
					});
				} else {

				}
			});
		}
	});
})(window, jQuery);