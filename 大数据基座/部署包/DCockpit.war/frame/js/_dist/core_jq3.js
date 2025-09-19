/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!(function (a, b) {
  "use strict";
  "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = a.document
        ? b(a, !0)
        : function (a) {
            if (!a.document)
              throw new Error("jQuery requires a window with a document");
            return b(a);
          })
    : b(a);
})("undefined" != typeof window ? window : this, function (a, b) {
  "use strict";
  var c = [],
    d = a.document,
    e = Object.getPrototypeOf,
    f = c.slice,
    g = c.concat,
    h = c.push,
    i = c.indexOf,
    j = {},
    k = j.toString,
    l = j.hasOwnProperty,
    m = l.toString,
    n = m.call(Object),
    o = {};
  function p(a, b) {
    b = b || d;
    var c = b.createElement("script");
    (c.text = a), b.head.appendChild(c).parentNode.removeChild(c);
  }
  var q = "3.2.1",
    r = function (a, b) {
      return new r.fn.init(a, b);
    },
    s = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    t = /^-ms-/,
    u = /-([a-z])/g,
    v = function (a, b) {
      return b.toUpperCase();
    };
  (r.fn = r.prototype = {
    jquery: q,
    constructor: r,
    length: 0,
    toArray: function () {
      return f.call(this);
    },
    get: function (a) {
      return null == a ? f.call(this) : a < 0 ? this[a + this.length] : this[a];
    },
    pushStack: function (a) {
      var b = r.merge(this.constructor(), a);
      return (b.prevObject = this), b;
    },
    each: function (a) {
      return r.each(this, a);
    },
    map: function (a) {
      return this.pushStack(
        r.map(this, function (b, c) {
          return a.call(b, c, b);
        })
      );
    },
    slice: function () {
      return this.pushStack(f.apply(this, arguments));
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(-1);
    },
    eq: function (a) {
      var b = this.length,
        c = +a + (a < 0 ? b : 0);
      return this.pushStack(c >= 0 && c < b ? [this[c]] : []);
    },
    end: function () {
      return this.prevObject || this.constructor();
    },
    push: h,
    sort: c.sort,
    splice: c.splice,
  }),
    (r.extend = r.fn.extend = function () {
      var a,
        b,
        c,
        d,
        e,
        f,
        g = arguments[0] || {},
        h = 1,
        i = arguments.length,
        j = !1;
      for (
        "boolean" == typeof g && ((j = g), (g = arguments[h] || {}), h++),
          "object" == typeof g || r.isFunction(g) || (g = {}),
          h === i && ((g = this), h--);
        h < i;
        h++
      )
        if (null != (a = arguments[h]))
          for (b in a)
            (c = g[b]),
              (d = a[b]),
              g !== d &&
                (j && d && (r.isPlainObject(d) || (e = Array.isArray(d)))
                  ? (e
                      ? ((e = !1), (f = c && Array.isArray(c) ? c : []))
                      : (f = c && r.isPlainObject(c) ? c : {}),
                    (g[b] = r.extend(j, f, d)))
                  : void 0 !== d && (g[b] = d));
      return g;
    }),
    r.extend({
      expando: "jQuery" + (q + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function (a) {
        throw new Error(a);
      },
      noop: function () {},
      isFunction: function (a) {
        return "function" === r.type(a);
      },
      isWindow: function (a) {
        return null != a && a === a.window;
      },
      isNumeric: function (a) {
        var b = r.type(a);
        return ("number" === b || "string" === b) && !isNaN(a - parseFloat(a));
      },
      isPlainObject: function (a) {
        var b, c;
        return (
          !(!a || "[object Object]" !== k.call(a)) &&
          (!(b = e(a)) ||
            ((c = l.call(b, "constructor") && b.constructor),
            "function" == typeof c && m.call(c) === n))
        );
      },
      isEmptyObject: function (a) {
        var b;
        for (b in a) return !1;
        return !0;
      },
      type: function (a) {
        return null == a
          ? a + ""
          : "object" == typeof a || "function" == typeof a
          ? j[k.call(a)] || "object"
          : typeof a;
      },
      globalEval: function (a) {
        p(a);
      },
      camelCase: function (a) {
        return a.replace(t, "ms-").replace(u, v);
      },
      each: function (a, b) {
        var c,
          d = 0;
        if (w(a)) {
          for (c = a.length; d < c; d++)
            if (b.call(a[d], d, a[d]) === !1) break;
        } else for (d in a) if (b.call(a[d], d, a[d]) === !1) break;
        return a;
      },
      trim: function (a) {
        return null == a ? "" : (a + "").replace(s, "");
      },
      makeArray: function (a, b) {
        var c = b || [];
        return (
          null != a &&
            (w(Object(a))
              ? r.merge(c, "string" == typeof a ? [a] : a)
              : h.call(c, a)),
          c
        );
      },
      inArray: function (a, b, c) {
        return null == b ? -1 : i.call(b, a, c);
      },
      merge: function (a, b) {
        for (var c = +b.length, d = 0, e = a.length; d < c; d++) a[e++] = b[d];
        return (a.length = e), a;
      },
      grep: function (a, b, c) {
        for (var d, e = [], f = 0, g = a.length, h = !c; f < g; f++)
          (d = !b(a[f], f)), d !== h && e.push(a[f]);
        return e;
      },
      map: function (a, b, c) {
        var d,
          e,
          f = 0,
          h = [];
        if (w(a))
          for (d = a.length; f < d; f++)
            (e = b(a[f], f, c)), null != e && h.push(e);
        else for (f in a) (e = b(a[f], f, c)), null != e && h.push(e);
        return g.apply([], h);
      },
      guid: 1,
      proxy: function (a, b) {
        var c, d, e;
        if (
          ("string" == typeof b && ((c = a[b]), (b = a), (a = c)),
          r.isFunction(a))
        )
          return (
            (d = f.call(arguments, 2)),
            (e = function () {
              return a.apply(b || this, d.concat(f.call(arguments)));
            }),
            (e.guid = a.guid = a.guid || r.guid++),
            e
          );
      },
      now: Date.now,
      support: o,
    }),
    "function" == typeof Symbol && (r.fn[Symbol.iterator] = c[Symbol.iterator]),
    r.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
        " "
      ),
      function (a, b) {
        j["[object " + b + "]"] = b.toLowerCase();
      }
    );
  function w(a) {
    var b = !!a && "length" in a && a.length,
      c = r.type(a);
    return (
      "function" !== c &&
      !r.isWindow(a) &&
      ("array" === c ||
        0 === b ||
        ("number" == typeof b && b > 0 && b - 1 in a))
    );
  }
  var x = (function (a) {
    var b,
      c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      k,
      l,
      m,
      n,
      o,
      p,
      q,
      r,
      s,
      t,
      u = "sizzle" + 1 * new Date(),
      v = a.document,
      w = 0,
      x = 0,
      y = ha(),
      z = ha(),
      A = ha(),
      B = function (a, b) {
        return a === b && (l = !0), 0;
      },
      C = {}.hasOwnProperty,
      D = [],
      E = D.pop,
      F = D.push,
      G = D.push,
      H = D.slice,
      I = function (a, b) {
        for (var c = 0, d = a.length; c < d; c++) if (a[c] === b) return c;
        return -1;
      },
      J =
        "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      K = "[\\x20\\t\\r\\n\\f]",
      L = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
      M =
        "\\[" +
        K +
        "*(" +
        L +
        ")(?:" +
        K +
        "*([*^$|!~]?=)" +
        K +
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
        L +
        "))|)" +
        K +
        "*\\]",
      N =
        ":(" +
        L +
        ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
        M +
        ")*)|.*)\\)|)",
      O = new RegExp(K + "+", "g"),
      P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
      Q = new RegExp("^" + K + "*," + K + "*"),
      R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
      S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
      T = new RegExp(N),
      U = new RegExp("^" + L + "$"),
      V = {
        ID: new RegExp("^#(" + L + ")"),
        CLASS: new RegExp("^\\.(" + L + ")"),
        TAG: new RegExp("^(" + L + "|[*])"),
        ATTR: new RegExp("^" + M),
        PSEUDO: new RegExp("^" + N),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            K +
            "*(even|odd|(([+-]|)(\\d*)n|)" +
            K +
            "*(?:([+-]|)" +
            K +
            "*(\\d+)|))" +
            K +
            "*\\)|)",
          "i"
        ),
        bool: new RegExp("^(?:" + J + ")$", "i"),
        needsContext: new RegExp(
          "^" +
            K +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            K +
            "*((?:-\\d)?\\d*)" +
            K +
            "*\\)|)(?=[^-]|$)",
          "i"
        ),
      },
      W = /^(?:input|select|textarea|button)$/i,
      X = /^h\d$/i,
      Y = /^[^{]+\{\s*\[native \w/,
      Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      $ = /[+~]/,
      _ = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
      aa = function (a, b, c) {
        var d = "0x" + b - 65536;
        return d !== d || c
          ? b
          : d < 0
          ? String.fromCharCode(d + 65536)
          : String.fromCharCode((d >> 10) | 55296, (1023 & d) | 56320);
      },
      ba = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
      ca = function (a, b) {
        return b
          ? "\0" === a
            ? "\ufffd"
            : a.slice(0, -1) +
              "\\" +
              a.charCodeAt(a.length - 1).toString(16) +
              " "
          : "\\" + a;
      },
      da = function () {
        m();
      },
      ea = ta(
        function (a) {
          return a.disabled === !0 && ("form" in a || "label" in a);
        },
        { dir: "parentNode", next: "legend" }
      );
    try {
      G.apply((D = H.call(v.childNodes)), v.childNodes),
        D[v.childNodes.length].nodeType;
    } catch (fa) {
      G = {
        apply: D.length
          ? function (a, b) {
              F.apply(a, H.call(b));
            }
          : function (a, b) {
              var c = a.length,
                d = 0;
              while ((a[c++] = b[d++]));
              a.length = c - 1;
            },
      };
    }
    function ga(a, b, d, e) {
      var f,
        h,
        j,
        k,
        l,
        o,
        r,
        s = b && b.ownerDocument,
        w = b ? b.nodeType : 9;
      if (
        ((d = d || []),
        "string" != typeof a || !a || (1 !== w && 9 !== w && 11 !== w))
      )
        return d;
      if (
        !e &&
        ((b ? b.ownerDocument || b : v) !== n && m(b), (b = b || n), p)
      ) {
        if (11 !== w && (l = Z.exec(a)))
          if ((f = l[1])) {
            if (9 === w) {
              if (!(j = b.getElementById(f))) return d;
              if (j.id === f) return d.push(j), d;
            } else if (s && (j = s.getElementById(f)) && t(b, j) && j.id === f)
              return d.push(j), d;
          } else {
            if (l[2]) return G.apply(d, b.getElementsByTagName(a)), d;
            if (
              (f = l[3]) &&
              c.getElementsByClassName &&
              b.getElementsByClassName
            )
              return G.apply(d, b.getElementsByClassName(f)), d;
          }
        if (c.qsa && !A[a + " "] && (!q || !q.test(a))) {
          if (1 !== w) (s = b), (r = a);
          else if ("object" !== b.nodeName.toLowerCase()) {
            (k = b.getAttribute("id"))
              ? (k = k.replace(ba, ca))
              : b.setAttribute("id", (k = u)),
              (o = g(a)),
              (h = o.length);
            while (h--) o[h] = "#" + k + " " + sa(o[h]);
            (r = o.join(",")), (s = ($.test(a) && qa(b.parentNode)) || b);
          }
          if (r)
            try {
              return G.apply(d, s.querySelectorAll(r)), d;
            } catch (x) {
            } finally {
              k === u && b.removeAttribute("id");
            }
        }
      }
      return i(a.replace(P, "$1"), b, d, e);
    }
    function ha() {
      var a = [];
      function b(c, e) {
        return (
          a.push(c + " ") > d.cacheLength && delete b[a.shift()],
          (b[c + " "] = e)
        );
      }
      return b;
    }
    function ia(a) {
      return (a[u] = !0), a;
    }
    function ja(a) {
      var b = n.createElement("fieldset");
      try {
        return !!a(b);
      } catch (c) {
        return !1;
      } finally {
        b.parentNode && b.parentNode.removeChild(b), (b = null);
      }
    }
    function ka(a, b) {
      var c = a.split("|"),
        e = c.length;
      while (e--) d.attrHandle[c[e]] = b;
    }
    function la(a, b) {
      var c = b && a,
        d =
          c &&
          1 === a.nodeType &&
          1 === b.nodeType &&
          a.sourceIndex - b.sourceIndex;
      if (d) return d;
      if (c) while ((c = c.nextSibling)) if (c === b) return -1;
      return a ? 1 : -1;
    }
    function ma(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();
        return "input" === c && b.type === a;
      };
    }
    function na(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();
        return ("input" === c || "button" === c) && b.type === a;
      };
    }
    function oa(a) {
      return function (b) {
        return "form" in b
          ? b.parentNode && b.disabled === !1
            ? "label" in b
              ? "label" in b.parentNode
                ? b.parentNode.disabled === a
                : b.disabled === a
              : b.isDisabled === a || (b.isDisabled !== !a && ea(b) === a)
            : b.disabled === a
          : "label" in b && b.disabled === a;
      };
    }
    function pa(a) {
      return ia(function (b) {
        return (
          (b = +b),
          ia(function (c, d) {
            var e,
              f = a([], c.length, b),
              g = f.length;
            while (g--) c[(e = f[g])] && (c[e] = !(d[e] = c[e]));
          })
        );
      });
    }
    function qa(a) {
      return a && "undefined" != typeof a.getElementsByTagName && a;
    }
    (c = ga.support = {}),
      (f = ga.isXML = function (a) {
        var b = a && (a.ownerDocument || a).documentElement;
        return !!b && "HTML" !== b.nodeName;
      }),
      (m = ga.setDocument = function (a) {
        var b,
          e,
          g = a ? a.ownerDocument || a : v;
        return g !== n && 9 === g.nodeType && g.documentElement
          ? ((n = g),
            (o = n.documentElement),
            (p = !f(n)),
            v !== n &&
              (e = n.defaultView) &&
              e.top !== e &&
              (e.addEventListener
                ? e.addEventListener("unload", da, !1)
                : e.attachEvent && e.attachEvent("onunload", da)),
            (c.attributes = ja(function (a) {
              return (a.className = "i"), !a.getAttribute("className");
            })),
            (c.getElementsByTagName = ja(function (a) {
              return (
                a.appendChild(n.createComment("")),
                !a.getElementsByTagName("*").length
              );
            })),
            (c.getElementsByClassName = Y.test(n.getElementsByClassName)),
            (c.getById = ja(function (a) {
              return (
                (o.appendChild(a).id = u),
                !n.getElementsByName || !n.getElementsByName(u).length
              );
            })),
            c.getById
              ? ((d.filter.ID = function (a) {
                  var b = a.replace(_, aa);
                  return function (a) {
                    return a.getAttribute("id") === b;
                  };
                }),
                (d.find.ID = function (a, b) {
                  if ("undefined" != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c ? [c] : [];
                  }
                }))
              : ((d.filter.ID = function (a) {
                  var b = a.replace(_, aa);
                  return function (a) {
                    var c =
                      "undefined" != typeof a.getAttributeNode &&
                      a.getAttributeNode("id");
                    return c && c.value === b;
                  };
                }),
                (d.find.ID = function (a, b) {
                  if ("undefined" != typeof b.getElementById && p) {
                    var c,
                      d,
                      e,
                      f = b.getElementById(a);
                    if (f) {
                      if (((c = f.getAttributeNode("id")), c && c.value === a))
                        return [f];
                      (e = b.getElementsByName(a)), (d = 0);
                      while ((f = e[d++]))
                        if (
                          ((c = f.getAttributeNode("id")), c && c.value === a)
                        )
                          return [f];
                    }
                    return [];
                  }
                })),
            (d.find.TAG = c.getElementsByTagName
              ? function (a, b) {
                  return "undefined" != typeof b.getElementsByTagName
                    ? b.getElementsByTagName(a)
                    : c.qsa
                    ? b.querySelectorAll(a)
                    : void 0;
                }
              : function (a, b) {
                  var c,
                    d = [],
                    e = 0,
                    f = b.getElementsByTagName(a);
                  if ("*" === a) {
                    while ((c = f[e++])) 1 === c.nodeType && d.push(c);
                    return d;
                  }
                  return f;
                }),
            (d.find.CLASS =
              c.getElementsByClassName &&
              function (a, b) {
                if ("undefined" != typeof b.getElementsByClassName && p)
                  return b.getElementsByClassName(a);
              }),
            (r = []),
            (q = []),
            (c.qsa = Y.test(n.querySelectorAll)) &&
              (ja(function (a) {
                (o.appendChild(a).innerHTML =
                  "<a id='" +
                  u +
                  "'></a><select id='" +
                  u +
                  "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                  a.querySelectorAll("[msallowcapture^='']").length &&
                    q.push("[*^$]=" + K + "*(?:''|\"\")"),
                  a.querySelectorAll("[selected]").length ||
                    q.push("\\[" + K + "*(?:value|" + J + ")"),
                  a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="),
                  a.querySelectorAll(":checked").length || q.push(":checked"),
                  a.querySelectorAll("a#" + u + "+*").length ||
                    q.push(".#.+[+~]");
              }),
              ja(function (a) {
                a.innerHTML =
                  "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var b = n.createElement("input");
                b.setAttribute("type", "hidden"),
                  a.appendChild(b).setAttribute("name", "D"),
                  a.querySelectorAll("[name=d]").length &&
                    q.push("name" + K + "*[*^$|!~]?="),
                  2 !== a.querySelectorAll(":enabled").length &&
                    q.push(":enabled", ":disabled"),
                  (o.appendChild(a).disabled = !0),
                  2 !== a.querySelectorAll(":disabled").length &&
                    q.push(":enabled", ":disabled"),
                  a.querySelectorAll("*,:x"),
                  q.push(",.*:");
              })),
            (c.matchesSelector = Y.test(
              (s =
                o.matches ||
                o.webkitMatchesSelector ||
                o.mozMatchesSelector ||
                o.oMatchesSelector ||
                o.msMatchesSelector)
            )) &&
              ja(function (a) {
                (c.disconnectedMatch = s.call(a, "*")),
                  s.call(a, "[s!='']:x"),
                  r.push("!=", N);
              }),
            (q = q.length && new RegExp(q.join("|"))),
            (r = r.length && new RegExp(r.join("|"))),
            (b = Y.test(o.compareDocumentPosition)),
            (t =
              b || Y.test(o.contains)
                ? function (a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a,
                      d = b && b.parentNode;
                    return (
                      a === d ||
                      !(
                        !d ||
                        1 !== d.nodeType ||
                        !(c.contains
                          ? c.contains(d)
                          : a.compareDocumentPosition &&
                            16 & a.compareDocumentPosition(d))
                      )
                    );
                  }
                : function (a, b) {
                    if (b) while ((b = b.parentNode)) if (b === a) return !0;
                    return !1;
                  }),
            (B = b
              ? function (a, b) {
                  if (a === b) return (l = !0), 0;
                  var d =
                    !a.compareDocumentPosition - !b.compareDocumentPosition;
                  return d
                    ? d
                    : ((d =
                        (a.ownerDocument || a) === (b.ownerDocument || b)
                          ? a.compareDocumentPosition(b)
                          : 1),
                      1 & d ||
                      (!c.sortDetached && b.compareDocumentPosition(a) === d)
                        ? a === n || (a.ownerDocument === v && t(v, a))
                          ? -1
                          : b === n || (b.ownerDocument === v && t(v, b))
                          ? 1
                          : k
                          ? I(k, a) - I(k, b)
                          : 0
                        : 4 & d
                        ? -1
                        : 1);
                }
              : function (a, b) {
                  if (a === b) return (l = !0), 0;
                  var c,
                    d = 0,
                    e = a.parentNode,
                    f = b.parentNode,
                    g = [a],
                    h = [b];
                  if (!e || !f)
                    return a === n
                      ? -1
                      : b === n
                      ? 1
                      : e
                      ? -1
                      : f
                      ? 1
                      : k
                      ? I(k, a) - I(k, b)
                      : 0;
                  if (e === f) return la(a, b);
                  c = a;
                  while ((c = c.parentNode)) g.unshift(c);
                  c = b;
                  while ((c = c.parentNode)) h.unshift(c);
                  while (g[d] === h[d]) d++;
                  return d
                    ? la(g[d], h[d])
                    : g[d] === v
                    ? -1
                    : h[d] === v
                    ? 1
                    : 0;
                }),
            n)
          : n;
      }),
      (ga.matches = function (a, b) {
        return ga(a, null, null, b);
      }),
      (ga.matchesSelector = function (a, b) {
        if (
          ((a.ownerDocument || a) !== n && m(a),
          (b = b.replace(S, "='$1']")),
          c.matchesSelector &&
            p &&
            !A[b + " "] &&
            (!r || !r.test(b)) &&
            (!q || !q.test(b)))
        )
          try {
            var d = s.call(a, b);
            if (
              d ||
              c.disconnectedMatch ||
              (a.document && 11 !== a.document.nodeType)
            )
              return d;
          } catch (e) {}
        return ga(b, n, null, [a]).length > 0;
      }),
      (ga.contains = function (a, b) {
        return (a.ownerDocument || a) !== n && m(a), t(a, b);
      }),
      (ga.attr = function (a, b) {
        (a.ownerDocument || a) !== n && m(a);
        var e = d.attrHandle[b.toLowerCase()],
          f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
        return void 0 !== f
          ? f
          : c.attributes || !p
          ? a.getAttribute(b)
          : (f = a.getAttributeNode(b)) && f.specified
          ? f.value
          : null;
      }),
      (ga.escape = function (a) {
        return (a + "").replace(ba, ca);
      }),
      (ga.error = function (a) {
        throw new Error("Syntax error, unrecognized expression: " + a);
      }),
      (ga.uniqueSort = function (a) {
        var b,
          d = [],
          e = 0,
          f = 0;
        if (
          ((l = !c.detectDuplicates),
          (k = !c.sortStable && a.slice(0)),
          a.sort(B),
          l)
        ) {
          while ((b = a[f++])) b === a[f] && (e = d.push(f));
          while (e--) a.splice(d[e], 1);
        }
        return (k = null), a;
      }),
      (e = ga.getText = function (a) {
        var b,
          c = "",
          d = 0,
          f = a.nodeType;
        if (f) {
          if (1 === f || 9 === f || 11 === f) {
            if ("string" == typeof a.textContent) return a.textContent;
            for (a = a.firstChild; a; a = a.nextSibling) c += e(a);
          } else if (3 === f || 4 === f) return a.nodeValue;
        } else while ((b = a[d++])) c += e(b);
        return c;
      }),
      (d = ga.selectors = {
        cacheLength: 50,
        createPseudo: ia,
        match: V,
        attrHandle: {},
        find: {},
        relative: {
          ">": { dir: "parentNode", first: !0 },
          " ": { dir: "parentNode" },
          "+": { dir: "previousSibling", first: !0 },
          "~": { dir: "previousSibling" },
        },
        preFilter: {
          ATTR: function (a) {
            return (
              (a[1] = a[1].replace(_, aa)),
              (a[3] = (a[3] || a[4] || a[5] || "").replace(_, aa)),
              "~=" === a[2] && (a[3] = " " + a[3] + " "),
              a.slice(0, 4)
            );
          },
          CHILD: function (a) {
            return (
              (a[1] = a[1].toLowerCase()),
              "nth" === a[1].slice(0, 3)
                ? (a[3] || ga.error(a[0]),
                  (a[4] = +(a[4]
                    ? a[5] + (a[6] || 1)
                    : 2 * ("even" === a[3] || "odd" === a[3]))),
                  (a[5] = +(a[7] + a[8] || "odd" === a[3])))
                : a[3] && ga.error(a[0]),
              a
            );
          },
          PSEUDO: function (a) {
            var b,
              c = !a[6] && a[2];
            return V.CHILD.test(a[0])
              ? null
              : (a[3]
                  ? (a[2] = a[4] || a[5] || "")
                  : c &&
                    T.test(c) &&
                    (b = g(c, !0)) &&
                    (b = c.indexOf(")", c.length - b) - c.length) &&
                    ((a[0] = a[0].slice(0, b)), (a[2] = c.slice(0, b))),
                a.slice(0, 3));
          },
        },
        filter: {
          TAG: function (a) {
            var b = a.replace(_, aa).toLowerCase();
            return "*" === a
              ? function () {
                  return !0;
                }
              : function (a) {
                  return a.nodeName && a.nodeName.toLowerCase() === b;
                };
          },
          CLASS: function (a) {
            var b = y[a + " "];
            return (
              b ||
              ((b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) &&
                y(a, function (a) {
                  return b.test(
                    ("string" == typeof a.className && a.className) ||
                      ("undefined" != typeof a.getAttribute &&
                        a.getAttribute("class")) ||
                      ""
                  );
                }))
            );
          },
          ATTR: function (a, b, c) {
            return function (d) {
              var e = ga.attr(d, a);
              return null == e
                ? "!=" === b
                : !b ||
                    ((e += ""),
                    "=" === b
                      ? e === c
                      : "!=" === b
                      ? e !== c
                      : "^=" === b
                      ? c && 0 === e.indexOf(c)
                      : "*=" === b
                      ? c && e.indexOf(c) > -1
                      : "$=" === b
                      ? c && e.slice(-c.length) === c
                      : "~=" === b
                      ? (" " + e.replace(O, " ") + " ").indexOf(c) > -1
                      : "|=" === b &&
                        (e === c || e.slice(0, c.length + 1) === c + "-"));
            };
          },
          CHILD: function (a, b, c, d, e) {
            var f = "nth" !== a.slice(0, 3),
              g = "last" !== a.slice(-4),
              h = "of-type" === b;
            return 1 === d && 0 === e
              ? function (a) {
                  return !!a.parentNode;
                }
              : function (b, c, i) {
                  var j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p = f !== g ? "nextSibling" : "previousSibling",
                    q = b.parentNode,
                    r = h && b.nodeName.toLowerCase(),
                    s = !i && !h,
                    t = !1;
                  if (q) {
                    if (f) {
                      while (p) {
                        m = b;
                        while ((m = m[p]))
                          if (
                            h
                              ? m.nodeName.toLowerCase() === r
                              : 1 === m.nodeType
                          )
                            return !1;
                        o = p = "only" === a && !o && "nextSibling";
                      }
                      return !0;
                    }
                    if (((o = [g ? q.firstChild : q.lastChild]), g && s)) {
                      (m = q),
                        (l = m[u] || (m[u] = {})),
                        (k = l[m.uniqueID] || (l[m.uniqueID] = {})),
                        (j = k[a] || []),
                        (n = j[0] === w && j[1]),
                        (t = n && j[2]),
                        (m = n && q.childNodes[n]);
                      while ((m = (++n && m && m[p]) || (t = n = 0) || o.pop()))
                        if (1 === m.nodeType && ++t && m === b) {
                          k[a] = [w, n, t];
                          break;
                        }
                    } else if (
                      (s &&
                        ((m = b),
                        (l = m[u] || (m[u] = {})),
                        (k = l[m.uniqueID] || (l[m.uniqueID] = {})),
                        (j = k[a] || []),
                        (n = j[0] === w && j[1]),
                        (t = n)),
                      t === !1)
                    )
                      while ((m = (++n && m && m[p]) || (t = n = 0) || o.pop()))
                        if (
                          (h
                            ? m.nodeName.toLowerCase() === r
                            : 1 === m.nodeType) &&
                          ++t &&
                          (s &&
                            ((l = m[u] || (m[u] = {})),
                            (k = l[m.uniqueID] || (l[m.uniqueID] = {})),
                            (k[a] = [w, t])),
                          m === b)
                        )
                          break;
                    return (t -= e), t === d || (t % d === 0 && t / d >= 0);
                  }
                };
          },
          PSEUDO: function (a, b) {
            var c,
              e =
                d.pseudos[a] ||
                d.setFilters[a.toLowerCase()] ||
                ga.error("unsupported pseudo: " + a);
            return e[u]
              ? e(b)
              : e.length > 1
              ? ((c = [a, a, "", b]),
                d.setFilters.hasOwnProperty(a.toLowerCase())
                  ? ia(function (a, c) {
                      var d,
                        f = e(a, b),
                        g = f.length;
                      while (g--) (d = I(a, f[g])), (a[d] = !(c[d] = f[g]));
                    })
                  : function (a) {
                      return e(a, 0, c);
                    })
              : e;
          },
        },
        pseudos: {
          not: ia(function (a) {
            var b = [],
              c = [],
              d = h(a.replace(P, "$1"));
            return d[u]
              ? ia(function (a, b, c, e) {
                  var f,
                    g = d(a, null, e, []),
                    h = a.length;
                  while (h--) (f = g[h]) && (a[h] = !(b[h] = f));
                })
              : function (a, e, f) {
                  return (b[0] = a), d(b, null, f, c), (b[0] = null), !c.pop();
                };
          }),
          has: ia(function (a) {
            return function (b) {
              return ga(a, b).length > 0;
            };
          }),
          contains: ia(function (a) {
            return (
              (a = a.replace(_, aa)),
              function (b) {
                return (b.textContent || b.innerText || e(b)).indexOf(a) > -1;
              }
            );
          }),
          lang: ia(function (a) {
            return (
              U.test(a || "") || ga.error("unsupported lang: " + a),
              (a = a.replace(_, aa).toLowerCase()),
              function (b) {
                var c;
                do
                  if (
                    (c = p
                      ? b.lang
                      : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                  )
                    return (
                      (c = c.toLowerCase()), c === a || 0 === c.indexOf(a + "-")
                    );
                while ((b = b.parentNode) && 1 === b.nodeType);
                return !1;
              }
            );
          }),
          target: function (b) {
            var c = a.location && a.location.hash;
            return c && c.slice(1) === b.id;
          },
          root: function (a) {
            return a === o;
          },
          focus: function (a) {
            return (
              a === n.activeElement &&
              (!n.hasFocus || n.hasFocus()) &&
              !!(a.type || a.href || ~a.tabIndex)
            );
          },
          enabled: oa(!1),
          disabled: oa(!0),
          checked: function (a) {
            var b = a.nodeName.toLowerCase();
            return (
              ("input" === b && !!a.checked) || ("option" === b && !!a.selected)
            );
          },
          selected: function (a) {
            return (
              a.parentNode && a.parentNode.selectedIndex, a.selected === !0
            );
          },
          empty: function (a) {
            for (a = a.firstChild; a; a = a.nextSibling)
              if (a.nodeType < 6) return !1;
            return !0;
          },
          parent: function (a) {
            return !d.pseudos.empty(a);
          },
          header: function (a) {
            return X.test(a.nodeName);
          },
          input: function (a) {
            return W.test(a.nodeName);
          },
          button: function (a) {
            var b = a.nodeName.toLowerCase();
            return ("input" === b && "button" === a.type) || "button" === b;
          },
          text: function (a) {
            var b;
            return (
              "input" === a.nodeName.toLowerCase() &&
              "text" === a.type &&
              (null == (b = a.getAttribute("type")) ||
                "text" === b.toLowerCase())
            );
          },
          first: pa(function () {
            return [0];
          }),
          last: pa(function (a, b) {
            return [b - 1];
          }),
          eq: pa(function (a, b, c) {
            return [c < 0 ? c + b : c];
          }),
          even: pa(function (a, b) {
            for (var c = 0; c < b; c += 2) a.push(c);
            return a;
          }),
          odd: pa(function (a, b) {
            for (var c = 1; c < b; c += 2) a.push(c);
            return a;
          }),
          lt: pa(function (a, b, c) {
            for (var d = c < 0 ? c + b : c; --d >= 0; ) a.push(d);
            return a;
          }),
          gt: pa(function (a, b, c) {
            for (var d = c < 0 ? c + b : c; ++d < b; ) a.push(d);
            return a;
          }),
        },
      }),
      (d.pseudos.nth = d.pseudos.eq);
    for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
      d.pseudos[b] = ma(b);
    for (b in { submit: !0, reset: !0 }) d.pseudos[b] = na(b);
    function ra() {}
    (ra.prototype = d.filters = d.pseudos),
      (d.setFilters = new ra()),
      (g = ga.tokenize = function (a, b) {
        var c,
          e,
          f,
          g,
          h,
          i,
          j,
          k = z[a + " "];
        if (k) return b ? 0 : k.slice(0);
        (h = a), (i = []), (j = d.preFilter);
        while (h) {
          (c && !(e = Q.exec(h))) ||
            (e && (h = h.slice(e[0].length) || h), i.push((f = []))),
            (c = !1),
            (e = R.exec(h)) &&
              ((c = e.shift()),
              f.push({ value: c, type: e[0].replace(P, " ") }),
              (h = h.slice(c.length)));
          for (g in d.filter)
            !(e = V[g].exec(h)) ||
              (j[g] && !(e = j[g](e))) ||
              ((c = e.shift()),
              f.push({ value: c, type: g, matches: e }),
              (h = h.slice(c.length)));
          if (!c) break;
        }
        return b ? h.length : h ? ga.error(a) : z(a, i).slice(0);
      });
    function sa(a) {
      for (var b = 0, c = a.length, d = ""; b < c; b++) d += a[b].value;
      return d;
    }
    function ta(a, b, c) {
      var d = b.dir,
        e = b.next,
        f = e || d,
        g = c && "parentNode" === f,
        h = x++;
      return b.first
        ? function (b, c, e) {
            while ((b = b[d])) if (1 === b.nodeType || g) return a(b, c, e);
            return !1;
          }
        : function (b, c, i) {
            var j,
              k,
              l,
              m = [w, h];
            if (i) {
              while ((b = b[d]))
                if ((1 === b.nodeType || g) && a(b, c, i)) return !0;
            } else
              while ((b = b[d]))
                if (1 === b.nodeType || g)
                  if (
                    ((l = b[u] || (b[u] = {})),
                    (k = l[b.uniqueID] || (l[b.uniqueID] = {})),
                    e && e === b.nodeName.toLowerCase())
                  )
                    b = b[d] || b;
                  else {
                    if ((j = k[f]) && j[0] === w && j[1] === h)
                      return (m[2] = j[2]);
                    if (((k[f] = m), (m[2] = a(b, c, i)))) return !0;
                  }
            return !1;
          };
    }
    function ua(a) {
      return a.length > 1
        ? function (b, c, d) {
            var e = a.length;
            while (e--) if (!a[e](b, c, d)) return !1;
            return !0;
          }
        : a[0];
    }
    function va(a, b, c) {
      for (var d = 0, e = b.length; d < e; d++) ga(a, b[d], c);
      return c;
    }
    function wa(a, b, c, d, e) {
      for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++)
        (f = a[h]) && ((c && !c(f, d, e)) || (g.push(f), j && b.push(h)));
      return g;
    }
    function xa(a, b, c, d, e, f) {
      return (
        d && !d[u] && (d = xa(d)),
        e && !e[u] && (e = xa(e, f)),
        ia(function (f, g, h, i) {
          var j,
            k,
            l,
            m = [],
            n = [],
            o = g.length,
            p = f || va(b || "*", h.nodeType ? [h] : h, []),
            q = !a || (!f && b) ? p : wa(p, m, a, h, i),
            r = c ? (e || (f ? a : o || d) ? [] : g) : q;
          if ((c && c(q, r, h, i), d)) {
            (j = wa(r, n)), d(j, [], h, i), (k = j.length);
            while (k--) (l = j[k]) && (r[n[k]] = !(q[n[k]] = l));
          }
          if (f) {
            if (e || a) {
              if (e) {
                (j = []), (k = r.length);
                while (k--) (l = r[k]) && j.push((q[k] = l));
                e(null, (r = []), j, i);
              }
              k = r.length;
              while (k--)
                (l = r[k]) &&
                  (j = e ? I(f, l) : m[k]) > -1 &&
                  (f[j] = !(g[j] = l));
            }
          } else (r = wa(r === g ? r.splice(o, r.length) : r)), e ? e(null, g, r, i) : G.apply(g, r);
        })
      );
    }
    function ya(a) {
      for (
        var b,
          c,
          e,
          f = a.length,
          g = d.relative[a[0].type],
          h = g || d.relative[" "],
          i = g ? 1 : 0,
          k = ta(
            function (a) {
              return a === b;
            },
            h,
            !0
          ),
          l = ta(
            function (a) {
              return I(b, a) > -1;
            },
            h,
            !0
          ),
          m = [
            function (a, c, d) {
              var e =
                (!g && (d || c !== j)) ||
                ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
              return (b = null), e;
            },
          ];
        i < f;
        i++
      )
        if ((c = d.relative[a[i].type])) m = [ta(ua(m), c)];
        else {
          if (((c = d.filter[a[i].type].apply(null, a[i].matches)), c[u])) {
            for (e = ++i; e < f; e++) if (d.relative[a[e].type]) break;
            return xa(
              i > 1 && ua(m),
              i > 1 &&
                sa(
                  a
                    .slice(0, i - 1)
                    .concat({ value: " " === a[i - 2].type ? "*" : "" })
                ).replace(P, "$1"),
              c,
              i < e && ya(a.slice(i, e)),
              e < f && ya((a = a.slice(e))),
              e < f && sa(a)
            );
          }
          m.push(c);
        }
      return ua(m);
    }
    function za(a, b) {
      var c = b.length > 0,
        e = a.length > 0,
        f = function (f, g, h, i, k) {
          var l,
            o,
            q,
            r = 0,
            s = "0",
            t = f && [],
            u = [],
            v = j,
            x = f || (e && d.find.TAG("*", k)),
            y = (w += null == v ? 1 : Math.random() || 0.1),
            z = x.length;
          for (
            k && (j = g === n || g || k);
            s !== z && null != (l = x[s]);
            s++
          ) {
            if (e && l) {
              (o = 0), g || l.ownerDocument === n || (m(l), (h = !p));
              while ((q = a[o++]))
                if (q(l, g || n, h)) {
                  i.push(l);
                  break;
                }
              k && (w = y);
            }
            c && ((l = !q && l) && r--, f && t.push(l));
          }
          if (((r += s), c && s !== r)) {
            o = 0;
            while ((q = b[o++])) q(t, u, g, h);
            if (f) {
              if (r > 0) while (s--) t[s] || u[s] || (u[s] = E.call(i));
              u = wa(u);
            }
            G.apply(i, u),
              k && !f && u.length > 0 && r + b.length > 1 && ga.uniqueSort(i);
          }
          return k && ((w = y), (j = v)), t;
        };
      return c ? ia(f) : f;
    }
    return (
      (h = ga.compile = function (a, b) {
        var c,
          d = [],
          e = [],
          f = A[a + " "];
        if (!f) {
          b || (b = g(a)), (c = b.length);
          while (c--) (f = ya(b[c])), f[u] ? d.push(f) : e.push(f);
          (f = A(a, za(e, d))), (f.selector = a);
        }
        return f;
      }),
      (i = ga.select = function (a, b, c, e) {
        var f,
          i,
          j,
          k,
          l,
          m = "function" == typeof a && a,
          n = !e && g((a = m.selector || a));
        if (((c = c || []), 1 === n.length)) {
          if (
            ((i = n[0] = n[0].slice(0)),
            i.length > 2 &&
              "ID" === (j = i[0]).type &&
              9 === b.nodeType &&
              p &&
              d.relative[i[1].type])
          ) {
            if (
              ((b = (d.find.ID(j.matches[0].replace(_, aa), b) || [])[0]), !b)
            )
              return c;
            m && (b = b.parentNode), (a = a.slice(i.shift().value.length));
          }
          f = V.needsContext.test(a) ? 0 : i.length;
          while (f--) {
            if (((j = i[f]), d.relative[(k = j.type)])) break;
            if (
              (l = d.find[k]) &&
              (e = l(
                j.matches[0].replace(_, aa),
                ($.test(i[0].type) && qa(b.parentNode)) || b
              ))
            ) {
              if ((i.splice(f, 1), (a = e.length && sa(i)), !a))
                return G.apply(c, e), c;
              break;
            }
          }
        }
        return (
          (m || h(a, n))(
            e,
            b,
            !p,
            c,
            !b || ($.test(a) && qa(b.parentNode)) || b
          ),
          c
        );
      }),
      (c.sortStable = u.split("").sort(B).join("") === u),
      (c.detectDuplicates = !!l),
      m(),
      (c.sortDetached = ja(function (a) {
        return 1 & a.compareDocumentPosition(n.createElement("fieldset"));
      })),
      ja(function (a) {
        return (
          (a.innerHTML = "<a href='#'></a>"),
          "#" === a.firstChild.getAttribute("href")
        );
      }) ||
        ka("type|href|height|width", function (a, b, c) {
          if (!c) return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
        }),
      (c.attributes &&
        ja(function (a) {
          return (
            (a.innerHTML = "<input/>"),
            a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
          );
        })) ||
        ka("value", function (a, b, c) {
          if (!c && "input" === a.nodeName.toLowerCase()) return a.defaultValue;
        }),
      ja(function (a) {
        return null == a.getAttribute("disabled");
      }) ||
        ka(J, function (a, b, c) {
          var d;
          if (!c)
            return a[b] === !0
              ? b.toLowerCase()
              : (d = a.getAttributeNode(b)) && d.specified
              ? d.value
              : null;
        }),
      ga
    );
  })(a);
  (r.find = x),
    (r.expr = x.selectors),
    (r.expr[":"] = r.expr.pseudos),
    (r.uniqueSort = r.unique = x.uniqueSort),
    (r.text = x.getText),
    (r.isXMLDoc = x.isXML),
    (r.contains = x.contains),
    (r.escapeSelector = x.escape);
  var y = function (a, b, c) {
      var d = [],
        e = void 0 !== c;
      while ((a = a[b]) && 9 !== a.nodeType)
        if (1 === a.nodeType) {
          if (e && r(a).is(c)) break;
          d.push(a);
        }
      return d;
    },
    z = function (a, b) {
      for (var c = []; a; a = a.nextSibling)
        1 === a.nodeType && a !== b && c.push(a);
      return c;
    },
    A = r.expr.match.needsContext;
  function B(a, b) {
    return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
  }
  var C = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
    D = /^.[^:#\[\.,]*$/;
  function E(a, b, c) {
    return r.isFunction(b)
      ? r.grep(a, function (a, d) {
          return !!b.call(a, d, a) !== c;
        })
      : b.nodeType
      ? r.grep(a, function (a) {
          return (a === b) !== c;
        })
      : "string" != typeof b
      ? r.grep(a, function (a) {
          return i.call(b, a) > -1 !== c;
        })
      : D.test(b)
      ? r.filter(b, a, c)
      : ((b = r.filter(b, a)),
        r.grep(a, function (a) {
          return i.call(b, a) > -1 !== c && 1 === a.nodeType;
        }));
  }
  (r.filter = function (a, b, c) {
    var d = b[0];
    return (
      c && (a = ":not(" + a + ")"),
      1 === b.length && 1 === d.nodeType
        ? r.find.matchesSelector(d, a)
          ? [d]
          : []
        : r.find.matches(
            a,
            r.grep(b, function (a) {
              return 1 === a.nodeType;
            })
          )
    );
  }),
    r.fn.extend({
      find: function (a) {
        var b,
          c,
          d = this.length,
          e = this;
        if ("string" != typeof a)
          return this.pushStack(
            r(a).filter(function () {
              for (b = 0; b < d; b++) if (r.contains(e[b], this)) return !0;
            })
          );
        for (c = this.pushStack([]), b = 0; b < d; b++) r.find(a, e[b], c);
        return d > 1 ? r.uniqueSort(c) : c;
      },
      filter: function (a) {
        return this.pushStack(E(this, a || [], !1));
      },
      not: function (a) {
        return this.pushStack(E(this, a || [], !0));
      },
      is: function (a) {
        return !!E(this, "string" == typeof a && A.test(a) ? r(a) : a || [], !1)
          .length;
      },
    });
  var F,
    G = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
    H = (r.fn.init = function (a, b, c) {
      var e, f;
      if (!a) return this;
      if (((c = c || F), "string" == typeof a)) {
        if (
          ((e =
            "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3
              ? [null, a, null]
              : G.exec(a)),
          !e || (!e[1] && b))
        )
          return !b || b.jquery
            ? (b || c).find(a)
            : this.constructor(b).find(a);
        if (e[1]) {
          if (
            ((b = b instanceof r ? b[0] : b),
            r.merge(
              this,
              r.parseHTML(e[1], b && b.nodeType ? b.ownerDocument || b : d, !0)
            ),
            C.test(e[1]) && r.isPlainObject(b))
          )
            for (e in b)
              r.isFunction(this[e]) ? this[e](b[e]) : this.attr(e, b[e]);
          return this;
        }
        return (
          (f = d.getElementById(e[2])),
          f && ((this[0] = f), (this.length = 1)),
          this
        );
      }
      return a.nodeType
        ? ((this[0] = a), (this.length = 1), this)
        : r.isFunction(a)
        ? void 0 !== c.ready
          ? c.ready(a)
          : a(r)
        : r.makeArray(a, this);
    });
  (H.prototype = r.fn), (F = r(d));
  var I = /^(?:parents|prev(?:Until|All))/,
    J = { children: !0, contents: !0, next: !0, prev: !0 };
  r.fn.extend({
    has: function (a) {
      var b = r(a, this),
        c = b.length;
      return this.filter(function () {
        for (var a = 0; a < c; a++) if (r.contains(this, b[a])) return !0;
      });
    },
    closest: function (a, b) {
      var c,
        d = 0,
        e = this.length,
        f = [],
        g = "string" != typeof a && r(a);
      if (!A.test(a))
        for (; d < e; d++)
          for (c = this[d]; c && c !== b; c = c.parentNode)
            if (
              c.nodeType < 11 &&
              (g
                ? g.index(c) > -1
                : 1 === c.nodeType && r.find.matchesSelector(c, a))
            ) {
              f.push(c);
              break;
            }
      return this.pushStack(f.length > 1 ? r.uniqueSort(f) : f);
    },
    index: function (a) {
      return a
        ? "string" == typeof a
          ? i.call(r(a), this[0])
          : i.call(this, a.jquery ? a[0] : a)
        : this[0] && this[0].parentNode
        ? this.first().prevAll().length
        : -1;
    },
    add: function (a, b) {
      return this.pushStack(r.uniqueSort(r.merge(this.get(), r(a, b))));
    },
    addBack: function (a) {
      return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
    },
  });
  function K(a, b) {
    while ((a = a[b]) && 1 !== a.nodeType);
    return a;
  }
  r.each(
    {
      parent: function (a) {
        var b = a.parentNode;
        return b && 11 !== b.nodeType ? b : null;
      },
      parents: function (a) {
        return y(a, "parentNode");
      },
      parentsUntil: function (a, b, c) {
        return y(a, "parentNode", c);
      },
      next: function (a) {
        return K(a, "nextSibling");
      },
      prev: function (a) {
        return K(a, "previousSibling");
      },
      nextAll: function (a) {
        return y(a, "nextSibling");
      },
      prevAll: function (a) {
        return y(a, "previousSibling");
      },
      nextUntil: function (a, b, c) {
        return y(a, "nextSibling", c);
      },
      prevUntil: function (a, b, c) {
        return y(a, "previousSibling", c);
      },
      siblings: function (a) {
        return z((a.parentNode || {}).firstChild, a);
      },
      children: function (a) {
        return z(a.firstChild);
      },
      contents: function (a) {
        return B(a, "iframe")
          ? a.contentDocument
          : (B(a, "template") && (a = a.content || a),
            r.merge([], a.childNodes));
      },
    },
    function (a, b) {
      r.fn[a] = function (c, d) {
        var e = r.map(this, b, c);
        return (
          "Until" !== a.slice(-5) && (d = c),
          d && "string" == typeof d && (e = r.filter(d, e)),
          this.length > 1 &&
            (J[a] || r.uniqueSort(e), I.test(a) && e.reverse()),
          this.pushStack(e)
        );
      };
    }
  );
  var L = /[^\x20\t\r\n\f]+/g;
  function M(a) {
    var b = {};
    return (
      r.each(a.match(L) || [], function (a, c) {
        b[c] = !0;
      }),
      b
    );
  }
  r.Callbacks = function (a) {
    a = "string" == typeof a ? M(a) : r.extend({}, a);
    var b,
      c,
      d,
      e,
      f = [],
      g = [],
      h = -1,
      i = function () {
        for (e = e || a.once, d = b = !0; g.length; h = -1) {
          c = g.shift();
          while (++h < f.length)
            f[h].apply(c[0], c[1]) === !1 &&
              a.stopOnFalse &&
              ((h = f.length), (c = !1));
        }
        a.memory || (c = !1), (b = !1), e && (f = c ? [] : "");
      },
      j = {
        add: function () {
          return (
            f &&
              (c && !b && ((h = f.length - 1), g.push(c)),
              (function d(b) {
                r.each(b, function (b, c) {
                  r.isFunction(c)
                    ? (a.unique && j.has(c)) || f.push(c)
                    : c && c.length && "string" !== r.type(c) && d(c);
                });
              })(arguments),
              c && !b && i()),
            this
          );
        },
        remove: function () {
          return (
            r.each(arguments, function (a, b) {
              var c;
              while ((c = r.inArray(b, f, c)) > -1)
                f.splice(c, 1), c <= h && h--;
            }),
            this
          );
        },
        has: function (a) {
          return a ? r.inArray(a, f) > -1 : f.length > 0;
        },
        empty: function () {
          return f && (f = []), this;
        },
        disable: function () {
          return (e = g = []), (f = c = ""), this;
        },
        disabled: function () {
          return !f;
        },
        lock: function () {
          return (e = g = []), c || b || (f = c = ""), this;
        },
        locked: function () {
          return !!e;
        },
        fireWith: function (a, c) {
          return (
            e ||
              ((c = c || []),
              (c = [a, c.slice ? c.slice() : c]),
              g.push(c),
              b || i()),
            this
          );
        },
        fire: function () {
          return j.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!d;
        },
      };
    return j;
  };
  function N(a) {
    return a;
  }
  function O(a) {
    throw a;
  }
  function P(a, b, c, d) {
    var e;
    try {
      a && r.isFunction((e = a.promise))
        ? e.call(a).done(b).fail(c)
        : a && r.isFunction((e = a.then))
        ? e.call(a, b, c)
        : b.apply(void 0, [a].slice(d));
    } catch (a) {
      c.apply(void 0, [a]);
    }
  }
  r.extend({
    Deferred: function (b) {
      var c = [
          [
            "notify",
            "progress",
            r.Callbacks("memory"),
            r.Callbacks("memory"),
            2,
          ],
          [
            "resolve",
            "done",
            r.Callbacks("once memory"),
            r.Callbacks("once memory"),
            0,
            "resolved",
          ],
          [
            "reject",
            "fail",
            r.Callbacks("once memory"),
            r.Callbacks("once memory"),
            1,
            "rejected",
          ],
        ],
        d = "pending",
        e = {
          state: function () {
            return d;
          },
          always: function () {
            return f.done(arguments).fail(arguments), this;
          },
          catch: function (a) {
            return e.then(null, a);
          },
          pipe: function () {
            var a = arguments;
            return r
              .Deferred(function (b) {
                r.each(c, function (c, d) {
                  var e = r.isFunction(a[d[4]]) && a[d[4]];
                  f[d[1]](function () {
                    var a = e && e.apply(this, arguments);
                    a && r.isFunction(a.promise)
                      ? a
                          .promise()
                          .progress(b.notify)
                          .done(b.resolve)
                          .fail(b.reject)
                      : b[d[0] + "With"](this, e ? [a] : arguments);
                  });
                }),
                  (a = null);
              })
              .promise();
          },
          then: function (b, d, e) {
            var f = 0;
            function g(b, c, d, e) {
              return function () {
                var h = this,
                  i = arguments,
                  j = function () {
                    var a, j;
                    if (!(b < f)) {
                      if (((a = d.apply(h, i)), a === c.promise()))
                        throw new TypeError("Thenable self-resolution");
                      (j =
                        a &&
                        ("object" == typeof a || "function" == typeof a) &&
                        a.then),
                        r.isFunction(j)
                          ? e
                            ? j.call(a, g(f, c, N, e), g(f, c, O, e))
                            : (f++,
                              j.call(
                                a,
                                g(f, c, N, e),
                                g(f, c, O, e),
                                g(f, c, N, c.notifyWith)
                              ))
                          : (d !== N && ((h = void 0), (i = [a])),
                            (e || c.resolveWith)(h, i));
                    }
                  },
                  k = e
                    ? j
                    : function () {
                        try {
                          j();
                        } catch (a) {
                          r.Deferred.exceptionHook &&
                            r.Deferred.exceptionHook(a, k.stackTrace),
                            b + 1 >= f &&
                              (d !== O && ((h = void 0), (i = [a])),
                              c.rejectWith(h, i));
                        }
                      };
                b
                  ? k()
                  : (r.Deferred.getStackHook &&
                      (k.stackTrace = r.Deferred.getStackHook()),
                    a.setTimeout(k));
              };
            }
            return r
              .Deferred(function (a) {
                c[0][3].add(g(0, a, r.isFunction(e) ? e : N, a.notifyWith)),
                  c[1][3].add(g(0, a, r.isFunction(b) ? b : N)),
                  c[2][3].add(g(0, a, r.isFunction(d) ? d : O));
              })
              .promise();
          },
          promise: function (a) {
            return null != a ? r.extend(a, e) : e;
          },
        },
        f = {};
      return (
        r.each(c, function (a, b) {
          var g = b[2],
            h = b[5];
          (e[b[1]] = g.add),
            h &&
              g.add(
                function () {
                  d = h;
                },
                c[3 - a][2].disable,
                c[0][2].lock
              ),
            g.add(b[3].fire),
            (f[b[0]] = function () {
              return (
                f[b[0] + "With"](this === f ? void 0 : this, arguments), this
              );
            }),
            (f[b[0] + "With"] = g.fireWith);
        }),
        e.promise(f),
        b && b.call(f, f),
        f
      );
    },
    when: function (a) {
      var b = arguments.length,
        c = b,
        d = Array(c),
        e = f.call(arguments),
        g = r.Deferred(),
        h = function (a) {
          return function (c) {
            (d[a] = this),
              (e[a] = arguments.length > 1 ? f.call(arguments) : c),
              --b || g.resolveWith(d, e);
          };
        };
      if (
        b <= 1 &&
        (P(a, g.done(h(c)).resolve, g.reject, !b),
        "pending" === g.state() || r.isFunction(e[c] && e[c].then))
      )
        return g.then();
      while (c--) P(e[c], h(c), g.reject);
      return g.promise();
    },
  });
  var Q = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  (r.Deferred.exceptionHook = function (b, c) {
    a.console &&
      a.console.warn &&
      b &&
      Q.test(b.name) &&
      a.console.warn("jQuery.Deferred exception: " + b.message, b.stack, c);
  }),
    (r.readyException = function (b) {
      a.setTimeout(function () {
        throw b;
      });
    });
  var R = r.Deferred();
  (r.fn.ready = function (a) {
    return (
      R.then(a)["catch"](function (a) {
        r.readyException(a);
      }),
      this
    );
  }),
    r.extend({
      isReady: !1,
      readyWait: 1,
      ready: function (a) {
        (a === !0 ? --r.readyWait : r.isReady) ||
          ((r.isReady = !0),
          (a !== !0 && --r.readyWait > 0) || R.resolveWith(d, [r]));
      },
    }),
    (r.ready.then = R.then);
  function S() {
    d.removeEventListener("DOMContentLoaded", S),
      a.removeEventListener("load", S),
      r.ready();
  }
  "complete" === d.readyState ||
  ("loading" !== d.readyState && !d.documentElement.doScroll)
    ? a.setTimeout(r.ready)
    : (d.addEventListener("DOMContentLoaded", S),
      a.addEventListener("load", S));
  var T = function (a, b, c, d, e, f, g) {
      var h = 0,
        i = a.length,
        j = null == c;
      if ("object" === r.type(c)) {
        e = !0;
        for (h in c) T(a, b, h, c[h], !0, f, g);
      } else if (
        void 0 !== d &&
        ((e = !0),
        r.isFunction(d) || (g = !0),
        j &&
          (g
            ? (b.call(a, d), (b = null))
            : ((j = b),
              (b = function (a, b, c) {
                return j.call(r(a), c);
              }))),
        b)
      )
        for (; h < i; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
      return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
    },
    U = function (a) {
      return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType;
    };
  function V() {
    this.expando = r.expando + V.uid++;
  }
  (V.uid = 1),
    (V.prototype = {
      cache: function (a) {
        var b = a[this.expando];
        return (
          b ||
            ((b = {}),
            U(a) &&
              (a.nodeType
                ? (a[this.expando] = b)
                : Object.defineProperty(a, this.expando, {
                    value: b,
                    configurable: !0,
                  }))),
          b
        );
      },
      set: function (a, b, c) {
        var d,
          e = this.cache(a);
        if ("string" == typeof b) e[r.camelCase(b)] = c;
        else for (d in b) e[r.camelCase(d)] = b[d];
        return e;
      },
      get: function (a, b) {
        return void 0 === b
          ? this.cache(a)
          : a[this.expando] && a[this.expando][r.camelCase(b)];
      },
      access: function (a, b, c) {
        return void 0 === b || (b && "string" == typeof b && void 0 === c)
          ? this.get(a, b)
          : (this.set(a, b, c), void 0 !== c ? c : b);
      },
      remove: function (a, b) {
        var c,
          d = a[this.expando];
        if (void 0 !== d) {
          if (void 0 !== b) {
            Array.isArray(b)
              ? (b = b.map(r.camelCase))
              : ((b = r.camelCase(b)), (b = b in d ? [b] : b.match(L) || [])),
              (c = b.length);
            while (c--) delete d[b[c]];
          }
          (void 0 === b || r.isEmptyObject(d)) &&
            (a.nodeType ? (a[this.expando] = void 0) : delete a[this.expando]);
        }
      },
      hasData: function (a) {
        var b = a[this.expando];
        return void 0 !== b && !r.isEmptyObject(b);
      },
    });
  var W = new V(),
    X = new V(),
    Y = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    Z = /[A-Z]/g;
  function $(a) {
    return (
      "true" === a ||
      ("false" !== a &&
        ("null" === a
          ? null
          : a === +a + ""
          ? +a
          : Y.test(a)
          ? JSON.parse(a)
          : a))
    );
  }
  function _(a, b, c) {
    var d;
    if (void 0 === c && 1 === a.nodeType)
      if (
        ((d = "data-" + b.replace(Z, "-$&").toLowerCase()),
        (c = a.getAttribute(d)),
        "string" == typeof c)
      ) {
        try {
          c = $(c);
        } catch (e) {}
        X.set(a, b, c);
      } else c = void 0;
    return c;
  }
  r.extend({
    hasData: function (a) {
      return X.hasData(a) || W.hasData(a);
    },
    data: function (a, b, c) {
      return X.access(a, b, c);
    },
    removeData: function (a, b) {
      X.remove(a, b);
    },
    _data: function (a, b, c) {
      return W.access(a, b, c);
    },
    _removeData: function (a, b) {
      W.remove(a, b);
    },
  }),
    r.fn.extend({
      data: function (a, b) {
        var c,
          d,
          e,
          f = this[0],
          g = f && f.attributes;
        if (void 0 === a) {
          if (
            this.length &&
            ((e = X.get(f)), 1 === f.nodeType && !W.get(f, "hasDataAttrs"))
          ) {
            c = g.length;
            while (c--)
              g[c] &&
                ((d = g[c].name),
                0 === d.indexOf("data-") &&
                  ((d = r.camelCase(d.slice(5))), _(f, d, e[d])));
            W.set(f, "hasDataAttrs", !0);
          }
          return e;
        }
        return "object" == typeof a
          ? this.each(function () {
              X.set(this, a);
            })
          : T(
              this,
              function (b) {
                var c;
                if (f && void 0 === b) {
                  if (((c = X.get(f, a)), void 0 !== c)) return c;
                  if (((c = _(f, a)), void 0 !== c)) return c;
                } else
                  this.each(function () {
                    X.set(this, a, b);
                  });
              },
              null,
              b,
              arguments.length > 1,
              null,
              !0
            );
      },
      removeData: function (a) {
        return this.each(function () {
          X.remove(this, a);
        });
      },
    }),
    r.extend({
      queue: function (a, b, c) {
        var d;
        if (a)
          return (
            (b = (b || "fx") + "queue"),
            (d = W.get(a, b)),
            c &&
              (!d || Array.isArray(c)
                ? (d = W.access(a, b, r.makeArray(c)))
                : d.push(c)),
            d || []
          );
      },
      dequeue: function (a, b) {
        b = b || "fx";
        var c = r.queue(a, b),
          d = c.length,
          e = c.shift(),
          f = r._queueHooks(a, b),
          g = function () {
            r.dequeue(a, b);
          };
        "inprogress" === e && ((e = c.shift()), d--),
          e &&
            ("fx" === b && c.unshift("inprogress"),
            delete f.stop,
            e.call(a, g, f)),
          !d && f && f.empty.fire();
      },
      _queueHooks: function (a, b) {
        var c = b + "queueHooks";
        return (
          W.get(a, c) ||
          W.access(a, c, {
            empty: r.Callbacks("once memory").add(function () {
              W.remove(a, [b + "queue", c]);
            }),
          })
        );
      },
    }),
    r.fn.extend({
      queue: function (a, b) {
        var c = 2;
        return (
          "string" != typeof a && ((b = a), (a = "fx"), c--),
          arguments.length < c
            ? r.queue(this[0], a)
            : void 0 === b
            ? this
            : this.each(function () {
                var c = r.queue(this, a, b);
                r._queueHooks(this, a),
                  "fx" === a && "inprogress" !== c[0] && r.dequeue(this, a);
              })
        );
      },
      dequeue: function (a) {
        return this.each(function () {
          r.dequeue(this, a);
        });
      },
      clearQueue: function (a) {
        return this.queue(a || "fx", []);
      },
      promise: function (a, b) {
        var c,
          d = 1,
          e = r.Deferred(),
          f = this,
          g = this.length,
          h = function () {
            --d || e.resolveWith(f, [f]);
          };
        "string" != typeof a && ((b = a), (a = void 0)), (a = a || "fx");
        while (g--)
          (c = W.get(f[g], a + "queueHooks")),
            c && c.empty && (d++, c.empty.add(h));
        return h(), e.promise(b);
      },
    });
  var aa = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    ba = new RegExp("^(?:([+-])=|)(" + aa + ")([a-z%]*)$", "i"),
    ca = ["Top", "Right", "Bottom", "Left"],
    da = function (a, b) {
      return (
        (a = b || a),
        "none" === a.style.display ||
          ("" === a.style.display &&
            r.contains(a.ownerDocument, a) &&
            "none" === r.css(a, "display"))
      );
    },
    ea = function (a, b, c, d) {
      var e,
        f,
        g = {};
      for (f in b) (g[f] = a.style[f]), (a.style[f] = b[f]);
      e = c.apply(a, d || []);
      for (f in b) a.style[f] = g[f];
      return e;
    };
  function fa(a, b, c, d) {
    var e,
      f = 1,
      g = 20,
      h = d
        ? function () {
            return d.cur();
          }
        : function () {
            return r.css(a, b, "");
          },
      i = h(),
      j = (c && c[3]) || (r.cssNumber[b] ? "" : "px"),
      k = (r.cssNumber[b] || ("px" !== j && +i)) && ba.exec(r.css(a, b));
    if (k && k[3] !== j) {
      (j = j || k[3]), (c = c || []), (k = +i || 1);
      do (f = f || ".5"), (k /= f), r.style(a, b, k + j);
      while (f !== (f = h() / i) && 1 !== f && --g);
    }
    return (
      c &&
        ((k = +k || +i || 0),
        (e = c[1] ? k + (c[1] + 1) * c[2] : +c[2]),
        d && ((d.unit = j), (d.start = k), (d.end = e))),
      e
    );
  }
  var ga = {};
  function ha(a) {
    var b,
      c = a.ownerDocument,
      d = a.nodeName,
      e = ga[d];
    return e
      ? e
      : ((b = c.body.appendChild(c.createElement(d))),
        (e = r.css(b, "display")),
        b.parentNode.removeChild(b),
        "none" === e && (e = "block"),
        (ga[d] = e),
        e);
  }
  function ia(a, b) {
    for (var c, d, e = [], f = 0, g = a.length; f < g; f++)
      (d = a[f]),
        d.style &&
          ((c = d.style.display),
          b
            ? ("none" === c &&
                ((e[f] = W.get(d, "display") || null),
                e[f] || (d.style.display = "")),
              "" === d.style.display && da(d) && (e[f] = ha(d)))
            : "none" !== c && ((e[f] = "none"), W.set(d, "display", c)));
    for (f = 0; f < g; f++) null != e[f] && (a[f].style.display = e[f]);
    return a;
  }
  r.fn.extend({
    show: function () {
      return ia(this, !0);
    },
    hide: function () {
      return ia(this);
    },
    toggle: function (a) {
      return "boolean" == typeof a
        ? a
          ? this.show()
          : this.hide()
        : this.each(function () {
            da(this) ? r(this).show() : r(this).hide();
          });
    },
  });
  var ja = /^(?:checkbox|radio)$/i,
    ka = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
    la = /^$|\/(?:java|ecma)script/i,
    ma = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""],
    };
  (ma.optgroup = ma.option),
    (ma.tbody = ma.tfoot = ma.colgroup = ma.caption = ma.thead),
    (ma.th = ma.td);
  function na(a, b) {
    var c;
    return (
      (c =
        "undefined" != typeof a.getElementsByTagName
          ? a.getElementsByTagName(b || "*")
          : "undefined" != typeof a.querySelectorAll
          ? a.querySelectorAll(b || "*")
          : []),
      void 0 === b || (b && B(a, b)) ? r.merge([a], c) : c
    );
  }
  function oa(a, b) {
    for (var c = 0, d = a.length; c < d; c++)
      W.set(a[c], "globalEval", !b || W.get(b[c], "globalEval"));
  }
  var pa = /<|&#?\w+;/;
  function qa(a, b, c, d, e) {
    for (
      var f,
        g,
        h,
        i,
        j,
        k,
        l = b.createDocumentFragment(),
        m = [],
        n = 0,
        o = a.length;
      n < o;
      n++
    )
      if (((f = a[n]), f || 0 === f))
        if ("object" === r.type(f)) r.merge(m, f.nodeType ? [f] : f);
        else if (pa.test(f)) {
          (g = g || l.appendChild(b.createElement("div"))),
            (h = (ka.exec(f) || ["", ""])[1].toLowerCase()),
            (i = ma[h] || ma._default),
            (g.innerHTML = i[1] + r.htmlPrefilter(f) + i[2]),
            (k = i[0]);
          while (k--) g = g.lastChild;
          r.merge(m, g.childNodes), (g = l.firstChild), (g.textContent = "");
        } else m.push(b.createTextNode(f));
    (l.textContent = ""), (n = 0);
    while ((f = m[n++]))
      if (d && r.inArray(f, d) > -1) e && e.push(f);
      else if (
        ((j = r.contains(f.ownerDocument, f)),
        (g = na(l.appendChild(f), "script")),
        j && oa(g),
        c)
      ) {
        k = 0;
        while ((f = g[k++])) la.test(f.type || "") && c.push(f);
      }
    return l;
  }
  !(function () {
    var a = d.createDocumentFragment(),
      b = a.appendChild(d.createElement("div")),
      c = d.createElement("input");
    c.setAttribute("type", "radio"),
      c.setAttribute("checked", "checked"),
      c.setAttribute("name", "t"),
      b.appendChild(c),
      (o.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (b.innerHTML = "<textarea>x</textarea>"),
      (o.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue);
  })();
  var ra = d.documentElement,
    sa = /^key/,
    ta = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    ua = /^([^.]*)(?:\.(.+)|)/;
  function va() {
    return !0;
  }
  function wa() {
    return !1;
  }
  function xa() {
    try {
      return d.activeElement;
    } catch (a) {}
  }
  function ya(a, b, c, d, e, f) {
    var g, h;
    if ("object" == typeof b) {
      "string" != typeof c && ((d = d || c), (c = void 0));
      for (h in b) ya(a, h, c, d, b[h], f);
      return a;
    }
    if (
      (null == d && null == e
        ? ((e = c), (d = c = void 0))
        : null == e &&
          ("string" == typeof c
            ? ((e = d), (d = void 0))
            : ((e = d), (d = c), (c = void 0))),
      e === !1)
    )
      e = wa;
    else if (!e) return a;
    return (
      1 === f &&
        ((g = e),
        (e = function (a) {
          return r().off(a), g.apply(this, arguments);
        }),
        (e.guid = g.guid || (g.guid = r.guid++))),
      a.each(function () {
        r.event.add(this, b, e, d, c);
      })
    );
  }
  (r.event = {
    global: {},
    add: function (a, b, c, d, e) {
      var f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q = W.get(a);
      if (q) {
        c.handler && ((f = c), (c = f.handler), (e = f.selector)),
          e && r.find.matchesSelector(ra, e),
          c.guid || (c.guid = r.guid++),
          (i = q.events) || (i = q.events = {}),
          (g = q.handle) ||
            (g = q.handle = function (b) {
              return "undefined" != typeof r && r.event.triggered !== b.type
                ? r.event.dispatch.apply(a, arguments)
                : void 0;
            }),
          (b = (b || "").match(L) || [""]),
          (j = b.length);
        while (j--)
          (h = ua.exec(b[j]) || []),
            (n = p = h[1]),
            (o = (h[2] || "").split(".").sort()),
            n &&
              ((l = r.event.special[n] || {}),
              (n = (e ? l.delegateType : l.bindType) || n),
              (l = r.event.special[n] || {}),
              (k = r.extend(
                {
                  type: n,
                  origType: p,
                  data: d,
                  handler: c,
                  guid: c.guid,
                  selector: e,
                  needsContext: e && r.expr.match.needsContext.test(e),
                  namespace: o.join("."),
                },
                f
              )),
              (m = i[n]) ||
                ((m = i[n] = []),
                (m.delegateCount = 0),
                (l.setup && l.setup.call(a, d, o, g) !== !1) ||
                  (a.addEventListener && a.addEventListener(n, g))),
              l.add &&
                (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)),
              e ? m.splice(m.delegateCount++, 0, k) : m.push(k),
              (r.event.global[n] = !0));
      }
    },
    remove: function (a, b, c, d, e) {
      var f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q = W.hasData(a) && W.get(a);
      if (q && (i = q.events)) {
        (b = (b || "").match(L) || [""]), (j = b.length);
        while (j--)
          if (
            ((h = ua.exec(b[j]) || []),
            (n = p = h[1]),
            (o = (h[2] || "").split(".").sort()),
            n)
          ) {
            (l = r.event.special[n] || {}),
              (n = (d ? l.delegateType : l.bindType) || n),
              (m = i[n] || []),
              (h =
                h[2] &&
                new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)")),
              (g = f = m.length);
            while (f--)
              (k = m[f]),
                (!e && p !== k.origType) ||
                  (c && c.guid !== k.guid) ||
                  (h && !h.test(k.namespace)) ||
                  (d && d !== k.selector && ("**" !== d || !k.selector)) ||
                  (m.splice(f, 1),
                  k.selector && m.delegateCount--,
                  l.remove && l.remove.call(a, k));
            g &&
              !m.length &&
              ((l.teardown && l.teardown.call(a, o, q.handle) !== !1) ||
                r.removeEvent(a, n, q.handle),
              delete i[n]);
          } else for (n in i) r.event.remove(a, n + b[j], c, d, !0);
        r.isEmptyObject(i) && W.remove(a, "handle events");
      }
    },
    dispatch: function (a) {
      var b = r.event.fix(a),
        c,
        d,
        e,
        f,
        g,
        h,
        i = new Array(arguments.length),
        j = (W.get(this, "events") || {})[b.type] || [],
        k = r.event.special[b.type] || {};
      for (i[0] = b, c = 1; c < arguments.length; c++) i[c] = arguments[c];
      if (
        ((b.delegateTarget = this),
        !k.preDispatch || k.preDispatch.call(this, b) !== !1)
      ) {
        (h = r.event.handlers.call(this, b, j)), (c = 0);
        while ((f = h[c++]) && !b.isPropagationStopped()) {
          (b.currentTarget = f.elem), (d = 0);
          while ((g = f.handlers[d++]) && !b.isImmediatePropagationStopped())
            (b.rnamespace && !b.rnamespace.test(g.namespace)) ||
              ((b.handleObj = g),
              (b.data = g.data),
              (e = (
                (r.event.special[g.origType] || {}).handle || g.handler
              ).apply(f.elem, i)),
              void 0 !== e &&
                (b.result = e) === !1 &&
                (b.preventDefault(), b.stopPropagation()));
        }
        return k.postDispatch && k.postDispatch.call(this, b), b.result;
      }
    },
    handlers: function (a, b) {
      var c,
        d,
        e,
        f,
        g,
        h = [],
        i = b.delegateCount,
        j = a.target;
      if (i && j.nodeType && !("click" === a.type && a.button >= 1))
        for (; j !== this; j = j.parentNode || this)
          if (1 === j.nodeType && ("click" !== a.type || j.disabled !== !0)) {
            for (f = [], g = {}, c = 0; c < i; c++)
              (d = b[c]),
                (e = d.selector + " "),
                void 0 === g[e] &&
                  (g[e] = d.needsContext
                    ? r(e, this).index(j) > -1
                    : r.find(e, this, null, [j]).length),
                g[e] && f.push(d);
            f.length && h.push({ elem: j, handlers: f });
          }
      return (
        (j = this), i < b.length && h.push({ elem: j, handlers: b.slice(i) }), h
      );
    },
    addProp: function (a, b) {
      Object.defineProperty(r.Event.prototype, a, {
        enumerable: !0,
        configurable: !0,
        get: r.isFunction(b)
          ? function () {
              if (this.originalEvent) return b(this.originalEvent);
            }
          : function () {
              if (this.originalEvent) return this.originalEvent[a];
            },
        set: function (b) {
          Object.defineProperty(this, a, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: b,
          });
        },
      });
    },
    fix: function (a) {
      return a[r.expando] ? a : new r.Event(a);
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger: function () {
          if (this !== xa() && this.focus) return this.focus(), !1;
        },
        delegateType: "focusin",
      },
      blur: {
        trigger: function () {
          if (this === xa() && this.blur) return this.blur(), !1;
        },
        delegateType: "focusout",
      },
      click: {
        trigger: function () {
          if ("checkbox" === this.type && this.click && B(this, "input"))
            return this.click(), !1;
        },
        _default: function (a) {
          return B(a.target, "a");
        },
      },
      beforeunload: {
        postDispatch: function (a) {
          void 0 !== a.result &&
            a.originalEvent &&
            (a.originalEvent.returnValue = a.result);
        },
      },
    },
  }),
    (r.removeEvent = function (a, b, c) {
      a.removeEventListener && a.removeEventListener(b, c);
    }),
    (r.Event = function (a, b) {
      return this instanceof r.Event
        ? (a && a.type
            ? ((this.originalEvent = a),
              (this.type = a.type),
              (this.isDefaultPrevented =
                a.defaultPrevented ||
                (void 0 === a.defaultPrevented && a.returnValue === !1)
                  ? va
                  : wa),
              (this.target =
                a.target && 3 === a.target.nodeType
                  ? a.target.parentNode
                  : a.target),
              (this.currentTarget = a.currentTarget),
              (this.relatedTarget = a.relatedTarget))
            : (this.type = a),
          b && r.extend(this, b),
          (this.timeStamp = (a && a.timeStamp) || r.now()),
          void (this[r.expando] = !0))
        : new r.Event(a, b);
    }),
    (r.Event.prototype = {
      constructor: r.Event,
      isDefaultPrevented: wa,
      isPropagationStopped: wa,
      isImmediatePropagationStopped: wa,
      isSimulated: !1,
      preventDefault: function () {
        var a = this.originalEvent;
        (this.isDefaultPrevented = va),
          a && !this.isSimulated && a.preventDefault();
      },
      stopPropagation: function () {
        var a = this.originalEvent;
        (this.isPropagationStopped = va),
          a && !this.isSimulated && a.stopPropagation();
      },
      stopImmediatePropagation: function () {
        var a = this.originalEvent;
        (this.isImmediatePropagationStopped = va),
          a && !this.isSimulated && a.stopImmediatePropagation(),
          this.stopPropagation();
      },
    }),
    r.each(
      {
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function (a) {
          var b = a.button;
          return null == a.which && sa.test(a.type)
            ? null != a.charCode
              ? a.charCode
              : a.keyCode
            : !a.which && void 0 !== b && ta.test(a.type)
            ? 1 & b
              ? 1
              : 2 & b
              ? 3
              : 4 & b
              ? 2
              : 0
            : a.which;
        },
      },
      r.event.addProp
    ),
    r.each(
      {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout",
      },
      function (a, b) {
        r.event.special[a] = {
          delegateType: b,
          bindType: b,
          handle: function (a) {
            var c,
              d = this,
              e = a.relatedTarget,
              f = a.handleObj;
            return (
              (e && (e === d || r.contains(d, e))) ||
                ((a.type = f.origType),
                (c = f.handler.apply(this, arguments)),
                (a.type = b)),
              c
            );
          },
        };
      }
    ),
    r.fn.extend({
      on: function (a, b, c, d) {
        return ya(this, a, b, c, d);
      },
      one: function (a, b, c, d) {
        return ya(this, a, b, c, d, 1);
      },
      off: function (a, b, c) {
        var d, e;
        if (a && a.preventDefault && a.handleObj)
          return (
            (d = a.handleObj),
            r(a.delegateTarget).off(
              d.namespace ? d.origType + "." + d.namespace : d.origType,
              d.selector,
              d.handler
            ),
            this
          );
        if ("object" == typeof a) {
          for (e in a) this.off(e, b, a[e]);
          return this;
        }
        return (
          (b !== !1 && "function" != typeof b) || ((c = b), (b = void 0)),
          c === !1 && (c = wa),
          this.each(function () {
            r.event.remove(this, a, c, b);
          })
        );
      },
    });
  var za = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
    Aa = /<script|<style|<link/i,
    Ba = /checked\s*(?:[^=]|=\s*.checked.)/i,
    Ca = /^true\/(.*)/,
    Da = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  function Ea(a, b) {
    return B(a, "table") && B(11 !== b.nodeType ? b : b.firstChild, "tr")
      ? r(">tbody", a)[0] || a
      : a;
  }
  function Fa(a) {
    return (a.type = (null !== a.getAttribute("type")) + "/" + a.type), a;
  }
  function Ga(a) {
    var b = Ca.exec(a.type);
    return b ? (a.type = b[1]) : a.removeAttribute("type"), a;
  }
  function Ha(a, b) {
    var c, d, e, f, g, h, i, j;
    if (1 === b.nodeType) {
      if (
        W.hasData(a) &&
        ((f = W.access(a)), (g = W.set(b, f)), (j = f.events))
      ) {
        delete g.handle, (g.events = {});
        for (e in j)
          for (c = 0, d = j[e].length; c < d; c++) r.event.add(b, e, j[e][c]);
      }
      X.hasData(a) && ((h = X.access(a)), (i = r.extend({}, h)), X.set(b, i));
    }
  }
  function Ia(a, b) {
    var c = b.nodeName.toLowerCase();
    "input" === c && ja.test(a.type)
      ? (b.checked = a.checked)
      : ("input" !== c && "textarea" !== c) ||
        (b.defaultValue = a.defaultValue);
  }
  function Ja(a, b, c, d) {
    b = g.apply([], b);
    var e,
      f,
      h,
      i,
      j,
      k,
      l = 0,
      m = a.length,
      n = m - 1,
      q = b[0],
      s = r.isFunction(q);
    if (s || (m > 1 && "string" == typeof q && !o.checkClone && Ba.test(q)))
      return a.each(function (e) {
        var f = a.eq(e);
        s && (b[0] = q.call(this, e, f.html())), Ja(f, b, c, d);
      });
    if (
      m &&
      ((e = qa(b, a[0].ownerDocument, !1, a, d)),
      (f = e.firstChild),
      1 === e.childNodes.length && (e = f),
      f || d)
    ) {
      for (h = r.map(na(e, "script"), Fa), i = h.length; l < m; l++)
        (j = e),
          l !== n &&
            ((j = r.clone(j, !0, !0)), i && r.merge(h, na(j, "script"))),
          c.call(a[l], j, l);
      if (i)
        for (k = h[h.length - 1].ownerDocument, r.map(h, Ga), l = 0; l < i; l++)
          (j = h[l]),
            la.test(j.type || "") &&
              !W.access(j, "globalEval") &&
              r.contains(k, j) &&
              (j.src
                ? r._evalUrl && r._evalUrl(j.src)
                : p(j.textContent.replace(Da, ""), k));
    }
    return a;
  }
  function Ka(a, b, c) {
    for (var d, e = b ? r.filter(b, a) : a, f = 0; null != (d = e[f]); f++)
      c || 1 !== d.nodeType || r.cleanData(na(d)),
        d.parentNode &&
          (c && r.contains(d.ownerDocument, d) && oa(na(d, "script")),
          d.parentNode.removeChild(d));
    return a;
  }
  r.extend({
    htmlPrefilter: function (a) {
      return a.replace(za, "<$1></$2>");
    },
    clone: function (a, b, c) {
      var d,
        e,
        f,
        g,
        h = a.cloneNode(!0),
        i = r.contains(a.ownerDocument, a);
      if (
        !(
          o.noCloneChecked ||
          (1 !== a.nodeType && 11 !== a.nodeType) ||
          r.isXMLDoc(a)
        )
      )
        for (g = na(h), f = na(a), d = 0, e = f.length; d < e; d++)
          Ia(f[d], g[d]);
      if (b)
        if (c)
          for (f = f || na(a), g = g || na(h), d = 0, e = f.length; d < e; d++)
            Ha(f[d], g[d]);
        else Ha(a, h);
      return (
        (g = na(h, "script")), g.length > 0 && oa(g, !i && na(a, "script")), h
      );
    },
    cleanData: function (a) {
      for (var b, c, d, e = r.event.special, f = 0; void 0 !== (c = a[f]); f++)
        if (U(c)) {
          if ((b = c[W.expando])) {
            if (b.events)
              for (d in b.events)
                e[d] ? r.event.remove(c, d) : r.removeEvent(c, d, b.handle);
            c[W.expando] = void 0;
          }
          c[X.expando] && (c[X.expando] = void 0);
        }
    },
  }),
    r.fn.extend({
      detach: function (a) {
        return Ka(this, a, !0);
      },
      remove: function (a) {
        return Ka(this, a);
      },
      text: function (a) {
        return T(
          this,
          function (a) {
            return void 0 === a
              ? r.text(this)
              : this.empty().each(function () {
                  (1 !== this.nodeType &&
                    11 !== this.nodeType &&
                    9 !== this.nodeType) ||
                    (this.textContent = a);
                });
          },
          null,
          a,
          arguments.length
        );
      },
      append: function () {
        return Ja(this, arguments, function (a) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var b = Ea(this, a);
            b.appendChild(a);
          }
        });
      },
      prepend: function () {
        return Ja(this, arguments, function (a) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var b = Ea(this, a);
            b.insertBefore(a, b.firstChild);
          }
        });
      },
      before: function () {
        return Ja(this, arguments, function (a) {
          this.parentNode && this.parentNode.insertBefore(a, this);
        });
      },
      after: function () {
        return Ja(this, arguments, function (a) {
          this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
        });
      },
      empty: function () {
        for (var a, b = 0; null != (a = this[b]); b++)
          1 === a.nodeType && (r.cleanData(na(a, !1)), (a.textContent = ""));
        return this;
      },
      clone: function (a, b) {
        return (
          (a = null != a && a),
          (b = null == b ? a : b),
          this.map(function () {
            return r.clone(this, a, b);
          })
        );
      },
      html: function (a) {
        return T(
          this,
          function (a) {
            var b = this[0] || {},
              c = 0,
              d = this.length;
            if (void 0 === a && 1 === b.nodeType) return b.innerHTML;
            if (
              "string" == typeof a &&
              !Aa.test(a) &&
              !ma[(ka.exec(a) || ["", ""])[1].toLowerCase()]
            ) {
              a = r.htmlPrefilter(a);
              try {
                for (; c < d; c++)
                  (b = this[c] || {}),
                    1 === b.nodeType &&
                      (r.cleanData(na(b, !1)), (b.innerHTML = a));
                b = 0;
              } catch (e) {}
            }
            b && this.empty().append(a);
          },
          null,
          a,
          arguments.length
        );
      },
      replaceWith: function () {
        var a = [];
        return Ja(
          this,
          arguments,
          function (b) {
            var c = this.parentNode;
            r.inArray(this, a) < 0 &&
              (r.cleanData(na(this)), c && c.replaceChild(b, this));
          },
          a
        );
      },
    }),
    r.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (a, b) {
        r.fn[a] = function (a) {
          for (var c, d = [], e = r(a), f = e.length - 1, g = 0; g <= f; g++)
            (c = g === f ? this : this.clone(!0)),
              r(e[g])[b](c),
              h.apply(d, c.get());
          return this.pushStack(d);
        };
      }
    );
  var La = /^margin/,
    Ma = new RegExp("^(" + aa + ")(?!px)[a-z%]+$", "i"),
    Na = function (b) {
      var c = b.ownerDocument.defaultView;
      return (c && c.opener) || (c = a), c.getComputedStyle(b);
    };
  !(function () {
    function b() {
      if (i) {
        (i.style.cssText =
          "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%"),
          (i.innerHTML = ""),
          ra.appendChild(h);
        var b = a.getComputedStyle(i);
        (c = "1%" !== b.top),
          (g = "2px" === b.marginLeft),
          (e = "4px" === b.width),
          (i.style.marginRight = "50%"),
          (f = "4px" === b.marginRight),
          ra.removeChild(h),
          (i = null);
      }
    }
    var c,
      e,
      f,
      g,
      h = d.createElement("div"),
      i = d.createElement("div");
    i.style &&
      ((i.style.backgroundClip = "content-box"),
      (i.cloneNode(!0).style.backgroundClip = ""),
      (o.clearCloneStyle = "content-box" === i.style.backgroundClip),
      (h.style.cssText =
        "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute"),
      h.appendChild(i),
      r.extend(o, {
        pixelPosition: function () {
          return b(), c;
        },
        boxSizingReliable: function () {
          return b(), e;
        },
        pixelMarginRight: function () {
          return b(), f;
        },
        reliableMarginLeft: function () {
          return b(), g;
        },
      }));
  })();
  function Oa(a, b, c) {
    var d,
      e,
      f,
      g,
      h = a.style;
    return (
      (c = c || Na(a)),
      c &&
        ((g = c.getPropertyValue(b) || c[b]),
        "" !== g || r.contains(a.ownerDocument, a) || (g = r.style(a, b)),
        !o.pixelMarginRight() &&
          Ma.test(g) &&
          La.test(b) &&
          ((d = h.width),
          (e = h.minWidth),
          (f = h.maxWidth),
          (h.minWidth = h.maxWidth = h.width = g),
          (g = c.width),
          (h.width = d),
          (h.minWidth = e),
          (h.maxWidth = f))),
      void 0 !== g ? g + "" : g
    );
  }
  function Pa(a, b) {
    return {
      get: function () {
        return a()
          ? void delete this.get
          : (this.get = b).apply(this, arguments);
      },
    };
  }
  var Qa = /^(none|table(?!-c[ea]).+)/,
    Ra = /^--/,
    Sa = { position: "absolute", visibility: "hidden", display: "block" },
    Ta = { letterSpacing: "0", fontWeight: "400" },
    Ua = ["Webkit", "Moz", "ms"],
    Va = d.createElement("div").style;
  function Wa(a) {
    if (a in Va) return a;
    var b = a[0].toUpperCase() + a.slice(1),
      c = Ua.length;
    while (c--) if (((a = Ua[c] + b), a in Va)) return a;
  }
  function Xa(a) {
    var b = r.cssProps[a];
    return b || (b = r.cssProps[a] = Wa(a) || a), b;
  }
  function Ya(a, b, c) {
    var d = ba.exec(b);
    return d ? Math.max(0, d[2] - (c || 0)) + (d[3] || "px") : b;
  }
  function Za(a, b, c, d, e) {
    var f,
      g = 0;
    for (
      f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0;
      f < 4;
      f += 2
    )
      "margin" === c && (g += r.css(a, c + ca[f], !0, e)),
        d
          ? ("content" === c && (g -= r.css(a, "padding" + ca[f], !0, e)),
            "margin" !== c &&
              (g -= r.css(a, "border" + ca[f] + "Width", !0, e)))
          : ((g += r.css(a, "padding" + ca[f], !0, e)),
            "padding" !== c &&
              (g += r.css(a, "border" + ca[f] + "Width", !0, e)));
    return g;
  }
  function $a(a, b, c) {
    var d,
      e = Na(a),
      f = Oa(a, b, e),
      g = "border-box" === r.css(a, "boxSizing", !1, e);
    return Ma.test(f)
      ? f
      : ((d = g && (o.boxSizingReliable() || f === a.style[b])),
        "auto" === f && (f = a["offset" + b[0].toUpperCase() + b.slice(1)]),
        (f = parseFloat(f) || 0),
        f + Za(a, b, c || (g ? "border" : "content"), d, e) + "px");
  }
  r.extend({
    cssHooks: {
      opacity: {
        get: function (a, b) {
          if (b) {
            var c = Oa(a, "opacity");
            return "" === c ? "1" : c;
          }
        },
      },
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
    },
    cssProps: { float: "cssFloat" },
    style: function (a, b, c, d) {
      if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
        var e,
          f,
          g,
          h = r.camelCase(b),
          i = Ra.test(b),
          j = a.style;
        return (
          i || (b = Xa(h)),
          (g = r.cssHooks[b] || r.cssHooks[h]),
          void 0 === c
            ? g && "get" in g && void 0 !== (e = g.get(a, !1, d))
              ? e
              : j[b]
            : ((f = typeof c),
              "string" === f &&
                (e = ba.exec(c)) &&
                e[1] &&
                ((c = fa(a, b, e)), (f = "number")),
              null != c &&
                c === c &&
                ("number" === f &&
                  (c += (e && e[3]) || (r.cssNumber[h] ? "" : "px")),
                o.clearCloneStyle ||
                  "" !== c ||
                  0 !== b.indexOf("background") ||
                  (j[b] = "inherit"),
                (g && "set" in g && void 0 === (c = g.set(a, c, d))) ||
                  (i ? j.setProperty(b, c) : (j[b] = c))),
              void 0)
        );
      }
    },
    css: function (a, b, c, d) {
      var e,
        f,
        g,
        h = r.camelCase(b),
        i = Ra.test(b);
      return (
        i || (b = Xa(h)),
        (g = r.cssHooks[b] || r.cssHooks[h]),
        g && "get" in g && (e = g.get(a, !0, c)),
        void 0 === e && (e = Oa(a, b, d)),
        "normal" === e && b in Ta && (e = Ta[b]),
        "" === c || c
          ? ((f = parseFloat(e)), c === !0 || isFinite(f) ? f || 0 : e)
          : e
      );
    },
  }),
    r.each(["height", "width"], function (a, b) {
      r.cssHooks[b] = {
        get: function (a, c, d) {
          if (c)
            return !Qa.test(r.css(a, "display")) ||
              (a.getClientRects().length && a.getBoundingClientRect().width)
              ? $a(a, b, d)
              : ea(a, Sa, function () {
                  return $a(a, b, d);
                });
        },
        set: function (a, c, d) {
          var e,
            f = d && Na(a),
            g =
              d &&
              Za(a, b, d, "border-box" === r.css(a, "boxSizing", !1, f), f);
          return (
            g &&
              (e = ba.exec(c)) &&
              "px" !== (e[3] || "px") &&
              ((a.style[b] = c), (c = r.css(a, b))),
            Ya(a, c, g)
          );
        },
      };
    }),
    (r.cssHooks.marginLeft = Pa(o.reliableMarginLeft, function (a, b) {
      if (b)
        return (
          (parseFloat(Oa(a, "marginLeft")) ||
            a.getBoundingClientRect().left -
              ea(a, { marginLeft: 0 }, function () {
                return a.getBoundingClientRect().left;
              })) + "px"
        );
    })),
    r.each({ margin: "", padding: "", border: "Width" }, function (a, b) {
      (r.cssHooks[a + b] = {
        expand: function (c) {
          for (
            var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c];
            d < 4;
            d++
          )
            e[a + ca[d] + b] = f[d] || f[d - 2] || f[0];
          return e;
        },
      }),
        La.test(a) || (r.cssHooks[a + b].set = Ya);
    }),
    r.fn.extend({
      css: function (a, b) {
        return T(
          this,
          function (a, b, c) {
            var d,
              e,
              f = {},
              g = 0;
            if (Array.isArray(b)) {
              for (d = Na(a), e = b.length; g < e; g++)
                f[b[g]] = r.css(a, b[g], !1, d);
              return f;
            }
            return void 0 !== c ? r.style(a, b, c) : r.css(a, b);
          },
          a,
          b,
          arguments.length > 1
        );
      },
    });
  function _a(a, b, c, d, e) {
    return new _a.prototype.init(a, b, c, d, e);
  }
  (r.Tween = _a),
    (_a.prototype = {
      constructor: _a,
      init: function (a, b, c, d, e, f) {
        (this.elem = a),
          (this.prop = c),
          (this.easing = e || r.easing._default),
          (this.options = b),
          (this.start = this.now = this.cur()),
          (this.end = d),
          (this.unit = f || (r.cssNumber[c] ? "" : "px"));
      },
      cur: function () {
        var a = _a.propHooks[this.prop];
        return a && a.get ? a.get(this) : _a.propHooks._default.get(this);
      },
      run: function (a) {
        var b,
          c = _a.propHooks[this.prop];
        return (
          this.options.duration
            ? (this.pos = b = r.easing[this.easing](
                a,
                this.options.duration * a,
                0,
                1,
                this.options.duration
              ))
            : (this.pos = b = a),
          (this.now = (this.end - this.start) * b + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          c && c.set ? c.set(this) : _a.propHooks._default.set(this),
          this
        );
      },
    }),
    (_a.prototype.init.prototype = _a.prototype),
    (_a.propHooks = {
      _default: {
        get: function (a) {
          var b;
          return 1 !== a.elem.nodeType ||
            (null != a.elem[a.prop] && null == a.elem.style[a.prop])
            ? a.elem[a.prop]
            : ((b = r.css(a.elem, a.prop, "")), b && "auto" !== b ? b : 0);
        },
        set: function (a) {
          r.fx.step[a.prop]
            ? r.fx.step[a.prop](a)
            : 1 !== a.elem.nodeType ||
              (null == a.elem.style[r.cssProps[a.prop]] && !r.cssHooks[a.prop])
            ? (a.elem[a.prop] = a.now)
            : r.style(a.elem, a.prop, a.now + a.unit);
        },
      },
    }),
    (_a.propHooks.scrollTop = _a.propHooks.scrollLeft = {
      set: function (a) {
        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
      },
    }),
    (r.easing = {
      linear: function (a) {
        return a;
      },
      swing: function (a) {
        return 0.5 - Math.cos(a * Math.PI) / 2;
      },
      _default: "swing",
    }),
    (r.fx = _a.prototype.init),
    (r.fx.step = {});
  var ab,
    bb,
    cb = /^(?:toggle|show|hide)$/,
    db = /queueHooks$/;
  function eb() {
    bb &&
      (d.hidden === !1 && a.requestAnimationFrame
        ? a.requestAnimationFrame(eb)
        : a.setTimeout(eb, r.fx.interval),
      r.fx.tick());
  }
  function fb() {
    return (
      a.setTimeout(function () {
        ab = void 0;
      }),
      (ab = r.now())
    );
  }
  function gb(a, b) {
    var c,
      d = 0,
      e = { height: a };
    for (b = b ? 1 : 0; d < 4; d += 2 - b)
      (c = ca[d]), (e["margin" + c] = e["padding" + c] = a);
    return b && (e.opacity = e.width = a), e;
  }
  function hb(a, b, c) {
    for (
      var d,
        e = (kb.tweeners[b] || []).concat(kb.tweeners["*"]),
        f = 0,
        g = e.length;
      f < g;
      f++
    )
      if ((d = e[f].call(c, b, a))) return d;
  }
  function ib(a, b, c) {
    var d,
      e,
      f,
      g,
      h,
      i,
      j,
      k,
      l = "width" in b || "height" in b,
      m = this,
      n = {},
      o = a.style,
      p = a.nodeType && da(a),
      q = W.get(a, "fxshow");
    c.queue ||
      ((g = r._queueHooks(a, "fx")),
      null == g.unqueued &&
        ((g.unqueued = 0),
        (h = g.empty.fire),
        (g.empty.fire = function () {
          g.unqueued || h();
        })),
      g.unqueued++,
      m.always(function () {
        m.always(function () {
          g.unqueued--, r.queue(a, "fx").length || g.empty.fire();
        });
      }));
    for (d in b)
      if (((e = b[d]), cb.test(e))) {
        if (
          (delete b[d], (f = f || "toggle" === e), e === (p ? "hide" : "show"))
        ) {
          if ("show" !== e || !q || void 0 === q[d]) continue;
          p = !0;
        }
        n[d] = (q && q[d]) || r.style(a, d);
      }
    if (((i = !r.isEmptyObject(b)), i || !r.isEmptyObject(n))) {
      l &&
        1 === a.nodeType &&
        ((c.overflow = [o.overflow, o.overflowX, o.overflowY]),
        (j = q && q.display),
        null == j && (j = W.get(a, "display")),
        (k = r.css(a, "display")),
        "none" === k &&
          (j
            ? (k = j)
            : (ia([a], !0),
              (j = a.style.display || j),
              (k = r.css(a, "display")),
              ia([a]))),
        ("inline" === k || ("inline-block" === k && null != j)) &&
          "none" === r.css(a, "float") &&
          (i ||
            (m.done(function () {
              o.display = j;
            }),
            null == j && ((k = o.display), (j = "none" === k ? "" : k))),
          (o.display = "inline-block"))),
        c.overflow &&
          ((o.overflow = "hidden"),
          m.always(function () {
            (o.overflow = c.overflow[0]),
              (o.overflowX = c.overflow[1]),
              (o.overflowY = c.overflow[2]);
          })),
        (i = !1);
      for (d in n)
        i ||
          (q
            ? "hidden" in q && (p = q.hidden)
            : (q = W.access(a, "fxshow", { display: j })),
          f && (q.hidden = !p),
          p && ia([a], !0),
          m.done(function () {
            p || ia([a]), W.remove(a, "fxshow");
            for (d in n) r.style(a, d, n[d]);
          })),
          (i = hb(p ? q[d] : 0, d, m)),
          d in q || ((q[d] = i.start), p && ((i.end = i.start), (i.start = 0)));
    }
  }
  function jb(a, b) {
    var c, d, e, f, g;
    for (c in a)
      if (
        ((d = r.camelCase(c)),
        (e = b[d]),
        (f = a[c]),
        Array.isArray(f) && ((e = f[1]), (f = a[c] = f[0])),
        c !== d && ((a[d] = f), delete a[c]),
        (g = r.cssHooks[d]),
        g && "expand" in g)
      ) {
        (f = g.expand(f)), delete a[d];
        for (c in f) c in a || ((a[c] = f[c]), (b[c] = e));
      } else b[d] = e;
  }
  function kb(a, b, c) {
    var d,
      e,
      f = 0,
      g = kb.prefilters.length,
      h = r.Deferred().always(function () {
        delete i.elem;
      }),
      i = function () {
        if (e) return !1;
        for (
          var b = ab || fb(),
            c = Math.max(0, j.startTime + j.duration - b),
            d = c / j.duration || 0,
            f = 1 - d,
            g = 0,
            i = j.tweens.length;
          g < i;
          g++
        )
          j.tweens[g].run(f);
        return (
          h.notifyWith(a, [j, f, c]),
          f < 1 && i
            ? c
            : (i || h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j]), !1)
        );
      },
      j = h.promise({
        elem: a,
        props: r.extend({}, b),
        opts: r.extend(!0, { specialEasing: {}, easing: r.easing._default }, c),
        originalProperties: b,
        originalOptions: c,
        startTime: ab || fb(),
        duration: c.duration,
        tweens: [],
        createTween: function (b, c) {
          var d = r.Tween(
            a,
            j.opts,
            b,
            c,
            j.opts.specialEasing[b] || j.opts.easing
          );
          return j.tweens.push(d), d;
        },
        stop: function (b) {
          var c = 0,
            d = b ? j.tweens.length : 0;
          if (e) return this;
          for (e = !0; c < d; c++) j.tweens[c].run(1);
          return (
            b
              ? (h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j, b]))
              : h.rejectWith(a, [j, b]),
            this
          );
        },
      }),
      k = j.props;
    for (jb(k, j.opts.specialEasing); f < g; f++)
      if ((d = kb.prefilters[f].call(j, a, k, j.opts)))
        return (
          r.isFunction(d.stop) &&
            (r._queueHooks(j.elem, j.opts.queue).stop = r.proxy(d.stop, d)),
          d
        );
    return (
      r.map(k, hb, j),
      r.isFunction(j.opts.start) && j.opts.start.call(a, j),
      j
        .progress(j.opts.progress)
        .done(j.opts.done, j.opts.complete)
        .fail(j.opts.fail)
        .always(j.opts.always),
      r.fx.timer(r.extend(i, { elem: a, anim: j, queue: j.opts.queue })),
      j
    );
  }
  (r.Animation = r.extend(kb, {
    tweeners: {
      "*": [
        function (a, b) {
          var c = this.createTween(a, b);
          return fa(c.elem, a, ba.exec(b), c), c;
        },
      ],
    },
    tweener: function (a, b) {
      r.isFunction(a) ? ((b = a), (a = ["*"])) : (a = a.match(L));
      for (var c, d = 0, e = a.length; d < e; d++)
        (c = a[d]),
          (kb.tweeners[c] = kb.tweeners[c] || []),
          kb.tweeners[c].unshift(b);
    },
    prefilters: [ib],
    prefilter: function (a, b) {
      b ? kb.prefilters.unshift(a) : kb.prefilters.push(a);
    },
  })),
    (r.speed = function (a, b, c) {
      var d =
        a && "object" == typeof a
          ? r.extend({}, a)
          : {
              complete: c || (!c && b) || (r.isFunction(a) && a),
              duration: a,
              easing: (c && b) || (b && !r.isFunction(b) && b),
            };
      return (
        r.fx.off
          ? (d.duration = 0)
          : "number" != typeof d.duration &&
            (d.duration in r.fx.speeds
              ? (d.duration = r.fx.speeds[d.duration])
              : (d.duration = r.fx.speeds._default)),
        (null != d.queue && d.queue !== !0) || (d.queue = "fx"),
        (d.old = d.complete),
        (d.complete = function () {
          r.isFunction(d.old) && d.old.call(this),
            d.queue && r.dequeue(this, d.queue);
        }),
        d
      );
    }),
    r.fn.extend({
      fadeTo: function (a, b, c, d) {
        return this.filter(da)
          .css("opacity", 0)
          .show()
          .end()
          .animate({ opacity: b }, a, c, d);
      },
      animate: function (a, b, c, d) {
        var e = r.isEmptyObject(a),
          f = r.speed(b, c, d),
          g = function () {
            var b = kb(this, r.extend({}, a), f);
            (e || W.get(this, "finish")) && b.stop(!0);
          };
        return (
          (g.finish = g),
          e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        );
      },
      stop: function (a, b, c) {
        var d = function (a) {
          var b = a.stop;
          delete a.stop, b(c);
        };
        return (
          "string" != typeof a && ((c = b), (b = a), (a = void 0)),
          b && a !== !1 && this.queue(a || "fx", []),
          this.each(function () {
            var b = !0,
              e = null != a && a + "queueHooks",
              f = r.timers,
              g = W.get(this);
            if (e) g[e] && g[e].stop && d(g[e]);
            else for (e in g) g[e] && g[e].stop && db.test(e) && d(g[e]);
            for (e = f.length; e--; )
              f[e].elem !== this ||
                (null != a && f[e].queue !== a) ||
                (f[e].anim.stop(c), (b = !1), f.splice(e, 1));
            (!b && c) || r.dequeue(this, a);
          })
        );
      },
      finish: function (a) {
        return (
          a !== !1 && (a = a || "fx"),
          this.each(function () {
            var b,
              c = W.get(this),
              d = c[a + "queue"],
              e = c[a + "queueHooks"],
              f = r.timers,
              g = d ? d.length : 0;
            for (
              c.finish = !0,
                r.queue(this, a, []),
                e && e.stop && e.stop.call(this, !0),
                b = f.length;
              b--;

            )
              f[b].elem === this &&
                f[b].queue === a &&
                (f[b].anim.stop(!0), f.splice(b, 1));
            for (b = 0; b < g; b++)
              d[b] && d[b].finish && d[b].finish.call(this);
            delete c.finish;
          })
        );
      },
    }),
    r.each(["toggle", "show", "hide"], function (a, b) {
      var c = r.fn[b];
      r.fn[b] = function (a, d, e) {
        return null == a || "boolean" == typeof a
          ? c.apply(this, arguments)
          : this.animate(gb(b, !0), a, d, e);
      };
    }),
    r.each(
      {
        slideDown: gb("show"),
        slideUp: gb("hide"),
        slideToggle: gb("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" },
      },
      function (a, b) {
        r.fn[a] = function (a, c, d) {
          return this.animate(b, a, c, d);
        };
      }
    ),
    (r.timers = []),
    (r.fx.tick = function () {
      var a,
        b = 0,
        c = r.timers;
      for (ab = r.now(); b < c.length; b++)
        (a = c[b]), a() || c[b] !== a || c.splice(b--, 1);
      c.length || r.fx.stop(), (ab = void 0);
    }),
    (r.fx.timer = function (a) {
      r.timers.push(a), r.fx.start();
    }),
    (r.fx.interval = 13),
    (r.fx.start = function () {
      bb || ((bb = !0), eb());
    }),
    (r.fx.stop = function () {
      bb = null;
    }),
    (r.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (r.fn.delay = function (b, c) {
      return (
        (b = r.fx ? r.fx.speeds[b] || b : b),
        (c = c || "fx"),
        this.queue(c, function (c, d) {
          var e = a.setTimeout(c, b);
          d.stop = function () {
            a.clearTimeout(e);
          };
        })
      );
    }),
    (function () {
      var a = d.createElement("input"),
        b = d.createElement("select"),
        c = b.appendChild(d.createElement("option"));
      (a.type = "checkbox"),
        (o.checkOn = "" !== a.value),
        (o.optSelected = c.selected),
        (a = d.createElement("input")),
        (a.value = "t"),
        (a.type = "radio"),
        (o.radioValue = "t" === a.value);
    })();
  var lb,
    mb = r.expr.attrHandle;
  r.fn.extend({
    attr: function (a, b) {
      return T(this, r.attr, a, b, arguments.length > 1);
    },
    removeAttr: function (a) {
      return this.each(function () {
        r.removeAttr(this, a);
      });
    },
  }),
    r.extend({
      attr: function (a, b, c) {
        var d,
          e,
          f = a.nodeType;
        if (3 !== f && 8 !== f && 2 !== f)
          return "undefined" == typeof a.getAttribute
            ? r.prop(a, b, c)
            : ((1 === f && r.isXMLDoc(a)) ||
                (e =
                  r.attrHooks[b.toLowerCase()] ||
                  (r.expr.match.bool.test(b) ? lb : void 0)),
              void 0 !== c
                ? null === c
                  ? void r.removeAttr(a, b)
                  : e && "set" in e && void 0 !== (d = e.set(a, c, b))
                  ? d
                  : (a.setAttribute(b, c + ""), c)
                : e && "get" in e && null !== (d = e.get(a, b))
                ? d
                : ((d = r.find.attr(a, b)), null == d ? void 0 : d));
      },
      attrHooks: {
        type: {
          set: function (a, b) {
            if (!o.radioValue && "radio" === b && B(a, "input")) {
              var c = a.value;
              return a.setAttribute("type", b), c && (a.value = c), b;
            }
          },
        },
      },
      removeAttr: function (a, b) {
        var c,
          d = 0,
          e = b && b.match(L);
        if (e && 1 === a.nodeType) while ((c = e[d++])) a.removeAttribute(c);
      },
    }),
    (lb = {
      set: function (a, b, c) {
        return b === !1 ? r.removeAttr(a, c) : a.setAttribute(c, c), c;
      },
    }),
    r.each(r.expr.match.bool.source.match(/\w+/g), function (a, b) {
      var c = mb[b] || r.find.attr;
      mb[b] = function (a, b, d) {
        var e,
          f,
          g = b.toLowerCase();
        return (
          d ||
            ((f = mb[g]),
            (mb[g] = e),
            (e = null != c(a, b, d) ? g : null),
            (mb[g] = f)),
          e
        );
      };
    });
  var nb = /^(?:input|select|textarea|button)$/i,
    ob = /^(?:a|area)$/i;
  r.fn.extend({
    prop: function (a, b) {
      return T(this, r.prop, a, b, arguments.length > 1);
    },
    removeProp: function (a) {
      return this.each(function () {
        delete this[r.propFix[a] || a];
      });
    },
  }),
    r.extend({
      prop: function (a, b, c) {
        var d,
          e,
          f = a.nodeType;
        if (3 !== f && 8 !== f && 2 !== f)
          return (
            (1 === f && r.isXMLDoc(a)) ||
              ((b = r.propFix[b] || b), (e = r.propHooks[b])),
            void 0 !== c
              ? e && "set" in e && void 0 !== (d = e.set(a, c, b))
                ? d
                : (a[b] = c)
              : e && "get" in e && null !== (d = e.get(a, b))
              ? d
              : a[b]
          );
      },
      propHooks: {
        tabIndex: {
          get: function (a) {
            var b = r.find.attr(a, "tabindex");
            return b
              ? parseInt(b, 10)
              : nb.test(a.nodeName) || (ob.test(a.nodeName) && a.href)
              ? 0
              : -1;
          },
        },
      },
      propFix: { for: "htmlFor", class: "className" },
    }),
    o.optSelected ||
      (r.propHooks.selected = {
        get: function (a) {
          var b = a.parentNode;
          return b && b.parentNode && b.parentNode.selectedIndex, null;
        },
        set: function (a) {
          var b = a.parentNode;
          b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
        },
      }),
    r.each(
      [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable",
      ],
      function () {
        r.propFix[this.toLowerCase()] = this;
      }
    );
  function pb(a) {
    var b = a.match(L) || [];
    return b.join(" ");
  }
  function qb(a) {
    return (a.getAttribute && a.getAttribute("class")) || "";
  }
  r.fn.extend({
    addClass: function (a) {
      var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i = 0;
      if (r.isFunction(a))
        return this.each(function (b) {
          r(this).addClass(a.call(this, b, qb(this)));
        });
      if ("string" == typeof a && a) {
        b = a.match(L) || [];
        while ((c = this[i++]))
          if (((e = qb(c)), (d = 1 === c.nodeType && " " + pb(e) + " "))) {
            g = 0;
            while ((f = b[g++])) d.indexOf(" " + f + " ") < 0 && (d += f + " ");
            (h = pb(d)), e !== h && c.setAttribute("class", h);
          }
      }
      return this;
    },
    removeClass: function (a) {
      var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i = 0;
      if (r.isFunction(a))
        return this.each(function (b) {
          r(this).removeClass(a.call(this, b, qb(this)));
        });
      if (!arguments.length) return this.attr("class", "");
      if ("string" == typeof a && a) {
        b = a.match(L) || [];
        while ((c = this[i++]))
          if (((e = qb(c)), (d = 1 === c.nodeType && " " + pb(e) + " "))) {
            g = 0;
            while ((f = b[g++]))
              while (d.indexOf(" " + f + " ") > -1)
                d = d.replace(" " + f + " ", " ");
            (h = pb(d)), e !== h && c.setAttribute("class", h);
          }
      }
      return this;
    },
    toggleClass: function (a, b) {
      var c = typeof a;
      return "boolean" == typeof b && "string" === c
        ? b
          ? this.addClass(a)
          : this.removeClass(a)
        : r.isFunction(a)
        ? this.each(function (c) {
            r(this).toggleClass(a.call(this, c, qb(this), b), b);
          })
        : this.each(function () {
            var b, d, e, f;
            if ("string" === c) {
              (d = 0), (e = r(this)), (f = a.match(L) || []);
              while ((b = f[d++]))
                e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
            } else (void 0 !== a && "boolean" !== c) || ((b = qb(this)), b && W.set(this, "__className__", b), this.setAttribute && this.setAttribute("class", b || a === !1 ? "" : W.get(this, "__className__") || ""));
          });
    },
    hasClass: function (a) {
      var b,
        c,
        d = 0;
      b = " " + a + " ";
      while ((c = this[d++]))
        if (1 === c.nodeType && (" " + pb(qb(c)) + " ").indexOf(b) > -1)
          return !0;
      return !1;
    },
  });
  var rb = /\r/g;
  r.fn.extend({
    val: function (a) {
      var b,
        c,
        d,
        e = this[0];
      {
        if (arguments.length)
          return (
            (d = r.isFunction(a)),
            this.each(function (c) {
              var e;
              1 === this.nodeType &&
                ((e = d ? a.call(this, c, r(this).val()) : a),
                null == e
                  ? (e = "")
                  : "number" == typeof e
                  ? (e += "")
                  : Array.isArray(e) &&
                    (e = r.map(e, function (a) {
                      return null == a ? "" : a + "";
                    })),
                (b =
                  r.valHooks[this.type] ||
                  r.valHooks[this.nodeName.toLowerCase()]),
                (b && "set" in b && void 0 !== b.set(this, e, "value")) ||
                  (this.value = e));
            })
          );
        if (e)
          return (
            (b = r.valHooks[e.type] || r.valHooks[e.nodeName.toLowerCase()]),
            b && "get" in b && void 0 !== (c = b.get(e, "value"))
              ? c
              : ((c = e.value),
                "string" == typeof c ? c.replace(rb, "") : null == c ? "" : c)
          );
      }
    },
  }),
    r.extend({
      valHooks: {
        option: {
          get: function (a) {
            var b = r.find.attr(a, "value");
            return null != b ? b : pb(r.text(a));
          },
        },
        select: {
          get: function (a) {
            var b,
              c,
              d,
              e = a.options,
              f = a.selectedIndex,
              g = "select-one" === a.type,
              h = g ? null : [],
              i = g ? f + 1 : e.length;
            for (d = f < 0 ? i : g ? f : 0; d < i; d++)
              if (
                ((c = e[d]),
                (c.selected || d === f) &&
                  !c.disabled &&
                  (!c.parentNode.disabled || !B(c.parentNode, "optgroup")))
              ) {
                if (((b = r(c).val()), g)) return b;
                h.push(b);
              }
            return h;
          },
          set: function (a, b) {
            var c,
              d,
              e = a.options,
              f = r.makeArray(b),
              g = e.length;
            while (g--)
              (d = e[g]),
                (d.selected = r.inArray(r.valHooks.option.get(d), f) > -1) &&
                  (c = !0);
            return c || (a.selectedIndex = -1), f;
          },
        },
      },
    }),
    r.each(["radio", "checkbox"], function () {
      (r.valHooks[this] = {
        set: function (a, b) {
          if (Array.isArray(b))
            return (a.checked = r.inArray(r(a).val(), b) > -1);
        },
      }),
        o.checkOn ||
          (r.valHooks[this].get = function (a) {
            return null === a.getAttribute("value") ? "on" : a.value;
          });
    });
  var sb = /^(?:focusinfocus|focusoutblur)$/;
  r.extend(r.event, {
    trigger: function (b, c, e, f) {
      var g,
        h,
        i,
        j,
        k,
        m,
        n,
        o = [e || d],
        p = l.call(b, "type") ? b.type : b,
        q = l.call(b, "namespace") ? b.namespace.split(".") : [];
      if (
        ((h = i = e = e || d),
        3 !== e.nodeType &&
          8 !== e.nodeType &&
          !sb.test(p + r.event.triggered) &&
          (p.indexOf(".") > -1 &&
            ((q = p.split(".")), (p = q.shift()), q.sort()),
          (k = p.indexOf(":") < 0 && "on" + p),
          (b = b[r.expando] ? b : new r.Event(p, "object" == typeof b && b)),
          (b.isTrigger = f ? 2 : 3),
          (b.namespace = q.join(".")),
          (b.rnamespace = b.namespace
            ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null),
          (b.result = void 0),
          b.target || (b.target = e),
          (c = null == c ? [b] : r.makeArray(c, [b])),
          (n = r.event.special[p] || {}),
          f || !n.trigger || n.trigger.apply(e, c) !== !1))
      ) {
        if (!f && !n.noBubble && !r.isWindow(e)) {
          for (
            j = n.delegateType || p, sb.test(j + p) || (h = h.parentNode);
            h;
            h = h.parentNode
          )
            o.push(h), (i = h);
          i === (e.ownerDocument || d) &&
            o.push(i.defaultView || i.parentWindow || a);
        }
        g = 0;
        while ((h = o[g++]) && !b.isPropagationStopped())
          (b.type = g > 1 ? j : n.bindType || p),
            (m = (W.get(h, "events") || {})[b.type] && W.get(h, "handle")),
            m && m.apply(h, c),
            (m = k && h[k]),
            m &&
              m.apply &&
              U(h) &&
              ((b.result = m.apply(h, c)),
              b.result === !1 && b.preventDefault());
        return (
          (b.type = p),
          f ||
            b.isDefaultPrevented() ||
            (n._default && n._default.apply(o.pop(), c) !== !1) ||
            !U(e) ||
            (k &&
              r.isFunction(e[p]) &&
              !r.isWindow(e) &&
              ((i = e[k]),
              i && (e[k] = null),
              (r.event.triggered = p),
              e[p](),
              (r.event.triggered = void 0),
              i && (e[k] = i))),
          b.result
        );
      }
    },
    simulate: function (a, b, c) {
      var d = r.extend(new r.Event(), c, { type: a, isSimulated: !0 });
      r.event.trigger(d, null, b);
    },
  }),
    r.fn.extend({
      trigger: function (a, b) {
        return this.each(function () {
          r.event.trigger(a, b, this);
        });
      },
      triggerHandler: function (a, b) {
        var c = this[0];
        if (c) return r.event.trigger(a, b, c, !0);
      },
    }),
    r.each(
      "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
        " "
      ),
      function (a, b) {
        r.fn[b] = function (a, c) {
          return arguments.length > 0
            ? this.on(b, null, a, c)
            : this.trigger(b);
        };
      }
    ),
    r.fn.extend({
      hover: function (a, b) {
        return this.mouseenter(a).mouseleave(b || a);
      },
    }),
    (o.focusin = "onfocusin" in a),
    o.focusin ||
      r.each({ focus: "focusin", blur: "focusout" }, function (a, b) {
        var c = function (a) {
          r.event.simulate(b, a.target, r.event.fix(a));
        };
        r.event.special[b] = {
          setup: function () {
            var d = this.ownerDocument || this,
              e = W.access(d, b);
            e || d.addEventListener(a, c, !0), W.access(d, b, (e || 0) + 1);
          },
          teardown: function () {
            var d = this.ownerDocument || this,
              e = W.access(d, b) - 1;
            e
              ? W.access(d, b, e)
              : (d.removeEventListener(a, c, !0), W.remove(d, b));
          },
        };
      });
  var tb = a.location,
    ub = r.now(),
    vb = /\?/;
  r.parseXML = function (b) {
    var c;
    if (!b || "string" != typeof b) return null;
    try {
      c = new a.DOMParser().parseFromString(b, "text/xml");
    } catch (d) {
      c = void 0;
    }
    return (
      (c && !c.getElementsByTagName("parsererror").length) ||
        r.error("Invalid XML: " + b),
      c
    );
  };
  var wb = /\[\]$/,
    xb = /\r?\n/g,
    yb = /^(?:submit|button|image|reset|file)$/i,
    zb = /^(?:input|select|textarea|keygen)/i;
  function Ab(a, b, c, d) {
    var e;
    if (Array.isArray(b))
      r.each(b, function (b, e) {
        c || wb.test(a)
          ? d(a, e)
          : Ab(
              a + "[" + ("object" == typeof e && null != e ? b : "") + "]",
              e,
              c,
              d
            );
      });
    else if (c || "object" !== r.type(b)) d(a, b);
    else for (e in b) Ab(a + "[" + e + "]", b[e], c, d);
  }
  (r.param = function (a, b) {
    var c,
      d = [],
      e = function (a, b) {
        var c = r.isFunction(b) ? b() : b;
        d[d.length] =
          encodeURIComponent(a) + "=" + encodeURIComponent(null == c ? "" : c);
      };
    if (Array.isArray(a) || (a.jquery && !r.isPlainObject(a)))
      r.each(a, function () {
        e(this.name, this.value);
      });
    else for (c in a) Ab(c, a[c], b, e);
    return d.join("&");
  }),
    r.fn.extend({
      serialize: function () {
        return r.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          var a = r.prop(this, "elements");
          return a ? r.makeArray(a) : this;
        })
          .filter(function () {
            var a = this.type;
            return (
              this.name &&
              !r(this).is(":disabled") &&
              zb.test(this.nodeName) &&
              !yb.test(a) &&
              (this.checked || !ja.test(a))
            );
          })
          .map(function (a, b) {
            var c = r(this).val();
            return null == c
              ? null
              : Array.isArray(c)
              ? r.map(c, function (a) {
                  return { name: b.name, value: a.replace(xb, "\r\n") };
                })
              : { name: b.name, value: c.replace(xb, "\r\n") };
          })
          .get();
      },
    });
  var Bb = /%20/g,
    Cb = /#.*$/,
    Db = /([?&])_=[^&]*/,
    Eb = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    Fb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    Gb = /^(?:GET|HEAD)$/,
    Hb = /^\/\//,
    Ib = {},
    Jb = {},
    Kb = "*/".concat("*"),
    Lb = d.createElement("a");
  Lb.href = tb.href;
  function Mb(a) {
    return function (b, c) {
      "string" != typeof b && ((c = b), (b = "*"));
      var d,
        e = 0,
        f = b.toLowerCase().match(L) || [];
      if (r.isFunction(c))
        while ((d = f[e++]))
          "+" === d[0]
            ? ((d = d.slice(1) || "*"), (a[d] = a[d] || []).unshift(c))
            : (a[d] = a[d] || []).push(c);
    };
  }
  function Nb(a, b, c, d) {
    var e = {},
      f = a === Jb;
    function g(h) {
      var i;
      return (
        (e[h] = !0),
        r.each(a[h] || [], function (a, h) {
          var j = h(b, c, d);
          return "string" != typeof j || f || e[j]
            ? f
              ? !(i = j)
              : void 0
            : (b.dataTypes.unshift(j), g(j), !1);
        }),
        i
      );
    }
    return g(b.dataTypes[0]) || (!e["*"] && g("*"));
  }
  function Ob(a, b) {
    var c,
      d,
      e = r.ajaxSettings.flatOptions || {};
    for (c in b) void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
    return d && r.extend(!0, a, d), a;
  }
  function Pb(a, b, c) {
    var d,
      e,
      f,
      g,
      h = a.contents,
      i = a.dataTypes;
    while ("*" === i[0])
      i.shift(),
        void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
    if (d)
      for (e in h)
        if (h[e] && h[e].test(d)) {
          i.unshift(e);
          break;
        }
    if (i[0] in c) f = i[0];
    else {
      for (e in c) {
        if (!i[0] || a.converters[e + " " + i[0]]) {
          f = e;
          break;
        }
        g || (g = e);
      }
      f = f || g;
    }
    if (f) return f !== i[0] && i.unshift(f), c[f];
  }
  function Qb(a, b, c, d) {
    var e,
      f,
      g,
      h,
      i,
      j = {},
      k = a.dataTypes.slice();
    if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
    f = k.shift();
    while (f)
      if (
        (a.responseFields[f] && (c[a.responseFields[f]] = b),
        !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
        (i = f),
        (f = k.shift()))
      )
        if ("*" === f) f = i;
        else if ("*" !== i && i !== f) {
          if (((g = j[i + " " + f] || j["* " + f]), !g))
            for (e in j)
              if (
                ((h = e.split(" ")),
                h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]]))
              ) {
                g === !0
                  ? (g = j[e])
                  : j[e] !== !0 && ((f = h[0]), k.unshift(h[1]));
                break;
              }
          if (g !== !0)
            if (g && a["throws"]) b = g(b);
            else
              try {
                b = g(b);
              } catch (l) {
                return {
                  state: "parsererror",
                  error: g ? l : "No conversion from " + i + " to " + f,
                };
              }
        }
    return { state: "success", data: b };
  }
  r.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: tb.href,
      type: "GET",
      isLocal: Fb.test(tb.protocol),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": Kb,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript",
      },
      contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON",
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": JSON.parse,
        "text xml": r.parseXML,
      },
      flatOptions: { url: !0, context: !0 },
    },
    ajaxSetup: function (a, b) {
      return b ? Ob(Ob(a, r.ajaxSettings), b) : Ob(r.ajaxSettings, a);
    },
    ajaxPrefilter: Mb(Ib),
    ajaxTransport: Mb(Jb),
    ajax: function (b, c) {
      "object" == typeof b && ((c = b), (b = void 0)), (c = c || {});
      var e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o = r.ajaxSetup({}, c),
        p = o.context || o,
        q = o.context && (p.nodeType || p.jquery) ? r(p) : r.event,
        s = r.Deferred(),
        t = r.Callbacks("once memory"),
        u = o.statusCode || {},
        v = {},
        w = {},
        x = "canceled",
        y = {
          readyState: 0,
          getResponseHeader: function (a) {
            var b;
            if (k) {
              if (!h) {
                h = {};
                while ((b = Eb.exec(g))) h[b[1].toLowerCase()] = b[2];
              }
              b = h[a.toLowerCase()];
            }
            return null == b ? null : b;
          },
          getAllResponseHeaders: function () {
            return k ? g : null;
          },
          setRequestHeader: function (a, b) {
            return (
              null == k &&
                ((a = w[a.toLowerCase()] = w[a.toLowerCase()] || a),
                (v[a] = b)),
              this
            );
          },
          overrideMimeType: function (a) {
            return null == k && (o.mimeType = a), this;
          },
          statusCode: function (a) {
            var b;
            if (a)
              if (k) y.always(a[y.status]);
              else for (b in a) u[b] = [u[b], a[b]];
            return this;
          },
          abort: function (a) {
            var b = a || x;
            return e && e.abort(b), A(0, b), this;
          },
        };
      if (
        (s.promise(y),
        (o.url = ((b || o.url || tb.href) + "").replace(
          Hb,
          tb.protocol + "//"
        )),
        (o.type = c.method || c.type || o.method || o.type),
        (o.dataTypes = (o.dataType || "*").toLowerCase().match(L) || [""]),
        null == o.crossDomain)
      ) {
        j = d.createElement("a");
        try {
          (j.href = o.url),
            (j.href = j.href),
            (o.crossDomain =
              Lb.protocol + "//" + Lb.host != j.protocol + "//" + j.host);
        } catch (z) {
          o.crossDomain = !0;
        }
      }
      if (
        (o.data &&
          o.processData &&
          "string" != typeof o.data &&
          (o.data = r.param(o.data, o.traditional)),
        Nb(Ib, o, c, y),
        k)
      )
        return y;
      (l = r.event && o.global),
        l && 0 === r.active++ && r.event.trigger("ajaxStart"),
        (o.type = o.type.toUpperCase()),
        (o.hasContent = !Gb.test(o.type)),
        (f = o.url.replace(Cb, "")),
        o.hasContent
          ? o.data &&
            o.processData &&
            0 ===
              (o.contentType || "").indexOf(
                "application/x-www-form-urlencoded"
              ) &&
            (o.data = o.data.replace(Bb, "+"))
          : ((n = o.url.slice(f.length)),
            o.data && ((f += (vb.test(f) ? "&" : "?") + o.data), delete o.data),
            o.cache === !1 &&
              ((f = f.replace(Db, "$1")),
              (n = (vb.test(f) ? "&" : "?") + "_=" + ub++ + n)),
            (o.url = f + n)),
        o.ifModified &&
          (r.lastModified[f] &&
            y.setRequestHeader("If-Modified-Since", r.lastModified[f]),
          r.etag[f] && y.setRequestHeader("If-None-Match", r.etag[f])),
        ((o.data && o.hasContent && o.contentType !== !1) || c.contentType) &&
          y.setRequestHeader("Content-Type", o.contentType),
        y.setRequestHeader(
          "Accept",
          o.dataTypes[0] && o.accepts[o.dataTypes[0]]
            ? o.accepts[o.dataTypes[0]] +
                ("*" !== o.dataTypes[0] ? ", " + Kb + "; q=0.01" : "")
            : o.accepts["*"]
        );
      for (m in o.headers) y.setRequestHeader(m, o.headers[m]);
      if (o.beforeSend && (o.beforeSend.call(p, y, o) === !1 || k))
        return y.abort();
      if (
        ((x = "abort"),
        t.add(o.complete),
        y.done(o.success),
        y.fail(o.error),
        (e = Nb(Jb, o, c, y)))
      ) {
        if (((y.readyState = 1), l && q.trigger("ajaxSend", [y, o]), k))
          return y;
        o.async &&
          o.timeout > 0 &&
          (i = a.setTimeout(function () {
            y.abort("timeout");
          }, o.timeout));
        try {
          (k = !1), e.send(v, A);
        } catch (z) {
          if (k) throw z;
          A(-1, z);
        }
      } else A(-1, "No Transport");
      function A(b, c, d, h) {
        var j,
          m,
          n,
          v,
          w,
          x = c;
        k ||
          ((k = !0),
          i && a.clearTimeout(i),
          (e = void 0),
          (g = h || ""),
          (y.readyState = b > 0 ? 4 : 0),
          (j = (b >= 200 && b < 300) || 304 === b),
          d && (v = Pb(o, y, d)),
          (v = Qb(o, v, y, j)),
          j
            ? (o.ifModified &&
                ((w = y.getResponseHeader("Last-Modified")),
                w && (r.lastModified[f] = w),
                (w = y.getResponseHeader("etag")),
                w && (r.etag[f] = w)),
              204 === b || "HEAD" === o.type
                ? (x = "nocontent")
                : 304 === b
                ? (x = "notmodified")
                : ((x = v.state), (m = v.data), (n = v.error), (j = !n)))
            : ((n = x), (!b && x) || ((x = "error"), b < 0 && (b = 0))),
          (y.status = b),
          (y.statusText = (c || x) + ""),
          j ? s.resolveWith(p, [m, x, y]) : s.rejectWith(p, [y, x, n]),
          y.statusCode(u),
          (u = void 0),
          l && q.trigger(j ? "ajaxSuccess" : "ajaxError", [y, o, j ? m : n]),
          t.fireWith(p, [y, x]),
          l &&
            (q.trigger("ajaxComplete", [y, o]),
            --r.active || r.event.trigger("ajaxStop")));
      }
      return y;
    },
    getJSON: function (a, b, c) {
      return r.get(a, b, c, "json");
    },
    getScript: function (a, b) {
      return r.get(a, void 0, b, "script");
    },
  }),
    r.each(["get", "post"], function (a, b) {
      r[b] = function (a, c, d, e) {
        return (
          r.isFunction(c) && ((e = e || d), (d = c), (c = void 0)),
          r.ajax(
            r.extend(
              { url: a, type: b, dataType: e, data: c, success: d },
              r.isPlainObject(a) && a
            )
          )
        );
      };
    }),
    (r._evalUrl = function (a) {
      return r.ajax({
        url: a,
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        throws: !0,
      });
    }),
    r.fn.extend({
      wrapAll: function (a) {
        var b;
        return (
          this[0] &&
            (r.isFunction(a) && (a = a.call(this[0])),
            (b = r(a, this[0].ownerDocument).eq(0).clone(!0)),
            this[0].parentNode && b.insertBefore(this[0]),
            b
              .map(function () {
                var a = this;
                while (a.firstElementChild) a = a.firstElementChild;
                return a;
              })
              .append(this)),
          this
        );
      },
      wrapInner: function (a) {
        return r.isFunction(a)
          ? this.each(function (b) {
              r(this).wrapInner(a.call(this, b));
            })
          : this.each(function () {
              var b = r(this),
                c = b.contents();
              c.length ? c.wrapAll(a) : b.append(a);
            });
      },
      wrap: function (a) {
        var b = r.isFunction(a);
        return this.each(function (c) {
          r(this).wrapAll(b ? a.call(this, c) : a);
        });
      },
      unwrap: function (a) {
        return (
          this.parent(a)
            .not("body")
            .each(function () {
              r(this).replaceWith(this.childNodes);
            }),
          this
        );
      },
    }),
    (r.expr.pseudos.hidden = function (a) {
      return !r.expr.pseudos.visible(a);
    }),
    (r.expr.pseudos.visible = function (a) {
      return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length);
    }),
    (r.ajaxSettings.xhr = function () {
      try {
        return new a.XMLHttpRequest();
      } catch (b) {}
    });
  var Rb = { 0: 200, 1223: 204 },
    Sb = r.ajaxSettings.xhr();
  (o.cors = !!Sb && "withCredentials" in Sb),
    (o.ajax = Sb = !!Sb),
    r.ajaxTransport(function (b) {
      var c, d;
      if (o.cors || (Sb && !b.crossDomain))
        return {
          send: function (e, f) {
            var g,
              h = b.xhr();
            if (
              (h.open(b.type, b.url, b.async, b.username, b.password),
              b.xhrFields)
            )
              for (g in b.xhrFields) h[g] = b.xhrFields[g];
            b.mimeType && h.overrideMimeType && h.overrideMimeType(b.mimeType),
              b.crossDomain ||
                e["X-Requested-With"] ||
                (e["X-Requested-With"] = "XMLHttpRequest");
            for (g in e) h.setRequestHeader(g, e[g]);
            (c = function (a) {
              return function () {
                c &&
                  ((c = d = h.onload = h.onerror = h.onabort = h.onreadystatechange = null),
                  "abort" === a
                    ? h.abort()
                    : "error" === a
                    ? "number" != typeof h.status
                      ? f(0, "error")
                      : f(h.status, h.statusText)
                    : f(
                        Rb[h.status] || h.status,
                        h.statusText,
                        "text" !== (h.responseType || "text") ||
                          "string" != typeof h.responseText
                          ? { binary: h.response }
                          : { text: h.responseText },
                        h.getAllResponseHeaders()
                      ));
              };
            }),
              (h.onload = c()),
              (d = h.onerror = c("error")),
              void 0 !== h.onabort
                ? (h.onabort = d)
                : (h.onreadystatechange = function () {
                    4 === h.readyState &&
                      a.setTimeout(function () {
                        c && d();
                      });
                  }),
              (c = c("abort"));
            try {
              h.send((b.hasContent && b.data) || null);
            } catch (i) {
              if (c) throw i;
            }
          },
          abort: function () {
            c && c();
          },
        };
    }),
    r.ajaxPrefilter(function (a) {
      a.crossDomain && (a.contents.script = !1);
    }),
    r.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      },
      contents: { script: /\b(?:java|ecma)script\b/ },
      converters: {
        "text script": function (a) {
          return r.globalEval(a), a;
        },
      },
    }),
    r.ajaxPrefilter("script", function (a) {
      void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET");
    }),
    r.ajaxTransport("script", function (a) {
      if (a.crossDomain) {
        var b, c;
        return {
          send: function (e, f) {
            (b = r("<script>")
              .prop({ charset: a.scriptCharset, src: a.url })
              .on(
                "load error",
                (c = function (a) {
                  b.remove(),
                    (c = null),
                    a && f("error" === a.type ? 404 : 200, a.type);
                })
              )),
              d.head.appendChild(b[0]);
          },
          abort: function () {
            c && c();
          },
        };
      }
    });
  var Tb = [],
    Ub = /(=)\?(?=&|$)|\?\?/;
  r.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var a = Tb.pop() || r.expando + "_" + ub++;
      return (this[a] = !0), a;
    },
  }),
    r.ajaxPrefilter("json jsonp", function (b, c, d) {
      var e,
        f,
        g,
        h =
          b.jsonp !== !1 &&
          (Ub.test(b.url)
            ? "url"
            : "string" == typeof b.data &&
              0 ===
                (b.contentType || "").indexOf(
                  "application/x-www-form-urlencoded"
                ) &&
              Ub.test(b.data) &&
              "data");
      if (h || "jsonp" === b.dataTypes[0])
        return (
          (e = b.jsonpCallback = r.isFunction(b.jsonpCallback)
            ? b.jsonpCallback()
            : b.jsonpCallback),
          h
            ? (b[h] = b[h].replace(Ub, "$1" + e))
            : b.jsonp !== !1 &&
              (b.url += (vb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
          (b.converters["script json"] = function () {
            return g || r.error(e + " was not called"), g[0];
          }),
          (b.dataTypes[0] = "json"),
          (f = a[e]),
          (a[e] = function () {
            g = arguments;
          }),
          d.always(function () {
            void 0 === f ? r(a).removeProp(e) : (a[e] = f),
              b[e] && ((b.jsonpCallback = c.jsonpCallback), Tb.push(e)),
              g && r.isFunction(f) && f(g[0]),
              (g = f = void 0);
          }),
          "script"
        );
    }),
    (o.createHTMLDocument = (function () {
      var a = d.implementation.createHTMLDocument("").body;
      return (
        (a.innerHTML = "<form></form><form></form>"), 2 === a.childNodes.length
      );
    })()),
    (r.parseHTML = function (a, b, c) {
      if ("string" != typeof a) return [];
      "boolean" == typeof b && ((c = b), (b = !1));
      var e, f, g;
      return (
        b ||
          (o.createHTMLDocument
            ? ((b = d.implementation.createHTMLDocument("")),
              (e = b.createElement("base")),
              (e.href = d.location.href),
              b.head.appendChild(e))
            : (b = d)),
        (f = C.exec(a)),
        (g = !c && []),
        f
          ? [b.createElement(f[1])]
          : ((f = qa([a], b, g)),
            g && g.length && r(g).remove(),
            r.merge([], f.childNodes))
      );
    }),
    (r.fn.load = function (a, b, c) {
      var d,
        e,
        f,
        g = this,
        h = a.indexOf(" ");
      return (
        h > -1 && ((d = pb(a.slice(h))), (a = a.slice(0, h))),
        r.isFunction(b)
          ? ((c = b), (b = void 0))
          : b && "object" == typeof b && (e = "POST"),
        g.length > 0 &&
          r
            .ajax({ url: a, type: e || "GET", dataType: "html", data: b })
            .done(function (a) {
              (f = arguments),
                g.html(d ? r("<div>").append(r.parseHTML(a)).find(d) : a);
            })
            .always(
              c &&
                function (a, b) {
                  g.each(function () {
                    c.apply(this, f || [a.responseText, b, a]);
                  });
                }
            ),
        this
      );
    }),
    r.each(
      [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend",
      ],
      function (a, b) {
        r.fn[b] = function (a) {
          return this.on(b, a);
        };
      }
    ),
    (r.expr.pseudos.animated = function (a) {
      return r.grep(r.timers, function (b) {
        return a === b.elem;
      }).length;
    }),
    (r.offset = {
      setOffset: function (a, b, c) {
        var d,
          e,
          f,
          g,
          h,
          i,
          j,
          k = r.css(a, "position"),
          l = r(a),
          m = {};
        "static" === k && (a.style.position = "relative"),
          (h = l.offset()),
          (f = r.css(a, "top")),
          (i = r.css(a, "left")),
          (j =
            ("absolute" === k || "fixed" === k) &&
            (f + i).indexOf("auto") > -1),
          j
            ? ((d = l.position()), (g = d.top), (e = d.left))
            : ((g = parseFloat(f) || 0), (e = parseFloat(i) || 0)),
          r.isFunction(b) && (b = b.call(a, c, r.extend({}, h))),
          null != b.top && (m.top = b.top - h.top + g),
          null != b.left && (m.left = b.left - h.left + e),
          "using" in b ? b.using.call(a, m) : l.css(m);
      },
    }),
    r.fn.extend({
      offset: function (a) {
        if (arguments.length)
          return void 0 === a
            ? this
            : this.each(function (b) {
                r.offset.setOffset(this, a, b);
              });
        var b,
          c,
          d,
          e,
          f = this[0];
        if (f)
          return f.getClientRects().length
            ? ((d = f.getBoundingClientRect()),
              (b = f.ownerDocument),
              (c = b.documentElement),
              (e = b.defaultView),
              {
                top: d.top + e.pageYOffset - c.clientTop,
                left: d.left + e.pageXOffset - c.clientLeft,
              })
            : { top: 0, left: 0 };
      },
      position: function () {
        if (this[0]) {
          var a,
            b,
            c = this[0],
            d = { top: 0, left: 0 };
          return (
            "fixed" === r.css(c, "position")
              ? (b = c.getBoundingClientRect())
              : ((a = this.offsetParent()),
                (b = this.offset()),
                B(a[0], "html") || (d = a.offset()),
                (d = {
                  top: d.top + r.css(a[0], "borderTopWidth", !0),
                  left: d.left + r.css(a[0], "borderLeftWidth", !0),
                })),
            {
              top: b.top - d.top - r.css(c, "marginTop", !0),
              left: b.left - d.left - r.css(c, "marginLeft", !0),
            }
          );
        }
      },
      offsetParent: function () {
        return this.map(function () {
          var a = this.offsetParent;
          while (a && "static" === r.css(a, "position")) a = a.offsetParent;
          return a || ra;
        });
      },
    }),
    r.each(
      { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
      function (a, b) {
        var c = "pageYOffset" === b;
        r.fn[a] = function (d) {
          return T(
            this,
            function (a, d, e) {
              var f;
              return (
                r.isWindow(a)
                  ? (f = a)
                  : 9 === a.nodeType && (f = a.defaultView),
                void 0 === e
                  ? f
                    ? f[b]
                    : a[d]
                  : void (f
                      ? f.scrollTo(c ? f.pageXOffset : e, c ? e : f.pageYOffset)
                      : (a[d] = e))
              );
            },
            a,
            d,
            arguments.length
          );
        };
      }
    ),
    r.each(["top", "left"], function (a, b) {
      r.cssHooks[b] = Pa(o.pixelPosition, function (a, c) {
        if (c)
          return (c = Oa(a, b)), Ma.test(c) ? r(a).position()[b] + "px" : c;
      });
    }),
    r.each({ Height: "height", Width: "width" }, function (a, b) {
      r.each(
        { padding: "inner" + a, content: b, "": "outer" + a },
        function (c, d) {
          r.fn[d] = function (e, f) {
            var g = arguments.length && (c || "boolean" != typeof e),
              h = c || (e === !0 || f === !0 ? "margin" : "border");
            return T(
              this,
              function (b, c, e) {
                var f;
                return r.isWindow(b)
                  ? 0 === d.indexOf("outer")
                    ? b["inner" + a]
                    : b.document.documentElement["client" + a]
                  : 9 === b.nodeType
                  ? ((f = b.documentElement),
                    Math.max(
                      b.body["scroll" + a],
                      f["scroll" + a],
                      b.body["offset" + a],
                      f["offset" + a],
                      f["client" + a]
                    ))
                  : void 0 === e
                  ? r.css(b, c, h)
                  : r.style(b, c, e, h);
              },
              b,
              g ? e : void 0,
              g
            );
          };
        }
      );
    }),
    r.fn.extend({
      bind: function (a, b, c) {
        return this.on(a, null, b, c);
      },
      unbind: function (a, b) {
        return this.off(a, null, b);
      },
      delegate: function (a, b, c, d) {
        return this.on(b, a, c, d);
      },
      undelegate: function (a, b, c) {
        return 1 === arguments.length
          ? this.off(a, "**")
          : this.off(b, a || "**", c);
      },
    }),
    (r.holdReady = function (a) {
      a ? r.readyWait++ : r.ready(!0);
    }),
    (r.isArray = Array.isArray),
    (r.parseJSON = JSON.parse),
    (r.nodeName = B),
    "function" == typeof define &&
      define.amd &&
      define("jquery", [], function () {
        return r;
      });
  var Vb = a.jQuery,
    Wb = a.$;
  return (
    (r.noConflict = function (b) {
      return a.$ === r && (a.$ = Wb), b && a.jQuery === r && (a.jQuery = Vb), r;
    }),
    b || (a.jQuery = a.$ = r),
    r
  );
});

/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function (d) {
  var a;
  "function" === typeof define && define.amd && (define(d), (a = !0));
  "object" === typeof exports && ((module.exports = d()), (a = !0));
  if (!a) {
    var e = window.Cookies,
      b = (window.Cookies = d());
    b.noConflict = function () {
      window.Cookies = e;
      return b;
    };
  }
})(function () {
  function d() {
    for (var e = 0, b = {}; e < arguments.length; e++) {
      var d = arguments[e],
        a;
      for (a in d) b[a] = d[a];
    }
    return b;
  }
  function a(e) {
    function b() {}
    function m(h, f, c) {
      if ("undefined" !== typeof document) {
        c = d({ path: "/" }, b.defaults, c);
        "number" === typeof c.expires &&
          (c.expires = new Date(1 * new Date() + 864e5 * c.expires));
        c.expires = c.expires ? c.expires.toUTCString() : "";
        try {
          var a = JSON.stringify(f);
          /^[\{\[]/.test(a) && (f = a);
        } catch (q) {}
        f = e.write
          ? e.write(f, h)
          : encodeURIComponent(String(f)).replace(
              /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
              decodeURIComponent
            );
        h = encodeURIComponent(String(h))
          .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
          .replace(/[\(\)]/g, escape);
        var a = "",
          k;
        for (k in c)
          c[k] &&
            ((a += "; " + k),
            !0 !== c[k] && (a += "\x3d" + c[k].split(";")[0]));
        return (document.cookie = h + "\x3d" + f + a);
      }
    }
    function n(a, b) {
      if ("undefined" !== typeof document) {
        for (
          var c = {},
            h = document.cookie ? document.cookie.split("; ") : [],
            d = 0;
          d < h.length;
          d++
        ) {
          var f = h[d].split("\x3d"),
            g = f.slice(1).join("\x3d");
          b || '"' !== g.charAt(0) || (g = g.slice(1, -1));
          try {
            var l = f[0].replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent),
              g =
                (e.read || e)(g, l) ||
                g.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
            if (b)
              try {
                g = JSON.parse(g);
              } catch (p) {}
            c[l] = g;
            if (a === l) break;
          } catch (p) {}
        }
        return a ? c[a] : c;
      }
    }
    b.set = m;
    b.get = function (a) {
      return n(a, !1);
    };
    b.getJSON = function (a) {
      return n(a, !0);
    };
    b.remove = function (a, b) {
      m(a, "", d(b, { expires: -1 }));
    };
    b.defaults = {};
    b.withConverter = a;
    return b;
  }
  return a(function () {});
});
(function defineMustache(global, factory) {
  if (
    typeof exports === "object" &&
    exports &&
    typeof exports.nodeName !== "string"
  ) {
    factory(exports);
  } else if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else {
    global.Mustache = {};
    factory(global.Mustache);
  }
})(this, function mustacheFactory(mustache) {
  var objectToString = Object.prototype.toString;
  var isArray =
    Array.isArray ||
    function isArrayPolyfill(object) {
      return objectToString.call(object) === "[object Array]";
    };
  function isFunction(object) {
    return typeof object === "function";
  }
  function typeStr(obj) {
    return isArray(obj) ? "array" : typeof obj;
  }
  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }
  function hasProperty(obj, propName) {
    return obj != null && typeof obj === "object" && propName in obj;
  }
  function primitiveHasOwnProperty(primitive, propName) {
    return (
      primitive != null &&
      typeof primitive !== "object" &&
      primitive.hasOwnProperty &&
      primitive.hasOwnProperty(propName)
    );
  }
  var regExpTest = RegExp.prototype.test;
  function testRegExp(re, string) {
    return regExpTest.call(re, string);
  }
  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
      return entityMap[s];
    });
  }
  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;
  function parseTemplate(template, tags) {
    if (!template) return [];
    var sections = [];
    var tokens = [];
    var spaces = [];
    var hasTag = false;
    var nonSpace = false;
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }
      hasTag = false;
      nonSpace = false;
    }
    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tagsToCompile) {
      if (typeof tagsToCompile === "string")
        tagsToCompile = tagsToCompile.split(spaceRe, 2);
      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error("Invalid tags: " + tagsToCompile);
      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
      closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp(
        "\\s*" + escapeRegExp("}" + tagsToCompile[1])
      );
    }
    compileTags(tags || mustache.tags);
    var scanner = new Scanner(template);
    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;
      value = scanner.scanUntil(openingTagRe);
      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);
          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }
          tokens.push(["text", chr, start, start + 1]);
          start += 1;
          if (chr === "\n") stripSpace();
        }
      }
      if (!scanner.scan(openingTagRe)) break;
      hasTag = true;
      type = scanner.scan(tagRe) || "name";
      scanner.scan(whiteRe);
      if (type === "=") {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === "{") {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = "&";
      } else {
        value = scanner.scanUntil(closingTagRe);
      }
      if (!scanner.scan(closingTagRe))
        throw new Error("Unclosed tag at " + scanner.pos);
      token = [type, value, start, scanner.pos];
      tokens.push(token);
      if (type === "#" || type === "^") {
        sections.push(token);
      } else if (type === "/") {
        openSection = sections.pop();
        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);
        if (openSection[1] !== value)
          throw new Error(
            'Unclosed section "' + openSection[1] + '" at ' + start
          );
      } else if (type === "name" || type === "{" || type === "&") {
        nonSpace = true;
      } else if (type === "=") {
        compileTags(value);
      }
    }
    openSection = sections.pop();
    if (openSection)
      throw new Error(
        'Unclosed section "' + openSection[1] + '" at ' + scanner.pos
      );
    return nestTokens(squashTokens(tokens));
  }
  function squashTokens(tokens) {
    var squashedTokens = [];
    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];
      if (token) {
        if (token[0] === "text" && lastToken && lastToken[0] === "text") {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }
    return squashedTokens;
  }
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];
    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];
      switch (token[0]) {
        case "#":
        case "^":
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case "/":
          section = sections.pop();
          section[5] = token[2];
          collector =
            sections.length > 0
              ? sections[sections.length - 1][4]
              : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }
    return nestedTokens;
  }
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }
  Scanner.prototype.eos = function eos() {
    return this.tail === "";
  };
  Scanner.prototype.scan = function scan(re) {
    var match = this.tail.match(re);
    if (!match || match.index !== 0) return "";
    var string = match[0];
    this.tail = this.tail.substring(string.length);
    this.pos += string.length;
    return string;
  };
  Scanner.prototype.scanUntil = function scanUntil(re) {
    var index = this.tail.search(re),
      match;
    switch (index) {
      case -1:
        match = this.tail;
        this.tail = "";
        break;
      case 0:
        match = "";
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }
    this.pos += match.length;
    return match;
  };
  function Context(view, parentContext) {
    this.view = view;
    this.cache = { ".": this.view };
    this.parent = parentContext;
  }
  Context.prototype.push = function push(view) {
    return new Context(view, this);
  };
  Context.prototype.lookup = function lookup(name) {
    var cache = this.cache;
    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this,
        intermediateValue,
        names,
        index,
        lookupHit = false;
      while (context) {
        if (name.indexOf(".") > 0) {
          intermediateValue = context.view;
          names = name.split(".");
          index = 0;
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit =
                hasProperty(intermediateValue, names[index]) ||
                primitiveHasOwnProperty(intermediateValue, names[index]);
            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }
        if (lookupHit) {
          value = intermediateValue;
          break;
        }
        context = context.parent;
      }
      cache[name] = value;
    }
    if (isFunction(value)) value = value.call(this.view);
    return value;
  };
  function Writer() {
    this.cache = {};
  }
  Writer.prototype.clearCache = function clearCache() {
    this.cache = {};
  };
  Writer.prototype.parse = function parse(template, tags) {
    var cache = this.cache;
    var cacheKey = template + ":" + (tags || mustache.tags).join(":");
    var tokens = cache[cacheKey];
    if (tokens == null)
      tokens = cache[cacheKey] = parseTemplate(template, tags);
    return tokens;
  };
  Writer.prototype.render = function render(template, view, partials, tags) {
    var tokens = this.parse(template, tags);
    var context = view instanceof Context ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template, tags);
  };
  Writer.prototype.renderTokens = function renderTokens(
    tokens,
    context,
    partials,
    originalTemplate,
    tags
  ) {
    var buffer = "";
    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];
      if (symbol === "#")
        value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === "^")
        value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === ">")
        value = this.renderPartial(token, context, partials, tags);
      else if (symbol === "&") value = this.unescapedValue(token, context);
      else if (symbol === "name") value = this.escapedValue(token, context);
      else if (symbol === "text") value = this.rawValue(token);
      if (value !== undefined) buffer += value;
    }
    return buffer;
  };
  Writer.prototype.renderSection = function renderSection(
    token,
    context,
    partials,
    originalTemplate
  ) {
    var self = this;
    var buffer = "";
    var value = context.lookup(token[1]);
    function subRender(template) {
      return self.render(template, context, partials);
    }
    if (!value) return;
    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(
          token[4],
          context.push(value[j]),
          partials,
          originalTemplate
        );
      }
    } else if (
      typeof value === "object" ||
      typeof value === "string" ||
      typeof value === "number"
    ) {
      buffer += this.renderTokens(
        token[4],
        context.push(value),
        partials,
        originalTemplate
      );
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== "string")
        throw new Error(
          "Cannot use higher-order sections without the original template"
        );
      value = value.call(
        context.view,
        originalTemplate.slice(token[3], token[5]),
        subRender
      );
      if (value != null) buffer += value;
    } else {
      buffer += this.renderTokens(
        token[4],
        context,
        partials,
        originalTemplate
      );
    }
    return buffer;
  };
  Writer.prototype.renderInverted = function renderInverted(
    token,
    context,
    partials,
    originalTemplate
  ) {
    var value = context.lookup(token[1]);
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };
  Writer.prototype.renderPartial = function renderPartial(
    token,
    context,
    partials,
    tags
  ) {
    if (!partials) return;
    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(
        this.parse(value, tags),
        context,
        partials,
        value
      );
  };
  Writer.prototype.unescapedValue = function unescapedValue(token, context) {
    var value = context.lookup(token[1]);
    if (value != null) return value;
  };
  Writer.prototype.escapedValue = function escapedValue(token, context) {
    var value = context.lookup(token[1]);
    if (value != null) return mustache.escape(value);
  };
  Writer.prototype.rawValue = function rawValue(token) {
    return token[1];
  };
  mustache.name = "mustache.js";
  mustache.version = "3.0.1";
  mustache.tags = ["{{", "}}"];
  var defaultWriter = new Writer();
  mustache.clearCache = function clearCache() {
    return defaultWriter.clearCache();
  };
  mustache.parse = function parse(template, tags) {
    return defaultWriter.parse(template, tags);
  };
  mustache.render = function render(template, view, partials, tags) {
    if (typeof template !== "string") {
      throw new TypeError(
        'Invalid template! Template should be a "string" ' +
          'but "' +
          typeStr(template) +
          '" was given as the first ' +
          "argument for mustache#render(template, view, partials)"
      );
    }
    return defaultWriter.render(template, view, partials, tags);
  };
  mustache.to_html = function to_html(template, view, partials, send) {
    var result = mustache.render(template, view, partials);
    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };
  mustache.escape = escapeHtml;
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;
  return mustache;
});

