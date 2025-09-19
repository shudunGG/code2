/**!
* 数字驾驶舱-数字晾晒台指标
* date:2021-02-24
* author: xulei;
*/

'use strict';
/* global pageConfig */

(function (win, $) {
    var guid = Util.getUrlParams('guid'); // 指标guid

        function getNormoperaDetail() {
        	console.log(pageConfig.getNormInfo);
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
        
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        Math.uuidFast = function() {
            var chars = CHARS, uuid = new Array(36), rnd=0, r;
            for (var i = 0; i < 36; i++) {
              if (i==8 || i==13 ||  i==18 || i==23) {
                uuid[i] = '-';
              } else if (i==14) {
                uuid[i] = '4';
              } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
              }
            }
            return uuid.join('');
          };
        
        // 提交
        win.submit = function () {
        	var name = mini.get('name').getValue();
        	var description = mini.get('description').getValue();
            //var commonDtoData = epoint.getCommonDtoData();
            //console.log(commonDtoData);
//            var params = $.extend({
//                guid: guid, // 指标guid
//            }, commonDtoData);
            Util.ajax({
                url: pageConfig.insertFeedback,
                data: {
                    params: JSON.stringify({
                    	rowGuid: Math.uuidFast(),
                    	feedbackTitle: name,
                    	feedbackDescribe: description,
                    	submitter: "45f0c5f9-cad2-49e6-887d-b38dfcbc23de",
                    	cockpitGuid: '',
                    	columnGuid: '',
                    	projectCateGuid: '',
                    	projectGuid: '',
                    	plateGuid: '',
                    	cardCateGuid: '',
                    	cardGuid: '',
                    	normGuid:guid
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