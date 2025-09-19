/**
 * 框架个性化js(手风琴) 控件第一层div类名请使用custom-accordions,其余与框架手风琴类名完全一致
 *   公共方法扩展在Util.cusAccordion上，成员方法用法，名称与框架手风琴一致
 * 组件直接父元素需要保证宽高  并且overflow：auto
 * 选项头有另外标题需添加<ul clas="ct-title clearfix"><li class="ct-item">...</li></ul>,采用api添加的时候需要传数组[{subtitle:''},{subtitle:''}...]
 */

(function (win, $) {
  var $cusAccsWrap = $(".custom-accordions"),
    $accordions = $cusAccsWrap.parent(),
    scrollTop = $cusAccsWrap.length ? $accordions.offset().top : 0;

  win.scrollTop = scrollTop;

  var resizeTimer;


  if (!$cusAccsWrap.length) return;

  var getOrder = function (order) {
    if (order < 10) {
      order = "0" + order;
    }
    return order;
  };

  var getAccHdHtml = function (order, title) {
    var html = [];

    html.push('<i class="fui-acc-toggle"></i>');
    html.push(
      '<h4 class="fui-acc-title clearfix"><span class="fui-acc-order">' +
      getOrder(order) +
      '</span><span class="fui-acc-innerTitle">' +
      title +
      "</span></h4>"
    );

    return html.join("");
  };

  // 解析手风琴html结构
  var parse = function () {
    var $accs = $cusAccsWrap.find('[role="accordion"]');
    var hdWidth;

    $.each($accs, function (i, acc) {
      var $acc = $(acc),
        $hd = $acc.find('[role="head"]'),
        $bd = $acc.find('[role="body"]');

      var opened = $acc.attr("opened") !== "false",
        title = $hd.attr("title");

      $acc.addClass("fui-accordion");
      $hd.addClass("fui-acc-hd");
      $bd.addClass("fui-acc-bd");

      opened ? $acc.addClass("opened") : $acc.addClass("closed");

      var $subItem = $hd.find(".ct-item"),
        len = $subItem.length;
      if (len >= 1) {
        var width = (100 / len).toFixed(2) + '%';
        $.each($subItem, function (i, item) {
          $(item).width(width);
        });
      }


      // 填充head默认内容
      $(getAccHdHtml(i + 1, title)).prependTo($hd);
      hdWidth = $hd.width();

    });
    $accs.find('[role="head"]').width(hdWidth);

  };




  // 给 $hd设置宽度
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var $parent = $cusAccsWrap.find('[role="accordion"]'),
        $hd = $parent.find('[role="head"]');
      $.each($hd, function (i, item) {
        $(item).width($parent.width());
      });
    }, 50);
  });

  // 点击交互
  $cusAccsWrap.on("click", ".fui-acc-toggle", function () {
    var $el = $(this),
      $acc = $el.closest(".fui-accordion"),
      opened = $acc.hasClass("opened"),
      ontoggle = $acc.attr("ontoggle");

    $acc.toggleClass("closed", opened).toggleClass("opened", !opened);

    //   如果在标题定位之后发生折叠，需要将这个accordion定位到顶部（可见）
    if ($acc.hasClass("fixed")) {
      var top = parseInt($cusAccsWrap.css("margin-top")),
        $prev = $acc.prevAll();
      if ($prev.length > 0) {
        // top -= $cusAccsWrap.offset().top;
        var marTop = parseInt(
          $(".fui-accordion")
          .eq(1)
          .css("margin-top")
        );
        $.each($prev, function (i, item) {
          top += $(item).height() + marTop;
        });
      }

      // console.log($cusAccsWrap.offset().top - top);
      $accordions.animate({
          scrollTop: top
        },
        50
      );
    }

    if (ontoggle && win[ontoggle]) {
      win[ontoggle](opened ? "closed" : "opened");
    }

  });

  // 滚动到顶部需要将标题定住
  $accordions.on("scroll", function (event) {
    var $items = $(".fui-accordion:not(.hidden)"),

      timer;
    if ($items.length > 1) {
      // 如果有多个步骤，获取每个步骤之间的间距
      marTop = parseInt($items.eq(1).css("margin-top"));
    }

    clearTimeout(timer);

    $items.each(function (i, el) {
      var $target = $(el),
        $hd = $target.find(".fui-acc-hd"),
        // height = $target.height(),
        top = $target.offset().top;

      if (top <= win.scrollTop) {
        if (!$target.hasClass("fixed")) {
          $target
            .addClass("fixed")
            .siblings()
            .removeClass("fixed");
          $hd.css('top', win.scrollTop);
          $target.siblings().find(".fui-acc-hd").css('top', 'auto');
        }


      } else {
        $target.removeClass("fixed");
        $hd.css('top', 'auto');
      }
    });
  });


  // 公用方法
  Util.cusAccordion = {
    _accs: $cusAccsWrap.find('[role="accordion"]'),

    _accTpl: '<div role="accordion" class="fui-accordion {{status}}"><div class="fui-acc-hd" style="width:{{pwidth}}" role="head" title="{{title}}"><ul class="ct-title clearfix">{{#item}}<li class="ct-item" style="width:{{percent}}">{{subtitle}}</li>{{/item}}</ul><i class="fui-acc-toggle"></i><h4 class="fui-acc-title"><span class="fui-acc-order">{{order}}</span><span class="fui-acc-innerTitle">{{title}}</span></h4></div><div class="fui-acc-bd" role="body"><iframe frameborder="0" width="100%" height="{{contentHeight}}" src="{{url}}"></iframe></div></div>',

    // 显示手风琴项
    showItem: function (index) {
      var $acc = this._accs.eq(index);

      if ($acc.length && $acc.hasClass("hidden")) {
        $acc.removeClass("hidden");
        this._updateOrders();
      }
    },

    // 隐藏手风琴项
    hideItem: function (index) {
      var $acc = this._accs.eq(index);

      if ($acc.length && !$acc.hasClass("hidden")) {
        $acc.addClass("hidden");
        this._updateOrders();
      }
    },

    // 展开手风琴
    expandItem: function (index) {
      var $acc = this._accs.eq(index);
      if ($acc.length && !$acc.hasClass("hidden")) {
        $acc.removeClass("closed").addClass("opened");
      }
    },
    // 收起手风琴
    collapseItem: function (index) {
      var $acc = this._accs.eq(index);
      if ($acc.length && !$acc.hasClass("hidden")) {
        $acc.removeClass("opened").addClass("closed");
      }
    },

    // 设置手风琴标题
    setTitle: function (title, index) {
      var $acc = this._accs.eq(index);
      if ($acc.length) {
        var $header = $acc.find('[role="head"]').attr("title", title);

        $header.find(".fui-acc-innerTitle").html(title);
      }
    },

    // 动态添加手风琴项(list为subtitle的一个数组，字段key为subtitle)
    addItem: function (title, url, opened, list, contentHeight) {
      var listLen = list.length;
      if (listLen > 0) {
        $.each(list, function (i, item) {
          item.percent = (100 / listLen).toFixed(2) + '%';
        })
      }

      var html = Mustache.render(this._accTpl, {
        title: title,
        url: url,
        pwidth: $cusAccsWrap.width() + 'px',
        status: opened ? "opened" : "closed",
        contentHeight: contentHeight || "100%",
        item: list
      });

      $(html).appendTo($cusAccsWrap);

      this._accs = $cusAccsWrap.find('[role="accordion"]');

      this._updateOrders();

      var $targetBd = $cusAccsWrap.find("[fui-acc-bd]"),
        len = $targetBd.length();

      heightArr.push($targetBd.eq(len - 1).height());
    },

    // 显示|隐藏后需要更新下序号
    _updateOrders: function () {
      var order = 0;

      $.each(this._accs, function (i, acc) {
        var $acc = $(acc),
          $order = $acc.find(".fui-acc-order");

        if (!$acc.hasClass("hidden")) {
          $order.html(getOrder(++order));
        }
      });
    }
  };

  parse();

})(this, jQuery);