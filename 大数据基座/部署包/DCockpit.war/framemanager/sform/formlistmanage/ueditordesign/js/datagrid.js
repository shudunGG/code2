(function (win, $) {
    var $controlName = $('#control-name'),
        $table = $('#datagrid-table'),
        $t_body = $('tbody', $table),
        TR_TPL = $.trim($('#tr-tpl').html());

    /**
     * 获取下一行的正确序号值
     * 
     * @returns 下一行的序号
     */
    function getNextIndex() {
        return $t_body.find('tr').length + 1;
    }

    /**
     * 更新序号值，用于删除后调用
     * 
     */
    function updateIndex() {
        $t_body.find('tr').each(function (i, item) {
            $(item).find('.index').text(i + 1);
        });
    }
    /**
     * 构造创建新行时的数据
     * 
     * @returns {Object} 数据对象
     */
    function getEmptyData() {
        return {
            index: getNextIndex(),
            headername: '',
            cellwidth: 100,
            typeList: window.editorTypeList,
            requiredValidate: false,
            formatList:window.editorFormatList,
            isTotal: false,
            formula: '',
            value: '',
            dvalue:''
        };
    }

    /**
     * 根据数据渲染一行并插入
     * 
     * @param {Object} trData 表格一行的数据
     * @returns {jQuery Obejct} 表格行的tr对象
     */
    function createRow(trData) {
        var $tr = $(Mustache.render(TR_TPL, trData));

        initTrEvent($tr);
        return $tr.appendTo($t_body);
    }

    /**
     * 新增一行
     * 
     * @returns {jQuery Obejct} 表格行的tr对象
     */
    function addRow() {
        return createRow(getEmptyData());
    }

    /**
     * 删除一行
     * 
     * @param {jQuery Obejct} 表格行的tr对象
     */
    function deleteRow($tr) {
        offTrEvent($tr);
        $tr.remove();
        // 删除行后需要调整序号索引
        updateIndex();
    }
    /**
     * 按行进行验证并获取数据
     * 
     * @param {jQuery Object/HTMLElement} $tr 行jQ对象 或dom对象
     * @param {Number} index 当前行的索引
     * @returns {Object/FALSE} 行数据对象或false
     */
    function getRowDataByDom($tr, index) {
        if (!($tr instanceof $)) {
            $tr = $($tr);
        }
        // 获取对应dom节点
        var domData = {
            $headerName: $tr.find('.header-name'),
            $columnWidth: $tr.find('.column-width'),
            $type: $tr.find('.type'),
            $requiredValidate: $tr.find('.requiredValidate'),
            $formatValidate: $tr.find('.format'),
            $isTotal: $tr.find('.is-total'),
            $formula: $tr.find('.formula'),
            $value: $tr.find('.column-value'),
            $dvalue: $tr.find('.column-dvalue')
        };
        // 进行验证 通过则返回数据 否则返回false
        if (window.trValidate(domData)) {
            return {
                headername: domData.$headerName.val(),
                fieldname: 'SubCtrl' + (index + 1),
                cellwidth: domData.$columnWidth.val(),
                type: domData.$type.val(),
                requiredValidate: domData.$requiredValidate.prop('checked'),
                formatValidate: domData.$formatValidate.val(),
                total: domData.$isTotal.prop('checked')==true?'on':'',
                formula: domData.$formula.val(),
                value: domData.$value.val(),
                dvalue: domData.$dvalue.val()
            };
        } else {
            return false;
        }
    }
    /**
     * 从页面上获取控件数据
     * 
     * @returns 
     */
    function getData() {
        var data = {
                controlName: $.trim($controlName.val()),
                subfields: []
            },
            $trs = $t_body.find('tr'),
            validate = true;
        // 控件名称的总体校验 名称和列数目
        if (!controlValidate($controlName, $trs.length)) {
            return false;
        }
        // 遍历验证并获取行数据
        $.each($trs, function (i, item) {
            var d = getRowDataByDom(item, i);
            // 一行验证失败则停止
            if (!d) {
                validate = false;
                return false;
            } else {
                data.subfields.push(d);
            }
        });
        // 验证通过则返回数据 否则false 
        if (validate) {
            data.subfields = JSON.stringify(data.subfields);
            return data;
        } else {
            return false;
        }
    }

    function dealData(data) {
        if (typeof data.subfields == 'string') {
            data.subfields = JSON.parse(data.subfields);
        }

        // 补充类型选择数据
        $.each(data.subfields, function (i, item) {
            // 需要复制处理 放置选中的关联影响
            item.typeList = JSON.parse(JSON.stringify(window.editorTypeList));
            // 遍历找出当前列的选中类型
            $.each(item.typeList, function (i, selectItem) {
                if (selectItem.value == item.type) {
                    selectItem.selected = true;
                    return false;
                }
            });
        });
        return data;
    }
    /**
     * 设置数据 根据数据生成相应的table结构
     * 
     * @param {any} data 
     */
    function setData(data) {
        $controlName.val(data.controlName);
        $.each(data.subfields, function (i, item) {
            createRow($.extend({
                index: i + 1
            }, item));
        });
    }

    /**
     * 初始化通用事件 点击新增行和删除一行
     * 
     */
    function initCommonEvent() {
        // 点击删除行
        $t_body.on('click', '.remove-row', function () {
            deleteRow($(this).closest('tr'));
        });
        // 点击新增行
        $('#add-row').on('click', addRow);
        // 控件名称
        $controlName.on('focus', function () {
            $(this).removeClass('in-error');
        });
    }

    /**
     * 初始化表格行中的事件 
     * 在 focus 时 移除 in-error 样式
     * @param {jQuery Object} $tr 行 jQ 对象
     */
    function initTrEvent($tr) {
        $tr.find('input select').on('focus', function () {
            $(this).removeClass('in-error');
        });
    }
    /**
     * 移除表格行中的事件 
     * 在 focus 时 移除 in-error 样式
     * @param {jQuery Object} $tr 行 jQ 对象
     */
    function offTrEvent($tr) {
        $tr.find('input select').off('focus');
    }

    window.datagridDesign = {
        init: function () {
            initCommonEvent();
            if (window.DEFAULT_NEW_ROWS) {
                var i = 0;
                while (i < DEFAULT_NEW_ROWS) {
                    addRow();
                    ++i;
                }
            }
        },
        getData: getData,
        setData: function (data) {
            $t_body.empty();
            setData(dealData(data));
        }
    };
}(this, jQuery));