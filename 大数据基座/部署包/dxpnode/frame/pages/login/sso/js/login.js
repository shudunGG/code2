/*!
 * 新点统一认证平台
 * author: xiaolong
 */

$(function(){
    new TabView({
        dom: $(".login-wrap"),
        triggerEvent: 'click',
        activeCls: 'act'
    });

    $('input[placeholder]').placeholder();

})