/**
 * Util 工具方法
 */
(function ($) {
  $.extend((window.Util = {}), {
    /**
     * 将数字的字符串转为10进制整数
     * @param {String} num 数字的字符串
     * @returns {Number} 整数
     */
    toInt: function (num) {
      return $.isNumeric(num) ? parseInt(num, 10) : false;
    },

    /** 生成uuid，一般用于生成组件 id、缓存 key 值等场景.
     * @returns {String} uuid
     * */
    uuid: function () {
      var d = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );

      return uuid;
    },

    /**
     * 获取目标的类型
     * @param {any} obj 目标对象
     * @returns {String} 目标类型
     */
    getType: function (obj) {
      var s = Object.prototype.toString.call(obj);
      return s.substring(8, s.length - 1).toLowerCase();
    },

    /** 一个空方法，一般用于函数 或者 回调 的初始化. */
    noop: function () {},

    /**
     * 复写某个Util方法
     * @param {String} name 方法名
     * @param {Function} method 复写逻辑
     */
    overwrite: function (name, method) {
      if (!Util[name]) {
        console.error("Util.%s, this method is not in Util", name);
      } else {
        Util[name] = method;
      }
    },

    /** 显示加载提示效果，一般用异步请求中提示用户请求在处理中。底层依赖 layer 组件，框架页面已默认引入.*/
    showLoading: function () {
      layer.load();
    },

    /** 隐藏加载提示效果，一般用于异步请求结束后调用.*/
    hideLoading: function () {
      layer.closeAll("loading");
    },

    /** 此方法需要业务开发人员进行实现，用于后端 session 失效后，用户提交数据时，展示登录面板，让用户重新登录. */
    showLogin: function () {
      console.warn("显示登录面板，需要覆写");
    },
  });
})(jQuery);

