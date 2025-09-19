/*!
 *“聚通用”智慧政府大数据管理平台新点数据平台 (字段关联配置) 脚本
 *author:guli
 *date:2020-11-14
 *version:9.4.1
 */
(function(win, $) {
	 var rowguid=Util.getUrlParams("rowguid");
		var preJson=window.sessionStorage.getItem(rowguid+"_step1");
		var param={};
		param.id=preJson;
    var template = $('#list-tpl').html();
    Util.ajax({
        url: initUrl,
        type: 'POST',
        data:param
    }).done(function(data) {
    	if (data.flag) {
            $('.relevance-next').addClass('usable');
        }
        $('.relevance-tb-ct').html(Mustache.render(template, data));
        $('.relevance-tb-row').each(function(i, item) {
            var $cur = $(item),
                index = i + 1;
            $cur.find('.order').text(index);
        });
        $('.chosen-item-outer').niceScroll({
            cursorcolor: "#5971a4",
            cursorborder: "none",
            cursorwidth: 4,
            autohidemode: true
        });
    });

     $('.steps').on('click','#step1',function(){
           window.location.href="./choose?rowguid="+rowguid;
		}).on('click','#step3',function(){
           window.location.href="./show?rowguid="+rowguid;
		}).on('click','#step4',function(){
           window.location.href="./view?rowguid="+rowguid;
		});
   
    //新增关联字段
    $('.add-relevance-icon').on('click', function() {
        Util.ajax({
            url: addUrl,
            type: 'POST',
            data:param
        }).done(function(data) {
            var length = $('.relevance-tb-row').length + 1,
                $dom = $(Mustache.render(template, data));
            $('.relevance-tb-ct').append($dom);
            $('.relevance-tb-ct').children().last().find('.order').text(length);
            var $chosenItemOuter = $('.relevance-tb-ct').children().last().find('.chosen-item-outer');
            $chosenItemOuter.niceScroll({
                cursorcolor: "#5971a4",
                cursorborder: "none",
                cursorwidth: 4,
                autohidemode: true
            });
        });
    });
    //滚动条
//    $('.relevance-tb-ct').niceScroll({
//        cursorcolor: "#5971a4",
//        cursorborder: "none",
//        cursorwidth: 4,
//        autohidemode: true
//    });

     $('.relevance-tb-ct').on('click', '.chosen-icon', function() {
        $(this).siblings('.chosen-selected').trigger('click');
     });

    //点击下拉选择
    $('.relevance-tb-ct').on('click', '.chosen-selected', function(e) {
        var $cur = $(this),
         $chosenIcon = $cur.siblings('.chosen-icon');
        $('.chosen-icon').not($chosenIcon).removeClass('active');
        $('.chosen-items').stop().slideUp(0);
        $chosenIcon.toggleClass('active');
        var $panel = $cur.siblings('.chosen-items'),
            height = parseInt($panel.css('height')),
            clientHeight = document.body.clientHeight;
        var rect = $(e.target).closest('.chosen-inner')[0].getBoundingClientRect();
        // debugger
        if (rect.top + rect.height + height > clientHeight) {
            var top = rect.top - height;
        } else {
            var top = rect.top + rect.height;
        }
        mini.showAt({
            el: $panel[0],
            x: 'left',
            y: 'top',
            offset: [rect.left, top],
            fixed: true
        });
        if ($chosenIcon.hasClass('active')) {
            $panel.css({ width: rect.width }).stop().slideDown(0);
        } else {
            $panel.css({ width: rect.width }).stop().slideUp(0);
        }
    });

    var TPL = $('#item-tpl').html();

    function renderRight(data, target) {
        if (!data || !data.length) return $(target).empty();
        var html = $.map(data, function(item) {
            return Mustache.render(TPL, item);
        }).join('');
        $(target).html(html);
    }
    
    
    //点击下拉选项
    $('.relevance-tb-ct').on('click', '.chosen-item', function() {
            var $cur = $(this),
            text = $cur.text(),
            $chosen = $cur.parents('.chosen');
        if ($chosen.hasClass('left')) {
            var $right = $chosen.siblings().find('.chosen-item-outer'),
            left = { id: $cur.data('id') };
            $chosen.siblings().find('.chosen-selected').text('请选择比对字段').removeClass('active');
            $chosen.siblings().find('.chosen-selected').attr('data-id','');
            Util.ajax({
                url: linkUrl,
                type: 'POST',
                data:left
            }).done(function(data) {
                renderRight(data.list, $right);
            });
        }
        $cur.parents('.chosen-items').siblings('.chosen-selected').text(text);
        $cur.parents('.chosen-items').siblings('.chosen-selected').attr('data-id',$cur.data('id'));
        $cur.parents('.chosen-items').siblings('.chosen-selected').addClass('active');
       

        $cur.parents('.chosen').addClass('value');
        var $chosenItems = $cur.parents('.relevance-tb-row ').find('.chosen');
        var valueNum = 0;
        $chosenItems.each(function(i, item) {
            var $current = $(item);
            if ($current.hasClass('value')) {
                valueNum++;
            }
        });
        if (valueNum == 4) {
            if (!$('.relevance-next').hasClass('usable')) {
                $('.relevance-next').addClass('usable');
            }
            $cur.parents('.relevance-tb-row').addClass('valid');
        }

        $cur.addClass('active');
        $cur.siblings().removeClass('active');
        $cur.siblings('.chosen-items').stop().slideToggle(0);

        $cur.parents('.chosen-items').stop().slideUp(0);
        $cur.parents('.chosen-items').siblings('.chosen-icon').removeClass('active');
    });
    //点击下一步
   
    $('.relevance-next').on('click', function() {
        if ($(this).hasClass('usable')) {
        	 var dataArr = [];
            //跳转页面
            $('.relevance-tb-row').each(function(i, item) {
                var $cur = $(item);
                if ($cur.hasClass('valid')) {
                	 var data = {},
                     $items = $cur.find('.chosen-selected');
                 $items.each(function(i, item) {
                     var $current = $(item);
                     data["title"+(i+1)]=$current.text();
                     data["id"+(i+1)]=$current.attr('data-id');
                 });
                    dataArr.push(data);
                }
            });
        	 epoint.execute('dxpguidemodelaction.saveStep','',[dataArr,'2'],function(data){
        		 if(data.msg.indexOf('成功')!=-1){
        			 window.sessionStorage.setItem(rowguid+"_step2",  JSON.stringify(dataArr));
        			 Util.openSelfWin('./show?rowguid='+rowguid);
        		 }else{
        			 epoint.showTips(data.msg);
        		 }
    	   	 });
          
        }
    });

    //点击保存按钮
    // $('.relevance-tb-ct').on('click', '.chosen-save-btn', function() {
    //     var $cur = $(this);
    //     $cur.parents('.chosen-items').stop().slideUp(0);
    //     $cur.parents('.chosen-items').siblings('.chosen-icon').removeClass('active');
    // });


  //点击删除按钮
    $('.relevance-tb-ct').on('click', '.operate', function() {
        var $cur = $(this);
        var $items = $(this).parents('.relevance-tb-row').nextAll(),
            $preItems = $(this).parents('.relevance-tb-row').prevAll();
        if (!($items.length == 0 && $preItems.length == 0)) {
            $items.each(function(i, item) {
                var $current = $(item),
                    $order = $current.find('.order'),
                    text1 = $order.text(),
                    text2 = text1 - 1;
                $order.text(text2);
            });
            $(this).parents('.relevance-tb-row').remove();
        }else{
        	 epoint.showTips("至少配置一个关联关系！");
        }
    });
    
    $('.relevance-save').on('click', function() {
    	var resultdata={};
        var dataArr = [];
        $('.relevance-tb-row').each(function(i, item) {
            var $cur = $(item);
            if ($cur.hasClass('valid')) {
                var data = {},
                    $items = $cur.find('.chosen-selected');
                $items.each(function(i, item) {
                    var $current = $(item);
                    console.log($current);
                    data["title"+(i+1)]=$current.text();
                    data["id"+(i+1)]=$current.data('id');
                });
                console.log(data);
                dataArr.push(data);
            }
        });
	    epoint.execute('dxpguidemodelaction.saveStep','',[dataArr,'2'],function(data){
	   		 epoint.showTips(data.msg);
	   	 });
   });
    
    
    $('.relevance-pre').on('click', function() {
    	window.history.go(-1);
    });
    
})(this, this.jQuery);