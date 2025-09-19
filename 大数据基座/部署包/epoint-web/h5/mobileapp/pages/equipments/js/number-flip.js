'use strict';
if (!Array.from) {
    Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);

            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }

            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);

            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike /* , mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;

            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;

            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;

            // 20. Return A.
            return A;
        };
    }());
}
var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
};

!(function (t, e) {
    if ('object' == (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) && 'object' == (typeof module === 'undefined' ? 'undefined' : _typeof(module))) {
        module.exports = e();
    } else if ('function' === typeof define && define.amd) {
        define([], e);
    } else {
        var r = e();

        for (var n in r) {
            ('object' == (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) ? exports : t)[n] = r[n];
        }
    }
}(window, function () {
    return (function (t) {
        var e = {};

        function r(n) {
            if (e[n]) {return e[n].exports;}
            var i = e[n] = {
                i: n,
                l: !1,
                exports: {}
            };

            return t[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports;
        }

        return r.m = t, r.c = e, r.d = function (t, e, n) {
            r.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: n
            });
        }, r.r = function (t) {
            'undefined' !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: 'Module'
            }), Object.defineProperty(t, '__esModule', {
                value: !0
            });
        }, r.t = function (t, e) {
            if (1 & e && (t = r(t)), 8 & e) {return t;}
            if (4 & e && 'object' == (typeof t === 'undefined' ? 'undefined' : _typeof(t)) && t && t.__esModule) {return t;}
            var n = Object.create(null);

            if (r.r(n), Object.defineProperty(n, 'default', {
                enumerable: !0,
                value: t
            }), 2 & e && 'string' !== typeof t)
            {for (var i in t) {
                r.d(n, i, function (e) {
                    return t[e];
                }.bind(null, i));
            }}

            return n;
        }, r.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default;
            } : function () {
                return t;
            };

            return r.d(e, 'a', e), e;
        }, r.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }, r.p = '/', r(r.s = 1);
    }([function (t, e, r) {
        'use strict';

        r.r(e);
        var n = function n() {
            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';

            return function () {
                for (var _len = arguments.length, r = Array(_len), _key = 0; _key < _len; _key++) {
                    r[_key] = arguments[_key];
                }

                var n = document.createElement(e),
                    i = (function (t) {
                        return null !== t && 'object' == (typeof t === 'undefined' ? 'undefined' : _typeof(t));
                    }(t)) ? t : {
                            class: t
                        };

                return Object.keys(i).forEach(function (t) {
                    /^_/.test(t) ? (_data[i[t]] = void 0, _watcher.on(i[t], function (e) {
                        n[t.slice(1)] = e;
                    })) : /^\$/.test(t) ? n.addEventListener(t.slice(1), function (e) {
                        i[t](_data, e);
                    }) : n.setAttribute(t, i[t]);
                }), r.forEach(function (t) {
                    (function (t) {
                        return t instanceof HTMLElement && 1 === t.nodeType;
                    })(t) ? n.appendChild(t) : 'img' === e.toLowerCase() && (function (t) {
                            return 'string' === typeof t || t instanceof String;
                        }(t)) ? n.setAttribute('src', t) : n.innerText = t;
                }), n;
            };
        };

        function i(t) {
            return (function (t) {
                if (Array.isArray(t)) {
                    for (var e = 0, r = new Array(t.length); e < t.length; e++) {
                        r[e] = t[e];
                    }

                    return r;
                }
            }(t)) || (function (t) {
                if (Symbol.iterator in Object(t) || '[object Arguments]' === Object.prototype.toString.call(t)) {return Array.from(t);}
            }(t)) || (function () {
                throw new TypeError('Invalid attempt to spread non-iterable instance');
            }());
        }

        function o(t, e) {
            for (var r = 0; r < e.length; r++) {
                var n = e[r];

                n.enumerable = n.enumerable || !1, n.configurable = !0, 'value' in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
            }
        }
        r.d(e, 'Flip', function () {
            return f;
        });
        var a = function a(t, e) {
                return (t > e ? t : e).toString().length;
            },
            s = function s(t, e) {
                return (function (t) {
                    return t.split('').map(Number);
                }(function t(e, r) {
                    return e.length < r ? t('0' + e, r) : e;
                }(t.toString(), e))).reverse();
            },
            f = (function () {
                function t(e) {
                    var r = this,
                        n = e.node,
                        o = e.from,
                        s = void 0 === o ? 0 : o,
                        f = e.to,
                        c = e.duration,
                        u = void 0 === c ? .5 : c,
                        l = e.delay,
                        d = e.easeFn,
                        h = void 0 === d ? function (t) {
                            return (t /= .5) < 1 ? .5 * Math.pow(t, 3) : .5 * (Math.pow(t - 2, 3) + 2);
                        } : d,
                        p = e.systemArr,
                        y = void 0 === p ? i(Array(10).keys()) : p,
                        v = e.direct,
                        m = void 0 === v || v;

                    ! (function (t, e) {
                        if (!(t instanceof e)) {throw new TypeError('Cannot call a class as a function');}
                    }(this, t)), this.beforeArr = [], this.afterArr = [], this.ctnrArr = [], this.duration = 1e3 * u, this.systemArr = y, this.easeFn = h, this.from = s, this.to = f || 0, this.node = n, this.direct = m, this._initHTML(a(this.from, this.to)), void 0 !== f && (l ? setTimeout(function () {
                        return r.flipTo({
                            to: r.to,
                            direct: m
                        });
                    }, 1e3 * l) : this.flipTo({
                        to: this.to,
                        direct: m
                    }));
                }

                return (function (t, e, r) {
                    e && o(t.prototype, e), r && o(t, r);
                }(t, [{
                    key: '_initHTML',
                    value: function value(t) {
                        var e = this;

                        this.node.classList.add('number-flip'), this.node.style.position = 'relative', this.node.style.overflow = 'hidden', i(Array(t).keys()).forEach(function (t) {
                            var r = n('ctnr ctnr'.concat(t)).apply(void 0, i(e.systemArr.map(function (t) {
                                return n('digit')(t);
                            })).concat([n('digit')(e.systemArr[0])]));


                            r.style.position = 'relative', r.style.display = 'inline-block', e.ctnrArr.unshift(r), e.node.appendChild(r), e.beforeArr.push(0);
                        }), this.height = 50, this.node.style.height = this.height + 'px';
                        for (var r = 0, o = this.ctnrArr.length; r < o; r += 1) {
                            this._draw({
                                digit: r,
                                per: 1,
                                alter: ~~(this.from / Math.pow(10, r))
                            });
                        }
                    }
                }, {
                    key: '_draw',
                    value: function value(t) {
                        var e = t.per,
                            r = t.alter,
                            n = t.digit,
                            i = this.beforeArr[n],
                            o = 'translateY('.concat(-(((e * r + i) % 10 + 10) % 10) * this.height, 'px)');

                        this.ctnrArr[n].style.webkitTransform = o, this.ctnrArr[n].style.transform = o;
                    }
                }, {
                    key: 'flipTo',
                    value: function value(t) {
                        var e = this,
                            r = t.to,
                            n = t.duration,
                            i = t.easeFn,
                            o = t.direct,
                            a = void 0 === o || o,
                            f = this.ctnrArr.length;

                        this.beforeArr = s(this.from, f), this.afterArr = s(r, f);
                        var c = function c(t) {
                                for (var r = 0, n = e.ctnrArr.length - 1; n >= 0; n -= 1) {
                                    var o = e.afterArr[n] - e.beforeArr[n];

                                    r += o;
                                    var s = i || e.easeFn;

                                    e._draw({
                                        digit: n,
                                        per: s(t),
                                        alter: a ? o : r
                                    }), r *= 10;
                                }
                            },
                            u = performance.now(),
                            l = 1e3 * n || this.duration;

                        requestAnimationFrame(function t(n) {
                            var i = n - u;

                            c(i / l), i < l ? requestAnimationFrame(t) : (e.from = r, c(1));
                        });
                    }
                }])), t;
            }());
    }, function (t, e, r) {
        t.exports = r(0);
    }]));
}));