/**
 * 浏览器环境相关的 Util 方法
 */
(function ($, exports) {
  $.extend(exports, {
    browsers: {
      isIE67: "\v" == "v",
      isIE8:
        !!document.all && document.querySelector && !document.addEventListener,
      isIE9: !!document.all && document.addEventListener && !window.atob,
      isIE10: !!document.all && window.atob,
      isIE11:
        "-ms-scroll-limit" in document.documentElement.style &&
        "-ms-ime-align" in document.documentElement.style,
      // IE6~11
      isIE:
        (!!document.all && document.compatMode) ||
        ("-ms-scroll-limit" in document.documentElement.style &&
          "-ms-ime-align" in document.documentElement.style),
      isWebkit: "WebkitAppearance" in document.documentElement.style,
      isFirefox: !!navigator.userAgent.match(/firefox/i),
      isEdge: /Edge\/([\d.]+)/.test(navigator.userAgent),
      // 是否为移动端
      isMobile: (function () {
        var ua = navigator.userAgent;

        var detect = {
          // 是否为移动终端
          mobile: !!ua.match(/AppleWebKit.*Mobile.*/),
          // ios终端
          ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
          // android终端或者uc浏览器
          android: ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1,
          // 是否为iPhone或者QQHD浏览器
          iPhone: ua.indexOf("iPhone") > -1,
          // 是否iPad
          iPad: ua.indexOf("iPad") > -1,
        };

        return (
          detect.mobile ||
          detect.ios ||
          detect.android ||
          detect.iPhone ||
          detect.iPad
        );
      })(),
    },
  });
})(jQuery, window.Util);

