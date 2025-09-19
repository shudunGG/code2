//左侧菜单接口数据
Mock.mock(Util.getRightUrl("test/leftMenu"), function(opt) {
	var emt = opt.body, content;
	var newTable = {
		custom : {
			navList : [ {
				name : "输入组件", // 类型名称
				typeicon : "images/add-icon/input.png", // 类型图标
				list : [ {
					name : "生成记录",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/random.png",
					icon : "images/icon/random.png",
					maxLinks : "",
					url : "./transassembly/rowgenerator.html",
					type : "com.epoint.dxp.development.trans.steps.RowGeneratorStep",
					introduce : "生成记录组件",
					banwrong:1
				}, {
					name : "生成随机数",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/random.png",
					icon : "images/icon/random.png",
					maxLinks : "",
					url : "./transassembly/randomData.html",
					type : "com.epoint.dxp.development.trans.steps.RandomDataStep",
					introduce : "随机数组件",
					banwrong:1
				}, {
					name : "表输入",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/input-table.png",
					icon : "images/icon/input-table.png",
					maxLinks : "",
					url : "./transassembly/tableInput.html",
					type : "com.epoint.dxp.development.trans.steps.TableInputStep",
					introduce : "从数据库中读取信息",
					banwrong:1
				}, {
					name : "JSON输入",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/jsoninput.png",
					icon : "images/icon/jsoninput.png",
					url : "./transassembly/jsoninput.html",
					type : "com.epoint.dxp.development.trans.steps.JsonInputStep",
					introduce : "JSON解析",
					banwrong:1
				}, {
					name : "xml解析",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/getdatafromxml.png",
					icon : "images/icon/getdatafromxml.png",
					url : "./transassembly/getxmldata.html",
					type : "com.epoint.dxp.development.trans.steps.GetXmlDataStep",
					introduce : "XML解析",
					banwrong:1
				}, {
					name : "获取系统信息",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/systemdata.png",
					icon : "images/icon/systemdata.png",
					maxLinks : "",
					url : "./transassembly/systemdata.html",
					type : "com.epoint.dxp.development.trans.steps.SystemDataStep",
					introduce : "获取系统信息，例如时间、日期",
					banwrong:1
				},{
					name : "kafka消费者",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/jsonoutput.png",
					icon : "images/icon/jsonoutput.png",
					maxLinks : "",
					url : "./transassembly/kafkaconsumer.html",
					type : "com.epoint.dxp.development.trans.steps.KafkaConsumerStep",
					introduce : "kafka消费者",
				}, {
					name : "hadoopfileinput",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/hadoop-file-input.png",
					icon : "images/icon/hadoop-file-input.png",
					maxLinks : "",
					url : "./transassembly/hadoopfileinput.html",
					type : "com.epoint.dxp.development.trans.steps.HadoopFileInputStep",
					introduce : "hadoop文件输入（hdfs）",
					banwrong:1
				}, {
					name : "hbaseinput",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/hbase-input.png",
					icon : "images/icon/hbase-input.png",
					maxLinks : "",
					url : "./transassembly/hbaseinput.html",
					type : "com.epoint.dxp.development.trans.steps.HbaseInputStep",
					introduce : "hbase输入",
					banwrong:1
				}]
			}, {
				name : "输出组件",
				typeicon : "images/add-icon/output.png",
				list : [

				{
					name : "删除",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/del.png",
					icon : "images/icon/del.png",
					maxLinks : "",
					url : "./transassembly/delete.html",
					type : "com.epoint.dxp.development.trans.steps.DeleteFieldStep",
					introduce : "删除组件"
				}, {
					name : "插入更新",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/updata.png",
					icon : "images/icon/updata.png",
					maxLinks : "",
					url : "./transassembly/insertandupdate.html",
					type : "com.epoint.dxp.development.trans.steps.InsertAndUpdateStep",
					introduce : "利用查询关键字在表中搜索行，进行插入和更新操作"
				}, {
					name : "数据同步",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/synchrodata.png",
					icon : "images/icon/synchrodata.png",
					maxLinks : "",
					url : "./transassembly/synchrodata.html",
					type : "com.epoint.dxp.development.trans.steps.SynchrodataStep",
					introduce : "数据同步组件"
				}, {
					name : "表输出",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/table-put.png",
					icon : "images/icon/table-put.png",
					maxLinks : "",
					url : "./transassembly/tableOutput.html",
					type : "com.epoint.dxp.development.trans.steps.TableOutPutStep",
					introduce : "存储信息到数据库表中"
				}, {
					name : "更新",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/updata-icon.png",
					icon : "images/icon/updata-icon.png",
					maxLinks : "",
					url : "./transassembly/update.html",
					type : "com.epoint.dxp.development.trans.steps.UpdateStep",
					introduce : "基于关键字更新记录到数据库",
				}, {
					name : "XML output",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/xmloutput.png",
					icon : "images/icon/xmloutput.png",
					maxLinks : "",
					url : "./transassembly/xmloutput.html",
					type : "com.epoint.dxp.development.trans.steps.XmlOutputStep",
					introduce : "输出xml格式的记录",
				}, {
					name : "Json Output",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/jsonoutput.png",
					icon : "images/icon/jsonoutput.png",
					maxLinks : "",
					url : "./transassembly/jsonoutput.html",
					type : "com.epoint.dxp.development.trans.steps.JsonOutputStep",
					introduce : "输出json格式的记录",
				}, {
					name : "MPP输出",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/jsonoutput.png",
					icon : "images/icon/jsonoutput.png",
					maxLinks : "",
					url : "./transassembly/mppoutput.html",
					type : "com.epoint.dxp.development.trans.steps.MppOutputStep",
					introduce : "MPP输出",
				}, {
					name : "Kafka生产者",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/systemdata.png",
					icon : "images/icon/systemdata.png",
					maxLinks : "",
					url : "./transassembly/kafkaproducer.html",
					type : "com.epoint.dxp.development.trans.steps.KafkaProducerStep",
					introduce : "kafka生产者",
				}, {
					name : "hadoopfileoutput",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/hadoop-file-output.png",
					icon : "images/icon/hadoop-file-output.png",
					maxLinks : "",
					url : "./transassembly/hadoopfileoutput.html",
					type : "com.epoint.dxp.development.trans.steps.HadoopFileOutputStep",
					introduce : "hadoop文件输出（hdfs）",
				}, {
					name : "hbaseoutput",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/hbase-output.png",
					icon : "images/icon/hbase-input.png",
					maxLinks : "",
					url : "./transassembly/hbaseoutput.html",
					type : "com.epoint.dxp.development.trans.steps.HbaseOutputStep",
					introduce : "hbase输出",
				}]
			}, {
				name : "转换组件",
				typeicon : "images/add-icon/change.png",
				list : [
				{
					name : "值映射",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/value-icon.png",
					icon : "images/icon/value-icon.png",
					url : "./transassembly/valueMapping.html",
					type : "com.epoint.dxp.development.trans.steps.ValueMappingStep",
					introduce : "值映射组件",
					banwrong:1
				}, {
					name : "字符串替换",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/string-replace.png",
					icon : "images/icon/string-replace.png",
					url : "./transassembly/stringreplace.html",
					type : "com.epoint.dxp.development.trans.steps.StringReplaceStep",
					introduce : "字符串替换组件",
					banwrong:1
				}, {
					name : "日期格式化",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/date-change.png",
					icon : "images/icon/date-change.png",
					url : "./transassembly/dateFormat.html",
					type : "com.epoint.dxp.development.trans.steps.DateFormatStep",
					introduce : "日期格式化组件",
					banwrong:1
				}, {
					name : "增加常量",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/add-constant.png",
					icon : "images/icon/add-constant.png",
					url : "./transassembly/addConstants.html",
					type : "com.epoint.dxp.development.trans.steps.AddConstantsStep",
					introduce : "增加常量组件",
					banwrong:1
				}, {
					name : "去除重复记录",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/uniqueRows.png",
					icon : "images/icon/uniqueRows.png",
					url : "./transassembly/uniquerows.html",
					type : "com.epoint.dxp.development.trans.steps.UniqueRowsStep",
					introduce : "去除重复记录",
					banwrong:1
				}, {
					name : "列拆分为多行",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/splitFieldToRows.png",
					icon : "images/icon/splitFieldToRows.png",
					url : "./transassembly/splitfieldtorows.html",
					type : "com.epoint.dxp.development.trans.steps.SplitFieldToRowsStep",
					introduce : "列拆分为多行",
					banwrong:1
				}, {
					name : "排序记录",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/sortRows.png",
					icon : "images/icon/sortRows.png",
					url : "./transassembly/sortrows.html",
					type : "com.epoint.dxp.development.trans.steps.SortRowsStep",
					introduce : "排序记录",
					banwrong:1
				}, {
					name : "剪切字符串",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/stringcut.png",
					icon : "images/icon/stringcut.png",
					url : "./transassembly/stringcut.html",
					type : "com.epoint.dxp.development.trans.steps.StringCutStep",
					introduce : "剪切字符串",
					banwrong:1
				}, {
					name : "将字段值设置为常量",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/setvalueconstant.png",
					icon : "images/icon/setvalueconstant.png",
					url : "./transassembly/setvalueconstant.html",
					type : "com.epoint.dxp.development.trans.steps.SetValueConstantStep",
					introduce : "将字段值设置为常量",
					banwrong:1
				}, {
					name : "字符串操作",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/stringoperations.png",
					icon : "images/icon/stringoperations.png",
					url : "./transassembly/stringoperations.html",
					type : "com.epoint.dxp.development.trans.steps.StringOperationsStep",
					introduce : "字符串操作",
					banwrong:1
				} , {
					name : "增加序列",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/add-sequence.png",
					icon : "images/icon/add-sequence.png",
					url : "./transassembly/addsequence.html",
					type : "com.epoint.dxp.development.trans.steps.AddSequenceStep",
					introduce : "增加序列",
					banwrong:1
				}, {
					name : "sm4加密",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/sm4encrypt.png",
					icon : "images/icon/sm4encrypt.png",
					url : "./transassembly/sm4encrypt.html",
					type : "com.epoint.dxp.development.trans.steps.Sm4EncryptStep",
					introduce : "sm4加密",
					banwrong:1
				}, {
					name : "sm4解密",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/sm4decrypt.png",
					icon : "images/icon/sm4decrypt.png",
					url : "./transassembly/sm4decrypt.html",
					type : "com.epoint.dxp.development.trans.steps.Sm4DecryptStep",
					introduce : "sm4解密",
					banwrong:1
				} ]
			},
			{
				name : "应用组件",
				typeicon : "images/add-icon/flow.png",
				list : [
				{
					name : "空操作",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/dummy.png",
					icon : "images/icon/dummy.png",
					url : "",
					type : "com.epoint.dxp.development.trans.steps.dummyStep",
					introduce : "空操作组件",
					banwrong:1
				}, {
					name : "转换状态日志",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/transstauslog.png",
					icon : "images/icon/transstauslog.png",
					url : "./transassembly/transstatuslog.html",
					type : "com.epoint.dxp.development.trans.steps.TransStatusLogStep",
					introduce : "转换状态日志",
					banwrong:1
				}, {
					name : "过滤记录",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/filterrows.png",
					icon : "images/icon/filterrows.png",
					url : "./transassembly/filterrows.html",
					type : "com.epoint.dxp.development.trans.steps.FilterRowsStep",
					introduce : "过滤记录",
					banwrong:1
				}, {
					name : "Switch/case",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/switch-case.png",
					icon : "images/icon/switch-case.png",
					url : "./transassembly/switchcase.html",
					type : "com.epoint.dxp.development.trans.steps.SwitchCaseStep",
					introduce : "Switch/case",
					banwrong:1
				}, {
					name : "设置变量",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/setVariable.png",
					icon : "images/icon/setVariable.png",
					url : "./transassembly/setvariable.html",
					type : "com.epoint.dxp.development.trans.steps.SetVariableStep",
					introduce : "设置变量",
					banwrong:1
				}, {
					name : "获取变量",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/getVariable.png",
					icon : "images/icon/getVariable.png",
					url : "./transassembly/getvariable.html",
					type : "com.epoint.dxp.development.trans.steps.GetVariableStep",
					introduce : "获取变量",
					banwrong:1
				}, {
					name : "复制记录到结果",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/rowsToResult.png",
					icon : "images/icon/rowsToResult.png",
					url : "./transassembly/rowstoresult.html",
					type : "com.epoint.dxp.development.trans.steps.RowsToResultStep",
					introduce : "复制记录到结果",
					banwrong:1
				}, {
					name : "从结果获取记录",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/rowsFromResult.png",
					icon : "images/icon/rowsFromResult.png",
					url : "./transassembly/rowsfromresult.html",
					type : "com.epoint.dxp.development.trans.steps.RowsFromResultStep",
					introduce : "从结果获取记录",
					banwrong:1
				}, {
					name : "记录集连接",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/mergeJoin.png",
					icon : "images/icon/mergeJoin.png",
					url : "./transassembly/mergejoin.html",
					type : "com.epoint.dxp.development.trans.steps.MergeJoinStep",
					introduce : "记录集连接",
					banwrong:1
				}, {
					name : "写日志",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/writetolog.png",
					icon : "images/icon/writetolog.png",
					url : "./transassembly/writetolog.html",
					type : "com.epoint.dxp.development.trans.steps.WriteToLogStep",
					introduce : "写日志",
					banwrong:1
				}, {
					name : "二进制转base64",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/switch-case.png",
					icon : "images/icon/switch-case.png",
					url : "./transassembly/tobase64.html",
					type : "com.epoint.dxp.development.trans.steps.ToBase64Step",
					introduce : "二进制转base64",
					banwrong:1
				}]
			} ,
			{
				name : "查询组件",
				typeicon : "images/add-icon/interface.png",
				list : [
					{
						name : "数据库查询",
						guid : Mock.mock("@guid"),
						iconsmall : "images/add-icon/input-table.png",
						icon : "images/icon/input-table.png",
						maxLinks : "",
						url : "./transassembly/databasequery.html",
						type : "com.epoint.dxp.development.trans.steps.DatabaseLookupStep",
						introduce : "允许在数据库表中查找值",
						banwrong:1
					}, {
						name : "REST client",
						guid : Mock.mock("@guid"),
						iconsmall : "images/add-icon/restclient.png",
						icon : "images/icon/restclient.png",
						maxLinks : "",
						url : "./transassembly/rest.html",
						type : "com.epoint.dxp.development.trans.steps.RestStep",
						introduce : "REST client",
						banwrong:1
					}, {
						name : "调用DB存储过程",
						guid : Mock.mock("@guid"),
						iconsmall : "images/add-icon/dbproc.png",
						icon : "images/icon/dbproc.png",
						maxLinks : "",
						url : "./transassembly/dbproc.html",
						type : "com.epoint.dxp.development.trans.steps.DBProcStep",
						introduce : "通过调用数据库存储过程获得返回值",
						banwrong:1
					}, {
						name : "检查表是否存在",
						guid : Mock.mock("@guid"),
						iconsmall : "images/add-icon/tableexists.png",
						icon : "images/icon/tableexists.png",
						maxLinks : "",
						url : "./transassembly/tableexists.html",
						type : "com.epoint.dxp.development.trans.steps.TableExistsStep",
						introduce : "检查表是否存在",
						banwrong:1
					}]
			},
			{
				name : "脚本组件",
				typeicon : "images/add-icon/foot.png",
				list : [
				{
					name : "执行sql脚本",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/execute-sql.png",
					icon : "images/icon/execute-sql.png",
					url : "./transassembly/execsql.html",
					type : "com.epoint.dxp.development.trans.steps.ExecSQLStep",
					introduce : "执行sql脚本组件",
					banwrong:1
				},{
					name : "JavaScript代码",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/execute-javascript.png",
					icon : "images/icon/execute-javascript.png",
					url : "./transassembly/execjavascript.html",
					type : "com.epoint.dxp.development.trans.steps.ExecJavaScriptStep",
					introduce : "JavaScript代码组件",
					banwrong:1
				},{
					name : "正则表达式",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/execute-regexp.png",
					icon : "images/icon/execute-regexp.png",
					url : "./transassembly/execregexp.html",
					type : "com.epoint.dxp.development.trans.steps.ExecRegexpStep",
					introduce : "正则表达式组件",
					banwrong:1
				},{
					name : "java代码",
					guid : Mock.mock("@guid"),
					iconsmall : "images/add-icon/java.png",
					icon : "images/icon/java.png",
					url : "./transassembly/execjavacode.html",
					type : "com.epoint.dxp.development.trans.steps.ExecJavaCodeStep",
					introduce : "java代码",
					banwrong:1
				}]
			}
		  ]
		}
	};
	return newTable;
});

