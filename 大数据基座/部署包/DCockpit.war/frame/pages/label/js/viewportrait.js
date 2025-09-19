/*
 * @Author: jjj 
 * @Date: 2019-10-16 10:35:58 
 * @Last Modified by: jjj
 * @Last Modified time: 2019-10-17 16:52:30
 * @Description: '' 
 */
var mockData = [];



// 筛选条件事件
(function (win, $) {
	
	
    var LOGIC_TPL = $.trim($("#logic-item-tpl").html()),
        OPERATE_TPL = $.trim($("#operate-item-tpl").html());

    var $ruleBox = $('#rule-box'),
        $ruleContainer = $('#rule-container');

    var ruleOperate = {
        collection: [{
            id: "1",
            name: "和",
            children: [{
                id: "2",
                name: "性别",
                operate: "1", // 1-5
                value: "值"
            }]
        }],
        getOperateText: function(type) {
            var data = [
                {
                    "id": 1,
                    "text": "小于"
                },
                {
                    "id": 2,
                    "text": "小于等于"
                },
                {
                    "id": 3,
                    "text": "等于"
                },
                {
                    "id": 4,
                    "text": "大于"
                },
                {
                    "id": 5,
                    "text": "大于等于"
                },
                {
                    "id": 6,
                    "text": "不等于"
                },
                {
                    "id": 7,
                    "text": "包含"
                }
            ];
            for(var i =0,len = data.length; i< len; i++) {
                if(data[i].id == type ){ 
                    return data[i].text;
                }
            }
            
        },
        // 设置数据获取dom
        setCollection: function (data) {
        	
        	var _str = '';

            function recursionRender(logic) {
                var _html = '';
                if (logic.children) {
                    var _operateStr = '';
                    $(logic.children).each(function (m, operate) {
                        if (operate.operate) {
                            // 运算操作
                            _operateStr += Mustache.render(OPERATE_TPL, operate);
                        } else {
                            // 逻辑
                            _operateStr += recursionRender(operate)

                        }
                    })
                }

                logic['operateHtml'] = _operateStr

                _html = Mustache.render(LOGIC_TPL, logic);
                return _html;


            }
            $(data).each(function (index, logic) {
                _str += recursionRender(logic)
            })
        	
        	
        	
            var str = '';
            // 第一层逻辑
            $(data).each(function(index, logic) {
                // 第二层规则
                if(logic.children) {
                    
                    var _operateStr = '';

                    $(logic.children).each(function(m, operate) {
                        
                        // 替换为中文
                        operate.operate = ruleOperate.getOperateText(operate.operate);
                        
                        if(operate.operate) {
                            _operateStr += Mustache.render(OPERATE_TPL, operate);
                        } else {
                            
                            if(operate.children.length) {
                                var secondLogicStr = '';
                                // 第三层逻辑对应的运算
                                $(operate.children).each(function(n, secondLogic) {
                                    secondLogic.operate = ruleOperate.getOperateText(secondLogic.operate);
                                    secondLogicStr += Mustache.render(OPERATE_TPL, secondLogic);
                                })
                                operate['operateHtml'] = secondLogicStr;
                            }

                            _operateStr += Mustache.render(LOGIC_TPL, operate);
                        }
                    })
                }
                logic['operateHtml'] = _operateStr

                str += Mustache.render(LOGIC_TPL, logic);
                
            });

            return str;
        },
        editRule: function(data) {
            // console.log(ruleOperate.setCollection(data));
            $('#rule-container').html(ruleOperate.setCollection(data));
        }
    };

    win.ruleOperate = ruleOperate;
})(window, jQuery);