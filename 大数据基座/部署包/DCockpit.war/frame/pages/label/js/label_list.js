/*
 * 标签搜索列表
 * date:2020-12-31
 * author:xuguanyu
 */
var app = new Vue({
  el: "#app",
  data: {
    pagesize: 10,
    current: 1,
    total: 0,
    rankmode: "综合排序",
    keyword: "",
    body: "",
    name: "",
  },
  methods: {
    handleSizeChange: function (size) {
      this.pagesize = size;
      // 若要设为1
      this.current = 1;
      getAndRender(
        this.keyword,
        this.body,
        this.name,
        this.rankmode,
        this.current,
        this.pagesize
      );
    },
    handleCurrentChange: function (current) {
      this.current = current;
      getAndRender(
        this.keyword,
        this.body,
        this.name,
        this.rankmode,
        this.current,
        this.pagesize
      );
    },
  },
  mounted: function () {
    var _app = this;

    // 获取地址栏中的参数
    // 关键字
    _app.keyword = Util.getUrlParams("keyword");
    // 主体
    _app.body = Util.getUrlParams("body");
    // 标签名
    _app.name = Util.getUrlParams("name");

    // 筛选条件第一层
    Util.ajax({
      url: Config.ajaxUrls.filtersUrl,
      success: function (data) {
        data = data.result;
        var $firstFilters = $("#filter-list");
        var maxWidth = $("#filter-list").width();
        data.forEach(function (item) {
          $(
            "<li indent='0' class='filter-group fwb' id='" + item.id + "'>" +
              item.name +
              "<i class='filter-group-btn'></i>" +
              "</li><li><ul></ul></li>"
          ).appendTo($firstFilters);
          var width = item.name.length * 14 + 12;
          maxWidth = maxWidth > width ? maxWidth : width;
        });
        $(".list-item").width(maxWidth);
        $("#filter-list").width(maxWidth);
        $(".list-group").width(maxWidth);
      },
    });

    // 搜索关键字
    Util.ajax({
      url: Config.ajaxUrls.keywordsUrl,
      success: function (data) {
        data = data.result;
        var $heat = $("#search-heat");

        data.forEach(function (keyword) {
          $("<a class='search-heat-item'>[" + keyword + "]</a>").appendTo(
            $heat
          );
        });
      },
    });

    // 切换选项
    $("#filter-area").on("click", ".filter-item-checkbox", function () {
      var $this = $(this);
      var $item = $this.parent();
      if (!$item.hasClass("active")) {
        $(".filter-item").removeClass("active");
        $item.addClass("active");
        _app.name = $this.next().text();
        if ($item.hasClass("fwb")) _app.body = $item.attr("body");
        else _app.body = $item.attr("body");
        getAndRender(
          _app.keyword,
          _app.body,
          _app.name,
          _app.rankmode,
          _app.current,
          _app.pagesize
        );
      }
    });

    // 展开/收起
    $("#filter-area").on("click", ".filter-group-btn", function () {
      var $this = $(this);
      var $group = $this.parent();//li
      var $children = $group.next().children().first();
      var maxWidth = $("#filter-list").width();
      $group.toggleClass("expanded");
      if($group.hasClass("fwb")){
        var params = {
          id: $group.attr("id"),
          body: $group.text()
        }
      } else {
        var params = {
          body: $group.attr("body"),
          name: $this.prev().text()
        }
      }
      if ($children.children().length == 0) {
        Util.ajax({
          url: Config.ajaxUrls.filtersUrl,
          data: params,
          success: function (data) {
            data = data.result;
            data.forEach(function (item) {
              var indent = Number($group.attr("indent")) + 20;
              if (item.isitem) {
                $("<li class='filter-item' body='" + item.body + "' style='text-indent:" + indent + "px;' indent='" + indent + "'>" +
                    "<i class='filter-item-checkbox'></i>" +
                    "<span>" + item.name + "</span>" +
                    "</li>"
                ).appendTo($children);
              } else {
                $(
                  "<li class='filter-item filter-group' body='" + item.body + "' style='text-indent:" + indent + "px;' indent='" + indent + "'>" +
                    "<i class='filter-item-checkbox'></i>" +
                    "<span style='text-indent:28px'>" + item.name + "</span>" +
                    "<i class='filter-group-btn'></i>" +
                    "</li><li><ul></ul></li>"
                ).appendTo($children);
              }
              var width = item.name.length * 14 + 70;
              maxWidth = maxWidth > width ? maxWidth : width;
              console.log(maxWidth);
              // $(".list-item").width(maxWidth);
              // $("#filter-list").width(maxWidth);
              // $(".list-group").width(maxWidth);
            });
            
          },
        });
      }
    });

    // 输入关键字
    $("#search-input").on(
      "keyup",
      debounce(function (event) {
        if (event.keyCode == 13 && _app.keyword) {
          $("#search-hint").removeClass("show");
          getAndRender(
            _app.keyword,
            _app.body,
            _app.name,
            _app.rankmode,
            _app.current,
            _app.pagesize
          );
        } else {
          if (_app.keyword) {
            $("#clear-btn").addClass("show");
            $("#search-hint").addClass("show");
            Util.ajax({
              url: Config.ajaxUrls.hintUrl,
              data: {
                keyword: _app.keyword,
              },
              success: function (hints) {
                hints = hints.result;
                var $hints = $("#hints");
                $hints.empty();
                hints.forEach(function (hint) {
                  var $hint = $("<li class='hint-item'>" + hint + "</li>");
                  keyWordsHighLight(_app.keyword, $hint);
                  $hint.appendTo($hints);
                });
              },
            });
          } else {
            $("#clear-btn").removeClass("show");
            $("#search-hint").removeClass("show");
          }
        }
      }, 80)
    );

    // 搜索按钮
    $("#search-btn").on(
      "click",
      debounce(function () {
        if (_app.keyword) {
          $("#search-hint").removeClass("show");
          getAndRender(
            _app.keyword,
            _app.body,
            _app.name,
            _app.rankmode,
            _app.current,
            _app.pagesize
          );
        }
      }, 50)
    );

    // 搜索提示内容
    $("#hints").on("click", ".hint-item", function () {
      _app.keyword = $(this).text();
      getAndRender(
        _app.keyword,
        _app.body,
        _app.name,
        _app.rankmode,
        _app.current,
        _app.pagesize
      );
      $("#search-hint").removeClass("show");
    });

    // 搜索热门关键字
    $("#search-heat").on("click", ".search-heat-item", function () {
      _app.keyword = $(this).text().slice(1, -1);
      getAndRender(
        _app.keyword,
        _app.body,
        _app.name,
        _app.rankmode,
        _app.current,
        _app.pagesize
      );
    });

    // 清空搜索输入框
    $("#clear-btn").on("click", function () {
      _app.keyword = "";
      $(this).removeClass("show");
      $("#search-hint").removeClass("show");
    });

    // 切换排序方式
    $(".sort-option").on("click", function () {
      if (!$(this).hasClass("active")) {
        $(".sort-option").removeClass("active");
        $(this).addClass("active");
        _app.rankmode = $(this).text();
        getAndRender(
          _app.keyword,
          _app.body,
          _app.name,
          _app.rankmode,
          _app.current,
          _app.pagesize
        );
      }
    });

    // 加载默认数据
    getAndRender(
      _app.keyword,
      _app.body,
      _app.name,
      _app.rankmode,
      _app.current,
      _app.pagesize
    );
  },
});

