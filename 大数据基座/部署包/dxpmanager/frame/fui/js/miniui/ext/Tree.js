mini.overwrite(mini.Tree, {
    set: function (kv) {
        if (typeof kv == 'string') {
            return this;
        }

        // 将autoLoad默认设置为false
        if(kv.autoLoad == undefined){
        	this.setAutoLoad(false);
        }

        // 将resultAsTree默认设置为false
        if(kv.resultAsTree == undefined){
            this.setResultAsTree(false);
        }
        
        mini.Tree.superclass.set.call(this, kv);
        

        return this;
    }
});