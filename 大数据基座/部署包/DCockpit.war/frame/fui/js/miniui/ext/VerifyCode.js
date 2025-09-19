mini.overwrite(mini.VerifyCode, {
	mapClass: 'com.epoint.basic.faces.verifycode.VerifyCode',
	autoLoad: false,

    ignorecase: true,
    
    setData: function(data) {
        this.value = data.value;
        this._img.src = data.src;
        this.uuid = data.uuid;
    },

    getExtraAttrs: function(el) {
        var attrs = {};
        mini._ParseBool(el, attrs, ["ignorecase"
        ]);
        return attrs;
    }
});