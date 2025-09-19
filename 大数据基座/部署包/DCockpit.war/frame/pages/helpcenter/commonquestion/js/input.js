function arrayJoin(arr, joint) {
    joint = joint || '';
    var i = 1;
    var len = arr.length;
    var str = arr[0];
    while (i < len) {
        str += joint + arr[i++];
    }
    return str;
}
var $myFeedback = $('#my-feedback');
(function (win, $) {

    var FEEDBACK_TPL = '<div class="feedbak-item" data-id="{{id}}" data-name="{{text}}"><span class="icon" style="background:{{typeBg}};">{{typeText}}</span><span class="text" title="{{text}}">{{{text}}}</span><span class="state" style="color:{{stateColor}}">{{stateText}}</span></div>';
    var DEFAULT_PAGE_SIZE = 7;
    // 最小高度计算
    function adjustMinHieght() {
        var h = $(window).height() - 66 - 36;
        if (h) {
            // - 头部 75 边距 20 分页 40
            DEFAULT_PAGE_SIZE = (h - 75 - 20 - 40) / 71 >> 0;
            $('.main .content-wrap').css('min-height', h);
        }
    }
    adjustMinHieght();

    var $list = $('.my-feedback-list', $myFeedback);

    var feedbackPager = mini.get('my-feedback-pagination');

    function renderFeedbackList(data) {
        var html = [];
        $.each(data, function (i, item) {
            html.push(Mustache.render(FEEDBACK_TPL, $.extend({}, item, genderFeedbackItemInfos(item))));
        });
        return $(arrayJoin(html)).appendTo($list.empty().removeClass('empty'));
    }

    function getFeedbakcData(pageIndex, pageSize) {
        pageSize = pageSize || DEFAULT_PAGE_SIZE;
        pageIndex = pageIndex || 0;
        return Util.ajax({
            url: Util.getRightUrl(getMyFeedbackUrl,""),
            data: {
                pageSize: pageSize,
                pageIndex: pageIndex
            }
        }).done(function (data) {
        	var jsonData = JSON.parse(data.feedbackList);
            if (jsonData.total == 0) {
                $list.empty().addClass('empty');
                feedbackPager.setVisible(false);
                return;
            }

            if (jsonData.total > pageSize) {
                feedbackPager.setVisible(true);
            } else {
                feedbackPager.setVisible(false);
            }
            feedbackPager.setTotalCount(jsonData.total);
            feedbackPager.setPageSize(pageSize);
            renderFeedbackList(jsonData.list);
        });
    }
    feedbackPager.on('pagechanged', function (e) {
        var index = e.pageIndex,
            size = e.pageSize;
        getFeedbakcData(index, size);
    });
    getFeedbakcData();
    win.getFeedbakcData = getFeedbakcData;
    $myFeedback.on('click', '.feedbak-item', function () {

        getFeedbackDetail($(this).data('id')).done(function () {
            $myFeedback.addClass('hidden');
            $feedbakcDetail.removeClass('hidden');
        });
    });

})(this, jQuery);


