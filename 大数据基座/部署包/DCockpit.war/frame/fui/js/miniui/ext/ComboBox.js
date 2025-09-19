mini.overwrite(mini.ComboBox, {
    _createPopup: function () {
        mini.ComboBox.superclass._createPopup.call(this);

        this._listbox = new mini.ListBox();

        this.listbox = this._listbox;

        this._listbox.delimiter = this.delimiter;
        this._listbox.setBorderStyle("border:0;");
        this._listbox.setStyle("width:100%;height:auto;");
        this._listbox.render(this.popup._contentEl);

        this._listbox.on("beforeitemclick", this.__OnBeforeItemClick, this);
        this._listbox.on("itemclick", this.__OnItemClick, this);
        this._listbox.on("drawcell", this.__OnItemDrawCell, this);

        var me = this;
        // 给listbox绑定commondto数据处理机制，解决在表格编辑列中设置url后自己请求数据的问题
        this._listbox.on("beforeload", function (e) {
            window.DtoUtils && window.DtoUtils.processBeforeLoad(e);
            me.fire("beforeload", e);
        }, this);
        this._listbox.on("preload", function (e) {
            me.fire("preload", e);
        }, this);
        this._listbox.on("load", function (e) {
            me.data = e.data;
            me.fire("load", e);
        }, this);
        this._listbox.on("loaderror", function (e) {
            me.fire("loaderror", e);
        }, this);
    }
});