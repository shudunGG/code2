// tabview
(function (win, $) {
    var defaultSettings = {
        // 默认选中的tab项，从0计数
        activeIndex: 0,
        // 容器dom对象
        dom: null,
        // 触发tab切换的事件：click|mouseover
        triggerEvent: 'click',
        // 高亮时的样式名
        activeCls: 'active',
        onchange: function (index) {

        }
    };

    win.TabView = function (opts) {
        this.cfg = $.extend({}, defaultSettings, opts);

        this._initView();
        this._initEvent();
    };

    /* global TabView */
    $.extend(TabView.prototype, {
        _initView: function () {
            var c = this.cfg;

            var $widget = $(c.dom),

                $widgetHd = $widget.find('> [data-role="head"]'),
                $widgetBd = $widget.find('> [data-role="body"]');

            $.extend(this, {
                $widgetHd: $widgetHd,
                $tabBody: $widgetBd
            });

            this.activeTabByIndex(c.activeIndex);
        },

        _initEvent: function () {
            var c = this.cfg,
                triggerEvent = c.triggerEvent,

                $widgetHd = this.$widgetHd,
                self = this;

            // 用于mouseover触发时的延时
            var overTimer = 0;

            if (triggerEvent == 'click') {
                $widgetHd.on('click', '[data-role="tab"]', function (event) {
                    event.preventDefault();

                    $.proxy(self._activeTab, self, $(this))();
                });

            } else if (triggerEvent == 'mouseover') {
                $widgetHd.on('mouseover', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);

                    overTimer = setTimeout($.proxy(self._activeTab, self, $(this)), 500);

                }).on('mouseout', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);
                });
            }
        },

        _activeTab: function ($tab) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$widgetHd.find('[data-role="tab"]');

            var targetId = $tab.data('target');

            $tabs.removeClass(activeCls);
            $tab.addClass(activeCls);

            this._activeTabContent(targetId);

        },

        // 通过index激活对应tab
        activeTabByIndex: function (index) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$widgetHd.find('[data-role="tab"]'),

                $activeTab = null,
                targetId = '';

            // 若index合法
            if (index >= 0 && index < $tabs.length) {
                $activeTab = $tabs.removeClass(activeCls).eq(index).addClass(activeCls);

                targetId = $activeTab.data('target');

                this._activeTabContent(targetId);
            }
        },

        _activeTabContent: function (targetId) {
            var $tabCons = this.$tabBody.find('> [data-role="tab-content"]');

            var $tabcon = $tabCons.addClass('hidden')
                .filter('[data-id="' + targetId + '"]')
                .removeClass('hidden');

            var $tab = this.$widgetHd.find('[data-role="tab"][data-target="' + targetId + '"]');
            // 创建iframe
            if (!$tabcon.length && $tab.attr('url')) {
                $('<div class="tabview-body-item " data-id="' + targetId + '" data-role="tab-content" ></div>').append('<iframe class="tab-content" src="' + Util.getRightUrl($tab.attr('url')) + '" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>')
                    .appendTo(this.$tabBody);
            }
            // this.cfg.onchange({
            //     tab:'',
            //     tabCon:$tabcon
            // });
        }
    });
    var isFirst = true;
    new TabView({
        dom: '#main-view',
        onchange: function (targetId) {
            if (isFirst && targetId == 'two') {
                isFirst = false;
                // 激活第二个时
                // 为个性签名创建新按钮
                addBtnForUploader('uploader2', '#signature-upload-btn');
            }
        }
    });
}(this, jQuery));


var addUploaderBtnTimer = {};

function addBtnForUploader(uid, el) {
    var u = mini.get(uid).getUploader();

    if (u) {
        u.addButton({
            id: el
        });
        clearTimeout(addUploaderBtnTimer[uid]);
    } else {
        var args = arguments;
        addUploaderBtnTimer[uid] = setTimeout(function () {
            addBtnForUploader.apply(undefined, args);
        }, 50);
    }
}

