// 接受构建工具的编译注入
var $buildSkinStyle = $('<style id="buildSkin"></style>').appendTo('head');
$(window).on('message', function (ev) {
    var event = ev.originalEvent;
    var data = event.data;
    if (data + '' === data) {
        data = JSON.parse(data);
    }

    try {
        if (data.type == 'skinBuild') {
            $buildSkinStyle.text(data.css);
            $('iframe').each(function (i, ifr) {
                ifr.contentWindow.postMessage(JSON.stringify(data), '*');
            });
        }
    } catch (error) {

    }

});

// Polyfill for Element.prototype.matches
if (!Element.prototype.matches) {
    var ep = Element.prototype;
    ep.matches = ep.msMatchesSelector || ep.webkitMatchesSelector || ep.mozMatchesSelector || ep.oMatchesSelector;
    if (!ep.matches) {
        ep.matches = function () {
            throw new Error('浏览器实在太老，该换代了！！！');
        };
    }
    ep = null;
}

if (!window.Element.prototype.closest) {
    window.Element.prototype.closest = function (selector) {
        if (selector === void(0)) {
            throw new TypeError("Failed to execute 'closest' on 'Element': 1 argument required, but only 0 present.");
        }
        if (selector + '' !== selector) {
            throw new TypeError("Failed to execute 'closest' on 'Element': the argument must be string.");
        }
        var el = this;
        do {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === Node.ELEMENT_NODE)
        return null;
    };
}

if (!window.Element.prototype.closestAll) {
    window.Element.prototype.closestAll = function (selector) {
        if (selector === void(0)) {
            throw new TypeError("Failed to execute 'closest' on 'Element': 1 argument required, but only 0 present.");
        }
        if (selector + '' !== selector) {
            throw new TypeError("Failed to execute 'closest' on 'Element': the argument must be string");
        }
        var el = this;
        var arr = [];
        do {
            if (el.matches(selector)) {
                arr.push(el);
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === Node.ELEMENT_NODE)
        return arr;
    };
}