/*!
 * 通过body master属性动态载入导航模板资源
 */
(function (win, $) {
    var MASTER_NAMES = ['leftAccNav', 'leftAccTree', 'topWizard', 'leftWizard', 'topTabNav'];

    var $content = $('body > .master-content'),
        master = $content.attr('master'),
        srcdir = $content.attr('srcdir'); // 获取个性化的目录路径

    // 获取路径前半部分，如：fui/js/navpages/name/name
    var getPathPrefix = function (name) {
        var path = 'frame/fui/js/widgets/navpages'; // 默认路径
        if (srcdir) {
            path = srcdir; // 个性化路径
        }
        return path + '/' + name + '/' + name;
    };

    // 初始化模板结构和资源
    var initMaster = function (name) {
        var prefix = getPathPrefix(name);

        // $content.load(Util.getRightUrl(prefix + '_snippet.html'), function () {
        $.ajax(Util.getRightUrl(prefix + '_snippet.html')).done(function(tplHtml) {
            $content.replaceWith(tplHtml);
            if ($.inArray(name, ['leftAccNav', 'leftAccTree']) != -1) {
                // Util.leftRight.parse();
                Util.layoutInstance.parse();
            }

            Util.loadCss(prefix + '.css');
            Util.loadJs(prefix + '.js');
        });
    };

    $(function () {
        $content.length && initMaster(master);
    });

}(this, jQuery));