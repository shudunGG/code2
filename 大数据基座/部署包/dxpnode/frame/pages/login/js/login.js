/**!
 * 公司数据集成
 * date:2019-09-23
 * author: huangweiping;
 */
$(function() {
    $('[placeholder]').placeholder();

    //记住密码按钮
    $('body').on('click','.rem-btn',function(){
        $(this).toggleClass('checked');
    });

       //背景
    var bv = new Bideo();
    bv.init({
        videoEl: document.querySelector("#background_video"),
        container: document.querySelector("body"),
        resize: true,
        src: [
            {
                src: "images/bg.mp4",
                type: "video/mp4"
            }
        ]
    });
})
