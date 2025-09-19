/*
 * 外部通讯录列表
 * author：buly
 * data: 2017-02-08
 */
var $menubox = $('#menubox'),
    menuTmpl = $('#menu-tmpl').html(),
    $listItems = $("#list-items"),
    listItemTmpl = $("#list-item-tmpl").html();

var $smartSearch = $("#smart-search"),
    $searchBtn = $smartSearch.siblings('.button-search');

var defaultPageSize = 1000,
    defaultPageIndex = 0;

var scrolltop = [];
var mMoveto = mini.get("moveto");

function getQuery() {
    var queryString = Util.getUrlParams(),
        groupguid = queryString.groupguid, //分组ID
        grouptype = queryString.grouptype, //分组类型
        key = $.trim($smartSearch.val()),
        result = {};
    result.pagesize = defaultPageSize;
    result.pageindex = defaultPageIndex;
    result.groupguid = groupguid;
    result.grouptype = grouptype;
    result.key = "";
    result.type = "";
    return result;
}

//请求数据
function requestCard(isfirst) {
    var query = getQuery();
    var canManager;
    epoint.execute('outaddresslistaction.getLeftArrdessList', null, query, function(data) {
        afterGetData(data);
        //        var keyword = $.trim($smartSearch.val());
        //        alert(keyword);
        //reset(data);
        renderListTmpl(epoint.decodeJson(data.addresslist));
        if (isfirst) {
            Util.hidePageLoading();
        }
        if (data.canManager) {
            canManager = data.canManager;
        }
        if (grouptype == 2 || (grouptype == 1 && canManager == true)) {
            $("#setting").removeClass("hidden");
            $("#com-new-btn").removeClass("hidden");
            $("#com-delete-btn").removeClass("hidden");
            $("#move").removeClass("hidden");
            // $("#checkcol").removeClass("hidden");

        }

        // 解析控件
        mini.parse();
    });
}
//后台返回数据后刷新列表
function afterGetData(data) {
    //renderListTmpl(epoint.decodeJson(data.addresslist));
    console.log(data);
    mini.parse();
    //转移分组
    if (data.categorylist) {
        for (var i = 0; i < data.categorylist.length; i++) {
            if (data.categorylist[i].categoryguid === Util.getUrlParams("groupguid")) {
                data.categorylist.remove(data.categorylist[i]);
            }
        }
        mMoveto.loadList(data.categorylist);
        mMoveto.on('itemclick', function(event) {
            moveto(event.item.categoryguid);
        });
    }

    //转移分组
    //        if (data.categorylist) {
    //            for (var i = 0; i < data.categorylist.length; i++) {
    //                 var categoryguid = data.categorylist[i].categoryguid;
    //                 $("#moveto").append("<li ><span onmousedown=\"moveto('" + categoryguid + "')\" >" + data.categorylist[i].categoryname + "</span></li>");
    //             }
    //        }
}

//初始化渲染信息列表
function renderListTmpl(data) {
	if(data.length==0){
		if (defaultPageIndex === 0) {
			console.log(data);
	        //首字母下拉菜单渲染
	        $menubox.html(Mustache.render(menuTmpl, {
	            item: epoint.decodeJson([{"namefletter":"没有人员信息"}])
	        }));
	        $listItems.empty();
	    }
	}else{
		if (defaultPageIndex === 0) {
	        //首字母下拉菜单渲染
			console.log(data);
	        $menubox.html(Mustache.render(menuTmpl, {
	            item: data
	        }));
	        $listItems.empty();
	    }
		$(".outerlist").scrollTop(0);
	    $listItems.append(Mustache.render(listItemTmpl, {
	        list: data
	    }));
	}
}

// 遍历checkbox是否选中
function getCheckedItem() {
    var checkedGuids = [];
    var $itemInfo = $('.item-info', $listItems);
    $.each($itemInfo, function(index, el) {
        var userId = $(el).data("id"),
            check = mini.get(userId);
        if (check.checked) {
            checkedGuids.push(userId);
        }
    });

    return checkedGuids;
}


// 绑定事件
function bindCardEvent() {
    // 加载更多
    $('#loading-more').on('click', function(event) {
        defaultPageIndex++;
        requestCard(false);
    });



    $searchBtn.on('click', function(event) {
        var key = $.trim($smartSearch.val()),
            keyword = /^[a-zA-Z]+$/;
        var $listItem = $('.list-item', $listItems);

        // 大写字母定位
        if (keyword.test(key) && key.length === 1) {
            $.each($listItem, function(index, el) {
                var namefletter = $(el).children('h2').text();
                var $listItem = $('.list-item', $listItems);
                if (namefletter == key || namefletter.toLowerCase() == key) {
                    var heigh = 0;
                    for (var len = $listItem; index < len; index++) {
                        heigh += $listItem[index].height();
                    }
                    var top = $(el).offset().top,
                        basicTop = $('.list-items').offset().top,
                        screenHeigh = $(document).height();
                    if (heigh < screenHeigh - 74) {
                        var cha = screenHeigh - heigh - 74;
                        $listItems.css('padding-bottom', cha + 'px');
                    }
                    $('.outerlist').animate({
                        scrollTop: top - basicTop
                    }, 500);
                    return false;
                }
            });
            return false;
        }
        if (key && key.length) {
            defaultPageIndex = 0;
            requestCard(true);
            return false;
        }
    });

    //右侧弹出
    var $rightDetails = $('#right-details'),
        $initial = $('.initial', $rightDetails),
        $infodetail = $('.infodetail', $rightDetails);

    //点击列表
    $listItems.on('click', '.item-info', function(event) {
        if (!($(event.target).hasClass('mini-checkbox-icon'))) { // 除了checkbox之外的点击

            var $this = $(this),
                id = $this.data('id'),
                $curCxt = mini.getbyName("cxt", this),
                $allCxts = mini.getsbyName("cxt", $listItems[0]),
                $itemInfo = $listItems.find(".item-info");

            var thisChecked = $this.hasClass('fui-list-selected');
            $initial.addClass('hidden');
            $infodetail.children('iframe').attr('src', './outerdetailview?uid=' + id);
            $infodetail.removeClass('hidden');

            if (!$curCxt.checked) { //当前行
                // 清除其他选中状态
                for (var minickb in $allCxts) {
                    if ($allCxts.hasOwnProperty(minickb)) {
                        $allCxts[minickb].setValue(false);
                    }
                }
                $itemInfo.removeClass('fui-list-selected');
                // 当前行添加选中
                $curCxt.setValue(true);
                $this.addClass('fui-list-selected');
            }
        }
    }).on('mouseenter', '.item-info', function(event) {
        $(this).addClass('fui-list-hover');
    }).on('mouseleave', '.item-info', function(event) {
        $(this).removeClass('fui-list-hover');
    });
}

requestCard(defaultPageSize, defaultPageIndex, true); //首次加载
bindCardEvent();
// 单个checkbox绑定事件
function singleMailSelectChanged(event) {
    var $this = $(this.el),
        curChecked = this.checked;

    var $curmailRow = $this.closest('.item-info');

    if (curChecked) {
        // 添加选中行样式
        // $curmailRow.addClass('active');
        $curmailRow.addClass('fui-list-selected');

    } else {
        // 取消选中行样式
        // $curmailRow.removeClass('active');
        $curmailRow.removeClass('fui-list-selected');
    }
}