/**
 * 日期、时间相关的 Util 方法
 * 如果需要功能更加强大的 日期、时间函数，可以使用 moment.js
 * https://momentjs.com/
 */
(function ($, exports) {
  $.extend(exports, {
    /**
     * 按照格式输出日期
     * @param {any} date 日期对象
     * @param {any} fmt  格式如：yyyy-MM-dd HH:mm:ss
     * @example `Util.dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')`
     * @returns {string} 日期字符串
     */
    dateFormat: function (date, fmt) {
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      var week = {
        0: "\u65e5",
        1: "\u4e00",
        2: "\u4e8c",
        3: "\u4e09",
        4: "\u56db",
        5: "\u4e94",
        6: "\u516d",
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (RegExp.$1.length > 1
            ? RegExp.$1.length > 2
              ? "\u661f\u671f"
              : "\u5468"
            : "") + week[date.getDay() + ""]
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },
  });
})(jQuery, window.Util);

/**
 * 表单相关的 Util 方法
 */
(function ($, exports) {
  $.fn.extend({
    /**
     * 把表单控件序列化为字面对象, 如： { controlName: 'controlValue' }
     * 需要序列化的表单控件必须有 name 属性
     * 注：此 FormData 与 html5中的 FormData 不一样。
     */
    toFormData: function () {
      var o = {};
      var a = this.serializeArray();

      $.each(a, function () {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || "");
        } else {
          o[this.name] = this.value || "";
        }
      });

      return o;
    },

    /**
     * 为表单控件进行批量赋值
     * data 为表单控件数据的字面对象，如： { controlName： 'controlValue' }
     * 表单控件必须有 name 属性
     */
    loadFormData: function (data) {
      function _checkField(name, val, $target) {
        var cc = $target.find(
          'input[name="' +
            name +
            '"][type=radio], input[name="' +
            name +
            '"][type=checkbox]'
        );
        if (cc.length) {
          cc.prop("checked", false);
          cc.each(function () {
            if (_isChecked($(this).val(), val)) {
              $(this).prop("checked", true);
            }
          });
          return true;
        }
        return false;
      }

      function _isChecked(v, val) {
        if (
          v == String(val) ||
          $.inArray(v, $.isArray(val) ? val : [val]) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      }

      for (var name in data) {
        var val = data[name];
        if (!_checkField(name, val, $(this))) {
          $(this)
            .find('input[name="' + name + '"]')
            .val(val);
          $(this)
            .find('textarea[name="' + name + '"]')
            .val(val);
          $(this)
            .find('select[name="' + name + '"]')
            .val(val);
        }
      }
    },
  });

  $.extend(exports, {
    /**
     * 把表单控件序列化为字面对象, 如： { controlName: 'controlValue' }
     * @param {string} id form id
     * @returns {Object} 序列化对象
     */
    toFormData: function (id) {
      return $(document.getElementById(id)).toFormData();
    },

    /**
     * 为表单控件进行批量赋值
     * @param {string} id form id
     * @param {Object} data  为表单控件数据的字面对象，如： { controlName： 'controlValue' }
     */
    loadFormData: function (id, data) {
      $(document.getElementById(id)).loadFormData(data);
    },
  });
})(jQuery, window.Util);

