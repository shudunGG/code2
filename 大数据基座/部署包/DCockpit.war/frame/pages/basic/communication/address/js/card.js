/*
 * 卡片式
 * author：buly
 * data: 2017-02-07
 */
(function(win, $) {
    var $cardItems = $('#card-items');

    // 选中事件
    $cardItems.on('click', '.card-item', function(event) {

        if($(event.target).hasClass('sname') || $(event.target).hasClass('icon-portrait')) {
            return ;
        }

        var $this = $(this);
        $this.toggleClass('active');

    }).on('click', '.staff-baseinfo .sname,.icon-portrait', function(event) {// 打开弹出详情
        var uid = this.id;
        if(Util.getUrlParams().inorout==1){
            epoint.openDialog('人员详情', './innerdetail?view=2&uid=' + uid, function(param) {
                        if (param) {
                            // searchData();
                        }
                    }, {
                        width: 774,
                        height: 580,
                        showModal: 1,
                        param: {
                            name: 'sheldon'
                        }
                    });
        }else{
            epoint.openDialog('人员详情', 'oa9/communication/businesscard/outerdetailview?view=2&uid=' + uid, function(param) {
                        if (param) {

                        }
                        searchData();
                    }, {
                        width: 800,
                        height: 700,
                        showModal: 1,
                        param: {
                            name: 'sheldon'
                        }
                    });
        }

    });
}(this, jQuery));
