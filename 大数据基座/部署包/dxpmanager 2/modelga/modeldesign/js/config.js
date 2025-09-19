var domain = 'test/';
var nodeData;
var stepId;
var pageConfig = {
    leftMenu: epoint.dealRestfulUrl("../../rest/dxpmodeldesignjobaction/getLeftJsonnew"), // 左侧菜单
    getContent:  epoint.dealRestfulUrl("../../rest/dxpmodeldesignjobaction/getDesignData"), // 设计数据
    getStepInfoUrl : epoint.dealRestfulUrl("../../rest/dxpmodeldesignjobaction/getStepInfo"),
    deleteDrawNode: domain + 'deleteDrawNode', // 删除节点
    getPreviewData: domain + 'getPreviewData', // 预览数据
    save: domain + 'save', // 保存
    othersave: domain + 'othersave', // 另存
    release: domain + 'release', // 发布
    onShowContextMenu: function (data) {

    },
    // 返回首页
    backHome: function () {
    	location.replace("../../frame/fui/pages/themes/datacenter/datacenter");
    },

    // 顶部图标操作事件
    topClickEvent: function (opt) {
    	var nodes = myDiagram.model.nodeDataArray;
		var nodeKeys = new Array();
		$(nodes).each(function(index, item) {
			nodeKeys.push(item.key);
		});
        var type = opt.type;
        // 保存
        if (type === 'save') {
            var data = handleChart.getData();
            var tempData = JSON.parse(data);
            if (callBackData) {
            	tempData.xms = xms;
            	tempData.hdpType = hdpType;
            	tempData.xmx = xmx;
            	tempData.livyPath = livyPath;
            	tempData.property={changeName:callBackData.changeName};
			}
            epoint.openDialog('模型保存', Util.getRightUrl('modelga/guidemodel/modeledit?flowGuid=' + rowguid+'&savetype=save'), function(param){
            	if(param!='close'){
            		tempData.property.changeName=param;
            		data = JSON.stringify(tempData);
            		callBackData.changeName=param;
            	 epoint.execute('saveData', '',data, function(msg) {
       				if(msg == 'success'){
       				}else{
       					mini.showTips({
                               content: "保存失败",
                               state: "danger",
                               x: "center",
                               y: "center",
                               timeout: 3000
                           });
       				}
       			});
       			}
            }, {
                'width': 800,
                'height': 450
            });
        } else if (type === 'savedata') { // 保存当前画布
             var data = handleChart.getData();
            var tempData = JSON.parse(data);
            if (callBackData) {
            	tempData.xms = xms;
            	tempData.hdpType = hdpType;
            	tempData.xmx = xmx;
            	tempData.livyPath = livyPath;
			}
			data = JSON.stringify(tempData);
            epoint.execute('saveData', '',data, function(msg) {
       				if(msg == 'success'){
       				    mini.showTips({
                               content: "保存成功,请重新发布！",
                               state: "success",
                               x: "center",
                               y: "center",
                               timeout: 2000
                           });
       				}else{
       					mini.showTips({
                               content: "保存失败",
                               state: "danger",
                               x: "center",
                               y: "center",
                               timeout: 3000
                           });
       				}
       			});
        } else if (type === 'othersave') { // 另存
            var data = handleChart.getData();
            if (callBackData) {
            	var property= {
            	}
            	var tempData = JSON.parse(data)
            	tempData.property = property;
            	tempData.xms = xms;
            	tempData.hdpType = hdpType;
            	tempData.xmx = xmx;
            	tempData.livyPath = livyPath;
            	data = JSON.stringify(tempData);
			}
            
            epoint.openDialog('另存为', Util.getRightUrl('modelga/guidemodel/modeledit?flowGuid=' + rowguid+'&savetype=other'), function(param){
            	if(param!='close'){
            	    console.log(param);
            	    var name =param.split(';')[1];
            	    var guid=param.split(';')[0];
            		tempData.property.changeName=param;
            		data = JSON.stringify(tempData);
            	 epoint.execute('otherSaveData', '',[guid,data], function(msg) {
       				if(msg == 'success'){
       				}else{
       					mini.showTips({
                               content: "保存失败",
                               state: "danger",
                               x: "center",
                               y: "center",
                               timeout: 3000
                           });
       				}
       			});}
            }, {
                'width': 800,
                'height': 450
            });
        } else if (type === 'prev') { // 撤销
            handleChart.prev();
        } else if (type === 'next') { // 恢复
            handleChart.next();
        } else if (type === 'clear') { // 清空
            epoint.confirm('是否确认清空？', '提醒', function () {
                handleChart.clear();
                var data = handleChart.getData();
                epoint.execute('saveData', '',data, function(msg) {
       				if(msg == 'success'){
       				    $('.log-preview').addClass('no-data');
                        $('#log-do').empty();
       				    mini.showTips({
                               content: "清空成功",
                               state: "success",
                               x: "center",
                               y: "center",
                               timeout: 3000
                           });
       				}else{
       					mini.showTips({
                               content: "清空失败",
                               state: "danger",
                               x: "center",
                               y: "center",
                               timeout: 3000
                           });
       				}
       			});
            });
        } else if (type === 'scale') { // 缩放

        } else if (type === 'init') { // 定位
            handleChart.init();
        } else if(type === 'del') { // 删除
        	var selectNode = '', selectNodeData = '';
        	if(myDiagram.selection.count>=1){
        		myDiagram.selection.each(function(item) {
					selectNode = item;
					selectNodeData = selectNode.part.data;
				})
        		epoint.execute("deleteStepOrHop", '',[selectNodeData], function(msg) {
        			if(msg.result != '1'){
        				epoint.alert(msg, '', null, 'warning');
        			}else{
        				for(var i=0;i<msg.nextstep.length;i++){
        					var toNode = myDiagram.findNodeForKey(msg.nextstep[i]);
        					if(toNode&&toNode.data.type!="com.epoint.dxp.development.model.flow.steps.TableOutputStep"&&toNode.data.type!='com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep'&&toNode.data.type!='com.epoint.dxp.development.model.flow.steps.CharsViewStep'){
        						//非输出组件
        						epoint.execute("getCountByKey", '',[toNode.data.key], function(count) {
        							if(count!=''){
        								count=count+"条";
        							}
        							myDiagram.model.setDataProperty(
        									toNode.data,
        									"count",
        									count
        							);
        						},true);
        					} 
        				}
        				handleChart.del();
        				//删除后保存
                        var data = handleChart.getData();
                        epoint.execute('saveData', '',data, function(msg) {
                            if(msg == 'success'){
                            }else{
                                mini.showTips({
                                       content: "保存失败",
                                       state: "danger",
                                       x: "center",
                                       y: "center",
                                       timeout: 3000
                                   });
                            }
                        });


        			}
        		});
        	}else{
        		epoint.showTips('请选择一个节点或者连线');
				return;
        	}
        } else if (type === 'do') { // 执行
        	 // 立即执行
        	 var isTransModel = false;
        	 var isDIYModel = false;
        	 console.log(nodes);
             for(var i=0,length=nodes.length;i<length;i++){
            		if(nodes[i].modeltype == 2){
            			// 训练模型不需要输出组件
            			isTransModel = true;
            		}
            		if(nodes[i].modeltype == 3){
                        isTransModel = true;
                        isDIYModel = true;
            		}
             }
        	var dom = $('#func-log');
			$('#datapreview').removeClass('active').siblings().addClass('active');
			$('#log-preview').addClass('hidden').siblings().removeClass('hidden');
			var modelJson = handleChart.getData();
            if(!isDIYModel &&modelJson.indexOf('com.epoint.dxp.development.model.flow.steps.TableInputStep')==-1){
        		epoint.alert('流程中不存在数据来源组件，无法运行！');
        		return;
        	}
        	if(!isTransModel &&modelJson.indexOf('com.epoint.dxp.development.model.flow.steps.TableOutputStep')==-1 && modelJson.indexOf('com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep')==-1
        	&& modelJson.indexOf('com.epoint.dxp.development.model.flow.steps.CharsViewStep')==-1 && modelJson.indexOf('com.epoint.dxp.development.model.flow.steps.WritedataOverwriteStep')==-1){
        		epoint.alert('流程中不存在数据目标组件，无法运行！');
        		return;
        	}
            if (dom.hasClass('cancel-btn')) {
            	epoint.execute('stopJob', '',function(result){
            		if(result.msg == 'success'){
            			epoint.alert('停止成功');
            		}else{
            			epoint.alert('停止失败', '', null, 'warning');
            		}
            	});
                dom.removeClass('cancel-btn');
                dom.text('运行');
            } else {
            	//初始化执行步骤
            	 if (callBackData) {
                  	var property= {
                  			changeName:callBackData.changeName,
                  			paramData:callBackData.paramData
                  	}
                  	var myDiagramData = JSON.parse(myDiagram.model.toJSON());
                  	myDiagramData.property = property;
  				}
            	$('.journal').click();
            	dom.addClass('cancel-btn');
	            dom.text('取消');
	             $('#log-do').empty();
            	//调用后台运行任务
            	 epoint.execute('runFLow', '', JSON.stringify(myDiagramData),function(data){
            	    if(data.msg){
            	          mini.showTips({
                                       content: data.msg,
                                       state: "danger",
                                       x: "center",
                                       y: "center",
                                       timeout: 3000
                                   });
            	    }
            	 },true);
            }
            // todo
            // 这边加载日志
        } else if (type === 'release') { // 发布
            var isTransModel = false;
            var isDIYModel = false;
             for(var i=0,length=nodes.length;i<length;i++){
            		if(nodes[i].modeltype == 2){
            			// 训练模型不需要输出组件
            			isTransModel = true;
            		}
            		if(nodes[i].modeltype == 3){
                        isTransModel = true;
                        isDIYModel = true;
            		}
             }
        	var data = handleChart.getData();
        	if(!isDIYModel&&data.indexOf('com.epoint.dxp.development.model.flow.steps.TableInputStep')==-1){
        		epoint.alert('流程中不存在数据来源组件，无法发布！');
        		return;
        	}
        	if(!isTransModel&&data.indexOf('com.epoint.dxp.development.model.flow.steps.TableOutputStep')==-1 && data.indexOf('com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep')==-1 && data.indexOf('com.epoint.dxp.development.model.flow.steps.CharsViewStep')==-1&& data.indexOf('com.epoint.dxp.development.model.flow.steps.WritedataOverwriteStep')==-1){
        		epoint.alert('流程中不存在数据目标组件，无法发布！');
        		return;
        	}
        	if (callBackData) {
                if(callBackData.changeName.substring(0,4)=='演示模型'){
                    epoint.alert('请先保存后再发布！');
        		    return;
                }
            	var property= {
            			changeName:callBackData.changeName,
            			paramData:mini.decode(callBackData.paramData)
            	}
            	var tempData = JSON.parse(data)
            	tempData.property = property;
            	tempData.xms = xms;
            	tempData.hdpType = hdpType;
            	tempData.xmx = xmx;
            	tempData.livyPath = livyPath;
            	data = JSON.stringify(tempData)
			}
			console.log(data);
            epoint.confirm("确认发布吗", "提示", function() {
				//调用后台发布转换
				epoint.execute('publishJob','',[data],function(result){
					//发布成功或者失败提示
					if(result == 'success'){
						epoint.alert('发布成功','','','success');
						//document.getElementById('design-name').innerHTML=callBackData.changeName;
					}else{
						epoint.alert(result, '', null, 'warning');
					}
				});
            });
        } else if (type === 'layout') { // 一键排版
        	reset();
        }
    },
	
    // 打开配置
    openConfig: function(opt) {
         nodeData = opt.nodeData;
         var nodeData1=nodeData;
         var linkCount = opt.linkCount;
        if(nodeData1.type!="com.epoint.dxp.development.model.flow.steps.TableInputStep"&&linkCount<nodeData1.maxlinks){
        	 mini.showTips({
					content : "请选择"+nodeData1.maxlinks+"个输入源",
					state : "warning",
					x : "center",
					y : "center",
					timeout : 3000
				});
        	 return ;
        }
        //挤入操作类型
        //designConfig.attrType = 2;
        if(nodeData1.url){
        	var url= nodeData1.url+"?nodeGuid="+nodeGuid+"&flowGuid="+flowGuid+"&dsId="+prestoDsId;
        	if(nodeData1.tablename){
        		url+="&tablename="+nodeData1.tablename;
        	}
        	if(nodeData1.tableid){
        		url+="&tableid="+nodeData1.tableid;
        	}
        	epoint.openDialog(nodeData1.name, url,
                      function (param) {
                          //判断弹窗是否直接关闭
                          if (param != 'close') {
                        	  myDiagram.startTransaction('edit');
                              myDiagram.model.setDataProperty(nodeData1, "edit", "edit");
                              myDiagram.model.setDataProperty(nodeData1, "id", param);
                              var stepValue = JSON.parse(param);
                              myDiagram.model.setDataProperty(nodeData1, "name", stepValue.stepName);
                              myDiagram.commitTransaction('edit');
                              if(nodeData1.type!="com.epoint.dxp.development.model.flow.steps.TableOutputStep"
                            	  			&&nodeData1.type!='com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep'
                            	  			&&nodeData1.type!='com.epoint.dxp.development.model.flow.steps.CharsViewStep'
                                            &&nodeData1.type!='com.epoint.dxp.development.model.flow.steps.WritedataOverwriteStep'
                                    		&&nodeData1.modeltype!='1'
                                    		&&nodeData1.modeltype!='2'){
                            	stepId='0';
                                var showcount = mini.get("level").getValue();
                              	$('.log-preview').addClass('data-loading');
                              	epoint.execute("getTablePreView", '',[nodeData1,showcount], function(msg) {
                              	    if(msg.error){
                                            mini.showTips({
                                               content: "运行失败，请查看日志",
                                               state: "danger",
                                               x: "center",
                                               y: "center",
                                               timeout: 3000
                                           });
                              	    }else{
                                        if(msg){
                                            callbackinit(msg);
                                            stepId=nodeData1.key;
                                            console.log(nodeData1);
                                            myDiagram.model.setDataProperty(
                                                    nodeData1,
                                                    "count",
                                                    msg.count+"条"
                                            );
                                            $('#count').html(msg.count);
                                            console.log(nodeData1);
                                        }
                              	    }
                              		$('.log-preview').removeClass('data-loading');
                              		$('.log-preview').removeClass('no-data');
                              	},true);
                                var data = handleChart.getData();
                                epoint.execute('saveData', '',data, function(msg) {
                                    if(msg == 'success'){
                                    }else{
                                        mini.showTips({
                                               content: "保存失败",
                                               state: "danger",
                                               x: "center",
                                               y: "center",
                                               timeout: 3000
                                           });
                                    }
                                },true);
                              }
                          }
                      }, {
                    	    width: 1200,
                    	    height:600
                    	    });
        }
       
    },
    // 节点之间进行连线后
    onLinked: function (opt) {
    	//连线直接创建一个TransHopMeta
        var _count = opt.count, // 当前被连接的节点的连接数
            _toNode = opt.toNode, // 被连接的节点
            _fromNodeKey = opt.fromNodeKey, // 连线的起点
            _firstNodeKey = opt.firstNodeKey, // 第一条连线
            _toNodeMax = Number(_toNode.data.maxLinks), // 被连接的节点最小连线数
            _toNodeMin = Number(_toNode.data.minLinks), // 被连接的节点最大连线数
            _fromNode = opt.fromNode, // fromjiedian
            _fromCount = opt.fromCount, // fromjiedian
            _fromFirstNodeKey = opt.fromFirstNodeKey,
            _toNodeKey = _toNode.data.key,
            _toNodeMaxInput = Number(_toNode.data.maxInputLinks); //被连最大数 0618
            console.log(opt);
            if (_toNode.data.maxInputLinks && _count > _toNode.data.maxInputLinks) {
                removeLink(_fromNodeKey, _toNode.data.key);
                mini.showTips({
					content : "已经达到最大输入连接数，请删除一条输入连线后再试！",
					state : "danger",
					x : "center",
					y : "center",
					timeout : 3000
				});
                return;
            }
            if(_fromNode.data.type!="com.epoint.dxp.development.model.flow.steps.TableInputStep"&&_fromNode.findLinksConnected().count==1){
            	 removeLink(_fromNodeKey, _toNode.data.key);
                 mini.showTips({
						content : "起始节点没有输入源",
						state : "danger",
						x : "center",
						y : "center",
						timeout : 3000
					});
                 return;
            }
            
            if(_fromNode.data.modeltype=='2'){
             	 removeLink(_fromNodeKey, _toNode.data.key);
                  mini.showTips({
						content : "训练算法模型无法连接其他组件",
						state : "danger",
						x : "center",
						y : "center",
						timeout : 3000
					});
                  return;
          }
              
         if(_fromNode.data.modeltype==1&&_toNode.data.type!="com.epoint.dxp.development.model.flow.steps.WritedataOverwriteStep"){
           	 removeLink(_fromNodeKey, _toNode.data.key);
                mini.showTips({
						content : "普通算法模型只能连接算法输出组件",
						state : "danger",
						x : "center",
						y : "center",
						timeout : 3000
					});
                return;
          }    
            
        var data = handleChart.getData();
        epoint.execute('saveData', '',data, function(msg) {
       		if(msg == 'success'){
       		}else{
       			mini.showTips({
                               content: "保存失败",
                               state: "danger",
                               x: "center",
                               y: "center",
                               timeout: 3000
                           });
       			}
       	});
        epoint.execute("createEasyJobHop", '',[_fromNodeKey,_toNodeKey], function(msg) {
    		if(msg != '1'){
    			epoint.alert(msg, '', null, 'warning');
    		}
    	});
        
    },
    // 右键事件
    contextClickEvent: function (opt) {
        var type = opt.type,
            nodeData = opt.nodeData;

        // 配置
        var node = myDiagram.findNodeForKey(nodeData.key);
        if (type === 'config') {
            this.openConfig({
                nodeData: nodeData,
               linkCount:node.findLinksInto().count
            });
        }else if(type === 'sqlpreview'){
            console.log(nodeData);
        if(nodeData.modeltype=='1' || nodeData.modeltype=='2'|| nodeData.modeltype=='3'){
		            		//算法组件不支持SQL预览
		            		mini.showTips({
								content : "算法组件不能进行SQL预览！",
								state : "danger",
								x : "center",
								y : "center",
								timeout : 3000
							});
		            		return;
		            	}else{
        	epoint.openDialog('SQL预览','dxp/datamodel/modelassembly/checksqlpreview?flowGuid='+ flowGuid + "&stepId=" + nodeData.key, '', {
						width : 800,
						height : 600,
						param : {
							sql : nodeData
						}
					});
					}
        } else if(type === 'delete'){
        	epoint.execute("deleteStepOrHop", '',[nodeData], function(msg) {
        		if(msg.result != '1'){
        			epoint.alert(msg, '', null, 'warning');
        		}else{
        			for(var i=0;i<msg.nextstep.length;i++){
	            		var toNode = myDiagram.findNodeForKey(msg.nextstep[i]);
            			if(toNode&&toNode.data.type!="com.epoint.dxp.development.model.flow.steps.TableOutputStep"&&toNode.data.type!='com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep'&&toNode.data.type!='com.epoint.dxp.development.model.flow.steps.CharsViewStep'){
            				//非输出组件
                    		epoint.execute("getCountByKey", '',[toNode.data.key], function(count) {
                        		if(count!=''){
                        			count=count+"条";
                            	}
                        		myDiagram.model.setDataProperty(
                        				toNode.data,
                        				"count",
                        				count
                        		);
                        	},true);
                    	}
        			}
        			handleChart.del();
        		}
        	});
        }
        else if (type === 'preview') { // 预览数据
        	if(nodeData.type=='com.epoint.dxp.development.model.flow.steps.TableOutputStep'||nodeData.type=='com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep'){
        		//输出组件不进行预览
        		 mini.showTips({
					content : "输出组件不能进行预览！",
					state : "danger",
					x : "center",
					y : "center",
					timeout : 3000
				});
        		return;
        	}else if(nodeData.type=='com.epoint.dxp.development.model.flow.steps.CharsViewStep'){
        		//预览图表输出
        		epoint.openDialog('预览','dxp/datamodel/modelflow/modelresultviewchart?flowGuid='+nodeData.key,'',{
                    'width': 800,
                    'height': 520
                });
        		return;
        	}else if(nodeData.modeltype=='1'){
		      		//算法组件预览
		     		epoint.openDialog('预览','dxp/datamodel/modelflow/modelresultviewalgorithm?stepId='+nodeData.key+'&modelGuid='+flowGuid,'',{
		                     'width': 800,
		                     'height': 520
		            });
		       		return;
		    }else if(nodeData.modeltype=='2'){
		            		//训练算法不支持预览
		            		mini.showTips({
								content : "训练算法不能进行预览！",
								state : "danger",
								x : "center",
								y : "center",
								timeout : 3000
							});
		            		return;
		    }else if(nodeData.modeltype=='5'){
		            		//训练算法不支持预览
		            		mini.showTips({
								content : "业务算法组件不能进行预览！",
								state : "danger",
								x : "center",
								y : "center",
								timeout : 3000
							});
		            		return;
		    }
		    if(!nodeData.id){
		        mini.showTips({
					content : "请先配置之后再运行！",
					state : "danger",
					x : "center",
					y : "center",
					timeout : 3000
				});
		        return;
		    }

        	var showcount = mini.get("level").getValue();
        	$('.log-preview').addClass('data-loading');
        	epoint.execute("getTablePreView", '',[nodeData,showcount], function(msg) {
        	     if(msg.error){
                                            mini.showTips({
                                               content: "运行失败，请查看日志",
                                               state: "danger",
                                               x: "center",
                                               y: "center",
                                               timeout: 3000
                                           });
                              	    }

          		if(msg){
	            		callbackinit(msg);
	            		stepId=nodeData.key;
	            		myDiagram.model.setDataProperty(
	            				nodeData,
                			"count",
                			msg.count+"条"
                	);
	            	$('#count').html(msg.count);
          		}
          		$('.log-preview').removeClass('data-loading');
          		$('.log-preview').removeClass('no-data');
          		grid.doLayout();
          	},true);

        } else if (type === 'openpreview') { // 预览
           if(nodeData.type=='com.epoint.dxp.development.model.flow.steps.TableOutputStep'||nodeData.type=='com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep'){
        		//输出组件不进行预览
        		 mini.showTips({
					content : "输出组件不能进行预览！",
					state : "danger",
					x : "center",
					y : "center",
					timeout : 3000
				});
        	}else if(nodeData.type=='com.epoint.dxp.development.model.flow.steps.CharsViewStep'){
        		//预览图表输出
        		epoint.openDialog('预览','dxp/datamodel/modelflow/modelresultviewchart?flowGuid='+nodeData.key+'&modelGuid='+flowGuid,'',{
                    'width': 800,
                    'height': 520
                });
        	}else if(nodeData.modeltype=='1'){
		      		//算法组件预览
		     		epoint.openDialog('预览','dxp/datamodel/modelflow/modelresultviewalgorithm?stepId='+nodeData.key+'&modelGuid='+flowGuid,'',{
		                     'width': 1000,
		                     'height': 520
		            });
		    }else if(nodeData.modeltype=='2'){
		            		//训练算法不支持预览
		            		mini.showTips({
								content : "训练算法不能进行预览！",
								state : "danger",
								x : "center",
								y : "center",
								timeout : 3000
							});
		    }else{
		        if(nodeData.id){
                    epoint.openDialog('预览','dxp/datamodel/modelassembly/prviewdata?stepId='+nodeData.key+'&flowGuid='+flowGuid);
		        }else{
		            mini.showTips({
						content : "请先配置组件后再预览！",
						state : "danger",
						x : "center",
						y : "center",
						timeout : 3000
					});
		        }
		    }
        }  else if (type === 'save') { // 结果保存

        } else if (type === 'copy') { // 复制

        } else if (type === 'delete') { // 删除
        	epoint.execute("deleteStepOrHop", '',[nodeData], function(msg) {
        		if(msg.result != '1'){
        			epoint.alert(msg, '', null, 'warning');
        		}else{
        			for(var i=0;i<msg.nextstep.length;i++){
	            		var toNode = myDiagram.findNodeForKey(msg.nextstep[i]);
            			if(toNode.data.type!="com.epoint.dxp.development.model.flow.steps.TableOutputStep"&&toNode.data.type!='com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep'&&toNode.data.type!='com.epoint.dxp.development.model.flow.steps.CharsViewStep'){
            				//非输出组件
                    		epoint.execute("getCountByKey", '',[toNode.data.key], function(count) {
                        		if(count!=''){
                        			count=count+"条";
                            	}
                        		myDiagram.model.setDataProperty(
                        				toNode.data,
                        				"count",
                        				count
                        		);
                        	},true);
                    	} 
        			}
        			handleChart.del();
        		}
        	});
        }
    },
    /*// 鼠标移入节点
    onMouseEnterNode: function (opt) {
        var $dom = opt.$dom,
            cb = opt.cb,
            data = opt.data;
        console.log(opt);
        var statustext = "";
        if (data.status == '0') {
            statustext = "未运行";
        } else if (data.status == '1') {
            statustext = "执行中";
        } else if (data.status == '2') {
            statustext = "执行失败";
        } else if (data.status == '3') {
            statustext = "执行完成";
        } else if (data.status == '4') {
            statustext = "未连线";
        } else if (data.status == '5') {
            statustext = "参数未配置";
        }
        if (data.message && data.status != '1') {
            statustext = data.message;
        }
        if (!data.number) {
            data.number = 0;
        }
        var tempArr = [{
                "name": "节点名称",
                'val': data.name
            },
            {
                "name": "算子名称",
                'val': data.sfname
            },
            {
                "name": "运行状态",
                'val': statustext
            },
            {
                "name": "总数量",
                'val': data.number
            }
        ]
        $dom.html(Mustache.render(TIP_ITEM_TPL, {
            list: tempArr
        }));

        if (cb && typeof cb == 'function') {
            cb();
        }

    },*/
    // 拖拽后添加节点
    onDropEnd: function (opt) {
        var data = opt.data;

        // var newData = $.extend({}, data, { //复写key
        //     key: Util.uuid(),
        //     count: "3000"
        //     // step : dragged.dataSet.step || 0,
        //     // bagguid : dragged.dataSet.bagguid || '',
        //     // dsid : dragged.dataSet.dsid || '',
        //     // tableid : dragged.dataSet.tableid || ''
        // });

        // myDiagram.model.addNodeData(newData);
        var myDiagramData = JSON.parse(myDiagram.model.toJson());
    	var nodeNameNew = data.name;
    	var nodeKeyNew = data.key;
    	var id={};
    	var sql='';
    	if(data.type=="com.epoint.dxp.development.model.flow.steps.TableInputStep"){
    		//输入类型
    		id.tableName=data.tablename;
    		sql="select * from "+data.tablename;
    		id.sql=sql;
    		id.tableid=data.tableid;
    		nodeKeyNew = uuid();
    		data.key = nodeKeyNew;
    		data.id=epoint.encodeJson(id);
    	}else if(data.type != "com.epoint.dxp.development.flow.steps.TransEntryStep"){
        	nodeNameNew = data.name+myDiagramData.nodeDataArray.length;
        	nodeKeyNew = uuid();
        	data.name = nodeNameNew;
        	data.key = nodeKeyNew;
        	data.id='';
    	}else{
    		data.id='';
    	}
    	//调用后台，先创建一个stepmeta
    	epoint.execute("createEasyStep", '',data, function(msg) {
    		if(msg.result != '1'){
    			epoint.alert(msg.result, '', null, 'warning');
    		}else{
    			// 这个地方的newData格式需要和下面的 onAddNodeData 回调中的 newData 格式一致
                var newData = $.extend({}, data, {
                	name:nodeNameNew
                });
                myDiagram.model.addNodeData(newData);
    			if(msg.sql){
              		var showcount = mini.get("level").getValue();
    				$('.log-preview').addClass('data-loading');
                  	epoint.execute("getTablePreView", '',[newData,showcount], function(msg) {
                  	 if(msg.error){
                          mini.showTips({
                              content: "运行失败，请查看日志",
                              state: "danger",
                              x: "center",
                              y: "center",
                              timeout: 3000
                          });
                     }
                  		if(msg){
      	            		callbackinit(msg);
      	            		stepId=newData.key;
      	            		var id=JSON.parse(newData.id);
                            id.sql=msg.sql;
                            id.prestosql=msg.prestoSql;
                            myDiagram.model.setDataProperty(
                                newData,
                                "id",
                                JSON.stringify(id)
                            );
      	            		myDiagram.model.setDataProperty(
      	            				newData,
                        			"count",
                        			msg.count+"条"
                        	);
      	            		$('#count').html(msg.count);
      	            		nodeData=newData;
                  		}
                  		$('.log-preview').removeClass('data-loading');
                  		$('.log-preview').removeClass('no-data');
                  		grid.doLayout();
                  	},true);
    			}
    			 var chartData = handleChart.getData();
                 epoint.execute('saveData', '',chartData, function(savereturn) {
       				if(savereturn == 'success'){
       				}else{
       					mini.showTips({
                               content: "保存失败",
                               state: "danger",
                               x: "center",
                               y: "center",
                               timeout: 3000
                           });
       				}
       			});
    		}
    	});
    },
    // 双击弹出层节点点击事件
    layerNodeClickEvent: function (opt) {
        var nodeData = opt.data,
            key = Util.uuid();
        console.log(nodeData);
        var newNodeData = $.extend({}, nodeData, {
            key: Util.uuid(),
            classify: "handled"
        })
        myDiagram.model.addNodeData(newNodeData);
        cacheMouseEnterNode = '';
        designLayerEvent.hide();
    },
    addLinkTimer: null,
    // 连线弹出层节点点击事件
    linkLayerNodeClickEvent: function (opt) {
        var that = this;
        var nodeData = opt.data,
            fromData = opt.fromData;
        var newNodeData = $.extend({}, nodeData, {
            key: Util.uuid(),
            count: '',
            classify: "source"

        });
        if (newNodeData.from == 'layer') {
            var _count = 0, // 当前被连接的节点的连接数
                _fromNode =opt.fromNode; // fromjiedian
            if (nodeData.maxInputLinks && _count > nodeData.maxInputLinks) {
                mini.showTips({
					content : "已经达到最大输入连接数，请删除一条输入连线后再试！",
					state : "danger",
					x : "center",
					y : "center",
					timeout : 3000
				});
                return;
            }
            if(fromData.type=='com.epoint.dxp.development.model.flow.steps.TableOutputStep'||fromData.type=='com.epoint.dxp.development.model.flow.steps.TableExternalOutputStep'
            ||fromData.type=='com.epoint.dxp.development.model.flow.steps.CharsViewStep'||fromData.type=='com.epoint.dxp.development.model.flow.steps.WritedataOverwriteStep'){
                 mini.showTips({
					content : "输出组件无法再连接组件！",
					state : "danger",
					x : "center",
					y : "center",
					timeout : 3000
				});
                return;
            }
            
            that.addLinkTimer && clearTimeout(that.addLinkTimer);
            myDiagram.model.addNodeData(newNodeData);
            designLayerEvent.hide();

            that.addLinkTimer = setTimeout(function () {

                myDiagram.model.addLinkData({
                    "from": fromData.key,
                    "to": newNodeData.key,
                    "fromPort": fromData.key, // fromData['site'],
                    "toPort": newNodeData.key, // fromData['site'] == 'R' ? "L" : "R",
                    noDelete: false
                });
                 epoint.execute("createEasyJobHop", '',[fromData.key,newNodeData.key], function(msg) {
                    if(msg != '1'){
                        epoint.alert(msg, '', null, 'warning');
                    }
                });

            }, 200);
            return false;
        }
    },
    // 连续点击两个节点进行连线
    twoSpotLinkEvent: function (opt) {
        var fromData = opt.arr[0],
            toData = opt.arr[1];

        myDiagram.model.addLinkData({
            "from": fromData.part.data.key,
            "to": toData.part.data.key,
            "fromPort": fromData.part.data.key, //fromData['site'],
            "toPort": toData.part.data.key //toData['site']
        });

        cacheLinkArr = [];
    }
}