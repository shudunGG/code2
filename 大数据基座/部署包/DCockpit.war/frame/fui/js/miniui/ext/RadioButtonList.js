mini.overwrite(mini.RadioButtonList, {
    autoLoad: false,
    setUrl: function (url) {
        this.url = url;
        if(this.autoLoad) {
            this._doLoad({});
        }
        
    }

});