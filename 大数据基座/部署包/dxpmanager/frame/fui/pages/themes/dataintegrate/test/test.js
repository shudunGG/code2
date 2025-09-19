function getParams(str) {
    var arr = str.split('&'),
        params = {};
    arr.forEach(function(item) {
        params[item.split('=')[0]] = item.split('=')[1];
    })
    return params;
}
Mock.mock(/getMenu/,function(option) {
    var topList = Mock.mock({
        // 菜单数据
        "items|4": [{
            "name": "@cword(3,8)", // 菜单显示名称
            "icon": 'modicon-@integer(1,124)', // 模块图标
            "code": "@id", // 菜单id
            "url": "@url", // 菜单url 
            "hasSub|1": [ true, false], // 标识是否有子菜单
            "openType|1": [ "blank", "tabsnav"] // 此菜单打开方式，含有url时才生效。        
        }],
        "code":"@id" // 默认加载此顶级菜单的子菜单 不存在则加载第一个
    });
    var subList = Mock.mock({
        // 菜单数据
        "list|3-4": [{
            "name": "@cword(3,8)", // 菜单显示名称
            "icon": 'modicon-@integer(1,124)', // 模块图标
            "code": "@id", // 菜单id
            "url": "@url", // 菜单url 存在url则不应再有子菜单
            "openType|1": [ "blank", "tabsnav"], // 是否新窗口打开   
            // 如果有items 属性 且有内容 则该菜单具有子菜单
            "items|0-2": [{
                "name": "@cword(3,8)",
                "icon": 'modicon-@integer(1,124)',
                "code": "@id",
                "url": "@url",
                "openType|1": [ "blank", "tabsnav"],
                "items|0-2": [{
                    "name": "@cword(3,8)",
                    "icon": 'modicon-@integer(1,124)',
                    "code": "@id",
                    "url": "@url",
                    "openType|1": [ "blank", "tabsnav"]
                }]
            }]
        }]
    })
    var params = getParams(option.body);
    if (params.query == 'top') {
        return {
            "controls":[],
            "custom":topList,
            "status":{
                "code":"200",
                "text":"",
                "url":"",
                "state":"ok"
            }
        }
    }
    return {
        "controls":[],
        "custom":subList.list,
        "status":{
            "code":"200",
            "text":"",
            "url":"",
            "state":"ok"
        }
    }
    
})