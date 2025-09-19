var CheckAll = function(grid, column) {

    if (typeof column == 'string') {
        column = grid.getColumn(column);
    }

    this.grid = grid;
    this.column = column;
    this.init();

    this.checked = false;
};

CheckAll.prototype = {

    init: function() {
        var me = this,
            grid = me.grid,
            column = me.column,
            header = column.header;

        column.header = function() {
            return '<div class="checkall" title="' + header + '"><span class="mini-icon mini-grid-checkbox"></span>' + header + '</div>';
        }

        $(grid.el).on("click", ".checkall", function(event) {

            var cellEl = $(event.target).closest('.mini-grid-headerCell');
            var ss = cellEl[0].id.split('$');
            if (column._id == ss[ss.length - 1]) {
                me.checked = !me.checked;

                var jq = cellEl.find(".mini-grid-checkbox");
                if (me.checked) {
                    jq.addClass("mini-grid-checkbox-checked");
                    me.checkAll();
                } else {
                    jq.removeClass("mini-grid-checkbox-checked");
                    me.uncheckAll();
                }

            }
        });

        grid.on('cellendedit', function(e) {
            var field = e.column.name; 

            if (field === me.column.name) {
                updateCheckAll(me);
            }
        });

        grid.on('update', function (e) {
            var columns = e.sender.columns;
            for (var i = 0, l = columns.length; i < l; ++i) {
                var col = columns[i];
                if (col.name === me.column.name) {
                    updateCheckAll(me);
                }
            }
        });

        function isEqual(a, b) {
            // if (a === b) return true;
            // if (a + '' === b + '') return true;
            // return false;
            return a === b || (a + '' === b + '');
        }

        function updateCheckAll(target) {
            var data = target.grid.getData(),
                field = target.column.field,
                falseValue = target.column.falseValue,
                headerCell = grid._getHeaderCellEl(target.column, 2) || grid._getHeaderCellEl(target.column, 1),
                $check = $(headerCell).find(".mini-grid-checkbox"),
                i = 0,
                l = data.length;

            // 没有数据就不用去处理全选了
            if(l === 0) {
                return;
            }

            for (; i < l; i++) {
                if (isEqual(data[i][field], falseValue)) {
                    target.checked = false;
                    $check.removeClass("mini-grid-checkbox-checked");
                    return;
                }
            }
            target.checked = true;
            $check.addClass("mini-grid-checkbox-checked");
        }

    },

    _setAllChecked: function(value) {
        var me = this,
            grid = me.grid,
            column = me.column,
            rows = grid.getData(),
            field = column.field;

        for (var i = 0, l = rows.length; i < l; i++) {
            var rowData = {};
            rowData[field] = value;
            grid.updateRow(rows[i], rowData);
        }
    },

    checkAll: function() {
        this._setAllChecked(this.column.trueValue);
    },

    uncheckAll: function() {
        this._setAllChecked(this.column.falseValue);
    }
};
