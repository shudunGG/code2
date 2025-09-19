$(function() {

	var url = 'epointtemp/sformstylecustomaction.action?cmd=pageLoad';
	// 动态加载部分js及css
	window.onload = function() {
		$.ajax({
			type : 'POST',
			async : false,
			dataType : 'json',
			url : url,
			data : {
				tableId : window.tableid,
				versionGuid : window.versionguid
			},
			success : function(data) {
				//$('#cssContent').text(data.custom.cssContent);
				var script = document.createElement('script');
				script.innerText = data.custom.jsContent;
				document.body.appendChild(script);
			}
		});
	};

})