/**
 * 加密相关方法
 */
(function ($, exports) {
  function Str2Hex(s) {
    var c = "";
    var n;
    var ss = "0123456789ABCDEF";
    var digS = "";
    for (var i = 0; i < s.length; i++) {
      c = s.charAt(i);
      n = ss.indexOf(c);
      digS += Dec2Dig(eval(n));
    }
    // return value;
    return digS;
  }

  function Dec2Dig(n1) {
    var s = "";
    var n2 = 0;
    for (var i = 0; i < 4; i++) {
      n2 = Math.pow(2, 3 - i);
      if (n1 >= n2) {
        s += "1";
        n1 = n1 - n2;
      } else s += "0";
    }
    return s;
  }

  function Dig2Dec(s) {
    var retV = 0;
    if (s.length == 4) {
      for (var i = 0; i < 4; i++) {
        retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
      }
      return retV;
    }
    return -1;
  }

  function Hex2Utf8(s) {
    var retS = "";
    var tempS = "";
    var ss = "";
    if (s.length == 16) {
      tempS = "1110" + s.substring(0, 4);
      tempS += "10" + s.substring(4, 10);
      tempS += "10" + s.substring(10, 16);
      var sss = "0123456789ABCDEF";
      for (var i = 0; i < 3; i++) {
        retS += "%";
        ss = tempS.substring(i * 8, (eval(i) + 1) * 8);

        retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
        retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
      }
      return retS;
    }
    return "";
  }

  function encodeUtf8(s1) {
    var s = escape(s1);
    var sa = s.split("%");
    var retV = "";
    if (sa[0] !== "") {
      retV = sa[0];
    }
    for (var i = 1; i < sa.length; i++) {
      if (sa[i].substring(0, 1) == "u") {
        retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));
        if (sa[i].length > 5) {
          retV += sa[i].substring(5);
        }
      } else retV += "%" + sa[i];
    }

    return retV;
  }

  $.extend(exports, {
    //自定义加密函数
    encode: function (input) {
      // 先进行utf-8编码,解决中文问题
      input = encodeUtf8(input);
      // 对%做replace替换
      input = input.replace(/%/g, "_PERCENT_");

      // 对所有字符做ascii码转换
      var output = "",
        chr1 = "",
        i = 0,
        l = input.length;
      do {
        // 取字符的ascii码
        chr1 = input.charCodeAt(i++);
        // 偏移比较复杂，这里做个递减
        chr1 -= i;
        // =分割便于后台解析
        output = output + "=" + chr1;
      } while (i < l);

      return output;
    },
  });
})(jQuery, window.Util);

