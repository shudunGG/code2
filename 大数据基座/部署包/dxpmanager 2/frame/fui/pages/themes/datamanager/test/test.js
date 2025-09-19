function getParams(str) {
    var arr = str.split('&'),
        params = {};
    arr.forEach(function(item) {
        params[item.split('=')[0]] = item.split('=')[1];
    })
    return params;
}
Mock.mock(/getQuickMenu/,function(option) {
    return {
        "controls":[],
        "custom": [
            {
                code: '1',
                name: '菜单1',
                icon: 'modicon-1',
                openType: 'tabsnav',
            },
            {
                code: '11',
                name: '菜单11',
                icon: 'modicon-1',
                openType: 'tabsnav',
            },
            {
                code: '5',
                name: '菜单5',
                icon: 'modicon-1',
                openType: 'tabsnav',
            }
        ],
        "status":{
            "code":"200",
            "text":"",
            "url":"",
            "state":"error"
        }
    }
})
Mock.mock(/getMenu/,function(option) {
    return {
        "controls":[],
        "custom":[
            {
                code: '1',
                name: '菜单1',
                icon: 'modicon-1',
                openType: 'tabsnav',
                items: [
                    {
                        code: '11',
                        name: '菜单11',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        items: [
                            {
                                code: '111',
                                name: '菜单111',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                items: [
                                    {
                                        code: '1111',
                                        name: '菜单1111',
                                        icon: 'modicon-1',
                                        openType: 'tabsnav',
                                        items: [
                                            {
                                                code: '11111',
                                                name: '菜单11111',
                                                icon: 'modicon-1',
                                                openType: 'tabsnav',
                                                url: 'https://cn.vuejs.org/v2/guide/components.html#%E7%BB%84%E4%BB%B6%E7%9A%84%E7%BB%84%E7%BB%87',
                                            },
                                            {
                                                code: '11112',
                                                name: '菜单11112',
                                                icon: 'modicon-1',
                                                openType: 'tabsnav',
                                                url: 'https://www.baidu.com/',
                                            }
                                        ] 
                                    },
                                    {
                                        code: '1112',
                                        name: '菜单1112',
                                        icon: 'modicon-1',
                                        openType: 'tabsnav',
                                        url: 'https://www.baidu.com/', 
                                    },

                                ]
                            },
                            {
                                code: '112',
                                name: '菜单112',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                                items: [
                                    {
                                        code: '1121',
                                        name: '菜单1121',
                                        icon: 'modicon-1',
                                        openType: 'tabsnav',
                                        url: 'https://www.baidu.com/', 
                                    },
                                    {
                                        code: '1122',
                                        name: '菜单1122',
                                        icon: 'modicon-1',
                                        openType: 'tabsnav',
                                        url: 'https://www.baidu.com/', 
                                    },

                                ]
                            },
                        ]
                    },
                    {
                        code: '12',
                        name: '菜单12',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '121',
                                name: '菜单121',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '122',
                                name: '菜单122',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                    {
                        code: '13',
                        name: '菜单13',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '131',
                                name: '菜单131',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '132',
                                name: '菜单132',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                    {
                        code: '14',
                        name: '菜单14',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                    }
                ]
            },
            {
                code: '2',
                name: '菜单2',
                icon: 'modicon-1',
                openType: 'tabsnav',
                url: 'https://www.baidu.com/',
                items: [
                    {
                        code: '21',
                        name: '菜单21',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '211',
                                name: '菜单111',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '212',
                                name: '菜单112',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                    {
                        code: '22',
                        name: '菜单22',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '221',
                                name: '菜单121',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '222',
                                name: '菜单122',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                    {
                        code: '23',
                        name: '菜单23',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '231',
                                name: '菜单231',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '232',
                                name: '菜单232',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                ]
            },
            {
                code: '3',
                name: '菜单3',
                icon: 'modicon-1',
                openType: 'tabsnav',
                url: 'https://www.baidu.com/',
                items: [
                    {
                        code: '31',
                        name: '菜单31',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '311',
                                name: '菜单311',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '312',
                                name: '菜单312',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                    {
                        code: '32',
                        name: '菜单32',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '321',
                                name: '菜单321',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '322',
                                name: '菜单322',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                    {
                        code: '33',
                        name: '菜单33',
                        icon: 'modicon-1',
                        openType: 'tabsnav',
                        url: 'https://www.baidu.com/',
                        items: [
                            {
                                code: '331',
                                name: '菜单331',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                            {
                                code: '332',
                                name: '菜单332',
                                icon: 'modicon-1',
                                openType: 'tabsnav',
                                url: 'https://www.baidu.com/',
                            },
                        ]
                    },
                ]
            },
            {
                code: '4',
                name: '菜单4',
                icon: 'modicon-1',
                openType: 'tabsnav',
                url: 'https://www.baidu.com/',
            },
            {
                code: '5',
                name: '菜单5',
                icon: 'modicon-1',
                openType: 'tabsnav',
                url: 'https://www.baidu.com/',
            },
        ],
        "status":{
            "code":"200",
            "text":"",
            "url":"",
            "state":"error"
        }
    }
    
})

Mock.mock(/saveCommonMenu/,function(option) {
    console.log(option);
    console.log(getParams(option.body).userSelected)
    return {
        "controls":[],
        "custom":{
            "success":1
        },
        "status":{"code":"1","text":"","url":"","state":"error"
    }}
})