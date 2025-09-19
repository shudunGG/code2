(function (win, $) {
    
	var $chartSelect = $('#parttime-items');
	
	win.getTplHtml = function(id, data) {
		var tpl = $('#' + id).html();
		Mustache.parse(tpl);
		return Mustache.render(tpl, data);
	}

    function initPage () {
    	Util.ajax({
			url : 'rest/parttimeswitchaction/getParttimeList?isCommondto=true'
		}).done(function(data) {
			selectList = data;
			$chartSelect.html(getTplHtml('left-item-tpl', {
				list : selectList
			}));
		})
		
		initListerens ();
    }
    
    
    function initListerens () {
        $('#parttime-items').on('click', '.parttime-items-item', function (data) {
       	    var ouguid = $(this).prop('id');
        	var userguid=$(this).data('userguid');
        	
        	Util.ajax({
    			url : 'rest/parttimeswitchaction/changgeParttimeOU?isCommondto=true',
    			data: {
    				ouguid:ouguid,
    				userguid:userguid
    	        },
    	        success: function() {
    	        	epoint.closeDialog('success');
    	        }
    		})
    		//$(this).find('.icon-check').removeClass('hidden').parent().siblings().find('.icon-check').addClass('hidden');
        });
    }

    initPage();
}(this, jQuery));