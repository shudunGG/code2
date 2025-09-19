$(function() {
	//动态加载部分js及css
    window.onload = function() {
    	$.ajax({
            type: 'POST',
            async: false,
            dataType: 'json',
            url: '../formlistmanage/stylecustomaction.action?cmd=pageLoad',
            data: {
                tableId: Util.getUrlParams().tableId,
                versionInfo: Util.getUrlParams().versionInfo
            },
            success: function (data) {
				if(data && data.custom){
					$('#cssContent').text(data.custom.cssContent); 
            	    var script = document.createElement('script'); 
            	    script.innerText = data.custom.jsContent; 
            	    document.body.appendChild(script);
				}
            }
        });
    };
	
})