/**
 * 卡片模板管理
 * date: 2020-03-16
 * author: guohanyu
 **/
'use strict';

/* global pageConfig */
(function (win, $) {

    var $cardItems = $('#card-items'),
        $searchBox = $('.search-box'),
        $searchIpt = $('.search-input'),
        $body = $('body'),
        cardPager = mini.get('cardpageer'),
        status = mini.get('status'),
        cardItemsTmpl = $('#card-items-tmpl').html();

    // 列表条件
    var param = {
        pageIndex: 0,
        pageSize: 12,
        type: '',
        keyword: '',
    };

    // 扩展排序输入框点击区域
    $cardItems.on('click', '.order-area', function () {
        var $this = $(this);
        $this.find('.order-ipt')[0].focus();
    });

    // 点击开始排序,给下列表加类名,显示排序号
    win.startOrder = function () {
        $body.addClass('showorder');
    };

    // 取消排序事件
    win.cancelOrder = function () {
        // 取消排序，数据回填
        $.each($('.order-ipt.changed'), function (index, item) {
            var $item = $(item);
            $item.val($item.data('oldvalue'));
        });
        $('.order-ipt.changed').removeClass('changed');
        hideOrder();
    };

    // 保存排序事件,发请求,去类名
    win.saveOrder = function () {
        var params = [];
        $.each($('.order-ipt.changed'), function (index, item) {
            var $item = $(item),
                guid = $item.data('id'),
                ordernum = $item.val();
            params.push({
                id: guid,
                order: ordernum,
            });
        });
        editOrderNum(params);
    };

    var hideOrder = function () {
        $body.removeClass('showorder');
    };

    // 获取卡片列表
    var getCardList = function () {
        Util.ajax({
            type: 'post',
            url: pageConfig.getCardListUrl,
            data: {
                params: JSON.stringify({
                    data: param
                })
            },
        }).done(function (data) {
            var dataList = data.dataList;
            $.each(dataList, function (index, item) {
                if (item.status === 'enable') {
                    item.statusshow = '启用';
                    item.statusBtnShow = '停用';
                } else {
                    item.statusshow = '停用';
                    item.statusBtnShow = '启用';
                }
            });
            cardPager.update(param.pageIndex, param.pageSize, data.total);
            $cardItems.html(Mustache.render(cardItemsTmpl, data));
        });
    };

    getCardList();

    // 翻页事件
    win.onPageChanged = function (e) {
        param.pageIndex = e.pageIndex;
        param.pageSize = e.pageSize;
        getCardList();
    };

    // 全部状态事件
    win.typeChange = function () {
        param.type = status.val;
        param.pageIndex = 0;
        getCardList();
    };

    // 输入框值改变事件
    $searchBox.on('input', '.search-input', function () {
        param.keyword = $.trim($searchIpt.val());
    });

    // 点击搜索
    $searchBox.on('click', '.ico-search', function () {
        param.pageIndex = 0;
        getCardList();
    });

    // 如果排序号被修改
    $cardItems.on('input', '.order-ipt', function () {
        var $this = $(this);
        $this.addClass('changed');
    });

    // 点击查看按钮事件
    $cardItems.on('click', '.extend-btn.view', function () {
        var $this = $(this),
            guid = $this.data('id');
        epoint.openDialog('查看', './card_view.html?guid=' + guid, function(){
            getCardList();
        }, {
            width: 900,
            height: 850,
        });
    });

    // 点击启用按钮事件
    $cardItems.on('click', '.extend-btn.disable', function () {
        var $this = $(this),
            guid = $this.data('id');
        Util.ajax({
            type: 'post',
            url: pageConfig.enableItemUrl,
            data: {
                params: JSON.stringify({
                    id: guid
                })
            }
        }).done(function (data) {
            // 如果成功刷新页面
            if (data.isSuccess) {
                getCardList();
            }
        });
    });

    // 点击停用按钮事件
    $cardItems.on('click', '.extend-btn.enable', function () {
        var $this = $(this),
            guid = $this.data('id');
        Util.ajax({
            type: 'post',
            url: pageConfig.disableItemUrl,
            data: {
                params: JSON.stringify({
                    id: guid
                })
            }
        }).done(function (data) {
            // 如果成功刷新页面
            if (data.isSuccess) {
                getCardList();
            }
        });
    });

    // 点击删除按钮事件
    $cardItems.on('click', '.extend-btn.delete', function () {
        epoint.confirm('确认要删除吗', '删除确认', function () {
            var $this = $(this),
                guid = $this.data('id');
            Util.ajax({
                type: 'post',
                url: pageConfig.deleteItemUrl,
                data: {
                    params: JSON.stringify({
                        id: guid
                    })
                }
            }).done(function (data) {
                // 如果成功刷新页面
                if (data.isSuccess) {
                    getCardList();
                }
            });
        }, function () {
           // console.log('取消按钮被点击');
        });

    });

    // 保存排序
    var editOrderNum = function (editList) {
        Util.ajax({
            type: 'post',
            url: pageConfig.editOrderNumUrl,
            data: {
                params: JSON.stringify({
                    data: editList
                })
            }
        }).done(function (data) {
            // 如果修改成功去除标记
            if (data.isSuccess) {
                $('.order-ipt.changed').removeClass('changed');
                getCardList();
                hideOrder();
            }
        });
    };

})(this, jQuery);