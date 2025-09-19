Mock.mock(Util.getRightUrl(getOutaddressListUrl), {
    "controls": [],
    "custom": [{
            "namefletter": "A",
            "items|3": [{
                "guid": "@guid",
                "userguid": "@guid",
                "displayname": "@cname",
                "unit": "@cword(8,15)",
                "usermobile": '/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/'
            }]
        },
        {
            "namefletter": "B",
            "items|2": [{
                "guid": "@guid",
                "userguid": "@guid",
                "displayname": "@cname",
                "unit": "@cword(8,15)",
                "usermobile": '/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/'
            }]
        }, {
            "namefletter": "C",
            "items|2": [{
                "guid": "@guid",
                "userguid": "@guid",
                "displayname": "@cname",
                "unit": "@cword(8,15)",
                "usermobile": '/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/'
            }]
        },{
                "namefletter": "D",
                "items|3": [{
                    "guid": "@guid",
                    "userguid": "@guid",
                    "displayname": "@cname",
                    "unit": "@cword(8,15)",
                    "usermobile": '/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/'
                }]
            },
            {
                "namefletter": "E",
                "items|2": [{
                    "guid": "@guid",
                    "userguid": "@guid",
                    "displayname": "@cname",
                    "unit": "@cword(8,15)",
                    "usermobile": '/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/'
                }]
            }, {
                "namefletter": "F",
                "items|2": [{
                    "guid": "@guid",
                    "userguid": "@guid",
                    "displayname": "@cname",
                    "unit": "@cword(8,15)",
                    "usermobile": '/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/'
                }]
            }
    ],
    "status": {
        "code": 200,
        "text": "还未登录",
        "url": "/pages/login.html"
    }
});
