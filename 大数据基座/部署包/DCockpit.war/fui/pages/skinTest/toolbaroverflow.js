// require jquery mini.getBox mini.getChildNodes


function ToolbarOverflow(toolbar) {
    this.$toolbar = $(toolbar);
    
    if (!this.$toolbar.length) {
        throw new Error('The aim toolbar is required!');
    }
    this.$toolbarInner = this.$toolbar.find('.fui-toolbar-inner');
    this._init();
}

function empty() {};
$.extend(ToolbarOverflow.prototype, {
    _init: function () {
        this._create();
        this._initEvent();
        this._doLayout();

        // 避免重复调用
        this.isInit = true;
        this._init = this._create = this._initEvent = empty();
    },
    _create: function () {
        // 生成容器
        this.el = document.createElement('div');
        this.el.className = 'fui-toolvar-overflow';
        this.el.innerHTML = '<div class="fui-toolvar-overflow-inner"></div>';
        this.innerEl = this.el.firstChild;
        $('body').append(this.el);

        // 生成按钮
        this.trigger = document.createElement('span');
        this.trigger.className = 'fui-toolbar-overflow-trigger';
        // this.$toolbar.append(this.trigger);
    },
    _initEvent: function () {
        var me = this;
        $(this.trigger).on('click', function () {
            me.toggle();
        });

    },
    _doLayout: function () {
        var me = this,
            toolbarEl = this.$toolbarInner[0],
            toolbarBox = mini.getBox(toolbarEl),
            // $toolbar = this.$toolbar,
            overflowEl = this.innerEl,
            overflowBox = mini.getBox(overflowEl),
            toolbarNodes = mini.getChildNodes(toolbarEl, true),
            overflowNodes = mini.getChildNodes(overflowEl, true);

        var toOverflow = false;

        var i = 0,
            len = 0;
        // 超过宽度的移入
        var lastBox = null;
        for (i = toolbarNodes.length - 1; i >= 0; i--) {
            var node = toolbarNodes[i];

            if (node.nodeType != 1) {
                toOverflow && $(node).prepedTo(this.innerEl);
            } else {
                var nodeBox = mini.getBox(node);

                if (!lastBox) {
                    lastBox = nodeBox;
                }
                // 已经超出就不用继续了
                if (nodeBox.right <= toolbarBox.right) {
                    break;
                }

                $(node).prepedTo(overflowEl);
                toOverflow = true;
            }
        }

        if (!lastBox) {
            lastBox = {
                right: toolbarBox.left
            };
        }

        // 不需要添加时 将节点放回
        var addNodes = [];
        if (toOverflow === false) {
            var preTextNode = null;
            for (i = 0, len = overflowNodes.length; i < len; i++) {
                var node = overflowNodes[i];
                if (node.nodeType != 1) {
                    preTextNode = node;
                } else {
                    var nodeBox = mini.getBox(node);
                    node.right = nodeBox.right - overflowBox.left + lastBox.right;

                    if (nodeBox.right > toolbarBox.right) {
                        break
                    }
                    preTextNode && addNodes.push(preTextNode);
                    preTextNode = null;
                    addNodes.push(node);

                }
            }

            for (i = 0, len = addNodes.length; i < len; li++) {
                toolbarEl.appendChild(addNodes[i]);
            }
        }

        var childNodes = mini.getChildNodes(overflowEl);

        this.trigger.style.display = childNodes.length > 0 ? 'block' : 'none';

        this.hide();
    },
    toggle: function () {
        if (open) {
            this.hide();
        } else {
            this.show();
        }
    },
    show: function () {
        var box = mini.getBox(this.$toolbar[0]);
        var pbox = mini.getBox(this.el);
        console.log(box, pbox);
        var x = box.right - pbox.width,
            y = box.bottom;

        if (x < 0) x = 0;

        mini.setXY(this.el, x, y);
    },
    hide: function () {
        this.el.style.top = '-10000px';
        this.el.style.left = '-10000px';

    }
});

new ToolbarOverflow($('.fui-toolbar'));