(function ($, win) {
  // atob/btoa polyfill for IE 9-
  // code from :https://github.com/davidchambers/Base64.js/blob/master/base64.js
  (function () {
    var object =
      typeof exports != "undefined"
        ? exports
        : typeof self != "undefined"
        ? self // #8: web workers
        : $.global; // #31: ExtendScript

    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    function InvalidCharacterError(message) {
      this.message = message;
    }
    InvalidCharacterError.prototype = new Error();
    InvalidCharacterError.prototype.name = "InvalidCharacterError";

    // encoder
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    object.btoa ||
      (object.btoa = function (input) {
        var str = String(input);
        for (
          // initialize result and counter
          var block, charCode, idx = 0, map = chars, output = "";
          // if the next str index does not exist:
          //   change the mapping table to "="
          //   check if d has no fractional digits
          str.charAt(idx | 0) || ((map = "="), idx % 1);
          // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
          output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
        ) {
          charCode = str.charCodeAt((idx += 3 / 4));
          if (charCode > 0xff) {
            throw new InvalidCharacterError(
              "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
            );
          }
          block = (block << 8) | charCode;
        }
        return output;
      });

    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    object.atob ||
      (object.atob = function (input) {
        var str = String(input).replace(/[=]+$/, ""); // #31: ExtendScript bad parse of /=
        if (str.length % 4 == 1) {
          throw new InvalidCharacterError(
            "'atob' failed: The string to be decoded is not correctly encoded."
          );
        }
        for (
          // initialize result and counters
          var bc = 0, bs, buffer, idx = 0, output = "";
          // get next character
          (buffer = str.charAt(idx++));
          // character found in table? initialize bit storage and add its ascii value;
          ~buffer &&
          ((bs = bc % 4 ? bs * 64 + buffer : buffer),
          // and if not first of each 4 characters,
          // convert the first 8 bits to one ascii character
          bc++ % 4)
            ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
            : 0
        ) {
          // try to find character in table (0-63, not found => -1)
          buffer = chars.indexOf(buffer);
        }
        return output;
      });
  })();
  // 加密解密
  $.extend(win.Util, {
    /**
     * 字符串加密 （先 encodeURIComponent 在 转 base64 再 encodeURIComponent）
     * @param {String} str 要处理的字符串
     * @returns {String} 加密后的字符串
     */
    encrypt: function (str) {
      if ("string" != Util.getType(str)) {
        throw new Error("The argument must be string!");
      }
      var output = window.encodeURIComponent(
        window.btoa(window.encodeURIComponent(str))
      );
      return output;
    },

    /**
     * 字符串解密 （先 decodeURIComponent 再 base64还原 再 decodeURIComponent ）
     * @param {String} str 要处理的字符串
     * @returns {String} 解密后的字符串
     */
    decrypt: function (str) {
      if ("string" != Util.getType(str)) {
        throw new Error("The argument must be string!");
      }
      var output = window.decodeURIComponent(
        window.atob(window.decodeURIComponent(str))
      );
      return output;
    },
  });
})(jQuery, window);

/**
 * ajax 相关 Util 方法
 */
(function ($, exports) {
  // 默认错误提示文本
  var ERROR_MSG = {
    400: "不合法的请求或被安全拦截。",
    401: "未授权或未登录。",
    403: "对资源没有访问权限。",
    404: "请求的资源无法找到。",
    500: "服务器内部错误。",
    503: "服务器正忙，请稍后再试。",
    timeout: "服务器正忙，请稍后再试。",
    parsererror: "数据解析异常，返回 JSON 格式不合法。",
  };

  // 获取错误回调
  // needTip: 是否需要提示
  // logLevel: console级别
  var getErrHandler = function (needTip, logLevel) {
    return function (xhr) {
      var errMsg = xhr.responseJSON && xhr.responseJSON.error,
        debugMsg = [
          "请求地址：",
          this.url,
          ", 状态码：" + (xhr.status || "超时"),
          ", 错误信息：",
          errMsg || ERROR_MSG[xhr.status],
        ].join("");
      console[logLevel || "error"](debugMsg);
    };
  };

  //开启CSRF验证
  var openCSRF = function (xhr) {
    var csrfcookie = Cookies.get(Config.csrf.CSRF_COOKIE_NAME || "_CSRFCOOKIE");
    if (csrfcookie) {
      xhr.setRequestHeader(
        Config.csrf.CSRF_HD_NAME || "CSRFCOOKIE",
        csrfcookie
      );
    }
  };

  var _ajaxInter = {};

  var _ajax = function (options) {
    var ajaxCfg = Config.ajax;

    options = $.extend(
      {},
      {
        type: "post",
        dataType: "json",
        timeout: ajaxCfg.timeout,
      },
      options
    );

    var beforesend = options.beforeSend || Util.noop;
    options.beforeSend = function (xhr) {
      if (!Config.isLocalMock && Config.csrf.open) {
        openCSRF(xhr);
      }
      beforesend(xhr);
    };

    // 把用户定义的 success 回调剥离出来
    var success = Util.noop;

    if ($.isFunction(options.success)) {
      var optSuccess = options.success;
      delete options.success;

      success = function (data) {
        try {
          optSuccess(data);
        } catch (err) {
          console.warn(err);
        }
      };
    }

    // 自动携带当前页面的url参数过去
    options.data = $.extend(Util.getUrlParams(), options.data);

    //参数预处理
    var tmpparams = $.proxy(Util.ajaxParamsHandler, this)(options.data);

    if (Config.enableEncodeParam) {
      var encryptStr = Util.encrypt(JSON.stringify(tmpparams));
      var encrytParam = {};
      encrytParam[Util.BODY_ENCRYPT_PARAM_NAME] = encryptStr;
      options.data = encrytParam;
    } else {
      options.data = tmpparams;
    }

    if (ajaxCfg.withCredentials) {
      options.xhrFields = {
        withCredentials: true,
      };
    }

    var xhr = $.ajax(options);
    return xhr.then(Util.ajaxPreSuccess, Util.ajaxError).done(success);
  };
  $.extend(exports, {
    // 按照最新传参标准的默认实现
    ajaxParamsHandler: function (data) {
      return {
        params: JSON.stringify(data),
      };
    },

    ajaxPreSuccess: function (data) {
      var status = data.status,
        code = 1,
        text = "",
        url = "";

      // f9 response
      if (status) {
        code = Util.toInt(status.code);
        text = status.text;
        url = status.url;

        $.proxy(Util.statusNodeHandler, this)(code, text, url);
      }

      data = data.custom === undefined ? data : data.custom;

      if (
        data &&
        typeof data !== "object" &&
        this.dataType.toLowerCase() === "json"
      ) {
        data = JSON.parse(data);
      }

      return data;
    },

    // 跟进响应码，进行响应异常的处理
    responseErrHandlers: {
      // 安全拦截
      400: getErrHandler(1),
      // 未登录，一般弹出快速登录框
      401: function (xhr) {
        $.proxy(getErrHandler(0, "info"), this)(xhr);

        Util.showLogin();
      },
      // 无权限
      403: getErrHandler(1),
      // 找不到资源
      404: getErrHandler(1),
      // 后台报错
      500: getErrHandler(1),
      // 后台暂时不可用
      503: getErrHandler(1),
      // 响应超时
      timeout: getErrHandler(1),
      // 响应格式解析异常
      parsererror: function (xhr) {
        console.error(
          "request: %s, response: %s, error: %s",
          this.url,
          xhr.responseText,
          ERROR_MSG.parsererror
        );
      },
      // 其他响应异常处理
      other: function (xhr, statusText, errorThrown) {
        console.error(
          "request: %s, status: %s, error: %s",
          this.url,
          xhr.status,
          errorThrown
        );
      },
    },

    // 对请求错误进行通用处理
    ajaxError: function (xhr, textStatus, errorThrown) {
      var callback = Util.noop;

      if (textStatus === "timeout" || textStatus === "parsererror") {
        callback = Util.responseErrHandlers[textStatus];
      } else if ($.inArray(xhr.status, [400, 401, 403, 404, 500, 503]) > -1) {
        callback = Util.responseErrHandlers[xhr.status];
      } else {
        callback = Util.responseErrHandlers.other;
      }

      $.proxy(callback, this)(xhr, textStatus, errorThrown);
    },

    ajax: function (options) {
      var apiName;
      for (var key in Config.ajaxUrls) {
        if (Config.ajaxUrls[key] == options.url) apiName = key;
      }

      if (apiName && Config.ajaxInterval && Config.ajaxInterval[apiName]) {
        var inter = _ajaxInter[apiName + "_interTime"];
        inter && clearTimeout(inter);
        var interTime = Config.ajaxInterval[apiName];

        return _ajax(options).always(function () {
          _ajaxInter[apiName + "_interTime"] = setTimeout(function () {
            Util.ajax(options);
          }, interTime);
        });
      } else {
        return _ajax(options);
      }
    },

    // 主要用于针对 status 节点进行一些通用的预处理，可以进行重写
    statusNodeHandler: function (code, text, url) {
      // 有 url 就给予页面跳转
      if (url) Util.gotoUrl(url);

      // 有 text 则给予提示
      //if (text) {
      //	if (code === 1 || code === 200) {
      //		layer.msg(text, {
      //		    icon: 1,
      //		    time: 3000
      //		});
      //	} else {
      //		layer.alert(text, {
      //			title: "操作提示",
      //			icon: 5
      //		});
      //	}
      //}
    },
  });
})(jQuery, window.Util);

(function ($, exports) {
  //是否开启oAuth2认证
  if (Config.oAuth2.open) {
    var _ajaxInter = {};
    var _ajax = function (options, isAnonymous) {
      options = $.extend(
        {},
        {
          type: "post",
          dataType: "json",
        },
        options
      );

      var success = function () {},
        error = function () {};

      if ($.isFunction(options.success)) {
        success = options.success;

        options.success = null;
        delete options.success;
      }
      if ($.isFunction(options.success)) {
        var optSuccess = options.success;
        delete options.success;

        success = function (data) {
          try {
            optSuccess(data);
          } catch (err) {
            console.warn(err);
          }
        };
      }
      options.data = $.proxy(
        Util.ajaxParamsHandlerWithOauth,
        this
      )(options.data);

      var xhr1, xhr2, xhr3;
      var dtd = $.Deferred();

      //判断是否初始化
      if (!OAuthInstance.isInit()) {
        xhr1 = OAuthInstance.initApp();
      } else {
        xhr1 = dtd.promise();
      }

      //判断是否有匿名token
      if (!OAuthInstance.anonymousToken()) {
        xhr2 = OAuthInstance.getAnonymousToken();
      } else {
        xhr2 = dtd.promise();
      }

      //如果存在code参数，说明是登陆后跳转到该地址
      var code = Util.getUrlParams("code");
      if (code) {
        xhr3 = OAuthInstance.getToken(code, window.location.href);
      } else {
        xhr3 = dtd.promise();
      }

      var tokenAjax = xhr1.then(function () {
        return xhr3.then(function () {
          if (!isAnonymous && !OAuthInstance.isLogin()) {
            layer.open({
              title: "提示",
              content: "您还未登录，点击确认去登录^_^",
              closeBtn: 0,
              yes: function (index, layero) {
                OAuthInstance.goLogin();
                layer.close(index);
              },
            });
            return;
          } else {
            return xhr2.then(function () {
              var url = location.href;
              var newurl = Util.deleteUrlParams(["code", "state", "timestamp"]);
              if (url != newurl) {
                window.location.replace(newurl);
                return;
              }

              var isAnonymousToken = true;
              if (OAuthInstance.accessToken()) {
                isAnonymousToken = false;
              }

              if (isAnonymous) {
                options.beforeSend = function (xhr) {
                  var accessToken =
                    OAuthInstance.accessToken() ||
                    OAuthInstance.anonymousToken();
                  xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + accessToken
                  );
                };
              } else {
                options.beforeSend = function (xhr) {
                  xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + OAuthInstance.accessToken()
                  );
                };
              }

              var xhr = $.ajax(options);
              return xhr
                .then(
                  Util.ajaxPreSuccess,
                  function (xhr, textStatus, errorThrown) {
                    if (xhr.status == 403) {
                      options.success = success;
                      options.error = error;
                      var tmpRefreshTokenXhr;
                      if (isAnonymousToken) {
                        tmpRefreshTokenXhr = OAuthInstance.refreshAnonymousToken();
                      } else {
                        tmpRefreshTokenXhr = OAuthInstance.refreshToken();
                      }
                      return tmpRefreshTokenXhr.then(
                        function () {
                          return Util.ajax(options, isAnonymous);
                        },
                        function (xhr, textStatus, errorThrown) {
                          Util.ajaxError(xhr, textStatus, errorThrown);
                          error(xhr, textStatus, errorThrown);
                        }
                      );
                    } else {
                      Util.ajaxError(xhr, textStatus, errorThrown);
                      error(xhr, textStatus, errorThrown);
                    }
                  }
                )
                .done(success);
            });
          }
        });
      });
      dtd.resolve();
      return tokenAjax;
    };

    //如果启用oauth2认证，重写ajax
    $.extend(exports, {
      // 按照最新传参标准的默认实现
      ajaxParamsHandlerWithOauth: function (data) {
        if (!data) {
          return undefined;
        } else {
          if (data.params && typeof data.params === "string") {
            return data;
          } else {
            return {
              params: JSON.stringify(data),
            };
          }
        }
      },
      //isAnonymous：是否匿名访问
      ajax: function (options) {
        var apiName;
        for (var key in Config.ajaxUrls) {
          if (Config.ajaxUrls[key] == options.url) apiName = key;
        }

        if (apiName && Config.ajaxInterval && Config.ajaxInterval[apiName]) {
          var inter = _ajaxInter[apiName + "_interTime"];
          inter && clearTimeout(inter);
          var interTime = Config.ajaxInterval[apiName];
          _ajax(options).always(function () {
            _ajaxInter[apiName + "_interTime"] = setTimeout(function () {
              Util.ajax(options);
            }, interTime);
          });
        } else {
          return _ajax(options);
        }
      },
    });
  }
})(jQuery, window.Util);

