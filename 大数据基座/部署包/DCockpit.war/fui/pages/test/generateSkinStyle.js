/**
 * @Author: chends
 * @Date: 2018-07-03 12:40:06
 * @LastEditors: chends
 * @LastEditTime: 2018-07-03 12:40:06
 * @Description: 皮肤配色生成测试文件
 */

var type2color = {
    border: '#ef6366',
    color: '#ef6366',
    background: '#fef0f0'
}

function generateSkinStyle(cfgs) {
    var style = '';
    var typeColor = undefined;
    $.each(cfgs, function (i, item) {
        typeColor = type2color[item.type];
        if (typeColor !== undefined) {
            style += item.cls + '{' + item.prop + ':' + typeColor + '}';
        }
    });
    if (style) {
        console.log(style);
        var tag = document.createElement('style');
        tag.setAttribute('id', 'auto-generate-skinstyle');
        // ie8 style 不能直接操作
        if ('styleSheet' in tag) {
            tag.setAttribute('type', 'text/css');
            tag.styleSheet.cssText = style;
        } else {
            style.innerText = style;
        }
        document.head.appendChild(tag);
    }
}

// prop, cls, color/type

generateSkinStyle([{
    cls: '.tabview-header-item.active',
    prop: 'color',
    type: 'color'
}, {
    cls: '.tabview-header-item.active:after',
    prop: 'border-bottom-color',
    type: 'border'
}, {
    cls: '.cate-header',
    prop: 'background',
    type: 'background'
}]);