    <div id="workflowopinion_txt" class="opinion-main">
    	<div class="opinion-container">
    		<div class="opiniontextdiv">
				<textarea class="mini-textarea" height="100%" width="100%" maxLength="500" id="workflowopinion_content"></textarea>
			</div>
			<div class="add-myopinion" id="workflowopinion_addmyopinion">
				<span class="add-myopinion-row fui-color-hover"><i class="action-icon icon-addcircle "></i>添加到我的意见模版</span>
			</div>
    	</div>
    	<div class="opiniontemplate-container">
    		<div class="mini-tabs" height="100%" id="opinionTmplTab">
				<div title="公共意见模版" >
					<div id="commonopinionlist" class="mini-listbox" showCheckBox="true" multiSelect="true" textField="opiniontext" valueField="opinionguid"></div>
				</div>
				<div title="我的意见模版" >
					<div id="useropinionlist" class="mini-listbox" showCheckBox="true" multiSelect="true" textField="opiniontext" valueField="opinionguid"></div>
				</div>
			</div>
		</div>
    </div>
    
    <div id="workflowopinion_datagrid" class="mini-datagrid" sortOrder="desc" 
		idField="opinionguid"
		style="width: 100%;" showPager="false" showCellTip="true">
		<div property="columns">
			<div type="indexcolumn"  width="50" align="left">
				序
			</div>
			<div field="activityname" width="100">
				步骤
			</div>
			<div field="addusername" width="150">
				反馈人
			</div>
			<div field="opiniondate" width="200" dateFormat="yyyy-MM-dd HH:mm:ss">
				反馈时间
			</div>
			<div field="opiniontext" width="100%">
				反馈意见
			</div>
		</div>
	</div>