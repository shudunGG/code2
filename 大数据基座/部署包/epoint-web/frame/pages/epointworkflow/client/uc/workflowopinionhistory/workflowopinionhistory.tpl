    <div id="{{controlId}}_datagrid" class="mini-datagrid" sortOrder="desc" 
		idField="opinionguid"
		style="width: 100%;" showPager="false" showCellTip="true">
		<div property="columns">
			<div type="indexcolumn" headerAlign="left" width="50" align="left">
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
			<div field="opiniontext" width="100%" >
				反馈意见
			</div>
		</div>
	</div>