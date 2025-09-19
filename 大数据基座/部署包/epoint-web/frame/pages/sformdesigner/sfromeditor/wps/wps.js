var DocFrame;
var IsFileOpened;  //控件是否打开文档
var filetype;//文件类型

if(oaeditor.clientOs =="Win") {
    DocFrame = document.getElementById("DocFrame1");
    //需要隐藏文件的平台可以在这里调用
    DocFrame.MenuItems &= ~MenuItems.FILE;
} else if (oaeditor.clientOs == "Linux"){
    DocFrame=document.getElementById("DocFrame1").Application;

}
//设置文件是打开还是关闭
function  setFileOpenedOrClosed(boolvalue){

    IsFileOpened=boolvalue;
}

//全屏【CTRL+Q退出】)
function FullScreen(){
    DocFrame.FullScreen();
}

//设置是否保留痕迹
function  SetReviewMode(boolvalue){
        //修订模式，开启修订
    var a=DocFrame.enableRevision(boolvalue);
    DocFrame.enableRevision(boolvalue);

}

//设置是否显示痕迹
function setShowRevisions(boolvalue){
    if(boolvalue){
       //为0表示显示修订状态；为1表示显示原始状态(修订前)；为2表示显示最终状态(修订后)。
        DocFrame.showRevision(0);
    }else{
        DocFrame.showRevision(2);
    }
}


//接受或者取消所有修订
function TANGER_OCX_AllRevisions(bool) {
    if (bool) {
        //接受所有的痕迹修订
        //1显示最终状态
       // DocFrame.showRevision(2);
        DocFrame.ActiveDocument.AcceptAllRevisions();
        //2关闭修订模式
        SetReviewMode(false);
    }
    else {
        //拒绝所有的痕迹修订
        //1显示原始状态
        DocFrame.showRevision(1);
        //2关闭修订模式
        SetReviewMode(false);
    }
}



//编辑文档
function OpenEditOffice(url, newofficetype, username) {
    for(var i=0;;i++){
        if(oaeditor.clientOs =="Win") {
            DocFrame = document.getElementById("DocFrame1");
            //需要隐藏文件的平台可以在这里调用
            DocFrame.MenuItems &= ~MenuItems.FILE;
        } else if (oaeditor.clientOs == "Linux"){
            DocFrame=document.getElementById("DocFrame1").Application;

        }
        if(DocFrame)
            break;
    }

	 //设置当前用户的姓名
    try {
        DocFrame.setUserName(username);
    }
    catch (err) {
        //在此处理错误
    }

    //根据文档URL和newofficetype编辑文档,如果有url是编辑已有文档,如果为空根据newofficetype新建文档
    if ((typeof (url) != "undefined") && (url != "")) {
        try {
            //文档地址，打开文件是否只读。
            var date1=new Date();  //开始时间
            var aa = DocFrame.openDocumentRemote(url,false);
            var date2=new Date();    //结束时间
            var date3=date2.getTime()-date1.getTime();
            if(!aa){
                alert("打开文档出现错误，请联系管理员！");
            }
            IsFileOpened = true;
        } catch (err) {
            alert(err);
        }
    }
    else {
        switch (newofficetype) {
            //新建文档
            case "1":
                 //word文档
                DocFrame.createDocument("uot");
                app.createDocument("wps");
                break;
            case "2":
                //excel电子表格
                break;
            case "3":
               //微软幻灯片
                DocFrame.createDocument("uop");
                break;
            case "4":
               //金山文档
                break;
            case "5":
                 //金山电子表格
                break;
            default:
                alert("文档编辑出错!");
                break;
        }
    }
}


//保存到远程
function saveFileToUrl(urlForSave,cmd) {
    var fileName = "11.doc";
    if (IsFileOpened) {

		//urlForSave="http://218.4.136.114:8899/EpointOA9-9.2.9-2/rest/EditOfficeNewAction.action?cmd=save";
		console.log("urlForSave........."+urlForSave);
        var ret = DocFrame.saveURL(urlForSave, fileName);
        if(ret){
            epoint.alert("保存成功","提示", function(){
                if(cmd && cmd=="saveAndClose")
                    epoint.closeDialog();
            });
        }else{
            epoint.alert("保存失败！" );
        }

    }
}

