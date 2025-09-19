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
var DEFAULT_PAGE_SIZE = 10;
var $right = $('#right');

// 最小高度计算
function adjustMinHieght() {
    var h = $(window).height() - 56 - 130 - 36;
    if (h) {
        // - 头部 75 边距 20 分页 40
        DEFAULT_PAGE_SIZE = (h - 48 - 20 - 40) / 40 >> 0;
        $('#right').css('min-height', h - 20);
    }
}
adjustMinHieght();

// 左侧类型
(function (win, $) {
    var QUESTION_TYPE_TPL = '<div class="type-item {{#_hasSub}} hasSub{{/_hasSub}}"><div class="type-item-self {{_level}}" data-id="{{id}}" data-rowkey="{{_rowkey}}" title="{{name}}"><span class="type-item-text">{{name}}</span>{{#_hasSub}}<span class="type-item-trigger"></span>{{/_hasSub}}</div>{{#_hasSub}}<div class="type-item-sub" style="display:none;">{{{_subTypes}}}</div>{{/_hasSub}}</div>';

    var $questionTypeContainer = $('#question-type-container');
    var $questionTypeList = $('.question-type-list', $questionTypeContainer);

    function getRowKey(rowkey, i) {
        return rowkey === undefined ? i + '' : rowkey + '-' + i;
    }

    function getLevle(rowkey) {
        return 'level-' + rowkey.split('-').length;
    }

    var typeCache = {};
    var firstChild = false;

    function buildQuestionType(data, rowkey) {
        var html = [];

        $.each(data, function (i, item) {
            item._rowkey = getRowKey(rowkey, i);
            item._level = getLevle(item._rowkey);
            item._hasSub = item.items && item.items.length;
            typeCache[item.id] = item.name;
            if (item._hasSub) {
                // html.push(buildQuestionType(item.items, item._rowkey));
                html.push(Mustache.render(
                    QUESTION_TYPE_TPL,
                    $.extend(item, {
                        _subTypes: buildQuestionType(JSON.parse(item.items), item._rowkey)
                    })
                ));
            } else {
                // 记录第一个子节点 用于自动加载列表
                if (!firstChild) {
                    firstChild = {
                        id: item.id,
                        name: item.name
                    };
                }
                html.push(Mustache.render(QUESTION_TYPE_TPL, item));
            }
        });

        return arrayJoin(html);
    }

    function initEvent() {
        var $allItems;
        var $left = $('#left');
        $questionTypeList
            .off('click', '.type-item-self')
            .on('click', '.type-item-self', function () {
                var $this = $(this),
                    $item = $this.parent(),
                    hasSub = $item.hasClass('hasSub');

                if (hasSub) {
                    var $sub = $item.find('> .type-item-sub');
                    if (!$item.hasClass('opened')) {
                        $item.addClass('opened');
                        // .siblings().removeClass('opened');
                        $sub.stop(true).slideDown(adjust);
                    } else {
                        $item.removeClass('opened');
                        $sub.stop(true).slideUp(adjust);
                    }
                    
                    var id = $this.data('id');
                    var name = $this.attr('title');
                    // 调用加载右侧数据
                    getQuestionLisByType(id, name);

                } else {
                    var id = $this.data('id');
                    var name = $this.attr('title');

                    if (!$allItems) {
                        $allItems = $questionTypeList.find('.type-item-self');
                    }
                    $allItems.removeClass('active');
                    $this.addClass('active');

                    // 调用加载右侧数据
                    getQuestionLisByType(id, name);
                }
            });

        // 保证右侧高度不小于左侧 
         function adjust() {
             var h_f = $left.height();
             $right.css('min-height', '');
             var h_r = $right.height();
             $right.css('min-height', Math.max(h_f, h_r));
         }
         adjust();
    }

    var getQuestionTYpes = function () {
        return Util.ajax({
            url: Util.getRightUrl(getQuestionSortUrl,""),
        }).done(function (data) {
            if (!data) {

            } else {
                $(buildQuestionType(JSON.parse(data.categoryListdata))).appendTo($questionTypeList.empty());
                initEvent();
                //checkAndOpen();
                getQuestionLisByType('','全部问题');
            }
        });
    };
    getQuestionTYpes();

    // 检查参数加载左侧或者展开第一个对应列表
    function checkAndOpen() {
        // 检查url中是否存在分类参数  存在则加载此列表 否则展开第一个
        var categoryId = Util.getUrlParams('categoryId');
        if (categoryId) {
            getQuestionLisByType(categoryId, typeCache[categoryId] || '');
            expaneLeft(categoryId);
        } else {
            getQuestionLisByType(firstChild.id, firstChild.name);
            expaneLeft(firstChild.id);
        }
    }
    // 展开左侧
    function expaneLeft(id) {
        var $aim = $questionTypeList.find('.type-item-self[data-id="' + id + '"]');
        if ($aim.length) {
            $aim.addClass('active');
            $aim.parents('.type-item.hasSub').addClass('opened');
            $aim.parents('.type-item-sub').show();
        }
    }
})(this, jQuery);


