/*！
 *数据开发
 *date:2019-09-20
 *author: huangweiping;
 */

//初始化数据
Mock.mock(/getAllData/, function(options) {
    data = Mock.mock({
        //图标
        "surveyData|30": [
            {
                "name|+1": 1,
                success: "@natural(500, 2000)", //成功
                fail: "@natural(500,2000)" //失败
            }
        ],
        //执行情况
        failnum: "@natural(0,100)", //今日执行失败任务数
        faildeal: "@natural(0,10)", //今日执行失败任务数已处理
        failwait: "@natural(0,10)", //今日执行失败任务数待处理
        implement: "@natural(0,100)", //今日执行总次数
        implementcontrast: "+12%", //今日执行总次数对比昨日
        implementaverage: "@natural(0,99999)", //今日执行总次数本月日均
        implementtotal: "@natural(0,999999)", //今日执行总次数本月总理
        losenum: "@natural(0,100)", //今日执行失败次数
        loseratio: "+12%", //今日执行失败次数对比昨日
        loseaverage: "@natural(0,99999)", //今日执行失败次数本月日均
        losetotal: "@natural(0,999999)", //今日执行失败次数本月总理
        //节点服务
        nodelist:[{
            'address':'192.168.186.54',     //ip地址
            'cpu':'33%',                    //CPU
            'memory':'45%',                 //内存
            'storage':'44%',                //储存空间
            'state':0                       //状态  0为失败  1为成功
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':0 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
        },{
            'address':'192.168.186.54',    
            'cpu':'33%',                    
            'memory':'45%',           
            'storage':'44%',            
            'state':1 
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

//图标接口数据
Mock.mock(/getChartsData/, function(options) {
    data = Mock.mock({
        "surveyData|30": [
            {
                "name|+1": 1,       //名称
                success: "@natural(500, 2000)", //成功
                fail: "@natural(500,2000)" //失败
            }
        ]
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
