//EMsg交互
(function(win, $) {
    var EMSG_RECENT_TPL = '{{#items}}<li class="emsg-recent-item {{^hasRead}}newmsg{{/hasRead}}" data-sessionid="{{sessionId}}" data-uid="{{uid}}" data-type="{{type}}"><div class="emsg-user-img"><img src="{{imgUrl}}" onerror="this.onerror=\'\';this.src=\'../../../js/widgets/emsg/images/emsg-user-error.jpg\';" />{{^hasRead}}<i class="emsg-not-read"></i>{{/hasRead}}</div><div class="emsg-recent-record"><h2><span class="emsg-user-name" title="{{name}}">{{name}}</span><span class="emsg-recent-date">{{date}}</span></h2><p class="emsg-recent-message">{{message}}</p>{{^hasRead}} <span class="emsg-ignore-icon">忽略</span>{{/hasRead}}</div><i class="emsg-delete-icon">x</i></li>{{/items}}';

    var M = Mustache,
        msgEmsgRecentTempl = $.trim(EMSG_RECENT_TPL);

    function EMsgList(cfg) {
        this.$content = $(cfg.content);
        this.getUrl = cfg.getUrl;
        this.ignoreUrl = cfg.ignoreUrl;
        this.deleteUrl = cfg.deleteUrl || cfg.ignoreUrl;
        this.userImg = cfg.userImg;
        this.groupImg = cfg.groupImg;
        this.onDecEmsgCount = cfg.onDecEmsgCount;
        this.afterOpenEMsg = cfg.afterOpenEMsg;

        this._bindEvent();
    }

    EMsgList.prototype = {
        _bindEvent: function() {
            var self = this;
            this.$content.on("click", ".emsg-ignore-icon", function(e) {
                e.stopPropagation();
                $(this).closest("div").find(".emsg-not-read").remove();
                var sessionid = $(this).closest("li").removeClass('newmsg').data("sessionid");
                self.ignoreMessage(sessionid);
                self.onDecEmsgCount && self.onDecEmsgCount(sessionid);
                $(this).remove();
            }).on("click", ".emsg-recent-item", function(e) {
                e.stopPropagation(e);
                $(this).removeClass('newmsg');
                var $ignoreicon = $(this).find(".emsg-not-read,.emsg-ignore-icon");
                var sessionid = $(this).data("sessionid"),
                    uid = $(this).data("uid"),
                    type = $(this).data("type");
                if ($ignoreicon.length) {
                    $ignoreicon.remove();
                    self.onDecEmsgCount && self.onDecEmsgCount(sessionid);
                }
                OpenEMsg(sessionid, uid, type);

                self.afterOpenEMsg && self.afterOpenEMsg();
            }).on('click', ".emsg-delete-icon", function(e){
                e.stopPropagation();

                var $item = $(this).closest("li"),
                    sessionid = $item.data("sessionid");
                self.deleteMessage(sessionid);
                self.onDecEmsgCount && self.onDecEmsgCount(sessionid);

                $item.remove();
            });
        },
        renderEmsgPanel: function(data) {
            var self = this;
            if (data && data.sessionlist.length) {
                var fixdata = $.map(data.sessionlist, function(e, i) {
                    if (e.type === "friend" && e.imgUrl === "") {
                        e.imgUrl = self.userImg;
                    }
                    if (e.type === "group") {
                        e.imgUrl = self.groupImg;
                    }
                    e.message = e.message.replace(/<[^>]+>/g, "").replace(/&nbsp;/ig, "");
                    return e;
                });
                var html = M.render(msgEmsgRecentTempl, {
                    items: fixdata
                });
                $(Util.clearHtml(html)).appendTo(this.$content.empty().removeClass('empty'));
            } else {
                this.$content.empty().addClass('empty')
            }
        },
        getData: function() {
            var xhr = Util.ajax({
                url: this.getUrl,
                data: {
                    'query': 'loadrecentsession'
                },
            });
            xhr.done($.proxy(this.renderEmsgPanel, this));
        },
        ignoreMessage: function(sessionid) {
            Util.ajax({
                url: this.ignoreUrl,
                data: {
                    'query': 'ignoremessage',
                    'sessionid': sessionid
                }
            });
        },
        deleteMessage: function(sessionid){
            Util.ajax({
                url: this.deleteUrl,
                data: {
                    'query': 'deletemessage',
                    'sessionid': sessionid
                }
            });
        }
    };

    win.EMsgList = EMsgList;


})(this, jQuery);
