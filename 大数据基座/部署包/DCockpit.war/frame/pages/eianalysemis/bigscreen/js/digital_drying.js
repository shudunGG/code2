/**!
* 数字驾驶舱-数字晾晒台指标
* date:2021-02-24
* author: xulei;
*/

'use strict';
/* global pageConfig, getNormoperaList */

(function (win, $) {
    var M = Mustache,
        $list = $('#list'),
        itemTmpl = $('#item-tmpl').html();

    Util.hidePageLoading();

    var indexDemandCircle = function(guid){
    	//epoint.showTips('圈阅成功');
    	Util.openTopLayer({
            title: '指标圈阅',
            id: '',
            width: '6.2rem',
            height: '5.25rem',
            url: './circle_supervise.html?guid=' + guid,
        });
    };
    
    // 指标需求反馈
    var indexDemandFeedback = function (guid) {
        //epoint.showTips('反馈成功');
        // TODO：此处仅为示例弹窗，具体弹窗请业务开发自行参照开发
         Util.openTopLayer({
             title: '指标需求反馈',
             id: '',
             width: '6.2rem',
             height: '5.25rem',
             url: './start_supervise.html?guid=' + guid,
         });
    };

    // 发起红灯
    var startRed = function (guid) {
        //epoint.showTips('发起红灯成功');
        // TODO：此处仅为示例弹窗，具体弹窗请业务开发参照原型开发
         Util.openTopLayer({
             title: '发起红灯',
             id: '',
             width: '6.2rem',
             height: '5.25rem',
             url: './redlight_supervise.html?guid=' + guid,
         });
    };

    // 指标订阅
    var handleSubscribe = function (guid) {
        Util.ajax({
            url: pageConfig.addSubscribeNorm,
            async: false,
            data: {
                params: JSON.stringify({
                	subscriber: "45f0c5f9-cad2-49e6-887d-b38dfcbc23de",
                	normGuid:guid,
                	cockpitGuid:'',
                	columnGuid:'',
                	projectCateGuid:'',
                	projectGuid:'',
                	plateGuid:'',
                	cardCateGuid:'',
                	cardGuid:''
                })
            },
            success: function (data) {
            	epoint.showTips('订阅成功');
            }
        });
    };

    // 指标比对
    var indexThan = function (guid) {
        // TODO：此处仅为示例弹窗，具体弹窗请业务开发参照原型开发
        Util.openTopLayer({
            title: '指标比对',
            id: '',
            width: '6.2rem',
            height: '5.25rem',
            url: './start_supervise.html?guid=' + guid,
        });
    };
    $('.info-table').on('click', '.operation-btn', function () {
        var $this = $(this),
            $item = $this.closest('tr'),
            guid = $item.data('guid');

        // 指标需求反馈
        if ($this.hasClass('feedback-btn')) {
            indexDemandFeedback(guid);
        } else if ($this.hasClass('startred-btn')) { // 指标需求反馈
            startRed(guid);
        } else if ($this.hasClass('subscribe-btn')) { // 指标需求反馈
            handleSubscribe(guid);
        } else if ($this.hasClass('comparison-btn')) { // 指标需求反馈
            indexThan(guid);
        } else if($this.hasClass('circle-btn')){
        	indexDemandCircle(guid);
        }
    });

    // 请求列表
    win.getNormoperaList = function () {
        Util.ajax({
            url: pageConfig.queryAllNorm,
            async: false,
            data: {
                params: JSON.stringify({
                	userguid: "45f0c5f9-cad2-49e6-887d-b38dfcbc23de",
                	normname:"",
                    pageSize:10,
                    pageIndex:0
                })
            },
            success: function (data) {
            	 var list = data.result;
//                var list = [
//                    {name: '城市面积', guid: '1'},
//                    {name: '本年GDP总额', guid: '1'},
//                    {name: '幸福指数', guid: '1'},
//                    {name: '平安治理指数', guid: '1'},
//                    {name: '交通运行指数', guid: '1'},
//                    {name: '畅游指数', guid: '1'},
//                    {name: '本年人口指数', guid: '1'},
//                    {name: '人口增长指数', guid: '1'},
//                    {name: '城市发展指标', guid: '1'},
//                    {name: '能源用量-供水', guid: '1'},
//                    {name: '能源用量-电力', guid: '1'},
//                    {name: '能源用量-燃气', guid: '1'},
//                ]
                if(Util.getUrlParams('type')){
                    // 渲染列表
                    $list.html(Util.clearHtml(M.render(itemTmpl, {
                        list: list
                    })));
                }
                else{
                    $list.html(Util.clearHtml(M.render(itemTmpl, {
                        list: data.list
                    })));
                }
            }
        });
    };

    getNormoperaList();
})(this, jQuery);