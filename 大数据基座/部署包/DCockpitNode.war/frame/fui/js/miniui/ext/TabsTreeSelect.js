mini.overwrite(mini.TabsTreeSelect, {
    mapClass: '',
    loadChildWhenChecked: false,
    autoLoad: false,
    resultAsTree: false,
    loadWhenChecked: true,

    __OnCheckedChanged: function (evt) {
        var node = evt.node;

        var nodesField = this.getNodesField();
        var cs = node[nodesField];
        var me = this;

        if (this.loadWhenChecked || (!evt.isLeaf && !this._getIsLoaded(node))) {

            var data = {
                node: node,
                eventType: 'checkedchanged'

            };

            if(this.showSort) {
                data.direction = this._curAutoSortDirection;
            }

            var e = {
                url: this.treeUrl,
                data: data,
                sender: this
            };

            this.fire("beforecheckload", e);

            this._loadValue(e);
            // // ie 性能太差，需要显示loading效果
            // var maskTimer;
            // // 慢也有可能是请求慢，所以不能只处理ie，其他浏览器也需要遮罩
            // // if (mini.isIE) {

            // //     maskTimer = setTimeout(function () {
            // //         me.mask();
            // //         me.isMask = true;
            // //     }, 100);

            // // }

            // maskTimer = setTimeout(function () {
            //     me.mask();
            //     me.isMask = true;
            // }, 100);
            
            // jQuery.ajax({
            //     url: e.url,
            //     data: e.data,
            //     type: 'post',
            //     dataType: 'json',
            //     success: function (data) {
            //         data = mini.getSecondRequestData(data);
            //         if (data) {
            //             var value = me.getValue();
            //             var defaultValue = me.value;
            //             var defaultText = me.text;

            //             var valueArr,
            //                 textArr,
            //                 i = 0,
            //                 len = 0,
            //                 node,
            //                 html = [];

            //             // 优化 by liub @2017-12-14
            //             // 当value值有上千个时，ie浏览器会假死
            //             // 原因是setValue方法中对每一个值都会进行dom的append
            //             // console.time('insertHtml');
            //             // me.setValue(data.value, true);
            //             // me.setText(data.text);
            //             // console.timeEnd('insertHtml');

            //             me._selectList.innerHTML = '';
            //             // me.selectedCount = 0;
            //             me.selectNodes = {};

            //             if (data.value) {
            //                 valueArr = data.value.split(',');
            //                 textArr = data.text.split(',');


            //                 for (len = valueArr.length; i < len; i++) {
            //                     node = {};
            //                     node[me.idField] = valueArr[i];
            //                     node[me.textField] = textArr[i];

            //                     me.selectNodes[valueArr[i]] = node;

            //                     html.push(me._getItemHtml(node));

            //                 }

            //                 // mini.append方法有性能问题
            //                 // mini.append(me._selectList, html.join(''));

            //                 me._selectList.insertAdjacentHTML('afterbegin', html.join(''));

            //                 // me.selectedCount = len;

            //             }


            //             if (maskTimer) {
            //                 clearTimeout(maskTimer);
            //             }
            //             if (me.isMask) {
            //                 me.unmask();
            //                 me.isMask = false;
            //             }
            //             me._updateButtons();
            //             me._setSelectedCount(len);

            //             me.value = defaultValue;
            //             me.text = defaultText;

            //             if (value != me.getValue()) {
            //                 me._OnValueChanged();
            //             }

            //         }
            //     }
            // });
        } else {
            if (node.checked) {
                this._addNode(node);
            } else {
                this._removeNode(node);
            }
        }
    },

    setValue: function(value, notCheckTree) {
        this.value = value;
        var valueArr = value.split(',');

        this.clearAll(notCheckTree);
        if (!value) {
            return;
        }
        for (var i = 0, len = valueArr.length; i < len; i++) {
            var node = this.tree.getNode(valueArr[i]);

            if (node) {
                if (!notCheckTree) {
                    this.tree.checkNode(node);
                }

            } else {
                node = {};
                node[this.textField] = node[this.idField] = valueArr[i];

            }
            this.selectNodes[valueArr[i]] = node;

            mini.append(this._selectList, this._getItemHtml(node));

        }
        // this.selectedCount = len;

        this._updateButtons();
        this._setSelectedCount(len);
    },
    clearAll: function(notCheckTree) {
        // 已选列表中无内容，do nothing
        // if (!this._selectList.innerHTML) return;

        this._selectList.innerHTML = '';
        this.selectNodes = {};

        this.selectedListNode = null;

        if (!notCheckTree) {
            this.tree.uncheckAllNodes();
        }

        // 清空已选计数
        this._setSelectedCount(0);

        // this._updateButtons();
    },

    // __OnLoadNode: function(evt) {
    //     var node = evt.node;

    //     if (node.checked) {
    //         // this._addNode(node);
    //         this.tree._dataSource._doUpdateLoadedCheckedNodes();

    //     }

    // },

    // _setIsLoaded: function(nodes) {
    //     var nodesField = this.getNodesField();
    //     for(var i = 0, l = nodes.length; i < l; i++) {
    //         var cs = nodes[i][nodesField];
    //         if(cs) {
    //             nodes[i].isLoaded = true;

    //             this._setIsLoaded(cs);
    //         }
    //     }
    // },

    _getIsLoaded: function(node) {
        if (this.tree.isLeaf(node)) {
            return true;
        }

        var cs = this.tree.getChildNodes(node),
            isLoaded = true,
            l = cs.length;

        if (l) {
            for (var i = 0; i < l; i++) {
                isLoaded = this._getIsLoaded(cs[i]);

                if (!isLoaded) {
                    return false;
                }
            }
        } else {
            return false;
        }

        return true;
    },

    getExtraAttrs: function(el) {
        var attrs = {};
        mini._ParseBool(el, attrs, ["loadWhenChecked"
        ]);
        return attrs;
    }

});