function GetQueryString(url, name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = url.substr(0).match(reg);
	var context = "";
	if (r != null)
		context = decodeURIComponent(r[2]);
	reg = null;
	r = null;
	return context == null || context == "" || context == "undefined" ? ""
			: context;
}

// 运行接口
Mock.mock(Util.getRightUrl("test/logDataUrl"), function(opt) {
	var emt = opt.body, content;

	var newData = JSON.parse(decodeURIComponent(emt).split("=")[1]);

	// 生成随机数
	function randNum(m, n) {
		if (!n) {
			return Math.floor(Math.random() * m);
		}
		var c = n - m + 1;
		return Math.floor(Math.random() * c + m);
	}

	var mockIndex = randNum(2, 6);

	if (mockIndex == 5) {
		newData.complete = true;
	} else {
		newData.complete = false;
	}

	$.each(newData.nodeDataArray, function(i, item) {
		if (i % 2 == 0) {
			item.success = true;
			item.successicon = "images/success-icon.png";
			item.time = "2分01秒";
		} else {
			item.success = false;
			item.successicon = "images/fail-icon.png";
			item.time = "2分01秒";
		}
	});

	mockJson = {
		custom : newData
	};

	return mockJson;
});


/*
 * { name: "CSV文件输入", //节点名称 guid: Mock.mock("@guid"), //GUID iconsmall:
 * "images/add-icon/csv-icon.png", //小图标 icon: "images/icon/csv-icon.png", //大图标
 * maxLinks: "1", //最大连线书 url: "./edit.html", //编辑地址 type: Mock.mock("@guid"),
 * //类型guid introduce: "此处为介绍内容" //介绍内容 }, { name: "Excel输入", guid:
 * Mock.mock("@guid"), iconsmall: "images/add-icon/excel-icon.png", icon:
 * "images/icon/excel-icon.png", maxLinks: "", url: "./edit.html", type:
 * Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name: "GetdataformXML", guid:
 * Mock.mock("@guid"), iconsmall: "images/add-icon/getdata.png", icon:
 * "images/icon/getdata.png", maxLinks: "", url: "./edit.html", type:
 * Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name: "JSONinput", guid:
 * Mock.mock("@guid"), iconsmall: "images/add-icon/jsoninput.png", icon:
 * "images/icon/jsoninput.png", maxLinks: "", url: "./edit.html", type:
 * Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name: "文本文件输入", guid:
 * Mock.mock("@guid"), iconsmall: "images/add-icon/file.png", icon:
 * "images/icon/file.png", maxLinks: "", url: "./edit.html", type:
 * Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name: "生成记录", guid:
 * Mock.mock("@guid"), iconsmall: "images/add-icon/recode.png", icon:
 * "images/icon/recode.png", maxLinks: "", url: "./edit.html", type:
 * Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name: "生成随机信用卡号", guid:
 * Mock.mock("@guid"), iconsmall: "images/add-icon/card.png", icon:
 * "images/icon/card.png", maxLinks: "", url: "./edit.html", type:
 * Mock.mock("@guid"), introduce: "此处为介绍内容" },
 *  { name: "获取系统信息", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/info.png", icon: "images/icon/info.png", maxLinks: "", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name:
 * "获取表名", guid: Mock.mock("@guid"), iconsmall: "images/add-icon/table.png",
 * icon: "images/icon/table.png", maxLinks: "", url: "./edit.html", type:
 * Mock.mock("@guid"), introduce: "此处为介绍内容" },
 */
