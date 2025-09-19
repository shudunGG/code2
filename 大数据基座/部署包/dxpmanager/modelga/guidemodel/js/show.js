/*!
 *“聚通用”智慧政府大数据管理平台新点数据平台 (结果显示字段配置) 脚本
 *author:guli
 *date:2020-11-16
 *version:9.4.1
 */
(function(win, $) {

    var template = $('#show-tpl').html();
    var rowguid=Util.getUrlParams("rowguid");
	var preJson=window.sessionStorage.getItem(rowguid+"_step1");
	var param={};
	param.id=preJson;

    //点击添加字段
    var $showBegin = $('.show-begin');
    //渲染列表
    Util.ajax({
        url: showUrl,
        type: 'POST',
        data: param
    }).done(function(data) {
        $('.show-items-inner').html(Mustache.render(template, data));
        //滚动条
        $('.select-ct').niceScroll({
            cursorcolor: "#5971a4",
            cursorborder: "none",
            cursorwidth: 4,
            autohidemode: true
        });
        $('.show-item-bd').niceScroll({
            cursorcolor: "#5971a4",
            cursorborder: "none",
            cursorwidth: 4,
            autohidemode: true
        });
        $('.show-items').niceScroll({
            cursorcolor: "#5971a4",
            cursorborder: "none",
            cursorwidth: 4,
            autohidemode: true
        });
        ellipsis();
        
        if (data.flag&&!$showBegin.hasClass('usable')) {
            $showBegin.addClass('usable');
            begin();
        }
    });

    //超过五个字显示省略号
    function ellipsis() {
        $('.show-text').each(function(i, item) {
            var $cur = $(item),
                text = $cur.text();
            if (text.length > 5) {
                var newText = text.substring(0, 5) + '...';
                $cur.text(newText);
            }
        });
    }

    $('.show-items-inner').on('click', '.show-text', function() {
        var $cur = $(this),
            text = $cur.text(),
            id=$cur.data('id'),
            $selectCt = $cur.parents('.show-item').find('.select-ct-inner'),
            $dom = $(
                    '<div class="select-item">' +
                    '<p class="select-txt" data-id="' + id + '">' + text + '</p>' +
                    '<span class="select-delete"></span>' +
                    '</div>'
                );
        if (!$cur.hasClass('disabled')) {
            $cur.addClass('disabled');
        }
        $selectCt.append($dom);
        if (!$showBegin.hasClass('usable')) {
            $showBegin.addClass('usable');
            begin();
        }
    });
    function begin(){
    	 // 点击开始比对
        $showBegin.on('click', function() {
            var dataArr = [];
            $('.select-ct-inner').each(function(i, item) {
                var $cur = $(item);

//                if (parseInt($cur.css('width')) > 0) {
                    var data = {
                        title: $cur.parent().siblings('.show-item-tt').data('id'),
                        item: []
                    }
                    var $selectItems = $cur.find('.select-item');
                    $selectItems.each(function(i, item) {
                        var $selectItem = $(item);
                        data.item.push($(item).find('.select-txt').data('id'));
                    });
                    dataArr.push(data);
//                }
            });
            epoint.execute('dxpguidemodelaction.saveStep','',[dataArr,'3'],function(data){
                if(data.msg=='保存成功'){
                     window.sessionStorage.setItem(rowguid+"_step3",  JSON.stringify(dataArr));
                     Util.openSelfWin('./view?rowguid='+rowguid);
                }else{
                    epoint.showTips(data.msg);
                }

          	 });
        });
    }

    $('.steps').on('click','#step1',function(){
           window.location.href="./choose?rowguid="+rowguid;
		}).on('click','#step2',function(){
           window.location.href="./relevance?rowguid="+rowguid;
		}).on('click','#step4',function(){
           window.location.href="./view?rowguid="+rowguid;
		});

    //点击删除字段
    $('.show-items-inner').on('click', '.select-delete', function() {
        var $cur = $(this);
        var text1 = $cur.siblings().data('id'),
            $items = $cur.parents('.show-item').find('.show-text');
        $items.each(function(i, item) {
            var $current = $(item),
                text = $current.data('id');
            if (text == text1) {
                $current.removeClass('disabled');
                $cur.parent('.select-item').remove();
            }
        });

        if (!$('.show-items-inner').find('.select-item').length) {
            $showBegin.removeClass('usable');
        }
    });
    
    $('.show-save').on('click', function() {
    	 var dataArr = [];
         $('.select-ct-inner').each(function(i, item) {
             var $cur = $(item);

//             if (parseInt($cur.css('width')) > 0) {
                 var data = {
                     title: $cur.parent().siblings('.show-item-tt').data('id'),
                     item: []
                 }
                 var $selectItems = $cur.find('.select-item');
                 $selectItems.each(function(i, item) {
                     var $selectItem = $(item);
                     data.item.push($(item).find('.select-txt').data('id'));
                 });
                 dataArr.push(data);
//             }
         });
        
   	 epoint.execute('dxpguidemodelaction.saveStep','',[dataArr,'3'],function(data){
   		 epoint.showTips(data.msg);
   	 });
   });

    var $show = $('.show');
	$show.on('click', '.all-select', function() {
		var $cur = $(this), $selectCtInner = $cur.siblings('.select-ct').find('.select-ct-inner'), $showItemInner = $cur.parent().siblings('.show-item-bd').find('.show-item-inner'), $showTextOuter = $showItemInner.find('.show-text-outer'), dom = '';
		$showBegin.addClass('usable');
		$selectCtInner.empty();
		$showTextOuter.each(function(i, item) {
			var $cur = $(item), $showText = $cur.find('.show-text'), text = $showText.text(), id = $showText.data('id');
			dom += '<div class="select-item">' + '<p class="select-txt" data-id="' + id + '">' + text + '</p>' + '<span class="select-delete"></span>' + '</div>';
			$showText.addClass('disabled');
		});
		$selectCtInner.html(dom);
	}).on('click', '.all-not-select', function() {

		var $cur = $(this), $selectCtInner = $cur.siblings('.select-ct').find('.select-ct-inner'), $showItemInner = $cur.parent().siblings('.show-item-bd').find('.show-item-inner');
		$showItemInner.find('.show-text').removeClass('disabled');
		$selectCtInner.empty();
		if (!$('.select-item').length) {
			$showBegin.removeClass('usable');
		}
	});

    
    $('.show-pre').on('click', function() {
    	window.history.go(-1);
    });
    

})(this, this.jQuery);