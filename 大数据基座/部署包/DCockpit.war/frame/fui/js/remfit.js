'use strict';
/* global setBasicSize */

// rem适配代码
window.setBasicSize = function() {
    var docEl = top.document.documentElement,
        clientWidth = docEl.clientWidth;
    if (clientWidth < 1366) clientWidth = 1366;
    document.documentElement.style.fontSize = (5 / 96 * clientWidth) + 'px';
};
setBasicSize();
window.addEventListener('DOMContentLoaded', function() {
    setBasicSize();
});
var pageResizeTimer = null;
window.addEventListener('resize', function() {
    if (pageResizeTimer) clearTimeout(pageResizeTimer);
    pageResizeTimer = this.setTimeout(setBasicSize, 50);
});