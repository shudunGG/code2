/**
 * ! 数据开发概况 date:2019-09-18 author: huangweiping;
 */

(function(win, $) {
	// 省率号
	$(".step-info").ellipsis({
		row : 2
	});

	// 图表参数
	var param = {
		range : ""
	}, $datePick = $("#datePick"), $rangeList = $(".range-list");

	var surveyChart = echarts.init(document.getElementById("survey"));

	// 初始化图表
	function initChart() {
		var chartOption = {
			tooltip : {
				trigger : "axis",
				axisPointer : {
					type : "cross",
					label : {
						backgroundColor : "#6a7985"
					}
				}
			},
			legend : {
				data : [ "成功", "失败" ],
				top : 15,
				right : 16,
				icon : "rect",
				itemWidth : 14,
				itemHeight : 6,
				itemGap : 20,
				textStyle : {
					color : "#858585"
				}
			},
			grid : {
				left : 20,
				right : 20,
				top : "20%",
				bottom : "5%",
				containLabel : true
			},
			xAxis : [ {
				type : "category",
				boundaryGap : false,
				data : "",
				axisLabel : {
					show : true,
					textStyle : {
						color : "#abadab",
						fontSize : 12
					}
				},
				axisLine : {
					show : false
				},
				axisTick : {
					show : false
				}
			} ],
			yAxis : [ {
				name : "（次）",
				nameTextStyle : {
					fontSize : 12,
					color : "#858585",
					padding : [ 0, 0, 0, -25 ]
				},
				type : "value",
				axisLabel : {
					show : true,
					textStyle : {
						color : "#abadab",
						fontSize : 12
					}
				},
				splitLine : {
					show : true,
					lineStyle : {
						type : "dashed",
						color : "#eee"
					}
				},
				axisLine : {
					show : false
				},
				axisTick : {
					show : false
				}
			} ],
			series : [
					{
						type : "line",
						name : "成功",
						smooth : true,
						symbol : "none",
						itemStyle : {
							color : "#50b956",
							borderColor : "#50b956",
							borderWidth : 2
						},
						areaStyle : {
							normal : {
								color : new echarts.graphic.LinearGradient(0,
										0, 0, 1, [ {
											offset : 0,
											color : "rgba(80, 185, 86, .3)"
										}, {
											offset : 1,
											color : "rgba(80, 185, 86, 0)"
										// color: '#3fbbff0d'
										} ], false)
							}
						},
						data : []
					},
					{
						type : "line",
						name : "失败",
						smooth : true,
						symbol : "none",
						itemStyle : {
							color : "#eb6950",
							borderColor : "#eb6950",
							borderWidth : 2
						},
						areaStyle : {
							normal : {
								color : new echarts.graphic.LinearGradient(0,
										0, 0, 1, [ {
											offset : 0,
											color : "rgba(234, 100, 74,.3)"
										}, {
											offset : 1,
											color : "rgba(234, 100, 74,0)"
										// color: '#3fbbff0d'
										} ], false)
							}
						},
						data : []
					} ]
		};
		surveyChart.setOption(chartOption);
	}

	initChart();

	// 渲染概况
	function renderSurvey(data) {
		surveyChart.setOption({
			xAxis : {
				data : Util.getArrayData(data, "name")
			},
			series : [ {
				data : Util.getArrayData(data, "success")
			}, {
				data : Util.getArrayData(data, "fail")
			} ]
		});
	}

	/**
	 * 快速渲染数字
	 * 
	 * @param {String}
	 *            space 命名空间
	 * @param {Object}
	 *            data 数据
	 * @param {Boolean}
	 *            animate 是否动态加载效果
	 * @param {Function}
	 *            filterFn 过滤函数，处理渲染结果，比如加单位
	 */
	function renderNum(space, data, filterFn) {
		for ( var i in data) {
			if (Object.prototype.hasOwnProperty.call(data, i)) {
				var $dom = $("#" + space + "-" + i);
				if ($dom.length > 0) {
					$dom.text(filterFn ? filterFn(data[i]) : data[i]);
				}
			}
		}
	}

	// 滚动条
	$(".server-container").niceScroll(".server-list", {
		cursorcolor : "#d6d6d6",
		cursorwidth : "8px",
		cursorborder : "none",
		zindex : 9999,
		bouncescroll : false,
		horizrailenabled : false
	});

	// 初始化页面
	function initPage() {

		laydate.render({
			elem : "#datePick",
			range : true,
			trigger : "click",
			done : function(value, date, endDate) {
				param.range = value;
				$rangeList.find("li").removeClass("active");
				getData();
			}
		});

		$.each($(".date-item"), function(i, item) {
			if ($(item).hasClass("active")) {
				$datePick.val(Util.getNowFormatDate($(item).data("id")));
			}
		});

		// 点击切换
		$rangeList.on("click", "li", function() {
			var that = $(this), id = that.data("id");
			that.addClass("active").siblings().removeClass("active");
			param.range = id;
			mini.get('datePick').setValue(id);
			getData();

		});
	}

	initPage();

	// 获取执行情况图标数据
	function getData() {
		var datePick = mini.get('datePick').getValue();
		Util.ajax({
			url : getChartsData + "&datePick=" + datePick,
			dataType : 'json',
			type : 'post',
			data : param,
			success : function(data) {
				renderSurvey(data.surveyData);
			}
		});
	}

	// 初始化整个页面
	epoint.initPage(getAllData, "@all", function(data) {
		Util.hidePageLoading(); // 隐藏pageloading
		renderNum("situation", data); // 渲染执行情况

		// 渲染节点服务
		$.each(data.nodelist, function(i, item) {
			if (item.state == 0) {
				item.statename = "waring-box";
			}
		});
		var template = $("#server-temp").html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, {
			listData : data.nodelist
		});
		$("#server").html(rendered);

		// 渲染执行情况图表
		$("li[data-id='01']", $rangeList).trigger("click");
		
		renderServerInfo();
	}, function(data) {
		// fail
	});
	
	function renderServerInfo(){
		var serverList = $('#server');
		//获取子元素
		serverList.children().each(function(){
			var serverGuid = $(this).find('.serverguid').html();
			var cpuInfo = $(this).find('.server-cpu');
			var storageInfo = $(this).find('.server-storage');
			Util.ajax({
				url : getServerInfoData+"&serverGuid="+serverGuid,
				dataType : 'json',
				type : 'post',
				async : true,
				success : function(result) {
					cpuInfo.html('CPU：<span class="cpu-ratio">'+result.cpu+'</span>内存：<span>'+result.memory+'</span>');
					storageInfo.html('储存空间：<span>'+result.storage+'</span>');
				}
			});
		});
	}
})(this, jQuery);
