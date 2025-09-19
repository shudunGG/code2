/**!
 * 数据集成-概况
 * date:2019-09-18
 * author: [xulb];
 */
(function (win, $) {
    var storageCharts = echarts.init($("#stro-charts")[0]),
        fileCharts = echarts.init($("#file-charts")[0]),
        apiCharts = echarts.init($("#api-charts")[0]),
        kafkaCharts = echarts.init($("#kafka-charts")[0]),
        stroLine = echarts.init($(".stro-line")[0]),
        fileLine = echarts.init($(".file-line")[0]),
        apiLine = echarts.init($(".api-line")[0]),
        kafkaLine = echarts.init($(".kafka-line")[0]),
    	$mods = $("#mods"),
    	modTmpl = $("#mod-tmpl").html(),
        rendered;

    var param = {
            range: ''
        },
        $datePick = $("#datePick"),
        $rangeList = $(".range-list"),
        $error = $(".error"),
        $monitor = $(".monitor"),
        $mission = $(".mission"),
    	$mission2 = $(".mission2");

    // 渲染饼图
    function initPie(target, data, next) {
        target.setOption({
            title: {
                text: data.total==0 ? '0%' : (data.value * 100 / data.total).toFixed(0) + '%',
                textStyle: {
                    fontSize: 16
                },
                x: 'center',
                y: 'center'
            },
            tooltip: {
                trigger: 'item',
                position: ['80%', '0%'],
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [{
                name: '占比情况',
                type: 'pie',
                radius: ['65%', '83%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [{
                        value: data.value,
                        name: data.name,
                        itemStyle: {
                            color: "#38b03f"
                        }
                    },
                    {
                        value: data.total - data.value,
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                color: "#e5e5e5"
                            },
                            emphasis: {
                                color: "#e5e5e5"
                            }
                        },
                        name: '',
                        tooltip: {
                            show: false
                        }
                    }
                ]
            }]
        });

        next.html(data.value + '/' + data.total);
    }

    // 渲染折线图
    function initLine(target, data) {
        var name;
        var type = data.type;
        switch (type) {
			case 'stor':
				name = '库表（条）';
				break;
			case 'file':
				name = '文件（个）';
				break;
			case 'api':
				name = 'api（条）';
				break;
			case 'kafka':
				name = '消息（条）';
				break;
			default:
				break;
		}
        target.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    },
                },
                formatter: function (e) {
                    var name, unit;
                    var type = data.type;
                    switch (type) {
						case 'stor':
							name = '库表';
							unit = '条';
							break;
						case 'file':
							name = '文件';
							unit = '个';
							break;
						case 'api':
							name = 'api';
							unit = '条';
							break;
						case 'kafka':
							name = '消息';
							unit = '条';
							break;
						default:
							break;
					}
                    return name + '：' + e[0].value + unit;
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '15%',
                bottom: '5%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: data.name,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#abadab',
                        fontSize: 12,
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
            	name: name,
                nameTextStyle: {
                    fontSize: 12,
                    color: "#858585"
                },
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#abadab',
                        fontSize: 12,
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: '#eee'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }],
            series: [{
                type: 'line',
                smooth: true,
                symbol: [10, 15],
                itemStyle: {
                    color: "#50b956",
                    borderColor: "#50b956",
                    borderWidth: 2
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 0, [{
                                offset: 0,
                                color: 'rgba(80, 185, 86, .3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(80, 185, 86, 0)'
                                // color: '#3fbbff0d'
                            }
                        ], false),
                    }
                },
                data: data.value
            }]
        });
    }
    
    //今日、昨日、近一周
    function initLineChartsExecuteTYW(startdate, enddate) {
    	Util.ajax({
            url: epoint.dealRestfulUrl("../../rest/dxpnodegeneralaction/getLineInfo"),
            data: {startdate:startdate,enddate:enddate},
            async:true
        }).done(function (result) {
        	initLineCharts(result);
        });	
    }
    
    //本月、本年
    function initLineChartsExecuteMY(id) {
    	Util.ajax({
            url: epoint.dealRestfulUrl("../../rest/dxpnodegeneralaction/getLineInfoMY"),
            data: {activeId:id},
            async:true
        }).done(function (result) {
        	initLineCharts(result);
        });	
    }

    // 请求饼图数据
    function initPieCharts(data) {
    	initPie(storageCharts, data.storpie, $("#stro-percent"));
    	initPie(fileCharts, data.filepie, $("#file-percent"));
    	initPie(apiCharts, data.apipie, $("#api-percent"));
    	initPie(kafkaCharts, data.kafkapie, $("#kafka-percent"));
    }


    // 请求折线图数据
    function initLineCharts(data) {
    	initLine(stroLine, data.storline);
    	initLine(fileLine, data.fileline);
    	initLine(apiLine, data.apiline);
    	initLine(kafkaLine, data.kafkaline);
    	
    	$(".tab").Tab({
    		after: function ($hd, $bd) {
    			var $echarts = $bd.attr("_echarts_instance_") ? $bd : $bd.find("[_echarts_instance_]");
    			$.each($echarts, function (i, e) {
    				// 调用echarts的api获取图表实例，执行缩放
    				var chart = echarts.getInstanceByDom(e);
    				chart.resize();
    			});
    		}
    	});
    }
    
    //交换量趋势填充
    function volumeTrend(data) {
    	$('#stortodaycount').html(data.stortodaysuccesscount);
    	$('#stordayaverage').html(data.stormonthdayaveragecount);
    	$('#storyescompare').html(data.storyescomparestr);
    	$('#stormonthcount').html(data.stormonthsuccesscount);
    	
    	$('#filetodaycount').html(data.filetodaysuccesscount);
    	$('#filedayaverage').html(data.filemonthdayaveragecount);
    	$('#fileyescompare').html(data.fileyescomparestr);
    	$('#filemonthcount').html(data.filemonthsuccesscount);
    	
    	$('#apitodaycount').html(data.apitodaysuccesscount);
    	$('#apidayaverage').html(data.apimonthdayaveragecount);
    	$('#apiyescompare').html(data.apiyescomparestr);
    	$('#apimonthcount').html(data.apimonthsuccesscount);
    	
    	$('#kafkatodaycount').html(data.kafkatodaysuccesscount);
    	$('#kafkadayaverage').html(data.kafkamonthdayaveragecount);
    	$('#kafkayescompare').html(data.kafkayescomparestr);
    	$('#kafkamonthcount').html(data.kafkamonthsuccesscount);
    	
    }
    
    // 节点监控
    Util.ajax({
        url: epoint.dealRestfulUrl("../../rest/dxpnodegeneralaction/getNodeList"),
        async:true
    }).done(function (data) {
    	render(data);
    	if(data.nodesize < 6){
    		$('.watch-more').addClass('hidden');
    	}
    });	
    
    // 任务统计
    Util.ajax({
        url: epoint.dealRestfulUrl("../../rest/dxpnodegeneralaction/getPiePercent"),
        async:true
    }).done(function (data) {
    	initPieCharts(data);
    });	
    
    Util.ajax({
        url: epoint.dealRestfulUrl("../../rest/dxpnodegeneralaction/getInfo"),
        async:true
    }).done(function (data) {
    	volumeTrend(data);
        bindEvent();
        // 日期
        laydate.render({
            elem: '#datePick',
            range: true,
            trigger: 'click',
            done: function (value, date, endDate) {
                param.range = value;
                $rangeList.find("li").removeClass("active");
                initLineChartsExecuteTYW(date.year+'-'+date.month+'-'+date.date, endDate.year+'-'+endDate.month+'-'+endDate.date);
            }
        });

        $.each($(".date-item"), function (i, item) {
            if ($(item).hasClass("active")) {
                $datePick.val(Util.getNowFormatDate($(item).data('id')));
            }
        });
        initLineCharts(data);
	
    });	

    function bindEvent() {
        // 点击切换
        $rangeList.on("click", "li", function () {
            var that = $(this),
                id = that.data("id");
            that.addClass("active").siblings().removeClass("active");
            param.range = Util.getNowFormatDate(id);

            $datePick.val(param.range);
            
            var startdate = param.range.split(' - ')[0];
            var enddate = param.range.split(' - ')[1];
            if(id=='01' || id=='02' || id=='03'){
            	//今日、昨日、近一周
            	initLineChartsExecuteTYW(startdate, enddate);
            } else if(id=='04' || id=='05') {
            	//本月、本年
            	initLineChartsExecuteMY(id);
            }
        });

        $error.on("click", ".watch-more", function () {
            var that = $(this);
            $error.toggleClass("slide");
            if ($error.hasClass("slide")) {
                that.html('收起');
            } else {
                that.html('查看更多');
            }
        });
        
        $error.on("click", ".more-icon", function () {
        	epoint.openDialog('节点管理', "./../nodemanger/dxpnodelistdetail?isdetail=1"
                    , searchData, {
                    'width': 1700,
                    'height': 700
                });
        }),
        
        $error.on("click", ".more-nodeicon", function (e) {
        	var $this = $(this),
        	rowguid = $this.data('id');
        	epoint.openDialog('服务管理', "./../nodemanger/dxpnodedetaillistdetail?nodeGuid="
        			+ rowguid+"&isdetail=1" , searchData, {
        		'width': 1000,
        		'height': 500
        	});
        }),
        
        $mission.on("click", ".more-icon", function () {
        	epoint.openDialog('任务统计', "./mission?nodeGuid="
        			, searchData, {
        		'width': 1700,
        		'height': 700
        	});
        }),
        
        $mission2.on("click", ".more-icon", function () {
        	epoint.openDialog('任务统计', "./mission?nodeGuid="
        			, searchData, {
        		'width': 1700,
        		'height': 700
        	});
        }),
        
        $monitor.on("click", ".more-icon", function () {
        	epoint.openDialog('任务统计', "dxp/dxpalarm/dxpalarmlist"
        			, searchData, {
        		'width': 1700,
        		'height': 700
        	});
        })
    }
    
    function searchData(data) {
    	reload();
    }
    
    
    function render(data) {
        rendered = Mustache.render(modTmpl, data);
        $mods.html(rendered);
        mini.parse();
    }

})(this, jQuery);