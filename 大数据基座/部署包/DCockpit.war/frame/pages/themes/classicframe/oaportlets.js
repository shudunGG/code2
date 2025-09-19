/*zhangyan 1.0.0 2014/2/14*/
(function(win, $) {
    "use strict";
    var M = Mustache;

    var sortable_proto = $.ui.sortable.prototype;

    sortable_proto.options.beforeStart = null;
    sortable_proto._originalMouseStart = sortable_proto._mouseStart;

    sortable_proto._mouseStart = function(event, overrideHandle, noActivation) {
        this._trigger("beforeStart", event);
        this._originalMouseStart(event, overrideHandle, noActivation);
    };

    var defaultSettings = {
        gut: 20,
        columnNum: 2,
        minWidth: 960,
        container: '#portlet-container',
        items: '.oa-portlet',
        dragHandle: '.oa-portlet-hd',
        column: '.portlet-column',
        placeholderCls: 'oa-portlet-placeholder'
    };

    var $bd = $('body');

    // for output table row
    var renderRow = function() {
        var row = [],
            rowData = this;

        var isNew = rowData.pop(),
            imgNew = '<img class="new-tag" src="' + Util.getRootPath() + 'image/new.gif" alt="">';

        row.push('<tr class="info-tb-row">');

        $.each(rowData, function(index, item) {
            if(index == 0) {
                row.push('<td class="td-num">' + item + '</td>');
            } else if(index == 1) {
                row.push('<td class="td-info">' + item + (isNew ? imgNew : '') + '</td>');
            } else {
                row.push('<td class="td-gray">' + item + '</td>');
            }
        });

        row.push('</td>');

        return row.join('');
    };

    // OaPortlets widget class
    win.OaPortlets = function(cfg) {
        this.cfg = $.extend({}, defaultSettings, cfg);
        this._init();
    };

    OaPortlets.prototype = {
        constructor: OaPortlets,

        // portlet template
        // _portlet_tmpl: $.trim($('#portlet-template')[0].innerHTML),
        _portlet_tmpl: '<div class="oa-portlet" id="{{id}}"><div class="oa-portlet-hd clearfix"><h5 class="oa-portlet-title l">{{title}}</h5>{{#hasQuick}}<div class="portlet-hd-lnks l">{{#quicklnks}}{{{.}}}{{/quicklnks}}</div>{{/hasQuick}}{{#hasBtns}}<div class="phd-btn-group">{{#btns}}{{{.}}}{{/btns}}</div>{{/hasBtns}}</div><div class="oa-portlet-bd">{{#isIframe}}<iframe src="{{iframe}}" name="{{name}}" scrolling="no" frameborder="0" width="100%" height="100%"></iframe>{{/isIframe}}{{#isList}}<table class="portlet-info-tb">{{#list.rows}}{{{list.tablerow}}}{{/list.rows}}</table>{{/isList}}</div></div>',

        // column template
        _column_tmpl: '<div class="{{columnCls}} l"></div>',

        // xhr object 
        // for updating portlets position by ajax
        _updateXhr: null, 

        _init: function() {
            var c = this.cfg,
                self = this;

            var $con = $(c.container);

            this.$container = $con;
            this.$columnWrapper = $('> div', $con);

            M.parse(this._portlet_tmpl);

            // generate portlets columns and portlets 
            // base on template
            this._initView();

            // make portlets size fit with window's width
            this._adjustSize();

            // make portlets sortable
            this._enableSort();
        },

        _initView: function() {
            var c = this.cfg,
                self = this;

            var $colWrapper = this.$columnWrapper,
                $con = this.$container;

            var portlets = c.portlets,
                i, l,
                column_html;

            // add column to column wrapper base on column number    
            column_html = M.render(this._column_tmpl, {
                columnCls: c.column.substr(1)
            });

            for(i = 0, l = c.columnNum; i < l; i++) {
                $(column_html).appendTo($colWrapper);                
            };

            this.$columns = $(c.column, $con);

            // preprocess portlet view object 
            // for template output
            $.each(portlets, function(index, view) {

                view.hasBtns = view.btns && view.btns.length ? true : false;
                view.hasQuick = view.quicklnks && view.quicklnks.length ? true : false;
                view.isList = view.list ? true : false;
                view.isIframe = view.iframe ? true : false;

                if(view.isList) {
                    $.each(view.list.rows, function(i, row) {
                        row.unshift(i + 1);
                    });
                    view.list.tablerow = renderRow;
                }
            });

            this._initPosition();
        },

        _initPosition: function() {
            var c = this.cfg,
                self = this;

            // for collecting unSorted portlets 
            // append them to first column at last
            var unSorted = [],
                cols = {};

            // cols object key    
            var prefix = 'col_',
                prop;

            var portlets = c.portlets;

            // 1.put them to specified columns
            $.each(portlets, function(i, view) {
                var row = view.pos ? view.pos[0] : -1,
                    col = view.pos ? view.pos[1] : -1;

                if(row == -1) {
                    unSorted.push(view);
                } else {
                    prop = prefix + col;

                    !cols[prop] && (cols[prop] = []);

                    cols[prop].push(view);
                }
            });

            // 2.bubble sort by row then append to column 
            var i, l;
            for(i = 0, l = c.columnNum; i < l; i++) {
                prop = prefix + i;

                this._sortInColumn(cols[prop]);
                this._addToColumn(cols[prop], this.$columns.eq(i));
            };

            // 3.at last put unsorted ones to first column
            this._addToColumn(unSorted, this.$columns.eq(0));
        },

        _sortInColumn: function(arr) {
            if(!arr || !arr.length) return false;

            var l = arr.length, 
                i, j, temp;

            for(i = 0; i <= l-2; i++) {
                for(j = l-1; j >= 1; j--) {
                    
                    if(arr[j].pos[0] < arr[j-1].pos[0]) {
                        temp = arr[j];
                        arr[j] = arr[j-1];
                        arr[j-1] = temp;
                    }
                }
            }
        },

        _addToColumn: function(arr, $col) {
            if(!arr || !arr.length) return false;

            var tmpl = this._portlet_tmpl;
            
            $.each(arr, function(i, view) {
                var $el = $(M.render(tmpl, view));

                $el.appendTo($col);                
            });
        }, 

        _adjustSize: function() {
            var c = this.cfg;

            var $con = this.$container,
                $colwrp = this.$columnWrapper,
                $cols = this.$columns,

                min_w = c.minWidth,
                con_outer_w = $con.outerWidth() - $con.width(),
                fixed = false,
                tmp_w;

            $('div.oa-portlet-bd', $con).css('height', c.height);    

            $con.css({
                overflow: 'hidden'
            });
            $cols.css('margin-right', c.gut);
            $bd.css('min-width', c.minWidth);

            $(win).on('resize', function() {
                var w = $(win).width();

                if (w <= min_w && fixed) return true;

                if (w > min_w) {
                    fixed = false;
                    tmp_w = w - con_outer_w;
                } else {
                    fixed = true;
                    tmp_w = min_w - con_outer_w;
                }

                $bd.css('width', fixed ? min_w : 'auto');

                // $con.css('width', tmp_w);
                $colwrp.css('width', tmp_w + c.gut + 3);
                $cols.css('width', (tmp_w - c.gut * (c.columnNum - 1)) / c.columnNum);

            }).trigger('resize');
        },

        _enableSort: function() {
            var c = this.cfg,
                self = this;

            var $con = this.$container,
                $cols = this.$columns,
                $sortableItems = $(c.items);

            // fix append issue    
            var $appendHelper = $('<div></div>').addClass('portlet-helper')
                .addClass(c.items.substr(1))
                .css({
                    marginBottom: 0,
                    backgroundColor: 'transparent',
                    height: '9999em'
                });

            $cols.sortable({
                items: c.items,
                connectWith: c.column,
                revert: 300,
                delay: 100,
                handle: c.dragHandle,
                opacity: 0.8,
                forcePlaceholderSize: true,
                placeholder: c.placeholderCls,
                beforeStart: function() {
                    $(document).attr("onselectstart", "return false;");
                    $cols.css("padding-bottom", "100px");

                    $appendHelper.appendTo($cols);
                    $cols.sortable('refresh');
                },
                start: function(event, ui) {
                    // empty selected text when dragging
                    !+"\v1" ? document.selection.empty() : window.getSelection().removeAllRanges();

                    var $item = ui.item;

                    ui.placeholder.css({
                        border: '2px dashed #acacac',
                        height: $item.height() - 4,
                        width: $item.width() - 4
                    });
                },
                stop: function(event, ui) {
                    $cols.css('padding-bottom', 0);
                    $cols.find('.portlet-helper').remove();

                    self._postPosition();
                }
            }).disableSelection();
        },

        _postPosition: function() {
            var c = this.cfg,
                self = this;

            var posData = {},
                xhr = this._updateXhr;

            var i, l = c.columnNum,
                $cols = this.$columns;

            for(i = 0; i < l; i++) {
                $(c.items, $cols.eq(i)).each(function(row, el) {
                    posData[el.id] = [row, i];
                });
            }

            // console.dir(posData);
            // console.log($.param(posData));

            xhr && xhr.abort();   
            this._updateXhr = $.ajax({
                type: 'POST',
                dataType: 'json',
                url: c.url,
                data: {
                	query: 'save-portlets-position',
                	data: posData,
                },
                success: Util.noop,
                error: Util._ajaxErr
            });
        }
    };

}(this, jQuery));
