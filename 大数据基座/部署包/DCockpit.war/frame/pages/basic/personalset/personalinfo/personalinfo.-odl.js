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

    var URL = window.URL || window.webkitURL;

    // 支持本地裁剪
    if (URL && URL.createObjectURL && window.FileReader && FileReader.prototype.readAsDataURL) {
        initHeadCropper($('#portrait-edit'));
    } else {
        // IE9- 为用户头像创建新按钮
        addBtnForUploader('uploader', '#portrait-edit');
    }

    function initDom() {
        var elString = '<div class="mini-window" id="head-sculpture-window" style="width: 478px;    height: 422px;" title="修改头像"><div class="head-sculpture-container is-empty" id="head-sculpture-container"><input type="file" id="inputImage" name="file" accept="image/*" style="position:absolute;top:-200px;"><p class="info">最佳图片尺寸:240*240px，且图片小于5M</p><!-- 图片裁剪区域 --><div class="img-cropper"><img id="head-sculpture-img"><label for="inputImage" class="select-img" title="选择图片"></label><label id="take-img" class="take-img" title="在线拍照" ></label></div><div class="right"><span class="preview-text">预览</span><div class="image-preview" style="width:100px;height:100px;overflow: hidden;"></div><span class="info">100*100</span><div class="image-preview" style="width:28px;height:28px;overflow: hidden;"></div><span class="info">28*28</span></div><div class="re-change"><label class="change-img" for="inputImage">重新选择</label><label class="re-take-img">在线拍照</label></div><div class="footer"><span class="save btn">保存</span><span class="cancel btn">取消</span></div></div></div>' +
            '<div class="mini-window" id="take-photo-window" title="在线拍照" style="width:482px;height:560px;"><div class="take-photo" class="take-photo"><div id="camera" class="take-photo-camera"><img class="aimimg-preview"><span id="take-photo-btn" class="btn btn-capture hidden" title="拍照" tips="可按空格键拍照"></span></div><div class="swiper-container"><div class="swiper-wrapper photo-preview " id="photo-preview"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="swiper-pagination hidden"></div></div><div class="take-photo-footer"><span class="mini-button" id="use-aim-btn" enabled="false">使用照片</span></div></div></div>';

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
            $cropPreview.eq(0).append($img);
            $cropPreview.eq(1).append($img.clone());
            try {
                imgCropper.$imgCropper.cropper('destroy');
            } catch (error) {}
            $container.addClass('is-empty');
            cropWinOldShow.apply(cropperWindow, arguments);
        };

        var $container = $('#head-sculpture-container');

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

        $container.on('click', '.footer > .btn', function () {
            var $this = $(this);
            if ($this.hasClass('save')) {
                if ($container.hasClass('is-empty')) {
                    mini.alert('请选择图片或在线拍照');
                }
                var imgData;
                try {
                    imgData = imgCropper.getData().data;
                    saveHeadCropper(imgData).done(function (data) {
                        if (data.success) {
                            $userImg.attr('src', imgData);

                            imgCropper.$imgCropper.cropper('destroy');
                            $image.attr('src', '');
                            $container.addClass('is-empty');
                            cropperWindow.hide();
                            epoint.showTips('保存成功', {
                                state: 'success'
                            });
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

        var $userImg = $('#portrait-img');

        function saveHeadCropper(data) {
            var imgData = data;

            return Util.ajax({
                url: cropperImgUploadUrl,
                data: {
                    imgData: imgData
                }
            });
        }


        // 拍照窗口
        $(cropperWindow.el).on('click', '.take-img,.re-take-img', function () {
            takePhotoWin.show();
        });
        $('#take-photo-btn').on('click', function () {
            webcam.capture();
        });
        var takePhotoWin = mini.get('#take-photo-window');
        // 相机区域
        var $camera = $('#camera'),
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

        // 预览容器
        var photoPreview = document.getElementById('photo-preview');
        // 重写show方法进行一些操作
        var oldShow = takePhotoWin.show;
        var $prevAndNext = $('.swiper-button-next').add('.swiper-button-prev');
        takePhotoWin.show = function () {
            $captureBtn.addClass('hidden');
            // if (!$(photoPreview).children().length) {
            //     $prevAndNext.addClass('hidden');
            // }
            // photoPreview.innerHTML='';
            swiper.removeAllSlides();
            $prevAndNext.addClass('hidden');
            oldShow.apply(takePhotoWin, arguments);
        };
        // 点击预览

        $(photoPreview).on('click', '.swiper-slide', function () {
            var $this = $(this);
            $this.addClass('active')
                .siblings().removeClass('active');
            $camera.addClass('in-preview');
            var canvas = $this.find('canvas')[0];
            $imgpreview.attr('src', canvas.toDataURL('image/jpeg'));
            useAimImgBtn.setEnabled(true);
        });

        // 空白键拍照
        $(takePhotoWin.el).on('keypress', function (e) {
            if (e.which === 32 && !$captureBtn.hasClass('hidden')) {
                $captureBtn.trigger('click');
            }
        }).on('click', function (e) {
            // 空白处点击取消
            var $target = $(e.target);
            if (!$target.closest('.aimimg-preview, .photo-preview').length) {
                $camera.removeClass('in-preview');
                $('.swiper-slide').removeClass('active');
                useAimImgBtn.setEnabled(false);
            }
        });
        var $captureBtn = $('.btn-capture', takePhotoWin.el);
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            centeredSlides: true,
            slideToClickedSlide: true,
            // pagination: {
            //     el: '.swiper-pagination',
            //     clickable: true,
            // },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });

        // 构建拍照图片的数据对象 imageData  
        // IE 不支持构造函数形式，故以canvas获取
        var imgData = (function () {
            if (typeof window.ImageData == 'function') {
                return new ImageData(320, 240);
            }
            var canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 240;
            var data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            canvas = null;
            return data;
        })();
        // 像素点位置
        // webcam 在拍照后逐行触发 onSave 事件 数据为每行的像素点数据 需要据此标记是否将整张图像处理完毕
        var pos = 0;
        // 初始化拍照
        $camera.webcam({
            width: 480,
            height: 360,
            quality: 100,
            mode: "callback",
            swffile: "./headsculpture/jquery.webcam/jscam_canvas_only.swf",
            onTick: function (remain) {
                console.log(remain);
            },
            onSave: function (data) {
                // 此处data为每行数据
                // console.log(data);
                var col = data.split(';');

                for (var i = 0; i < 320; i++) {
                    var tmp = parseInt(col[i], 10);
                    imgData.data[pos + 0] = (tmp >> 16) & 0xff;
                    imgData.data[pos + 1] = (tmp >> 8) & 0xff;
                    imgData.data[pos + 2] = tmp & 0xff;
                    imgData.data[pos + 3] = 0xff;
                    pos += 4;
                }

                // 检查是否完毕
                if (pos >= 4 * 320 * 240) {
                    pos = 0;
                    var canvas = document.createElement('canvas');
                    canvas.width = 320;
                    canvas.height = 240;
                    var ctx = canvas.getContext('2d');
                    ctx.putImageData(imgData, 0, 0);

                    if (swiper.slides.length > 5) {
                        swiper.removeSlide(5);
                    }

                    swiper.prependSlide('<div class="swiper-slide"></div>');
                    $(canvas).prependTo($(photoPreview).children().eq(0));
                    swiper.update();
                    swiper.slideTo(0);
                    $prevAndNext.removeClass('hidden');
                }
            },
            onCapture: function () {
                console.log('拍照');
                webcam.save();
            },
            debug: function (type, string) {
                console.log(type + ": " + string);
                // 源码未将用户点击拒绝的状态抛出，暂时以输出信息进行判断
                // 参考 .\headsculpture\jquery.webcam\src\jscam.as
                if (type === 'notify' && string === 'Camera stopped') {
                    autoCloseTakePhoto('not permission');
                } else if (type === 'notify' && string === 'Camera started') {
                    $captureBtn.removeClass('hidden');
                }
            },
            onLoad: function () {
                console.log('load');
                var cams;
                try {
                    cams = webcam.getCameraList();
                } catch (err) {
                    console.log(err);
                    autoCloseTakePhoto('unsupport');
                }
                if (!cams || !cams.length) {
                    autoCloseTakePhoto('unsupport');
                }
            }
        });
        // 自动关闭拍照，用于无摄像头或用户拒绝等不支持的情况
        function autoCloseTakePhoto(c) {
            var info = '';
            switch (c) {
                case 'not permission':
                    info = '必须允许使用摄像头才能进拍照！';
                    break;
                case 'unsupport':
                    info = '您的电脑不支持拍照，请检查摄像头是否正常。您可以选择本地图片';
                    break;
                default:
                    info = '出现错误，暂无法拍照，请选择本地图片';
                    break;
            }
            info && epoint.alert(info, '系统提醒', function () {
                $captureBtn.addClass('hidden');
                takePhotoWin.hide();
            });
        }
    }
})(this, jQuery);