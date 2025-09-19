//
// 环形进度条 + 模拟进度
(function() {
    var progressBar = {
        init: function(el) {
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
                //     console.log(value);
                // },
                release: function(value) {
                    // console.log(value);
                    that.$curr.text(value);
                }
            });
        },
        setValue: function(v) {
            this.$el.val(v).trigger('change');
        },
        // 模拟的基础时间
        baseTime: 1000 * 5,
        // 1s 的帧数
        secondFrames: 60,
        // 每一帧 进度条移动的速度
        getBaseV: function() {
            var s = 100;
            var t = this.baseTime;
            var v = (s / t) * ((1000 / this.secondFrames) >> 0);

            return v;
        },
        getValue: function() {
            return parseInt(this.$el.val());
        },

        // 请求完成的状态
        // 请求如果完成，且进度低于 50 则加速模拟
        // 请求如果未完成， 且进度大于 50 则减速
        requestDone: false,
        timer: null,

        // 模拟进度移动
        mockProgress: function(cb) {
            var v = this.getBaseV();
            var p = 0;
            var that = this;
            that.requestDone = false;

            var step = (1000 / this.secondFrames) >> 0;
            var isSpeedUp = false;
            go();

            var dtd = $.Deferred();

            return dtd.promise();

            function go() {
                clearTimeout(that.timer);
                p += v * 1;

                that.setValue(p);

                // 请求完成 进度仍小于 50 则速度加倍
                // 加速简单只考虑一次
                if (!isSpeedUp && that.requestDone) {
                    if (p <= 30) {
                        v = 4 * v;
                        isSpeedUp = true;
                    } else if (p <= 50) {
                        v = 2 * v;
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
                    setTimeout(function() {
                        if (typeof cb == 'function') {
                            cb();
                        }
                        dtd.resolve();
                    });
                }
            }

            // 减速检查点
            var checkPoint = 50;
            // 减速次数
            var speedDownTimes = 0;
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
        cancel: function() {
            clearTimeout(this.timer);
        }
    };
    progressBar.init();
    window.progressBar = progressBar;
})();

var uploader = mini.get('uploader');
var startBtn = mini.get('start-btn');

var $uploaderArea = $('#transform-content');
var $progressArea = $('.transform-progress-container');
var $resultArea = $('.transform-result');

// 模拟进度的 promise
var mockProgressPromise = $.Deferred().promise();

function switch2area(type) {
    $uploaderArea.addClass('hidden-accessible');
    $progressArea.addClass('hidden-accessible');
    $resultArea.addClass('hidden-accessible');
    if (type == 'uploader') {
        $uploaderArea.removeClass('hidden-accessible');
    } else if (type == 'progress') {
        $progressArea.removeClass('hidden-accessible');
    } else if (type == 'result') {
        $resultArea.removeClass('hidden-accessible error done');
    }
}

startBtn.setEnabled(false);

startBtn.on('click', function() {
    var webUploader = uploader.getUploader();
    // do really upload
    if (webUploader.getFiles().length) {
        startBtn.setEnabled(false);
        $('#toolbar').removeClass('done');
        // 开始模拟进度条
        switch2area('progress');
        progressBar.requestDone = false;
        mockProgressPromise = progressBar.mockProgress();
        Util.ajax({
            // 上传之前先删除，保证附件只有一个，只要是用于修改页面时
            url: 'formlistmanage/wordtransform/epointwordtransformaction.action?cmd=deleteAttachinfo',
             
        }).done(function(res) {
        	   // 开始上传
            webUploader.upload();
        })
     
    }
});

// 上传成功 开始第二次转化
function onUploadSuccess(e) {
    // mini.showTips({
    //     state: 'success',
    //     y: 'center',
    //     content: '上传成功'
    // });
    //console.log('上传成功');
    // console.log(e);

    // 上传完成 再发请求转化
    Util.ajax({
        // TODO 修改为转化地址
        url: 'formlistmanage/wordtransform/epointwordtransformaction.action?cmd=getAttachInfo',
        data: {
            // TODO 修改为实际guid
            fileGuid: '1'
        }
    })
        .done(function(res) {
            console.log('转化成功');
            // 转化完成的情况下标记请求完成 尽快完成进度条
            progressBar.requestDone = true;
            // 注册完成函数
            mockProgressPromise.then(function() {
                $('#toolbar').addClass('done');
                switch2area('result');
                $resultArea.addClass('done');
                mini.get('start-design')
                    .un('click')
                    .on('click', function()  {
                        // TODO 传参打开设计页面即可
                		window.open(Util.getRootPath()
            					+ "frame/pages/sformdesigner/designer?tableGuid="
            					+ res.tableGuid + "&designId=" +res.designId
            					+ "&isSub=" + Util.getUrlParams("isSub"));
                		epoint.closeDialog("success");
                    });
            });
        })
        .fail(function() {
            progressBar.requestDone = true;
            progressBar.cancel();
            // 请求出错
            switch2area('result');
            $resultArea.addClass('error');
        });
}

function onUploadError(e) {
    // mini.showTips({
    //     state: 'error',
    //     y: 'center',
    //     content: '上传失败'
    // });
    console.log('上传失败');

    progressBar.requestDone = true;
    progressBar.cancel();
    // 切换到出错
    switch2area('result');
    $resultArea.addClass('error');
}

function syncUploader2Drop(uploader, el) {
    // init 事件有 bug ie iframe  中加载页面时可能出现绑定事件时init已经触发而导致绑定事件无效的问题。
    // uploader.on('init', function(){})
    
    uploader.getUploaderPromise(function() {
        var $drop = $(el).find('.transform-drop-container');
        var $file = $(el).find('.transform-file-container');
        if (!$drop.length) {
            window.console && window.console.error && console.error('无法获取区域');
            return;
        }
        //  从控件上拿扩展名
        var limitTypes = uploader
            .getLimitType()
            .split(',')
            .map(function(item) {
                return '.' + item;
            })
            .join('或');
        $drop
            .find('.uploader-ext-info')
            .text(limitTypes)
            .attr('title', limitTypes);

        // 关联拖拽区域点击触发上传
        addBtnForUploader(uploader.id, $drop[0]);

        // 加入文件 时 拼接文件模板占位
        uploader.on('filesQueued', function(e) {
            var file = e.files[0];
            if (!file) return;
            var fileHtml = ['<span class="file-icon file-icon-', file.ext || '', '"></span>', '<span class="file-name">', file.name, '</span>'].join('');

            $file.html(fileHtml).show();
            $drop.addClass('showFile').css('z-index', Util.getZIndex());
            // 有文件时启用按钮
            startBtn.setEnabled(true);
        });
        // 文件加入前 如果之前有文件 先reset控件：cause 防止单次多个拖入，上传控件本身为单选，此处选择新的则替换旧的文件
        uploader.on('beforeFileQueued', function(e) {
            var oldFiles = uploader._uploader.getFiles();
            if (!oldFiles || !oldFiles.length) {
                return;
            }
            if (e.file) {
                uploader._uploader.reset();
            }
        });
        $drop.on('click', '.file-remove', function() {
            mini.confirm('确定移除此文件', '系统提醒', function(a) {
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
            startBtn.setEnabled(false);
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
            addUploaderBtnTimer = setTimeout(function() {
                addBtnForUploader(uid, el);
            }, 50);
        }
    }
}
syncUploader2Drop(uploader, $('#transform-content'));
