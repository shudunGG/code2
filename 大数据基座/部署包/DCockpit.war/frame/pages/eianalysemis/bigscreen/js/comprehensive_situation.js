/**!
 * 数字驾驶舱
 * date:2021-02-20
 * author: qxy
 */
'use strict';
/* global pageConfig,Donut3D */

(function(win, $) {

    Util.hidePageLoading();

    var populationAmount = $('.population-amount');

    // 图表变量，地图纹理
    var chartWarning,
        pieAuto = [],
        img = new Image();
    img.src = './images/comperhensiveSituation/map-bg.jpg';

    // 初始化图表
    function initChart() {
        var chartOption = {
            geo: [{
                z: 1,
                top: '5%',
                right: '1%',
                bottom: '2%',
                left: '9%',
                itemStyle: {
                    areaColor: {
                        image: img,
                        repeat: 'no-repeat'
                    },
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,255,255,.6)',
                    borderWidth: 1,
                    borderColor: '#85e1ec'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,255,255,.6)',
                        borderWidth: 1,
                        borderColor: '#85e1ec'
                    }
                }
            }, {
                z: 2,
                top: '5%',
                right: '2%',
                bottom: '3%',
                left: '9%',
                itemStyle: {
                    areaColor: {
                        image: img,
                        repeat: 'no-repeat'
                    },
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,255,255,.6)',
                    borderWidth: 1,
                    borderColor: '#85e1ec'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,255,255,.6)',
                        borderWidth: 1,
                        borderColor: '#85e1ec'
                    }
                }
            }, {
                z: 3,
                top: '5%',
                right: '3%',
                bottom: '4%',
                left: '10%',
                itemStyle: {
                    areaColor: {
                        image: img,
                        repeat: 'no-repeat'
                    },
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,255,255,.6)',
                    borderWidth: 1,
                    borderColor: '#85e1ec'
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        areaColor: {
                            image: img,
                            repeat: 'no-repeat'
                        },
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,255,255,.6)',
                        borderWidth: 1,
                        borderColor: '#85e1ec'
                    }
                }
            }],
            series: [{
                z: 4,
                top: '5%',
                right: '2%',
                bottom: '3%',
                left: '10%',
                type: 'map',
                itemStyle: {
                    borderColor: '#85e1ec',
                    areaColor: '#818181',
                    opacity: 0.14,
                    borderWidth: 1
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        borderColor: '#85e1ec',
                        areaColor: '#818181',
                        opacity: 0.14,
                        borderWidth: 1
                    }
                }
            }, {
                z: 5,
                type: 'scatter',
                coordinateSystem: 'geo',
                symbolSize: [17, 23]
            }]
        };
        chartWarning = echarts.init(document.getElementById('warning-chart'));
        chartWarning.setOption(chartOption);
    }
    initChart();

    $.getJSON('./js/map/suzhou.json', function(mapCoordData) {
        echarts.registerMap('map', mapCoordData);
        chartWarning.setOption({
            geo: [{
                map: 'map'
            }, {
                map: 'map'
            }, {
                map: 'map'
            }],
            series: [{
                map: 'map'
            }]
        });
    });

    // 人口 tab加载
    $('.population-sex').Tab({
        hd: '.sex-hd>li',
        bd: '.sex-bd>p',
        after: function($hdItem) {
            var $hd = $hdItem.parent();
            if ($hdItem.index() == 0) {
                $hd.removeClass('high');
            } else {
                $hd.addClass('high');
            }
        }
    });

    // swiper加载
    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        // simulateTouch: false,
        slidesPerView: 'auto',
        loopAdditionalSlides: 5,
        coverflow: {
            rotate: -59,
            stretch: 85,
            depth: 180,
            modifier: 1,
            slideShadows: false
        },
        onInit: function() {
            for (var i = 0; i < $('.chart-field').length; i++) {
                var $chart = $('.chart-field').eq(i),
                    id = $('.chart-field').eq(i).attr('id');
                $chart.attr('id', id + i);
            }
        }
    });

    // swiper滑动下一页
    $('.swiper-field').on('click', '.arrow', function() {
        swiper.slideNext();
    });

    // 请求 城市体征 的数据
    function getUrbanData() {
        Util.ajax({
            url: pageConfig.getUrbanSigns,
            success: function(data) {
                // 相关参数
                var energyYear = ['全年用水', '全年用电', '全年用气'],
                    energyUnit = ['万吨', '万千瓦', '万立方米'];
                // 渲染数据
                Util.renderer(data, 'data-render').container('urbanSigns');
                // 人口-升降趋势
                if (data.compareTrend === 0) {
                    populationAmount.attr('class', 'population-amount').addClass('down');
                } else {
                    populationAmount.attr('class', 'population-amount').addClass('up');
                }
                // 城市发展指标及能源用量	
                $.each(data.energy, function(j, e) {
                    e.yearName = energyYear[j];
                    e.unit = energyUnit[j];
                });
                Util.renderer('energy-tmpl', { list: data.energy }).to('urban-energy');
            }
        });
    }
    getUrbanData();

    // 封装 指标 渲染方法
    function renderTarget(data, i) {
        var targetColor = ['#15C6A3', '#00BDFF', '#809DFB', '#29D7E1'];
        var chart = echarts.init($('.target-chart')[i]),
            $li = $('.urban-target li').eq(i);
        chart.setOption({
            series: [{
                type: 'pie',
                startAngle: '-180',
                center: ['50%', '100%'],
                radius: ['166%', '180%'],
                label: {
                    show: false
                },
                data: [{
                    value: data,
                    itemStyle: {
                        color: targetColor[i]
                    }
                }, {
                    value: (200 - data),
                    itemStyle: {
                        color: 'transparent'
                    }
                }]
            }]
        });
        $li.find('.num').text(data + '%');
        $li.find('.circle').css('transform', 'rotate(' + 1.8 * data + 'deg)');
    }

    // 遍历指标
    for (var i = 0; i < $('.target-chart').length; i++) {
        var $li = $('.urban-target li').eq(i),
            id = $li.data('id'),
            params = {
                params:JSON.stringify({
                    normGuid:id,
                    userGuid:'45f0c5f9-cad2-49e6-887d-b38dfcbc23de'
                })
            };
        Util.ajax({
            url: pageConfig.getNormData,
            data: params,
            async: false,
            type: "POST",
            success: function(data) {
                if(data){
                    renderTarget(data.cockpitData, i);
                    // renderTarget(95, i);
                }
                
            }
        });
        // renderTarget(10, i);
    }

    // 请求 数字晾晒台 数据
    Util.ajax({
        url: pageConfig.getDryingPlatform,
        success: function(data) {
            var nameList = ['政府办公室', '商务局', '财政局', '审计局', '交通局', '公安局'];
            $.each(data.list, function(i, e){
                e.name = nameList[i];
            });
            Util.renderer(data, 'data-render').container('drying');
            Util.renderer('brisk-tmpl', { list: data.list }).to('brisk-tbody');
        }
    });

    // 请求 城市智库 数据
    Util.ajax({
        url: pageConfig.getThinkTank,
        success: function(data) {
            var nameList = ['信访途径', '上门反馈', '网络途径', '大厅意见箱'];
            $.each(data.data, function(i, e){
                e.name = nameList[i];
            });
            data.notice = '通知!';
            $('#urgent-message').text(data.notice);
            Util.renderer('tank-tmpl', { list: data.data }).to('think-tank');
        }
    });

    // 请求 事件预警指标台 数据
    Util.ajax({
        url: pageConfig.getWarningPlatform,
        success: function(data) {
            data.newName = '问题标题';
            data.newAddress = '详细地址';
            data.newSource = '电线老化';
            data.newType = '待相应工单';
            data.newDescribe = '问题描述';
            // 渲染数据
            Util.renderer(data, 'data-render').container('warningPaltform');
            // 渲染地图点标记
            $.each(data.mapData, function(i, e) {
                if (e.degree === 0) {
                    e.symbol = 'image://./images/comperhensiveSituation/symbol0.png';
                } else if (e.degree === 1) {
                    e.symbol = 'image://./images/comperhensiveSituation/symbol1.png';
                } else if (e.degree === 2) {
                    e.symbol = 'image://./images/comperhensiveSituation/symbol2.png';
                }
            });
            chartWarning.setOption({
                series: [{}, {
                    data: data.mapData
                }]
            });
        }
    });

    // 请求 重点领域-交通畅行 数据
    Util.ajax({
        url: pageConfig.getFieldTraffic,
        success: function(data) {
            data = data.data;
            // 数据处理
            var li = '<li data-id="whole" class="active">全部类目</li>';
            var typeList = ['指示灯', '道路指挥人员', '城市道路', '交通工具', '道路绿化'];
            var nameList = [
                ['指示灯总数', '指示灯总里程数', '平均每公里指示灯数量', '指示灯亮度', '指示灯正常工作数量'], 
                ['道路指挥人员总人数', '平均没公里道路指挥人员数量', '道路指挥人员平均年龄', '道路指挥人员平均工作年限', '道路指挥人员平均出勤率'],
                ['城市道路总里程', '城市道路数量', '城市道路破坏率', '城市道路破坏条数', '城市不同道路事故发生率'],
                ['单车数量', '公交车数量', '货车数量', '新能源车数量', '步行数量'],
                ['绿化覆盖指数', '绿化覆盖总里程', '绿化效果', '绿化覆盖指数', '绿化覆盖总里程', '绿化效果']
            ]
            $.each(data, function(i, e) {
                e.type = typeList[i];
                li += '<li data-id="' + e.id + '">' + e.type + '</li>';
                $.each(e.list, function(i2, e2){
                    e2.name = nameList[i][i2];
                })
            });
            // 渲染分类
            $('.traffic-hd').empty().append(li);
            // 列表容器的高度
            fieldHeight($('.traffic-bd'));
            // 渲染列表
            $('.traffic-bd').empty().append(Mustache.render($('#field-tmpl').html(), {
                data: data
            }));
        }
    });

    // 请求 重点领域-城市智慧 数据
    Util.ajax({
        url: pageConfig.getFieldSmart,
        success: function(data) {
            data = data.data[0].pie;
            // 列表容器的高度
            fieldHeight($('.smart-bd'));
            var colorList = ['#4DA5FF', '#28D7E0', '#EEDD78', '#74C773', '#FD94BE'],
                sum = Util.getSum(data, 'value'),
                li = '';
            for (var i = 0; i < $('.chart-field').length; i++) {
                pieAuto[i] = renderDonut3DAuto('field-pie' + i, data, colorList);
            }
            // 处理数据
            var nameList = ['城东', '城北', '城南', '城西', '城中', '其他'];
            $.each(data, function(index, e) {
                e.name = nameList[index];
                li += '<li>\
                        <i class="ico" style="background:' + colorList[index] + '"></i>\
                        <p class="name">' + e.name + '</p>\
                        <p class="val">' + Util.getPercent(sum, e.value, 2) + '</p>\
                    </li>';
            });
            // 渲染列表
            $('.field-legend').empty().append(li);
        }
    });

    // 渲染3D饼图(自适应宽高)
    function renderDonut3DAuto(id, data, colorList) {
        // 处理数据
        $.each(data, function(i, e) {
            e.color = colorList[i];
        });

        // 初始化3d饼图
        var pie = new Donut3D({
            'dom': id,
            'tooltip': true, //默认显示悬框(默认展示name:value(percent))；false不显示悬停框
            'formatter': '{a}:{b}({c})', //自定义悬停框展示内容;{a}为name;{b}为value;{c}为percent;
            'highLight': true, //鼠标移入高亮。默认不高亮；true高亮
            'data': data, //图形数据
            'innerCircle': 0.4, //3D内圈空心圆大小，范围：0-1，值越大圆越大
            'land': 14, //图形厚度

            // 是否保持固定宽高比
            'ratio': 0.8, // 固定高宽比、注意是 高/宽 的比例(设置了该值则纵向半径失效)，自适应时建议设置该值，以防拉升变形。
            'radius': ['50%', '40%'], // 半径，分别为横向半径、纵向半径(可以是比例、具体像素值),通过该值控制3D角度。
        });

        return pie;
    }

    // 重点领域 分类点击事件
    $('.field-type').on('click', '>li', function() {
        var $this = $(this),
            id = $this.data('id'),
            $bd = $this.parent().next();
        $this.addClass('active').siblings().removeClass('active');
        if (id == 'whole') {
            $bd.find('.field-item').removeClass('hidden');
        } else {
            $bd.find('.field-item[data-id=' + id + ']').removeClass('hidden').siblings().addClass('hidden');
        }
    });

    // 打开 数字晾晒台 弹窗
    $('.box').on('click', '.more', function() {
        var $this = $(this),
            id = $this.data('id'),
            url = './digital_drying.html' + (id == '城市体征指标' ? '?type=cstzzb' : '');
        Util.openTopLayer({
            title: id,
            id: 'operation-layer',
            width: '9.28rem',
            height: '6.2rem',
            url: url,
        });
    });

    // 重点领域 内容的高度判断
    function fieldHeight($bd) {
        var wholeHeight = $bd.parent().height(),
            height = $bd.prev().outerHeight();
        $bd.css('height', (wholeHeight - height) + 'px');
    }
    fieldHeight($('.travel-bd'));

    // 事件预警指标台鼠标悬浮
    $('.box4').on('mouseenter', function() {
        $('.mod-iframe').addClass('show');
        $('.fui-content').addClass('noscroll');
    });
    $('body').on('mousemove', function(e) {
        if ($(e.target).parents('.box4').length === 0 && $(e.target).parents('.mod-iframe').length === 0) {
            $('.mod-iframe').removeClass('show');
            $('.fui-content').removeClass('noscroll');
        }
    });

    // 高亮对应指标
    win.targetHigh = function(id) {
        console.log(id);
        for (var i = 0; i < $('.urban-target li').length; i++) {
            var $li = $('.urban-target li').eq(i),
                targetId = $li.data('id');
            if (targetId === id) {
                $li.addClass('active').siblings().removeClass('active');
            }
        }
    };

    // 关闭 父页面 的搜索框和当前位置信息
    $('body').on('click', function() {
        if ($('.loc-whole', win.parent.document).css('display') !== 'none') {
            parent.closeLoc();
        }
        $('#search-wrap', win.parent.document).hide();
    });

    // 图表和swiper自适应
    $(win).resize(function() {
        for (var i = 0; i < pieAuto.length; i++) {
            pieAuto[i].resize();
        }
        for (var j = 0; j < $('.field-detail').length; j++) {
            fieldHeight($('.field-detail').eq(j));
        }
        swiper.onResize();
    });
    Util.echartsResize()();

})(this, jQuery);