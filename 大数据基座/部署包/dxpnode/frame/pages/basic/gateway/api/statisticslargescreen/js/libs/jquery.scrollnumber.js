/**
 * 数字滚动控件
 * date:2018-09-15
 * author: [chengang];
 */
(function ($, window) {
	var defaults = {
		figure: 6,   //默认位数
		number: 0,    //默认值
		height: null, //如果supportrem为true则必填，元素psd测量出来的高度，及rem值*100
		supportrem: false
	};

	function ScrollNumber(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this.init();
	}

	ScrollNumber.prototype = {
		init: function () {
			var self = this, settings = self.settings;
			for (var i = 0; i < settings.figure; i++) {
				$(self.element).append("<li></li>");
			}
			if (settings.supportrem) {
				settings.step = settings.height / 100;
			} else {
				settings.step = $("li", self.element).eq(0).height();
			}
			if (settings.number) {
				self.scroll(settings.number);
			}
		},
		scroll: function (number) {
			var self = this, settings = self.settings;
			settings.currnumber = number;

			var len = String(number).length, numstr = number.toString();
			if (len < settings.figure) {
				for (var i = 0; i < settings.figure - len; i++) {
					numstr = "0" + numstr;
				}
			}
			else if (len > settings.figure) {
				for (var j = 0; j < len - settings.figure; j++) {
					$(self.element).append("<li></li>");
				}
				settings.figure = len;
			}

			$("li", self.element).each(function (i, e) {
				var n = numstr.charAt(i),
					y = -parseInt(n) * settings.step;
				setTimeout(function () {
					$(e).css("background-position", "0 " + y + (settings.supportrem ? "rem" : "px"));
				}, i * 100);
			});
		}
	};

	$.fn.ScrollNumber = function (options, param) {
		if (typeof options === 'string') {
			var method = $.fn.ScrollNumber.methods[options];
			if (method) {
				return method(this, param);
			}
		}
		return this.each(function () {
			if (!$.data(this, "ScrollNumber")) {
				$.data(this, "ScrollNumber", new ScrollNumber(this, options));
			}
		});
	};

	$.fn.ScrollNumber.methods = {
		refresh: function (jq, number) {
			return jq.each(function () {
				$.data(this, 'ScrollNumber').scroll(number);
			});
		}
	};

})(jQuery, window);
