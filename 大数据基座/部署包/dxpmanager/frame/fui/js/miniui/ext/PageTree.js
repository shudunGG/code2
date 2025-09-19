/**
 * 对DataGrid进行方法扩展
 */
mini.overwrite(mini.PagerTree, {
    holdSelectedStatus: false,

    selectMaps: {},

    setHoldSelectedStatus: function(holdSelectedStatus) {
        this.holdSelectedStatus = holdSelectedStatus;

        if (this.holdSelectedStatus && !this.isInitHold && this.multiSelect) {
            var me = this;
            this.on('selectionchanged', function(e) {
                if (me.holdSelectedStatus) {
                    var records = e.records,
                        i = 0,
                        len = records.length;

                    if (e.select) {
                        for (; i < len; i++) {
                            me.selectMaps[records[i][me.idField]] = records[i];
                        }

                    } else {
                        for (; i < len; i++) {
                            me.selectMaps[records[i][me.idField]] = undefined;
                            delete me.selectMaps[records[i][me.idField]];
                        }
                    }
                }
            });

            this.on('load', function(e) {
                for (var id in me.selectMaps) {
                    me.select(me.selectMaps[id]);
                }
            });

            this.isInitHold = true;
        }
    },

    // 清空选择状态
    clearSelectedStatus: function() {
        if(this.holdSelectedStatus) {
            this.selectMaps = {};
        }
        this.clearSelect();
    },

    getAllSelecteds: function() {
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

    getExtraAttrs: function(el) {
        var attrs = {};
        mini._ParseBool(el, attrs, ["holdSelectedStatus"]);

        return attrs;
    }
});