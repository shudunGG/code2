var changeData;
! function() {
    function pieTop(d, rx, ry, ir) {
        if (d.endAngle - d.startAngle == 0) return "M 0 0";
        var sx = rx * Math.cos(d.startAngle),
            sy = ry * Math.sin(d.startAngle),
            ex = rx * Math.cos(d.endAngle),
            ey = ry * Math.sin(d.endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
        ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
        return ret.join(" ");
    }

    function pieOuter(d, rx, ry, h) {
        var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

        var sx = rx * Math.cos(startAngle),
            sy = ry * Math.sin(startAngle),
            ex = rx * Math.cos(endAngle),
            ey = ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
        return ret.join(" ");
    }

    function pieInner(d, rx, ry, h, ir) {
        var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

        var sx = ir * rx * Math.cos(startAngle),
            sy = ir * ry * Math.sin(startAngle),
            ex = ir * rx * Math.cos(endAngle),
            ey = ir * ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
        return ret.join(" ");
    }
    //计算饼图区块占的百分比
    function getPercent(d) {
        return (d.endAngle - d.startAngle > 0 ?
            Math.round(1000 * (d.endAngle - d.startAngle) / (Math.PI * 2)) / 10 + '%' : '');
    }

    // 添加一个提示框
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltipDonut3D")
        .style("opacity", 0);

    // 提示框相关
    function showTooltip(d, formatter) {
        var data = d.data,
            html = '';
        if (!formatter) {
            /* formatter为空显示默认字段 */
            html = data.name + ':' + data.value + '(' + getPercent(d) + ')';
        } else {
            /* formatter传自定义字段 */
            html = formatter.replace('{a}', data.name).replace('{b}', data.value).replace('{c}', getPercent(d));
        }
        tooltip.html(html)
            .style("left", (d3.event.pageX - 40) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity", 1);
    }

    function monveTooltip() {
        tooltip.style("left", (d3.event.pageX - 40) + "px")
            .style("top", (d3.event.pageY + 20) + "px");
    }

    function hideTootip() {
        tooltip.style("opacity", 0);
    }
    // 动画
    Donut3D.prototype.transition = function(id, data, rx, ry, h, ir) {
        function arcTweenInner(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return pieInner(i(t), rx + 0.5, ry + 0.5, h, ir);
            };
        }

        function arcTweenTop(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return pieTop(i(t), rx, ry, ir);
            };
        }

        function arcTweenOuter(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return pieOuter(i(t), rx - .5, ry - .5, h);
            };
        }

        function textTweenX(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return 0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle));
            };
        }

        function textTweenY(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return 0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle));
            };
        }

        var _data = d3.layout.pie().sort(null).value(function(d) {
            return d.value;
        })(data);

        d3.select("#" + id).selectAll(".innerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenInner);

        d3.select("#" + id).selectAll(".topSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenTop);

        d3.select("#" + id).selectAll(".outerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenOuter);

    }

    Donut3D.prototype.drawInit = function(id, isShowTip /* 提示框*/ , formatter, /* 自定义提示 */ highLight, data, x /*center x*/ , y /*center y*/ ,
        rx /*radius x*/ , ry /*radius y*/ , h /*height*/ , ir /*inner radius*/ , bili /*容器宽度与图形（直径-1/2*land)的比例*/ ) {

        var _data = d3.layout.pie().sort(null).value(function(d) {
            return d.value;
        })(data);

        // 清空原来的数据
        d3.select("#" + id + " svg").remove();
        var $dom = $("#" + id);

        var slices = d3.select("#" + id).append("svg").attr("id", "svg_" + id).attr("width", $dom.width()).attr("height", $dom.height())
            .append("g").attr("transform", "translate(" + x + "," + y + ")")
            .attr("class", "slices");
        var grads = slices.append("defs")
            .selectAll("radialGradient")
            .data(data)
            .enter().append("radialGradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", "120%")
            .attr("id", function(d, i) {
                return "grad" + i;
            })
            .each(function(d) {
                this._current = d;
            });
        grads.append("stop").attr("offset", "0%").style("stop-color", function(d) {
            return d.color
        });
        grads.append("stop").attr("offset", "100%").style("stop-color", '#000');

        slices.selectAll(".innerSlice").data(_data).enter().append("path")
            .attr("class", function(d) {
                return "innerSlice index-" + d.data.index
            })
            .style("fill", function(d) {
                return d3.hsl(d.data.color).darker(0.7);
            })
            .attr("d", function(d) {
                return pieInner(d, rx + 0.5, ry + 0.5, h, ir);
            })
            .each(function(d) {
                this._current = d;
            });

        slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
            .attr("fill", function(d, i) {
                return "url(#grad" + i + ")"
            })
            .attr("class", function(d) {
                return "topSlice index-" + d.data.index
            })
            .style("fill", function(d) {
                return d.data.color;
            })
            .style("stroke", function(d) {
                return d.data.color;
            })
            .attr("d", function(d) {
                return pieTop(d, rx, ry, ir);
            })
            .each(function(d) {
                this._current = d;
            });

        slices.selectAll(".outerSlice").data(_data).enter().append("path")
            .attr("class", function(d) {
                return "outerSlice index-" + d.data.index
            })
            .style("fill", function(d) {
                return d3.hsl(d.data.color).darker(0.7);
            })
            .attr("d", function(d) {
                return pieOuter(d, rx - .5, ry - .5, h);
            })
            .each(function(d) {
                this._current = d;
            });

        slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
            .attr("x", function(d) {
                return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
            })
            .attr("y", function(d) {
                return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
            })
            .text(getPercent).each(function(d) {
                this._current = d;
            });


        // 判断是否显示提示框
        if (isShowTip || highLight) {
            // tooltip 框
            slices.selectAll(".innerSlice, .topSlice, .outerSlice, .percent").on("mouseover", function(d) {
                if (isShowTip) {
                    showTooltip(d, formatter);
                }

            }).on("mousemove", function(d, i) {
                if (highLight) {
                    var index = $(this).attr('class').split(" ")[1];
                    slices.selectAll("." + index).attr("opacity", "0.5");
                }
                if (isShowTip) {
                    monveTooltip();
                }
            }).on("mouseout", function(d) {
                if (isShowTip) {
                    hideTootip();
                }

                if (highLight) {
                    var index = $(this).attr('class').split(" ")[1];
                    slices.selectAll("." + index).attr("opacity", "1");
                }
            });
        }
    }

    // loading
    Donut3D.prototype.showLoading = function(id) {
        var loading = d3.select("#" + id).select('.loading');
        if (!loading.toString()) {
            d3.select("#" + id).append('div').attr("class", "loading")
                .append('img').attr("src", "images/loading.png")
        }
        loading.classed("loading-show", true)
    }
    Donut3D.prototype.hideLoading = function(id) {
        d3.select("#" + id).select('.loading')
            .classed("loading-show", false)
    }
}();

function Donut3D(opt) {

    // 处理半径
    function toPoint(percent) {
        if (!percent) return '';
        if (percent.isRatio) {
            percent = percent.value * 100 + '%';
        }
        percent = percent.value || percent;
        if (percent.toString().indexOf('%') == '-1') {
            return {
                isRatio: false,
                value: percent
            };
        }
        var str = percent.replace("%", "");
        str = str / 100;
        return {
            isRatio: true,
            value: str
        };
    }

    // 默认值
    if (!opt.radius) {
        opt.radius = ['50%', '50%'];
        opt.ratio = 0.6;
    }
    opt.radius[0] = toPoint(opt.radius[0]);
    opt.radius[1] = toPoint(opt.radius[1]);

    var $dom = $('#' + opt.dom), //获取id
        width = $dom.width(), //获取容器宽度
        height = $dom.height(), //获取容器高度
        centerWidth = width / 2, //获取外层容器宽度,算圆心横坐标位置
        land = 10,
        verticalHeight = (height - land) / 2, //获取外层容器宽度,算圆心纵坐标位置
        xradius,
        yradius;
    // xradius = opt.xdiam / 2 || opt.xbili * width / 2, //横向半径
    // yradius = (opt.ydiam-opt.land) / 2 || opt.ybili * height / 2 || ((opt.ydiam - opt.land) / opt.xdiam) * xradius, //纵向半径
    // yradius = opt.ybili * height / 2; //纵向半径

    // 判断半径是比例还是数值
    if (opt.radius[0].isRatio) {
        xradius = opt.radius[0].value * width / 2;
    } else {
        xradius = opt.radius[0].value;
    }
    if (opt.radius[1].isRatio) {
        yradius = opt.radius[1].value * height / 2;
    } else {
        yradius = opt.radius[1].value;
    }

    // 限制最大宽度，可用于自适应时限制最大宽度
    if (opt.maxDiam) {
        opt.maxDiam = toPoint(opt.maxDiam);
        if (!opt.maxDiam.isRatio && opt.maxDiam.value && xradius > opt.maxDiam.value) {
            xradius = opt.maxDiam.value / 2
        }
        if (opt.maxDiam.isRatio && opt.maxDiam.value && xradius > opt.maxDiam.value) {
            xradius = opt.maxDiam.value * width;
        }
    }

    // 固定高宽比
    if (opt.ratio) {
        yradius = xradius * opt.ratio / 2;
    }

    var defaultOpt = {
        dom: "id",
        tooltip: true,
        formatter: '',
        highLight: false,
        data: "data",
        centerWidth: centerWidth,
        verticalHeight: verticalHeight,
        xradius: xradius - 0,
        yradius: yradius - 0,
        land: land,
        innerCircle: 0.36
    };

    // 超出容器
    if (defaultOpt.yradius > height / 2) {
        defaultOpt.yradius = height / 2;
    }
    if (defaultOpt.xradius > width / 2) {
        defaultOpt.xradius = width / 2;
    }
    $.extend(defaultOpt, opt);
    var emptyData = [];
    var colorList = ['#4aa3ff', '#2dd6e2', '#fd86b5', '#992eed', '#fdb951', '#fdb951', '#33d6e4', '#fe8eba']; //饼图颜色
    $.each(opt.data, function(i, e) {
        if (!e.color) {
            e.color = colorList[i];
        }
        emptyData.push({
            index: i,
            name: e.name,
            value: 0,
            color: e.color
        });
    });
    this.opt = opt;
    Donut3D.prototype.drawInit(defaultOpt.dom, defaultOpt.tooltip, defaultOpt.formatter, defaultOpt.highLight, emptyData, defaultOpt.centerWidth, defaultOpt.verticalHeight, defaultOpt.xradius, defaultOpt.yradius, defaultOpt.land - 0, defaultOpt.innerCircle);
    changeData = function() {
        Donut3D.prototype.transition(defaultOpt.dom, defaultOpt.data, defaultOpt.xradius, defaultOpt.yradius, defaultOpt.land - 0, defaultOpt.innerCircle);
    }
    changeData();
    var timer = null;
    this.resize = function(e) {
        if (timer) clearTimeout(timer);
        var _this = this;
        timer = setTimeout(function() {
            Donut3D(_this.opt);
        }, 150);
    }

    return this;
}