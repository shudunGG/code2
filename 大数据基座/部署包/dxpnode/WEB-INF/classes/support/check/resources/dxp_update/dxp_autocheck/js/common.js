var buildcommon = function() {
	return {
		buildHead : function(index) {
			$.get('header', function(html) {
				$(document.body).prepend(html);
				$(".navbar .nav li").eq(index).addClass("active");
			}, "html");

		},

		buildFooter : function() {
			var html = '<footer class="footer">'
					+ '    		<div class="container">'
					+ '提供者：<a href="http://www.epoint.com.cn" target="_blank">新点软件</a> '
					+ '			</div>' + ' </footer>';
			$(document.body).append(html);
		}
	}
}();

$.ajaxSetup({
	beforeSend : function() {
		$('#loading').show();

	},
	complete : function() {
		$('#loading').hide();
	}
})
