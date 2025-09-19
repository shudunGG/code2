mini.overwrite(mini.DataExport, {
    mapClass: 'com.epoint.basic.faces.export.DataExport',
    extraId: '',
    exportAction: '',   // 指定后台导出方法
    paramName: 'commonDto',

    setData: function(columns) {
        if (!this.columnsValue) {

            this.columnsData = columns;
            this.isInit = false;
        }
    },

    getExtraId: function() {
        return this.extraId;
    },

    setExtraId: function(extraId) {
        this.extraId = extraId;
    },

    _getColumns: function(columns) {
        var data = [];
        for (var i = 0, len = columns.length; i < len; i++) {
            var column = columns[i];
            if (!column.field) {
                if (column.columns) {
                    var childColumns = this._getColumns(column.columns);
                    data = data.concat(childColumns);
                }
            } else {
                data.push({
                    text: column.header,
                    field: column.field,
                    code: column.code,
                    format: column.format,
                    dataOptions: column['data-options']
                });
            }
        }
        return data;
    },

    _OnExport: function(event) {
        var data = this._getExportData();

        data.exportUrl = this.exportUrl;

        if (this.dataGrid && this.dataGrid.action) {
            data.gridAction = this.dataGrid.action;
            data.gridColumns = this._getColumns(this.dataGrid.columns);
        }

        var e = {
            htmlEvent: event,
            sender: this,
            data: data
        };
        this.fire("beforeexport", e);

        this._exportFormField.value = (typeof e.data == 'string') ? e.data : mini.encode(e.data);

        // 增加对csrf安全拦截的处理
        var csrfcookie = $.cookie(window.CSRF_COOKIE_NAME || '_CSRFCOOKIE');
        if (csrfcookie) {
            if (!this._csrfField) {
                var hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = window.CSRF_HD_NAME || 'CSRFCOOKIE';

                this._exportForm.appendChild(hidden);

                this._csrfField = hidden;
            }
            
            this._csrfField.value = csrfcookie;
        }

        this._exportForm.submit();

        this.hidePanel();
    },

    _getSelectedGridIds: function() {

        var ids = [];
        var rows = [];
        var idField = this.dataGrid.idField;

        if(this.dataGrid) {
            rows = this.dataGrid.getAllSelecteds();
        }

        for (var i = 0, l = rows.length; i < l; i++) {
            var r = rows[i];
            ids.push(r[idField]);
        }

        return ids.join(',');
    },

    getExtraAttrs: function(el) {
        var attrs = {};
        mini._ParseString(el, attrs, ["exportAction"]);

        return attrs;
    }
});