/*
 * { name: "Excel输出", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/excel-output.png", icon: "images/icon/excel-output.png",
 * maxLinks: "1", url: "./edit.html", type: Mock.mock("@guid"), introduce:
 * "此处为介绍内容" }, { name: "JSONoutput", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/jsonoutput.png", icon: "images/icon/jsonoutput.png",
 * maxLinks: "", url: "./edit.html", type: Mock.mock("@guid"), introduce:
 * "此处为介绍内容" }, { name: "SQL文件输出", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/sql-out.png", icon: "images/icon/sql-out.png", maxLinks: "",
 * url: "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name:
 * "MicrosoftExcel输出", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/mcoutput.png", icon: "images/icon/mcoutput.png", maxLinks:
 * "", url: "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, {
 * name: "XMLoutput", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/xmloutput.png", icon: "images/icon/xmloutput.png", maxLinks:
 * "", url: "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, {
 * name: "插入更新删除", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-cel.png", icon: "images/icon/updata-cel.png",
 * maxLinks: "", url: "./edit.html", type: Mock.mock("@guid"), introduce:
 * "此处为介绍内容" }, { name: "文本文件输出", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/textfile.png", icon: "images/icon/textfile.png", maxLinks:
 * "", url: "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, {
 * name: "更新", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png",
 * maxLinks: "", url: "./edit.html", type: Mock.mock("@guid"), introduce:
 * "此处为介绍内容" },
 */

/*
 * { name: "GetIDfromsalveserver", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/getid.png", icon: "images/icon/getid.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, , { name:
 * "列拆分为多行", guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/list-change.png", icon: "images/icon/list-change.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }
 */

/*
 * ,
 *  { name: "日志组件", typeicon: "images/add-icon/daily.png", list: [ { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" } ] }, { name:
 * "流程组件", typeicon: "images/add-icon/flow.png", list: [ { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" } ] }, { name:
 * "脚本组件", typeicon: "images/add-icon/foot.png", list: [ { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" } ] }, { name:
 * "接口组件", typeicon: "images/add-icon/interface.png", list: [ { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" }, { name:
 * Mock.mock("@ctitle(2,4)"), guid: Mock.mock("@guid"), iconsmall:
 * "images/add-icon/updata-icon.png", icon: "images/icon/updata-icon.png", url:
 * "./edit.html", type: Mock.mock("@guid"), introduce: "此处为介绍内容" } ] }
 */
