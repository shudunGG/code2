mini.overwrite(mini.CheckBoxList, {
    autoLoad: false,
    setUrl: function (url) {
        this.url = url;
        if(this.autoLoad) {
            this._doLoad({});
        }
        
    }

});