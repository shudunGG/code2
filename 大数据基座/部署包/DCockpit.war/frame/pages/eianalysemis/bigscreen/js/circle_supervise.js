/**!
* 数字驾驶舱-数字晾晒台指标
* date:2021-02-24
* author: xulei;
*/

'use strict';
/* global pageConfig */

(function (win, $) {
    var guid = Util.getUrlParams('guid'); // 指标guid

    function generateguid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    var uuid = '';

    function getNormoperaDetail() {
        Util.ajax({
            url: pageConfig.getNormInfo,
            data: {
                params: JSON.stringify({
                    normguid: guid
                })
            },
            success: function (data) {
                Util.hidePageLoading();
                data.responsibility = data.responsibilityDepartment + '-' + data.responsibilityUser;
                Util.renderNum('info', data);
            }
        });
    }

    getNormoperaDetail();

    document.querySelector("#fileform").addEventListener("submit", function(event) {
        event.preventDefault();
        var formdata=new FormData($("#fileform")[0]);
        if($("#fileinfo").get(0).files.length == 0){
            epoint.alert("还未上传文件");
            return;
        }
        var filename = $("#fileinfo").get(0).files[0].name;
        if(filename.split(".").length < 2){
            epoint.alert("请上传正确的文件");
            return;
        }
        if(!['jpg', 'jpeg', 'png', 'gif'].includes(filename.split(".")[1])){
            epoint.alert("仅支持上传jpg,.jpeg,.png,.gif文件");
            return;
        }
        // formdata.append("file", $("#fileform")[0].files[0]);
        uuid = generateguid();
        console.log(uuid);
        formdata.append("attachguid", uuid);
        formdata.append("normguid", guid);
        $.ajax({
            type : 'post',
            url : pageConfig.uploadUrl,
            data : formdata,
            cache : false,
            processData : false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType :false, // 不设置Content-type请求头
            success : function(res){
                console.log(res);
                res = JSON.parse(res);
                if((res.status==200) || (res.result == "success"))
                    epoint.alert("上传成功");
                else{
                    epoint.alert("上传失败");
                }
            },
            error : function(x){
                epoint.alert("连接服务器失败");
                console.log('wrong:',x)
            }
        })
    })

    
    // 提交
    win.submit = function () {
        var description = mini.get('description').getValue();
        Util.ajax({
            url: pageConfig.insertNormNotes,
            data: {
                params: JSON.stringify({
                    userguid: "45f0c5f9-cad2-49e6-887d-b38dfcbc23de",//圈阅人
                    normguid:guid,
                    notes: description, //圈阅说明
                    receiveuserguid: "45f0c5f9-cad2-49e6-887d-b38dfcbc23de",//接收人
                    attachguid:uuid,//图片guid
                    cockpitGuid:'',
                    columnGuid: '',
                    projectCateGuid: '',
                    projectGuid: '',
                    plateGuid: '',
                    cardCateGuid: '',
                    cardGuid: '',
                    rowguid: uuid
                })
            },
            success: function (data) {
                if (!data.text) {
                    // 刷新操作中心中的方法
                    // top.$('#operation-layer iframe')[0].contentWindow.getNormoperaList();
                    // 关闭弹窗
                    Util.closeTopLayer();
                } else {
                    epoint.showTips(data.text, {
                        state: 'error'
                    });
                }
            }
        });

    };
})(this, jQuery);