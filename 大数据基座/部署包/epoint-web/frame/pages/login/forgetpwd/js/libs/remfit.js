// rem适配代码
window.setBasicSize = function () {
    var docEl = top.document.documentElement,
        clientWidth = docEl.clientWidth;
    if (clientWidth < 1281) clientWidth = 1280;
    document.documentElement.style.fontSize = (30 / 554 * clientWidth - 3.97) + 'px';
};
setBasicSize();
var pageResizeTimer = null;
window.addEventListener('resize', function () {
    if (pageResizeTimer) clearTimeout(pageResizeTimer);
    pageResizeTimer = this.setTimeout(setBasicSize, 50);
});