/**
 * html 相关 Util 方法
 */
(function ($, exports) {
  var M = Mustache;
  M._rendererCache = {};

  // 模板 内部类
  var Template = function (id) {
    this.tpl = Util.getTplStr(id);
    // 预处理，提高后续渲染效率
    M.parse(this.tpl);
  };

  $.extend(Template.prototype, {
    // 设置视图数据
    setView: function (data) {
      this.view = data;
      return this;
    },

    // id 为 container id 或者 dom节点
    renderTo: function (id) {
      var dom = null;
      dom = $.type(id) === "string" ? document.getElementById(id) : id;
      $(dom).html(M.render(this.tpl, this.view));
    },
  });

  var Renderer = function (arg1, arg2) {
    if (typeof arg1 == "string" && typeof arg2 == "object") {
      this.getTplStr(arg1);
      this.createHtml(arg2);
    } else if (typeof arg1 == "object") {
      this.data = arg1;
      this.target = arg2 || "data-render";
    }
  };

  $.extend(Renderer.prototype, {
    getTplStr: function (id) {
      if (!M._rendererCache[id]) {
        var script = document.getElementById(id);

        if (script) {
          M._rendererCache[id] = script.innerHTML;
        } else {
          M._rendererCache[id] = "";

          console.warn(id + "---模版为空，请确认模版id是否正确！");
        }
        M.parse(M._rendererCache[id]);
      }
      this.tpl = M._rendererCache[id];
      return this;
    },

    createHtml: function (data) {
      this.data = data;
      this.html = M.render(this.tpl, data);
      return this;
    },

    trim: function () {
      this.tpl = Util.trimHtml(this.html);
      return this;
    },

    log: function () {
      if (this.html) {
        console.log(this.html);
        return this;
      }

      if (this.tpl) {
        console.log(this.tpl);
        return this;
      }

      return this;
    },

    getStr: function () {
      return this.html;
    },

    // id 为 container id 或者 dom节点
    to: function (id) {
      var dom = $.type(id) === "string" ? document.getElementById(id) : id;
      $(dom).html(this.html);
    },

    container: function (container) {
      var data = this.data,
        target = this.target;
      var $container = $("*[renderer=" + container + "]");

      var forms = ["input", "textarea"],
        srcs = ["img", "iframe"];

      var $itemValue = $("*[" + target + "]", $container),
        $itemClass = $("*[" + target + "class]", $container),
        $itemAttr = $("*[" + target + "attr]", $container);
      $itemValue.each(function () {
        var _this = this,
          key = $(this).attr(target),
          value = data[key],
          tagName = _this.tagName.toLowerCase();

        if (forms.indexOf(tagName) != -1) {
          //表单类型复制
          _this.value = value;
          _this.title = value;
        } else if (srcs.indexOf(tagName) != -1) {
          _this.src = value;
        } else if (tagName == "select") {
          var $options = $(_this).find("option");
          $(_this).attr("value", value);
          $options.each(function () {
            this.selected = this.value == value;
          });
        } else {
          // 数字滚动赋值
          if ($(_this).data("scrollnum")) {
            Util.scrollNumber(_this, value, {
              figure: $(_this).data("scrolllen"),
            });
          }
          // 数字叠加动画
          else if ($(_this).data("animatenumber")) {
            Util.animateNumber(_this, value, {
              useEasing: $(_this).data("useeasing"),
              useGrouping: $(_this).data("usegrouping"),
            });
          } else {
            // 普通赋值
            _this.innerHTML = value;
          }
        }
      });

      $itemClass.each(function () {
        var key = $(this).attr(target + "class"),
          value = data[key];
        $(this).addClass(value);
      });

      $itemAttr.each(function () {
        var attr = $(this).attr(target + "attr"),
          attrSplit = attr.split("|"),
          dataName =
            attrSplit.length > 1 && attrSplit[0] ? attrSplit[0] : "data",
          value =
            attrSplit.length > 1 && data[attrSplit[1]]
              ? data[attrSplit[1]]
              : undefinded;

        $(this).attr(dataName, value);
      });
    },
    getResult: function (key) {
      var result;

      for (var k in data) {
        if (k == key) result = data[key];
      }

      if (!result) console.warn("数据中不存在" + key + "这条数据");

      return result;
    },
  });

  $.extend(exports, {
    // 去除html标签中的换行符和空格
    trimHtml: function (html) {
      return html
        .replace(/(\r\n|\n|\r)/g, "")
        .replace(/[\t ]+\</g, "<")
        .replace(/\>[\t ]+\</g, "><")
        .replace(/\>[\t ]+$/g, ">");
    },

    // 获取script标签中的html模板
    getTplStr: function (id) {
      var script = document.getElementById(id);

      if (script) {
        return Util.trimHtml(script.innerHTML);
      }
      return "";
    },

    // 返回内部模板类，调用方式如下
    // tpl.setView(data).renderTo('container');
    getTplInstance: function (id) {
      return new Template(id);
    },

    renderer: function (arg1, arg2) {
      return new Renderer(arg1, arg2);
    },

    // 对 html 标签属性进行动态求值、并设置
    // scopeId 为容器 id
    // data 为求值数据对象，不设置则为 全局命名空间上的数据
    evalHtmlAttr: function (scopeId, data) {
      var $els = $(document.getElementById(scopeId)).find("[data-eval-attr]");

      if (!data) data = window;

      var $el, attr, evalstr;

      for (var i = 0, len = $els.length; i < len; i++) {
        $el = $els.eq(i);
        attr = $el.data("eval-attr");

        evalstr = $el.attr(attr);

        if (evalstr) {
          $el
            .attr(attr, Mustache.render(evalstr, data))
            .removeAttr("data-eval-attr");
        }
      }
    },
  });
})(jQuery, window.Util);

/**
 * 与本地数据存储相关的 Util 方法
 * 对 cookie、[local|session]Storage 进行了统一封装
 * cookie 操作依赖：https://github.com/js-cookie/js-cookie，已打入核心包
 */
(function ($, exports) {
  // 内部存储类，默认使用 cookie 存储
  var Store = function (type) {
    this.type = type || Util.STORAGE_TYPE.COOKIE;
  };

  // 以下方法参考 web storage 的通用方法
  $.extend(Store.prototype, {
    getItem: function (key) {
      var type = this.type,
        val = "";

      if (type === 1) {
        val = Cookies.get(key) || null;
      } else if (type === 2) {
        val = localStorage.getItem(key);
      } else {
        val = sessionStorage.getItem(key);
      }

      return val;
    },

    getJSON: function (key) {
      var val = this.getItem(key);

      if (!val) return JSON.parse(val);
      return null;
    },

    setItem: function (key, value, options) {
      var type = this.type;

      // 如果是字面对象，自动转为 JSON 字符串存储
      if ($.isPlainObject(value)) {
        value = JSON.stringify(value);
      }

      if (type === 1) {
        if (!options) {
          Cookies.set(key, value);
        } else {
          Cookies.set(key, value, options);
        }
      } else if (type === 2) {
        localStorage.setItem(key, value);
      } else {
        sessionStorage.setItem(key, value);
      }
    },

    removeItem: function (key, options) {
      var type = this.type;

      if (type === 1) {
        if (!options) {
          Cookies.remove(key);
        } else {
          Cookies.remove(key, options);
        }
      } else if (type === 2) {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
    },

    clear: function () {
      var type = this.type;

      if (type === 1) {
        console.info("Cookies do not support clear() method");
      } else if (type === 2) {
        localStorage.clear();
      } else {
        sessionStorage.clear();
      }
    },
  });

  $.extend(exports, {
    getStorage: function (type) {
      return new Store(type);
    },

    // 存储类型
    STORAGE_TYPE: {
      COOKIE: 1,
      LOCAL: 2,
      SESSION: 3,
    },
  });
})(jQuery, Util);

/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
(function (w) {
  "use strict";
  /* exported loadCSS */
  var loadCSS = function (href, before, media) {
    // Arguments explained:
    // `href` [REQUIRED] is the URL for your CSS file.
    // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
    // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
    // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
    var doc = w.document;
    var ss = doc.createElement("link");
    var ref;
    if (before) {
      ref = before;
    } else {
      var refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
      ref = refs[refs.length - 1];
    }

    var sheets = doc.styleSheets;
    ss.rel = "stylesheet";
    ss.href = href;
    // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
    ss.media = "only x";

    // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
    function ready(cb) {
      if (doc.body) {
        return cb();
      }
      setTimeout(function () {
        ready(cb);
      });
    }
    // Inject link
    // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
    // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
    ready(function () {
      ref.parentNode.insertBefore(ss, before ? ref : ref.nextSibling);
    });
    // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
    var onloadcssdefined = function (cb) {
      var resolvedHref = ss.href;
      var i = sheets.length;
      while (i--) {
        if (sheets[i].href === resolvedHref) {
          return cb();
        }
      }
      setTimeout(function () {
        onloadcssdefined(cb);
      });
    };

    function loadCB() {
      if (ss.addEventListener) {
        ss.removeEventListener("load", loadCB);
      }
      ss.media = media || "all";
    }

    // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
    if (ss.addEventListener) {
      ss.addEventListener("load", loadCB);
    }
    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined(loadCB);
    return ss;
  };
  // commonjs
  if (typeof exports !== "undefined") {
    exports.loadCSS = loadCSS;
  } else {
    w.loadCSS = loadCSS;
  }
})(typeof global !== "undefined" ? global : this);

/*! onloadCSS. (onload callback for loadCSS) [c]2017 Filament Group, Inc. MIT License */
/* global navigator */
/* exported onloadCSS */
function onloadCSS(ss, callback) {
  var called;
  function newcb() {
    if (!called && callback) {
      called = true;
      callback.call(ss);
    }
  }
  if (ss.addEventListener) {
    ss.addEventListener("load", newcb);
  }
  if (ss.attachEvent) {
    ss.attachEvent("onload", newcb);
  }

  // This code is for browsers that don’t support onload
  // No support for onload (it'll bind but never fire):
  //	* Android 4.3 (Samsung Galaxy S4, Browserstack)
  //	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
  //	* Android 2.3 (Pantech Burst P9070)

  // Weak inference targets Android < 4.4
  if ("isApplicationInstalled" in navigator && "onloadcssdefined" in ss) {
    ss.onloadcssdefined(newcb);
  }
}

/**
 * 动态加载相关的 Util 方法
 */
(function ($, exports) {
  /**
   * 加载html片段的 Include 内部类
   * containerId 容器id
   * url 代码片段url
   */
  var Include = function (containerId, url) {
    this.url = url;
    this.container = document.getElementById(containerId);
  };

  $.extend(Include.prototype, {
    // success 获取成功后的回调
    fetch: function (success) {
      var self = this;

      return $.ajax({
        url: ResBoot.handleResPath(this.url),
        dataType: "html",
      }).done(function (html) {
        var $html = $(html);
        $(self.container).append($html);
        if (success) {
          success(self.container, $html);
        }
      });
    },
  });

  $.extend(exports, {
    // 加载js资源，引入jQuery.Deferred支持promise
    loadJs: function (url, success) {
      url = url.indexOf(".js") != -1 ? url : url + ".js";
      var d = $.Deferred();

      var script = document.createElement("script");

      script.type = "text/javascript";

      // IE8-
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (
            script.readyState == "loaded" ||
            script.readyState == "complete"
          ) {
            d.resolve();
            script.onreadystatechange = null;
          }
        };
        // w3c
      } else {
        script.onload = function () {
          d.resolve();
          script.onload = null;
        };
      }

      if ($.isFunction(success)) d.done(success);
      script.src = ResBoot.handleResPath(url);
      // append to head
      document.getElementsByTagName("head")[0].appendChild(script);

      return d.promise();
    },

    /**
     * 加载css样式，引入jQuery.Deferred支持promise
     * Util.loadCss(path).done(function() { console.log('done'); });
     */
    loadCss: function (url, beforeId, success) {
      var path = ResBoot.handleResPath(url),
        deferred = $.Deferred();

      if ($.isFunction(beforeId)) {
        success = beforeId;
        beforeId = false;
      }

      var style = loadCSS(
        path,
        beforeId ? document.getElementById(beforeId) : false
      );

      onloadCSS(style, function () {
        deferred.resolve();
      });

      return deferred.promise().done(success);
    },

    // 加载页面模板，并追加到 body 底部
    loadTpl: function (url, success) {
      return $.ajax({
        dataType: "html",
        url: ResBoot.handleResPath(url),
      })
        .done(function (html) {
          $(html).appendTo("body");
        })
        .done(success);
    },

    /**
     * 加载组件资源
     * options.tpl 模板路径 可选
     * options.css css路径 可选
     * options.js js路径 必须
     * success 组件加载完毕回调 可选
     */
    loadWidget: function (options, success) {
      var prefix = "js/widgets/";

      return $.when(
        options.tpl ? Util.loadTpl(prefix + options.tpl) : Util.noop,
        options.css ? Util.loadCss(prefix + options.css) : Util.noop
      ).done(function () {
        return Util.loadJs(prefix + options.js, success);
      });
    },

    // 反馈 Include 对象的实例
    getIncInstance: function (containerId, url) {
      return new Include(containerId, url);
    },
    loadInclude: function (id, path, fn) {
      path = Util.setUrlSuffix(path);
      var $dom = $(document.getElementById(id));
      var inc = $dom.length ? Util.getIncInstance(id, path) : null;
      if (inc) {
        inc.fetch(function (el, $html) {
          fn && fn(el, $html);
        });
      }
    },
  });
})(jQuery, window.Util);

/**
 * 与 url 相关的 Util 方法
 */
(function ($, exports) {
  /**
   * 将多个参数对象按照url参数对象规则合并到一个
   *
   * @param {Object} p1 合并到的参数对象
   * @param {...Object} ...param 其他参数对象
   * @returns {Object} 合并后的参数对象，修改p1生成
   * @example
   * assignUrlParams({a: '1', b: '1'}, {a: '1',b: '1',c: '1'}) => {"a": ["1","1"], "b": ["1","1"],"c": "1" }
   * !!这是一个专用于url上提取参数进行进行合并的情况 参数值为undefined、string 或者已经合并过的 array 不存在其他情况
   */
  function assignUrlParams(p1) {
    $.each([].slice.call(arguments, 1), function (i, param) {
      for (var k in param) {
        if (!Object.prototype.hasOwnProperty.call(param, k)) {
          continue;
        }
        var type = Util.getType(p1[k]);
        if (type == "undefined") {
          p1[k] = param[k];
        } else if (type == "string") {
          p1[k] = [p1[k], param[k]];
        } else if (type == "array") {
          p1[k].push(param[k]);
        }
      }
    });
    return p1;
  }

  /**
   * 将参数对象拼接为 url 参数格式
   *
   * @param {Object} obj 要处理的参数对象
   * @returns {String} 拼完成的字符串
   * @example
   * {a:[1,2,3],b:1}  =>  'a=1&a=2&a=3&b=1'
   * {a:[1,2,3],b:1,c:{name:'c'}}  =>  "a=1&a=2&a=3&b=1&c={"name":"c"}"
   */
  function _joinUrlParams(obj) {
    var arr = [];
    $.each(obj, function (k, v) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        var type = Util.getType(v),
          str = "";
        if (type == "array") {
          // 数组拆分为多个 &
          // 'a=' + [1,2,3].join('&a=')
          // "a=1&a=2&a=3"
          str += k + "=" + v.join("&" + k + "=");
        } else if (type == "string") {
          // 字符串直接拼接
          str += k + "=" + v;
        } else {
          // 其他直接 转字符串
          str += k + "=" + JSON.stringify(v);
        }
        arr.push(str);
      }
    });

    return arr.join("&");
  }

  /**
   * 获取Url的hash
   * @param {String} url url值
   * @returns  {String} hash
   */
  function _getHash(url) {
    var idx = (url || location.href).indexOf("#");
    return idx === -1 ? "" : (url || location.href).substr(idx);
  }

  /**
   * 移除Url的hash
   * @param {String} url url值
   * @returns  {String} 移除hash 后的Url
   */
  function _removeHash(url) {
    var idx = url.indexOf("#");
    return idx === -1 ? url : url.substring(0, idx);
  }

  $.extend(exports, {
    // url 上加密参数的特定名称
    URL_ENCRYPT_PARAM_NAME: "frameUrlSecretParam",
    // url 是否包含加密参数的正则
    _hasUrlEncryptedReg: /[?&]frameUrlSecretParam=/,
    // 请求体中加密的参数的特定名称
    BODY_ENCRYPT_PARAM_NAME: "frameBodySecretParam",

    // 全路径包括，协议、ip等
    // path 从前端工程根目录开始
    getFullPath: function (path) {
      var prefix = window.location.toString().split(Config.basePath)[0];

      return [prefix, Config.basePath, "/", path ? path : ""].join("");
    },
    /**
     * url跳转方法
     *
     * @param {String} url 需要处理并跳转的url地址
     * @param {Object} params url跳转时带有的参数
     */
    gotoUrl: function (url, params, target) {
      location.href = ResBoot.getPath(Util.setUrlSuffix(url, params));
    },
    /**
     * url跳转方法
     *
     * @param {String} url 需要处理并跳转的url地址
     * @param {Object} params url跳转时带有的参数
     */
    replaceUrl: function (url, params) {
      window.location.replace(ResBoot.getPath(Util.setUrlSuffix(url, params)));
    },

    reloadPage: function () {
      window.location.reload(true);
    },

    //width=1680&height=1050=>>{ width:1900, height:1200 }
    parseParam: function (paramstr) {
      var params = {};
      $.each(paramstr.split("&"), function (i, item) {
        // base64 编码情况下 base64尾部可能是有 0~2个 = 的 不能直接split
        var splitIdx = item.indexOf("=");
        var k, v;
        if (splitIdx !== -1) {
          k = item.substr(0, splitIdx);
          v = decodeURIComponent(item.substr(splitIdx + 1));
        } else {
          k = item;
          v = "";
        }
        var type = Util.getType(params[k]);

        if (type == "undefined") {
          params[k] = v;
        } else if (type == "string") {
          params[k] = [params[k], v];
        } else if (type == "array") {
          params[k].push(v);
        }
      });
      return params;
    },

    //删除url的参数
    deleteUrlParams: function (url, keys) {
      if (arguments.length == 1) {
        keys = url;
        url = location.href;
      }
      if (url.indexOf("?") == -1) {
        return url;
      }
      var base = url.split("?")[0];
      if (typeof keys == "string") {
        keys = [keys];
      }
      var params = Util.getUrlParams();
      $.each(keys, function (i, r) {
        if (params[r]) {
          delete params[r];
        }
      });
      var params_str = $.param(params);
      if (params_str.length > 0) {
        base += "?";
      }
      return base + params_str;
    },

    // 更新或追加 url 的查询参数
    // 参考：https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
    updateUrlParam: function (uri, key, value) {
      // remove the hash part before operating on the uri
      var i = uri.indexOf("#");
      var hash = i === -1 ? "" : uri.substr(i);
      uri = i === -1 ? uri : uri.substr(0, i);

      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf("?") !== -1 ? "&" : "?";

      if (!value) {
        // remove key-value pair if value is empty
        uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), "");
        if (uri.slice(-1) === "?") {
          uri = uri.slice(0, -1);
        }
        // replace first occurrence of & by ? if no ? is present
        if (uri.indexOf("?") === -1) uri = uri.replace(/&/, "?");
      } else if (uri.match(re)) {
        uri = uri.replace(re, "$1" + key + "=" + value + "$2");
      } else {
        uri = uri + separator + key + "=" + value;
      }
      return uri + hash;
    },

    /**
     * 获取url上的参数
     * @param {String} prop 要获取的属性名，省略时获取所有参数
     * @returns {String | Object | undefined}  参数值
     */
    getUrlParams: function (prop) {
      var url = location.href,
        key = prop;
      if (arguments.length === 2) {
        url = arguments[0];
        key = arguments[1];
      }
      url = _removeHash(url);
      var idx = url.indexOf("?");
      if (idx === -1) {
        return key ? undefined : {};
      }

      var query = url.substr(idx + 1);

      if (!query.length) {
        return key ? undefined : {};
      }

      var params = Util.parseParam(query);

      var result;

      // 如果url是加密的 尝试需要先解密
      if (params[Util.URL_ENCRYPT_PARAM_NAME]) {
        var decryptStr = Util.decrypt(params[Util.URL_ENCRYPT_PARAM_NAME]);
        // 将加密参数解密 并合并到 普通参数中
        delete params[Util.URL_ENCRYPT_PARAM_NAME];
        result = assignUrlParams(params, Util.parseParam(decryptStr));
      } else {
        result = params;
      }

      return key ? result[key] : result;
    },

    /**
     * 对url上的参数进行加密 返回加密后的url
     * @param {string | undefined} url 要处理的 url 为空时取当前页面url
     * @returns {string} 加密后的url
     */
    encryptUrlParams: function (url) {
      if (!url) {
        url = location.href;
      }
      var hash = _getHash(url);
      url = _removeHash(url);

      var idx = url.indexOf("?");
      // 无参数
      if (idx === -1 || /complexUrlSecretParam/i.test(url)) {
        return url + hash;
      }

      var params = Util.getUrlParams(url, null);

      // 若空参数 未开启加密 则不处理
      if ($.isEmptyObject(params)) {
        return url + hash;
      }

      // 对参数进行加密处理
      var encryptedParams =
        Util.URL_ENCRYPT_PARAM_NAME +
        "=" +
        Util.encrypt(_joinUrlParams(params));

      // 重组url
      var baseUrl = url.substring(0, idx);
      return baseUrl + "?" + encryptedParams + hash;
    },

    /**
     * 解密 url参数 返回
     * @param {string | undefined} url 要处理的 url 为空时取当前页面url
     * @returns  {string} 解密后的url
     */
    decryptUrlParams: function (url) {
      if (!url) {
        url = location.href;
      }
      var hash = _getHash(url);
      url = _removeHash(url);
      // 未加密 直接返回
      if (!Util._hasUrlEncryptedReg.test(url)) {
        return url + hash;
      }
      var params = Util.getUrlParams(url, null);
      return (
        url.substr(0, url.indexOf("?") + 1) + _joinUrlParams(params) + hash
      );
    },

    /**
     * 在url上新增参数 内部会自动处理加密逻辑
     *
     * @param {String} url 要处理的url
     * @param {Object} params 要新增的参数 ，键值对形式
     * @returns {String} 处理完成后的url
     */
    addUrlParams: function (url, params) {
      if ("string" != Util.getType(url)) {
        throw new Error("The first argument [url] must be string!");
      }
      if ("object" != Util.getType(params)) {
        throw new Error("The second argument [params] must be object!");
      }
      var hash = _getHash(url);
      url = _removeHash(url);
      // 获取原有参数
      var originParams = Util.getUrlParams(url) || {},
        isEncrypted = Util._hasUrlEncryptedReg.test(url);

      // 与新参数合并
      originParams = assignUrlParams(originParams, params);

      var paramsStr = "";
      // 如果为加密 则需要重新加密
      if (Config.enableEncodeParam || isEncrypted) {
        var obj = {};
        obj[Util.URL_ENCRYPT_PARAM_NAME] = Util.encrypt(
          _joinUrlParams(originParams)
        );
        paramsStr = _joinUrlParams(obj);
      } else {
        paramsStr = _joinUrlParams(originParams);
      }

      var idx = url.indexOf("?"),
        newBaseUrl = idx !== -1 ? url.substring(0, idx) : url;

      return newBaseUrl + "?" + paramsStr + hash;
    },
    /**
     * 根据Config中的suffix参数来设置url是否需要带有.html后缀名
     *
     * @param {String} url 要处理的url
     * @param {Object} params url参数
     * @returns {String} 处理完成后的url
     */
    setUrlSuffix: function (url, params) {
      if (url == "#") {
        return location.href;
      }
      if (!Config.suffix && url.indexOf(".html") != -1) {
        url = url.replace(/\.html/, "");
      }

      if (Config.suffix && url.indexOf(".html") == -1) {
        url =
          url.indexOf("?") != -1
            ? url.replace(/\?/, ".html?")
            : url.indexOf("#") != -1
            ? url.replace(/\#/, ".html#")
            : url + ".html";
      }

      return params ? Util.addUrlParams(url, params) : url;
    },
  });
})(jQuery, window.Util);

