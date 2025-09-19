(function(win, $) {
    var ITEM_TPL = '<div class="todo-item"><a href="javascript:;" class="todo-item-link" title="{{title}}" data-url="{{url}}" data-id="{{id}}">{{{content}}}</a><span class="todo-item-date">{{date}}</span></div>';

    var $list = $('#item-list');

    var render = function(data) {
        var html = '';
        $.each(data, function(i, item) {
            html += Mustache.render(ITEM_TPL, item);
        });
        $(html).appendTo($list.empty());
    };

    var getData = function() {
        return Util.ajax({
            url: getTodoDataUrl,
            data: {
                query: 'getTodoData',
                elementID: elementID
            }
        }).done(function(data) {
            if (data.contentColor) {
                // $list.css('background-color', data.contentColor);
            }
            $list.data('opentype', data.openType);
            if (data.itemList && data.itemList.length) {
                render(data.itemList);
            }
        });
    };

    getData();

    $list.on('click', '.todo-item', function() {
        var $this = $(this),
            $link = $this.find('.todo-item-link'),
            url = Util.getRightUrl($link.data('url')),
            id = $link.data('id'),
            openType = $list.data('opentype'),
            name = $link.attr('title') || $link.text();
        try {
            if (openType == 'tabsNav') {
                top.TabsNav.addTab({
                    name: name,
                    id: id || ((Math.random() * 256) >> 0).toString(16) + +new Date(),
                    url: url,
                    closeCallback: getData
                });
            } else if (openType == 'dialog') {
                epoint.openTopDialog(name, url, getData);
            } else {
                window.open(url);
            }
        } catch (err) {
            window.open(url);
        }
    });
})(this, jQuery);
