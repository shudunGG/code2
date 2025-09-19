var data = Mock.mock({
    'list|20': [
        {
            'id': '@guid',
            'name': '@ctitle()'
        }
    ]
})
Mock.mock(/getSelectList/,function() {
    
    return {
        custom: data.list
    }
})
// 获取已选中的表的数据
Mock.mock(/getCheckedList/,function() {
    return {
        custom: data.list.slice(0,3)
    }
})

Mock.mock(/saveSelectData/,function(opt) {
    console.log(opt.body);
    return {
        custom: {}
    }
})