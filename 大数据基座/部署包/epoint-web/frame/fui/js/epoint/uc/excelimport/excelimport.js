mini.ExcelImport = function () {
    mini.ExcelImport.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.ExcelImport, mini.UserControl, {
    // 定义控件的className
    uiCls: "uc-excelimport",
    // 模板的地址，路径默认从webapp开始
    tplUrl: 'frame/fui/js/epoint/uc/excelimport/excelimport.tpl',
    // css文件资源路径
    cssUrl: 'frame/fui/js/epoint/uc/excelimport/excelimport.css',

    mapClass: 'com.epoint.basic.faces.excelimport.ExcelImportView',

    // 初始化方法，将内部需要设值取值的控件缓存到this.controls中
    init: function () {
        this.$content = $('#' + this.id + '-content');
        this.$toolbar = $('#' + this.id + '-toolbar');

        this.$uploaderArea = $('#' + this.id + '-transform-content');
        this.$progressArea = $('.transform-progress-container', $(this.el));
        this.$resultArea = $('.transform-result', $(this.el));
        this.$resultDone = $('.result-done', this.$resultArea);
        this.$resultError = $('.result-error', this.$resultArea);

        this.$resultDoneTips = $('.tips', this.$resultDone);
        this.$resultErrorTipsError = $('.error.tips', this.$resultError);
        this.$resultErrorTipsSuccess = $('.success.tips', this.$resultError);
        this.$resultErrorSummary = $('.result-summary', this.$resultError);
        this.$resultErrorDetial = $('.result-detail', this.$resultError);

        this.uploader = mini.get(this.id + '-uploader');
        this.tabs = mini.get(this.id + '-tabs')
        this.startBtn = mini.get(this.id + '-start-btn');
        this.tplDownloadBtn = mini.get(this.id + '-tpl-download');
        this.errorDownloadBtn = mini.get(this.id + '-download-btn');

        if(this.limitType) {
            this.uploader.setLimitType(this.limitType);
        }
        if(this.mimeTypes) {
            this.uploader.setMimeTypes(this.mimeTypes);
        }
        if(this.action) {
            this.uploader.setAction(this.action);
            this.url = this.uploader.getUploadUrl().replace(window._rootPath, '');
        }
        if(this.mapClass) {
            this.uploader.mapClass = this.mapClass;
            this.uploader.controlData && (this.uploader.controlData.mapClass = this.mapClass);
        }
        
        this.$content.css('height', $(window).height() - this.$toolbar.outerHeight(true));
        this.startBtn.setEnabled(false);

        progressBar.init($('#' + this.id + '-progress-input'));

        this._bindEvent();
        this.syncUploader2Drop();
    },

    _bindEvent: function () {
        var self = this,
            uploader = self.uploader;
        this.startBtn.on('click', function () {
            var webUploader = uploader.getUploader();
            // do really upload
            if (webUploader.getFiles().length) {
                self.startBtn.setEnabled(false);
                self.$toolbar.removeClass('done');
                // 开始模拟进度条
                self.switch2area('progress');
                progressBar.requestDone = false;
                self.mockProgressPromise = progressBar.mockProgress();

                // 开始上传
                webUploader.upload();
            }
        });

        uploader.on('uploadsuccess', function (e) {
            var params = {
                attachGuid: e.ret.controls[0].data.attachGuid,
                commonDto: mini.encode(self.getCommonData())
            };

            params[self.id + '_action'] = 'import';

            // 上传完成 再发请求导入
            Util.ajax({
                url: self.url,
                type: 'POST',
                data: params
            })
            .done(function (res) {
                // 导入完成的情况下标记请求完成 尽快完成进度条
                progressBar.requestDone = true;
                if (res) {
                    res = mini.getSecondRequestData(res);
                    var state = res.state;
                    if (state == 'success') {
                        // 注册完成函数
                        self.mockProgressPromise.then(function () {
                            self.$resultDoneTips.html(res.successInfo);
                            self.$toolbar.addClass('done');
                            self.switch2area('result');
                            self.$resultArea.addClass('done');
                        });
                    } else {
                        // 跳转到错误页面
                        self.mockProgressPromise.then(function () {
                            self.$resultErrorTipsSuccess.html(res.successInfo);
                            self.$resultErrorTipsError.html(res.errorInfo);
                            self.$toolbar.addClass('error');
                            self.switch2area('result');
                            self.$resultArea.addClass('error');
                            self.errorDownloadBtn.setHref(res.errorDownloadUrl);

                            self.$resultErrorDetial.css('height', self.$resultError.height() - self.$resultErrorSummary.height());

                            var tabs = res.tabs,
                                item,
                                tab,
                                tabBodyEl,
                                grid,
                                i = 0,
                                l = tabs.length;

                            for(; i < l; i++) {
                                item = tabs[i];
                                tab = self.tabs.addTab({
                                    title: item.title + "（" + item.grid.total + "）"
                                });
                                tabBodyEl = self.tabs.getTabBodyEl(tab);

                                grid = new mini.DataGrid();
                                grid.set({
                                    columns: item.grid.columns,
                                    data: item.grid.data,
                                    totalCount: item.grid.total,
                                    height: "100%",
                                    autoLoad: false
                                });

                                grid.setUrl(Util.getRightUrl(self.url));
                                grid.render(tabBodyEl);

                                grid.on('beforeload', function(event) {
                                    event.data.tabIndex = self.tabs.activeIndex;
                                    event.data.commonDto = params.commonDto;
                                    event.data.attachGuid = params.attachGuid;
                                    event.data[self.id + '_action'] = 'errorList';
                                });

                            }

                            self.tabs.activeTab(0);

                        });
                    }
                }
            })
            .fail(function () {
                progressBar.requestDone = true;
                progressBar.cancel();
                // 请求出错
                self.$toolbar.addClass('done');
                self.switch2area('result');
                self.$resultArea.addClass('error');
            });
        });

        uploader.on('uploaderror', function(e) {
            progressBar.requestDone = true;
            progressBar.cancel();
            // 切换到出错
            self.switch2area('result');
            self.$resultArea.addClass('error');
        });
    },
    switch2area: function (type) {
        this.$uploaderArea.addClass('hidden-accessible');
        this.$progressArea.addClass('hidden-accessible');
        this.$resultArea.addClass('hidden-accessible');
        if (type == 'uploader') {
            this.$uploaderArea.removeClass('hidden-accessible');
        } else if (type == 'progress') {
            this.$progressArea.removeClass('hidden-accessible');
        } else if (type == 'result') {
            this.$resultArea.removeClass('hidden-accessible error done');
        }
    },
    syncUploader2Drop: function () {
        var uploader = this.uploader,
            el = this.$uploaderArea,
            self = this;
        uploader.getUploaderPromise(function () {
            var $drop = $(el).find('.transform-drop-container');
            var $file = $(el).find('.transform-file-container');
            if (!$drop.length) {
                window.console && window.console.error && console.error('无法获取区域');
                return;
            }
            // 从控件上拿扩展名
            var limitTypes = uploader
                .getLimitType()
                .split(',')
                .map(function (item) {
                    return '.' + item;
                })
                .join('或');
            $drop.find('.uploader-ext-info').text(limitTypes).attr('title', limitTypes);

            // 关联拖拽区域点击触发上传
            addBtnForUploader(uploader.id, $drop[0]);

            // 加入文件 时 拼接文件模板占位
            uploader.on('filesQueued', function (e) {
                var file = e.files[0];
                if (!file) return;
                var fileHtml = ['<span class="file-icon file-icon-', file.ext || '', '"></span>', '<span class="file-name">', file.name, '</span>'].join('');

                $file.html(fileHtml).show();
                $drop.addClass('showFile').css('z-index', Util.getZIndex());
                // 有文件时启用按钮
                self.startBtn.setEnabled(true);
            });
            // 文件加入前 如果之前有文件 先reset控件：cause 防止单次多个拖入，上传控件本身为单选，此处选择新的则替换旧的文件
            uploader.on('beforeFileQueued', function (e) {
                var oldFiles = uploader._uploader.getFiles();
                if (!oldFiles || !oldFiles.length) {
                    return;
                }
                if (e.file) {
                    uploader._uploader.reset();
                }
            });
            $drop.on('click', '.file-remove', function () {
                mini.confirm('确定移除此文件', '系统提醒', function (a) {
                    if (a == 'ok') {
                        resetUploader();
                    }
                });
            });

            function resetUploader() {
                uploader.clearFile();
                $file.empty().hide();
                $drop.removeClass('showFile');

                // 文件移除 按钮重新禁用
                self.startBtn.setEnabled(false);
            }
        });

        var addUploaderBtnTimer;

        function addBtnForUploader(uid, el) {
            var u = mini.get(uid).getUploader();

            if (u) {
                u.addButton({
                    id: el
                });
                clearTimeout(addUploaderBtnTimer);
            } else {
                addUploaderBtnTimer = setTimeout(function () {
                    addBtnForUploader(uid, el);
                }, 50);
            }
        }
    },
    // 设置模板数据。默认为：this.tplData = {controlId: this.id};
    // 如需自定义，只需修改this.tplData的值
    setTplData: function () {
        mini.ExcelImport.superclass.setTplData.call(this);
    },

    // 设置内部控件的值以及一些根据后台返回数据来控制显隐等操作
    // commonDto中初始化时会调用
    // 具体的数据结构根据控件自己的特点来确定
    // 本控件的数据结构如excelimport.json
    // 该方法在mini.UserControl中已定义，没有特殊需求，一般不需要再定义
    setData: function (data) {
        mini.ExcelImport.superclass.setData.call(this, data);

        data.tplDownloadUrl && this.tplDownloadBtn.setHref(data.tplDownloadUrl);
    },

    // 返回控件的数据
    // commonDto中表单提交 时会调用
    // 具体的数据结构根据控件自己的特点来确定
    // 该方法在mini.UserControl中已定义，没有特殊需求，一般不需要再定义
    getValue: function () {
        var data = mini.ExcelImport.superclass.getValue.call(this);

        return data;
    },
    getCommonData: function () {
        if (!this.controlData) {
            this.controlData = {
                id: this.id,
                type: "excelimport",
                mapClass: this.mapClass,
                action: this.action,
                dataOptions: this['data-options']
            };
        }
        return [this.controlData, this.getViewdata()];
    },
    getViewdata: function () {
        var hidden = mini.get('_common_hidden_viewdata');

        if (!this.viewData) {
            this.viewData = {
                id: '_common_hidden_viewdata',
                type: 'hidden',
                value: ''
            };
        }

        if (hidden) {
            this.viewData.value = hidden.getValue();
        }

        return this.viewData;
    },

    getAttrs: function (el) {
        var attrs = mini.ExcelImport.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs, ['uploadUrl', 'limitType', 'mimeTypes']);
        return attrs;
    }
});