// 反馈详情
var $feedbakcDetail = $('#feedback-detail');
(function (win, $) {
    var FEEDBACK_DETAIL_HEADER = '<h1 class="title">{{title}}</h1><div class="ext-info"><span class="type">反馈类型：{{type}}</span><span class="type">所属功能：{{fullCategory}}</span></div>';
    var FEEDBACK_DETAIL_FLOW = '<div class="feedback-flow-item {{#isFirst}}active{{/isFirst}}"><span class="flow-info">{{action}} &nbsp;{{date}}</span><div class="flow-content">{{{content}}}</div></div>';
    var $feedbakcDetailHeader = $('.header-info', $feedbakcDetail),
        $feedbakcDetailContent = $('.detail-wrap', $feedbakcDetail),
        $viewMore = $('.view-btn', $feedbakcDetail),
        $feedbakcDetailFlowList = $('.feedback-flow-list', $feedbakcDetail),
        $addFeedbackFlowBtn = $('.add-feedback-flow', $feedbakcDetail);

    // 渲染反反馈详情
    var rowGuid;
    function rednerFeedbackDetail(data, id) {
    	$feedbakcDetail.attr('detailGuid', id);
        // 头部信息
        $(Mustache.render(FEEDBACK_DETAIL_HEADER, data)).appendTo($feedbakcDetailHeader.empty());
        // 内容
        $(data.contentHTML).appendTo($feedbakcDetailContent.empty().removeClass('isover'));
        // 流程列表
        var html = [];
        $.each(data.flowList, function (i, item) {
            if (i === 0) {
                item.isFirst = true;
            }
            // <p>1222<img src=\"/epoint-web/frame/fui/js/widgets/ewebeditor/uploadfile/20180929084153828001.png\" border=\"0\"><br></p>
            // 
            item.content = item.content.replace(/\\"/g,"'");
            html.push(Mustache.render(FEEDBACK_DETAIL_FLOW, item));
        });
        $(arrayJoin(html)).appendTo($feedbakcDetailFlowList.empty());
        // 已经完成则反馈按钮不可见
        if (data.state == '2') {
            $addFeedbackFlowBtn.addClass('hidden');
        } else {
            $addFeedbackFlowBtn.removeClass('hidden');
        }
        setTimeout(function () {
            // 内容区域高度处理
            if ($feedbakcDetailContent.height() > 300) {
                $feedbakcDetailContent.addClass('isover');
                $viewMore.text('详细信息').removeClass('view-less hidden').addClass('view-more');
            } else {
                $viewMore.addClass('hidden');
            }
        }, 20);
    }

    // 新增一条反馈信息
    function addAnFeddbackFlow(data) {
        $(Mustache.render(FEEDBACK_DETAIL_FLOW,data)).prependTo($feedbakcDetailFlowList);
        $feedbakcDetailFlowList.find('.feedback-flow-item').removeClass('active').eq(0).addClass('active');
    }
    win.addAnFeddbackFlow = addAnFeddbackFlow;

    function getFeedbackDetail(id) {
        return Util.ajax({
            url: Util.getRightUrl(getFeedbackDetailUrl,""),
            data: {
                id: id
            }
        }).done(function (data) {
            rednerFeedbackDetail(JSON.parse(data.detailInfoData),id);
        });
    }

    window.getFeedbackDetail = getFeedbackDetail;

    // 内容更多更少
    $viewMore.on('click', function () {
        var $this = $(this);
        if ($this.hasClass('view-less')) {
            $this.text('详细信息').removeClass('view-less').addClass('view-more');
            $feedbakcDetailContent.addClass('isover');
        } else {
            $this.text('收起详细信息').addClass('view-less').removeClass('view-more');
            $feedbakcDetailContent.removeClass('isover');
        }
    });
    // 返回
    $feedbakcDetail.on('click', '.go-back', function () {
        $feedbakcDetail.addClass('hidden');
        $myFeedback.removeClass('hidden');
    });

})(this, jQuery);

// 新增反馈
var $addFeedBack = $('#add-feedback');
(function (win, $) {
    var isFirstEnter = true;
    // 第一次进入时发请求检查用户信息
    function getUserInfoisFull() {
        return Util.ajax({
            url: Util.getRightUrl(getCheckUserInfoUrl,"")
        }).then(function (data) {
            return data.flag;
        });
    }
    // 利用miniui的messagebox 构造新的提示框
    var DiyMessageBox = mini.MessageBox;
    DiyMessageBox.buttonText.ok = '去完善';
    DiyMessageBox.buttonText.cancel = '忽略';
    // 返回
    $addFeedBack.on('click', '.go-back', function () {
        $addFeedBack.addClass('hidden');
        $myFeedback.removeClass('hidden');

    });
    
    //获取系统参数中配置反馈问题流程processGuid
    function getSystemParamProcessGuid() {
        return Util.ajax({
            url: Util.getRightUrl(systemParamGetUrl,"")
        }).then(function (data) {
            return data?data.processGuid:"";
        });
    }
    
    //发起流程
    function startProcess(){
    	getSystemParamProcessGuid().done(function(guid){
    		if(guid){
    			epoint.openTopDialog(
                        '反馈问题',
                        "frame/pages/epointworkflow/client/processcreateinstance?ProcessGuid="+guid+"",
                        function(){
                        	getFeedbakcData();
                        },{
                        	width:1200,
                        	height:600
                        });
    		}else{
    			epoint.alert("您尚未配置问题反馈提交流程系统参数，请先前往配置！");
    		}
    	})
    }
    // 点击进入
    $myFeedback.on('click', '.new-feedback', function () {
    	if (isFirstEnter) {
            getUserInfoisFull().done(function (isFull) {
                if (isFull == "false") {
                    DiyMessageBox.show({
                        title: '系统提醒',
                        iconCls: 'mini-messagebox-info',
                        message: '您的联系方式尚未完善，为方便与您联系， 请您尽快前往 个人中心 完善。',
                        buttons: ['ok', 'cancel'],
                        callback: function (action) {
                            if (action == 'ok') {
                                //window.open(Util.getRightUrl(fillUserInfoUrl,""));
                            	epoint.openTopDialog(
                                        '个人信息',
                                        Util.getRightUrl(fillUserInfoUrl,""),
                                        function(){
                                        	getFeedbakcData();
                                        });	
                            	
                            }
                            isFirstEnter = false;
                        }
                    });
                }else{
                	startProcess();
                	
                }
            });
        }else {
        	startProcess();
//        $addFeedBack.removeClass('hidden');
//        $myFeedback.addClass('hidden');
        }
    });
})(this, jQuery);