/**
 * 自定义控件 uc-oauploader 内部直接使用封装好的mini-webuploader，重新实现了一套UI界面。
 * author：chends
 * date：2017-03-29 10:59:26
 * lastModified 2018-01-28
 */

mini.OAUploader = function () {
    mini.OAUploader.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.OAUploader, mini.UserControl, {
    // 定义控件的className
    uiCls: 'uc-oauploader',
    // 模板的地址，路径默认从webapp开始
    tplUrl: 'frame/fui/js/epoint/uc/oauploader/oauploader.tpl',
    // css文件资源路径
    cssUrl: 'frame/fui/js/epoint/uc/oauploader/oauploader.css',
    // 自定义控件对应后台控件模型类的全名（包名+类名）
    mapClass: 'com.epoint.basic.faces.fileupload.WebUploader',

    uploadUrl: '',
    // 允许的文件后缀，不带点，多个用逗号分割
    limitType: window.EpFrameSysParams ? EpFrameSysParams['file_limit_type'] : '',
    mimeTypes: '',
    auto: true,
    fileNumLimit: undefined,
    fileSizeLimit: window.EpFrameSysParams ? EpFrameSysParams['file_limit_size'] : undefined,
    fileSingleSizeLimit: undefined,
    chunked: false,
    chunkSize: 5120,
    chunkRetry: 2,
    // duplicate {Boolean} [可选] [默认值：undefined] 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
    duplicate: undefined,

    needMD5: false,

    // 压缩
    compress: false,

    pickerText: '选择文件',
    startText: '开始上传',
    pauseText: '暂停上传',

    // 自身属性
    // 编辑地址
    _editUrl: '',
    // 可编辑文件的扩展名 不带. 多个以逗号分隔
    _editSupportExt: '',
    // 预览地址
    _previewUrl: window.EpFrameSysParams ? EpFrameSysParams['upload_preview_url'] : '',
    _previewExt: window.EpFrameSysParams ? EpFrameSysParams['upload_preview_text'] : '',
    // 展示为文件列表
    _showAsFileList: false,
    // 小状态
    _minSize: false,
    minSizeCls: 'min-size',
    // 是否启用附件排序
    _enableSort: false,
    // 文件列表中条目的宽度
    _fileItemWidth: null,

    // 显示保密等级
    showSecrecyLevel: false,

    // 记录属性设给内部control
    _props: {},

    setTplData: function () {
        this.tplData = {
            controlId: this.id,
            showSplit: this._showSplit,
            menu: this.menu
        };
    },
    set: function (kv) {
        if (typeof kv == 'string') {
            return this;
        }

        // id editurl editext previewUrl menu是自身的
        kv.id && this.setId(kv.id);
        kv.editurl && (this._editUrl = kv.editurl);
        kv.editext && (this._editSupportExt = kv.editext.toLowerCase());

        // 预览地址和扩展名
        kv.previewurl && (this._previewUrl = kv.previewurl);
        kv.previewext && (this._previewExt = kv.previewext.toLowerCase());
        // 展示为文件列表
        kv.showAsFileList && (this._showAsFileList = kv.showAsFileList);

        // 有下拉菜单
        if (kv.menu && jQuery(kv.menu).length) {
            this._showSplit = true;
            this.menu = kv.menu;
        }
        // 是否显示为小状态
        this._minSize = kv.minSize ? true : false;

        // 启用排序
        this._enableSort = kv.enableSort ? true : false;

        // 文件列表宽度
        this._fileItemWidth = kv.fileItemWidth;

        delete kv.id;
        delete kv.editurl;
        delete kv.editext;
        delete kv.previewurl;
        delete kv.previewext;
        delete kv.menu;
        delete kv.showAsFileList;
        delete kv.minSize;
        delete kv.enableSort;
        delete kv.fileItemWidth;

        // 记录属性 设置给内部控件
        // this._props = kv;
        // 除了个性化在控件配置的 也需要带入 OAUploader 这个类上的 统一设置给上传控件实例
        this._props = $.extend({
            limitType: this.limitType,
            mimeTypes: this.mimeTypes,
            auto: this.auto,
            fileNumLimit: this.fileNumLimit,
            fileSizeLimit: this.fileSizeLimit,
            fileSingleSizeLimit: this.fileSingleSizeLimit,
            chunked: this.chunked,
            chunkSize: this.chunkSize,
            chunkRetry: this.chunkRetry,
            duplicate: this.duplicate,
            needMD5: this.needMD5,
            compress: this.compress,
            pickerText: this.pickerText,
            startText: this.startText,
            pauseText: this.pauseText,
            showSecrecyLevel: this.showSecrecyLevel
        }, kv);

        mini.OAUploader.superclass.set.call(this, kv);

        return this;
    },
    init: function () {
        var self = this;

        this._mWebUploader = mini.get(this.id + '-inner');
        // 先隐藏按钮
        // this._mWebUploader.el.style.visibility = 'hidden';
        this.action && this._mWebUploader.setAction(this.action);

        var arr = this.action.split('.');
        var url = arr[0] + '.action?cmd=' + arr[1];
        this._mWebUploader.setUploadUrl(url);

        var $fileList = $(self._mWebUploader.getFileList());
        this._$fileList = $fileList;

        // 小状态
        $fileList[this._minSize ? 'addClass' : 'removeClass'](this.minSizeCls);

        // 加载右侧下拉菜单
        if (this._showSplit) {
            this._splitBtn = new mini.MenuButton();
            this._splitBtn.setMenu(this.menu);
            this._splitBtn.render(jQuery(this.el).find('.mini-btn-pick')[0], 'after');
        }
        // 下拉按钮渲染完成后再显示按钮
        // this._mWebUploader.el.style.visibility = 'visible';

        // 处理是否显示为文件列表
        if (this._showAsFileList) {
            this.setShowAsFileList(this._showAsFileList);
        }
        // 启用排序支持
        this._initSort();
        // 相关属性写入内部控件
        for (var key in this._props) {
            if (key.toLowerCase().indexOf('on') == 0) {
                if (this['_$' + key]) {
                    continue;
                }
                var fn = this._props[key];

                this._mWebUploader.on(key.substring(2, key.length).toLowerCase(), fn);

                delete this._props[key];
            } else {
                var v = this._props[key];

                if (key.toLocaleLowerCase() == 'id') {
                    continue;
                }
                var n = 'set' + key.charAt(0).toUpperCase() + key.substring(1, key.length);
                var setter = this._mWebUploader[n];

                if (setter) {
                    setter.call(this._mWebUploader, v);
                } else {
                    this._mWebUploader[key] = v;
                }
            }
        }

        // 文件加入
        this._mWebUploader.on('filesQueued', function (e) {
            var files = e.files;

            var html = [],
                item = '';
            for (var i = 0, l = files.length; i < l; ++i) {

                item = self._renderFileItem(files[i]);
                html.push(item);
            }
            $(html.join('')).appendTo($fileList);
        });

        // 开始上传
        this._mWebUploader.on('uploadStart', function (e) {
            var file = e.file,
                li = mini.byId(file.id);
            var $progressbar = $('.mini-uploader-progressbar', li);
            $progressbar.show();
            // 隐藏编辑和预览按钮
            $(li).find('.edit-file').add('.preview-file').hide();
        });

        // 上传中 显示进度条
        this._mWebUploader.on('uploadProgress', function (e) {
            var file = e.file,
                percentage = e.percentage,
                li = mini.byId(file.id),
                $progressbar = jQuery('.mini-uploader-progressbar', li),
                $progresstext = jQuery('.progress-text', $progressbar),
                $progressbody = jQuery('.progress-body', $progressbar),
                width = Math.round(percentage * 100) + '%';

            $progresstext.text(width);
            $progressbody.width(width);
        });

        // 上传成功隐藏进度条 显示编辑和预览按钮
        this._mWebUploader.on('uploadSuccess', function (e) {
            var file = e.file,
                $item = jQuery('#' + file.id);

            $item.find('.mini-uploader-error').html('').hide();
            $item.find('.mini-uploader-progressbar').fadeOut(function () {
                $item.find('.edit-file').add('.preview-file').add('.secrecy-level').show();

            });
        });

        // 上传出错 提示
        this._mWebUploader.on('uploadError', function (e) {
            var file = e.file;
            jQuery('#' + file.id).find('.mini-uploader-error').html('上传出错!<a href="#" class="mini-uploader-retry" fileId="' +
                file.id + '">重试</a>').show();
        });

        // 上传完成，隐藏进度条 显示编辑和预览按钮
        this._mWebUploader.on('uploadComplete', function (e) {
            var $item = jQuery('#' + e.file.id);
            $item.find('.mini-uploader-progressbar').fadeOut(function () {
                $item.find('.edit-file').add('.preview-file').show();
            });
        });

        // 服务器端成功接收文件后，把服务端返回的fileId设置到对应的dom上。并设置下载url
        this._mWebUploader.on('uploadAccept', function (e) {
            var file = e.object.file,
                fileGuid = e.ret.attachGuid,
                preparams = e.ret.preparams || e.ret.downloadUrl,
                // 扩展名
                ext = '',
                // 最后的.索引
                lastIndexPoint = file.name.lastIndexOf('.');

            if (lastIndexPoint !== -1) {
                ext = file.name.substr(lastIndexPoint + 1).toLowerCase();
            }

            if (fileGuid) {
                // id
                var $fileItem = jQuery('#' + file.id).attr('fileGuid', fileGuid);
                // download url
                $fileItem.find('a').attr('href', Util.getRootPath() + e.ret.downloadUrl);
                // 显示下载
                $fileItem.find('.download-file').removeClass('hidden');
                // 设置预览参数
                if (self._previewUrl && ext && (self._previewExt.indexOf(ext) != -1) && preparams) {
                    $fileItem.find('.preview-file').data('preparams', preparams).removeClass('hidden');
                }
            }

        });

        $fileList
            .on('click', '.file-item', function (e) {

                self.fire('fileitemclick', {
                    source: self,
                    sender: self,
                    el: this,
                    target: e.target
                });
            })
            // 點擊下載
            .on('click', '.download-file', function () {
                // 無法直接觸發a標籤的href，因此獲取到進行跳轉
                window.open($(this).closest('.file-item').find('.file-name').attr('href'));
            })
            // 删除文件
            .on('click', '.delete-file', function (e) {
                e.stopPropagation();
                var $this = $(this),
                    $file = $this.closest('.file-item'),
                    fileId = $file.attr('id'),
                    fileGuid = $file.attr('fileguid');
                mini.confirm('确定移除这个文件吗？', '删除文件', function (action) {
                    if (action == 'ok') {
                        self.removeFile({
                            id: fileId,
                            guid: fileGuid
                        }, true);
                    }
                });
            })
            // 失败重新上传
            .on('click', '.mini-uploader-retry', function (e) {
                e.stopPropagation();

                var fileId = jQuery(this).attr('fileId');

                // 重新上传
                self._mWebUploader.retry(fileId);
            })
            // 文件编辑
            .on('click', '.edit-file', function (e) {
                e.stopPropagation();

                if (!self._editUrl) {
                    return;
                }

                var $this = $(this),
                    $file = $this.closest('.file-item'),
                    id = $file.attr('fileGuid');

                if (!id) {

                    mini.alert('文件还未上传，不能编辑！');

                    return;
                }
                // var editurl = self.getEditurl() + id;
                var editurl = Util.getRootPath() + self._editUrl;

                if (self._editUrl.indexOf('attachGuid=') != -1) {
                    editurl += id;
                } else {
                    editurl += (self._editUrl.indexOf('?') != -1 ? '&' : '?') +
                        'attachGuid=' + id;
                }

                epoint.openTopDialog('文件编辑', editurl);

            })
            // 文件预览
            .on('click', '.preview-file', function (e) {
                e.stopPropagation();

                if (!self._previewUrl) {
                    return;
                }

                var $this = $(this),
                    param = $this.data('preparams');

                if (!param) {
                    mini.alert('此文件不能预览！');

                    return;
                }

                var $file = $this.closest('.file-item'),
                    fileName = $file.find('.file-name').text(),
                    fileGuid = $file.attr('fileGuid'),
                    url = self._previewUrl;

                // 新加入一个参数 格式为 fname=文件guid + 文件扩展名
                if (fileGuid) {
                    var lidx = fileName.lastIndexOf('.');
                    // 文件不带扩展名则不拼接
                    url += '?fname=' + fileGuid + (lidx == -1 ? '' : fileName.substr(lidx));
                }

                url += (fileGuid ? '&' : '?') + param;

                epoint.openTopDialog('文件预览', url);

            });
    },
    _isBindSecrecyEvent: false,
    _bindSecrecyEvents: function () {
        var self = this;
        if (this.showSecrecyLevel && !this._isBindSecrecyEvent) {
            this._$fileList.on('click', '.secrecy-level', function () {
                // 只读情况下不允许编辑密级
                if (self._showAsFileList || !self.secrecyLevelEditable) {
                    return;
                }

                var $this = jQuery(this),
                    $file = $this.closest('.file-item'),
                    fileGuid = $file.attr('fileGuid');

                self._mWebUploader.showSecrecyLevelList($this, fileGuid);
            });

            jQuery('body').on('mousedown.secrecyLevelList' + this.uid, function (e) {
                if (!$(e.target).hasClass('secrecy-level') && !$(e.target).closest('.mini-secrecylevel-list').length) {
                    self._mWebUploader.hideSecrecyLevelList();
                }
            });

            // 页面滚动时，隐藏密级列表，避免其位置不对
            jQuery(document).on('mousewheel', function () {
                self._mWebUploader.hideSecrecyLevelList();
            });

            this._isBindSecrecyEvent = true;
        }
    },
    _initSort: function () {
        var that = this;
        // 创建按钮并绑定事件
        this._enterSortBtn = new mini.Button();
        this._saveSortBtn = new mini.Button();
        this._cancelSortBtn = new mini.Button();
        this._enterSortBtn.setText('开始排序');
        this._saveSortBtn.setText('保存排序');
        this._saveSortBtn.setVisible(false);
        this._cancelSortBtn.setText('撤销');
        this._cancelSortBtn.setVisible(false);

        // 记录初始顺序
        var initSort;
        // 进入排序
        this._enterSortBtn.on('click', function (e) {
            e.sender.setVisible(false);
            that._cancelSortBtn.setVisible(true);
            that._saveSortBtn.setVisible(true);
            // console.log('初始位置为：');
            initSort = that._$fileList.sortable('toArray', {
                attribute: 'id'
            });
            // console.log(initSort);
            start(that._$fileList);
        });
        // 保存排序
        this._saveSortBtn.on('click', function () {
            that._enterSortBtn.setVisible(true);
            that._cancelSortBtn.setVisible(false);
            that._saveSortBtn.setVisible(false);

            end(that._$fileList);

            var newSort = that._$fileList.sortable('toArray', {
                attribute: 'fileguid'
            });
            console.log(newSort);


            var data = {
                commonDto: mini.encode(that._mWebUploader.getCommonData())
            };
            data[that._mWebUploader.id + "_action"] = 'saveSort';
            data.sort = newSort;
            // 发请求保存排序
            $.ajax(that._mWebUploader.uploadUrl, {
                dataType: 'json',
                data: data,
                type: 'post',
                success: function (response) {
                    response = mini.getSecondRequestData(response);

                    if (!(response.result && response.result.success)) {
                        resetSort(initSort, that._$fileList);
                        mini.showTips({
                            content: "排序保存失败！请重试",
                            state: 'danger',
                            y: 'center'
                        });
                    }

                    initSort = null;
                }
            });
        });
        // 取消排序
        this._cancelSortBtn.on('click', function () {
            that._enterSortBtn.setVisible(true);
            that._cancelSortBtn.setVisible(false);
            that._saveSortBtn.setVisible(false);

            end(that._$fileList);
            // 取消排序时 恢复默认顺序
            if (initSort) {
                resetSort(initSort, that._$fileList);
            }
        });

        if (!this._enableSort) {
            this._enterSortBtn.setVisible(false);
        }

        this._enterSortBtn.render(this._mWebUploader._buttons, 'append');
        this._saveSortBtn.render(this._mWebUploader._buttons, 'append');
        this._cancelSortBtn.render(this._mWebUploader._buttons, 'append');

        // 初始化排序
        this._$fileList.sortable({
            revert: true,
            'disabled': true
        });

        // 开始拖拽排序
        function start($fileList) {
            $fileList.addClass('in-sort').sortable('enable');
        }
        // 结束拖拽排序
        function end($fileList) {
            $fileList.removeClass('in-sort')
                .sortable('disable');
        }
        // 重置排序位置
        function resetSort(sorts, $fileList) {
            var child;

            for (var i = 0, l = $fileList.children().length; i < l; ++i) {
                child = $fileList.children()[i];
                if (sorts[i] != child.id) {
                    $fileList.find('#' + sorts[i]).insertBefore(child);
                }
            }
            child = null;
        }

    },
    _afterApply: function () {
        mini.OAUploader.superclass._afterApply.call(this);

        // 派发内部事件触发当前控件
        this._mWebUploader.on('beforefilequeued', this.__OnBeforeFileQueued, this);
        this._mWebUploader.on('filesqueued', this.__OnFilesQueued, this);
        this._mWebUploader.on('filedequeued', this.__OnfileDequeued, this);
        this._mWebUploader.on('startupload', this.__OnStartUpload, this);
        this._mWebUploader.on('stopupload', this.__OnStopUpload, this);
        this._mWebUploader.on('uploadfinished', this.__OnUploadFinished, this);
        this._mWebUploader.on('uploadstart', this.__OnUploadStart, this);
        this._mWebUploader.on('uploadbeforesend', this.__OnUploadBeforeSend, this);
        this._mWebUploader.on('uploadaccept', this.__OnUploadAccept, this);
        this._mWebUploader.on('uploadprogress', this.__OnUploadProgress, this);
        this._mWebUploader.on('uploadsuccess', this.__OnUploadSuccess, this);
        this._mWebUploader.on('uploaderror', this.__OnUploadError, this);
        this._mWebUploader.on('uploadcomplete', this.__OnUploadComplete, this);
        this._mWebUploader.on('beforemd5file', this.__OnBeforeMD5File, this);
        this._mWebUploader.on('beforemd5filefinished', this._OnBeforeMd5FileFinished, this);
        this._mWebUploader.on('finishedmd5file', this.__OnFinishedMD5File, this);
        this._mWebUploader.on('filesuccess', this.__OnFileSuccess, this);
        this._mWebUploader.on('fileremovesuccess', this.__OnFileRemoveSuccess, this);
        this._mWebUploader.on('reset', this.__OnReset, this);
        this._mWebUploader.on('secrecylevelchanged', this.__OnSecrecyLevelChanged, this);
        // this._mWebUploader.on('fileremove', this.__Onfileremove, this);
    },
    setAction: function (action) {
        this.action = action;

        // this.controlData = {
        //     id: this.id,
        //     type: "webuploader",
        //     mapClass: this.mapClass,
        //     action: this.action,
        //     showDefaultUI: this.showDefaultUI
        // };

        var arr = action.split('.');
        var url = arr[0] + '.action?cmd=' + arr[1];

        // this.setUploadUrl(url);
        if (this._mWebUploader) {
            this._mWebUploader.setAction(action);
            this._mWebUploader.setUploadUrl(url);
        }

    },

    // 获取内部的mini-uploader控件
    getInnerUploader: function () {
        return this._mWebUploader;
    },
    removeFile: function (file, clearServer) {
        // 调用内部mini-uploader控件removeFile方法
        this._mWebUploader.removeFile(file, clearServer);

        var fileId = file.id || file;
        this._$fileList.find('#' + fileId).remove();
    },
    setData: function (data) {
        this._mWebUploader.setData(data);
        // this.serverFileNum = data.length;
        // this.setFileNumLimit(this.fileNumLimit);

        if (this._mWebUploader.showSecrecyLevel) {
            this.showSecrecyLevel = true;

            this._bindSecrecyEvents();
        }

        data = data.files || data;
        // 渲染文件列表
        var html = [],
            item = '';
        for (var i = 0, l = data.length; i < l; i++) {
            item = this._renderFileItem({
                id: data[i].attachGuid,
                name: data[i].attachFileName,
                ext: data[i].attachFileName.substr(data[i].attachFileName.lastIndexOf('.') + 1),
                size: data[i].attachLength,
                fileGuid: data[i].attachGuid,
                downloadUrl: data[i].downloadUrl,
                // 预览参数值
                preparams: data[i].preparams || data[i].downloadUrl,
                hideDelete: data[i].readonly,
                secrecyLevel: data[i].secrecyLevel,
                success: true
            });
            html.push(item);
        }

        $(html.join('')).appendTo(this._$fileList.empty());

        this.fire('load', {
            sender: this,
            eventType: 'load',
            data: data
        });


    },
    __OnBeforeFileQueued: function (e) {
        this.fire('beforefilequeued', e);
    },
    __OnFilesQueued: function (e) {
        this.fire('filesqueued', e);
    },
    // 当文件被移除队列后触发
    __OnfileDequeued: function (e) {
        this.fire('filedequeued', e);
    },
    // 当开始上传流程时触发
    __OnStartUpload: function () {
        this.fire('startupload');
    },
    // 当上传流程暂停时触发
    __OnStopUpload: function () {
        this.fire('stopupload');
    },
    // 当所有文件上传结束时触发
    __OnUploadFinished: function () {
        this.fire('uploadfinished');
    },
    // 某个文件开始上传前触发
    __OnUploadStart: function (file) {
        this.fire('uploadstart', {
            file: file
        });
    },
    __OnUploadBeforeSend: function (e) {
        this.fire('uploadbeforesend', e);
    },
    // 当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为false, 则此文件将派送server类型的uploadError事件。
    __OnUploadAccept: function (e) {
        this.fire('uploadaccept', e);
    },
    __OnUploadProgress: function (e) {
        this.fire('uploadprogress', e);
    },
    __OnUploadSuccess: function (e) {
        this.fire('uploadsuccess', e);
    },
    __OnUploadError: function (e) {
        this.fire('uploaderror', e);
    },
    __OnUploadComplete: function (e) {
        this.fire('uploadcomplete', e);
    },
    __OnBeforeMD5File: function (e) {
        this.fire('beforemd5file', e);
    },
    _OnBeforeMd5FileFinished: function (e) {
        this.fire('beforemd5filefinished', e);
    },
    __OnFinishedMD5File: function (e) {
        this.fire('finishedmd5file', e);
    },
    __onFileSuccess: function (e) {
        this.fire('filesuccess', e);
    },
    __OnFileRemoveSuccess: function (e) {
        this.fire('fileremovesuccess', e);
    },
    __OnReset: function () {
        this.fire('reset');
    },

    __OnSecrecyLevelChanged: function (e) {
        this.fire('secrecylevelchanged', e);
    },

    getValue: function () {
        return this.value;
    },
    // 渲染文件列表
    _renderFileItem: function (item) {

        var it = [],
            link = '',
            html = '',
            ext = (item.ext || '').toLowerCase();
        var style = this._fileItemWidth ? ('style="width:' + this._fileItemWidth + '"') : '';

        it.push('<div class="file-item"' + style + ' id="' + item.id + '" title="' + item.name + '" fileext="' + ext + '" ');

        if (item.fileGuid) {
            it.push('fileGuid="' + item.fileGuid + '">');
        } else {
            it.push('>');
        }

        it.push('<b class="file-type common ' + this._typeToTypecls(ext) + '"></b>');

        // 处理下载链接
        // link = item.downloadUrl ? _rootPath + '/' + item.downloadUrl : 'javascript:void(0);';
        if (item.downloadUrl) {
            link = _rootPath + '/' + (
                item.downloadUrl.indexOf('attachGuid') != -1 ?
                // 已经有attachGuid了 就不处理
                item.downloadUrl :
                // 没有attachGuid 根据是否有？ 拼接上 '&' 或 '?' + 'attachGuid=' + item.fileGuid
                (item.downloadUrl + (item.downloadUrl.indexOf('?') != -1 ? '&' : '?') + 'attachGuid=' + item.fileGuid)
            );
        } else {
            link = 'javascript:void(0);';
        }

        it.push('<p class="file-info"><a class="file-name" href="' + link + '" target="_blank" download="' + item.name + '">' + item.name + '</a><span class="file-size">(' + this._getAttachLength(item.size) + ')</span></p>');
        it.push('<div class="file-func clearfix">');

        // 处理是否显示编辑按钮 非文件列表 有编辑地址且后缀在列表中
        link = (this._editUrl && (this._editSupportExt.indexOf(ext) != -1)) ? '' : ' hidden';

        it.push('<span class="edit-file ' + link + '">编辑</span>');

        // 处理预览 有地址、可预览并且后端返回了参宿才能预览 后端始终会返回 预览参数值 preparams 
        link = (this._previewUrl && (this._previewExt.indexOf(ext) != -1) && item.preparams) ? '' : ' hidden';
        it.push('<span class="preview-file ' + link + '" data-preparams="' + (item.preparams ? item.preparams : '') + '">预览</span>');

        // item.hideDelete = data[i].readonly 只读则不能删除
        if (!item.hideDelete) {
            it.push('<span class="delete-file ">删除</span>');
        }

        // 加一个下载按钮
        link = item.downloadUrl ? '' : 'hidden';
        it.push('<span class="download-file ' + link + '">下载</span>');

        if (this.showSecrecyLevel) {
            // 添加附件密级设置
            var secrecyLevel = item.secrecyLevel === undefined ? this._mWebUploader.defaultSecrecyLevel : item.secrecyLevel,
                secrecyLevelText = (function (secrecyLevelItems) {
                    for (var i = 0, l = secrecyLevelItems.length; i < l; i++) {
                        if (secrecyLevelItems[i].id === secrecyLevel) {
                            return secrecyLevelItems[i].text;
                        }
                    }
                    return '';
                })(this._mWebUploader.secrecyLevelItems);

            it.push('<span class="secrecy-level" ' + (item.success ? 'style="display:inline;"' : '') + ' guid="' + secrecyLevel + '">' + secrecyLevelText + '</span>');
        }

        it.push('<span class="mini-uploader-error"></span><span class="mini-uploader-progressbar" style="display: none;"><span class="progress-text">0%</span><div class="progress-body"></div></span></div></div>');

        html = it.join('');

        // 如果指定了指定了自定义渲染的 则触发
        if (!this._events['filerender']) {
            return html;
        } else {
            var event = {
                sender: this,
                eventType: 'filerender',
                html: html,
                fileData: item
            };
            this.fire('filerender', event);
            return event.html;
        }
    },


    // 根据文件后缀生成相应的图标css class名称。
    _typeToTypecls: function (type) {
        return type.charAt(0) === '.' ? type.substring(1) : type.toLowerCase();

        // var filecls;

        // if (type.charAt(0) === ".") {
        //     type = type.substring(1);
        // }

        // switch (type) {
        //     case "doc":
        //     case "docx":
        //         filecls = "doc";
        //         break;
        //     case "xls":
        //     case "xlsx":
        //         filecls = "xls";
        //         break;
        //     case "ppt":
        //     case "pptx":
        //         filecls = "ppt";
        //         break;
        //     case "zip":
        //     case "rar":
        //         filecls = "zip";
        //         break;
        //     case "png":
        //         filecls = "png";
        //         break;
        //     case "jpg":
        //     case "jpeg":
        //         filecls = "jpg";
        //         break;
        //     case "gif":
        //         filecls = "gif";
        //         break;
        //     case "txt":
        //         filecls = "txt";
        //         break;
        //     case "pdf":
        //         filecls = "pdf";
        //         break;
        //     case "psd":
        //         filecls = "psd";
        //         break;
        //     default:
        //         filecls = "common";
        // }

        // return filecls;
    },

    // 编辑后缀在不能后面设置 因为其在渲染时就要用到，用于是否显示出编辑按钮
    // setEditext: function (exts) {
    //     if(!(exts instanceof Array)) {
    //         if(typeof exts == 'string') {
    //             try {
    //                 exts = JSON.parse(exts);
    //             }catch(err) {
    //                 throw new Error('参数必须为一个数组或可转化为数组的有效JSON');
    //             }
    //         }else {
    //             return new Error('参数必须为一个数组或可转化为数组的有效JSON');
    //         }
    //     }
    //     return (this._editSupportExt = exts);
    // },
    getEditext: function () {
        return this._editSupportExt;
    },

    setEditurl: function (url) {
        return (this._editUrl = url);
    },
    getEditurl: function () {
        return this._editUrl;
    },
    setPreviewUrl: function (url) {
        return (this._previewUrl = url);
    },
    getPreviewUrl: function () {
        return this._previewUrl;
    },
    setShowAsFileList: function (value) {
        if (value === true) {
            // 隐藏上传按钮 隐藏文件列表中的编辑、删除按钮 通过文件列表上的一个列类控制，单独进行样式控制会有冲突
            this._showAsFileList = true;
            jQuery(this._mWebUploader._buttons).addClass('hidden');
            this._$fileList.addClass('readonly');

        } else {
            this._showAsFileList = false;
            jQuery(this._mWebUploader._buttons).removeClass('hidden');
            this._$fileList.removeClass('readonly');
        }
    },
    getShowAsFileList: function () {
        return this._showAsFileList;
    },

    // 获取文件大小
    _getAttachLength: function (attachLength) {
        var unit = 'B';
        while (attachLength > 1024 && unit != 'T') {
            attachLength = (attachLength / 1024).toFixed(1);
            switch (unit) {
                case 'B':
                    unit = 'KB';
                    break;
                case 'KB':
                    unit = 'M';
                    break;
                case 'M':
                    unit = 'G';
                    break;
                case 'G':
                    unit = 'T';
                    break;
                default:
                    break;
            }
        }
        return attachLength + unit;
    },

    // 新增一个服务端文件 如从外部选取
    addFile: function (file) {
        if (this._mWebUploader.fileNumLimit < 1) {
            mini.alert('超出文件数目限制！');
            return;
        }
        jQuery(this._renderFileItem({
            id: file.attachGuid,
            name: file.attachFileName,
            ext: file.attachFileName.substr(file.attachFileName.lastIndexOf('.') + 1),
            size: file.attachLength,
            fileGuid: file.attachGuid,
            downloadUrl: file.downloadUrl,
            // 预览参数值
            preparams: file.preparams || file.downloadUrl,
            hideDelete: file.readonly,
            success: true
        })).appendTo(this._$fileList);
        // 新增成功后 相当于服务端数目+1 可上传文件数目-1
        this._mWebUploader.serverFileNum++;
        this._mWebUploader.setFileNumLimit(this._mWebUploader.fileNumLimit);
    },

    clearFile: function (clearServer) {
        // 调用内部方法处理
        // this._mWebUploader && this._mWebUploader.clearFile(clearServer);
        // 内部控件的clearFile，无法删掉用户刚上传的文件，和实现的ui有关，需要自行处理
        if (clearServer && this._$fileList) {

            var $fileItems = this._$fileList.find('.file-item');
            for (var i = 0, l = $fileItems.length; i < l; ++i) {
                var $file = $fileItems.eq(i).closest('.file-item'),
                    fileId = $file.attr('id'),
                    fileGuid = $file.attr('fileguid');

                this.removeFile({
                    id: fileId,
                    guid: fileGuid
                }, true);
            }
        }

        // 清空dom
        this._$fileList.empty();
    },
    // 设置是否显示为小尺寸
    setMinSize: function (value) {
        if (value !== true) {
            value = false;
        }
        this._minSize = value;
        this._$fileList[value ? 'addClass' : 'removeClass'](this.minSizeCls);

    },
    getMinSize: function () {
        return this._minSize;
    },
    // 获取功能按钮的可用性
    getFunBtnEnable: function (fileIndex) {
        var that = this;

        // 必须是数值
        if (typeof fileIndex != 'number') {
            var result = [];
            this._$fileList.find('.file-item').each(function (index, fileItem) {
                var $fileItem = $(fileItem),
                    ext = $fileItem.attr('fileext');
                result.push({
                    'edit': !!(that._editUrl && that._editSupportExt && that._editSupportExt.indexOf(ext) !== -1),
                    'preview': !!(that._previewUrl && that._previewExt && that._previewExt.indexOf(ext) !== -1),
                    'delete': !!$fileItem.find('.delete-file').length
                });
            });

            return result;
        }

        var $fileItem = this._$fileList.find('.file-item').eq(fileIndex),
            ext = $fileItem.length && $fileItem.attr('fileext');

        if (!ext) {
            return {};
        }
        return {
            'edit': !!(that._editUrl && that._editSupportExt && that._editSupportExt.indexOf(ext) !== -1),
            'preview': !!(that._previewUrl && that._previewExt && that._previewExt.indexOf(ext) !== -1),
            'delete': !!$fileItem.find('.delete-file').length
        };

    },
    // 设置按钮显示隐藏
    _setFunBtnVisable: function (fileIndex, btnName, show) {
        var $files = this._$fileList.find('.file-item'),
            $btns = null;

        show = show === true ? true : false;

        if (typeof fileIndex == 'number') {
            $btns = $files.eq(fileIndex).find('.file-func');
        } else {
            $btns = $files.find('.file-func');
        }

        $btns = $btns.find('.' + btnName + '-file');

        $btns[show ? 'removeClass' : 'addClass']('hidden');
    },
    setEditBtnVisable: function (fileIndex, show) {
        this._setFunBtnVisable(fileIndex, 'edit', show);
    },
    setPreviewBtnVisable: function (fileIndex, show) {
        this._setFunBtnVisable(fileIndex, 'preview', show);
    },
    setDeleteBtnVisable: function (fileIndex, show) {
        this._setFunBtnVisable(fileIndex, 'delete', show);
    },
    // 设置上传按钮是否显示
    setUploadBtnVisable: function (show) {
        show = show === true ? true : false;
        jQuery(this._mWebUploader._buttons)[show ? 'removeClass' : 'addClass']('hidden');
    },
    getUploadBtnVisable: function () {
        return jQuery(this._mWebUploader._buttons).hasClass('hidden');
    },
    // 设置是否启用编辑
    setEnableSort: function (v) {
        var enableSort = v === true ? true : false;
        this._enableSort = enableSort;

        if (enableSort) {
            this._enterSortBtn.setVisible(true);
            this._cancelSortBtn.setVisible(false);
            this._saveSortBtn.setVisible(false);
        } else {
            this._enterSortBtn.setVisible(false);
            this._cancelSortBtn.setVisible(false);
            this._saveSortBtn.setVisible(false);
        }
    },
    getEnableSort: function () {
        return this._enableSort;
    },
    // 设置和获取fileItemWidth
    setFileItemWidth: function (w) {
        this._fileItemWidth = w;
        this._$fileList.find('> .file-item').css('width', w);
    },
    getFileItemWidth: function () {
        return this._fileItemWidth;
    },

    secrecyLevelEditable: true,
    setSecrecyLevelEditable: function (editable) {
        this.secrecyLevelEditable = editable;
    },

    getSecrecyLevelEditable: function () {
        return this.secrecyLevelEditable;
    },
    getAttrs: function (el) {
        var attrs = mini.OAUploader.superclass.getAttrs.call(this, el);
        attrs.text = el.innerHTML;
        mini._ParseString(el, attrs, ['uploadUrl', 'limitType', 'mimeTypes', 'onbeforefilequeued', 'onload',
            'onfilesqueued', 'onfiledequeued', 'onreset', 'onstartupload', 'onstopupload',
            'onuploadfinished', 'onuploadstart', 'onuploadbeforesend', 'onuploadaccept', 'onuploadprogress',
            'onuploadsuccess', 'onuploaderror', 'onuploadcomplete', 'pickerText', 'onbeforemd5file', 'onfinishedmd5file',
            'onfilesuccess', 'onfileremovesuccess', 'beforemd5filefinished', 'oninit', 'postData', 'editurl', 'editext', 'previewurl', 'previewext', 'menu', 'onFileItemClick', 'onfilerender', 'fileItemWidth', 'onsecrecylevelchanged'
        ]);
        mini._ParseBool(el, attrs, ['auto', 'chunked', 'compress', 'needMD5', 'duplicate', 'showAsFileList', 'minSize', 'enableSort']);
        mini._ParseInt(el, attrs, ['fileNumLimit', 'fileSizeLimit', 'fileSingleSizeLimit', 'chunkSize', 'chunkRetry', 'fileNameLengthLimit']);

        return attrs;
    }
});

mini.regClass(mini.OAUploader, 'oauploader');