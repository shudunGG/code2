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
          
          Date.prototype.Format = function (fmt) {
        	    var o = {
        	        "M+": this.getMonth() + 1, //月份
        	        "d+": this.getDate(), //日
        	        "H+": this.getHours(), //小时
        	        "m+": this.getMinutes(), //分
        	        "s+": this.getSeconds(), //秒
        	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        	        "S": this.getMilliseconds() //毫秒
        	    };
        	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        	    for (var k in o)
        	        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        	    return fmt;

          }
        
        // 提交
        win.submit = function () {
        	var name = mini.get('name').getValue();
        	console.log(name);
        	var description = mini.get('description').getValue();
        	var date = mini.get('date').getValue();
        	if(date){
            	date = date.Format("yyyy-MM-dd HH");
        	}
        	
            Util.ajax({
                url: pageConfig.launchRedLight,
                data: {
                    params: JSON.stringify({
                    	redLightGuid: Math.uuidFast(),
                    	cockpitGuid:'',
                    	columnGuid: '',
                    	projectCateGuid: '',
                    	projectGuid: '',
                    	plateGuid: '',
                    	cardCateGuid: '',
                    	cardGuid: '',
                    	launchUserGuid: "45f0c5f9-cad2-49e6-887d-b38dfcbc23de",//发起人
                    	responseUserGuid: "45f0c5f9-cad2-49e6-887d-b38dfcbc23de",//责任人
                    	normGuid:guid,
                    	expectedPerformanceTime:date, //期望完成时间
                    	title:name,
                    	content: description
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