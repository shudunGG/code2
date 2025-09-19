(function (win, $) {
    var MODAL_TPL = '<div class="guide-modal hidden"></div>',
        WELCOME_TPL = '<div class="guide-welcome hidden"><i class="guide-welcome-close"></i><p class="guide-welcome-slogan">欢迎使用<span class="sys-name">“{{sysName}}”</span></p><p class="guide-welcome-info">开始全新的办公体验</p><button class="guide-welcome-btn">开始</button></div>',
        TARGET_COVER_TPL = '<div class="guide-target-cover hidden"></div>',
        STEP_TPL = '<div class="guide-step hidden"><div class="guide-step-cover"></div><div class="guide-step-imgwrap"><img class="guide-step-img"></div><span class="guide-step-arrow"></span><div class="guide-step-tips"><i class="guide-step-close"></i><h2 class="guide-step-tips-title"></h2><p class="guide-step-tips-content"></p><div class="guide-step-tips-footer clearfix"><ul class="guide-step-bullet"></ul><button class="guide-step-btn">下一步</button></div></div></div>',
        STEP_BULLET_TPL = '<li class="guide-step-bullet-item"></li>';


    var defaultConfig = {
        sysName: "新点网络协同办公平台V9",
        steps: []
    };

    var Guidance = function (cfg) {
        this.cfg = $.extend({}, defaultConfig, cfg);

        this.stepCount = this.cfg.steps.length;

        this._init();
    };

    $.extend(Guidance.prototype, {
        _init: function () {
            // 蒙版
            this.$modal = $(MODAL_TPL).appendTo('body');
            // 欢迎面板
            this.$welcome = $(Mustache.render(WELCOME_TPL, {
                sysName: this.cfg.sysName
            })).appendTo('body');

            // 覆盖住目标对象，防止目标对象可点击
            this.$targetCover = $(TARGET_COVER_TPL).appendTo('body');
            // 步骤说明
            this.$step = $(STEP_TPL).appendTo('body');

            this.$stepCover = $('.guide-step-cover', this.$step);
            this.$stepImgWrap = $('.guide-step-imgwrap', this.$step);
            this.$stepArrow = $('.guide-step-arrow', this.$step);
            this.$stepTips = $('.guide-step-tips', this.$step);

            this.stepImg = this.$stepImgWrap.find('img')[0];

            this.$stepTipsTitle = $('.guide-step-tips-title', this.$stepTips);
            this.$stepTipsContent = $('.guide-step-tips-content', this.$stepTips);
            this.$stepTipsBullet = $('.guide-step-bullet', this.$stepTips);
            this.$stepTipsBtn = $('.guide-step-btn', this.$stepTips);

            this.generateBulletList();

            this._bindEvent();
        },
        _bindEvent: function () {
            var self = this;
            this.$welcome.on('click', '.guide-welcome-close', function () {
                self.hide();
            }).on('click', '.guide-welcome-btn', function () {
                self._hideWelcome();
                self._showStep(0);
            });

            this.$stepTips.on('click', '.guide-step-close', function () {
                self.hide();
            }).on('click', '.guide-step-btn', function () {
                self._showNextStep();
            }).on('click', '.guide-step-bullet-item', function(){
                var index = $(this).index();
                self._showStep(index);

            });

            this.stepImg.onload = function () {
                self._adjustArrowAndTipsPos();
            };
        },
        generateBulletList: function () {
            var html = [];
            for (var i = 0, l = this.stepCount; i < l; i++) {
                html.push(STEP_BULLET_TPL);
            }

            this.$stepTipsBullet.html(html.join(''));
        },
        show: function (step) {
            step = parseInt(step);

            this.$modal.removeClass('hidden');
            // step 为 0 或者没有传值，则显示欢迎页面
            if (!step) {
                this._showWelcome();
            } else {
                this._showStep(step - 1);
            }
        },
        _showWelcome: function () {
            this.$welcome.removeClass('hidden');
        },
        _hideWelcome: function () {
            this.$welcome.addClass('hidden');
        },
        _showStep: function (step) {
            // step 小于 0 或者大于总步数，则表示不需要显示指引
            if (step < 0 || step >= this.stepCount) {
                this.hide();
                return;
            }

            var item = this.cfg.steps[step];

            this.$targetCover.removeClass('hidden');

            this._updateStep(item, step);

            this.$step.removeClass('hidden');
            
            this.currentStep = step;

            if (this.cfg.onShowStep) {
                this.cfg.onShowStep(step + 1);
            }
        },
        _updateStep: function (step, index) {

            this.$step.addClass('hidden');

            if (step.imgSrc) {
                this.stepImg.src = step.imgSrc;
            }

            this.$stepTipsTitle.html(step.title || '');
            this.$stepTipsContent.html(step.content || '');

            this.$stepTipsBullet.children().removeClass('active')
                .eq(index).addClass('active');

            if (index + 1 < this.stepCount) {
                this.$stepTipsBtn.text('下一步');
            } else {
                this.$stepTipsBtn.text('完成');
            }

            this._adjustStepPosition(step);

        },
        _adjustStepPosition: function (step) {
            var $target = $('#' + step.target),
                targetBox = $target.offset();

            targetBox.width = $target.outerWidth(true);
            targetBox.height = $target.outerHeight(true);

            if (this.$lastTarget) {
                this.$lastTarget.removeClass('guide-highlight');
            }
            this.$lastTarget = $target;
            $target.addClass('guide-highlight');

            this.$targetCover.css({
                top: targetBox.top,
                left: targetBox.left,
                width: targetBox.width,
                height: targetBox.height
            });

            this.$stepCover.css({
                top: targetBox.top,
                left: targetBox.left,
                width: targetBox.width,
                height: targetBox.height
            });

            if (!step.position) {
                step.position = {};
            }
            if (step.imgSrc) {
                this.$stepImgWrap.removeClass('hidden');
                this._adjustImgPos(step.position.img, targetBox);
            } else {
                this.$stepImgWrap.addClass('hidden').removeAttr('style');
                this._adjustArrowAndTipsPos(step);
            }

        },
        _adjustImgPos: function (pos, targetBox) {
            if (!pos) {
                pos = 'bottom';
            }

            this.$stepImgWrap.removeAttr('style');

            var imgPos = {};

            if (typeof pos == 'string') {
                // 相对于目标的位置
                switch (pos) {
                    case 'top':
                        imgPos.left = targetBox.left;
                        imgPos.bottom = targetBox.top;
                        break;
                    case 'left':
                        imgPos.top = targetBox.top;
                        imgPos.right = targetBox.left;
                        break;
                    case 'right':
                        imgPos.top = targetBox.top;
                        imgPos.left = targetBox.left + targetBox.width;
                        break;
                    case 'bottom':
                    default:
                        imgPos.left = targetBox.left;
                        imgPos.top = targetBox.top + targetBox.height;
                        break;
                }

            } else if (typeof pos == 'object') {
                var bg = pos.fillBgImg;
                if (bg) {
                    this.$stepImgWrap.css('background', 'url(' + bg + ')');
                }
                // 自定义位置
                for (var key in pos) {
                    if (typeof pos[key] == 'string') {
                        // 某个位置属性直接与目标相同
                        switch (imgPos[key]) {
                            // 背景图片直接跳过
                            case 'fillBgImg':
                                break;
                            case 'top':
                                imgPos[key] = targetBox.top;
                                break;
                            case 'left':
                                imgPos[key] = targetBox.left;
                                break;
                            case 'right':
                                imgPos[key] = targetBox.left + targetBox.width;
                                break;
                            case 'bottom':
                            default:
                                imgPos[key] = targetBox.top + targetBox.height;
                                break;
                        }
                    } else {
                        imgPos[key] = pos[key];
                    }
                }
            }
            this.$stepImgWrap.css(imgPos);
        },
        _adjustArrowAndTipsPos: function (step) {
            if (!step) {
                step = this.cfg.steps[this.currentStep];
            }

            var imgBox = $.extend({
                width: this.$stepImgWrap.width(),
                height: this.$stepImgWrap.height()
            }, this.$stepImgWrap.offset());

            if (imgBox.width === 0) {
                imgBox = $.extend({
                    width: this.$targetCover.width(),
                    height: this.$targetCover.height()
                }, this.$targetCover.offset());
            }

            // var tipsBox = {
            //     width: this.$stepTips.width(),
            //     height: this.$stepTips.height()
            // };

            // var arrowBox = {
            //     width: this.$stepArrow.width(),
            //     height: this.$stepArrow.height()
            // };

            var tipsBox = {
                width: 410,
                height: 200
            };

            var arrowBox = {
                width: 70,
                height: 50
            };

            var winBox = {
                width: $(win).width(),
                height: $(win).height()
            };

            var arrowPos,
                tipsPos;

            this.$stepArrow.removeClass('top right bottom left').removeAttr('style');

            var position = step.position ? (step.position.tips ? step.position.tips : 'bottom') : 'bottom';

            switch (position) {
                case 'top':
                    this.$stepArrow.addClass('top');
                    arrowPos = {
                        left: imgBox.left + imgBox.width / 2 + tipsBox.width / 2,
                        top: imgBox.top - arrowBox.height
                    };
                    tipsPos = {
                        left: imgBox.left + imgBox.width / 2 - tipsBox.width / 2,
                        top: imgBox.top - arrowBox.height - tipsBox.height
                    };
                    break;
                case 'right':
                    this.$stepArrow.addClass('right');
                    arrowPos = {
                        left: imgBox.left + imgBox.width,
                        top: imgBox.top + 50
                    };
                    tipsPos = {
                        left: imgBox.left + imgBox.width + arrowBox.width,
                        top: imgBox.top + arrowBox.height + 50
                    };
                    break;
                case 'bottom':
                    this.$stepArrow.addClass('bottom');
                    arrowPos = {
                        left: imgBox.left + imgBox.width / 2 - arrowBox.width,
                        top: imgBox.top + imgBox.height
                    };
                    tipsPos = {
                        left: imgBox.left + imgBox.width / 2 - arrowBox.width - tipsBox.width,
                        top: imgBox.top + imgBox.height + arrowBox.height
                    };
                    break;
                case 'left':
                default:
                    this.$stepArrow.addClass('left');
                    arrowPos = {
                        left: imgBox.left - arrowBox.width,
                        top: imgBox.top + 50
                    };
                    tipsPos = {
                        left: imgBox.left - arrowBox.width - tipsBox.width,
                        top: imgBox.top + 50 + arrowBox.height
                    };
                    break;
            }


            arrowPos.left = Math.min(arrowPos.left, winBox.width - arrowBox.width - 10);
            tipsPos.left = Math.min(tipsPos.left, winBox.width - tipsBox.width - 10);

            this.$stepArrow.css(arrowPos);
            this.$stepTips.css(tipsPos);

        },
        _showNextStep: function () {
            var step = this.currentStep || 0;

            this._showStep(step + 1);
        },
        hide: function () {
            if (this.$lastTarget) {
                this.$lastTarget.removeClass('guide-highlight');
            }

            this.$modal.addClass('hidden');
            this.$welcome.addClass('hidden');
            this.$targetCover.addClass('hidden');
            this.$step.addClass('hidden');

            if (this.cfg.onHide) {
                this.cfg.onHide();
            }
        }
    });

    $(function () {
        var cfg = win.guidanceConfig || {};

        // cfg.onShowStep = function(step) {
        //     Util.ajax({
        //         url: cfg.updateStepUrl,
        //         data: {
        //             step: step
        //         }
        //     });
        // };

        cfg.onHide = function () {
            var step = cfg.steps.length;
            Util.ajax({
                url: cfg.updateStepUrl,
                data: {
                    step: step
                }
            });
        };

        var guidance = new Guidance(cfg);

        Util.ajax({
            url: cfg.getCurrentStepUrl
        }).done(function (data) {
            // 经内部评审讨论，不需要记住具体步骤，只要看过下次就不需要显示了。
            if (!data.step) {
                guidance.show();
            }

        });
    });
}(this, jQuery));