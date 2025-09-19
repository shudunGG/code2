Mock.setup({
    timeout: '200-400'
})

Mock.mock(/getFileUploadModel/, function () {
    return {
        "controls": [{
            "data": {
                "extraDatas": {
                    "msg": "\u5BFC\u5165\u6210\u529F\uFF01"
                },
                "attachGuid": "d0701c25-5fb1-4177-87ae-2f6653a96416",
                "downloadUrl": "rest\/attachAction\/getContent?isCommondto=true&attachGuid=d0701c25-5fb1-4177-87ae-2f6653a96416",
                "attachFileName": "dimensioninfo.xlsx",
                "preparams": "tp=b3ef3f08e1b8db1392743424c18637094f4c7ae3a9743323780abfa96358119dd37e9061e21d9c21f9f6304f6c88ce5dc2c645511055f67b4aab188d454c9081&furl=21432986396a2ea72c2c3f74dd8dd753aadb7118976f4fead288379155ed22a151a205211a43f6b92a1df1b549120645a5f9243641e795b87402a7d22b24ab350bf34690847d60183b9dd4f66de01d9a6905d3ad66ef4d3f7a46e86885add3ad53877d59976c7a7ab729fa7016cb3bbd1d87150a20512e19b1aefd0e0bed6c1dd829a4d6ac17e49e68f5457201cf0839e17acef781b1e8ea8bc82f3ea4e53d28adc105e94a77bbcfe9184e30cf2962cb5a1ae8c2aa442ec3ba55c4b999e9ec121fc9076ba23e48039ff8f7e1fe1b27241f8f67eb7c72bb0007f662e3c38a80baa7a0759f9600d68a9ed0842f11191cba8979af3eb17e84188fc46346285022ab1e04bf0ced53e9fd8089849a36c2fd13161371bd4caf99e042cf3f415000ff5aa11eb9b0d9a7461520ec1aeb82fb579c546dafa5eab511659d1eeace243b5865b8d888d3bdd9fad5"
            },
            "id": "uploader"
        }],
        "status": {
            "code": "1"
        }
    };
});

Mock.mock(/dimensionuploadaction\/selectOuExcel/, function () {
    return Mock.mock({
        "controls": [{
            "successInfo": "已经成功新增导入用户5条记录</br>更新用户数据3条记录</br>导入部门2条记录",
            "errorInfo": "有1条用户记录导入失败，可参考错误原因整改后重新导入</br>有1条部门记录导入失败，可参考错误原因整改后重新导入",
            "state|1": ["success", "error", "error"],
            "tabs": [{
                "title": "用户导入异常",
                "grid": {
                    "columns": [{
                        "field": "curRow",
                        "width": 80,
                        "header": "错误行"
                    }, {
                        "field": "loginId",
                        "width": "100%",
                        "header": "账号"
                    }, {
                        "field": "mobile",
                        "width": 300,
                        "header": "手机号"
                    }],
                    "data": [{
                        "loginId": "xxxxxxxx",
                        "mobile": "15678909876",
                        "curRow": 1
                    }, {
                        "loginId": "qqqqqqqqqq",
                        "mobile": "159876532123",
                        "curRow": 2
                    }],
                    "total": 2
                }
            },{
                "title": "部门导入异常",
                "grid": {
                    "columns": [{
                        "field": "curRow",
                        "width": 80,
                        "header": "错误行"
                    }, {
                        "field": "loginId",
                        "width": "100%",
                        "header": "账号"
                    }, {
                        "field": "mobile",
                        "width": 300,
                        "header": "手机号"
                    }],
                    "data": [{
                        "loginId": "xxxxxxxx",
                        "mobile": "15678909876",
                        "curRow": 1
                    }],
                    "total": 1
                }
            }]
        }],
        "custom": {
           
        },
        "status": {
            "code": "1"
        }
    });
})