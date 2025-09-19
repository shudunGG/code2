    <div id="workflowopinion_txt" class="opinion-main">
    	<div class="opinion-container">
    		<div class="opiniontextdiv">
				<textarea class="textareacontent" maxLength="500" id="workflowopinion_content"></textarea>
			</div>
			<div class="add-myopinion" id="workflowopinion_addmyopinion">
				<input type="checkbox" class="step-chk" /><span>添加到我的意见模版</span>
			</div>
    	</div>
    	<div class="opiniontemplate-container">
    		<div class="opiniontmpl-tab" id="opinionTmplTab">
				<div class="opiniontmpl-tab-hd" data-role="head">
					<span data-role="tab" data-target="tab1">公共意见模版</span> 
					<span data-role="tab" data-target="tab2">我的意见模版</span>
				</div>
				<div class="opiniontmpl-tab-bd" data-role="body">
					<div data-role="tab-content" data-id="tab1" id="commonopinionlist"></div>
					<div data-role="tab-content" data-id="tab2" id="useropinionlist"></div>
				</div>
			</div>
		</div>
    </div>
    
    <div id="workflowopinion_datagrid" class="mini-datagrid" sortOrder="desc" 
		idField="opinionguid"
		style="width: 100%;" showPager="false" showCellTip="true">
		<div property="columns">
			<div type="indexcolumn" headerAlign="center" width="50">
				序
			</div>
			<div field="activityname" width="100" align="center"  headerAlign="center">
				步骤
			</div>
			<div field="addusername" width="150" align="center"  headerAlign="center">
				反馈人
			</div>
			<div field="opiniondate" width="200" dateFormat="yyyy-MM-dd HH:mm:ss" align="center"  headerAlign="center">
				反馈时间
			</div>
			<div field="opiniontext" width="100%" align="center"  headerAlign="center">
				反馈意见
			</div>
		</div>
	</div>