// 头像相关
(function (win, $) {

    var $userImg = $('#portrait-img'),
        $resetUserImg = $('#portrait-remove');

    var URL = window.URL || window.webkitURL,
        isSupportCropper = URL && URL.createObjectURL && window.FileReader && FileReader.prototype.readAsDataURL;

    // 重置头像
    $resetUserImg.on('click', function () {
        var $this = $(this);
        if ($this.hasClass('hidden')) {
            return;
        }
        epoint.confirm('确定删除头像，重设为默认头像', '重置确认', function () {
            Util.ajax({
                url: resetPortraitUrl
            }).done(function (data) {
                if (data && data.portrait) {
                    $userImg.attr('src', data.portrait);
                    top.postMessage(JSON.stringify({
                        type: 'userPortraitChange',
                        imgData: data.portrait
                    }), '*');
                    epoint.showTips('重置成功');
                    $this.addClass('hidden');
                }
            });

        });
    });

    // 支持本地裁剪
    if (isSupportCropper) {
        initHeadCropper($('#portrait-edit'));
    } else {
        // IE9- 为用户头像创建新按钮
        addBtnForUploader('uploader', '#portrait-edit');
    }

    function initDom() {
        var elString = '<div class="mini-window" id="head-sculpture-window" style="width: 478px;height: 422px;width: 4.78rem;height: 4.22rem;" title="修改头像"><div class="head-sculpture-container is-empty" id="head-sculpture-container"><input type="file" id="inputImage" name="file" accept="image/*" style="position:absolute;top:-200px;"><p class="info">最佳图片尺寸:240*240px，且图片小于5M</p><!-- 图片裁剪区域 --><div class="img-cropper"><img id="head-sculpture-img"><label for="inputImage" class="select-img" title="选择图片"></label><label id="take-img" class="take-img" title="在线拍照" ></label></div><div class="right"><span class="preview-text">预览</span><div class="image-preview" style="width:100px;height:100px;width:1rem;height:1rem;overflow: hidden;"></div><span class="info">100*100</span><div class="image-preview" style="width:28px;height:28px;width:0.28rem;height:0.28rem;overflow: hidden;"></div><span class="info">28*28</span></div><div class="re-change"><label class="change-img" for="inputImage">重新选择</label><label class="re-take-img">在线拍照</label></div><div class="footer"><span class="save btn">保存</span><span class="cancel btn">取消</span></div></div></div>' +
            '<div class="mini-window" id="take-photo-window" title="在线拍照" style="width:362px;height:446px;width:3.62rem;height:4.46rem;"><div class="take-photo" class="take-photo" style="min-height:408px;"><div id="camera" class="take-photo-camera"><div id="camera-live" class="camera-live"></div><img class="aimimg-preview"><span id="take-photo-btn" class="btn btn-capture hidden" title="拍照" tips="可按空格键拍照"></span><span id="retake-photo-btn" class="btn btn-recapture" title="重新拍照" tips="重新拍照"></span><span class="waiting">加载中</span></div><div class="take-photo-footer"><span class="mini-button" id="use-aim-btn" enabled="false">使用照片</span></div></div></div>';

        $(elString).appendTo('body');
        mini.parse();
    }

    function initHeadCropper($btn) {
        var imgCropper = {
            init: function () {
                throw new Error('裁剪资源加载失败');
            }
        };

        initDom();
        imgCropper = new ImgCropper({
            cropper: '#head-sculpture-img',
            autoInit: false
        });
        window.imgCropper = imgCropper;

        var cropperWindow = mini.get('head-sculpture-window');
        var $cropPreview = $('.image-preview', cropperWindow.el);
        var cropWinOldShow = cropperWindow.show;
        cropperWindow.show = function () {
            // 预览形式展示原始图像
            var src = $userImg.attr('src');
            $image.attr('src', src);
            var $img = $('<img src="' + src + '" style="width:100%;height:100%;"/>');
            $cropPreview.eq(0).empty().append($img);
            $cropPreview.eq(1).empty().append($img.clone());
            try {
                imgCropper.$imgCropper.cropper('destroy');
            } catch (error) {}
            $container.addClass('is-empty');
            cropWinOldShow.apply(cropperWindow, arguments);
        };

        var $container = $('#head-sculpture-container');

        // chroem 非本地 非https不支持拍照
        if (Util.browsers.isWebkit && location.hostname !== 'localhost' && !/https/.test(location.protocol)) {
            $container.addClass('hide-takephoto');
        }

        var $image = $('#head-sculpture-img');
        var $inputImage = $('#inputImage');
        var URL = window.URL || window.webkitURL;
        var blobURL;
        if (URL) {
            $inputImage.change(function () {
                var files = this.files;
                var file;

                if (files && files.length) {


                    file = files[0];
                    // 不能大于 5m
                    if (file.size > 5242880) {
                        return epoint.alert('图片不能超过5M');
                    }

                    if (/^image\/\w+$/.test(file.type)) {

                        var reader = new FileReader();
                        reader.addEventListener("load", function () {
                            $image.attr('src', reader.result);
                            $inputImage.val('');
                            imgCropper.init();
                            $container.removeClass('is-empty');
                        }, false);
                        reader.readAsDataURL(file);

                        // Blob 和 mock 有冲突 用FileReader吧
                        // blobURL = URL.createObjectURL(file);
                        // $image.attr('src', blobURL);
                        // $inputImage.val('');
                        // isInit = true;
                        // imgCropper.init();
                        // $container.removeClass('is-empty');

                    } else {
                        epoint.alert('请选择有效的图片文件');
                    }
                }
            });
        } else {
            $inputImage.prop('disabled', true);
        }

        function verifyCropperImgSize(imgData) {
            // console.log(imgData);
            var str = imgData.substr(22);
            str = str.replace(/=/g, '');
            // console.log(str);
            var len = str.length;
            var fileSize = (len - len / 8 * 2) / 1024;
            // console.log(fileSize);
            if (fileSize >= 5120) {
                return false;
            }
            return true;
        }

        $container.on('click', '.footer > .btn', function () {
            var $this = $(this);
            if ($this.hasClass('save')) {
                if ($container.hasClass('is-empty')) {
                    return mini.alert('请选择图片或在线拍照');
                }
                var imgData;
                try {
                    // 大图裁剪可能较慢
                    imgData = imgCropper.getData().data;
                    if (!verifyCropperImgSize(imgData)) {
                        epoint.showTips('图片过大，已经超过5M，请选择较小的图片或更小的裁剪区域', {
                            state: 'danger',
                            timeout: 3000
                        });
                        return;
                    }
                    saveHeadCropper(imgData).done(function (data) {
                        if (data.success) {
                            $userImg.attr('src', imgData);

                            // 发消息更新主界面头像
                            top.postMessage(JSON.stringify({
                                type: 'userPortraitChange',
                                imgData: imgData
                            }), '*');

                            imgCropper.$imgCropper.cropper('destroy');
                            $image.attr('src', '');
                            $container.addClass('is-empty');
                            cropperWindow.hide();
                            epoint.showTips('保存成功', {
                                state: 'success'
                            });
                            $resetUserImg.removeClass('hidden');
                        }
                    }).done(function () {

                    });
                } catch (error) {
                    // cropperWindow.hide();
                    epoint.showTips('修改失败', {
                        state: 'danger'
                    });
                }

            } else if ($this.hasClass('cancel')) {
                cropperWindow.hide();
            }
        });

        $btn.on('click', function () {
            cropperWindow.show();
        });

        function saveHeadCropper(data) {
            var imgData = data;
            epoint.showLoading();
            return Util.ajax({
                url: cropperImgUploadUrl,
                data: {
                    imgData: imgData
                }
            }).always(function () {
                epoint.hideLoading();
            });
        }

        var TAKE_PHOTO_HEIGHT = 566;
        // 拍照窗口
        $(cropperWindow.el).on('click', '.take-img,.re-take-img', function () {
            var h = $(window).height();
            if (h < TAKE_PHOTO_HEIGHT) {
                takePhotoWin.el.style.height = h + 'px';
                takePhotoWin.show();
                epoint.showTips('窗口高度过小，请将浏览器最大化，以保证最佳可视效果', {
                    state: 'info'
                });
            } else {
                takePhotoWin.show();
            }
        });
        // 点击拍照
        $('#take-photo-btn').on('click', function () {
            Webcam.snap(function (dataUrl, originCanvas) {
                $imgpreview.attr('src', dataUrl);
                // 拍照后进入预览
                $camera.addClass('in-preview');
                useAimImgBtn.setEnabled(true);
            });
        });
        // 重新拍照
        $('#retake-photo-btn').on('click', function () {
            $camera.removeClass('in-preview');
            useAimImgBtn.setEnabled(false);
        });
        var takePhotoWin = mini.get('#take-photo-window');
        // 相机区域
        var $camera = $('#camera'),
            $cameraLive = $('#camera-live'),
            // 预览容器
            $imgpreview = $('.aimimg-preview', $camera);
        // 确定按钮
        var useAimImgBtn = mini.get('use-aim-btn');

        // 确定使用图片
        useAimImgBtn.on('click', function () {
            if ($camera.hasClass('in-preview')) {
                $image.attr('src', $imgpreview.attr('src'));
                imgCropper.init();

                $container.removeClass('is-empty');
                takePhotoWin.hide();
            }
        });

        // 重写show和hide方法进行一些操作
        (function () {
            var oldShow = takePhotoWin.show;
            takePhotoWin.show = function () {
                $captureBtn.addClass('hidden');
                useAimImgBtn.setEnabled(false);
                $camera.removeClass('in-preview');

                oldShow.apply(takePhotoWin, arguments);
                var isReady = true;
                try {
                    Webcam.attach('#camera-live');
                } catch (error) {
                    console.error(error);
                    isReady = false;
                }
                if (isReady) {
                    // 摄像头占用时（如一个浏览器在使用时，另一个浏览器再次进入） 无法正常检查到 因此做此处理
                    // 暂时以一分钟未进入live或者error判断
                    $camera.addClass('loading');
                    enableTimer = setTimeout(function () {
                        $camera.removeClass('loading');
                        autoCloseTakePhoto('在线拍照未就绪，请允许使用摄像头或检查摄像头是否正常');
                    }, 1000 * 30);
                }
            };
            var oldHide = takePhotoWin.hide;
            takePhotoWin.hide = function () {
                clearEnableTimer();
                try {
                    Webcam.reset();
                } catch (error) {
                    console.error(error);
                }
                oldHide.apply(takePhotoWin, arguments);
            };
        })();

        // 空白键拍照
        $(takePhotoWin.el).on('keypress', function (e) {
            if (e.which === 32 && !$captureBtn.hasClass('hidden')) {
                $captureBtn.trigger('click');
            }
        }).on('click', function (e) {
            // 空白处点击取消
            // var $target = $(e.target);
            // if (!$target.closest('.aimimg-preview, .photo-preview').length) {
            //     $camera.removeClass('in-preview');
            //     $('.swiper-slide').removeClass('active');
            //     useAimImgBtn.setEnabled(false);
            // }
        });
        var $captureBtn = $('.btn-capture', takePhotoWin.el);

        // 初始化拍照
        Webcam.set({
            // live preview size
            width: 480,
            height: 360,

            // device capture size
            dest_width: 480,
            dest_height: 360,

            // final cropped size
            crop_width: 360,
            crop_height: 360,

            // format and quality
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.set('constraints', {
            width: 480,
            height: 360
        });
        Webcam.on('load', function () {
            // console.log('Webcam load');
        });
        var enableTimer;
        Webcam.on('live', function () {
            // camera is live, showing preview image
            // (and user has allowed access)
            // console.log('Webcam live');
            $captureBtn.removeClass('hidden');
            clearEnableTimer();
        });

        Webcam.on('error', function (err) {
            // an error occurred (see 'err')
            console.error(err);
            autoCloseTakePhoto(err.name + ':' + err.message);
            clearEnableTimer();
        });

        function clearEnableTimer() {
            $camera.removeClass('loading');
            clearTimeout(enableTimer);
        }


        // 自动关闭拍照，用于无摄像头或用户拒绝等不支持的情况
        function autoCloseTakePhoto(info) {
            epoint.alert(info, '系统提醒', function () {
                $captureBtn.addClass('hidden');
                takePhotoWin.hide();
            }, 'error');
        }
    }
})(this, jQuery);