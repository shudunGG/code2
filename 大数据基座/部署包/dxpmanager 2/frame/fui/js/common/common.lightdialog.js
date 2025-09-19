/*
 * 不带标题的轻量化弹窗
 */
(function(win, $){
    var defaultConfig = {
        showModal: true,
        showCloseButton: true,
        width: 600,
        height: 400
    };
    var LightDialog = function(cfg){
        this.cfg = $.extend({},defaultConfig, cfg);

        this.__onDestroy = cfg.ondestroy;
        this.__onLoad = cfg.onload;

        this._init();
    };

    LightDialog.prototype = {
        constructor: LightDialog,

        _init: function(){
            this.$container = $('<div class="lightdialog hidden"><iframe width="100%" height="100%" frameborder="0"></iframe><i class="lightdialog-close hidden"></i></div>');
            this.$iframe = this.$container.children('iframe');

            this.$closeIcon = this.$container.children('.lightdialog-close');

            this.$iframe[0].src = Util.getRightUrl(this.cfg.url);

            var self = this;
            this.$iframe.on('load', function(){
                self._doLoadIframe();
            });

            if(this.cfg.showModal) {
                this.$modal = $('<div class="lightdialog-modal hidden"></div>').appendTo('body');
            }

            if(this.cfg.showCloseButton) {
                this.$closeIcon.removeClass('hidden');
                this.$closeIcon.on('click', function(){
                    self.close();
                });
            }

            this.$container.appendTo('body');
        },

        _doLoadIframe: function() {
            var self = this;
            function CloseOwnerWindow(action) {
                var ret = true;
                try {
                    if (self.__onDestroy) ret = self.__onDestroy(action);
                } catch (ex) { }

                if (ret === false) {
                    return false;
                }

                setTimeout(function () {
                    self.close();
                }, 10);
            }

            try {

                this.$iframe[0].contentWindow.Owner = win;
                this.$iframe[0].contentWindow.CloseOwnerWindow = CloseOwnerWindow;
            } catch (e) { }

            if(this.__onLoad) {
                this.__onLoad();
            }
        },

        _doRemoveIFrame: function() {
            if(this.$iframe) {
                Util.clearIframe(this.$iframe);

                this.$iframe = null;
            }
        },

        show: function() {
            var winBox = Util.getWinSize(),
                width = parseInt(this.cfg.width, 10),
                height = parseInt(this.cfg.height),
                left = (winBox.width - width) / 2,
                top = (winBox.height - height) / 2;

            if(this.cfg.showModal) {
                this.$modal.css('z-index', Util.getZIndex()).removeClass('hidden');
            }

            this.$container.css({
                left: left,
                top: top,
                width: width,
                height: height,
                zIndex: Util.getZIndex()
            }).removeClass('hidden');
        },

        close: function(){
            this._doRemoveIFrame();

            this.$container.remove();
            this.$modal && this.$modal.remove();
        },

        getIFrameEl: function() {
            return this.$iframe ? this.$iframe[0] : undefined;
        }
    };

    var topWin;
    function getTopWin(me) {
        try {
            if (me.Util && me.Util.openLightDialog) topWin = me;
            if (me.parent && me.parent != me) {
                getTopWin(me.parent);
            }
        } catch (ex) { }
    }

    $.extend(Util, {
        openLightDialog: function(cfg) {
            var dialog = new LightDialog(cfg);
    
            dialog.show();
    
            return dialog;
        },
        openTopLightDialog: function(cfg) {
            topWin || getTopWin(win);
            topWin.Util.openLightDialog(cfg);
        }
    });
    
})(this, jQuery);