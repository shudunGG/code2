mini.overwrite(mini.LargeFileUploader, {
    mapClass: 'com.epoint.basic.faces.fileupload.NTKOUploader',
    
    showDefaultUI: true,

    // 初始化时服务端返回过来的文件数量
    serverFileNum: 0,

    fileSizeLimit: window.EpFrameSysParams && EpFrameSysParams['file_limit_size'],

    limitType: window.EpFrameSysParams && EpFrameSysParams['file_limit_type'],

    needChunkLocal: false,

    setAction: function(action) {
        this.action = action;

        this.controlData = {
            id: this.id,
            type: "largeFileUploader",
            mapClass: this.mapClass,
            action: this.action,
            showDefaultUI: this.showDefaultUI,
            dataOptions: this['data-options']
        };

        var arr = action.split('.');
        var url = arr[0] + '.action?cmd=' + arr[1];

        this.setUploadUrl(url);
    },

    setData: function(data) {
        // 兼容添加密级功能后的数据格式
        data = data.files || data;
        this.serverFileNum = data.length;

        if (this.showDefaultUI) {
            var item = '',
                html = [];
            // 向文件列表中添加记录
            for (var i = 0, len = data.length; i < len; i++, item = []) {
                item = this._generateFileList({
                    id: data[i].attachGuid,
                    name: data[i].attachFileName,
                    size: data[i].attachLength,
                    date: data[i].uploadDateTime,
                    fileGuid: data[i].attachGuid,
                    downloadUrl: data[i].downloadUrl,
                    hideDelete: data[i].readonly,
                    success: true
                });

                html.push(item);

            }
            jQuery(this._fileList).html(html.join(''));

        }
        
        this.fire('load', {
            sender: this,
            eventType: "load",
            data: data
        });
    },

    removeFile: function(fileId) {
        var ntko = this._ntko,
            index = this._getFileIndex(fileId),
            file;

        if (index > -1) {
            file = ntko.GetFile(index);
            ntko.RemoveFile(index);

            this._fileIds[file.FilePath] = undefined;
            delete this._fileIds[file.FilePath];
            this._onFileDequeued(file);
        }

        if (this.showDefaultUI) {
            var $item = jQuery(this._fileList).find('#' + fileId);

            if ($item.length) {
                $item.remove();
            }

        }


    },

    clearFile: function() {

        for (var i in this._fileIds) {
            this.removeFile(this._fileIds[i].id);
        }
        if (this.showDefaultUI) {
            jQuery(this._fileList).empty();

        }

    },

    _initEvents: function() {
        mini._BindEvents(function() {
            mini_onOne(this._picker, "click", this.__OnPickerClick, this);
        }, this);

        var that = this,
            ntko = this._ntko;

        // 绑定上传按钮的点击事件
        this._uploadBtn.on('click', function() {
            if (ntko.IsUploading) {
                that.stopUpload();
                that._uploadBtn.setText(that.pauseText);
            } else {
                that.beginUpload();
                that._uploadBtn.setText(that.startText);
            }
        });

        if (this.auto) {
            this._uploadBtn.hide();
        }

        //
        if (ntko.attachEvent) {
            ntko.attachEvent('BeforeFileAdded', function(filePath, fileName, fileSize) {
                ntko.CancelLastCommand = !that._beforeFileQueued(filePath, fileName, fileSize);
            });
            ntko.attachEvent('OnLocalFileAdded', function(filePath, fileName, fileSize) {

                that._onFilesQueued(filePath, fileName, fileSize);
            });
            ntko.attachEvent('OnFileProcessStatusChange', function(file, statusText, isPersent, persentNumber) {
                that._onUploadProgress(file, statusText, isPersent, persentNumber);
            });
            ntko.attachEvent('OnOneFileUploadFinished', function(file, isAllUploaded) {
                that._onFileFinished(file, isAllUploaded);
            });
            ntko.attachEvent('OnSaveToURLFinished', function(isAllSuccess) {
                that._onUploadFinished(isAllSuccess);
            });
        } else {
            var id = this.uid + '-ntko',
                lfu = 'var lfu = mini.getbyUID("' + this.uid + '");',
                text = lfu + 'lfu._ntko.CancelLastCommand = !lfu._beforeFileQueued(filePath, fileName, fileSize);';

            addEvent({
                target: id,
                event: "BeforeFileAdded(filePath, fileName, fileSize)",
                text: text
            });

            text = lfu + 'lfu._onFilesQueued(filePath, fileName, fileSize);';
            addEvent({
                target: id,
                event: "OnLocalFileAdded(filePath, fileName, fileSize)",
                text: text
            });

            text = lfu + 'lfu._onUploadProgress(file, statusText, isPersent, persentNumber);';
            addEvent({
                target: id,
                event: "OnFileProcessStatusChange(file, statusText, isPersent, persentNumber)",
                text: text
            });

            text = lfu + 'lfu._onFileFinished(file, isAllUploaded);';
            addEvent({
                target: id,
                event: "OnOneFileUploadFinished(file, isAllUploaded)",
                text: text
            });

            text = lfu + 'lfu._onUploadFinished(isAllSuccess);';
            addEvent({
                target: id,
                event: "OnSaveToURLFinished(isAllSuccess)",
                text: text
            });

        }

        function addEvent(opt) {
            var script = document.createElement('script');
            script.language = "JScript";
            script.setAttribute('for', opt.target);
            script.event = opt.event;
            script.text = opt.text;
            document.body.appendChild(script);
        }
        if (this.showDefaultUI) {
            jQuery(this._fileList).on('click', '.mini-uploader-remove', function() {
                var $this = jQuery(this),
                    fileId = $this.attr('fileId'),
                    // $item = $this.closest('.mini-uploader-item'),
                    fileGuid = $this.attr('fileGuid');

                mini.confirm('确定删除文件？', '系统提示', function(action) {
                    if (action == 'ok') {
                        // 两值相等，则表示是初始化时后台给的文件，不在文件列表中，不需要从文件列表中删除
                        if (fileId != fileGuid) {
                            that.removeFile(fileId);
                        } else {
                            jQuery(that._fileList).find('#' + fileId).remove();
                            that.serverFileNum--;
                        }

                        // 有fileGuid则表示改文件已上传成功了，需要发ajax告诉服务端文件已删除
                        if (fileGuid) {
                            var data = {
                                commonDto: mini.encode(that.getCommonData())
                            };
                            data[that.id + "_action"] = 'delete';
                            data[that.id + "_attachGuid"] = fileGuid;

                            // 此处不能用Util.ajax
                            // 原因是回调中需要拿到后端返回的控件数据，而Util.ajax是会过滤掉控件数据的
                            var xhr = $.ajax({
                                url: that.uploadUrl,
                                data: data,
                                dataType: 'json',
                                type: 'post'
                            });

                            xhr.done(function(data) {
                                data = mini.getSecondRequestData(data);
                                that.fire('fileremovesuccess', {
                                    sender: that,
                                    eventType: "fileremovesuccess",
                                    fileGuid: fileGuid,
                                    data: data
                                });
                            });
                        }
                    }
                });

            });
        }
    },
    _validateFile: function(file) {
        var filesCount = this._ntko.FilesCount;
        if (this.fileNumLimit && filesCount >= this.fileNumLimit - this.serverFileNum) {
            this._errorContent = String.format(this.numLimitErrorText, this.fileNumLimit);

            return false;
        }

        if (this.fileSingleSizeLimit && file.size > this.fileSingleSizeLimit * 1024) {
            this._errorContent = String.format(this.sizeErrorText, this.fileSingleSizeLimit);

            return false;
        }

        if (file.size === 0) {
            this._errorContent = this.emptyFileErrorText;

            return false;
        }

        if (this.limitType && (',' + this.limitType + ',').indexOf(',' + file.ext.toLowerCase() + ',') == -1) {
            this._errorContent = String.format(this.typeDeniedErrorText, this.limitType);

            return false;
        }

        return true;
    },

    // 当有文件添加进来的时候
    _onFilesQueued: function(filePath, fileName, fileSize) {
        var file = {
            path: filePath,
            name: fileName,
            size: fileSize,
            ext: fileName.substr(fileName.lastIndexOf('.') + 1),
            id: UUID()
        };

        this._fileIds[file.path] = {
            id: file.id
        };

        if (this.showDefaultUI) {
            var item = this._generateFileList({
                id: file.id,
                name: file.name,
                size: file.size,
                date: mini.formatDate(new Date(), 'yyyy-MM-dd')
            });
            jQuery(this._fileList).append(item);
        }
        if (this._events["filesqueued"]) {
            this.fire("filesqueued", {
                files: [file]
            });
        }
    },

    _generateFileList: function(options) {
        options.fileGuid = options.fileGuid || '';
        if (options.downloadUrl) {
            // options.downloadUrl = _rootPath + '/' + options.downloadUrl + '?attachGuid=' + options.fileGuid;
            // 根路径 + 返回路径带attachGuid 
            // 根路径 + 返回路径不带attachGuid 则判断是否带？ 是则拼接&guid 否则？guid
            options.downloadUrl = _rootPath + '/' +
                (
                    options.downloadUrl.indexOf('attachGuid') != -1 ?
                    // 已经有attachGuid了 就不处理
                    options.downloadUrl :
                    // 没有attachGuid 根据是否有？ 拼接上 '&' 或 '?' + 'attachGuid=' + options.fileGuid
                    (options.downloadUrl + (options.downloadUrl.indexOf('?') != -1 ? '&' : '?') + 'attachGuid=' + options.fileGuid)
                );
        } else {
            options.downloadUrl = 'javascript:void(0)';
        }

        var list = [];
        list.push('<div id="' + options.id + '" class="mini-uploader-item' + (options.success ? ' success' : '') + '">');
        list.push('<a href="' + options.downloadUrl + '" class="mini-uploader-info">' + options.name + '</a>');
        list.push('<span class="mini-uploader-size">(' + this._getSize(options.size) + (options.date ? '/' + options.date : '') + ')</span>');
        list.push('<span class="mini-uploader-error"></span>');
        list.push('<span class="mini-uploader-progressbar" style="display: none;"><span class="progress-text">0%</span><div class="progress-body"></div></span>');
        if (!options.hideDelete) {
            list.push('<a href="javascript:void(0)" class="mini-uploader-remove" fileId="' + options.id + '" fileGuid="' + options.fileGuid + '">删除</a>');
        }
        list.push('</div>');

        return list.join('');
    },

    _needPostData: true,
    // 当开始上传流程时触发
    _onStartUpload: function() {
        if (this.postData && this._needPostData) {

            var me = this;
            var data = {
                commonDto: mini.encode(this.getCommonData())
            };
            data[this.id + '_incache'] = true;
            data[this.id + '_postData'] = this.postData;
            data[this.id + '_fileCount'] = this._uploader.getFiles().length;
            data[this.id + '_fileLoadedCount'] = this._uploader.getStats().successNum;

            var xhr = Util.ajax({
                url: this.uploadUrl,
                data: data,
                dataType: 'json'
            });

            xhr.done(function(data) {
                me._needPostData = false;
                me.beginUpload();
            });

            return false;
        }
        if (this._events["startupload"]) {
            var event = {
                source: this,
                sender: this,
                type: 'startupload',
                cancel: false
            };

            this.fire("startupload", event);

            if (event.cancel) {
                return false;
            }
        }

        return true;
    },
    // 当所有文件上传结束时触发
    _onUploadFinished: function(isAllSuccess) {
        this._uploadBtn.setText(this.startText);
        this._needPostData = true;
        this.fire("uploadfinished", {
            isAllSuccess: isAllSuccess
        });
    },
    // 文件上传过程中触发。
    _onUploadProgress: function(file, statusText, isPersent, persentNumber) {
        file = this._parseAttachFile(file);

        var isUploading = false;
        var li = mini.byId(file.id),
            $progressbar = jQuery('.mini-uploader-progressbar', li),
            $progresstext = jQuery('.progress-text', $progressbar),
            $progressbody = jQuery('.progress-body', $progressbar),
            width;
        if (isPersent) {

            if (!isUploading && statusText.indexOf('正在分析文件') === 0) {
                if (this.showDefaultUI) {
                    width = Math.round(persentNumber) + '%';

                    $progresstext.text('正在分析文件');
                    $progressbody.width(width);
                }

                this.fire("md5progress", {
                    file: file,
                    percentage: persentNumber / 100
                });


                if (persentNumber == 100) {
                    isUploading = true;
                }
            } else {
                if (this.showDefaultUI) {
                    width = Math.round(persentNumber) + '%';

                    $progresstext.text('已上传：' + width);
                    $progressbody.width(width);
                }

                this.fire("uploadprogress", {
                    file: file,
                    percentage: persentNumber / 100
                });

            }
        } else if (!this._fileIds[file.path].started) {
            if (this.showDefaultUI) {
                $progressbar.show();
            }

            this.fire("uploadstart", {
                file: file
            });

            this._fileIds[file.path].started = true;
        }

    },
    // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次
    _onUploadBeforeSend: function(data) {
        data = data.data;
        data.commonDto = mini.encode(this.getCommonData());

        // 带上页面地址中的参数
        var query = window.location.search.substring(1).split('&');
        var param;
        for (var i = 0, len = query.length; i < len; i++) {
            param = query[i].split('=');
            if (param[0]) {
                data[param[0]] = param[1];
            }
        }

        this.fire("uploadbeforesend", {
            sender: this,
            data: data
        });
    },
    _onUploadSuccess: function(file) {
        var ret = this._parseNtkoRet(this._ntko.LastFinishedUploadRetMes);
        if (ret.uploadFailed) {
            mini.alert(ret.failedMsg || '上传失败！请重新上传！');
            this.removeFile(file.id);

            return;
        }

        this.fire('uploadaccept', {
            ret: ret,
            object: {
                file: file
            }
        });

        if (this.showDefaultUI) {
            var $item = jQuery('#' + file.id);
            var fileGuid = ret.attachGuid,
                downloadUrl = ret.downloadUrl;

            if (downloadUrl) {
                downloadUrl = decodeURIComponent(downloadUrl);
                downloadUrl = _rootPath + '/' +
                    (
                        downloadUrl.indexOf('attachGuid') != -1 ?
                        // 已经有attachGuid了 就不处理
                        downloadUrl :
                        // 没有attachGuid 根据是否有？ 拼接上 '&' 或 '?' + 'attachGuid=' + fileGuid
                        (downloadUrl + (downloadUrl.indexOf('?') != -1 ? '&' : '?') + 'attachGuid=' + fileGuid)
                    );
            }

            $item.addClass('success');
            $item.find('.mini-uploader-error').html('').hide();

            if (fileGuid) {
                $item.find('.mini-uploader-remove').attr('fileGuid', fileGuid);
                if (downloadUrl) {
                    $item.find('.mini-uploader-info').attr('href', downloadUrl);
                }
            }
        }
        this.fire("uploadsuccess", {
            file: file
        });
    },
    _onUploadError: function(file, reason) {
        if (this.showDefaultUI) {
            jQuery('#' + file.id).find('.mini-uploader-error').html('上传出错!').show();
        }

        this.fire("uploaderror", {
            file: file,
            reason: reason
        });
    },
    _onUploadComplete: function(file) {
        if (this.showDefaultUI) {
            jQuery('#' + file.id).find('.mini-uploader-progressbar').fadeOut();
        }

        this.fire("uploadcomplete", {
            file: file
        });
    },

    _getSize: function(size) {
        var K = 1024,
            M = 1048576;
        size = parseInt(size);

        if (size > M) {
            return (size / M).toFixed(2) + "M";
        } else {
            return (size / K).toFixed(2) + "K";
        }
    },

    getCommonData: function() {
        if (!this.controlData) {
            this.controlData = {
                id: this.id,
                type: "largeFileUploader",
                mapClass: this.mapClass,
                action: this.action,
                showDefaultUI: this.showDefaultUI,
                needChunkLocal: this.needChunkLocal,
                dataOptions: this['data-options']
            };
        }
        return [this.controlData, this.getViewdata()];
    },

    getViewdata: function() {
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

    setShowDefaultUI: function(showDefaultUI) {
        this.showDefaultUI = showDefaultUI;
        if (this.controlData) {
            this.controlData.showDefaultUI = showDefaultUI;
        }
    },

    setPostData: function(postData) {
        this.postData = postData;

    },

    getExtraAttrs: function(el) {
        var attrs = {};
        mini._ParseString(el, attrs, ["onfileremovesuccess","postData", "onload"
        ]);
        mini._ParseBool(el, attrs, ["showDefaultUI", "needChunkLocal"]);

        return attrs;
    }
});
