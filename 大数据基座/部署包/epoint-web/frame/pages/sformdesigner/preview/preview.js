var pcBtn = mini.get('pc-btn');
var mobileBtn = mini.get('mobile-btn');

var $pc = $('.preview-pc');
var $mobile = $('.preview-mobile');

var $pcIfr = $('#ifr-pc');
var $mobileIfr = $('#ifr-mobile');

pcBtn.on('click', function() {
  toggle('pc');
});
mobileBtn.on('click', function() {
  toggle('mobile');
});

function toggle(type) {
  if (type == 'pc') {
    $(pcBtn.el).addClass('active mini-button-popup');
    $(mobileBtn.el).removeClass('active mini-button-popup');

    $pc.addClass('active');
    $mobile.removeClass('active');
  } else if (type == 'mobile') {
    $(pcBtn.el).removeClass('active mini-button-popup');
    $(mobileBtn.el).addClass('active mini-button-popup');

    $pc.removeClass('active');
    $mobile.addClass('active');
  }
}


// 页面url参数
var pageParams = Util.getUrlParams();
var tplId = pageParams.tplId; // 预览模板时的 模板id
var designId = pageParams.designId; // 设计器中预览时
var tableGuid = pageParams.tableGuid; // 设计器中预览时
var viewType = pageParams.viewType; // 预览类型

// 默认显示pc
if (viewType == 'mobile') {
  toggle('mobile');
} else {
  toggle('pc');
}

function initQrCode() {
  var qCode = new QRCode(document.getElementById('qrcode-content'), {
    // text: 'http://jindo.dev.naver.com/collie',
    width: 128,
    height: 128,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
  qCode.clear();
  return qCode;
}

var urlQuery = (function() {
  var q = [];
  if (tplId) {
    q.push('tplId=' + window.encodeURIComponent(tplId));
  }
  if (designId) {
    q.push('designId=' + window.encodeURIComponent(designId));
  }
  if (tableGuid) {
    q.push('tableGuid=' + window.encodeURIComponent(tableGuid));
  }
  return '?' + q.join('&');
})();

// 二维码地址 模板预览时 不支持扫码
if (!tplId) {
  var qrCode = initQrCode();
  qrCode.makeCode(getFullUrl('./qrcode.html' + urlQuery));
} else {
  $('.qrcode-wrap').remove();
}

// var tplId = Util.getUrlParams('tplId');

// 实现方式一： 请求 html 写入 iframe 预览
function renderPcHtml(html) {
  $pcIfr[0].contentWindow.document.open('text/html', 'replace');
  $pcIfr[0].contentWindow.document.write(html);
  $pcIfr[0].contentWindow.document.close();
}
function renderMobileHtml(html) {
  $mobileIfr[0].contentWindow.document.open('text/html', 'replace');
  $mobileIfr[0].contentWindow.document.write(html);
  $mobileIfr[0].contentWindow.document.close();
}

// 预览模板
if (tplId) {
  Util.ajax({
    // url: 'http://192.168.201.159:1199/mock/109/formdesigner/getTplHtml',
    url: 'formlistmanage/epointsformaddaction.action?cmd=previewTemplate',
    data: {
      tplId: tplId
    }
  }).done(function(data) {
    if (data.pcHtml) {
      renderPcHtml(data.pcHtml);
    }
    if (data.mobileHtml) {
      renderMobileHtml(data.mobileHtml);
    }
  });
} else {
  // 设计器中预览 则传数据 直接预览即可 在设计器页面中调用 getPreviewHtml 方法 传数据即可
}

window.getPreviewHtml = function(params) {
  $.each(params, function(k, v) {
    // console.log(k, v);
    if (typeof v == 'object') {
      params[k] = JSON.stringify(v);
    }
  });
  Util.ajax({
    // url: 'http://192.168.201.159:1199/mock/109/formdesigner/getTplHtml',
    url: 'formlistmanage/sformdesignaction.action?cmd=previewTemplate',
    // params 和保存提交时相同
    data: params
  }).done(function(data) {
    if (data.pcHtml) {
      renderPcHtml(data.pcHtml);
    }
    if (data.mobileHtml) {
      renderMobileHtml(data.mobileHtml);
    }
  });
};

$(window).on('message', function(e) {
  var event = e.originalEvent;

  if (!event.data) return;
  try {
    var data = JSON.parse(event.data);
    if (data.type == 'previewHtml') {
      getPreviewHtml(data.params);
    }
  } catch (error) {
    console.error(error);
  }
});

function getFullUrl(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.href;
}

// 实现方式二： 加载固定页面 URl传参 动态渲染即可
// $pcIfr.attr('src', 'pc端预览地址?url参数');
// $mobileIfr$pcIfr.attr('src', '移动端预览地址?url参数');
