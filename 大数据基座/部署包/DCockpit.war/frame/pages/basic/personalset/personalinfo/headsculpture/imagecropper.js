/**
 * 图片裁剪插件
 * author:陈东顺
 * date:2016-09-13
 */

(function (win, $) {

    // var $imgCropper = $('#head-sculpture-img');
    // $dataX = $('#dataX'),
    // $dataY = $('#dataY'),
    // $dataHeight = $('#dataHeight'),
    // $dataWidth = $('#dataWidth'),
    // $dataRotate = $('#dataRotate'),
    // $dataScaleX = $('#dataScaleX'),
    // $dataScaleY = $('#dataScaleY'),
    // cropperInfo = {}; // 记录crop信息
    // 初始化设置
    var DEFAULT_CFG = {
        // 带裁剪的图片的img
        cropper: '',
        // aspectRatio: 16 / 9,
        dragMode: 'move',
        aspectRatio: 1,
        cropBoxResizable: true,
        viewMode: 2,
        zoomOnWheel: true,
        autoCropArea: 0.9,
        // cropBoxResizable:false, // 是否可以更换大小
        preview: '.image-preview',
        crop: function (e) {

        },
        autoInit: true
    };

    function ImgCropper(cfg) {
        var $imgCropper;
        if (!cfg || !cfg.cropper) {
            throw new Error('必须指定要裁剪的图片');

        } else if (!($imgCropper = $(cfg.cropper)).length) {
            throw new Error('指定要裁剪的图片不存在');
        }

        this.$imgCropper = $imgCropper;

        this.cfg = $.extend({}, DEFAULT_CFG, cfg);
        this.useroptions = $.extend({}, this.cfg);
        // 用户操作后的设置
        this.nowOptions = $.extend({}, this.cfg);
        if (this.cfg.autoInit) {
            this.init();
        }
    }

    $.extend(ImgCropper.prototype, {

        // 生成
        initView: function (settings) {
            settings = settings || {};
            return this.$imgCropper.cropper('destroy')
                .cropper($.extend(this.nowOptions, settings));
        },
        init: function () {
            this.initView(this.cfg);
        },
        // 设置Drag模式 mode为move / crop / none
        setDragMode: function (mode) {
            this.nowOptions.dragMode = mode;
            return this.$imgCropper.cropper('setDragMode', mode);
        },
        // 放大
        zoomIn: function () {
            return this.$imgCropper.cropper('zoom', 0.1);
        },
        // 缩小
        zoomOut: function () {
            return this.$imgCropper.cropper('zoom', -0.1);
        },
        // 缩放到 参数为基于原图的显示比例，即1表示显示实际的大小，不指定则缩放至实际大小
        zoomTo: function (ratio) {
            return this.$imgCropper.cropper('zoomTo', ratio === undefined ? 1 : ratio);
        },
        // 移动
        move: function (xpix, ypix) {
            var x = xpix === undefined ? -10 : xpix,
                y = ypix === undefined ? -10 : ypix;
            return this.$imgCropper.cropper('move', x, y);
        },
        // 移动到
        moveTo: function (x, y) {
            return this.$imgCropper.cropper('moveTo', x === undefined ? 0 : x, y === undefined ? 0 : y);
        },
        // 裁剪框移动
        cropperMove: function (xpix, ypix) {
            var xstep = xpix === undefined ? -10 : xpix;
            var ystep = ypix === undefined ? -10 : ypix;
            var data = this.$imgCropper.cropper('getData', true);
            data.x += xstep;
            data.y += ystep;
            if (data.x < 0) data.x = 0;
            if (data.y < 0) data.y = 0;
            return this.$imgCropper.cropper('setData', data);
        },
        // 裁剪框移动到
        cropperMoveTo: function (x, y) {
            var data = this.$imgCropper.cropper('getData', true);
            data.x = x === undefined ? 0 : x;
            data.y = y === undefined ? 0 : y;
            return this.$imgCropper.cropper('setData', data);
        },
        // 旋转指定角度 参数为旋转角度，左旋为负值，右旋为正，不指定则右旋90度
        rotate: function (deg) {
            return this.$imgCropper.cropper('clear').cropper('rotate', deg === undefined ? 90 : deg).cropper('crop');
        },
        // 旋转到指定角度 参数为旋转角度，左旋为负值，右旋为正，不指定则复原
        rotateTo: function (deg) {
            return this.$imgCropper.cropper('clear').cropper('rotate', deg === undefined ? 0 : deg).cropper('crop');
        },
        // 水平镜像
        scaleX: function () {
            return this.$imgCropper.cropper('scaleX', -this.$imgCropper.cropper('getData').scaleX);
        },
        // 垂直镜像
        scaleY: function () {
            return this.$imgCropper.cropper('scaleY', -this.$imgCropper.cropper('getData').scaleY);
        },
        // 设置裁剪比例 参数为要设置的比例（Number类型），非数值则为任意
        setAspectRatio: function (ratio) {
            this.nowOptions.aspectRatio = ratio;
            this.reset();
            return this.$imgCropper.cropper('setAspectRatio', ratio);

        },
        // 设置裁剪框大小
        setCropperImgInfo: function (data) {
            var cropperImgData = {};
            // 设置裁剪框不可拖动调整大小 移动模式 不可缩放 不可鼠标切换模式
            cropperImgData.cropBoxResizable = false;
            cropperImgData.dragMode = 'move';
            cropperImgData.zoomable = false;
            cropperImgData.toggleDragModeOnDblclick = false;
            // 指定裁剪框数据
            cropperImgData.data = $.extend({}, this.$imgCropper.cropper('getData', true), data);

            this.$imgCropper.cropper('destroy')
                .cropper($.extend({}, this.useroptions, cropperImgData)).cropper('crop');
            // 缩放至合适大小
            // setTimeout(imgCropper.zoomTo, 200);
            //imgCropper.cropperMoveTo(data.x,data.y);

        },
        // 重置
        reset: function () {
            this.$imgCropper.cropper('destroy')
                .cropper($.extend(this.nowOptions, this.useroptions));

        },
        // 获取裁剪图片的信息（位置大小） 参数表示是否取整，默认为true
        getCropperImgInfo: function (rounded) {
            return this.$imgCropper.cropper('getData', rounded === undefined ? true : !!rounded);
        },
        // 获取图片数据 data可将裁剪后的图片按照指定大小生成,data示例{width:400,height:300} ,type为生成图片的格式，默认为jpeg
        getData: function (data, type) {
            var result = {};
            // 位置大小信息
            result.info = this.$imgCropper.cropper('getData', true);
            // 裁剪后的图片数据信息
            if (type === undefined) type = 'jpeg';
            result.data = this.$imgCropper.cropper('getCroppedCanvas', data).toDataURL('image/' + type);
            return result;
        },
        // 获取当前缩放比例 实际/原始
        getZoom: function () {
            var data = this.$imgCropper.cropper('getCanvasData');
            return data.width / data.naturalWidth;
        }
    });

    win.ImgCropper = ImgCropper;

})(window, jQuery);