function saveFileToUrlNoAlert(savrUrl) {
    var fileName = "wps.doc";
    var result, filedot;
    if (IsFileOpened) {
        //debugger;
        //alert("savrUrl:" + savrUrl);
        var ret = DocFrame.saveURL(savrUrl, fileName);
        return ret;
    }
    else {
        alert("不能执行保存,没有编辑文档!");
        return false;
    }
}

//设置书签内容
function SetBookmarkValue(bmarkName, bmarkValue) {
    DocFrame.SetBookmarkValue(bmarkName, bmarkValue);
}

function CloseClick() {
    if (!isReadOnly) {
        if (!DocFrame.ActiveDocument.Saved) {
            mini.showMessageBox({
                title: "提醒",
                iconCls: "mini-messagebox-question",
                buttons: ["ok", "no", "cancel"],
                message: "文档修改过，还没有保存，是否需要保存？",
                callback: function (action) {
                    switch (action) {
                        case "ok":
                            saveAndClose();
                            break;
                        case "no":
                            epoint.closeDialog();
                            break;
                    }
                }
            });
            return;
        } else
            epoint.closeDialog();
    } else
        epoint.closeDialog();
}


//打开远程文档
function openDocumentRemote() {
    //文件流地址，是否可编辑
    alert(openUrl);
    //openUrl="";
    var aa = DocFrame.openDocumentRemote(openUrl,false);
}

//插入图片二维码
function attDcodePic(picURL) {
    if (IsFileOpened) {
        // if (DocFrame.doctype == 1 || DocFrame.doctype == 2) {
            try {
               var  b=  DocFrame.ActiveDocument.TrackRevisions;
               SetReviewMode(false);//修订模式
               //var aa=DocFrame.insertPicture(window.location.protocol+"//"+window.location.host+picURL,30,50);

               var endPoint;
               var rg;
               var shp;
               var ishp;
               //DocFrame.DownLoadServerFile(window.location.protocol+"//"+window.location.host+picURL, "/tmp/local.jpg");
               endPoint = DocFrame.ActiveDocument.Content.End;
               rg = DocFrame.ActiveDocument.Range(endPoint, endPoint);
               ishp = DocFrame.ActiveDocument.InlineShapes.AddPicture(window.location.protocol+"//"+window.location.host+picURL, false, true, rg);
               ishp.Width = 150;
               ishp.Height = 26;
               ishp = ishp.ConvertToShape();
               ishp.RelativeHorizontalPosition = 0;
               ishp.RelativeVerticalPosition = 0;
               ishp.RelativeHorizontalSize = 1;
               ishp.RelativeVerticalSize = 1;
               ishp.Left = '-999996';
               ishp.LeftRelative = '-999999';
               ishp.Top = '-999997';
               ishp.TopRelative = '-999999';
               ishp.WidthRelative = '-999999';
               ishp.HeightRelative = '-999999';
               ishp.Select();

               SetReviewMode(b);//恢复回来的修订状态  这样这个方法不会对文档修订状态造成影响
                // DocFrame.AddPicFromURL(picURL, //图片的url地址可以时相对或者绝对地址
                //     true, //是否浮动,此参数设置为false时,top和left无效
                //     287, //left 左边距
                //     657, //top 上边距 根据Relative的设定选择不同参照对象
                //     2,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
                //     100, //缩放印章,默认100%
                //     0);   //0印章位于文字下方,1位于上方
            }
            catch (error) {
            }
        // }
        // else {
        //     alert("不能在该类型文档中使用安全签名印章.");
        // }
    }
}

//显示新建
function SetFileSubmenuItemsVisible(item){
    DocFrame.FileSubmenuItems |= item;
}

//隐藏新建
function SetFileSubmenuItemsHidden(item){
    DocFrame.FileSubmenuItems &= ~item;
}

//新建文档
function createDocument() {
    DocFrame.createDocument("uot");
}

//只读打开本地文档
function openDocumentT() {
    var aa = DocFrame.openDocument('D://000001.wps',true);
}

//可编辑打开本地文档
function openDocumentF() {
    var aa = DocFrame.openDocument('C:\\Users\\Administrator\\Desktop\\2019\\279648_市委便签模板.wpt',false);
}

//保存到本地
function saveAs() {
    var aa = DocFrame.saveAs("D:\\test.pdf");

}


//本地文档保存到远程
function SendDataToServer()
{
    var aa = DocFrame.SendDataToServer("http://192.168.41.8:8080/wps/upload_w.jsp", "D:\\000001.wps", "保存到远程.wps",false);
    alert (aa);
}


