(function () {
    function debounce(fn, delay) {
        var timer;
        return function () {
            var _this = this,
                args = arguments;
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(_this, args);
            }, delay || 3000);
        };
    }

    function rem() {
        var docEl = document.documentElement,
            clientWidth = docEl.clientWidth;
        if (clientWidth < 1366) clientWidth = 1366;
        docEl.style.fontSize = (30 / 554) * clientWidth - 3.97 + "px";
    }

    rem();

    window.addEventListener("resize", debounce(rem, 50));
})();
