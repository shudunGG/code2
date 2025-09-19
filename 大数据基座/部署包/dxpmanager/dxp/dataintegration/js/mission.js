/**!
 * 数据集成-任务统计
 * date:2019-09-19
 * author: [xulb];
 */
(function (win, $) {
    var param = {
        id: '01', //01  表示库表集成  02 表示文件集成，
        range: '01'
    };
    var lineTrend = echarts.init($(".mission-line")[0]),
        $missionList = $(".mission-list"),
        $totalData = $("#total-data"),
        $rangeList = $(".range-list"),
        $type = $(".type-choose"),
        temp = $("#topLine").html();

    function initLine(data) {
        lineTrend.setOption({
            legend: {
                show: true,
                left: 'right',
                top: 'top',
                textStyle: {
                    color: "#999",
                    fontSize: 12
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    },
                },
                formatter: function (e) {
                    return '集成量趋势' + '<br/>' + '成功：' + e[0].value + '条<br/>' + '失败：' + e[1].value + '条';
                }
            },
            grid: {
                left: '7%',
                right: '7%',
                top: '15%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: Util.getArrayData(data, 'name'),
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
                name: '集成量趋势（条）',
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
                itemStyle: {
                    color: "#50b956",
                    borderColor: "#50b956",
                    borderWidth: 2
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(80, 185, 86, .3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(80, 185, 86, 0)'
                            }
                        ], false),
                    }
                },
                data: Util.getArrayData(data, 'success')
            }, {
                type: 'line',
                smooth: true,
                itemStyle: {
                    color: "#ea644a",
                    borderColor: "#ea644a",
                    borderWidth: 2
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(234, 100, 74, .3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(234, 100, 74, 0)'
                            }
                        ], false),
                    }
                },
                data: Util.getArrayData(data, 'fail')
            }]
        });
    }

    function requestData() {
        $.ajax({
            url: situtaion,
            dataType: 'json',
            type: 'POST',
            cache:true, 
            async:true,
            data: param,
            success: function (data) {
                data = data.custom;
                $('#totalNum').html(data.totalNum == undefined ? '0' : data.totalNum);
                $('#totalSuccess').html(data.totalSuccess == undefined ? '0' : data.totalSuccess);
                $('#totoalError').html(data.totalError == undefined ? '0' : data.totalError);
                $('#totalLength').html(data.totalLength == undefined ? '0KB' : data.totalLength);
                initLine(data.list);
                $.each(data.line, function (i, item) {
                    item.num = i + 1;
                });
            }
        })
    }
    
    function getErrorRate() {
        $.ajax({
            url: errorrate,
            dataType: 'json',
            type: 'POST',
            cache:true, 
            async:true,
            data: param,
            success: function (data) {
                data = data.custom;
                console.log(data);
                $missionList.html(Mustache.render(temp, data));

                var $per = $missionList.find(".bottom-bar");
                $.each($per, function (i, item) {
                    var $target = $(item).children("span");
                    $target.stop(true).animate({
                        'width': data.line[i].percent
                    }, 400);
                });
                
                $('.mission-a').on("click", function (event) {
                	var dataType = mini.get('dataType').getValue();
                	var dataRange = mini.get('dataRange').getValue();
                	if(dataType == "01" && dataRange != "04" && dataRange != "05") {
                		var $parent = $(this).closest(".mission-item");
                    	var id = $parent.data("id");
                    	var name = $parent.find(".left-name").html();
                    	var url = 'dxp/dataintegration/mission_detail?flowGuid=' + id + '&dataType='
    							+ dataType + '&dataRange=' + dataRange;
    					epoint.openDialog(name, url, '', {
    						width : 1200,
    						height : 700
    					});
                	}
                });
            }
        })
    }
    

    function bindEvent() {
        $type.on("click", "li", function () {
            var that = $(this),
                html = that.index() == 1 ? '文件总数' : '数据总数';
            that.addClass("active").siblings().removeClass("active");
            param.id = that.data("id");
            mini.get('dataType').setValue(that.data("id"));
            requestData();
            getErrorRate();
            $totalData.html(html);
            epoint.refresh([ 'datagrid', 'fui-form' ]);
        });

        $rangeList.on("click", "li", function () {

            var that = $(this),
                id = that.data("id");
            that.addClass("active").siblings().removeClass("active");
            param.range = id;
            requestData();
            getErrorRate();
            mini.get('dataRange').setValue(id);
            epoint.refresh([ 'datagrid', 'fui-form' ]);
        });

    }

    function initPage() {
    	var dataType = Util.getUrlParams('dataType');
    	if(typeof(dataType) == 'undefined' || dataType == undefined) {
    		dataType = '01';
    	}
    	var dataRange = Util.getUrlParams('dataRange');
    	if(typeof(dataRange) == 'undefined' || dataRange == undefined) {
    		dataRange = '01';
    	}
		var $item = $type.find("li");
		$.each($item, function(i, obj) {
			if ($(obj).hasClass("active") && $(obj).data("id") != dataType) {
				$(obj).removeClass("active");
			}
			else if(!$(obj).hasClass("active") && $(obj).data("id") == dataType) {
				$(obj).addClass("active");
				param.id = dataType;
				mini.get('dataType').setValue(dataType);
			}
		});
		
		var $item2 = $rangeList.find("li");
		$.each($item2, function(i, obj) {
			if ($(obj).hasClass("active") && $(obj).data("id") != dataRange) {
				$(obj).removeClass("active");
			}
			else if(!$(obj).hasClass("active") && $(obj).data("id") == dataRange) {
				$(obj).addClass("active");
				param.range = dataRange;
				mini.get('dataRange').setValue(dataRange);
			}
		});
        requestData();
        getErrorRate();
        bindEvent();
    }

    initPage();


})(this, jQuery);