function saveURL4()
{
    var aa = DocFrame.saveURL("http://192.168.41.8:8080/wps/upload_w.jsp", "aa测试.ofd", "","",true);
    alert (aa);
}

//打印
function wpsprint() {
    var aa = DocFrame.print();
    alert(aa);
}

//打印/不打印修订文字
function printRevision() {
    var aa = DocFrame.printRevision(0);
    alert(aa);
}

//关闭文档
function wpsclose() {
    var aa = DocFrame.close();
    alert(aa);
}

//保护文档
function enableProtectT() {
    var aa = DocFrame.enableProtect(true);
    alert(aa);
}

//停止保护
function enableProtectF() {
    var aa = DocFrame.enableProtect(false);
    alert(aa);
}

//隐藏全部工具菜单
function setToolbarAllVisibleF() {
    var aa = DocFrame.setToolbarAllVisible(false);
}

//显示全部工具菜单
function setToolbarAllVisibleT() {
    var aa = DocFrame.setToolbarAllVisible(true);
}

//指定坐标处插入图片
function insertPicture() {
    var aa = DocFrame.insertPicture('D:\\图片3.png',50,50,30,60);
    alert(aa);
}

//当前光标处插入图片_浮于文字上方
function insertPicture2()
{
    var aa = DocFrame.insertPicture("D:\\图片3.png",false);
    alert (aa);
}

//当前光标处插入图片_嵌入式
function insertPicture3()
{
    var aa = DocFrame.insertPicture("D:\\图片3.png");
    alert (aa);
}

//显示修订文字的状态
function showRevision() {
    var aa = DocFrame.showRevision(3);
    alert(aa);
}

//开启/停止修订
function enableRevision(boolevalue) {
    var aa = DocFrame.enableRevision(boolevalue);
}

//禁用/启用拒绝修订按钮
function enableRevisionRejectCommand() {
    var aa = DocFrame.enableRevisionRejectCommand(false);
    alert(aa);
}

//禁用/启用接受修订按钮
function enableRevisionAcceptCommand() {
    var aa = DocFrame.enableRevisionAcceptCommand(false);
    alert(aa);
}

//禁用/启用复制
function enableCopy() {
    var aa = DocFrame.enableCopy(false);
    alert(aa);
}

//禁用/启用剪切
function enableCut() {
    var aa = DocFrame.enableCut(false);
    alert(aa);
}

function setUserName() {
    var aa = DocFrame.setUserName("wps");
    alert(aa);
}

function getUserName() {
    var name = DocFrame.getUserName();
    alert(name);
}

//添加公文域1
function insertDocumentField() {;
    var isSuccess = DocFrame.insertDocumentField("wps1");
    alert(isSuccess);
}

function insertDocumentField2() {;
    var isSuccess = DocFrame.insertDocumentField("wps2");
    alert(isSuccess);
}

function insertDocumentField3() {;
    var isSuccess = DocFrame.insertDocumentField("wps3");
    alert(isSuccess);
}
function ShowDocumentFieldTarget1()
{
    var bb = DocFrame.put_ShowDocumentFieldTarget(false);
    alert(bb);

}
function ShowDocumentFieldTarget2()
{
    var bb = DocFrame.ShowDocumentFieldTarget=false;
    alert(bb);
}
function get_ShowDocumentFieldTarget()
{
    var bb = DocFrame.get_ShowDocumentFieldTarget();
    alert(bb);
}
function setDocumentField() {
    var isSuccess = DocFrame.setDocumentField("发文机关", "value");
    alert(isSuccess);
}

function getAllDocumentField() {
    var list = DocFrame.getAllDocumentField();
    var strs = new Array();
    strs = list.split(",");
    alert(strs);
}

function deleteDocumentField() {
    var isSuccess = DocFrame.deleteDocumentField("wps1");
    alert(isSuccess);
}

function showDocumentFieldT() {
    var isSuccess = DocFrame.showDocumentField("wps1",true);
    alert(isSuccess);
}
function showDocumentFieldF() {
    var isSuccess = DocFrame.showDocumentField("wps1",false);
    alert(isSuccess);
}

function enableDocumentFieldT() {
    var isSuccess = DocFrame.enableDocumentField("wps1",true);
    alert(isSuccess);
}
function enableDocumentFieldF() {
    var isSuccess = DocFrame.enableDocumentField("wps1",false);
    alert(isSuccess);
}

