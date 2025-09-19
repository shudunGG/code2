/**!
 * 安全验证弹框
 * date:2019-10-11
 * author: [xulb];
 */
(function (win, $) {
    layer.config({
        extend: './skin/web/custom.css'
    });

    layer.open({
        type: 2,
        title: '',
        closeBtn: false,
        content: ['content.html', 'no'],
        area: ['358px', '305px'],
        success: function () {

        }
    })

})(this, jQuery);