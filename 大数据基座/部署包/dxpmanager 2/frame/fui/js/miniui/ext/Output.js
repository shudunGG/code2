mini.overwrite(mini.Output, {
    set: function (kv) {
        if (typeof kv == 'string') {
            return this;
        }

        // 将autoLoad默认设置为false
        if(kv.autoLoad == undefined){
        	this.setAutoLoad(false);
        }
        
        mini.Output.superclass.set.call(this, kv);
        

        return this;
    }
});