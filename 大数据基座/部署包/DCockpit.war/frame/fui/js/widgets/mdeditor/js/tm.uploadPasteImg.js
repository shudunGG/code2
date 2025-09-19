//chrome浏览器复制粘贴图片上传
(function(){

    window.UploadImage = function(opt){
        this.url = opt.url;
        this.dom = opt.id;
        this.callback = opt.callback;

        this.dom = this.dom != document ? document.getElementById(this.dom) : document;
        
        this.initEvent();
    };
    UploadImage.prototype.initEvent = function() {
        var that = this;
        that.dom.addEventListener('paste', function(e) {
            if(e.clipboardData || e.originalEvent) {
                var clipboardData = (e.clipboardData || e.originalEvent.clipboardData);

                if (clipboardData.items) {
                    var items = clipboardData.items,
                        len = items.length,
                        blob = null;

                    //e.preventDefault();

                    for (var i = 0; i < len; i++) {
                        if ((items[i].kind == 'file') && items[i].type.match('^image/')) {

                            blob = items[i].getAsFile();
                        }
                    }

                    if (blob !== null) {
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            // event.target.result 即为图片的Base64编码字符串
                            var base64_str = event.target.result;
                            //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
                            that.uploadImgFromPaste(base64_str,e);
                        }
                        reader.readAsDataURL(blob);
                    }
                }

            }
        });
    }

    UploadImage.prototype.dataURItoBlob = function(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    }


    UploadImage.prototype.uploadImgFromPaste = function(file,e) {
        var that = this;
        var formData = new FormData();

        var blob = that.dataURItoBlob(file);
        formData.append('fileList', blob);
        /* if(sessionStorage.u) {
            formData.append('userGuid', sessionStorage.u);
        } */

        Util.ajax({
            url: that.url,
            type: 'POST',
            data: formData,
            processData: false,//必须false才会避开jQuery对 formdata 的默认处理,XMLHttpRequest会对 formdata 进行正确的处理
            contentType: false //必须false才会自动加上正确的Content-Type
        }).always(function(res) {
            if(typeof that.callback == 'function') {
                that.callback(res,e);
            }
        });
    };

    UploadImage.prototype.uploadUrl = function(opt) {
        this.url = opt.url;
    } 
})();