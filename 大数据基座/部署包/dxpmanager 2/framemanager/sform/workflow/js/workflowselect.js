﻿/// <reference path="raphael-min.js" />
/// <reference path="graffle.js" />
var paper, ActivitySets = {}, ActivityImages = {}, connections = [], lines = {}, curOperateType = 'zz',
    startShape, tempLine, targetNode, old_id, arrowBC = 10, activityBeforeCreate, CurNodeType, CurNodeID,
    CurX, CurY;

function ReadXMLHd(responseText) {
    var NodeName = null;
    var workFlow = JSON.parse(responseText);
    //流程图的详细节点信息
    //节点
    $.each(workFlow.Nodes, function (k, node) {
        NodeName = node.Name;
        if (node.Type == "Begin")
            NodeName = "开始";
        else if (node.Type == "End")
            NodeName = "结束";
        createNode(node.Type, node.Id, NodeName, parseInt(node.X) / 10, parseInt(node.Y) / 10).attr({ cursor: "move" });
    });
    //变迁
    $.each(workFlow.Actions, function (k, action) {
        var line = paper.arrowSet(ActivityImages[action.BeginShape], ActivityImages[action.EndShape], "#333", "#333|2", arrowBC);
        lines[action.Id] = line;
        line.line.data("id", action.Id);
        line.line[0].data("id", action.Id);
        line.line.mousedown(function (e) {
            LineClick(e, this.data("id"));
        });
        //line.bg.data("LineId", action.Id);
        connections.push(line);
    });
    paper.safari();
    //创建活动
}

function createNode(NodeType, NodeId, txt, x, y) {
    if (NodeType == "Templete")
        return;
    var imgUrl = "";
    switch (NodeType) {
        case "Begin":
            imgUrl = "../image/StartNewVml.jpg";
            break;
        case "End":
            imgUrl = "../image/EndNewVml.jpg";
            break;
        case "ManualTemplete":
            imgUrl = "../image/ManuralTemplete.jpg";
            break;
        case "Manual":
            imgUrl = "../image/ManualNewVml.jpg";
            break;
        case "PassSign":
            imgUrl = "../image/PassSign.jpg";
            break;
        case "JoinSign":
            imgUrl = "../image/JoinSign.jpg";
            break;    
        case "External":
            imgUrl = "../image/External.jpg";
            break;
        case "Browser":
            imgUrl = "../image/BrowserVml.jpg";
            break;
        case "Suspension":
            imgUrl = "../image/Suspension.jpg";
            break;
        case "Router":
            imgUrl = "../image/RouterNewVml.jpg";
            break;
        case "SubProcess":
            imgUrl = "../image/SubProcessNewVml.jpg";
            break;
    }
    paper.setStart();
    //var rect = paper.rect(x - Math.max(Math.max(60, txt.length * 16) / 2 - 20, 10), y - 10, Math.max(60, txt.length * 16), 70, 2)
    //    .attr("stroke-width", 0)
    //.data("NodeId", NodeId)
    var img = paper.image(imgUrl, x, y, 40, 40)
    .mousedown(function (e) {
    	closeDialog(this.data("Text")+"★"+this.data("NodeId"));
    })
    .data("NodeId", NodeId).data("NodeType", NodeType).data("Text", txt);
    paper.text(x + 20, y + 55, txt).attr("font-size", "14px").attr("font-family", "微软雅黑");

    var set = paper.setFinish();
    ActivitySets[img.id] = set;
    ActivityImages[NodeId] = img;
    //ActivityRect[NodeId] = rect;
    return img;
}



