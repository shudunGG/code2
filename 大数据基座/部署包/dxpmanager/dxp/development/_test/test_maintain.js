/*！
 *数据开发  
 *date:2019-09-20
 *author: huangweiping;
 */

Mock.mock(/getChartsData/, function (options) {
    data = Mock.mock({
        //调度情况
        'dispatchData|12': [{
            'name|+1':1,
            'success': '@natural(500, 2000)',   //成功
            'fail':'@natural(500,2000)'         //失败
        }],
        //饼图数据
        'totalData':[{
            name:'成功',
            value:'@natural(500,2000)'
        },{
            name:'失败',
            value:'@natural(500,2000)'
        }]
      
    });
    return {
        "controls": [],
        "custom": data,
        "status": {
            "code": 200,
            "text": "",
            "url": ""
        }
    };
});