(function(win, $) {
    var $wizardBar = $("#wizard-bar"),
        $wizardNav = $("#wizard-nav");
    
    mini.parse($wizardNav[0]);
    var $wizardItems;

    // 导航按钮
    var nextBtn = mini.getAndCreate($(".next", $wizardNav)[0]),
        prevBtn = mini.getAndCreate($(".prev", $wizardNav)[0]),
        finishBtn = mini.getAndCreate($(".finish", $wizardNav)[0]);

    // var $navNext = $(".next", $wizardNav),
    //     $navPrev = $(".prev", $wizardNav),
    //     $navFinish = $(".finish", $wizardNav);

	var $iframe = $('#wizard-iframe');

    var M = Mustache,
        flowTempl = $.trim($("#flow-item-templ").html());

    var $wizardList = $(".wizard-list", $wizardBar),
        $wizardLisWrap = $(".wizard-list");

    // 流程项类
    var Flow = function(data) {
        var prop;

        for (prop in data) {

            if (prop == "status") {
                if (data["status"] == "disabled") {
                    this._disabled = 1;
                }
            } else {
                this["_" + prop] = data[prop];
            }
        }
    };

    // 外部只能读，不能修改的属性
    Flow._readyOnlyProps = ["code", "name", "title"];
    
    var $flow;

	$.extend(Flow.prototype, {
        // 下一个流程实例
        next: function() {
            return this.isLast() ? null : flowArr[this._index + 1];
        },

        // 上一个流程实例
        prev: function() {
            return this.isFirst() ? null : flowArr[this._index - 1];
        },

        // 获取顺序索引
        getIndex: function() {
            return this._index;
        },

        // 是否为第一个
        isFirst: function() {
            return this._index == 0;
        },

        // 是否为最后一个
        isLast: function() {
            return this._index == Flow._length - 1;
        },

        // 失效
        disable: function() {
            this._disabled = 1;

            $flow = get$flowByIndex(this._index);

			$flow.removeClass("default done active error").addClass("disabled");
			
			// // Force IE8 redraw :before/:after pseudo element
			// Util.redrawPseudoEl($flow[0]);
        },

        // 起动
        enable: function() {
            this._disabled = 0;

            $flow = get$flowByIndex(this._index);

			$flow.removeClass("disabled active default error").addClass("done");
			
			// // Force IE8 redraw :before/:after pseudo element
			// Util.redrawPseudoEl($flow[0]);
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
            this._setData("url", url);
        },

        // 设置流程数据
        _setData: function(prop, val) {
            if ($.inArray(prop, Flow._readyOnlyProps) == -1) {
                this["_" + prop] = val;

                flowData[this._index][prop] = val;
            }
        },

        // 标记为当前
        _active: function() {
            var idx = this._index,
                $flow = get$flowByIndex(idx);

            $flow
                .removeClass("default done disabled error")
                .addClass("active")
                .siblings(".wizard-item")
                .removeClass("active");

			$iframe[0].src = Util.getRightUrl(this._url);

			activeIndex = idx;
			
			// // Force IE8 redraw :before/:after pseudo element
			// Util.redrawPseudoEl($flow[0]);
			// Util.redrawPseudoEl($sibling[0]);
        },

        // 标记为错误
        _error: function() {
            var $flow = get$flowByIndex(this._index);

			$flow.removeClass("default active disabled done").addClass("error");

			// Force IE8 redraw :before/:after pseudo element
			Util.redrawPseudoEl($flow[0]);
        },

        // 标记为已完成
        _done: function() {
            var $flow = get$flowByIndex(this._index);

			$flow.removeClass("default active disabled error").addClass("done");
			
			// // Force IE8 redraw :before/:after pseudo element
			// Util.redrawPseudoEl($flow[0]);
        }
    });

    function activeNext() {
        var $wizardItem = $(".wizard-item");
        $.each($wizardItem, function() {
            var $this = $(this);
            if (
                $this.hasClass("active") &&
                $this.next().hasClass("done") &&
                !$this.hasClass("has-active")
            ) {
                $this.addClass("has-active");
            }
            if (
                $this.hasClass("error") &&
                $this.next().hasClass("done") &&
                !$this.hasClass("has-error")
            ) {
                $this.addClass("has-error");
            }
            if ($this.hasClass("done") && $this.next().hasClass("default")) {
                $this.addClass("not-done");
            } else {
                $this.removeClass("not-done");
            }
            if ($this.hasClass("active")) {
                $wizardLisWrap.animate({
                    scrollLeft: $this[0].offsetLeft - 250
                });
            }
        });
    }

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

            if (!view.title) {
                view.title = flow.name;
            }

            if (i == data.length - 1) {
                view.isLast = true;
            }

            // 初始化当前项索引
            if (activeIndex === null && flow.status == "active") {
                activeIndex = i;
            }

            html.push(M.render(flowTempl, view));

            flow.index = i;

            // 缓存流程对象
            flowArr.push(new Flow(flow));
        });

        $wizardList.html(Util.clearHtml(html.join("")));

        // 设置平分布局
        var $wizarditem = $('.wizard-item', $wizardList),
            itemNum = $wizarditem.length,
            itemWidth = 100 / itemNum + '%';
        $.each($wizarditem, function () {
            $(this).css('width', itemWidth);
        });
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
        $wizardItems = $wizardList.find(".wizard-item");

        // 初始化回调
        if (WizardNav.onInit) {
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
            type: "POST",
            dataType: "json",
            url: Util.getRightUrl(WizardNav.loadUrl),
            data: params,
            success: function(data) {
                if (data && data.length) {
                    initWizard(data);
                }
                WizardNav.onLoad && WizardNav.onLoad();

                // 左侧增加虚拟滚动条
                if (Util.browsers.isIE) { 
                    Util.loadJs('frame/fui/js/widgets/jquery.nicescroll.min.js', function() {
                        $wizardLisWrap.niceScroll({
                            // touchbehavior: true, // 激活拖拽滚动
                            cursorcolor: "rgba(0,0,0,0)",
                        });
                    });
                } else {
                    $wizardLisWrap.css({
                        width: '100%',
                        overflow: 'auto'
                    });
                }
				WizardNav.onLoad && WizardNav.onLoad();
            },
            error: Util._ajaxErr
        });
    };

    // 重置导航按钮状态
    var resetNavBtns = function() {
        prevBtn.enable();
        // $navPrev.removeClass("disabled");

        nextBtn.enable();
        nextBtn.show();
        // $navNext.removeClass("disabled");
        // $navNext.removeClass("hidden");

        finishBtn.hide();
        // $navFinish.addClass("hidden");
    };

    // 初始化|点击流程项时，用于调整导航按钮状态
    var adjustNavBtnsByIndex = function(index) {
        var flow = flowArr[index];

        // 重置导航按钮
        resetNavBtns();

        if (flow.isFirst() || flow.prev()._disabled) {
            prevBtn.disable();
            // $navPrev.addClass("disabled");
        }

        if (flow.isLast()) {
            nextBtn.hide();
            // $navNext.addClass("hidden");

            finishBtn.show();
            // $navFinish.removeClass("hidden");
        }
    };

    finishBtn.on('click', function() {
        var callback = WizardNav.onStepChange,
            curFlow = flowArr[activeIndex];
        if (callback) {
            $.proxy(callback, this, "over", curFlow)();
        }

    });
    nextBtn.on('click', function(){
        handleBtnClick(true);
    });
    prevBtn.on('click', function(){
        handleBtnClick();
    });

    var handleBtnClick = function (isNext) {
        var rt = 1,
            // 当前流程
            curFlow = flowArr[activeIndex],
            // 用户回调
            callback = win.WizardNav.onStepChange,

             // 相关流程（上一步|下一步）
            flow = flowArr[isNext ? activeIndex + 1 : activeIndex - 1];

        if (callback) {
            rt = $.proxy(callback, this, isNext ? "next" : "prev", curFlow)();
        }

        if(rt && typeof rt.then === 'function') {
            rt.done(function(){
                // 下一步
                activeNextFlow();
            })
            .fail(function(){
                // 出错，终止步骤切换
                curFlow._error();
            });
        } else if (rt === false) {
            // 回调返回false，则终止步骤切换
            curFlow._error();
        } else {
            // 下一步
            activeNextFlow();
        }
       
        function activeNextFlow() {
            // 重置导航按钮
            resetNavBtns();

            // 1.相关流程是第一个
            // 2.点击下一步（下一步即为相关流程），当前的失效
            // 3.点击上一步（上一步即为相关流程），相关流程前一个流程失效
            if (flow.isFirst() ||
                (curFlow._disabled && isNext) ||
                (flow.prev()._disabled && !isNext)
            ) {
                prevBtn.disable();
                // $navPrev.addClass("disabled");
            }

            if (flow.isLast()) {
                nextBtn.hide();
                // $navNext.addClass("hidden");

                finishBtn.show();
                // $navFinish.removeClass("hidden");
            }

            if (!curFlow._disabled) {
                curFlow._done();
            }

            flow._active();
            activeNext();
        }
       
    };
    // 处理流项点击
    $wizardList.on("click", ".done", function(event) {
        event.preventDefault();

        var $el = $(this),
            index = Util.toInt($el.data("index"));

        if ($el.hasClass("disabled")) return;

        var curFlow = flowArr[activeIndex],
            flow = flowArr[index];

        curFlow._done();
        flow._active();

        adjustNavBtnsByIndex(index);

        // 点击流程项的回调
        if (WizardNav.onFlowClick) {
            $.proxy(WizardNav.onFlowClick, this, flow)();
        }
        activeNext();
    });

    getFlowData();
})(this, jQuery);
