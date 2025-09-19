if (!window.EpFrameSysParams) {
    window.EpFrameSysParams = {};
}
// window.EpFrameSysParams.enableEncodeParam = true;
var urlArray = [{
    value: 'http://fe.epoint.com.cn:8080/ep93/frame/fui/pages/themes/breeze/breeze.proto.html?a=121&a=123'
}, {
    value: '../../themes/aide/aide?pageId=121'
}, {
    value: 'frame/fui/pages/themes/dream/dream?pageId=121&topMenuCode=55bd72c4-cDBf-DD1E-b31F-a5BDC4B6596c'
}, {
    value: 'pages/someModele?from=wechat&user=Taylor&data=[{"icon":"modicon-5","guid":"all","name":"全部"},{"icon":"modicon-53","guid":"001","name":"信息"},{"icon":"modicon-63","guid":"002","name":"邮件"},{"icon":"modicon-21","guid":"003","name":"反馈"},{"icon":"modicon-124","guid":"004","name":"公告"},{"icon":"modicon-67","guid":"user","name":"用户"},{"icon":"modicon-35","guid":"module","name":"模块"}]'
}, {
    value: 'test/testFullSearch.html?frameUrlSecretParam=JTdCJTIyd2QlMjI6JTIyc2QlMjIsJTIydHlwZSUyMjolMjJhbGwlMjIsJTIyYSUyMjolNUIlMjJ0aGlzLWlzLWElMjIsJTIyJUU4JUJGJTk5JUU2JTk4JUFGYSVFNSVCMSU5RSVFNiU4MCVBNyUyMiU1RCwlMjJhcnIlMjI6JTVCMSwyLDMsJTIydHJ1ZSUyMiU1RCU3RA=='
}, {
    value: 'pages/someModele?frameUrlSecretParam=JTdCJTIyZnJvbSUyMjolMjJ3ZWNoYXQlMjIsJTIydXNlciUyMjolMjJUYXlsb3IlMjIsJTIyZGF0YSUyMjolMjIlNUIlN0IlNUMlMjJpY29uJTVDJTIyOiU1QyUyMm1vZGljb24tNSU1QyUyMiwlNUMlMjJndWlkJTVDJTIyOiU1QyUyMmFsbCU1QyUyMiwlNUMlMjJuYW1lJTVDJTIyOiU1QyUyMiVFNSU4NSVBOCVFOSU4MyVBOCU1QyUyMiU3RCwlN0IlNUMlMjJpY29uJTVDJTIyOiU1QyUyMm1vZGljb24tNTMlNUMlMjIsJTVDJTIyZ3VpZCU1QyUyMjolNUMlMjIwMDElNUMlMjIsJTVDJTIybmFtZSU1QyUyMjolNUMlMjIlRTQlQkYlQTElRTYlODElQUYlNUMlMjIlN0QsJTdCJTVDJTIyaWNvbiU1QyUyMjolNUMlMjJtb2RpY29uLTYzJTVDJTIyLCU1QyUyMmd1aWQlNUMlMjI6JTVDJTIyMDAyJTVDJTIyLCU1QyUyMm5hbWUlNUMlMjI6JTVDJTIyJUU5JTgyJUFFJUU0JUJCJUI2JTVDJTIyJTdELCU3QiU1QyUyMmljb24lNUMlMjI6JTVDJTIybW9kaWNvbi0yMSU1QyUyMiwlNUMlMjJndWlkJTVDJTIyOiU1QyUyMjAwMyU1QyUyMiwlNUMlMjJuYW1lJTVDJTIyOiU1QyUyMiVFNSU4RiU4RCVFOSVBNiU4OCU1QyUyMiU3RCwlN0IlNUMlMjJpY29uJTVDJTIyOiU1QyUyMm1vZGljb24tMTI0JTVDJTIyLCU1QyUyMmd1aWQlNUMlMjI6JTVDJTIyMDA0JTVDJTIyLCU1QyUyMm5hbWUlNUMlMjI6JTVDJTIyJUU1JTg1JUFDJUU1JTkxJThBJTVDJTIyJTdELCU3QiU1QyUyMmljb24lNUMlMjI6JTVDJTIybW9kaWNvbi02NyU1QyUyMiwlNUMlMjJndWlkJTVDJTIyOiU1QyUyMnVzZXIlNUMlMjIsJTVDJTIybmFtZSU1QyUyMjolNUMlMjIlRTclOTQlQTglRTYlODglQjclNUMlMjIlN0QsJTdCJTVDJTIyaWNvbiU1QyUyMjolNUMlMjJtb2RpY29uLTM1JTVDJTIyLCU1QyUyMmd1aWQlNUMlMjI6JTVDJTIybW9kdWxlJTVDJTIyLCU1QyUyMm5hbWUlNUMlMjI6JTVDJTIyJUU2JUE4JUExJUU1JTlEJTk3JTVDJTIyJTdEJTVEJTIyJTdE'
}];

var paramsArr = (function () {
    var params = [
        JSON.stringify({
            a: '加一个参数'
        }),
        JSON.stringify({
            data: [1, 2, 3, 4]
        }),
        JSON.stringify({
            from: 'qq',
            name: 'cc'
        }),
        JSON.stringify({
            "a": "这是a属性",
            "arr": [1, 2, 3, "true"]
        }),
        JSON.stringify({
            'downloadUrl': 'https://fdoc.epoint.com.cn/onlinedoc/fui/js/lib/ewebeditor/uploadfile/兼职人员问题-20181018102054838.zip'
        }),
        JSON.stringify({
            'furl': 'http://192.168.201.159',
            'fname': 'abcde.jpg'
        }),
    ];

    var arr = [];
    $.each(params, function (i, item) {
        arr.push({
            value: item
        });
    });
    return arr;
})();

