mini.externalSrc = _rootPath + '/frame/fui/js/widgets/';

mini.regHtmlAttr('action');
mini.regHtmlAttr('bind');
mini.regHtmlAttr('extraId');

// 处理控件的二次请求数据格式 
(function(win, $) {
    win.mini_doload = function(e) {

        var data = mini.decode(e.text, false),
            custom,
            len,
            viewData;

        if(data[Util.BODY_ENCRYPT_PARAM_NAME]) {
            data = Util.decrypt(data[Util.BODY_ENCRYPT_PARAM_NAME]);
            data = mini.decode(data);
        }

        custom = data.custom;
        data = data.controls || data;

        if (mini.isArray(data) && data[0] && data[0].id) {
            len = data.length;
            viewData = data[len - 1];

            if (viewData.id == '_common_hidden_viewdata') {
                mini.get('_common_hidden_viewdata').setValue(viewData.value);
            }
            if (data[0].total !== undefined) {
                data = data[0];
            } else {
                data = data[0].data;
            }

        }
        if ((!data || (mini.isArray(data) && data.length === 0)) && custom) {
            data = custom;
        }
        e.result = data;

    };

    mini.copyTo(mini, {
        getSecondRequestData: function(data) {
            if(data[Util.BODY_ENCRYPT_PARAM_NAME]) {
                data = Util.decrypt(data[Util.BODY_ENCRYPT_PARAM_NAME]);
                data = mini.decode(data);
            }
            // 返回数据不符合规范，可能是服务端出错了，直接返回空
            if(!data || !data.status ) {
                return [];
            }
            
            var status = data.status,

                code = parseInt(status.code),
                text = status.text,
                url = status.url,
                state = status.state || "error",
                title = state == "warning" ? "警告提示" : "错误提示",
                viewData;

            if (code >= 300) {
                if (url) {
                    if (url.indexOf('http') != 0) {
                        url = _rootPath + '/' + url
                    }
                    var aimWindow = status.top ? top : window;
                    if (aimWindow.Util && aimWindow.Util.getSafeLocation) {
                        aimWindow.Util.getSafeLocation().setHref(url);
                    } else {
                        aimWindow.location.href = url;
                    }
                    return;
                } 
                if (text) {
                    mini.showMessageBox({
                        title: title,
                        buttons: ["ok"],
                        message: text,
                        iconCls: "mini-messagebox-" + state
                    });

                }
            } else {

                data = data.controls || data;

                if (mini.isArray(data) && data[0] && data[0].id) {
                    var len = data.length;
                    // 有的请求可能只有一个 _common_hidden_viewdata （比如上传控件的附件删除请求），也需要更新
                    // 所以把判断去掉 modify at 2019-06-27
                    // if (len > 1) {
                        viewData = data[len - 1];

                        if (viewData.id == '_common_hidden_viewdata') {
                            mini.get('_common_hidden_viewdata').setValue(viewData.value);
                        }
                    // }
                    data = data[0];
                }
                return data;
            }

        }
    });
}(window, jQuery));

// 新版源码应该已解决该问题，解决办法是只要页面有元素滚动，编辑控件就会自动消失
// // 在页面中content区域有滚动的情况下，里面的表格编辑控件不会随着content区域的滚动而滚动
// // 为解决这问题，改写了表格编辑控件dom位置，改为在content区域内
// $(function() {
//     // cellEditorContainer即编辑控件存放容器
//     // 编辑控件存放容器的position设为relative，以达到编辑控件随容器一起滚动的效果
//     mini.cellEditorContainer = $('.fui-content').css('position', 'relative')[0];
// });

// var initControlServerValue = function() {

//     mini.overwrite(mini.WebUploader, {
//         fileSizeLimit: window.mini_uploader_fileSizeLimit,

//         limitType: window.mini_uploader_limitType
//     });
//     mini.overwrite(mini.DataGrid, {
//         pageSize: window.mini_grid_pageSize
//     });

//     if(window.mini_doinitControlServerValue) {
//         mini_doinitControlServerValue();
//     }
// };

// if(window.mini_attrValue_fromServer) {
//     initControlServerValue();
// }