mini.overwrite(mini.TreeSelect, {
    loadWhenChecked: false,

    __OnCheckedChanged: function(evt) {
        var node = evt.node;

        var nodesField = this.getNodesField();
        var cs = node[nodesField];
        var me = this;

        if (this.loadWhenChecked || (this.checkRecursive && !evt.isLeaf && !this._getIsLoaded(node))) {

            var data = {
                node: node,
                eventType: 'checkedchanged'

            };

            var e = {
                url: this.url,
                data: data,
                sender: this
            };

            this.fire("beforecheckload", e);
            jQuery.ajax({
                url: e.url,
                data: e.data,
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    data = mini.getSecondRequestData(data);

                    if (data) {

                        var value = me.getValue();

                        me.setValue(data.value);
                        me.setText(data.text);

                        if (value != me.getValue()) {
                            me._OnValueChanged();
                        }
                        me.focus();
                    }
                }
            });
        } else {
            if (node.checked) {
                this._addNode(node);
            } else {
                this._removeNode(node);
            }
            this._OnValueChanged();
            this.focus();
        }
    },

    __OnNodeClick: function(e) {

        if (this.multiSelect) return;

        var node = this.tree.getSelectedNode();
        var vts = this.tree.getValueAndText(node);
        var v = vts[0];

        // v为空，可能是懒加载树，对应节点未加载，不改变值
        if (v) {
            var value = this.getValue();
            this.setValue(v);
            if (value != this.getValue()) {
                this._OnValueChanged();
            }
        }


        if (this._nohide !== true) {
            this.hidePopup();
            this.focus();
        }
        this._nohide = false;
        this.fire("nodeclick", { node: e.node });
    },

    _addNode: function(node) {
        var v = node[this.valueField],
            t = this.tree.getItemText(node),
            value = this.getValue(),
            text = this.getText();

        if (!node.cantChecked) {
            if (!value) {
                this.setValue(v);
                this.setText(t);
            } else if ((',' + value + ',').indexOf(',' + v + ',') < 0) {
                this.setValue(value + ',' + v);
                this.setText(text + ',' + t);
            }
        }


        if (this.checkRecursive) {
            var childs = this.tree.getChildNodes(node);
            for (var i = 0, len = childs.length; i < len; i++) {
                this._addNode(childs[i]);
            }
        }

    },

    _removeNode: function(node) {
        var v = ',' + node[this.valueField] + ',',
            t = ',' + this.tree.getItemText(node) + ',',
            value = ',' + this.getValue() + ',',
            text = ',' + this.getText() + ',';

        if (value.indexOf(v) >= 0) {
            value = value.replace(v, ',');
            value = value.substring(1, (value.length - 1) || 1);

            text = text.replace(t, ',');
            text = text.substring(1, (text.length - 1) || 1);

            this.setValue(value);
            this.setText(text);

        }

        if (this.checkRecursive) {
            var childs = this.tree.getChildNodes(node);
            for (var i = 0, len = childs.length; i < len; i++) {
                this._removeNode(childs[i]);
            }
        }
    },

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
    __OnDrawNode: function(e) {
        var node = e.node;

        if (node.ckr === false) {
            e.showCheckBox = false;
            e.showRadioButton = false;
        }
        this.fire("drawnode", e);
    },

    getExtraAttrs: function(el) {
        var attrs = {};
        mini._ParseBool(el, attrs, ["loadWhenChecked"
        ]);
        return attrs;
    }
});
