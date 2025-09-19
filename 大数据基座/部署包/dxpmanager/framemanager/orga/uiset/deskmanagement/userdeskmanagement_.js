/**
 * 元件管理可视化配置页面-user
 * author: chendongshun
 * date：2017-06-14
 */

(function (win, $) {
    // 元件模板
    var WIDGET_TPL = '<li class="widget elem-item" data-id="{{code}}" data-rowspan="{{rowspan}}" data-colspan="{{colspan}}" data-url="{{url}}"><div class="info-box clearfix"><span>{{name}}<span></div><div class="elem-btns clearfix"><i class="l elem-disabled" title="禁用"></i></div></li>';
    var $container = $('#grid-container'),
        $gridList = $('ul', $container);

    // 元件边距
    var GAPS = [10, 10],
        // 列数
        COLS = 8,
        // 最大跨列
        MAX_COLSPAN = 8,
        BASE_SIZE = (function () {
            var c_w = $container.width(),
                // base_x = (c_w - GAPS[0] * (2 * COLS - 1)) / COLS;
                base_x = (c_w - GAPS[0] * (2 * COLS)) / COLS;
            return [base_x, 150];
        })();

    var gridster = $gridList.gridster({
        widget_margins: GAPS,
        widget_base_dimensions: BASE_SIZE,
        min_cols: COLS,
        max_cols: COLS,
        max_size_x: MAX_COLSPAN,

        // 调整大小
        resize: {
            // 启动拖动
            enabled: true,
            // 最大行列限制
            max_size: [8, 2]
        },
        // 拖拽
        draggable: {
            start: function (event, ui) {
                // 开始拖动则需要立即停止闪动
                stopHighlight();
                ui.$player.addClass('elem-in-drag');
            },
            stop: function (event, ui) {
                ui.$player.removeClass('elem-in-drag');

            }
        },
        // 自定义数据序列化
        serialize_params: function ($w, wgd) {
            return {
                code: $w.data('id'),
                // 用户不能修改这些信息 不用提交
                // name: $w.find('.elem-name')[0].value,
                // url: $w.find('.elem-url')[0].value,
                col: wgd.col,
                row: wgd.row,
                rowspan: wgd.size_y,
                colspan: wgd.size_x
            };
        }
    }).data('gridster');

    // 渲染元件
    var DEFAULTDATA = {
        rowspan: 1,
        colspan: 1
    };
    var renderElem = function (data) {
        return Mustache.render(WIDGET_TPL, $.extend({}, DEFAULTDATA, data));
    };

    /**
     * 新增元件
     * @param {Object} data 元件数据
     * data 格式
     * {
     *      code: '元件id',
     *      name: '元件名称',
     *      url: '元件内嵌iframe的url',
     *      // 新增的元件只用有以上信息即可
     *      rowspan: 1,
     *      colspan: 1,
     *      row: 1,
     *      col: 1
     * }
     * @param {Boolean} isInit 是否是初始化
     */
    var addElement = function (data, isInit) {
        var html = renderElem(data),
            $html;
        // 初始化元件
        if (isInit) {
            $html = gridster.add_widget(html, data.colspan || 1, data.rowspan || 1, data.col, data.row);
        } else {
            // 新增元件自动排布 无位置信息，并直接使用基本尺寸  
            $html = gridster.add_widget(html, 1, 1);
        }
        // 绑定keyup事件 用户不能调整
        // inputfn($html);
    };

    // 添加元件 兼容一次多个的操作 如果参数为数组，则表示一次添加多个
    var addElements = function (data) {
        if(typeof data == 'string') {
            try {
                data = JSON.parse(data);
            }catch(err) {
                throw err;
            }
        }

        if (data instanceof Array) {
            $.each(data, function (i, elem) {
                addElement(elem);
            });
        } else if (typeof data == 'object') {
            addElement(data);
        }else {
            throw new Error('数据格式错误！');
        }
    };

    // 移除元件
    var removeElement = function ($el, cb) {
        return gridster.remove_widget($el, false, cb);
    };

    $container
        // 点击编辑
        .on('click', '.edit-input', function () {
            var $this = $(this);
            if ($this.prop('readonly')) {
                $this.prop('readonly', false);
            }
        })
        // 其他地方点击移除让文本框失去焦点
        .on('click', '.elem-item', function (e) {
            if (e.target.tagName.toUpperCase() != 'INPUT') {
                $container.find('input').blur();
            }
        });
    // 添加应用后的事件绑定 用户不能调整
    // var inputfn = function ($el) {
    //     $el.find('input')
    //         // 回车确定
    //         .on('keyup', function (e) {
    //             if (e.which === 13) {
    //                 var value = this.value;
    //                 if ($.trim(value).length) {
    //                     $(this).prop('readonly', 'readonly');
    //                 }

    //                 //     .next().removeClass('icon-save').addClass('icon-edit');
    //             }
    //         })
    //         // 失去焦点验证
    //         .on('blur', function () {
    //             // url 不用验证
    //             if ($(this).hasClass('elem-url')) return;

    //             var value = this.value;
    //             // 不能为空
    //             if (!$.trim(value).length) {
    //                 var that = this;
    //                 mini.alert('元件名称不能为空', '系统提醒', function () {
    //                     that.focus();
    //                 });
    //             } else {
    //                 $(this).prop('readonly', 'readonly');
    //             }
    //         });
    // };
    // 检查元件是否具有位置信息
    var checkPosInfo = function (elem) {
        return (elem.col && elem.row) ? true : false;
    };
    // 初始化
    var init = function (data) {
        if (!data || !data.length) return;

        var noPosElems = [];

        // 嵌套数组转为扁平的
        var arr = [];
        $.each(data, function (i, row) {
            $.each(row, function (j, elem) {
                arr.push(elem);
            });
        });

        // 遍历添加
        $.each(arr, function (i, item) {
            // addElement(item, true);
            // 无位置信息的不能直接添加 需要等最后再添加 以避免影响原有的正确布局
            if (checkPosInfo(item)) {
                addElement(item, true);
            } else {
                noPosElems.push(item);
            }
        });
        // 添加无位置信息的
        $.each(noPosElems, function (i, item) {
            addElement(item);
        });
    };

    // 数据组合嵌套数组 一行一个数组 数组内为每个元素
    var dealData = function (data) {
        var arr = [];
        // 处理数据
        $.each(data, function (i, item) {
            if (!arr[item.row - 1]) {
                arr[item.row - 1] = [item];
            } else {
                arr[item.row - 1].push(item);
            }
        });
        // 过滤空位
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (!arr[i]) {
                arr.splice(i, 1);
            }
        }

        return arr;
    };
    // 数据按行、列排序
    var sortByRowCol = function (data) {
        var i, j, l, temp;
        // 按行排序 
        for (i = 0, l = data.length; i < l; ++i) {
            for (j = 0; j < l - 1 - i; ++j) {
                if (data[j][0].row > data[j + 1][0].row) {
                    temp = data[j + 1];
                    data[j + 1] = data[j];
                    data[j] = temp;
                }
            }
        }
        // 行内 按列排序
        $.each(data, function (index, row) {
            for (i = 0, l = row.length; i < l; ++i) {
                for (j = 0; j < l - 1 - i; ++j) {
                    if (row[j].col > row[j + 1].col) {
                        temp = row[j + 1];
                        row[j + 1] = row[j];
                        row[j] = temp;
                    }
                }
            }
        });
        return data;
    };
    // 空位提醒
    var emptyTips = function (row, col, delay) {
        $el = gridster.add_widget('<li class="widget elem-item"></li>', 1, 1, col, row);

        highlight($el);

        setTimeout(function () {
            stopHighlight();
            gridster.remove_widget($el, false);
        }, delay);
    };

    // 检查数据 不能存在空位
    var checkNoEmpty = function (data) {
        if (!data || !data.length) return false;
        // 检查每行 每列是否为空
        var i, j, rows = data[data.length - 1][0].row,
            cols = COLS;
        for (i = 1; i <= rows; ++i) {
            for (j = 1; j <= cols; ++j) {
                if (gridster.is_empty(j, i)) {
                    mini.showTips({
                        content: '每一行都必选占满！<br/>第' + i + '行，第' + j + '列为空！',
                        state: 'danger',
                        x: 'center',
                        y: 'center',
                        timeout: 3000
                    });
                    emptyTips(i, j, 3000);
                    return false;
                }
            }
        }
        return data;
    };

    // 校验数据 每一行中所有元素高度应该相同
    var $inAnimate = $();
    var checkElemHeight = function (data) {
        if (!data) return false;
        var i, j, len1, len2, row;
        for (i = 0, len1 = data.length; i < len1; ++i) {
            row = data[i];
            for (j = 0, len2 = row.length - 1; j < len2; ++j) {
                // 高度不同
                if (row[j].rowspan != row[j + 1].rowspan) {
                    // 不符合条件的两个元素
                    var $errors = $container.find('[data-id="' + row[j].code + '"]').add($container.find('[data-id="' + row[j + 1].code + '"]'));

                    $inAnimate = highlight($errors);

                    // mini.alert('同一行元件的高度必须相同，第' + (i + 1) + '行中，第' + (j + 1) + '个和第' + (j + 2) + '个元件高度不同！');
                    mini.showTips({
                        content: '同一行元件的高度必须相同!<br/>第' + (i + 1) + '行中，第' + (j + 1) + '个和第' + (j + 2) + '个元件高度不同！',
                        state: 'danger',
                        x: 'center',
                        y: 'center',
                        timeout: 3000
                    });
                    return false;
                }
            }
        }
        return data;
    };
    // 检查数据
    var checkData = function (data) {
        return checkElemHeight(checkNoEmpty(data));
    };
    // 错误元件闪动
    var highlight = function ($el) {
        var dark = function () {
                $el.animate({
                    opacity: 0.3
                }, 300, next);
            },
            light = function () {
                $el.animate({
                    opacity: 1
                }, 300, next);
            },
            next = function () {
                var n = $el.queue('highlight');

                if (!n.length) {
                    $el.clearQueue('highlight');
                } else {
                    $el.dequeue('highlight');
                }
            };

        $el.clearQueue('highlight').stop(true).queue('highlight', [dark, light,
            dark, light,
            dark, light,
            dark, light
        ]);

        next();
        return $el;
    };
    // 停止错误闪动动画
    var stopHighlight = function () {
        if (!$inAnimate.length) return;
        // 不能仅使用clearQueue，因为其会等待当前动画结束（清除的是未出列的内容），存在不确定性
        $inAnimate.clearQueue('highlight').stop(true).css('opacity', 1);
    };

    // 对外开放的属性和方法
    win.ElementManage = {
        // 初始化后的gridster对象
        _gridster: gridster,
        init: init,
        addElement: addElements,
        removeElement: removeElement,
        getData: function () {
            // return gridster.serialize();

            return checkData(sortByRowCol(dealData(gridster.serialize())));
        }
    };
})(this, jQuery);


