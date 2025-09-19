mini.overwrite(mini.TreeGrid, {
    dataField: 'data',
    set: function (kv) {
        if (typeof kv == 'string') {
            return this;
        }
        // 将autoLoad默认设置为false
        if(kv.autoLoad === undefined){
        	this.setAutoLoad(false);
        }

        // 将resultAsTree默认设置为false
        if(kv.resultAsTree == undefined){
            this.setResultAsTree(false);
        }
        
        mini.TreeGrid.superclass.set.call(this, kv);

        return this;
    },

    // // treegrid控件是不支持分页的，不能设置showPager属性
    // setShowPager: function() {

    // },

    getAllSelecteds: function() {
        return this.getSelecteds();
    }
});