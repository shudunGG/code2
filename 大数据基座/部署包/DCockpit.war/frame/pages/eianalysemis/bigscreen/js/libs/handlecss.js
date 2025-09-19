/* 换肤 */
(function(win, $) {

    window.curSkin = getUrlParams('skin') ? getUrlParams('skin') : ($(win).width() >= 4000 ? 'bigscreen' : 'system');

    /**
     * 更新皮肤
     * @param {string} skin 皮肤名称
     */
    window.updateCustomSkin = function(skin) {
        $('[name="custom-page-style"]')
            .prop('disabled', true)
            .filter('[data-name="' + skin + '"]')
            .prop('disabled', false);

    };

    updateCustomSkin(curSkin);

    // 获取url参数值
    function getUrlParams(name) {
        var params = {},
            query = location.search.substring(1),
            arr = query.split('&'),
            rt;

        $.each(arr, function(i, item) {
            var tmp = item.split('='),
                key = tmp[0],
                val = decodeURIComponent(tmp[1]);

            if (typeof params[key] === 'undefined') {
                params[key] = val;
            } else if (typeof params[key] === 'string') {
                params[key] = [params[key], val];
            } else {
                params[key].push(val);
            }
        });

        rt = name ? params[name] : params;

        return rt;
    }

})(this, jQuery);