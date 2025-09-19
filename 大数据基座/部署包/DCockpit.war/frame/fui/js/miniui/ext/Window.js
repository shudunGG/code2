mini.overwrite(mini.Window, {
     destroy: function (removeEl) {
        //this._doModal();
        //mini.un(document, "mousedown", this.__OnBodyMouseDown, this);
        mini.un(window, "resize", this.__OnWindowResize, this);


        if (this._modalEl) {
            jQuery(this._modalEl).remove();
            this._modalEl = null;
        }
        if (this.shadowEl) {
            jQuery(this.shadowEl).remove();
            this.shadowEl = null;
        }

        var id = '__modal' + this._id;
        jQuery("[id='" + id + "']").remove();


        mini.Window.superclass.destroy.call(this, removeEl);

        if(mini.isIE8) {
            var $el = jQuery('[class*="icon-"]');
            $el.addClass('modicon-empty');

            setTimeout(function() {
                $el.removeClass('modicon-empty');
            }, 0);
        }        
    }
});
   