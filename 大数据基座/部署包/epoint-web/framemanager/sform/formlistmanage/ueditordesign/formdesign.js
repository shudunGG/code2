/**
 * 表单设计器 相关扩展代码
 * 参考改动 http://formdesign.leipi.org/ 实现，大幅修改
 * 对于普通固定控件，以插件的形式注册，对应一个命令和编辑器的一个事件 命令中调用打开一个dialog 事件中进行处理此控件编辑的popup。
 * 每个控件对应一个页面 此页面由Ueditor的Dialog实现，页面中可直接访问当前Dialog实例。
 *        首次加载时，创建一个控件dom，并根据页面中输入框的值，给此dom新增属性，完成后调用编辑器实例的.execCommand('insertHtml', oNode.outerHTML)方法 将dom的HTML结构插入
 *        编辑打开时，从触发显示Dialog的控件（即要编辑的控件）上读取属性，设置到页面上的输入框，用户修改确定后 在设回控件的dom，由于此处可直接操作dom，直接对控件dom进行setAttribute操作即可。
 * 对于扩展控件的实现，以插件的形式绑定了一个事件，但是未做命令和其他操作。实际命令的绑定要在之后进行添加。具体可参考使用页面的js
 * 
 * author：chends
 * date：2017.07.07
 */

(function(win) {
    // 表单设计器打开的dialog页面所在的目录名称 实际后面地址自动拼接 '/' + 页面文件名称
    UE._formDesignUrl = 'ueditordesign';
    
    /**
     * 处理classname 
     * 使用同一个Dialog 会导致每次显示时 Dialog classname重复一次 防止性能问题 在此进行修复
     * @param {*HTMLElement} dom 要处理的dom元素
     */
    var resetClassName = function(dom) {
        // 替换多个空格为一个空格 并分割为数组
        var classList = dom.className.replace(/ +/g, ' ').split(' '),
            temp = {};
        nClass = '';
        $.each(classList, function(i, item) {
            if (item) temp[item] = true;
        });
        for (var key in temp) {
            if (Object.prototype.hasOwnProperty.call(temp, key)) {
                nClass += key + ' ';
            }
        }
        dom.className = nClass;
    };
    /**
     * 将css字符串转化为宽高对象
     * @param {*String} cssRules 
     * @return {*Object} 
     * _getWidthHeight("width:600px;height:310px;")
     *  Object {width: 600, height: 310}
     */
    var _getWidthHeight = function(cssRules) {
        var cssRuleArr = cssRules.split(';'),
            result = {},
            cssRule;
        $.each(cssRuleArr, function(i, item) {
            if (item && item.length) {
                cssRule = item.split(':');
                cssRule[0] = cssRule[0].toLowerCase();
                if (cssRule[0].indexOf('width') != -1 || cssRule[0].indexOf('height') != -1) {
                    result[cssRule[0]] = parseFloat(cssRule[1], 10) || 0;
                }
            }
        });
        return result;
    };
    /**
     * 重新给Dialog设置宽高度
     * 修复重新显示时 设置宽高无效的问题
     * @param {*HTMLElement} dom dom元素
     */
    var resetCss = function(dom, cssRules) {
        if (!cssRules) return;
        var $c = $(dom),
            $w = $c.find('.edui-dialog-body'),
            $body = $w.find('.edui-dialog-content');

        var toobar_height = $w.find('.edui-dialog-titlebar').outerHeight(),
            bottom_height = $w.find('.edui-dialog-foot').outerHeight();

        // 直接设置内部
        // if ($body[0].style) {
        //     $body[0].style += ';' + cssRules;
        // } else {
        //     $body[0].style = cssRules;
        // }
        $body[0].setAttribute('style', cssRules);
        // 计算并设置外部
        var size = _getWidthHeight(cssRules);
        if (size.height) $w.css('height', size.height + toobar_height + bottom_height);

        if (size.width) $w.css('width', size.width);
    };

    var dialog;

    /**
     * 原来每次编辑或是新增都是一个新的Dialog，而且在关闭时未进行销毁。存在很大问题必须进行修复，此处统一使用一个dialog。
     * tips：【需要call调用 内部this为编辑器实例对象】
     * @param {*String} page diaolog 中显示的页面地址 开始路径为formdesign/
     * @param {*String} type Dialog类型 这个没有对此来说没有用的 在扩展控件中借用其来传递对应的cmd
     * @param {*String} title dialog 名称
     * @param {*String} cssRules Dialog中html页面容器的 cssRules 指定宽高即可
     */
    win.__createDialog = function(page, type, title, cssRules) {
        var dialogDom;
        if (dialog) {
            dialog.iframeUrl = UE._formDesignUrl + '/' + page;
            dialog.cssRules = cssRules;
            dialog.name = type;
            dialog.title = title;
            dialog.render();

            dialogDom = dialog.getDom();

            // 处理类名重复 并设置宽高等样式
            resetClassName(dialogDom);
            resetCss(dialogDom, cssRules);

            return dialog;
        }

        dialog = new UE.ui.Dialog({
            iframeUrl: UE._formDesignUrl + '/' + page,
            // name: controltype,
            name: type,
            editor: this,
            title: '文本框',
            // cssRules: "width:600px;height:310px;",
            cssRules: cssRules,
            buttons: [{
                    className: 'edui-okbutton',
                    label: '确定',
                    onclick: function() {
                        dialog.close(true);
                    }
                },
                {
                    className: 'edui-cancelbutton',
                    label: '取消',
                    onclick: function() {
                        dialog.close(false);
                    }
                }
            ]
        });
        dialog.render();

        dialogDom = dialog.getDom();

        resetClassName(dialogDom);

        return dialog;
    };
    var popup;
    /**
     * 创建一个popup 
     * @param {*Object} editor 编辑器实例对象
     * @param {*String} controltype 当前扩展名称
     * @param {*String} cmdName 要执行的命令名称 默认都是空 只有扩展控件中需要使用 值为实际要执行的cmd
     */
    var __createPopup = function(editor, controltype, cmdName) {
        if (popup) {
            popup._edittext = function() {
                baidu.editor.plugins[controltype].editdom = popup.anchorEl;
                editor.execCommand(cmdName || controltype);
                this.hide();
            };
            popup._delete = function() {
                var that = this;

                epoint.confirm('确认删除该控件吗？', '系统提醒', function() {
                    baidu.editor.dom.domUtils.remove(that.anchorEl, false);
                }, function() {
                    that.hide();
                });

                // if (window.confirm('确认删除该控件吗？')) {
                //     baidu.editor.dom.domUtils.remove(this.anchorEl, false);
                // }
                // this.hide();
            };
            return popup;
        }

        return (popup = new baidu.editor.ui.Popup({
            editor: editor,
            content: '',
            className: 'edui-bubble',
            _edittext: function() {
                baidu.editor.plugins[controltype].editdom = popup.anchorEl;
                editor.execCommand(cmdName || controltype);
                this.hide();
            },
            _delete: function() {
                var that = this;

                epoint.confirm('确认删除该控件吗？', '系统提醒', function() {
                    baidu.editor.dom.domUtils.remove(that.anchorEl, false);
                }, function() {
                    that.hide();
                });
            }
        }));
    };

    /**
     * 由于表格插入前需要做样式选择，原生提供的不支持自定义，因此此处重新实现一个按钮用以实现相关功能
     * 基本流程为在点击按钮弹出一个Dialog页面 在页面中完成表格主题选择、行列数的取值，后调用_inserttablewidthstyle命令插入表格。
     * 
     * 需要根据实际情况修改按钮的index值
     */
    UE.registerUI('inserttablewidthstyle', function(editor, uiName) {
        var UT = UE.UETable,
            domUtils = UE.dom.domUtils,
            browser = UE.browser,
            getDefaultValue = function(editor, table) {
                return UT.getDefaultValue(editor, table);
            };

        //创建dialog
        var dialog = new UE.ui.Dialog({
            iframeUrl: UE._formDesignUrl + '/inserttable.html',
            //需要指定当前的编辑器实例
            editor: editor,
            //指定dialog的名字
            name: uiName,
            //dialog的标题
            title: "插入表格",

            //指定dialog的外围样式
            cssRules: "width:600px;height:420px;",

            //如果给出了buttons就代表dialog有确定和取消
            buttons: [{
                className: 'edui-okbutton',
                label: '确定',
                onclick: function() {
                    dialog.close(true);
                }
            }, {
                className: 'edui-cancelbutton',
                label: '取消',
                onclick: function() {
                    dialog.close(false);
                }
            }]
        });
        // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
        editor.registerCommand('_' + uiName, {
            // 以下命令操作直接沿用的 table.cmds.js 中 inserttable 的命令 只是修改了createTable方法，最后返回时为 table 加上了一个类名
            execCommand: function(cmd, opt) {
                function createTable(opt, tdWidth, tableClass) {
                    var html = [],
                        rowsNum = opt.numRows,
                        colsNum = opt.numCols;
                    for (var r = 0; r < rowsNum; r++) {
                        html.push('<tr' + (r == 0 ? ' class="firstRow"' : '') + '>');
                        for (var c = 0; c < colsNum; c++) {
                            html.push('<td width="' + tdWidth + '"  vAlign="' + opt.tdvalign + '" >' + (browser.ie && browser.version < 11 ? domUtils.fillChar : '<br/>') + '</td>');
                        }
                        html.push('</tr>');
                    }

                    tableClass = tableClass || '';
                    //禁止指定table-width
                    return '<table class="' + tableClass + '"><tbody>' + html.join('') + '</tbody></table>';
                }

                if (!opt) {
                    opt = utils.extend({}, {
                        numCols: this.options.defaultCols,
                        numRows: this.options.defaultRows,
                        tdvalign: this.options.tdvalign
                    });
                }
                var me = this;
                var range = this.selection.getRange(),
                    start = range.startContainer,
                    firstParentBlock = domUtils.findParent(start, function(node) {
                        return domUtils.isBlockElm(node);
                    }, true) || me.body;

                var defaultValue = getDefaultValue(me),
                    tableWidth = firstParentBlock.offsetWidth,
                    tdWidth = Math.floor(tableWidth / opt.numCols - defaultValue.tdPadding * 2 - defaultValue.tdBorder);

                //todo其他属性
                !opt.tdvalign && (opt.tdvalign = me.options.tdvalign);
                me.execCommand("inserthtml", createTable(opt, tdWidth, opt.tableClass));
            }
        });

        var btn = new UE.ui.Button({
            name: uiName + '-btn',
            title: '插入表格',
            // 需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
            cssRules: 'background-position: -580px -20px',
            onclick: function() {
                //渲染dialog
                dialog.render();
                dialog.open();
            }
        });

        // 处理按钮状态映射，并非任何情况下都能点击按钮
        editor.addListener('selectionchange', function() {
            // 插入表格命令是否可用直接用默认的插入表格即可
            var state = editor.queryCommandState('inserttable');

            if (state == -1) {
                btn.setDisabled(true);
                btn.setChecked(false);
            } else {
                btn.setDisabled(false);
                btn.setChecked(state);
            }
        });

        return btn;
    }, 78 /*index 指定添加到工具栏上的哪个位置，默认时追加到最后 */ );

    /**
     * 文本框
     * @command textfield
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'textfield');
     * ```
     */
    UE.plugins['text'] = function() {
        var me = this,
            controltype = 'text';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'text.html', controltype, '文本框', "width:680px;height:320px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'textbox')) {
                var popup = __createPopup(me, controltype);

                popup.render();

                var html = popup.formatHtml(
                    '<nobr>文本框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });

    };
    /**
     * 宏控件
     * @command macros
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'macros');
     * ```
     */
    UE.plugins['macros'] = function() {
        var me = this,
            controltype = 'macros';
        me.commands[controltype] = {
            execCommand: function() {

                var dialog = __createDialog.call(this, 'macros.html', controltype, '宏控件', "width:700px;height:300px;");

                dialog.open();
            }
        };
        // var popup = new baidu.editor.ui.Popup({
        //     editor: this,
        //     content: '',
        //     className: 'edui-bubble',
        //     _edittext: function() {
        //         baidu.editor.plugins[controltype].editdom = popup.anchorEl;
        //         me.execCommand(controltype);
        //         this.hide();
        //     },
        //     _delete: function() {
        //         if (window.confirm('确认删除该控件吗？')) {
        //             baidu.editor.dom.domUtils.remove(this.anchorEl, false);
        //         }
        //         this.hide();
        //     }
        // });
        // popup.render();
        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'macro')) {
                var popup = __createPopup(me, controltype);

                popup.render();

                var html = popup.formatHtml(
                    '<nobr>宏控件: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });
    };
    /**
     * 单选框
     * @command radio
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'radio');
     * ```
     */
    UE.plugins['radio'] = function() {
        var me = this,
            controltype = 'radio';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'radio.html', controltype, '单选框', "width:590px;height:370px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
//            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && controlType == controltype) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>单选框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });
    };

    /**
     * 复选框
     * @command checkbox
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'checkbox');
     * ```
     */

    UE.plugins['checkbox'] = function() {
        var me = this,
            controltype = 'checkbox';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'checkbox.html', controltype, '复选框', "width:600px;height:200px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
//            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && controlType == controltype) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>复选框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });
    };

    /**
     * 单选框组
     * @command radios
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'radio');
     * ```
     */
    UE.plugins['radios'] = function() {
        var me = this,
            controltype = 'radios';
        me.commands[controltype] = {
            execCommand: function() {

                var dialog = __createDialog.call(this, 'radios.html', controltype, '单选框组', "width:680px;height:370px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'radiobuttonlist')) {
                var popup = __createPopup(me, controltype);
                popup.render();
                var html = popup.formatHtml(
                    '<nobr>单选框组: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    var elInput = el.getElementsByTagName("input");
                    var rEl = elInput.length > 0 ? elInput[0] : el;
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(rEl);
                } else {
                    popup.hide();
                }
            }
        });
    };
    /**
     * 复选框组
     * @command checkboxs
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'checkboxs');
     * ```
     */
    UE.plugins['checkboxs'] = function() {
        var me = this,
            controltype = 'checkboxs';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'checkboxs.html', controltype, '复选框组', "width:700px;height:400px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'checkboxlist')) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>复选框组: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    var elInput = el.getElementsByTagName("input");
                    var rEl = elInput.length > 0 ? elInput[0] : el;
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(rEl);
                } else {
                    popup.hide();
                }
            }
        });
    };
    /**
     * 多行文本框
     * @command textarea
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'textarea');
     * ```
     */
    UE.plugins['textarea'] = function() {
        var me = this,
            controltype = 'textarea';
        me.commands[controltype] = {
            execCommand: function() {

                var dialog = __createDialog.call(this, 'textarea.html', controltype, '多行文本框', "width:700px;height:330px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'textarea')) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>多行文本框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });
    };
    /**
     * 下拉菜单
     * @command select
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'select');
     * ```
     */
    UE.plugins['select'] = function() {
        var me = this,
            controltype = 'select';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'dropdowntextbox.html', controltype, '下拉菜单', "width:700px;height:370px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'dropdowntextbox')) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>下拉菜单: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    if (el.tagName == 'SPAN') {
                        var elInput = el.getElementsByTagName("select");
                        el = elInput.length > 0 ? elInput[0] : el;
                    }
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });

    };
    /**
     * 进度条
     * @command progressbar
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'progressbar');
     * ```
     */
    UE.plugins['progressbar'] = function() {
        var me = this,
            controltype = 'progressbar';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'progressbar.html', controltype, '进度条', "width:600px;height:450px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            if (/img/ig.test(el.tagName) && controlType == controltype) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>进度条: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });
    };
    /**
     * 二维码
     * @command qrcode
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'qrcode');
     * ```
     */
    UE.plugins['qrcode'] = function() {
        var me = this,
            controltype = 'qrcode';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'qrcode.html', controltype, '二维码', "width:600px;height:370px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            if (/img/ig.test(el.tagName) && controlType == controltype) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>二维码: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });
    };
    /**
     * 列表控件
     * @command listctrl
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'qrcode');
     * ```
     */
    UE.plugins['listctrl'] = function() {
        var me = this,
            controltype = 'listctrl';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'listctrl.html', controltype, '列表控件', "width:800px;height:400px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            // var controlType = el.getAttribute('controltype');
            // 上句有误 不能直接取值 在编辑器 有滚动条时 el为document 无该方法 
            // by chends at 2017.07.05
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            if (/img/ig.test(el.tagName) && controlType == controltype) {
                var popup = __createPopup(me, controltype);
                popup.render();

                var html = popup.formatHtml(
                    '<nobr>列表控件: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });
    };
    /**
     * 扩展控件
     */
    UE.plugins['exControl'] = function() {
        var me = this,
            controltype = 'exControl';

        // 由于可扩展控件有多个 每个的命令和要打开的地址都不一样 需要 在之后再注册

        // 统一的tips编辑
        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            if (/img/ig.test(el.tagName) && controlType == controltype) {
                // var popup = __createPopup(me, controltype);

                // 对于可扩展控件来说 controlType='exControl' 为扩展名 但并非要执行的命令名称 需要再传入命令名称
                var popup = __createPopup(me, controlType, el.getAttribute('excmd'));

                popup.render();

                var exControlType = el.getAttribute('exControlType');

                var html = popup.formatHtml(
                    '<nobr>扩展控件' + (exControlType ? '-' + exControlType : '') + ': <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });

    };

    // UE.plugins['more'] = function() {
    //     var me = this,
    //         controltype = 'more';
    //     me.commands[controltype] = {
    //         execCommand: function() {
    //             var dialog = new UE.ui.Dialog({
    //                 iframeUrl: UE._formDesignUrl + '/more.html',
    //                 name: controltype,
    //                 editor: this,
    //                 title: '玩转表单设计器，一起参与，帮助完善',
    //                 cssRules: "width:600px;height:200px;",
    //                 buttons: [{
    //                     className: 'edui-okbutton',
    //                     label: '确定',
    //                     onclick: function() {
    //                         dialog.close(true);
    //                     }
    //                 }]
    //             });
    //             dialog.render();
    //             dialog.open();
    //         }
    //     };
    // };
    UE.plugins['error'] = function() {
        var me = this,
            controltype = 'error';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = new UE.ui.Dialog({
                    iframeUrl: UE._formDesignUrl + '/error.html',
                    name: controltype,
                    editor: this,
                    title: '异常提示',
                    cssRules: "width:400px;height:130px;",
                    buttons: [{
                        className: 'edui-okbutton',
                        label: '确定',
                        onclick: function() {
                            dialog.close(true);
                        }
                    }]
                });
                dialog.render();
                dialog.open();
            }
        };
    };

    /**
     * datagrid 表格控件
     * @command datagrid
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'datagrid');
     * ```
     */
    UE.plugins['datagrid'] = function() {
        var me = this,
            controltype = 'datagrid';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'datagrid.html', controltype, 'datagrid', "width:960px;height:360px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'datagrid')) {
                var popup = __createPopup(me, controltype);

                popup.render();

                var html = popup.formatHtml(
                    '<nobr>datagrid控件: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });

    };
    
    /**
     * datetextbox 日期控件
     * @command datetextbox
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'datetextbox');
     * ```
     */
    UE.plugins['datetextbox'] = function() {
        var me = this,
            controltype = 'datetextbox';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'datetextbox.html', controltype, '日期控件', "width:280px;height:250px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'datetextbox')) {
                var popup = __createPopup(me, controltype);

                popup.render();

                var html = popup.formatHtml(
                    '<nobr>日期控件: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });

    };

    /**
     * fileupload 上传控件
     * @command fileupload
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.execCommand( 'fileupload');
     * ```
     */
    UE.plugins['fileupload'] = function() {
        var me = this,
            controltype = 'fileupload';
        me.commands[controltype] = {
            execCommand: function() {
                var dialog = __createDialog.call(this, 'fileupload.html', controltype, '文件上传', "width:280px;height:380px;");

                dialog.open();
            }
        };

        me.addListener('mouseover', function(t, evt) {
            evt = evt || window.event;
            var el = evt.target || evt.srcElement;
            var controlType = el && el.getAttribute && el.getAttribute('controltype');
            var classname = el && el.getAttribute && el.getAttribute('class');
            if (/img/ig.test(el.tagName) && (controlType == controltype || classname == 'fileupload')) {
                var popup = __createPopup(me, controltype);

                popup.render();

                var html = popup.formatHtml(
                    '<nobr>文件上传: <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
                if (html) {
                    popup.getDom('content').innerHTML = html;
                    popup.anchorEl = el;
                    popup.showAnchor(popup.anchorEl);
                } else {
                    popup.hide();
                }
            }
        });

    };
    
})(this);