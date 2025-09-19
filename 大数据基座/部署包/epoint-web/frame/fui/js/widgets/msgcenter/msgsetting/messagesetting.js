/*
 * @Author: jjj 
 * @Date: 2018-09-10 17:02:01 
 * @Last Modified by: liub
 * @Last Modified time: 2019-11-06 09:30:40
 * @Description: '展现时调用获取数据方法' 
 */

(function (win, $) {
    var MSGSETTING_TPL = '<div class="detail-container" id="datail-container">'+
        '<div class="detail-body remind-setting-detail" id="remind-setting-detail"></div>'+
        '<div class="detail-footer">'+
            '<span class="mini-button msg-set-save" id="msgset-save">保存</span>'+
            '<span class="mini-button" plain="true" id="msgset-cancle">取消</span>'+
        '</div>'+
    '</div>';
    var REMIND_TPL = '<div class="remind-item row clearfix" data-rowid="{{id}}"><span class="sumary-left remind-item-name">{{name}}</span><span class="sumary-right remind-item-switch" data-id="{{id}}"  title="{{name}}"><span class="mini-checkbox switch master-switch" checked="{{state}}" onclick="onSwitchClick"></span></span></div>';

    var DETAIL_HEADER_TPL = '<div class="row row-header clearfix"><span class="title detail-span-name">消息类型</span><span class="switch detail-span-switch">允许通知</span>{{#types}}<span class="detail-span-sub" data-id="{{id}}">{{text}}</span>{{/types}}</div>';

    var DETAIL_REMIND_TPL = '<div class="row row-data clearfix" data-rowid="{{id}}" title="{{name}}"><span class="remind-item-name detail-span-name">{{name}}</span><span class="remind-item-switch detail-span-switch" data-id="{{id}}"  title="{{name}}"><span class="mini-checkbox switch master-switch" checked="{{state}}" onclick="onSwitchClick"></span></span>{{#detail}}{{^disabled}}<span class="detail-span-sub" data-id="{{id}}" title="{{subTitle}}"><span class="mini-checkbox sub-switch" checked="{{state}}" enabled="{{enabled}}" onclick="onSubSwitchClick"></span></span>{{/disabled}}{{#disabled}}<span class="detail-span-sub" data-id="{{id}}" ><span class="text-not-support">不支持</span></span>{{/disabled}}{{/detail}}</div>';

    var M = Mustache;
    var setConfig = {
        id: 'win-msg'
    };
    var timer = null,
        dataRequest = null;

    function initDom() {
        if(!document.getElementById(setConfig.id)) {
            var _msgCenterDiv = document.createElement('div');
                _msgCenterDiv.id = setConfig.id;
                _msgCenterDiv.className = 'mini-window win-msg';
                _msgCenterDiv.title = '高级设置';
                _msgCenterDiv.setAttribute("showMaxButton","false");
                _msgCenterDiv.setAttribute("showCollapseButton","false");
                _msgCenterDiv.setAttribute("showShadow","true");
                _msgCenterDiv.setAttribute("showModal","true");
                _msgCenterDiv.setAttribute("allowResize","false");
                _msgCenterDiv.setAttribute("allowDrag","true");

                document.body.appendChild(_msgCenterDiv);

                document.getElementById(setConfig.id).innerHTML = Util.clearHtml(M.render(MSGSETTING_TPL));   
                mini.parse();
        }
        initEvent();
    }

    function initEvent() {
        $('body').on('click', '#msgset-save', function() {
            // 保存
            MessageSetting.save();
        }).on('click', '#msgset-cancle', function() {
            // 取消
            MessageSetting.hideAdvance()
        })
    }

    initDom();

    function onSwitchClick(e) {
        var ctr = e.sender,
            el = ctr.el,
            value = ctr.value,
            falseValue = ctr.falseValue + '',
            isShut = value === falseValue;
        var rowID = $(el).parent().data('id');
        var oCtrs = getOtherControls(rowID, ctr, false);
        // 是否需要保存
        
        $.each(oCtrs.subSwitchs, function (i, item) {
            // item.setValue(value);
            // 根据总开关状态 调整子控件可用性
            if (isShut) {
                item.setEnabled(false);
            } else {
                item.setEnabled(true);
            }
        });
    }

    function onSubSwitchClick(e) {
        
    }
    win.onSwitchClick = onSwitchClick;
    win.onSubSwitchClick = onSubSwitchClick;

    /**
     * 行 el中查找另一个总开关
     *
     * @param {HTMLElement / jQueryObject} el 行对象
     * @param {miniui Control} filterCtr 要过滤掉的miniui控件对象
     * @returns 另一个总开关对象
     */
    function getAnotherMasterSwitch(el, filterCtr) {
        var arr = [];
        var res = null;
        $(el).find('.mini-checkbox.master-switch').each(function (i, item) {
            res = mini.getAndCreate(item);
            if (res && res !== filterCtr) {
                arr.push(res);
            }
        });
        return arr;
    }

    function getSubControl(el, filterCtr) {
        var arr = [];
        var ctr = null;
        $(el).find('.mini-checkbox.sub-switch').each(function (i, item) {
            ctr = mini.getAndCreate(item);
            if (ctr && ctr !== filterCtr) {
                arr.push(ctr);
            }
        });
        return arr;
    }

    function getOtherControls(rowID, masterCtr, subCtr) {
        var el = $('.row[data-rowid="' + rowID + '"]');
        return {
            masterSwitchs: getAnotherMasterSwitch(el, masterCtr),
            subSwitchs: getSubControl(el, subCtr)
        };
    }

    // var $sumary = $('#remind-setting-sumary');
    var $detailContainer = $('#datail-container');
    var $detail = $('#remind-setting-detail');

    // 弹窗对象
    var detailWin = mini.get(setConfig.id);
    detailWin.doLayout();
    // 重写弹窗关闭方法 重置控件数据
    var __hide__ = detailWin.hide;
    detailWin.hide = function (noRestore) {
        if(timer) clearTimeout(timer);
        dataRequest.abort();

        !noRestore && restoreControlData();
        __hide__.apply(this, arguments);
    };


    var NAME_W = 140,
        SWITCH_W = 120,
        // 每个子渠道的宽度
        SUB_W = 100,
        // TABLE_HEADER_H = 41,
        // TABLE_BODY_ITEM_H = 30,
        // 容器边距
        CONTAINER_PADDING = 15,
        // 底部边距
        // CONTAINER_PADDING_BOTTOM = 20,
        // win窗口 边距
        DIALOG_PADDING = 5;
    // 渲染结构
    function render(data) {
        // var html = '';
        var advanceHtml = Mustache.render(DETAIL_HEADER_TPL, data);
        var subCount = data.types.length;
        var detail_w = SUB_W * subCount + NAME_W + SWITCH_W;
            // detail_h = TABLE_HEADER_H + TABLE_BODY_ITEM_H * data.items.length + CONTAINER_PADDING + CONTAINER_PADDING_BOTTOM + DIALOG_PADDING * 2 ;
        
        $.each(data.items, function (i, item) {
            // html += Mustache.render(REMIND_TPL, item);

            // 处理详情数据
            var subData = dealSubData(item, data.types);
            advanceHtml += Mustache.render(DETAIL_REMIND_TPL, subData);
        });

        // $(html).appendTo($sumary);

        $(advanceHtml).appendTo($detail.empty());
        // 解析控件
        mini.parse();
        // 计算长度宽度
        $detailContainer.css('width', detail_w);
        var win_w = $(window).width(),
            win_h = $(window).height(),
            dialog_w = detail_w + CONTAINER_PADDING * 2 + DIALOG_PADDING * 2;
            
        // 未超出则直接设置 否则取最大宽度
        // detailWin.setWidth(dialog_w > win_w ? win_w - 10 : dialog_w);
        // if (detail_h > win_h) {
        //     detailWin.setHeight(win_h);
        // }

        detailWin.setWidth(dialog_w);
        detailWin.setMaxWidth(win_w - 20);
        detailWin.setMaxHeight(win_h - 20);
        
        detailWin.showAtPos("center");
    }
    /**
     * 处理详情数据
     *
     * @param {Object} data 每一条详情数据
     * @param {Array<Object(id)>} sorts types 配置
     * @returns 处理好后的详情数据
     */
    function dealSubData(data, sorts) {
        var enabled = data.state;
        var res = {
            id: data.id,
            name: data.name,
            state: data.state,
            enabled: enabled,
            detail: []
        };

        // 根据types排序
        $.each(sorts, function (i, item) {
            var isFinded = false;
            $.each(data.detail, function (i, it) {
                if (item.id === it.id) {
                    isFinded = true;
                    it.subTitle = data.name + ' - ' + item.text;
                    res.detail.push(it);
                    return false;
                }
            });
            // 未找到 则补充占位数据
            if (!isFinded) {
                res.detail.push({
                    id: item.id,
                    disabled: true
                });
            }
        });

        return res;
    }

    window.MessageSetting = {
        /**
         * total [展示的个数]
         */
        showAdvance: function () {
            dataRequest = getData();
            getControlsData(true, !ctrCached);
            
            // 加定时器解决加载时位置不居中的问题
            if(timer) clearTimeout(timer);

            timer = setTimeout(function() {
                detailWin.show();
            },200);
        },
        hideAdvance: function (noRestore) {
            // 是否不重置数据
            // 直接关闭或者去取消需要还原数据
            // 而保存之后关闭时无需还原
            detailWin.hide(noRestore);
        },
        save: function () {
            var data = getControlsData(false, false);

            for(var i = 0,len = data.length; i< len; i++) {
                var item = data[i];
                if(item.state) {
                    var isEmpty = 0;
                    for( var m = 0,mlen = item.detail.length; m < mlen; m++) {
                        var el = item.detail[m];
                        if(!el.disabled && el.state) {
                            isEmpty = 1;
                        }
                    }
                    if(!isEmpty) {
                        epoint.alert('允许通知后，请开启具体的消息通知渠道', '系统提醒', function (action) {
                            if (action == 'ok') {
                                // MessageSetting.showAdvance();
                            }
                        });
                        return false;
                    }
                }
            }

            saveData({
                query: 'saveDetailData',
                data: JSON.stringify(data)
            }).done(function (res) {
                if (res && res.success) {
                    epoint.showTips('保存成功', {
                        state: 'success'
                    });
                }
                MessageSetting.hideAdvance(true);
            });
        }
    };
    /* global MessageSetting, getMessageSettingUrl, saveMessageSettingUrl */
    function getData() {
        return Util.ajax({
            url: MsgCenterSetting.getMessageSettingUrl,
            data: {
                query: 'getMessageData'
            }
        }).done(function (data) {
            render(data);
        });
    }

    function saveData(data) {
        epoint.showLoading();
        return Util.ajax({
            url: MsgCenterSetting.saveMessageSettingUrl,
            data: data
        }).always(function () {
            epoint.hideLoading();
        });
    }
    // detail控件数据值
    var cache = [];
    var ctrCached = false;
    // 缓存控件对象
    // 根据详情表格的行列位置缓存控件对象
    var detailControlMap = [];

    /**
     * 获取详情控件数据
     *
     * @param {Boolean} updateCache 是否更新缓存
     * @param {Boolean} initCtrMap 是否初始化控件map
     * @returns 控件数据
     */
    function getControlsData(updateCache, initCtrMap) {
        var data = [];
        $detail.find('.row.row-data').each(function (i, item) {
            var row = {
                id: item.getAttribute('data-rowid'),
                name: item.title,
                detail: []
            };
            var masterSwitch = mini.getAndCreate($(item).find('.mini-checkbox.master-switch')[0]);
            var masterValue = masterSwitch && masterSwitch.getValue();
            row.state = masterValue === 'true' ? true : false;
            if (initCtrMap) {
                if (!detailControlMap[i]) {
                    detailControlMap[i] = [];
                }
                detailControlMap[i][0] = getAnotherMasterSwitch($('.row[data-rowid="' + row.id + '"]'), masterSwitch)[0];
                detailControlMap[i][1] = masterSwitch;

                cache.push(row);
            }

            data.push(row);

            $(item).find('.detail-span-sub').each(function (j, it) {
                var cell = {
                    id: it.getAttribute('data-id')
                };
                var controlEl = $(it).find('.mini-checkbox.sub-switch')[0];

                var ctr = mini.getAndCreate(controlEl);
                if (controlEl) {
                    var value = ctr && ctr.getValue();
                    cell.state = value === 'true' ? true : false;
                } else {
                    cell.disabled = true;
                }
                if (initCtrMap) {
                    detailControlMap[i][j + 2] = ctr;
                }

                row.detail.push(cell);
            });
        });
        if (updateCache) {
            cache = data;
        }
        if (initCtrMap) {
            ctrCached = true;
        }
        return data;
    }
    /**
     * 还原控件值
     */
    function restoreControlData() {
        if (!detailControlMap.length || !cache) {
            return;
        }
        $.each(cache, function (i, item) {
            // 两个总开关
            detailControlMap[i][0] && detailControlMap[i][0].setValue(item.state);
            detailControlMap[i][1] && detailControlMap[i][1].setValue(item.state);

            // 子开关
            item.detail && $.each(item.detail, function (j, it) {
                detailControlMap[i][j + 2] && detailControlMap[i][j + 2].setValue(it.state);
            });
        });

    }

}(this, jQuery));