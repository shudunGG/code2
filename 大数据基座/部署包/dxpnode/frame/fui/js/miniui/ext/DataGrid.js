/**
 * 对DataGrid进行方法扩展
 */
mini.overwrite(mini.DataGrid, {
    holdSelectedStatus: false,
    // 为了使点击某行单元格后不将其他行选中状态清除，将该属性默认设置为true
    // 该问题oa中又希望将其默认值设置为false，所以将该值改为全局配置，在jsboot中进行配置
    allowUnselect: (window.EpFrameSysParams && EpFrameSysParams['grid_allow_unselect']) || false,
    selectMaps: {},

    pageSize: (window.EpFrameSysParams && EpFrameSysParams['ui_grid_pagesize']) || 10,

    setHoldSelectedStatus: function (holdSelectedStatus) {
        this.holdSelectedStatus = holdSelectedStatus;

        if (this.holdSelectedStatus && !this.isInitHold) {
            var me = this;

            this.on('load', function (e) {
                if(this.multiSelect) {
                    for (var id in me.selectMaps) {
                        me.select(me.selectMaps[id]);
                    }
                }
            });

            this.isInitHold = true;
        }
    },
    __OnSelectionChanged: function (e) {
        if (e.fireEvent !== false) {
            if (e.select) {
                this.fire("rowselect", e);
            } else {
                this.fire("rowdeselect", e);
            }
        }
        
        // 保持选中状态时，需要处理selectMaps
        // 移到__OnSelectionChanged的原因是：
        // 在勾选一行记录时表格会触发两次SelectionChanged事件，而SelectionChanged是有setTimeout的，第二次会把第一次的冲掉。
        // 而第二次的事件中e._records为空了。
        // 使用e._records是因为在beforeselect事件中阻止选中后，e.records中任有被阻止掉的记录，而e._records里面是不包含被阻止掉的记录的。
        if (this.holdSelectedStatus) {
            var records = e._records,
                i = 0,
                len = records.length;

            if (e.select) {
                for (; i < len; i++) {
                    this.selectMaps[records[i][this.idField]] = records[i];
                }

            } else {
                for (; i < len; i++) {
                    this.selectMaps[records[i][this.idField]] = undefined;
                    delete this.selectMaps[records[i][this.idField]];
                }
            }
        }

        var me = this;
        if (this._selectionTimer) {
            clearTimeout(this._selectionTimer);
            this._selectionTimer = null;
        }
        this._selectionTimer = setTimeout(function () {
            me._selectionTimer = null;

            if (e.fireEvent !== false) {
                me.fire("SelectionChanged", e);
            }

            me.fire("_selectchange", e);
        }, 1);

        this._doRowSelect(e._records, e.select);

    },
    // 清空选择状态
    clearSelectedStatus: function () {
        if (this.holdSelectedStatus) {
            this.selectMaps = {};
        }
        this.clearSelect();
    },

    getAllSelecteds: function () {
        var rows = [];

        if (this.holdSelectedStatus && this.multiSelect) {
            for (var id in this.selectMaps) {
                rows.push(this.selectMaps[id]);
            }
        } else {
            rows = this.getSelecteds();
        }

        return rows;
    },

    // 用于获取表格选中行的id数组
    getSelectedIds: function () {
        var rows = this.getSelecteds();

        var ids = [];
        for (var i = 0, l = rows.length; i < l; i++) {
            var r = rows[i];
            ids.push(r[this.idField]);
        }

        return ids;
    },

    // 用于通用场景下的删除表格记录
    // ajax发送的数据格式：{ids: 'id1,id2'}
    // url为ajax请求地址
    // callback为回调方法，参数为ajax的返回结果data。如果该方法返回false，则会阻止默认的回调处理
    // params为传入的额外参数
    deleteRows: function (options) {
        if (typeof options == "string") {
            options = {
                url: options
            };
        }
        var url = options.url,
            notSelectedTip = options.notSelectedTip || "请选择一条记录！",
            confirmTip = options.confirmTip || "确定删除选中记录？",
            confirmTitle = options.confirmTitle || "系统提示",
            params = options.params || {},
            callback = options.callback;

        var datagrid = this;
        // 获取选中行id集合
        var ids = this.getSelectedIds();

        if (ids.length > 0) {
            mini.confirm(confirmTip, confirmTitle, function (action) {
                if (action == "ok") {
                    datagrid.loading("操作中，请稍后......");
                    if (Util.getRightUrl) {
                        url = Util.getRightUrl(url);
                    }

                    params.ids = ids.join(',');
                    jQuery.ajax({
                        url: url,
                        type: 'post',
                        dataType: 'json',
                        data: params
                    }).done(function (data) {
                        if (callback && callback.call(datagrid, data) === false) {
                            return;
                        }

                        if (data.success) {
                            mini.alert(data.msg || "删除成功");
                        } else {
                            mini.alert(data.msg || "删除失败");
                        }

                        if (datagrid.url) {
                            datagrid.reload();
                        }

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        mini.alert(jqXHR.responseText);
                        datagrid.unmask();
                    });
                }
            });
        } else {
            mini.alert(notSelectedTip);
        }
    },

    getExtraAttrs: function(el) {
        var attrs = {};
        mini._ParseBool(el, attrs, ["holdSelectedStatus"]);

        return attrs;
    }
});


// 表格的pageSize是继承于mini.DataTable的，所以必须也要重写mini.DataTable的pageSize
mini.overwrite(mini.DataTable, {
    pageSize: (window.EpFrameSysParams && EpFrameSysParams['ui_grid_pagesize']) || 10
});

/**
 * 修复在IE下表格内编辑器首次点击时，弹出位置不对的问题
 * 后续原因定位为在IE下使用jQuery设置offset时，jq方法内部获取浏览器原生的元素计算后样式的对象中存在问题
 * author: chends
 * date: 2017-08-11
 */
(function () {
    // 非IE无需处理
    if (!mini.isIE) return;

    // 记录原来的方法
    var originalFn = mini.DataGrid.prototype._setEditorBox;

    // 加入是否为首次的标识，并重写设置编辑器容器位置的方法
    mini.overwrite(mini.DataGrid, {
        _isInitEditorWrap: true,
        _setEditorBox: function (editor, cellBox) {
            // 如果是首次加载，则调用两次
            if (this._isInitEditorWrap) {
                originalFn.call(this, editor, cellBox);
                originalFn.call(this, editor, cellBox);

                this._isInitEditorWrap = false;
                // 完成后为不必要的判断，再重新将此方法置换为原来的方法
                // mini.DataGrid.prototype._setEditorBox = originalFn; // 不能这么写，直接修改原型会导致一个页面上存在多个表格时，其他表格首次出现不正常
                this._setEditorBox = originalFn; // 换种处理方式 将原来原型上的方法直接加到这个实例对象上，之后访问时优先使用自己的，从而避免不不要的判断。
            } else {
                originalFn.call(this, editor, cellBox);
            }
        }
    });

})();