mini.regClass(mini.ExcelImport, "excelimport");

// 环形进度条 + 模拟进度
(function () {
    var progressBar = {
        init: function (el) {
            this.$el = el ? $(el) : $('#progress-input');
            this.$curr = $('.transform-progress-curr');
            var that = this;
            this.$el.val(0).knob({
                min: 0,
                max: 100,
                fgColor: '#2590eb', // 填充色
                bgColor: '#f6f6f6', // 背景色
                width: 70, // 宽
                height: 70, // 高
                thickness: 0.22, // 填充色宽度占比
                lineCap: 'round', // 开启圆角
                displayInput: false, // 隐藏自带的输入框
                // rotation: 'anticlockwise', // 开启逆时针
                readOnly: true, // 只读
                angleOffset: 0, // 偏移角度
                // change: function(value) {
                // console.log(value);
                // },
                release: function (value) {
                    // console.log(value);
                    that.$curr.text(value + '%');
                }
            });
        },
        setValue: function (v) {
            if (v > 100) {
                v = 100;
            }
            this.$el.val(v).trigger('change');
        },
        // 模拟的基础时间
        baseTime: 1000 * 5,
        // 1s 的帧数
        secondFrames: 60,
        // 每一帧 进度条移动的速度
        getBaseV: function () {
            var s = 100;
            var t = this.baseTime;
            var v = (s / t) * ((1000 / this.secondFrames) >> 0);

            return v;
        },
        getValue: function () {
            return parseInt(this.$el.val());
        },

        // 请求完成的状态
        // 请求如果完成，且进度低于 50 则加速模拟
        // 请求如果未完成， 且进度大于 50 则减速
        requestDone: false,
        timer: null,

        // 模拟进度移动
        mockProgress: function (cb) {
            var v = this.getBaseV();
            var p = 0;
            var that = this;
            that.requestDone = false;

            var step = (1000 / this.secondFrames) >> 0;
            var isSpeedUp = false;
            go();
            
            // 减速检查点
            var checkPoint = 70;
            // 减速次数
            var speedDownTimes = 0;

            var dtd = $.Deferred();

            return dtd.promise();

            function go() {
                clearTimeout(that.timer);
                p += v * 1;

                if(p > 99 && !that.requestDone) {
                    p = 99;
                }

                that.setValue(p);

                // 请求完成 进度仍小于 50 则速度加倍
                // 加速简单只考虑一次
                if (!isSpeedUp && that.requestDone) {
                    if (p <= 50) {
                        v = 10 * v;
                        isSpeedUp = true;
                    } else if (p <= 70) {
                        v = 5 * v;
                        isSpeedUp = true;
                    }
                }

                if (!that.requestDone) {
                    handleSpeedDown(p);
                }

                if (p < 100) {
                    that.timer = setTimeout(go, step);
                } else {
                    that.setValue(100);
                    setTimeout(function () {
                        if (typeof cb == 'function') {
                            cb();
                        }
                        dtd.resolve();
                    });
                }
            }


            function handleSpeedDown(p) {
                // 进度已经大于检查点 情况下减速
                if (p > checkPoint && speedDownTimes < 5) {
                    // 速度减半 检查点下移 限制最多减速五次
                    v = v / 2;
                    checkPoint = ((checkPoint + 100) / 2) >> 0;
                    speedDownTimes++;
                    // console.log('down', p, v, checkPoint);
                }
            }
        },
        cancel: function () {
            clearTimeout(this.timer);
        }
    };
    window.progressBar = progressBar;
})();