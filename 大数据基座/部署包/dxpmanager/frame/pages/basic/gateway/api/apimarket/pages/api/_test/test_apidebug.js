/**!
 * API调试
 * date:2019-4-2
 * author: [xlb];
 */

// 获取API详情
Mock.mock(Config.ajaxUrls.getInterface, function() {
    data = Mock.mock({
        // api的权限：-1表示无授权，0表示用户授权，1表示应用授权
        'apiRight|1': [-1, 0, 1],
        "requestType|1": ["GET", "POST"],
        'requestUrl': "@url()",
        'headers': {
            "keyList|1-2": [{
                'keyName': "@word()",
                // 0表示否，1表示是
                'must|1': [0, 1],
                'type': "string",
                'isJson': 0,
                'value': '@cword()'
            }, {
                'keyName': "@word()",
                // 0表示否，1表示是
                'must|1': [0, 1],
                'type': "json",
                'isJson': 1,
                'value': '{"reason": "操作成功","error_code": 0,"result": {"test": 1}}'
            }]
        },
        'query': {
            "keyList|1-2": [{
                'keyName': "@word()",
                // 0表示否，1表示是
                'must|1': [0, 1],
                'type': "string",
                'isJson': 0,
                'value': '@cword()'
            }, {
                'keyName': "@word()",
                // 0表示否，1表示是
                'must|1': [0, 1],
                'type': "json",
                'isJson': 1,
                'value': '{"reason": "操作成功","error_code": 0,"result": {"test": 1}}'
            }]
        },
        'body|1': [{
            // 0表示不是代码，表格形式，1表示是代码
            'isCode': 0,
            "keyList|1-2": [{
                'keyName': "@word()",
                // 0表示否，1表示是
                'must|1': [0, 1],
                'type': "string",
                'isJson': 0,
                'value': '@cword()'
            }, {
                'keyName': "@word()",
                // 0表示否，1表示是
                'must|1': [0, 1],
                'type': "json",
                'isJson': 1,
                'value': '{"reason": "操作成功","error_code": 0,"result": {"test": 1}}'
            }]
        }, {
            'keyName': 'bodyInfo',
            // 0表示不是代码，表格形式，1表示是代码
            'isCode': 1,
            'value': `public static String get() throws IOException {
        // 创建HttpClient对象
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = null;
        String result = null;
        try {
            HttpGet httpGet = new HttpGet("http://v.juhe.cn/certificates/typeList.php?key="+ appKey);
            // 执行网络请求
            response = httpClient.execute(httpGet);
            // 获取请求实体
            HttpEntity resEntity = response.getEntity();
            if (resEntity != null) {
                // ConverStreamToString是下面写的一个方法是把网络请求的字节流转换为utf8的字符串
                result = ConvertStreamToString(resEntity.getContent(), "UTF-8");
            }
            EntityUtils.consume(resEntity);
        } catch (Exception e) {
        } finally {
            // 关闭请求
            response.close();
            httpClient.close();
        }
        // 得到的是JSON类型的数据需要第三方解析JSON的jar包来解析
        return result;
    }`
        }],
        // "way|3-4": [{
        //     'value': "@word(3,6)",
        //     'text': "@cword(3,6)"
        // }],
        "app|30-40": [{
            'value': "@word(3,6)",
            'text': "@cword(3,6)"
        }]
    });

    return {
        controls: [],
        custom: data,
        status: {
            code: 200,
            text: "",
            url: ""
        }
    };
});


//返回API结果
Mock.mock(Config.ajaxUrls.getResult, function() {
    data = Mock.mock({
        'requestInfo': `Url：http://apis.juhe.cn/qrcode/api
Type：GET
Header：{text=&el=h&bgcolor=000000&fgcolor=eeeeee&logo=&w=&m=&lw=&type=&key= 734a75a43f2f45205b2dce2e76d0fc8e}
Body:""`,
        'resultInfo': `{
      "reason":"success",
      "result":{    "base64_image":"iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4C+umnyK9sNhsWEYUZEbJSB95wpKogmVDEOeI7duxARdFisaCvoK2tTf8ojHnz5g0fPlz168R9PCmD6gXsGFusKIqhc5bNhsWEYUZEbJSB95wpKogmVDEOeI7duxARdFisaCvoK2tTf8ojHnz5g0fPlz168R9PCmD6gXsGFusKIqhc5bNhsWEYUZEbJSB95wpKogmVDEOeI7duxARdFisaCvoK2tTf8ojHnz5g0fPlz168R9PCmD6gXsGFusKIqhc5bNhsWEYUZEbJSB95wpKogmVDEOeI7duxARdFisaCvoK2tTf8ojHnz5g0fPlz168R9PCmD6gXsGFusKIqhc5b6Tns1Vq9eLX9ehyzrYEU6cZS5XkmuJi1lTKn4r4crFzIGga06qIaJZkvK3twpigZPLcrnNra2ugwAhInWlpaMNHwbEQTtyapxnxSB8XjoVk8evRIHAoZjuGBBx544IEHHnjggQceeOCBBx48W\/wfdYdiuTZdf6kAAAAASUVORK5CYII="
      },`
    });

    return {
        controls: [],
        custom: data,
        status: {
            code: 200,
            text: "",
            url: ""
        }
    };
});