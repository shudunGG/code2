
var minLineLength = 80, lineHeight = 2, arrowBC = 10, lineColor = "#333", lineBG = "#333|2";

function getCurvePath(cx, cy, r, startAngle, endAngle) {
    var rad = Math.PI / 180;
    var x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad);
    return ["M", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2];
};

function checkIntersection(path, x1, y1, x4, y4) {
    var apath = Raphael.parsePathString(path);
    var bEndAtStartLeft = x4 > x1;
    var bEndAtStartDown = y4 > y1;
    //alert(apath[0][0]);
    var intersectionLines = {};
    //if (!tempb) {
    $.each(lines, function (k, v) {
        var a = Raphael.pathIntersection(path, v.line[1].attr("path"));
        //alert(a.length);
        if (a.length) {
            intersectionLines[v.id] = v;
            //alert(JSON.stringify(a[0]));
            //tempb = true;
            for (var i = 0; i < apath.length; i++) {
                //alert(apath[i].join(""));
                if (Math.abs(apath[i][1] - a[0].x) < 3 && i < apath.length - 1 && (bEndAtStartDown ? (a[0].x > apath[i][1] && a[0].x < apath[i + 1][1]) : (a[0].x < apath[i][1] && a[0].x > apath[i + 1][1]))) {
                    break;
                }
                if (Math.abs(apath[i][2] - a[0].y) < 3 && (bEndAtStartLeft ? (a[0].x > apath[i][1] && a[0].x < apath[i + 1][1]) : (a[0].x < apath[i][1] && a[0].x > apath[i + 1][1]))) {
                    //apath[i][1] = a[j].x - 2;
                    //apath.splice(i + 1, 0, ["L", a[0].x - 6, a[0].y], ["L", a[0].x, a[0].y - 4], ["L", a[0].x + 6, a[0].y]);
                    apath.splice(i + 1, 0, ["L", a[0].x - (bEndAtStartLeft ? 6 : -6), a[0].y], getCurvePath(a[0].x, a[0].y, -6, 180, 0), ["M", a[0].x - (bEndAtStartLeft ? -6 : 6), a[0].y]);
                    break;
                }
            }
            path = apath.join(",");
        }
    });
    return { path: path, intersectionLines: intersectionLines };
}



/**
* raphael.arrow-set plugin
* Copyright (c) 2011 @author: top-flight
*
* Licensed under the MIT license
*/



