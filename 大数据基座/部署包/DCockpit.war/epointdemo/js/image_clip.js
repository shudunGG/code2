(function (global, factory) {

    typeof exports === 'object' && module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory()) : global.ImageClip = factory();

}(window, function () {
    'use strict';

    const defaultSetting = {
        lineColor: '#2196f3',
        lineWidth: 3,
        pointRadius: 10,
        bgcolor: '#333',
        pointColor: '#ffeb3b'
    };

    class ImageClip {

        /**
         * ImageClip 实现图片拖拽原点等效果
         * @param {Object} options 配置项
         * el ImageClip 容器元素
         * setBgColor ImageClip 背景颜色
         * maxSize ImageClip 图片最大尺寸
         * pointRadius ImageClip 坐标点半径
         * pointColor ImageClip 坐标点颜色
         * lineWidth ImageClip 画笔宽度
         * lineColor ImageClip 画笔颜色
         * @memberof ImageClip
         */
        constructor(options) {
            if (!options.el) {
                throw new Error('请传入ImgClip容器id');
            }

            this.env = /Mobile/g.test(navigator.userAgent) ? 'Mobile' : 'Browser';

            // 合并已有配置
            this.extend(this, options, defaultSetting);
            this.el = this.getHTMLElement(options.el);
            this.rectEl = this.getHTMLElement('.imgclip-rect');
            this.imgEl = document.createElement('img'); // 创建个 img 标签

            // 设置背景色
            this.setBgColor(options.bgcolor);
            this.maxSize = options.maxSize || '';
        }

        /**
         * 设置背景色
         * @param {String} bgcolor 背景颜色
         * @memberof ImageClip
         */
        setBgColor(bgcolor) {
            this.el.style.backgroundColor = bgcolor;
        }

        /**
         * 获取dom元素
         * @param {String | HTMLElement} el 要获取的元素
         * @returns {HTMLElement} dom元素
         * @memberof ImageClip
         */
        getHTMLElement(el) {
            const d = this.el && typeof this.el !== 'string' ? this.el : document;

            if (el.nodeType !== 1) {
                return d.querySelector(el);
            }

            return el;
        }

        /**
         * 绘制canvas
         * @param {String} base64 图片的base64值
         * @param {Number} drawWidth 绘画高度
         * @param {Number} drawHeight 绘画高度
         */
        drawImage(base64, drawWidth, drawHeight) {
            const canvasEl = document.createElement('canvas');
            const ctx = canvasEl.getContext('2d');
            const imgEl = this.imgEl;
            const rectEl = this.rectEl;
            const that = this;

            let pixelRatio = this.getPixelRatio(ctx);

            pixelRatio = pixelRatio ? pixelRatio + 2 : 0;

            this.canvasEl = canvasEl;
            this.ctx = ctx;
            this.base64 = base64;

            imgEl.src = base64;
            imgEl.onload = function () {
                const marginLeft = -drawWidth / 2,
                    marginTop = -drawHeight / 2;

                that.pixelRatio = pixelRatio;

                canvasEl.style.width = drawWidth + 'px';
                canvasEl.style.height = drawHeight + 'px';
                canvasEl.width = drawWidth * pixelRatio;
                canvasEl.height = drawHeight * pixelRatio;

                rectEl.style.cssText = 'width: ' + drawWidth + 'px; height: ' + drawHeight + 'px; margin-left: ' + marginLeft + 'px; margin-top: ' + marginTop + 'px; cursor: crosshair;';

                that.drawWidth = drawWidth * pixelRatio;
                that.drawHeight = drawHeight * pixelRatio;

                ctx.drawImage(this, 0, 0, drawWidth * pixelRatio, drawHeight * pixelRatio);
            };
        }

        /**
         * 获取 retina 屏幕下缩放比例
         * @param {CanvasRenderingContext2D} context CanvasRenderingContext2D
         * @returns {Number} 比例
         */
        getPixelRatio(context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;

            return (window.devicePixelRatio || 1) / backingStore;
        }

        /**
         * 显示图片，把当前功能开启
         * @memberof ImageClip
         */
        showImg() {
            const canvasEl = this.canvasEl;
            const rectEl = this.rectEl;

            // 先清空imgclip容器内的元素
            rectEl.innerHTML = '';

            this.el.style.display = 'block';
            rectEl.appendChild(canvasEl);
        }

        /**
         * 隐藏imgclip-container
         *
         * @memberof ImageClip
         */
        hidden() {
            this.el.style.display = 'none';
        }

        /**
         * 显示imgclip-container
         *
         * @memberof ImageClip
         */
        show() {
            this.el.style.display = 'block';
        }

        /**
         * 处理四个坐标，当然也可以自己来处理坐标
         * @param {String} coordinate 接口返回的坐标值
         * coordinate 的值对应为 bottomLeft、topLeft、topRight、bottomRight
         * 例如返回格式如下： [[  0 453] [  0   0] [737   0] [737 453]]
         * @returns {Object} 各个点的坐标
         * @memberof ImageClip
         */
        handleCoordinate(coordinate) {
            // 如果当前坐标已经为解析过的则不执行解析操作
            if (typeof coordinate === 'object') {
                return coordinate;
            }

            const canvasWidth = this.canvasEl.width,
                canvasHeight = this.canvasEl.height,
                pixelRatio = this.pixelRatio;

            let bottomLeft = '',
                topLeft = '',
                topRight = '',
                bottomRight = '';

            // 如果接口返回坐标点的话
            if (coordinate) {
                const _getXY = this._getXY;

                // 先取出换行 \n
                coordinate = coordinate.replace(/\n/g, '');
                // 除去头尾的 [ ]
                let initValue = coordinate.match(/\[(.*)\]$/)[1].trim();

                coordinate = {
                    initValue: initValue,
                    mValue: initValue
                };

                bottomLeft = _getXY(coordinate);
                topLeft = _getXY(coordinate);
                topRight = _getXY(coordinate);
                bottomRight = _getXY(coordinate);
            }
            // 没有返回坐标点 默认为画布的四个角度
            else {
                topLeft = {
                    x: 0,
                    y: 0
                };

                topRight = {
                    x: canvasWidth,
                    y: 0
                };

                bottomLeft = {
                    x: 0,
                    y: canvasHeight
                };

                bottomRight = {
                    x: canvasWidth,
                    y: canvasHeight
                };
            }

            coordinate = {
                topLeft: topLeft,
                topRight: topRight,
                bottomLeft: bottomLeft,
                bottomRight: bottomRight
            };

            for (const i in coordinate) {
                const item = coordinate[i],
                    x = item.x,
                    y = item.y;

                item.x = x / pixelRatio;
                item.y = y / pixelRatio;
            }

            return this.coordinate = coordinate;
        }

        /**
         * 根据坐标解析x、y轴
         *
         * @param {Object} coordinate 坐标
         * @returns {Object} 返回解析的x、y轴
         * @memberof ImageClip
         */
        _getXY(coordinate) {
            let initValue = coordinate.mValue,
                mValue = initValue.substring(0, initValue.indexOf(']') + 1);

            coordinate.mValue = initValue.replace(mValue, '').trim();
            mValue = mValue.match(/\[(.*)\]/)[1].trim();

            // 由于接口返回的数据格式问题，坐标系之间还有可能存在空格！
            mValue = mValue.split(' ').filter((e) => {
                if (e) {
                    return e;
                }
            });

            return {
                x: mValue[0].replace(/,/, ''),
                y: mValue[1]
            };
        }

        /**
         * 绘制坐标轴
         *
         * @param {Object} coordinate 坐标轴集合
         * @memberof ImageCutTools
         */
        paintPoints(coordinate) {
            // 如果当前目录下面，存在这些dom元素则清空
            if (this.getHTMLElement('.imgclip-dot-rect')) {
                this.rectEl.innerHTML = '';
            }

            // 先解析坐标轴
            coordinate = this.handleCoordinate(coordinate);
            // 绘制连线
            this._drawLine(coordinate);

            let documentFragment = document.createDocumentFragment();
            const pointRadius = parseInt(this.pointRadius, 10);
            const pointColor = this.pointColor;

            for (const i in coordinate) {
                const item = coordinate[i];
                const span = document.createElement('span');

                span.classList.add('imgclip-dot-rect');
                span.setAttribute('data-imageclip', i.toLowerCase());
                span.style.cssText = 'width: ' + pointRadius * 2 + 'px; height: ' + pointRadius * 2 + 'px; left: ' + (parseInt(item.x, 10) - pointRadius) + 'px; top: ' + (parseInt(item.y, 10) - pointRadius) + 'px; background-color: ' + pointColor;

                documentFragment.appendChild(span);
            }

            this.rectEl.appendChild(documentFragment);
            // 释放资源
            documentFragment = null;
        }

        /**
         * 开启坐标点的拖拽
         *
         * @param {Object} coordinate 坐标点
         * @memberof ImageClip
         */
        openPointsDragDrop(coordinate) {
            coordinate = coordinate || this.coordinate;

            const getHTMLElement = this.getHTMLElement.bind(this),
                topLeftEl = getHTMLElement('[data-imageclip=topleft]'),
                topRightEl = getHTMLElement('[data-imageclip=topright]'),
                bottomLeftEl = getHTMLElement('[data-imageclip=bottomleft]'),
                bottomRightEl = getHTMLElement('[data-imageclip=bottomright]'),
                _drawLine = this._drawLine.bind(this),
                pointRadius = parseInt(this.pointRadius, 10),
                env = this.env;

            let startX = 0,
                startY = 0,
                moveLeft = 0,
                moveTop = 0,
                isMousedown = false,
                curTrigger = null;

            /**
             * 触屏开始
             * touchstart
             * @param {Event} e 事件
             */
            const touchStartEvtCallback = function (e) {
                e.preventDefault();

                const touches = e.touches ? e.touches[0] : e;

                startX = touches.pageX;
                startY = touches.pageY;
                moveLeft = parseInt(this.style.left, 10);
                moveTop = parseInt(this.style.top, 10);
            };

            /**
             * 触屏移动
             * touchmove
             * @param {Object} e event事件
             * @param {String} postion 方位
             */
            const touchMoveEvtCallback = function (e, postion) {
                e.preventDefault();

                const touches = e.touches ? e.touches[0] : e;
                const left = moveLeft + touches.pageX - startX,
                    top = moveTop + touches.pageY - startY;

                this.style.left = left + 'px';
                this.style.top = top + 'px';

                coordinate[postion].x = left + pointRadius;
                coordinate[postion].y = top + pointRadius;

                _drawLine(coordinate);
            };

            // 移动端环境下
            if (env === 'Mobile') {

                topLeftEl.addEventListener('touchstart', function (e) {
                    touchStartEvtCallback.call(this, e);
                }, {
                    passive: false
                });

                topLeftEl.addEventListener('touchmove', function (e) {
                    touchMoveEvtCallback.call(this, e, 'topLeft');
                }, {
                    passive: false
                });

                topRightEl.addEventListener('touchstart', function (e) {
                    touchStartEvtCallback.call(this, e);
                }, {
                    passive: false
                });

                topRightEl.addEventListener('touchmove', function (e) {
                    touchMoveEvtCallback.call(this, e, 'topRight');
                }, {
                    passive: false
                });

                bottomLeftEl.addEventListener('touchstart', function (e) {
                    touchStartEvtCallback.call(this, e);
                }, {
                    passive: false
                });

                bottomLeftEl.addEventListener('touchmove', function (e) {
                    touchMoveEvtCallback.call(this, e, 'bottomLeft');
                }, {
                    passive: false
                });

                bottomRightEl.addEventListener('touchstart', function (e) {
                    touchStartEvtCallback.call(this, e);
                }, {
                    passive: false
                });

                bottomRightEl.addEventListener('touchmove', function (e) {
                    touchMoveEvtCallback.call(this, e, 'bottomRight');
                }, {
                    passive: false
                });
            }
            // 否则浏览器环境下
            else if (env === 'Browser') {
                // TODO:
                document.addEventListener('mousedown', function (e) {
                    const position = e.target.dataset.imageclip;

                    // 如果 position 是 topright、topleft、bottomleft、bottomright
                    if (position) {
                        isMousedown = true;

                        switch (position) {
                            case 'topleft':
                                touchStartEvtCallback.call(topLeftEl, e);
                                break;

                            case 'topright':
                                touchStartEvtCallback.call(topRightEl, e);
                                break;

                            case 'bottomleft':
                                touchStartEvtCallback.call(bottomLeftEl, e);
                                break;

                            case 'bottomright':
                                touchStartEvtCallback.call(bottomRightEl, e);
                                break;

                            default:
                                break;
                        }

                        curTrigger = position;
                    }
                });

                document.addEventListener('mousemove', function (e) {
                    if (!isMousedown) {
                        return;
                    }

                    switch (curTrigger) {
                        case 'topleft':
                            touchMoveEvtCallback.call(topLeftEl, e, 'topLeft');
                            break;

                        case 'topright':
                            touchMoveEvtCallback.call(topRightEl, e, 'topRight');
                            break;

                        case 'bottomleft':
                            touchMoveEvtCallback.call(bottomLeftEl, e, 'bottomLeft');
                            break;

                        case 'bottomright':
                            touchMoveEvtCallback.call(bottomRightEl, e, 'bottomRight');
                            break;

                        default:
                            break;
                    }
                });

                document.addEventListener('mouseup', function (e) {
                    isMousedown = false;
                });
            }
        }

        /**
         * 绘制连线
         *
         * @param {Object} coordinate 缩放过后的坐标轴
         * @memberof ImageCutTools
         */
        _drawLine(coordinate) {
            const pixelRatio = this.pixelRatio;
            const topLeft = coordinate['topLeft'],
                topRight = coordinate['topRight'],
                bottomLeft = coordinate['bottomLeft'],
                bottomRight = coordinate['bottomRight'],
                canvasEl = this.canvasEl,
                canvasWidth = canvasEl.width,
                canvasHeight = canvasEl.height,
                ctx = this.ctx,
                drawWidth = this.drawWidth,
                drawHeight = this.drawHeight;

            ctx.strokeStyle = this.lineColor;
            ctx.lineWidth = this.lineWidth * pixelRatio;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(this.imgEl, 0, 0, drawWidth, drawHeight);

            this.coordinate = coordinate;

            // 绘制 topLeft - topRight
            ctx.beginPath();
            ctx.moveTo(topRight.x * pixelRatio, topRight.y * pixelRatio);
            ctx.lineTo(topLeft.x * pixelRatio, topLeft.y * pixelRatio);
            ctx.stroke();

            // 绘制 topLeft - bottomLeft
            ctx.beginPath();
            ctx.moveTo(bottomLeft.x * pixelRatio, bottomLeft.y * pixelRatio);
            ctx.lineTo(topLeft.x * pixelRatio, topLeft.y * pixelRatio);
            ctx.stroke();

            // 绘制 bottomRight - topRight
            ctx.beginPath();
            ctx.moveTo(topRight.x * pixelRatio, topRight.y * pixelRatio);
            ctx.lineTo(bottomRight.x * pixelRatio, bottomRight.y * pixelRatio);
            ctx.stroke();

            // 绘制 bottomRight - bottomLeft
            ctx.beginPath();
            ctx.moveTo(bottomLeft.x * pixelRatio, bottomLeft.y * pixelRatio);
            ctx.lineTo(bottomRight.x * pixelRatio, bottomRight.y * pixelRatio);
            ctx.stroke();
        }

        /**
         * 返回最终数据
         *
         * @returns {Object} 返回最终数据 坐标与图片base64流
         * @memberof ImageClip
         */
        getData() {
            const self = this,
                coordinate = self.coordinate,
                pixelRatio = self.pixelRatio;

            for (const i in coordinate) {
                const item = coordinate[i],
                    x = item.x,
                    y = item.y;

                item.x = x * pixelRatio;
                item.y = y * pixelRatio;
            }

            return {
                coordinate: self.coordinate,
                base64: self.base64
            };
        }

        /**
         * 获取图片的 MIME 类型
         * @param {String} base64 图片的base64值
         * @returns {String} mime类型
         * @memberof ImageClip
         */
        getImgMIME(base64) {
            return base64.match(/data:(.*);/)[1];
        }

        /**
         * 获取图片的 base64 url 头
         *
         * @param {String} base64 图片的 base64
         * @returns {String} 返回base64的url头部
         * @memberof ImageClip
         */
        getImgBase64Url(base64) {
            return base64.match(/data:.*,/)[0];
        }

        /**
         * 监听事件
         * @param {String} evt 事件
         * @param {Function} callback 回调函数
         *
         * 事件一般有 upload
         * @memberof ImageClip
         */
        on(evt, callback) {

            typeof this.evt === 'object' ? '' : this.evt = {
                upload: ''
            };

            this.evt[evt] = callback;
        }

        /**
         * 获取最终上传接口需要的坐标格式
         *
         * @param {Object} coordinate 坐标值
         * @returns {Array} 数据
         * @memberof ImageClip
         */
        formatCoordinate(coordinate) {
            coordinate = coordinate || this.coordinate;

            if (typeof coordinate !== 'object') {
                coordinate = JSON.parse(coordinate);
            }

            const topleft = coordinate['topLeft'],
                topright = coordinate['topRight'],
                bottomleft = coordinate['bottomLeft'],
                bottomright = coordinate['bottomRight'];

            return [bottomleft.x, bottomleft.y, topleft.x, topleft.y, topright.x, topright.y, bottomright.x, bottomright.y];
        }

        /**
         * 移除base64 url 头部后的值
         * @param {String} base64 图片的base64值
         * @returns {String} 不带url部分的base64值
         * @memberof ImageClip
         */
        removeBase64Url(base64) {
            return base64.match(/base64,(.*)/)[1];
        }

        /**
         * 合并方法
         *
         * @memberof ImageClip
         */
        extend(...rest) {
            let result = rest[0];

            for (let i = 1, len = rest.length; i < len; i++) {
                const item = rest[i];

                for (const k in item) {
                    if (result[k] === undefined) {
                        result[k] = item[k];
                    }
                }
            }
        }
    }

    return ImageClip;
}));
