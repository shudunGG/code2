/*!
 * commondto
 */
(function (win, $) {
    var CommonDto = function (formId, action, isRefresh, initHook) {
        // minui的form对象集合
        this.forms = [];
        // 需要手动验证的控件
        // 即不属于表单控件，但是又需要验证的（表格控件）
        this.extraValidateControl = [];

        this.action = action;
        this.isRefresh = isRefresh;
        // setData中，每次控件设置完值后的回调
        // 方便外部在给控件设值时做一些额外操作，避免外部在需要对控件做额外处理时重新遍历控件
        this.initHook = initHook;

        if (formId != '@none') {
            if (!formId || formId == '@all') {
                this.forms.push(new mini.Form(document.body));
            } else {
                if (!mini.isArray(formId)) {
                    formId = [formId];
                }

                for (var i = 0, len = formId.length; i < len; i++) {
                    if (typeof formId[i] == 'string' && formId[i].substr(0, 1) != '#') {
                        formId[i] = '#' + formId[i];
                    }
                    this.forms.push(new mini.Form(formId[i]));
                }
            }
        }

        this._init();
    };

    // 所有布局控件，允许控件的嵌套，但本身不会加到commonDto中
    var LAYOUT_CONTROL = ['fit', 'panel', 'window', 'splitter', 'layout',
        'toolbar', 'tabs', 'outlookbar', 'popup', 'include', 'repeat', 'button', 'calendar'
    ];

    // 优化 by liub 2017-08-16
    // 当前页面路径
    // 从CommonDto._initFields中移到了外面，因为该值只需计算一次
    var requestMapping = (function () {
        var loc = Util.getSafeLocation();
        var url = loc.protocol + '//' + loc.host + loc.pathname;
        var root = Util.getRootPath();
        return Util.getRightUrl('rest/' + url.substring(root.length, url.lastIndexOf('/')));
    })();

    function getByField(data, field, value) {
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i][field] == value) {
                return data[i];
            }
        }
        return null;
    }

    CommonDto.prototype = {
        constructor: CommonDto,

        _init: function () {
            var controls = null;

            // 控件集合
            this.controlArr = [];

            // 获取form集合下的所有miniui控件
            for (var i = 0, len = this.forms.length; i < len; i++) {
                controls = mini.getChildControls(this.forms[i]);
                this.controlArr = this.controlArr.concat(controls);
            }

            this._initFields();
        },

        // 初始化所有控件（用于后台CommonDto）的配置信息
        _initFields: function () {
            this.fields = {};

            var lastControl = null,
                control = null,
                loadControl = null,
                url = '',
                autoLoad = false;

            for (var i = 0, len = this.controlArr.length; i < len; i++) {
                control = this.controlArr[i];

                if (!lastControl || !mini.isAncestor(lastControl.el, control.el)) {
                    // 排除布局控件
                    if (LAYOUT_CONTROL.indexOf(control.type) == -1) {
                        // 排除mini-popup中的子控件
                        if (mini.findParent(control.el, 'mini-popup', 2)) {
                            continue;
                        }

                        // 排除部分内部控件
                        if (lastControl && mini.isAncestor(control.el, lastControl.el)) {
                            // 上一个控件是当前控件的子控件，说明上一个控件是当前控件的内部控件，去除上一个控件
                            this.fields[lastControl.id] = null;
                            delete this.fields[lastControl.id];
                        }

                        lastControl = control;

                        // 如果既没有设置bind又没有设置action，则表示不需要与后台交互
                        if (!control.bind && !control.action) {
                            continue;
                        }

                        // 根据action设置控件url
                        if (this.action) {
                            if (control.getUrl && !control.getUrl()) {
                                url = requestMapping + '/' + this.action;
                                // 验证码控件特殊处理，直接设置页面的action为
                                if (control.type == 'verifycode') {
                                    // rest形式的url需要加上isCommondto=true
                                    url += '/page_load?isCommondto=true';
                                    control.setUrl(url);
                                } else if (control.action) {
                                    // treeSelect特殊处理
                                    if (control.type == 'treeselect' || control.type == 'tabstreeselect' || control.type == 'treelistselect') {
                                        loadControl = control.tree;
                                        // 把action传递到子控件
                                        loadControl.set({
                                            action: control.action
                                        });

                                    } else {
                                        loadControl = control;
                                    }
                                    // 把control上的action加到url上
                                    url += '/' + control.action;

                                    autoLoad = loadControl.getAutoLoad ? loadControl.getAutoLoad() : false;

                                    // 先禁用autoLoad功能
                                    if (autoLoad) {
                                        loadControl.setAutoLoad(false);
                                    }

                                    control.setUrl(url);

                                    // 再开启autoLoad功能
                                    if (autoLoad) {
                                        loadControl.setAutoLoad(true);
                                    }
                                }
                            }

                            // 导出控件action特殊处理
                            if (control.type == 'dataexport') {
                                // action不传给后台，所以url中必须要带上方法
                                if (control.action) {
                                    url = requestMapping + '/' + this.action + '/' + control.action;
                                    control.setExportUrl(url);
                                }

                            }

                            // 上传控件没有setUrl方法，需要特殊处理下
                            if (control.type == 'webuploader' || control.type == 'largefileuploader') {
                                // 有设置action，但只设置了方法名，未带上action名，需要自动加上页面action
                                if (control.action && control.action.indexOf('.') == -1) {
                                    control.setAction(this.action + '.' + control.action);
                                }
                            }
                        }

                        var field = {
                            "id": control.id,
                            "bind": control.bind,
                            "type": control.type,
                            "action": $.trim(control.action)
                        };

                        // format是控件的标准属性，用来控制显示格式，需要提交给后台
                        if (control.format) {
                            field.format = control.format;
                        }
                        if (control['data-options']) {
                            field.dataOptions = control['data-options'];
                        }

                        if (control.mapClass) {
                            field.mapClass = control.mapClass;
                        }

                        if (control.isUserControl) {
                            field.type = "UserControl";

                            // 优化 by liub 2017-08-16
                            // usercontrol就不需要再扩展了
                        } else {
                            // 根据type，即控件类型，来扩展字段
                            switch (field.type) {
                                case 'checkboxlist':
                                case 'radiobuttonlist':
                                case 'autocomplete':
                                    $.extend(field, {
                                        textField: control.textField,
                                        valueField: control.valueField
                                    });
                                    break;
                                case 'combobox':
                                    $.extend(field, {
                                        textField: control.textField,
                                        valueField: control.valueField,
                                        pinyinField: control.pinyinField,
                                        // 控件是没有datasourcename这个属性的，先去掉
                                        // datasourcename: control.datasourcename,
                                        columns: this._parseColumn(control.columns)
                                    });
                                    break;
                                case 'datagrid':
                                    $.extend(field, this._parseDataDrid(control));
                                    // 表格控件需要手动的调用验证
                                    this.extraValidateControl.push(control);
                                    break;
                                case 'listbox':
                                    $.extend(field, {
                                        textField: control.textField,
                                        valueField: control.valueField,
                                        columns: this._parseColumn(control.columns)
                                    });
                                    break;
                                case 'lookup':
                                    $.extend(field, {
                                        textField: control.textField,
                                        valueField: control.valueField,
                                        grid: this._parseDataDrid(control.grid)
                                    });
                                    break;
                                case 'tree':
                                    $.extend(field, this._parseTree(control));
                                    break;
                                case 'filtertree':
                                    $.extend(field, this._parseTree(control));
                                    if (field.type == 'tree-nested') {
                                        field.type = "filtertree-nested";

                                    } else {
                                        field.type = "filtertree-non-nested";
                                    }
                                    break;
                                case 'treeselect':
                                    $.extend(field, this._parseTree(control.tree));
                                    if (field.type == 'tree-nested') {
                                        field.type = "treeselect-nested";

                                    } else {
                                        field.type = "treeselect-non-nested";
                                    }

                                    $.extend(field, {
                                        textField: control.textField,
                                        valueField: control.valueField,
                                        pinyinField: control.pinyinField
                                    });
                                    break;
                                case 'treegrid':
                                    $.extend(field, this._parseTreeGrid(control));
                                    break;
                                case 'pagertree':
                                    $.extend(field, this._parsePagerTree(control));
                                    break;
                                case 'tabstreeselect':
                                    var treeField = this._parseTree(control.tree);
                                    field.tree = treeField;
                                    break;
                                case 'verifycode':
                                    field.width = control.width;
                                    field.height = control.height;
                                    field.charLength = control.charLength;
                                    field.ignorecase = control.ignorecase;
                                    break;
                                case 'webuploader':
                                case 'largefileuploader':
                                    field.showDefaultUI = control.showDefaultUI;
                                    // field.fileSizeLimitFromServer = control.fileSizeLimitFromServer;
                                    // field.limitTypeFromServer = control.limitTypeFromServer;
                                    // // 全局中配置了属性默认值需要从后端取
                                    // if(win.mini_attrValue_fromServer) {
                                    //     // 如果页面上未显示配置false，则需要将值强制设为true
                                    //     if(field.fileSizeLimitFromServer !== false) {
                                    //         field.fileSizeLimitFromServer = true;
                                    //     }
                                    //     if(field.limitTypeFromServer !== false) {
                                    //         field.limitTypeFromServer = true;
                                    //     }
                                    // }
                                    break;
                                    // 导出控件新增exportAction属性用来个性化指定后台导出处理方法
                                case 'dataexport':
                                    field.exportAction = control.exportAction;
                                    break;

                            }
                        }

                        this.fields[field.id] = field;

                    }
                }
            }
        },

        // 增加一个控件配置信息
        addField: function (field) {
            this.fields[field.id] = field;
        },

        // 根据控件id，获取配置信息
        getField: function (id) {
            return this.fields[id];
        },

        // 根据控件id，移除配置信息
        removeField: function (id) {
            this.fields[id] = null;
            delete this.fields[id];
        },

        // 根据后台返回的json数据，设置控件的值（data、value）或数据源(url)
        // 一般用于页面控件的初始化
        setData: function (data, customData) {

            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i],
                    control = mini.get(item.id),
                    pageSize;

                if (control) {
                    if (item.data) {
                        if (control.uiCls == "mini-datagrid" || control.uiCls == "mini-pagertree" || control.uiCls == "mini-treegrid") {
                            // 所有刷新都回到首页
                            if (this.isRefresh) {
                                control.setPageIndex(0);

                            } else if (item.pageIndex !== undefined) {
                                // 在删除记录重新刷新页面时，可能当前页已没数据，后端会自动往前查一页数据，并把页码数返回过来，这里需要把页码数重新更新一下
                                control.setPageIndex(item.pageIndex);
                            }

                            // 由于pagertree、treegrid有树形结构，不能同一调用setData方法
                            // 设置表格数据
                            // control.setData(item.data);
                            // 设置分页栏状态
                            if (item.total !== undefined) {
                                control.setTotalCount(item.total);

                            }

                            // 经过commondto刷新的数据，手动展开收缩的节点都已重置了，所以需要将对应的缓存数据也重置
                            // 重置有问题，刷新后的数据展开状态没有变，再次刷新，展开状态就丢了
                            // if (control.uiCls == "mini-pagertree") {
                            //     control._collapseNodes = [];
                            //     control._expandNodes = [];
                            // }

                            // // 添加服务端设置pageSize的功能
                            // // 条件是服务端返回pageSize，并且满足下面两个中的任一个：
                            // // 1.控件显示的配置了pageSizeFromServer为true
                            // // 2.全局配置mini_attrValue_fromServer为true并且控件没有显示设置pageSizeFromServer为false
                            // pageSize = item.pageSize;
                            // if(pageSize && (control.pageSizeFromServer || (win.mini_attrValue_fromServer && control.pageSizeFromServer !== false))) {
                            //     control.setPageSize(pageSize);
                            //     control.setSizeList([pageSize, pageSize * 2, pageSize * 5, pageSize * 10]);
                            // }


                        }
                        if (control.loadList) {
                            // 表格树是不支持分页的，所以不用处理分页相关的步骤
                            // 树，表格树的加载数据方法需根据resultAsTree的值来确定是用loadList还是setData方法
                            if (control.getResultAsTree()) {
                                control.setData(item.data);
                            } else {
                                control.loadList(item.data);
                            }
                        } else if (control.setData) {
                            // if (control.type == 'webuploader' || control.type == 'largefileuploader') {
                            //     // 优化 by liub 2017-08-16
                            //     // clearFile方法是会发请求告诉后端删除附件的，这里调用不适合
                            //     // control.clearFile();

                            //     // // 如果后端返回了fileSizeLimit，并且控件上也设置了需要从后端取值，则需要把后端的值设置到控件上
                            //     // if(item.fileSizeLimit && control.fileSizeLimitFromServer) {
                            //     //     control.setFileSizeLimit(item.fileSizeLimit);
                            //     // }

                            //     // if(item.limitType && control.limitTypeFromServer) {
                            //     //     control.setLimitType(item.limitType);
                            //     // }
                            // }
                            control.setData(item.data);
                        }

                        // 触发控件的onload事件
                        control.fire('load', {
                            data: item.data
                        });

                    }
                    // 与后端约定好，没有值用null表示
                    if (item.value !== null && item.value !== undefined) {
                        // checkbox控件setValue方法参数只能是true/false，值必须通过setChecked方法来设置
                        if (control.type == 'checkbox') {
                            control.setChecked(item.value);
                        } else {
                            // webeditor控件的值中可能存在被处理过的字符，需要把它还原出来
                            if (control.type == 'webeditor' && item.value) {
                                item.value = item.value.replace(/Java&Scr&ipt/g, 'JavaScript');
                            }
                            control.setValue(item.value);
                        }
                    }
                    if (item.text && control.setText) {
                        control.setText(item.text);
                    }
                    if (item.url) {
                        var autoLoad = control.getAutoLoad();

                        // 先禁用autoLoad功能
                        if (autoLoad) {
                            control.setAutoLoad(false);
                        }
                        control.setUrl(item.url);

                        // 再开启autoLoad功能
                        if (autoLoad) {
                            control.setAutoLoad(true);
                        }
                    }

                    // 控件状态都是通过个性化回调来做的，这边先注释掉
                    // 设置控件状态
                    // if (item.visible === false) {
                    //     control.hide();
                    // } else if (item.visible === true) {
                    //     control.show();
                    // }

                    // if (item.enable === false) {
                    //     control.disable();
                    // } else if (item.enable === true) {
                    //     control.enable();
                    // }

                    if (this.initHook) {
                        this.initHook.call(this, control, item, customData);
                    }
                } else if (item.id == '_common_hidden_viewdata') {
                    // 设置了隐藏域则自动往页面中加一个隐藏域
                    var hidden = new mini.Hidden();

                    hidden.setId('_common_hidden_viewdata');

                    hidden.render(document.body);

                    hidden.setValue(item.value);
                }
            }
        },

        // 获取所有控件的配置信息集合
        // 一般用于二次请求的请求数据
        // original，false|undefined则按照CommonDto方式来组织数据，true则不做处理
        getData: function (original) {
            var control = null,
                data = null,
                fields = {},
                field, i, id, value;

            // 优化 by liub 2017-08-16
            // 不需要循环遍历页面上的所以控件this.controlArr，只需遍历需要的字段this.fields
            // for (i = 0, len = this.controlArr.length; i < len; i++) {
            //     control = this.controlArr[i];
            //     value = control.getValue();

            //     // treegrid有getValue方法，但是应该走grid的逻辑
            //     if (value !== undefined && control.type != 'treegrid') {
            //         id = control.getId();

            //         if (this.fields[id]) {
            //             // webeditor控件的值中可能会包含后台安全策略里的一些敏感字，需要把它转义
            //             if (control.type == 'webeditor') {
            //                 value = value.replace(/javascript/gi, 'Java&Scr&ipt');
            //                 // 控件中的尖括号进行替换
            //                 // 因安全扫描问题添加， 仅在提交数据时进行替换，返回时无需处理。
            //                 value = value.replace(/>/g, '_EpRightBracket_').replace(/</g, '_EpLeftBracket_');
            //             }
            //             // output outputtext 不是可编辑控件，值无需传给后台，直接赋值为空
            //             if (control.type === 'output' || control.type === 'outputtext') {
            //                 value = '';
            //             }
            //             // value值除了日期控件一律转化为string，以方便后台处理
            //             this.fields[id].value = value;
            //             if (!mini.isDate(value)) {
            //                 this.fields[id].value += '';
            //             }


            //             if (control.getText) {
            //                 this.fields[id].text = control.getText();
            //             }
            //         }

            //     } else if (control.type == 'datagrid' || control.type == 'treegrid' || control.type == 'pagertree') {
            //         var idField = control.getIdField(),
            //             selectedData = control.getAllSelecteds ? control.getAllSelecteds() : control.getSelecteds(),
            //             temp;

            //         id = control.getId();
            //         if (this.fields[id]) {
            //             if (control.isEditing()) {
            //                 data = control.getEditData();
            //                 this.fields[id].staticEdit = true;
            //             } else {
            //                 data = control.getChanges(null, true);
            //             }

            //             for (var j = 0, l = selectedData.length; j < l; j++) {
            //                 var item = null;
            //                 // if (selectedData[j]) {
            //                 item = getByField(data, idField, selectedData[j][idField]);
            //                 // }

            //                 if (item) {
            //                     item._checked = true;
            //                 } else {
            //                     temp = {
            //                         _checked: true
            //                     };
            //                     temp[idField] = selectedData[j][idField];
            //                     data.push(temp);
            //                 }
            //             }

            //             this.fields[id].data = data;
            //         }

            //     }
            // }

            var hidden = mini.get('_common_hidden_viewdata');

            for (i in this.fields) {
                field = this.fields[i];
                id = field.id;
                control = mini.get(id);

                if (control) {
                    value = control.getValue();

                    // treegrid有getValue方法，但是应该走grid的逻辑
                    if (value !== undefined && control.type != 'treegrid') {
                        // webeditor控件的值中可能会包含后台安全策略里的一些敏感字，需要把它转义
                        if (control.type == 'webeditor') {
                            // epoint_deal_webeditor 开放给外部处理编辑器中的内容
                            // 需求来自对于编辑器内容死链接的处理
                            if (typeof epoint.onBeforeDealWebeditor == 'function') {
                                value = epoint.onBeforeDealWebeditor(value);
                            }
                            if(Util.getFrameSysParam('enableFrontSpecialEncode')) {
                                // javascript/script这两个都是关键字，会被后台安全模块拦截，将它替换成Java&Scr&ipt
                                value = value.replace(/javascript/gi, 'Java&Scr&ipt');
                                // 控件中的尖括号进行替换
                                // 因安全扫描问题添加， 仅在提交数据时进行替换，返回时无需处理。
                                value = value.replace(/>/g, '_EpRightBracket_').replace(/</g, '_EpLeftBracket_');
                            }
                        }
                        // output outputtext 不是可编辑控件，值无需传给后台，直接赋值为空
                        if (control.type === 'output' || control.type === 'outputtext') {
                            value = '';
                        }
                        if (control.type === 'daterangepicker') {
                            value = mini.encode(value);
                        }
                        // value值除了日期控件一律转化为string，以方便后台处理
                        field.value = value;
                        if (!mini.isDate(value)) {
                            field.value += '';
                        }

                        /*
                         * 项目中出现checkboxlist控件的text中包含html标签（为了标红强调一些文字），提交时就被安全模块拦截了
                         * 与liufl沟通，提交时可以不需要text，故将下面设置text的代码注释掉
                         */
                        // if (control.getText) {
                        //     field.text = control.getText();
                        // }

                        /**
                         * 修改后发现树相关控件：Tree、TabsTreeSelect和treeselect控件后端取值出现了问题，后端模型中的selectitem必须要有text和value两个字段
                         * 所以对于Tree、TabsTreeSelect和treeselect控件仍需带上text
                         * Tree控件的getText方法已将text中的html标签去除了，所以不需做额外处理
                         * 
                         * AutoComplete 控件服务端需要通过text来进行过滤，所以需要带上text
                         */
                        // if (control.type == 'tabstreeselect' || control.type == 'treeselect' || control.type == 'tree' || control.type == 'autocomplete') {
                        //     this.fields[id].text = control.getText();
                        // }

                        /**
                         * 修改后慢慢发现有很多控件还是需要text的
                         * 并且政务服务项目上反馈有些个性化的地方就是需要获取到控件的text
                         * 故将text还原回来，改为统一去除text中可能存在的html标签
                         */
                        if (control.getText) {
                             // 安全整改后允许客户端输入任意字符，所以不需要将html标签去除了
                            // field.text = (control.getText() || '').replace(/<\/?.+?>/g, "");
                            field.text = control.getText() || '';

                        }
                    } else if (control.type == 'datagrid' || control.type == 'treegrid' || control.type == 'pagertree') {
                        var idField = control.getIdField(),
                            selectedData = control.getAllSelecteds ? control.getAllSelecteds() : control.getSelecteds(),
                            temp;

                        if (control.isEditing()) {
                            data = control.getEditData();
                            field.staticEdit = true;
                        } else {
                            // 政务服务反馈对于treegrid控件后端需要获取到完整的一行数据
                            // 这边先将提交数据改为完整数据
                            data = control.getChanges(null, control.type != 'treegrid');
                        }
                        var item = null;
                        for (var j = 0, l = selectedData.length; j < l; j++) {
                            
                            // if (selectedData[j]) {
                            item = getByField(data, idField, selectedData[j][idField]);
                            // }

                            if (item) {
                                item._checked = true;
                            } else {
                                temp = {
                                    _checked: true
                                };
                                temp[idField] = selectedData[j][idField];
                                data.push(temp);
                            }
                        }

                        // 安全整改后，要求前端不用再对输入的数据做处理，用户输入什么就提交什么
                        // 提交数据前需要把表格单元格中转义的html标签还原回来
                        for(j = 0, l = data.length; j < l; j++) {
                            item = data[j];

                            for(var key in item) {
                                item[key] = mini.htmlUnescape(item[key]);
                            }
                        }

                        // pagertree 控件的节点展开状态需要改在刷新数据时也要保持
                        if (control._getEcConfig) {
                            field.__ecconfig = control._getEcConfig();
                        }

                        field.data = data;

                    }

                    // 为了解决同时打开多个tab，都有验证码，并且bind同一个后台方法时，后台区分哪个验证码，加上了一个uuid
                    // 提交数据时将uuid带回去
                    if (control.type == 'verifycode') {
                        field.uuid = control.uuid;
                    }
                    fields[i] = field;
                }
            }

            if (!fields['_common_hidden_viewdata']) {
                fields['_common_hidden_viewdata'] = {
                    id: '_common_hidden_viewdata',
                    type: 'hidden',
                    value: ''
                };

            }

            if (hidden) {
                fields['_common_hidden_viewdata'].value = hidden.getValue();
            }

            if (original) {
                return fields;
            } else {
                data = [];

                for (i in fields) {
                    data.push(fields[i]);
                }

                // return {
                //     commonDto: mini.encode(data, "yyyy-MM-dd HH:mm:ss").replace(/'/g, '_EpSingleQuotes_')
                // };

                // 框架安全模块功能变更，可以通过配置来决定是否对特殊字符进行编码
                data = mini.encode(data, "yyyy-MM-dd HH:mm:ss");

                if(Util.getFrameSysParam('enableFrontSpecialEncode')) {
                    data = data.replace(/'/g, '_EpSingleQuotes_');
                }
                
                return {
                    commonDto: data
                };
            }
        },

        // 初始化页面上指定form下的所有控件
        init: function (opts) {
            var that = this,
                data = this.getData();

            if (opts.params) {
                if(Util.getFrameSysParam('enableFrontSpecialEncode')) {
                    // 外部参数不能统一处理尖括号、javascript关键字等，这些处理应该只针对富文本编辑器的内容
                    // 在方法里是无法判断传进来的参数的来源，所以只能在外部自己决定是是否处理尖括号、javascript关键字
                    data["cmdParams"] = opts.params.replace(/'/g, '_EpSingleQuotes_');
                } else {
                    data["cmdParams"] = opts.params;
                }
            }
            // 如果需要加密 替换为加密格式
            data = Util.encryptAjaxParams(opts.url, data);
            // 防止响应过快而添加遮罩又移除的卡顿感
            var miniMaskTimer;
            if (!opts.notShowLoading) {
                miniMaskTimer = setTimeout(function () {
                    mini.mask({
                        cls: 'mini-mask-loading'
                    });
                }, 200);
            }
            $.ajax({
                // url在传入前外部已处理
                url: opts.url,
                type: "post",
                dataType: 'json',
                data: data,
                statusCode: Util._handleStatusCode(),
                success: function (data) {

                    var status = data.status,
                        controls = data.controls,
                        custom = data.custom || '',

                        code = parseInt(status.code, 10),

                        text = status.text || '',
                        url = status.url,
                        tipTxt = (code === 1 || code === 200) ? '成功' : '失败',
                        tipType = (code === 1 || code === 200) ? 'success' : 'danger';

                    // custom 中是允许返回普通字符串的，所以不能用JSON.parse去处理
                    // if (custom && (typeof custom !== 'object')) {
                    //     custom = JSON.parse(custom);
                    // }

                    //有url，则先跳转
                    if (url) {
                        if (url.indexOf('http') !== 0) {
                            url = Util.getRootPath() + url;
                        }
                        var aimWindow = status.top ? top : window;
                        if (aimWindow.Util && aimWindow.Util.getSafeLocation) {
                            aimWindow.Util.getSafeLocation().setHref(url);
                        } else {
                            aimWindow.location.href = url;
                        }
                        return;
                    }
                    if (text) {
                        mini.showTips({
                            content: "<b>" + tipTxt + "</b> <br/>" + text,
                            state: tipType,
                            x: 'center',
                            y: 'top',
                            timeout: 3000
                        });
                    }
                    
                    if ((code === 1 || code === 200)) {
                        // 在设置控件值前，提供一个全局的事件，方便外部做一些个性化处理
                        // 由panqing提出省OA中表格控件在drawcell事件中需要根据custom中返回的数据来生成单元格内容
                        // 在表格设置数据前，需要先处理custom中的数据
                        if (typeof epoint.onPreload === 'function') {
                            epoint.onPreload(controls, custom);
                        }

                        controls.length && that.setData(controls, custom);

                        // 条件区域中的checkboxlist数据加载完后，可能会被遮住，需重新调整content布局的高度
                        if (win.adjustContentHeight) {
                            adjustContentHeight();
                        }
                        opts.done && opts.done.call(that, custom);
                    } else {
                        //操作失败
                        text = text ? text : '操作失败';

                        mini.showTips({
                            content: "<b>错误提示</b> <br/>" + text,
                            state: 'danger',
                            x: 'center',
                            y: 'top',
                            timeout: 3000
                        });
                    }

                    // // 移除遮罩
                    // if (!opts.notShowLoading) {
                    //     miniMaskTimer && clearTimeout(miniMaskTimer);
                    //     mini.unmask();
                    // }

                },
                error: function () {
                    // // 移除遮罩
                    // if (!opts.notShowLoading) {
                    //     miniMaskTimer && clearTimeout(miniMaskTimer);
                    //     mini.unmask();
                    // }

                    Util._ajaxErr.apply(Util, arguments);
                },
                complete: function () {
                    if (!opts.notShowLoading) {
                        miniMaskTimer && clearTimeout(miniMaskTimer);
                        mini.unmask();
                    }
                }
            });
        },

        // 对form集合下的表单控件进行验证
        validate: function (notShowAlert) {
            var result = true,
                i, len,
                firstError,
                firstErrorLabel,
                $target,
                $scrollEl,
                errMsg = '有字段验证未通过，请再检查一下！';

            for (i = 0, len = this.forms.length; i < len; i++) {
                if (!this.forms[i].validate()) {
                    result = false;

                    var errors = this.forms[i].getErrors(),
                        target = errors[0].el,
                        scrollEl = Util.getFirstScrollEl(target),
                        scrollTop = 0;

                        $target = $(target);
                        $scrollEl = $(scrollEl);
                    if (scrollEl) {
                        scrollTop = $target.offset().top + $scrollEl.scrollTop() - $scrollEl.offset().top;

                        $scrollEl.animate({
                            scrollTop: scrollTop
                        }, 500);
                    }

                    // 有错误时需要将第一个错误提示出来，所以需要把第一个出错的控件记录下来
                    firstError = errors[0];
                    firstErrorLabel = ($target.parent().attr('label') || $target.parent().prev().text() || $target.prev().text()).replace(/[:：]$/, '');
                    break;
                }
            }

            len = this.extraValidateControl.length;

            if (result && len) {
                for (i = 0; i < len; i++) {
                    if (!this.extraValidateControl[i].isValid()) {
                        result = false;
                    }
                }
            }

            // 验证不通过，添加alert进行提示
            // 该优化需求由OA提出，并经过交互评审确定使用alert的形式：http://oa2.epoint.com.cn:8080/OA9/oa9/mail/mailreceivedetail?detailguid=e97b9548-0534-4d19-852c-ec5a1bc15505
            // 当前页面隐藏的情况下，alert弹窗的位置就计算不对，导致无法看到alert弹窗，所以在隐藏时就不要再弹了
            if (!notShowAlert && !result && mini.isWindowDisplay()) {
                firstError && (errMsg = firstErrorLabel + '验证失败：' + firstError.errorText);
                mini.showMessageBox({
                    title: "错误提示",
                    buttons: ["ok"],
                    message: errMsg,
                    iconCls: "mini-messagebox-warning"
                });
            }

            return result;
        },

        // 解析columns配置中的字段信息
        _parseColumn: function (columns) {
            var col = [],
                data;
            if (columns) {
                for (var j = 0; j < columns.length; j++) {
                    var column = columns[j];
                    if (column.field) {
                        data = {
                            fieldName: column.field,
                            code: column.code,
                            format: column.format
                        };
                        // 为了让后端实现按需返回字段（不返回所有字段）displayField属性需要传递给后端
                        if (column.displayField) {
                            data.displayField = column.displayField;
                        }
                        col.push(data);

                    } else if (column.columns) {
                        var cols = this._parseColumn(column.columns);

                        for (var i = 0, l = cols.length; i < l; i++) {
                            col.push(cols[i]);
                        }
                    }
                }
            }

            return col;
        },

        // 解析Tree实例的配置信息
        _parseTree: function (control) {
            var field = {
                idField: control.idField,
                textField: control.textField,
                imgField: control.imgField,
                iconField: control.iconField
            };
            // 嵌套的数据组织形式
            if (control.getResultAsTree()) {
                $.extend(field, {
                    type: "tree-nested",
                    nodesField: control.nodesField
                });

                // 扁平（array）的形式
            } else {
                $.extend(field, {
                    type: "tree-non-nested",
                    parentField: control.parentField
                });
            }

            if (control.url) {
                field.url = control.url.substr(control.url.lastIndexOf('/') + 1);
            }

            return field;
        },

        // 解析TreeGrid实例的配置信息
        _parseTreeGrid: function (control) {
            var field = {
                idField: control.idField,
                imgField: control.imgField,
                iconField: control.iconField,
                pageIndex: control.pageIndex,
                columns: this._parseColumn(control.columns)
            };
            if (control.getResultAsTree()) {
                $.extend(field, {
                    type: "treegrid-nested",
                    nodesField: control.nodesField
                });
            } else {
                $.extend(field, {
                    type: "treegrid-non-nested",
                    parentField: control.parentField
                });
            }

            if (control.showPager) {
                // 暂时先所有刷新都回到第一页
                if (this.isRefresh) {
                    field.pageIndex = 0;

                }

                // 修改 by liub 2017-11-28 (之前的修改遗漏了)
                // 9.2.8开始系统参数直接从jsboot中返回了，这边不需要做判断了
                // 如果pageSize是服务端配置的，就不需要把pageSize传递给服务端了
                // if(win.isInitPageFinished || control.pageSizeFromServer === false || (control.pageSizeFromServer === undefined && win.mini_attrValue_fromServer === false)) {
                field.pageSize = control.pageSize;
                // }
            } else {
                // 不分页则将pageSize设为-1
                field.pageSize = -1;
            }


            if (control.url) {
                field.url = control.url.substr(control.url.lastIndexOf('/') + 1);
            }

            return field;
        },

        // 解析DataGrid实例的配置信息
        _parseDataDrid: function (control) {
            var field = {
                idField: control.idField,
                pageIndex: control.pageIndex,
                sortField: control.sortField,
                sortOrder: control.sortOrder,
                columns: this._parseColumn(control.getColumns())
            };

            if (control.showPager) {
                // 暂时先所有刷新都回到第一页
                if (this.isRefresh) {
                    field.pageIndex = 0;
                }

                // 如果pageSize是服务端配置的，就不需要把pageSize传递给服务端了
                // if(control.pageSizeFromServer === false || (control.pageSizeFromServer === undefined && win.mini_attrValue_fromServer === false)) {
                field.pageSize = control.pageSize;
                // }
            } else {
                // 不分页则将pageSize设为-1
                field.pageSize = -1;
            }


            if (control.url) {
                field.url = control.url.substr(control.url.lastIndexOf('/') + 1);
            }


            return field;
        },

        _parsePagerTree: function (control) {
            var field = {
                idField: control.idField,
                imgField: control.imgField,
                iconField: control.iconField,
                pageIndex: control.pageIndex,
                pageSize: control.pageSize,
                sortField: control.sortField,
                sortOrder: control.sortOrder,
                columns: this._parseColumn(control.columns)
            };

            if (this.isRefresh) {
                field.pageIndex = 0;
            }

            $.extend(field, {
                type: "pagertree-non-nested",
                parentField: control.parentField
            });

            if (control.url) {
                field.url = control.url.substr(control.url.lastIndexOf('/') + 1);
            }

            return field;
        }

    };

    win.DtoUtils = {
        getCommonDto: function (formId, action, isRefresh, initHook) {
            return new CommonDto(formId, action, isRefresh, initHook);
        },

        // 表格、树二次请求时在beforeload中通过该方法将请求数据组织成通用DTO格式
        // 参数formId为要附加的额外条件的控件所在区域
        // 参数e为beforeload的参数
        processBeforeLoad: function (e, formId) {
            var form, control = e.sender,
                id = control.getId(),
                field, node, isInclude = true;

            // 优化 by liub 217-08-16
            // 优化写法
            // if (formId === undefined) {
            //     form = new CommonDto(control.el);
            //     field = form.getData(true)[id];
            // } else {
            //     form = new CommonDto(formId);
            //     field = form.getField(id);
            // }

            form = new CommonDto(formId || control.el);

            field = form.getData(true)[id];

            // 如果发请求的控件不在form指定的区域里，则手动将其配置信息加入到form中
            if (!field) {
                field = new CommonDto(control.el).getData(true)[id];
                isInclude = false;
            }
            if (field) {
                // 树节点需要把节点上的所有信息都返回给后台
                if (control.type == 'tree' || control.type == 'treeselect' || control.type == 'treelistselect' || (control.type == 'tabstreeselect' && !e.data.activeTab) || control.type == 'filtertree' || (control.type == 'treegrid' && e.async)) {
                    node = e.node;
                    field.node = {};
                    for (var i in node) {
                        // 树节点会有存在后端个性化节点text，带有html标签，需要去除
                        if (i == 'text' && node[i]) {
                            field.node[i] = node[i].replace(/<\/?.+?>/g, "");
                        } else {
                            field.node[i] = node[i];
                        }
                    }

                    // 解决懒加载父子联动情况下加载节点时父子节点选中状态未联动的问题
                    // 加上checkRecursive字段，后台根据此字段来决定返回的子节点是否需要根据父节点来调整checked的值
                    if (control.checkRecursive) {
                        field.checkRecursive = true;
                    }
                } else {
                    if (e.data.pageIndex >= 0) {
                        field.pageIndex = e.data.pageIndex;
                    }
                    if (e.data.pageSize >= 0) {
                        field.pageSize = e.data.pageSize;
                    }
                    if (e.data.sortField !== undefined) {
                        field.sortField = e.data.sortField;
                    }
                    if (e.data.sortOrder !== undefined) {
                        field.sortOrder = e.data.sortOrder;
                    }
                }

                if (e.data.isSecondRequest) {
                    field.isSecondRequest = true;
                }

                if (e.data.search_condition !== undefined) {
                    field.search_condition = e.data.search_condition;
                }

                // pagerTree的展开参数
                if (e.data.__ecconfig) {
                    field.__ecconfig = e.data.__ecconfig;
                }

                if (!isInclude) {
                    form.addField(field);
                }
            }

            // 带上通用隐藏域
            var hidden = mini.get('_common_hidden_viewdata');
            form.addField({
                id: '_common_hidden_viewdata',
                type: 'hidden',
                value: hidden ? hidden.getValue() : ''
            });
            // 将组织好的符合通用DTO格式的数据附加到e.data中
            mini.copyTo(e.data, form.getData());
        },

        // 用于在弹出框中初始化时设置页面控件的值
        // 参数data格式为{name: 'jone', age: 20}，其中name和age对应于页面中的控件的id
        // 弹出框页面中必须有对应的控件
        setData: function (data) {
            var control = null;
            for (var i in data) {
                control = mini.get(i);

                if (control) {
                    control.setValue(data[i]);
                }
            }
        },

        // 用于给弹出框设值的参数的name加上tableName前缀
        // 例如row为{'name': 'jone', 'age': 20}，tableName为'User'，则返回{'User.name':
        // 'jone', 'User.age': 20}
        // 参数row一般为datagrid.getSelected()返回的选中行的数据
        formatData: function (row, tableName) {
            var data = {};
            if (!tableName) {
                return row;
            }

            for (var i in row) {
                data[tableName + '.' + i] = row[i];
            }

            return data;
        },

        addCommonViewData: function (data) {
            data = data || {};

            var hidden = mini.get('_common_hidden_viewdata');

            if (hidden) {
                data['_common_hidden_viewdata'] = {
                    id: '_common_hidden_viewdata',
                    bind: '_common_hidden_viewdata',
                    type: 'hidden',
                    value: hidden.getValue()
                };
            }

            return data;
        },

        // 向有二次请求的控件绑定beforeload事件，添加二次请求标识
        bindBeforeLoad: function (scope) {
            function addExtraData(e) {
                // extraId为控件二次请求时需要一起传回后台的控件id
                var control = e.sender;
                if (control.extraId) {
                    var commonData = mini.decode(e.data.commonDto),
                        extraData = DtoUtils.getCommonDto(control.extraId).getData(true);

                    for (var j in extraData) {
                        if (j !== "_common_hidden_viewdata") {
                            commonData.push(extraData[j]);

                        }
                    }

                    e.data.commonDto = mini.encode(commonData);
                }
            }

            // 页面中存在查询条件，则表格默认按加上查询条件的通用DTO格式
            var conditionForm = $('.fui-condition > .fui-form')[0],
                searchForm = $('.fui-search > .fui-form')[0];
            // 如果有toolbar，则把toolbar中的条件也加上
            var toolbar = $('.fui-toolbar')[0];
            if (toolbar) {
                if (!conditionForm) {
                    conditionForm = toolbar;
                } else {
                    conditionForm = [conditionForm, toolbar];
                }
            }

            if (conditionForm && !mini.isArray(conditionForm)) {
                conditionForm = [conditionForm];
            }
            // 添加高级搜索区域
            if (searchForm) {
                // conditionForm.push(searchForm);
                // 如果即没有 toolbar 也没有 fui-condition 直接push会报错
                if (!conditionForm) {
                    conditionForm = [searchForm];
                } else {
                    conditionForm.push(searchForm);
                }
            }
            // 自行触发请求的控件类型
            var SEC_AJAX_CONTROLS = ['datagrid', 'tree', 'treegrid', 'pagertree', 'autocomplete',
                'textboxlist', 'dataexport', 'tabstreeselect', 'treeselect', 'verifycode', 'filtertree', 'webuploader', 'largefileuploader'
            ];

            // 过滤出有二次请求的控件
            var controls = mini.findControls(function (control) {
                if (scope) {
                    if (!control.el || scope == control || !mini.isAncestor(scope, control.el)) {
                        return false;
                    }
                }
                return (SEC_AJAX_CONTROLS.indexOf(control.type) != -1);
            });

            var urlQuery = win.Util.getSafeLocation().search.substring(1);

            var i, len;
            for (i = 0, len = controls.length; i < len; i++) {
                if (controls[i].type == 'dataexport') {
                    controls[i].on('beforeexport', function (e) {
                        var control = e.sender,
                            extraId = control.getExtraId(),
                            ids = [control.el];
                        if (extraId) {
                            ids.push(extraId);
                        }
                        var form = DtoUtils.getCommonDto(ids);
                        if (form) {
                            // 将额外的属性加到data中
                            var field = form.getField(control.id);

                            mini.copyTo(field, e.data);

                            e.data = form.getData().commonDto;
                        }
                    });
                } else if (controls[i].type == 'webuploader') {
                    // 3个请求都需要加上额外数据
                    controls[i].on('beforemd5file', addExtraData);
                    controls[i].on('uploadbeforesend', addExtraData);
                    controls[i].on('beforemd5filefinished', addExtraData);

                } else if (controls[i].type == 'largefileuploader') {
                    controls[i].on('uploadbeforesend', function (e) {
                        var control = e.sender,
                            ntko = control._ntko;

                        if (control.extraId) {
                            var commonData = mini.decode(e.data.commonDto),
                                extraData = DtoUtils.getCommonDto(control.extraId).getData(true);

                            for (var j in extraData) {
                                if (j !== "_common_hidden_viewdata") {
                                    commonData.push(extraData[j]);

                                }
                            }

                            e.data.commonDto = mini.encode(commonData);

                            // ntok没有提供beforemd5file和beforemd5filefinished事件来添加额外数据，只能通过url来加了
                            // 但是该方式需注意url是有长度限制的，只能携带少量数据
                            ntko.QueryFileStatusURL = control._ntkoQueryFileStatusURL + '&commonDto=' + e.data.commonDto;
                            ntko.FinishedUploadURL = control._ntkoFinishedUploadURL + '&commonDto=' + e.data.commonDto;
                        }

                    });
                } else {
                    controls[i].on('beforeload', function (e) {
                        mini.copyTo(e.data, {
                            isSecondRequest: true
                        });

                        // extraId为控件二次请求时需要一起传回后台的控件id
                        var control = e.sender,
                            condition = ((control.type == 'datagrid' || control.type == 'pagertree' || control.type == 'treegrid') && conditionForm) ? conditionForm.slice(0) : [];
                        if (control.extraId) {
                            condition.push(control.extraId);
                        }

                        // 带上页面url上的条件
                        if (urlQuery && e.url.indexOf('?') == -1) {
                            e.url += ('?' + urlQuery);
                        }
                        DtoUtils.processBeforeLoad(e, condition);
                    });
                }

                if (controls[i].type == 'tabstreeselect' || controls[i].type == 'treeselect') {
                    controls[i].on('beforecheckload', function (e) {
                        var control = e.sender,
                            form = DtoUtils.getCommonDto([control.el]);
                        if (form) {
                            // 将额外的属性加到data中
                            var data = form.getData(true);

                            var controlData = data[control.id];

                            var node = e.data.node;
                            // 把node.text中的html标签去掉
                            // 树在搜索的时候，后端返回的text会把搜索关键字高亮，就会带上html标签
                            // 但是提交的时候时不需要html标签的
                            node.text = node.text.replace(/<[^>]+>/g, "");

                            mini.copyTo(controlData, {
                                node: node,
                                direction: e.data.direction,
                                eventType: e.data.eventType
                            });

                            delete e.data.direction;
                            delete e.data.node;
                            delete e.data.eventType;

                            // 加上搜索条件
                            // 解决在搜索结果中选择父节点后台不知道有搜索而返回所有子节点
                            if (control.filterMode == 'server') {
                                controlData.search_condition = control.tree._filterKey;
                            }

                            mini.copyTo(e.data, {
                                commonDto: mini.encode([controlData, data['_common_hidden_viewdata']], "yyyy-MM-dd HH:mm:ss")
                            });
                        }
                    });
                    controls[i].on('beforesortchanged', function (e) {
                        var control = e.sender,
                            form = DtoUtils.getCommonDto([control.el]);
                        if (form) {
                            // 将额外的属性加到data中
                            var data = form.getData(true);

                            var controlData = data[control.id];

                            mini.copyTo(controlData, {
                                direction: e.data.direction,
                                eventType: e.data.eventType
                            });

                            delete e.data.direction;
                            delete e.data.eventType;
                            delete e.data.value;

                            mini.copyTo(e.data, {
                                commonDto: mini.encode([controlData, data['_common_hidden_viewdata']], "yyyy-MM-dd HH:mm:ss")
                            });
                        }
                    });
                }

                // 二次请求发生错误的处理
                controls[i].on('loaderror', function (ex) {
                    var code = ex.errorCode,
                        data = ex.errorMsg,
                        status;

                    // 用于被安全模块拦截后返回503的处理
                    // 控件内部自己发的ajax请求也需要处理
                    if (code == 503) {
                        data = mini.decode(data);
                        status = data ? data.status : null;
                        if (status && status.text) {
                            mini.showMessageBox({
                                title: "错误提示",
                                buttons: ["ok"],
                                message: status.text,
                                iconCls: "mini-messagebox-error"
                            });
                        }
                    }

                });
            }

        }
    };
}(this, jQuery));

// 向有二次请求的控件绑定beforeload事件，添加二次请求标识
// 二次请求控件有：datagrid、tree、treegrid、autocomplete、textboxlist
(function (win, $) {

    mini.parse();

    DtoUtils.bindBeforeLoad();

}(this, jQuery));