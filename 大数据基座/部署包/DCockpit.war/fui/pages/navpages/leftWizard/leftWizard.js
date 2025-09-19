(function(win, $) {
	var $wizardBar = $('#wizard-bar'),
		$wizardNav = $('#wizard-nav');

	var $wizardItems;

	// 导航按钮
	var $navNext = $('.next', $wizardNav),
		$navPrev = $('.prev', $wizardNav),
		$navFinish = $('.finish', $wizardNav);

	var $iframe = $('#wizard-iframe');

	var M = Mustache,
		flowTempl = $.trim($('#flow-item-templ').html());

	var $wizardList = $('.wizard-list', $wizardBar);

	// 流程项类
	var Flow = function(data) {
		var prop;

		for(prop in data) {

			if(prop == 'status') {
				if(data['status'] == 'disabled') {
					this._disabled = 1;
				}
			} else {
				this['_' + prop] = data[prop];
			}
		}
	};
	
	// 外部只能读，不能修改的属性
	Flow._readyOnlyProps = ['code', 'name', 'title'];

	$.extend(Flow.prototype, {
		// 下一个流程实例
		next: function() {
			return this.isLast() ?
				null : flowArr[this._index + 1];
		},
		
		// 上一个流程实例
		prev: function() {
			return this.isFirst() ?
				null : flowArr[this._index - 1];
		},
		
		// 获取顺序索引
		getIndex: function() {
			return this._index;
		},
		
		// 是否为第一个
		isFirst: function() {
			return (this._index == 0);
		},
		
		// 是否为最后一个
		isLast: function() {
			return (this._index == Flow._length - 1);
		},
		
		// 失效
		disable: function() {
			this._disabled = 1;

			$flow = get$flowByIndex(this._index);

			$flow.removeClass('default done active error')
				.addClass('disabled');
		},
		
		// 起动
		enable: function() {
			this._disabled = 0;

			$flow = get$flowByIndex(this._index);

			$flow.removeClass('disabled active default error')
				.addClass('done');
		},
		
		// 是否失效
		isDisabled: function() {
			return !!this._disabled;
		},

		// 获取流程数据
		getData: function() {
			return $.extend({}, flowData[this._index]);
		},
		
		// 设置流程对应url
		setUrl: function(url) {
			this._setData('url', url);
		},

		// 设置流程数据
		_setData: function(prop, val) {
			if($.inArray(prop, Flow._readyOnlyProps) == -1) {
				this['_' + prop] = val;

				flowData[this._index][prop] = val;
			}
		},

		// 标记为当前
		_active: function() {
			var idx = this._index,
				$flow = get$flowByIndex(idx);

			$flow.removeClass('default done disabled error')
				.addClass('active')
				.siblings('.wizard-item')
				.removeClass('active');

			$iframe[0].src = Util.getRightUrl(this._url);

			activeIndex = idx;
		},

		// 标记为错误
		_error: function() {
			var $flow = get$flowByIndex(this._index);

			$flow.removeClass('default active disabled done')
				.addClass('error');
		},

		// 标记为已完成
		_done: function() {
			var $flow = get$flowByIndex(this._index);

			$flow.removeClass('default active disabled error')
				.addClass('done');
		}
	});

	// 流程项缓存
	var flowArr = [],
		flowData = [],

		activeIndex = null;

	var renderFlows = function(data) {
		var html = [];

		Flow._length = data.length;

		$.each(data, function(i, flow) {
			var view = $.extend({}, flow);

			view.index = i;
			
			if(!view.title) {
				view.title = flow.name;
			}

			if(i == data.length - 1) {
				view.isLast = true;
			}

			// 初始化当前项索引
			if(activeIndex == null && flow.status == 'active') {
				activeIndex = i;
			}

			html.push(M.render(flowTempl, view));

			flow.index = i;

			// 缓存流程对象
			flowArr.push(new Flow(flow));
		});

		$wizardList.html(Util.clearHtml(html.join('')));
	};

	var get$flowByIndex = function(i) {
		return $wizardItems.eq(i);
	};

	// 初始化向导
	var initWizard = function(data) {
		// 缓存流程数据
		flowData = data;

		// 渲染流程项
		renderFlows(data);

		// 缓存流程dom
		$wizardItems = $wizardList.find('.wizard-item');
		
		// 初始化回调
		if(WizardNav.onInit) {
			$.proxy(WizardNav.onInit, win, flowArr[activeIndex])();
		}

		// 初始化内容页
		$iframe[0].src = Util.getRightUrl(data[activeIndex].url);

		// 初始化导航按钮
		adjustNavBtnsByIndex(activeIndex);
	};

	// 获取流程数据
	var getFlowData = function() {
		var params = $.extend({
			query: 'init-wizard'
		}, WizardNav.params);

		Util.ajax({
			type: 'POST',
			dataType: 'json',
			url: Util.getRightUrl(WizardNav.loadUrl),
			data: params,
			success: function(data) {
				if(data && data.length) {
					initWizard(data);
				}
				
				// 左侧增加虚拟滚动条
	            Util.loadJs('fui/js/lib/jquery.nicescroll.min.js', function() {
	                $wizardBar.niceScroll({cursorcolor: '#666'});
	            });
			},
			error: Util._ajaxErr
		});
	};

	// 重置导航按钮状态
	var resetNavBtns = function() {
		$navPrev.removeClass('disabled');

		$navNext.removeClass('disabled');
		$navNext.removeClass('hidden');

		$navFinish.addClass('hidden');
	};
 
 	// 初始化|点击流程项时，用于调整导航按钮状态
	var adjustNavBtnsByIndex = function(index) {
		var flow = flowArr[index];

		// 重置导航按钮
		resetNavBtns();

		if(flow.isFirst() || flow.prev()._disabled) {
			$navPrev.addClass('disabled');
		} 

		if(flow.isLast()) {
			$navNext.addClass('hidden');
			$navFinish.removeClass('hidden');
		}
	};

	// 流程导航处理
	$wizardNav.on('click', '.wizard-step', function(event) {
		event.preventDefault();

		var $el = $(this),
			isNext = $el.hasClass('next') ? 1 : 0;

		// 失效的话，不做处理
		if($el.hasClass('disabled')) return;

		var rt = 1,
			// 当前流程
			curFlow = flowArr[activeIndex],
			// 用户回调
			callback = WizardNav.onStepChange;

		// 若点击'结束'按钮，则只执行回调
		if($el.hasClass('finish')) {
			callback && $.proxy(callback, this, 'over', curFlow)();
			return;
		}

		if(callback) {
			rt = $.proxy(callback, this, (isNext ? 'next' : 'prev'), curFlow)();
		}

		// 回调返回false，则终止步骤切换
		if(rt === false) {
			curFlow._error();
			return;
		}	
		
		// 相关流程（上一步|下一步）
		var flow = flowArr[isNext? (activeIndex + 1) : (activeIndex - 1)];

		// 重置导航按钮
		resetNavBtns();
		
		// 1.相关流程是第一个
		// 2.点击下一步（下一步即为相关流程），当前的失效
		// 3.点击上一步（上一步即为相关流程），相关流程前一个流程失效	
		if(flow.isFirst() 
			|| curFlow._disabled && isNext
			|| flow.prev()._disabled && !isNext) {

			$navPrev.addClass('disabled');
		} 

		if(flow.isLast()) {
			$navNext.addClass('hidden');
			$navFinish.removeClass('hidden');
		} 

		if(!curFlow._disabled) {
			curFlow._done();
		}

		flow._active();
	});

	// 处理流项点击
	$wizardList.on('click', '.done', function(event) {
		event.preventDefault();

		var $el = $(this),
			index = Util.toInt($el.data('index'));

		if($el.hasClass('disabled')) return;

		var curFlow = flowArr[activeIndex],
			flow = flowArr[index];
		
		curFlow._done();
		flow._active();

		adjustNavBtnsByIndex(index);
		
		// 点击流程项的回调
		if(WizardNav.onFlowClick) {
			$.proxy(WizardNav.onFlowClick, this, flow)();
		}
	});

	getFlowData();

}(this, jQuery));