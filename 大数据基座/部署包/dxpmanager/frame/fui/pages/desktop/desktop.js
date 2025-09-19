(function(win, $) {
    // 行模板
    var rowTpl = '<div class="elem-row clearfix"></div>',
        // 元件模板
        elemTpl = '<div class="elem-item l" style="width:{{width}};height:{{height}};" data-url="{{url}}" data-id="{{code}}" data-name="{{name}}" ><div class="elem-inner" style="top:{{updown}}px;right:{{leftright}}px;bottom:{{updown}}px;left:{{leftright}}px;"><iframe src="about:blank" allowTransparency="true" height="100%" width="100%" frameborder="0" scrolling="no"></iframe></div></div>';

    var $container = $('#elem-container');

    var getData = function() {
        return Util.ajax({
            url: getDataUrl
        }).done(function(data) {
            init(data);
        });
    };
    getData();
    // Util.loadJs('frame/fui/js/libs/jquery.nicescroll.min.js', function () {
    //     $('body').niceScroll();
    // });

    // 数据按行、列排序
    var sortByRowCol = function(data) {
        var i, j, l, temp;
        // 按行排序 
        for (i = 0, l = data.length; i < l; ++i) {
            for (j = 0; j < l - 1 - i; ++j) {
                if (data[j][0].row > data[j + 1][0].row) {
                    temp = data[j + 1];
                    data[j + 1] = data[j];
                    data[j] = temp;
                }
            }
        }
        // 行内 按列排序
        $.each(data, function(index, row) {
            for (i = 0, l = row.length; i < l; ++i) {
                for (j = 0; j < l - 1 - i; ++j) {
                    if (row[j].col > row[j + 1].col) {
                        temp = row[j + 1];
                        row[j + 1] = row[j];
                        row[j] = temp;
                    }
                }
            }
        });
        return data;
    };

    var init = function(data) {
        // renderRows(data);
        renderRows(sortByRowCol(data));
        loadUrl(urlCache);
    };
    win._initDesktop = init;

    // 加载iframe
    var loadUrl = function(urlCache) {

        // $container.find('.elem-item').each(function (i, item) {  
        //     setTimeout(function () {                
        //         item.getElementsByTagName('iframe')[0].src = Util.getRightUrl(
        //             urlCache[item.getAttribute('data-id')]
        //         );

        //     }, i * 100);
        // });

        var $items = $container.find('.elem-item'),
            item,
            i = 0,
            len = $items.length;

        // 没有元件时
        if (!len) return;

        setTimeout(function load() {
            item = $items[i];
            item.getElementsByTagName('iframe')[0].src = Util.getRightUrl(urlCache[item.getAttribute('data-id')]);

            if (++i < len) {
                setTimeout(load, 100);
            }
        });
    };
    /**
     * 获取元件宽高度
     * @param {Object} 元件数据 
     * @param {Number} 当前行实际列数 
     * @returns {Object} 元件的尺寸信息
     */
    var getSize = function(data, realityCols) {
        return {
            width: parseFloat(data.colspan / realityCols, 10) * 100 + '%',
            height: BASE_HEIGHT * data.rowspan + GAPS[1] * (data.rowspan + 1) + 'px'
        };
    };

    // 缓存url
    var urlCache = {};

    // 渲染行内元件
    var renderElemByRow = function(elems) {
        var html = [],
            cols = 0,
            i = 0,
            l = elems.length,
            elem;

        // 计算实际列数
        for (; i < l; ++i) {
            cols += elems[i].colspan;
        }
        // 逐个渲染
        for (i = 0; i < l; ++i) {
            elem = elems[i];
            html.push(Mustache.render(elemTpl,
                $.extend({
                    updown: GAPS[0] / 2,
                    leftright: GAPS[1] / 2
                }, elem, getSize(elem, cols))
            ));
            // 记录url
            urlCache[elem.code] = elem.url;
        }
        return html.join('');
    };

    // 渲染行
    var renderRows = function(rows) {
        $container.empty();
        $.each(rows, function(i, row) {
            $(Mustache.render(rowTpl, row)).append(renderElemByRow(row))
                .appendTo($container);
        });
    };
})(this, jQuery);