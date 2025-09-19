/**
 * 卡片新增
 * date: 2020-06-21
 * author: guohanyu
 **/

'use strict';

/**
 * 获取图片以及可点击区域
 * 
 */
Mock.mock(/getImgDataUrl/, function () {
    var data = Mock.mock({     
            'img': './images/test2.png',
            'areaType':'0',
            'infoCategoryNum':'001',
            'cardData':[
                {
                    'rowguid': '8374-jsf8-3u8-dk34u',
                    'point1':'0,0',
                    'point2':'320,75',
                    'type':'0',
                    'norm':[
                        {
                            'normType':'3',
                            'normName':'今日事件数',
                            'normUnit':'件'
                        }
                    ]
                },
                {
                    'rowguid': '8374-jsf8-3u8-dk35u',
                    'point1':'0,75',
                    'point2':'320,225',
                    'type':'0',
                    'norm':[
                        {
                            'normType':'3',
                            'normName':'事件类型',
                            'normUnit':'起'
                        }
                    ]
                },
                {
                    'rowguid': '8374-jsf8-3u8-dk36u',
                    'point1':'0,225',
                    'point2':'320,460',
                    'type':'0',
                    'norm':[
                        {
                            'normType':'4',
                            'normName':'来源部门',
                            'normUnit':'%'
                        }
                    ]
                },
                {
                    'rowguid': '8374-jsf8-3u8-dk37u',
                    'point1':'0,460',
                    'point2':'320,613',
                    'type':'0',
                    'norm':[
                        {
                            'normType':'3',
                            'normName':'来源渠道',
                            'normUnit':'%'
                        }
                    ]
                }
            ]
    });
    return {
        'controls': [],
        'custom': data,
        'status': {
            'code': 200,
            'text': '',
            'url': ''
        }
    };
});