// 问题列表
(function (win, $) {

    // 根据问题类型获取问题详情
    var $questionContainer = $('#question-container');
    var $questionList = $('#question-list');
    var $questionListTitle = $('#question-type');
    var questionListPager = mini.get('question-list-pagination');
    //var $questionListPager = $('#question-list-pagination');

    var QUESTION_TPL = '<div class="question-item" data-id="{{id}}"><span class="icon" style="background-color:{{_typeBg}};">{{type}}</span><span class="text" title="{{text}}">{{{text}}}</span></div>';

    // 渲染列表
    function renderQuestionList(data, kd) {
        var html = [];
        var reg = kd ? new RegExp(kd, 'ig') : false;
        $.each(data, function (i, item) {
            if (reg) {
                item.text = item.text.replace(reg, '<span class="kd">' + kd + '</span>');
            }
            item._typeBg = getColorByTypeText(item) || '#fd965d';
            html.push(Mustache.render(QUESTION_TPL, item));
        });

        return $(arrayJoin(html));
    }

    // 获取数据
    function getQuestionListData(typeId, pageIndex, pageSize) {
        pageIndex = pageIndex || 0;
        pageSize = pageSize || DEFAULT_PAGE_SIZE;
        return Util.ajax({
            url: Util.getRightUrl(getQuestionListUrl,""),
            data: {
                categoryId: typeId,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }).done(function (data) {
            var list = JSON.parse(data.messageReleaseData).list;
            if(list.length) {
                $right.removeClass('empty');
                $(renderQuestionList(list)).appendTo($questionList.empty());
            } else {
                $right.addClass('empty');
            }

            questionListPager.setPageSize(pageSize);
            
            // 如果是主页的搜索
            var searchKeyWord = Util.getUrlParams('kw');
            if (searchKeyWord) {
                searchKeyWord = window.decodeURIComponent(searchKeyWord);
                $searchInput.val(searchKeyWord);
                $searchBtn.trigger('click');
            }
        });
    }
    

    // 分类变化时重新获取数据
    questionListPager.on('pagechanged', function (e) {
        var index = e.pageIndex,
            size = e.pageSize;
        getQuestionListData($questionListTitle.data('id'), index, size);
    });

    function getQuestionLisByType(id, name) {
        getQuestionListData(id).done(function (data) {
        	var dataJson = JSON.parse(data.messageReleaseData);
            // 确保可见
            $questionContainer.removeClass('hidden').siblings().addClass('hidden');

            $questionListTitle.data('id', id).text(name).attr('title', name);
            if (dataJson.total > DEFAULT_PAGE_SIZE) {
            	questionListPager.setVisible(true);
            	questionListPager.setTotalCount(dataJson.total);
            } else {
            	questionListPager.setVisible(false);
            }
        });
    }
    // 开放供给左侧点击
    win.getQuestionLisByType = getQuestionLisByType;

    // 搜索的数据
    var $searchContainer = $('#search-container');
    var $searchQuestionList = $('#search-list');
    var searchListPager = mini.get('search-list-pagination');
    //var $searchListPager = $('#search-list-pagination');
    searchListPager.on('pagechanged', function (e) {
        var index = e.pageIndex,
            size = e.pageSize;
        getSearchListData($searchQuestionList.data('kd'), index, size);
    });
    // 搜索的返回
    $searchContainer.on('click', '.go-back', function () {
        // 切换到问题列表
        $questionContainer.removeClass('hidden').siblings().addClass('hidden');
        // 清空值
        $searchInput.val('');
    });

    function getSearchListData(kd, pageIndex, pageSize) {
        pageIndex = pageIndex || 0;
        pageSize = pageSize || DEFAULT_PAGE_SIZE;
        return Util.ajax({
            url: Util.getRightUrl(getQuestionSearchListUrl,""),
            data: {
                keyword: kd,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }).done(function (data) {
        	var dataJson = JSON.parse(data.messageReleaseData);
            // 确保可见
            if (!$searchContainer.is(':visible')) {
                $searchContainer.removeClass('hidden').siblings().addClass('hidden');
            }

            $searchQuestionList.data('kd', kd);
            if (dataJson.total == 0) {
            	searchListPager.setVisible(false);
                $('<div class="no-search-result">没有和<span class="kd">' + kd + '</span>相关的结果</div>').appendTo($searchQuestionList.empty());
                return;
            }

            $(renderQuestionList(dataJson.list, kd)).appendTo($searchQuestionList.empty());
            if (dataJson.total > DEFAULT_PAGE_SIZE) {
            	searchListPager.setVisible(true);
            	searchListPager.setTotalCount(dataJson.total);
            	searchListPager.setPageSize(pageSize);
            } else {
            	searchListPager.setVisible(false);
            }
        });
    }

    // 点击查看详情
    var $detailContainer = $('#question-detail'),
        $detailTitle = $('.detail-title', $detailContainer),
        $detailContent = $('.question-detail-content', $detailContainer);
    var $goBackAim; // 记录详情页返回的容器，分类列表还是搜索列表

    $('#right').on('click', '.question-item', function () {
        var $this = $(this),
            id = $this.data('id'),
            name = $this.find('> .text').text();
        $goBackAim = $this.closest('.right-main-content');
        // 遮罩
        getQuestionDatailById(id).done(function () {
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

    function getQuestionDatailById(id) {
        return Util.ajax({
            url: Util.getRightUrl(getQuestionDatailUrl,""),
            data: {
            	cMessageGuid: id
            }
        }).done(function (data) {
            $($.parseHTML(data.contHtml)).appendTo($detailContent.empty());
        });
    }

    // 搜索实现
    var $search = $('#top-question-search'),
        $searchInput = $('.top-search-input', $search),
        $searchBtn = $('.search-btn', $search);

    $searchInput.on('keyup', function (e) {
        var v = $.trim(this.value);
        if (e.which === 13) {
            getSearchListData(v);
        }
    });
    $searchBtn.on('click', function () {
        var v = $.trim($searchInput.val());
        getSearchListData(v);
    });

})(window, jQuery);