/*
 * @Author: jjj 
 * @Date: 2019-07-29 16:58:04 
 * @Last Modified by: jjj
 * @Last Modified time: 2019-07-31 10:34:36
 * @Description: '标尺插件，基于张鑫旭的插件进行修改' 
 */
(function (win, $) {
    
    var defaultConfig = {
        target: "body", // 标尺所在目标，默认为body
        rulerId: "rulerBox", // 标尺的id
        dragFlag: false,
        oDrag:  null
    }

    var SCALE_H = 18; // 刻度的高度
    var PageRuler = function(cfg) {
        this.cfg = $.extend({}, defaultConfig, cfg);
        this.$pageRuler = $(this.cfg.target); // 标尺对应的目标对象
        this.$container = $(this.cfg.container);
        this.rulerId = this.cfg.rulerId;
        // this.$rulerBox = $('#' + this.rulerId); // 标尺
        this.lineFlag = false;
        this.cacheLine = null; // 缓存最后选择的连线，用于删除
        this._init();
    };

    $.extend(PageRuler.prototype, {
        _init: function() {
            
            $('<div class="ruleScaleBox" id="'+this.rulerId+'" onselectstart="return false;"><div class="ruleScaleRuler_h"></div><div class="ruleScaleRuler_v"></div><div class="ruleRefDot_h"></div><div class="ruleRefDot_v"></div></div></div>')
            .appendTo(this.$container);
            
            var _$rulerBox = this.$rulerBox = $('#' + this.rulerId); // 标尺
            
            this.$rulerH = $(".ruleScaleRuler_h", _$rulerBox);
            this.$rulerV = $(".ruleScaleRuler_v", _$rulerBox);
            this.$dotH = $(".ruleRefDot_h", _$rulerBox);
            this.$dotV = $(".ruleRefDot_v", _$rulerBox);
            this.$bg = $(".ruleRefCrtBg", _$rulerBox);
            this.$close = $(".ruleRefCrtClose", _$rulerBox);
            this.$crtV = $(".ruleCrtV", _$rulerBox);
            this.$crtH = $(".ruleCrtH", _$rulerBox);

            this.renderRuler();

            this._bindEvent();
        },
        _bindEvent: function() {
            var _this = this;

            $('body')
            // 竖向参考线的垂直拖移
            .on('mousedown', this.cfg.container +' .ruleRefLine_v', function() {
                 _this.cfg.oDrag = $(this);
                 _this.cacheLine = $(this);
                _this.lineFlag = true;
                
                _this.cfg.dragFlag = true;
                _this.moveV();
            })
            // 横向参考线的垂直拖移
            .on('mousedown', this.cfg.container +' .ruleRefLine_h', function() {
                _this.cfg.oDrag = $(this);
                _this.cacheLine = $(this);
                _this.lineFlag = true;
                _this.cfg.dragFlag = true;
                _this.moveH();
            })
            $(document).off('keyup').on('keyup', function (e) {
                if (e.keyCode === 46) {
                    // delete 按钮
                    _this.hideLine();
                } else if (e.keyCode === 76) {
                    // esc 隐藏所有的线
                    _this.toggleAllLine();
                }
            }).on('mouseup', function (e) {
                $(this).unbind("mousemove");
                _this.cfg.dragFlag = false;
                if (_this.cfg.oDrag) {
                    if (_this.cfg.oDrag.hasClass("ruleRefLine_v")) {
                        var v_l = e.pageX - _this.pos.left;
                        if (v_l < _this.$rulerV.width() || v_l >= _this.rulerBoxSize.w) {
                            _this.cfg.oDrag.remove();
                        } else {
                            _this.cfg.oDrag.css("left", v_l - 1).attr("title", v_l + "px");
                        }
                        
                    } else {
                        var v_t = e.pageY - $(window).scrollTop()- _this.pos.left;
                        if (v_t < _this.$rulerH.height() || v_t >= _this.rulerBoxSize.h) {
                            _this.cfg.oDrag.remove();
                        } else {
                            _this.cfg.oDrag.css("top", v_t - 1).attr("title", v_t  + "px");
                        }
                    }
                }
                _this.cfg.oDrag = null;
                _this.$dotV.css("left", -10);
                _this.$dotH.css("top", -10);
            });

            //拖动标尺创建新的参考线
            this.$rulerV.on("mousedown", function () {
                _this.cfg.oDrag = _this.createV();
                _this.cfg.dragFlag = true;
                _this.moveV();
            });

            this.$rulerH.on("mousedown", function () {
                _this.cfg.oDrag = _this.createH();
                _this.cfg.dragFlag = true;
                _this.moveH();
            });

            // 监听浏览器变化重新渲染标尺
            $(win).resize(function () {
                _this.renderRuler();
            });
        },
        renderRuler: function() {
            this.rulerSize = {
                w: this.$pageRuler.width(),
                h: this.$pageRuler.height()
            }
            this._renderScale();
            this._renderScaleNumber();
        },
        // 渲染标尺
        _renderScale: function() {
            var rulerSize = this.rulerSize,
                rulerBoxH = rulerSize.h + SCALE_H,
                rulerBoxW = rulerSize.w + SCALE_H;
            this.pos = this.$pageRuler.offset();

            //整个box的宽高
            this.$rulerBox.height(rulerBoxH).width(rulerBoxW);
            this.$rulerBox.css({
                left: - SCALE_H ,
                top:  - SCALE_H
            });

            this.rulerBoxSize = {
                w: rulerBoxW,
                h: rulerBoxH
            }
            
        },
        // 渲染刻度
        _renderScaleNumber: function () {
            this.$rulerH.html("");
            this.$rulerV.html("");

            var rulerSize = this.rulerSize;

            //创建标尺数值
            for (var i = 0; i < rulerSize.w; i += 1) {
                if (i % 100 === 0) {
                    $('<span class="n">' + i + '</span>').css("left", i + 2).appendTo(this.$rulerH);
                }
            }
            //垂直标尺数值
            for (var i = 0; i < rulerSize.h; i += 1) {
                if (i % 100 === 0) {
                    $('<span class="n">' + i + '</span>').css("top", i + 2).appendTo(this.$rulerV);
                }
            }
        },
        createV: function (t) { //创建新的垂直参考线，有效宽度3像素
            var id = "ruleRefLineV" + ($(".ruleRefLine_v").size() + 1);
            $('<div class="ruleRefLine_v"></div>')
                .appendTo(this.$container)
                .attr({
                    "id": id,
                    "title": t
                });
            this.lineFlag = true;
            return $("#" + id);
        },
        createH: function (t) { //创建新的垂直参考线，有效宽度3像素
            var id = "ruleRefLineH" + ($(".ruleRefLine_h").size() + 1);
            $('<div class="ruleRefLine_h"></div>')
                .appendTo(this.$container)
                .attr({
                    "id": id,
                    "title": t
                });
            
            this.lineFlag = true;
            return $("#" + id);
        },
        moveV: function () {
            var _this = this;
            $(document).on("mousemove", function (e) {
                if (_this.cfg.dragFlag) {
                    //alert(e.screenX);
                    //如果可以拖拽
                    //垂直虚线的左坐标
                    _this.$dotV.css("left", e.pageX - _this.pos.left + SCALE_H);
                }
                // e.stopPropagation();
            });
        },
        moveH: function () {
            var _this = this;
            $(document).on("mousemove", function (e) {
                
                if (_this.cfg.dragFlag) {
                    //如果可以拖拽
                    //垂直虚线的左坐标
                    _this.$dotH.css("top", e.pageY - $(window).scrollTop() - _this.pos.top + SCALE_H);
                }
                e.stopPropagation();
            });
        },
        showRuler: function() {
            this.$rulerBox.show();
        },
        hideRuler: function() {
            this.$rulerBox.hide();
        },
        hideLine: function() {
            if(this.cacheLine) {
                this.cacheLine.remove();
            }
        },
        toggleAllLine: function() {
            if(this.lineFlag) {
                $(".ruleRefLine_v", this.$rulerBox).hide();
                $(".ruleRefLine_h", this.$rulerBox).hide();
                this.lineFlag = false;
            } else {
                $(".ruleRefLine_v", this.$rulerBox).show();
                $(".ruleRefLine_h", this.$rulerBox).show();
                this.lineFlag = true;
            }
            
        }
    })

    win.PageRuler = PageRuler;
})(window, jQuery);