/**
 * 指标首页
 * date:2020-11-30
 * author: hkh
 */

/**!
 * 首页
 * date:2019-10-16
 * author: lengyy;
 */

/*!
 * 标签云
 * author: xiaolong
 */


(function() {



    var $keycloud = $("#keycloud");

    //地图数据更新方法
    var renderCloud = function(data) {
        
        var html = "";
        $.each(data, function(i, e) {
            html += ("<span style='color:" + e.color + "'>" + e.text + "</span>");
        });
        $keycloud.html(html);
        initCloudWord();
    };


    var initCloudWord = function() {
        var radius = 130;
        var dtr = Math.PI / 180;
        var d = 400;
        var mcList = [];
        var active = true;
        var lasta = 1;
        var lastb = 1;
        var distr = true;
        var tspeed = 1;
        var size = 100;
        var mouseX = 80;
        var mouseY = -60;
        var howElliptical = 1;
        var aA = null;
        var oDiv = null;
        var i = 0;
        var oTag = null;
        oDiv = document.getElementById('keycloud');
        aA = oDiv.getElementsByTagName('span');
        for (i = 0; i < aA.length; i++) {
            oTag = {};
            oTag.offsetWidth = aA[i].offsetWidth;
            oTag.offsetHeight = aA[i].offsetHeight;
            mcList.push(oTag);
        }
        sineCosine(0, 0, 0);
        positionAll();
        oDiv.onmouseover = function() {
           active = true;
        };
        oDiv.onmouseout = function() {
           active = false;
        };
        oDiv.onmousemove = function(ev) {
            var oEvent = window.event || ev;
            mouseX = oEvent.clientX - (oDiv.offsetLeft + oDiv.offsetWidth / 2);
            mouseY = oEvent.clientY - (oDiv.offsetTop + oDiv.offsetHeight / 2);
            mouseX /= 5;
            mouseY /= 5;
        };
        setInterval(update, 30);
        function update() {
            var a;
            var b;
            if (active) {
                a = (-Math.min(Math.max(-mouseY, -size), size) / radius) * tspeed;
                b = (Math.min(Math.max(-mouseX, -size), size) / radius) * tspeed;
            } else {
                a = lasta * 0.98;
                b = lastb * 0.98;
            }
            lasta = a;
            lastb = b;
            if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
                return;
            }
            var c = 0;
            sineCosine(a, b, c);
            for (var j = 0; j < mcList.length; j++) {
                var rx1 = mcList[j].cx;
                var ry1 = mcList[j].cy * ca + mcList[j].cz * (-sa);
                var rz1 = mcList[j].cy * sa + mcList[j].cz * ca;
                var rx2 = rx1 * cb + rz1 * sb;
                var ry2 = ry1;
                var rz2 = rx1 * (-sb) + rz1 * cb;
                var rx3 = rx2 * cc + ry2 * (-sc);
                var ry3 = rx2 * sc + ry2 * cc;
                var rz3 = rz2;
                mcList[j].cx = rx3;
                mcList[j].cy = ry3;
                mcList[j].cz = rz3;
                per = d / (d + rz3);
                mcList[j].x = (howElliptical * rx3 * per) - (howElliptical * 2);
                mcList[j].y = ry3 * per;
                mcList[j].scale = per;
                mcList[j].alpha = per;
                mcList[j].alpha = (mcList[j].alpha - 0.6) * (10 / 6);
            }
            doPosition();
            depthSort();
        }
        function depthSort() {
            var i = 0;
            var aTmp = [];
            for (i = 0; i < aA.length; i++) {
                aTmp.push(aA[i]);
            }
            aTmp.sort
            (
                function(vItem1, vItem2) {
                    if (vItem1.cz > vItem2.cz) {
                        return -1;
                    } else if (vItem1.cz < vItem2.cz) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );
            for (i = 0; i < aTmp.length; i++) {
                aTmp[i].style.zIndex = i;
            }
        }
        function positionAll() {
            var phi = 0;
            var theta = 0;
            var max = mcList.length;
            var i = 0;
            var aTmp = [];
            var oFragment = document.createDocumentFragment();
            for (i = 0; i < aA.length; i++) {
                aTmp.push(aA[i]);
            }
            aTmp.sort
            (
                function() {
                    return Math.random() < 0.5 ? 1 : -1;
                }
            );
            for (i = 0; i < aTmp.length; i++) {
                oFragment.appendChild(aTmp[i]);
            }
            oDiv.appendChild(oFragment);
            for (i = 1; i < max + 1; i++) {
                if (distr) {
                    phi = Math.acos(-1 + (2 * i - 1) / max);
                    theta = Math.sqrt(max * Math.PI) * phi;
                } else {
                    phi = Math.random() * (Math.PI);
                    theta = Math.random() * (2 * Math.PI);
                }
                //×ø±ê±ä»»
                mcList[i - 1].cx = radius * Math.cos(theta) * Math.sin(phi);
                mcList[i - 1].cy = radius * Math.sin(theta) * Math.sin(phi);
                mcList[i - 1].cz = radius * Math.cos(phi);
                aA[i - 1].style.left = mcList[i - 1].cx + oDiv.offsetWidth / 2 - mcList[i - 1].offsetWidth / 2 + 'px';
                aA[i - 1].style.top = mcList[i - 1].cy + oDiv.offsetHeight / 2 - mcList[i - 1].offsetHeight / 2 + 'px';
            }
        }
        function doPosition() {
            var l = oDiv.offsetWidth / 2;
            var t = oDiv.offsetHeight / 2;
            for (var i = 0; i < mcList.length; i++) {
                aA[i].style.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
                aA[i].style.top = mcList[i].cy + t - mcList[i].offsetHeight / 2 + 'px';
                var fs = Math.ceil(12 * mcList[i].scale) + 4;
                if (fs > 48) {
                    fs = 48;
                }
                aA[i].style.fontSize = fs + 'px';

                aA[i].style.filter = "alpha(opacity=" + 100 * mcList[i].alpha + ")";
                aA[i].style.opacity = mcList[i].alpha;
            }
        }
        function sineCosine(a, b, c) {
            sa = Math.sin(a * dtr);
            ca = Math.cos(a * dtr);
            sb = Math.sin(b * dtr);
            cb = Math.cos(b * dtr);
            sc = Math.sin(c * dtr);
            cc = Math.cos(c * dtr);
        }
    };
    window.renderCloud = renderCloud;
})();

