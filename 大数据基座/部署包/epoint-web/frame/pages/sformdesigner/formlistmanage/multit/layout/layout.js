(function (win, $) {
    $('#layouts').on('click','.layout',function() {
        var $this = $(this);
        if($this.hasClass('disabled')) {
            return;
        }
        $this.addClass('active').siblings().removeClass('active')
    })

    $('#bottom').on('click','.prev-btn',function() {
      var rowguid = Util.getUrlParams('rowguid');
		var isSub = Util.getUrlParams('isSub');
		var relationguid = Util.getUrlParams('relationguid');
		win.parent.goCustomPrev(rowguid, isSub, relationguid);
    })
    .on('click','.next-btn',function() {
        var $activeLayout = $('.layout.active');
        if(!$activeLayout.length) {
            epoint.showTips('请选择布局', {
                state: 'info',
                timeout: 3000
            });
        } else {
            Util.ajax({
                url: saveLayoutUrl,
                data: {
                    layout: String($activeLayout.data('layout'))
                }
            }).done(function(data) {
				 mini.showMessageBox({
			            title: "提示",
			            iconCls: "mini-messagebox-question",
			            buttons: ["开始设计", "稍后再说"],
			            message: "表单已创建完成，是否进入设计页面？",
			            callback: function (action) {
			               if(action=="开始设计"){	           	  
			                    		window.open(Util.getRootPath()
			                					+ "frame/pages/sformdesigner/formlistmanage/multit/designer?tableGuid="
			                					+ Util.getUrlParams("rowguid") + "&designId="+data.designId
			                					+ "&isSub=" + Util.getUrlParams("isSub")
			                					+"&relationguid="+Util.getUrlParams('relationguid')
			                					+"&designerType="+data.designerType);	
			                    		 win.parent.closeDialog();
			                    				                    	 		                    	                 
			               }else{
			            	   win.parent.closeDialog();
			               }
			            }
			        });			 		
                
            })
        }
    })

})(this, jQuery);