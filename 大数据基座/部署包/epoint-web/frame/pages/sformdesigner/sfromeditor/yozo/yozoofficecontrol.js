/*
*applet嵌入网页时需加载的方法
*/


function init(tagID,width,height){
		var iframe;
		iframe = document.getElementById(tagID);
		var codes=[];   
		//codes.push("");
		codes.push("<embed id='webyozo_id' type='application/yozo-plugin' width='100%' height='100%'>");
		iframe.innerHTML = codes.join("");
		obj = document.getElementById("webyozo_id");
		return obj;
}

init("officecontrol", "100%", "100%");