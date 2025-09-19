mini.overwrite(mini.DataImport, {
    extraId: '',

    _onPostFileMd5: function(data) {
        var extraData,
        uploadData;
        if(this.extraId) {
            extraData = DtoUtils.getCommonDto(this.extraId).getData(true);
            uploadData = this.uploader.getCommonData();
            for(var i in extraData){
                if(extraData.hasOwnProperty(i) && i != "_common_hidden_viewdata") {
                    uploadData.push(extraData[i]);
                }
            }

            data.commonDto = mini.encode(uploadData);
        }
    },
    setUrl: function (url) {
        url = url.indexOf('isCommondto') != -1 ?
                // 已经有isCommondto了 就不处理
                url :
                // 没有isCommondto 根据是否有？ 拼接上 '&' 或 '?' + 'isCommondto=true
                (url + (url.indexOf('?') != -1 ? '&' : '?') + 'isCommondto=true');
                
        this.url = url;

        this.uploader && this.uploader.setUploadUrl(url);
    }
});