(function () {

    /**
    *** Create a set that will contain a path for the arrow line and a path for the arrow head.
    **/
    Raphael.fn.drawLine = function (obj1, e, line, bg, r) {
        if (obj1.line && obj1.from) {
            line = obj1;
            obj1 = line.from;
            bg = line.obg;
            r = line.oldR;
        }
        var bb1 = obj1.getBBox(),
            p = [{ x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
                { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
                { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
                { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
                { x: e.x + 1, y: e.y - 1 },
                { x: e.x + 1, y: e.y + 2 + 1 },
                { x: e.x - 1, y: e.y + 1 },
                { x: e.x + 2 + 1, y: e.y + 1 }],
                d = {}, dis = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
        var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
        dx = Math.max(Math.abs(x1 - x4) / 2, 10);
        dy = Math.max(Math.abs(y1 - y4) / 2, 10);
        var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
        if (x3 == x4) {
            y3 = y2;
            y4 = y4 + (y3 > y4 ? r * Math.sin(120 * Math.PI / 360) : -r * Math.sin(120 * Math.PI / 360));
        }
        else {
            x3 = x2;
            x4 = x4 + (x3 > x4 ? r * Math.sin(120 * Math.PI / 360) : -r * Math.sin(120 * Math.PI / 360));
        }
        var path = ["M", x1.toFixed(3), y1.toFixed(3), "L", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
        //path = checkIntersection(path, x1, y1, x4, y4);

        if (line && line.line) {
            line.line[0].remove();
            line.line[1].remove();
            var arrow = paper.set();
            arrow.push(paper.path(triangle(x4, y4, r, y3 == y4, (y3 == y4 ? x3 > x4 : y3 > y4))).attr({ "fill": "#333", "stroke-width": "1.3", "stroke": "#333" }));
            arrow.push(paper.path(path));
            line.line = arrow;
        } else {
            var color = typeof line == "string" ? line : "#000";
            var arrow = paper.set();
            arrow.push(paper.path(triangle(x4, y4, r, y3 == y4, (y3 == y4 ? x3 > x4 : y3 > y4))).attr({ "fill": "#333", "stroke-width": "1.3", "stroke": "#333" }));
            arrow.push(paper.path(path));
            return {
                obg: bg,
                oldR: r,
                //bg: bg && bg.split && this.path(path).attr({ "arrow-end": "block-wide-long", stroke: bg.split("|")[0], fill: "#fff", "stroke-width": bg.split("|")[1] || 3 }),
                line: arrow,// this.path(path).attr({ stroke: color, fill: "none" }).click(clickLine),
                from: obj1
            };
        }
    };

    Raphael.fn.arrowSet = function (obj1, obj2) {
        var bNeedCheckIntersection = true;
        if (obj1.line && obj1.from && obj1.to) {
            if (typeof obj2 != "undefined")
                bNeedCheckIntersection = obj2;
            var line = obj1;
            obj1 = line.from;
            obj2 = line.to;
            obj1.Lines[line.fromTo[0]] -= 1;
            obj2.Lines[line.fromTo[1] - 4] -= 1;
        }

        var bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox(),
            p = [{ x: bb1.x + bb1.width / 2, y: bb1.y - 3 },            //up-middle
            { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 3 },    //down-middle
            { x: bb1.x - 3, y: bb1.y + bb1.height / 2 },                //middle-left
            { x: bb1.x + bb1.width + 3, y: bb1.y + bb1.height / 2 },    //middle-right
            { x: bb2.x + bb2.width / 2, y: bb2.y - 3 },                 //up-middle
            { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 3 },    //down-middle
            { x: bb2.x - 3, y: bb2.y + bb2.height / 2 },                //middle-left
            { x: bb2.x + bb2.width + 3, y: bb2.y + bb2.height / 2 }],   //middle-right
            d = {}, dis = [], res = [];

        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }

        ////�������ʱ�޸ĵ��㷨
        ////�յ��������Ҳ�
        //if (bb1.x < bb2.x) {
        //    //�յ��������ϲ�
        //    if (bb1.y > bb2.y) {
        //        res[0] = obj1.Lines[3] <= obj1.Lines[0] ? 3 : 0;
        //        res[1] = obj2.Lines[2] <= obj2.Lines[1] ? 6 : 5;
        //    }
        //        //�յ��������²�
        //    else {
        //        res[0] = obj1.Lines[3] <= obj1.Lines[1] ? 3 : 1;
        //        res[1] = obj2.Lines[2] <= obj2.Lines[0] ? 6 : 4;
        //    }
        //}
        //else {
        //    //�յ��������ϲ�
        //    if (bb1.y > bb2.y) {
        //        res[0] = obj1.Lines[2] <= obj1.Lines[0] ? 2 : 0;
        //        res[1] = obj2.Lines[3] <= obj2.Lines[1] ? 7 : 5;
        //    }
        //        //�յ��������²�
        //    else {
        //        res[0] = obj1.Lines[3] <= obj1.Lines[1] ? 2 : 1;
        //        res[1] = obj2.Lines[3] <= obj2.Lines[0] ? 7 : 4;
        //    }
        //}

        obj1.Lines[res[0]] += 1;
        obj2.Lines[res[1] - 4] += 1;
        var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
        var sep = 3;
        if (obj1.Lines[res[0]] > 1) {
            var zc = (obj1.Lines[res[0]] + 1) / 2;
            var yu = obj1.Lines[res[0]] % 2;
            switch (res[0]) {
                case 0:
                case 1:
                    x1 += yu == 0 ? zc * sep : (lineHeight / 2 - zc * sep);
                    break;
                case 2:
                case 3:
                    y1 += yu == 0 ? zc * sep : (lineHeight / 2 - zc * sep);
                    break;
            }

        }
        if (obj2.Lines[res[1] - 4] > 1) {
            var zc = (obj2.Lines[res[1] - 4] + 1) / 2;
            var yu = obj2.Lines[res[1] - 4] % 2;
            switch (res[1] - 4) {
                case 0:
                case 1:
                    x4 += yu == 0 ? zc * sep : (lineHeight / 2 - zc * sep);
                    break;
                case 2:
                case 3:
                    y4 += yu == 0 ? zc * sep : (lineHeight / 2 - zc * sep);
                    break;
            }

        }
        dx = Math.max(Math.abs(x1 - x4) / 2, 10);
        dy = Math.max(Math.abs(y1 - y4) / 2, 10);
        var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
        if (x3 == x4) {
            y3 = y2;
            y4 = y4 + (y3 > y4 ? arrowBC * Math.sin(120 * Math.PI / 360) : -arrowBC * Math.sin(120 * Math.PI / 360));
        }
        else {
            x3 = x2;
            x4 = x4 + (x3 > x4 ? arrowBC * Math.sin(120 * Math.PI / 360) : -arrowBC * Math.sin(120 * Math.PI / 360));
        }
        //var path = ["M", x1.toFixed(3), y1.toFixed(3), "L", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");

        var path = [[["M", x1.toFixed(3), y1.toFixed(3)], ["L", x2, y2]], [["M", x2, y2], ["L", x3, y3]], [["M", x3, y3], ["L", x4, y4]]];
        //if (bNeedCheckIntersection) {
        //    var intersection = checkIntersection(path, x1, y1, x4, y4);
        //    path = intersection.path;
        //}

        function _lineDragStart(x, y, e) {
            //��һ�λ������һ��
            var isHorizontal = this.attr("cursor") == "ns-resize";
            if (!this.prevLine || !this.nextLine) {
                //var totalLenth = Raphael.getTotalLength(this.attr("path")),
                //    middlePoint = this.getPointAtLength(totalLenth / 2),
                //    direction = this.data("direction");

                //����С��minLineLength����������ק
                if (Raphael.getTotalLength(this.attr("path")) < minLineLength) {
                    return false;
                }
                //��ǰ��������е����߻����ұߡ�
                //this.data("middlePoint", middlePoint);
                //.data("nearStart", isHorizontal ? ((direction == "right" && e.x > middlePoint.x) || (direction == "left" && e.x < middlePoint.x)) : ((direction == "up" && e.y > middlePoint.y) || (direction == "down" && e.y < middlePoint.y)));
            }
            LineClick1(arrow);
        }
        function _lineDraging(dx, dy, x, y) {
            var isHorizontal = this.attr("cursor") == "ns-resize";
            if ((isHorizontal && Math.abs(dy) < 5) || (!isHorizontal && Math.abs(dx) < 5)) {
                return;
            }

            var thisPath = Raphael.parsePathString(this.attr("path")),
                seqInSets = this.seqInSets;
            if (this.prevLine)
                var prevPath = Raphael.parsePathString(this.prevLine.attr("path"));
            if (this.nextLine)
                var nextPath = Raphael.parsePathString(this.nextLine.attr("path"));
            //��һ�λ������һ��
            if (!this.prevLine || !this.nextLine) {
                var totalLenth = Raphael.getTotalLength(this.attr("path")),
                    newPath;
                //����С��minLineLength����������ק
                if (totalLenth < minLineLength) {
                    return;
                }
                var tempLine = this.data("tempLine");
                if (isHorizontal) {
                    //ǰ��line
                    if (this.prevLine) {
                        prevPath[2][2] = thisPath[0][2] + dy;
                        this.prevLine = _reDrawLine(this.prevLine, prevPath);
                        newPath = [["M", thisPath[0][1], thisPath[0][2] + dy], ["L", thisPath[1][1], thisPath[1][2] + dy], thisPath[1]];
                    }
                    //����line
                    if (this.nextLine) {
                        nextPath[0][2] = thisPath[0][2] + dy;
                        this.nextLine = _reDrawLine(this.nextLine, nextPath);
                        newPath = [thisPath[0], thisPath[1], ["L", thisPath[1][1], thisPath[1][2] + dy]];
                    }

                    if (tempLine)
                        tempLine.remove();
                    this.data("tempLine", paper.path(newPath.join(",")).attr({ "stroke-width": lineHeight, "stroke": "#f00" }));

                    this.transform("t" + (this.direction == "right" ? totalLenth / 4 : 0 - totalLenth / 4) + "," + (this.prevLine ? 0 : dy) + " s0.5");
                }
            }
            else {
                if (isHorizontal) {
                    prevPath[2][2] = thisPath[0][2] + dy;
                    _reDrawLine(this.prevLine, prevPath);
                    //���ǰ��Line�ǵ�һ����
                    this.transform("t0," + dy);
                    nextPath[0][2] = thisPath[0][2] + dy;
                    _reDrawLine(this.nextLine, nextPath);
                    //�������Line�����һ����
                    if (this.nextLine.seqInSets == arrow.length - 2) {

                    }
                }
                else {
                    prevPath[2][1] = thisPath[0][1] + dx;
                    _reDrawLine(this.prevLine, prevPath);
                    this.transform("t" + dx + ",0");
                    nextPath[0][1] = thisPath[0][1] + dx;
                    _reDrawLine(this.nextLine, nextPath);
                }


            }

        }
        function _lineDragEnd(e) {
            if (!this.prevLine || !this.nextLine) {
                var totalLenth = Raphael.getTotalLength(this.attr("path"));
                //����С��minLineLength����������ק
                if (totalLenth < minLineLength) {
                    return false;
                }
            }
            var isHorizontal = this.attr("cursor") == "ns-resize",
                thisPath = Raphael.parsePathString(this.attr("path")),
                firstLine, secondLine, thirdLine;
            if (this.prevLine)
                var prevPath = Raphael.parsePathString(this.prevLine.attr("path"));
            if (this.nextLine)
                var nextPath = Raphael.parsePathString(this.nextLine.attr("path"));
            if (!this.prevLine || !this.nextLine) {
                var tempLine = this.data("tempLine");
                if (tempLine)
                    tempLine.remove();
                if (isHorizontal) {
                    if (!this.prevLine) {
                        firstLine = _drawLine([thisPath[0], thisPath[1]]);
                        firstLine.seqInSets = this.seqInSets;
                        arrow.splice(this.seqInSets, 1, firstLine);
                        secondLine = _drawLine([["M", thisPath[1][1], thisPath[1][2]], ["L", thisPath[1][1], e.y]]);
                        secondLine.prevLine = firstLine;
                        secondLine.seqInSets = this.seqInSets + 1;
                        firstLine.nextLine = secondLine
                        arrow.splice(this.seqInSets + 1, 0, secondLine);

                        thisPath[0][2] = thisPath[2][2] = e.y;
                        thisPath[0][1] = thisPath[1][1];

                        thirdLine = _drawLine(thisPath);
                        thirdLine.prevLine = secondLine;
                        secondLine.nextLine = thirdLine;
                        thirdLine.nextLine = this.nextLine;
                        thirdLine.nextLine.prevLine = thirdLine;
                        thirdLine.seqInSets = this.seqInSets + 2;

                        this.remove();
                        arrow.splice(thirdLine.seqInSets, 0, thirdLine);
                        _bindDrag(firstLine, isHorizontal);
                        _bindDrag(secondLine, !isHorizontal);
                        _bindDrag(thirdLine.nextLine, !isHorizontal);
                    }
                    else {
                        firstLine = _drawLine([["M", thisPath[0][1], e.y], ["L", thisPath[1][1], e.y]]);
                        firstLine.prevLine = this.prevLine;
                        firstLine.prevLine.nextLine = firstLine;
                        firstLine.seqInSets = this.seqInSets;
                        arrow.splice(this.seqInSets, 1, firstLine);

                        secondLine = _drawLine([["M", thisPath[1][1], e.y], thisPath[1]]);
                        secondLine.prevLine = firstLine;
                        secondLine.seqInSets = this.seqInSets + 1;
                        firstLine.nextLine = secondLine
                        arrow.splice(this.seqInSets + 1, 0, secondLine);

                        thisPath[0][1] = thisPath[1][1];
                        thirdLine = _drawLine(thisPath);
                        thirdLine.prevLine = secondLine;
                        secondLine.nextLine = thirdLine;
                        thirdLine.seqInSets = this.seqInSets + 2;
                        this.remove();
                        arrow.splice(thirdLine.seqInSets, 0, thirdLine);

                        _bindDrag(firstLine.prevLine, !isHorizontal);
                        _bindDrag(firstLine, isHorizontal);
                        _bindDrag(secondLine, !isHorizontal);

                    }
                    _bindDrag(_combineLine(thirdLine, isHorizontal), isHorizontal);

                }
            } else {
                if (isHorizontal) {
                    thisPath[0][2] = thisPath[2][2] = nextPath[0][2] = prevPath[2][2] = e.y;
                    _reDrawLine(this.prevLine, prevPath);
                    _bindDrag(this.prevLine, !isHorizontal);
                    _reDrawLine(this.nextLine, nextPath);
                    _bindDrag(this.nextLine, !isHorizontal);
                }
                else {
                    thisPath[0][1] = thisPath[2][1] = nextPath[0][1] = prevPath[2][1] = e.x;
                    _reDrawLine(this.prevLine, prevPath);
                    _bindDrag(this.prevLine, !isHorizontal);
                    _reDrawLine(this.nextLine, nextPath);
                    _bindDrag(this.nextLine, !isHorizontal);
                    //�������Line�����һ����
                    if (!this.nextLine.nextLine) {
                        if (e.x > p[7].x) {
                            nextPath = Raphael.parsePathString(this.nextLine.attr("path"))
                        }
                    }
                }
                _bindDrag(_combineLine(_reDrawLine(this, thisPath), isHorizontal), isHorizontal);
            }
            LineClick1(arrow);
        }

        function _endArrowDragStart(x, y, e) {
            var prevLine = arrow[arrow.length - 3];
            prevLine.hide();
            LineClick1(arrow);

        }

        function _endArrowDraging(dx, dy, x, y,e) {
            var prevLine = arrow[arrow.length - 3];
            var prevPath = Raphael.parsePathString(prevLine.attr("path"));
            //�Ƿ�Ϊˮƽ��
            if (prevPath[0][2] == prevPath[2][2]) {
                prevPath[1][0] = "L";
                prevPath[1][1] = e.x;
                prevPath[1][2] = prevPath[0][2];

                prevPath[2][0] = "L";
                prevPath[2][1] = e.x;
                prevPath[2][2] = e.y;
            }
            var tempLine = this.data("tempLine");
            if (tempLine)
                tempLine.remove();
            this.data("tempLine", paper.path(prevPath.join(",")).attr({ "stroke-width": lineHeight, "stroke": "#f00" }));
            this.transform("t" + dx + "," + dy);
        }
        function _endArrowDragEnd(e) {
            
            //var prevLine = arrow[arrow.length - 3];
            //var prevPath = Raphael.parsePathString(prevLine.attr("path"));
            ////�Ƿ�Ϊˮƽ��
            //if (prevPath[0][2] == prevPath[2][2]) {
            //    prevPath[1][0] = "L";
            //    prevPath[1][1] = e.x;
            //    prevPath[1][2] = prevPath[0][2];
            //    prevPath[2][0] = "L";
            //    prevPath[2][1] = e.x;
            //    prevPath[2][2] = e.y;
            //}
            //var nowLine = paper.path(prevPath.join(",")).attr({ "stroke-width": lineHeight, "stroke": "#f00" })
            //nowLine.prevLine = prevLine.prevLine;
            //nowLine.seqInSets = prevLine.seqInSets;

            //prevLine.remove();

            //arrow.splice(nowLine.seqInSets, 1, nowLine);
            //LineClick1(arrow);
        }

        function _combineLine(line, isHorizontal) {
            var thisPath = Raphael.parsePathString(line.attr("path")), nextPath, prevPath, diff;
            if (line.prevLine && line.prevLine.prevLine && Raphael.getTotalLength(line.prevLine.attr("path")) < 3) {
                _removeLine(line.prevLine);
                prevPath = Raphael.parsePathString(line.prevLine.attr("path"));
                if (isHorizontal) {
                    thisPath[0][1] = prevPath[0][1];
                    diff = prevPath[0][2] - thisPath[2][2];
                    if (Math.abs(diff) > 1) {
                        thisPath[0][2] = thisPath[2][2] = prevPath[0][2];
                        if (line.nextLine) {
                            nextPath = Raphael.parsePathString(line.nextLine.attr("path"));
                            nextPath[0][2] = thisPath[2][2];
                            _reDrawLine(line.nextLine, nextPath);
                        }
                    }
                }
                else {
                    thisPath[0][2] = prevPath[0][2];
                    diff = prevPath[0][1] - thisPath[2][1];
                    if (Math.abs(diff) > 1) {
                        thisPath[0][1] = thisPath[2][1] = prevPath[0][1];
                        if (line.nextLine) {
                            nextPath = Raphael.parsePathString(line.nextLine.attr("path"));
                            nextPath[0][1] = thisPath[2][1];
                            _reDrawLine(line.nextLine, nextPath);
                        }
                    }
                }
                _removeLine(line.prevLine);
                line = _reDrawLine(line, thisPath);

            }
            if (line.nextLine && line.nextLine.nextLine && Raphael.getTotalLength(line.nextLine.attr("path")) < 3) {
                _removeLine(line.nextLine);
                nextPath = Raphael.parsePathString(line.nextLine.attr("path"));
                if (isHorizontal) {
                    thisPath[2][1] = nextPath[2][1];
                    diff = nextPath[0][2] - thisPath[2][2];
                    if (Math.abs(diff) > 1) {
                        thisPath[0][2] = thisPath[2][2] = nextPath[0][2];
                        if (line.prevLine) {
                            prevPath = Raphael.parsePathString(line.prevLine.attr("path"));
                            prevPath[2][2] = thisPath[0][2];
                            _reDrawLine(line.prevLine, prevPath);
                        }
                    }
                }
                else {
                    thisPath[2][2] = nextPath[2][2];
                    diff = nextPath[0][1] - thisPath[2][1];
                    if (Math.abs(diff) > 1) {
                        thisPath[0][1] = thisPath[2][1] = nextPath[0][1];
                        if (line.prevLine) {
                            prevPath = Raphael.parsePathString(line.prevLine.attr("path"));
                            prevPath[2][1] = thisPath[0][1];
                            _reDrawLine(line.prevLine, prevPath);
                        }
                    }
                }
                _removeLine(line.nextLine);
                line = _reDrawLine(line, thisPath);
            }
            return line;
        }
        /*** 
        **** ��һ����Ǩ�������Ƴ�һ���߶�
        ***/
        function _removeLine(line) {
            if (line.prevLine) {
                if (line.nextLine) {
                    line.prevLine.nextLine = line.nextLine;
                    line.nextLine.prevLine = line.prevLine;
                } else
                    delete line.prevLine.nextLine;
            } else if (line.nextLine)
                delete line.nextLine.prevLine;
            var nextLine = line.nextLine
            while (nextLine) {
                nextLine.seqInSet -= 1;
                nextLine = nextLine.nextLine;
            }
            arrow.splice(line.seqInSets, 1);
            line.remove();
        }

        /*** 
        **** ������ʼ�����ֱ�ߣ�����һ���е�
        ***/
        function _drawLine(path) {
            if (path.length == 3)
                path.splice(1, 1);
            var isHorizontal = path[0][2] == path[1][2];
            path.splice(1, 0, ["l", isHorizontal ? (parseFloat(path[1][1]) - parseFloat(path[0][1])) / 2 : 0, isHorizontal ? 0 : (parseFloat(path[1][2]) - parseFloat(path[0][2])) / 2]);
            var line = paper.path(path.join(",")).attr({ "stroke-width": lineHeight, "stroke": "#333" });
            line.direction = isHorizontal ? path[0][1] < path[2][1] ? "right" : "left" : path[0][2] < path[2][2] ? "down" : "up";
            //if (bWithDrag && (!atFirstOrLast || Raphael.getTotalLength(line.attr("path")) > minLineLength)) {
            //    line.attr({ "cursor": isHorizontal ? "ns-resize" : "ew-resize" })
            //        .drag(_lineDraging, _lineDragStart, _lineDragEnd);;
            //}
            return line;
        }

        /***
        **** ���»���ֱ�ߣ�ԭֱ�ߵ����Լ̳С�
        ***/
        function _reDrawLine(line, path) {
            var nowLine = _drawLine(path);
            if (line.prevLine) {
                line.prevLine.nextLine = nowLine;
                nowLine.prevLine = line.prevLine;
            }
            if (line.nextLine) {
                line.nextLine.prevLine = nowLine;
                nowLine.nextLine = line.nextLine;
            }
            nowLine.seqInSets = line.seqInSets;
            line.remove();
            nowLine.attr({ "stroke": "#f00" });
            arrow.splice(nowLine.seqInSets, 1, nowLine);
            return nowLine;
        }

        /*** 
        **** ΪLine banding drag�¼���
        ***/
        function _bindDrag(line, isHorizontal) {
            if ((line.prevLine && line.nextLine) || Raphael.getTotalLength(line.attr("path")) > minLineLength)
                line.attr({ "cursor": isHorizontal ? "ns-resize" : "ew-resize" }).drag(_lineDraging, _lineDragStart, _lineDragEnd);
        }

        if (line && line.line) {
            line.line.forEach(function (p) {
                p.remove();
            });
            line.line.clear();
            var arrow = line.line;
            arrow.push(paper.path(triangle(x4, y4, arrowBC, y3 == y4, (y3 == y4 ? x3 > x4 : y3 > y4))).attr({ "fill": "#333", "stroke-width": "2", "stroke": "#333" }));
            var prevLine, nowLine;
            for (var lineseq = 0; lineseq < path.length; lineseq++) {
                nowLine = _drawLine(path[lineseq]);
                arrow.push(nowLine);
                if (prevLine)
                    prevLine.nextLine = nowLine;
                nowLine.prevLine = prevLine;
                prevLine = nowLine;
                nowLine.seqInSets = lineseq;
                _bindDrag(nowLine, path[lineseq][1][2] == 0);
            }
        } else {
            var arrow = paper.set();
            var prevLine, nowLine;
            for (var lineseq = 0; lineseq < path.length; lineseq++) {
                nowLine = _drawLine(path[lineseq]);
                arrow.push(nowLine);
                if (prevLine)
                    prevLine.nextLine = nowLine;
                nowLine.prevLine = prevLine;
                prevLine = nowLine;
                nowLine.seqInSets = lineseq;
                _bindDrag(nowLine, path[lineseq][1][2] == 0);
            }
            var endArrow = paper.path(triangle(x4, y4, arrowBC, y3 == y4, (y3 == y4 ? x3 > x4 : y3 > y4)))
                .attr({ "fill": "#333", "stroke-width": "2", "stroke": "#333", "cursor": "move" })
                .drag(_endArrowDraging, _endArrowDragStart, _endArrowDragEnd);
            //endArrow.prevLine = nowLine;
            arrow.push(endArrow);
            arrow.push(paper.circle(path[0][0][1], path[0][0][2], 2));
            return {
                line: arrow,// this.path(path).attr({ stroke: color, fill: "none" }).click(clickLine),
                from: obj1,
                to: obj2,
                fromTo: res,
                points: { start: { x: x1, y: y1 }, end: { x: x4, y: y4 } } //,
                //intersectionLines: intersection.intersectionLines
            };
        }
    };
})();

///**
//* Calculate angle to rotate arrow head by
//* This function was inspired by: http://taitems.tumblr.com/post/549973287/drawing-arrows-in-raphaeljs
//*/
//function arrowHeadAngle(x1, y1, x2, y2) {
//    var angle = Math.atan2(x1 - x2, y2 - y1);
//    angle = ((angle / (2 * Math.PI)) * 360) + 180;
//    return angle;
//}

/**
* String that represents a triangle path on canvas
* Adapted from raphael.primitives.js
* For more info visit: https://github.com/DmitryBaranovskiy/raphael
*/
function triangle(cx, cy, r, bV, bDesc) {
    if (bV) {
        var diffV = r * Math.sin(120 * Math.PI / 360);
        if (bDesc)
            diffV = 0 - diffV;
        return ["M", cx, cy, "L", cx, cy - r / 2.0, "L", cx + diffV, cy, "L", cx, cy + r / 2.0, " z"].join(",");
    } else {
        var diffH = r * Math.sin(120 * Math.PI / 360);
        if (bDesc)
            diffH = 0 - diffH;
        return ["M", cx, cy, "L", cx - r / 2.0, cy, "L", cx, cy + diffH, "L", cx + r / 2.0, cy, " z"].join(",");
    }
    // return "M".concat(cx, ",", cy, "m0-", r * .58, "l", r * .5, ",", r * .87, "-", r, ",0z");
}

function triangle2(cx, cy, r, aSin, x, y) {
    return ["M", cx, cy, "L", (cx + (r * aSin / 2)).toFixed(3), (cy - (r * (Math.exp(1 - Math.pow(aSin, 2))) / 2)).toFixed(3), "L", x, y, "L", (cx - (r * aSin / 2)).toFixed(3), (cy + (r * (Math.exp(1 - Math.pow(aSin, 2))) / 2)).toFixed(3), " z"].join(",");
}

