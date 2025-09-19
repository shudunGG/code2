/**
 * ! API调试 date:2019-4-2 author: [xlb];
 */
$(function() {
    var rowguid = Util.getUrlParams("rowguid");

    var hideHeader = Util.getUrlParams("hideTitle");
    console.log(typeof(hideHeader));

    if (hideHeader&&hideHeader=="1") {
        $("#header").remove();
        $("#footer").remove();
    } else {
        $("#header").removeClass("hidden");
        $("#footer").removeClass("hidden");
    }
    var M = Mustache,
        $leftRequest = $("#left-request"),
        $rightInfo = $("#right-info"),
        leftCodeTmp = Util.getTplInstance("interface-tmpl"),
        resultTmp = Util.getTplInstance("result-tmpl"),
        // leftCodeTmp = $("#interface-tmpl").html(),
        // resultTmp = $("#result-tmpl").html(),
        requestParams, rule,
        param = {
            // api权限
            apiRight: 0,
            requestType: '',
            requestUrl: '',
            headers: '',
            query: '',
            body: '',
            // way: '',
            app: '',
            guid: ''
        };


    // 获取api相求
    Util.ajax({
        url: Config.ajaxUrls.getInterface,
        data: {
            rowguid: rowguid
        },

        success: function(data) {
            var $leftRequest = $("#left-request");
            data = data.custom;
            // data = JSON.parse(data.custom);
            // 添加索引
            $.each(data, function(i, item) {
                // console.log(item);
                if (item.keyList && item.keyList.length) {
                    $.each(item.keyList, function(n, e) {
                        // e.index = n;
                        e.renderName = i + e.keyName + n;
                    })
                } else {
                    item.renderName = item.keyName;
                }
            });

            requestParams = data;

            if (requestParams.apiRight == -1) {
                data.rightWay = "无授权";
                data.chooseAble = false;
            } else if (requestParams.apiRight == 0) {
                data.rightWay = "用户授权";
                data.chooseAble = false;
            } else {
                data.rightWay = "应用授权";
                data.chooseAble = true;
            }
            leftCodeTmp.setView(data).renderTo($leftRequest[0]);

            // $leftRequest.html(M.render(leftCodeTmp, data));

            // 滚动条
            $(".code-box").niceScroll({
                cursorcolor: "#d3dfe6"
            });

            var $rightWay = $("#right-way"),
                $appChoose = $("#app-choose"),
                $slideArea = $(".slide-area");

            // chosen
            // $rightWay
            // .chosen({
            // disable_search: true
            // })
            // .on("change", function(evt, params) {
            // param.way = params.selected;
            // $("#app-choose-box").toggleClass("hidden");
            // });

            // 选择app
            if ($appChoose.length > 0) {
                $appChoose
                    .chosen({
                        disable_search: true
                    })
                    .on("change", function(evt, params) {
                        param.app = params.selected;
                    });
            }

            // 收缩与展开
            $slideArea.on("click", ".slide-icon", function() {
                var that = $(this),
                    parent = that.closest(".slide-area");
                parent.toggleClass("up");

                $(".code-box")
                    .getNiceScroll()
                    .resize();
            });
        }
    });


    // 发送请求并获取返回信息
    $leftRequest.on("click", ".send-request", function() {
        // 检验必填数据是否必填了
        var data = Util.toFormData('request');

        param.apiRight = requestParams.apiRight;
        param.requestType = requestParams.requestType;
        param.requestUrl = requestParams.requestUrl;

        param.guid = rowguid;

        // console.log(data);

        checkContent(data);
        
      
        if (rule) {
            Util.ajax({
                url: Config.ajaxUrls.getResult,
                data: param,
                timeout: 600000,
                beforeSend: function(XMLHttpRequest) {
                    Util.showLoading();
                },
                success: function(data) {
                    Util.hideLoading();
                    // data = JSON.parse(data.custom);
                    data = data.custom;
                    if (data && data.msg) {
                    	 layer.alert(data.msg, { title: '', closeBtn: false }, function(index) {
                             layer.close(index);
                         });
                    }else {
                    	resultTmp.setView(data).renderTo($rightInfo[0]);
                        // $rightInfo.html(M.render(resultTmp, data));
                    }
                }
            });
        }
    });


    // 检验函数
    function checkContent(data) {
        rule = true;
        if (requestParams.headers) {
            var headers = requestParams.headers;
            param.headers = headers;

            doCheck(headers.keyList, '请求头', data, 'headers');
        }

        if (requestParams.query && rule) {
            var query = requestParams.query;
            param.query = query;

            doCheck(query.keyList, '参数', data, 'query');
        }

        if (requestParams.body && rule) {
            var body = requestParams.body;
            param.body = body;
            
            console.log("2wy"+body.keyList);
            if (body.keyList) {
                doCheck(body.keyList, '内容区', data, 'body');
            } else {
                if ($.trim(data.bodyInfo) <= 0) {
                    rule = false;
                    layer.alert('内容区不能为空！', { title: '', closeBtn: false }, function(index) {
                        layer.close(index);
                    });

                } else {
                    param.body.value = data.bodyInfo;
                }
            }
        }

        // 如果是应用授权，需要选择应用
        if (requestParams.apiRight == 1 && rule) {
            if (!param.app) {
                rule = false;
                layer.alert('请选择对应的应用！', { title: '', closeBtn: false }, function(index) {
                    layer.close(index);
                });

            }
        }

        // return rule;
    }

    // 检验执行体
    function doCheck(data, name, realData, key) {
        // console.log(realData);
        // param.
        $.each(data, function(i, item) {
            if (item.must == 1) {
                if ($.trim(realData[item.renderName]).length <= 0) {
                    rule = false;
                    layer.alert(name + '\<strong\>' + item.keyName + '\<\/strong\>' + '不能为空！', { title: '', closeBtn: false }, function(index) {
                        layer.close(index);

                    });

                    return false;

                } else {

                }
            }

            param[key].keyList[i].value = realData[item.renderName];
        });
    }

})