mini.overwrite(mini.WebUploader, {
    mapClass: 'com.epoint.basic.faces.fileupload.WebUploader',

    // 是否用于数据导入
    dataImport: false,

    showDefaultUI: true,

    needChunkLocal: false,

    // 初始化时服务端返回过来的文件数量
    serverFileNum: 0,
    // 服务端返回文件
    serverFiles: undefined,

    fileSizeLimit: window.EpFrameSysParams && EpFrameSysParams['file_limit_size'],

    limitType: window.EpFrameSysParams && EpFrameSysParams['file_limit_type'],

    fileNameLengthLimit: window.EpFrameSysParams && EpFrameSysParams['file_limit_namelength'] || 225,
    
    fileNameLengthErrorText: '选择的文件名称长度过长！</br>文件名最长为{0}个字符',

    specialCharacterErrorText: '文件名称中不能包含特殊字符！',

    showSecrecyLevel: false,

    defaultSecrecyLevel: (window.EpFrameSysParams && EpFrameSysParams['defaultSecrecyLevel']) === undefined ? undefined : EpFrameSysParams['defaultSecrecyLevel'],

    setAction: function (action) {
        this.action = action;

        this.controlData = {
            id: this.id,
            type: "webuploader",
            mapClass: this.mapClass,
            action: this.action,
            showDefaultUI: this.showDefaultUI,
            dataOptions: this['data-options']
        };

        var arr = action.split('.');
        var url = arr[0] + '.action?cmd=' + arr[1];

        this.setUploadUrl(url);
    },

    setData: function (data) {
        // 重置内部的上传控件，将上传文件队列清空，避免setdata后 一个文件既是服务端返回文件，又在上传控件的文件中
        this._uploader && this._uploader.reset();

        var files = data.files || data;
        var secrecyLevels = data.secrecyLevels;

        this.serverFileNum = files.length;
        this.setFileNumLimit(this.fileNumLimit);

        if(secrecyLevels && secrecyLevels.levels && secrecyLevels.levels.length) {
            this.setShowSecrecyLevel(true);
            this.setSecrecyLevels(secrecyLevels);
            
        }
        
        // 处理服务端返回的文件
        var fileItem, html = [];
        this.serverFiles = {};
        for (var i = 0, len = files.length; i < len; i++) {
            //  加入服务端文件列表
            fileItem = {
                id: files[i].attachGuid,
                name: files[i].attachFileName,
                size: files[i].attachLength,
                date: files[i].uploadDateTime,
                fileGuid: files[i].attachGuid,
                downloadUrl: files[i].downloadUrl,
                hideDelete: files[i].readonly,
                success: true
            };
            this.serverFiles[fileItem.fileGuid] = fileItem;

            // 默认ui下渲染文件列表
            if (this.showDefaultUI) {
                html.push(this._generateFileList(fileItem));
            }
        }

        // 默认ui下加入页面
        if (this.showDefaultUI) {
            jQuery((html.join(''))).appendTo(jQuery(this._fileList).empty());
        }

        this.fire('load', {
            sender: this,
            eventType: "load",
            data: data
        });
    },

    removeFile: function (file, clearServer) {
        // this._uploader.removeFile(file, true);

        // if (this.showDefaultUI) {
        //     var fileId = file.id || file,
        //         $item = jQuery(this._fileList).find('#' + fileId);

        //     if ($item.length) {
        //         $item.remove();
        //     }

        // }

        var fileId = file.id || file,
            fileGuid = file.guid || file.fileGuid,
            self = this;
        // 两值相等，则表示是初始化时后台给的文件，不在上传控件的文件列表中，不需要从文件列表中删除
        if (fileId != fileGuid) {
            this._uploader.removeFile(fileId, true);
        } else {
            this.serverFileNum--;
            this._uploader.option("fileNumLimit", this.fileNumLimit - this.serverFileNum);
            this.serverFiles[fileGuid] = null;
            delete this.serverFiles[fileGuid];
        }

        if (this.showDefaultUI) {
            jQuery(this._fileList).find('#' + fileId).remove();
        }

        // 之前的removeFile方法是不会发请求给后端的，为了兼容之前的代码，新增一个clearServer参数，为true是才去服务端删除
        // 有fileGuid则表示改文件已上传成功了，需要发ajax告诉服务端文件已删除
        if (fileGuid && clearServer) {
            var data = {
                commonDto: mini.encode(this.getCommonData())
            };
            data[this.id + "_action"] = 'delete';
            data[this.id + "_attachGuid"] = fileGuid;
            if (this.dataImport) {
                data[this.id + "_import"] = true;

            }

            // 此处不能用Util.ajax
            // 原因是回调中需要拿到后端返回的控件数据，而Util.ajax是会过滤掉控件数据的
            var xhr = $.ajax({
                url: this.uploadUrl,
                data: data,
                dataType: 'json',
                type: 'post'
            });

            xhr.done(function (data) {
                data = mini.getSecondRequestData(data);
                self.fire('fileremovesuccess', {
                    sender: self,
                    eventType: "fileremovesuccess",
                    fileGuid: fileGuid,
                    data: data
                });
            });
        }
    },

    clearFile: function (clearServer) {
        // if (this._uploader) {
        //     // 用户上传的文件
        //     var files = this._uploader.getFiles();

        //     for (var i = files.length - 1; i >= 0; i--) {
        //         this.removeFile(files[i], clearServer);
        //     }

        //     // 服务端返回的文件
        //     var serverFiles = this.serverFiles;
        //     for (var key in serverFiles) {
        //         if (serverFiles.hasOwnProperty(key)) {
        //             serverFiles[key] && this.removeFile(serverFiles[key], clearServer);
        //         }
        //     }
        // }
        // 上面处理方法还是有问题 无法删除用户刚上传完成的文件，原因getFiles()获取的文件为原生的文件列表，没有包含是否已经上传成功的信息，不知道文件guid，无法删除。
        // 因此只能从ui上去处理

        if (this.showDefaultUI) {
            // 遍历删除
            if (this._uploader) {
                var $fileItems = jQuery(this._fileList).find('.mini-uploader-item');

                if (!$fileItems.length) {
                    return;
                }
                // 从文件列表中遍历进行处理
                for (var i = $fileItems.length - 1; i >= 0; --i) {
                    var $file = $fileItems.eq(i).find('.mini-uploader-remove'),
                        id = $file.attr('fileId'),
                        guid = $file.attr('fileguid');
                    this.removeFile({
                        id: id,
                        guid: guid
                    }, clearServer);
                }
            }
            // 清空dom
            jQuery(this._fileList).empty();
        } else {
            // 清空input 清空控件的服务端文件和服务端文件数目
            // 真正的dom和文件删除操作需要自行完成
            this._uploader && this._uploader.reset();
            this.serverFiles = {};
            this.serverFileNum = 0;

            // serverFileNum改变后需要重新设置下fileNumLimit
            this.setFileNumLimit(this.fileNumLimit);
            console && console.warn && console.warn('非默认UI下使用此方法需要自行完成文件的删除操作');
        }
    },

    setFileNumLimit: function (fileNumLimit) {
        this.fileNumLimit = fileNumLimit;
        if (this._uploader) {
            this._uploader.option("fileNumLimit", fileNumLimit - this.serverFileNum);
        }
    },

    _initEvents: function () {
        if(this.showDefaultUI) {
            this._bindDefaultUIEvents();
        }
    },

    _bindDefaultUIEvents: function () {
        // 已绑定过，直接跳过，避免重复绑定
        if(this._isBindDefaultUIEvent) {
            return;
        }
        var that = this;
        jQuery(this._fileList).on('click', '.mini-uploader-remove', function () {
            var $this = jQuery(this),
                fileId = $this.attr('fileId'),
                $item = $this.closest('.mini-uploader-item'),
                fileGuid = $this.attr('fileGuid');

            // 新增removefile事件
            // 以方便外部在点击删除按钮时做个性化处理，比如做提示，阻止删除等
            if (that._events["fileremove"]) {
                var event = {
                    source: that,
                    sender: that,
                    type: 'fileremove',
                    file: {
                        id: fileId,
                        guid: fileGuid
                    }
                };

                that.fire("fileremove", event);

            } else {
                that.removeFile({
                    id: fileId,
                    guid: fileGuid
                }, true);
            }

            // // 两值相等，则表示是初始化时后台给的文件，不在文件列表中，不需要从文件列表中删除
            // if (fileId != fileGuid) {
            //     that.removeFile(fileId);
            // } else {
            //     jQuery(that._fileList).find('#' + fileId).remove();
            //     that.serverFileNum--;
            //     that._uploader.option("fileNumLimit", that.fileNumLimit - that.serverFileNum);

            // }

            // // 有fileGuid则表示改文件已上传成功了，需要发ajax告诉服务端文件已删除
            // if (fileGuid) {
            //     var data = {
            //         commonDto: mini.encode(that.getCommonData())
            //     };
            //     data[that.id + "_action"] = 'delete';
            //     data[that.id + "_attachGuid"] = fileGuid;
            //     if (that.dataImport) {
            //         data[that.id + "_import"] = true;

            //     }

            //     // 此处不能用Util.ajax
            //     // 原因是回调中需要拿到后端返回的控件数据，而Util.ajax是会过滤掉控件数据的
            //     var xhr = $.ajax({
            //         url: that.uploadUrl,
            //         data: data,
            //         dataType: 'json',
            //         type: 'post'
            //     });

            //     xhr.done(function(data) {
            //         data = mini.getSecondRequestData(data);
            //         that.fire('fileremovesuccess', {
            //             sender: that,
            //             eventType: "fileremovesuccess",
            //             fileGuid: fileGuid,
            //             data: data
            //         });



            //     });
            // }

        }).on('click', '.mini-uploader-retry', function () {
            var fileId = jQuery(this).attr('fileId');

            // 重新上传
            that.retry(fileId);
        });

        if (this.showSecrecyLevel && !this._isBindSecrecyEvent) {
            

        }
        // 记录是否已绑定过，以避免重复绑定
        this._isBindDefaultUIEvent = true;
    },
    _unbindDefaultUIEvents: function () {
        jQuery(this._fileList).off('click', '.mini-uploader-remove')
            .off('click', '.mini-uploader-retry')
            .off('click', '.mini-uploader-secrecy');
        jQuery('body').off('mousedown.secrecyLevelList' + this.uid);

        this._isBindDefaultUIEvent = false;
    },

    _isBindSecrecyEvent: false,
    _bindSecrecyEvents: function(){
         // 已绑定过，直接跳过，避免重复绑定
         if(this._isBindSecrecyEvent) {
            return;
        }
        var that = this;
        jQuery(this._fileList).on('click', '.mini-uploader-secrecy', function () {
            var $this = jQuery(this),
                canEdit = $this.attr('canEdit'),
                $removeItem = $this.siblings('.mini-uploader-remove'),
                fileGuid = $removeItem.attr('fileGuid');
            if(canEdit === 'true') {
                that.showSecrecyLevelList($this, fileGuid);
            }
            
        });

        jQuery('body').on('mousedown.secrecyLevelList' + this.uid, function (e) {
            if (!$(e.target).hasClass('mini-uploader-secrecy') && !$(e.target).closest('.mini-secrecylevel-list').length) {
                that.hideSecrecyLevelList();
            }
        });

        // 页面滚动时，隐藏密级列表，避免其位置不对
        jQuery(document).on('mousewheel', function(){
            that.hideSecrecyLevelList();
        });

        this._isBindSecrecyEvent = true;

    },

    _queuedNum: 0,
    // 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
    _beforeFileQueued: function (file) {
        if (this.serverFileNum + this._queuedNum >= this.fileNumLimit) {
            this._uploader.trigger('error', 'Q_EXCEED_NUM_LIMIT', this.fileNumLimit, file);
            return false;
        }
        // 对于后缀为中文的情况webuploader识别不了，会直接放过。
        // 这是webuploder的一个漏洞，只要把后缀改成中文的，就可以绕过limitType的限制
        // 为解决该问题需在文件加入队列前把后缀为中文这种不合法情况阻止掉
        if(/[\u4e00-\u9fa5]/.test(file.ext)) {
            this._uploader.trigger('error', 'Q_TYPE_DENIED', this.limitType, file);
            return false;
        }

        // Liunx系统中文件名称长度限制在100个字符，需要选文件时就把超过的过滤掉
        if(file.name.lastIndexOf('.') >= this.fileNameLengthLimit) {
            mini.alert(String.format(this.fileNameLengthErrorText, this.fileNameLengthLimit));
            return false;
        }

        // var specialReg = /^(?!\.)[^\\\/:\*\?"<>\|\%\;]{1,225}$/;
        // if(specialReg.test(file.name)) {
        //     mini.alert(this.specialCharacterErrorText);
        //     return false;
        // }
        
        if (this._events["beforefilequeued"]) {
            var event = {
                source: this,
                sender: this,
                type: 'beforefilequeued',
                file: file,
                cancel: false
            };

            this.fire("beforefilequeued", event);

            if (event.cancel) {
                return false;
            } else {
                this._queuedNum++;
                return true;
            }
        }
    },

    // 当有文件添加进来的时候
    _onFilesQueued: function (files) {
        var event = {
            source: this,
            sender: this,
            type: 'onfilesqueued',
            files: files,
            errorContent: this._errorContent
        };


        if (this._events["filesqueued"]) {
            this.fire("filesqueued", event);
        } else if (this.showDefaultUI) {
            var item = '',
                html = [];
            // 向文件列表中添加记录
            for (var i = 0, len = files.length; i < len; i++, item = []) {
                item = this._generateFileList({
                    id: files[i].id,
                    name: files[i].name,
                    size: files[i].size,
                    date: mini.formatDate(new Date(), 'yyyy-MM-dd')
                });

                html.push(item);

            }
            jQuery(this._fileList).append(html.join(''));
        }

        // 如果有出错信息，则显示
        if (this._errorContent) {
            mini.alert(this._errorContent);
        }
        this._errorContent = "";

        this._queuedNum = 0;
    },

    _generateFileList: function (options) {
        options.fileGuid = options.fileGuid || '';
        // if (options.downloadUrl) {
        //     options.downloadUrl = _rootPath + '/' + options.downloadUrl;
        // } else {
        //     options.downloadUrl = 'javascript:void(0)';
        // }

        var canDownload = true;

        if (options.downloadUrl) {
            options.downloadUrl = _rootPath + '/' + (
                options.downloadUrl.indexOf('attachGuid') != -1 ?
                // 已经有attachGuid了 就不处理
                options.downloadUrl :
                // 没有attachGuid 根据是否有？ 拼接上 '&' 或 '?' + 'attachGuid=' + options.fileGuid
                (options.downloadUrl + (options.downloadUrl.indexOf('?') != -1 ? '&' : '?') + 'attachGuid=' + options.fileGuid)
            );
        } else {
            options.downloadUrl = 'javascript:void(0);';
            canDownload = false;
        }

        var list = [];
        list.push('<div id="' + options.id + '" class="mini-uploader-item' + (options.success ? ' success' : '') + '">');
        list.push('<a href="' + options.downloadUrl + (canDownload ? '" target="_blank" class="mini-uploader-info">' : '" class="mini-uploader-info">') + options.name + '</a>');
        if(options.size) {
            list.push('<span class="mini-uploader-size">(' + this._getSize(options.size) + (options.date ? '/' + options.date : '') + ')</span>');            
        }

        list.push('<span class="mini-uploader-error"></span>');

        if (this.showSecrecyLevel) {
            // 添加附件密级设置
            var secrecyLevel = options.secrecyLevel === undefined ? this.defaultSecrecyLevel : options.secrecyLevel,
                secrecyLevelText = (function (secrecyLevelItems) {
                    for (var i = 0, l = secrecyLevelItems.length; i < l; i++) {
                        if (secrecyLevelItems[i].id === secrecyLevel) {
                            return secrecyLevelItems[i].text;
                        }
                    }
                    return '';
                })(this.secrecyLevelItems);

            if (!secrecyLevelText) {
                secrecyLevel = this.getHighestSecrecyLevel().id;
                secrecyLevelText = this.getHighestSecrecyLevel().text;

            }
            list.push('<span class="mini-uploader-secrecy" canEdit="' + !options.hideDelete + '" guid="' + secrecyLevel + '">' + secrecyLevelText + '</span>');
        }
        
        list.push('<span class="mini-uploader-progressbar" style="display: none;"><span class="progress-text">0%</span><div class="progress-body"></div></span>');
        if (this.enabled && !options.hideDelete) {
            list.push('<a href="javascript:void(0)" class="mini-uploader-remove" fileId="' + options.id + '" fileGuid="' + options.fileGuid + '">删除</a>');
        }
        list.push('</div>');

        return list.join('');
    },

    // 当文件被移除队列后触发
    _onFileDequeued: function (file) {
        this.fire("filedequeued", {
            file: file
        });
    },
    // 当 uploader 被重置的时候触发
    _onReset: function () {
        this.fire("reset");
    },

    _needPostData: true,
    // 当开始上传流程时触发
    _onStartUpload: function () {
        if (this.postData && this._needPostData) {
            this._uploader.stop();

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

            xhr.done(function (data) {
                me._needPostData = false;
                me._uploader.upload();
            });
        }
        this.fire("startupload");
    },
    // 当上传流程暂停时触发
    _onStopUpload: function () {
        this.fire("stopupload");
    },
    // 当所有文件上传结束时触发
    _onUploadFinished: function () {
        this._needPostData = true;
        this.fire("uploadfinished");
    },
    // 某个文件开始上传前触发
    _onUploadStart: function (file) {
        if (this._events["uploadstart"]) {
            this.fire("uploadstart", {
                file: file
            });
        } else if (this.showDefaultUI) {
            var li = mini.byId(file.id),
                $progressbar = jQuery('.mini-uploader-progressbar', li);

            $progressbar.show();
        }
    },
    // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次
    _onUploadBeforeSend: function (object, data, headers) {
        data.commonDto = mini.encode(this.getCommonData());

        if (this.chunked) {
            data[this.id + "_action"] = "chunk";

            var file = object.file;

            data.uploadGuid = file.uuid;
            data.fileMD5 = this._fileMD5[file.id];
            data.chunkSize = this.chunkSize * 1024;
        } else {
            data[this.id + "_action"] = "upload";

            // 非分片并且指定needMD5的，上传参数中需加文件的MD5值
            if (this.needMD5) {
                data.fileMD5 = this._fileMD5[data.id];
                delete this._fileMD5[data.id];
            }

        }
        if (this.dataImport) {
            data[this.id + "_import"] = true;
        }

        data[this.id + '_postData'] = this.postData;
        data[this.id + '_fileCount'] = this._uploader.getFiles().length;
        data[this.id + '_fileLoadedCount'] = this._uploader.getStats().successNum;

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
            object: object,
            data: data,
            headers: headers
        });
    },
    // 当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为false, 则此文件将派送server类型的uploadError事件。
    _onUploadAccept: function (object, ret) {
        ret = mini.getSecondRequestData(ret);

        // 当返回数据中没有控件信息时，表明服务端出现了错误，则应返回false，告诉控件上传失败
        if (!ret) {
            return false;
        }
        ret = mini.decode(ret.data || ret);
        if (this._events['uploadaccept']) {
            var event = {
                source: this,
                sender: this,
                type: 'uploadaccept',
                object: object,
                ret: ret
            };
            this.fire('uploadaccept', event);

            if (event.cancel) {
                return false;
            } else {
                return true;
            }
        } else {
            if (this.showDefaultUI && !this.chunked) {
                var fileGuid = ret.attachGuid,
                    downloadUrl = ret.downloadUrl;

                if (fileGuid) {
                    jQuery('#' + object.file.id + ' > .mini-uploader-remove').attr('fileGuid', fileGuid);
                    if (downloadUrl) {
                        jQuery('#' + object.file.id + ' > .mini-uploader-info').attr('href', _rootPath + '/' + downloadUrl).attr('target', '_blank');
                    }
                }

            }
            this.fire('filesuccess', {
                source: this,
                sender: this,
                type: 'filesuccess',
                file: object.file,
                data: ret
            });

        }
    },
    // 文件上传过程中触发。
    _onUploadProgress: function (file, percentage) {
        if (this._events["uploadprogress"]) {
            this.fire("uploadprogress", {
                file: file,
                percentage: percentage
            });
        } else if (this.showDefaultUI) {
            var li = mini.byId(file.id),
                $progressbar = jQuery('.mini-uploader-progressbar', li),
                $progresstext = jQuery('.progress-text', $progressbar),
                $progressbody = jQuery('.progress-body', $progressbar),
                width = Math.round(percentage * 100) + '%';

            $progresstext.text(width);
            $progressbody.width(width);
        }
    },
    _onUploadSuccess: function (file, ret) {
        // 秒传功能下只有一次查询附件状态的请求，所以成功事件中不会有后台返回的值，需要兼容
        var data = ret ? mini.getSecondRequestData(ret) : {};


        if (data.uploadFailed) {
            mini.alert(data.failedMsg || '上传失败！请重新上传！');
            this.removeFile(file);

            return;
        }
        if (this._events["uploadsuccess"]) {
            this.fire("uploadsuccess", {
                file: file,
                ret: ret
            });
        } else if (this.showDefaultUI) {
            var $item = jQuery('#' + file.id);
            $item.addClass('success');
            $item.find('.mini-uploader-error').html('').hide();
        }
    },
    _onUploadError: function (file, reason) {
        if (this._events["uploaderror"]) {
            this.fire("uploaderror", {
                file: file,
                reason: reason
            });
        } else if (this.showDefaultUI) {
            jQuery('#' + file.id).find('.mini-uploader-error').html('上传出错!<a href="#" class="mini-uploader-retry" fileId="' + file.id + '">重试</a>').show();
        }
    },
    _onUploadComplete: function (file) {
        if (this._events["uploadcomplete"]) {
            this.fire("uploadcomplete", {
                file: file
            });
        } else if (this.showDefaultUI) {
            jQuery('#' + file.id).find('.mini-uploader-progressbar').fadeOut();
        }
    },

    // 大文件上传时，在向服务端发送文件MD5校验码前触发
    _onBeforeMd5File: function (e) {
        e.data.commonDto = mini.encode(this.getCommonData());

        e.data[this.id + '_action'] = 'queryFileStatus';
        e.data[this.id + '_postData'] = this.postData;

        this.fire("beforemd5file", e);
    },

    // 大文件上传时，服务端校验MD5成功后触发的回调
    _onMd5File: function (response, file) {
        response = mini.getSecondRequestData(response);;
        // '1'表示请求处理成功
        if (response.status == '1') {
            var result = response.result;
            // 已经上传过
            if (result.fileFinished) {
                this._uploader.skipFile(file);
                this._hasFinishedList[file.id] = true;

                // 已上传过的应该直接将附件项设置为上传完成的状态，而不是把附件项删除
                var fileGuid = result.attachGuid,
                    downloadUrl = result.downloadUrl;

                if (fileGuid) {
                    jQuery('#' + file.id + ' > .mini-uploader-remove').attr('fileGuid', fileGuid);
                    if (downloadUrl) {
                        jQuery('#' + file.id + ' > .mini-uploader-info').attr('href', _rootPath + '/' + downloadUrl);
                    }
                }

            } else {
                this._existFileParts = result.existFileParts || '';
                this._existFileParts = ',' + this._existFileParts + ',';
            }
        }
    },
    // 大文件上传时，在文件上传完成时向服务端发送上传完成信息前触发
    _onBeforeMd5FileFinished: function (e) {
        e.data.commonDto = mini.encode(this.getCommonData());

        e.data[this.id + '_action'] = 'finishUpload';
        e.data[this.id + '_postData'] = this.postData;

        this.fire("beforemd5filefinished", e);
    },

    // 大文件上传时，文件上传成功后触发的回调
    _onMd5FileFinished: function (response, file) {
        var data = mini.getSecondRequestData(response);

        if (data.uploadFailed) {
            mini.alert(data.failedMsg || '上传失败！请重新上传！');
            this.removeFile(file);

            return;
        }
        
        data = data.result || data;

        if (this.showDefaultUI) {
            var fileGuid = data.attachGuid,
                downloadUrl = data.downloadUrl;

            if (fileGuid) {
                jQuery('#' + file.id + ' > .mini-uploader-remove').attr('fileGuid', fileGuid);
                if (downloadUrl) {
                    jQuery('#' + file.id + ' > .mini-uploader-info').attr('href', _rootPath + '/' + downloadUrl);
                }
            }
        }
        this.fire('finishedmd5file', {
            source: this,
            sender: this,
            type: 'finishedmd5file',
            file: file,
            data: data
        });

    },

    _getSize: function (size) {
        var K = 1024,
            M = 1048576;
        size = parseInt(size) || 0;

        if (size > M) {
            return (size / M).toFixed(2) + "M";
        } else {
            return (size / K).toFixed(2) + "K";
        }
    },

    getCommonData: function () {
        if (!this.controlData) {
            this.controlData = {
                id: this.id,
                type: "webuploader",
                mapClass: this.mapClass,
                action: this.action,
                showDefaultUI: this.showDefaultUI,
                needChunkLocal: this.needChunkLocal,
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

    setShowDefaultUI: function (showDefaultUI) {
        this.showDefaultUI = showDefaultUI;
        if (this.controlData) {
            this.controlData.showDefaultUI = showDefaultUI;
        }
    },

    setPostData: function (postData) {
        this.postData = postData;

    },
    
    secrecyLevelItems: [],
    _generateSecrecyLevelList: function () {
        var html = ['<ul class="mini-secrecylevel-list">'],
            item;

        for (var i = 0, l = this.secrecyLevelItems.length; i < l; i++) {
            item = this.secrecyLevelItems[i];
            html.push('<li guid="' + item.id + '">' + item.text + '</li>');
        }

        html.push('</ul>');

        this._$secrecyLevelList = jQuery(html.join('')).appendTo('body');

        var self = this;
        this._$secrecyLevelList.on('click', 'li', function () {
            var $this = $(this),
                guid = $this.attr('guid'),
                text = $this.text(),
                attachGuid = self._$secrecyLevelList.attr('guid');
            self._onSecrecyLevelChange(guid, text, attachGuid);
        });
    },

    showSecrecyLevelList: function ($target, fileGuid) {
        if (!this.showSecrecyLevel) {
            return;
        }
        if (!this._$secrecyLevelList) {
            this._generateSecrecyLevelList();
        }

        this._$currentSecrecyLevel = $target;

        var box = mini.getBox($target[0]);

        this._$secrecyLevelList.css({
            top: box.top + box.height,
            left: box.left - 20,
            display: 'block'
        }).attr('guid', fileGuid);
    },

    hideSecrecyLevelList: function () {
        this._$secrecyLevelList && this._$secrecyLevelList.hide();
    },

    _onSecrecyLevelChange: function (guid, text, attachGuid) {
        var self = this;
        var data = {
            commonDto: mini.encode(this.getCommonData())
        };
        data[this.id + "_action"] = 'updateSecrecyLevel';
        data[this.id + "_attachGuid"] = attachGuid;

        data[this.id + "_secrecyLevel"] = guid;
        // 此处不能用Util.ajax
        // 原因是回调中需要拿到后端返回的控件数据，而Util.ajax是会过滤掉控件数据的
        var xhr = $.ajax({
            url: this.uploadUrl,
            data: data,
            dataType: 'json',
            type: 'post'
        });

        xhr.done(function (data) {
            data = mini.getSecondRequestData(data);
            if (data.success) {
                self._$currentSecrecyLevel.text(text).attr('guid', guid);

                self.fire('secrecylevelchanged', {
                    sender: self,
                    eventType: "secrecylevelchanged",
                    fileGuid: attachGuid,
                    data: data
                });
            } else {
                var msg = data.msg || '保密等级保存失败！请重试';
                mini.showTips({
                    content: msg,
                    state: 'warning',
                    y: 'center'
                });
            }
        }).always(function () {
            self.hideSecrecyLevelList();
        });
    },

    setSecrecyLevels: function (data) {
        this.secrecyLevelItems = data.levels;

        if (this.defaultSecrecyLevel === undefined) {
            this.defaultSecrecyLevel = data['default'];
        }

        // 清空之前生成的下拉列表，防止data更新后，对应下拉列表没有更新
        if (this._$secrecyLevelList) {
            this._$secrecyLevelList.remove();
            this._$secrecyLevelList = undefined;
        }

        // 将之前计算出来的最高密级重置
        this._highestSecrecyLevel = undefined;

    },

    setShowSecrecyLevel: function(show) {
        this.showSecrecyLevel = show;

        if(show && !this._isBindSecrecyEvent) {
            this._bindSecrecyEvents();
        }
    },

    getHighestSecrecyLevel: function () {
        if (this._highestSecrecyLevel) {
            return this._highestSecrecyLevel;
        }

        if (!this.secrecyLevelItems || !this.secrecyLevelItems.length) {
            return {};
        }

        var item = this.secrecyLevelItems[0],
            i = 1,
            l = this.secrecyLevelItems.length;
        for (; i < l; i++) {
            if (this.secrecyLevelItems[i].id > item.id) {
                item = this.secrecyLevelItems[i];
            }
        }

        this._highestSecrecyLevel = item;

        return item;
    },

    getExtraAttrs: function (el) {
        var attrs = {};
        mini._ParseString(el, attrs, ["onfinishedmd5file", "onfilesuccess", "onfileremovesuccess", "postData", "onload", "onfileremove", "onsecrecylevelchanged"]);
        mini._ParseBool(el, attrs, ["dataImport", "showDefaultUI", "needChunkLocal"]);
        mini._ParseInt(el, attrs, ["fileNameLengthLimit"]);
        return attrs;
    }
});