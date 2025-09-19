/**
 * ! [新点智能应用分析平台] date:2018-09-29 author: [xlb];
 */

$(function() {
	$(".error-box").niceScroll({
		cursorcolor : "#8e80e6",
		cursorwidth : '7px',
		cursorborder : '0px',
		cursorborderradius : '8px'
	});

	$("#tab-hd").niceScroll({
		cursorcolor : "#8e80e6",
		cursorwidth : '7px',
		cursorborder : '0px',
		cursorborderradius : '8px'
	});

	var apiData = {
		date : [],
		value : []
	};
	// api
	var apiLine = echarts.init(document.getElementById("grid-line")),
	// 使用率
	usage = echarts.init(document.getElementById("usage"));

	// 初始化

	var dataArray = [ {
		name : "CPU使用率",
		value : 0
	}, {
		name : "内存使用率",
		value : 0
	}, {
		name : "磁盘使用率",
		value : 0
	} ];

	var nodeinfoArray  = "";
	var init = function() {
		window.parent.epoint.execute("firstpagedetailaction.initUsage", null, null, function(ret) {
			 nodeinfoArray = ret.nodeinfo;
			for (var i = 0; i < nodeinfoArray.length; i++){
				if (i == 0) {
					document.getElementById('nodelst').innerHTML += "<li class=\"clearfix active\" id=\"tab"+(i+1)+"\" onclick=\"changetab(" + (i + 1) + ")\")><span class=\"node-name\">" + "节点" + (i + 1)
							+ "</span> <span class=\"ip-code\">" + nodeinfoArray[i].ip + "</span></li>";
					dataArray = [];
					var Obj = {};
					Obj.name = "CPU使用率";
					if (nodeinfoArray[i].cpu) {
						Obj.value = nodeinfoArray[i].cpu;
					} else {
						Obj.value = "0";
					}
					dataArray.push(Obj);
					var Obj2 = {};
					Obj2.name = "内存使用率";
					if (nodeinfoArray[i].mem) {
						Obj2.value = nodeinfoArray[i].mem;
					} else {
						Obj2.value = "0";
					}
					dataArray.push(Obj2);
					var Obj3 = {};
					Obj3.name = "磁盘使用率";
					if (nodeinfoArray[i].disk) {
						Obj3.value = nodeinfoArray[i].disk;
					} else {
						Obj3.value = "0";
					}
					dataArray.push(Obj3);
					initUsage(dataArray);
				} else {
					document.getElementById('nodelst').innerHTML += "<li class=\"clearfix\" id=\"tab"+(i+1)+"\" onclick=\"changetab(" + (i + 1) + ")\")><span class=\"node-name\">" + "节点" + (i + 1) + "</span> <span class=\"ip-code\">" + nodeinfoArray[i].ip
							+ "</span></li>";
				}
			}
			
			// 初始化api调用次数详情
			var apiDataJson =ret.apiinfo;
			  $.each(apiDataJson,function(i,item) {
				  apiData.value.push(item.value);
				  apiData.date.push(item.date.substring(8, item.date.length) + "日"); 
			});
				  initApiLine(apiData, apiDataJson);
			
		});

		/*
		 * $.ajax({ url: "mockUrl", dataType: "JSON", success: function(data) {
		 * 
		 * $.each(data.apiData,function(i,item) {
		 * apiData.value.push(item.value);
		 * apiData.date.push(item.date.substring(8, item.date.length) + "日"); })
		 * 
		 * initApiLine(apiData, data.apiData);
		 * 
		 * initUsage(data.usageData); } });
		 */
	};

	 window.changetab = function(index) {
		var allli = document.getElementById("nodelst").getElementsByTagName("li");
		for (var i = 0; i < allli.length; i++) {
			allli[i].setAttribute("class", "clearfix");
		}
		document.getElementById("tab" + index).setAttribute("class", "clearfix active");

		dataArray = [];
		var Obj = {};
		Obj.name = "CPU使用率";
		if (nodeinfoArray[index-1].cpu) {
			Obj.value = nodeinfoArray[index-1].cpu;
		} else {
			Obj.value = "0";
		}
		dataArray.push(Obj);
		var Obj2 = {};
		Obj2.name = "内存使用率";
		if (nodeinfoArray[index-1].mem) {
			Obj2.value = nodeinfoArray[index-1].mem;
		} else {
			Obj2.value = "0";
		}
		dataArray.push(Obj2);
		var Obj3 = {};
		Obj3.name = "磁盘使用率";
		if (nodeinfoArray[index-1].disk) {
			Obj3.value = nodeinfoArray[index-1].disk;
		} else {
			Obj3.value = "0";
		}
		dataArray.push(Obj3);
		initUsage(dataArray);
	}
	
	init();

	// api
	function initApiLine(data, origin) {
		apiLine.setOption({

			tooltip : {
				trigger : 'axis',
				formatter : function(para) {
					var value = origin[para[0].dataIndex].date + "<br/>" + "api调用次数" + "：" + para[0].value;
					return value;
				}
			},
			grid : {
				left : '3%',
				right : '3%',
				bottom : '3%',
				top : '12%',
				containLabel : true
			},
			xAxis : {
				type : 'category',
				axisTick : {
					show : false
				},
				axisLine : {
					show : false
				},
				axisLabel : {
					color : "#fff",
					fontSize : 13
				},
				splitLine : {
					show : false
				},
				boundaryGap : true,
				data : data.date
			},
			yAxis : {
				type : 'value',
				axisTick : {
					show : false
				},
				axisLine : {
					show : false
				},
				splitLine : {
					show : true,
					lineStyle : {
						type : "dash",
						color : "#496b92"
					}
				},
				splitArea : {
					show : true,
					areaStyle : {
						color : [ 'rgba(29,39,48,.1)', 'rgba(255,255,255,0)' ]
					}
				},
				axisLabel : {
					color : "#fff",
					fontSize : 13
				}
			},
			series : [ {
				name : "api调用次数",
				type : 'line',
				symbolSize : 6,
				areaStyle : {
					normal : {
						color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [ {
							offset : 0,
							color : 'rgba(30, 148, 228, 0.3)'
						}, {
							offset : 1,
							color : 'rgba(82, 191, 255, 0)'
						} ], false)
					}
				},
				lineStyle : {
					color : "#1e94e4"
				},
				itemStyle : {
					normal : {
						color : "#1e94e4"
					}
				},
				data : data.value
			} ]
		});
	}

	// 使用率
	function initUsage(data) {
		usage.setOption({
			series : [ {
				name : 'CPU使用率',
				type : 'gauge',
				center : [ '50%', '50%' ], // 默认全局居中
				z : 3,
				min : 0,
				max : 100,
				splitNumber : 10,
				radius : '92%',
				axisLine : { // 坐标轴线
					lineStyle : { // 属性lineStyle控制线条样式
						width : 15,
						color : [ [ 0.3, '#26a9ed' ], [ 0.7, '#2c65d1' ], [ 1, '#fa573d' ] ]
					}
				},
				axisTick : { // 坐标轴小标记
					length : 0, // 属性length控制线长
					lineStyle : { // 属性lineStyle控制线条样式
						color : 'auto'
					}
				},
				axisLabel : {
					textStyle : {
						color : "#97a7b7"
					}
				},
				splitLine : { // 分隔线
					length : 15, // 属性length控制线长
					lineStyle : { // 属性lineStyle（详见lineStyle）控制线条样式
						// color: 'auto',
						color : "#96b2e8"
					}
				},
				title : {
					fontSize : 14,
					color : '#fff',
					offsetCenter : [ 0, '96.5%' ],
				},
				detail : {
					textStyle : { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight : 'bolder'
					}
				},
				data : [ {
					value : data[0].value,
					name : data[0].name
				} ],
				detail : {
					formatter : '{value}%',
					fontSize : 18,
					fontWeight : 'bold',
					offsetCenter : [ 0, '65%' ]
				}
			}, {
				name : '内存使用率',
				type : 'gauge',
				center : [ '20%', '45%' ], // 默认全局居中
				radius : '80%',
				min : 0,
				max : 100,
				// endAngle: 45,
				splitNumber : 10,
				axisLine : { // 坐标轴线
					lineStyle : { // 属性lineStyle控制线条样式
						width : 10,
						color : [ [ 0.3, '#26a9ed' ], [ 0.7, '#2c65d1' ], [ 1, '#fa573d' ] ]
					}
				},
				axisTick : { // 坐标轴小标记
					length : 0, // 属性length控制线长
					lineStyle : { // 属性lineStyle控制线条样式
						color : 'auto'
					}
				},
				splitLine : { // 分隔线
					length : 5, // 属性length控制线长
					lineStyle : { // 属性lineStyle（详见lineStyle）控制线条样式
						color : "#96b2e8"
					}
				},
				axisLabel : {
					textStyle : {
						color : "#97a7b7"
					}
				},
				pointer : {
					width : 5
				},
				title : {
					fontSize : 14,
					color : '#fff',
					offsetCenter : [ 0, '123%' ], // x, y，单位px
				},
				detail : {
					textStyle : { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight : 'bolder'
					}
				},
				data : [ {
					value : data[1].value,
					name : data[1].name
				} ],
				detail : {
					formatter : '{value}%',
					fontSize : 18,
					fontWeight : 'bold',
					offsetCenter : [ 0, '85%' ]
				}
			}, {
				name : '磁盘使用率',
				type : 'gauge',
				center : [ '80%', '45%' ], // 默认全局居中
				radius : '80%',
				min : 0,
				max : 100,

				splitNumber : 10,
				axisLine : { // 坐标轴线
					lineStyle : { // 属性lineStyle控制线条样式
						width : 10,
						color : [ [ 0.3, '#26a9ed' ], [ 0.7, '#2c65d1' ], [ 1, '#fa573d' ] ]
					}

				},
				axisTick : { // 坐标轴小标记
					length : 0, // 属性length控制线长
					lineStyle : { // 属性lineStyle控制线条样式
						color : 'auto'
					}
				},
				axisLabel : {
					textStyle : {
						color : "#97a7b7"
					}
				},
				splitLine : { // 分隔线
					length : 5, // 属性length控制线长
					lineStyle : { // 属性lineStyle（详见lineStyle）控制线条样式
						color : "#96b2e8"
					}
				},
				pointer : {
					width : 5
				},
				title : {
					fontSize : 14,
					color : '#fff',
					offsetCenter : [ 0, '123%' ], // x, y，单位px
				},
				detail : {
					textStyle : { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight : 'bolder'
					}
				},
				data : [ {
					value : data[2].value,
					name : data[2].name
				} ],
				detail : {
					formatter : '{value}%',
					fontSize : 18,
					fontWeight : 'bold',
					offsetCenter : [ 0, '85%' ]
				}
			} ]
		});
	}

	$(window).on("resize", function() {
		if (t) {
			clearTimeout(t);
		}

		var t = setTimeout(function() {
			apiLine.resize();
			usage.resize();
		}, 200);
	});

	$("#tab").Tab({
		// tab切换之后的回调事件
		after : function($hd, $bd) {
			if ($hd.index() == 0) {
				usage.resize();
			}
		}
	});
})