// 关键字高亮
function keyWordsHighLight(keyword, $el) {
  if (keyword) {
    var reg = new RegExp(keyword, "g");
    var newHtml = $el
      .html()
      .replace(reg, "<span style='color:#f65637'>" + keyword + "</span>");
    $el.html(newHtml);
  }
}

// 防抖函数
function debounce(func, wait) {
  var timer;
  return function () {
    var ctx = this;
    var args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      func.apply(ctx, args);
    }, wait);
  };
}

// 获取列表数据并渲染
function getAndRender(keyword, body, name, rankmode, current, pagesize) {
  var listTmpl = $("#list-item-tmpl").html();
  var $list = $("#list");
  var $itemNum = $("#item-num");
  var data = {
    keyword: keyword,
    body: body,
    name: name,
    rankmode: rankmode,
    current: current,
    pagesize: pagesize,
  };
  Util.ajax({
    url: Config.ajaxUrls.listUrl,
    data: data,
    success: function (data) {
      data = data.result;
      app.total = data.total;
      $itemNum.text(data.total + "条");
      Mustache.parse(listTmpl);
      var rendered = Mustache.render(listTmpl, data);
      $list.html(rendered);
      var $titles = $(".list-item-title");
      $titles.each(function () {
        keyWordsHighLight(keyword, $(this));
      });
      $(".noresult").remove();
      if (data.items.length > 0) {
        $("#pagination").removeClass("hidden");
        
      } else {
        $("#list").before($("<div class='noresult'>无搜索结果</div>"));
        $("#pagination").addClass("hidden");
      }
    },
  });
}