function getDocumentFieldValue() {
    var value = DocFrame.getDocumentFieldValue("wps1");
    alert(value);
}
function insertDocument() {
    var value = DocFrame.insertDocument("wps1", 'd:\\11.wps');
    alert(value);
}
function getText() {
    var value = DocFrame.getText();
    alert(value);
}
function get_Content() {
    var value = DocFrame.Activement.get_Conten();
    alert(value);
}
function backspace() {
    var id = DocFrame.backspace();
    alert(id);
}
function insertText() {
    var id = DocFrame.insertText("kingsoft");
    alert(id);
}
function cursorToDocumentField() {
    var id = DocFrame.cursorToDocumentField("wps1", 3);
    alert(id);
}
function cursorToDocumentField5() {
    var id = DocFrame.cursorToDocumentField("wps1", 5);
    alert(id);
}
function setDocumentId() {
    var id = DocFrame.setDocumentId("kingsoft");
    alert(id);
}
function getDocumentId() {
    var id = DocFrame.getDocumentId();
    alert(id);
}
function setDocumentType() {
    var ret = DocFrame.setDocumentType("决定");
    alert(ret);
}
function getDocumentType() {
    var type = DocFrame.getDocumentType();
    alert(type);
}
function DocFieldsProtectExcept() {
    DocFrame.DocFieldsProtectExcept("wps");
}
function DocFieldsUnProtectExcept() {
    DocFrame.DocFieldsUnProtectExcept("wps");
}
function get_Saved() {
    var isSaved = DocFrame.get_Saved();
    alert(isSaved);
}
function put_Saved() {
    DocFrame.put_Saved(true);
}
function insertMultiAuthor()
{
    DocFrame.insertMultiAuthor(",");
}
function setDocumentMultiField()
{
    var ret = DocFrame.getAllDocumentField();
    var fieldArr = ret.split(",");
    var yus = "";
    var values = "";
    //var splitStr = ",";
    for(var i = 0; i < fieldArr.length; i++){
        var yu = fieldArr[i];

        yus += yu;
        values += i
        if(i != fieldArr.length - 1){
            yus += "@#_*@";
            values += "@#_*@";
        }
    }
    DocFrame.setDocumentMultiField(yus,values,true);
}

function get_Build()
{
    var build = DocFrame.DocObj.Application.Build;
    alert(build);
}
function getPluginVersion()
{
    var build = DocFrame.getPluginVersion();
    alert(build);
}
function ofdoptions1(){
    var value = DocFrame.ActiveDocument.Application.OfdExportOptions;
    value.SelectServiceProvider = 1;
    alert(value.SelectServiceProvider);
}
function ofdoptions2(){
    var value = DocFrame.ActiveDocument.Application.OfdExportOptions;
    value.SelectServiceProvider = 0;
    alert(value.SelectServiceProvider);
}
function insertDocument_http_session() {
    var value = DocFrame.insertDocument("wps1", 'http://192.168.41.8:8080/wps/download.jsp?name=3.wps');
    alert(value);
}

function getFileSize(){
    var filename = prompt("请输入文件路径","");
    var saveformat = prompt("请输入文件后缀","")
    alert(DocFrame.getFileSize(filename,saveformat));
}
function saveURL2() {
    var name=prompt("请输入要保存的名称","test1.ofd")
    if (name!=null && name!=""){
        var ret = DocFrame.saveURL("http://192.168.41.8:8080/wps/upload_w.jsp", name,"aa","bb");
        alert(ret);
    }


}
function saveURL3() {

    // var pdfOptions = DocFrame.get_PdfExportOptions();
    // var ret = pdfOptions.put_ConvertSummaryInfo(false);
    //通过设置ConvertSummaryInfo的值控制是否导出文档信息
    DocFrame.ActiveDocument.Application.PdfExportOptions.ConvertSummaryInfo = false;


    var name=prompt("请输入要保存的名称","test1.ofd")
    if (name!=null && name!=""){
        var ret = DocFrame.saveURL("http://192.168.41.8:8080/wps/upload_w.jsp", name,"aa","bb");
        alert(ret);
    }

}
function disable_ctrl_p(){
    DocFrame.DisabledHotKeys = "(ctrl+p)";
}
function enable_ctrl_p(){
    DocFrame.DisabledHotKeys = "";
}