// 事件绑定
(function (win, $) {
    $('#grid-container')
        // 移除元件
        // .on('click', '.elem-remove', function () {
        //     var el = this;

        //     mini.confirm('确定移除此元件？', '移除元件', function (action) {
        //         if (action != 'ok') return;

        //         var $elem = $(el).closest('.elem-item'),
        //             id = $elem.data('id');

        //         Util.ajax({
        //             url: win.removeUrl,
        //             data: {
        //                 id: id,
        //                 query: 'remove-elem'
        //             }
        //         }).done(function (data) {
        //             if(!data) return;

        //             if (data.status == 1) {
        //                 // 移除元件 第一个参数为要移除元件的jq对象 ， 第二个参数为回调函数，可省略
        //                 window.ElementManage.removeElement($elem);
        //             } else {
        //                 mini.alert(data.description || '移除请求失败！');
        //             }
        //         });
        //     });
        // })
        .on('click', '.elem-disabled', function () {
            var el = this;

            mini.confirm('确定禁用此元件？', '禁用元件', function (action) {
                if (action != 'ok') return;
                // 元件jq对象
                var $elem = $(el).closest('.elem-item'),
                    // 元件guid
                    id = $elem.data('id');

                Util.ajax({
                    url: win.disabledUrl,
                    data: {
                        id: id,
                        query: 'desabled-elem'
                    }
                }).done(function (data) {
                    if(!data) return;

                     if (data.status == 1) {
                        // 禁用成功后 从页面移除元件
                        window.ElementManage.removeElement($elem);
                    } else {
                        mini.alert(data.description || '禁用请求失败');
                    }
                });

            });
        });
        // 权限管理
        // .on('click', '.elem-settings', function (e) {
        //     win.settingsFn && win.settingsFn.call(this,e); 
        // });
})(this, jQuery);