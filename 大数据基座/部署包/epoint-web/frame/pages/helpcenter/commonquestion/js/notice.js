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

function setPageView(id) {
    return Util.ajax({
        url: Util.getRightUrl("rest/feedbackdatademoaction/setPageView?isCommondto=true",""),
        data:{
        	cInfoGuid: id
        }
    }).done(function (data) {
    });
}

var DEFAULT_PAGE_SIZE = 10;
// 最小高度计算
function adjustMinHieght() {
    var main_h = $('.main').height();
    $('#left').add('#right').css('min-height', main_h - 36);
}
adjustMinHieght();

// 左侧分类点击
(function (win, $) {
    $('#left').on('click', '.type-item-self', function () {
        var $this = $(this),
            type = $this.data('type'),
            name = $this.attr('title');

        $this.addClass('active').siblings().removeClass('active');

        handeleTypeClick(type, name);
    });
    var $historyType = $('#notice-type-history');
    $('.no-new-tips').on('click', '.btn', function () {
        $historyType.trigger('click');
    });

})(this, jQuery);

// 公告列表
(function (win, $) {

    var $noticeContainer = $('#notice-container');
    var $noticeList = $('#notice-list');
    var $noticeListTitle = $('#notice-type');

    var NOTICE_TPL = '<div class="notice-item {{#isNew}}is-new{{/isNew}}" data-id="{{id}}"><span class="text" title="{{text}}">{{{shortText}}}</span><span class="date">{{date}}</span></div>';

    // 渲染列表
    function renderNoticeList(data, kd) {
        var html = [];
        var reg = kd ? new RegExp(kd, 'ig') : false;
        $.each(data, function (i, item) {
            if (reg) {
                item.text = item.text.replace(reg, '<span class="kd">' + kd + '</span>');
            }
            // item.shortText = item.isNew ? item.text.substr(0, 36) : item.text;
            item.shortText = item.text;
            html.push(Mustache.render(NOTICE_TPL, item));
        });

        return $(arrayJoin(html));
    }

    // 获取数据
    function getNoticeListByType(typeId, pageIndex, pageSize) {
        pageIndex = pageIndex || 0;
        pageSize = pageSize || DEFAULT_PAGE_SIZE;
        return Util.ajax({
            url: Util.getRightUrl(getNoticeListUrl,''),
            data: {
            	newFlag: typeId,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }).done(function (data) {
        	var dataJson = JSON.parse(data.noticeData);
        	if (!dataJson.list || !dataJson.list.length) {
                $noticeList.empty();
                if (typeId == 'history') {
                    $('.btn').addClass('hidden')
                }else {
                	 $('.btn').removeClass('hidden')
                }
                return $noticeContainer.addClass('no-result');
            }
            $noticeContainer.removeClass('no-result');
            $('.btn').removeClass('hidden')
            $(renderNoticeList(dataJson.list)).appendTo($noticeList.empty());

            noticeListPager.setPageSize(pageSize);
        });
    }
    var noticeListPager = mini.get('notice-list-pagination');

    // 分类变化时重新获取数据
    noticeListPager.on('pagechanged', function (e) {
        var index = e.pageIndex,
            size = e.pageSize;
        getNoticeListByType($noticeListTitle.data('id'), index, size);
    });

    function handeleTypeClick(id, name) {
        getNoticeListByType(id).done(function (data) {
            // 确保可见
            $noticeContainer.removeClass('hidden').siblings().addClass('hidden');

            $noticeListTitle.data('id', id).text(name).attr('title', name);
            if (data.total > DEFAULT_PAGE_SIZE) {
                noticeListPager.setVisible(true);
                noticeListPager.setTotalCount(data.total);
            } else {
                noticeListPager.setVisible(false);
            }
            if(id == 'new') {
            	var $childs = $noticeList.children();
            	if($childs.length) {
            		$childs.eq(0).trigger('click');
            	}
            }
        });
    }
    handeleTypeClick('new', '最新公告');
    // 开放供给左侧点击
    win.handeleTypeClick = handeleTypeClick;

    // 点击查看详情
    var $detailContainer = $('#notice-detail'),
        $detailTitle = $('.detail-title', $detailContainer),
        $detailContent = $('.notice-detail-content', $detailContainer);
    var $goBackAim; // 记录详情页返回的容器，分类列表还是搜索列表

    $('#right').on('click', '.notice-item', function () {
        var $this = $(this),
            id = $this.data('id'),
            name = $this.find('> .text').text();
        $goBackAim = $this.closest('.right-main-content');
        // 遮罩
        getNoticeDetailById(id).done(function () {
            $detailTitle.text(name).attr('title', name);
            $detailContainer.removeClass('hidden').siblings().addClass('hidden');
            // 移除遮罩
        });
    });
    $detailContainer.on('click', '.go-back', function () {
        if ($goBackAim) {
            $goBackAim.removeClass('hidden').siblings().addClass('hidden');
        }
    });

    function getNoticeDetailById(id) {
        return Util.ajax({
            url: Util.getRightUrl(getNoticeDatailUrl,''),
            data: {
            	cInfoGuid: id
            }
        }).done(function (data) {
            $($.parseHTML(data.contHtml)).appendTo($detailContent.empty());
            // 查看详情后记录一下访问量
            setPageView(id);
        });
    }

})(window, jQuery);