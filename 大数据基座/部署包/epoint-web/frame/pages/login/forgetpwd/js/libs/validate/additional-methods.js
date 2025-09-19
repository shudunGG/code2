/*!
 * jQuery Validation Plugin 自定义验证规则
 */
(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "./jquery.validate"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function($) {
    //用户名为3-20个字符，字母数字下划线组合，字母开头
    jQuery.validator.addMethod('username', function(value, element) {
        var checkname = /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){2,19}$/;
        return this.optional(element) || checkname.test(value);
    }, "用户名格式不正确");

    //密码为6-20个字符，字母数字或符号两种以上组成
    jQuery.validator.addMethod('checkpassword', function(value, element) {
        var checkpassword = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,20}$/;
        return this.optional(element) || checkpassword.test(value);
    }, "密码格式输入不正确");

    //验证是否包含空格
    $.validator.addMethod("nowhitespace", function(value, element) {
        return this.optional(element) || /^\S+$/i.test(value);
    }, "不能包含空格");

    //验证手机号码
    $.validator.addMethod("phonenumber", function(value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码");
    return $;
}));