function insert_document(){
    alert(DocFrame.insertDocument('正文', 'ftp://ftptest:123456@192.168.41.8/test/ftp.doc'));
}
function FitText()
{
    alert (DocFrame.ActiveDocument.Application.Selection.Cells.Item(1).FitText=true);
}
function FitText2()
{
    alert (DocFrame.ActiveDocument.DocumentFields.Item("发文机关名称").Range.Cells.Item(1).FitText=true);
}


 //设置书签内容
function SetBookmarkValue(bmarkName, bmarkValue) {
    DocFrame.ActiveDocument.Bookmarks.Item(bmarkName).Range.Text=bmarkValue;
}

//检测书签是否存在
function checkBookmarkIsExist(bmarkName){
    return DocFrame.ActiveDocument.BookMarks.Exists(bmarkName);
}

//一键套红相关
function setOneKeyReadHead(obj) {
        if (obj != null && obj != 'undefined') {
                var BookMarkName = "zhengwen";
                var curSel;
                TANGER_OCX_SetMarkModify(false);
                //套红时如果当前文档有正文书签，认为已经套过红，重复套红时需要提取正文书签的内容，而不是整个文档

                 //console.log(DocFrame.ActiveDocument.BookMarks);
                 //console.log(DocFrame.ActiveDocument.BookMarks.Exists(BookMarkName));
                if (DocFrame.ActiveDocument.BookMarks.Exists(BookMarkName)) {
                    //选择正文内容
                    var bookmark_zw ;
                    if(browser =="IE"){
                        bookmark_zw = DocFrame.ActiveDocument.BookMarks(BookMarkName);
                    }else{
                        bookmark_zw = DocFrame.ActiveDocument.BookMarks.Item(BookMarkName);
                    }
                    var curSel = bookmark_zw.Range;
                    curSel.Cut();
                }
                else {
                    //选择对象当前文档的所有内容
                    if(oaeditor.clientOs =="Win") {
                        curSel = DocFrame.ActiveDocument.Application.Selection;
                    } else if (oaeditor.clientOs == "Linux"){
                        curSel = DocFrame.ActiveDocument.Selection;
                    }
                    curSel.WholeStory();
                    curSel.Cut();

                }
                //插入模板
               // DocFrame.OpenFromURL(Util.getRootPath() + "attachAction.action?cmd=getContent&attachGuid=" + obj);
                var aa = DocFrame.openDocumentRemote(Util.getRootPath() + "attachAction.action?cmd=getContent&attachGuid=" + obj,false);

                    var BookMarkName = "zhengwen";
                    if (!DocFrame.ActiveDocument.BookMarks.Exists(BookMarkName)) {
                        alert("正文模板中不存在名称为：\"" + BookMarkName
                                + "\"的书签，请联系管理员配置！");
                        openAttach();
                        return;
                    }
                     var  a=  DocFrame.ActiveDocument.TrackRevisions;
                     SetReviewMode(false);//修订模式
                    var bkmkObj = DocFrame.ActiveDocument.BookMarks.Item(BookMarkName);
                    var saverange = bkmkObj.Range;
                    saverange.Paste();
                    DocFrame.ActiveDocument.Bookmarks.Add(BookMarkName, saverange);
                    TANGER_OCX_SetMarkModify(true);
                    SetReviewMode(a);//恢复回来的修订状态  这样这个方法不会对文档修订状态造成影响


                AutoUpdate();

        }
    }

    function TANGER_OCX_SetMarkModify(boolvalue) {
        TANGER_OCX_SetReviewMode(boolvalue);
        TANGER_OCX_EnableReviewBar(!boolvalue);
    }

    function TANGER_OCX_EnableReviewBar(boolvalue) {
        if(browser =="IE"){
            DocFrame.ActiveDocument.CommandBars("Reviewing").Enabled = boolvalue;
            DocFrame.ActiveDocument.CommandBars("Track Changes").Enabled = boolvalue;
            DocFrame.IsShowToolMenu = boolvalue; //关闭或打开工具菜单
        }else{
            DocFrame.ActiveDocument.CommandBars.get_Item("Reviewing").Enabled = boolvalue;
            DocFrame.ActiveDocument.CommandBars.get_Item("Track Changes").Enabled = boolvalue;
            //DocFrame.IsShowToolMenu = boolvalue; //关闭或打开工具菜单
        }
    }

    function TANGER_OCX_SetReviewMode(boolvalue) {
	    //进入痕迹保留状态
        DocFrame.ActiveDocument.TrackRevisions = boolvalue;
    }