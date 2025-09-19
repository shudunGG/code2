Mock.mock(Util.getRightUrl(getAllPageUrl), function (opt) {
    console.log(window.decodeURIComponent(opt.body).split('&'));
    var data = Mock.mock({
        defaultPage: '',
        "pages|5-10": [{
            pageId: '@integer(10,20)',
            name: '界面@integer(1,10)',
            // preview: '@image(200x150)',
            preview: 'frame/fui/pages/themes/umplatform/images/skinbg/@integer(1,14).jpg',
            // preview: '@image()',
            url: 'frame/fui/pages/themes/umplatform/umplatform.proto.html?pageId=@id'
        }]
    });
    // data.push()
    data.defaultPage = data.pages[2].pageId;
    data.pages[1].pageId=12;
    return data;
});

Mock.mock(Util.getRightUrl(setPageUrl), function (opt) {
    console.log('设置默认界面', window.decodeURIComponent(opt.body).split('&'));
    return JSON.stringify({
        status: 'success'
    });
});