(function ($, exports) {
  $.extend(exports, {
    /**
     * 根据状态值为数据添加状态判断值
     * @param {Array|Object} data 原始数据
     * @param {String} key 状态的字段名
     * @param {Object} options 逻辑规则
     * @returns {Object} 返回处理好的值
     */
    setValueBoolean: function (data, key, options) {
      data = JSON.parse(JSON.stringify(data));
      if ($.isArray(data)) {
        for (var i = 0, len = data.length; i < len; i++) {
          data[i] = arguments.callee(data[i], key, options);
        }
      } else {
        for (var k in options) {
          var d = options[k];
          // data[key] == options[k] && (data[k] = true);

          if ($.isArray(d)) {
            for (var i = 0, len = d.length; i < len; i++) {
              if (data[key] == d[i]) {
                data[k] = true;
                break;
              }
            }
          } else {
            data[key] == options[k] && (data[k] = true);
          }
        }
      }

      return data;
    },
    /**
     * 根据状态为数据添加文字表述
     * @param {Object|Array} data 原始数据
     * @param {String} key 状态的字段名
     * @param {Object} options 逻辑规则
     * @returns {Object} 返回处理好的值
     */
    setValueText: function (data, key, options) {
      data = JSON.parse(JSON.stringify(data));
      if ($.isArray(data)) {
        for (var i = 0, len = data.length; i < len; i++) {
          data[i] = arguments.callee(data[i], key, options);
        }
      } else {
        for (var k in options) {
          var ks = k.split("-"),
            kl = ks.length;

          for (var i = 0; i < kl; i++) {
            if (data[key] == ks[i]) {
              data[key + "Text"] = options[k];
              break;
            }
          }
        }
      }

      return data;
    },
    /**
     * 获取数组中指定属性的最大值
     * @param {Array} arr 数组
     * @param {String} key 指定属性
     * @returns {Number} 最大数值
     * @example [{key:166},{key:200},{key:33}]=>getMax(arr,'key);=>200
     */
    getMax: function (arr, key) {
      var max = 0,
        len = arr.length;
      for (var i = 0; i < len; i++) {
        var item = arr[i][key];
        if (max < item) max = item;
      }
      return max;
    },
    /**
     * 获取数组中指定属性的最小值
     * @param {Array} arr 数组
     * @param {String} key 指定属性
     * @returns {Number} 最小值
     * @example [{key:166},{key:200},{key:33}]=>getMax(arr,'key);=>33
     */
    getMin: function (arr, key) {
      if (arr.length === 0) return;
      var min = arr[0][key],
        len = arr.length;
      for (var i = 1; i < len; i++) {
        var item = arr[i][key];
        if (min > item) min = item;
      }
      return min;
    },
    /**
     * 获取数组指定属性的和
     * @param {Array} arr 数组
     * @param {String} key 指定属性
     * @returns {Number} 和
     * @example [{key:166},{key:200},{key:33}]=>getSum(arr,'key);=>399
     */
    getSum: function (arr, key) {
      var sum = 0,
        len = arr.length;
      for (var i = 0; i < len; i++) {
        sum += arr[i][key];
      }
      return sum;
    },
    /**
     * 获取百分比
     * @param {Number} sum 总数
     * @param {Number} value 当前数据
     * @param {Number} fixed 精确到小数点位数，可不传，默认为0
     * @param {String} unit 配置单位，可不传，默认%
     * @returns {String} 返回字符串
     */
    getPercent: function (sum, value, fixed, unit) {
      var _fixed = fixed || 0;
      var percent = ((value / sum) * 100).toFixed(_fixed) + (unit || "%");
      return percent;
    },
    /**
     * 获取数组中指定属性的数组
     * @param {Array} arr 源数组
     * @param {String} key 指定属性
     * @returns {Array} 目标数组
     * @example [{key:166},{key:200},{key:33}]=>getValArr(arr,'key);=>[166,200,33]
     */
    getValArr: function (arr, key) {
      var val = [],
        len = arr.length;
      for (var i = 0; i < len; i++) {
        val.push(arr[i][key]);
      }
      return val;
    },
    /**
     *将字符串按照固定的字数截取
     * @param {String} str 需要处理的字符串
     * @param {Number} num 截断间隔
     * @param {String} split 需要插入的字符，不传默认换行符 '\n'
     * @returns {String} 处理后字符串
     */
    splitStr: function (str, num, split) {
      var splitStr = split || "\n",
        reg = new RegExp("(\\S{" + num + "})", "g"),
        reg2 = new RegExp("(\\" + splitStr + ")$"),
        fmtStr = str.replace(reg, "$1" + splitStr);
      return fmtStr.replace(reg2, "");
    },
    /**
     * 数组分组，用于多页面渲染
     * @param {Array} arr 需要处理的数组
     * @param {Number} num 每组元素的数量
     * @returns {Array} 分割后数组
     */
    splitArr: function (arr, num) {
      var resultArr = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        var page = Math.floor(i / num);
        if (!resultArr[page]) {
          resultArr[page] = [];
        }
        resultArr[page].push(arr[i]);
      }
      return resultArr;
    },
    /**
     * 根据value查找key
     * @param {Object} object 需要查找的对象
     * @param {Function} predicate 查询条件
     * @returns {String} key
     */
    findKey: function (object, predicate) {
      var result;

      // eslint-disable-next-line no-eq-null
      if (object == null) {
        return result;
      }

      Object.keys(object).some(function (key) {
        var value = object[key];

        if (predicate(value, key, object)) {
          result = key;
          return true;
        }
      });
      return result;
    },
    /**
     * 数字千分位转换
     * @param {Number} n 转换数字
     * @returns {String} 分割后的数字
     */
    addCommas: function (n) {
      if (isNaN(n)) {
        return "-";
      }
      n = (n + "").split(".");
      return (
        n[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") +
        (n.length > 1 ? "." + n[1] : "")
      );
    },
    /**
     * 生成随机数
     * @param {Number} m 最小值
     * @param {Number} n 最大值
     * @returns {Number} 随机数
     */
    randNum: function (m, n) {
      if (!n) {
        return Math.floor(Math.random() * m);
      }
      var c = n - m + 1;
      return Math.floor(Math.random() * c + m);
    },
    /**
     * Mock接口
     * @param {String} url 接口地址
     * @param {Object|Function} mockdata 数据模板或者响应数据
     * @see {@link http://mockjs.com/}
     * @returns {any} Mock
     */
    mock: function (url, mockdata) {
      if (!url)
        console.warn(
          "模拟数据url中存在未定义url地址，请检查对应模拟数据，以防出错"
        );

      var apiName;
      for (var key in Config.ajaxUrls) {
        if (Config.ajaxUrls[key] == url) apiName = key;
      }

      if (
        Config.closeMockUrls &&
        Config.closeMockUrls.indexOf(apiName) !== -1
      ) {
        console.warn(
          apiName + "---该条模拟数据已被配置关闭，请使用正式接口进行对接！"
        );
        return false;
      }

      Mock && Mock.mock(url, mockdata);
    },
    /**
     * 获取Mock参数
     * @param {any} options mock函数回调
     * @returns {Object} 返回参数对象
     */
    getMockParam: function (options) {
      var params = Util.getUrlParams(
        decodeURIComponent("?" + options.body),
        "params"
      );
      return JSON.parse(params);
    },
  });
})(jQuery, window.Util);

(function ($, exports) {
  $.extend(exports, {
    echartStore: [],
    /**
     * 初始化ECharts图表对象
     * @param {String} selectors 图表dom元素选择器
     * @returns {Object|Array<Object>} 图表实例
     */
    echartsInit: function (selectors) {
      var self = this;
      var elements = document.querySelectorAll(selectors);
      if (elements.length === 0) {
        console.warn("echarts没有找到" + selectors + "容器");
        return false;
      }
      var echartsInstances = [];
      for (var i = 0, len = elements.length; i < len; i++) {
        var element = elements[i];
        var echartsObj = echarts.init(element);
        echartsInstances.push(echartsObj);
        self.echartStore.push(echartsObj);
      }
      return echartsInstances.length === 1
        ? echartsInstances[0]
        : echartsInstances;
    },
    /**
     * 图表自动切换展示tooltip
     * @param {Object} chartInstance 图表实例
     * @param {Number} length 图表数据量
     * @param {Number} interval 切换间隔，单位ms
     */
    showTooltip: function (chartInstance, length, interval) {
      chartInstance.dataLength = length;
      chartInstance.currentIndex = 0;
      clearInterval(chartInstance.timer);
      chartInstance.interval = interval || 3000;
      chartInstance.timer = setInterval(function () {
        if (chartInstance.currentIndex === chartInstance.dataLength) {
          chartInstance.currentIndex = 0;
        }
        chartInstance.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: chartInstance.currentIndex,
        });
        chartInstance.currentIndex++;
      }, chartInstance.interval);
    },
    /**
     * 鼠标悬浮到图表，停止showTooltip
     * @param {Object} chartInstance 图表实例
     * @param {Number} length 图表数据量
     */
    chartHover: function (chartInstance, length) {
      chartInstance.on("mouseover", function () {
        clearInterval(chartInstance.timer);
      });
      chartInstance.on("mouseout", function () {
        Util.showTooltip(chartInstance, length, chartInstance.interval || 3000);
      });
    },
    /**
     * 定时切换地图高亮
     * @param {Object}chartInstance 图表实例
     * @param {Number} length 数据长度
     */
    areaHight: function (chartInstance, length) {
      chartInstance.dataLen = length;
      chartInstance.curData = 0;
      clearInterval(chartInstance.hightTimer);
      chartInstance.hightTimer = setInterval(function () {
        if (chartInstance.curData === chartInstance.dataLen) {
          chartInstance.curData = 0;
        }
        // 取消高亮
        chartInstance.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
        });
        // 高亮地图区域
        chartInstance.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: chartInstance.curData,
        });
        // 显示悬浮窗
        chartInstance.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: chartInstance.curData,
        });
        chartInstance.curData++;
      }, 3000);
    },
    /**
     * 地图图表专用：鼠标悬浮到地图，停止showTooltip
     * @param {Object} chartInstance 图表实例
     * @param {Number} length 图表数据量
     */
    mapChartHover: function (chartInstance, length) {
      chartInstance.on("mouseover", function () {
        clearInterval(chartInstance.hightTimer);
      });
      chartInstance.on("mouseout", function () {
        Util.areaHight(chartInstance, length, chartInstance.interval || 3000);
      });
    },
    /**
     * echarts渐变色,适用双色渐变，可根据实际需求改写,方向参数可不传，默认水平方向渐变
     * @param {String} color1 0% 处的颜色
     * @param {String} color2 100% 处的颜色
     * @param {Number} x1 渐变色方向起点的x坐标
     * @param {Number} y1 渐变色方向起点的y坐标
     * @param {Number} x2 渐变色方向终点的x坐标
     * @param {Number} y2 渐变色方向终点的y坐标
     * @returns {echarts.graphic.LinearGradient} echarts渐变对象
     */
    linearColor: function (color1, color2, x1, y1, x2, y2) {
      return new echarts.graphic.LinearGradient(
        typeof x1 === "number" && x1 <= 1 ? x1 : 1,
        typeof y1 === "number" && y1 <= 1 ? y1 : 0,
        typeof x2 === "number" && x2 <= 1 ? x2 : 0,
        typeof y2 === "number" && y2 <= 1 ? y2 : 0,
        [
          {
            offset: 0,
            color: color1,
          },
          {
            offset: 1,
            color: color2,
          },
        ]
      );
    },
  });
})(jQuery, window.Util);

(function ($, exports) {
  /**
   * 为了防止代码中未移除的console在IE8\9下可能报错的问题，对没有console的情况进行了处理
   */
  if (!window.console) {
    window.console = {
      log: function () {},
      dir: function () {},
      dirxml: function () {},
      info: function () {},
      warn: function () {
        // var str = '【警告】\n原警告参数依次为：\n';
        // for (var i = 0, l = arguments.length; i < l; ++i) {
        //     str += String(arguments[i]) + '\n';
        // }
        // window.alert(arguments.length ? str : '【警告】');
      },
      error: function () {
        // var str = '【错误】\n原错误参数依次为：\n';
        // for (var i = 0, l = arguments.length; i < l; ++i) {
        //     str += String(arguments[i]) +'\n';
        // }
        // window.alert(arguments.length ? str : '【错误】');
      },
    };
  }

  // 绑定事件
  function on(el, type, fn) {
    if (el.addEventListener) {
      el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent("on" + type, fn);
    }
  }
  // 对象合并
  function assign() {
    var target = arguments[0];
    var i = 1,
      len = arguments.length,
      key = "",
      obj = null,
      hasOwnProperty = Object.prototype.hasOwnProperty;

    for (; i < len; i++) {
      obj = arguments[i];
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          target[key] = obj[key];
        }
      }
    }

    return target;
  }
  // 类型判断
  var class2type = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regexp",
    "[object Object]": "object",
    "[object Error]": "error",
    "[object Symbol]": "symbol",
  };
  function getType(obj) {
    if (obj == null) {
      return obj + "";
    }

    var str = Object.prototype.toString.call(obj);
    return typeof obj === "object" || typeof obj === "function"
      ? class2type[str] || "object"
      : typeof obj;
  }

  // 一天的毫秒数目
  var DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

  // 统一的cookie配置
  var DEFAULT_COOKIE_OPTIONS = {
    // 过期时间 单位天
    // expires: 30,
    // path: '/',
    // domain: '',
    // secure: false
  };
  // 设置cookie的默认配置
  var setCookieDefaultOption = function (opt) {
    for (var k in opt) {
      if (Object.prototype.hasOwnProperty.call(opt, k)) {
        DEFAULT_COOKIE_OPTIONS[k] = opt[k];
      }
    }
  };

  /**
   * 写入cookie
   *
   * @param {string} key cookie 名称
   * @param {string} value cookie 值
   * @param {object | undefined} options 当前cookie的配置 { expires,path,domain,secure }
   * @returns {string} 写入的cookie
   */
  var writeCookie = function (key, value, options) {
    if (!options || getType(options) != "object") {
      options = assign({}, DEFAULT_COOKIE_OPTIONS, options || {});
    }

    // 过期时间
    if (getType(options.expires) == "number") {
      var d = options.expires;
      options.expires = new Date();
      options.expires.setMilliseconds(
        options.expires.getMilliseconds() + d * DAY_MILLISECONDS
      );
    }
    return (document.cookie = [
      encodeURIComponent(key),
      "=",
      value,
      options.expires ? "; expires=" + options.expires.toUTCString() : "",
      options.path ? "; path=" + options.path : "",
      options.domain ? "; domain=" + options.domain : "",
      options.secure ? "; secure" : "",
    ].join(""));
  };

  /**
   * 读取cookie
   *
   * @param {string} key cookie 名称
   * @returns 读取到的cookie值
   */
  var readCookie = function (key) {
    var result = key ? undefined : {},
      cookies = document.cookie ? document.cookie.split("; ") : [],
      i = 0,
      l = cookies.length;
    for (; i < l; i++) {
      var parts = cookies[i].split("="),
        name = decodeURIComponent(parts.shift()),
        v = parts.join("=");

      if (key === name) {
        result = v;
        break;
      }

      if (!key && v !== undefined) {
        result[name] = v;
      }
    }
    return result;
  };

  /**
   * 移除一个cookie
   *
   * @param {string} key cookie名称
   * @param {object} options cookie配置
   * @returns
   */
  var removeCookie = function (key, options) {
    options = options || {};
    options.expires = -1;
    writeCookie(key, "", options);
    return !readCookie(key);
  };

  /**
   * 安全Location对象的封装 IE9+ 可保障表现和location一样 IE8赋值需使用对应set方法
   */
  function SafeLocation() {
    var that = this;
    // this.protocol = location.protocol;
    // this.host = location.host;
    // this.hostname = location.hostname;
    // this.port = location.port;
    // this.pathname = location.pathname;
    // this.search = location.search;
    // this.username = location.username;
    // this.password = location.password;
    this.origin = location.origin;

    this._writeProps = [
      "protocol",
      "host",
      "hostname",
      "port",
      "pathname",
      "search",
      "username",
      "password",
    ];
    this._isSupportDescriptor = !!Object.defineProperties;

    // 需要额外处理的 这两个属性会随时变化 需要不同的时候来获取
    // hash href
    var hash;
    if (this._isSupportDescriptor) {
      Object.defineProperties(this, {
        protocol: {
          get: function () {
            return location.protocol;
          },
          set: function (v) {
            location.protocol = v;
          },
        },
        host: {
          get: function () {
            return location.host;
          },
          set: function (v) {
            location.host = v;
          },
        },
        hostname: {
          get: function () {
            return location.hostname;
          },
          set: function (v) {
            location.hostname = v;
          },
        },
        port: {
          get: function () {
            return location.port;
          },
          set: function (v) {
            location.port = v;
          },
        },
        pathname: {
          get: function () {
            return location.pathname;
          },
          set: function (v) {
            location.pathname = v;
          },
        },
        search: {
          get: function () {
            return location.search;
          },
          set: function (v) {
            location.search = v;
          },
        },
        username: {
          get: function () {
            return location.username;
          },
          set: function (v) {
            location.username = v;
          },
        },
        password: {
          get: function () {
            return location.password;
          },
          set: function (v) {
            location.password = v;
          },
        },
        href: {
          get: function () {
            return location.href;
          },
          set: function (v) {
            // TODO 安全过滤
            location.href = v;
          },
        },
        hash: {
          get: function () {
            hash = location.hash;
            return hash;
          },
          set: function (v) {
            if ((v || "")[0] != "#") {
              v = "#" + v;
            }
            // TODO 安全过滤
            hash = location.hash = v;
          },
        },
      });
    } else {
      // 监听变化事件进行更新
      on(window, "hashchange", function () {
        that.href = location.href;
        that.hash = location.hash;
      });
    }

    var props = this._writeProps.concat(["href", "hash"]);
    for (var i = 0, len = props.length; i < len; i++) {
      // 属性
      var p = props[i];
      // 对应方法
      var fnName = p[0].toUpperCase() + p.substr(1);
      (function (p, fnName) {
        // 支持描述符 则直接赋值
        if (that._isSupportDescriptor) {
          that["set" + fnName] = function (v) {
            that[p] = v;
          };
        } else {
          that[p] = location[p];
          // 否则需要方法处理
          that["set" + fnName] = function (v) {
            that[p] = location[p] = v;
          };
        }

        that["get" + fnName] = function () {
          return that[p];
        };
      })(p, fnName);
    }

    // IE8 下检测 直接赋值的更新
    if (!this._isSupportDescriptor) {
      setInterval(function () {
        for (var i = 0, l = props.length; i < l; i++) {
          var p = props[i];
          if (that[p] != location[p]) {
            location[p] = that[p];
          }
        }
      }, 50);
    }
  }

  SafeLocation.prototype.replace = function (url) {
    // TODO 安全过滤
    location.replace(url);
  };

  SafeLocation.prototype.reload = function () {
    location.reload();
  };
  SafeLocation.prototype.assign = function (url) {
    // TODO 安全过滤
    location.assign(url);
  };
  SafeLocation.prototype.toString = function () {
    return this.href;
  };

  /**
   * html 转义
   *
   * @param {string} html 要处理的字符串
   * @returns 经过html转义的字符串
   */
  function htmlEscape(html) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(html));
    var s = div.innerHTML;
    div = null;
    return s;
  }
  /**
   * html 还原转义
   */
  function htmlUnescape(str) {
    // var div = document.createElement('div');
    // div.innerHTML = str;
    // var t = div.innerText;
    // div = null;
    // return t;
    if (typeof str !== "string") return str;
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "'");
    s = s.replace(/&quot;/g, '"');
    //s = s.replace(/<br>/g, "\n");
    return s;
  }

  /**
   * html XSS过滤
   * TODO: html XSS 注入的可能情况
   * 1、 script标签
   * 2、 style 样式中 url 发请求
   * 3、 资源型标签 src 触发
   * 4、 html行内事件，如onclick onmouseover等
   * @param {string} html 要处理的字符串
   * @returns 经过安全过滤html字符串
   */
  function getSafeHtml(html) {
    if (!html) return;
    // TODO
    // script 处理
    // html = html.replace(/<script(.*?)>/gi, '&lt;script$1&gt;').replace(/<\/script>/gi, '&lt;/script&gt;');
    html = html
      .replace(/<script(.*?)>/gi, "<noscript$1>")
      .replace(/<\/script>/gi, "</noscript>");

    // createDocumentFragment 存在注入可能 $.parseHTML 存在相同问题
    // 测试代码：SafeUtil.getSafeHtml(`<div class="qm-item" id="qm-48ecf37e-b134-401c-b757-15dcd7bc0416" data-id="48ecf37e-b134-401c-b757-15dcd7bc0416" title="CBM" data-url="https://oa.epoint.com.cn/EpointCBM/login.aspx" data-hassub="" data-opentype="blank" style="width:20%"><div class="qm-item-inner" style="background:#5d73e0;"><span class="qm-item-icon modicon-77"></span><span class="qm-item-name ">CBM</span><img src="abc.png" onerror="alert(1)"/></div></div>`)
    // var doc = document.createDocumentFragment();
    // var wrap = document.createElement('div');
    // wrap.innerHTML = html;
    // doc.appendChild(wrap);

    // var parser = new DOMParser();
    // var wrap = parser.parseFromString(html, 'text/html');

    // var nodes = wrap.childNodes;
    // if (nodes.length) {
    //     filterNode(nodes);
    // }

    // function filterNode(nodeList) {
    //     for (var i = 0; i < nodeList.length; i++) {
    //         var node = nodeList[i];
    //         var type = node.nodeType;
    //         // 文本和注释
    //         if (type === 3 || type === 8) {
    //             continue;
    //         }
    //         if (node.getAttribute('src')) {
    //             console.warn('匹配到src', node);
    //             // todo
    //         }
    //         if (node.getAttribute('style')) {
    //             console.warn('匹配到style', node);
    //             // todo
    //         }
    //         if (node.childNodes && node.childNodes.length) {
    //             filterNode(node.childNodes);
    //         }
    //     }
    // }

    return html;
  }

  /**
   * 安全 eval
   * TODO: eval 本身就是风险非常大的，
   * 目前暂无内部过滤方案暂时统一使用，以便后期修改
   * @param {string} code
   * @returns eval 结果
   */
  function safeEval(code) {
    // TODO 暂时以关键字过滤处理 不过存在误伤可能性
    // function
    // => 箭头函数
    // delete
    if (/function/.test(code)) {
      console.warn("eval [function] 关键字");
    }
    // if (/=>/.test(code)) {
    //     console.warn('eval 潜在箭头函数');
    // }
    // if (/delete/.test(code)) {
    //     console.warn('eval [delete] 关键字');
    // }

    return eval(code);
  }

  var SafeUtil = {
    writeCookie: writeCookie,
    readCookie: readCookie,
    removeCookie: removeCookie,
    setCookieDefaultOption: setCookieDefaultOption,
    location: new SafeLocation(),
    htmlEscape: htmlEscape,
    htmlUnescape: htmlUnescape,
    getSafeHtml: getSafeHtml,
    safeEval: safeEval,
  };
  SafeUtil.getSafeLocation = function () {
    return SafeUtil.location;
  };
  // window.SafeUtil = SafeUtil;
  if (!exports) {
    exports = {};
  }

  assign(exports, SafeUtil);
})(jQuery, window.Util);

/**
 * 对常用的插件进行封装处理
 */
(function ($, exports) {
  $.extend(exports, {
    /**
     * 渲染页面时间
     * @param {String} template 模板
     * @param {String|Element} container 容器
     */
    clock: function (template, container) {
      var week = {
        0: "\u65e5",
        1: "\u4e00",
        2: "\u4e8c",
        3: "\u4e09",
        4: "\u56db",
        5: "\u4e94",
        6: "\u516d",
      };
      function getNow() {
        var date = new Date();
        var o = {
          "y+": date.getFullYear(),
          "M+": date.getMonth() + 1, //月份
          "d+": date.getDate(), //日
          "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
          "H+": date.getHours(), //小时
          "m+": date.getMinutes(), //分
          "s+": date.getSeconds(), //秒
          "w+": date.getDay(), //星期
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        };
        return o;
      }
      var $dom = $(container);
      (function () {
        var arg = arguments,
          now = getNow();
        var fmt = template;
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            "{{" + RegExp.$1 + "}}",
            (now["y+"] + "").substr(4 - RegExp.$1.length)
          );
        }
        if (/(E+)/.test(fmt)) {
          fmt = fmt.replace(
            "{{" + RegExp.$1 + "}}",
            (RegExp.$1.length > 1
              ? RegExp.$1.length > 2
                ? "\u661f\u671f"
                : "\u5468"
              : "") + week[now["w+"] + ""]
          );
        }
        for (var k in now) {
          if (new RegExp("({{" + k + "}})").test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.replace("{{", "").replace("}}", "").length == 1
                ? now[k]
                : ("00" + now[k]).substr(("" + now[k]).length)
            );
          }
        }
        $dom.html(fmt);
        setTimeout(function () {
          arg.callee();
        }, 1000);
      })();
    },
    /**
     * 加载滚动数字
     * @param {String|Element} id 容器id
     * @param {Number} value 数值
     * @param {Object} options 配置选项,可选 {value:100,figure:5,delay:1500}
     */
    scrollNumber: function (id, value, options) {
      var $dom = $(id);
      value = value || 0;
      options = $.extend(
        {
          value: value,
          figure: value.toString().length,
          supportrem: Config.supportrem,
          rem2px: Config.rem2px,
        },
        options
      );
      if ($.fn.scrollNumber) {
        if (!$dom.data("scrollnumberinit")) {
          $dom.data("scrollnumberinit", 1);
          options.number = value;
          $dom.scrollNumber(options);
        } else {
          $dom.scrollNumber("refresh", value);
        }
      } else {
        console.warn("请引入jquery.scrollnumber.js");
      }
    },
    /**
     * 动态载入、更新数字，需要引入插件countUp.js
     * @param {String} id 元素ID
     * @param {Number} value 数据
     * @param {Object} options 插件自定义配置，可不传
     */
    animateNumber: function (id, value, options) {
      var $dom = $(id);

      if ($dom.length) {
        if (!isNaN(value)) {
          if (window.CountUp) {
            var dotIdx = String(value).indexOf("."), //获取小数点的位置
              decimal = 0; // 默认整数
            if (dotIdx > -1) {
              decimal = String(value).length - dotIdx - 1; //获取小数点后的个数
            }

            var settings = $.extend(
              {},
              {
                //定义是否开启缓动
                useEasing: true,
                //是否开启分组
                useGrouping: false,
                decimalPlaces: decimal,
              },
              options || {}
            );

            $dom.each(function () {
              if (!$(this).data("countup")) {
                var num = new CountUp(this, value, settings);
                if (!num.error) {
                  //开启滚动
                  num.start();
                } else {
                  // eslint-disable-next-line no-console
                  console.log(num.error);
                }
                $(this).data("countup", num);
              } else {
                $(this).data("countup").update(value);
              }
            });
          } else {
            $dom.text(value);
            console.warn("请引入countUp.min.js");
          }
        } else {
          $dom.text(value);
        }
      }
    },

    /**
     * 滚动列表
     * @param {JQuery<Element>} $elem 列表的JQuery对象
     * @param {String} htmlContent	列表内容
     */
    scrollList: function ($elem, htmlContent) {
      if (htmlContent) {
        $elem.empty().html(htmlContent);
      }
      if (!$elem.isScroll) {
        $elem.isScroll = true;
        $elem.parent().scrollbox();
      }
    },
    /**
     * 高亮元素
     * @param {String|JQuery<Element>} $element 元素jq对象或者选择器
     * @param {String} selector	代理选择器
     * @param {String} event 触发事件
     * @param {Function} callback 回调
     */
    activeElement: function ($element, selector, event, callback) {
      var args_l = arguments.length;
      if (typeof $element === "string") {
        $element = $($element);
      }
      if (args_l === 2) {
        if ($element.hasClass("active")) {
          return $element;
        }
        $element.addClass("active").siblings().removeClass("active");
        selector && selector($element);
        return $element;
      } else if (args_l === 3) {
        if (["click", "dblclick", "mouseover"].indexOf(selector) > -1) {
          $element.on(selector, function () {
            $element.addClass("active").siblings().removeClass("active");
            event && event($element);
          });
        } else {
          Util.activeElement($element, selector, "click", event);
        }
        return $element;
      } else if (args_l === 4) {
        $element.on(event, selector, function (e) {
          var $this = $(this);
          $this.addClass("active").siblings().removeClass("active");
          callback && callback($this);
        });
        return $element;
      }
    },
    /**
     * 获取鼠标点击位置相对容器的点位坐标
     * @param {Object} $container 容器jq对象
     * @param {Boolean} iscss 是否转换为css
     */
    getPosition: function ($container, iscss) {
      $container.on("click", function (e) {
        var pos = this.getBoundingClientRect(),
          psdStr =
            "[" +
            (e.pageX - pos.x - window.scrollX) +
            "," +
            (e.pageY - pos.y - window.scrollY) +
            "]";
        if (iscss) {
          psdStr =
            "left: " +
            (e.pageX - pos.x - window.scrollX) +
            "px;top: " +
            (e.pageY - pos.y - window.scrollY) +
            "px;";
        }
        console.log(psdStr);
        var target = document.createElement("div");
        target.id = "tempTarget";
        target.style.opacity = "0";
        target.style.position = "absolute";
        target.innerText = psdStr;
        var range = document.createRange();
        var target2 = document.body.appendChild(target);
        try {
          range = document.createRange();
          range.selectNode(target);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand("copy");
          window.getSelection().removeAllRanges();
        } catch (error) {
          console.error(error);
        }
        target.remove();
        target2.remove();
      });
    },
  });
})(jQuery, window.Util);

/**
 * 框架层面的通用处理，不与业务逻辑耦合
 */
(function ($, exports) {
  $.extend(exports, {
    runCommon: function () {
      // 用于业务扩展 Util，防止与原有的方法产生命名冲突
      Util.biz = {};

      // fix console error in ie8, stupid ie8
      window.console =
        window.console ||
        (function () {
          var c = {};
          c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {};
          return c;
        })();

      //将公共接口地址合并到ajaxUrls中
      $.extend(Config.ajaxUrls, Config.publicAjaxUrls);

      // 给地址加上 rest 前缀,这样处理可以不用在配置realUrl，但是要确保页面部署和接口部署在一起
      if (!Config.isLocalMock && Config.isSameDomain) {
        var root = window.location.pathname.split("/")[1];
        Config.realUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          "/" +
          root +
          "/rest/";
        // 给地址加上 url 前缀
        $.each(Config.ajaxUrls, function (key, val) {
          Config.ajaxUrls[key] =
            Config.realUrl +
            val +
            (val.indexOf("?") !== -1
              ? "&isCommondto=true"
              : "?isCommondto=true");
        });
      }

      // 如果启用了加密  直接重新win.open方法 对传入url进行预处理
      window.originOpen = window.open;
      if (Config.enableEncodeParam) {
        window.open = function (url) {
          url = Util.encryptUrlParams(url);
          var extArgs = [].slice.call(arguments, 1);
          return window.originOpen.apply(window, [url].concat(extArgs));
        };
      }

      // 浏览器提示
      var ie = Util.toInt(Config.browserSupport.ie);
      if (ie === 8 || ie === 9) {
        Util.loadJs("js/widgets/browsertips.js");
      }

      // IE8,9 placeholder 支持
      if (!("placeholder" in document.createElement("input"))) {
        Util.loadJs("js/widgets/jquery.placeholder.min.js", function () {
          $(function () {
            $("input").placeholder();
          });
        });
      }

      //是否加载niceScroll
      if (Config.niceScroll.show) {
        Util.loadJs(
          "js/widgets/jquery.nicescroll/jquery.nicescroll.min.js",
          function () {
            $(function () {
              $("body").niceScroll();
            });
          }
        );
      }

      //阻止所有带有 href 属性的标签默认跳转 并使用 gotoUrl 方式进行页面跳转
      $("body").on("click", "a[href]", function () {
        var href = $(this).attr("href");

        if (
          href &&
          href.indexOf("javascript:") == -1 &&
          href.indexOf("#") !== 0
        ) {
          var target = $(this).attr("target");
          target = target ? target.toLowerCase() : "_self";
          if (target.indexOf("_") == -1) target = "_" + target;
          // 全路径
          var isFullPath = /^(http|https|ftp)/g.test(href);
          if (!isFullPath) href = Util.setUrlSuffix(href);
          window.open(href, target);
          return false;
        }
      });
    },
  });
})(jQuery, window.Util);