function writeOutput(el, obj) {
    var arr = [];
    $.each(obj, function (k, v) {
        arr.push($('<p></p>').text(k + ': ' + v).html());
    });
    var $c = $('<p></p>').appendTo(el).html(arr.join(' ,<br>'));
    $c[0].scrollIntoViewIfNeeded ? $c[0].scrollIntoViewIfNeeded() : $c[0].scrollIntoView();
}
var encryptSwitch = mini.get('encrypt-switch');
encryptSwitch.on('valuechanged', function () {
    var v = encryptSwitch.getValue() == 'true';
    window.EpFrameSysParams.enableEncodeParam = v;
});
window.EpFrameSysParams.enableEncodeParam = encryptSwitch.getValue() == 'true';

// 加密测试
var input1 = mini.get('input1');
var output1 = document.getElementById('output1');
input1.on('valuechanged', function () {
    var v = input1.getValue();
    var t1 = new Date();
    var str1 = Util.encrypt(v);
    var t2 = new Date();
    var str2 = Util.decrypt(str1);
    var t3 = new Date();
    writeOutput(output1, {
        '加密字符串': v,
        '加密结果': str1,
        '加密耗时': t2 - t1 + 'ms',
        '自动解密结果': str2,
        '解密耗时': t3 - t1 + 'ms',
    });
});


// url加密测试
var input2 = mini.get('input2');
var output2 = document.getElementById('output2');
var demo2 = mini.get('demo2');

function handleTest2() {
    // output2.setValue(Util.encryptUrlParams(input2.getValue()));
    var v = input2.getValue(),
        t1 = new Date(),
        str1 = Util.encryptUrlParams(v),
        t2 = new Date();
    writeOutput(output2, {
        '原始url': v,
        '加密后的url': str1,
        '加密耗时': t2 - t1 + 'ms'
    });
}

input2.on('valuechanged', handleTest2);
demo2.setData(urlArray);
demo2.on('valuechanged', function () {
    var v = demo2.getValue();
    input2.setValue(v);
    handleTest2();
});


// url添加参数测试
var input3 = mini.get('input3'),
    input31 = mini.get('input31'),
    output3 = document.getElementById('output3'),
    btn3 = mini.get('button3'),
    demo3 = mini.get('demo3'),
    demo32 = mini.get('demo32');
demo3.setData(urlArray);
demo32.setData(paramsArr);
demo3.on('valuechanged', function () {
    var v = demo3.getValue();
    input3.setValue(v);
});
demo32.on('valuechanged', function () {
    var v = demo32.getValue();
    input31.setValue(v);
});
input3.setValue('test/testFullSearch.html?wd=sd&type=all&a=this-is-a');
input31.setValue(mini.encode({
    a: '这是a属性',
    arr: [1, 2, 3, 'true']
}, false));

function handleTest3() {
    var url = $.trim(input3.getValue());
    var paramsStr = $.trim(input31.getValue());
    var params = mini.decode(paramsStr);
    var t1 = new Date();
    var str = Util.addUrlParams(url, params);
    var t2 = new Date();
    writeOutput(output3, {
        '原始url': url,
        '新增参数': paramsStr,
        '添加参数后的url': str,
        '加密耗时': t2 - t1 + 'ms',
        '最新的参数为': mini.encode(Util._getUrlParams(str), false)
    });
}
btn3.on('click', handleTest3);


// 性能测试
var output4 = document.getElementById('output4'),
    btn4 = mini.get('button4');
btn4.on('click', function () {
    try {
        doPerformanceTest()
    } catch (error) {
        console.error(error);
        alert(error);
    }
});

function performanceTest(name, cb) {
    var out = {
        '测试名称': name,
    };
    var d = new Date();
    cb(out);
    var time = new Date() - d;
    out['测试耗时'] = time;
    console.log(out);
    window.writeOutput && window.writeOutput(output4, out);
}

function doPerformanceTest() {

    var bodyHTML = document.body.innerHTML;
    var encryptStr = '';

    performanceTest('加密当前页面HTML', function (out) {
        out['处理长度'] = bodyHTML.length.toLocaleString();
        encryptStr = Util.encrypt(bodyHTML);
    });


    performanceTest('解密页面HTML加密后结果', function (out) {
        out['处理长度'] = encryptStr.length.toLocaleString();
        Util.encrypt(encryptStr);
    });

    var bigJsonLength = parseInt(mini.get('input4').getValue(), 10) || 5000;
    var bigJson = (function () {
        var arr = [];
        var i = 0;
        var obj = {};
        var str = '小飼弾ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789我是'
        while (i++ < 100) {
            obj[i] = str;
        }
        i = 0;
        while (i++ < bigJsonLength) {
            arr.push(obj);
        }
        return JSON.stringify(arr);
    }());

    performanceTest('内含' + bigJsonLength + '个对象(每个对象100个键值对含中文)的大json加密', function (out) {
        out['处理长度'] = bigJson.length.toLocaleString();
        encryptStr = Util.encrypt(bigJson);
    });

    performanceTest('内含' + bigJsonLength + '个对象(每个对象100个键值对)的大json加密结果的解密', function (out) {
        out['处理长度'] = encryptStr.length.toLocaleString();
        Util.decrypt(encryptStr);
    });
}