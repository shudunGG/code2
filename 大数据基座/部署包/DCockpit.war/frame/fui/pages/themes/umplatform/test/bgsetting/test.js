Mock.mock(Util.getRightUrl(getAllBgUrl), function (opt) {
    console.log('获取所有背景图', window.decodeURIComponent(opt.body).split('&'));
    var data = Mock.mock({
        "list|5-14": ['frame/fui/pages/themes/umplatform/images/skinbg/@integer(1,14).jpg']
    }).list;
    data.push('frame/fui/pages/themes/umplatform/images/skinbg/bg.jpg');
    console.log(JSON.stringify(data, 0, 4));
    return data;
});

Mock.mock(Util.getRightUrl(setBgUrl), function (opt) {
    console.log('设置背景图', window.decodeURIComponent(opt.body).split('&'));
    return JSON.stringify({
        status: 'success'
    });
});