/**!
* 大屏驾驶舱管理-新增主题
* date:2021-03-12
* author: xulei;
*/

'use strict';
(function (win, $) {
    Util.hidePageLoading();

    var specialTextbox = mini.get('special-textbox'),
        classifyTmpl = $('#classify-tmpl').html(),
        $classifyList = $('#classify-list'),
        values = [],
        $content = $('.fui-content');
    
    // 添加分类
    $content.on('click', '#add-classify', function () {
    	if(values.length==0){
    		$(".classify-item-name").each(function(){
    			values.push($(this).html());
    		});
    	}
        var value = specialTextbox.value;
        if(value == ''){
        	epoint.alert("分类名称不能为空");
        	return;
        }
        if(value.length > 100){
        	epoint.alert("分类名称长度不能超过100");
        	return;
        }
        // 判断是否重复添加
        $.each(values, function (i) {
            if (value === values[i]) {
                value = '';
                return false;
            }
        });
        if (value) {
            values.push(value);
            specialTextbox.setValue('');
            $classifyList.append(Mustache.render(classifyTmpl, {
                list: {
                    name: value
                }
            }));
        }
        else{
            epoint.alert("请输入不重复的分类名");
        }
    });

    // 删除分类
    $content.on('click', '.classify-item-close', function () {
        var $this = $(this),
            $item = $this.closest('.classify-item'),
            name = $this.data('name'),
            guid = $this.data('guid');
        if (name) {
            name = name.toString();
            guid = guid.toString();
            values.splice($.inArray(name, values), 1);
        }
        console.log(guid);
        itemguids+=guid+";";
        $item.remove();
    });
})(this, jQuery);