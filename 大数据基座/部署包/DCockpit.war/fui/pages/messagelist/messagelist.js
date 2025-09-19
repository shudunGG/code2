(function (win, $) {
    // 消息列表模板
    var MSG_TPL = '<div class="msg-category"data-code="{{remindType}}"><h3 class="msg-category-head"data-url="{{url}}"data-title="{{name}}"data-opentype="{{openType}}"><span class="msg-category-title"title="{{name}}">{{{name}}} (<span class="msg-category-num">{{num}}</span>)</span><i class="msg-category-remove"title="忽略全部"></i></h3><ul class="msg-list">{{#items}}<li class="msg-list-item {{#hasNew}}newmsg{{/hasNew}}"data-url="{{url}}"data-guid="{{guid}}"data-title="{{name}}"data-opentype="{{openType}}"><span class="msg-item-text"title="{{name}}">{{{name}}}</span><span class="msg-item-date">{{date}}</span><i class="msg-item-ignore"title="忽略"></i></li>{{/items}}</ul></div>';

    var M = Mustache,
        msgRemindTempl = $.trim(MSG_TPL);

    var delHtmlTag = function (str) {
        return str.replace(/<[^>]+>/g, "");
    };

    var parseNum = function (num) {
        var n = parseInt(num);

        if (n > 99) {
            return '99+';
        } else if (n <= 0) {
            return '';
        }

        return n + '';
    };



    var openMsg = function (config) {
        if (config.openType == "dialog") {
            top.epoint.openDialog(config.name, config.url, function(){
            	top.getMessageCount();
            });
        } else if (config.openType == "blank") {
            win.open(Util.getRightUrl(config.url));
        } else {
            top.TabsNav.addTab({
                id: config.id,
                name: config.name,
                url: config.url
            });
        }

    };

    function MessageList(cfg) {
        // 父容器
        this.$container = $(cfg.container);
        this.$wrap = $('<div class="message-content-wrap"></div').appendTo(this.$container);
        // 数据请求地址
        this.getUrl = cfg.getUrl;
        // 忽略消息的请求地址
        this.ignoreUrl = cfg.ignoreUrl;
        // 打开消息后的回调
        this.afterOpenMsg = cfg.afterOpenMsg;
        // 忽略消息后的回调
        this.afterIgnore = cfg.afterIgnore;
        // 绑定点击事件
        this._bindEvent();
    }


    MessageList.prototype = {
        _bindEvent: function () {
            var self = this;
            // 消息面板交互
            this.$container.on('click', '.msg-category-title', function () {
                // 消息分类标题点击
                var $el = $(this),
                    $item = $el.parent(),
                    name = $item.data('title'),
                    url = $item.data('url'),
                    code = $item.parent().data('code'),
                    openType = $item.data('opentype');

                openMsg({
                    id: code,
                    name: name,
                    url: url,
                    openType: openType
                });

                self.afterOpenMsg && self.afterOpenMsg();

            }).on('click', '.msg-category-remove', function () {
                // 忽略全部
                var $category = $(this).closest('.msg-category'),
                    code = $category.data('code'),
                    name = $category.children('.msg-category-head').data('title');

                if (!self._ignoreAllDialogNotTip) {

                    self.showIgnoreAllDialog(name, code);
                } else {
                    self._ignoreRemind(code);
                }
            }).on('click', '.msg-list-item', function () {
                var $el = $(this),
                    name = $el.data('title'),
                    url = $el.data('url'),
                    code = $el.data('guid'),
                    openType = $el.data('opentype');
                    
                // 无url不用打开处理页面
                if (url) {
                    openMsg({
                        id: code,
                        name: name,
                        url: url,
                        openType: openType
                    });
                }

                self.afterOpenMsg && self.afterOpenMsg();
            }).on('click', '.msg-item-ignore', function (event) {
                event.stopPropagation();

                var $el = $(this),
                    $item = $el.parent(),
                    guid = $item.data('guid'),
                    code = $item.closest('.msg-category').data('code');

                self._ignoreRemind(code, guid);
            });

        },
        // 初始化消息列表
        _initMsgRemind: function (data) {
            var html = [];

            if (data.length) {
                $.each(data, function (i, item) {
                    item.num = parseNum(item.num);

                    $.each(item.items, function (j, child) {
                        child.title = delHtmlTag(child.name);
                    });

                    html.push(M.render(msgRemindTempl, item));
                });

                $(Util.clearHtml(html.join(''))).appendTo(this.$wrap.empty().removeClass('empty'));
            } else {
                this.$wrap.empty().addClass('empty');
            }

            
        },

        // 获取消息
        getData: function () {
            var xhr = Util.ajax({
                url: this.getUrl
            });

            xhr.done($.proxy(this._initMsgRemind, this));
        },
        // guid为空，则忽略全部
        _ignoreRemind: function (type, guid) {
            guid = guid || "";

            var self = this,
                data = {
                    remindType: type
                };
            if (guid) {
                data.id = guid;
            }

            var xhr = Util.ajax({
                url: this.ignoreUrl,
                data: data
            });

            xhr.done(function (data) {

                // 执行忽略后的回调
                self.afterIgnore && self.afterIgnore(data);

                // 重新拉取最新消息内容
                self.getData();
            });
        },

        _ignoreAllDialogNotTip: false,

        showIgnoreAllDialog: function (name, code) {
            var self = this;
            mini.showMessageBox({
                title: '系统提示',
                message: ('忽略 ' + name + ' 下的所有未读消息？'),
                buttons: ['ok', 'cancel'],
                iconCls: 'mini-messagebox-question',
                showNoTipCheck: true,
                clickNoTipCheck: function (checked) {
                    self._ignoreAllDialogNotTip = checked;
                },
                callback: function (action) {
                    if (action == 'ok') {
                        self._ignoreRemind(code);
                    }
                }
            });
        }
    };

    win.MessageList = MessageList;
})(this, jQuery);