$(function() {
    function change1(data){
        var chartName = getArrayData(data, 'name');
        var chartData = [1,2,3,4,5];
        var option1 = {
            grid: {
                left: '5%',
                right: '20%',
                bottom: '10%',
                top: '2%',
                containLabel: true
            },
            color: ['#99CCFF'],
            xAxis: [
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    inverse: true,
                    show: false
                }
            ],
            series: [
                {
                    type: 'bar',
                    barGap: '-100%',
                    barWidth: '40%',
                    data: getArrayData(data, 'value'),
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#FF9900'
                            },
                            position: 'right'
                        }
                    }
                },
                {
                    type: 'bar',
                    xAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: [0, '-20'],
                            textStyle: {
                                fontSize:14,
                                color: '#212121',
                            },
                            formatter: function(data) {
                                return chartName[data.dataIndex];
                            }
                        }
                    },
                    data: chartData
                }
            ]
        }
        var hotnormBar = echarts.init(document.getElementById('hotnorm-bar'));
        hotnormBar.setOption(option1);
    }
    function change2(data){
        var chartName = getArrayData(data, 'name');
        var chartData = [18,28,15,6,17];
        var option1 = {
            grid: {
                left: '5%',
                right: '20%',
                bottom: '10%',
                top: '2%',
                containLabel: true
            },
            color: ['#99CCFF'],
            xAxis: [
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    inverse: true,
                    show: false
                }
            ],
            series: [
                {
                    type: 'bar',
                    barGap: '-100%',
                    barWidth: '40%',
                    data: getArrayData(data, 'value'),
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#FF9900'
                            },
                            position: 'right'
                        }
                    }
                },
                {
                    type: 'bar',
                    xAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: [0, '-20'],
                            textStyle: {
                                fontSize:14,
                                color: '#212121',
                            },
                            formatter: function(data) {
                                return chartName[data.dataIndex];
                            }
                        }
                    },
                    data: chartData
                }
            ]
        }
        var hotnormBar = echarts.init(document.getElementById('hotnorm-bar'));
        hotnormBar.setOption(option1);
    }
    function change3(data){
        var option3 = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: getArrayData(data.week, 'date')
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                type: 'line',
                data:getArrayData(data.week, 'count'),
                areaStyle: {
                    normal: {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [ {
                                offset : 0,
                                color : '#BBDEFB'
                            }, {
                                offset : 0.5,
                                color : '#2196F3'
                            }, {
                                offset : 1,
                                color : '#0D47A1'
                            } ]),
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#4290eb'
                    }
                }
            }]
        }
        var callLine = echarts.init(document.getElementById('call-line'));
        callLine.setOption(option3);
    }
    function change4(data){
        var option4 = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: getArrayData(data.month, 'date')
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                type: 'line',
                force: {layoutAnimation:false},
                data:getArrayData(data.month, 'count'),
                areaStyle: {
                    normal: {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [ {
                                offset : 0,
                                color : '#BBDEFB'
                            }, {
                                offset : 0.5,
                                color : '#2196F3'
                            }, {
                                offset : 1,
                                color : '#0D47A1'
                            } ]),
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#4290eb'
                    }
                }
            }]
        }
        var callLine = echarts.init(document.getElementById('call-line'));
        callLine.setOption(option4);
    }
    function initCharts(data) {
        var option = {
            title: {
                x: 'center',
                y: '-10',
                subtext: '指标分类：' + data.summary.totalDomain + ' 个 指标分类： ' + data.summary.totalNorm + ' 个',
                subtextStyle: {
                    align: 'right',
                    fontSize: '16'
                }
            },
            color: ['#ef5350', '#AB47BC', '#42A5F5', '#66BB6A', '#FFEE58', '#FFA726','#0066CC', '#FF0033', '#FFCCCC', '#CC6699', '#339933', '#FF9900'],
            legend: {
                orient: 'vertical',
                x: '80%',
                y: 'center',
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 12,
                icon: 'rect',
                textStyle: {
                    color: '#5c5c5c',
                    fontSize: 14,
                    rich: {
                        value: {
                            fontSize: 14,
                            color: '#4290eb',
                            fontWeight: 'bold'
                        }
                    }
                },
                data: getArrayData(data.summary.normList, 'name')
            },
            series: [{
                type: 'pie',
                center: ['35%', '48%'],
                radius: ['0', '60%'],
                data: data.summary.normList,
                itemStyle: {
                    borderColor: '#FAFAFA',
                    borderWidth: 2
                }
            }, {
                type: 'pie',
                center: ['35%', '48%'],
                radius: ['65.2%', '66%'],
                label: {show: false},
                silent: true,
                data: [{name: 'circle', value: 1}]
            }],
            tooltip: {
                trigger: 'item'
            }
        };
        var statusPie = echarts.init(document.getElementById('status-pie'));
        statusPie.setOption(option);
        
        change1(data.hotNormSearch);
        $('#change1').on('click', function(e) {
            change1(data.hotNormSearch);
        });
        $('#change2').on('click', function(e) {
            change2(data.hotNormSubscribe);
        });
        
        option = {
            title: {
                x: 'center',
                y: 'center',
                text: '更新总数\n' + data.normUpdate.totalNorm + '个'
            },
            color: ['#0066CC', '#FF0033', '#FFCCCC', '#CC6699', '#339933', '#FF9900'],
            series: [{
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['40%', '60%'],
                data: data.normUpdate.normList,
                itemStyle: {
                    borderColor: '#FAFAFA',
                    borderWidth: 2
                }
            }],
            tooltip: {
                trigger: 'item'
            }
        }
        var updatePie = echarts.init(document.getElementById('update-pie'));
        updatePie.setOption(option);


        change3(data.normAPI);
        document.getElementById('jrdycs').innerHTML = '今日调用次数： ' + data.normAPI.day + '次';
        $('#change3').on('click', function(e) {
            change3(data.normAPI);
        });
        $('#change4').on('click', function(e) {
            change4(data.normAPI);
        });

        var M = Mustache;
        var quotoTpl = $("#quoto-tpl").html();
        $("#quote-count").html(M.render(quotoTpl, {list: data.normWarning}));
    }
    
    var hottips = [
        //假的
        {color: "#B47DE5", text: "办结时长"},
        {color: "#888EC4", text: "超期工单数"},
        {color: "#44E0A4", text: "资本规模"},
        {color: "#13CD25", text: "注册地区"},
        {color: "#716E61", text: "经营状况"},
        {color: "#5161F0", text: "是否本地企业"},
        {color: "#0B1EAA", text: "主管部门"}
    ]
    renderCloud(hottips);
    var dataForPDF;
    epoint.initPage('cockpitindexaction', '@all', function(data) {
        if(data.export == 'true'){
            $("#export-btn").show();
        }
        data = data.cIndex;
        dataForPDF = data;
        initCharts(data);
    });
    function getArrayData(data, name) {
        var arr = [];
        $.each(data, function(i, item) {
            arr.push(item[name]);
        });
        return arr;
    }
    $('#export-btn').on('click', function(e) {
        console.log(dataForPDF);
        var cid = mini.showMessageBox({
            title : '系统提醒',
            message : '正在为您导出,请等待...',
            iconCls : 'mini-messagebox-info'
        });
        var $pages = $('div[class=\'overview-count\']:visible');
        var w = $pages.eq(0).width();
        var h = $pages.eq(0).height();
        var format = [ 33.867, 33.867 * h / w ];
        var pdf = new jsPDF({
            orientation : 'l',
            unit : 'cm',
            format : format
        });
    
        // 逐页转canvas 用promise 保证完成以及先后顺序
        function sleep(delay)
        {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
        }


        var promiseArr = [];
        $pages.each(function(i, page) {
            var dtd = $.Deferred();
            promiseArr.push(dtd);
            var frameBody = page;
            html2canvas(frameBody).then(function(canvas) {
                dtd.resolve(canvas);
                dtd.promise();
            });
        });
    
        // 全部完成后 加入pdf
        $.when.apply($, promiseArr).then(function() {
            var canvas;
            for (var i = 0, len = arguments.length; i < len; i++) {
                
                canvas = arguments[i];
                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                if (pageData) {
                    // 分页
                    i && pdf.addPage();
                    pdf.addImage(pageData, 'JPEG', 0, 0, format[0], format[1]);
                }
            }
            var date = new Date();
            var datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            pdf.save('数据治理报告-' + datestr + '.pdf');
            mini.get(cid).destroy();
        });

        
    });
});