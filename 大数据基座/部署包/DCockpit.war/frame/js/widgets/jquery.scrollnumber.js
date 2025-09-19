/**
 * 数字滚动控件
 * date:2018-09-15
 * author: [chengang];
 */
(function ($) {
	var defaults = {
		figure: 6, //默认位数
		number: 0, //默认值
		height: null, //如果supportrem为true则必填，元素psd测量出来的高度，及rem值*100
		supportrem: false,
		rem2px: 100
	};

	function ScrollNumber(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this.init();
	}

	ScrollNumber.prototype = {
		init: function () {
			var self = this,
				settings = self.settings;

			var num = "0123456789".split("").map(function (n) {
				return "<i>" + n + "</i>";
			}).join(''),
				numStr = "<div class='sequence'><span>" + num + "</span></div>";

			settings.tagName = self.element.tagName;

			settings.ulStr = "<li class='item'>" + numStr + "</li>";
			settings.divStr = "<div class='item'>" + numStr + "</div>";

			for (var i = 0; i < settings.figure; i++) {
				if (settings.tagName == "UL") {
					$(self.element).append(settings.ulStr);
				} else {
					$(self.element).append(settings.divStr);
				}
			}

			if (settings.number) {
				self.scroll(settings.number);
			}
		},
		scroll: function (number) {
			var self = this,
				settings = self.settings;
			settings.currnumber = number;

			var len = String(number).length,
				numstr = number.toString();
			if (len < settings.figure) {
				for (var i = 0; i < settings.figure - len; i++) {
					numstr = "0" + numstr;
				}
			} else if (len > settings.figure) {
				for (var j = 0; j < len - settings.figure; j++) {
					if (settings.tagName == "UL") {
						$(self.element).append(settings.ulStr);
					} else {
						$(self.element).append(settings.divStr);
					}
				}
				settings.figure = len;
			}

			$(".item", self.element).each(function (i) {
				var $scrollBox = $(this).find("span");
				var n = numstr.charAt(i);
				$(this).attr("data-scrollvalue", n);
				setTimeout(function () {
					$scrollBox.css({ top: -n + "00%" });
				}, i * 100);
			});
		}
	};

	$.fn.scrollNumber = function (options, param) {
		if (typeof options === "string") {
			var method = $.fn.scrollNumber.methods[options];
			if (method) {
				return method(this, param);
			}
		}

		return this.each(function () {
			if (!$.data(this, "scrollNumber")) {
				$.data(this, "scrollNumber", new ScrollNumber(this, options));
			}
		});
	};

	$.fn.scrollNumber.methods = {
		refresh: function (jq, number) {
			return jq.each(function () {
				$.data(this, "scrollNumber").scroll(number);
			});
		}
	};
})(jQuery, window);
