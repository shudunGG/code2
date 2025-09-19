// 页面公共js

function getNow() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  if (month < 10) month = "0" + month;
  var day = now.getDate();
  if (day < 10) day = "0" + day;
  var hours = now.getHours();
  if (hours < 10) hours = "0" + hours;
  var minutes = now.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  var seconds = now.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;
  var week = new Array("日", "一", "二", "三", "四", "五", "六");
  var weekday = week[now.getDay()];
  var timeStr = hours + ":" + minutes + ":" + seconds + "&nbsp;&nbsp;&nbsp;" + year + "/" + month + "/" + day + "&nbsp;&nbsp; 星期" + weekday;
  return timeStr;
};

// 具名函数调用自身
(function updateTime() {
  var nows = getNow();
  $("#timer").html(nows);
  setTimeout(updateTime, 1000);
})();

// 如果启用rem方案
(function() {
  if(Config.needRem) {
    // 如果启用rem方案，在页面载入完成后启动niceScroll插件
    window.onload = function() {
      $("body").addClass('loaded').niceScroll({
        cursorcolor: "#298bc8",
        cursorborder: "none",
        cursorwidth: 10,
        horizrailenabled: false
      });
    }

    // 如果页面包含图表，需要启动echarts自适应工具方法
    var echartsResize = Util.echartsResize();
    echartsResize();
  }
}());